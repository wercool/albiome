import { ALBiomeEntity } from '../generics/ALBiomeEntity';
import { deepMerge } from '../../utils/object.utils';
import { setImageDataPixel } from '../../utils/canvas.draw.utils';
import { getRandomFloat } from '../../utils/math.util.s';

const bodySize = 32;
const bodyHalfSize = bodySize / 2;
const diatomImages = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
];
diatomImages.forEach((image, idx) => image.src = `assets/diatom/diatom_v${idx + 1}.png`);


/**
 * @desc Autotroph ALBiome entity class
 *       Autotroph - an organism that is able to form nutritional organic substances from simple inorganic substances such as carbon dioxide.
 * @class Autotroph
 * @typedef {{
 *  angle: number,
 *  speed: number,
 *  animation_frame: number,
 *  type: number
 *  random_seed: number,
 *  size_factor: number
 * }} AutotrophState
 */
export default class Autotroph extends ALBiomeEntity {
  /**
   * @type {import('../generics/ALBiomeEntity').ALBiomeEntityState | AutotrophState}
   */
  #state = {
    angle: Math.random() * Math.PI * 2,
    speed: 0.1 * Math.random(),
    animation_frame: 0,
    type: 0,
    random_seed: Math.max(0.25, Math.random()),
    size_factor: 1.0
  };

  /**
   * @desc ALBiome Autotroph entity contructor 
   * @param {import('../generics/ALBiomeEntity').ALBiomeEntityInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    super(initParamsObj);

    this.#state = deepMerge(this.#state, super.state);

    this.#state.type = Math.min(19, Math.round(this.#state.random_seed * 20.5) - 1);

    this.#state.size_factor = this.#state.type < 10 ? 1.0 : 0.02 * this.#state.type;

    this.#state.position.x += 1000 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    this.#state.position.y += 1000 * Math.random() * (Math.random() > 0.5 ? 1 : -1);

    // this.#state.speed *= (this.#state.type < 10 ? 100.0 : 10.0);
  }

  /**
   * @desc Returns ALBiomeEntity state
   * @type {AutotrophState | import('../generics/ALBiomeEntity').ALBiomeEntityState}
   */
  get state() {
    return this.#state;
  }

  /**
   * @override
   */
  update() {
    this.#state.step++;

    this.#state.angle += this.#state.random_seed * 0.005;

    this.#state.position.x += Math.cos(this.#state.angle) * this.#state.speed;
    this.#state.position.y += Math.sin(this.#state.angle) * this.#state.speed;

    this.state.boundingShape = [
      {
        x: this.#state.position.x - bodyHalfSize * this.#state.size_factor,
        y: this.#state.position.y - bodyHalfSize * this.#state.size_factor,
      },
      {
        x: this.#state.position.x - bodyHalfSize * this.#state.size_factor,
        y: this.#state.position.y + bodyHalfSize * this.#state.size_factor,
      },
      {
        x: this.#state.position.x + bodyHalfSize * this.#state.size_factor,
        y: this.#state.position.y + bodyHalfSize * this.#state.size_factor,
      },
      {
        x: this.#state.position.x + bodyHalfSize * this.#state.size_factor,
        y: this.#state.position.y - bodyHalfSize * this.#state.size_factor,
      },
    ];
  }

  /**
   * @override
   */
  draw() {
    const context = this.renderingContext2D;

    const spot_p = {
      x: getRandomFloat(-100, 100) * Math.sin(this.#state.step),
      y: getRandomFloat(-100, 100) * Math.cos(this.#state.step),
    };
    if (this.#state.type < 10) {
      setImageDataPixel(this.albiomCanvas.imageData, this.#state.position.x + spot_p.x, this.#state.position.y + spot_p.y, 0, 255, 0, 40);
    } else {
      setImageDataPixel(this.albiomCanvas.imageData, this.#state.position.x + spot_p.x, this.#state.position.y + spot_p.y, 50, 0, 0, 40);
    }

    context.setTransform(1, 0, 0, 1, this.#state.position.x, this.#state.position.y);

    context.rotate(this.#state.angle);

    context.drawImage(
      diatomImages[this.#state.type],
      -bodyHalfSize * this.#state.size_factor,
      -bodyHalfSize * this.#state.size_factor,
      bodySize * this.#state.size_factor,
      bodySize * this.#state.size_factor,
    );

    context.resetTransform();

    if (this.state.selected) {
      // bounding shape
      context.beginPath();
      this.#state.boundingShape.forEach((p, idx) => {
        if (idx === 0) {
          context.moveTo(p.x, p.y);
        } else {
          context.lineTo(p.x, p.y);
        }
      });
      context.closePath();
      context.strokeStyle = '#00ff0040';
      context.stroke();
    }
  }

  /**
   * @desc Sets Autotroph ALBiome entity rotation angle
   * @param {number} angle 
   */
  setAngle(angle) {
    this.#state.angle = angle;
  }

}