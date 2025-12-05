import { motion } from 'framer-motion'
import { CheckCircle, Circle, Target } from 'lucide-react'

const steps = [
  { id: 1, label: 'Profile Created', icon: CheckCircle },
  { id: 2, label: 'Courses Explored', icon: Circle },
  { id: 3, label: 'Courses Saved', icon: Circle },
  { id: 4, label: 'Comparisons Made', icon: Circle },
  { id: 5, label: 'Application Ready', icon: Target }
]

export default function ProgressTracker({ currentStep = 1 }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Journey</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.id <= currentStep
          const Icon = step.icon
          
          return (
            <div key={step.id} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                <Icon className={`h-6 w-6 ${isCompleted ? 'fill-current' : ''}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {index < steps.length - 1 && (
                  <div className={`h-8 w-0.5 ml-3 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

