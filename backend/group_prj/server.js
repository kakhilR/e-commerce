const express = require('express');
const db = require('./config/keys').MONGOURI
const mongoose = require('mongoose');


const app = express();

//port
const PORT = process.env.PORT ||4000;

//middleware
app.use(express.json());

//database connection
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true})
.then(()=>{console.log('database connected')})
.catch(err=>console.log(err.message));

//routers
const adminauthRouter = require('./routes/adminauth.js')
const userauthRouter = require('./routes/userauth.js')
const categoryRouter = require('./routes/Categories.js')
const productRouter = require('./routes/product.js')
app.use('/api',adminauthRouter)
app.use('/api',userauthRouter)
app.use('/api',categoryRouter)
app.use('/api',productRouter)



app.listen(PORT,()=>{console.log(`server listining at ${PORT}`)})