if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///
const express = require('express')
const app = express()
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt')
var session = require('express-session');
var flush = require('connect-flash');
const methodOverride = require('method-override')
const sauve = require('./sauvegarder')
let myObject = {};
const user = []; //pour storer l'objet créé car on est en mode sync si on ne garde pas l'objet, on le perd.
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flush());
app.use(methodOverride('_method')) //pour pouvoir relier entre le node.js et l 'ejs
    /// Fonctions qui relie le browser avec la page HTML /// 

router.get('/comptes', checkAuthenticated, auth, (req, res) => {
        res.render('Creercomptes.ejs', { message: req.flash('message') })
    })
    /// Fonction qui recupere les entrees du formulaire et les place dans un fichier.json ///

router.post('/comptes', async(req, res) => { //on a pas besoin d'etre identifier avant de creer un compte.

    const hashedPassword = await bcrypt.hash(req.body.mdp, 10) //pour le hachage des mots de passes 
        ///garder les données du formulaire dans le tableau ///
    user.push(myObject = {

        id: Date.now().toString(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
        mdp: hashedPassword,
        profil: req.body.profil
    });
    sauve('./users.json', myObject)
    req.flash('message', 'Le compte a été créé avec succès');
    res.redirect('/comptes')
})

//Authetification functions ( identifications ): elles servent a bloqué et a debloqué les sites dont on veut acceder ( nous limiter )
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}

function auth(req, res, next) {
    if (req.user.profil === 'Admin') {
        return next()
    }
    res.redirect('/profil')
}
module.exports = router;