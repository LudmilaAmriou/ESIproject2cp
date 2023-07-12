/// I N I T I A L I S A T I O N ///
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///

const { Router } = require('express');
const router = Router();
const points = require('./attribuspoints')
const ajouterZero = points.ajouterZero
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const fs = require('fs');
const sauve = require('./sauve')
const personne = require('./personne')
    /// les variables ///
var objectEtat = {};
var objet = {};
var valider = false;
var dossierComplet = false;

router.get('/complet', checkAuthenticated, auth, (req, res) => {
    res.render('dossier_complet.ejs', { name: req.user.nom, firstname: req.user.prenom })
});
/// Fonction qui relie le browzer avec la page HTML /// 
router.get('/incomplet', checkAuthenticated, auth, (req, res) => {
    res.render('dossier_incomplet.ejs', { name: req.user.nom, firstname: req.user.prenom })
});
router.get('/archiver', checkAuthenticated, auth, (req, res) => {
    res.render('archiver.ejs', { name: req.user.nom, firstname: req.user.prenom })
});
router.get('/verifier', checkAuthenticated, auth, (req, res) => {
    res.render('Verification.ejs', { name: req.user.nom, firstname: req.user.prenom })
});

router.post('/verifier', urlencodedParser, checkAuthenticated, async function(req, res) {

    let nom = req.body.Nom;
    let annee = "";
    let mois = "";
    let jour = "";
    let numero = 0;
    let num = 0;
    let preson = req.body.Prenom;
    let date = req.body.Date_de_reception;
    let heure = req.body.Heure_de_depot;


    var persons = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    objectEtat.nom = req.body.Nom;
    objectEtat.prenom = req.body.Prenom;
    objectEtat.dateReception = req.body.Date_de_reception;
    objectEtat.heureReception = req.body.Heure_de_depot;
    numero = persons.length + 1;
    for (var i = 0; i < 4; i++) {
        annee = annee + req.body.Date_de_reception[i]
    }

    for (var i = 5; i < 7; i++) {
        mois = mois + req.body.Date_de_reception[i]
    }

    for (var i = 8; i < 10; i++) {
        jour = jour + req.body.Date_de_reception[i]
    }
    num = ajouterZero(numero);
    objectEtat.Numerodossier = num + annee;
    objectEtat.matricule = annee + mois + jour;

    objet.Etat_Civil = objectEtat;
    fs.writeFile('./personne.json', JSON.stringify(objet, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log(' file sucessfully written ! ');
        }
    })

    if (req.body.check.length == 11) {
        sauve('./demandeurs.json', objet);
        res.redirect('/complet');
    } else {
        res.redirect('/incomplet');
    }
})
router.post('/archiver', checkAuthenticated, urlencodedParser, async function(req, res) {
    personne.Valider = valider;
    personne.Dossier_Complet = dossierComplet;
    sauve('./demandeurs.json', personne);
    res.render('archiver.ejs')
})
router.delete('/logout', (req, res) => {
    req.logOut();
    res.clearCookie('mlcl');
    req.session.destroy()
    res.redirect('/connecter');

})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/connecter')
}

function auth(req, res, next) {
    if (req.user.profil === 'Editeur' || req.user.profil === 'Admin') {
        return next()
    }
    res.redirect('/profil')
}
module.exports = router