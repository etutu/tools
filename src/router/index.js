//该文件专门用于创建整个应用的路由器

import VueRouter from 'vue-router'
import AirdropPage from '../pages/Airdrop'
import CollectPage from '../pages/Collect'
import CreateToken from '../pages/CreateToken'
import TransformPage from '../pages/Transform'
import CreateWallet from '../pages/CreateWallet'
//创建并暴露一个路由器
export default new VueRouter({
    routes: [
        {
            path: '/airdrop', // 批量发送
            component: AirdropPage, 
        }
        ,{
            path: '/collect', // 代币归集
            component: CollectPage,
        }
        ,{
            path: '/create_token', // 创建代币
            component: CreateToken,
        }
        ,{
            path: '/transform', // 单位转换
            component: TransformPage,
        }
        ,{
            path: '/create_wallet', // 创建钱包
            component: CreateWallet,
        }
    ]
})