"use client";

import AddMember from "@/components/AddMember";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AddMemberPage() {
  return (
    <AdminPanelLayout currentPage="/admin/team">
      <AddMember />
    </AdminPanelLayout>
  );
}
