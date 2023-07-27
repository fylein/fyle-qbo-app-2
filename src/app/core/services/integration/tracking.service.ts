import { Injectable } from '@angular/core';
import { AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ImportSettingPost } from '../../models/configuration/import-setting.model';
import { Action, ClickEvent, DeleteEvent, OnboardingStep, ProgressPhase, SearchType, SimpleSearchPage, SimpleSearchType, UpdateEvent } from '../../models/enum/enum.model';
import { ClickEventAdditionalProperty, DeleteEventAdditionalProperty, MappingAlphabeticalFilterAdditionalProperty, ResolveMappingErrorProperty, TimeTakenAdditionalProperty, UpdateEventAdditionalProperty } from '../../models/misc/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private identityEmail: string;

  private readonly onboardingStepEnum = OnboardingStep;

  constructor() { }

  private flattenObject(ob: any): any {
    const toReturn: any = {};

    for (const i in ob) {
        if (!ob.hasOwnProperty(i)) {
          continue;
        }

        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
          const flatObject = this.flattenObject(ob[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) {
                  continue;
                }

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action: string, properties: any = {}): void {
    const flattenedObject = this.flattenObject(properties);
    properties = {
      ...flattenedObject,
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

  onDeleteEvent(eventName: DeleteEvent, additionalProperties: DeleteEventAdditionalProperty): void {
    this.eventTrack(`Delete event: ${eventName}`, additionalProperties);
  }

  onDateFilter(properties: {filterType: 'existing' | 'custom', startDate: Date, endDate: Date}): void {
    this.eventTrack('Date filter', properties);
  }

  onQBOAccountDisconnect(): void {
    this.eventTrack('QBO account disconnected');
  }

  onSimpleSearch(properties: {page: SimpleSearchPage, searchType: SimpleSearchType}): void {
    this.eventTrack('Simple search', properties);
  }

  onAdvancedSearch(properties: {page: SimpleSearchPage, searchType: SearchType}): void {
    this.eventTrack('Advanced search', properties);
  }

  trackTimeSpent(event: OnboardingStep | Action, additionalProperties: Partial<TimeTakenAdditionalProperty>): void {
    const eventName = event !== Action.RESOLVE_ERROR ? `${event} Page` : event;
    this.eventTrack(`Time Spent on ${eventName}`, additionalProperties);
  }

  onErrorResolve(properties: ResolveMappingErrorProperty): void {
    this.eventTrack('Resolve Mapping Error', properties);
  }

  onMappingsAlphabeticalFilter(properties: MappingAlphabeticalFilterAdditionalProperty): void {
    this.eventTrack('Mappings Alphabetical Filter', properties);
  }

  onCloneSettingsSave(properties: Partial<UpdateEventAdditionalProperty>): void {
    this.eventTrack('Clone Settings Saved', properties);
  }
}
