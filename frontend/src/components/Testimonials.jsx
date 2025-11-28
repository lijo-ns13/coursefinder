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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Loved by Students Worldwide
        </h2>
        <p className="text-base sm:text-lg text-gray-600">See what our users are saying</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card-premium relative group hover:shadow-2xl transition-all duration-300"
          >
            <Quote className="h-10 w-10 text-primary-100 absolute top-6 right-6 group-hover:text-primary-200 transition-colors" />
            <div className="flex items-start mb-5">
              <div className="text-5xl mr-4 flex-shrink-0">{testimonial.image}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</p>
                <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                <p className="text-xs sm:text-sm text-primary-600 font-semibold truncate">{testimonial.university}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed text-base">"{testimonial.text}"</p>
            <div className="flex items-center gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

