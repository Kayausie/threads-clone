import mongoose, { mongo } from "mongoose";
import { unique } from "next/dist/build/utils";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    id:{type: String, required:true},
    username:{type: String,required:true, unique:true},
    name:{type: String, required:true},
    image:String,
    bio:String, 
    threads:[ 
        {
             type:mongoose.Schema.Types.ObjectId,
             ref: "Threads"
        }
    ],
    onboarded:{
        type:Boolean,
        default:false
    },
    communities:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Community"
        }
    ]
})
const User = mongoose.models.User||model('User', userSchema); 
export default User;