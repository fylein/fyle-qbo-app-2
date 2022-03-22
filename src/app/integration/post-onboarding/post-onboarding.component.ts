import { Component, OnInit } from '@angular/core';
import { DashboardModule, DashboardModuleChild } from 'src/app/core/models/misc/dashboard-module.model';

@Component({
  selector: 'app-post-onboarding',
  templateUrl: './post-onboarding.component.html',
  styleUrls: ['./post-onboarding.component.scss']
})
export class PostOnboardingComponent implements OnInit {

  imgSrc: string;
  modules: DashboardModule[] = [
    {
      name: 'Dashboard',
      route: 'dashboard',
      iconPath: 'assets/images/svgs/general/dashboard',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Export Logs',
      route: 'export-logs',
      iconPath: 'assets/images/svgs/general/export-log',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Mappings',
      route: 'mappings',
      iconPath: 'assets/images/svgs/general/mapping',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Employee Mapping',
          route: 'employee-mapping',
          isActive: false
        },
        {
          name: 'Category Mapping',
          route: 'category-mapping',
          isActive: false
        }
      ]
    },
    {
      name: 'Configuration',
      route: 'configuration',
      iconPath: 'assets/images/svgs/stepper/configuration',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Map Employees',
          route: 'employee-settings',
          isActive: false
        },
        {
          name: 'Export Settings',
          route: 'export-settings',
          isActive: false
        },
        {
          name: 'Import Settings',
          route: 'import-settings',
          isActive: false
        },
        {
          name: 'Advanced Settings',
          route: 'advanced-settings',
          isActive: false
        }
      ]
    }
  ];

  constructor() { }

  navigate(module: DashboardModule | DashboardModuleChild): void {
    // Setting clicked module as active
    module.isActive = true;

    // Setting all other modules and child modules as inactive
    this.modules.forEach(m => {
      if (m.name !== module.name) {
        m.isActive = false;
        if (m.childPages) {
          m.childPages.forEach(c => {
            if (c.name !== module.name) {
              c.isActive = false
            }
          });
        }
      }
    });

    // Set parent module as active if child module is clicked
    const parentModule = this.modules.find(m => m.childPages.find(c => c.name === module.name));
    if (parentModule) {
      parentModule.isActive = true;
    }

    if (module.name === 'Mappings' || module.name === 'Configuration') {
      module.isExpanded = !module.isExpanded;
    } else {
      // TODO: navigate
    }
  }

  ngOnInit(): void {
  }

}
