import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MainComponent } from 'src/app/integration/main/main.component';
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

  constructor(
    private dialog: MatDialog,
    public helperService: HelperService,
    private mainComponent: MainComponent
  ) { }

  showQBOExportPreview(exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject): void {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '960px',
      height: '530px',
      data: exportType
    });
    this.mainComponent.scrollableDialogHandler(true);

    dialogRef.afterClosed().subscribe(() => this.mainComponent.scrollableDialogHandler(false));
  }

  ngOnInit(): void {
  }

}
