"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
    phone: string
    fax: string
    map: string
    address: string
}

type ContactData = {
    _id:string
    phone:string
    fax:string
    map:string
    address:string
  }

const ContactSection = ({ editMode }: { editMode?: boolean }) => {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`/api/contact-us`);
                if (response.ok) {
                    const data = await response.json();
                    setValue("phone", data[0].phone)
                    setValue("fax", data[0].fax)
                    setValue("map", data[0].map)
                    setValue("address", data[0].address)
                    if(data[0].map){
                        setPreviewMap(true)
                        setContactData(data[0])
                    }
                } else {
                    console.error("Failed to fetch contact data");
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
            }finally{
                setLoading(false)
            }
        };

        fetchContactData();
    }, []);


    const [previewMap, setPreviewMap] = useState(false)
    const [contactData,setContactData] = useState<ContactData | null>(null)
    const [loading,setLoading] = useState(true)

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("phone", data.phone);
        formData.append("fax", data.fax);
        formData.append("map", data.map);
        formData.append("address", data.address);

        try {
            const url = `/api/contact-us?id=${contactData?._id}`;
            const method = "PUT";
            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                alert("updated contact us successfully")
                router.push('/admin/contact-us')
            } else {
                throw new Error("Failed to save contact us");
            }
        } catch (error) {
            console.error("Error updating contact:", error);
            alert("Failed to update contact. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">City Marine Contact Page</h1>
                {!editMode && <Link
                    href="/admin/contact-us/edit-contact-us"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Edit Contact Us
                </Link>}
            </div>
            {loading ? (
                <div>Loading content......</div>
            ) : (
                <form className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0" onSubmit={handleSubmit(onSubmit)}>
                {/* Left column */}
                <div className="lg:w-2/3 space-y-6">

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Current phone number
                        </label>
                        <input
                            type="text"
                            id="title"
                            readOnly={!editMode}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            {...register("phone", { required: "Phone is required" })}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Current fax number
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("fax", { required: "Fax is required" })}
                            readOnly={!editMode}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        {errors.fax && <p className="mt-1 text-sm text-red-600">{errors.fax.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Current address
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("address", { required: "Address is required" })}
                            readOnly={!editMode}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    </div>

                    {editMode && <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Current map
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("map", { required: "Map is required" })}
                            readOnly={!editMode}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        {errors.map && <p className="mt-1 text-sm text-red-600">{errors.map.message}</p>}
                    </div>}


                </div>

                {/* Right column */}
                <div className="lg:w-1/3 space-y-6">
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                            Map
                        </label>
                        <div
                            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden"
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document?.getElementById("image")?.click()}
                        >
                            {previewMap ? (
                                <div className="relative w-full h-full">
                                    <iframe
                                        src={contactData ? contactData.map : ""}
                                        width="600"
                                        height="300"
                                        style={{ border: 0 }}
                                        className="d-block"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            ) : (
                                <>
                                    <p className="mt-1 text-sm text-gray-600">{editMode && (previewMap ? "Drag and drop an image here, or click to select a file" : "No map to display")}</p>
                                </>
                            )}
                        </div>

                    </div>

                    {editMode && <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isSubmitting ? "Updating..." : "Update Claims"}
                        </button>
                    </div>}

                </div>
            </form>
            )}
            
        </main>
    )
}

export default ContactSection