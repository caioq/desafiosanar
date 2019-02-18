const axios = require('axios');
const { validationResult } = require('express-validator/check');

const { URL_API, SECRET_KEY } = require('../util/config');

const Plano = require('../models/plano');


exports.postCriarPlano = (req, res, next) => {
    // Validacao dos dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Falha na validação. Dados incorretos ou incompletos.');
        error.statusCode = 422;
        throw error;
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

    // criar plano na mundiPagg
    axios.post(URL_API + '/plans',
        {
            ...dados
        }, {
            auth: {
                username: SECRET_KEY,
                password: ''
            }
        }).then(result => {
            const plano = new Plano({
                nome: result.data.name,
                url: result.data.metadata.id,
                planId: result.data.id
            })
            return plano.save();
        }).then(result => {
            res.status(200).json({
                message: "Plano criado.",
                result: result
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}