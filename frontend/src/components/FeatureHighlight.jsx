import { motion } from 'framer-motion'

export default function FeatureHighlight({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="card text-center group cursor-pointer h-full"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl mb-5 sm:mb-6 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
        <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
    </motion.div>
  )
}

