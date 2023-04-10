const passwordValidator = require('password-validator'); 

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) 
.is().max(40) 
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.is().not().oneOf(["Password", "Pwd", "Password123", "Pwd123", "AZERTY", "QWERTY"]);


module.exports = passwordSchema;
