"use client";
import AddMarine from "@/components/AddMarineSections";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AddNewsPage() {
  return (
    <AdminPanelLayout currentPage="/admin/news">
      <AddMarine />
    </AdminPanelLayout>
  );
}
