//les packages necessaires ///
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const users = require('./users.json');
const fs = require('fs');

function initialize(passport, getUserByEmail, getUserById, code) { //recuperer les donnnées introduites par l'utilisateur ( d'apres le web )
    const authenticateUser = async(email, password, done) => { //l'identifier ensuite si: 
        const user = getUserByEmail(email) //recuperer l'email
        if (user == null) {
            return done(null, false, { message: 'Utilisateur introuvable' }) //user n'existe pas donc on retourne faux
        }

        try {
            if (await bcrypt.compare(password, user.mdp) || password === code) {
                return done(null, user) //si le mot de passe hachuré == mot de passe introduit donc on retourne vrai ( le user ) 
            } else {
                return done(null, false, { message: 'Mot de passe incorrect' }) //sinon c'est faux
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) //recuperer l'utilisateur par email 
    passport.serializeUser((user, done) => done(null, user.id)) //utilisateur ayant acces
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id)) //contraire

    })


}

module.exports = initialize //les modules qu'on doit emporter pour login.