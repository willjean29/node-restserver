const jwt = require('jsonwebtoken');

// =========================
// Verificar Token
// =========================

let verificarToken = (req,res,next) => {
    let token = req.get('token'); 

    jwt.verify(token,process.env.SEED,(err,decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

};

// =========================
// Verificar Admin
// =========================

let verificaAdmin = (req,res,next) => {
    let usuario = req.usuario;

    if(usuario.role == "ADMIN_ROLE"){
        next();
        return;
    }

    res.json({
        ok: false,
        err: {
            message: 'El usuario no es administrador'
        }
    });

}

let verificarTokenImg = (req,res,next) => {
    let token = req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}


module.exports = {
    verificarToken,
    verificaAdmin,
    verificarTokenImg  
};