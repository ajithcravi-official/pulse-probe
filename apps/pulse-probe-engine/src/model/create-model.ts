import * as tf from '@tensorflow/tfjs';

/**
 * Creates an advanced sentiment analysis model using the Functional API.
 *
 * @param vocabSize - The size of the vocabulary (input dimension of the embedding layer)
 * @param embeddingDim - The size of the embedding vectors
 * @param inputLength - The fixed length of input sequences
 * @returns A compiled TensorFlow.js model ready for training
 */
export const createModel = (
  vocabSize: number,
  embeddingDim: number,
  inputLength: number
): tf.LayersModel => {
  const input = tf.input({ shape: [inputLength] });

  const embedding = tf.layers
    .embedding({
      inputDim: vocabSize,
      outputDim: embeddingDim,
      inputLength: inputLength,
    })
    .apply(input) as tf.SymbolicTensor;

  const lstm = tf.layers
    .bidirectional({
      layer: tf.layers.lstm({ units: 64, returnSequences: false }),
      mergeMode: 'concat',
    })
    .apply(embedding) as tf.SymbolicTensor;

  const dropout = tf.layers
    .dropout({ rate: 0.5 })
    .apply(lstm) as tf.SymbolicTensor;

  const dense = tf.layers
    .dense({ units: 64, activation: 'relu' })
    .apply(dropout) as tf.SymbolicTensor;

  const output = tf.layers
    .dense({ units: 3, activation: 'softmax' })
    .apply(dense) as tf.SymbolicTensor;

  const model = tf.model({ inputs: input, outputs: output });

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
};
