const express = require('express')
const app = express()
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const fs = require('fs');
const scraper = require('table-scraper');
const rech = require('./recherchedossier')
const rechercheGlobale = rech.rechercheGlobale
var demandeurs = loadJSON('./demandeurs.json');
app.set('view engine', 'ejs')
var i
    /// Fonction qui relie le browzer avec la page HTML /// 

function loadJSON(filename = '') {
    if (fs.existsSync(filename)) {
        return demandeurs = JSON.parse(fs.readFileSync(filename).toString());
    } else {
        return ''
    }
}
router.get('/listeRec', checkAuthenticated, auth, (req, res) => {
    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    nom = "";
    prenom = "";
    matricule = "";
    selectvalidd = "";
    selectvalid = "tout";
    selectvalid1 = "validé";
    selectvalid2 = "Non validé";
    res.render('listeRec.ejs', { title: 'tableau', table, nom, prenom, matricule, selectvalidd, selectvalid, selectvalid1, selectvalid2 });
});
router.post('/listeRec', checkAuthenticated, auth, async function(req, res) {
    var table = demandeurs;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var matricule = req.body.matricule;
    var selectvalidd = req.body.selectvalidd;
    if (req.body.selectvalidd == 'Validé') {
        selectvalid = 'Validé';
        selectvalid1 = "tout";
        selectvalid2 = "Refusé";
        table = rechercheGlobale(table, nom, prenom, matricule, selectvalidd);
    } else if (req.body.selectvalidd == 'tout') {
        selectvalid = "tout";
        selectvalid1 = "Validé";
        selectvalid2 = "Refusé";
        table = rechercheGlobale(table, nom, prenom, matricule, selectvalidd);
    } else {
        selectvalid = "Refusé";
        selectvalid1 = "Validé";
        selectvalid2 = "tout";
        table = rechercheGlobale(table, nom, prenom, matricule, selectvalidd);

    }
    res.render('listeRec.ejs', { title: 'tableau', table, nom, prenom, matricule, selectvalidd, selectvalid, selectvalid1, selectvalid2 });
})
router.get('/listeDemandeurs', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('listeDemandeurs.ejs', { title: 'tableau', table });
});


router.get('/listeDoComplets', checkAuthenticated, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('listeDoComplets.ejs', { title: 'tableau', table });
});

router.get('/listeDoIncomplets', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('listeDoIncomplets.ejs', { title: 'tableau', table });
});


router.get('/listeValidation', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('listeValidation.ejs', { title: 'tableau', table });
});
router.get('/archiveDossier', checkAuthenticated, auth, function(req, res) {
    res.render('archiveDossier.ejs', { qs: req.query });
});


function auth(req, res, next) {
    if (req.user.profil === 'Admin') {
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