import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

import Case from './views/cases/routes'
import RabranchRoutes from './views/raBranch/routes'
import TemplateRoutes from './views/configuration/master/template/routes'
import Region from './views/configuration/master/region/routes'
import Admin from './views/user/admin/routes'
import Status from './views/configuration/master/status/routes'
import category from './views/configuration/master/categories/routes'
import caseBuilder from './views/builder/case/routes'
import Bank from './views/banks/routes'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  //MASTER ROUTES
  ...category,
  ...Region,
  ...Status,

  //USERS,
  ...Admin,

  // OTHER
  ...Case,
  ...RabranchRoutes,
  ...TemplateRoutes,
  ...caseBuilder,
  ...Bank,
]

export default routes
