var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
//display login page
router.get('/', function(req, res, next){    
// render to views/user/add.ejs
res.render('auth/login', {
title: 'Login',
EmailId: '',
password: ''     
})
})
//authenticate user
router.post('/authentication', function(req, res, next) {
var EmailId = req.body.email;
var Password = req.body.password;
connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [EmailId, Password], function(err, rows, fields) {
if(err) throw err
// if user not found
if (rows.length <= 0) {
req.flash('error', 'Please correct enter email and Password!')
res.redirect('/login')
}
else { // if user found
// render to views/user/edit.ejs template file
req.session.loggedin = true;
req.session.name = name;
res.redirect('/home');
}            
})
})
//display login page
router.get('/register', function(req, res, next){    
// render to views/user/add.ejs
res.render('auth/register', {
title: 'Registration Page',
FirstName:'',
Lastname: '',
OrganizationName:'',
EmailId: '',
password: ''    
})
})
// user registration
router.post('/post-register', function(req, res, next){    
req.assert('FirstName', 'Name is required').notEmpty()           //Validate name
req.assert('LastName', 'Last is required').notEmpty()           //Validate name
req.assert('OrganizationName', 'OrganizationName is required').notEmpty()   //OrganizationName Validate name
req.assert('EmailId', 'A valid EmailId is required').isEmail()  //Validate email
req.assert('password', 'Password is required').notEmpty()   //Validate password
var errors = req.validationErrors()
if( !errors ) {   //No errors were found.  Passed Validation!
var user = {
FirstName: req.sanitize('FirstName').escape().trim(),
LastName: req.sanitize('LastName').escape().trim(),
OrganizationName: req.sanitize('OrganizationName').escape().trim(),
EmailId: req.sanitize('EmailId').escape().trim(),
password: req.sanitize('password').escape().trim()
}
connection.query('INSERT INTO users SET ?', user, function(err, result) {
//if(err) throw err
if (err) {
req.flash('error', err)
// render to views/user/add.ejs
res.render('auth/register', {
title: 'Registration Page',
FirstName: '',
LastName:'',
OrganizationName:'',
Password: '',
Emailid: ''                   
})
} else {                
req.flash('success', 'You have successfully signup!');
res.redirect('/login');
}
})
}
else {   //Display errors to user
var error_msg = ''
errors.forEach(function(error) {
error_msg += error.msg + '<br>'
})                
req.flash('error', error_msg)        
/**
* Using req.body.name 
* because req.param('name') is deprecated
*/
res.render('auth/register', { 
title: 'Registration Page',
FirstName: req.body.FirstName,
LastName: req.body.LastName,
OrganizationName: req.body.OrganizationName,
EmailId: req.body.EmailId,
password: ''
})
}
})
//display home page
router.get('/home', function(req, res, next) {
if (req.session.loggedin) {
res.render('auth/home', {
title:"Dashboard",
FirstName: req.session.FirstName,
LastName: req.session.LastName,     
OrganizationName: req.session.OrganizationName,
});
} else {
req.flash('success', 'Please login first!');
res.redirect('/login');
}
});
// Logout user
router.get('/logout', function (req, res) {
req.session.destroy();
req.flash('success', 'Login Again Here');
res.redirect('/login');
});
module.exports = router;