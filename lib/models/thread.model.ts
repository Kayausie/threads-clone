import mongoose   from "mongoose";
import { unique } from "next/dist/build/utils";
const { Schema, model } = mongoose;

const threadSchema = new Schema({
    text:{type:String,required:true },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    createdAt:{
        type:Date,
        default:Date.now,

    },
    parentId:{
        type:String
    },
    children:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }]
})
const Thread = mongoose.models.Thread||model('Thread', threadSchema); 
export default Thread; 