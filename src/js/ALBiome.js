import { v4 as uuid } from 'uuid';
import InteractiveContainer from './generics/InteractiveContainer';
import InteractiveCanvas from './generics/InteractiveCanvas';

/**
 * @desc Artificial Life Biome
 * @class ALBiome
 * @typedef {{
 *  DOMContainer: HTMLDivElement,
 * }} ALBiomeInitParamsObject
 */
export default class ALBiome {
  /**
   * Singleton ALBiome instance
   * @type {ALBiome}
   */
  static instance;

  /**
   * @type {ALBiomeInitParamsObject}
   */
  #initParamsObj;

  /**
   * Interactive container
   * @type {InteractiveContainer}
   */
  #interactiveContainer;

  /**
   * Interactive canvas
   * @type {InteractiveCanvas}
   */
  #interactiveCanvas;

  /**
   * @desc ALBiome contructor
   * @param {ALBiomeInitParamsObject} initParamsObj
   * @returns
   */
  constructor(initParamsObj) {
    if (!ALBiome.instance) {

      this.#initParamsObj = initParamsObj;

      this.uuid = uuid();

      this.#construct();

      ALBiome.instance = this;
    } else {
      return ALBiome.instance;
    }
  }

  /**
   * @desc Returns ALBiome instance
   * @returns {ALBiome}
   */
  static getInstance() {
    if (!ALBiome.instance) {
      throw 'ALBiome is not initialized!';
    } else {
      return ALBiome.instance;
    }
  }

  /**
   * @desc Constructs essentials for ALBiome
   * @private
   */
  #construct() {
    this.#interactiveContainer = new InteractiveContainer({
      parentHTMLElement: this.#initParamsObj.DOMContainer,
    });

    this.#interactiveCanvas = new InteractiveCanvas({
      dimensions: {
        width: 50000,
        height: 50000
      }
    });
    this.#interactiveContainer.rootElement.appendChild(this.#interactiveCanvas.rootElement);
  }

}