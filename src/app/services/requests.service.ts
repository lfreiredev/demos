import { Injectable } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class RequestsService {
  pendingRequests: Map<string, Observable<HttpEvent<any>>> = new Map();
  destroy$ = new Subject();

  constructor() {}

  addRequest(uniqueId: string, httpRequest: Observable<HttpEvent<any>>) {
    const obs = httpRequest.pipe(takeUntil(this.destroy$));
    this.pendingRequests.set(uniqueId, obs);

    return obs;
  }

  removeRequest(uniqueId: string) {
    this.pendingRequests.delete(uniqueId);
  }

  cancelPendingRequests() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$ = new Subject();
  }
}
