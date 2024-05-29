import {
  cilAvTimer,
  cilBuilding,
  cilClone,
  cilCog,
  cilFilter,
  cilFire,
  cilLibraryAdd,
  cilSpeedometer,
  cilUserPlus,
} from '@coreui/icons'

let COO = process.env.REACT_APP_COO
let FE = process.env.REACT_APP_FE
let SDM = process.env.REACT_APP_SDM
let RA = process.env.REACT_APP_RA
let DM = process.env.REACT_APP_DM
let RC = process.env.REACT_APP_RC
let LCTO = process.env.REACT_APP_LCTO




import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'


let _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    meta: { role: ['chief-operating-officercoo', 'field-engineer-fe', 'sdm-work-allotter' , RA , RC] },
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Pending Case',
    to: '/case/mypendingcase',
    meta: { role: ['field-engineer-fe'] },
    icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,

    
  },
  {
    component: CNavGroup,
    name: 'Cases',
    to: '',
    meta: { role: ['chief-operating-officercoo' , 'field-engineer-fe','sdm-work-allotter',RA , DM , RC] },
    icon: <CIcon icon={cilClone} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Cases',
        to: '/case/all',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe', 'sdm-work-allotter', 'ra-branch-bm',RA , DM , RC] },
      },
      {
        component: CNavItem,
        name: 'Create Cases',
        to: '/case/create',
        meta: { role: ['chief-operating-officercoo'] },
      },
      {
        component: CNavItem,
        name: 'Trash Cases',
        to: '/case/trash',
        meta: { role: ['chief-operating-officercoo'] },
      },
    ],
  },
  
  {
    component: CNavGroup,
    name: 'RA Branch',
    to: '',
    meta: { role: ['chief-operating-officercoo', 'sdm-work-allotter' ,RA] },
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All RA Branch',
        to: '/rabranch/all',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe', 'sdm-work-allotter'] },
      },
      {
        component: CNavItem,
        name: 'Create RA Branch',
        to: '/rabranch/create',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe'] },
      },
      {
        component: CNavItem,
        name: 'Trash RA Branch',
        to: '/rabranch/trash',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe'] },
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Finance',
    to: '',
    meta: { role: ['chief-operating-officercoo', 'sdm-work-allotter' ,RA , DM , RC] },
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Finance',
        to: '/bank/all',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe', 'sdm-work-allotter' , DM ,RC] },
      },
      {
        component: CNavItem,
        name: 'Create Finance',
        to: '/bank/create',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe','sdm-work-allotter' , DM , RC] },
      },
      {
        component: CNavItem,
        name: 'Trash Finance',
        to: '/bank/trash',
        meta: { role: ['chief-operating-officercoo', 'field-engineer-fe' , DM , RC] },
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'CONFIGURATION',
    meta: { role: ['field-engineer-fe' , 'chief-operating-officercoo'] },
  },
  {
    component: CNavGroup,
    name: 'Master',
    to: '/cms/master',
    meta: { role: ['field-engineer-fe' , 'chief-operating-officercoo'] },

    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Categories',
        to: '/master/category',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo'] },
      },
      {
        component: CNavItem,
        name: 'Region',
        to: '/master/regions',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo'] },
      },
      {
        component: CNavItem,
        name: 'Status',
        to: '/master/status',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo'] },
      },
      {
        component: CNavItem,
        name: 'Templates',
        to: '/master/templates',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo'] },
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Users',
    meta: { role: ['field-engineer-fe', 'chief-operating-officercoo'] },
  },
  {
    component: CNavGroup,
    name: 'Admins',
    to: '/admins',
    meta: { role: ['field-engineer-fe', 'chief-operating-officercoo' , SDM , DM] },

    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Admins',
        to: '/admins/all',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo',SDM , DM] },
      },
      {
        component: CNavItem,
        name: 'Add Admin',
        to: '/admin/create',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo',SDM , DM] },
      },
      {
        component: CNavItem,
        name: 'Trash Admins',
        to: '/admins/trash',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo',SDM , DM] },
      },
      {
        component: CNavItem,
        name: 'Permissions',
        to: '/admin/permission/create',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo',SDM] },
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: 'admin/role/create',
        meta: { role: ['field-engineer-fe', 'chief-operating-officercoo' , SDM] },
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Module Builder',
    meta: { role: ['sdm-work-allotter'] },
  },
  {
    component: CNavGroup,
    name: 'Case Builder',
    to: '',
    meta: { role: ['sdm-work-allotter'] },
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Case Builder',
        to: '/builder/case/all',
        meta: { role: ['sdm-work-allotter'] },
      },
      {
        component: CNavItem,
        name: 'Create Case Builder',
        to: '/builder/case/create',
        meta: { role: ['sdm-work-allotter'] },
      },
      {
        component: CNavItem,
        name: 'Trash Case Builder',
        to: '/builder/case/trash',
        meta: { role: ['sdm-work-allotter'] },
      },
    ],
  },

]




export default _nav

