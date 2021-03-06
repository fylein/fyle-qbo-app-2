import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, NavigationStart, Event as NavigationEvent, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, ReplaySubject } from 'rxjs';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { mappingResponse, modules } from './main.fixture';
import { MainModule } from './main.module';
import { SnakeCaseToSpaceCase } from '../../shared/pipes/snake-case-to-space-case.pipe';
describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router: Router;
  let mappingService: MappingService;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding', events: eventSubject.asObservable() };
  beforeEach(async () => {
    const service1 = {
      getMappingSettings: () => of(mappingResponse)
    };
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule, NoopAnimationsModule ],
      declarations: [ MainComponent, SnakeCaseToSpaceCase ],
      providers: [
        { provide: MappingService, useValue: service1 },
        { provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mappingService = TestBed.inject(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'setupMappingPages').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/'));
    fixture.detectChanges();
    expect(component.setupMappingPages).toHaveBeenCalled();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'setupMappingPages').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/configuration/employee_settings?refreshMappings'));
    fixture.detectChanges();
    expect(component.setupMappingPages).toHaveBeenCalled();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'setupMappingPages').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/configuration?refreshMappings'));
    fixture.detectChanges();
    expect(component.setupMappingPages).toHaveBeenCalled();
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[0])).toBeUndefined();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/main/${modules[0].route}`]);
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[2])).toBeUndefined();
    fixture.detectChanges();
    expect(modules[2].isExpanded).toBeFalse();
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[3])).toBeUndefined();
    fixture.detectChanges();
    expect(modules[3].isExpanded).toBeTrue();
  });

  it('setupMappingPages function check', () => {
    spyOn(mappingService, 'getMappingSettings').and.callThrough();
    expect(component.setupMappingPages()).toBeUndefined();
    fixture.detectChanges();
    expect(mappingService.getMappingSettings).toHaveBeenCalled();
  });
});
