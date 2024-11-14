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
import { uploadVideoToDropBox } from '@/app/admin/helpers/uploadVideoToDropbox';

type FormData = {
  title: string;
  content: string;
  metaDataTitle:string;
  metaDataDesc:string;
  altTag:string;
};

type HomeAboutDataType = {
    id:string
    title:string
    content:string
    image:string
    metaDataTitle:string
    metaDataDesc:string
    altTag:string;
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
    const [videoError1,setVideoError1]  = useState("")
    const [previewVideo1,setPreviewVideo1] = useState<null | string>("")
    const [videoFile1,setVideoFile1] = useState<null | File>(null)
    const [videoError2,setVideoError2]  = useState("")
    const [previewVideo2,setPreviewVideo2] = useState<null | string>("")
    const [videoFile2,setVideoFile2] = useState<null | File>(null)
    const [videoPoster1, setVideoPoster1] = useState<File | null>(null);
    const [videoPoster1Error, setVideoPoster1Error] = useState<string | null>(null);
    const [videoPoster1Preview, setVideoPoster1Preview] = useState<string | null>(null);
    const [videoPoster2, setVideoPoster2] = useState<File | null>(null);
    const [videoPoster2Error, setVideoPoster2Error] = useState<string | null>(null);
    const [videoPoster2Preview, setVideoPoster2Preview] = useState<string | null>(null);

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
          setValue("metaDataTitle",data.homeabout[0].metaDataTitle)
          setValue("metaDataDesc",data.homeabout[0].metaDataDesc)
          setValue("altTag",data.homeabout[0].altTag)
          if (data.homeabout[0].image) {
            setPreviewImage(data.homeabout[0].image as string);
          }
          if(data.homeabout[0].bannerVideo1){
            setPreviewVideo1(data.homeabout[0].bannerVideo1 as string)
          }
          if(data.homeabout[0].bannerVideo2){
            setPreviewVideo2(data.homeabout[0].bannerVideo2 as string)
          }

          if (data.homeabout[0].videoPoster1) {
            setVideoPoster1Preview(data.homeabout[0].videoPoster1 as string);
          }
          if (data.homeabout[0].videoPoster2) {
            setVideoPoster2Preview(data.homeabout[0].videoPoster2 as string);
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

    const onDropVideo1 = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0];
      if (file) {
        // Validate the video file type
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        if (!validVideoTypes.includes(file.type)) {
          setVideoError1("Please select a video file (MP4, WebM, or Ogg)");
          return;
        }
  
        const maxSize = 50 * 1024 * 1024; // 50MB for video files
        if (file.size > maxSize) {
          setVideoError1("Video file size must not exceed 50MB");
          return;
        }
  
        const videoUrl = URL.createObjectURL(file);
        setPreviewVideo1(videoUrl);
        setVideoFile1(file)
  
        return () => {
          URL.revokeObjectURL(videoUrl);
        };
      }
  
    }, [])

    const handleVideoChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Called")
      const file = e.target.files?.[0];
      if (file) {
        // Validate the video file type
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        if (!validVideoTypes.includes(file.type)) {
          setVideoError1("Please select a video file (MP4, WebM, or Ogg)");
          return;
        }
  
        const maxSize = 50 * 1024 * 1024; // 50MB for video files
        if (file.size > maxSize) {
          setVideoError1("Video file size must not exceed 50MB");
          return;
        }
  
        const videoUrl = URL.createObjectURL(file);
        setPreviewVideo1(videoUrl);
        setVideoFile1(file)
  
        return () => {
          URL.revokeObjectURL(videoUrl);
        };
      } else {
        setPreviewVideo1(null)
        setVideoFile1(null)
      }
  
    }

    const onDropVideo2 = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0];
      if (file) {
        // Validate the video file type
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        if (!validVideoTypes.includes(file.type)) {
          setVideoError2("Please select a video file (MP4, WebM, or Ogg)");
          return;
        }
  
        const maxSize = 50 * 1024 * 1024; // 50MB for video files
        if (file.size > maxSize) {
          setVideoError2("Video file size must not exceed 50MB");
          return;
        }
  
        const videoUrl = URL.createObjectURL(file);
        setPreviewVideo2(videoUrl);
        setVideoFile2(file)
  
        return () => {
          URL.revokeObjectURL(videoUrl);
        };
      }
  
    }, [])

    const handleVideoChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Called")
      const file = e.target.files?.[0];
      if (file) {
        // Validate the video file type
        const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        if (!validVideoTypes.includes(file.type)) {
          setVideoError2("Please select a video file (MP4, WebM, or Ogg)");
          return;
        }
  
        const maxSize = 50 * 1024 * 1024; // 50MB for video files
        if (file.size > maxSize) {
          setVideoError2("Video file size must not exceed 50MB");
          return;
        }
  
        const videoUrl = URL.createObjectURL(file);
        setPreviewVideo2(videoUrl);
        setVideoFile2(file)
  
        return () => {
          URL.revokeObjectURL(videoUrl);
        };
      } else {
        setPreviewVideo2(null)
        setVideoFile2(null)
      }
  
    }

    const handleVideoPoster1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if (file) {
        // Validate the image file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
          setVideoPoster1Error("Please select an image file (JPEG, PNG, or GIF)");
          return;
        }
  
        // Validate the image file size
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          setVideoPoster1Error("Image file size must not exceed 10MB");
          return;
        }
  
        setVideoPoster1(file);
  
        setVideoPoster1Error(null); // Reset error message if there was one
  
        // Generate the preview image
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPoster1Preview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setVideoPoster1Preview(null);
        setVideoPoster1(null);
      }
    };

    const onDropVideoPoster1 = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        // Validate the image file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
          setVideoPoster1Error("Please select an image file (JPEG, PNG, or GIF)");
          return;
        }
  
        // Validate the image file size
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          setVideoPoster1Error("Image file size must not exceed 10MB");
          return;
        }
  
        setVideoPoster1(file);
  
        setVideoPoster1Error(null); // Reset error message if there was one;
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPoster1Preview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);

    const handleVideoPoster2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if (file) {
        // Validate the image file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
          setVideoPoster2Error("Please select an image file (JPEG, PNG, or GIF)");
          return;
        }
  
        // Validate the image file size
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          setVideoPoster2Error("Image file size must not exceed 10MB");
          return;
        }
  
        setVideoPoster2(file);
  
        setVideoPoster2Error(null); // Reset error message if there was one
  
        // Generate the preview image
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPoster2Preview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setVideoPoster2Preview(null);
        setVideoPoster2(null);
      }
    };

    const onDropVideoPoster2 = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        // Validate the image file type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
          setVideoPoster2Error("Please select an image file (JPEG, PNG, or GIF)");
          return;
        }
  
        // Validate the image file size
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          setVideoPoster2Error("Image file size must not exceed 10MB");
          return;
        }
  
        setVideoPoster2(file);
  
        setVideoPoster2Error(null); // Reset error message if there was one;
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPoster2Preview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);


    const onSubmit = async (data: FormData) => {
      let bannerVideoPath1:Promise<string | false> | string | boolean;
      let bannerVideoPath2:Promise<string | false> | string | boolean;

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("metaDataTitle",data.metaDataTitle)
      formData.append("metaDataDesc",data.metaDataDesc)
      formData.append("altTag",data.altTag)
  
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if(videoFile1){
        bannerVideoPath1 = await uploadVideoToDropBox(videoFile1)
        console.log("Video PAth",bannerVideoPath1)
        if(bannerVideoPath1){
            formData.append("bannerVideo1",bannerVideoPath1)
        }
      }

      if(videoFile2){
        bannerVideoPath2 = await uploadVideoToDropBox(videoFile2)
        console.log("Video PAth",bannerVideoPath2)
        if(bannerVideoPath2){
            formData.append("bannerVideo2",bannerVideoPath2)
        }
      }

      if (videoPoster1) {
        formData.append("videoPoster1", videoPoster1);
      }

      if (videoPoster2) {
        formData.append("videoPoster2", videoPoster2);
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
          <h1 className="text-3xl font-bold">City Marine Home Page</h1>
          {!editMode && <Link
            href="/admin/dashboard/edit-about"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Home
          </Link>}
        </div>
        <form className="space-y-6 lg:flex  lg:space-y-0 flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Left column */}
       
        <div>
          <div className='font-bold'>Banner Video</div>
          <div className='lg:flex gap-5'>
          
          <div className='w-full'>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Banner Video 1
            </label>
            <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={editMode ? onDropVideo1 : undefined}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("video")?.click()}
            >
              {previewVideo1 ? (
                <div className="relative w-full h-full">
                  <video width="100%" height="100%" controls={editMode} style={{ objectFit: "cover" }}>
                    <source src={previewVideo1 || ""} type="video/mp4" />
                  </video>
                  {editMode && <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewVideo1(null);
                      setVideoFile1(null) // Clear the preview image
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
              {editMode && <input type="file" id="video" accept="video/mp4, video/avi" className="hidden" onChange={handleVideoChange1} /> }
            </div>
            {videoError1 && <p className="mt-1 text-sm text-red-600">{videoError1}</p>}
          </div>

          <div className='w-full'>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Banner Video 2
            </label>
            <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={onDropVideo2}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("video2")?.click()}
            >
              {previewVideo2 ? (
                <div className="relative w-full h-full">
                  <video width="100%" height="100%" controls={editMode} style={{ objectFit: "cover" }}>
                    <source src={previewVideo2 || ""} type="video/mp4" />
                  </video>
                  {editMode && <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewVideo2(null);
                      setVideoFile2(null) // Clear the preview image
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
              {editMode && <input type="file" id="video2" accept="video/mp4, video/avi" className="hidden" onChange={handleVideoChange2} />}
            </div>
            {videoError2 && <p className="mt-1 text-sm text-red-600">{videoError2}</p>}
          </div>
          </div>
          </div>

              <div className='lg:flex w-full gap-5'>
          <div className='lg:w-1/2'>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Video Poster 1
            </label>
            <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={onDropVideoPoster1}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("videoposter1")?.click()}
            >
              {videoPoster1Preview ? (
                <div className="relative w-full h-full">
                  <Image src={videoPoster1Preview} alt="Preview" layout="fill" objectFit="cover" />
                  {editMode && <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoPoster1Preview(null); // Clear the preview image
                      setVideoPoster1(null);
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
              {editMode && <input type="file" id="videoposter1" accept="image/*" className="hidden" onChange={handleVideoPoster1Change} />}
            </div>
            {videoPoster1Error && <p className="mt-1 text-sm text-red-600">{videoPoster1Error}</p>}
            {editMode && <p className='mt-3'>Optimum resolution - 900x700</p>}
          </div>

          <div className='lg:w-1/2'>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Video Poster 2
            </label>
            <div
              className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${editMode ? "cursor-pointer" : ""} overflow-hidden`}
              onDrop={onDropVideoPoster2}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("videoposter2")?.click()}
            >
              {videoPoster2Preview ? (
                <div className="relative w-full h-full">
                  <Image src={videoPoster2Preview} alt="Preview" layout="fill" objectFit="cover" />
                  {editMode && <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoPoster2Preview(null); // Clear the preview image
                      setVideoPoster2(null);
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
              {editMode && <input type="file" id="videoposter2" accept="image/*" className="hidden" onChange={handleVideoPoster2Change} />}
            </div>
            {videoPoster2Error && <p className="mt-1 text-sm text-red-600">{videoPoster2Error}</p>}
            {editMode && <p className='mt-3'>Optimum resolution - 900x700</p>}
          </div>

          </div>

            <div className='lg:flex lg:gap-5  border-t-2 pt-4'> 
          <div className="lg:w-2/3 space-y-6">
            <div className='font-bold'>About Section</div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              readOnly={!editMode}
              {...register("title", { required: "Title is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
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

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Metadata:title
            </label>
            <input
              type="text"
              id="metaDataTitle"
              readOnly={!editMode}
              {...register("metaDataTitle")}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Metadata:description
            </label>
            <input
              type="text"
              id="metaDataDesc"
              readOnly={!editMode}
              {...register("metaDataDesc")}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
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
            {editMode && <p className='mt-3'>Optimum resolution - 900x700</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Alt Tag
            </label>
            <input
              type="text"
              id="Alt Tag"
              readOnly={!editMode}
              {...register("altTag")}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
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
        </div> 
      </form>
      </main>
  )
}

export default HomeAboutSection