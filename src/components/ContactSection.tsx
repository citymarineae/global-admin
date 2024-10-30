"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import parse, { Element } from 'html-react-parser'
import { Quill } from 'react-quill'
const Block = Quill.import('blots/block');
class DivBlock extends Block {} 
DivBlock.tagName = 'DIV';
// true means we overwrite  
Quill.register('blots/block', DivBlock, true);


type FormData = {
    phone: string
    fax: string
    map: string
    address: string
}

type ContactData = {
    id: string
    phone: string
    fax: string
    map: string
    address: string
}

const ContactSection = ({ editMode }: { editMode?: boolean }) => {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
        getValues,
    } = useForm<FormData>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [open, setOpen] = useState(false)


    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`/api/contact-us`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.contact[0])
                    setValue("phone", data.contact[0].phone)
                    setValue("fax", data.contact[0].fax)
                    setValue("map", data.contact[0].map)
                    setValue("address", data.contact[0].address)
                    if (data.contact[0].map) {
                        setPreviewMap(true)
                        setContactData(data.contact[0])
                    }
                } else {
                    console.error("Failed to fetch contact data");
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchContactData();
    }, [setValue]);


    const [previewMap, setPreviewMap] = useState(false)
    const [contactData, setContactData] = useState<ContactData | null>(null)
    const [loading, setLoading] = useState(true)
    const [previewContent,setPreviewContent] = useState<string>("")

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("phone", data.phone);
        formData.append("fax", data.fax);
        formData.append("map", data.map);
        formData.append("address", data.address);

        try {
            const url = `/api/contact-us?id=${contactData?.id}`;
            const method = "POST";
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



    const editorModule = {
        toolbar: editMode ? editMode : false,
        clipboard: {
            matchVisual: false
          },
    }


    const handleModalOpen = () =>{
        setPreviewContent(watch("address"))
        setOpen(true)
    }

    useEffect(() => {
        console.log(previewContent)
    }, [previewContent])

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
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
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
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            />
                            {errors.fax && <p className="mt-1 text-sm text-red-600">{errors.fax.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Full Content
                            </label>
                            <Controller
                                name="address"
                                control={control}
                                rules={{ required: "Content is required" }}
                                render={({ field }) => (
                                    <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="my-4 rounded-md text-lg" readOnly={!editMode} modules={editorModule} />
                                )}
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                        </div>

                        {editMode && <div>
                            <button onClick={handleModalOpen} type='button'>Show</button>
                        </div>}

                        {editMode && <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Current map
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register("map", { required: "Map is required" })}
                                readOnly={!editMode}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            />
                            {errors.map && <p className="mt-1 text-sm text-red-600">{errors.map.message}</p>}
                        </div>}


                    </div>


                    <Dialog open={open} onClose={setOpen} className="relative z-10">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                                >
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                    Content Preview
                                                </DialogTitle>
                                                <div className="mt-2">
                                                    {previewContent}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            Deactivate
                                        </button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setOpen(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>

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