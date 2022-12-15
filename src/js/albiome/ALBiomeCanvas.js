import InteractiveCanvas from '../generics/InteractiveCanvas';

/**
 * @desc ALBiomeCanvas Interactive canvas
 * @class ALBiomeCanvas
 */
export default class ALBiomeCanvas extends InteractiveCanvas {

  /**
   * ALBiome canvas image data
   * @type {ImageData}
   */
  #albiomeCanvasImageData;

  /**
   * @desc ALBiomeCanvas Interactive canvas contructor
   * @param {import('../generics/InteractiveCanvas').InteractiveCanvasInitParamsObject} interactiveCanvasInitParams
   */
  constructor(interactiveCanvasInitParams) {
    super(interactiveCanvasInitParams);

    this.#construct();
  }

  /**
   * @desc Returns ALBiome canvas image data
   * @returns {ImageData}
   */
  get imageData() {
    return this.#albiomeCanvasImageData;
  }

  /**
   * @desc Constructs essentials for ALBiomeCanvas
   */
  #construct() {
    Object.assign(this.rootElement.style, {
      // filter: 'blur(0.5px)',
      backgroundColor: '#636463'
    });

    this.#albiomeCanvasImageData = new ImageData(this.rootElement.width, this.rootElement.height);
  }
}