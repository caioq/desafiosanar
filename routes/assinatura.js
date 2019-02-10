const express = require('express');
const { body, check, oneOf } = require('express-validator/check');

const assinaturaController = require('../controllers/assinatura');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /assinatura/:plano
router.post('/:plano', isAuth, [
    check('cartao.numero').isLength({ min: 13, max: 19 }),
    check('cartao.nome_cartao').isLength({ max: 64 }),
    check('cartao.expiracao_mes').isNumeric(),
    check('cartao.expiracao_ano').isNumeric(),
    check('cartao.cvv').isLength({ min: 3, max: 4 })
], assinaturaController.postCriarAssinatura);

// PATCH /assinatura/alterar-cartao
router.patch('/alterar-cartao', isAuth, [
    check('subscription_id').exists(),
    check('cartao.numero').isLength({ min: 13, max: 19 }),
    check('cartao.nome_cartao').isLength({ max: 64 }),
    check('cartao.expiracao_mes').isNumeric(),
    check('cartao.expiracao_ano').isNumeric(),
    check('cartao.cvv').isLength({ min: 3, max: 4 })
], assinaturaController.patchAlterarCartaoAssinatura);

// DELETE /assinatura/cancelar
router.delete('/cancelar', isAuth, [
    check('subscription_id').exists()
], assinaturaController.deleteCancelarAssinatura);


module.exports = router;