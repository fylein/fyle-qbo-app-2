import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { StorageService } from '../core/storage.service';
import { MinimalUser } from '../../models/db/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) { }

  storeUserProfile(userProfile: MinimalUser): void {
    this.storageService.set('user', userProfile);
  }

  storeFyleOrgsCount(): void {
    const currentOrgsCount = this.storageService.get('orgsCount');
    if (currentOrgsCount && currentOrgsCount > 1) {
      // do nothing - we already have the orgs count to show switch org button
      return;
    }
    this.apiService.get(`/user/orgs/`, {}).subscribe((count: number) => {
      this.storageService.set('orgsCount', count);
    });
  }

  getUserProfile(): MinimalUser {
    return this.storageService.get('user');
  }
}
