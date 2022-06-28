import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { ExportSettingsComponent } from './export-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, OnboardingState, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { destinationAttribute, exportResponse, export_settings, workspaceResponse } from './export-settings.fixture';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('ExportSettingsComponent', () => {
  let component: ExportSettingsComponent;
  let fixture: ComponentFixture<ExportSettingsComponent>;
  let exportSettingService: ExportSettingService;
  let workspace: WorkspaceService;
  let mappingService: MappingService;
  let service1: any;
  let service2: any;
  let service3: any;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    service1 = {
      getExportSettings: () => of(exportResponse),
      postExportSettings: () => of(exportResponse)
    };
    service2 = {
      getGroupedQBODestinationAttributes: () => of(destinationAttribute)
    };
    service3 = {
      getWorkspaceGeneralSettings: () => of(workspaceResponse),
      getOnboardingState: () => OnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ ExportSettingsComponent ],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ExportSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSettingsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formbuilder = TestBed.inject(FormBuilder);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    exportSettingService = TestBed.inject(ExportSettingService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.exportSettings = exportResponse;
    component.exportSettingsForm = formbuilder.group({
      expenseState: [component.exportSettings.expense_group_settings?.expense_state, Validators.required],
      reimbursableExpense: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false, (component as any).exportSelectionValidator()],
      reimbursableExportType: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportGroup: [(component as any).getExportGroup(component.exportSettings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportDate: [component.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false, (component as any).exportSelectionValidator()],
      creditCardExportType: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportGroup: [(component as any).getExportGroup(component.exportSettings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
      creditCardExportDate: [component.exportSettings.expense_group_settings?.ccc_export_date_type],
      bankAccount: [component.exportSettings.general_mappings?.bank_account?.id ? component.exportSettings.general_mappings.bank_account : null],
      defaultCCCAccount: [component.exportSettings.general_mappings?.default_ccc_account?.id ? component.exportSettings.general_mappings.default_ccc_account : null],
      accountsPayable: [component.exportSettings.general_mappings?.accounts_payable?.id ? component.exportSettings.general_mappings.accounts_payable : null],
      defaultCreditCardVendor: [component.exportSettings.general_mappings?.default_ccc_vendor?.id ? component.exportSettings.general_mappings.default_ccc_vendor : null],
      qboExpenseAccount: [component.exportSettings.general_mappings?.qbo_expense_account?.id ? component.exportSettings.general_mappings.qbo_expense_account : null],
      defaultDebitCardAccount: [component.exportSettings.general_mappings?.default_debit_card_account?.id ? component.exportSettings.general_mappings.default_debit_card_account : null],
      searchOption: []
    });
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

  it('getReimbursableExportTypes function check', () => {
    expect(component.getReimbursableExportTypes(EmployeeFieldMapping.EMPLOYEE)).toEqual(export_settings);
  });

  it('navigateToPreviousStep function check', () => {
    expect(component.navigateToPreviousStep()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/employee_settings']);
  });

  it('showConfirmationDialog function check', () => {
    expect((component as any).showConfirmationDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('generateGroupingLabel function check', () => {
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.EXPENSE);
    fixture.detectChanges();
    expect(component.generateGroupingLabel('reimbursable')).toEqual('How should the expenses be grouped?');
  });

  it('createReimbursableExpenseWatcher function check', () => {
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(!component.exportSettingsForm.controls.reimbursableExpense.value);
    expect((component as any).createReimbursableExpenseWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(!component.exportSettingsForm.controls.reimbursableExpense.value);
    expect((component as any).createReimbursableExpenseWatcher()).toBeUndefined();
  });

  it('createCreditCardExpenseWatcher function check', () => {
    component.exportSettingsForm.controls.creditCardExpense.patchValue(!component.exportSettingsForm.controls.creditCardExpense.value);
    expect((component as any).createCreditCardExpenseWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.creditCardExpense.patchValue(!component.exportSettingsForm.controls.creditCardExpense.value);
    expect((component as any).createCreditCardExpenseWatcher()).toBeUndefined();
  });

  it('restrictExpenseGroupSetting function check', () => {
    expect((component as any).restrictExpenseGroupSetting('CREDIT CARD PURCHASE')).toBeUndefined();
  });

  it('getAccountsPayableLabel function check', () => {
    expect(component.getAccountsPayableLabel()).toEqual(ReimbursableExpensesObject.BILL);
  });

  it('getAccountsPayableLabel function check', () => {
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.EXPENSE);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
    fixture.detectChanges();
    expect(component.getAccountsPayableLabel()).toEqual(ReimbursableExpensesObject.BILL);
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.EXPENSE);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
    fixture.detectChanges();
    expect(component.getAccountsPayableLabel()).toEqual(ReimbursableExpensesObject.JOURNAL_ENTRY);
  });

  it('showBankAccountField function check', () => {
    component.employeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.BILL);
    fixture.detectChanges();
    expect(component.showBankAccountField()).toBeTrue();
  });

  it('showReimbursableAccountsPayableField function check', () => {
    component.employeeFieldMapping = EmployeeFieldMapping.VENDOR;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.JOURNAL_ENTRY);
    fixture.detectChanges();
    expect(component.showReimbursableAccountsPayableField()).toBeTrue();
  });
});
