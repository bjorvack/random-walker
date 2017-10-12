class Walker {
  constructor (canvas, x, y) {
    this._canvas = canvas;
    this._x = x;
    this._y = y;

    this._path = [
      [x, y]
    ];
    this._choices = [0,0,0,0];
  }

  get choices () {
    return this._choices;
  }

  walk() {
    let choice = Math.floor((Math.random() * 4) + 1);
    this._choices[choice-1] ++;

    switch (choice) {
      case 1:
        this._x ++;
        break;
      case 2:
        this._y ++;
        break;
      case 3:
        this._x --;
        break;
      case 4:
        this._y --;
        break;
    }

    this._path.push([this._x, this._y]);
  }

  draw() {
    this._canvas.clear();
    this._canvas.context.fillStyle="#030303";
    this._canvas.context.beginPath();
    this._canvas.context.moveTo(this._path[0][0], this._path[0][1]);

    for (let i = 0 ; i < this._path.length; i++) {
      this._canvas.context.lineTo(this._path[i][0], this._path[i][1]);
    }

    this._canvas.context.stroke();

    this._canvas.context.fillStyle="#61ff59";
    this._canvas.context.fillRect(this._x - 1, this._y -1, 3, 3);
  }
}

class Canvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");

    this.setup();
  }

  get canvas () {
    return this._canvas;
  }

  get context () {
    return this._context;
  }

  clear () {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  setup () {
    let devicePixelRatio = window.devicePixelRatio || 1;
    let backingStoreRatio = this._context.webkitBackingStorePixelRatio ||
      this._context.mozBackingStorePixelRatio ||
      this._context.msBackingStorePixelRatio ||
      this._context.oBackingStorePixelRatio ||
      this._context.backingStorePixelRatio || 1;
    let ratio = devicePixelRatio / backingStoreRatio;


    if (devicePixelRatio !== backingStoreRatio) {

      let oldWidth = document.body.clientWidth;
      let oldHeight = document.body.clientHeight;

      this._canvas.width = oldWidth * ratio;
      this._canvas.height = oldHeight * ratio;

      this._canvas.style.width = oldWidth + 'px';
      this._canvas.style.height = oldHeight + 'px';

      this._context.scale(ratio, ratio);
    }
  }
}

let canvas = new Canvas(document.getElementById('canvas'))
let walker = new Walker(canvas, document.body.clientWidth / 2, document.body.clientHeight / 2);

setInterval(function() {
  walker.walk();
  walker.draw();
})