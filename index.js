var express=require('express');
 var app=express();
 app.set('view engine','ejs');

//  var mysql=require('mysql');
 var session =require('express-session');
//  app.use(function(req,res,next){
//    res.set('cache-control','no-cache','private','must-revalidate','no-store');
// });
app.use(express.static(__dirname+"views"));

const user=require('./models/user');
const contact = require('./models/contact');

app.use(function (req, res, next) {
   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
   res.header('Expires', '-1');
   res.header('Pragma', 'no-cache');
   next()
});

const Joi = require('joi');
const schema = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email({ minDomainSegments:2, tlds: { allow: ['com','net'] } })
});

// const data = {
//     password: "123456",
//     email: "john@example.com"
// };

// const result = schema.validate(data);

// if(result.error) {
//     console.error(result.error.details);
// } else {
//     console.log("Data is valid");
// }



 var bodyParser=require('body-parser');
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());

//  var conn= mysql.createConnection({
//    host:'localhost',
//    user:'root',
//    password:'',
//    database:'blog'
// });

// conn.connect(function(err){
//    if(err) throw err;

//    console.log("connected..");
// });

 app.use(session({
   secret : 'secret',
   resave:true,
   saveUninitialized:true
}));

user.sync();
contact.sync();  


app.get('/login',function(req,res){
   if(req.session.loggedin){
    if(req.session.role=='admin'){
        res.redirect('admin');
    }else{
        res.redirect('user');

    }
       
   }else{
    res.render('login');

   }

  
}); 

 app.post('/addadmin', async (req, res) => {
   try {
     const email = req.body.email;
     const password = req.body.password;
     const role = 'admin';
 
     // Use Sequelize to create a new user
     await contact.create({
       user_email: email,
       user_password: password,
       role: role,
     });
 
     res.send("<h1>User successfully registered</h1>");
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.post('/adduser', async (req, res) => {
   try {
     const email = req.body.email;
     const password = req.body.password;
     const role = 'user';
 
     // Use Sequelize to create a new user
     await contact.create({
       user_email: email,
       user_password: password,
       role: role,
     });
 
     res.send("<h1>User successfully registered</h1>");
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.post('/login', async (req, res) => {
   try {
     const email = req.body.email;
     const password = req.body.password;
 
     if (email && password) {
       const user = await contact.findOne({
         where: {
           user_email: email,
           user_password: password,
         },
       });
 
       if (user) {
         req.session.loggedin = true;
         req.session.email = email;
 
         if (user.role === 'admin' && req.session.loggedin) {
           req.session.role = 'admin';
           res.redirect('/admin');
         } else {
           req.session.role = 'user';
           res.redirect('/user');
         }
       } else {
         res.send("<h1>Incorrect credentials</h1>");
       }
     } else {
       res.send("<h1>Missing email or password</h1>");
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.get('/admin', async (req, res) => {
   try {
     if (req.session.loggedin) {
       const users = await contact.findAll();

 
       res.render("admin.ejs", { data: users });
     } else {
       res.redirect('/login');
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.get('/user', async (req, res) => {
   try {
     if (req.session.loggedin) {
       const users = await contact.findAll();
 
       res.render("user.ejs", { data: users });
     } else {
       res.redirect('/login');
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.get('/', async (req, res) => {
   try {
     let add = 0; // Default value for 'add' variable
     if (req.session.loggedin) {
       add = 1;
     }
 
     const blogInfo = await user.findAll();
 
     res.render('blog.ejs', { data: blogInfo, add });
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });
 app.get('/edit_blog', async (req, res) => {
   try {
     const blogInfo = await user.findAll();
 
     res.render('edit_blog.ejs', { data: blogInfo });
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.get("/update-blog", async (req, res) => {
   try {
     const blogId = req.query.id;
     const blogInfo = await user.findOne({ where: { id: blogId } });
 
     if (blogInfo) {
       res.render("update_data.ejs", { result: blogInfo });
     } else {
       res.status(404).send("Blog not found");
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });
 app.post("/final-update", async (req, res) => {
   try {
     const id = req.body.id;
     const title = req.body.title;
     const img_url = req.body.img_url;
     const des = req.body.des;
 
     const blogInfo = await user.findByPk(id);
 
     if (blogInfo) {
       blogInfo.title = title;
       blogInfo.img_url = img_url;
       blogInfo.des = des;
 
       await blogInfo.save();
 
       res.redirect("/edit_blog");
     } else {
       res.status(404).send("Blog not found");
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });
 app.get('/update_data',function(req,res){
   res.render("update_data");
});

app.post('/create', async (req, res) => {
   try {
     const title = req.body.title;
     const img_url = req.body.img_url;
     const des = req.body.des;
 
     const newBlog = await user.create({
       title: title,
       img_url: img_url,
       des: des,
     });
 
     res.send("<h1>Successfully created</h1>");
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 app.get('/logout',function(req,res){
   req.session.destroy((err)=>{
       res.redirect('/');
   })
});

app.get('/delete-admin', async (req, res) => {
   try {
     const userId = req.query.id;
 
     // Assuming you have a Sequelize model for the "user" table
     const user = await contact.findByPk(userId);
 
     if (user) {
       await user.destroy();
       res.redirect('/admin');
     } else {
       res.status(404).send('User not found');
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 
 app.get('/delete-blog', async (req, res) => {
   try {
     const blogId = req.query.id;
 
     // Assuming you have a Sequelize model for the "blog_info" table
     const blogInfo = await user.findByPk(blogId);
 
     if (blogInfo) {
       await blogInfo.destroy();
       res.redirect('/edit_blog');
     } else {
       res.status(404).send('Blog not found');
     }
   } catch (error) {
     // Handle any errors here
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });

 
 app.get('/user',function(req,res){
   res.render('user');
});

app.get('/addadmin',function(req,res){
   res.render('addadmin');
});

app.get('/adduser',function(req,res){
   res.render('adduser');
});

app.get('/create',function(req,res){
  res.render('create');
});


app.get('/',function(req,res){
   res.render('blog');
});
 
 


//  app.get('/login',function(req,res){
//     res.render('login');
//  });

 var server =app.listen(4000,function(){
    console.log("port is running");
});