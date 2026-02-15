import React from 'react'
import '../styles/Gallery.css'

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
      <section className="gallery-hero">
        <div className="container">
          <h1>Gallery</h1>
          <p>Capturing moments of play, enjoyment, and connection</p>
        </div>
      </section>

      <section className="section gallery-content">
        <div className="container">
          <div className="gallery-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Events</button>
            <button className="filter-btn">Networking</button>
            <button className="filter-btn">Workshops</button>
            <button className="filter-btn">Activities</button>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-placeholder">
                  <div className="placeholder-icon">📸</div>
                  <div className="placeholder-text">
                    <h3>{item.title}</h3>
                    <span className="gallery-category">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-message">
            <div className="message-box">
              <h2>Gallery Coming Soon!</h2>
              <p>
                We're currently building our photo gallery to showcase all the amazing 
                moments from our events. Check back soon to see photos from our game nights, 
                networking mixers, workshops, and more!
              </p>
              <p>
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
