export const ALL_PERMISSIONS = [
  { key: 'projects.view',   label: 'View Projects' },
  { key: 'projects.create', label: 'Create Projects' },
  { key: 'projects.edit',   label: 'Edit Projects' },
  { key: 'projects.delete', label: 'Delete Projects' },
  { key: 'tasks.view',      label: 'View Tasks' },
  { key: 'tasks.create',    label: 'Create Tasks' },
  { key: 'tasks.edit',      label: 'Edit Tasks' },
  { key: 'team.view',       label: 'View Team' },
  { key: 'team.manage',     label: 'Manage Team' },
] as const

export type PermissionKey = typeof ALL_PERMISSIONS[number]['key']
