var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
//require('json-response');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
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

var stdetails;

var odetails;

var pgdetails;

var pg;

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static("public"));

//////////////////////////////////////////////////////////////////////////////

app.get("/",function(req,res){
    console.log("Welcome to mysuru_rentals");
    res.render("index.ejs");
});

app.get("/signup",function(req,res){
    res.render("signup.ejs");
});

app.get("/osignup",function(req,res){
    res.render("osignup.ejs");
});
app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.get("/logout",function(req,res){
  stdetails=null;
  odetails=null;
  pgdetails=null;
  pg=null;
  return res.redirect("/");
});

app.get("/home",function(req,res){
  var sql=`SELECT * from pg;`;
  con.query(sql, function(err, result,fields){
    if(err) throw err;
    else
    {
      pgdetails=result;
      res.render("home.ejs",{details: stdetails,pgdetails: pgdetails});
    }
  });
});

app.get("/ohome",function(req,res){
  var sql=`SELECT * from pg;`;
  con.query(sql,function(err,result,fields){
    if(err) throw err;
    else
    {
      pgdetails=result;
      //console.log(pgdetails);
      res.render("ohome.ejs",{details: odetails,pgdetails: pgdetails});
    }
  });
  //console.log(typeof(pgdetails));
});

app.get("/profile",function(req,res){
  res.render("profile.ejs",{details: stdetails});
});

app.get("/oprofile",function(req,res){
  var sql=`SELECT * from pg where owner_id=${odetails.id};`;
  con.query(sql,function(err,result){
    if(err) throw err;
    else {
      console.log(result);
      res.render("oprofile.ejs",{details: odetails,results: result});
    }
  })
});

app.get("/addpg",function(req,res){
  res.render("addPg.ejs",{details: odetails});
});

app.get("/osign",function(req,res){
  res.render("osign.ejs");
});

app.get("/description/:id",function(req,res){
  console.log(req.params.id);
  //res.send("This is description page");
  var Id=req.params.id;
  var sql=`SELECT * from description where id=${Id}`;
  con.query(sql,function(err,result){
    if(err) throw err;
    else {
      pg=result[0];
      console.log(pg);
       res.render("description.ejs",{pg: pg});
     }
   })
});
app.get("/delete/:id",function(req,res){
  var id=req.params.id;
  var sql=`delete from pg where id=${id};`;
  con.query(sql,function(err,results){
    if(err) throw err;
    else {
      return res.redirect("/oprofile");
    }
  })
});
////////////////////////////////////////////////////////////////////////////////

app.post("/addPg1",function(req,res){
   var name= req.body.name;
   var details= req.body.details;
   var address= req.body.address;
   var city= req.body.city;
   var state= req.body.state;
   var price= req.body.price;
   var pgtype= req.body.pgtype;
   var wifi = req.body.Wifi;
   var hotwater= req.body.hotwater;
   var food= req.body.food;
   var sql=`INSERT into pg(name,details,address,city,state,price,owner_id,pg_details,HotWater,Food,Wifi) value("${name}","${details}","${address}","${city}","${state}","${price}","${odetails.id}","${pgtype}","${hotwater}","${food}","${wifi}");`;
   con.query(sql,function( err,result){
     if(err) throw err;
     else
     {
       console.log("1 pg added");
       return res.redirect("/ohome");
     }
   });
   //
   //return res.redirect("/addpg");
});

app.post("/newuser",function(req,res){
    var first= req.body.first_name;
    var last= req.body.last_name;
    var contactnumber= req.body.contactnumber;
    var email_id= req.body.email;
    var pword= req.body.password;
    var reword= req.body.reword;
    var Age= req.body.age;
    console.log(first);
    if(pword==reword)
    {
      var sql=`INSERT into students(first_name,last_name,contact,email,password,age) values("${first}","${last}","${contactnumber}","${email_id}","${pword}","${Age}");`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        else
            console.log("1 record inserted");
        });
        return res.redirect("/login");
    }
    else {
      return res.redirect("/signup");
    }
});

app.post("/onewuser",function(req,res){
    var first= req.body.first_name;
    var last= req.body.last_name;
    var contactnumber= req.body.contactnumber;
    var email_id= req.body.email;
    var pword= req.body.password;
    var reword= req.body.reword;
    var Age= req.body.age;
    console.log(first);
    if(pword==reword)
    {
      var sql=`INSERT into owner(first_name,last_name,contact,email,pasword,age,total_flats) values("${first}","${last}","${contactnumber}","${email_id}","${pword}","${Age}",0);`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        else
            console.log("1 record inserted");
        });
        return res.redirect("/osign");
    }
    else {
      return res.redirect("/osignup");
    }
});

app.post("/profile1",function(req,res){
  var first= req.body.first_name;
  var last= req.body.last_name;
  var contactnumber= req.body.contact;
  var email_id= req.body.email;
  var Age= req.body.age;
  var city= req.body.city;
  var state= req.body.state;
  var id= stdetails.id;
  var sql=`UPDATE students set first_name='${first}', last_name='${last}', contact='${contactnumber}', email='${email_id}', age='${Age}', city='${city}', state='${state}' where id = ${id};`;
  con.query(sql, function(err, result){
    if(err) throw err;
    else
       console.log("1 record updated");
    return res.redirect("/profile");
  });
});

app.post("/oprofile1",function(req,res){
  var first= req.body.first_name;
  var last= req.body.last_name;
  var contactnumber= req.body.contact;
  var email_id= req.body.email;
  var Age= req.body.age;
  var id= odetails.id;
  var sql=`UPDATE owner set first_name='${first}', last_name='${last}', contact='${contactnumber}', email='${email_id}', age='${Age}' where id = ${id};`;
  con.query(sql, function(err, result){
    if(err) throw err;
    else
       console.log("1 record updated");
    return res.redirect("/oprofile");
  });
});

app.post("/login1",function(req,res){
    var email=req.body.email;
    var password=req.body.pass;
    var sql=`SELECT * from students where email="${email}" and password="${password}";`;
    con.query(sql, function(err, result, fields){
      if(err)
      {
        console.log("email or password is incorrect");
        return res.redirect("/login");
      }
      else
      {
          console.log(result[0].first_name);
          stdetails=result[0];
          return res.redirect("/home");
      }
    });
});

app.post("/osign1",function(req,res){
    var email=req.body.email;
    var password=req.body.pass;
    var sql=`SELECT * from owner where email="${email}" and pasword="${password}";`;
    con.query(sql, function(err, result, fields){
      if(err) throw err;
      else
      {
          console.log(result[0].first_name);
          odetails=result[0];
          return res.redirect("/ohome");
      }
    });
});

app.listen(8080,function()
{
    console.log("Server has started");
});
