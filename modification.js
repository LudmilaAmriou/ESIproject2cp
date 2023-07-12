if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///


const fs = require('fs')


function recherche(persons, email) {
    //var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].email === email) {
            return i;
        }
    }
}

function modification(persons, email, newValue) {
    i = recherche(persons, email)
    persons[i].mdp = newValue
}

module.exports = modification