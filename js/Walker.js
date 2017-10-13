class Walker {
  constructor (canvas, x, y) {
    this._noise = new Perlin();
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
    let choiceX = this._noise.noise(new Date().getTime() / 1000, 10)
    let choiceY = this._noise.noise(new Date().getTime() / 1000, 100000)

    if (choiceX <= 1/3) {
      this._x --;
    } else if (choiceX >= 2/3){
      this._x ++;
    }

    if (choiceY <= 1/3) {
      this._y --;
    } else if (choiceY >= 2/3){
      this._y ++;
    }

    if (this._x < 10) {
      this._x = 10;
    } else if (this._x > (this._canvas.canvas.width -10 * this._canvas.ratio) / this._canvas.ratio) {
      this._x = (this._canvas.canvas.width -10 * this._canvas.ratio) / this._canvas.ratio;
    }

    if (this._y < 10) {
      this._y = 10;
    } else if (this._y > (this._canvas.canvas.height -10 * this._canvas.ratio) / this._canvas.ratio) {
      this._y = (this._canvas.canvas.height -10 * this._canvas.ratio) / this._canvas.ratio;
    }

    this._path.push([this._x, this._y]);

    console.log(choiceX, choiceY, this._x, this._y);
  }

  draw() {
    this._canvas.context.lineWidth=4;
    this._canvas.context.fillStyle="#030303";
    this._canvas.context.beginPath();
    this._canvas.context.moveTo(this._path[0][0], this._path[0][1]);

    for (let i = 0 ; i < this._path.length; i++) {
      this._canvas.context.lineTo(this._path[i][0], this._path[i][1]);
    }

    this._canvas.context.stroke();

    this._canvas.context.fillStyle="#61ff59";
    this._canvas.context.fillRect(this._x - 5, this._y -5, 11, 11);
  }
}