import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { AutoMapEmployee } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

import { MappingHeaderSectionComponent } from './mapping-header-section.component';

describe('MappingHeaderSectionComponent', () => {
  let component: MappingHeaderSectionComponent;
  let fixture: ComponentFixture<MappingHeaderSectionComponent>;
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule, HttpClientTestingModule, MatSnackBarModule, SharedModule, RouterTestingModule, MatSnackBarModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [MappingHeaderSectionComponent],
      providers: [MappingService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(MappingHeaderSectionComponent);
    component = fixture.componentInstance;
    component.mappingStats = {
      all_attributes_count: 2,
      unmapped_attributes_count: 3
    };
    component.totalCardActive = true;
    component.sourceType = 'category';
    component.autoMapEmployee = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('switchView function check', () => {
    component.totalCardActive = true;
    fixture.detectChanges();
    spyOn(component.mappingCardUpdateHandler, 'emit');
    const button = fixture.nativeElement.querySelector('.mapping-header-section--card-active');
    button.click();
    fixture.detectChanges();
    expect(component.mappingCardUpdateHandler.emit).toHaveBeenCalledWith(component.totalCardActive);
  });

  it('switchView function check', () => {
    component.switchView();
    fixture.detectChanges();
    spyOn(component.mappingCardUpdateHandler, 'emit');
    const button = fixture.nativeElement.querySelector('.mapping-header-section--card-active');
    button.click();
    fixture.detectChanges();
    expect(component.mappingCardUpdateHandler.emit).toHaveBeenCalledWith(component.totalCardActive);
  });

  it('trigger function check', () => {
    expect(component.triggerAutoMapEmployee()).toBeUndefined();
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/auto_map_employees/trigger/`
    });
    req.flush({});
  });

  it('Source type and totalCardActive is true check', () => {
    const mapping: MappingStats = {
      all_attributes_count: 2,
      unmapped_attributes_count: 3
    };
    component.totalCardActive = true;
    component.sourceType = 'category';
    component.mappingStats = mapping;
    fixture.detectChanges();
    const sourceType = fixture.debugElement.query(By.css('h5')).nativeElement.innerText;
    expect(sourceType).toBe('Total Categories');
    const countoAtt = fixture.debugElement.query(By.css('span')).nativeElement.innerText;
    expect(countoAtt).toBeGreaterThanOrEqual(mapping.all_attributes_count);
  });

  it('Source type and totalCardActive is false check', () => {
    const mapping: MappingStats = {
      all_attributes_count: 2,
      unmapped_attributes_count: 3
    };
    component.totalCardActive = false;
    component.sourceType = 'empoyee';
    component.mappingStats = mapping;
    fixture.detectChanges();
    const sourceType = fixture.debugElement.queryAll(By.css('h5'))[1].nativeElement.innerText;
    expect(sourceType).toBe('Unmapped Empoyees');
    const countoAtt = fixture.debugElement.queryAll(By.css('span'))[1].nativeElement.innerText;
    expect(countoAtt).toBeGreaterThanOrEqual(mapping.unmapped_attributes_count);
  });

  it('AutoMap empoyee check', () => {
    component.autoMapEmployee = AutoMapEmployee.NAME;
    fixture.detectChanges();
    const autoMapEmployee = fixture.debugElement.queryAll(By.css('h5'))[2].nativeElement.innerText;
    expect(autoMapEmployee).toBe('Automap Employee(s)');
  });
});
