// Stevie Athletics Configuration
const CONFIG = {
  // Calendly URLs - Replace with actual URLs
  CALENDLY_GENERAL: 'https://calendly.com/stevie-athletics/consultation',
  CALENDLY_ONLINE: 'https://calendly.com/stevie-athletics/online-consultation',
  CALENDLY_OFFLINE: 'https://calendly.com/stevie-athletics/studio-session',
  
  // WhatsApp
  WHATSAPP_NUMBER: '+48123456789', // Replace with actual number
  WHATSAPP_MESSAGE: 'Cześć, chcę dopytać o współpracę. Mój cel to ...',
  
  // Social Media
  INSTAGRAM_URL: 'https://instagram.com/stevie.athletics',
  
  // Location
  STUDIO_ADDRESS: 'Prosport, ul. Chopina 35, Szczecin',
  GOOGLE_MAPS_EMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2376.8!2d14.55!3d53.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sProsport!5e0!3m2!1spl!2spl!4v1234567890',
  
  // Current Language
  LANG: 'pl',
  
  // Available Languages
  LANGUAGES: ['pl', 'en']
};

// WhatsApp link generator
function getWhatsAppLink(customMessage = null) {
  const message = encodeURIComponent(customMessage || CONFIG.WHATSAPP_MESSAGE);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getWhatsAppLink };
}
