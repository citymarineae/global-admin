"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { generateSlugForNews } from "@/app/admin/helpers/generateSlug";

type FormData = {
  title: string;
  brief: string;
  content: string;
  date: string;
  slug:string;
  metaDataTitle:string;
  metaDataDesc:string;
  altTag:string;
};

interface AddNewsPageProps {
  initialData?: {
    id: string;
    title: string;
    brief: string;
    content: string;
    image?: string;
    date: string;
    slug:string;
    metaDataTitle:string;
    metaDataDesc:string;
    altTag:string;
  };
  isEditing?: boolean;
}

export default function AddNews({ initialData, isEditing = false }: AddNewsPageProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("brief", initialData.brief);
      setValue("content", initialData.content);
      setValue("date", format(new Date(initialData.date), "yyyy-MM-dd"));
      setValue("slug",initialData.slug)
      setValue("metaDataTitle",initialData.metaDataTitle)
      setValue("metaDataDesc",initialData.metaDataDesc)
      setValue("altTag",initialData.altTag)
      
      if (initialData.image) {
        setPreviewImage(initialData.image as string);
      }
    }
  }, [initialData, setValue]);

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
    formData.append("brief", data.brief);
    formData.append("content", data.content);
    formData.append("date", data.date);
    formData.append("slug",data.slug);
    formData.append("metaDataTitle",data.metaDataTitle);
    formData.append("metaDataDesc",data.metaDataDesc);
    formData.append("altTag",data.altTag);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const url = isEditing ? `/api/news?id=${initialData?.id}` : "/api/news";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      const data = await response.json();
      console.log(data);

      router.push("/admin/news"); // Redirect to news list page
    } catch (error) {
      console.error("Error adding news:", error);
      alert("Failed to add news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(()=>{
    setValue("slug",generateSlugForNews(watch("title")))
  },[watch("title")])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? `Edit ${initialData?.title}` : "Add New Article"}</h1>
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
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              {...register("slug", { required: "Title is required" })}
              type="text"
              id="slug"
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="brief" className="block text-sm font-medium text-gray-700">
              Brief Description
            </label>
            <textarea
              {...register("brief", { required: "Brief description is required" })}
              id="brief"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
            {errors.brief && <p className="mt-1 text-sm text-red-600">{errors.brief.message}</p>}
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
                <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-1" />
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
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              onDrop={onDrop}
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
            {<p className='mt-3'>Optimum resolution - 900x700</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Alt Tag
            </label>
            <input
              type="text"
              id="Alt Tag"
              {...register("altTag")}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Publication Date
            </label>
            <input
              {...register("date", { required: "Publication date is required" })}
              type="date"
              id="date"
              defaultValue={format(new Date(), "yyyy-MM-dd")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update News" : "Add News"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
