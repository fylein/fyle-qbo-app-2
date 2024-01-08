import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse, HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  private handleError(error: HttpErrorResponse, httpMethod: string, url: string) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, method was: ${httpMethod}, body was: ${JSON.stringify(error.error)}, url was: ${url}`
      );
    }
    return throwError(error);
  }

  private get apiBaseUrl(): string {
    return this.storageService.get('cluster-domain');
  }

  // Having any here is ok
  post(endpoint: string, body: {}, baseUrl?: string): Observable<any> {
    const apiBaseUrl = baseUrl ? baseUrl : this.apiBaseUrl;
    return this.http.post(apiBaseUrl + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'POST', this.apiBaseUrl + endpoint);
    }));
  }

  // Having any here is ok
  put(endpoint: string, body: {}): Observable<any> {
    return this.http.put(this.apiBaseUrl + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PUT', this.apiBaseUrl + endpoint);
    }));
  }

  // Having any here is ok
  get(endpoint: string, apiParams: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(apiParams).forEach(key => {
      params = params.set(key, apiParams[key]);
    });

    return this.http.get(this.apiBaseUrl + endpoint, { params }).pipe(catchError(error => {
      return this.handleError(error, 'GET', this.apiBaseUrl + endpoint);
    }));
  }

  // Having any here is ok
  patch(endpoint: string, body: {}): Observable<any> {
    return this.http.patch(this.apiBaseUrl + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PATCH', this.apiBaseUrl + endpoint);
    }));
  }

  // Having any here is ok
  delete(endpoint: string): Observable<any> {
    return this.http.delete(this.apiBaseUrl + endpoint, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'DELETE', this.apiBaseUrl + endpoint);
    }));
  }
}
