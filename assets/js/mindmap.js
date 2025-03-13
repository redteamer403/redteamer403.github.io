document.addEventListener('DOMContentLoaded', function() {
    const thumbnail = document.getElementById('mindmap-thumbnail');
    const fullscreenContainer = document.getElementById('fullscreen-mindmap');
  
    if (!thumbnail || !fullscreenContainer) {
      console.error('Thumbnail or fullscreen container not found');
      return;
    }
  
    thumbnail.addEventListener('click', function() {
      // Dynamically create full-screen content
      fullscreenContainer.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); z-index: 9999;">
          <button id="close-mindmap" style="position: absolute; top: 10px; right: 10px; background: white; border: none; font-size: 20px; cursor: pointer; z-index: 10000;">×</button>
          <div id="mindmap-container" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
            <div id="pannable-area" style="cursor: move;">
              <img src="/assets/images/pentesting_active_directory.svg" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
          </div>
        </div>
      `;
  
      // Show full-screen view
      fullscreenContainer.style.display = 'block';
  
      // Initialize Panzoom
      const pannableArea = document.getElementById('pannable-area');
      const panzoomInstance = Panzoom(pannableArea, {
        contain: 'outside',
        cursor: 'move',
        minScale: 0.5,
        maxScale: 10,
        step: 0.3,
        panOnlyWhenZoomed: false
      });
  
      // Enable zooming with mouse wheel
      const container = document.getElementById('mindmap-container');
      container.addEventListener('wheel', function(e) {
        panzoomInstance.zoomWithWheel(e);
        e.preventDefault();
      });
  
      // Close full-screen view
      document.getElementById('close-mindmap').addEventListener('click', function() {
        fullscreenContainer.style.display = 'none';
        fullscreenContainer.innerHTML = ''; // Reset content
      });
    });
  });