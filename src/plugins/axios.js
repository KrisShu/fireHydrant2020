import axios from "axios";

const service = axios.create({
  baseURL: "http://fd.sctsjkj.com:5081",
  timeout: 60000
});

console.log("service.baseURL", service.baseURL);

service.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) {
    return Promise.resolve(response.data);
  },
  function(error) {
    // if(error.response.data.error.message){
    //     Message.error(error.response.data.error.message)
    // }else{
    //     Message.error("操作失败")
    // }
    return  Promise.reject(error.response.data);
    }
);

export default service;
