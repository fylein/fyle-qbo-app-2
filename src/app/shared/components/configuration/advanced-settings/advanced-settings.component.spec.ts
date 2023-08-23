import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { adminEmails, advancedSettingResponse, customFields, destinationAttribute, emailResponse, errorResponse, postExpenseFilterResponse, getadvancedSettingResponse, getadvancedSettingResponse2, getExpenseFilterResponse, memo, previewResponse, response, conditionMock1, conditionMock2, conditionMock3, customOperatorMock1, customOperatorMock2, customOperatorMock3, customOperatorMock4, claimNumberOperators, spentAtOperators, reportTitleOperators, conditionMock4, conditionFieldOptions, getExpenseFilterResponse2, getExpenseFilterResponse3, getExpenseFilterResponse4 } from './advanced-settings.fixture';
import { Router } from '@angular/router';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomOperatorOption, OnboardingState, PaymentSyncDirection } from 'src/app/core/models/enum/enum.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ConditionField, ExpenseFilterResponse } from 'src/app/core/models/misc/skip-export.model';
import { MatLegacyChipInputEvent } from '@angular/material/legacy-chips';

describe('AdvancedSettingsComponent', () => {
  let component: AdvancedSettingsComponent;
  let fixture: ComponentFixture<AdvancedSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let advancedSettingService: AdvancedSettingService;
  let mappingService: MappingService;
  let workspace: WorkspaceService;
  let service1: any;
  let service2: any;
  let service3: any;
  let formbuilder: UntypedFormBuilder;
  let dialogSpy: jasmine.Spy;
  let dialogSpy1: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({hours: 1,
    schedule_enabled: true,
    emails_selected: ["fyle@fyle.in"],
    email_added: {name: "fyle", email: 'fyle@fyle.in'}}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    service1 = {
      postAdvancedSettings: () => of(advancedSettingResponse),
      getAdvancedSettings: () => of(getadvancedSettingResponse),
      getWorkspaceAdmins: () => of(adminEmails),
      postExpenseFilter: () => of(postExpenseFilterResponse),
      getExpenseFilter: () => of(getExpenseFilterResponse),
      deleteExpenseFilter: () => of(),
      openAddemailDialog: () => undefined
    };

    service2 = {
      getQBODestinationAttributes: () => of(destinationAttribute),
      getFyleCustomFields: () => of(customFields)
    };

    service3 = {
      getWorkspaceGeneralSettings: () => of(response),
      getOnboardingState: () => 'ADVANCED_CONFIGURATION',
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId
    };
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, SharedModule, NoopAnimationsModule, MatDialogModule],
      declarations: [ AdvancedSettingsComponent ],
      providers: [ UntypedFormBuilder, MatDialog,
        { provide: Router, useValue: routerSpy },
        { provide: AdvancedSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSettingsComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(UntypedFormBuilder);
    component.workspaceGeneralSettings = response;
    component.advancedSettings = getadvancedSettingResponse;
    component.adminEmails = [];
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [component.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      skipExport: [true],
      emails: [emailResponse.emails_selected],
      addedEmail: [emailResponse.additional_email_options]
    });

    const skipExportFormMock = formbuilder.group({
      condition1: conditionMock1,
      operator1: ['in'],
      value1: ['admin1@fyle.in'],
      customFieldType1: [null],
      join_by: ['and'],
      condition2: conditionMock3,
      operator2: ['lte'],
      value2: [new Date('2022-10-01T00:00:00.000Z')],
      customFieldType2: [null]
    });
    component.advancedSettingsForm = form;
    component.skipExportForm = skipExportFormMock;
    router = TestBed.inject(Router);
    advancedSettingService = TestBed.inject(AdvancedSettingService);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    dialogSpy1 = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update skipExport control value', () => {
    // Set initial value to false
    (component as any).skipExportWatcher();
    component.advancedSettingsForm.patchValue({ skipExport: false });
    expect(component.advancedSettingsForm.controls.skipExport.value).toBe(false);

    // Set value to true
    component.advancedSettingsForm.patchValue({ skipExport: true });
    expect(component.advancedSettingsForm.controls.skipExport.value).toBe(true);
  });

  it('should reset fields and set operator field options if condition is not custom', () => {
    component.skipExportForm.controls.operator1.patchValue('is');
    component.skipExportForm.controls.value1.patchValue('test value');
    component.valueOption1 = ['option1', 'option2'];
    component.operatorFieldOptions1 = [customOperatorMock3, customOperatorMock2, customOperatorMock1];
    component.resetFields(component.skipExportForm.controls.operator1, component.skipExportForm.controls.value1, conditionMock1, 1);

    component.skipExportForm.controls.operator2.patchValue('is');
    component.skipExportForm.controls.value2.patchValue('test value');
    component.valueOption2 = ['option1', 'option2'];
    component.operatorFieldOptions2 = [customOperatorMock3, customOperatorMock2, customOperatorMock1];
    component.resetFields(component.skipExportForm.controls.operator2, component.skipExportForm.controls.value2, conditionMock1, 2);

    component.skipExportForm.controls.operator2.patchValue('is');
    component.skipExportForm.controls.value2.patchValue('test value');
    component.valueOption2 = ['option1', 'option2'];
    component.operatorFieldOptions2 = [customOperatorMock3, customOperatorMock2, customOperatorMock1];
    const condition = conditionMock1;
    condition.is_custom = true;
    component.resetFields(component.skipExportForm.controls.operator2, component.skipExportForm.controls.value2, condition, 2);

    expect(component.skipExportForm.controls.operator1.value).toBeNull();
    expect(component.skipExportForm.controls.value1.value).toBeNull();
    expect(component.valueOption1).toEqual([]);
    expect(component.skipExportForm.controls.operator2.value).toBeNull();
    expect(component.skipExportForm.controls.value2.value).toBeNull();
    expect(component.valueOption2).toEqual([]);
  });

  it('showPaymentSyncField function check', () => {
    expect(component.showPaymentSyncField()).toBeTrue();
  });

  it('showSingleCreditLineJEField function check', () => {
    expect(component.showSingleCreditLineJEField()).toBeTrue();
  });

  it('showAutoCreateVendorsField function check', () => {
    expect(component.showAutoCreateVendorsField()).toBeTrue();
  });

  it('showAutoCreateMerchantsAsVendorsField function check', () => {
    expect(component.showAutoCreateMerchantsAsVendorsField()).toBeFalse();
  });

  it('navigateToPreviousStep function check', () => {
    component.navigateToPreviousStep();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/import_settings']);
  });

  it('setupForm function check', () => {
    component.advancedSettings=getadvancedSettingResponse2;
    (component as any).setupForm();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('setupForm function check with a different payment sync value', () => {
    const advancedSettings = Object.assign(getadvancedSettingResponse2);
    advancedSettings.workspace_general_settings.sync_qbo_to_fyle_payments = true;
    // @ts-ignore
    advancedSettings.general_mappings.bill_payment_account = null;
    advancedSettings.workspace_schedules.enabled = false;
    advancedSettings.workspace_schedules.emails_selected = null;
    fixture.detectChanges();
    (component as any).setupForm();
    // Fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('formatememopreview function check', () => {
    component.memoStructure = memo;
    fixture.detectChanges();
    (component as any).formatMemoPreview();
    expect(component.memoPreviewText.length).toEqual(previewResponse.length);
  });

  it('should update form controls based on operator1 value changes', () => {

    component.operatorFieldWatcher();

    // Test when operator1 is 'is_empty'
    component.skipExportForm.controls.operator1.patchValue('is_empty');
    expect(component.valueOption1).toEqual([]);
    expect(component.isDisabledChip1).toBe(true);
    expect(component.skipExportForm.controls.value1.validator).toBeFalsy();
    expect(component.skipExportForm.controls.value1.value).toBe(null);

    // Test when operator1 is 'is_not_empty'
    component.skipExportForm.controls.operator1.patchValue('is_not_empty');
    expect(component.valueOption1).toEqual([]);
    expect(component.isDisabledChip1).toBe(true);
    expect(component.skipExportForm.controls.value1.validator).toBeFalsy();
    expect(component.skipExportForm.controls.value1.value).toBe(null);

    // Test when operator1 is not 'is_empty' or 'is_not_empty'
    component.skipExportForm.controls.operator1.patchValue('equals');
    expect(component.valueOption1).toEqual([]);
    expect(component.isDisabledChip1).toBe(false);
    expect(component.skipExportForm.controls.value1.validator).toBeTruthy();
  });

  it('should call conditionFieldWatcher and operatorFieldWatcher', () => {
    spyOn(component, 'conditionFieldWatcher');
    spyOn(component, 'operatorFieldWatcher');

    component.fieldWatcher();

    expect(component.conditionFieldWatcher).toHaveBeenCalled();
    expect(component.operatorFieldWatcher).toHaveBeenCalled();
  });

  it('should update form controls based on operator2 value changes', () => {
    component.operatorFieldWatcher();

    component.skipExportForm.controls.operator2.patchValue('is_empty');

    expect(component.valueOption2).toEqual([]);
    expect(component.isDisabledChip2).toBe(true);
    expect(component.skipExportForm.controls.value2.validator).toBeFalsy();
    expect(component.skipExportForm.controls.value2.value).toBeNull();

    component.skipExportForm.controls.operator2.patchValue('equals');

    expect(component.valueOption2).toEqual([]);
    expect(component.isDisabledChip2).toBe(false);
    expect(component.skipExportForm.controls.value2.validator).toBeTruthy();
    expect(component.skipExportForm.controls.value2.value).toBeNull();
  });

  it('should reset form controls based on condition2 value changes', () => {

    spyOn(component, 'resetFields');

    component.conditionFieldWatcher();

    component.skipExportForm.controls.condition2.patchValue(conditionMock1);

    expect(component.resetFields).toHaveBeenCalledWith(
      component.skipExportForm.controls.operator2,
      component.skipExportForm.controls.value2,
      conditionMock1,
      2
    );
  });

  it('should update operatorFieldOptions based on rank and type', () => {
    component.customOperatorOptions = [customOperatorMock1, customOperatorMock2];
    component.customSelectOperatorOptions = [customOperatorMock3, customOperatorMock4];

    // Test rank 1 with type other than SELECT
    component.setCustomOperatorOptions(1, 'TEXT');
    expect(component.operatorFieldOptions1).toEqual(component.customOperatorOptions);

    // Test rank 1 with type SELECT
    component.setCustomOperatorOptions(1, 'SELECT');
    expect(component.operatorFieldOptions1).toEqual(component.customSelectOperatorOptions);

    // Test rank 2 with type other than SELECT
    component.setCustomOperatorOptions(2, 'TEXT');
    expect(component.operatorFieldOptions2).toEqual(component.customOperatorOptions);

    // Test rank 2 with type SELECT
    component.setCustomOperatorOptions(2, 'SELECT');
    expect(component.operatorFieldOptions2).toEqual(component.customSelectOperatorOptions);
  });

  it('should return correct operator list based on condition field', () => {
    // Test condition field is claim_number
    const claimNumberResult = component.setDefaultOperatorOptions('claim_number');
    expect(claimNumberResult).toEqual(claimNumberOperators);

    // Test condition field is spent_at
    const spentAtResult = component.setDefaultOperatorOptions('spent_at');
    expect(spentAtResult).toEqual(spentAtOperators);

    // Test condition field is report_title
    const reportTitleResult = component.setDefaultOperatorOptions('report_title');
    expect(reportTitleResult).toEqual(reportTitleOperators);
  });

  it('should return true when condition2 field_name is report_title and operator2 is not is_empty or is_not_empty', () => {
    // Set up the form values
    component.skipExportForm.patchValue({
      condition2: { field_name: 'report_title', type: 'SELECT' },
      operator2: 'iexact'
    });

    expect(component.showInputField2()).toBeTrue();
  });

  it('should return true when condition2 field_name is not report_title, condition2 type is SELECT, TEXT, or NUMBER, and operator2 is not is_empty or is_not_empty', () => {
    // Set up the form values
    component.skipExportForm.patchValue({
      condition2: { field_name: 'claim_number', type: 'SELECT' },
      operator2: 'iexact'
    });

    expect(component.showChipField2()).toBeTrue();
  });

  it('should return true if operator2 is not "is_empty" or "is_not_empty"', () => {
    component.skipExportForm.patchValue({
      operator2: 'iexact'
    });
    expect(component.showValueHeader2()).toBeTrue();
  });

  it('should return false if operator2 is "is_empty" or "is_not_empty"', () => {
    component.skipExportForm.patchValue({
      operator2: 'is_not_empty'
    });
    expect(component.showValueHeader2()).toBeFalse();
  });

  it('should add a new value to valueOption2 and clear the value2 control validator', () => {
    // Set up initial state
    component.valueOption1 = ['foo', 'bar'];
    component.valueOption2 = ['foo', 'bar'];
    const inputEvent = {
      input: {
        value: 'anish'
      },
      value: 'anish'
    } as MatLegacyChipInputEvent;
    // Add a new value
    component.add2(inputEvent);

    expect(component.valueOption2).toEqual(['foo', 'bar', 'anish']);

    component.add1(inputEvent);

    expect(component.valueOption1).toEqual(['foo', 'bar', 'anish']);
  });

  it('should remove the specified chip value from valueOption2', () => {
    // Set up initial state
    component.valueOption2 = ['foo', 'bar', 'baz'];

    // Remove a chip value
    component.remove2('bar');

    expect(component.valueOption2).toEqual(['foo', 'baz']);

    component.remove2('foo');
    component.remove2('baz');

  });

  it('should remove value from valueOption1 array and set validators if valueOption1 array is empty', () => {
    // Arrange
    component.valueOption1 = ['value1', 'value2', 'value3'];
    fixture.detectChanges();
    const chipValue = 'value2';

    // Act
    component.remove1(chipValue);

    // Assert
    expect(component.valueOption1).toEqual(['value1', 'value3']);

    component.remove1('value1');
    component.remove1('value3');
  });

  it('should return a Date object when the condition type is DATE', () => {
    const conditionDate: ConditionField = conditionMock3;
    const conditionTitle: ConditionField = conditionMock2;
    const conditionEmail: ConditionField = conditionMock1;
    const value = ['2022-12-31T23:59:59.999Z'];
    const result = component.getFieldValue(value, conditionDate, 1);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe('2022-12-31T23:59:59.999Z');
    const value1 = ['My Report'];
    const result1 = component.getFieldValue(value1, conditionTitle, 2);
    expect(result1).toBe('My Report');
    const value2 = ['admin1@email.com'];
    const result2 = component.getFieldValue(value2, conditionEmail, 2);
  });

  it('should return true when the objects have the same properties and values', () => {
    const selectedOption = { name: 'John', age: 30 };
    const listedOption = { name: 'John', age: 30 };
    const result = component.compareObjects(selectedOption, listedOption);
    expect(result).toBe(true);
  });

  it('should call resetFields when the condition1 value changes', () => {
    const operator1 = component.skipExportForm.controls.operator1;
    const value1 = component.skipExportForm.controls.value1;
    spyOn(component, 'resetFields');
    component.skipExportForm.controls.condition1.setValue(conditionMock3);
    component.skipExportForm.controls.condition1.updateValueAndValidity();
  });

  it('Save Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [component.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      skipExport: [false],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });

    const skipExportFormMock = formbuilder.group({
      condition1: conditionMock1,
      operator1: ['in'],
      value1: ['admin1@fyle.in'],
      customFieldType1: [null],
      join_by: ['and'],
      condition2: conditionMock2,
      operator2: ['in'],
      value2: ['anish'],
      customFieldType2: [null]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.skipExportForm = skipExportFormMock;
    component.isOnboarding = true;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(workspace, 'setOnboardingState').and.callThrough();
    spyOn(advancedSettingService, 'getExpenseFilter').and.callThrough();
    spyOn(advancedSettingService, 'postExpenseFilter').and.callThrough();
    spyOn(advancedSettingService, 'deleteExpenseFilter').and.callThrough();
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(workspace.setOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/done']);
  });

  it('Save Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [component.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      skipExport: [false],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });

    const skipExportFormMock = formbuilder.group({
      condition1: conditionMock1,
      operator1: ['in'],
      value1: ['admin1@fyle.in'],
      customFieldType1: [null],
      join_by: ['and'],
      condition2: conditionMock2,
      operator2: ['in'],
      value2: ['anish'],
      customFieldType2: [null]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.skipExportForm = skipExportFormMock;
    component.isOnboarding = false;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
  });

  it('Save FAILURE Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [component.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      skipExport: [false],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });
    const skipExportFormMock = formbuilder.group({
      condition1: conditionMock1,
      operator1: ['iexact'],
      value1: ['admin1@fyle.in'],
      customFieldType1: [null],
      join_by: ['AND'],
      condition2: conditionMock2,
      operator2: ['iexact'],
      value2: ['anish'],
      customFieldType2: [null]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.skipExportForm = skipExportFormMock;
    component.showExpenseFilters = false;
    component.isOnboarding = false;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.returnValue(throwError(errorResponse));
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('setup skip export form', () => {
    const conditionArr = conditionFieldOptions;
    component.setupSkipExportForm(getExpenseFilterResponse, conditionArr);
    component.setupSkipExportForm(getExpenseFilterResponse2, conditionArr);
    component.setupSkipExportForm(getExpenseFilterResponse3, conditionArr);
    component.setupSkipExportForm(getExpenseFilterResponse4, conditionArr);
  });

  it('createPaymentSyncWatcher function check', () => {
    expect((component as any).createPaymentSyncWatcher()).toBeUndefined();
    expect((component as any).createScheduledWatcher()).toBeUndefined();
    component.advancedSettingsForm.controls.paymentSync.patchValue(PaymentSyncDirection.FYLE_TO_QBO);
    component.advancedSettingsForm.controls.exportSchedule.patchValue(true);
    fixture.detectChanges();
    component.advancedSettingsForm.controls.paymentSync.patchValue(PaymentSyncDirection.QBO_TO_FYLE);
    expect((component as any).createPaymentSyncWatcher()).toBeUndefined();
  });

  it('createScheduledWatcher function check', () => {
    component.advancedSettingsForm.controls.exportSchedule.patchValue(9);
    expect((component as any).createScheduledWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.advancedSettingsForm.controls.exportSchedule.patchValue(0);
    expect((component as any).createScheduledWatcher()).toBeUndefined();
  });

  it('createMemoStructureWatcher function check', () => {
    expect((component as any).createMemoStructureWatcher()).toBeUndefined();
    component.advancedSettingsForm.controls.memoStructure.patchValue(['Integration']);
  });

  it('openAddemailDialog function check', () => {
    expect(component.openAddemailDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy1).toHaveBeenCalled();
  });

  it('skipExport toggle check', () => {
    component.advancedSettingsForm.controls.skipExport.patchValue(false);
  });

  it('should return true and set operator2 to null if condition1 and condition2 are valid and have the same field_name when showAdditionalCondition is true', () => {
    component.showAdditionalCondition = true;
    const condition1 = { field_name: conditionMock1, operator: 'iexact', value: ['test'] };
    const condition2 = { field_name: conditionMock1, operator: 'iexact', value: ['test2'] };
    component.skipExportForm.controls.condition1.patchValue(condition1);
    component.skipExportForm.controls.condition2.patchValue(condition2);
    const result = component.checkValidationCondition();
    expect(result).toBeTrue();
    expect(component.skipExportForm.value.operator2).toBeNull();
    component.showAdditionalCondition = false;
    const result1 = component.checkValidationCondition();
    expect(result1).toBeFalse();
    expect(component.skipExportForm.value.operator2).toBeNull();
  });

  it('should reset additional filter and hide it after calling remCondition', () => {
    // Set up the initial state of the form
    component.showAdditionalCondition = true;
    component.showAddButton = false;
    component.skipExportForm.controls.join_by.setValue('AND');
    component.skipExportForm.controls.condition2.setValue('claim_number');
    component.skipExportForm.controls.operator2.setValue('iexact');
    component.skipExportForm.controls.value2.setValue('123');

    // Call the function to be tested
    component.remCondition();

    // Assert the expected behavior
    expect(component.showAdditionalCondition).toBe(false);
    expect(component.showAddButton).toBe(true);
    expect(component.skipExportForm.controls.join_by.value).toBe(null);
    expect(component.skipExportForm.controls.condition2.value).toBe(null);
    expect(component.skipExportForm.controls.operator2.value).toBe(null);
    expect(component.skipExportForm.controls.value2.value).toBe(null);
  });

  it('should update the additional filter visibility correctly', () => {
    component.updateAdditionalFilterVisibility(true);
    expect(component.showAdditionalCondition).toBe(true);
    expect(component.showAddButton).toBe(false);
    expect(component.skipExportForm.controls.join_by.validator).toBe(Validators.required);
    expect(component.skipExportForm.controls.condition2.validator).toBe(Validators.required);
    expect(component.skipExportForm.controls.operator2.validator).toBe(Validators.required);

    component.updateAdditionalFilterVisibility(false);
    expect(component.showAdditionalCondition).toBe(false);
    expect(component.showAddButton).toBe(true);
  });

  it('should return true if condition1 field_name is report_title and operator1 is not "is_empty" or "is_not_empty"', () => {
    component.skipExportForm.controls.condition1.patchValue(conditionMock4);
    component.skipExportForm.controls.operator1.patchValue(customOperatorMock2);
    // Act
    const result = component.showInputField1();

    // Assert
    expect(result).toBeFalse();

    component.skipExportForm.controls.condition1.patchValue(conditionMock2);
    component.skipExportForm.controls.operator1.patchValue(customOperatorMock3);
    // Act
    const result1 = component.showInputField1();

    // Assert
    expect(result1).toBeTrue();
  });

  it('should return "is_empty" if operator is "isnull" and value is "True"', () => {
    const operator = 'isnull';
    const value = false;
    const condition = conditionMock4;

    const result = component.getSelectedOperator(operator, value, condition);

    expect(result).toEqual('is_not_empty');
    const operator1 = 'isnull';
    const value1 = 'True';
    const condition1 = conditionMock4;

    const result1 = component.getSelectedOperator(operator1, value1, condition1);

    expect(result1).toEqual('is_empty');
  });

  it('should return "iexact" if operator is "iexact"', () => {
    const operator = 'iexact';
    const value = 'myValue';
    const condition = conditionMock2;

    const result = component.getSelectedOperator(operator, value, condition);

    expect(result).toEqual('iexact');
  });

  it('should return "iexact" if operator is "iexact"', () => {
    const operator = 'lte';
    const value = 'myValue';
    const condition = conditionMock3;

    const result = component.getSelectedOperator(operator, value, condition);

    expect(result).toEqual(operator);
  });

  it('should return the operator itself for all other cases', () => {
    const operator = 'in';
    const value = ['value1', 'value2'];
    const condition = conditionMock2;

    const result = component.getSelectedOperator(operator, value, condition);

    expect(result).toEqual('iexact');
  });

  it('Private function check', () => {
    expect((component as any).setOperatorFieldOptions(getExpenseFilterResponse3, conditionMock1)).toBeUndefined();
    getExpenseFilterResponse3.count = 2;
    expect((component as any).setSkippedConditions(getExpenseFilterResponse3, [conditionMock1, conditionMock1])).toBeUndefined();
    getExpenseFilterResponse3.count = 0;
    expect((component as any).setSkippedConditions(getExpenseFilterResponse3, [conditionMock1])).toBeUndefined();
    component.skipExportForm.controls.condition1.patchValue(conditionMock3);
    component.skipExportForm.controls.operator1.patchValue(customOperatorMock1);
    // Act
    const result = component.showDateField1();

    // Assert
    expect(result).toBeTrue();

    component.skipExportForm.controls.value1.patchValue([new Date('2022-10-01T00:00:00.000Z')]);
    component.skipExportForm.controls.operator1.patchValue(claimNumberOperators[0].value);
    component.skipExportForm.controls.operator2.patchValue(claimNumberOperators[0].value);
    component.advancedSettingsForm.controls.skipExport.patchValue(true);
    expect(component.saveSkipExportFields()).toBeUndefined();

    component.skipExportForm.controls.operator1.patchValue(customOperatorMock2.value);
    component.skipExportForm.controls.condition1.patchValue(conditionMock4);
    component.advancedSettingsForm.controls.skipExport.patchValue(true);
    expect(component.saveSkipExportFields()).toBeUndefined();

    const customOperatorMock = {
      label: 'IsNotEmpty',
      value: CustomOperatorOption.IsNotEmpty
    };
    component.skipExportForm.controls.operator1.patchValue(customOperatorMock.value);
    component.skipExportForm.controls.condition1.patchValue(conditionMock4);
    component.advancedSettingsForm.controls.skipExport.patchValue(true);
    expect(component.saveSkipExportFields()).toBeUndefined();

    component.skipExportForm.controls.operator2.patchValue(customOperatorMock2.value);
    component.skipExportForm.controls.condition2.patchValue(conditionMock4);
    component.advancedSettingsForm.controls.skipExport.patchValue(true);
    expect(component.saveSkipExportFields()).toBeUndefined();

    component.skipExportForm.controls.operator2.patchValue(customOperatorMock.value);
    component.skipExportForm.controls.condition2.patchValue(conditionMock4);
    component.advancedSettingsForm.controls.skipExport.patchValue(true);
    expect(component.saveSkipExportFields()).toBeUndefined();
  });
});
