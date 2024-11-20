import AddBanner from '@/components/AddBanner'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import React from 'react'

const page = () => {
  return (
    <AdminPanelLayout currentPage="/admin/dashboard">
    <AddBanner/>
    </AdminPanelLayout>
  )
}

export default page