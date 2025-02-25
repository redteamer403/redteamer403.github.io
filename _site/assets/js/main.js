document.addEventListener('DOMContentLoaded', () => {
  // Check if this is the first visit
  if (!localStorage.getItem('hasVisited')) {
    const initScreen = document.getElementById('init-screen');
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
        // After initialization, show main content
        setTimeout(() => {
          initScreen.classList.add('hidden');
          mainContent.classList.remove('hidden');
        }, 2000);
      }
    }
  
    // Start initialization sequence
    setTimeout(showNextStep, 500);
    
    // Mark that user has visited
    localStorage.setItem('hasVisited', 'true');
  } else {
    // If not first visit, show main content immediately
    document.getElementById('init-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  }

  // Update system info
  function updateSystemInfo() {
    const timeDisplay = document.querySelector('.terminal-time');
    const locationDisplay = document.querySelector('.location-info');
    const ipDisplay = document.querySelector('.ip-info');

    // Update time
    const now = new Date();
    timeDisplay.textContent = `TIME: ${now.toLocaleTimeString()}`;

    // Get location and IP
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        locationDisplay.textContent = `LOC: ${data.city}, ${data.country_code}`;
        ipDisplay.textContent = `IP: ${data.ip}`;
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });
  }

  updateSystemInfo();
  setInterval(updateSystemInfo, 1000);

  // Notes section functionality
  const categories = document.querySelectorAll('.notes-category h3');
  categories.forEach(category => {
    category.addEventListener('click', () => {
      const subcategory = category.nextElementSibling;
      subcategory.classList.toggle('active');
    });
  });

  // Search functionality
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(searchInput => {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const container = e.target.closest('section');
      const items = container.querySelectorAll('.post-card, .note-card');
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  });
});