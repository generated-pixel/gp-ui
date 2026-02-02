import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private httpClient: HttpClient) {}

  handleResponse(observer: Subscriber<any>): void {}

  handleError(observer: Subscriber<any>, error: any): void {}
}
