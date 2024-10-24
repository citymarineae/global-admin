import ClaimsSection from '@/components/ClaimsSection'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import React from 'react'

const EditClaims = () => {
  return (
    <AdminPanelLayout currentPage="/admin/claims">
        <ClaimsSection editMode/>
    </AdminPanelLayout>
  )
}

export default EditClaims