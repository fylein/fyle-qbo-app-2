import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeFieldMapping, QBOField, SearchType, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SimpleTextSearchComponent } from './simple-text-search.component';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { destinationAttribute } from '../../mapping/mapping-table/mapping-table.fixture';
import { of } from 'rxjs';
import { qboData } from 'src/app/integration/main/mapping/employee-mapping/employee-mapping.fixture';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SimpleTextSearchComponent', () => {
  let component: SimpleTextSearchComponent;
  let fixture: ComponentFixture<SimpleTextSearchComponent>;
  let service: any;
  let mappingService: MappingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, SharedModule, HttpClientTestingModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [ SimpleTextSearchComponent ],
      providers: [TrackingService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextSearchComponent);
    component = fixture.componentInstance;
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl(['come']),
      end: new UntypedFormControl(['12/2/2021'])
    });
    component.destinationType = EmployeeFieldMapping.EMPLOYEE;
    component.page = SimpleSearchPage.EXPORT_LOG;
    component.searchType = SimpleSearchType.TEXT_FIELD;
    component.form = form;
    component.placeholder = 'Search by Employee Name or Reference ID';
    mappingService = TestBed.inject(MappingService);
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
    component.searchType = SimpleSearchType.SELECT_FIELD;
    component.page = SimpleSearchPage.MAPPING;
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl(['ome']),
      end: new UntypedFormControl(['12/2/2021'])
    });
    component.ngOnInit();
    fixture.detectChanges();
    component.ngOnChanges({
      form: new SimpleChange(null, form.controls.searchOption.setValue('derrr'), true)
    });
    fixture.detectChanges();
    expect((component as any).simpleSearchEventRecorded).toBeFalse();
  });

  it('clearText function search option check', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl(['co']),
      end: new UntypedFormControl(['12/2/2021'])
    });
    component.form = form;
    component.page = SimpleSearchPage.MAPPING;
    component.searchType = SimpleSearchType.SELECT_FIELD;
    spyOn(component.searchResult, 'emit');
    fixture.detectChanges();
    expect(component.clearText()).toBeUndefined();
    expect(component.searchResult.emit).toHaveBeenCalled();
  });

  it('keypress function check', () => {
    component.advancedSearchType = SearchType.SELECT_FIELD;
    component.page = SimpleSearchPage.MAPPING;
    fixture.detectChanges();
    expect(component.keypress()).toBeUndefined();
    expect(component.isSearchInProgress).toBeTrue();
    component.advancedSearchType = SearchType.TEXT_FIELD;
    component.page = SimpleSearchPage.MAPPING;
    fixture.detectChanges();
    expect(component.keypress()).toBeUndefined();
    expect(component.isSearchInProgress).toBeFalse();
  });
});
