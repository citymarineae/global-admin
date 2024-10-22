"use client";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Suspense } from "react";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanelLayout currentPage="/admin/dashboard">
        <main className="h-screen grid place-items-center">
          <p>Welcome to City Marine Admin Dashboard</p>
        </main>
      </AdminPanelLayout>
    </Suspense>
  );
};

export default Dashboard;
