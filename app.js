if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}




const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const seedDB = require('./seed');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy  = require('passport-local');
const User = require('./models/user')

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Connection Open!!');
    })
    .catch((err)=>{
        console.log('Some Error');
        console.log(err);
    })

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret : 'qwerty',
    resave : false,
    saveUninitialized : true
}


app.use(session( sessionConfig ));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');



app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);



app.get('/',(req,res)=>{
    // res.send('Home Page');
    res.render('home');
})

app.get('/error',(req,res)=>{
    res.render('error');
})



var PORT = process.env.PORT || 2024;
app.listen(PORT,(req,res)=>{
    console.log(`Server Running at port ${PORT}`);
})