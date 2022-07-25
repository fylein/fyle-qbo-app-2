import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportSettingsComponent } from './import-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { chartOfAccountTypesList, errorResponse, destinationAttribute, expenseFieldresponse, getImportsettingResponse, postImportsettingresponse, QBOCredentialsResponse, qboField } from './import-settings.fixture';
import { MappingDestinationField, OnboardingState } from 'src/app/core/models/enum/enum.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ImportSettingsComponent', () => {
  let component: ImportSettingsComponent;
  let fixture: ComponentFixture<ImportSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let formbuilder: FormBuilder;
  let importSettingService: ImportSettingService;
  let workspace: WorkspaceService;
  let qboConnectorService: QboConnectorService;
  let mappingService: MappingService;
  let service1: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({source_field: MappingDestinationField.TAX_CODE,
    destination_field: MappingDestinationField.CLASS,
    import_to_fyle: true,
    name: MappingDestinationField.TAX_CODE,
    disable_import_to_fyle: true,
    source_placeholder: 'close'}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    service1 = {
      getImportSettings: () => of(getImportsettingResponse),
      postImportSettings: () => of(postImportsettingresponse)
    };
    service2 = {
      getFyleExpenseFields: () => of(expenseFieldresponse),
      getQBODestinationAttributes: () => of(destinationAttribute),
      refreshMappingPages: () => undefined
    };
    service3 = {
      getOnboardingState: () => 'IMPORT_SETTINGS',
      setOnboardingState: () => undefined
    };
    service4 = {
      getQBOCredentials: () => of(QBOCredentialsResponse)
    };
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, NoopAnimationsModule, RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, SharedModule],
      declarations: [ ImportSettingsComponent ],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ImportSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 },
        { provide: QboConnectorService, useValue: service4 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSettingsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formbuilder = TestBed.inject(FormBuilder);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    importSettingService = TestBed.inject(ImportSettingService);
    qboConnectorService = TestBed.inject(QboConnectorService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.importSettings = getImportsettingResponse;
    component.chartOfAccountTypesList = chartOfAccountTypesList;
    component.qboExpenseFields = qboField;
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => component.createChartOfAccountField(type));
    const expenseFieldsFormArray = component.qboExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, null],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      importVendorsAsMerchants: [component.importSettings.workspace_general_settings.import_vendors_as_merchants]
    });
    component.fyleExpenseFields = expenseFieldresponse.map(field => field.attribute_type);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnigit function check', () => {
    spyOn(importSettingService, 'getImportSettings').and.callThrough();
    spyOn(mappingService, 'getFyleExpenseFields').and.callThrough();
    spyOn(mappingService, 'getQBODestinationAttributes').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.getImportSettings).toHaveBeenCalled();
    expect(mappingService.getFyleExpenseFields).toHaveBeenCalled();
    expect(mappingService.getQBODestinationAttributes).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('navigateToPreviousStep function check', () => {
    expect(component.navigateToPreviousStep()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/export_settings']);
  });

  it('createExpenceField function check', () => {
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => component.createChartOfAccountField(type));
    const expenseFieldsFormArray = component.qboExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, null],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      importVendorsAsMerchants: [component.importSettings.workspace_general_settings.import_vendors_as_merchants]
    });
    expect(component.createExpenseField(MappingDestinationField.CLASS)).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('Save function check', () => {
    component.saveInProgress=false;
    component.isOnboarding = true;
    spyOn(importSettingService, 'postImportSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(workspace, 'setOnboardingState').and.callThrough();
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(workspace.setOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/advanced_settings']);
  });

  it('Save function else check', () => {
    component.saveInProgress=false;
    component.isOnboarding = false;
    spyOn(importSettingService, 'postImportSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
  });

  it('Save function Failure check', () => {
    component.saveInProgress=false;
    component.isOnboarding = false;
    spyOn(importSettingService, 'postImportSettings').and.returnValue(throwError(errorResponse));
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('showFyleExpenseFormPreview function check', () => {
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => component.createChartOfAccountField(type));
    const expenseFieldsFormArray = component.qboExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, null],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      importVendorsAsMerchants: [component.importSettings.workspace_general_settings.import_vendors_as_merchants]
    });
    expect(component.showFyleExpenseFormPreview()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('createTaxCodeWatcher function check', () => {
    component.importSettingsForm.controls.taxCode.patchValue(true);
    expect((component as any).createTaxCodeWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.importSettingsForm.controls.taxCode.patchValue(false);
    expect((component as any).createTaxCodeWatcher()).toBeUndefined();
  });

  it('chartOfAccountTypes function check', () => {
    const response = component.importSettingsForm.get('chartOfAccountTypes') as FormArray;
    expect(component.chartOfAccountTypes).toEqual(response);
  });
});
