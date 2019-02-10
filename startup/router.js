const bodyParser = require('body-parser');

const assinaturaRoutes = require('../routes/assinatura');
const authRoutes = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Contenty-Type, Authorization');
        next();
    });

    // Rotas
    app.use('/assinatura', assinaturaRoutes);
    app.use('/auth', authRoutes);
    app.use(error);
}
