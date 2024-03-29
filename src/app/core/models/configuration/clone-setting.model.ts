import { FormGroup } from "@angular/forms";
import { AdvancedSettingGet, AdvancedSettingModel, AdvancedSettingPost } from "./advanced-setting.model";
import { ExportSettingGet, ExportSettingModel, ExportSettingPost } from "./export-setting.model";
import { ImportSettingGet, ImportSettingModel, ImportSettingPost } from "./import-setting.model";
import { MappingSetting } from "../db/mapping-setting.model";
import { EmployeeSettingGet, EmployeeSettingModel, EmployeeSettingPost } from "./employee-setting.model";

export type CloneSetting = {
    workspace_id: number,
    export_settings: ExportSettingGet,
    import_settings: ImportSettingGet,
    advanced_configurations: AdvancedSettingGet,
    employee_mappings: EmployeeSettingGet
}

export type CloneSettingPost = {
    export_settings: ExportSettingPost,
    import_settings: ImportSettingPost,
    advanced_configurations: AdvancedSettingPost,
    employee_mappings: EmployeeSettingPost
}

export type CloneSettingExist = {
    is_available: boolean,
    workspace_name: string
}

export class CloneSettingModel {
    static constructPayload(cloneSettingsForm: FormGroup, customMappingSettings: MappingSetting[]): CloneSettingPost {

        const exportSettingPayload = ExportSettingModel.constructPayload(cloneSettingsForm);
        const importSettingPayload = ImportSettingModel.constructPayload(cloneSettingsForm, customMappingSettings);
        const advancedSettingPayload = AdvancedSettingModel.constructPayload(cloneSettingsForm);
        const employeeMappingPayload = EmployeeSettingModel.constructPayload(cloneSettingsForm);

        const cloneSettingPayload: CloneSettingPost = {
            export_settings: exportSettingPayload,
            import_settings: importSettingPayload,
            advanced_configurations: advancedSettingPayload,
            employee_mappings: employeeMappingPayload
        };

        return cloneSettingPayload;
    }
}
