import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { PreviewPage } from 'src/app/core/models/misc/preview-page.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewDialogComponent } from './preview-dialog.component';

describe('PreviewDialogComponent', () => {
  let component: PreviewDialogComponent;
  let fixture: ComponentFixture<PreviewDialogComponent>;
  const preview: PreviewPage = {
    fyleExpense: true,
    qboReimburse: ReimbursableExpensesObject.BILL ,
    qboCCC: CorporateCreditCardExpensesObject.BILL
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule,MatDialogModule],
      declarations: [ PreviewDialogComponent ],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: preview
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reimbursableExpence HTML', () => {
    component.CorporateCreditCardExpensesObject = CorporateCreditCardExpensesObject;
    component.ReimbursableExpensesObject = ReimbursableExpensesObject;
    fixture.detectChanges();
    const previewTitle = fixture.debugElement.query(By.css('h3')).nativeElement.innerText;
    const previewImg = fixture.debugElement.queryAll(By.css('div'));
    expect(previewTitle).toBe('Preview');
    expect(previewImg[1].children[0].nativeElement.clientHeight).toBeGreaterThanOrEqual(600);
    expect(previewImg[1].children[0].nativeElement.clientWidth).toBeGreaterThanOrEqual(500);
    expect(previewImg[1].children[1].nativeElement.clientHeight).toBeGreaterThanOrEqual(400);
    expect(previewImg[1].children[1].nativeElement.clientWidth).toBeGreaterThanOrEqual(900);
    expect(previewImg[1].children[2].nativeElement.clientHeight).toBeGreaterThanOrEqual(400);
    expect(previewImg[1].children[2].nativeElement.clientWidth).toBeGreaterThanOrEqual(900);
  });
});
