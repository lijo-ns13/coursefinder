import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Globe, TrendingUp, GraduationCap, DollarSign } from 'lucide-react'
import { universitiesAPI } from '../api/universities'
import CourseCard from '../components/CourseCard'
import toast from 'react-hot-toast'

export default function UniversityPage() {
    const { universityName } = useParams()
    const navigate = useNavigate()
    const [university, setUniversity] = useState(null)
    const [courses, setCourses] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filterCategory, setFilterCategory] = useState('')

    useEffect(() => {
        loadUniversityData()
    }, [universityName])

    const loadUniversityData = async () => {
        try {
            setLoading(true)
            const response = await universitiesAPI.getDetails(decodeURIComponent(universityName))
            setUniversity(response.university)
            setCourses(response.courses || [])
            setStats(response.stats)
        } catch (error) {
            toast.error('Failed to load university data')
            navigate('/search')
        } finally {
            setLoading(false)
        }
    }

    const filteredCourses = filterCategory
        ? courses.filter(c => c.category === filterCategory)
        : courses

    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))]

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!university) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">University not found</p>
                <button onClick={() => navigate('/search')} className="btn-primary mt-4">
                    Back to Search
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* University Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{university.name}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>
                                {university.location?.city && `${university.location.city}, `}
                                {university.location?.country}
                            </span>
                        </div>
                        {university.website && (
                            <a
                                href={university.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-primary-600 hover:text-primary-700"
                            >
                                <Globe className="h-4 w-4 mr-2" />
                                Visit University Website
                            </a>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {university.ranking && (
                            <div className="text-center">
                                <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-1" />
                                <p className="text-sm text-gray-500">Ranking</p>
                                <p className="text-xl font-bold text-gray-900">#{university.ranking}</p>
                            </div>
                        )}
                        {university.acceptanceRate && (
                            <div className="text-center">
                                <GraduationCap className="h-8 w-8 text-primary-600 mx-auto mb-1" />
                                <p className="text-sm text-gray-500">Acceptance</p>
                                <p className="text-xl font-bold text-gray-900">{university.acceptanceRate}%</p>
                            </div>
                        )}
                        {stats && (
                            <>
                                <div className="text-center">
                                    <GraduationCap className="h-8 w-8 text-primary-600 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500">Courses</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.totalCourses}</p>
                                </div>
                                {stats.averageFees > 0 && (
                                    <div className="text-center">
                                        <DollarSign className="h-8 w-8 text-primary-600 mx-auto mb-1" />
                                        <p className="text-sm text-gray-500">Avg Fees</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ${Math.round(stats.averageFees).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterCategory('')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${!filterCategory
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All ({courses.length})
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilterCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === category
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {category} ({courses.filter(c => c.category === category).length})
                        </button>
                    ))}
                </div>
            )}

            {/* Courses List */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Available Courses ({filteredCourses.length})
                </h2>
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No courses found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <CourseCard
                                    course={course}
                                    showUniversity={false}
                                    onSaveChange={loadUniversityData}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

