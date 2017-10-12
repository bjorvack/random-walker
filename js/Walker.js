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

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  walk() {
    let choice = this._noise.noise2D(new Date().getTime() / 10, 10)

    if (choice <= -0.5) {
      this._x ++;
    } else if (choice <= 0) {
      this._x --;
    } else if (choice <= 0.5) {
      this._y ++;
    } else if (choice <= 1) {
      this._y --;
    }

    if (this._x < 0) {
      this._x = 0;
    }

    if (this._y < 0) {
      this._y = 0;
    }

    if (this._x > this._canvas.canvas.width / this._canvas.ratio) {
      this._x = this._canvas.canvas.width / this._canvas.ratio;
    }

    if (this._y > this._canvas.canvas.height / this._canvas.ratio) {
      this._y = this._canvas.canvas.height / this._canvas.ratio;
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