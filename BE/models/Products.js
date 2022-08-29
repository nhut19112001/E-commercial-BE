const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
    name:{type: String,unique: true, trim:true, require:[true,'Name must be required.']},
    price:{type: Number,trim:true,require:[true,"price required"]},
    type:{type:String,trim:true,require:[true,'Type required']},
    material:{type:String,trim:true},
    uses:{type:String,trim:true},
    includes:{type:String,trim:true},
    origin:{type:String,trim:true},
    imgLink:{type:String,trim:true}
},{timestamps:true})
   

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

