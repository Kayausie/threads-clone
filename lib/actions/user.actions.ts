"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import path from "path"

interface Props{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,
}

export async function updateUser({userId
    ,username, name, bio, image, path
}:Props):Promise<void> {
    try{
        
    connectToDB()
    await User.findOneAndUpdate(
        {id:userId},
        {
            username,
            name,
            bio,
            image,
            onboarded:true
        },
        {upsert:true}
    )
    //Todo: making calls 
    if(path === '/profile/edit'){
        revalidatePath(path)
    }
}catch(error:any){
    throw new Error(`Failed to create/update record, error:${error.message}`)
}
}

export async function fetchUser(userId
:String) {
    try{
        
    connectToDB()
    return await User.findOne(
        {id:userId}
    )
    // .populate({
    //     path:"communities",
    //     model:"Community"
    // }
    // )
    //Todo: making calls 
    
}catch(error:any){
    throw new Error(`Failed to create/update record, error:${error.message}`)
}
}
