import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { QboConnector, QboConnectorPost, QBOCredentials } from '../../models/configuration/qbo-connector.model';
import { QBOPreference } from '../../models/misc/qbo-preference.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const qboCredentialsCache$ = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class QboConnectorService {
  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache$
  })
  connectQBO(qboConnector: QboConnectorPost): Observable<QBOCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/connect_qbo/authorization_code/`, qboConnector);
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  getQBOCredentials(): Observable<QBOCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/credentials/qbo/`, {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  disconnectQBOConnection(): Observable<QBOCredentials> {
    globalCacheBusterNotifier.next();
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.patch(`/workspaces/${workspaceId}/credentials/qbo/`, {});
  }

  @Cacheable()
  getPreferences(): Observable<QBOPreference> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/preferences/`, {});
  }
}
