import { UUID } from '../../utils/common.utils';
import { isPointInsidePolygon } from '../../utils/geometry.utils';
// eslint-disable-next-line
import ALBiomeCanvas from '../ALBiomeCanvas';

/**
 * ALBiomeEntity default renderer presets
 */
const radius = 20;
const pointer_length = 20;
const defaultFillColor = '#ffffff';
const defaultStrokeColor = '#101010';

/**
 * @desc Base class for any ALBiome entity
 * @typedef {{
 *  position: {
 *    x: number,
 *    y: number
 *  },
 *  albiomCanvas: ALBiomeCanvas,
 *  fillColor?: string,
 *  strokeColor?: string,
 * }} ALBiomeEntityInitParamsObject
 * @typedef {{
 *  step: number,
 *  position: {
 *    x: number,
 *    y: number
 *  },
 *  boundingShape: [{
 *    x: number,
 *    y: number
 *  }],
 *  selected: boolean,
 *  fillColor: string,
 *  strokeColor: string,
 * }} ALBiomeEntityState
 */
export class ALBiomeEntity {
  /**
   * ALBiomeEntity UUID
   * @type {string}
   */
  #uuid = UUID();

  /**
   * Provided ALBiomeCanvas instance
   * @type {ALBiomeCanvas}
   */
  #albiomCanvas;

  /**
   * @type {ALBiomeEntityState}
   */
  #state = {
    step: 0,
    position: {
      x: 0.0,
      y: 0.0
    },
    selected: false,
    fillColor: defaultFillColor,
    strokeColor: defaultStrokeColor,
    // internal
    direction: Math.random() > 0.5 ? 1 : -1,
  };

  /**
   * @desc ALBiome base entity contructor 
   * @param {ALBiomeEntityInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    if (!initParamsObj) {
      throw 'ALBiomeEntityInitParamsObject is required!';
    }

    if (isNaN(initParamsObj.position?.x) || isNaN(initParamsObj.position?.y)) {
      throw 'ALBiomeEntityInitParamsObject.position{x, y} is required!';
    }
    this.#state.position.x = initParamsObj.position.x;
    this.#state.position.y = initParamsObj.position.y;

    if (!(initParamsObj.albiomCanvas instanceof ALBiomeCanvas)) {
      throw 'ALBiomeEntityInitParamsObject.albiomCanvas of type ALBiomeCanvas is required!';
    }
    this.#albiomCanvas = initParamsObj.albiomCanvas;

    this.#state.fillColor = initParamsObj.fillColor || defaultFillColor;
    this.#state.strokeColor = initParamsObj.strokeColor || defaultStrokeColor;

    Object.assign(this.#state.position, initParamsObj.position);
  }

  /**
   * @desc Returns ALBiomeEntity UUID
   * @type {string}
   * @abstract
   */
  get uuid() {
    return this.#uuid;
  }

  /**
   * @desc Returns ALBiomeEntity state
   * @type {ALBiomeEntityState}
   * @abstract
   */
  get state() {
    return JSON.parse(JSON.stringify(this.#state));
  }

  /**
   * @desc Returns provided ALBiomeCanvas instance
   * @type {ALBiomeCanvas}
   */
  get albiomCanvas() {
    return this.#albiomCanvas;
  }

  /**
   * @desc Returns provided CanvasRenderingContext2D
   * @type {CanvasRenderingContext2D}
   */
  get renderingContext2D() {
    return this.#albiomCanvas.renderingContext2D;
  }

  /**
   * @desc Updates the ALBiomeEntity
   * @abstarct
   */
  update() {
    this.#state.step++;
    const t = this.#state.step / 10;
    this.#state.position.x += this.#state.direction * 5 * Math.sin(t);
    this.#state.position.y += this.#state.direction * 5 * Math.cos(t);
  }

  /**
   * @desc Check intersection with the point
   * @param {{
   *  x: number,
   *  y: number
   * }} point
   * @return {boolean}
   * @abstarct
   */
  checkIntersection(point){
    return isPointInsidePolygon(point, this.state.boundingShape);
  }

  /**
   * @desc Draws the ALBiomeEntity to the provided renderingContext2D
   * @abstarct
   */
  draw() {
    this.renderingContext2D.save();
    this.renderingContext2D.translate(this.#state.position.x, this.#state.position.y);
    this.renderingContext2D.rotate(this.#state.direction * this.#state.step / 100);

    // entity body
    this.renderingContext2D.fillStyle = this.#state.fillColor;
    this.renderingContext2D.strokeStyle = this.#state.strokeColor;
    this.renderingContext2D.beginPath();
    this.renderingContext2D.arc(
      0,
      0,
      radius,
      0,
      Math.PI * 2
    );
    this.renderingContext2D.stroke();
    this.renderingContext2D.fill();
    this.renderingContext2D.closePath();

    // entity pointer
    this.renderingContext2D.beginPath();
    this.renderingContext2D.moveTo(radius, 0);
    this.renderingContext2D.lineTo(radius + pointer_length, 0);
    this.renderingContext2D.strokeStyle = this.#state.strokeColor;
    this.renderingContext2D.stroke();
    this.renderingContext2D.closePath();

    this.renderingContext2D.restore();
  }

  /**
   * @desc Sets ALBiomeEntityState.selected flag true / false
   * @param {boolean} selected
   * @public
   */
  setSelected(selected) {
    this.state.selected = selected;
  }
}