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


  router.get('/',checkLogin, function(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var getPassCat = passCatModel.find({});
    getPassCat.then((data)=>{
      if(data){
        res.render('add_new_password', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId, records:data,success:'' });
      }
    }).catch((err)=>{
      console.log(err);
    });
   });
  
  
   router.post('/',checkLogin, function(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var passCat = req.body.pass_cat;
    var passDetail = req.body.pass_detail;
    var proname = req.body.project_name;
    var password_details = new passModel({
      password_category:passCat,
      password_detail:passDetail,
      project_name:proname
    });
    password_details.save().then((resl)=>{
      var getPassCat = passCatModel.find({});
      getPassCat.then((data)=>{
        if(data){
          res.render('add_new_password', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId, records:data, success:"Password details inserted successfuly" });
          }
      }).catch((err)=>{
        console.log(err);
      });
    }).catch((err)=>{
    if(err) throw err;
    });
   });


  module.exports = router;
