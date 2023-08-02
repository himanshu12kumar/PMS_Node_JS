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
    var getPassCat = passCatModel.find({});
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    getPassCat.then((data)=>{
      res.render('password_category', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId , records: data});
    }).catch((err)=>{
      console.log(err);
    });
  });
  
  router.get('/delete/:id',checkLogin, function(req, res, next) {
    var passcat_id = req.params.id;
    var passDeleted = passCatModel.findByIdAndDelete(passcat_id);
    passDeleted.then((data)=>{
      res.redirect('/passwordCategory');
    }).catch((err)=>{
      console.log(err);
    });
  });
  
  router.get('/edit/:id',checkLogin, function(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var getpassCategory = passCatModel.findById(passcat_id);
    getpassCategory.then((data)=>{
      res.render('edit_pass_category', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId ,error:'',success:'', records: data, id:passcat_id});
    }).catch((err)=>{
      console.log(err);
    });
  });
  
  
  router.post('/edit',checkLogin, function(req, res, next) {
    var loggedUser = localStorage.getItem('loginUserName');
    var loggedUserId = localStorage.getItem('loginUser');
    var passcat_id = req.body.id;
    var passCatName = req.body.passwordcategory;
    var updatepassCat = passCatModel.findByIdAndUpdate(passcat_id,{password_category:passCatName});
    updatepassCat.then((data)=>{
      res.redirect('/passwordCategory');
    }).catch((err)=>{
      console.log(err);
    });
  });
  


  module.exports = router;
