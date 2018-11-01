var express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shaurya"
});

con.connect(function(err)
{
    if(err)
       throw err;
    else
       console.log("connected\n");
});
var app = express();

app.use(express.static("public"));

app.get("/",function(req,res){
    console.log("abc");
    res.render("home.ejs");
});
app.get("/signup",function(req,res){
    res.render("signup.ejs");
});
app.listen(8080,function()
{
    console.log("Server has started");
});
