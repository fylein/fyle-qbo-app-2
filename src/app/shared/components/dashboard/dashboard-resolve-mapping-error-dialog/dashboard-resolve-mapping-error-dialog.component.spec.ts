import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardResolveMappingErrorDialogComponent } from './dashboard-resolve-mapping-error-dialog.component';
import { environment } from 'environment.localhost';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { ResolveMappingError } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping, QBOField } from 'src/app/core/models/enum/enum.model';

describe('DashboardResolveMappingErrorDialogComponent', () => {
  let component: DashboardResolveMappingErrorDialogComponent;
  let fixture: ComponentFixture<DashboardResolveMappingErrorDialogComponent>;
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  const model: ResolveMappingError = {
    sourceType: EmployeeFieldMapping.EMPLOYEE,
    destinationType: EmployeeFieldMapping.VENDOR,
    fyleAttributes: [],
    workspaceId: "string"
}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [MappingService,{
        // I was expecting this will pass the desired value
        provide: MAT_DIALOG_DATA,
        useValue: model
      },
      {
        // I was expecting this will pass the desired value
        provide: MatDialogRef,
        useValue: {}
      }],
      declarations: [ DashboardResolveMappingErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardResolveMappingErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
