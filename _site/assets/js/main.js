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

  // Enhanced search functionality for notes
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const notesContent = document.querySelector('.notes-content');
      const noteSections = notesContent.querySelectorAll('.note-section');
      const sidebar = document.querySelector('.notes-sidebar');
      const categories = sidebar.querySelectorAll('.notes-category');
      
      if (searchTerm === '') {
        // Reset to default state when search is empty
        noteSections.forEach(section => {
          section.style.display = 'none';
          section.classList.remove('active');
        });
        categories.forEach(category => {
          category.style.display = 'block';
          category.querySelector('.notes-subcategory').classList.remove('active');
        });
        return;
      }

      // Search through all sections
      let hasResults = false;
      noteSections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const matches = text.includes(searchTerm);
        section.style.display = matches ? 'block' : 'none';
        section.classList.toggle('active', matches);
        if (matches) hasResults = true;

        // Show corresponding category in sidebar
        const categoryId = section.id.split('-')[0];
        const category = sidebar.querySelector(`[href="#${section.id}"]`)?.closest('.notes-category');
        if (category) {
          category.style.display = 'block';
          category.querySelector('.notes-subcategory').classList.add('active');
        }
      });

      // Hide categories with no matches
      categories.forEach(category => {
        const hasVisibleLinks = Array.from(category.querySelectorAll('.notes-subcategory a')).some(link => {
          const targetSection = document.querySelector(link.getAttribute('href'));
          return targetSection && targetSection.style.display !== 'none';
        });
        category.style.display = hasVisibleLinks ? 'block' : 'none';
      });
    });
  }
});