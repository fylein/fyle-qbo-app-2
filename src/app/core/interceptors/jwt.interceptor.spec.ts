import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/core/api.service';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/core/auth.service';
import { errorResponse } from 'src/app/integration/main/dashboard/dashboard.fixture';
import { Token } from '../models/misc/token.model';
describe('JwtInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;
  let service: ApiService;
  let injector: TestBed;
  let interceptor: JwtInterceptor;
  let authService: AuthService;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  const response = {
    access_token: "fylee",
    expires_in: 3600,
    refresh_token: "ffff",
    token_type: "Bearer"
  };
  const response1: Token = {
    access_token: "",
    expires_in: 3600,
    refresh_token: "ffff",
    token_type: "Bearer",
    user: {
      access_token: "",
      email: "sravan.kumar@fyle.in",
      full_name: "sravan k",
      org_id: "orunxXsIajSE",
      org_name: "Test Sample Statement - GBP",
      refresh_token: "",
      user_id: "ust5Ga9HC3qc",
      active: true,
      admin: true,
      id: 1,
      last_login: null,
      password: '',
      staff: true
    }
  };
  const errorResponse1 = {
    status: 401,
    statusText: "Not Found",
    error: {
      id: 1,
      is_expired: true,
      company_name: 'QBO'
    }
  };
  beforeEach(() => {
    const service1 = {
      updateAccessToken: () => 'fyle',
      logout: () => undefined,
      refreshAccessToken: () => of(response),
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
    authService = injector.inject(AuthService);
    controller = injector.inject(HttpTestingController);
    interceptor = TestBed.inject(JwtInterceptor);
  });
  it('should be created', inject([AuthService], (service: AuthService) => {
    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', '/test');

    interceptor.intercept(requestMock, next).subscribe(() => {
      expect(interceptor).toBeTrue();
    });
  }));

  it('should be created', inject([AuthService], (service: AuthService) => {
    spyOn(authService, 'refreshAccessToken').and.returnValue(of(response1));
    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', '/test');

    interceptor.intercept(requestMock, next).subscribe(() => {
      expect(interceptor).toBeTrue();
      expect(authService.refreshAccessToken).toHaveBeenCalled();
    });
  }));

  it('should be created', inject([AuthService], (service: AuthService) => {
    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', `${API_BASE_URL}/api/auth/workspaces/${workspace_id}/qbo/employees/`);

    interceptor.intercept(requestMock, next).subscribe(() => {
      expect(interceptor).toBeTrue();
    });
  }));
  it('isTokenMandatory function check', () => {
    // @ts-ignore
    expect(interceptor.isTokenMandatory(`${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`)).toBeTrue();
  });

  it('getAccessToken() function check', () => {
    spyOn(authService, 'getRefreshToken').and.returnValue(null);
    // @ts-ignore
    expect(interceptor.getAccessToken()).toBeDefined();
    expect(authService.getRefreshToken).toHaveBeenCalled();
  });

  it('isTokenExpiring function check', () => {
    // @ts-ignore
    expect(interceptor.isTokenExpiring()).toBeTrue();
    // @ts-ignore
    expect(interceptor.isTokenExpiring('fyle')).toBeTrue();
  });

  xit('refreshAccessToken function check', () => {
    // @ts-ignore
    expect(interceptor.refreshAccessToken()).toBeDefined();
  });

  it('handleError function check', () => {
    // @ts-ignore
    expect(interceptor.handleError(errorResponse)).toBeDefined();
    // @ts-ignore
    expect(interceptor.handleError(errorResponse1)).toBeDefined();
  });
});
