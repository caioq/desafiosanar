const axios = require('axios');
const { validationResult } = require('express-validator/check');

const { URL_API, SECRET_KEY } = require('../util/config');

const Assinatura = require('../models/assinatura');


exports.postCriarAssinatura = (req, res, next) => {
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

    // obtem id do plano - solucao alternativa consultar banco de integracao para obter id do plano
    const plano = req.params.plano;
    let planoId;
    switch (plano) {
        case 'plano-mensal':
            planoId = 'plan_zrQaY0V2uNuPyP2O';
            break;
        case 'plano-mensal-7':
            planoId = 'plan_m6GgzM6tAS30qAv8';
            break;
        case 'plano-trimestral':
            planoId = 'plan_bjRQn6MI6NUM7JmM';
            break;
        case 'plano-mensal-yellowbook':
            planoId = 'plan_9kenwG3H94fXnLEw';
            break;
    }
    if (!planoId) {
        const error = new Error('Plano inválido.');
        error.statusCode = 422;
        throw error;
    }

    // monta objeto para envio
    const dados = {
        plan_id: planoId,
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
    if (req.body.cliente_id) {
        // cliente já possui cadastro
        console.log('Cliente já possui cadastro');
        // obtem cliente id
        clienteId = req.body.cliente_id;
    } else {
        // cliente novo
        // obtem dados do cliente
        const nomeCliente = req.body.cliente.nome;
        const emailCliente = req.body.cliente.email;
        cliente = {
            name: nomeCliente,
            email: emailCliente
        };
    }
    //console.log(dados);

    // criar assinatura
    axios.post(URL_API + '/subscriptions',
        {
            ...dados,
            customer: cliente,
            customer_id: clienteId
        }, {
            auth: {
                username: SECRET_KEY,
                password: ''
            }
        }).then(result => {
            console.log("Assinatura criada no mundipagg.");
        
            res.status(200).json({
                message: "Assinatura criada.",
                resultado: result.data
            });
        }) 
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

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
    
    if(assinatura.data.status === "canceled") return res.status(400).json({message: "Assinatura cancelada."});

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

exports.deleteCancelarAssinatura = (req, res, next) => {
    //validacao
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        error.statusCode = 422;
        throw error;
    }
    
    // obtem assinatura
    const assinaturaId = req.body.subscription_id;
    // apaga assinatura na api mundipagg
    axios.delete(URL_API + '/subscriptions/' + assinaturaId,
        {
            auth: {
                username: SECRET_KEY,
                password: ''
            }
        }).then(result => {
            console.log('Assinatura cancelada.');
            res.status(200).json({
                message: "Assinatura cancelada.",
                resultado: result.data
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}