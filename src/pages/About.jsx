import React from 'react'

const About = () => {
  return (
    <div className="about-page">
      <section className="bg-gradient-to-r from-primary to-bg-dark py-20 text-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold mb-4">About PEN Club</h1>
          <p className="text-2xl text-accent font-semibold">Play • Enjoy • Network</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PEN Club is a dynamic platform aimed at making leisure time productive 
                and enjoyable for Azerbaijani youth living in Poland. We believe in 
                building social connections through games and forming a strong, supportive 
                community where everyone feels at home.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                With over 50+ events organized, we've created countless opportunities 
                for our community to play, enjoy, and network. From sports games to 
                intellectual competitions, from Mafia nights to professional networking 
                events, we bring people together in meaningful and fun ways.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="/logo.jpeg" 
                alt="PEN Club" 
                className="w-80 h-80 object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Goal</h3>
              <p className="text-gray-600 leading-relaxed">
                To bring together Azerbaijani youth living in Poland and organize 
                social and professional events that make leisure time productive 
                and enjoyable.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Building a strong, supportive community through games, social 
                connections, and shared experiences that create lasting friendships.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Achievement</h3>
              <p className="text-gray-600 leading-relaxed">
                With 50+ events organized and counting, we continue to grow and 
                create opportunities for our community to thrive together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What We Organize</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
              <span className="text-4xl font-bold text-secondary">01</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Sports Games ⚽️🎾🏓</h3>
                <p className="text-gray-600 leading-relaxed">
                  Football, tennis, table tennis, and various sports activities that 
                  keep our community active, healthy, and connected through friendly 
                  competition.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
              <span className="text-4xl font-bold text-secondary">02</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Intellectual Competitions 🎓</h3>
                <p className="text-gray-600 leading-relaxed">
                  Quiz nights, trivia competitions, and brain-teasing challenges that 
                  stimulate minds and encourage learning in a fun, competitive environment.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
              <span className="text-4xl font-bold text-secondary">03</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Mafia / Board Games 🕵️‍♂️🕵️</h3>
                <p className="text-gray-600 leading-relaxed">
                  Strategic Mafia games, board game nights, and card games that bring 
                  people together for hours of entertainment and social bonding.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
              <span className="text-4xl font-bold text-secondary">04</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Picnics & Social Meetups 🪵🧺</h3>
                <p className="text-gray-600 leading-relaxed">
                  Outdoor gatherings, picnics, and casual meetups that allow our 
                  community to relax, socialize, and enjoy nature together.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
              <span className="text-4xl font-bold text-secondary">05</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Networking & Professional Events 🗽🖇️</h3>
                <p className="text-gray-600 leading-relaxed">
                  Career development workshops, professional networking sessions, and 
                  mentorship opportunities that help our community grow professionally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
