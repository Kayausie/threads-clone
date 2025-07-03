"use server"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";
interface Params{
    text:string,
    author:string,
    communityId:string|null,
    path:string
}
export async function createThread({
text, author, communityId, path
}:Params){
    try{
     connectToDB();
    const createdThread = await Thread.create({
        text,
        author, 
        community:null,
    });
     //Update user model
     await  User.findByIdAndUpdate( author,{
        $push:{threads:createdThread._id} 
     })
     revalidatePath(path)
    }catch(error:any){
        throw new Error(`Error creating thread ${error.message}`)
    }
}
export async function fetchPosts(pageNumber = 1, pageSize = 2){
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const postQuery = Thread
        .find({parentId:{$in :[null, undefined]}})
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path:'author', model:User})
        .populate({
            path:'children',
            populate:{
                path:'author',
                model:User,
                select:"_id name parentId image "
            }
        })
        const totalPostCounts = await Thread.countDocuments({parentId:{$in :[null, undefined]}})
        const posts = await postQuery.exec();
        const isNext = totalPostCounts > (skipAmount + posts.length)
        return {posts, isNext}
    }catch(error:any){
        throw new Error(`Error fetching thread ${error.message}`)
    }
}

export async function fetchThreadbyId(id:string) {
    //Todo: populate community
    try{
        connectToDB();
        const thread = await Thread.findById(id)
        .populate({
            path:'author',
            model:User,
            select:"_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model:User,
                    select:"_id id name parentId image"
                },
                {
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:"_id id name parentId image"
                    }
                }
            ]
        }).exec();
        return thread
    }
    catch(e:any){
        throw new Error(`Error fetching thread by Id: ${e.message}`)
    }
}
export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path:string
){
    try {
        const originalThread =  await Thread.findById(threadId)
        if(!originalThread){
            throw new Error("Thread not found");
        
        }
        const commentThread = new Thread({
            text:commentText,
            parentId:threadId,
            author:userId
        })
        //Save the new thread 
        const savedCommentThread = await commentThread.save()
        //Update the original thread with new comment 
        originalThread.children.push(savedCommentThread._id)
        //Save the new children thread
        await originalThread.save();
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}