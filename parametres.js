const fs = require('fs');
const router = require('express').Router();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var array = loadJSON('./users.json');
var session = require('express-session')
var flash = require('connect-flash');
app.set('view engine', 'ejs');
sauve = require('./sauve')
rech = require('./rechercheprofils')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
router.get('/param', checkAuthenticated, auth, (req, res) => {
    res.render('param.ejs')
})

router.get('/delete', checkAuthenticated, auth, (req, res) => {
        res.render('delete')
    })
    /*app.get('/redirection',(req,res)=>{
        res.render('fenetre.ejs');
    });*/
router.post('/delete', urlencodedParser, checkAuthenticated, auth, async function(req, res) {
    console.log(req.body.done);
    var removeUser = req.body.done;
    array = array.filter(user => { return user.nom !== removeUser });
    saveJSON('users.json', array)
    res.redirect('/users');
})

router.get('/users', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    nom = "";
    prenom = "";
    matricule = "";
    selectvalidd = "";
    selectvalid = "tout";
    selectvalid1 = "Editeur";
    selectvalid2 = "Valideur";
    res.render('show.ejs', { title: 'tableau', table, nom, prenom, selectvalidd, selectvalid, selectvalid1, selectvalid2 });
});
router.use(rech)
router.post('/users', urlencodedParser, checkAuthenticated, auth, async function(req, res) {
    var i = rechercheid(req.body.done, array)
    nom = array[i].nom;
    prenom = array[i].prenom;
    email = array[i].email;
    res.redirect('/param')
    console.log(nom)
    router.post('/param', urlencodedParser, checkAuthenticated, auth, async(req, res) => {
        res.json(req.body)
        if (req.body.nom != "") {
            console.log(nom)
            modifiernom(nom, req.body.nom, array)
        }
        if (req.body.prenom != "") {
            modifierprenom(prenom, req.body.prenom, array)
        }
        if (req.body.email != "") {
            modifieremail(email, req.body.email, array)
        }
        saveJSON('users.json', array)
        res.redirect('/users')
        res.end();
    })

    //i = recherchematricule('profiles.json',req.body.done); // recherche par id f fichier profiles 
    ;
});
//DECLARATION DU FICHIER
function loadJSON(filename = '') {
    if (fs.existsSync(filename)) {
        return demandeurs = JSON.parse(fs.readFileSync(filename).toString());
    } else {
        return ''
    }
}

function recherchenom(nom, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].nom === nom) {
            return i;
        }
    }
}

function rechercheid(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
}

function rechercheprenom(prenom, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].prenom === prenom) {
            return i;
        }
    }
}

function modifiernom(oldvalue, newvalue, array) {
    var i = recherchenom(oldvalue, array)
    array[i].nom = newvalue
}

function modifierprenom(oldvalue, newvalue, array) {
    var i = rechercheprenom(oldvalue, array)
    array[i].prenom = newvalue
}

function rechercheemail(email, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].email === email) {
            return i;
        }
    }
}

function modifieremail(oldvalue, newvalue, array) {
    var i = rechercheemail(oldvalue, array)
    array[i].email = newvalue
}

function modifiermotdepasse(oldvalue, newvalue, array) {
    var i = recherchenom(oldvalue, array)
    array[i].mdp = newvalue
}

function saveJSON(filename = '', json = '""') {
    return fs.writeFileSync(filename,
        JSON.stringify(json, null, 2))
}

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
module.exports = router