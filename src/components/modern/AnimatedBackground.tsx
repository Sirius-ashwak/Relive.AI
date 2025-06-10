import React from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const AnimatedBackground: React.FC = () => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
  })

  const isVisible = entry?.isIntersecting

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${
            i % 3 === 0 ? 'bg-aurora-500/10' :
            i % 3 === 1 ? 'bg-lavender-500/8' : 'bg-coral-500/6'
          }`}
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={isVisible ? {
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
          } : {}}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {/* Particle System */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-aurora-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={isVisible ? {
            y: [-20, -100, -20],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          } : {}}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Gradient Waves */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={isVisible ? {
          background: [
            'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
          ],
        } : {}}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default AnimatedBackground