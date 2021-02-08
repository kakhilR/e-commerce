const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');



router.get('/protected',(req,res)=>{
    res.send('hello')
})

router.post('/signup',(req,res)=>{
    const {
        name,
        email,
        password,} = req.body;
    if(!email || !password ||!name){
        return res.status(400).json({error:"all fileds are required"})
    }
    User.findOne({email:req.body.email}).then((user) => {
        if(user){
            return res.status(400).json({error:"user already exists"})
        }
        bcrypt.hash(password,10).then(hashedpassword=>{
            const _user = new User({
                email,
                password:hashedpassword,
                name,
                role:'user'});
            _user.save().then(data=>{
                return res.status(200).json(data)
            }).catch(err=>{
                return res.status(401).json({error:err.message})
            })

        })
    }).catch((err) =>{return res.status(401).json(err.message)})
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email|| !password){
        return res.status(422).json({error:"please enter a valid email or password"})
    }
    User.findOne({email:email}).then((user)=>{
        if(!user){
            return res.status(422).json({message:"invalid email or password"})
        }
        bcrypt.compare(password,user.password).then(doMatch=>{
            if(doMatch && user.role == 'user'){
                // return res.status(200).json({message:"sucessfully logged in "})
                const token = jwt.sign({_id: user.id,role:user.role},"secret",{expiresIn:'1h'});
                
               return  res.status(200).json({token});
            }
            else{
                return res.status(401).json({message:"invalid email or password"})
            }
        })
    }).catch(err=>{
        return res.status(400).json(err.message)
    })
})

router.get('/users/list', (req, res)=>{
    
})

module.exports = router