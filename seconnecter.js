if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
var bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { Router } = require('express');
const users = require('./users.json')
const router = Router();
const initializePassport = require('./mdpconfig')
const reinitialiser = require("./reinitialisermdp")
const code = reinitialiser.code
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view-engine', 'ejs')
app.disable('view cache');
router.use(express.urlencoded({ extended: false }))
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))
router.get('/connecter', checkNotAuthenticated, (req, res) => {
    initializePassport(
        passport,
        email => users.find(user => user.email === email),
        id => users.find(user => user.id === id), code)
    res.render('Seconnecter.ejs')
})

/// Fonction qui relie le browzer avec la page HTML /// 
router.post('/connecter', checkNotAuthenticated, urlencodedParser, passport.authenticate('local', {
    successRedirect: '/profil',
    failureRedirect: '/connecter',
    failureFlash: true

}))
router.get('/profil', checkAuthenticated, (req, res) => { //dans ce cas pour pouvoir acceder au compte il faut l'identification ( sinon on bloque le chemain )

    console.log(req.user.profil)
    if ((req.user.profil) === 'Admin') {
        return res.render('MenuAdmin.ejs', { name: req.user.nom, firstname: req.user.prenom })
    } else if ((req.user.profil) === 'Valideur') {
        return res.render('menuValideur.ejs', { name: req.user.nom, firstname: req.user.prenom })
    } else {
        return res.render('MenuEditeur.ejs', { name: req.user.nom, firstname: req.user.prenom });
    }

})

router.delete('/logout', (req, res) => {
    req.logOut();
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err)
            }
            console.log("Destroyed the user session on Auth0 endpoint");
            res.redirect('http://localhost:3000/connecter');
        });


    }
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profil')
    }
    next()
}

module.exports = router