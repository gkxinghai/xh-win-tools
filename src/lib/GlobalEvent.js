
export class GlobalEvent {
//    定义在渲染器中，基础的全局事件，可提供给主进程调用
    constructor(param) {
        this.router=param.router
    }
    goPage(name){
        this.router.push(name || 'login')
    }
}
