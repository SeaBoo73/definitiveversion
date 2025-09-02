// Hide Vite error overlay programmatically
export function hideViteErrorOverlay() {
  // Hide any existing overlay elements
  const hideElements = () => {
    const selectors = [
      'vite-error-overlay',
      '#vite-plugin-runtime-error-modal',
      '.vite-error-overlay',
      '[data-vite-dev-id]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.zIndex = '-1';
        }
      });
    });

    // Hide any fixed position overlays that look like error dialogs
    const fixedElements = document.querySelectorAll('div[style*="position: fixed"]');
    fixedElements.forEach(el => {
      if (el instanceof HTMLElement && el.style.zIndex === '99999') {
        el.style.display = 'none';
      }
    });
  };

  // Run immediately
  hideElements();
  
  // Run when DOM changes
  const observer = new MutationObserver(hideElements);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Run periodically to catch any new overlays
  setInterval(hideElements, 100);
}

// Auto-start when module is imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideViteErrorOverlay);
  } else {
    hideViteErrorOverlay();
  }
}