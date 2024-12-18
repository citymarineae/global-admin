"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import AddNews from "@/components/AddNews";

const EditNewsPage = () => {
  const { id } = useParams();
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`/api/news?id=${id}`);
        const data = await response.json();
        console.log(data);

        setNewsData(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    if (id) {
      fetchNewsData();
    }
  }, [id]);

  if (!newsData) {
    return <div>Loading...</div>;
  }

  return (
    <AdminPanelLayout currentPage="/admin/news">
      <AddNews initialData={newsData} isEditing />
    </AdminPanelLayout>
  );
};

export default EditNewsPage;
