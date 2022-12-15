import { ALBiomeEntity } from '../generics/ALBiomeEntity';
import { deepMerge } from '../../utils/object.utils';
import { rotatePoint } from '../../utils/geometry.utils';
import ANN from '../../generics/ann/ANN';

const maxSpeed = 1.0;
const maxRotSpeed = 1.0;
const bodySize = 150;
const bodyHalfSize = bodySize / 2;
const infusoria1FramesImage = new Image();
infusoria1FramesImage.src = 'assets/infusoria_frames/infusoria_v1.png';
const infusoria2FramesImage = new Image();
infusoria2FramesImage.src = 'assets/infusoria_frames/infusoria_v2.png';


/**
 * @desc Heterotroph ALBiome entity class
 *       Heterotroph - an organism deriving its nutritional requirements from complex organic substances.
 * @class Heterotroph
 * @typedef {{
 *  random_seed: number,
 *  energy: number,
 *  angle: number,
 *  speed: number,
 *  animation_frame: number,
 * }} HeterotrophState
 */
export default class Heterotroph extends ALBiomeEntity {
  /**
   * @type {import('../generics/ALBiomeEntity').ALBiomeEntityState | HeterotrophState}
   */
  #state = {
    random_seed: Math.max(0.25, Math.random()),
    energy: 1.0,
    angle: Math.random() * Math.PI * 2,
    speed: 0.0,
    animation_frame: 0,
  };

  /**
   * ALBiome Heterotroph entity ANN
   * @type {ANN}
   */
  #ann;

  /**
   * @desc ALBiome Heterotroph entity contructor 
   * @param {import('../generics/ALBiomeEntity').ALBiomeEntityInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    super(initParamsObj);

    this.#state = deepMerge(this.#state, super.state);

    this.#state.position.x +=  500 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    this.#state.position.y +=  500 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    
    this.#ann = new ANN({
      ann: {
        layers: [
          {
            neurons: 4
          },
          {
            neurons: 2
          },
        ]
      }
    });
  }

  /**
   * @desc Returns ALBiomeEntity state
   * @type {HeterotrophState | import('../generics/ALBiomeEntity').ALBiomeEntityState}
   */
  get state() {
    return this.#state;
  }

  /**
   * @override
   */
  update() {
    this.#state.step++;

    const [ann_speed_factor, ann_angle_factor] = this.#ann.predict([
      this.#state.energy,
      Math.random() > 0.5 ? Math.random() : -Math.random(),
      Math.random() > 0.5 ? Math.random() : -Math.random(),
      Math.random() > 0.5 ? Math.random() : -Math.random(),
    ]);

    this.#state.angle += 0.01 * maxRotSpeed * ann_angle_factor;

    this.#state.speed = maxSpeed * ann_speed_factor;

    this.#state.position.x += Math.cos(this.#state.angle) * this.#state.speed;
    this.#state.position.y += Math.sin(this.#state.angle) * this.#state.speed;

    this.#state.energy -= 0.001 * Math.abs(this.#state.speed);

    this.state.boundingShape = [
      rotatePoint(
        {
          x: this.#state.position.x - bodySize,
          y: this.#state.position.y - bodyHalfSize * 0.75 / 2
        },
        this.#state.position,
        this.#state.angle
      ),
      rotatePoint(
        {
          x: this.#state.position.x,
          y: this.#state.position.y - bodyHalfSize * 0.75 / 2
        },
        this.#state.position,
        this.#state.angle
      ),
      rotatePoint(
        {
          x: this.#state.position.x,
          y: this.#state.position.y + bodyHalfSize * 0.75 / 2
        },
        this.#state.position,
        this.#state.angle
      ),
      rotatePoint(
        {
          x: this.#state.position.x - bodySize,
          y: this.#state.position.y + bodyHalfSize * 0.75 / 2
        },
        this.#state.position,
        this.#state.angle
      )
    ];
  }

  /**
   * @override
   */
  draw() {
    const context = this.renderingContext2D;

    context.setTransform(1, 0, 0, 1, this.#state.position.x, this.#state.position.y);

    context.rotate(this.#state.angle);

    context.drawImage(
      this.#state.random_seed > 0.5 ? infusoria1FramesImage : infusoria2FramesImage,
      this.#state.animation_frame * 256,
      0,
      256,
      256,
      -bodySize,
      -bodyHalfSize,
      bodySize + 10 * Math.sin(this.#state.step / 20 * this.#state.random_seed),
      bodySize,
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

    if (this.#state.step % 4 === 0 && Math.abs(this.#state.speed) > maxSpeed * 0.1) {
      this.#state.animation_frame++;
      if (this.#state.animation_frame > 7) {
        this.#state.animation_frame = 0;
      }
    }
  }

  /**
   * @desc Sets Heterotroph ALBiome entity rotation angle
   * @param {number} angle 
   */
  setAngle(angle) {
    this.#state.angle = angle;
  }

}