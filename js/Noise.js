class Alea {
  constructor (seed = '') {
    this._seed = seed;

    if (this._seed.length == 0) {
      this._seed = [+new Date];
    }

    this._s0 = this._mash(' ');
    this._s1 = this._mash(' ');
    this._s2 = this._mash(' ');
    this._c = 1;

    for (let i = 0; i < this._seed.length; i++) {
      this._s0 -= this._mash(this._seed[i]);
      if (this._s0 < 0) {
        this._s0 += 1;
      }
      this._s1 -= this._mash(this._seed[i]);
      if (this._s1 < 0) {
        this._s1 += 1;
      }
      this._s2 -= this._mash(this._seed[i]);
      if (this._s2 < 0) {
        this._s2 += 1;
      }
    }
  }

  _mash (data) {
    let n = 0xefc8249d;
    data = data.toString();
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }

    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  }

  random () {
    let t = 2091639 * this._s0 + this._c * 2.3283064365386963e-10; // 2^-32
    this._s0 = this._s1;
    this._s1 = this._s2;

    return this._s2 = t - (this._c = t | 0);
  }
}

class Perlin {
  constructor (seed = '') {
    this._alea = new Alea(seed);
    this._perlin_array = [];
    this._perlin_octaves = 4;
    this._perlin_amplitude_falloff = 0.5;
    
    this.PERLIN_YWRAPB = 4;
    this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
    this.PERLIN_ZWRAPB = 8;
    this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
    this.PERLIN_SIZE = 4095;

    let DEG_TO_RAD = 0.0174532925;
    let SINCOS_PRECISION = 0.5;
    let SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);

    this.cosLUT = [];

    for (let i = 0; i < SINCOS_LENGTH; i++) {
      this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
    }

    this.perlin_TWOPI = SINCOS_LENGTH;
    this.perlin_PI = SINCOS_LENGTH;
    this.perlin_PI >>= 1;
  }

  noiseReseed (seed = '') {
    this._alea = new Alea(seed);
    this._perlin_array = [];
  }

  noiseDetail (lod, falloff) {
    if (Math.floor(lod) > 0) this._perlin_octaves = Math.floor(lod);
    if (falloff != undefined && falloff > 0) this._perlin_amplitude_falloff = falloff;
  }

  noiseFsc (i) {
    return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
  }

  noise (x, y = 0, z = 0) {
    if (this._perlin_array.length == 0) {
      this._perlin_array = [];
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this._perlin_array[i] = this._alea.random();
      }
    }

    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let random = 0;
    let amplitude = 0.5;
    let rxf, ryf, n1, n2, n3;

    for (let i = 0; i < this._perlin_octaves; i++) {
      let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
      rxf = this.noiseFsc(xf);
      ryf = this.noiseFsc(yf);
      n1  = this._perlin_array[of & this.PERLIN_SIZE];
      n1 += rxf * (this._perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
      n2  = this._perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 += rxf * (this._perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2-n1);
      of += this.PERLIN_ZWRAP;
      n2  = this._perlin_array[of & this.PERLIN_SIZE];
      n2 += rxf * (this._perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
      n3  = this._perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 += rxf * (this._perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);
      n1 += this.noiseFsc(zf) * (n2 - n1);
      random += n1 * amplitude;
      amplitude *= this._perlin_amplitude_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;
      if (xf >= 1) { xi++; xf--; }
      if (yf >= 1) { yi++; yf--; }
      if (zf >= 1) { zi++; zf--; }
    }

    return random;
  }
}