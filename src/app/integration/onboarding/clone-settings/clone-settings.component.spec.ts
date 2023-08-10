import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneSettingsComponent } from './clone-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mockCloneSettingExist, mockCloneSettingsGet, mockGroupedDestinationAttribtues } from './clone-settings.fixture';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { expenseFieldresponse } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';
import { getMappingSettingResponse } from 'src/app/shared/components/mapping/generic-mapping/generic-mapping.fixture';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';


describe('CloneSettingsComponent', () => {
  let component: CloneSettingsComponent;
  let fixture: ComponentFixture<CloneSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let service1: any;
  let service2: any;
  let service3: any;

  beforeEach(async () => {
    service1 = {
      checkCloneSettingsExists: () => of(mockCloneSettingExist),
      postCloneSettings: () => of(mockCloneSettingsGet),
      getCloneSettings: () => of(mockCloneSettingsGet)
    };
    service2 = {
      getGroupedQBODestinationAttributes: () => of(mockGroupedDestinationAttribtues),
      getFyleExpenseFields: () => of(expenseFieldresponse),
      getMappingSettings: () => of(getMappingSettingResponse)
    };
    await TestBed.configureTestingModule({
      declarations: [ CloneSettingsComponent ],
      imports: [
        HttpClientModule, MatDialogModule, MatSnackBarModule, MatMenuModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: CloneSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: AdvancedSettingService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getExportType function check', () => {
    const response = ReimbursableExpensesObject.JOURNAL_ENTRY;
    const output = response.toLowerCase().charAt(0).toUpperCase() + response.toLowerCase().slice(1);
    expect(component.getExportType(ReimbursableExpensesObject.JOURNAL_ENTRY)).toEqual(output);
  });

  it('createCreditCardExportGroupWatcher function check', () => {
    component.cloneSettingsForm.controls.creditCardExportGroup.patchValue(!component.cloneSettingsForm.controls.creditCardExportGroup.value);
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
    component.cloneSettingsForm.controls.creditCardExpense.patchValue(!component.cloneSettingsForm.controls.creditCardExportGroup.value);
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
  });

  it('createReimbursableExportGroupWatcher function check', () => {
    component.cloneSettingsForm.controls.reimbursableExportGroup.patchValue(!component.cloneSettingsForm.controls.reimbursableExportGroup.value);
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
    component.cloneSettingsForm.controls.reimbursableExportGroup.patchValue(!component.cloneSettingsForm.controls.reimbursableExportGroup.value);
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
  });
});
