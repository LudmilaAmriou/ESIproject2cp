const express = require('express');
const { Router } = require('express');
const router = Router();
var fs = require('fs');
var app = express();
app.set('view engine', 'ejs');
//ce npm nous permet de trier un tableau json suivant un certain ordre 
let demandeurs = require('./demandeurs2.json');
//cette fonction nous permet de faire le trie d'un tableau suivant un ordre précis 
function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
//on fait le tri d'un tableau suivant les nombrepoints attribués à chaque personne 
var table = demandeurs.sort(GetSortOrder("nombrepoints")); //Pass the attribute to be sorted on
fs.writeFile('classement.json', JSON.stringify(table, null, 3), err => {
    if (err) {
        console.log(err);
    } else {
        console.log('file sucessfully written ');
    }
})
router.get('/classement_f', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('classement.json', 'utf8'));
    res.render('classement_f.ejs', { title: 'tableau', table });
});

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
}
module.exports = router