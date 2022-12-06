/**
 * @desc Creates HTMLElement DOM element
 * @typedef {{
 *  tagName: string,
 *  attributes: object,
 * }} DOMElementInitParams
 * @param {DOMElementInitParams} initParams
 * @returns {HTMLElement}
 */
function createDOMElement(initParams) {
  const DOMElement = document.createElement(initParams.tagName);

  for (const [attribute_name, attribute_value] of Object.entries(initParams.attributes)) {
    if (attribute_value === undefined || attribute_value === null) continue;

    if (attribute_name === 'style') {
      Object.assign(DOMElement.style, attribute_value);
    } else {
      DOMElement.setAttribute(attribute_name, attribute_value);
    }
  }

  return DOMElement;
}

/**
 * @desc Creates HTMLDivElement DOM element
 * @param {DOMElementInitParams['attributes']} attributes 
 * @returns {HTMLDivElement}
 */
export function createDIV(attributes = {}) {
  const _attributes = {
    tagName: 'div',
    attributes,
  };

  return createDOMElement(_attributes);
}

/**
 * @desc Creates HTMLCanvasElement DOM element
 * @param {DOMElementInitParams['attributes']} attributes 
 * @returns {HTMLCanvasElement}
 */
export function createCANVAS(attributes = {}) {
  const _attributes = {
    tagName: 'canvas',
    attributes,
  };

  return createDOMElement(_attributes);
}