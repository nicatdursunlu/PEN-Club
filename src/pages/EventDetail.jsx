import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Event data - in a real app, this would come from an API or database
  const eventsData = {
    'job-networking-meetup-feb-2026': {
      title: 'Job Networking & Support Meetup',
      date: 'February 15, 2026',
      time: '12:00 PM - 2:00 PM',
      location: 'Green Caffè Nero, Warsaw, Poland',
      category: 'Networking',
      status: 'completed',
      attendees: 28,
      description: '🚀 PEN Club is starting a new phase…',
      fullDescription: `On Sunday, February 15th, 2026, PEN Club hosted a transformative networking meetup that brought together 28 members of the Azerbaijani community in Poland. This event marked a new phase in our club's mission - focusing on real, tangible support between those actively seeking employment opportunities in Poland and those who are currently established in their careers.

The atmosphere was warm and collaborative as participants gathered to share experiences, exchange insights, and build meaningful professional relationships. The event created a safe space where job seekers could openly discuss their challenges while employed professionals offered guidance, mentorship, and practical advice based on their own journeys in the Polish job market.

Throughout the two-hour session, attendees engaged in deep conversations about navigating the Polish employment landscape, understanding cultural nuances in the workplace, and leveraging professional networks effectively. The energy in the room was palpable as connections were made, LinkedIn profiles were reviewed on the spot, and CVs were critiqued with constructive feedback.`,
      agenda: [
        {
          time: '12:00 PM - 12:15 PM',
          title: 'Welcome & Introduction',
          description: 'Opening remarks by PEN Club organizers, introduction to the event format, and ice-breaking session where each participant shared their current professional status and what they hoped to gain from the meetup.'
        },
        {
          time: '12:15 PM - 12:45 PM',
          title: 'Panel Discussion: Job Market Insights',
          description: 'Employed professionals shared their experiences about finding jobs in Poland, discussing topics like application strategies, interview preparation, and workplace culture. Q&A session allowed job seekers to ask specific questions about different industries and career paths.'
        },
        {
          time: '12:45 PM - 1:15 PM',
          title: 'CV & LinkedIn Review Sessions',
          description: 'Small group breakout sessions where participants paired up for one-on-one CV reviews and LinkedIn profile optimization. Experienced professionals provided personalized feedback on resumes, cover letters, and online professional presence.'
        },
        {
          time: '1:15 PM - 1:45 PM',
          title: 'Networking & Relationship Building',
          description: 'Open networking time with refreshments. Participants exchanged contact information, discussed potential job opportunities, and formed mentorship connections. Several attendees discovered mutual professional interests and planned follow-up meetings.'
        },
        {
          time: '1:45 PM - 2:00 PM',
          title: 'Closing & Next Steps',
          description: 'Wrap-up session where participants shared key takeaways, success stories from the day, and commitments to support each other going forward. Announcement of future PEN Club networking events and initiatives.'
        }
      ],
      eventHighlights: [
        'Over 15 CV reviews conducted with personalized feedback',
        'Multiple LinkedIn connections made between job seekers and employers',
        '3 potential job leads identified during networking sessions',
        'Formation of 5 ongoing mentorship pairs',
        'Shared resources including job boards, recruitment agencies, and professional groups',
        'Commitment from attendees to continue supporting each other beyond the event'
      ],
      highlights: [
        'Real-life experiences about finding a job in Poland',
        'Communication and networking opportunities',
        'Exchange of ideas regarding CV / LinkedIn improvement',
        'New connections and strong relationships',
        'Opportunity to expand your network and support others'
      ],
      goal: "PEN Club's goal is simple: To move forward together, not alone.",
      images: [
        {
          url: '/images/events/job-networking-feb-2026.jpeg',
          alt: 'Job Networking & Support Meetup - Group photo of attendees',
          caption: 'Our amazing community coming together for networking and support'
        }
      ],
      organizer: 'PEN Club Team',
      locationLink: 'https://maps.app.goo.gl/trXVGZfHtWRW1PmU9',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.8582558091102!2d21.0217404!3d52.209623300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccdefa5c150b%3A0x2cd5168208e55a86!2sGreen%20Caff%C3%A8%20Nero!5e0!3m2!1sen!2spl!4v1771243121410!5m2!1sen!2spl'
    },
    'football-tournament-march-2026': {
      title: 'Football Tournament',
      date: 'March 15, 2026',
      time: '3:00 PM - 6:00 PM',
      location: 'City Sports Complex',
      category: 'Sports',
      status: 'upcoming',
      description: 'Join us for an exciting football tournament! Form teams and compete for the championship trophy.',
      fullDescription: 'Get ready for an action-packed afternoon of football! This tournament brings together the Azerbaijani community in Poland for friendly competition and team building.',
      highlights: [
        'Team-based competition format',
        'Championship trophy for winners',
        'Refreshments provided',
        'All skill levels welcome',
        'Great opportunity to meet new people'
      ],
      goal: 'Building community through sports and healthy competition.',
      images: [],
      organizer: 'PEN Club Sports Committee'
    },
    'mafia-night-march-2026': {
      title: 'Mafia Night',
      date: 'March 22, 2026',
      time: '7:00 PM - 11:00 PM',
      location: 'Community Center',
      category: 'Games',
      status: 'upcoming',
      description: 'Strategic Mafia game night with multiple rounds. Test your detective skills and social deduction!',
      fullDescription: 'Join us for an evening of mystery, strategy, and fun! Our Mafia night features multiple rounds of the classic social deduction game.',
      highlights: [
        'Multiple game rounds',
        'Experienced moderators',
        'Snacks and drinks provided',
        'Prizes for best players',
        'Perfect for making new friends'
      ],
      goal: 'Entertainment and social bonding through strategic gameplay.',
      images: [],
      organizer: 'PEN Club Games Team'
    },
    'summer-picnic-aug-2025': {
      title: 'Summer Picnic & Games Festival',
      date: 'August 16, 2025',
      time: '12:00 PM - 6:00 PM',
      location: 'Outdoor Park, Warsaw',
      category: 'Social',
      status: 'completed',
      attendees: 65,
      description: '🌿 Epic outdoor picnic with volleyball, mafia, intellectual games, board games, music, pizza, and samovar tea!',
      fullDescription: `On August 16th, 2025, PEN Club organized one of the most memorable events of the summer - a grand picnic and games festival that brought together 65 members of our vibrant community. This wasn't just another outdoor gathering; it was a celebration of friendship, culture, and the joy of spending quality time together in nature.

The event offered two participation packages to accommodate everyone's preferences. The Full Package (40 AZN) included delicious pizza along with all activities, while the Basic Package (20 AZN) allowed participants to bring their own food and enjoy all the games and entertainment. This flexible approach ensured that everyone could join regardless of their budget or dietary preferences.

From noon until evening, the park was filled with laughter, competitive spirit, and the warmth of community bonding. Multiple activity stations were set up across the venue - volleyball nets for sports enthusiasts, cozy spots for board games, areas for intellectual competitions with exciting prizes, and of course, the legendary Mafia game sessions that kept everyone on their toes. The highlight for many was the traditional Azerbaijani samovar tea service, which added a special cultural touch to the gathering and reminded everyone of home. Music played throughout the day, creating the perfect atmosphere for both energetic activities and relaxed conversations. The combination of sports, strategy games, intellectual challenges, delicious food, and refreshing drinks made this event truly unforgettable.`,
      eventHighlights: [
        '65 participants enjoying a full day of activities',
        'Perfect summer weather for outdoor celebration',
        'Multiple volleyball matches with rotating teams',
        'Intense Mafia game sessions with experienced moderators',
        'Intellectual quiz competitions with prizes for winners',
        'Variety of board games for all ages and interests',
        'Live music creating festive atmosphere',
        'Traditional Azerbaijani samovar tea service',
        'Pizza feast and cold refreshing drinks',
        'Successful blend of sports, games, and cultural elements'
      ],
      highlights: [
        'Volleyball matches for sports enthusiasts 🏐',
        'Strategic Mafia games testing social deduction skills 🕵️‍♂️',
        'Intellectual competitions with exciting prizes 🧠',
        'Board games for relaxed entertainment 🎲',
        'Live music and dancing 🎵',
        'Delicious pizza and snacks 🍕',
        'Cold refreshing drinks 🍹',
        'Traditional samovar tea experience ☕',
        'Two package options (Full & Basic) for flexibility',
        'All-day entertainment from noon to evening'
      ],
      goal: "Creating an unforgettable summer experience that combines sports, intellectual activities, cultural traditions, and community bonding in a beautiful outdoor setting.",
      images: [],
      organizer: 'PEN Club Events Team',
      locationLink: 'https://maps.app.goo.gl/Gcipa9CUG4X9tMN98',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2005.315747698821!2d20.999647943340328!3d52.214345269053595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd005716fdf3%3A0xf12423803d05bdd7!2sLe%C5%BCaki%20kamienne%20na%20Polu%20Mokotowskim!5e0!3m2!1sen!2spl!4v1771243596555!5m2!1sen!2spl',
      pricing: {
        full: '40 AZN (includes pizza)',
        basic: '20 AZN (bring your own food)'
      },
      specialNote: '🌟 This event featured two package options: Full Package (40 AZN) with pizza included, and Basic Package (20 AZN) where participants brought their own food. Both packages included access to all activities, games, music, drinks, and the traditional samovar tea!'
    },
    'outdoor-volleyball-sept-2025': {
      title: 'Outdoor Volleyball - Last Summer Games',
      date: 'September 12, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Volleyball Court, Warsaw',
      category: 'Sports',
      status: 'completed',
      attendees: 32,
      description: '🏐 Final outdoor volleyball session before winter!',
      fullDescription: `On September 12th, 2025, PEN Club organized what would be the last outdoor volleyball session of the summer season. With 32 enthusiastic participants, this event marked a bittersweet moment as we prepared to transition from free outdoor games to indoor facilities for the colder months ahead.

The weather was perfect for volleyball - warm but not too hot, with a gentle breeze that made the game even more enjoyable. Players of all skill levels came together, forming balanced teams and engaging in friendly but competitive matches. The atmosphere was filled with laughter, cheers, and the satisfying sound of the volleyball being spiked and served across the net.

As the sun began to set, there was a collective appreciation for these outdoor sessions that had brought the community together throughout the summer. The event served as a reminder to make the most of the remaining warm days, as future games would require indoor venue bookings and associated costs.`,
      eventHighlights: [
        '32 active participants enjoying the last outdoor session',
        'Perfect weather conditions for volleyball',
        '6 competitive matches played throughout the event',
        'Mix of experienced players and beginners playing together',
        'Community bonding before transitioning to indoor games',
        'Important announcement about winter indoor sessions',
        'Group photo capturing the memorable moment'
      ],
      highlights: [
        'Last chance to play outdoors before winter',
        'Free participation (no venue costs)',
        'All skill levels welcome',
        'Great weather and atmosphere',
        'Community building through sports',
        'Information about upcoming indoor sessions'
      ],
      goal: "Making the most of summer weather while building community through sports before transitioning to indoor facilities.",
      images: [],
      organizer: 'PEN Club Sports Committee',
      locationLink: 'https://maps.app.goo.gl/Rj57CGbqSG3mzAL89',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.5506430935175!2d20.9962002!3d52.215213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccc08052518d%3A0x88e686ef3b99e439!2sVolleyball%20Court!5e0!3m2!1sen!2spl!4v1771243149775!5m2!1sen!2spl',
      specialNote: '⚠️ Important: Summer is almost over! Once the weather gets colder, games will be organized indoors (paid). Don\'t miss this opportunity for free outdoor volleyball!'
    }
  }

  const event = eventsData[id]

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the event you're looking for.</p>
            <button 
              onClick={() => navigate('/events')} 
              className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="event-detail-page bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-bg-dark py-16 text-white">
        <div className="max-w-7xl mx-auto px-5">
          <button 
            onClick={() => navigate('/events')} 
            className="mb-6 flex items-center gap-2 text-white hover:text-secondary transition-colors font-semibold"
          >
            ← Back to Events
          </button>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-4 py-2 rounded-full font-semibold ${
              event.status === 'completed' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {event.status === 'completed' ? '✓ Completed' : '📅 Upcoming'}
            </span>
            <span className="px-4 py-2 bg-secondary text-white rounded-full font-semibold">
              {event.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕐</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span>{event.location}</span>
            </div>
            {event.attendees && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span>{event.attendees} Attendees</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {event.images && event.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Photos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-64 object-cover"
                        />
                        {image.caption && (
                          <p className="p-3 text-sm text-gray-600 bg-gray-50">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Event</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
              </div>

              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Agenda</h2>
                  <div className="space-y-6">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-32 text-secondary font-bold">{item.time}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.eventHighlights && event.eventHighlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Highlights</h2>
                  <ul className="space-y-3">
                    {event.eventHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-2xl flex-shrink-0">🎯</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.highlights && event.highlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">What Participants Gained</h2>
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-secondary text-xl flex-shrink-0">✔</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.goal && (
                <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold mb-4">Our Goal</h2>
                  <p className="text-lg leading-relaxed">{event.goal}</p>
                </div>
              )}

              {event.pricing && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Pricing Options</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-secondary rounded-xl p-6 hover:shadow-xl transition-shadow">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">💎 Full Package</h3>
                      <p className="text-3xl font-bold text-secondary mb-2">{event.pricing.full}</p>
                      <p className="text-gray-600">Includes pizza and all activities</p>
                    </div>
                    <div className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-xl transition-shadow">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">⭐ Basic Package</h3>
                      <p className="text-3xl font-bold text-secondary mb-2">{event.pricing.basic}</p>
                      <p className="text-gray-600">Bring your own food, enjoy all activities</p>
                    </div>
                  </div>
                </div>
              )}

              {event.mapEmbedUrl && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Location</h2>
                  <div className="space-y-4">
                    <iframe
                      src={event.mapEmbedUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0, borderRadius: '10px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Event Location Map"
                      className="rounded-lg"
                    ></iframe>
                    <a 
                      href={event.locationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-white border-2 border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all"
                    >
                      📍 Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <strong className="text-gray-700 font-semibold">Date:</strong>
                    <span className="text-gray-600">{event.date}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <strong className="text-gray-700 font-semibold">Time:</strong>
                    <span className="text-gray-600">{event.time}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <strong className="text-gray-700 font-semibold">Location:</strong>
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                  {event.locationLink && (
                    <div className="pt-2">
                      <a 
                        href={event.locationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent font-semibold transition-colors"
                      >
                        📍 View on Map
                      </a>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <strong className="text-gray-700 font-semibold">Category:</strong>
                    <span className="text-gray-600">{event.category}</span>
                  </div>
                  {event.organizer && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Organizer:</strong>
                      <span className="text-gray-600">{event.organizer}</span>
                    </div>
                  )}
                </div>
              </div>

              {event.specialNote && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl shadow-lg p-6">
                  <div className="text-gray-800 leading-relaxed">
                    {event.specialNote}
                  </div>
                </div>
              )}

              {event.status === 'upcoming' && (
                <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-3">Interested?</h3>
                  <p className="mb-4">Contact us to register for this event</p>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="w-full px-6 py-3 bg-white text-secondary rounded-lg font-bold hover:bg-gray-100 transition-all"
                  >
                    Contact Us
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Event</h3>
                <div className="flex flex-col gap-3">
                  <button className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold" aria-label="Share on Facebook">
                    📘 Facebook
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold" aria-label="Share on WhatsApp">
                    💬 WhatsApp
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold" aria-label="Share on Instagram">
                    📷 Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">More Events</h2>
          <p className="text-lg text-gray-600 mb-8">Check out other events from PEN Club</p>
          <button 
            onClick={() => navigate('/events')} 
            className="px-8 py-3 bg-white border-2 border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all"
          >
            View All Events
          </button>
        </div>
      </section>
    </div>
  )
}

export default EventDetail
