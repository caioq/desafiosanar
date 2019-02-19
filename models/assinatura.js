const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assinaturaSchema = new Schema({
    subscription: {
        type: String,
        required: true
    },
    cliente: {
        customerId: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    plano: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Assinatura', assinaturaSchema);