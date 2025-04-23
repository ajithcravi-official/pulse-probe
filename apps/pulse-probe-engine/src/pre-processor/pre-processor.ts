import fs from 'fs';
import csv from 'csv-parser';
import natural from 'natural';
import _ from 'lodash';
import * as tf from '@tensorflow/tfjs';

const tokenizer = new natural.WordTokenizer();
const MAX_VOCAB_SIZE = 10000;
const MAX_SEQUENCE_LENGTH = 100;

/**
 * Loads and preprocesses a sentiment analysis dataset.
 *
 * @param filePath - Path to the CSV dataset file.
 * @param labelMap - A mapping object for sentiments (e.g. { positive: 1, neutral: 0, negative: -1 })
 * @returns A Promise that resolves with preprocessed input tensor, output tensor, and word index mapping.
 */
export const loadAndPreprocessData = (
  filePath: string,
  labelMap: Record<string, number>
): Promise<{
  xs: tf.Tensor2D;
  ys: tf.Tensor1D;
  wordIndex: Record<string, number>;
}> => {
  const texts: string[] = [];
  const labels: number[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: { clean_comment: string; category: string }) => {
        const text = row.clean_comment;
        if (text === undefined) return;

        const sentiment = row.category.toLowerCase();

        const label = labelMap[sentiment];
        if (label === undefined) return; // skip unknown sentiments

        texts.push(text);
        labels.push(Number(label));
      })
      .on('end', () => {
        // Tokenize the text data
        const tokenizedTexts = texts.map((text) =>
          tokenizer.tokenize(text.toLowerCase())
        );

        // Build vocabulary from token frequencies
        const allTokens = _.flatten(tokenizedTexts);
        const frequency = _.countBy(allTokens);
        const sortedTokens = Object.entries(frequency)
          .sort((a, b) => b[1] - a[1])
          .slice(0, MAX_VOCAB_SIZE - 1);

        const wordIndex: Record<string, number> = {};
        sortedTokens.forEach(([word], index) => {
          wordIndex[word] = index + 1; // reserve 0 for padding
        });

        // Convert tokens to sequences of integers
        const sequences = tokenizedTexts.map((tokens) =>
          tokens.map((token) => wordIndex[token] || 0)
        );

        // Pad or truncate sequences to MAX_SEQUENCE_LENGTH
        const paddedSequences = sequences.map((seq) => {
          if (seq.length > MAX_SEQUENCE_LENGTH) {
            return seq.slice(0, MAX_SEQUENCE_LENGTH);
          } else {
            return [...seq, ...Array(MAX_SEQUENCE_LENGTH - seq.length).fill(0)];
          }
        });

        // Convert sequences and labels into TensorFlow.js tensors
        const xs = tf.tensor2d(paddedSequences, [
          paddedSequences.length,
          MAX_SEQUENCE_LENGTH,
        ]);
        const ys = tf.tensor1d(labels, 'int32');

        resolve({ xs, ys, wordIndex });
      })
      .on('error', reject);
  });
};
