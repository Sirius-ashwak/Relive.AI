import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Grief Counselor",
      avatar: "👩‍⚕️",
      rating: 5,
      text: "Relive has transformed how my clients process loss. Being able to have one last conversation with a loved one has provided incredible closure and healing.",
      highlight: "transformed how my clients process loss"
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Executive",
      avatar: "👨‍💼",
      rating: 5,
      text: "Talking to my future self helped me make one of the biggest decisions of my career. The AI understood my aspirations better than I did.",
      highlight: "understood my aspirations better than I did"
    },
    {
      name: "Emily Watson",
      role: "Artist & Mother",
      avatar: "👩‍🎨",
      rating: 5,
      text: "I created a replica of my grandmother to share her stories with my children. They get to know her wisdom and love even though she's gone.",
      highlight: "share her stories with my children"
    },
    {
      name: "Dr. James Kim",
      role: "Psychologist",
      avatar: "👨‍🔬",
      rating: 5,
      text: "The therapeutic potential is immense. Patients can practice difficult conversations and work through past trauma in a safe environment.",
      highlight: "practice difficult conversations"
    },
    {
      name: "Maria Santos",
      role: "Retired Teacher",
      avatar: "👩‍🏫",
      rating: 5,
      text: "At 70, I'm preserving my memories for my grandchildren. They'll be able to talk to me even when I'm no longer here.",
      highlight: "preserving my memories for my grandchildren"
    },
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      avatar: "👨‍💻",
      rating: 5,
      text: "Conversations with my younger self help me remember why I started coding. It's like having a personal mentor who truly gets me.",
      highlight: "like having a personal mentor"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.9] }
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent-pink/10 to-accent-cyan/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Loved by thousands</span>
          </motion.div>

          <h2 className="font-sora text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Stories of</span>
            <br />
            <span className="gradient-text">Connection & Healing</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real people sharing how Relive has helped them preserve memories, 
            find closure, and connect with the past in meaningful ways.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative p-6 rounded-3xl glass glass-hover bg-gradient-to-br from-white/5 to-white/2 overflow-hidden"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center"
              >
                <Quote className="w-4 h-4 text-accent-cyan" />
              </motion.div>

              <div className="relative z-10">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (i * 0.1) }}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-white mb-6 leading-relaxed">
                  "{testimonial.text.split(testimonial.highlight).map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && (
                        <span className="text-accent-cyan font-medium">
                          {testimonial.highlight}
                        </span>
                      )}
                    </span>
                  ))}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-gradient-aurora p-0.5"
                  >
                    <div className="w-full h-full rounded-xl bg-dark-400 flex items-center justify-center text-lg">
                      {testimonial.avatar}
                    </div>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, rgba(94, 241, 255, 0.05) 0%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm">10,000+ active users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-sm">500,000+ conversations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <span className="text-sm">99.9% uptime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;