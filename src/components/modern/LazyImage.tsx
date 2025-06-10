import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PC9zdmc+'
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
  })

  const isVisible = entry?.isIntersecting

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={isVisible ? src : placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        initial={{ scale: 1.1 }}
        animate={{ scale: isLoaded ? 1 : 1.1 }}
        transition={{ duration: 0.6 }}
      />
      
      {!isLoaded && !isError && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-obsidian-700 via-obsidian-600 to-obsidian-700 bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-obsidian-700 text-obsidian-300">
          Failed to load image
        </div>
      )}
    </div>
  )
}

export default LazyImage