import mongoose from 'mongoose';

const collection = 'user';

const schema = mongoose.Schema({
    firstname:String,
    lastname:String,
    email:{
        type:String,
        Unique: true
    },
    age: Number,
    password: String,
    cart: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts',
    },
    role:{
        type:String,
        enum: ['user', 'premium','admin'],
        default:'user'
    },
    documents:{
        type:[{
            name: {
                type: String
                },
            reference: {
                type: String
                }
            }],
        default: []
    },
    last_connection:{
        type:Array,
        default: []
    }
})

const userModel = mongoose.model(collection, schema);
export default userModel;