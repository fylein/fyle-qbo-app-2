import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, CorporateCreditCardExpensesObject, ProgressPhase, ReimbursableExpensesObject, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { PreviewDialogComponent } from '../../configuration/preview-dialog/preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() form: FormGroup;

  @Input() options: ExportSettingFormOption[] | AdvancedSettingFormOption[] | any[];

  @Input() qboAttributes: DestinationAttribute[];

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() phase: ProgressPhase;

  @Input() isCloneSettingField: boolean;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private trackingService: TrackingService
  ) { }

  showQboExportPreview(reimbursableExportType: ReimbursableExpensesObject | null, creditCardExportType: CorporateCreditCardExpensesObject | null): void {
    const data = {
      QboReimburse: reimbursableExportType,
      QboCCC: creditCardExportType
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
