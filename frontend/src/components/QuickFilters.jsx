import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, DollarSign, TrendingUp } from 'lucide-react'

const quickFilters = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    label: 'Top Universities',
    filter: { sort: 'ranking' },
    color: 'bg-blue-500'
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    label: 'Budget Friendly',
    filter: { maxBudget: 30000 },
    color: 'bg-green-500'
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    label: 'High Salary',
    filter: { sort: 'salary' },
    color: 'bg-purple-500'
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    label: 'USA & Canada',
    filter: { country: 'US,CA' },
    color: 'bg-red-500'
  }
]

export default function QuickFilters() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  const handleFilter = (filter) => {
    const params = new URLSearchParams()
    if (filter.country) params.set('country', filter.country)
    if (filter.maxBudget) params.set('maxBudget', filter.maxBudget)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {quickFilters.map((item, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleFilter(item.filter)}
          className={`${item.color} text-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group`}
        >
          <div className="flex flex-col items-center space-y-3">
            <motion.div
              animate={{ rotate: hovered === index ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors"
            >
              {item.icon}
            </motion.div>
            <span className="font-semibold text-sm sm:text-base">{item.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

