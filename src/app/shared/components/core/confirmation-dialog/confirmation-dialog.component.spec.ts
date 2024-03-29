import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ConfirmationDialogComponent', () => {
  const model: ConfirmationDialog = {
    title: 'FYLE',
    primaryCtaText: 'FYLE',
    contents: 'Added successfully',
    hideSecondaryCTA: false
  };
  const model1: ConfirmationDialog = {
    title: 'FYLE',
    primaryCtaText: 'FYLE',
    contents: 'Added successfully',
    hideSecondaryCTA: true
  };
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [
        MatButtonModule,
        MatDialogModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: model
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
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when close button clicked', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpContent = document.getElementsByTagName('p')[1] as HTMLParagraphElement;
    const popUpPrimary = document.getElementsByTagName('h5')[1] as HTMLHeadElement;
    const popUpCancel = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toEqual(model.title);
    expect(popUpContent.innerText).toEqual(model.contents);
    expect(popUpPrimary.innerText).toEqual(model.primaryCtaText);
    expect(popUpCancel.innerText).toEqual('Cancel');
  }));

  it('should close dialog when close button clicked', fakeAsync(() => {
    component.data = model1;
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpContent = document.getElementsByTagName('p')[1] as HTMLParagraphElement;
    const popUpPrimary = document.getElementsByTagName('h5')[1] as HTMLHeadElement;
    const popUpCancel = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toEqual(model.title);
    expect(popUpContent.innerText).toEqual(model.contents);
    expect(popUpCancel.innerText).toEqual('FYLE');
  }));
});
