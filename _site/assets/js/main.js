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

    // Fetch location data only once on first visit
    fetch('https://ipapi.co/json/', { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('userLocation', JSON.stringify({
          city: data.city,
          country_code: data.country_code,
          ip: data.ip
        }));
        updateSystemInfo();
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });
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

    // Get stored location data
    const locationData = JSON.parse(localStorage.getItem('userLocation') || '{}');
    if (locationData.city && locationData.country_code) {
      locationDisplay.textContent = `LOC: ${locationData.city}, ${locationData.country_code}`;
      ipDisplay.textContent = `IP: ${locationData.ip}`;
    }
  }

  updateSystemInfo();
  setInterval(updateSystemInfo, 1000);

  // Notes section functionality
  const categories = document.querySelectorAll('.notes-category');
  const noteSections = document.querySelectorAll('.note-section');

  // Handle category clicks
  categories.forEach(category => {
    const heading = category.querySelector('h3');
    const subcategory = category.querySelector('.notes-subcategory');
    
    heading.addEventListener('click', () => {
      // Toggle category active state
      category.classList.toggle('active');
      subcategory.classList.toggle('active');
    });
  });

  // Handle subcategory links
  const subcategoryLinks = document.querySelectorAll('.notes-subcategory a');
  subcategoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Hide all sections
      noteSections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Show selected section
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
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