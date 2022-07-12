import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { emailResponse } from '../advanced-settings.fixture';
import { AddEmailDialogComponent } from './add-email-dialog.component';

describe('AddEmailDialogComponent', () => {
  let component: AddEmailDialogComponent;
  let fixture: ComponentFixture<AddEmailDialogComponent>;
  let qboService: QboConnectorService;
  let formBuilder: FormBuilder;
  const dialogMock = {
    close: () => of({ workspaceId: 1,
      hours: 1,
      schedulEnabled: false,
      selectedEmails: ['fyle@fyle.in']}),
    afterClosed: () => of({ workspaceId: 1,
      hours: 1,
      schedulEnabled: false,
      selectedEmails: ['fyle@fyle.in']})
  };
  beforeEach(async(() => {
    const service1 = {
      postScheduleSettings: () => of(emailResponse)
    };
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, HttpClientTestingModule ],
      declarations: [ AddEmailDialogComponent ],
      providers: [ FormBuilder,
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            width: '551px',
            data: {
              workspaceId: 1,
              hours: 1,
              schedulEnabled: false,
              selectedEmails: ['fyle@fyle.in']
            }
          }
        },
        { provide: QboConnectorService, useValue: service1}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailDialogComponent);
    component = fixture.componentInstance;
    qboService = TestBed.inject(QboConnectorService);
    formBuilder = TestBed.inject(FormBuilder);
    component.form = formBuilder.group({
      name: 'Fyle',
      email: 'category@fyle.in'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Submit function check', () => {
    spyOn(qboService, 'postScheduleSettings').and.callThrough();
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    expect(component.submit()).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.postScheduleSettings).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('Submit function check', () => {
    component.data = {
      workspaceId: 1,
      hours: 1,
      schedulEnabled: false,
      selectedEmails: []
    };
    spyOn(qboService, 'postScheduleSettings').and.callThrough();
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    expect(component.submit()).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.postScheduleSettings).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
