var express = require('express');
var router = express.Router();
var userModel = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

if(typeof localStorage === 'undefined' || localStorage === null){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* GET home page. */


function checkLogin(req, res, next){
  var myToken = localStorage.getItem('myToken');
  try{
    jwt.verify(myToken, 'loginToken');
  }catch(err){
    if(err){
      res.redirect('/');
    }
  }
  next();
}

function checkUsername(req, res, next) {
  var name = req.body.name;
  var checkexistuser = userModel.findOne({username:name});
  checkexistuser.then((data)=>{
    if(data){
      return res.render('signup', { title: 'Password management system', msg: 'username already exist'});
    }
    next();
  }).catch((err)=>{
    console.log(err);
  });
 
  }

  function checkPassCat(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var passCatName = req.body.passwordcategory;
    var checkexistPassCat = passCatModel.findOne({password_category:passCatName});
    checkexistPassCat.then((data)=>{
      if(data){
        return res.render('addNewCategory', { title: 'Password management system',error:'',loggedUserName:loggedUser, loggedUserId:loggedUserId , success: 'password category already exist'});
      }
      next();
    }).catch((err)=>{
      console.log(err);
    });
   
    }


function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexistemail = userModel.findOne({email:email});
  checkexistemail.then((data)=>{
    if(data){
      return res.render('signup', { title: 'Password management system', msg: 'email already exist'});
    }
    next();
  }).catch((err)=>{
    console.log(err);
  });

  }



router.get('/', function(req, res, next) {
  var loggedUser = localStorage.getItem('loginUserName');
  if(loggedUser){
    res.redirect('/dashboard');
  }
  else{
    res.render('index', { title: 'Password management system', msg:'' });
  }
});

router.post('/',function(req, res,next) {
  var username = req.body.email;
  var password = req.body.pass;
  var checkUser = userModel.findOne({email:username});
  checkUser.then((data)=>{
    if(data){
      var getUserID = data._id;
      var getUserName = data.username;
      var getPassword = data.password;
      if(bcrypt.compareSync(password,getPassword)){
        var token = jwt.sign({userID: getUserID}, 'loginToken');
        localStorage.setItem('myToken', token);
        localStorage.setItem('loginUser', username);
        localStorage.setItem('loginUserName', getUserName);
        res.redirect('/dashboard');
      }else{
        res.render('index', { title: 'Password management system', msg:'Inavlid password' });
      }
    }
    else{
      res.render('index', { title: 'Password management system', msg:'username does not exist' });
    }
  }).catch((err)=>{
    console.log(err);
  });
  
});



router.get('/signup', function(req, res, next) {
  var loggedUser = localStorage.getItem('loginUserName');
  if(loggedUser){
    res.redirect('/dashboard');
  }else{
    res.render('signup', { title: 'Password management system', msg: '' });
  }
});
router.post('/signup',checkUsername ,checkEmail, function(req, res, next) {
  var username = req.body.name;
  var email = req.body.email;
  var password = req.body.pass;
  var cpassword = req.body.Cpass;

if(password!=cpassword){
  res.render('signup', { title: 'Password management system', msg: 'password not matched'});
}else{
var password = bcrypt.hashSync(password,10);
var userdetails = new userModel({
  username: username,
  email: email,
  password: password
});

userdetails.save().then((resl)=>{
  res.render('signup', { title: 'Password management system', msg: 'user registered successfully'});
}).catch((err)=>{
if(err) throw err;
});
}

  
});


router.get('/signout',function(req, res, next) {
  localStorage.removeItem('myToken');
  localStorage.removeItem('loginUser');
  localStorage.removeItem('loginUserName');
  res.redirect('/');
});


module.exports = router;
