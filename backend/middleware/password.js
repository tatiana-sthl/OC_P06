const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, {message : 'Mot de passe invalide, sont requis : 8 caractères minimum, au moins une majuscule et une minuscule, sans espaces'}, 
        {"content-type" : "application/json"});

        res.end("Ce format de mot de passe est invalide");
    }
    else {
        next();
    }
};