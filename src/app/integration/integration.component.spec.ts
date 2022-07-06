import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IntegrationComponent } from './integration.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import { of, throwError } from 'rxjs';
import { errorResponse, workspaceResponse } from './integration.fixture';

describe('IntegrationComponent', () => {
  let component: IntegrationComponent;
  let fixture: ComponentFixture<IntegrationComponent>;
  let workspace: WorkspaceService;
  beforeEach(async () => {
    const localStorageDump = {
      email: 'fyle@fyle.in',
      org_id: '2'
    };
    localStorage.setItem('user', JSON.stringify(localStorageDump));
    const service1 = {
      getWorkspaces: () => of(workspaceResponse),
      createWorkspace: () => of(workspaceResponse),
      syncFyleDimensions: () => of({}),
      syncQBODimensions: () => of({})
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule],
      declarations: [ IntegrationComponent ],
      providers: [
        { provide: WorkspaceService, useValue: service1 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationComponent);
    component = fixture.componentInstance;
    workspace = TestBed.inject(WorkspaceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnIng function check', async () => {
    spyOn(workspace, 'getWorkspaces').and.returnValue(await Promise.resolve(of([])));
    spyOn(workspace, 'createWorkspace').and.returnValue(await Promise.resolve(of(workspaceResponse[0])));
    expect(await (component as any).getOrCreateWorkspace()).toBeTruthy();
  });
});
