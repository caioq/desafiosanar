const axios = require('axios');
const { validationResult } = require('express-validator/check');

const { URL_API, SECRET_KEY } = require('../util/config');

const Assinatura = require('../models/assinatura');
const Plano = require('../models/plano');


exports.postCriarAssinatura = async (req, res, next) => {
    // Validacao dos dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        error.statusCode = 422;
        throw error;
    }

    // obtem dados do cartao
    const nomeCartao = req.body.cartao.nome_cartao;
    const numeroCartao = req.body.cartao.numero;
    const expiracaoMes = req.body.cartao.expiracao_mes;
    const expiracaoAno = req.body.cartao.expiracao_ano;
    const cvv = req.body.cartao.cvv;

    try {
        // obtem id do plano
        const planoUrl = req.params.plano;
        const plano = await Plano.findOne({ url: planoUrl });
        if (!plano) {
            return res.status(400).json({ message: "Plano não encontrado." });
        }

        // monta estrutura para envio
        const dados = {
            plan_id: plano.planId,
            payment_method: "credit_card",
            card: {
                number: numeroCartao,
                holder_name: nomeCartao,
                exp_month: expiracaoMes,
                exp_year: expiracaoAno,
                cvv: cvv
            }
        };
        // verifica se o cliente é novo
        let cliente = null;
        let clienteId;
        let nomeCliente;
        let emailCliente;
        if (req.body.cliente_id) {
            // obtem cliente id
            clienteId = req.body.cliente_id;
        } else {
            // obtem nome e email do cliente
            nomeCliente = req.body.cliente.nome;
            emailCliente = req.body.cliente.email;
            cliente = {
                name: nomeCliente,
                email: emailCliente
            };
        }

        // verifica se cliente ja possui assinatura no banco de integracao
        const assinaturaApi = await Assinatura.findOne({
            $or: [
                { 'cliente.customerId': clienteId },
                { 'cliente.email': emailCliente }
            ]
        });
        if (assinaturaApi) {
            // confirma se possui assinatura na mundipagg
            const assinaturaMundi = await axios.get(URL_API + '/subscriptions/' + assinaturaApi.subscription,
                {
                    auth: {
                        username: SECRET_KEY,
                        password: ''
                    }
                });
            if (assinaturaMundi.status === 200) {
                // cliente ja possui assinatura
                return res.status(400).json({
                    message: "Cliente já possui assinatura.",
                    resultado: assinaturaMundi.data
                });
            }
        }

        // criar assinatura na mundipagg
        const resultado = await axios.post(URL_API + '/subscriptions',
            {
                ...dados,
                customer: cliente,
                customer_id: clienteId
            }, {
                auth: {
                    username: SECRET_KEY,
                    password: ''
                }
            });
        console.log("Assinatura criada no mundipagg.");

        // salvar assinatura no bd de integracao
        const assinatura = new Assinatura({
            subscription: resultado.data.id,
            plano: resultado.data.plan.id,
            cliente: {
                customerId: resultado.data.customer.id,
                email: resultado.data.customer.email
            }
        });
        const novaAssinatura = await assinatura.save();

        res.status(200).json({
            message: "Assinatura criada.",
            resultado: resultado.data
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.patchAlterarCartaoAssinatura = async (req, res, next) => {
    // validacao
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        error.statusCode = 422;
        throw error;
    }

    // obtem assinatura
    const assinaturaId = req.body.subscription_id;
    // obtem dados do cartao
    const nomeCartao = req.body.cartao.nome_cartao;
    const numeroCartao = req.body.cartao.numero;
    const expiracaoMes = req.body.cartao.expiracao_mes;
    const expiracaoAno = req.body.cartao.expiracao_ano;
    const cvv = req.body.cartao.cvv;

    const assinatura = await axios.get(URL_API + '/subscriptions/' + assinaturaId, {
        auth: {
            username: SECRET_KEY,
            password: ''
        }
    });
    // verifica se a assinatura deste cartao esta ativo
    if (assinatura.data.status === "canceled") return res.status(400).json({ message: "Esta assinatura está cancelada." });

    // altera cartao na api do mundipagg
    axios.patch(URL_API + '/subscriptions/' + assinaturaId + '/card',
        {
            card: {
                number: numeroCartao,
                holder_name: nomeCartao,
                exp_month: expiracaoMes,
                exp_year: expiracaoAno,
                cvv: cvv
            }
        }, {
            auth: {
                username: SECRET_KEY,
                password: ''
            }
        }).then(result => {
            console.log('Cartao alterado.');
            res.status(200).json({
                message: "Cartao alterado.",
                resultado: result.data
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.deleteCancelarAssinatura = async (req, res, next) => {
    //validacao
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        error.statusCode = 422;
        throw error;
    }

    try {
        // obtem assinatura
        const assinaturaId = req.body.subscription_id;

        // apaga assinatura no banco de integracao
        await Assinatura.deleteOne({ subscription: assinaturaId });

        // apaga assinatura na api mundipagg
        const assinaturaCancelada = await axios.delete(URL_API + '/subscriptions/' + assinaturaId,
            {
                auth: {
                    username: SECRET_KEY,
                    password: ''
                }
            });

        console.log('Assinatura cancelada.');
        res.status(200).json({
            message: "Assinatura cancelada.",
            resultado: assinaturaCancelada.data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}