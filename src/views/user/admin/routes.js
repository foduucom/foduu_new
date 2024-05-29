//routes.js

import React from 'react'

const All = React.lazy(() => import('./all'))
const Create = React.lazy(() => import('./create'))
const Trash = React.lazy(() => import('./trash'))
const CustomerLayouts = React.lazy(() => import('../../../layout/customerLayout'))

const PermissionCreate = React.lazy(()=>import('./createPermissions'))
const PermissionEdit = React.lazy(()=>import('./editPermission'))

const RolesCreate = React.lazy(()=>import('./createRoles'))
const RolesEdit = React.lazy(()=>import('./editRoles'))

const routes = [
  { path: '/admins/all', name: 'admin', element: All },
  { path: '/admins/trash', name: 'admin', element: Trash },
  { path: '/admin/create', name: 'admin', element: Create },
  { path: '/admin/:id/edit', name: 'Edit admin', element: Create },
  { path: '/admin/permission/create', name: 'Admin Permissions Crtea', element:PermissionCreate},
  { path: '/admin/permission/:id/edit', name: 'Admin Permissions', element:PermissionEdit},



  { path: '/admin/role/create', name: 'Admin Roles Create', element:RolesCreate},
  { path: '/admin/role/:id/edit', name: 'Admin Roles Update', element:RolesEdit},




  // { path: '/admin/:id/*', name: 'admin', element: CustomerLayouts },
]


export default routes
