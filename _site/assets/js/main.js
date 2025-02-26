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

    // Store location data only once on first visit
    fetch('https://ipapi.co/json/', { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('userLocation', JSON.stringify({
          city: data.city || 'Unknown',
          country_code: data.country_code || 'XX',
          ip: data.ip || '0.0.0.0'
        }));
        updateSystemInfo();
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        localStorage.setItem('userLocation', JSON.stringify({
          city: 'Unknown',
          country_code: 'XX',
          ip: '0.0.0.0'
        }));
        updateSystemInfo();
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
  
  // Handle category clicks
  categories.forEach(category => {
    const heading = category.querySelector('h3');
    const subcategory = category.querySelector('.notes-subcategory');
    
    heading.addEventListener('click', () => {
      const wasActive = category.classList.contains('active');
      
      // Close all categories
      categories.forEach(c => {
        c.classList.remove('active');
        c.querySelector('.notes-subcategory').style.display = 'none';
      });
      
      // Toggle clicked category
      if (!wasActive) {
        category.classList.add('active');
        subcategory.style.display = 'block';
      }
    });
  });

  // Handle subcategory links
  const subcategoryLinks = document.querySelectorAll('.notes-subcategory a');
  subcategoryLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      subcategoryLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      link.classList.add('active');

      try {
        const response = await fetch(link.href);
        if (!response.ok) throw new Error('Failed to fetch content');
        
        const content = await response.text();
        document.getElementById('note-content').innerHTML = content;
        document.getElementById('search-results').innerHTML = '';
      } catch (error) {
        console.error('Error loading content:', error);
      }
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(async () => {
        const searchTerm = e.target.value.toLowerCase();
        const searchResults = document.getElementById('search-results');
        const noteContent = document.getElementById('note-content');
        
        if (!searchTerm) {
          searchResults.innerHTML = '';
          noteContent.style.display = 'block';
          return;
        }

        try {
          const results = [];
          const links = document.querySelectorAll('.notes-subcategory a');
          
          for (const link of links) {
            const response = await fetch(link.href);
            const text = await response.text();
            
            if (text.toLowerCase().includes(searchTerm)) {
              // Get category name
              const category = link.closest('.notes-category').querySelector('h3').textContent;
              
              results.push({
                title: link.textContent,
                category: category,
                url: link.href,
                content: text
              });
            }
          }

          // Display search results
          noteContent.style.display = 'none';
          if (results.length > 0) {
            searchResults.innerHTML = `
              <h2>Search Results for "${searchTerm}"</h2>
              ${results.map(result => `
                <div class="search-result">
                  <h3><a href="${result.url}">${result.title}</a></h3>
                  <div class="category">Category: ${result.category}</div>
                  <div class="result-preview">
                    ${result.content.substring(0, 200)}...
                  </div>
                </div>
              `).join('')}
            `;
          } else {
            searchResults.innerHTML = `
              <h2>No results found for "${searchTerm}"</h2>
              <p>Try different keywords or browse the categories in the sidebar.</p>
            `;
          }
        } catch (error) {
          console.error('Search error:', error);
          searchResults.innerHTML = '<h2>Error performing search</h2>';
        }
      }, 300);
    });
  }
});