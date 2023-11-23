import axiosIns from '@axios'

export const useNationaliteStore = defineStore('nationalite', {
  actions: {
    async fetchList() {
      return axiosIns.get('/nationalites?sort=ordre')
    },
  },
})
