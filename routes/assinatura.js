const express = require('express');
const { body } = require('express-validator/check');

const assinaturaController = require('../controllers/assinatura');

const router = express.Router();

// POST /assinatura/criar-assinatura
router.post('/criar-assinatura', [
    //body('cliente.nome').isEmpty(),
    //body('cliente.email').isEmail().normalizeEmail()
],assinaturaController.postCriarAssinatura);

// PATCH /assinatura/alterar-cartao
router.patch('/alterar-cartao', assinaturaController.patchAlterarCartaoAssinatura);


module.exports = router;