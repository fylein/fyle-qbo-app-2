import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ProgressPhase, ReimbursableExpensesObject, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { PreviewPage } from 'src/app/core/models/misc/preview-page.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() options: EmployeeSettingFormOption[] | ExportSettingFormOption[] | AdvancedSettingFormOption[] | any[];

  @Input() qboAttributes: DestinationAttribute[];

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() liveEntityExample: {[EmployeeFieldMapping.EMPLOYEE]: string | undefined, [EmployeeFieldMapping.VENDOR]: string | undefined};

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() phase: ProgressPhase;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    private dialog: MatDialog,
    public helperService: HelperService,
    private trackingService: TrackingService
  ) { }

  showQBOExportPreview(reimbursableExportType: ReimbursableExpensesObject | null, creditCardExportType: CorporateCreditCardExpensesObject | null): void {
    const data: PreviewPage = {
      qboReimburse: reimbursableExportType,
      qboCCC: creditCardExportType
    };

    this.trackingService.onClickEvent(ClickEvent.PREVIEW_QBO_EXPORT, {phase: this.phase, exportType: reimbursableExportType || creditCardExportType});

    this.dialog.open(PreviewDialogComponent, {
      width: '960px',
      height: '530px',
      data: data
    });
  }

  ngOnInit(): void {
  }
}
