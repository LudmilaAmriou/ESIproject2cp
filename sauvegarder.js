var fs = require('fs');
/// Fonction lecture d'un fichier JSON avec le nom 'filename' ///
function parseJSON(json) {
    json = json.replace("for(;;);", "");

    /* parse your JSON as usual */
}

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
    fs.writeFile(filename, JSON.stringify(ancienData, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('file sucessfully written ');
        }
    })
}

module.exports = sauvegarder