const webpack = require('webpack')

let ip, activeIP = ''
try {
    ip = require('./ip')
    activeIP = ip[ip.active]
    console.log(`当前ip代理: [${ip.active}]`, activeIP);
} catch (error) {
    console.log('\x1B[33m 尚未配置ip代理,请解压 config/ip.zip \x1b[0m:');
}

function getFullDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `"${year}-${month}-${day} ${hour}:${minute}:${second}"`
}

module.exports = {
    devServer: {
        port: 9000,
        proxy: {
            '/api': { //跨域配置标示
                target: `${activeIP}/api`, //所有访问标示的都被代理到这个地址,例如 http://后端域名/api
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
        },
    },
    productionSourceMap: false,
    configureWebpack: config => {
        return {
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        APP_VERSION: getFullDate() // 生成发布版本号,调用 process.env.APP_VERSION
                    }
                }),
            ]
        }
    }
}