import axiosIns from '@axios'

export const useFileStore = defineStore('motif', {
  actions: {
    async fillPdf(certificat) {
      const file = {
        id: certificat._id,
      }

      return axiosIns.post('/pdf/fill', file)
    },
  },
})
