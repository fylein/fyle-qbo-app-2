import { Injectable } from '@angular/core';
import { PaginatorPage } from '../../models/enum/enum.model';
import { Paginator } from '../../models/misc/paginator.model';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  constructor(private storageService: StorageService) { }

  getPageSize(module: PaginatorPage): Paginator {
    const defaultPageSize = 50;

    return {
      limit: this.storageService.get(`page-size.${module}`) || defaultPageSize,
      offset: 0
    };
  }

  storePageSize(module: PaginatorPage, pageSize: number): void {
    this.storageService.set(`page-size.${module}`, pageSize);
  }
}
