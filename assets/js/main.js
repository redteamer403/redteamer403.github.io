document.addEventListener('DOMContentLoaded', () => {
  // Check if this is the first visit
  if (!sessionStorage.getItem('hasVisited')) {
    const initScreen = document.getElementById('init-screen');
    const statusScreen = document.getElementById('status-screen');
    const mainContent = document.getElementById('main-content');
    
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
          statusScreen.classList.remove('hidden');
          
          // Show status message briefly, then main content
          setTimeout(() => {
            statusScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
          }, 2000);
        }, 500);
      }
    }
  
    // Start initialization sequence
    setTimeout(showNextStep, 500);
    
    // Mark that user has visited
    sessionStorage.setItem('hasVisited', 'true');
  } else {
    // If not first visit, show main content immediately
    document.getElementById('init-screen').classList.add('hidden');
    document.getElementById('status-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  }

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