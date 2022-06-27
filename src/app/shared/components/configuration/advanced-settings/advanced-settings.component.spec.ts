import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { advancedSettingResponse, destinationAttribute, getadvancedSettingResponse, getadvancedSettingResponse2, previewResponse, response } from './advanced-settings.fixture';
import { Router } from '@angular/router';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      getOnboardingState: () => 'COMPLETE',
      setOnboardingState: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ AdvancedSettingsComponent ],
      providers: [
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
    component.workspaceGeneralSettings = response;
    component.advancedSettings = getadvancedSettingResponse;
    router = TestBed.inject(Router);
    advancedSettingService = TestBed.inject(AdvancedSettingService);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
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
    component.memoStructure = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    fixture.detectChanges();
    (component as any).formatMemoPreview();
    expect(component.memoPreviewText).toEqual(previewResponse);
  });
});
