import {CirclePlus, Eye, User, BadgePlus, UserRound, ReceiptText, BookOpen, Atom } from 'lucide-react';
import { ROLES } from './constants';

const links = [
    {
        href: '/rfqs/create-rfq',
        label: 'Create RFQ',
        icon: <CirclePlus />,
        roles: [ROLES.CUSTOMER],
    },
    {
        href: '/rfqs/my-rfqs',
        label: 'My RFQs',
        icon: <Eye />,
        roles: [ROLES.CUSTOMER],
    },
    {
        href: '/rfqs/dashboard',
        label: 'Dashboard',
        icon: <Eye />,
        roles: [ROLES.PROJECT_MANAGER, ROLES.ADMIN],
    },
    {
        href: '/customer/accepted-rfqs',
        label: 'Accepted RFQs',
        icon: <ReceiptText />,
        roles: [ROLES.CUSTOMER],
    },
    {
        href: '/pm/accepted-rfqs',
        label: 'Accepted RFQs',
        icon: <ReceiptText />,
        roles: [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
    },
    {
        href: '/vendor/accepted-quotes',
        label: 'Accepted Quotes',
        icon: <ReceiptText />,
        roles: [ROLES.VENDOR],
    },
    {
        href: '/vendor/dashboard',
        label: 'Dashboard',
        icon: <UserRound />,
        roles: [ROLES.VENDOR],
    },
    {
        href: '/vendor/onboarding',
        label: 'Onboarding',
        icon: <UserRound />,
        roles: [ROLES.VENDOR],
    },
    {
        href: '/createvendor',
        label: 'Create vendor',
        icon: <BadgePlus />,
        roles: [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
    },
    {
        href: '/profile',
        label: 'My Profile',
        icon: <UserRound />,
        roles: [ROLES.VENDOR, ROLES.ADMIN, ROLES.CUSTOMER, ROLES.PROJECT_MANAGER],
    },
]


export const NAV_LINKS = [
  {
    label: 'Dashboard',
    href: '/profile',
    icon: <UserRound size={15} />,
    requiresAuth: true,
  },
  // {
  //   label: 'Create RFQ',
  //   href: '/rfqs/create-rfq',
  //   icon: <CirclePlus size={15}/>,
  //   requiresAuth: true,
  // },
  // {
  //   label: 'View RFQ',
  //   href: '/rfqs/my-rfqs',
  //   icon: <Eye size={15}/>,
  //   requiresAuth: true,
  // },
  {
    label: 'About us',
    href: '/aboutus',
    icon: <BookOpen size={15}/>,
    requiresAuth: false,
  },
  {
    label: 'Solutions',
    href: '/solutions',
    icon: <Atom size={15}/>,
    requiresAuth: false,
  },
];

export default links;