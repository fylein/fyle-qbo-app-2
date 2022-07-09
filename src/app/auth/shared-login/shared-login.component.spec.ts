import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SharedLoginComponent } from './shared-login.component';

describe('SharedLoginComponent', () => {
  let component: SharedLoginComponent;
  let fixture: ComponentFixture<SharedLoginComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SharedLoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              local_storage_dump: '{"name":"John", "age":30, "city":"New York"}'
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces']);
  });
});
