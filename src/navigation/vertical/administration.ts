export default [
  { heading: 'Gestion des demandes' },

  {
    title: 'Gestion des demandes',
    icon: { icon: 'tabler-settings-cog' },
    children: [
      {
        title: 'Ajouter',
        to: { name: 'demandes-administration-new-demande' },
        icon: { icon: 'tabler-file-plus' },
        action: 'read',
        subject: 'SUPERADMIN',
      },
      {
        title: 'Brouillons',
        to: { name: 'demandes-administration-brouillons' },
        icon: { icon: 'tabler-notes-off' },
        action: 'read',
        subject: 'SUPERADMIN',
      },
      {
        title: 'En Instance',
        to: { name: 'demandes-administration-instances' },
        icon: { icon: 'tabler-notes' },
        action: 'read',
        subject: 'SUPERADMIN',
      },
      {
        title: 'Rejetées',
        to: { name: 'demandes-administration-rejete' },
        icon: { icon: 'tabler-notes' },
        action: 'read',
        subject: 'SUPERADMIN',
      },
      {
        title: 'Validées',
        to: { name: 'demandes-administration-traite' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
      {
        title: 'Délivrées',
        to: { name: 'demandes-administration-delivres' },
        icon: { icon: 'tabler-checklist' },
        action: 'read',
        subject: 'CBT',
      },
    ],
  },

]
