import type { User } from '@/@core/types'

interface State {
  listUser: User[]
  currentUser: User
}
export const useUserStore = defineStore('user', {
  state: (): State => ({
    listUser: [{
      idUnite: '1',
      cni: 'AB123',
      unite: 'BT RABAT',
    },
    {
      idUnite: '2',
      cni: 'AB124',
      unite: 'BT MARRAKECH',
    },
    {
      idUnite: '3',
      cni: 'EE54545',
      unite: 'BT AGADIR',
    }],
    currentUser: {
      idUnite: '',
      cni: '',
      unite: '',
    },
  }),
  actions: {
    setCurrentUser(cni: string) {
      this.listUser.forEach(user => {
        if (user.cni === cni)
          this.currentUser = user
      })
    },
  },

})
