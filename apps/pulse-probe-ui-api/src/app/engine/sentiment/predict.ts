import * as tf from '@tensorflow/tfjs-node';
import { WordTokenizer } from 'natural';
import * as fs from 'fs';
import path from 'path';
import { Sentiment } from './type';

const MAX_SEQUENCE_LENGTH = 100;
const WORD_INDEX_PATH = path.join(
  __dirname,
  'src/models/sentiment-model/word_index.json'
);
const MODEL_PATH = path.join(
  __dirname,
  'src/models/sentiment-model/model.json'
);
const SENTIMENT_MAP = {
  0: Sentiment.NEGATIVE,
  1: Sentiment.NEUTRAL,
  2: Sentiment.POSITIVE,
};

/**
 * Predicts sentiment class (0 = negative, 1 = neutral, 2 = positive) for a new sentence.
 * @param sentence - The input text to analyze.
 * @returns Prediction probabilities as a tensor.
 */
export const predictSentiment = async (
  sentence: string
): Promise<Sentiment> => {
  const wordIndex = JSON.parse(fs.readFileSync(WORD_INDEX_PATH, 'utf-8'));

  const tokenizer = new WordTokenizer();
  const tokens = tokenizer.tokenize(sentence.toLowerCase());
  const sequence = tokens.map((token) => wordIndex[token] || 0);
  const padded =
    sequence.length > MAX_SEQUENCE_LENGTH
      ? sequence.slice(0, MAX_SEQUENCE_LENGTH)
      : [...sequence, ...Array(MAX_SEQUENCE_LENGTH - sequence.length).fill(0)];

  const inputTensor = tf.tensor2d([padded], [1, MAX_SEQUENCE_LENGTH]);
  const model = await tf.loadLayersModel(`file://${MODEL_PATH}`);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const probabilities = prediction.dataSync();
  const predictedClass = probabilities.indexOf(Math.max(...probabilities));

  return SENTIMENT_MAP[predictedClass] ?? Sentiment.NEUTRAL;
};
