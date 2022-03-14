import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-configuration-step-header-section',
  templateUrl: './configuration-step-header-section.component.html',
  styleUrls: ['./configuration-step-header-section.component.scss']
})
export class ConfigurationStepHeaderSectionComponent implements OnInit {

  headerText: string;
  contentText: string;
  isStepOptional: boolean;
  activePage: string | undefined;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  refreshQBODimensions(): void {
    this.workspaceService.refreshQBODimensions().subscribe();
    this.snackBar.open('Refreshing data dimensions from QBO...');
  }

  private setupContent(): void {
    this.activePage = this.router.url.split('/').pop();

    switch (this.activePage) {
      case 'qbo_connector':
        this.headerText = 'Connect to Quickbooks Online';
        this.contentText = 'Connect to the Quickbooks Online Company from which you would like to import and export data. The Fyle org and Quickbooks Online company cannot be changed once the configuration steps are complete.';
        break;
      case 'employee_settings':
        this.headerText = 'Map Employees';
        this.contentText = 'Choose appropriate representation of your Employees in Quickbooks Online.';
        break;
      case 'export_settings':
        this.headerText = 'Export Settings';
        this.contentText = 'In this section, you will configure how and when expenses from Fyle can be exported to Quickbooks Online.';
        break;
      case 'import_settings':
        this.headerText = 'Import Settings';
        // TODO: add Learn More link post kb article creation
        this.contentText = 'You can Enable all the data that you wish to import from Quickbooks Online. All the imported data from Quickbooks Online would be available in Fyle under Admin Setting > Organization.';
        break;
      case 'advanced_settings':
        this.headerText = 'Advanced Settings';
        this.isStepOptional = true;
        // TODO: learn more link
        this.contentText = 'This section contains settings to automate and customize your expense export.';
        break;
    }
  }

  ngOnInit(): void {
    this.setupContent();
  }

}
