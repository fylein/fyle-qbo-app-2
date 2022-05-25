import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSearchTextComponent } from './simple-search-text.component';

xdescribe('SimpleSearchTextComponent', () => {
  let component: SimpleSearchTextComponent;
  let fixture: ComponentFixture<SimpleSearchTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleSearchTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSearchTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
