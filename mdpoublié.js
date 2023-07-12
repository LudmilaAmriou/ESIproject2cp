if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
var nodemailer = require('nodemailer')


function envoimail(util, code) {
    var config = {
        name: 'SMTP_HOST',
        service: 'gmail',
        port: 3000,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);
    if (util != null) {
        var mailOptions = {
            from: 'Admin',
            to: util.email,
            subject: 'Réinitialisation du mot de passe',
            text: 'Veuillez vous connecter à votre compte en utilisant ce code comme mot de passe  : ' + code + "\n\nN 'oubliez pas de changer votre mot de passe apres la connexion.\nCordialement."
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {

                console.log(error);
                return false

            } else {
                console.log('Email envoyé: ' + info.response);
                return true;
            }
        });
    }
}
module.exports = envoimail