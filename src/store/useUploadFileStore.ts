import axiosIns from '@axios'

export const useUploadFileStore = defineStore('uploadFile', {

  actions: {
    async uploadMany(payload: Object) {
      console.log(payload)
      Promise.all([this.upload(payload.files[0], payload.id), this.upload(payload.files[1], payload.id)])
        .then(results => {
          console.log(results)
        })
        .catch(error => {
        // do whatever
          console.log(error)
        })
    },
    async upload(file, id) {
      return axiosIns.post(`/files/upload/${id}/${file.type}`, file.file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    async replaceMany(payload: Object) {
      console.log(payload)

      Promise.all([this.replace(payload.files[0], payload.id), this.replace(payload.files[1], payload.id)])
        .then(results => {
          console.log(results)
        })
        .catch(error => {
        // do whatever
          console.log(error)
        })
    },

    async replace(file, id) {
      return axiosIns.post(`/files/replace/${id}/${file.type}`, file.file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },

    async getFiles() {
      return axiosIns.get('/files/upload')
    },
  },
})
