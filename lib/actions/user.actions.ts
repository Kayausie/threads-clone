"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import path from "path"
import Thread from "../models/thread.model"
import { SortOrder } from "mongoose"

interface Props{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,
}
interface UserSearchProps{
    userId:string,
    searchString?:string,
    pageNumber?:number,
    pageSize?:number,
    sortby?:SortOrder
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
export async function fetchThreadsbyUser(userId:String){
    try{
        connectToDB()
        const threads = await User.findOne(
            {id:userId}
        )
        .populate({
            path:'threads',
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'name image id'
                }
        }
    })
        .exec()
        return threads
    }
    catch(error:any){
    throw new Error(`Failed to fetch user's threads record, error:${error.message}`)
}
}
export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortby = "desc"
}:UserSearchProps){
    try {
        connectToDB()
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i')
        const query = {
            id: {$ne:userId},

        }
    } catch (error) {
        
    }
}