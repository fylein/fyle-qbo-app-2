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
      providers: [ WorkspaceService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConfigurationStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshQBODimensions() function check', () => {
    // SpyOn(component, 'refreshQBODimensions').and.callThrough()
    // Component.refreshQBODimensions()
    const responseKeys = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      fyle_currency: "ING",
      qbo_realm_id: "",
      cluster_domain: "",
      onboarding_state: OnboardingState.CONNECTION,
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    expect(component.refreshQBODimensions()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/refresh_dimensions/`
    });
  req.flush(responseKeys);
  });

});
