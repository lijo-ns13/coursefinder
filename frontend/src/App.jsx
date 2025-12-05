import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import CourseSearchPage from './pages/CourseSearchPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import UniversityPage from './pages/UniversityPage'
import ComparisonPage from './pages/ComparisonPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminPage from './pages/AdminPage'
import Layout from './components/Layout'
import HelpButton from './components/HelpButton'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<CourseSearchPage />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/university/:universityName" element={<UniversityPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
      <HelpButton />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
        }}
      />
    </>
  )
}

export default App

