const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartaoSchema = new Schema({
    bandeira: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    expiracaoMes: {
        type: Number,
        required: true
    },
    expiracaoAno: {
        type: Number,
        required: true
    },
    nomePortador: {
        type: String,
        required: true
    },
    codeSeguranca: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Cartao', cartaoSchema);