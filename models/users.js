const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({

    name: {
        type: String,

    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        default:""
    },
    date: {
        type: Date,
        default: Date.now()
    },

    googleID:{
        type:String,
        default:""
    },
    image:{
        type:String
    },
    firstUser:{
        type:Boolean,
        default:true
    }





});

mongoose.model("users", UserSchema);


