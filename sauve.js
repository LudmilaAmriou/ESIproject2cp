var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');
const { resolve } = require('path');
const LocalStrategy = require('passport-local').Strategy
var app = express();
var tableau = [];
var infos = {};
let i = 0;
app.set('view engine', 'ejs');
/// Fonction lecture d'un fichier JSON avec le nom 'filename' ///
function loadJSON(filename = '') {
    if (fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename).toString());
    } else {
        return '';
    }

}
/// Lecture des deux fichier : profil et users ///
function sauvegarder(filename, data) {
    var ancienData = loadJSON(filename);
    /// Inserer le nouveau objet profil dans le fichier users ///
    ancienData.push(data);
    /// Inserer les anciens objets dans le fichier users ///
    fs.writeFileSync(filename, JSON.stringify(ancienData, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('file sucessfully written ');
        }
    })
}

module.exports = sauvegarder