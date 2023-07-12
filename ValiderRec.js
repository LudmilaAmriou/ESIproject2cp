const express = require('express')
const app = express()
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const fs = require('fs');
const scraper = require('table-scraper');
const modifier = require('./modificationdossier')
const modifierRecours = modifier.modifierRecours
const rech = require('./recherchedossier')
const recherchematricule = rech.recherchematricule
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

router.get('/validerRecours', checkAuthenticated, auth, function(req, res) {
    res.render('listeRec.ejs');
});
router.post('/successRec', urlencodedParser, async function(req, res) {
    modifierRecours('./demandeurs.json', 'Validé', i);
    res.redirect('/listeRec');
});

router.post('/echecRec', urlencodedParser, async function(req, res) {
    modifierRecours('./demandeurs.json', 'Refusé', i);

    res.redirect('/listeRec');
});

function affichage(filename, indice) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return persons[indice];
}
router.post('/validerRecours', urlencodedParser, function(req, res) {
    console.log(req.body.done);
    var persons = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    i = recherchematricule('demandeurs.json', req.body.done)
    if (persons[i].Dossier_Complet === true) {
        res.send(` 
    
    <style>
    
    *{
        margin:0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    body
    {
       height: 100vh;
       background:  linear-gradient( 135deg, #EDD2D7,#CCE6F4);;
    }
    .FORMULAIRE {
        display: flex;
        height: 80vh;
        padding: 10px;
        padding-top: 90px;
        justify-content: center;
        align-items: center;
    }
    .container
    {
        max-width: 1100px;
        width: 100%;
        background: #fff;
        padding: 25px 40px;
        border-radius: 5px;  
        
    }
    .button
    {
        height: 45px;
        margin: 45px 0;

    }
    .button input
    {
        height: 100%;
        width: 100%;
        outline: none;
        color: white;
        background: #4BA3C3;
        border: none;
        border-radius: 5px;
        font-size: 20px;
        font-weight: 900;
        letter-spacing: 1px;
    }
    .button input:hover
    {
        background: #175676;
    }
    </style>
    <body>
        <div class ="FORMULAIRE">
        <div class="container">
        <h1> Informations de demandeur : </h1> 
        <br>
        <div class='title'>
        <label> Nom : </label>
        </div>
        <span class="details">Nom : </span>
        <input type="text" placeholder=" ${affichage('demandeurs.json',i).Etat_Civil.nom}" name="matricule" id="matricule" required>
         ${affichage('demandeurs.json',i).Etat_Civil.nom} 
        <br>
        <span class="details">Prenom : </span>
        <input type="text" placeholder=" ${affichage('demandeurs.json',i).Etat_Civil.prenom}" name="matricule" id="matricule" required>
        <label> Matricule : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.matricule}
        </br>
        <label> Numéro de dossier  : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.Numerodossier}
        </br>
        <label> Date de naissance : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.dateNaissance}
        </br>
        <label> Commune de naissance : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.communeNaissance}
        <label> Wilaya  : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.wilaya}
        </br>
        <label> Situation familiale   : </label>
        ${affichage('demandeurs.json',i).Etat_Civil.situation}
        </br> 
        <a href="http://127.0.0.1:3000/listeDemandeurs">
        <div class="button">
            <input type="submit" value="Retour a la liste">
        </div>
        </a>
    </body>

`);
    } else {
        res.send(` 
    
        <style>
        
        *{
            margin:0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }
        body
        {
           height: 100vh;
           background:  linear-gradient( 135deg, #EDD2D7,#CCE6F4);;
        }
        .FORMULAIRE {
            display: flex;
            height: 80vh;
            padding: 10px;
            padding-top: 90px;
            justify-content: center;
            align-items: center;
        }
        .container
        {
            max-width: 1100px;
            width: 100%;
            background: #fff;
            padding: 25px 40px;
            border-radius: 5px;  
            
        }
        .button
        {
            height: 45px;
            margin: 45px 0;
    
        }
        .button input
        {
            height: 100%;
            width: 100%;
            outline: none;
            color: white;
            background: #4BA3C3;
            border: none;
            border-radius: 5px;
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
        }
        .button input:hover
        {
            background: #175676;
        }
        </style>
        <body>
            <div class ="FORMULAIRE">
            <div class="container">
            <h1> Informations de demandeur : </h1> 
            <br>
            <label> Nom : </label>
             ${affichage('demandeurs.json',i).Etat_Civil.nom} 
            <br>
            <label> Prénom : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.prenom}
            </br>
            <label> Matricule : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.matricule}
            </br>
            <label> Numéro de dossier  : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.Numerodossier}
            </br>
            <a href="http://127.0.0.1:3000/listeDemandeurs">
            <div class="button">
                <input type="submit" value="Retour a la liste">
            </div>
            </a>
        </body>
    
    `);
    }
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