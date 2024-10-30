
import HomeAboutSection from '@/components/HomeAboutSection'
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout'
import { Suspense } from 'react'


const HomeAbout = () => {
  
    return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanelLayout currentPage="/admin/dashboard">
        <HomeAboutSection/>
      </AdminPanelLayout>
    </Suspense>
  )
}

export default HomeAbout