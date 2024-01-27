document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const clearButton = document.getElementById('clear-btn');
    const undoButton = document.getElementById('undo-btn');
    const saveButton = document.getElementById('save-btn');
    const drawingsContainer = document.getElementById('drawings-container');
    const colorSelector=document.getElementById('colorSelector');
  
    let painting = false;
    let history = [];
    let currentStep = 0;

    

  
    function startPosition(e) {
      painting = true;
      draw(e);
    }
  
    function endPosition() {
      if (painting) {
        painting = false;
        context.beginPath();
        if (!painting) {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          history.push(imageData);
          currentStep++;
        }
      }
    }
    
  
    function draw(e) {
      if (!painting) return;
    
      let rect = canvas.getBoundingClientRect();
      let offsetX = rect.left + window.pageXOffset;
      let offsetY = rect.top + window.pageYOffset;
    
      let x, y;
    
      if (window.innerWidth < 800) {
        x = (e.touches ? e.touches[0].clientX : e.clientX) - offsetX;
        y = (e.touches ? e.touches[0].clientY : e.clientY) - offsetY;
        if(x>50 && x<200){
          x-=10;
        }else if(x>200){
          x-=30;
        }
        if(y>100){
          y-=10;
        }
        
      }else {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
      }
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = colorSelector.value;
    
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
      if(currentStep ==0){
        currentStep--;
        clearCanvas();
      }else if (currentStep > 0) {
        currentStep--;
        const imageData = history[currentStep];
        context.putImageData(imageData, 0, 0);
      } else if(currentStep<0) {
        currentStep = 0;
      }
    }
    
    
  
    function saveDrawing() {
      const drawingData = canvas.toDataURL('image/png');
      const nombre = document.getElementById("nombres").value;
    
      const formData = new FormData();
      formData.append('dibujo', drawingData);
      formData.append('nombre', nombre);
    
      fetch('https://rositaapp.000webhostapp.com/guardar_dibujo.php', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.mensaje);
          clearCanvas();
          showDrawings();
        })
        .catch(error => {
          console.error('Error al guardar el dibujo:', error);
        });
    }
    
    


    function showDrawings() {
      drawingsContainer.innerHTML = '';
  
      fetch('https://rositaapp.000webhostapp.com/mostrar_dibujos.php')
          .then(response => response.text())
          .then(data => {
              drawingsContainer.innerHTML = data;
          })
          .catch(error => {
              console.error('Error al obtener dibujos:', error);
          });
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
  