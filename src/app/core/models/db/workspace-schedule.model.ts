export type WorkspaceSchedule = {
  id: number;
  start_datetime: Date,
  workspace: number;
  enabled: boolean;
  interval_hours: number;
};
