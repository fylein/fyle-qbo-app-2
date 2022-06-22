import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header.component';
import { TrimCharacterPipe } from '../../../pipes/trim-character.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let workspace: WorkspaceService;
  let qboConnectorService: QboConnectorService;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    const localStorageDump = {
      email: 'fyle@fyle.in',
      access_token: 'kkk',
      refresh_token: 'uuuu',
      employee_email: 'fyle@fyle.in',
      full_name: 'Fyle Integration',
      user_id: '12',
      org_id: '12',
      org_name: 'Fyle Integration'
    };
    localStorage.setItem('user', JSON.stringify(localStorageDump));
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, MatDialogModule, HttpClientTestingModule],
      declarations: [HeaderComponent, TrimCharacterPipe],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //Error: Expected one matching request for criteria "Match method: GET, URL: http://localhost:8002/api/workspaces/2/credentials/qbo/", found none
  xit('should create', () => {
    expect(component).toBeTruthy();
    const response: QBOCredentials = {
      company_name: "Sandbox Company_FAE",
      country: "GB",
      created_at: new Date("2021-10-05T11:56:13.883015Z"),
      id: 219,
      is_expired: false,
      realm_id: "123146326950399",
      refresh_token: "AB",
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
  });

  xit('component failure response', () => {
    expect(component).toBeTruthy();
    const response = { status: 404, statusText: "Not Found", error: { id: 2, company_name: 'QBO' } };
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush('', response);
  });

  it('navigate function check', () => {
    expect(component.navigateBack()).toBeUndefined();
  });

  it('showOrHideProfileDropdown function check', () => {
    component.isProfileExpanded = true;
    fixture.detectChanges();
    component.showOrHideProfileDropdown();
    fixture.detectChanges();
    expect(component.isProfileExpanded).toBeFalse();

    component.isProfileExpanded = false;
    fixture.detectChanges();
    component.showOrHideProfileDropdown();
    fixture.detectChanges();
    expect(component.isProfileExpanded).toBeTrue();
  });

  it('showOrHideProfileDropdown function check', () => {
    component.isHelpSectionExpanded = true;
    fixture.detectChanges();
    component.showOrHideHelpDropdown();
    fixture.detectChanges();
    expect(component.isHelpSectionExpanded).toBeFalse();

    component.isHelpSectionExpanded = false;
    fixture.detectChanges();
    component.showOrHideHelpDropdown();
    fixture.detectChanges();
    expect(component.isHelpSectionExpanded).toBeTrue();
  });
});
