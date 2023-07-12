if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() //ajouter le .env pour la protection des comptes
}
//packages dont on a besoin + declarations///
const fs = require('fs')

function modifier(filename, newValue, indince) {
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8'));
    persons[indince] = newValue;
    fs.writeFileSync(filename, JSON.stringify(persons, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log(' file sucessfully written ! ');
        }
    })
}
function modifierRecours(filename,newValue,indince)  
{                
    var persons = JSON.parse(fs.readFileSync(filename, 'utf8')); 
    persons[indince].Recours.valider_recours = newValue; 
    fs.writeFile(filename, JSON.stringify(persons,null,2),err => 
    {
        if (err)
        {
            console.log(err);
        } else 
        {
            console.log(' file sucessfully written ! ');
        }    
    })  
 }



module.exports = { modifier , modifierRecours }