import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import Link from 'next/link'
import React from 'react'

const Claims = () => {
  return (
    <AdminPanelLayout currentPage="/admin/about">
        <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine Claims Page</h1>
          <Link
            href="/admin/about/edit-about"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Claims
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
              
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="brief" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              
              id="brief"
              rows={6}
              
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
            
          </div>

          
        </div>

        {/* Right column */}
        <div className="lg:w-1/3 space-y-6">
          {/* <div>
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
                  <p className="mt-1 text-sm text-gray-600">No image to display</p>
                </>
              )}
            </div>
          </div> */}

          
        </div>
      </form>
      </main>
    </AdminPanelLayout>
    
  )
}

export default Claims