import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { WorkspaceService } from './workspace.service';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
      JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(WorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWorkspaceid service', () => {
    const id = service.getWorkspaceId()
    const org = "1"
    expect(id.toString()).toEqual(org)
  });

  it('createWorkspace service', () => {
    expect(service.createWorkspace()).toBeTruthy()
  });

  it('getWorkspace details service', () => {
    service.getWorkspaces('1').subscribe((value) => console.log("sqa",value))
    expect(service.getWorkspaces('1')).toBeTruthy()
  });

  it('WorkspacegeneralSetting service', () => {
    service.getWorkspaceGeneralSettings().subscribe((value) => console.log("sqqa",value))
    expect(service.getWorkspaceGeneralSettings()).toBeTruthy()
  });

  it('syncFyleDimensions service', () => {
    expect(service.syncFyleDimensions()).toBeTruthy()
  });
  
  it('syncQBODimensions service', () => {
    expect(service.syncQBODimensions()).toBeTruthy()
  });

  it('refreshFyleDimensions service', () => {
    expect(service.refreshFyleDimensions()).toBeTruthy()
  });

  it('refreshQBODimensions service', () => {
    expect(service.refreshQBODimensions()).toBeTruthy()
  });
});
