export type WorkspaceScheduleEmailOptions = {
  name: string;
  email: string;
}
export type WorkspaceSchedule = {
  id: number;
  workspace: number;
  enabled: boolean;
  start_datetime: Date;
  interval_hours: number;
  schedule: number;
  emails_selected: string[];
  additional_email_options: WorkspaceScheduleEmailOptions[];
};
