export default [
    // { heading: 'Cutom Menu' },
    {
      title: 'Dashboard',
      icon: { icon: 'bx-home' },
      to: 'dashboard',
      feature: 'dashboard',
      sub_feature: 'index',
    },
    // -----------------------------------------
    {
      heading: 'Serangga',
      feature: 'dataset serangga,data node trap',
      sub_feature: 'index',
    },
    {
      title: 'Dataset Serangga',
      icon: { icon: 'bx-bug' },
      to: 'insect-dataset',
      feature: 'dataset serangga',
      sub_feature: 'index',
    },
    {
      title: 'Data Node Trap',
      icon: { icon: 'bx-camera' },
      to: 'node-trap-data',
      feature: 'data node trap',
      sub_feature: 'index',
    },
    // -----------------------------------------
    {
      heading: 'Trap',
      feature: 'master node trap,master area',
      sub_feature: 'index',
    },
    {
      title: 'Master Node Trap',
      icon: { icon: 'bx-network-chart' },
      to: 'master-node-trap',
      feature: 'master node trap',
      sub_feature: 'index',
    },
    {
      title: 'Master Area',
      icon: { icon: 'bx-map-alt' },
      to: 'master-area',
      feature: 'master area',
      sub_feature: 'index',
    },
    // -----------------------------------------
    {
      heading: 'Laporan',
      feature: 'laporan trap node,data foto',
      sub_feature: 'index',
    },
    {
      title: 'Laporan Node Trap',
      icon: { icon: 'bx-book' },
      to: 'node-trap-report',
      feature: 'laporan trap node',
      sub_feature: 'index',
    },
    {
      title: 'Laporan Foto Trap',
      icon: { icon: 'bx-image' },
      to: 'photo-trap-report',
      feature: 'data foto',
      sub_feature: 'index',
    },
    // -----------------------------------------
    {
      heading: 'Pengaturan',
      feature: 'pengaturan interval,access control list',
      sub_feature: 'index,index role,index user',
    },
    {
      title: 'Pengaturan Interval',
      icon: { icon: 'bx-cog' },
      to: 'interval-setting',
      feature: 'pengaturan interval',
      sub_feature: 'index',
    },
    {
      title: 'Access Control List',
      icon: { icon: 'bx-user-pin' },
      to: 'access-control-list',
      feature: 'access control list',
      sub_feature: 'index role,index user',
    },
    // { heading: 'Below is default menu----' },
  ]
