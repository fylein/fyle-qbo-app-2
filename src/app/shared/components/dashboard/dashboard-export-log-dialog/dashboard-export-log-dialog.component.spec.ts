import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ExportState } from 'src/app/core/models/enum/enum.model';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardExportLogDialogComponent } from './dashboard-export-log-dialog.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { of } from 'rxjs';

describe('DashboardExportLogDialogComponent', () => {
  let component: DashboardExportLogDialogComponent;
  let fixture: ComponentFixture<DashboardExportLogDialogComponent>;
  let service: any;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    const serviceSpy = jasmine.createSpyObj('ExportLogService', ['getExpenseGroups', 'generateExportTypeAndId', 'getReferenceType', 'generateFyleUrl']);
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule, HttpClientTestingModule],
      declarations: [ DashboardExportLogDialogComponent ],
      providers: [{
        // I was expecting this will pass the desired value
        provide: MAT_DIALOG_DATA,
        useValue: {
          exportState: ExportState, lastExportedAt: new Date()
        }
      },
      {
        // I was expecting this will pass the desired value
        provide: MatDialogRef,
        useValue: {}
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = TestBed.get(ExportLogService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardExportLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
