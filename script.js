document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const clearButton = document.getElementById('clear-btn');
    const undoButton = document.getElementById('undo-btn');
    const saveButton = document.getElementById('save-btn');
    const drawingsContainer = document.getElementById('drawings-container');
    const colorSelector=document.getElementById('colorSelector');
    let history = [];
    let currentStep = 0;
    let ctx = canvas.getContext("2d");
    ctx.lineWidth=5;
    ctx.lineCap='round';


  
    
    function canvas_read_mouse(canvas, e) {
      let canvasRect = canvas.getBoundingClientRect();
      canvas.tc_x1 = canvas.tc_x2;
      canvas.tc_y1 = canvas.tc_y2;
      canvas.tc_x2 = e.clientX - canvasRect.left;
      canvas.tc_y2 = e.clientY - canvasRect.top;
  }
  
  function on_canvas_mouse_down(e) {
      canvas_read_mouse(canvas, e);
      canvas.tc_md = true;
  }
  
  function on_canvas_mouse_up(e) {
      canvas.tc_md = false;
  }
  
  function on_canvas_mouse_move(e) {
      canvas_read_mouse(canvas, e);
      if (canvas.tc_md && (canvas.tc_x1 !== canvas.tc_x2 || canvas.tc_y1 !== canvas.tc_y2)) {
          ctx = canvas.getContext("2d");
          ctx.strokeStyle = colorSelector.value;

          ctx.beginPath();
          ctx.moveTo(canvas.tc_x1, canvas.tc_y1);
          ctx.lineTo(canvas.tc_x2, canvas.tc_y2);
          ctx.stroke();
      }
  }
  
  function canvas_read_touch(canvas, e) {
      let canvasRect = canvas.getBoundingClientRect();
      let touch = e.touches[0];
      canvas.tc_x1 = canvas.tc_x2;
      canvas.tc_y1 = canvas.tc_y2;
      canvas.tc_x2 = touch.pageX - document.documentElement.scrollLeft - canvasRect.left;
      canvas.tc_y2 = touch.pageY - document.documentElement.scrollTop - canvasRect.top;
  }
  
  function on_canvas_touch_start(e) {
      canvas_read_touch(canvas, e);
      canvas.tc_md = true;
  }
  
  function on_canvas_touch_end(e) {
      canvas.tc_md = false;
  }
  
  function on_canvas_touch_move(e) {
      canvas_read_touch(canvas, e);
      if (canvas.tc_md && (canvas.tc_x1 !== canvas.tc_x2 || canvas.tc_y1 !== canvas.tc_y2)) {
          //alert(`${canvas.tc_x1} ${canvas.tc_y1} ${canvas.tc_x2} ${canvas.tc_y2}`);
          ctx = canvas.getContext("2d");
          ctx.strokeStyle = colorSelector.value;
          ctx.beginPath();
          ctx.moveTo(canvas.tc_x1, canvas.tc_y1);
          ctx.lineTo(canvas.tc_x2, canvas.tc_y2);
          ctx.stroke();
      }
  }

    
    
    
      
      
  
    function clearCanvas() {
      ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        ctx.putImageData(imageData, 0, 0);
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
  
    
  

  
  canvas.addEventListener('mousedown', (e) => { on_canvas_mouse_down(e) }, false);
  canvas.addEventListener('mouseup', (e) => { on_canvas_mouse_up(e) }, false);
  canvas.addEventListener('mousemove', (e) => { on_canvas_mouse_move(e) }, false);
  canvas.addEventListener('click', (e) => { on_canvas_mouse_move(e) }, false);
  canvas.addEventListener('touchstart', (e) => { on_canvas_touch_start(e) }, false);
  canvas.addEventListener('touchend', (e) => { on_canvas_touch_end(e) }, false);
  canvas.addEventListener('touchmove', (e) => { on_canvas_touch_move(e) }, false);
  canvas.addEventListener('touch', (e) => { on_canvas_touch_move(e) }, false);
  
    clearButton.addEventListener('click', clearCanvas);
    undoButton.addEventListener('click', undo);
    saveButton.addEventListener('click', saveDrawing);
  
    // Mostrar los dibujos guardados al cargar la página
    showDrawings();
  });
  