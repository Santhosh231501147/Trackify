/**
 * Animation utilities for the expense tracker
 */

// Add CSS animations programmatically
export function setupAnimations() {
    // Define keyframes for animations
    const keyframes = `
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
      
      @keyframes updated {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
          color: var(--color-accent-dark);
        }
        100% {
          transform: scale(1);
        }
      }
      
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }
    `;
    
    // Add keyframes to document
    if (!document.getElementById('dynamic-animations')) {
      const style = document.createElement('style');
      style.id = 'dynamic-animations';
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    
    // Add animation class for total amount updates
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .total-amount.updated {
          animation: updated 0.3s ease;
        }
        
        input.error, select.error {
          animation: shake 0.4s ease;
          border-color: var(--color-error) !important;
        }
        
        .error-message {
          color: var(--color-error);
          font-size: 0.8rem;
          margin-top: -8px;
          margin-bottom: 8px;
          animation: fadeIn 0.3s ease;
        }
      </style>
    `);
  }
  
  /**
   * Add entry animation to an element
   * @param {HTMLElement} element - Element to animate
   */
  export function animateEntry(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Force a reflow to ensure the animation works
    void element.offsetWidth;
    
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
  
  /**
   * Add exit animation to an element
   * @param {HTMLElement} element - Element to animate
   * @param {Function} callback - Callback to run after animation completes
   */
  export function animateExit(element, callback) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    
    element.addEventListener('transitionend', () => {
      if (typeof callback === 'function') {
        callback();
      }
    }, { once: true });
  }