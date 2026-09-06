"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import type { SortOrder } from "mongoose"

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

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : String(error);

export async function updateUser({userId
    ,username, name, bio, image, path
}:Props):Promise<void> {
    try{
        
    await connectToDB()
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
}catch(error: unknown){
    throw new Error(`Failed to create/update record, error:${getErrorMessage(error)}`)
}
}

export async function fetchUser(userId: string) {
    try{
        
    await connectToDB()
    return await User.findOne(
        {id:userId}
    )
    // .populate({
    //     path:"communities",
    //     model:"Community"
    // }
    // )
    //Todo: making calls 
    
}catch(error: unknown){
    throw new Error(`Failed to create/update record, error:${getErrorMessage(error)}`)
}
}
export async function fetchThreadsbyUser(userId: string){
    try{
        await connectToDB()
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
    catch(error: unknown){
    throw new Error(`Failed to fetch user's threads record, error:${getErrorMessage(error)}`)
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
        await connectToDB()
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        return await User.find({
            id: { $ne: userId },
            $or: [{ username: regex }, { name: regex }],
        })
            .sort({ name: sortby })
            .skip(skipAmount)
            .limit(pageSize)
            .exec();
    } catch (error: unknown) {
        throw new Error(`Failed to fetch users, error:${getErrorMessage(error)}`);
    }
}
