import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectComponent ],
      imports: [MatDialogModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
