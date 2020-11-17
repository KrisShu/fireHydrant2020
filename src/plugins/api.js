const API = {
  //登录
  UserLoginForMobile:'/api/services/app/HydrantUser/UserLoginForMobile',//用户登录(移动端)
  UserLogout:'/api/services/app/HydrantUser/UserLogout',//注销登录
  ChangePassword:'/api/services/app/HydrantUser/ChangePassword',//修改密码


  //消火栓
  AddHydrant:'/api/services/app/Hydrant/AddHydrant',//添加消火栓
  UpdateHydrant:'/api/services/app/Hydrant/UpdateHydrant',//修改消火栓
  DeleteHydrant:'/api/services/app/Hydrant/DeleteHydrant',//删除消火栓
  GetHydrantListForApp:'/api/services/app/Hydrant/GetHydrantListForApp',//获取消火栓列表
  GetHydrantById:'/api/services/app/Hydrant/GetHydrantById',//获取单个消火栓信息
  GetHydrantStatusNum:'/api/services/app/Hydrant/GetHydrantStatusNum',//获取消火栓在线及离线设备的数量
  


  //管网水压
  GetMonitorStatusNum:'/api/services/app/Hydrant/GetMonitorStatusNum',//获取管网水压监测设备在线及离线设备的数量
  AddMonitor:'/api/services/app/Hydrant/AddMonitor',//添加管网水压监测设备
  UpdateMonitor:'/api/services/app/Hydrant/UpdateMonitor',//修改管网水压监测设备
  GetMonitorListForApp:'/api/services/app/Hydrant/GetMonitorListForApp',//管网水压监测设备列表分页
  GetMonitorById:'/api/services/app/Hydrant/GetMonitorById',//获取单个管网水压监测设备详情


  //警情处理
  GetHydrantAlarmList:'/api/services/app/Hydrant/GetHydrantAlarmListForApp',//获取消火栓警情分页列表（手机端APP）
  GetHydrantAlarmDetail:'/api/services/app/Hydrant/GetHydrantAlarmDetailForApp',//获取消火栓设备警情详情（手机端警情列表中点击处理或处理详情按钮时调用）
  HydrantAlarmHandle:'/api/services/app/Hydrant/HydrantAlarmHandle',//消火栓设备警情处理


  GetMonitorAlarmList:'/api/services/app/Hydrant/GetMonitorAlarmListForApp',//获取管网水压警情分页列表
  GetMonitorAlarmDetail:'/api/services/app/Hydrant/GetMonitorAlarmDetailForApp',//
  MonitorAlarmHandle:'/api/services/app/Hydrant/MonitorAlarmHandle',//管网水压监测设备警情处理



 
};
export default API;
