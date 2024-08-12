import {_axios as axios} from '@/lib/request'
import hmacSha1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';
// import axios from 'axios'
import qs from 'qs'
let user = {}
// axios.defaults.adapter = import('axios/lib/adapters/http');
// console.log(myApi)

//修改用户密码
export const logIn  = () => {
  let formData=new FormData();
  formData.append("username",'中二少年学编程');
  // formData.append("password",'admin@123');
  formData.append("password",'admin@123');
  const data = formData;

  return axios({
    url: 'auth/login',
    data,
    method:'POST',
    auth: {
      username: 'client',
      password: ''
    }
  })
}
export const logInByRandomPassword=(randomPassword)=>{
  let rs={
    success:false
  }
  const todayTime=new Date().setHours(15,59,59,999)
  const key1='!@#$%^&*()'
  const key2='lizegaoxiaozhao'
  const pwd=hmacSha1(key1+todayTime,key2).toString()
  if(randomPassword==pwd){
    rs={
      success: true
    }
  }
  return rs
}
//获取用户信息
export const getUserInfo = () => {
  return axios({
    url: '/designer/user/getUserInfo',
    method: 'get'
  })
}
//模糊查询获取用户列表
export const getUserList = (data) => {
  console.log(data)
  return axios({
    url:'/rdpsysuser/getuserlist',
    method:'post',
    data
  })
}
