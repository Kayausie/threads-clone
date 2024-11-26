import { UserButton } from "@clerk/nextjs";
import { SignOutButton } from '@clerk/nextjs'
export default function Page(){
    return(
        <main>
            <h1 className="head-text">
                Onboarding
            </h1>
            <UserButton/>
            <SignOutButton>
      <button style={{color:'white'}}>Sign out</button>
    </SignOutButton>
        </main>
    )
}