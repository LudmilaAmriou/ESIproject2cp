const fs = require('fs');
const express = require('express');
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser')
const app = express()
var users = loadJSON('./users.json');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//DECLARATION DU FICHIER
function loadJSON(filename = '') {
    if (fs.existsSync(filename)) {
        return users = JSON.parse(fs.readFileSync(filename).toString());
    } else {
        return ''
    }
}
router.post('/recherche', checkAuthenticated, async function(req, res, next) {
    var table = users;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var selectvalidd = req.body.selectvalidd;
    if (req.body.selectvalidd === 'Editeur') {
        selectvalid = 'Editeur';
        selectvalid1 = 'tout';
        selectvalid2 = 'Valideur';
        table = rechercheGlobale(table, nom, prenom, selectvalidd);
    } else if (req.body.selectvalidd === 'tout') {
        selectvalid = 'tout';
        selectvalid1 = 'Editeur';
        selectvalid2 = 'Valideur';
        table = rechercheGlobale(table, nom, prenom, selectvalidd);
    } else {
        selectvalid = 'Valideur';
        selectvalid1 = 'Editeur';
        selectvalid2 = 'tout';
        table = rechercheGlobale(table, nom, prenom, selectvalidd);

    }
    res.render('show.ejs', { title: 'tableau', table, nom, prenom, selectvalidd, selectvalid, selectvalid1, selectvalid2 });
});


function rechercheGlobale(array, nom = '', prenom = '', profil = '') {
    var tab = new Array()
    for (var i = 0; i < array.length; i++) {
        if (array[i].profil === profil) {
            if (((array[i].nom === nom) || (nom === '')) && ((array[i].prenom === prenom) || (prenom === ''))) {
                tab.push(array[i])
            }

        } else if (profil === 'tout') {
            if (((array[i].nom === nom) || (nom === '')) && ((array[i].prenom === prenom) || (prenom === ''))) {
                tab.push(array[i])
            }
        }
    }
    return tab;
}



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/connecter')
}

module.exports = router