// eslint-disable-next-line
import DOMInteractive from './DOMInteractive';
import { createDIV } from '../utils/dom.utils';
import { deepMerge } from '../utils/object.utils';

/**
 * @desc Interactive container - zoomable, pannable container
 * @class InteractiveContainer
 * @typedef {{
 *  parentHTMLElement: HTMLElement,
 *  primaryInteractive: DOMInteractive,
 * }} InteractiveContainerInitParamsObject
 * @typedef {{
 *  panMode: boolean,
 *  panModeDetails: {
 *    prevPageX: number,
 *    prevPageY: number
 *  },
 *  scale: number,
 *  scaleFactor: number,
 *  maxScale: number,
 *  minScale: number
 * }} InteractiveContainerState
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
   * Primary interactable
   * @type {InteractiveContainerInitParamsObject['primaryInteractive']}
   */
  #primaryInteractive;

  /**
   * @desc State of InteractiveContainer
   * @type {InteractiveContainerState}
   */
  #state = {
    panMode: false,
    scale: 1.0,
    scaleFactor: 0.1,
    maxScale: 5.0,
    minScale: 0.1
  };

  /**
   * @desc Interactive container contructor
   * @param {InteractiveContainerInitParamsObject} initParamsObj 
   */
  constructor(initParamsObj) {
    this.#initParamsObj = initParamsObj;

    if (!this.#initParamsObj.parentHTMLElement) {
      throw 'InteractiveContainerInitParamsObject.parentHTMLElement is required!';
    }

    if (!this.#initParamsObj.primaryInteractive) {
      throw 'InteractiveContainerInitParamsObject.primaryInteractive is required!';
    }

    this.#primaryInteractive = this.#initParamsObj.primaryInteractive;

    this.#construct();
    this.#subscribeEvents();
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
    };
  }

  /**
   * @returns {InteractiveContainerState}
   */
  get state() {
    return JSON.parse(JSON.stringify(this.#state));
  }

  /**
   * @desc Contructs essentials for InteractiveContainer
   * @private
   */
  #construct() {
    this.#rootElement = createDIV({
      style: {
        width: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
        height: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
        maxWidth: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
        maxHeight: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
        overflow: 'hidden'
      },
      id: 'interactiveContainer'
    });

    this.#rootElement.appendChild(this.#primaryInteractive.rootElement);

    this.#initParamsObj.parentHTMLElement.appendChild(this.#rootElement);
  }

  /**
   * @desc Subsribes to DOM elements events
   * @private
   */
  #subscribeEvents() {
    this.#rootElement.addEventListener('wheel', this.#onWheel.bind(this));
    window.addEventListener('resize', this.#onResize.bind(this));

    this.#primaryInteractive.rootElement.addEventListener(
      this.#primaryInteractive.customEvents.middleMouseDown,
      this.#primaryInteractiveOnMiddleMouseButtonDown.bind(this)
    );

    this.#primaryInteractive.rootElement.addEventListener(
      this.#primaryInteractive.customEvents.middleMouseUp,
      this.#primaryInteractiveOnMiddleMouseButtonUp.bind(this)
    );

    this.#primaryInteractive.rootElement.addEventListener(
      this.#primaryInteractive.customEvents.mouseOut,
      this.#primaryInteractiveOnMouseOut.bind(this)
    );

    this.#primaryInteractive.rootElement.addEventListener(
      this.#primaryInteractive.customEvents.mouseMove,
      this.#primaryInteractiveOnMouseMove.bind(this)
    );

    this.#primaryInteractive.rootElement.addEventListener(
      this.#primaryInteractive.customEvents.wheel,
      this.#primaryInteractiveOnWheel.bind(this)
    );
  }

  /**
   * @desc Interactive container #rootElement 'wheel' event handler
   * @param {Event} event
   * @private
   */
  #onWheel(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * @desc Interactive container window 'resize' event handler
   * @param {Event} event
   * @private
   */
  // eslint-disable-next-line
  #onResize(event) {
    Object.assign(this.#rootElement.style, {
      width: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
      height: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
      maxWidth: `${this.#initParamsObj.parentHTMLElement.offsetWidth}px`,
      maxHeight: `${this.#initParamsObj.parentHTMLElement.offsetHeight}px`,
    });
  }

  /**
   * @desc primaryInteractive.rootElement 'mousedown' handler for middle mouse button
   * @param {{
   *  detail: {
   *    event: MouseEvent
   *  }
   * }} customEvent
   * @private
   */
  // eslint-disable-next-line
  #primaryInteractiveOnMiddleMouseButtonDown(customEvent) {
    const mouseEvent = customEvent.detail.event;

    this.setState({
      panMode: true,
      panModeDetails: {
        prevPageX: mouseEvent.pageX,
        prevPageY: mouseEvent.pageY
      }
    });
  }

  /**
   * @desc primaryInteractive.rootElement 'mouseup' handler for middle mouse button
   * @param {{
   *  detail: {
   *    event: MouseEvent
   *  }
   * }} customEvent
   * @private
   */
  // eslint-disable-next-line
  #primaryInteractiveOnMiddleMouseButtonUp(customEvent) {
    this.setState({
      panMode: false
    });
  }

  /**
   * @desc primaryInteractive.rootElement 'mouseout' handler
   * @param {{
   *  detail: {
   *    event: MouseEvent
   *  }
   * }} customEvent
   * @private
   */
  // eslint-disable-next-line
  #primaryInteractiveOnMouseOut(customEvent) {
    this.setState({
      panMode: false
    });
  }

  /**
   * @desc primaryInteractive.rootElement 'mousemove' handler
   * @param {{
   *  detail: {
   *    event: MouseEvent
   *  }
   * }} customEvent
   * @private
   */
  #primaryInteractiveOnMouseMove(customEvent) {
    const mouseEvent = customEvent.detail.event;

    if (this.#state.panMode) {
      let panX = 0;
      let panY = 0;

      if (mouseEvent.pageX - this.#state.panModeDetails.prevPageX !== 0) {
        panX = this.#state.panModeDetails.prevPageX - mouseEvent.pageX;
        this.setState({
          panModeDetails: {
            prevPageX: mouseEvent.pageX,
          }
        });
      }

      if (mouseEvent.pageY - this.#state.panModeDetails.prevPageY !== 0) {
        panY = this.#state.panModeDetails.prevPageY - mouseEvent.pageY;
        this.setState({
          panModeDetails: {
            prevPageY: mouseEvent.pageY,
          }
        });
      }

      this.pan(
        panX,
        panY,
        this.#state.scale,
        this.#primaryInteractive.rootElement.clientWidth,
        this.#primaryInteractive.rootElement.clientHeight
      );
    }
  }

  /**
   * @desc primaryInteractive.rootElement 'wheel' handler
   * @param {{
   *  detail: {
   *    event: WheelEvent
   *  }
   * }} customEvent
   * @private
   */
  #primaryInteractiveOnWheel(customEvent) {
    const wheelEvent = customEvent.detail.event;

    let delta = 0;

    // detect touchpad (mouse scroll wheel produces ~120 tick per one scroll step, ~100px of dcroll)
    if (Math.abs(wheelEvent.wheelDelta) < 120) {
      delta = wheelEvent.wheelDelta > 0 ? 1 : -1;
    } else {
      delta = -wheelEvent.deltaY || wheelEvent.delta || wheelEvent.wheelDelta;
    }
    delta = Math.max(-1, Math.min(1, delta));

    const scaleDelta = delta * this.#state.scaleFactor;
    const newScale = this.#state.scale + scaleDelta;

    const preScaleZoomPoint = {
      x: wheelEvent.offsetX * this.#state.scale,
      y: wheelEvent.offsetY * this.#state.scale,
    };

    if (newScale < this.#state.maxScale && newScale > this.#state.minScale) {
      if (this.#primaryInteractive.rootElement.clientWidth * newScale >= this.#rootElement.clientWidth 
        && this.#primaryInteractive.rootElement.clientHeight * newScale >= this.#rootElement.clientHeight
      ) {
        this.setState({
          scale: newScale
        });

        const postScaleZoomPoint = {
          x: wheelEvent.offsetX * this.#state.scale,
          y: wheelEvent.offsetY * this.#state.scale,
        };

        const panOffset = {
          x: postScaleZoomPoint.x - preScaleZoomPoint.x,
          y: postScaleZoomPoint.y - preScaleZoomPoint.y
        };

        this.#primaryInteractive.setScale(this.#state.scale);
        this.pan(
          panOffset.x,
          panOffset.y,
          this.#state.scale
        );
      }
    } else {
      if (this.#primaryInteractive.rootElement.clientWidth * newScale < this.#rootElement.clientWidth) {
        this.setViewLeft(0);
      } else if (this.#primaryInteractive.rootElement.clientHeight * newScale < this.#rootElement.clientHeight) {
        this.setViewTop(0);
      }
    }
  }

  /**
   * @desc Mutates InteractiveContainer #state
   * @param {InteractiveContainerState} stateMutation
   * @public
   */
  setState(stateMutation = {}) {
    deepMerge(this.#state, stateMutation);
  }

  /**
   * @desc InteractiveContainer panning 
   * @param {number} panX
   * @param {number} panY
   * @param {number} scale
   * @param {number} maxPanX
   * @param {number} maxPanY
   * @public
   */
  pan(
    panX = 0,
    panY = 0,
    scale = 1,
    maxPanX = Infinity,
    maxPanY = Infinity
  ) {
    if (panX !== 0 || panY !== 0) {
      if (
        this.#rootElement.scrollLeft + panX < maxPanX * scale - this.#rootElement.clientWidth
        && 
        this.#rootElement.scrollTop  + panY < maxPanY * scale - this.#rootElement.clientHeight
      ) {
        this.#rootElement.scrollBy(panX, panY);
      }
    }
  }
 
  /**
   * @desc Sets InteractiveContainer view to left, top
   * @param {number} left
   * @param {number} top
   * @public
   */
  setViewLeftTop(left, top) {
    this.setViewLeft(left);
    this.setViewTop(top);
  }
 
  /**
   * @desc Sets InteractiveContainer view to left
   * @param {number} left
   * @public
   */
  setViewLeft(left) {
    this.#rootElement.scrollLeft = left;
  }
 
  /**
   * @desc Sets InteractiveContainer view to top
   * @param {number} top
   * @public
   */
  setViewTop(top) {
    this.#rootElement.scrollTop = top;
  }

  /**
   * @desc InteractiveContainer pan to center
   * @public
   */
  setToCenter() {
    this.#rootElement.scrollBy(
      this.#rootElement.scrollWidth / 2.0 - this.#rootElement.clientWidth / 2.0,
      this.#rootElement.scrollHeight / 2.0 - this.#rootElement.clientHeight / 2.0
    );
  }
}