const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assinaturaSchema = new Schema({
    subscription: {
        type: String,
        required: true
    },
    cliente: {
        customer_id: String,
        email: String
    },
    plano: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Assinatura', assinaturaSchema);