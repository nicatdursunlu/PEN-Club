import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-bg-dark to-primary overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Welcome to <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">PEN Club</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-accent">
              Play • Enjoy • Network
            </p>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              A dynamic platform for Azerbaijani youth in Poland, making leisure time 
              productive and enjoyable through games, social connections, and building 
              a strong community. Join us for 50+ amazing events and counting!
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/events" 
                className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Events
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-3 bg-transparent text-white border-2 border-secondary rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/logo.jpeg" 
              alt="PEN Club" 
              className="w-64 h-64 md:w-80 md:h-80 object-contain animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-bounce">
        <span className="block text-sm mb-2">Scroll Down</span>
        <div className="text-2xl">↓</div>
      </div>
    </section>
  )
}

export default Hero
