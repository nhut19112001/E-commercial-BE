const Product = require('../models/Products');

// Get all products
exports.getAllProduct = async (req, res, next)=> {
    try {
        const products = await Product.find({})
        res.status(200).json({
            status: 'success',
            results: products.length,
            data:{products}
        })
    } catch (error){
        res.json(error)
    }
}

