const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//Connect to MongoDb
mongoose.connect('mongodb://localhost/nodeapp');
let db = mongoose.connection;

//Checking Errors
db.on('error',function(err){
    if(err){
        console.log(err);
    }
});

db.once('open',function(){
    console.log('DB Connected Successfully');
});

//Bring in the Model
let Article = require('./models/articles');

//Body-Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

//Get Home Directory
app.get('/',function(req,res){
    Article.find({},function(err,articles){
        if(err){
            console.log(err);
        }else{
            res.render('index',{"title":"Articles",articles:articles});
        }
    });
});

//Get Add Article Form
app.get('/articles/add',function(req,res){
    res.render('addArticle',{
        "title":"Add Article"
    });
});

//Get Single Article
app.get('/article/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        if(err){
            console.log(err);
        }else{
            res.render('article',{article:article});
        }
    });
});

//Get Edit Form
app.get('/article/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        if(err){
            console.log(err);
        }else{
            res.render('edit_article',{"title":"Edit Article",article:article});
        }
    });
});

//Submit new Article to DB
app.post('/articles/add',function(req,res){
    let article = new Article();

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
             res.redirect('/');
        }
    });

});

//Update the Article
app.post('/article/edit/:id',function(req,res){
    let article = {};

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else{
             res.redirect('/');
        }
    });

});

//Deleting Article
app.delete('/article/delete/:id',function(req,res){

    let query = {_id:req.params.id};

    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('Article deleted Successfully');
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});