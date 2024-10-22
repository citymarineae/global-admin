"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import AddMember from "@/components/AddMember";

const EditMemberPage = () => {
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/team?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setMemberData(data);
        } else {
          console.error("Failed to fetch member data");
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    if (id) {
      fetchMemberData();
    }
  }, [id]);

  if (!memberData) {
    return <div>Loading...</div>;
  }

  return (
    <AdminPanelLayout currentPage="/admin/team">
      <AddMember initialData={memberData} isEditing={true} />
    </AdminPanelLayout>
  );
};

export default EditMemberPage;
