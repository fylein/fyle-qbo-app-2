import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { WindowService } from './window.service';
import { Token } from '../models/token.model';
import { MinimalUser } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private windowReferenceService: WindowService
  ) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  private windowReference: Window;


  redirectToLogin(): void {
    this.windowReference.location.href = `${environment.fyle_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
  }

  isLoggedIn(): boolean | null {
    return this.storageService.get('access_token') != null;
  }

  logout(): void {
    this.storageService.remove('user');
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }
}
