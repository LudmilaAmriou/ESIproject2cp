//convertir
var express = require('express');
var app = express();
const fs = require('fs')
const { Router } = require('express');
const router = Router();

router.get('/activ', async function(req, res) {
    var Document = fs.readFileSync('log\\2021-results.csv').toString().split('\n')
        //var Document = fs.readFileSync('dataset.csv').toString().split('\r\n')
    var Columns = Document[0]
    Document.shift()
    Columns = Columns.split(',')
    var Json = []

    for (var i = 0; i < Document.length; i++) {
        var Data = {}
        var Element = Document[i].split(',')
        for (var j = 0; j < Element.length; j++) {
            Data[Columns[j]] = Element[j]
        }
        Json.push(Data)
    }
    Data = JSON.stringify(Json, null, 2)
    fs.writeFileSync('historique.json', Data, function(err) {
        if (err) throw err
    })
    let histo = require('./historique.json');
    const table = JSON.parse(fs.readFileSync('historique.json', 'utf8'));
    res.render('historique.ejs', { title: 'tableau', table });
});
module.exports = router