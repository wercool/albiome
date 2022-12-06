import { createCANVAS } from '../utils/dom.utils';

/**
 * @desc Interactive canvas
 * @class InteractiveCanvas
 * @typedef {{
 *  dimensions: {
 *    width: number,
 *    height: number
 *  }
 * }} InteractiveCanvasInitParamsObject
 */
export default class InteractiveCanvas {
  /**
   * @type {InteractiveCanvasInitParamsObject}
   */
  #initParamsObj;

  /**
   * Interactive canvas root HTMLCanvasElement element
   * @type {HTMLDivElement}
   */
  #rootElement;

  /**
   * @desc Interactive canvas contructor
   * @param {InteractiveCanvasInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    this.#initParamsObj = initParamsObj;

    if (!this.#initParamsObj.dimensions) {
      throw 'InteractiveCanvasInitParamsObject.dimensions is required!';
    }

    this.#construct();
  }

  /**
   * @desc Contructs essentials for InteractiveCanvas
   */
  #construct() {
    this.#rootElement = createCANVAS({
      style: {
        width: `${this.#initParamsObj.dimensions.width}px`,
        height: `${this.#initParamsObj.dimensions.height}px`,
      },
      width: this.#initParamsObj.dimensions.width,
      height: this.#initParamsObj.dimensions.height,
    });
  }

  /**
   * @desc Interactive canvas root HTMLCanvasElement element
   * @returns {HTMLCanvasElement}
   */
  get rootElement() {
    return this.#rootElement;
  }
}