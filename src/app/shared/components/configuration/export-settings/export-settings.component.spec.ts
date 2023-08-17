import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import { ExportSettingsComponent } from './export-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, OnboardingState, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { destinationAttribute, errorResponse, exportResponse, exportResponse1, export_settings, mockCCCExpenseStateOptions, mockCreditCardExportType, mockReimbursableExpenseGroupingDateOptions, mockReimbursableExpenseGroupingFieldOptions, mockReimbursableExpenseStateOptions, mockReimbursableExportTypeOptions, replacecontent1, replacecontent2, replacecontent3, workspaceResponse, workspaceResponse1 } from './export-settings.fixture';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

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
  let formbuilder: UntypedFormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    service1 = {
      getExportSettings: () => of(exportResponse),
      postExportSettings: () => of(exportResponse),
      exportSelectionValidator: () => undefined,
      createCreditCardExpenseWatcher: () => undefined,
      createReimbursableExpenseWatcher: () => undefined,
      getReimbursableExpenseGroupingFieldOptions: () => mockReimbursableExpenseGroupingFieldOptions,
      getReimbursableExpenseGroupingDateOptions: () => mockReimbursableExpenseGroupingDateOptions,
      getcreditCardExportTypes: () => undefined,
      getReimbursableExportTypeOptions: () => undefined,
      getCCCExpenseStateOptions: () => undefined,
      getExportGroup: () => undefined,
      getReimbursableExpenseStateOptions: () => mockReimbursableExpenseStateOptions,
      setGeneralMappingsValidator: () => undefined
    };
    service2 = {
      getGroupedQBODestinationAttributes: () => of(destinationAttribute),
      refreshMappingPages: () => undefined
    };
    service3 = {
      getWorkspaceGeneralSettings: () => of(workspaceResponse),
      getOnboardingState: () => OnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ ExportSettingsComponent ],
      providers: [ UntypedFormBuilder,
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
    formbuilder = TestBed.inject(UntypedFormBuilder);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    exportSettingService = TestBed.inject(ExportSettingService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.exportSettings = exportResponse;
    component.exportSettingsForm = formbuilder.group({
      expenseState: [component.exportSettings.expense_group_settings?.expense_state, Validators.required],
      reimbursableExpense: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportGroup: [exportSettingService.getExportGroup(component.exportSettings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportDate: [component.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportType: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportGroup: [exportSettingService.getExportGroup(component.exportSettings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
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

  it('ngOnint function check', () => {
    spyOn(workspace, 'getWorkspaceGeneralSettings').and.returnValue(of(workspaceResponse1));
    spyOn(exportSettingService, 'getExportSettings').and.returnValue(of(exportResponse1));
    component.ngOnInit();

  });

  it('getExportType function check', () => {
    const response = ReimbursableExpensesObject.JOURNAL_ENTRY;
    const output = response.toLowerCase().charAt(0).toUpperCase() + response.toLowerCase().slice(1);
    expect(component.getExportType(ReimbursableExpensesObject.JOURNAL_ENTRY)).toEqual(output);
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


  it('restrictExpenseGroupSetting function check', () => {
    expect((component as any).restrictExpenseGroupSetting('CREDIT CARD PURCHASE')).toBeUndefined();
  });

  it('getAccountsPayableLabel function check', () => {
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
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

  it('createReimbursableExportGroupWatcher function check', () => {
    const reimbursable = component.exportSettingsForm.controls.reimbursableExportGroup.value;
    component.exportSettingsForm.controls.reimbursableExportGroup.patchValue('expense_id');
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.reimbursableExportGroup.patchValue(reimbursable);
    expect((component as any).createReimbursableExportGroupWatcher()).toBeUndefined();
  });

  it('createCreditCardExportGroupWatcher function check', () => {
    const reimbursable = component.exportSettingsForm.controls.creditCardExportGroup.value;
    component.exportSettingsForm.controls.creditCardExportGroup.patchValue('expense_id');
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettingsForm.controls.creditCardExportGroup.patchValue(reimbursable);
    expect((component as any).createCreditCardExportGroupWatcher()).toBeUndefined();
  });

  it('advancedSettingAffected function check', () => {
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BILL;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.CHECK;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.BILL);
    expect((component as any).advancedSettingAffected()).toBeTrue();
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    expect((component as any).updateExportSettings()).toBeTrue();
  });

  it('replaceContentBasedOnConfiguration function check', () => {
    expect((component as any).replaceContentBasedOnConfiguration('BILL', 'CHECK', 'reimbursable').length).toBeGreaterThan(replacecontent1.length);
    expect((component as any).replaceContentBasedOnConfiguration('None', 'None', 'reimbursable').length).toBeGreaterThan(replacecontent2.length);
  });

  it('constructWarningMessage function check', () => {
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.CHECK;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.BILL);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
    expect((component as any).constructWarningMessage().length).toBeGreaterThan(replacecontent1.length);
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.CHECK;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.JOURNAL_ENTRY);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BILL);
    expect((component as any).constructWarningMessage().length).toBeGreaterThan(replacecontent1.length);
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.JOURNAL_ENTRY;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.JOURNAL_ENTRY);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.JOURNAL_ENTRY);
    expect((component as any).constructWarningMessage().length).toBeGreaterThan(replacecontent3.length);
  });

  it('save function check', () => {
    spyOn(exportSettingService, 'postExportSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.EXPORT_SETTINGS);
    component.import_items = true;
    component.isOnboarding = true;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BILL;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.CHECK;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.JOURNAL_ENTRY);
    component.isOnboarding = false;
    expect(component.save()).toBeUndefined();
  });

  it('constructWarningMessage function check', () => {
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue('');
    component.exportSettingsForm.controls.creditCardExportType.patchValue('');
    // Expect((component as any).constructWarningMessage()).toBeUndefined();
  });

  it('constructPayloadAndSave function check', () => {
    component.isOnboarding = false;
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('constructPayloadAndSave function check for failure', () => {
    spyOn(exportSettingService, 'postExportSettings').and.returnValue(throwError(errorResponse));
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
    fixture.detectChanges();
    expect(exportSettingService.postExportSettings).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
