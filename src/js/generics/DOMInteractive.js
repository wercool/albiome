/**
 * @desc Basic UI Interactive abstract class
 * @class DOMInteractive
 * @typedef {{
 *  click: string,
 *  leftMouseDown: string,
 *  middleMouseDown: string,
 *  rightMouseDown: string,
 *  leftMouseUp: string,
 *  middleMouseUp: string,
 *  rightMouseUp: string,
 *  mouseMove: string,
 *  mouseOut: string,
 *  wheel: string,
 *  contextMenu: string,
 * }} CustomEvents
 */
export default class DOMInteractive {
  /**
   * @desc Custom events of DOMInteractive implementations
   * @returns {CustomEvents}
   * @abstract
   */
  get customEvents() {
    throw `DOMInteractive.customEvents getter is not implemented in ${this.constructor.name}!`;
  }

  /**
  * @desc #rootElement getter
  * @returns {HTMLElement} 
  * @abstract
  */
  get rootElement() {
    throw `DOMInteractive.rootElement getter is not implemented in ${this.constructor.name}!`;
  }
}