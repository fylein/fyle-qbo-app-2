import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration-import-settings',
  templateUrl: './configuration-import-settings.component.html',
  styleUrls: ['./configuration-import-settings.component.scss']
})
export class ConfigurationImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  constructor() { }

  isLoaded(isLoaded: boolean): void {
    this.isLoading = !isLoaded;
  }

  ngOnInit(): void {
  }

}
