const express = require('express');
const router = express.Router();
const Product = require('../models/product.js')
const { requiresignin,userPermission } = require("../middlewares/token.js")
const shortid = require('shortid');
const multer = require('multer');
// const upload = multer({dest:'uploads/'});
const path = require('path');
// const slugify = require('slugify')


const storage = multer.diskStorage({
    destination :function(req,file,cb){
        cb(null,path.join(path.dirname(__dirname),'uploads'))
    },
    filename:function (req,file,cb){
        cb(null, shortid.generate() + '-'+file.originalname)
    }
})

const upload = multer({ storage });

router.post("/create/product",upload.array('productPicture'),(req,res)=>{
    // res.status(200).json({file:req.files,body:req.body});
    const {ProductName,description,Category,CreatedBy,productsDateofPurchase} = req.body;
 
    let ProductPictures = [];

    if(req.files.length > 0){
        ProductPictures = req.files.map(file =>{ 
            return { img :file.filename }
        })
    }
    // ProductPictures

    const product = new Product({
        ProductName : req.body.ProductName,
        // slug :  slugify(req.body.ProductName),
        description:req.body.description,
        Category,
        CreatedBy:req.user._id,
        ProductPictures:req.body.ProductPictures,
        productsDateofPurchase:req.body.productsDateofPurchase
    })
    product.save().then((error,product)=>{
        if(error) return res.status(400).json({message:error})
        if(product){
            return res.status(200).json({product})
        }

    }).catch(err=>{ return res.status(400).json({err})})
})


router.get('/products/list', (req, res)=>{ 
    Product.find({}).then((error, products)=>{
        if(error) return res.status(400).json({error});
        if(products){
            return res.status(200).json({products});
        }
    })

})



module.exports = router