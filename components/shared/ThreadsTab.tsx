import { fetchThreadsbyUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"

interface ThreadsTabProps{
    currentUserId:string,
    accountId:string,
    accountType:string 
}

interface ThreadItem {
    _id: string;
    parentId: string | null;
    text: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        name: string;
        id: string;
        image: string;
    } | null;
    createdAt: string;
    children: {
        author: {
            image: string;
        };
    }[];
}

async function ThreadsTab({currentUserId, accountId, accountType}:ThreadsTabProps) {
    const result = await fetchThreadsbyUser(accountId)
    if(!result) redirect('/')
     return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: ThreadItem)=>(
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
