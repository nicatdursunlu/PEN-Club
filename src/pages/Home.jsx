import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className="home">
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Play</h3>
              <p className="text-gray-600 leading-relaxed">
                Sports games, board games, Mafia nights, and recreational activities 
                that bring Azerbaijani youth together for fun and memorable experiences.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Enjoy</h3>
              <p className="text-gray-600 leading-relaxed">
                Picnics, social meetups, and intellectual competitions designed to 
                make your leisure time productive while having maximum fun.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional development events and networking opportunities to build 
                lasting connections within the Azerbaijani community in Poland.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary to-bg-dark">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-5xl font-bold text-secondary mb-2">50+</div>
              <div className="text-xl text-gray-200">Events Organized</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-5xl font-bold text-secondary mb-2">5+</div>
              <div className="text-xl text-gray-200">Event Categories</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-5xl font-bold text-secondary mb-2">100%</div>
              <div className="text-xl text-gray-200">Community Focused</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Join the Community?</h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Become part of the Azerbaijani youth community in Poland. Experience 
            sports, games, networking, and make your leisure time truly productive!
          </p>
          <a href="/contact" className="inline-block px-10 py-4 bg-white text-secondary rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
            Get Started
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
