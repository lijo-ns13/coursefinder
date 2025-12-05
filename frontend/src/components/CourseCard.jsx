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
                className="group relative card cursor-pointer overflow-hidden bg-gradient-to-br from-white to-gray-50 w-full"
                onClick={() => navigate(`/course/${course._id}`)}
            >
                {/* Premium Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                {/* Header with Save Button */}
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 pr-2 min-w-0">
                        {/* Category Badge */}
                        {course.category && (
                            <span className="inline-block badge-primary mb-2 text-xs">
                                {course.category}
                            </span>
                        )}
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                            {course.name}
                        </h3>
                        {showUniversity && course.university?.name && (
                            <button
                                onClick={handleUniversityClick}
                                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 hover:underline transition-all text-left w-full truncate"
                            >
                                {course.university.name}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`p-2 sm:p-2.5 rounded-xl transition-all transform hover:scale-110 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${saved
                                ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600 shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        title={saved ? 'Unsave course' : 'Save course'}
                    >
                        <Heart className={`h-5 w-5 sm:h-5 sm:w-5 ${saved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Location */}
                {course.university?.location && (
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 p-2 bg-gray-50 rounded-lg">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary-600 flex-shrink-0" />
                        <span className="font-medium truncate">
                            {course.university.location.city && `${course.university.location.city}, `}
                            {course.university.location.country}
                        </span>
                    </div>
                )}

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {course.fees?.amount && (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100">
                            <div className="flex items-center mb-1">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Fees</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                {course.fees.currency} {course.fees.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">/{course.fees.per}</p>
                        </div>
                    )}
                    {course.duration && (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="flex items-center mb-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Duration</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{course.duration}</p>
                        </div>
                    )}
                    {course.university?.ranking && (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl border border-purple-100">
                            <div className="flex items-center mb-1">
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mr-1 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">Ranking</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900">#{course.university.ranking}</p>
                        </div>
                    )}
                    {course.level && (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg sm:rounded-xl border border-orange-100">
                            <span className="text-[10px] sm:text-xs text-gray-600 font-medium block mb-1">Level</span>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 capitalize truncate">{course.level}</p>
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
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
                        <span className="text-xs font-semibold text-gray-700">AI Fit Score</span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="flex-1 sm:w-20 sm:flex-none h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${(course.aiFitScore / 10) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-primary-600 whitespace-nowrap">{course.aiFitScore}/10</span>
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
                        className="btn-primary flex-1 w-full text-xs sm:text-sm py-2.5 sm:py-2.5"
                    >
                        View Details
                    </button>
                    <button
                        onClick={handleCompare}
                        className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2.5 w-full sm:w-auto"
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

