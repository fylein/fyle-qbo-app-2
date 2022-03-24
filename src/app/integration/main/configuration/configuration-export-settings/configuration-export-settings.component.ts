import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration-export-settings',
  templateUrl: './configuration-export-settings.component.html',
  styleUrls: ['./configuration-export-settings.component.scss']
})
export class ConfigurationExportSettingsComponent implements OnInit {
  isLoading: boolean = true;

  constructor() { }

  isLoaded(isLoaded: boolean): void {
    this.isLoading = !isLoaded;
  }

  ngOnInit(): void {
  }

}
