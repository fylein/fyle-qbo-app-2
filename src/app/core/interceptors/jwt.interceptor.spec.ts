import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/core/api.service';
import { of } from 'rxjs';
import { AuthService } from '../services/core/auth.service';
describe('JwtInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;
  let service: ApiService;
  let injector: TestBed;
  let interceptor: JwtInterceptor;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  const response = {
    access_token: "fyle",
    expires_in: 3600,
    refresh_token: "ffff",
    token_type: "Bearer"
  };
  beforeEach(() => {
    const service1 = {
      updateAccessToken: () => 'fyle',
      logout: () => undefined,
      refreshAccessToken: () => response,
      getRefreshToken: () => 'fyle',
      getAccessToken: () => of('fyle')
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService, JwtHelperService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        {
          provide: JWT_OPTIONS,
          useValue: JWT_OPTIONS
        },
        {
          provide: AuthService,
          useValue: service1
        },
        JwtInterceptor,
        JwtHelperService
      ]
    });
    injector = getTestBed();
    client = TestBed.inject(HttpClient);
    service = injector.inject(ApiService);
    controller = injector.inject(HttpTestingController);
    interceptor = TestBed.inject(JwtInterceptor);
  });
  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
  xit('should convert object keys to camelCase', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    service.get(`/workspaces/${workspace_id}/qbo/employees/`, {}).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = controller.expectOne(
    `${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`
    );
    expect(req.request.headers.has('Content-Type')).toEqual(true);
    expect(req.request.headers.has('Accept')).toEqual(true);
  }));
  it('isTokenMandatory function check', () => {
    // @ts-ignore
    expect(interceptor.isTokenMandatory(`${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`)).toBeTrue();
  });

  xit('getAccessToken() function check', () => {
    const user = {
      access_token: 'fyle'
    };
    localStorage.setItem('user', JSON.stringify(user));
    // @ts-ignore
    expect(interceptor.getAccessToken()).toBeDefined();
  });
});
