const fs = require('fs')


function rechercheGlobale(array, nom = '', prenom = '', matricule = '', etat = '') {
    var tab = new Array();
    if (etat === 'Validé') {
        etat = true
    } else {
        etat = false
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].Valider === etat) {
            if (((array[i].Etat_Civil.matricule === matricule) || (matricule === '')) && ((array[i].Etat_Civil.nom === nom) || (nom === '')) && ((array[i].Etat_Civil.prenom === prenom) || (prenom === ''))) {
                tab.push(array[i])
            }
        } else if (etat === 'tout') {
            if (((array[i].Etat_Civil.matricule === matricule) || (matricule === '')) && ((array[i].Etat_Civil.nom === nom) || (nom === '')) && ((array[i].Etat_Civil.prenom === prenom) || (prenom === ''))) {
                tab.push(array[i])
            }
        }
    }
    return tab;
}

function recherchematricule(filename, matricule) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].Etat_Civil.matricule === matricule) {
            return i;
        }
    }
}

module.exports = { recherchematricule, rechercheGlobale }