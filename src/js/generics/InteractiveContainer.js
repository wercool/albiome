import { createDIV } from '../utils/dom.utils';

/**
 * @desc Interactive container - zoomable, pannable container
 * @class InteractiveContainer
 * @typedef {{
 *  parentHTMLElement: HTMLElement,
 * }} InteractiveContainerInitParamsObject
 */
export default class InteractiveContainer {
  /**
   * @type {InteractiveContainerInitParamsObject}
   */
  #initParamsObj;

  /**
   * Interactive container root HTMLDivElement element
   * @type {HTMLDivElement}
   */
  #rootElement;

  /**
   * @desc Interactive container contructor
   * @param {InteractiveContainerInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    this.#initParamsObj = initParamsObj;

    if (!this.#initParamsObj.parentHTMLElement) {
      throw 'InteractiveContainerInitParamsObject.parentHTMLElement is required!';
    }

    this.#construct();
  }

  /**
   * @desc Contructs essentials for InteractiveContainer
   */
  #construct() {
    this.#rootElement = createDIV({
      style: {
        width: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
        height: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
        maxWidth: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
        maxHeight: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
        overflow: 'auto'
      },
      id: 'interactiveContainer'
    });

    this.#rootElement.addEventListener('wheel', this.#onWheel.bind(this));
    window.addEventListener('resize', this.#onResize.bind(this));

    this.#initParamsObj.parentHTMLElement.appendChild(this.#rootElement);
  }

  /**
   * @desc Interactive container this.#rootElement 'wheel' event handler
   * @param {Event} event 
   */
  #onWheel(event) {
    console.log(event)
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  /**
   * @desc Interactive container window 'resize' event handler
   * @param {Event} event 
   */
  #onResize(event) {
    Object.assign(this.#rootElement.style, {
      width: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
      height: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
      maxWidth: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
      maxHeight: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
    });
  }

  /**
   * @desc Interactive container root HTMLDivElement element
   * @returns {HTMLDivElement}
   */
  get rootElement() {
    return this.#rootElement;
  }

  /**
   * @desc Returns Interactive container dimensions
   * @returns {{
   *  width: number,
   *  height: number
   * }}
   */
  get rootElementDimensions() {
    return {
      width: this.#rootElement.offsetWidth,
      height: this.#rootElement.offsetHeight
    }
  }
}