import { Injectable } from '@angular/core';
import { MinimalUser } from '../models/user.model';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

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
    // TODO: fix the return type to number (i.e.) len(orgs) - returning all orgs with details is useless
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
