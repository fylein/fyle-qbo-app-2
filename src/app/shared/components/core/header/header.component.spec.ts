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
      imports: [RouterTestingModule, HttpClientModule, SharedModule, MatDialogModule, HttpClientTestingModule],
      declarations: [HeaderComponent, TrimCharacterPipe],
      providers: [AuthService, HelperService, StorageService, TrackingService, WindowService, UserService, WorkspaceService, QboConnectorService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    workspace = injector.inject(WorkspaceService);
    qboConnectorService = injector.inject(QboConnectorService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('get active page name', () => {
    expect((component as any).getActivePageName('/workspaces/main/dashboard')).toBe('Dashboard');
    expect((component as any).getActivePageName('/workspaces/main/export_log')).toBe('Export Log');
    expect((component as any).getActivePageName('/workspaces/main/mapping/project')).toBe('project mapping');
    expect((component as any).getActivePageName('/workspaces/main/configuration/employee_settings')).toBe('Map Employees');
    expect((component as any).getActivePageName('/workspaces/main/configuration/export_settings')).toBe('Export Settings');
    expect((component as any).getActivePageName('/workspaces/main/configuration/import_settings')).toBe('Import Settings');
    expect((component as any).getActivePageName('/workspaces/main/configuration/advanced_settings')).toBe('Advanced Settings');
    expect((component as any).getActivePageName('/workspaces/onboarding/advanced_settings')).toBe('');
    expect((component as any).getActivePageName('/')).toBe('Dashboard');
  });
});
