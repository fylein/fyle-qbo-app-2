import { TestBed, getTestBed } from '@angular/core/testing';

import { CloneSettingService } from './clone-setting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockCloneSettingsGet } from 'src/app/integration/onboarding/clone-settings/clone-settings.fixture';
import { environment } from 'src/environments/environment';

describe('CloneSettingService', () => {
  let service: CloneSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    injector = getTestBed();
    service = TestBed.inject(CloneSettingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Clone Settings', () => {
    service.getCloneSettings().subscribe(value => {
      expect(value).toEqual(mockCloneSettingsGet);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/clone_settings/`
    });
    req.flush(mockCloneSettingsGet);
  });

  it('should post Clone Settings', () => {
    service.saveCloneSettings(mockCloneSettingsGet).subscribe(value => {
      expect(value).toEqual(mockCloneSettingsGet);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/clone_settings/`
    });
    req.flush(mockCloneSettingsGet);
  });
});
