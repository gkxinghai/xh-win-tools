
//版本描述
const versionKey = 'node-install' //想要运行的版本
const versionDetail = {
    'node-install': () => {
        return {
            name: 'node自动安装',
            modules: [
                // ...toolBox,
                // ...mediaManage
            ]
        }
    },
}


export const getModules = () => {
    const moudles = versionDetail[versionKey]().modules
    console.log(moudles)
    return moudles
}

export const versionConfig = {
    versionKey,
}
