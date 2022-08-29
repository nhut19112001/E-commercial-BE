const mongoose = require('mongoose');

const connectDB = async () => {
    try {
     const conn= await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('MongoDB connected');
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  };

module.exports = { connectDB }
