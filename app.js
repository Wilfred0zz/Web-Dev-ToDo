const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();

const axios = require('axios');

var path = require('path');

var BodyParser= require('body-parser');
var CookiesParser= require("cookie-parser");

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use(CookiesParser());

app.engine('handlebars',exphbs({defaultLayout: 'signin'}));
app.set('view engine', 'handlebars');
app.set('views',__dirname + '/views')
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) =>{
    res.render('login');
});


app.get('/index', (req, res) =>{
    res.render('index');
});



app.post('/login', (req, res) =>{
    //console.log(req);
    const User = req.body.username;
    
    //console.log(req);
    //console.log(User);
    
axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username : User
        }
    })
    .then((response) => {
        const token= response.data.token ;
        res.cookie('UserToken',token);
        //console.log(res,'HHHHHHHHHHHHHHHHHHHHHHHHHHH');
        //console.log(response.data.token);
    })
    .catch((error)=> {
      console.log(error);
    })
    .then((response) => {
        res.render('index')
        console.log(response);})
        .catch((error)=> {
        console.log(error);  
      });
});

app.post('/index',(req,res) =>{
    const newTask = req.body.NewTask;
    //console.log(newTask+ "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    const token = req.cookies.UserToken;
    //console.log(token + '_____________________________________________');
    axios({
        method: 'post',
        url:'https://hunter-todo-api.herokuapp.com/todo-item',
        headers:{'Authorization' : `${token}`},
        data:{ 
            content: newTask
        }
        })
        .then((response) => {
            console.log('set task');
            res.render('index');

        })
        .catch((err) => {
            console.log("error", err)
            res.render('index');
        })

});


app.get('/tasks',(req,res) =>{
    const token= req.cookies.UserToken;
    axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/todo-item',
        headers:{'Authorization' : `${token}`},

    })
    .then((response) => {
        console.log(response);
        var filteredTasks = response.data.filter(deletedTask => !deletedTask.deleted);

        res.render('index', {alltasks : filteredTasks});
    })
    .catch((err)=> {
        console.log(err);
        res.render('index');
    })
    
});


app.post('/register', (req,res)=>{
    res.render('register');
});

app.post('/registerNew',(req,res)=>{
    const User = req.body.username;
    console.log("this is the user we are about to add: " + User);
    
    axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/user',
        data: {
            username : User
        }
    })
    .then((response)=>{
        console.log(response);
        res.render('login');
    })
    .catch((err)=>{
        console.log(err)
    })
    
});


app.get('/logout', (req,res)=> {
    res.render('login');
});

app.listen(3000);


