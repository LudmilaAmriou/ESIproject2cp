if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///
const express = require('express')
const app = express()
const { Router } = require('express');
var session = require('express-session');
var flush = require('connect-flash');
const router = Router();
const modifier = require('./modificationdossier')
const modifierdem = modifier.modifier
const points = require('./attribuspoints')
const ajouterZero = points.ajouterZero
const responsabilité = points.responsabilité
const ageSituation = points.ageSituation
const droits = points.droits
const pointsGrade = points.pointsGrade
const conjointMesrs = points.conjointMesrs
const ancienneté = points.ancienneté
const fs = require('fs');
const recherche = require('./recherchedossier')
const recherchematricule = recherche.recherchematricule
app.set('view-engine', 'ejs')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.urlencoded({ extended: false }))
    /// les variables ///
var objectEtat = {};
var objetExperienceProffesionnelle = {};
var objetConjoit = {};
var objetDroits = {};
var objetRecours = {
    num_recours: {},
    cause: {},
    valider_recours: false,
    date: {},
    heure: {},
    accuse: {},
    rec: false,
};
var valider = false;
var dossierComplet = true;
var myObject = {};
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flush());
router.get('/saisie', checkAuthenticated, (req, res) => {
    res.render('PageSaisie.ejs', { message: req.flash('message'), qs: req.query })
});
router.post('/saisie', urlencodedParser, checkAuthenticated,
    async function(req, res) {

        var pts = 0

        var persons = JSON.parse(fs.readFileSync('./demandeurs.json', 'utf8'));
        i = recherchematricule("demandeurs.json", req.body.matricule);
        console.log(i)
        heureRecepetion = persons[i].heureReception;
        dateReception = persons[i].dateReception;
        objectEtat.Numerodossier = req.body.Numero_de_dossier;
        objectEtat.matricule = req.body.matricule;
        objectEtat.nom = req.body.Nom;
        objectEtat.prenom = req.body.Prenom;
        objectEtat.dateNaissance = req.body.Date_de_naissance;
        objectEtat.age = req.body.Age;

        /// attribut points : 
        pts = ageSituation(req.body) + pointsGrade(req.body.Grade) + droits(req.body) + responsabilité(req.body.choix_respo) +
            ancienneté(req.body) + conjointMesrs(req.body.choix_MESRS)
        console.log(pts)
        objectEtat.communeNaissance = req.body.Commune_de_naissance;
        objectEtat.wilaya = req.body.Wilaya;
        objectEtat.choixSexe = req.body.choix_sexe;

        objectEtat.Adresse = req.body.Adresse;
        objectEtat.NumeroTel = req.body.Numero_de_telephone;
        objectEtat.email = req.body.Email;
        objectEtat.codePostal = req.body.Code_postal;
        objectEtat.prenomPere = req.body.Prenom_du_pere;
        objectEtat.nomMere = req.body.Nom_mere;
        objectEtat.prenomMere = req.body.Prenom_mere;
        objectEtat.situation = req.body.Situation_familiale;
        objectEtat.nbEnfants = req.body.Nombre_enfants;



        objetExperienceProffesionnelle.ecole = req.body.Ecole;
        objetExperienceProffesionnelle.DireSer = req.body.Direction_Service;
        objetExperienceProffesionnelle.Grade = req.body.Grade;
        objetExperienceProffesionnelle.dateDins = req.body.Date_debut_installation;
        objetExperienceProffesionnelle.dateFins = req.body.Date_fin_installation;
        objetExperienceProffesionnelle.dateDhors = req.body.Date_debut_hors_secteur;
        objetExperienceProffesionnelle.dateFhors = req.body.Date_fin_hors_secteur;
        if (req.body.Responsabilite = '') {
            objetExperienceProffesionnelle.res = req.body.choix_respo;
        } else {
            objetExperienceProffesionnelle.res = req.body.Responsabilite;
        }



        objetConjoit.nom = req.body.Nom_conjoint;
        objetConjoit.prenom = req.body.Prenom_conjoint;
        objetConjoit.dateNaissance = req.body.Date_naissance_conjoint;
        objetConjoit.communeNaissance = req.body.Commune_naissance_conjoint;
        objetConjoit.wilaya = req.body.Wilaya_conjoint;
        objetConjoit.prenomPere = req.body.Prenom_pere_conjoint;
        objetConjoit.nomMere = req.body.Nom_mere_conjoint;
        objetConjoit.prenomMere = req.body.Prenom_mere_conjoint;
        objetConjoit.choixMesrs = req.body.choix_MESRS;

        objetDroits.moudjahid = req.body.choix_Moudjahid;


        objetDroits.chahid = req.body.choix_Chahid;
        objetDroits.chahid2 = req.body.choix_veufChahid;

        myObject.heureRecepetion = heureRecepetion;
        myObject.dateReception = dateReception;
        myObject.Etat_Civil = objectEtat;
        myObject.Experience_Professionnellle = objetExperienceProffesionnelle;
        myObject.Conjoint = objetConjoit;
        myObject.Droits = objetDroits;
        myObject.Recours = objetRecours;
        myObject.Valider = valider;
        myObject.Dossier_Complet = dossierComplet;
        //   myObject.points = points;

        modifierdem('./demandeurs.json', myObject, i);
        console.log(myObject)
        req.flash('message', 'Le demandeur est enregistré avec succès');
        res.redirect('/saisie');
        // res.send(`<h1> Dossier de recours : </h1> `)
    }
)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}

router.delete('/logout', (req, res) => {
    req.logOut();
    req.session.destroy()
    res.redirect('/connecter')

})

function auth(req, res, next) {
    if (req.user.profil === 'Editeur' || req.user.profil === 'Admin') {
        return next()
    }
    res.redirect('/profil')
}
module.exports = router