import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { WindowService } from './window.service';
import { Token } from '../models/token.model';
import { MinimalUser } from '../models/user.model';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService,
    private windowReferenceService: WindowService
  ) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  private windowReference: Window;


  redirectToLogin(): void {
    this.windowReference.location.href = `${environment.fyle_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
  }

  isLoggedIn(): boolean | null {
    return this.userService.getUserProfile() != null;
  }

  logout(): void {
    this.storageService.remove('user');
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }

  getAccessToken(): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    return user ? user.access_token : null;
  }

  updateAccessToken(accessToken: string): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    if (user) {
      user.access_token = accessToken;
      this.userService.storeUserProfile(user);
      return accessToken;
    }

    return null;
  }

  getRefreshToken(): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    return user ? user.refresh_token : null;
  }
}
