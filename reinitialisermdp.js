if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///
const express = require('express')
const app = express()
const { Router } = require('express');
const router = Router();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view-engine', 'ejs')
const users = require('./users.json')
const mail = require('./mdpoublié')
const fs = require('fs')
var session = require('express-session');
var flush = require('connect-flash');
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flush());

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
var code = between(1000, 9999).toString()
router.get('/reinitialiser', checkNotAuthenticated, (req, res) => {
    res.render('mdpoublie.ejs', {
        message: req.flash('message')
    })
})

router.post('/reinitialiser', checkNotAuthenticated, urlencodedParser, async function(req, res) {
    const util = users.find(user => user.email === req.body.email) || null

    if (util != null) {


        fs.writeFileSync('./profil.json', JSON.stringify(code, null, 2), err => {
            if (err) {
                console.log(err)
            } else {
                console.log('bien ecrit')
            }
        })
        mail(util, code)
        res.redirect('/success')
    } else {
        req.flash('message', 'Utilisateur introuvable');
        res.redirect('/reinitialiser');

    }

})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profil')
    }
    next()
}
module.exports = { router, code }