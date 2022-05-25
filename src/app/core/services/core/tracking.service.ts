import { Injectable } from '@angular/core';
import { ClickEvent, CorporateCreditCardExpensesObject, FyleField, ProgressPhase, ReimbursableExpensesObject } from '../../models/enum/enum.model';
import { ClickEventAdditionalProperty } from '../../models/misc/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private identityEmail: string;

  constructor() { }

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action: string, properties: any = {}): void {
    properties = {
      ...properties,
      Asset: 'QBO-2 Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  onSignIn(email: string, workspaceId: number, workspaceName: string, orgId: string): void {
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

  onSignUp(email: string, workspaceId: number, workspaceName: string, orgId: string): void {
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

  onSignOut(): void {
    this.eventTrack('Sign Out');
  }

  onSwitchWorkspace(): void {
    this.eventTrack('Switching Workspace');
  }

  onQBOLanding(phase: ProgressPhase): void {
    this.eventTrack('Landed in QBO', {phase});
  }

  onClickEvent(eventName: ClickEvent, additionalProperties: Partial<ClickEventAdditionalProperty> | void): void {
    this.eventTrack(`Click event: ${eventName}`, additionalProperties);
  }
}
