import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestsService } from '../services/requests.service';
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private requestsService: RequestsService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let obs = next.handle(request);
    obs = this.requestsService.addRequest(this.randomId(), obs);
    return obs;
  }

  private randomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
