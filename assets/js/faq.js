/**
 * Stevie Athletics — FAQ Accordion
 */

(function() {
  'use strict';
  
  const accordions = document.querySelectorAll('.accordion');
  
  if (!accordions.length) return;
  
  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion__item');
    
    items.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      
      trigger?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items in this accordion
        items.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });
})();
