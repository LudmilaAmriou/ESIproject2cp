if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///
const express = require('express')
const app = express()
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt')
const fs = require('fs')
app.set('view-engine', 'ejs')
const users = require('./users.json')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var session = require('express-session');
var flush = require('connect-flash');
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flush());
router.get('/nouveaumdp', checkAuthenticated, (req, res) => {
    res.render('Newmdp.ejs', { message: req.flash('message') })
})
router.post('/nouveaumdp', checkAuthenticated, urlencodedParser, async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.mdp, 10)
    modification(users, req.user.email, hashedPassword) //le mot de passe doit etre hachuré
    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('bien ecrit')
        }
    })
    req.flash('message', 'Votre mot de passe a été modifié');
    res.redirect('/nouveaumdp')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}
module.exports = router