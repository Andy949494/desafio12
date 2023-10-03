import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'user';

const schema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:{
        type:String,
        Unique: true
    },
    age: Number,
    password: String,
    cart: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts',
        default: []
    }],
    role:{
        type:String,
        enum: ['user', 'premium','admin'],
        default:'user'
    },
    documents: [{
        name: [String],
        reference: [String],
    }],
    last_connection:{
        type: Date,
        default: null
    }
})

schema.plugin(mongoosePaginate);
const userModel = mongoose.model(collection, schema);
export default userModel;