const axios = require('axios');
const { validationResult } = require('express-validator/check');

const { URL_API, SECRET_KEY } = require('../util/config');

const Plano = require('../models/plano');


exports.postCriarPlano = async (req, res, next) => {
    // Validacao dos dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Falha na validação. Dados incorretos ou incompletos." });
        // const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        // error.statusCode = 422;
        // throw error;
    }

    // obtem dados do plano
    const nome = req.body.nome;
    const intervalo = req.body.intervalo;
    const quantidadeIntervalo = req.body.quantidade_intervalo;
    const precoMinimo = req.body.preco_minimo;
    const diasTrial = req.body.dias_trial;
    const modoPagamento = req.body.modo_pagamento;
    const metadata = req.body.metadata;
    let items = req.body.items;
    items = items.map(item => ({
        name: item.nome,
        ...(item.ciclos && { cycles: item.ciclos }),
        quantity: item.quantidade,
        pricing_scheme: {
            price: item.preco
        }
    })
    );

    try {
        // monta objeto para envio
        const dados = {
            name: nome,
            currency: "BRL",
            interval: intervalo,
            interval_count: quantidadeIntervalo,
            billing_type: "prepaid",
            minimum_price: precoMinimo,
            trial_period_days: (diasTrial === 0 ? null : diasTrial),
            payment_methods: modoPagamento,
            items: [...items],
            metadata: metadata
        };

        const planoApi = await Plano.findOne({ url: metadata.id })
        if (planoApi) {
            return res.status(400).json({ message: "Plano já cadastrado." });
        }

        // criar plano na mundiPagg
        const result = await axios.post(URL_API + '/plans',
            {
                ...dados
            }, {
                auth: {
                    username: SECRET_KEY,
                    password: ''
                }
            });

        // insere plano no banco de dados local
        const plano = new Plano({
            nome: result.data.name,
            url: result.data.metadata.id,
            planId: result.data.id
        });
        await plano.save();

        res.status(200).json({
            message: "Plano criado.",
            result: result.data
        })

    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ message: "Plano já existente" });
        }
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}