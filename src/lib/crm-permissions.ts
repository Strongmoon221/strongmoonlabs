export const PERMISSION_GROUPS = [
  {
    label: 'Tabs',
    description: 'Which sections the user can access in admin',
    keys: ['tab.projects', 'tab.apps', 'tab.crm', 'tab.support', 'tab.messages'],
  },
  {
    label: 'Projects',
    description: 'Actions within the Projects section',
    keys: ['projects.create', 'projects.edit', 'projects.delete'],
  },
  {
    label: 'Apps',
    description: 'Actions within the Apps section',
    keys: ['apps.create', 'apps.edit', 'apps.delete'],
  },
  {
    label: 'CRM',
    description: 'Actions within the CRM section',
    keys: ['crm.create', 'crm.edit', 'crm.delete'],
  },
  {
    label: 'Support',
    description: 'Actions within the Support section',
    keys: ['support.reply', 'support.close'],
  },
]

export const ALL_PERMISSIONS = [
  { key: 'tab.projects',     label: 'Projects Tab' },
  { key: 'tab.apps',         label: 'Apps Tab' },
  { key: 'tab.crm',          label: 'CRM Tab' },
  { key: 'tab.support',      label: 'Support Tab' },
  { key: 'tab.messages',     label: 'Messages Tab' },
  { key: 'projects.create',  label: 'Create Projects' },
  { key: 'projects.edit',    label: 'Edit Projects' },
  { key: 'projects.delete',  label: 'Delete Projects' },
  { key: 'apps.create',      label: 'Create Apps' },
  { key: 'apps.edit',        label: 'Edit Apps' },
  { key: 'apps.delete',      label: 'Delete Apps' },
  { key: 'crm.create',       label: 'Create CRM items' },
  { key: 'crm.edit',         label: 'Edit CRM items' },
  { key: 'crm.delete',       label: 'Delete CRM items' },
  { key: 'support.reply',    label: 'Reply to Tickets' },
  { key: 'support.close',    label: 'Close Tickets' },
] as const

export type PermissionKey = typeof ALL_PERMISSIONS[number]['key']
