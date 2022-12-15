import { getRandomFloat } from '../../utils/math.util.s';

/**
 * @desc Artificial neural network neuron class
 * @class ANNNeuron
 * @typedef {{
 *  weights: number | [number]
 * }} ANNNeuronInitParams
 */
export default class ANNNeuron {

  /**
   * Neuron input weights
   * @type {[number]}
   */
  #weights = [];

  /**
   * 
   * @param {ANNNeuronInitParams} initParams 
   */
  constructor(initParams) {
    if (Number.isInteger(initParams.weights)) {
      for (let w = 0; w < initParams.weights; w++) {
        this.#weights.push(getRandomFloat(-1.0, 1.0));
      }
    } else if (Array.isArray(initParams.weights)) {
      this.#weights = initParams.weights;
    } else {
      throw `ANNNeuronInitParams.weights type is number | [number], while ${typeof initParams.weights} is provided!`;
    }
  }

  /**
   * @desc Neuron weights
   */
  get weights() {
    return this.#weights;
  }

  /**
   * @desc Returns neuron value after summarizing and passing through activation function
   * @param {number}
   */
  activate(inputValues) {
    const inputs_MUL_weitghts_SUM = this.#weights.reduce((prevValue, curValue, idx) => prevValue + curValue * inputValues[idx], 0);
    /**
     * Sigmoidactivation function
     * σ(x) = 1/(1+exp(-x))
     */
    // const activation = 1 / (1 + Math.exp(-inputs_MUL_weitghts_SUM));

    /**
     * tanh 
     * σ(x) = (exp(x) - exp(-x)) / (exp(x) + exp(-x))
     */
    const activation = (Math.exp(inputs_MUL_weitghts_SUM) - Math.exp(-inputs_MUL_weitghts_SUM)) / (Math.exp(inputs_MUL_weitghts_SUM) + Math.exp(-inputs_MUL_weitghts_SUM));

    return activation;
  }
}