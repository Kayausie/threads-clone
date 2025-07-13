"use client"
import Link from "next/link"
import { SignedIn, SignOutButton, useAuth} from "@clerk/nextjs"
import Image from "next/image"
import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
function Leftsidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const {userId}= useAuth();
    return(
       <section className="custom-scrollbar leftsidebar">
        <div className="flex w-full flex-1 flex-col gap-6 px-6">
            {sidebarLinks.map((link)=>
                {
                    const isActive = ((pathname.includes(link.route)&&link.route.length>1)||pathname===link.route)
                    const href = link.route === "/profile" ? `/profile/${userId}` : link.route;
                    
                return(
                <Link
                href={href}
                key={link.label}
                className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
                    <Image src={link.imgURL} alt={link.label} width={24} height={24} style={{
          filter: isActive
            ? "invert(95%) sepia(7%) saturate(239%) hue-rotate(180deg)"
            : "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg)",
        }}/>
                    <p className={`${isActive? 'text-dark-1':'text-light-1'} max-lg:hidden`}>{link.label}</p>
                </Link>
                )}
            )}
        </div>
        
        <div className="mt-10 px-6">
        <SignedIn>
                    <SignOutButton >
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src="/assets/logout.svg" alt="logout" width={24} height={24}/>
                            <p className="text-light-2 max-lg:hidden">
                            Logout
                        </p>
                        </div>
                    </SignOutButton>
                </SignedIn>
        </div>
       </section>
    )
}
export default Leftsidebar