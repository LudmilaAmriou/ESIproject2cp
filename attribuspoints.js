function ajouterZero(numero) {
    return numero < 10 ? `0${numero}` : numero;
}

function calculerAnnee(dateDebut, dateFin) {
    let anneeDebut = "";
    let anneeFin = "";
    let moisDebut = "";
    let moisFin = "";
    let jourDebut = "";
    let jourFin = "";
    let jour;
    let jour2;
    let jour3;
    let nbAnnee;

    for (var i = 0; i < 4; i++) {
        anneeFin = anneeFin + dateFin[i];
        anneeDebut = anneeDebut + dateDebut[i];
    }

    for (var i = 5; i < 7; i++) {
        moisFin = moisFin + dateFin[i];
        moisDebut = moisDebut + dateDebut[i];
    }

    for (var i = 8; i < 10; i++) {
        jourFin = jourFin + dateFin[i];
        jourDebut = jourDebut + dateDebut[i];
    }
    jour = Number(jourFin) - Number(jourDebut);
    jour2 = (Number(moisFin) - Number(moisDebut)) * 30;
    jour3 = (Number(anneeFin) - Number(anneeDebut)) * 365;
    nbAnnee = (jour + jour2 + jour3) / 365;
    return nbAnnee;
}

function ancienneté(object) {
    nbAnneeIns = calculerAnnee(object.Date_debut_installation, object.Date_fin_installation);
    nbAnneeFP = calculerAnnee(object.Date_debut_hors_secteur, object.Date_fin_hors_secteur);
}

function ageSituation(object) {
    let ap = 0;

    if (object.Situation_familiale === 'Celibataire') {
        if ((object.Age >= 25) && (object.Age < 30)) {
            ap = 1;
        }
        if ((object.Age >= 30) && (object.Age < 35)) {
            ap = 2;
        }
        if (object.Age >= 35) {
            ap = 3;
        }
    } else {
        ap = 4;
        if (object.nbEnfants <= 5) {
            ap = ap + 2
        }
    }
    return ap
}

function pointsGrade(Grade) {
    let ap2 = 0;
    if ((Grade >= 1) && (Grade <= 4)) {
        ap2 = 1;
    }
    if ((Grade >= 5) && (Grade <= 9)) {
        ap2 = 2;
    }
    if ((Grade >= 10) && (Grade <= 11)) {
        ap2 = 3;
    }
    if ((Grade >= 12) && (Grade <= 15)) {
        ap2 = 4;
    }
    if (Grade >= 16) {
        ap2 = 5;
    }
    return ap2

}


function conjointMesrs(cM = '') {
    let ap4 = 0;
    if (cM === 'Oui') {
        ap4 = 2;
    }
    return ap4
}


function droits(object) {
    let ap6 = 0;
    if (object.choix_Moudjahid === 'Oui') {
        ap6 = 6;
    }
    if (object.choix_Chahid === 'Oui') {
        ap6 = 6;
    }
    if (object.choix_veufChahid === 'Oui') {
        ap6 = 6;
    }
    return ap6

}

function responsabilité(respo = '') {
    let ap5 = 0;
    if (respo === 'Secrétaire général') {
        ap5 = 2;
    }
    if (respo === 'Sous directeur') {
        ap5 = 2;
    }
    if (respo === 'Responsable de structure') {
        ap5 = 2;
    }
    if (respo === 'Chef de service rectorat') {
        ap5 = 2;
    }
    if (respo === 'Chef de bureau') {
        ap5 = 2;
    }
    if (respo === 'Chef de service institut') {
        ap5 = 2;
    }
    if (respo === 'Chef de section') {
        ap5 = 2;
    }
    return ap5
}
module.exports = { ajouterZero, ageSituation, pointsGrade, conjointMesrs, droits, ancienneté, responsabilité }