"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  brief: string;
  date: string;
  image: string;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch,setRefetch] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        setNewsItems(data.news);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [refetch]);

  const handleDelete = async(itemId:string) =>{
    
    Swal.fire({
      title: "Are you sure about this?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/news?id=${itemId}`,{
            method:"DELETE"
          })
          
          if(response.ok){
            const data = await response.json()
            toast.success(data.message)
            setRefetch((prev)=>!prev)
          }else{
            const data = await response.json()
            toast.error(data.error)
          }
    
        } catch (error) {
          console.log("Error deleting marine section:",error)
        }
      } else if (result.isDenied) {
        toast.error("Changes were not saved")
      }
    });
    
  }

  return (
    <AdminPanelLayout currentPage="/admin/news">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine News Page</h1>
          <Link
            href="/admin/news/add-news"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Article
          </Link>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading news items...</p>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No news articles found.</p>
            <p className="mt-2 text-gray-500">Click &quot;Add New Article&quot; to create your first news item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <div key={news.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
                  <p className="text-gray-600 mb-2">{news.brief}</p>
                  <p className="text-sm text-gray-500 mb-4">{new Date(news.date).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                  <Link
                    href={`/admin/news/edit/${news.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Edit
                  </Link>
                  <Link onClick={()=>handleDelete(news.id)}
                    href={`#`}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Delete
                  </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default News;
