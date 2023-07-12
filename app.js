const express = require('express');
const bodyParser = require('body-parser');
const app =express();
const fs = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');
const multer = require('multer');
var session =require('express-session');
var flush = require('connect-flash');
app.set('view engine','ejs');
app.use(session({
    secret:'secret',
    cookie: {macAge : 10000},
    resave: false,
    saveUninitialized:false
}));
app.use(flush());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    //res.send('Hello World');
    res.sendfile('final.ejs');
});
app.get('/final',(req,res)=>{
    
    res.render('final.ejs',{title: 'accusee'});
});


function Readarray(path , cb)
{
    fs.readFile(path,'utf-8',(err,data)=>{
        if (err){
            return cb && cb(err);
        }
        try{
            const table = JSON.parse(data);
            return cb &&cb(null,table);
        }
        catch(err)
        {
            return cb && cb(err);
        }
    });
}

function loadJSON(filename='')
{
    if (fs.existsSync(filename)) 
    {
        return JSON.parse(fs.readFileSync(filename).toString());
    } 
    else
    {
        return ''
    }    
} 

const array=loadJSON('validation.json');

const lol = loadJSON('pvs.json');

function getindex(tab,mat='')
{
    for(var i=0 ; i<tab.length;i++){
        if (tab[i].Etat_Civil.matricule===mat)
        {
            return i;
        }
    }
}
//console.log(getindex(array, '12'));
 function click(m='') { 
    index=getindex(array,m);
    var objet =array[index];
    app.get('/display',(req,res)=>{
        res.render('display',{title: 'dossier', objet});
    });
 }; 

app.get('/doc',(req,res)=>{
    var objet =array[1];
    var matri = req.mat;
    console.log(matri);
    res.render('doc.ejs',{title: 'dossier', objet , message: req.flash('message')});
});



//console.log(getindex(array,'12'));

app.get('/tableau',(req,res)=>{
    const table =array; 
    //console.log(getmat);
    res.render('tableau.ejs',{title: 'tableau',table});
});
app.post('/tableau',(req,res)=>
{
    var name = req.value;
    //console.log(name);
    return res.json({status: 'OK'});
});

/********************************************* here is pv  **********************************************************/
const upload = multer({storage});

//app.use(express.static('public'));
app.get('/upload',(req,res)=>{
    const psps =lol;
    res.render('upload.ejs',{title: 'PV',psps});
});



app.post('/upload',upload.single('pv'),(req,res)=>
{
    const psps =lol;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var d =year + "-" + month + "-" + date;
    var t =hours + ":" + minutes;
    var name = req.file.filename;
    var path = './uploads/'+name;
    addpv(name,path, d , t);
    //console.log(name);
    console.log(req.body.done);
    i = findpdf(req.body.done)
    res.render( 'upload.ejs',{psps});
});
/********************************************* END OF pv  **********************************************************/

var addpv = function (filename='', filepath='' , dat='',temps='')
{
    fs.readFile('pvs.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.push({pv: filename, path: filepath , da :dat ,ti :temps , editeur:'valideur'} ); //add some data
        json = JSON.stringify(obj); //convert it back to json
        //var add = fs.writeFile('pvs.json', json,'utf8',callback);
        fs.writeFile('pvs.json', json,'utf8',function(err){
            if(err) throw err;
          }); // write it back
    }});
}



function modifier(newValue='',mm='')  // this function gonna allow u to modify the validation attribute
{  
    indince=getindex(array,mm);
    //console.log(indince);
    array[indince].Valider=newValue;  // then it gonna put the newValue in validation attribute form the person who correspond to the indice
    fs.writeFileSync('validation.json',JSON.stringify(array, null, 2)); // then it will re-write ur object *update ur table*
};

// app.post('/success',urlencodedParser,function(req,res)
// {
//     modifier('validation.json','valider',1);
//     res.redirect('/success');
// });

 app.post('/success',function(req,res)
 {
    
     modifier('valider','12');
     req.flash('message','Le Dossier est Validé Avec Succes');
     res.redirect('/doc');
 }
 );

 app.get('/success',(req,res)=>{

    res.render('success.ejs',{title: 'valider'});
});
app.use(express.static('public'));

app.post('/view',function(req, res) 
{
   console.log(lol, req.body.done);
   i = findpdf(req.body.done)
   res.render( 'view.ejs',i);
});


function findpdf(name=""){
    for(var i=0 ; i<lol.length;i++){
        if (lol[i].pv===name)
        {
            return lol[i].path;
        }
    }
}
/*********************************************************JIHET LPDF ******************************************************/



//set the public folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middle ware
app.use(bodyParser.urlencoded({extended:true}));

//Index Route
app.get('/index', (req, res)=>{
    //res.send('Hello World');
    res.render('index.ejs');
});

const pdfRoute = require('./routes/pdfmake');
app.use('/pdfMake', pdfRoute);


const pdfrt = require('./routes/docpdf');
app.get('/hey',(req,res)=>{
    var objet =array[1];
    var matri = req.mat;
    console.log(matri);
    res.render('hey.ejs',{title: 'dossier', objet});
})
app.use('hey/pdfdoc',pdfrt);







/*********************************************************JIHET LPDF ******************************************************/

app.listen(7000);