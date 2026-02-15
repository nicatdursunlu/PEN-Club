# PEN Club Website

A modern, responsive website for PEN Club (Play, Enjoy, Network) built with React and Vite.

## About PEN Club

PEN Club is a vibrant community where people come together to play, enjoy life, and build meaningful connections. Our events range from casual game nights to professional networking sessions, always maintaining the perfect balance between fun and purpose.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean and modern interface with smooth animations
- **Navigation**: Easy-to-use navbar with active link highlighting
- **Multiple Pages**:
  - Home: Hero section with club introduction
  - About: Information about PEN Club's mission and values
  - Events: Upcoming and past events showcase
  - Gallery: Photo gallery (coming soon)
  - Contact: Contact form and information

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with CSS variables and animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd PEN-Club
```

2. Install dependencies:
```bash
npm install
```

3. Add your logo:
   - Place your `logo.png` file in the `public` folder

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
PEN-Club/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Hero.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   └── Contact.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── Navbar.css
│   │   ├── Footer.css
│   │   ├── Hero.css
│   │   ├── Home.css
│   │   ├── About.css
│   │   ├── Events.css
│   │   ├── Gallery.css
│   │   └── Contact.css
│   ├── App.jsx
│   ├── App.css
│   └── index.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Customization

### Colors

The website uses CSS variables for easy customization. Edit `src/styles/global.css`:

```css
:root {
  --primary-color: #3d2b2e;
  --secondary-color: #ff6b35;
  --accent-color: #f7931e;
  /* ... other colors */
}
```

### Content

- Update event information in `src/pages/Events.jsx`
- Modify about content in `src/pages/About.jsx`
- Customize contact details in `src/pages/Contact.jsx`

## Future Enhancements

- Member authentication and profiles
- Event registration system
- Photo gallery with real images
- Blog section
- Newsletter subscription
- Social media integration
- Admin dashboard for event management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: info@penclub.com
- Phone: +1 (555) 123-4567

---

Built with ❤️ by the PEN Club team
