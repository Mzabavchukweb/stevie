/**
 * Stevie Athletics — Analytics Module
 * 
 * This module handles event tracking and can be connected to various
 * analytics services (Google Analytics, Mixpanel, etc.)
 */

(function() {
  'use strict';
  
  // Analytics configuration
  const ANALYTICS_CONFIG = {
    debug: true, // Set to false in production
    queueFlushInterval: 5000, // Flush queue every 5 seconds
    maxQueueSize: 50
  };
  
  // Initialize analytics
  function initAnalytics() {
    // Process any queued events
    processQueue();
    
    // Set up auto-tracking
    initAutoTracking();
    
    // Flush queue periodically
    setInterval(flushQueue, ANALYTICS_CONFIG.queueFlushInterval);
  }
  
  /**
   * Process queued events
   */
  function processQueue() {
    const queue = window.analyticsQueue || [];
    
    queue.forEach(item => {
      sendEvent(item.event, item.params);
    });
    
    // Clear processed events
    window.analyticsQueue = [];
  }
  
  /**
   * Flush queue to analytics service
   */
  function flushQueue() {
    const queue = window.analyticsQueue || [];
    
    if (queue.length === 0) return;
    
    // Process and clear queue
    processQueue();
  }
  
  /**
   * Send event to analytics service
   */
  function sendEvent(eventName, params = {}) {
    // Debug logging
    if (ANALYTICS_CONFIG.debug) {
      console.log('[Analytics]', eventName, params);
    }
    
    // Add common params
    const enrichedParams = {
      ...params,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    };
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, enrichedParams);
    }
    
    // Store in localStorage for debugging
    if (ANALYTICS_CONFIG.debug) {
      storeDebugEvent(eventName, enrichedParams);
    }
  }
  
  /**
   * Store event in localStorage for debugging
   */
  function storeDebugEvent(eventName, params) {
    try {
      const events = JSON.parse(localStorage.getItem('analytics_debug') || '[]');
      events.push({ event: eventName, params, time: Date.now() });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.shift();
      }
      
      localStorage.setItem('analytics_debug', JSON.stringify(events));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
  
  /**
   * Initialize automatic tracking
   */
  function initAutoTracking() {
    // Track page view
    trackPageView();
    
    // Track outbound link clicks
    trackOutboundLinks();
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track time on page
    trackTimeOnPage();
  }
  
  /**
   * Track page view
   */
  function trackPageView() {
    sendEvent('page_view', {
      page_path: window.location.pathname,
      referrer: document.referrer || 'direct'
    });
  }
  
  /**
   * Track outbound link clicks
   */
  function trackOutboundLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if it's an external link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          sendEvent('outbound_click', {
            destination: href,
            link_text: link.textContent?.trim().slice(0, 50)
          });
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    });
  }
  
  /**
   * Track scroll depth (throttled)
   */
  function trackScrollDepth() {
    const thresholds = [25, 50, 75, 90, 100];
    const tracked = new Set();
    
    let ticking = false;
    let lastScroll = 0;
    
    const checkScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // Only check if scrolled significantly
      if (Math.abs(scrollTop - lastScroll) < 100) {
        ticking = false;
        return;
      }
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          sendEvent('scroll_depth', {
            depth: threshold
          });
        }
      });
      
      lastScroll = scrollTop;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }, { passive: true });
  }
  
  /**
   * Track time on page
   */
  function trackTimeOnPage() {
    const startTime = Date.now();
    const intervals = [30, 60, 120, 300]; // seconds
    const tracked = new Set();
    
    setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      
      intervals.forEach(interval => {
        if (timeOnPage >= interval && !tracked.has(interval)) {
          tracked.add(interval);
          sendEvent('time_on_page', {
            seconds: interval
          });
        }
      });
    }, 5000);
    
    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      sendEvent('page_exit', {
        time_spent_seconds: timeOnPage
      });
    });
  }
  
  // Global handler for custom analytics events
  window.handleAnalyticsEvent = function(eventName, params) {
    sendEvent(eventName, params);
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
  
  // Expose for debugging
  window.analyticsDebug = {
    sendEvent,
    getEvents: () => JSON.parse(localStorage.getItem('analytics_debug') || '[]'),
    clearEvents: () => localStorage.removeItem('analytics_debug')
  };
})();
