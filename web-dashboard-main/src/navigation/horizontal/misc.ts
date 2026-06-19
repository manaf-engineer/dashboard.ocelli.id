export default [
  {
    title: 'Misc',
    icon: { icon: 'bx-copy' },
    children: [
      {
        title: 'Access Control',
        icon: { icon: 'bx-command' },
        to: 'access-control',
        action: 'read',
        subject: 'AclDemo',
      },
      {
        title: 'Nav Levels',
        icon: { icon: 'bx-menu' },
        children: [
          {
            title: 'Level 2.1',
            to: null,
          },
          {
            title: 'Level 2.2',
            children: [
              {
                title: 'Level 3.1',
                to: null,
              },
              {
                title: 'Level 3.2',
                to: null,
              },
            ],
          },
        ],
      },
      {
        title: 'Disabled Menu',
        to: null,
        icon: { icon: 'bx-hide' },
        disable: true,
      },
      {
        title: 'Raise Support',
        href: 'https://themeselection.com/support/',
        icon: { icon: 'bx-phone' },
        target: '_blank',
      },
      {
        title: 'Documentation',
        href: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/documentation/',
        icon: { icon: 'bx-file' },
        target: '_blank',
      },
    ],
  },
]
