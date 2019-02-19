const express = require('express');
const { body, check, oneOf } = require('express-validator/check');

const planoController = require('../controllers/plano');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /plano
router.post('', isAuth, [
    check('nome').isLength({ max: 64 }),
    check('items').exists(),
], planoController.postCriarPlano);

module.exports = router;