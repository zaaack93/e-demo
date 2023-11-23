export default
[
  { heading: 'Demandes via WEB' },
  {
    title: 'Demandes via WEB',
    icon: { icon: 'tabler-certificate' },
    children: [
      {
        title: 'En Instance',
        to: { name: 'gestion-demandes-instance' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
      {
        title: 'Rejetées',
        to: { name: 'gestion-demandes-rejete' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
      {
        title: 'Validées',
        to: { name: 'gestion-demandes-traite' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
      {
        title: 'Délivrées',
        to: { name: 'gestion-demandes-delivre' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
    ],
  },
]
