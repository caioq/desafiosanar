const express = require('express');
const { body } = require('express-validator/check');

const assinaturaController = require('../controllers/assinatura');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /assinatura/:plano
router.post('/:plano', isAuth, [
    //body('cliente.nome').trim().not().isEmpty(),
    //body('cliente.email').isEmail().normalizeEmail()
],assinaturaController.postCriarAssinatura);

// PATCH /assinatura/alterar-cartao
router.patch('/alterar-cartao', isAuth, assinaturaController.patchAlterarCartaoAssinatura);

// DELETE /assinatura/cancelar
router.delete('/cancelar', isAuth, assinaturaController.deleteCancelarAssinatura);


module.exports = router;