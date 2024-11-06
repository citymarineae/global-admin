"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';


type FormData = {
    username: string;
    password: string;
    newPassword: string;
}

const ChangeCredentials = () => {

    const router = useRouter()

    const [authenticated, setAuthenticated] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();


    const handleAuthentication = async (data: FormData) => {
        const formData = new FormData

        formData.append("username", data.username)
        formData.append("password", data.password)

        if (authenticated) {
            formData.append("newPassword", data.newPassword)
        }

        const response = await fetch('/api/authenticate-admin', {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            const data = await response.json()
            if (!data.reset) {
                toast.info(data.message)
                setAuthenticated(true)
            } else {
                toast.success(data.message)
                router.push('/admin/dashboard')
            }
        } else {
            toast.error("Invalid Credentials")
        }


    }


    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">City Marine Admin - Password Reset</h1>
            </div>
            <div className='mb-6'>
                <h3>Type in the credentials to reset your password</h3>
            </div>
            <form className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0" onSubmit={handleSubmit(handleAuthentication)}>
                {/* Left column */}
                <div className="lg:w-2/3 space-y-6">

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("username", { required: "username is required" })}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                        />
                        {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="title"
                            {...register("password", { required: "password is required" })}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                        />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>

                    {authenticated && <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            New password
                        </label>
                        <input
                            type="password"
                            id=""
                            {...register("newPassword", { required: "password is required" })}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                        />
                        {errors.newPassword && <p className='text-red-500'>{errors.newPassword.message}</p>}
                    </div>}

                    <div className='flex w-full justify-end'>
                        <button className='bg-blue-400 p-3 rounded-lg' type={'submit'}>{!authenticated ? "Authenticate" : "Change Password"}</button>
                    </div>

                </div>

                {/* Right column */}
                <div className="lg:w-1/3 space-y-6">
                    <div>
                        
                        <div
                            className={`w-full h-64 border-2  border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden`}
                        >
                            <img src="/logo/logo-dark.svg" alt="" style={{ width: "300px" }} />

                        </div>
                    </div>


                </div>
            </form>
        </main>
    )
}

export default ChangeCredentials