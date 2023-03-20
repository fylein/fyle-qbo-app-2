import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardQboErrorDialogComponent } from './dashboard-qbo-error-dialog.component';
import { modelData, modelData1 } from './dashboard-qbo-error-dialog.fixture';

describe('DashboardQboErrorDialogComponent', () => {
  let component: DashboardQboErrorDialogComponent;
  let fixture: ComponentFixture<DashboardQboErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardQboErrorDialogComponent ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        SharedModule, HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        UserService,
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: modelData
        },
        {
          // I was expecting this will pass the desired value
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    fixture = TestBed.createComponent(DashboardQboErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setup function', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpSubHeader = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toBe(modelData.error_title);
    expect(popUpSubHeader.innerText).toBe(modelData.error_detail);
  }));

  it('setup function', fakeAsync(() => {
    component.data = modelData1;
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpSubHeader = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toBe(modelData.error_title);
    expect(popUpSubHeader.innerText).toBe(modelData.error_detail);
  }));
});
