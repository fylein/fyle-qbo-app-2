import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CloneSettingsComponent } from './clone-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExportDateType, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';


describe('CloneSettingsComponent', () => {
  let component: CloneSettingsComponent;
  let fixture: ComponentFixture<CloneSettingsComponent>;
  let router: Router;
  let formbuilder: UntypedFormBuilder;
  let exportSettingService: ExportSettingService;
  let importSettingService: ImportSettingService;
  let cloneSettingService: CloneSettingService;
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
      getMappingSettings: () => of(getMappingSettingResponse),
      getQBODestinationAttributes: () => null,
      getExpenseFieldsFormArray: () => null
    };
    await TestBed.configureTestingModule({
      declarations: [ CloneSettingsComponent ],
      imports: [
        HttpClientModule, MatDialogModule, MatSnackBarModule, MatMenuModule, NoopAnimationsModule
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
    router = TestBed.inject(Router);
    formbuilder = TestBed.inject(UntypedFormBuilder);
    exportSettingService = TestBed.inject(ExportSettingService);
    importSettingService = TestBed.inject(ImportSettingService);
    component.cloneSettings = mockCloneSettingsGet;

    component.cloneSettingsForm = formbuilder.group({
      employeeMapping: [component.cloneSettings.employee_mappings.workspace_general_settings?.employee_field_mapping, Validators.required],
      autoMapEmployee: [component.cloneSettings.employee_mappings.workspace_general_settings?.auto_map_employees, Validators.nullValidator],

      // Export Settings
      reimbursableExpense: [component.cloneSettings.export_settings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportDate: [component.cloneSettings.export_settings.expense_group_settings?.reimbursable_export_date_type],
      expenseState: [component.cloneSettings.export_settings.expense_group_settings?.expense_state],
      reimbursableExportGroup: [exportSettingService.getExportGroup(component.cloneSettings.export_settings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportType: [component.cloneSettings.export_settings.workspace_general_settings?.reimbursable_expenses_object],

      creditCardExpense: [component.cloneSettings.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportDate: [component.cloneSettings.export_settings.expense_group_settings?.ccc_export_date_type],
      cccExpenseState: [component.cloneSettings.export_settings.expense_group_settings?.ccc_expense_state],
      creditCardExportGroup: [exportSettingService.getExportGroup(component.cloneSettings.export_settings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
      creditCardExportType: [component.cloneSettings.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object],

      bankAccount: [component.cloneSettings.export_settings.general_mappings?.bank_account?.id ? component.cloneSettings.export_settings.general_mappings.bank_account : null],
      qboExpenseAccount: [component.cloneSettings.export_settings.general_mappings?.qbo_expense_account?.id ? component.cloneSettings.export_settings.general_mappings.qbo_expense_account : null],
      defaultCCCAccount: [component.cloneSettings.export_settings.general_mappings?.default_ccc_account?.id ? component.cloneSettings.export_settings.general_mappings.default_ccc_account : null],
      accountsPayable: [component.cloneSettings.export_settings.general_mappings?.accounts_payable?.id ? component.cloneSettings.export_settings.general_mappings.accounts_payable : null],
      defaultCreditCardVendor: [component.cloneSettings.export_settings.general_mappings?.default_ccc_vendor?.id ? component.cloneSettings.export_settings.general_mappings.default_ccc_vendor : null],
      defaultDebitCardAccount: [component.cloneSettings.export_settings.general_mappings?.default_debit_card_account?.id ? component.cloneSettings.export_settings.general_mappings.default_debit_card_account : null],
      searchOption: [],

      // Import Settings
      chartOfAccount: [component.cloneSettings.import_settings.workspace_general_settings.import_categories],
      importItems: [component.cloneSettings.import_settings.workspace_general_settings.import_items],
      chartOfAccountTypes: formbuilder.array([]),
      expenseFields: formbuilder.array([]),
      taxCode: [component.cloneSettings.import_settings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.cloneSettings.import_settings.general_mappings?.default_tax_code?.id ? component.cloneSettings.import_settings.general_mappings.default_tax_code : null],
      importVendorsAsMerchants: [component.cloneSettings.import_settings.workspace_general_settings.import_vendors_as_merchants]
    })
  
    cloneSettingService = TestBed.inject(CloneSettingService);
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
    component.cccExpenseGroupingDateOptions = [{
      'label': 'Posted Date',
      'value': ExportDateType.POSTED_AT
    },
    {
      'label': 'Spend Date',
      'value': ExportDateType.SPENT_AT
    }]

    component.cloneSettingsForm.controls.creditCardExportGroup.patchValue(ExpenseGroupingFieldOption.EXPENSE_ID);
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
    component.cloneSettingsForm.controls.creditCardExportGroup.patchValue(ExpenseGroupingFieldOption.CLAIM_NUMBER);
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
  });

  it('createReimbursableExportGroupWatcher function check', () => {
    component.cloneSettingsForm.controls.reimbursableExportGroup.patchValue(ExpenseGroupingFieldOption.EXPENSE_ID);
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
    component.cloneSettingsForm.controls.reimbursableExportGroup.patchValue(ExpenseGroupingFieldOption.SETTLEMENT_ID);
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
  });
  
  
  it('showBankAccountField function check', () => {
    component.employeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.cloneSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.BILL);
    fixture.detectChanges();
    expect(component.showBankAccountField()).toBeTrue();
  });

  it('showReimbursableAccountsPayableField function check', () => {
    component.cloneSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.VENDOR);
    component.cloneSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.JOURNAL_ENTRY);
    fixture.detectChanges();
    expect(component.showReimbursableAccountsPayableField()).toBeTrue();
  });
  
  it('showCCCAccountsPayableField function check', () => {
    component.cloneSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
    fixture.detectChanges();
    expect(component.showCCCAccountsPayableField()).toBeTrue();
  })
  
  it('showDefaultCreditCardVendorField function check', () => {
    component.cloneSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
    fixture.detectChanges();
    expect(component.showCCCAccountsPayableField()).toBeTrue();
  })

  it('setGeneralMappingsValidator function check', () => {
    component.cloneSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
    fixture.detectChanges();
    expect((component as any).setGeneralMappingsValidator()).toBeUndefined();
  });

  it('Save Function check', () => {
    component.isSaveInProgress = false;
    component.mappingSettings = []
    component.qboExpenseFields = [
      {
          "source_field": "COST_CENTER",
          "destination_field": "CUSTOMER",
          "import_to_fyle": true,
          "disable_import_to_fyle": false,
          "source_placeholder": ""
      }
    ]
    component.chartOfAccountTypesList = [
      'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
      'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset', 'Income', 'Other Income'
    ];
    spyOn(cloneSettingService, 'postCloneSettings').and.callThrough()
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(cloneSettingService.postCloneSettings).toHaveBeenCalled();
  });

  it('navigateToPreviousStep Function check', () => {
    component.navigateToPreviousStep();
    expect(routerSpy.navigate).toHaveBeenCalledWith(([`/workspaces/onboarding/qbo_connector`]));
  })

  it('enableTaxImport Function check', () => {
    component.enableTaxImport();
    expect(component.cloneSettingsForm.controls.taxCode.value).toBeTrue();
  })

  it('disableImportTax Function check', () => {
    component.disableImportTax();
    expect(component.cloneSettingsForm.controls.taxCode.value).toBeFalse();
    expect(component.cloneSettingsForm.controls.defaultTaxCode.value).toEqual(null);
  })

  it('disableImportCoa Function check', () => {
    component.disableImportCoa();
    expect(component.cloneSettingsForm.controls.chartOfAccount.value).toBeFalse();
  })

  it('restrictExpenseGroupSetting function check', () => {
    expect((component as any).restrictExpenseGroupSetting('CREDIT CARD PURCHASE')).toBeUndefined();
  });

  it('enableAccountImport function check', () => {
    component.enableAccountImport();
    expect(component.cloneSettingsForm.controls.chartOfAccount.value).toBeTrue();
  });

  it('setImportFields function check', () => {
    component.enableAccountImport();
    expect(component.cloneSettingsForm.controls.chartOfAccount.value).toBeTrue();
  });

  it('getQboExpenseFields function check', () => {
    const qboAttributes = ['CUSTOMER'];
    const mappingSettings = [
      {
          "source_field": "COST_CENTER",
          "destination_field": "CUSTOMER",
          "import_to_fyle": true,
          "is_custom": false,
          "source_placeholder": null
      }
    ];
    const fyleFields = ['COST_CENTER', 'PROJECT'];

    expect((component as any).getQboExpenseFields(qboAttributes, mappingSettings, true, fyleFields));
  });

  it('setImportFields function check', () => {
    component.mappingSettings = [];

    const fyleFields = ['COST_CENTER', 'PROJECT'];
    spyOn(importSettingService, 'getQboExpenseFields').and.returnValue([]);
    expect((component as any).setImportFields(fyleFields));
  });

  it('setupEmployeeMappingWatcher function check', () => {
    component.cloneSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.VENDOR);
    expect((component as any).setupEmployeeMappingWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.cloneSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.EMPLOYEE);
    expect((component as any).setupEmployeeMappingWatcher()).toBeUndefined();
  });

  it('createReimbursableExportTypeWatcher function check', () => {
    component.cloneSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.EXPENSE);
    expect((component as any).createReimbursableExportTypeWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.cloneSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.BILL);
    expect((component as any).createReimbursableExportTypeWatcher()).toBeUndefined();
  });

  it('createCreditCardExportTypeWatcher function check', () => {
    component.cloneSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
    expect((component as any).createCreditCardExportTypeWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.cloneSettingsForm.controls.employeeMapping.patchValue(CorporateCreditCardExpensesObject.JOURNAL_ENTRY);
    expect((component as any).createCreditCardExportTypeWatcher()).toBeUndefined();
  });

  it('setCustomValidatorsAndWatchers function check', () => {
    expect((component as any).setCustomValidatorsAndWatchers()).toBeUndefined();
  });
});
