# Stevie Athletics — Website

Multi-page static website for athletic performance training services.

## Structure

```
stebv/
├── index.html                  # Home page
├── pages/
│   ├── oferta.html             # Services/Offer
│   ├── performance-assessment.html  # Assessment quiz
│   ├── case-studies.html       # Success stories
│   ├── o-mnie.html             # About
│   ├── faq.html                # FAQ
│   ├── kontakt.html            # Contact
│   ├── polityka-prywatnosci.html
│   └── cookies.html
├── assets/
│   ├── css/
│   │   ├── main.css            # Main stylesheet (imports all)
│   │   ├── variables.css       # Design tokens
│   │   ├── components.css      # UI components
│   │   ├── layout.css          # Layout utilities
│   │   ├── animations.css      # Animations
│   │   ├── header.css          # Header/nav
│   │   ├── footer.css          # Footer
│   │   └── pages/              # Page-specific styles
│   ├── js/
│   │   ├── main.js             # Core functionality
│   │   ├── assessment.js       # Quiz logic
│   │   ├── faq.js              # Accordion
│   │   └── analytics.js        # Event tracking
│   ├── images/
│   └── videos/
├── content/
│   ├── pl/                     # Polish content (JSON)
│   └── en/                     # English content (JSON)
└── config.js                   # Configuration
```

## Features

- ✅ Multi-page static site (HTML/CSS/JS)
- ✅ Performance Assessment with routing logic
- ✅ Responsive design with mobile CTA
- ✅ Calendly integration placeholders
- ✅ WhatsApp integration
- ✅ Analytics event tracking
- ✅ i18n-ready content structure
- ✅ FAQ accordion
- ✅ Contact form

## Configuration

Edit `config.js` to set:
- Calendly URLs
- WhatsApp number
- Instagram URL
- Google Maps embed

## Content Management

Content is stored in JSON files in `/content/pl/` and `/content/en/`.
Edit these files to update text without touching HTML.

## Design System

Colors:
- Primary: #0A3D91
- Background: #0F0F0F
- Text: #FFFFFF
- Secondary: #B0B0B0

Fonts:
- Headings: Oswald (uppercase, wide tracking)
- Body: Inter

## Development

Simply open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve
```

## Assets Required

Add these files:
- `assets/videos/hero.mp4` - Hero background video
- `assets/videos/about.mp4` - About page video
- `assets/images/hero-poster.jpg` - Video poster
- `assets/images/steven-poster.jpg` - About video poster

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Notes

- Videos use lazy loading
- Fonts preconnected
- CSS imports organized
- Animations respect prefers-reduced-motion
