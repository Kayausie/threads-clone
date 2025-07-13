import { fetchThreadsbyUser } from "@/lib/actions/user.actions"
// import Thread from "@/lib/models/thread.model"
import  Thread  from "@/lib/models/thread.model"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { Model } from "mongoose"
interface ThreadsTabProps{
    currentUserId:string,
    accountId:string,
    accountType:string 
}
async function ThreadsTab({currentUserId, accountId, accountType}:ThreadsTabProps) {
    let result = await fetchThreadsbyUser(accountId)
    if(!result) redirect('/')
     return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread:any)=>( 
                    <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId?currentUserId:''}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType ==='User'? {name:result.name, image:result.image, id:result.id}:
                       {name:thread.author.name, image:thread.author.image, id:thread.author.id} 
                    }
                    community={thread.community} //todo
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    />
                )
            )}
        </section>
     )
}
export default ThreadsTab;