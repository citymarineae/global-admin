"use client"

import React, { useEffect, useState } from 'react'
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import Link from 'next/link';
import Image from "next/image";
import { Controller } from 'react-hook-form';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic'

type aboutDataType = {
  pageHeading:string
  description:string
  contentHeading:string
  content:string
  image?:string
}

const AboutPage = () => {

  const editMode = false
    
    const editorModule = {
        toolbar : editMode ? editMode : false
      }



  const [aboutData,setAboutData] = useState<aboutDataType | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(()=>{
    const fetchAboutData = async() =>{
        try {
            const response = await fetch(`/api/about`);
            if (response.ok) {
              
              const data = await response.json();
              if(data.about){
                setAboutData(data.about[0])
                
                if(data.about[0].image){
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
},[])


  return (
    <AdminPanelLayout currentPage="/admin/about">
        <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine About Page</h1>
          <Link
            href="/admin/about/edit-about"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit About
          </Link>
        </div>
        <form className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0">
        {/* Left column */}
        <div className="lg:w-2/3 space-y-6">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Page title
            </label>
            <input
              type="text"
              id="title"
              value={aboutData?.pageHeading}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="title"
              value={aboutData?.description}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Content Title
            </label>
            <input
              type="text"
              id="title"
              value={aboutData?.contentHeading}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Full Content
            </label>
                <ReactQuill theme="snow" value={aboutData?.content} className="mt-1" readOnly={!editMode} modules={editorModule}/>
          </div>

          
        </div>

        {/* Right column */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden"
            //   onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document?.getElementById("image")?.click()}
            >
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" />
                </div>
              ) : (
                <>
                  {/* <svg
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
                  </svg> */}
                  <p className="mt-1 text-sm text-gray-600">No image to display</p>
                </>
              )}
            </div>
          </div>

          
        </div>
      </form>
      </main>
    </AdminPanelLayout>
    

  )
}

export default AboutPage