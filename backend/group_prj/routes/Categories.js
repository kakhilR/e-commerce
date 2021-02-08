const express = require('express');
const router = express.Router();
const Category = require('../models/categories.js')
const slugify = require('slugify');

router.post('/create/category',(req,res)=>{
    const categoryObj = {
        name:req.body.name,
        slug : slugify(req.body.name)
    }
    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }
    const catgory = new Category(categoryObj)
    catgory.save((err,data)=>{
        if(err) return res.status(400).json({err})
        if(data){
            return res.status(200).json({data})
        }
    });
})


router.get('/categorieslist',(req,res)=>{
    Category.find({}).then((err,categories)=>{
        if(categories){
            return res.status(200).json({categories})
        }
        if(err) return res.status(400).json({err})
    }).catch((err)=>{
        res.status(400).json({err})
    })
})

module.exports = router