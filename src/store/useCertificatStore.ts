import axiosCNI from '@axiosCNI'
import type { Certificat } from '@/@core/types'
import axiosIns from '@axios'

interface State {
  listCertificat: Certificat[]
}

export const useCertificatStore = defineStore('certificat', {
  state: (): State => ({
    listCertificat: [],
  }),

  actions: {
    async fetchAll(queryParams?: Object) {
      let queryPrams = ''
      if (queryParams)
        queryPrams = `?filter=${JSON.stringify(queryParams)}`

      return axiosIns.get(`/certificats${queryPrams}`).then(res => {
        this.listCertificat = res.data
      })
    },
    async historyCertificateByPersonne(cni: string) {
      return axiosIns.get(`/certificats?populate=documents&filter={"personne.cni":"${cni}"}`)
    },
    async fetchOne(id: string) {
      return axiosIns.get(`/certificats/${id}?populate=documents`)
    },
    async fetchUser(code: string) {
      return axiosCNI.get(`/user?code=${code}`)
    },

    async fetchMotifList() {
      return axiosIns.get('/motifs')
    },

    async filePdf(id: string) {
      const file = {
        id,
      }

      return axiosIns.post('/pdf/fill', file)
    },

    async updateOne(cert: Certificat) {
      const certificat: Certificat = { ...cert }

      return axiosIns.put(`/certificats/${certificat._id}?populate=documents`, certificat)
    },
    async createOne(cert: Certificat) {
      return axiosIns.post('/certificats', { ...cert })
    },
    async deleteOne(id: string) {
      return axiosIns.delete(`/certificats/${id}`)
    },

  },
})
