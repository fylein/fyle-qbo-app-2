import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('with phase of loader', () => {
    component.phase = 'pre_onboarding';
    fixture.detectChanges();
    const board = fixture.debugElement.query(By.css('.position')).nativeElement;
    expect(board.innerHTML).not.toBeNull();
    expect(board.innerHTML.length).toBeGreaterThan(0);
    expect(board.clientHeight).toBeGreaterThanOrEqual(153);
    expect(board.clientWidth).toBeGreaterThanOrEqual(150);
  });

  it('with phase and size of loader', () => {
    component.phase = 'pre_onboarding';
    component.size = 'small';
    fixture.detectChanges();
    const board = fixture.debugElement.query(By.css('.position > img')).nativeElement;
    expect(board.innerHTML).not.toBeNull();
    expect(board.innerHTML.length).toBe(0);
    expect(board.clientHeight).toBeGreaterThanOrEqual(60);
    expect(board.clientWidth).toBeGreaterThanOrEqual(60);
  });

  it('without phase of loader', () => {
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('div > img')).nativeElement;
    const board = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(board.innerHTML).not.toBeNull();
    expect(board.innerHTML.length).toBeGreaterThan(0);
    expect(board.contains(img)).toBeTrue();
  });
});
