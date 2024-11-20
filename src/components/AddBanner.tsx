"use client"

import React from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import "react-quill/dist/quill.snow.css";
import { useRouter } from 'next/navigation'
import { uploadVideoToDropBox } from '@/app/admin/helpers/uploadVideoToDropbox'
import { useParams } from 'next/navigation'

type FormData = {
    id:string
    title:string
    subTitle:string
    videoPoster:string;
    bannerVideo:string;
}



const AddBanner = ({editMode}:{editMode?:boolean}) => {
    
    const router = useRouter()

    const {id} = useParams()

    console.log("id",id)


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm<FormData>();

      const [previewImage, setPreviewImage] = useState<string | null>(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [imageFile, setImageFile] = useState<File | null>(null);
      const [imageError, setImageError] = useState<string | null>(null);
      const [loading,setLoading] = useState(false)
      const [videoError,setVideoError] = useState("")
      const [previewVideo,setPreviewVideo] = useState<null | string>("")
      const [videoFile,setVideoFile] = useState<File|null>(null)

        const fetchBannerData = async () => {
          try {
            const response = await fetch(`/api/home-banner?id=${id}`);
            if (response.ok) {
              const data = await response.json();
              console.log(data.homebanner)
              
              setValue("title",data.homebanner.title)
              setValue("subTitle",data.homebanner.subTitle)
              
              if (data.homebanner.videoPoster) {
                setPreviewImage(data.homebanner.videoPoster as string);
              }

              if (data.homebanner.bannerVideo) {
                setPreviewVideo(data.homebanner.bannerVideo as string);
              }
            } else {
              console.error("Failed to fetch claims data");
            }
          } catch (error) {
            console.error("Error fetching claims data:", error);
          }finally{
            setLoading(false)
          }
        };
        
      useEffect(()=>{
        if(id){
            fetchBannerData();
        }
      },[id])
      

      const onDropVideo = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0];
        if (file) {
          // Validate the video file type
          const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
          if (!validVideoTypes.includes(file.type)) {
            setVideoError("Please select a video file (MP4, WebM, or Ogg)");
            return;
          }
    
          const maxSize = 50 * 1024 * 1024; // 50MB for video files
          if (file.size > maxSize) {
            setVideoError("Video file size must not exceed 50MB");
            return;
          }
    
          const videoUrl = URL.createObjectURL(file);
          setPreviewVideo(videoUrl);
          setVideoFile(file)
    
          return () => {
            URL.revokeObjectURL(videoUrl);
          };
        }
    
      }, [])

      const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Called")
        const file = e.target.files?.[0];
        if (file) {
          // Validate the video file type
          const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
          if (!validVideoTypes.includes(file.type)) {
            setVideoError("Please select a video file (MP4, WebM, or Ogg)");
            return;
          }
    
          const maxSize = 50 * 1024 * 1024; // 50MB for video files
          if (file.size > maxSize) {
            setVideoError("Video file size must not exceed 50MB");
            return;
          }
    
          const videoUrl = URL.createObjectURL(file);
          setPreviewVideo(videoUrl);
          setVideoFile(file)
    
          return () => {
            URL.revokeObjectURL(videoUrl);
          };
        } else {
          setPreviewVideo(null)
          setVideoFile(null)
        }
    
      }

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
        let bannerVideoPath:Promise<string | false> | string | boolean;
  
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("subTitle", data.subTitle);
    
        if (imageFile) {
          formData.append("videoPoster", imageFile);
        }
  
        if(videoFile){
          bannerVideoPath = await uploadVideoToDropBox(videoFile)
          console.log("Video PAth",bannerVideoPath)
          if(bannerVideoPath){
              formData.append("bannerVideo",bannerVideoPath)
          }
        }
  
    
        try {
          const url = editMode ? `/api/home-banner/edit-banner?id=${id}`:`/api/home-banner`;
          const method = "POST";
          const response = await fetch(url, {
            method: method,
            body: formData,
          });
          const data = await response.json();
          console.log(data);
  
          if(response.ok){
            router.push("/admin/dashboard")
          }
    
          // router.push("/admin/news"); // Redirect to news list page
        } catch (error) {
          console.error("Error adding banner:", error);
          alert("Failed to add banner. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{editMode ? "City Marine Edit Banner":"City Marine Add Banner"}</h1>
        {/* {!editMode && <Link
          href="/admin/dashboard/edit-banner"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit Claims
        </Link>} */}
      </div>

      {loading ? (
        <div>Loading content....</div>
      ) : (
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
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Sub title
            </label>
            <input
              type="text"
              id="title"
              {...register("subTitle", { required: "Sub title is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
            {errors.subTitle && <p className="mt-1 text-sm text-red-600">{errors.subTitle.message}</p>}
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
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("image")?.click()}
            >
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" />
                  {<button
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
                  {editMode && <svg
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
                  </svg>}
                  <p className="mt-1 text-sm text-gray-600">{editMode ? "Drag and drop an image here, or click to select a file" : "No image to display"}</p>
                </>
              )}
              {<input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageChange} />}
            </div>
            {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
            {<p className='mt-3'>Optimum resolution - 900x700</p>}
          </div>

          <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={editMode ? onDropVideo : undefined}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("video")?.click()}
            >
              {previewVideo ? (
                <div className="relative w-full h-full">
                  <video width="100%" height="100%" controls={editMode} style={{ objectFit: "cover" }}>
                    <source src={previewVideo || ""} type="video/mp4" />
                  </video>
                  {editMode && <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewVideo(null);
                      setVideoFile(null) // Clear the preview image
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
                  </button> }
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>

                  <p className="mt-1 text-sm text-gray-600">No banner video to display</p>
                </>
              )}
              {<input type="file" id="video" accept="video/mp4, video/avi" className="hidden" onChange={handleVideoChange} /> }
            </div>
            {videoError && <p className="mt-1 text-sm text-red-600">{videoError}</p>}

          {<div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editMode ? isSubmitting ? "Updating..." : "Confirm Changes" : isSubmitting ? "Adding Banner" : "Add Banner"}
            </button>
          </div>}

        </div>
      </form>
      )}
      
    </main>
  )
}

export default AddBanner