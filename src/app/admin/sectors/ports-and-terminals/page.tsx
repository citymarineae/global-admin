"use client";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "sonner";

type FormData = {
  title: string;
  contentOne: string;
  contentTwo: string;
};

const PortsAndTerminals = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImageOne, setPreviewImageOne] = useState<string | null>(null);
  const [previewImageTwo, setPreviewImageTwo] = useState<string | null>(null);
  const [imageFileOne, setImageFileOne] = useState<File | null>(null);
  const [imageFileTwo, setImageFileTwo] = useState<File | null>(null);
  const [imageErrorOne, setImageErrorOne] = useState<string | null>(null);
  const [imageErrorTwo, setImageErrorTwo] = useState<string | null>(null);

  const fetchData = async () => {
    const response = await fetch("/api/sectors/portsAndTerminals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data || data.error) return;
    setValue("title", data.title);
    setValue("contentOne", data.contentOne);
    setValue("contentTwo", data.contentTwo);
    if (data.imageOne) setPreviewImageOne(data.imageOne);
    if (data.imageTwo) setPreviewImageTwo(data.imageTwo);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (imageNumber: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageDirectly(imageNumber, file);
    }
  };

  const onDrop = (imageNumber: 1 | 2) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageDirectly(imageNumber, file);
    }
  };

  // Add this new function to handle the file directly
  const handleImageDirectly = (imageNumber: 1 | 2, file: File) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      if (imageNumber === 1) {
        setImageErrorOne("Please select a valid image file");
      } else {
        setImageErrorTwo("Please select a valid image file");
      }
      return;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      if (imageNumber === 1) {
        setImageErrorOne("Image file size must not exceed 10MB");
      } else {
        setImageErrorTwo("Image file size must not exceed 10MB");
      }
      return;
    }
    if (imageNumber === 1) {
      setImageFileOne(file);
      setImageErrorOne(null);
    } else {
      setImageFileTwo(file);
      setImageErrorTwo(null);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (imageNumber === 1) {
        setPreviewImageOne(reader.result as string);
      } else {
        setPreviewImageTwo(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("contentOne", data.contentOne);
    formData.append("contentTwo", data.contentTwo);
    if (imageFileOne) formData.append("imageOne", imageFileOne);
    if (imageFileTwo) formData.append("imageTwo", imageFileTwo);

    try {
      const response = await fetch("/api/sectors/portsAndTerminals", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Failed to update");
      toast.success("Updated Successfully");
      // Update the form with the new data
      setValue("title", responseData.portsAndTerminals.title);
      setValue("contentOne", responseData.portsAndTerminals.contentOne);
      setValue("contentTwo", responseData.portsAndTerminals.contentTwo);
      if (responseData.portsAndTerminals.imageOne) setPreviewImageOne(responseData.portsAndTerminals.imageOne);
      if (responseData.portsAndTerminals.imageTwo) setPreviewImageTwo(responseData.portsAndTerminals.imageTwo);
    } catch (error) {
      console.error("Error updating Ports and Terminals:", error);
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanelLayout currentPage="/admin/sectors/marine">
        <main className="h-screen grid place-items-center">
          <div className="container mx-auto px-4 py-8">
            <h1 className="font-semibold text-lg mb-4">Ports & Terminals</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0">
              {/* Left column */}
              <div className="lg:w-2/3 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    type="text"
                    id="title"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label htmlFor="contentOne" className="block text-sm font-medium text-gray-700">
                    Content One
                  </label>
                  <Controller
                    name="contentOne"
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                      <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1" />
                    )}
                  />
                  {errors.contentOne && <p className="mt-1 text-sm text-red-600">{errors.contentOne.message}</p>}
                </div>
                <div>
                  <label htmlFor="contentTwo" className="block text-sm font-medium text-gray-700">
                    Content Two
                  </label>
                  <Controller
                    name="contentTwo"
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                      <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1" />
                    )}
                  />
                  {errors.contentTwo && <p className="mt-1 text-sm text-red-600">{errors.contentTwo.message}</p>}
                </div>
              </div>
              {/* Right column */}
              <div className="lg:w-1/3 space-y-6">
                {[1, 2].map((num) => (
                  <div key={num}>
                    <label htmlFor={`image${num}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Image {num}
                    </label>
                    <div
                      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                      onDrop={onDrop(num as 1 | 2)}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => document.getElementById(`image${num}`)?.click()}
                    >
                      {(num === 1 ? previewImageOne : previewImageTwo) ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={num === 1 ? previewImageOne! : previewImageTwo!}
                            alt={`Preview ${num}`}
                            layout="fill"
                            objectFit="cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (num === 1) {
                                setPreviewImageOne(null);
                                setImageFileOne(null);
                              } else {
                                setPreviewImageTwo(null);
                                setImageFileTwo(null);
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
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
                          <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id={`image${num}`}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange(num as 1 | 2)}
                    />
                    {num === 1 && imageErrorOne && <p className="mt-1 text-sm text-red-600">{imageErrorOne}</p>}
                    {num === 2 && imageErrorTwo && <p className="mt-1 text-sm text-red-600">{imageErrorTwo}</p>}
                  </div>
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? "Submitting..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </AdminPanelLayout>
    </Suspense>
  );
};

export default PortsAndTerminals;
