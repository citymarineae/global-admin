import ContactSection from '@/components/ContactSection'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import React from 'react'

const page = () => {
  return (
    <AdminPanelLayout currentPage="/admin/contact-us">
        <ContactSection/>
    </AdminPanelLayout>
  )
}

export default page