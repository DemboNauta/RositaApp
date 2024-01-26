document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-btn');
    const undoButton = document.getElementById('undo-btn');
    const saveButton = document.getElementById('save-btn');
    const drawingsContainer = document.getElementById('drawings-container');
  
    let painting = false;
    let history = [];
    let currentStep = -1;
    let drawingCount = 0;
  
    function startPosition(e) {
      painting = true;
      draw(e);
    }
  
    function endPosition() {
      painting = false;
      context.beginPath();
      if (painting) {
        history.push(context.getImageData(0, 0, canvas.width, canvas.height));
        currentStep++;
      }
    }
  
    function draw(e) {
        if (!painting) return;
      
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left + window.pageXOffset;
        const offsetY = rect.top + window.pageYOffset;
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - offsetX - 20; // Ajuste de 0.5
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - offsetY - 10; // Ajuste de 0.5
      
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = '#000';
      
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
      }
      
      
      
      
  
    function clearCanvas() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      history = [];
      currentStep = -1;
    }
  
    function undo() {
      if (currentStep > 0) {
        currentStep--;
        context.putImageData(history[currentStep], 0, 0);
      }
    }
  
    function saveDrawing() {
      const drawingData = canvas.toDataURL('image/png');
      localStorage.setItem(`savedDrawing_${drawingCount}`, drawingData);
      drawingCount++;
      clearCanvas();
      showDrawings();
    }
  
    function showDrawings() {
      drawingsContainer.innerHTML = '';
      for (let i = 0; i < drawingCount; i++) {
        const savedDrawing = localStorage.getItem(`savedDrawing_${i}`);
        if (savedDrawing) {
          const img = new Image();
          img.src = savedDrawing;
  
          // Agregar la imagen guardada al contenedor
          drawingsContainer.appendChild(img);
        }
      }
    }
  
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
  
    // Eventos táctiles
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      startPosition(e.touches[0]);
    });
  
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      draw(e.touches[0]);
    });
  
    canvas.addEventListener('touchend', endPosition);
  
    clearButton.addEventListener('click', clearCanvas);
    undoButton.addEventListener('click', undo);
    saveButton.addEventListener('click', saveDrawing);
  
    // Mostrar los dibujos guardados al cargar la página
    showDrawings();
  });
  