import { Injectable } from '@nestjs/common';
import {
  buildServiceResponse,
  CatchServiceErrors,
  ServiceResponse,
} from '../common';
import { predictSentiment, Sentiment } from '../engine';
import { PredictSentimentDto } from './dto/predict.dto';

@Injectable()
export class PredictService {
  @CatchServiceErrors()
  async predictSentiment({
    text,
  }: PredictSentimentDto): Promise<ServiceResponse<{ prediction: Sentiment }>> {
    const prediction = await predictSentiment(text);
    return buildServiceResponse({ prediction });
  }
}
