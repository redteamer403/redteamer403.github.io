document.addEventListener('DOMContentLoaded', function() {
    console.log('Script running');
  
    var thumbnail = document.getElementById('mindmap-thumbnail');
    if (thumbnail) {
      console.log('Thumbnail found');
      thumbnail.addEventListener('click', function() {
        console.log('Thumbnail clicked');
        document.getElementById('fullscreen-mindmap').style.display = 'block';
      });
    } else {
      console.log('Thumbnail not found');
    }
  
    document.getElementById('close-btn').addEventListener('click', function() {
      document.getElementById('fullscreen-mindmap').style.display = 'none';
    });
  
    document.getElementById('mindmap-svg').addEventListener('load', function() {
      var svgDoc = this.contentDocument;
      var svgElement = svgDoc.documentElement;
      Panzoom(svgElement, {
        contain: 'outside',
        cursor: 'move'
      });
    });
  });