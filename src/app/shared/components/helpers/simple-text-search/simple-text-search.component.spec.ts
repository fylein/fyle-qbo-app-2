import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeFieldMapping, QBOField, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
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
    service = {
      getSearchedQBODestinationAttributes: () => of(destinationAttribute),
      getQBOEmployees: () => of(qboData),
      getQBOVendors: () => of(qboData)
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, SharedModule, HttpClientTestingModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [ SimpleTextSearchComponent ],
      providers: [TrackingService,
        { provide: MappingService, useValue: service }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextSearchComponent);
    component = fixture.componentInstance;
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl(['come']),
      end: new FormControl(['12/2/2021'])
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
    component.ngOnChanges({
      placeholder: new SimpleChange(null, 'fyle', true)
    });
    fixture.detectChanges();
    const placeholder2 = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(placeholder2.placeholder).toEqual(component.placeholder);
  });

  it('clearText function search option check', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl(['co']),
      end: new FormControl(['12/2/2021'])
    });
    component.form = form;
    component.page = SimpleSearchPage.MAPPING;
    component.destinationType = EmployeeFieldMapping.VENDOR;
    spyOn(component.searchResult, 'emit');
    fixture.detectChanges();
    expect(component.clearText()).toBeUndefined();
    expect(component.searchResult.emit).toHaveBeenCalled();
  });

  it('clearText function search option check', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl(['co']),
      end: new FormControl(['12/2/2021'])
    });
    component.form = form;
    component.page = SimpleSearchPage.MAPPING;
    component.destinationType = QBOField.ACCOUNT;
    spyOn(component.searchResult, 'emit');
    fixture.detectChanges();
    expect(component.clearText()).toBeUndefined();
    expect(component.searchResult.emit).toHaveBeenCalled();
    component.destinationType = undefined;
    fixture.detectChanges();
    expect(component.clearText()).toBeUndefined();
    expect(component.searchResult.emit).toHaveBeenCalled();
  });

  it('keypress function check', () => {
    expect(component.keypress()).toBeUndefined();
    expect(component.loading).toBeTrue();
  });
});
