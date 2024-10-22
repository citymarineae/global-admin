"use client";

import AddNews from "@/components/AddNews";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AddNewsPage() {
  return (
    <AdminPanelLayout currentPage="/admin/news">
      <AddNews />
    </AdminPanelLayout>
  );
}
