import { Component, OnInit } from '@angular/core';
import { DashboardModule, DashboardModuleChild } from 'src/app/core/models/misc/dashboard-module.model';

@Component({
  selector: 'app-post-onboarding',
  templateUrl: './post-onboarding.component.html',
  styleUrls: ['./post-onboarding.component.scss']
})
export class PostOnboardingComponent implements OnInit {

  modules: DashboardModule[] = [
    {
      name: 'Dashboard',
      route: 'dashboard',
      iconPath: 'assets/images/svgs/general/dashboard.svg',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Export Logs',
      route: 'export-logs',
      iconPath: 'assets/images/svgs/general/export-log.svg',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Mappings',
      route: 'mappings',
      iconPath: 'assets/images/svgs/general/export-log.svg',
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
      iconPath: 'assets/images/svgs/stepper/advanced-setting-inactive.svg',
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


    if (module.name === 'Mappings' || module.name === 'Configuration') {
      module.isExpanded = !module.isExpanded;
      module.isActive = false;
    } else {
      // TODO: navigate
    }
  }

  ngOnInit(): void {
  }

}
