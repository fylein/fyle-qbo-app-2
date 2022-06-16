import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SimpleTextSearchComponent } from './simple-text-search.component';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SimpleTextSearchComponent', () => {
  let component: SimpleTextSearchComponent;
  let fixture: ComponentFixture<SimpleTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ SimpleTextSearchComponent ],
      providers: [TrackingService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextSearchComponent);
    component = fixture.componentInstance;
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    component.page = SimpleSearchPage.EXPORT_LOG;
    component.searchType = SimpleSearchType.TEXT_FIELD;
    component.form = form;
    component.placeholder = 'Search by Employee Name or Reference ID';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form clear function check', () => {
    component.clearText();
    expect(component.form.value.searchOption).toBeNull();
  });

  it('search function check', () => {
    component.ngOnInit();
    fixture.detectChanges();
    component.ngOnChanges({
      form: new SimpleChange(null, component.form, true)
    });
    fixture.detectChanges();
    const placeholder = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(placeholder.placeholder).toEqual(component.placeholder);
    component.ngOnChanges({
      placeholder: new SimpleChange(null, 'fyle', true)
    });
    fixture.detectChanges();
    const placeholder2 = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(placeholder2.placeholder).toEqual(component.placeholder);
  });

  it('search function check', () => {
    component.ngOnChanges({
      placeholder: new SimpleChange(null, 'fyle', true)
    });
    fixture.detectChanges();
    const placeholder2 = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(placeholder2.placeholder).toEqual(component.placeholder);
  });
});
