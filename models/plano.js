const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const planoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        index: true
    },
    planId: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Plano', planoSchema);