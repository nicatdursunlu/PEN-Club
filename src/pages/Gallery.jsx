import React from 'react'

const Gallery = () => {
  // Placeholder for future gallery images
  const galleryItems = [
    { id: 1, title: 'Game Night 2024', category: 'Events' },
    { id: 2, title: 'Networking Mixer', category: 'Networking' },
    { id: 3, title: 'Creative Workshop', category: 'Workshops' },
    { id: 4, title: 'Annual Gala', category: 'Events' },
    { id: 5, title: 'Sports Day', category: 'Activities' },
    { id: 6, title: 'Team Building', category: 'Activities' }
  ]

  return (
    <div className="gallery-page">
      <section className="bg-gradient-to-r from-primary to-bg-dark py-20 text-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-200">Capturing moments of play, enjoyment, and connection</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="px-6 py-2 bg-secondary text-white rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300">
              All
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
              Events
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
              Networking
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
              Workshops
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
              Activities
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <span className="inline-block px-4 py-1 bg-secondary text-white rounded-full text-sm font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-2xl p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Gallery Coming Soon!</h2>
              <p className="text-lg mb-4 leading-relaxed">
                We're currently building our photo gallery to showcase all the amazing 
                moments from our events. Check back soon to see photos from our game nights, 
                networking mixers, workshops, and more!
              </p>
              <p className="text-lg leading-relaxed">
                In the meantime, follow us on social media to see the latest updates 
                and event highlights.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery
