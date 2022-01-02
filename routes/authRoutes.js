const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');





// router.get('/fakeuser',async(req,res)=>{
//     const user = new User({
//         username : 'Aman',
//         email: 'amanr3085@gmail.com' 
//     });

//     const newUser = await User.register(user,'aman12');

//     res.send(newUser);
// })

// Get the signUp form
router.get('/register',async(req,res)=>{
    res.render('auth/signup');
})

//Register the new User In DB
router.post('/register',async(req,res)=>{

    try{
        const {username,email,password} = req.body;
        const user = new User({
            username :username,
            email: email
        })
    
        await User.register(user,password);
        //  console.log(req.body);
        //  res.send('Post req');
        req.flash('success',`Welcome ${username},Please Login to continue`);
         res.redirect('/products');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/error');
    }
 
})


// get Login page
router.get('/login',(req,res)=>{
    res.render('auth/login');
})

router.post('/login',
    passport.authenticate('local',
        { failureRedirect: '/login', 
          failureFlash:true
        }),
    (req,res)=>{
            const {username} = req.user;
            req.flash('success',`Welcome Back Again! ${username}`)
            res.redirect('/products');
    })                      

//logout
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success','Logged out Successfully!!');
    res.redirect('/login');
})








module.exports = router;