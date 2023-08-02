import { Injectable } from '@angular/core';
import { ExpenseFieldsFormOption, ImportSettingPost } from '../../models/configuration/import-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { MappingSetting } from '../../models/db/mapping-setting.model';

@Injectable({
  providedIn: 'root'
})
export class ImportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getImportSettings() {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  postImportSettings(exportSettingsPayload: ImportSettingPost){
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, exportSettingsPayload);
  }
  
  getQboExpenseFields(xeroAttributes: ExpenseField[], mappingSettings: MappingSetting[], isCloneSettings: boolean = false, fyleFields: string[] = []): ExpenseFieldsFormOption[] {
    return xeroAttributes.map(attribute => {
      const mappingSetting = mappingSettings.filter((mappingSetting: MappingSetting) => {
        if (mappingSetting.destination_field.toUpperCase() === attribute.attribute_type) {
          if (isCloneSettings) {
            return fyleFields.includes(mappingSetting.source_field.toUpperCase()) ? mappingSetting : false;
          }

          return mappingSetting;
        }

        return false;
      });

      return {
        source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
        destination_field: attribute.display_name,
        import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
        disable_import_to_fyle: false,
        source_placeholder: ''
      };
    });
  }
}
