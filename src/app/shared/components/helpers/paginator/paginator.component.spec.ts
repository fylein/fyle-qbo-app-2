import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PaginatorComponent } from './paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let formBuilder: FormBuilder;
  let form:any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatSelectModule],
      declarations: [ PaginatorComponent ],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.page = PaginatorPage.EXPORT_LOG;
    component.limit = 10;
    component.offset = 2;
    component. totalCount = 10;
    component.totalPageCount = 10;
    form = formBuilder.group({
      pageLimit: [component.limit],
      offset: [component.offset],
      page: [1]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onpageChangeHadler function with CHANGE check', () => {
    spyOn(component.pageChangeEvent, 'emit');
    const funreturn = component.onPageChangeHandler('CHANGE');
    expect(funreturn).toBeFalse();
    component.form = form;
    fixture.detectChanges();
    const funreturn1 = component.onPageChangeHandler('CHANGE');
    expect(funreturn1).toBeUndefined();
    expect(component.pageChangeEvent.emit).toHaveBeenCalled();
  });

  it('onpageChangeHadler function with CHANGE false check', () => {
    component.form = form;
    component.form.controls.page.patchValue(0);
    fixture.detectChanges();
    const funreturn = component.onPageChangeHandler('CHANGE');
    expect(funreturn).toBeFalse();
  });

  it('onpageChangeHadler function with FORWARD check', () => {
    component.form = form;
    fixture.detectChanges();
    const funreturn = component.onPageChangeHandler('FORWARD');
    expect(funreturn).toBeFalse();
  });

  it('onpageChangeHadler function with FORWARD check', () => {
    component.form = form;
    component.form.controls.page.patchValue(7);
    component.totalPageCount = 10;
    fixture.detectChanges();
    const funreturn = component.onPageChangeHandler('FORWARD');
    expect(funreturn).toBeFalse();
    expect(component.form.controls.offset.value).toBeGreaterThanOrEqual(12);
    expect(component.form.controls.page.value).toBeGreaterThanOrEqual(8);
  });

  it('onP', () => {
    spyOn(component.pageChangeEvent, 'emit');
    const funreturn = component.onPageChangeHandler('BACKWARD');
    expect(funreturn).toBeFalse();
    component.form = form;
    fixture.detectChanges();
    const funreturn2 = component.onPageChangeHandler('BACKWARD');
    expect(component.form.get('offset')?.value).toBeGreaterThanOrEqual(2);
    expect(component.form.get('page')?.value).toBeGreaterThanOrEqual(0);
    expect(component.pageChangeEvent.emit).toHaveBeenCalled();
  });

  it('ngOnchange function check', () => {
    expect(component.ngOnChanges()).toBeUndefined();
  });

  it('onPageSizeChangeWatcher function check', () => {
    component.form = form;
    fixture.detectChanges();
    expect((component as any).onPageSizeChangeWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.pageLimit.patchValue(11);
    expect((component as any).onPageSizeChangeWatcher()).toBeUndefined();
  });
});
