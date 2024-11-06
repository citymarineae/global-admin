import ChangeCredentials from '@/components/ChangeCredentials'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanelLayout currentPage="/admin/dashboard">
        <ChangeCredentials/>
      </AdminPanelLayout>
    </Suspense>
  )
}

export default page