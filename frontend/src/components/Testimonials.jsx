import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'MBA Student',
    university: 'Harvard Business School',
    image: '👩‍💼',
    text: 'CourseFinder helped me find the perfect MBA program. The AI recommendations were spot-on!',
    rating: 5
  },
  {
    name: 'Raj Patel',
    role: 'CS Graduate',
    university: 'Stanford University',
    image: '👨‍💻',
    text: 'The comparison feature saved me weeks of research. I could see all details side-by-side.',
    rating: 5
  },
  {
    name: 'Emma Johnson',
    role: 'Nursing Student',
    university: 'Johns Hopkins',
    image: '👩‍⚕️',
    text: 'Found my dream nursing program with accurate fee estimates and job outcomes. Highly recommend!',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Loved by Students Worldwide
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card relative"
          >
            <Quote className="h-8 w-8 text-primary-200 absolute top-4 right-4" />
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-3">{testimonial.image}</div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-primary-600">{testimonial.university}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
            <div className="flex">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

