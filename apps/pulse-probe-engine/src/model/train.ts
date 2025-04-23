import path from 'path';
import { loadAndPreprocessData } from '../pre-processor/pre-processor';
import { createModel } from './create-model';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';

const REDDIT_PATH = path.join(__dirname, '../assets/Reddit_Data.csv');
const TWITTER_PATH = path.join(__dirname, '../assets/Twitter_Data.csv');
const VOCAB_SIZE = 10000;
const EMBEDDING_DIM = 128;
const MAX_SEQUENCE_LENGTH = 100;
const BATCH_SIZE = 64;
const EPOCHS = 5;

const LABEL_MAP = {
  negative: 0,
  neutral: 1,
  positive: 2,
  '-1': 0,
  '0': 1,
  '1': 2,
};

export const train = async () => {
  // Load and preprocess Reddit and Twitter datasets
  const reddit = await loadAndPreprocessData(REDDIT_PATH, LABEL_MAP);
  const twitter = await loadAndPreprocessData(TWITTER_PATH, LABEL_MAP);

  // Combine Reddit and Twitter datasets
  const allXs = tf.concat([reddit.xs, twitter.xs], 0);
  const allYs = tf.concat([reddit.ys, twitter.ys], 0);

  // Shuffle and split into train and test sets (80% train, 20% test)
  const numExamples = allXs.shape[0];
  const numTrain = tf.floor(tf.scalar(numExamples * 0.8)).dataSync()[0];

  const shuffledIndices = Array.from(
    tf.util.createShuffledIndices(numExamples)
  );
  const trainIndices = tf.tensor1d(shuffledIndices.slice(0, numTrain), 'int32');
  const testIndices = tf.tensor1d(shuffledIndices.slice(numTrain), 'int32');

  const trainXs = tf.gather(allXs, trainIndices);
  const trainYs = tf.gather(allYs, trainIndices);
  const testXs = tf.gather(allXs, testIndices);
  const testYs = tf.gather(allYs, testIndices);

  // Create model
  const model = createModel(VOCAB_SIZE, EMBEDDING_DIM, MAX_SEQUENCE_LENGTH);

  // Train model
  await model.fit(trainXs.toFloat(), trainYs.toFloat(), {
    batchSize: BATCH_SIZE,
    epochs: EPOCHS,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(
          `Epoch ${epoch + 1}: loss = ${logs.loss?.toFixed(
            4
          )}, accuracy = ${logs.acc?.toFixed(4)}`
        );
      },
    },
  });

  // Evaluate model
  const evalResult = model.evaluate(
    testXs.toFloat(),
    testYs.toFloat()
  ) as tf.Scalar[];
  const loss = evalResult[0];
  const accuracy = evalResult[1];
  console.log(
    `\nEvaluation result: Loss = ${loss
      .dataSync()[0]
      .toFixed(4)}, Accuracy = ${accuracy.dataSync()[0].toFixed(4)}`
  );

  // Save model
  await model.save(
    'file://./apps/pulse-probe-ui-api/src/models/sentiment-model'
  );
  fs.writeFileSync(
    './apps/pulse-probe-ui-api/src/models/sentiment-model/word_index.json',
    JSON.stringify(reddit.wordIndex)
  );
  console.log('Model training complete and saved to ./sentiment_model');
};
