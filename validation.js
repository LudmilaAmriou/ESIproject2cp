var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');
var scraper = require('table-scraper');
var app = express();
const { Router } = require('express');
const router = Router();
app.set('view engine', 'ejs');
var session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { macAge: 10000 },
    resave: false,
    saveUninitialized: false
}));
/// Fonction qui relie le browzer avec la page HTML /// 
app.use(express.static('public'));

router.get('/DossierNonVal', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('DossierNonVal.ejs', { title: 'tableau', table, name: req.user.nom, firstname: req.user.prenom });
});

router.get('/DossierVal', checkAuthenticated, auth, (req, res) => {

    const table = JSON.parse(fs.readFileSync('demandeurs.json', 'utf8'));
    res.render('DossierVal.ejs', { title: 'tableau', table, name: req.user.nom, firstname: req.user.prenom });
});

router.post('/Valide', urlencodedParser, async function(req, res) {
    modifierRecours('demandeurs.json', true, i);
    res.redirect('/DossierVal.ejs')
});


router.post('/Modifier', urlencodedParser, async function(req, res) {
    res.send(`<!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="../css/PageSaisie.css">
            <link rel="shortcut icon"  type="image/jpg" href="../img/lo.jpg">
            <title>Page saisie</title>    
            <link rel="stylesheet"
            href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"> 
        </head> 
        
            <style>
            *{
                margin:0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            body
            {
                box-sizing: border-box;
                background:  #CCE6F4;
            }
            .FORMULAIRE {
                display: flex;
                padding: 10px;
                padding-top: 90px;
                justify-content: center;
                align-items: center;
            }
            .container
            {
                max-width: 700px;
                width: 100%;
                background: #fff;
                padding: 25px 30px;
                border-radius: 5px;  
                
            }
            .container .title
            {
                background: white;
                color:#D62839;
                font-size: 35px;
                font-weight: 600;
                text-align: center;
            }
     
    
            form .user-details
            {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin: 20px 0 12px 0;
            }
     
            form .user-details .input-box
            {
                margin-bottom: 10px;
                width: calc(100% / 2 - 20px);
            }
            .user-details .input-box .form-step
            {
                display: block;
                font-weight: 500;
                margin-bottom: 5px;
            }
            .form-step .input-box input
            {
                height: 50px;
                width: 100%;
                outline: none;
                border-radius:5px;
                border : 1px solid #ccc;
                padding-left :15px;
                font-size:16px ;
                border-bottom-width:3px;
                transition: all 0.3s ease;
            }
            .form-step .input-box input:focus,
            .form-step .input-box input:valid{
                border-color:#175676;
            }
            form .button
            {
                height: 45px;
                margin: 45px 0;
    
            }
    
            @media (max-width:584px)
            { 
                .container{
                    max-width: 100%;
                }
                form .user-details .input-box
                {
                    margin-bottom: 15px;
                    width: 100%;
                }
            }
       
            span
            {
                color: black;
                font-size: 16px;
                font-weight: 100;
            }
   
             input
                {
                    margin: 5px;
                }
                
               
                form .select
            {
                padding: 1.2rem;
                border-width: 1px;
                border-radius: 6px;
                width: 100%;
                display: flex;
                border-color: #3c3334;
                align-items: center;
                justify-content: space-between;
                font-size: 1.1rem;
                cursor: pointer;
    
    
            }
                button
                {
                    outline: none;
                    color: white;
                    background: #4BA3C3;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: 900;
                    letter-spacing: 1px;
                }
                button input:hover
                {
                    background: #175676;
                }
    :root {
      --primary-color: rgb(11, 78, 179);
    }
    
    
    
    
    .width-50 {
      width: 50%;
    }
    
    .ml-auto {
      margin-left: auto;
    }
    
    .text-center {
      text-align: center;
    }
    
    /* Progressbar */
    .progressbar {
      position: relative;
      display: flex;
      justify-content: space-between;
      counter-reset: step;
      margin: 2rem 0 4rem;
    }
    
    .progressbar::before,
    .progress {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 4px;
      width: 100%;
      background-color: #dcdcdc;
      z-index: -1;
    }
    
    .progress {
      background-color: var(--primary-color);
      width: 0%;
      transition: 0.3s;
    }
    
    .progress-step {
      width: 2.1875rem;
      height: 2.1875rem;
      background-color: #dcdcdc;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .progress-step::before {
      counter-increment: step;
      content: counter(step);
    }
    
    .progress-step::after {
      content: attr(data-title);
      position: absolute;
      top: calc(100% + 0.5rem);
      font-size: 0.85rem;
      color: #666;
    }
    
    .progress-step-active {
      background-color: var(--primary-color);
      color: #f3f3f3;
    }
    /* Form */
    
    
    .form-step {
      display: none;
      transform-origin: top;
      animation: animate 0.5s;
    }
    
    .form-step-active {
      display: block;
    }
    
    .input-group {
      margin: 2rem 0;
    }
    
    @keyframes animate {
      from {
        transform: scale(1, 0);
        opacity: 0;
      }
      to {
        transform: scale(1, 1);
        opacity: 1;
      }
    }
    
    /* Button */
    .btns-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .btn {
      padding: 0.75rem;
      display: block;
      text-decoration: none;
      background-color: var(--primary-color);
      color: #f3f3f3;
      text-align: center;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: 0.3s;
    }
    .btn:hover {
      box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--primary-color);
    }
    
    </style>
     <body>   <!-- FORMULAIRE SAISIR -->

     
     <div class="FORMULAIRE" >
     <div class="container">
    
     <form method="POST" action="/saisie"  name="formulaire">
        <br>
        <h1 class="text-center">Formulaire d'inscription</h1>
        <br>
         <!-- Progress bar -->
        
         <div class="progressbar">
            <div class="progress" id="progress"></div>
            
            <div
              class="progress-step progress-step-active"
              data-title="EtatCivil"
            ></div>
            <div class="progress-step" data-title="EtatCivil2"></div>
            <div class="progress-step" data-title="Expérience"></div>
            <div class="progress-step" data-title="Conjoint"></div>
            <div class="progress-step" data-title="Droits"></div>
          </div>
    
    
          
       
              <div class="form-step form-step-active">
                        <div class="title"> Etat civil </div>
                        <div class="input-box">
                            <span class="details">Matricule</span>
                            <input type="text" placeholder="Entrer le matricule" name="matricule" value="${affichage('demandeurs.json',i).Etat_Civil.matricule}" id="matricule" required>
                        </div> 
                        <div class="input-box">
                            <span class="details">Numéro de dossier</span>
                            <input type="number" placeholder="Entrer le numéro de dossier" value="${affichage('demandeurs.json',i).Etat_Civil.Numerodossier}" name="Numero_de_dossier" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Nom</span>
                            <input type="text" placeholder="Entrer le nom" value="${affichage('demandeurs.json',i).Etat_Civil.nom}" name="Nom" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Prénom</span>
                            <input type="text" placeholder="Entrer le prénom" value="${affichage('demandeurs.json',i).Etat_Civil.prenom}" name="Prenom" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Age</span>
                            <input type="number" placeholder="Entrer l'age" value="${affichage('demandeurs.json',i).Etat_Civil.age}" name="Age" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Date de naissance</span>
                            <input type="date" value=" ${affichage('demandeurs.json',i).Etat_Civil.dateNaissance} " name="Date_de_naissance" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Commune de naissance</span>
                            <input type="text" placeholder="" value=" ${affichage('demandeurs.json',i).Etat_Civil.communeNaissance} " name="Commune_de_naissance" required>
                        </div>
                        <span class="details">Wilaya</span>
                        <select value="${affichage('demandeurs.json',i).Etat_Civil.wilaya} " class="select" name ="Wilaya" size="1" required>
                            <option>01. Adrar</option>
                            <option>02. Chlef</option>
                            <option>03. Laghouat</option>
                            <option>04. Oum El Bouaghi</option>
                            <option>05. Batna</option>
                            <option>06. Bejaia</option>
                            <option>07. Biska</option>
                            <option>08. Bechar</option>
                            <option>09. Blida</option>
                            <option>10. Bouira</option>
                            <option>11. Tamanrasset</option>
                            <option>12. Tebessa</option>
                            <option>13. Tlemcen</option>
                            <option>14. Tiaret</option>
                            <option>15. Tizi Ouzou</option>
                            <option>16. Alger</option>
                            <option>17. Djelfa</option>
                            <option>18. Djijel</option>
                            <option>19. Setif</option>
                            <option>20. Saida</option>
                            <option>21. Skikda</option>
                            <option>22. Sidi Bel Abbes</option>
                            <option>23. Annaba</option>
                            <option>24. Guelma</option>
                            <option>25. Constantine</option>
                            <option>26. Medea</option>
                            <option>27. Mostaganem</option>
                            <option>28. M'Sila</option>
                            <option>29. Mascara</option>
                            <option>30. Ouargla</option>
                            <option>31. Oran</option>
                            <option>32. El Bayadh</option>
                            <option>33. Illizi</option>
                            <option>34. Bordj Bou Arreridj</option>
                            <option>35. Boumerdes</option>
                            <option>36. El Tarf</option>
                            <option>37. Tindouf</option>
                            <option>38. Tissemsilt</option>
                            <option>39. El Oued</option>
                            <option>40. Khenchela</option>
                            <option>41. Souk Ahras</option>
                            <option>42. Tipaza</option>
                            <option>43. Mila</option>
                            <option>44. Ain Defla</option>
                            <option>45. Naama</option>
                            <option>46. Ain Temouchent</option>
                            <option>47. Ghardaia</option>
                            <option>48. Relizane</option>
    
                        </select>
                    
                        <span class="details"> Sexe</span>
                        <select value="${affichage('demandeurs.json',i).Etat_Civil.choixSexe}" class="select" name="choix_sexe" size="1" required>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                        </select>
                 
                        <div class="input-box">
                            <span class="details">Adresse</span>
                            <input value=" ${affichage('demandeurs.json',i).Etat_Civil.Adresse}" type="text" placeholder="Entrer l'adresse " name="Adresse" required>
                        </div>
                        <div class="">
                            <a href="#" class="btn btn-next width-50 ml-auto">Next</a>
                        </div>
                        </div>
    
    
    
                        <div class="form-step">
                            <div class="title"> Etat civil </div>
                        <div class="input-box">
                            <span class="details">Numéro de telephone</span>
                            <input value="${affichage('demandeurs.json',i).Etat_Civil.NumeroTel}" type="text" placeholder="Entrer le numero de telephone" name="Numero_de_telephone" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Email</span>
                            <input value="${affichage('demandeurs.json',i).Etat_Civil.email}" type="email" placeholder="adressemail@esi.dz" name="Email" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Code postal</span>
                            <input value=" ${affichage('demandeurs.json',i).Etat_Civil.codePostal}"  type="text" placeholder="Entrer le code postal" name="Code_postal" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Prénom du père</span>
                            <input value="${affichage('demandeurs.json',i).Etat_Civil.prenomPere}" type="text" placeholder="Entrer le prénom du pere" name="Prenom_du_pere" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Nom de la mère</span>
                            <input value="${affichage('demandeurs.json',i).Etat_Civil.nomMere}" type="text" placeholder="Entrer le nom de la mere" name="Nom_mere" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Prénom de la mère</span>
                            <input value="${affichage('demandeurs.json',i).Etat_Civil.prenomMere}" type="text" placeholder="Entrer le prénom de la mere" name="Prenom_mere" required>
                        </div>
                     
                        <div class="user-details">
                            <span >Situation familiale </span>
                            <select value=" ${affichage('demandeurs.json',i).Etat_Civil.situation}" class="select" name="Situation_familiale" id="situation" size="1" onchange="changeStatus()" required>
                
                                <option value="Marie(é)">Marie(é)</option>
                                <option value="Divorce">Divorce(é)</option>
                                <option value="Celibataire" selected>Célibataire</option>
                                <option value="Veuf(ve)">Veuf(ve)</option>
                            </select>    
                            </div>
                            <div class="user-details">
                    
                                <div class="input-box">
                                    <span class="details">Nombre d'enfants</span>
                                    <input value="${affichage('demandeurs.json',i).Etat_Civil.nbEnfants}" type="number" placeholder="Entrer le nombre d'enfants" name="Nombre_enfants" id='nbenf' required>
                                </div>     
                            </div> 
                          
                            <div class="btns-group">
                                <a href="#" class="btn btn-prev">Previous</a>
                                <a href="#" class="btn btn-next">Next</a>
                            </div>
              </div>
     
              <div class="form-step">
                <div class="title">  Expérience professionnelle </div>
                      
                        <div class="input-box">
                            <span class="details">Ecole</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.ecole}" type="text" placeholder="Entrer l'ecole" name="Ecole" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Direction/Service</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.DireSer}" type="text" placeholder="Direction/Service" name="Direction_Service" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Grade</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.Grade}" type="number" placeholder="Entrer le grade" name="Grade" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Date debut d'installation</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.dateDins}" type="date" name="Date_debut_installation" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Date fin d'installation</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.dateFins}" type="date" name="Date_fin_installation" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Date debut hors secteur</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.dateDhors}" type="date" name="Date_debut_hors_secteur" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Date fin hors secteur</span>
                            <input value="${affichage('demandeurs.json',i).Experience_Professionnellle.dateFhors}"  type="date" name="Date_fin_hors_secteur" required>
                        </div>
    
                        <span class="details"> Responsabilité </span>
                        <select value=" ${affichage('demandeurs.json',i).Experience_Professionnellle.res}" class="select" name="choix_respo" size="1">
                            <option value="Secrétaire général">Secrétaire général</option>
                            <option value="Sous directeur">Sous directeur</option>
                            <option value="Responsable de structure">Responsable de structure</option>
                            <option value="Chef de service rectorat">Chef de service rectorat</option>
                            <option value="Chef de bureau">Chef de bureau</option>
                            <option value="Chef de service institut">Chef de service institut</option>
                            <option value="Chef de section">Chef de section</option>
                        </select>
                        <div class="input-box">
                            <span class="details">Autre responsabilité</span>
                            <input type="text" placeholder="Responsabilité" name="Respondabilite">
                        </div>  
                        <br>   
                        <div class="btns-group">
                            <a href="#" class="btn btn-prev">Previous</a>
                            <a href="#" class="btn btn-next">Next</a>
                        </div>
                </div>
    
    
                
                <div class="form-step">
                    <div class="title"> Conjoint </div>
                        <div class="input-box">
                            <span class="details">Nom</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.nom}" type="text" placeholder="Entrer le nom" name="Nom_conjoint" id="nmcj" >
                        </div>
                        <div class="input-box">
                            <span class="details">Prénom</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.prenom}" type="text" placeholder="Entrer le prénom" name="Prenom_conjoint" >
                        </div>
                        <div class="input-box">
                            <span class="details">Date de naissance</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.dateNaissance}" type="date"  name="Date_naissance_conjoint" >
                        </div>
                        <div class="input-box">
                            <span class="details">Commune de naissance</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.communeNaissance}" type="text" placeholder="" name="Commune_naissance_conjoint" >
                        </div>
                        <span class="details"> Wilaya</span>
                        <select value="${affichage('demandeurs.json',i).Conjoint.wilaya}" class="select" name ="Wilaya_conjoint" size="1">
                            <option>01. Adrar</option>
                            <option>02. Chlef</option>
                            <option>03. Laghouat</option>
                            <option>04. Oum El Bouaghi</option>
                            <option>05. Batna</option>
                            <option>06. Bejaia</option>
                            <option>07. Biska</option>
                            <option>08. Bechar</option>
                            <option>09. Blida</option>
                            <option>10. Bouira</option>
                            <option>11. Tamanrasset</option>
                            <option>12. Tebessa</option>
                            <option>13. Tlemcen</option>
                            <option>14. Tiaret</option>
                            <option>15. Tizi Ouzou</option>
                            <option>16. Alger</option>
                            <option>17. Djelfa</option>
                            <option>18. Djijel</option>
                            <option>19. Setif</option>
                            <option>20. Saida</option>
                            <option>21. Skikda</option>
                            <option>22. Sidi Bel Abbes</option>
                            <option>23. Annaba</option>
                            <option>24. Guelma</option>
                            <option>25. Constantine</option>
                            <option>26. Medea</option>
                            <option>27. Mostaganem</option>
                            <option>28. M'Sila</option>
                            <option>29. Mascara</option>
                            <option>30. Ouargla</option>
                            <option>31. Oran</option>
                            <option>32. El Bayadh</option>
                            <option>33. Illizi</option>
                            <option>34. Bordj Bou Arreridj</option>
                            <option>35. Boumerdes</option>
                            <option>36. El Tarf</option>
                            <option>37. Tindouf</option>
                            <option>38. Tissemsilt</option>
                            <option>39. El Oued</option>
                            <option>40. Khenchela</option>
                            <option>41. Souk Ahras</option>
                            <option>42. Tipaza</option>
                            <option>43. Mila</option>
                            <option>44. Ain Defla</option>
                            <option>45. Naama</option>
                            <option>46. Ain Temouchent</option>
                            <option>47. Ghardaia</option>
                            <option>48. Relizane</option>
    
                        </select>
                        <br> 
                        <div class="input-box">
                            <span class="details">Prénom du père</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.prenomPere}" type="text" placeholder="Entrer le prénom du pere" name="Prenom_pere_conjoint" >
                        </div>
                        <div class="input-box">
                            <span class="details">Nom de la mère</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.nomMere}" type="text" placeholder="Entrer le nom de la mere" name="Nom_mere_conjoint">
                        </div>
                        <div class="input-box">
                            <span class="details">Prénom de la mère</span>
                            <input value="${affichage('demandeurs.json',i).Conjoint.prenomMere}" type="text" placeholder="Entrer le prénom de la mere" name="Prenom_mere_conjoint">
                        </div>
                        <div class="user-details">   
                            <span class="details"> Conjoint au MESRS </span>
                            <select value="${affichage('demandeurs.json',i).Conjoint.choixMesrs}" class="select" name="choix_MESRS" size="1" required>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                            </select>
                            </div>
                
                            <div class="btns-group">
                                <a href="#" class="btn btn-prev">Previous</a>
                                <a href="#" class="btn btn-next">Next</a>
                            </div> 
                </div>
    
                
                <div class="form-step">    
                    <div class="title"> Ayant droits </div>
                        <span class="details">Moudjahid </span>
                        <select value="${affichage('demandeurs.json',i).Droits.moudjahid}" class="select" name="choix_Moudjahid" size="1" required>
                            <option value="Oui">Oui</option>
                            <option value="Non">Non</option>
                        </select>
                        <span class="details"> Fils/fille de Chahid  </span>
                        <select value=" ${affichage('demandeurs.json',i).Droits.chahid}" class="select" name="choix_Chahid" size="1" required>
                            <option value="Oui">Oui</option>
                            <option value="Non">Non</option>
                        </select>
                        <span class="details"> Veuf de Chahid  </span>
                        <select value="${affichage('demandeurs.json',i).Droits.chahid2}" class="select" name="choix_veufChahid" size="1" required>
                            <option value="Oui">Oui</option>
                            <option value="Non">Non</option>
                        </select>    
                        <br>      
                        <div class="btns-group">
                            <a href="#" class="btn btn-prev">Previous</a>
                            <input type="submit" value="Sauvgarder les modifications" class="btn" />
                        </div>
                </div>
            </form>
            </div>
            </div>
            
        <script>
        const prevBtns = document.querySelectorAll(".btn-prev");
        const nextBtns = document.querySelectorAll(".btn-next");
        const progress = document.getElementById("progress");
        const formSteps = document.querySelectorAll(".form-step");
        const progressSteps = document.querySelectorAll(".progress-step");
        
        let formStepsNum = 0;
        
        nextBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
          });
        });
        
        prevBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            formStepsNum--;
            updateFormSteps();
            updateProgressbar();
          });
        });
        
        function updateFormSteps() {
          formSteps.forEach((formStep) => {
            formStep.classList.contains("form-step-active") &&
              formStep.classList.remove("form-step-active");
          });
        
          formSteps[formStepsNum].classList.add("form-step-active");
        }
        
        function updateProgressbar() {
          progressSteps.forEach((progressStep, idx) => {
            if (idx < formStepsNum + 1) {
              progressStep.classList.add("progress-step-active");
            } else {
              progressStep.classList.remove("progress-step-active");
            }
          });
        
          const progressActive = document.querySelectorAll(".progress-step-active");
        
          progress.style.width =
            ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
        }
        </script>
            <br>
            <br>
 
        </body>        
        </html>`)
    router.post('/saisie', urlencodedParser, async function(req, res) {
        console.log(hHALLLLLLLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPPPPPPPPPPPPPPPPP);
    });
});




router.post('/Refuse', urlencodedParser, async function(req, res) {
    modifierRecours('demandeurs.json', false, i);
    res.redirect('./DossierNonVal')
});

function affichage(filename, indice) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return persons[indice];
}


function modifierRecours(filename, newValue, indince) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    persons[indince].Valider = newValue;
    fs.writeFile(filename, JSON.stringify(persons, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log(' file sucessfully written ! ');
        }
    })
}


function recherchematricule(filename, matricule) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].Etat_Civil.matricule === matricule) {
            return i;
        }
    }
}

router.post('/validerDossiers', urlencodedParser, async function(req, res) {
    i = recherchematricule('demandeurs.json', req.body.done)
    res.send(` 
    


    <html>
        <head>
            <title>Gestion des dossiers</title>
            <link rel="shortcut icon"  type="image/jpg" href="../img/lo.jpg">
            <meta http-equiv="X-UA-Compatible" content="IE-edge">
            <meta name="viewport" content="width=device-width", initia-scale=1>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
              integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
              crossorigin="anonymous"
            />
        </head>
    
        <style>
    
    :root {
      --nav-width: 200px;
      --nav-collapse-width: 100px;
    
      --header-height: 75px;
    
      --nav-bg-color: #4BA3C3;
      --active-color: #CCE6F4;
    }
    
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
    
    
    /* Global Style */
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    
    a {
      text-decoration: none;
      color: #343434;
    }
    
    /* Header Styles */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      height: var(--header-height);
      background-color: #f3f3f3;
      padding-left: calc(var(--nav-width) + 1rem);
      transition: padding-left 0.3s ease-in-out;
    }
    
    header #nav-toggler {
      font-size: 1.5rem;
      box-shadow: 0 0 1px #343434;
      background-color: #fff;
      padding: 0.25rem 0.35rem;
      border-radius: 0.25rem;
    }
    
    /* Side Menu Styles */
    nav {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--nav-bg-color);
      width: var(--nav-width);
      transition: width 0.2s ease-in-out;
      box-shadow: 0 0 2px #343434;
    }
    
    nav .logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: var(--header-height);
    }
    
    nav .logo span {
      margin-left: 1rem;
    }
    
    .nav__item-link,
    .logo,
    .sign-out {
      font-size: 1.25rem;
      display: block;
      padding: 1rem;
      color: #f3f3f3;
      white-space: nowrap;
    }
    
    .nav__item-link span,
    .logo span,
    .sign-out span {
      margin-left: 0.5rem;
    }
    
    .nav__item-link + ul a {
      display: block;
      padding: 1rem;
      background-color: #f3f3f3;
      white-space: nowrap;
    }
    
    /* JS Classes */
    .collapse {
      width: var(--nav-collapse-width);
    }
    
    .collapse i {
      margin-left: 0.5rem;
    }
    
    .collapse span {
      display: none;
    }
    
    .collapse .nav__item-link + ul a {
      font-size: 0.85rem;
    }
    
    .collapse-header {
      padding-left: calc(var(--nav-collapse-width) + 1rem);
    }
    
    .active {
      position: relative;
      color: var(--active-color);
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .active:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      height: 25px;
      width: 3px;
      margin: auto 0;
      background-color: var(--active-color);
    }
    
    .d-none {
      display: none;
    }
    
    .nav__item-link + ul a.active-sub-link {
      background-color: #ddd;
    }
    
    @media screen and (max-width: 768px) {
      header {
        padding-left: 1rem;
      }
    
      nav {
        width: 0px;
        overflow: hidden;
      }
    
      .nav__item-link span,
      .logo span,
      .sign-out span {
        display: none;
      }
    }
    
    
    
            .title
            {
                font-size: 35px;
                font-weight: 500;
            }
            input
            {
                display: block;
                margin-left: auto;
                padding: none;
                outline: none;
                border: none;
                background-color :transparent;
                color: #175676 ;
                font-size: var(--normal-font-size);
                border-radius: .5rem;
                cursor: pointer;
                transition: .3s;
            }
            .title
            {
                font-family: 'Open Sans',Sans-serif;
                font-weight: 100;
                font-size: 35px;
                position: relative;
                text-align: center;
                left: 25px;
    
            }
            .title::before{
    
                content: '';
                position: absolute;
                left: 210;
                bottom:0;
                height: 1px;
                width: 900px;
                background:  black
            }
    
            .FORMULAIRE {
                
                display: flex;
  
                padding: 10px;
                padding-top: 90px;
                justify-content: center;
                align-items: center;
            }
            .container
            {
                max-width: 1600px;
                width: 100%;
                background: #fff;
                padding: 25px 210px;
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
            h1
            {
                color: #D62839;
            }
            h2
            {
                color: #EDD2D7;
            }
            .ligne
            {
                height: 0.5px;
                background-color: #E2E4E5
            }
            label
            {
                color:#175676;
                font-weight: 100;
                font-size: 15px;
            }
    
    </style>
    
    
    
    
    <body>
        
      
        <header id="header">
            <i class="fas fa-bars" id="nav-toggler"></i>
            <div>
              <i class="fas fa-user-alt"></i>
              <span>Filali hasna</span>
            </div>
          </header>
      
          <nav id="nav">
            <div>
              <div class="logo">
                 <a href="http://127.0.0.1:5000/menuValideur">
                <span>Logement ESI</span> </a>
              </div>
              <ul class="nav">
                <li class="nav__item">
                  <a href="#" class="nav__item-link">
                    <i class="fas fa-home"></i>
                    <span>Menu <i class="fas fa-angle-down"></i></span>
                  </a>
                  <ul class="d-none">
                    <li>
                      <a href="http://localhost:5000/recours" class="sub_link">Ajouter Recours</a>
                    </li>
                    <li>
                      <a href="http://localhost:5000/DossierVal" class="sub_link">Dossier validés</a>
                    </li>
                    <li>
                  </ul>
                </li>
                <li class="nav__item">
                  <a href="#" class="nav__item-link active">
                    <i class="fas fa-address-book"></i>
                    <span>Demandeur</span>
                  </a>
                </li>
                <li class="nav__item">
                  <a href="#" class="nav__item-link ">
                    <i class="fas fa-user-alt"></i>
                    <span>Mon profile</span>
                  </a>
                </li>
                <li class="nav__item">
                  <a href="#" class="nav__item-link">
                    <i class="fas fa-cogs"></i>
                    <span>Paramètres</span>
                  </a>
                </li>
              </ul>
            </div>
      
            <a href="#" class="sign-out">
              <i class="fas fa-sign-out-alt"></i>
              <span>Deconnexion</span>
            </a>
          </nav>
      
          <script src="main.js" defer></script>
        <br>
        <br>
        <div class="title">
         Les informations de demandeur : 
        </div>   
       
            <div class="container">
            <h1> Dossier de demandeur : </h1> 
            <p><h2>------------------------------------ Etat civil -------------------------------------- </h2></p> 
            <label>Nom : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.nom} 
            <br>
            <div class="ligne"></div>
            <br>
            <label> Prenom : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.prenom}
            <div class="ligne"></div>
            </br>
            <label> Matricule: </label>
            ${affichage('demandeurs.json',i).Etat_Civil.matricule}
            <div class="ligne"></div>
            </br>
            <label>Numero de dossier : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.Numerodossier}
            <div class="ligne"></div>
            </br>
            <label>Date de naissance : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.dateNaissance} 
            <div class="ligne"></div>
            <br>
            <label>Commune de naissance : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.communeNaissance} 
            <div class="ligne"></div>
            <br>
            <label>Wilaya de naissance : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.wilaya} 
            <div class="ligne"></div>
            <br>

            <label>Sexe : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.choixSexe} 
            <div class="ligne"></div>
            <br>

            <label>Adresse : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.Adresse} 
            <div class="ligne"></div>
            <br>

            <label>Numero de telephone : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.NumeroTel} 
            <div class="ligne"></div>
            <br>

            <label>Email : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.email} 
            <div class="ligne"></div>
            <br>

            <label>Code postal : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.codePostal} 
            <div class="ligne"></div>
            <br>

            <label>Prenom de pere : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.prenomPere} 
            <div class="ligne"></div>
            <br>

            <label>Nom de la mere  : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.nomMere} 
            <div class="ligne"></div>
            <br>

            <label>Prenom de la mere : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.prenomMere} 
            <div class="ligne"></div>
            <br>

            <label>Situation familiale : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.situation} 
            <div class="ligne"></div>
            <br>

            <label>Le nombre d'enfants : </label>
            ${affichage('demandeurs.json',i).Etat_Civil.nbEnfants} 
            <div class="ligne"></div>
            <br>

            <p><h2>----------------------------- Exprerience professionnelle ---------------------------- </h2></p> 

            <label>L'ecole : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.ecole}
            <div class="ligne"></div>
            <br>

            <label>Direction/Service : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.DireSer}
            <div class="ligne"></div>
            <br>

            <label>Le grade : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.Grade}
            <div class="ligne"></div>
            <br>

            <label>La date de debut d'installation : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.dateDins}
            <div class="ligne"></div>
            <br>

            <label>La date de fin d'installation : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.dateFins}
            <div class="ligne"></div>
            <br>

            <label>La date de debut hors secteur : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.dateDhors}
            <div class="ligne"></div>
            <br>

            <label>La date de fin hors secteur : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.dateFhors}
            <div class="ligne"></div>
            <br>

            <label>La responsabilité : </label>
            ${affichage('demandeurs.json',i).Experience_Professionnellle.res}
            <div class="ligne"></div>
            <br>

            
            <p><h2>---------------------------------------- Conjoint ------------------------------------ </h2></p> 
            

            <label>Nom : </label>
            ${affichage('demandeurs.json',i).Conjoint.nom} 
            <div class="ligne"></div>
            <br>
            <label> Prenom : </label>
            ${affichage('demandeurs.json',i).Conjoint.prenom}
            <div class="ligne"></div>
            </br>
            <label>Date de naissance : </label>
            ${affichage('demandeurs.json',i).Conjoint.dateNaissance}
            <div class="ligne"></div>
            <br>

            <label>Commune de naissance : </label>
            ${affichage('demandeurs.json',i).Conjoint.communeNaissance}
            <div class="ligne"></div>
            <br>

            <label>Wilaya de naissance : </label>
            ${affichage('demandeurs.json',i).Conjoint.wilaya}
            <div class="ligne"></div>
            <br>

            <label>Prenom de pere : </label>
            ${affichage('demandeurs.json',i).Conjoint.prenomPere}
            <div class="ligne"></div>
            <br>

            <label>Nom de la mere  : </label>
            ${affichage('demandeurs.json',i).Conjoint.nomMere}
            <div class="ligne"></div>
            <br>

            <label>Prenom de la mere : </label>
            ${affichage('demandeurs.json',i).Conjoint.prenomMere}
            <div class="ligne"></div>
            <br>

            <label>Conjoint au MESRS : </label>
            ${affichage('demandeurs.json',i).Conjoint.choixMesrs}
            <div class="ligne"></div>
            <br>

            <p><h2>----------------------------------------- Droits ------------------------------------- </h2></p> 

            <label>Moudjahid: </label>
            ${affichage('demandeurs.json',i).Droits.moudjahid}
            <div class="ligne"></div>
            <br>

            <label>Fils/fille de chahid : </label>
            ${affichage('demandeurs.json',i).Droits.chahid}
            <div class="ligne"></div>
            <br>

            <label> Veuf de chahid : </label>
            ${affichage('demandeurs.json',i).Droits.chahid2}
            <div class="ligne"></div>
            <br>


            <form method="POST" action="/Valide">
                <div class="button">
                <input type="submit" value="Valider">
                </div>
            </form>  
            <form method="POST" action="/Refuse" >
                <div class="button">
                <input type="submit" value="Rejeter">
                </div>
            </form> 
            <form method="POST" action="/Modifier" >
            <div class="button">
            <input type="submit" value="Modifier">
            </div>
        </form> 
        
            </div>
    
    <script>
        const nav_links = document.querySelectorAll(".nav__item-link");
    const sub_links = document.querySelectorAll(".sub_link");
    
    function collapse_nav(head, toggler, sidenav) {
      const header = document.getElementById(head);
      const nav_toggler = document.getElementById(toggler);
      const nav = document.getElementById(sidenav);
    
      nav_toggler.addEventListener("click", function () {
        this.classList.toggle("fa-times");
        nav.classList.toggle("collapse");
        header.classList.toggle("collapse-header");
      });
    }
    
    collapse_nav("header", "nav-toggler", "nav");
    
    nav_links.forEach((link) => {
      link.addEventListener("click", function () {
        nav_links.forEach((l) => {
          if (l.classList.contains("active")) {
            l.classList.remove("active");
          }
        });
    
        this.classList.toggle("active");
        const sub_menu = this.nextElementSibling;
        if (sub_menu) {
          sub_menu.classList.toggle("d-none");
        }
      });
    });
    
    sub_links.forEach((link) => {
      link.addEventListener("click", () => {
        sub_links.forEach((l) => l.classList.remove("active-sub-link"));
        link.classList.toggle("active-sub-link");
      });
    });
    
    </script>
        </body> 
</html>




    `);
});
router.delete('/logout', (req, res) => {
    req.logOut();
    res.clearCookie('mlcl');
    req.session.destroy()
    res.redirect('/connecter');

})

function auth(req, res, next) {
    if (req.user.profil === 'Admin' || req.user.profil === 'Valideur') {
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