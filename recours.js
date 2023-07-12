const express = require('express')
const app = express()
const { Router } = require('express');
var session = require('express-session');
var flush = require('connect-flash');
const router = Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const fs = require('fs');
const recherche = require('./recherchedossier')
const recherchematricule = recherche.recherchematricule
const points = require('./attribuspoints')
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flush());
/// Fonction qui relie le browzer avec la page HTML /// 

router.get('/recours', checkAuthenticated, auth, function(req, res) {
    res.render('recours.ejs', { message: req.flash('message'), name: req.user.nom, firstname: req.user.prenom });
});

function modifier(filename, newValue, indince) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    persons[indince].Recours.cause = newValue[0]; // then it gonna put the newValue in validation attribute form the person who correspond to the indice
    persons[indince].Recours.date = newValue[1];
    persons[indince].Recours.heure = newValue[2];
    persons[indince].Recours.num_recours = newValue[3];
    persons[indince].Recours.accuse = newValue[4];
    persons[indince].Recours.valider_recours = newValue[5];
    persons[indince].Recours.rec = newValue[6];
    fs.writeFile(filename, JSON.stringify(persons, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log(' file sucessfully written ! ');
        }
    })
}

/// Fonction qui recupere les entrees du formulaire et les placer dans un fichier.json ///
router.post('/recours', urlencodedParser, async function(req, res) {
    // req.body ( nom - prenom - date naissance - num de dossier ) pour la recherche d'indice //
    var table = [];
    var matricule;
    let r = 0;
    let re = 0;
    var indice;
    let accuse = 'En_attente';
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let date = today.getDate();
    let ladate = `${date}/${month}/${year}`;

    let heure = points.ajouterZero(today.getHours());
    let minutes = points.ajouterZero(today.getMinutes());
    let secondes = points.ajouterZero(today.getSeconds());
    let lheure = `${heure}:${minutes}:${secondes}`;
    var persons = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].Dossier_Complet === true) {
            if (persons[i].Recours.rec === true) {
                r = r + 1;
            }
        }
    }
    re = ajouterZero(r);
    numeroR = 'R' + re + today.getFullYear();
    table[0] = req.body.Cause;
    table[1] = ladate;
    table[2] = lheure;
    table[3] = numeroR;
    table[4] = req.body.Accuse;
    table[5] = accuse;
    table[6] = true;
    matricule = req.body.matricule;
    indice = recherchematricule('./demandeurs.json', matricule)
    modifier('./demandeurs.json', table, indice)
    req.flash('message', 'Le recours a été bien enregistré.')
    res.redirect('/recours');
});

function auth(req, res, next) {
    if (req.user.profil === 'Admin' || req.user.profil === 'Valideur') {
        return next()
    }
    res.redirect('/profil')
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}
module.exports = router