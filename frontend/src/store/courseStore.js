import { create } from 'zustand'

export const useCourseStore = create((set) => ({
  selectedCourses: [],
  comparisonData: null,
  
  addToComparison: (course) => set((state) => {
    if (state.selectedCourses.length >= 2) {
      return state
    }
    if (state.selectedCourses.find(c => c._id === course._id)) {
      return state
    }
    return {
      selectedCourses: [...state.selectedCourses, course]
    }
  }),
  
  removeFromComparison: (courseId) => set((state) => ({
    selectedCourses: state.selectedCourses.filter(c => c._id !== courseId)
  })),
  
  clearComparison: () => set({ selectedCourses: [], comparisonData: null }),
  
  setComparisonData: (data) => set({ comparisonData: data })
}))

