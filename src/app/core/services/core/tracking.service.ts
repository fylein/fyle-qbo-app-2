import { Injectable } from '@angular/core';
import { AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ImportSettingPost } from '../../models/configuration/import-setting.model';
import { ClickEvent, CorporateCreditCardExpensesObject, FyleField, OnboardingStep, PaginatorPage, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from '../../models/enum/enum.model';
import { ClickEventAdditionalProperty, UpdateEventAdditionalProperty } from '../../models/misc/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private identityEmail: string;

  private readonly onboardingStepEnum = OnboardingStep;

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

  onOnboardingStepCompletion(eventName: OnboardingStep, stepNumber: number, additionalProperties: EmployeeSettingPost | ExportSettingPost | ImportSettingPost | AdvancedSettingPost | void): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, additionalProperties);
  }

  onUpdateEvent(eventName: UpdateEvent, additionalProperties: Partial<UpdateEventAdditionalProperty> | void): void {
    this.eventTrack(`Update event: ${eventName}`, additionalProperties);
  }

  onDateFilter(properties: {filterType: 'existing' | 'custom', startDate: Date, endDate: Date}): void {
    this.eventTrack('Date filter', properties);
  }

  onQBOAccountDisconnect(): void {
    this.eventTrack('QBO account disconnected');
  }

  // onSimpleSearch(properties: {page: PaginatorPage | 'export-log-child'}): void {
  //   this.eventTrack('Simple search', properties);
  // }
}
