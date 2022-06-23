import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeSettingsComponent } from './employee-settings.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoMapEmployee, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseState, ExportDateType, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';
import { EmployeeSettingGet } from 'src/app/core/models/configuration/employee-setting.model';
import { environment } from 'src/environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ExportSettingGet } from 'src/app/core/models/configuration/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { response, response1, response2 } from './employee-settings.fixture';
import { errorResponse } from '../qbo-connector/qbo-connector.fixture';

describe('EmployeeSettingsComponent', () => {
  let component: EmployeeSettingsComponent;
  let fixture: ComponentFixture<EmployeeSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let formBuilder: FormBuilder;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: any;
  let service1: any;
  let service2: any;
  let mappingService: MappingService;
  let exportSettingService: ExportSettingService;
  let employeeSettingService: EmployeeSettingService;
  let router: Router;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    service = {
      getDistinctQBODestinationAttributes: () => of(response2)
    };

    service1 = {
      getEmployeeSettings: () => of(response),
      postEmployeeSettings: () => of(response)
    };

    service2 = {
      getExportSettings: () => of(response1)
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatDialogModule, SharedModule],
      declarations: [EmployeeSettingsComponent],
      providers: [{ provide: Router, useValue: routerSpy },
      { provide: EmployeeSettingService, useValue: service1 }, FormBuilder,
      { provide: ExportSettingService, useValue: service2 },
      { provide: MappingService, useValue: service }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSettingsComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    mappingService = TestBed.inject(MappingService);
    employeeSettingService = TestBed.inject(EmployeeSettingService);
    exportSettingService = TestBed.inject(ExportSettingService);
    router = TestBed.inject(Router);
    const form = formBuilder.group({
      employeeMapping: ['EMPLOYEE'],
      autoMapEmployee: [true]
    });
    component.employeeSettingsForm = form;
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/realmId';
    spyOn(mappingService, 'getDistinctQBODestinationAttributes').and.callThrough();
    spyOn(employeeSettingService, 'getEmployeeSettings').and.callThrough();
    spyOn(exportSettingService, 'getExportSettings').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(mappingService.getDistinctQBODestinationAttributes).toHaveBeenCalled();
    expect(employeeSettingService.getEmployeeSettings).toHaveBeenCalled();
    expect(exportSettingService.getExportSettings).toHaveBeenCalled();
  });

  it('Navigate function check', () => {
    component.navigateToPreviousStep();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/qbo_connector']);
  });

  it('Save function check', () => {
    spyOn(employeeSettingService, 'postEmployeeSettings').and.callThrough();
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.isOnboarding = true;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(employeeSettingService.postEmployeeSettings).toHaveBeenCalled();
  });

  it('Save function check', () => {
    spyOn(employeeSettingService, 'postEmployeeSettings').and.callThrough();
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = undefined;
    component.isOnboarding = true;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(employeeSettingService.postEmployeeSettings).toHaveBeenCalled();
  });

  it('Save function check', () => {
    spyOn(employeeSettingService, 'postEmployeeSettings').and.returnValue(throwError(errorResponse));
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = undefined;
    component.isOnboarding = true;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(employeeSettingService.postEmployeeSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('Save function check', () => {
    spyOn(employeeSettingService, 'postEmployeeSettings').and.callThrough();
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = undefined;
    component.isOnboarding = false;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(employeeSettingService.postEmployeeSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('Save function check', () => {
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.VENDOR;
    component.isOnboarding = false;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
  });
});
