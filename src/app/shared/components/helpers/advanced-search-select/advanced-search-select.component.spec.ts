import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchSelectComponent } from './advanced-search-select.component';

describe('AdvancedSearchSelectComponent', () => {
  let component: AdvancedSearchSelectComponent;
  let fixture: ComponentFixture<AdvancedSearchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedSearchSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
