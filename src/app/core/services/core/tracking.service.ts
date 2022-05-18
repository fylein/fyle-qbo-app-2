import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private identityEmail: string;

  constructor() { }

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action: string, properties = {}) {
    properties = {
      ...properties,
      Asset: 'QBO-2 Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  onSignIn(email: string, workspaceId: number, workspaceName: string, orgId: string) {
    if (this.tracking) {
      this.tracking.identify(email, {
        workspaceId,
        workspaceName,
        orgId
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign In');
  }

  onSignUp(email: string, workspaceId: number, workspaceName: string, orgId: string) {
    if (this.tracking) {
      this.tracking.identify(email, {
        workspaceId,
        workspaceName,
        orgId
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign Up');
  }

  onSignOut() {
    this.eventTrack('Sign Out');
  }

  onSwitchWorkspace() {
    this.eventTrack('Switching Workspace');
  }
}
