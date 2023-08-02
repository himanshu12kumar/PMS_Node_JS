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
    var perPage = 5;
    var page = req.params.page || 1;
  
    var getPassDetail = passModel.find({});
    getPassDetail.skip((perPage * page)-perPage).limit(perPage).then((data)=>{
        passModel.countDocuments({}).then((count)=>{
          res.render('view-all-password', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId, records: data,current: page, pages: Math.ceil(count / perPage)});
        }); 
      }).catch((err)=>{
        console.log(err);
      });
  });
  
  
  router.get('/:page',checkLogin, function(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var perPage = 2;
    var page = req.params.page || 1;
  
    var getPassDetail = passModel.find({});
    getPassDetail.skip((perPage * page)-perPage).limit(perPage).then((data)=>{
        passModel.countDocuments({}).then((count)=>{
          res.render('view-all-password', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId, records: data,current: page, pages: Math.ceil(count / perPage)});
        }); 
      }).catch((err)=>{
        console.log(err);
      });
  });


  module.exports = router;
