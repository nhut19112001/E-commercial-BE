//dotenv
require('dotenv').config();

//connect DB
const{connectDB} = require('./configs/db')

connectDB();

const express = require('express');
const app = express();
const cors= require('cors');

// Import Routes
const productRoute = require('./routes/productRoute');
const paymentRoute = require('./routes/paymentRoute')
const port = 5000;

//cors
app.use(cors());

// Body Parser
app.use(express.json());

//Mount the route
app.use('/api/v1/product',productRoute);
app.use('/api/v1/payment',paymentRoute);

app.listen(process.env.PORT||port,()=>{
    console.log(`Server is running on ${port}`);
})