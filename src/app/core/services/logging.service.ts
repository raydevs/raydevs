import { Injectable } from '@angular/core';
import { SlackService } from './http/slack.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private slackService: SlackService) { }

  logError(message: string, stack: string) {
    this.slackService.postErrorOnSlack(message, stack);
  }
}
