const port = 4000;
const express = require("express");
const app= express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path= require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");

app.use(express.json());
app.use(cors());

//Database connection with Mongodb
mongoose.connect("mongodb+srv://KashyapK:Iamkash2272@cluster0.v8dhv.mongodb.net/e-commerce")

//Api creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image storage Engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for creating products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required : true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
    views: { 
        type: Number,
        default: 0,
    },
    likes: { 
        type: Number, 
        default: 0,
    },
})

app.post('/addproduct',async (req,res)=>  {
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id +1;
    }
    else{
        id=1;
    }
    const product =new Product({
            id: id,
            name:req.body.name,
            image:req.body.image,
            new_price:req.body.new_price,
            old_price:req.body.old_price,

        });
        console.log(product);
        await product.save();
        console.log("Saved");
        res.json({
            success:true,
            name:req.body.name,
        })
})

//creating api for deleting product

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})
//creating endpoint for newcollection data
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched")
    res.send(newcollection);
})

//creating endpoint for popular 
app.get('/popular', async (req, res) => {
    let products = await Product.find({}).sort({ views: -1 }).limit(10);
    console.log("Popular products fetched");
    res.send(products);
});




//creating middelware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid token"});
    }
    else{
        try{
            
            const data= jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errros:"Please authenticate using a Valid token"})
        }
    }
}

//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})   
    res.send("Added")  
})

//creating endpoint to remove product from cart Data
app.post('/removefromcart',fetchUser,async (req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
   if( userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})   
    res.send("Reoved")
})
//creating api to get cartdata (after relogin )
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Getcart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

//creating API for getting all products
app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched");
    res.send(products);
},)

//schema creating for user module

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
            type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },

})

//Creating Endpoint for registering the user

app.post('/signup',async(req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Exsting User Found With Same Email Id"})
    }
    let cart = {};

    for(let i=0;i<300;i++){
        cart[i]=0;
    }
const user = new Users({
    name:req.body.name,
    password:req.body.password,
    email:req.body.email,
    cartData:cart,

})
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// API for incrementing views when a product page is opened
app.post('/incrementviews', async (req, res) => {
    const { id } = req.body;
    try {
        let product = await Product.findOne({ id });
        if (product) {
            product.views += 1; // Increment views
            await product.save(); // Save updated product
            console.log(`Views incremented for product ${id}`);
            res.json({ success: true, message: `Views incremented for product ${id}` });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error incrementing views:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// creating endpoint for userlogin
app.post('/login',async (req,res)=>{
    let user =await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong Email Id"})
    }
})

// API to like a product
app.post('/like', async (req, res) => {
    const { id } = req.body; // Product ID from the request body

    try {
        const product = await Product.findOne({ id });
        if (product) {
            product.likes += 1; // Increment likes
            await product.save(); // Save updated product
            console.log(`Likes incremented for product ${id}`);
            res.json({ success: true, message: `Product ${id} liked successfully`, likes: product.likes });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error liking the product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// API to fetch most liked products
app.get('/mostliked', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ likes: -1 }).limit(10); // Top 10 most liked
        console.log("Most liked products fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching most liked products:", error);
        res.status(500).send("Server error");
    }
});


app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port "+port)
    }
    else{
        console.log("Error " + error);
    }
})