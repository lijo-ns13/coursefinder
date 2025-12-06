import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Clock, Heart, TrendingUp } from 'lucide-react'
import { userAPI } from '../api/user'
import { useAuthStore } from '../store/authStore'
import { useCourseStore } from '../store/courseStore'
import PhoneModal from './PhoneModal'
import toast from 'react-hot-toast'

export default function CourseCard({ course, showUniversity = true, onSaveChange }) {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const { addToComparison } = useCourseStore()
    const [saved, setSaved] = useState(false)
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkIfSaved()
    }, [course._id])

    const checkIfSaved = async () => {
        if (!isAuthenticated) return

        try {
            const response = await userAPI.getSavedCourses()
            const isSaved = response.courses?.some(c => c._id === course._id)
            setSaved(isSaved)
        } catch (error) {
            // Silently fail
        }
    }

    const handleSave = async (e) => {
        e.stopPropagation()

        if (!isAuthenticated) {
            setShowPhoneModal(true)
            return
        }

        setLoading(true)
        try {
            if (saved) {
                await userAPI.unsaveCourse(course._id)
                setSaved(false)
                toast.success('Course unsaved')
            } else {
                await userAPI.saveCourse(course._id)
                setSaved(true)
                toast.success('Course saved!')
            }
            onSaveChange?.()
        } catch (error) {
            toast.error('Failed to update saved status')
        } finally {
            setLoading(false)
        }
    }

    const handleUniversityClick = (e) => {
        e.stopPropagation()
        navigate(`/university/${encodeURIComponent(course.university?.name)}`)
    }

    const handleCompare = (e) => {
        e.stopPropagation()
        addToComparison(course)
        toast.success('Added to comparison')
        navigate('/compare')
    }

    return (
        <>
            <div
                className="group relative bg-white border border-gray-200 rounded-xl p-4 sm:p-6 cursor-pointer overflow-hidden hover:border-gray-300 hover:shadow-md transition-all w-full"
                onClick={() => navigate(`/course/${course._id}`)}
            >

                {/* Header with Save Button */}
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 pr-2 min-w-0">
                        {/* Category Badge */}
                        {course.category && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md mb-2 text-xs font-medium">
                                {course.category}
                            </span>
                        )}
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
                            {course.name}
                        </h3>
                        {showUniversity && course.university?.name && (
                            <button
                                onClick={handleUniversityClick}
                                className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm font-medium mb-1 sm:mb-2 hover:underline transition-all text-left w-full truncate"
                            >
                                {course.university.name}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`p-2 sm:p-2.5 rounded-lg transition-all flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${saved
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        title={saved ? 'Unsave course' : 'Save course'}
                    >
                        <Heart className={`h-5 w-5 sm:h-5 sm:w-5 ${saved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Location */}
                {course.university?.location && (
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-600 flex-shrink-0" />
                        <span className="font-medium truncate">
                            {course.university.location.city && `${course.university.location.city}, `}
                            {course.university.location.country}
                        </span>
                    </div>
                )}

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {course.fees?.amount && (
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-1">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Fees</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                {course.fees.currency} {course.fees.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">/{course.fees.per}</p>
                        </div>
                    )}
                    {course.duration && (
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Duration</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{course.duration}</p>
                        </div>
                    )}
                    {course.university?.ranking && (
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-1">
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Ranking</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">#{course.university.ranking}</p>
                        </div>
                    )}
                    {course.level && (
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-[10px] sm:text-xs text-gray-600 font-medium block mb-1">Level</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 capitalize truncate">{course.level}</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                {course.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                    </p>
                )}

                {/* Fit Score Badge */}
                {course.aiFitScore && (
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-xs font-medium text-gray-700">AI Fit Score</span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="flex-1 sm:w-20 sm:flex-none h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gray-900 rounded-full transition-all"
                                    style={{ width: `${(course.aiFitScore / 10) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">{course.aiFitScore}/10</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/course/${course._id}`)
                        }}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold flex-1 w-full text-xs sm:text-sm py-2.5 rounded-lg transition-all"
                    >
                        View Details
                    </button>
                    <button
                        onClick={handleCompare}
                        className="bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2.5 w-full sm:w-auto rounded-lg transition-all"
                    >
                        Compare
                    </button>
                </div>
            </div>

            <PhoneModal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
            />
        </>
    )
}

