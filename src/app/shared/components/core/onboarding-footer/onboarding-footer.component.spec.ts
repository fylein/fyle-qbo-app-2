import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OnboardingFooterComponent } from './onboarding-footer.component';

describe('OnboardingFooterComponent', () => {
  let component: OnboardingFooterComponent;
  let fixture: ComponentFixture<OnboardingFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('with page name', () => {
    component.page = 'qbo_connector';
    fixture.detectChanges();
    const board = fixture.debugElement.query(By.css('.footer--smaller-page > .footer--content > span')).nativeElement;
    expect(board.innerHTML).toBe(' Made with ❤️ by ');
  });

  it('without page name', () => {
    fixture.detectChanges();
    const board = fixture.debugElement.query(By.css('.footer > .footer--content > span')).nativeElement;
    expect(board.innerHTML).toBe(' Made with ❤️ by ');
  });
});
