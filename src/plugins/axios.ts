import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: `${import.meta.env.VITE_CERTIFICAT_URL}/api`,
  timeout: 20000,

  // headers: {'X-Custom-Header': 'foobar'}
})

export default axiosIns
