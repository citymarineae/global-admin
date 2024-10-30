import HomeAboutSection from '@/components/HomeAboutSection'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import { Suspense } from 'react'


const HomeAboutEdit = () => {
  
    return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanelLayout currentPage="/admin/dashboard">
        <HomeAboutSection editMode/>
      </AdminPanelLayout>
    </Suspense>
  )
}

export default HomeAboutEdit