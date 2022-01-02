const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const {isLoggedIn} = require('../middleware');



//Get all the product
router.get('/products',async(req,res)=>{
    // res.send('Index page');
    const products = await Product.find({});
    res.render('products/index',{products});
});

//Get the new form to create new product
router.get('/products/new',(req,res)=>{
    res.render('products/new');
});

// create a new product with the given payload
router.post('/products',isLoggedIn,async(req,res)=>{

    const newProduct = {
        ...req.body
    }

    await Product.create(newProduct);

    req.flash('success', 'Successfully created your Product!!');

    res.redirect('/products');

})

// Show a particular product
router.get('/products/:id',async(req,res)=>{
    
    try{
        const {id} = req.params;

        // inflating the foundproduct with the review using populate
        const product = await Product.findById(id).populate('reviews');
        // console.log(product);
        res.render('products/show',{product});
    }
    catch(e){
        req.flash('error','oops,something went wrong');
        res.redirect('/error');
    }

});

//Get the new form to Edit product
router.get('/products/:id/edit',isLoggedIn,async(req,res)=>{
    try{
        const {id} = req.params;

        const product = await Product.findById(id);
    
        res.render('products/edit',{product});
    }
    catch(e){
        req.flash('error','oops,something went wrong');
        res.redirect('/error');
    }

});

// Edit a new product with the given payload
router.patch('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        const updatedProduct = req.body;

        const {id} = req.params;
    
        await Product.findByIdAndUpdate(id,updatedProduct);
    
        res.redirect(`/products/${id}`);
    }
    catch(e){
        req.flash('error','oops,something went wrong');
        res.redirect('/error');
    }
   

})

// Delete a Particular product
router.delete('/products/:id',async(req,res)=>{
    try{
        const {id} =req.params;
        await Product.findOneAndDelete(id);
    
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','oops,something went wrong');
        res.redirect('/error');
    }
   

})

// Create review of Each Product
router.post('/products/:id/review',isLoggedIn, async(req,res)=>{

    try{
        const {id} =req.params;
        const product = await Product.findById(id);
        // console.log(req.body);
        
        const { rating, comment } = req.body;
    
        const review = new Review({ rating, comment ,user:req.user.username});
        // console.log(review);
    
        product.reviews.push(review);
    
        await product.save();
        await review.save();
    
        req.flash('success', 'Successfully created your review!!');
    
        res.redirect(`/products/${id}`)
    }
    catch(e){
        req.flash('error','oops,something went wrong');
        res.redirect('/error');
    }

})



module.exports = router;