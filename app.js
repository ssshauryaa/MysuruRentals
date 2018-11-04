var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');

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
    {
       console.log("connected");
       con.query("use dbmsproj;", function(err,result){
       if(err)
          throw err;
       else
          console.log("database used");
       });
    }
});

var app = express();

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static("public"));

//////////////////////////////////////////////////////////////////////////////

app.get("/",function(req,res){
    console.log("abc");
    res.render("index.ejs");
});

app.get("/signup",function(req,res){
    res.render("signup.ejs");
});


app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.get("/home",function(req,res){
  res.render("home.ejs");
});

app.post("/newuser",function(req,res){
    var first= req.body.first_name;
    var last= req.body.last_name;
    var contactnumber= req.body.contactnumber;
    var email_id= req.body.email;
    var pword= req.body.password;
    var Age= req.body.age;
    console.log(first);
    var sql=`INSERT into students(first_name,last_name,contact,email,password,age) values("${first}","${last}","${contactnumber}","${email_id}","${pword}","${Age}");`;
    //console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      else
          console.log("1 record inserted");
      });
    return res.redirect("/login");
});

app.post("/login1",function(req,res){
    var email=req.body.email;
    var password=req.body.pass;
    var sql=`SELECT * from students where email="${email}" and password="${password}";`;
    con.query(sql, function(err, result, fields){
      if(err) throw err;
      else
      {
          console.log(result);
          return res.redirect("/home");
      }
    });
});

app.listen(8080,function()
{
    console.log("Server has started");
});
