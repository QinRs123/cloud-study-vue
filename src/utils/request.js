//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
//const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})

//导入token状态
import { useTokenStore } from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //在发送请求之前做什么
        let tokenStore = useTokenStore()
        //如果token中有值，在携带
        if(tokenStore.token){
            config.headers.token=tokenStore.token
        }
        return config
    },
    (err)=>{
        //如果请求错误做什么
        Promise.reject(err)
    }
)

//添加响应拦截器
//添加响应拦截器
import router from '@/router'

instance.interceptors.response.use(
    result => {
        //如果业务状态码为0，代表本次操作成功
        if (result.data.code == 1) {
            return result.data;
        }
        //代码走到这里，代表业务状态码不是0，本次操作失败
        ElMessage.error(result.data.msg || '服务异常');
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err => {
        //如果响应状态码时401，代表未登录，给出对应的提示，并跳转到登录页
        if(err.response.status===401){
            ElMessage.error('请先登录！')
            router.push('/')
        }else{
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;