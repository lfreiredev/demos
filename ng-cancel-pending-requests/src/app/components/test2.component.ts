import { HttpClient, HttpEvent } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  providers: [RequestsService],
})
export class Test2Component implements OnInit {
  @Input() id: string = '9999';

  data$: Observable<any>;
  isLoading: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    let obs = this.httpClient
      .get<any>('https://jsonplaceholder.typicode.com/posts')
      .pipe(finalize(() => (this.isLoading = false)));

    obs = this.requestsService.addRequest(this.randomId(), obs);
    this.data$ = obs;
  }

  cancelRequests() {
    this.requestsService.cancelPendingRequests();
  }

  private randomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
