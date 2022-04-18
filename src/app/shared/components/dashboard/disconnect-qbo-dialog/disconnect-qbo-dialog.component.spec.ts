import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectQboDialogComponent } from './disconnect-qbo-dialog.component';

describe('DisconnectQboDialogComponent', () => {
  let component: DisconnectQboDialogComponent;
  let fixture: ComponentFixture<DisconnectQboDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisconnectQboDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectQboDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
