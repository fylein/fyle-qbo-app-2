import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Having any here is okay, since we store different types of data in localstorage
  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // Having any here is okay, since we get different types of data in localstorage
  get(key: string) {
    try {
      const stringifiedItem = localStorage.getItem(key);
      return stringifiedItem ? JSON.parse(stringifiedItem) : null;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
