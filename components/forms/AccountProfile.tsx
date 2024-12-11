"use client"

import {useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { z } from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useDropzone } from "@uploadthing/react";
import mongoose from 'mongoose';
import User from '@/lib/models/user.model';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { start } from 'repl';

interface Props{
    user:{
        id:string;
        objectId:string;
        username:string;
        name:string;
        bio: string;
        image: string;
    };
    btnTitle:string;
}
const AccountProfile =({user, btnTitle}:Props)=>{
    const [files, setFiles] = useState<File[]>([])
    const pathname = usePathname()
    const router = useRouter()
    const { startUpload, routeConfig} = useUploadThing("media", {
        onClientUploadComplete: (response) => {
            console.log("Upload successful:", response);
            alert("Upload completed successfully!");
          },
          onUploadError: (error) => {
            console.error("Upload error:", error);
            alert("An error occurred during upload."+error);
          },
          onUploadBegin: ( file) => {
            console.log("Upload started for file:", file);
          },
        });
    const form = useForm<z.infer<typeof UserValidation>>({
        resolver:zodResolver(UserValidation),
        defaultValues:{
            profile_photo:user?.image||"",
            name:user?.name||"",
            username:user?.username||"",
            bio:user?.bio||"",
        }
    })
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
       
        const blob = values.profile_photo;
        const hasImageChanged = isBase64Image(blob)
        if(hasImageChanged){
           
                console.log("Starting upload...");
               const imgRes= await startUpload(files)// Does not return data directly
                console.log(imgRes)
            if(imgRes&&imgRes[0].url){
                values.profile_photo=imgRes[0].url
            }
        }
        await updateUser({userId:user.id
            ,username:values.username, name:values.name, bio:values.bio, image:values.profile_photo, path:pathname
        }) 
        if(pathname==='/profile/edit')
        {
            router.back()
        }else{
            router.push('/')
        }
        
        //TODO: Update User Profile

      }
    const handleImage=(e:ChangeEvent<HTMLInputElement>, fieldChange:(value:string)=>void)=>{
        e.preventDefault()
        const filereader= new FileReader()
        if(e.target.files && e.target.files.length>0){
            const file = e.target.files[0]
            setFiles(Array.from(e.target.files))
            if(!file.type.includes('image')) return;
            filereader.onload= async function (event) {
                const imageDataUrl = event.target?.result?.toString()||"";
                fieldChange(imageDataUrl)
            }
            filereader.readAsDataURL(file)
        }
    }
    return(
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
            control={form.control}
            name="profile_photo"
            render={({ field,fieldState }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                    {field.value?(
                        <Image
                        src={field.value}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain">

                        </Image>
                    ):(
                        <Image
                        src='/assets/profile.svg'
                        alt='profile photo'
                        width={24}
                        height={24}
                        className="object-contain">

                        </Image>
                    )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a profile photo"
                  className="account-form_image-input" 
                  onChange={(e)=>handleImage(e, field.onChange)}/>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-left text-base-semibold text-light-2">Name</FormLabel>
                <FormControl>
                  <Input 
                  type="text"
                  className="account-form_input no-focus" 
                  placeholder="Name" {...field} />
                </FormControl>
                
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-left text-base-semibold text-light-2">Username</FormLabel>
                <FormControl>
                  <Input 
                   type="text"
                   className="account-form_input no-focus"
                  placeholder="Username" {...field} />
                </FormControl>
                
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-left text-base-semibold text-light-2">Bio</FormLabel>
                <FormControl>
                  <Textarea 
                   rows={10}
                   className="account-form_input no-focus"
                  placeholder="Bio" {...field} />
                </FormControl>
                
              </FormItem>
            )}
          />
          {/* <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div>
                {files.length > 0 && (
                <button className='bg-primary-500 text-light-1' onClick={() => startUpload(files)}>
                    Upload {files.length} files
                </button>
                )}
            </div>
            <p className='text-light-1'>
            Drop files here!
            </p>
            </div> */}
          <Button type="submit" className="bg-primary-500">Submit</Button>
        </form>
      </Form>
    )   
}
export default AccountProfile;