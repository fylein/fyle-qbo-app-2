import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTextSearchComponent } from './simple-text-search.component';

xdescribe('SimpleTextSearchComponent', () => {
  let component: SimpleTextSearchComponent;
  let fixture: ComponentFixture<SimpleTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTextSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('check form', () => {
    if (component.form){
      expect(component.form).toBeTruthy();
    }
    expect(component.form).toBeUndefined();
  });
});
