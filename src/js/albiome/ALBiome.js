import { UUID } from '../utils/common.utils';
import ALBiomeCanvas from './ALBiomeCanvas';
import InteractiveContainer from '../generics/InteractiveContainer';
import Heterotroph from './entities/Heterotroph';
import Autotroph from './entities/Autotroph';

/**
 * @desc Artificial Life Biome
 * @class ALBiome
 * @typedef {{
 *  DOMContainer: HTMLDivElement,
 * }} ALBiomeInitParamsObject
 * @typedef {{
 *  step: number,
 * }} ALBiomeState
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
   * Interactive ALBiome canvas
   * @type {ALBiomeCanvas}
   */
  #interactiveCanvas;

  /**
   * Interactive ALBiome canvas registered click event point, will be send to ALBiome enetites for check intersections
   * @type {{
   *  x: number,
   *  y: number
   * }}
   */
  #interactiveCanvasClickIntersectionPoint = null;

  /**
   * @type {ALBiomeState}
   */
  #state = {
    step: 0
  };

  /**
   * ALBiome entities
   * @type {[Heterotroph]}
   */
  #entities = [];

  /**
   * @desc ALBiome contructor
   * @param {ALBiomeInitParamsObject} initParamsObj
   * @returns
   */
  constructor(initParamsObj) {
    if (!ALBiome.instance) {

      this.#initParamsObj = initParamsObj;

      this.uuid = UUID();

      this.#construct();
      this.#subscribeEvents();

      ALBiome.instance = this;

      setTimeout(this.#update.bind(this), 500);
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
   * @desc Susbsribes ALBiome instance for various events
   */
  #subscribeEvents() {
    this.#interactiveCanvas.rootElement.addEventListener(
      this.#interactiveCanvas.customEvents.click,
      this.#interactiveCanvasOnClick.bind(this)
    );
  }

  /**
   * @desc Interactive canvas 'click' event listener
   * @param {{
   *  detail: {
   *    event: PointerEvent
   *  }
   * }} customEvent
   */
  #interactiveCanvasOnClick(customEvent) {
    this.#interactiveCanvasClickIntersectionPoint = {
      x: customEvent.detail.event.offsetX,
      y: customEvent.detail.event.offsetY
    };
  }

  /**
   * @desc Constructs essentials for ALBiome
   * @private
   */
  #construct() {
    this.#interactiveCanvas = new ALBiomeCanvas(
      {
        dimensions: {
          width: 4000,
          height: 4000
        }
      }
    );

    this.#interactiveContainer = new InteractiveContainer({
      parentHTMLElement: this.#initParamsObj.DOMContainer,
      primaryInteractive: this.#interactiveCanvas
    });

    this.#interactiveContainer.setToCenter();

    this.#interactiveCanvas.clear();

    this.#entities.push(

      ...[...Array(10).keys()].map(() => 
        new Heterotroph({
          position: {
            x: this.#interactiveCanvas.rootElement.clientWidth / 2,
            y: this.#interactiveCanvas.rootElement.clientHeight / 2,
          },
          albiomCanvas: this.#interactiveCanvas,
        })
      ),

      ...[...Array(100).keys()].map(() => 
        new Autotroph({
          position: {
            x: this.#interactiveCanvas.rootElement.clientWidth / 2,
            y: this.#interactiveCanvas.rootElement.clientHeight / 2,
          },
          albiomCanvas: this.#interactiveCanvas,
        })
      ),

    );
  }

  /**
   * @desc Updates ALBiome on requestAnimationFrame
   */
  #update() {
    this.#interactiveCanvas.clear();

    if (!this.#state.step % 60 === 0) {
      this.#interactiveCanvas.renderingContext2D.putImageData(this.#interactiveCanvas.imageData, 0, 0);
    }

    if (this.#interactiveCanvasClickIntersectionPoint) {
      for (const entity of this.#entities) {
        entity.setSelected(false);
      }
    }

    for (const entity of this.#entities) {
      entity.update();
      if (this.#interactiveCanvasClickIntersectionPoint) {
        if (entity.checkIntersection(this.#interactiveCanvasClickIntersectionPoint)) {
          entity.setSelected(true);
          this.#interactiveCanvasClickIntersectionPoint = null;
        }
      }
      entity.draw();
    }

    this.#interactiveCanvasClickIntersectionPoint = null;

    this.#interactiveCanvas.drawCircle(
      this.#interactiveCanvas.rootElement.clientWidth / 2,
      this.#interactiveCanvas.rootElement.clientHeight / 2,
      2
    );

    this.#state.step++;

    requestAnimationFrame(this.#update.bind(this));
  }

}