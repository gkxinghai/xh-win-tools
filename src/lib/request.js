import axios from 'axios'
import qs from 'qs'
import {networkConfig} from '/src/config/networkConfig'
import {isNotBlank,getToken,getTokenType} from '@/lib/util'
// import useUser from '@/store/user'
// const user=useUser()
// 创建axios实例
export function _axios(config) {
    const service = axios.create({
        // axios中请求配置有baseURL选项，表示请求URL公共部分
        baseURL: networkConfig.serverUrl,
        // 超时
        timeout: networkConfig.requestTimeout,

    })
    // request拦截器
    service.interceptors.request.use(config => {
        const token = getToken()
        const token_type = getTokenType()
        if (isNotBlank(token)) {
            // 让每个请求携带token-- ['Authorization']
            config.headers.Authorization = token_type + ' ' + token
            // 处理刷新token后重新请求的自定义变量
            config['refresh_token'] = false
        }
        if (config.dataType == 'formData') {
            config.headers['content-type'] = 'application/x-www-form-urlencoded'
            config.data = qs.stringify(config.data)
        }
        return config
    }, error => {
        console.log(error)
        Promise.reject(error)
    })

    // 响应拦截器
    service.interceptors.response.use(res => {
            // console.log(res)
            const {data, status} = res
            return data
        },
        error => {
            return Promise.reject(error)
        }
    )
    return service(config)
}
