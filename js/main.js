document.addEventListener("DOMContentLoaded", function(event) {
  // Setup Objects
  let canvas = new Canvas(document.getElementById('canvas'))
  let walker = new Walker(canvas, document.body.clientWidth / 2, document.body.clientHeight / 2);

  // Run logic
  setInterval(function () {
    walker.walk();
  })

  // Add draw logic to Canvas object
  canvas.draw(
    function () {
      walker.draw();
    }
  );
});