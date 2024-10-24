import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import React from 'react'
import ClaimsSection from '@/components/ClaimsSection'


const Claims = () => {

  return (
    <AdminPanelLayout currentPage="/admin/claims">
        <ClaimsSection/>
    </AdminPanelLayout>
    
  )
}

export default Claims