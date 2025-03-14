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

    // Store location data only once on first visit (without IP)
    fetch('https://ipapi.co/json/', { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('userLocation', JSON.stringify({
          city: data.city || 'Unknown',
          country_code: data.country_code || 'XX'
        }));
        updateSystemInfo();
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        localStorage.setItem('userLocation', JSON.stringify({
          city: 'Unknown',
          country_code: 'XX'
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

    // Update time
    const now = new Date();
    timeDisplay.textContent = `TIME: ${now.toLocaleTimeString()}`;

    // Get stored location data (without IP)
    const locationData = JSON.parse(localStorage.getItem('userLocation') || '{}');
    if (locationData.city && locationData.country_code) {
      locationDisplay.textContent = `LOC: ${locationData.city}, ${locationData.country_code}`;
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
        // Extract the path from href and ensure it's absolute relative to the base URL
        const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
        const path = new URL(link.getAttribute('href'), baseUrl).href;
        
        // Fetch the content using the full URL
        const response = await fetch(path, {
          headers: {
            'Accept': 'text/html'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }
        
        const content = await response.text();
        // Parse the HTML content to extract the body or content section
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const noteContent = doc.querySelector('#note-content')?.innerHTML || doc.body.innerHTML;

        // Update the content and clear search results
        const noteContentDiv = document.getElementById('note-content');
        noteContentDiv.innerHTML = noteContent || '<p>Content not found.</p>';
        document.getElementById('search-results').innerHTML = '';
        noteContentDiv.style.display = 'block';
        
        // Update URL without page reload
        history.pushState(null, '', link.href);
      } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('note-content').innerHTML = `<p>Error loading content: ${error.message}</p>`;
        document.getElementById('note-content').style.display = 'block';
        document.getElementById('search-results').innerHTML = '';
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
        const searchTerm = e.target.value.toLowerCase().trim();
        const searchResults = document.getElementById('search-results');
        const noteContent = document.getElementById('note-content');
        
        if (!searchTerm) {
          searchResults.innerHTML = '';
          noteContent.style.display = 'block';
          return;
        }

        try {
          const results = new Set(); // Use Set to prevent duplicates
          const links = document.querySelectorAll('.notes-subcategory a');
          
          for (const link of links) {
            const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
            const path = new URL(link.href, baseUrl).href;
            
            const response = await fetch(path, {
              headers: {
                'Accept': 'text/html'
              }
            });
            
            if (!response.ok) continue;
            
            const text = await response.text();
            // Parse HTML to extract only note content (ignore headers, meta tags, etc.)
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const noteContentElement = doc.querySelector('#note-content');
            let noteText = noteContentElement ? noteContentElement.textContent || noteContentElement.innerText : '';
            
            // If no #note-content, fall back to body but clean aggressively
            if (!noteText) {
              noteText = (doc.body.textContent || doc.body.innerText || '').trim();
            }
            
            // Remove code block content and irrelevant structural text
            noteText = noteText.replace(/```[\s\S]*?```/g, '').trim()
                             .replace(/^\s*<!DOCTYPE html>[\s\S]*?<body>|<\/body>[\s\S]*$/gi, '').trim()
                             .replace(/<script>[\s\S]*?<\/script>/gi, '').trim()
                             .replace(/<style>[\s\S]*?<\/style>/gi, '').trim()
                             .replace(/<head>[\s\S]*?<\/head>/gi, '').trim();

            if (noteText.toLowerCase().includes(searchTerm)) {
              // Get category name
              const category = link.closest('.notes-category').querySelector('h3').textContent.trim();
              
              // Find a relevant excerpt containing the search term, from note content only
              const lowerText = noteText.toLowerCase();
              const index = lowerText.indexOf(searchTerm);
              const start = Math.max(0, index - 100);
              const end = Math.min(noteText.length, index + 200);
              let excerpt = noteText.substring(start, end).trim();
              
              // Highlight the search term in the excerpt
              if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                excerpt = excerpt.replace(regex, '<span class="search-highlight">$1</span>');
              }
              
              // Highlight the search term in the title
              let title = link.textContent.trim();
              if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                title = title.replace(regex, '<span class="search-highlight">$1</span>');
              }
              
              // Clean excerpt, preserving links but removing all other HTML tags
              excerpt = excerpt.replace(/<(?!(a\s|\/a>|span\sclass="search-highlight"|\/span>))[^>]+>/gi, '');
              
              // Add ellipsis if needed
              if (start > 0) excerpt = '...' + excerpt;
              if (end < noteText.length) excerpt = excerpt + '...';

              // Add to Set as a unique object to prevent duplicates
              results.add(JSON.stringify({
                title: title,
                category: category,
                url: link.href,
                content: excerpt
              }));
            }
          }

          // Convert Set back to array of objects
          const uniqueResults = Array.from(results).map(item => JSON.parse(item));

          // Display search results
          noteContent.style.display = 'none';
          if (uniqueResults.length > 0) {
            searchResults.innerHTML = `
              <h2>Search Results for "${searchTerm}"</h2>
              ${uniqueResults.map(result => `
                <div class="search-result">
                  <h3><a href="${result.url}">${result.title}</a></h3>
                  <div class="category">Category: ${result.category}</div>
                  <div class="result-preview">${result.content}</div>
                </div>
              `).join('')}
            `;

            // Add click handlers for search result links
            searchResults.querySelectorAll('.search-result a').forEach(link => {
              link.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                  const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
                  const path = new URL(link.href, baseUrl).href;
                  
                  const response = await fetch(path, {
                    headers: {
                      'Accept': 'text/html'
                    }
                  });
                  
                  if (!response.ok) throw new Error('Failed to fetch content');
                  
                  const content = await response.text();
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(content, 'text/html');
                  const noteContentDiv = document.getElementById('note-content') || document.createElement('div');
                  if (!document.getElementById('note-content')) {
                    noteContentDiv.id = 'note-content';
                    document.querySelector('.notes-content').appendChild(noteContentDiv);
                  }
                  const noteContent = doc.querySelector('#note-content')?.innerHTML || doc.body.innerHTML;

                  noteContentDiv.innerHTML = noteContent || '<p>Content not found.</p>';
                  noteContentDiv.style.display = 'block';
                  searchResults.innerHTML = '';
                  searchInput.value = '';
                  
                  // Update URL without page reload
                  history.pushState(null, '', link.href);
                } catch (error) {
                  console.error('Error loading content:', error);
                  const noteContentDiv = document.getElementById('note-content') || document.createElement('div');
                  if (!document.getElementById('note-content')) {
                    noteContentDiv.id = 'note-content';
                    document.querySelector('.notes-content').appendChild(noteContentDiv);
                  }
                  noteContentDiv.innerHTML = `<p>Error loading content: ${error.message}</p>`;
                  noteContentDiv.style.display = 'block';
                  searchResults.innerHTML = '';
                }
              });
            });
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

  // Handle initial page load or URL changes (e.g., refresh or direct navigation)
  function loadInitialContent() {
    const currentPath = window.location.pathname;
    
    // If we're on /notes/, show the default content from notes.md without redirecting
    if (currentPath === '/notes/' || currentPath === '/notes') {
      const noteContent = document.getElementById('note-content');
      if (noteContent) {
        noteContent.innerHTML = `
          <div class="note-section">
            <h2>Select a topic from the sidebar to view notes</h2>
            <p>The detailed notes for each topic will be loaded when you select a specific section.</p>
          </div>
        `;
        noteContent.style.display = 'block';
        document.getElementById('search-results').innerHTML = '';
      }
      return; // Exit function to prevent default subcategory navigation
    }

    // If we're on /tools/, show the default content from tools.md without redirecting
    if (currentPath === '/tools/' || currentPath === '/tools') {
      // No default content needed for tools, as it’s already in tools.md
      return;
    }

    // Otherwise, find and simulate a click on the matching subcategory link for /notes/
    const link = document.querySelector(`.notes-subcategory a[href="${currentPath}"]`);
    
    if (link) {
      link.click(); // Simulate click to load content
    } else {
      // Default to first category if no match (but not for /notes/ or /tools/)
      if (currentPath !== '/notes/' && currentPath !== '/notes' && currentPath !== '/tools/' && currentPath !== '/tools') {
        const firstLink = document.querySelector('.notes-subcategory a');
        if (firstLink) firstLink.click();
      }
    }
  }

  // Load initial content when the page loads
  loadInitialContent();

  // Handle popstate (back/forward navigation)
  window.addEventListener('popstate', loadInitialContent);
});