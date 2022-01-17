import { AdvancedSettingWorkspaceSchedule } from "./advanced-setting.model";

export interface WorkspaceSchedule extends AdvancedSettingWorkspaceSchedule {
  id: number;
  start_datetime: Date,
  workspace: number;
};
