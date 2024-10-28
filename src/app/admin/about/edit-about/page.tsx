"use client"

import React, { useEffect, useState } from 'react'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Image from "next/image";

type FormData = {
    pageHeading: string;
    description: string;
    contentHeading: string;
    content: string;
};

type aboutDataType = {
    id: string
    pageHeading: string
    description: string
    contentHeading: string
    content: string
    image?: string
}


const EditAbout = () => {
    const {
        register,
        handleSubmit,
        formState: {},
        setValue,
    } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const router = useRouter();


    const [aboutData, setAboutData] = useState<aboutDataType | null>(null)


    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch(`/api/about`);
                if (response.ok) {

                    const data = await response.json();
                    if (data.about[0]) {

                        console.log(data.about[0].id)
                        setAboutData(data.about[0])

                        setValue("pageHeading", data.about[0].pageHeading);
                        setValue("description", data.about[0].description);
                        setValue("content", data.about[0].content);
                        setValue("contentHeading", data.about[0].contentHeading)

                        if (data.about[0].image) {
                            setPreviewImage(data.about[0].image as string);
                        }
                    }

                } else {
                    console.error("Failed to about data");
                }
            } catch (error) {
                console.error("Error fetching about data:", error);
            }
        }

        fetchAboutData()
    }, [setValue])


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate the image file type
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                setImageError("Please select an image file (JPEG, PNG, or GIF)");
                return;
            }

            // Validate the image file size
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setImageError("Image file size must not exceed 10MB");
                return;
            }

            setImageFile(file);

            setImageError(null); // Reset error message if there was one

            // Generate the preview image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
            setImageFile(null);
        }
    };


    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("pageHeading", data.pageHeading);
        formData.append("description", data.description);
        formData.append("content", data.content);
        formData.append("contentHeading", data.contentHeading);

        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (aboutData) {
                const url = `/api/about?id=${aboutData.id}`;
                const method = "PUT";
                const response = await fetch(url, {
                    method: method,
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json()
                    alert(data.message)
                    router.push('/admin/about')
                } else {
                    throw new Error("Failed to save about");
                }
            }

            return;

        } catch (error) {
            console.error("Error editing about:", error);
            alert("Failed to edit about. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminPanelLayout currentPage="/admin/about">
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">City Marine Edit About Page</h1>
                    {/* <Link
                        href="/admin/news/add-news"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit About
                    </Link> */}
                </div>
                <form className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0" onSubmit={handleSubmit(onSubmit)}>
                    {/* Left column */}
                    <div className="lg:w-2/3 space-y-6">

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Page title
                            </label>
                            <input {...register("pageHeading", { required: "Pageheading is required" })}
                                type="text"
                                id="title"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <input {...register("description", { required: "Title is required" })}
                                type="text"
                                id="title"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Content Title
                            </label>
                            <input {...register("contentHeading", { required: "Title is required" })}
                                type="text"
                                id="title"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="brief" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                {...register("content", { required: "Title is required" })}
                                id="brief"
                                rows={6}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            ></textarea>

                        </div>

                    </div>

                    {/* Right column */}
                    <div className="lg:w-1/3 space-y-6">
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div
                                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                                //   onDrop={onDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document?.getElementById("image")?.click()}
                            >
                                {previewImage ? (
                                    <div className="relative w-full h-full">
                                        <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage(null); // Clear the preview image
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
                                    </>
                                )}
                                <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                            {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
                        </div>


                        <div>
                            <button
                                type="submit"
                            disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isSubmitting ? "Updating..." : "Update About"}
                            </button>
                        </div>

                    </div>
                </form>
            </main>
        </AdminPanelLayout>
    )
}

export default EditAbout