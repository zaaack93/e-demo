import axiosIns from '@axios'

export const useProvinceStore = defineStore('province', {
  actions: {
    // async fetchAll() {
    //   return axios.get('/apps/calendar/events', { params: { calendars: this.selectedCalendars.join(',') } }).catch(err=>console.log(err);
    //   )
    // },
    // async (cert: Certificat) {
    //   return axios.post('/apps/calendar/events', { certificat.cnie }).catch(err=>console.log(err);   {"type":"commune","entiteMere":"province_73"}
    //   )
    // },
    async fetchList(condition: Object) {
      return axiosIns.get(`/entites-administratives?filter=${JSON.stringify(condition)}`)
    },
  },
})
