import { currentUser } from "@clerk/nextjs/server";
import ProfileHeader from "@/components/shared/ProfileHeader";
import {redirect} from "next/navigation"; 
import ThreadsTab from "@/components/shared/ThreadsTab";
import Image from "next/image";
import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { profileTabs } from "@/constants";
export default async function Page({params}:{params:{id:string}}){
    const user = await currentUser();
    if(!user) return null
    const userInfo = await fetchUser(params.id)
    if(!userInfo) redirect('/onboarding ')
   
}