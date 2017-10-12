class Walker {
  constructor (canvas, x, y) {
    this._noise = new SimplexNoise();
    this._canvas = canvas;
    this._x = x;
    this._y = y;

    this._path = [
      [x, y]
    ];
  }

  walk() {
    let choice = this._noise.noise2D(new Date().getTime() / 100, 10)

    if (choice < -0.5) {
      this._x ++;
    } else if (choice < 0) {
      this._x --;
    } else if (choice < 0.5) {
      this._y ++;
    } else if (choice < 1) {
      this._y --;
    }

    this._path.push([this._x, this._y]);
  }

  draw() {
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