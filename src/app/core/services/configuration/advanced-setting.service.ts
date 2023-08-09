import { HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingPost, AdvancedSettingWorkspaceSchedulePost } from '../../models/configuration/advanced-setting.model';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { ExpenseFilterResponse, SkipExport } from '../../models/misc/skip-export.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { PaymentSyncDirection } from '../../models/enum/enum.model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FormGroup } from '@angular/forms';
import { AddEmailDialogComponent } from 'src/app/shared/components/configuration/advanced-settings/add-email-dialog/add-email-dialog.component';

const advancedSettingsCache$ = new Subject<void>();
const skipExportCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class AdvancedSettingService {

  @Output() patchAdminEmailsEmitter: EventEmitter<WorkspaceScheduleEmailOptions[]> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private dialog: MatDialog
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<AdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(exportSettingsPayload: AdvancedSettingPost): Observable<AdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, exportSettingsPayload);
  }

  @Cacheable({
    cacheBusterObserver: skipExportCache
  })
  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: skipExportCache
  })
  postExpenseFilter(skipExport: SkipExport): Observable<SkipExport> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, skipExport);
  }

  @CacheBuster({
    cacheBusterNotifier: skipExportCache
  })
  deleteExpenseFilter(expenseFilterId?: number): Observable<SkipExport> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/${expenseFilterId}/`);
  }

  getWorkspaceAdmins(): Observable<[WorkspaceScheduleEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
  
  getPaymentSyncOptions(): AdvancedSettingFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Export Fyle ACH Payments to Quickbooks Online',
        value: PaymentSyncDirection.FYLE_TO_QBO
      },
      {
        label: 'Import Quickbooks Payments into Fyle',
        value: PaymentSyncDirection.QBO_TO_FYLE
      }
    ];
  }

  getFrequencyIntervals(): AdvancedSettingFormOption[] {
    return  [...Array(24).keys()].map(day => {
      return {
        label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
        value: day + 1
      };
    });
  }
  
  openAddemailDialog(advancedSettingsForm: FormGroup, adminEmails: WorkspaceScheduleEmailOptions[]): void {
    const dialogRef = this.dialog.open(AddEmailDialogComponent, {
      width: '467px',
      data: {
        workspaceId: this.workspaceService.getWorkspaceId(),
        hours: advancedSettingsForm.value.exportScheduleFrequency,
        schedulEnabled: advancedSettingsForm.value.exportSchedule,
        selectedEmails: advancedSettingsForm.value.emails
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        advancedSettingsForm.controls.exportScheduleFrequency.patchValue(result.hours);
        advancedSettingsForm.controls.emails.patchValue(result.emails_selected);
        advancedSettingsForm.controls.addedEmail.patchValue(result.email_added);

        const additionalEmails = adminEmails.concat(result.email_added);
        this.patchAdminEmailsEmitter.emit(additionalEmails);
      }
    });
  }
}
