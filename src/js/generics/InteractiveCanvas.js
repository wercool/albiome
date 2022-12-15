import { UUID } from '../utils/common.utils';
import { createCANVAS } from '../utils/dom.utils';
import DOMInteractive from './DOMInteractive';

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
export default class InteractiveCanvas extends DOMInteractive {
  /**
   * @type {InteractiveCanvasInitParamsObject}
   */
  #initParamsObj;

  /**
   * @type {import('./DOMInteractive').CustomEvents}
   */
  #customEvents;

  /**
   * Interactive canvas root HTMLCanvasElement element
   * @type {HTMLCanvasElement}
   */
  #rootElement;

  /**
   * Interactive canvas root HTMLCanvasElement CanvasRenderingContext2D
   * @type {CanvasRenderingContext2D}
   */
  #renderingContext2D;

  /**
   * @desc Interactive canvas contructor
   * @param {InteractiveCanvasInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    super();

    this.#initParamsObj = initParamsObj;

    if (!this.#initParamsObj.dimensions) {
      throw 'InteractiveCanvasInitParamsObject.dimensions is required!';
    }

    this.#construct();
  }

  /**
   * @desc Interactive canvas root HTMLCanvasElement element
   * @returns {HTMLCanvasElement}
   */
  get rootElement() {
    return this.#rootElement;
  }

  /**
   * @desc Custom events of InteractiveCanvas
   * @type {import('./DOMInteractive').CustomEvents}
   */
  get customEvents() {
    return this.#customEvents;
  }

  /**
   * @desc InteractiveCanvas CanvasRenderingContext2D
   * @type {CanvasRenderingContext2D}
   */
  get renderingContext2D() {
    return this.#renderingContext2D;
  }

  /**
   * @desc Contructs essentials for InteractiveCanvas
   */
  #construct() {
    this.#customEvents = {
      click: UUID(),
      leftMouseDown: UUID(),
      middleMouseDown: UUID(),
      rightMouseDown: UUID(),
      leftMouseUp: UUID(),
      middleMouseUp: UUID(),
      rightMouseUp: UUID(),
      mouseMove: UUID(),
      mouseOut: UUID(),
      wheel: UUID(),
      contextMenu: UUID(),
    };

    this.#rootElement = createCANVAS({
      style: {
        width: `${this.#initParamsObj.dimensions.width}px`,
        height: `${this.#initParamsObj.dimensions.height}px`,
        transformOrigin: '0 0'
      },
      width: this.#initParamsObj.dimensions.width,
      height: this.#initParamsObj.dimensions.height,
    });

    this.#renderingContext2D = this.#rootElement.getContext('2d');

    this.#rootElement.addEventListener('click', this.#onClick.bind(this));
    this.#rootElement.addEventListener('mousedown', this.#onMouseDown.bind(this));
    this.#rootElement.addEventListener('mouseup', this.#onMouseUp.bind(this));
    this.#rootElement.addEventListener('mousemove', this.#onMouseMove.bind(this));
    this.#rootElement.addEventListener('mouseout', this.#onMouseOut.bind(this));
    this.#rootElement.addEventListener('wheel', this.#onWheel.bind(this));
    this.#rootElement.addEventListener('contextmenu', this.#onContextMenu.bind(this));
  }

  /**
   * @desc Interactive canvas #rootElement 'click' handler
   * @param {MouseEvent} event 
   */
  #onClick(event) {
    this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.click, { detail: { event } }));
  }

  /**
   * @desc Interactive canvas #rootElement 'mousedown' handler
   * @param {MouseEvent} event 
   */
  #onMouseDown(event) {
    switch (event.button) {
      case 0:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.leftMouseDown, { detail: { event } }));
        break;
      case 1:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.middleMouseDown, { detail: { event } }));
        break;
      case 2:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.rightMouseDown, { detail: { event } }));
        break;
    }
  }

  /**
   * @desc Interactive canvas #rootElement 'mouseup' handler
   * @param {MouseEvent} event 
   */
  #onMouseUp(event) {
    switch (event.button) {
      case 0:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.leftMouseUp, { detail: { event } }));
        break;
      case 1:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.middleMouseUp, { detail: { event } }));
        break;
      case 2:
        this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.rightMouseUp, { detail: { event } }));
        break;
    }
  }

  /**
   * @desc Interactive canvas #rootElement 'mousemove' handler
   * @param {MouseEvent} event 
   */
  #onMouseMove(event) {
    this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.mouseMove, { detail: { event } }));
  }

  /**
   * @desc Interactive canvas #rootElement 'mouseout' handler
   * @param {MouseEvent} event 
   */
  #onMouseOut(event) {
    this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.mouseOut, { detail: { event } }));
  }

  /**
   * @desc Interactive canvas #rootElement 'wheel' handler
   * @param {MouseEvent} event 
   */
  #onWheel(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.wheel, { detail: { event } }));
  }

  /**
   * @desc Interactive canvas #rootElement 'contextmenu' handler
   * @param {MouseEvent} event 
   */
  #onContextMenu(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.#rootElement.dispatchEvent(new CustomEvent(this.#customEvents.contextMenu, { detail: { event } }));
  }

  /**
   * @desc Scales #rootElement of InteractiveCanvas
   * @param {number} scale
   * @public
   */
  setScale(scale) {
    this.#rootElement.style.transform = `scale(${scale}, ${scale})`;
  }

  /**
   * @desc Clears the canvas
   * @param {{
   *  left: number,
   *  top: number,
   *  width: number,
   *  height: number
   * }} clearRect
   * @public
   */
  clear(clearRect) {
    this.#renderingContext2D.clearRect(
      clearRect?.left || 0,
      clearRect?.top || 0,
      clearRect?.width || this.rootElement.clientWidth,
      clearRect?.height || this.rootElement.clientHeight
    );
  }

  /**
   * @desc Adss circle to the #renderingContext2D
   * @param {number} x the horizontal coordinate of the arc's center
   * @param {number} y the vertical coordinate of the arc's center
   * @param {number} radius the arc's radius, must be positive
   * @param {number} startAngle the angle at which the arc starts in radians, measured from the positive x-axis
   * @param {number} endAngle the angle at which the arc ends in radians, measured from the positive x-axis
   * @param {boolean} counterclockwise an optional boolean value. If true, draws the arc counter-clockwise between the start and end angles, default is false (clockwise)
   * @public
   */
  drawCircle(
    x = 0,
    y = 0,
    radius = 10,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    counterclockwise = false,
    fillStyle = '#ff0000',
    strokeStyle = '#ff0000'
  ) {
    this.#renderingContext2D.fillStyle = fillStyle;
    this.#renderingContext2D.strokeStyle = strokeStyle;
    this.#renderingContext2D.beginPath();
    this.#renderingContext2D.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    this.#renderingContext2D.stroke();
    this.#renderingContext2D.fill();
  }
}