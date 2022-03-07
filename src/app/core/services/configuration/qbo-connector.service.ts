import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { QboConnector, QBOCredentials } from '../../models/qbo-connector.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const qboCredentialsCache$ = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class QboConnectorService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache$
  })
  connectQBO(qboConnector: QboConnector): Observable<QBOCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${workspaceId}/connect_qbo/authorization_code/`, qboConnector);
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  getQBOCredentials(): Observable<QBOCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/credentials/qbo/`, {});
  }
}
