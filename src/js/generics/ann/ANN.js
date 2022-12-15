import ANNNeuron from './ANNNeuron';

/**
 * @desc Artificial neural network
 * @class ANN
 * @typedef {{
 *  ann: {
 *    layers: [{
 *      neurons: number,
 *      weights?: [[number]]
 *    }]
 *  }
 * }} ANNInitParams
 */
export default class ANN {

  /**
   * @type {[ANNNeuron]}
   */
  #inputLayerNeurons = [];

  /**
   * @type {[[ANNNeuron]]}
   */
  #hiddenLayersNeurons = [];

  /**
   * @type {[ANNNeuron]}
   */
  #outptuLayerNeurons = [];

  /**
   * @desc ANN contructor
   * @param {ANNInitParams} initParams 
   */
  constructor(initParams) {
    // Initialize input layer
    const ann_input_layer = initParams.ann.layers[0];
    for (let n = 0; n < ann_input_layer.neurons; n++) {
      this.#inputLayerNeurons.push(
        new ANNNeuron({
          weights: ann_input_layer.weights ? ann_input_layer.weights[n] : 1
        })
      );
    }

    // Initialize hidden layers
    const ann_hidden_layers = initParams.ann.layers.slice(1, initParams.ann.layers.length - 1);
    for (let [hl_idx, ann_hidden_layer] of ann_hidden_layers.entries()) {
      const hidden_layer_neurons = [];
      for (let n = 0; n < ann_hidden_layer.neurons; n++) {
        hidden_layer_neurons.push(
          new ANNNeuron({
            weights: ann_hidden_layer.weights ? ann_hidden_layer.weights[n] : hl_idx === 0 ? this.#inputLayerNeurons.length : this.#hiddenLayersNeurons[hl_idx - 1].length 
          })
        );
      }
      this.#hiddenLayersNeurons.push(hidden_layer_neurons);
    }

    // Initialize output layer
    const ann_output_layer = initParams.ann.layers[initParams.ann.layers.length - 1];
    for (let n = 0; n < ann_output_layer.neurons; n++) {
      if (this.#hiddenLayersNeurons.length > 0) {
        this.#outptuLayerNeurons.push(
          new ANNNeuron({
            weights: ann_output_layer.weights ? ann_output_layer.weights[n] : this.#hiddenLayersNeurons[this.#hiddenLayersNeurons.length - 1].length
          })
        );
      } else {
        this.#outptuLayerNeurons.push(
          new ANNNeuron({
            weights: ann_output_layer.weights ? ann_output_layer.weights[n] : this.#inputLayerNeurons.length
          })
        );
      }
    }

  }

  /**
   * @desc Predicts output values
   * @param {[number]} inputValues
   * @public
   */
  predict(inputValues) {
    if (inputValues.length !== this.#inputLayerNeurons.length) {
      throw `ANN.predict "inputValues" array lenght = ${inputValues.length} not matching ANN.#inputLayerNeuronss num of neurons = ${this.#inputLayerNeurons.length}!`;
    }

    const input_layer_outputs = this.#inputLayerNeurons.map((inputLayerNeuron, idx) => inputLayerNeuron.activate([inputValues[idx]]));

    const hidden_layers_outputs = [];
    for (let [hl_idx, hidden_layer_neurons] of this.#hiddenLayersNeurons.entries()) {
      if (hl_idx === 0) {
        hidden_layers_outputs.push(
          hidden_layer_neurons.map(hiddenLayerNeuron => hiddenLayerNeuron.activate(input_layer_outputs))
        );
      } else {
        hidden_layers_outputs.push(
          hidden_layer_neurons.map(hiddenLayerNeuron => hiddenLayerNeuron.activate(hidden_layers_outputs[hl_idx - 1]))
        );
      }
    }

    let output_layer_outputs;
    if (hidden_layers_outputs.length > 0) {
      output_layer_outputs = this.#outptuLayerNeurons.map(outputLayerNeuron => outputLayerNeuron.activate(hidden_layers_outputs[hidden_layers_outputs.length - 1]));
    } else {
      output_layer_outputs = this.#outptuLayerNeurons.map(outputLayerNeuron => outputLayerNeuron.activate(input_layer_outputs));
    }

    return output_layer_outputs;
  }

  /**
   * @desc JSONified state of ANN
   */
  toJSON() {
    const _ANN = {
      ann: {
        layers: [
          {
            neurons: this.#inputLayerNeurons.length,
            weights: this.#inputLayerNeurons.map(inputLayerNeuron => inputLayerNeuron.weights)
          },
          ...this.#hiddenLayersNeurons.map(hiddenLayer => ({
            neurons: hiddenLayer.length,
            weights: hiddenLayer.map(hiddenLayerNeuron => hiddenLayerNeuron.weights)
          })),
          {
            neurons: this.#outptuLayerNeurons.length,
            weights: this.#outptuLayerNeurons.map(outputLayerNeuron => outputLayerNeuron.weights)
          }
        ]
      }
    };

    return _ANN;
  }

}