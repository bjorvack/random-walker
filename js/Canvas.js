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

  draw (func) {
    setInterval(function() {
      this.clear();
      func();
    }.bind(this));
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