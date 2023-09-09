var mysql=require('mysql');
var conn= mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
 });
 const dotenv =require("dotenv");
 dotenv.config();
 
 conn.connect(function(err){
    if(err) throw err;
 
    console.log("connected..");
 });

 module.exports=connection;