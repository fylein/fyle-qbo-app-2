import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { adminEmails, advancedSettingResponse, destinationAttribute, emailResponse, errorResponse, getadvancedSettingResponse, getadvancedSettingResponse2, memo, previewResponse, response } from './advanced-settings.fixture';
import { Router } from '@angular/router';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OnboardingState, PaymentSyncDirection } from 'src/app/core/models/enum/enum.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

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
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  let dialogSpy1: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    service1 = {
      postAdvancedSettings: () => of(advancedSettingResponse),
      getAdvancedSettings: () => of(getadvancedSettingResponse)
    };

    service2 = {
      getQBODestinationAttributes: () => of(destinationAttribute)
    };

    service3 = {
      getWorkspaceGeneralSettings: () => of(response),
      getOnboardingState: () => 'ADVANCED_CONFIGURATION',
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId,
      getScheduleSettings: () => of(emailResponse),
      getWorkspaceAdmins: () => of(adminEmails)
    };
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ AdvancedSettingsComponent ],
      providers: [ FormBuilder,
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
    formbuilder = TestBed.inject(FormBuilder);
    component.workspaceGeneralSettings = response;
    component.advancedSettings = getadvancedSettingResponse;
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });
    component.advancedSettingsForm = form;
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

  it('showPaymentSyncField function check', () => {
    expect(component.showPaymentSyncField()).toBeTrue();
  });

  it('showSingleCreditLineJEField function check', () => {
    expect(component.showSingleCreditLineJEField()).toBeTrue();
  });

  it('showAutoCreateVendorsField function check', () => {
    expect(component.showAutoCreateVendorsField()).toBeTrue();
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

  it('formatememopreview function check', () => {
    component.memoStructure = memo;
    fixture.detectChanges();
    (component as any).formatMemoPreview();
    expect(component.memoPreviewText.length).toEqual(previewResponse.length);
  });

  it('Save Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_QBO],
      billPaymentAccount: [component.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [component.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.isOnboarding = true;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(workspace, 'setOnboardingState').and.callThrough();
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
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
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
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [component.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      emails: [emailResponse.emails_selected]
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.isOnboarding = false;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.returnValue(throwError(errorResponse));
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('createPaymentSyncWatcher function check', () => {
    component.advancedSettingsForm.controls.paymentSync.patchValue(PaymentSyncDirection.FYLE_TO_QBO);
    expect((component as any).createPaymentSyncWatcher()).toBeUndefined();
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
    component.advancedSettingsForm.controls.memoStructure.patchValue(['Integration']);
    expect((component as any).createMemoStructureWatcher()).toBeUndefined();
  });

  it('drop function chek', () => {
    component.defaultMemoFields = memo;
    const button = fixture.debugElement.query(By.css('.advanced-settings--memo-preview-select'));
    const final = button.children[0].children[0].children[0].nativeElement;
    let event = final.click();
    event = {
      previousIndex: 0,
      currentIndex: 1
    };
    fixture.detectChanges();
    expect(component.drop(event)).toBeUndefined();
  });

  it('openAddemailDialog function check', () => {
    expect(component.openAddemailDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy1).toHaveBeenCalled();
  });
});
