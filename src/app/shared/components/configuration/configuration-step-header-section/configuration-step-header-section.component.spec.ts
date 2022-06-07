import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationStepHeaderSectionComponent } from './configuration-step-header-section.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { OnboardingState } from 'src/app/core/models/enum/enum.model';

describe('ConfigurationStepHeaderSectionComponent', () => {
  let component: ConfigurationStepHeaderSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderSectionComponent>;
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let router: Router;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [ ConfigurationStepHeaderSectionComponent],
      providers: [ WorkspaceService, {
        provide: Router,
        useValue: {
           url: '/path'
        }
     }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ConfigurationStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshQBODimensions() function check', () => {
    expect(component.refreshQBODimensions()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/refresh_dimensions/`
    });
  req.flush({});
  });

  it('setupContent function with router url as realmid check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/realmId';
    component.ngOnInit();
    expect(component.headerText).toEqual('Connect to Quickbooks Online');
    expect(component.contentText).toEqual('Connect to the Quickbooks Online Company from which you would like to import and export data. The Fyle org and Quickbooks Online company cannot be changed once the configuration steps are complete.');
  });

  it('setupContent function with router url as employee_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/employee_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Map Employees');
    expect(component.contentText).toEqual('Choose appropriate representation of your Employees in Quickbooks Online.');
  });

  it('setupContent function with router url as export_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/export_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Export Settings');
    expect(component.contentText).toEqual('In this section, you will configure how and when expenses from Fyle can be exported to Quickbooks Online.');
  });

  it('setupContent function with router url as import_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/import_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Import Settings');
    expect(component.contentText).toEqual('You can Enable all the data that you wish to import from Quickbooks Online. All the imported data from Quickbooks Online would be available in Fyle under Admin Setting > Organization.');
  });

  it('setupContent function with router url as advanced_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/advanced_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Advanced Settings');
    expect(component.isStepOptional).toBeTrue();
    expect(component.contentText).toEqual('This section contains settings to automate and customize your expense export.');
  });
});
