import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { WindowService } from './window.service';
import { Token } from '../../models/misc/token.model';
import { MinimalUser } from '../../models/db/user.model';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';
import * as Sentry from '@sentry/angular';
import { TrackingService } from './tracking.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private windowReference: Window;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowReferenceService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }


  redirectToQboOAuth(): void {
    this.windowReference.location.href = `${environment.qbo_authorize_uri}?client_id=${environment.qbo_client_id}&scope=${environment.qbo_scope}&response_type=code&redirect_uri=${environment.app_url}/qbo_callback&state=${this.workspaceService.getWorkspaceId()}`;
  }

  redirectToFyleOAuth(): void {
    this.windowReference.location.href = `${environment.fyle_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
  }

  redirectToOnboardingLanding(): void {
    this.windowReference.location.href = `${environment.app_url}/workspaces/onboarding/landing`;
  }

  redirectToOnboardingLogin(): void {
    this.windowReference.location.href = `${environment.app_url}/auth/login`;
  }

  isLoggedIn(): boolean | null {
    return this.userService.getUserProfile() != null;
  }

  logout(switchOrg: boolean | void): void {
    if (switchOrg) {
      this.trackingService.onSwitchWorkspace();
    } else {
      this.trackingService.onSignOut();
    }
    Sentry.configureScope(scope => scope.setUser(null));
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

  checkLoginStatusAndLogout(): void {
    if (this.isLoggedIn()) {
      this.logout();
    }
  }
}
