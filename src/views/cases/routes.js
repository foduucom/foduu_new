import React from 'react'

const Create = React.lazy(() => import('./create'))
const All = React.lazy(() => import('./all'))
const Trash = React.lazy(() => import('./trash'))
const Show = React.lazy(() => import('./show'))
const Pending = React.lazy(() => import('./fependingcase'))
const Activity = React.lazy(()=>import ('./activity'))
const AllLogs = React.lazy(()=>import ('./allogs'))
const FEAllFiles = React.lazy(()=>import ('./showFiles/feShowFiles'))
const SDMAllFiles = React.lazy(()=>import ('./showFiles/sdmShowFiles'))

const CommonUpdate  = React.lazy(()=>import ('./CommonUpdate/commonUpdate'))
const CaseAddons  = React.lazy(()=>import ('./caseaddons'))

const routes = [
  { path: '/case/create', name: 'case Create', element:Create},
  { path: '/case/:id/edit', name: 'case Create', element:Create},
  { path: '/case/all', name: 'case All', element:All},
  { path: '/case/trash', name: 'case Trash', element:Trash},
  { path: '/case/:id/show', name: 'case Show', element:Show},
  { path: '/case/mypendingcase', name: 'case Pending', element:Pending},
  { path: '/case/activity', name: 'case Activity', element:Activity},
  { path: '/case/allogs', name: 'case Logs', element:AllLogs},
  { path: '/case/fe/:id/all-files', name: 'FE Files', element:FEAllFiles},
  { path: '/case/sdm/:id/all-files', name: 'SDM Files', element:SDMAllFiles},

  // Daynamic roures for case update

  { path: '/case/:id/update/:form/by/:role', name: 'case Create', element:CommonUpdate},

  { path: '/case/:id/:type/by/:role', name: 'Show', element:Create},

  { path: '/case/:id/case-addons', name: 'case Addons', element:CaseAddons},







]


export default routes
