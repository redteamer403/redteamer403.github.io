document.addEventListener('DOMContentLoaded', () => {
    const initScreen = document.getElementById('init-screen');
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');
    const loginBtn = document.getElementById('login-btn');
    
    // Initialize animation
    const initSteps = document.querySelectorAll('.init-step');
    let currentStep = 0;
  
    function showNextStep() {
      if (currentStep < initSteps.length) {
        initSteps[currentStep].style.opacity = '1';
        currentStep++;
        setTimeout(showNextStep, 400);
      } else {
        setTimeout(() => {
          initScreen.classList.add('hidden');
          loginScreen.classList.remove('hidden');
        }, 500);
      }
    }
  
    // Start initialization sequence
    setTimeout(showNextStep, 500);
  
    // Login button handler
    loginBtn.addEventListener('click', () => {
      loginScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
    });
  
    // Update terminal time
    function updateTime() {
      const timeDisplay = document.querySelector('.terminal-time');
      if (timeDisplay) {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString();
      }
    }
  
    setInterval(updateTime, 1000);
  
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.post-card, .note-card');
        
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'block' : 'none';
        });
      });
    }
  });