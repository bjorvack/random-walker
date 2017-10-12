let canvas = new Canvas(document.getElementById('canvas'))
let walker = new Walker(canvas, document.body.clientWidth / 2, document.body.clientHeight / 2);

canvas.draw(
  function () {
    walker.walk();
    walker.draw();
  }
);