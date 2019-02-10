const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    
    // verificacao de usuario e senha hardcoded APENAS para simulacao da autenticacao
    if (!(usuario === 'sanar' && senha === 'sanar')) {
        const error = new Error('Usuario e senha incorretos');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            usuario: usuario
        },
        'desafiosanar',
        { expiresIn: '5h' }
    );
    res.status(200).json({ token: token, usuario: usuario });

};
