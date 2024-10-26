"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import AddMarine from "@/components/AddMarineSections";

const EditNewsPage = () => {
  const { id } = useParams();
  const [marineData, setMarineData] = useState(null);

  useEffect(() => {
    const fetchMarineSectionData = async () => {
      try {
        const response = await fetch(`/api/sectors/marine/section?id=${id}`);
        const data = await response.json();

        setMarineData(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    if (id) {
      fetchMarineSectionData();
    }
  }, [id]);

  if (!marineData) {
    return <div>Loading...</div>;
  }

  return (
    <AdminPanelLayout currentPage="/admin/news">
      <AddMarine initialData={marineData} isEditing />
    </AdminPanelLayout>
  );
};

export default EditNewsPage;
