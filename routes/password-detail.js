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
    res.redirect('/dashboard');
   });
   
   router.get('/edit/:id',checkLogin, function(req, res, next) {
     var loggedUser = localStorage.getItem('loginUserName');
     var loggedUserId = localStorage.getItem('loginUser');
     var id = req.params.id;
     var getPassDetail = passModel.findById(id);
     getPassDetail.then((data)=>{
         if(data){
           var getPassCat = passCatModel.find({});
           getPassCat.then((data1)=>{
             if(data1){
               res.render('edit_password_detail', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId,records:data1, record: data, success:'', id:id });
               }
           }).catch((err)=>{
             console.log(err);
           });
           }
       }).catch((err)=>{
         console.log(err);
       });
    });
   
   
    router.post('/edit/:id',checkLogin, function(req, res, next) {
     var loggedUser = localStorage.getItem('loginUserName');
     var loggedUserId = localStorage.getItem('loginUser');
     var id = req.params.id;
     var passcat = req.body.pass_cat;
     var project_name = req.body.project_name;
     var pass_detail = req.body.pass_detail;
     var passdetailupdate = passModel.findByIdAndUpdate(id, {password_category:passcat,project_name:project_name,password_detail:pass_detail});
     passdetailupdate.then((resl)=>{
     var getPassDetail = passModel.findById(id);
     getPassDetail.then((data)=>{
         if(data){
           var getPassCat = passCatModel.find({});
           getPassCat.then((data1)=>{
             if(data1){
               res.render('edit_password_detail', { title: 'Password management system',loggedUserName:loggedUser, loggedUserId:loggedUserId,records:data1, record: data, success:'Detail updated successfully', id:id });
               }
           }).catch((err)=>{
             console.log(err);
           });
           }
       }).catch((err)=>{
         console.log(err);
       });
     }).catch((err)=>{
       console.log(err);
     });
    });
   
   
    router.get('/delete/:id',checkLogin, function(req, res, next) {
     var passcat_id = req.params.id;
     var passDeleted = passModel.findByIdAndDelete(passcat_id);
     passDeleted.then((data)=>{
       res.redirect('/view-all-password');
     }).catch((err)=>{
       console.log(err);
     });
   });
   


  module.exports = router;
