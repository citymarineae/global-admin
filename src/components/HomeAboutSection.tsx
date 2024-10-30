"use client"

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useState } from 'react'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic'
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from 'next/navigation';

type FormData = {
  title: string;
  content: string;
};

type HomeAboutDataType = {
    id:string
    title:string
    content:string
    image:string
  }


const HomeAboutSection = ({editMode}:{
  editMode?:boolean
}) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>();


    
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [homeAboutData, setHomeAboutData] = useState<HomeAboutDataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter()
  
    useEffect(() => {
      const fetchHomeAbout = async () => {
        try {
          const response = await fetch("/api/home-about");
          const data = await response.json();
          console.log(data.homeabout[0])
          setHomeAboutData(data.homeabout[0]);
          setValue("title",data.homeabout[0].title)
          setValue("content",data.homeabout[0].content)
          if (data.homeabout[0].image) {
            setPreviewImage(data.homeabout[0].image as string);
          }
        } catch (error) {
          console.error("Error fetching home about:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchHomeAbout();
    }, []);


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

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
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
  
        setImageError(null); // Reset error message if there was one;
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);

    const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
  
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      try {
        const url = `/api/home-about?id=${homeAboutData?.id}`;
        const method = "POST";
        const response = await fetch(url, {
          method: method,
          body: formData,
        });
        const data = await response.json();
        console.log(data);

        if(response.ok){
          router.push("/admin/dashboard/about")
        }
  
        // router.push("/admin/news"); // Redirect to news list page
      } catch (error) {
        console.error("Error adding news:", error);
        alert("Failed to add news. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const editorModule = {
      toolbar : editMode ? editMode : false
    }

 
    if(isLoading){
      <div>Loading Content....</div>
    }


  return (
    <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine About Content (Home)</h1>
          {!editMode && <Link
            href="/admin/dashboard/edit-about"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit About
          </Link>}
        </div>
        <form className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0" onSubmit={handleSubmit(onSubmit)}>
        {/* Left column */}
        <div className="lg:w-2/3 space-y-6">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              readOnly={!editMode}
              {...register("title", { required: "Title is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Full Content
            </label>
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1" readOnly={!editMode} modules={editorModule}/>
              )}
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          
        </div>

        {/* Right column */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("image")?.click()}
            >
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" />
                  {editMode && <button
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
                  </button>}
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
              {editMode && <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageChange} />}
            </div>
            {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
          </div>

          {editMode && <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ?  "Saving..." :  "Edit Home About"}
            </button>
          </div>}
        </div>
      </form>
      </main>
  )
}

export default HomeAboutSection