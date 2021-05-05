import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlackService {

  private webHook = 'https://hooks.slack.com/services/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';
  private options = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  };

  constructor(private http: HttpClient) { }

  postErrorOnSlackHttp(error: Error): void {

    const message = {
      channel: '#editor',
      text: error.message,
      attachments: [
        {
          author_name: window.location.href,
          color: 'danger',
          title: 'Trace',
          text: error.stack
        }
      ]
    }

    this.http.post(this.webHook, message, this.options).subscribe();
  }

  postErrorOnSlack(msg: string, stack: string): void {

    const message = {
      channel: '#editor',
      text: msg,
      attachments: [
        {
          author_name: window.location.href,
          color: 'danger',
          title: 'Trace',
          text: stack
        }
      ]
    }

    this.http.post(this.webHook, message, this.options).subscribe();
  }
}
