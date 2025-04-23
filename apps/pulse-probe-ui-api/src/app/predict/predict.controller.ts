import { Body, Controller, Post } from '@nestjs/common';
import { PredictSentimentDto } from './dto/predict.dto';
import { PredictService } from './predict.service';

@Controller('predict')
export class PredictController {
  constructor(private predictService: PredictService) {}

  @Post('sentiment')
  async register(@Body() body: PredictSentimentDto) {
    return this.predictService.predictSentiment(body);
  }
}
