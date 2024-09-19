<template>
  <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="walletNumber" placeholder="请输入你要创建的钱包数量">
                        </div>
                    </div>
                    <div class="form-group" v-if="createStatus == 1">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" @click="createWallet()">创建钱包</button>
                        </div>
                    </div>
                    <div class="form-group" v-if="createStatus == 2">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" @click="exportWallet()">导出钱包</button>
                        </div>
                    </div>
                    <div v-if="isShow == 2">
                        <!-- <div v-for="item in wallets" :key="item.address">
                            <div class="form-group">
                                <label class="col-sm-2 control-label"></label>
                                <div class="col-sm-6">
                                    <input type="number" class="form-control" value="{{ item.address }}" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label"></label>
                                <div class="col-sm-6">
                                    <input type="number" class="form-control" value="{{ item.private }}" readonly>
                                </div>
                            </div>
                        </div> -->
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CreateWallet from '../web3/createWalletWeb3'
export default {
    name: 'CreateWallet',
    data() {
        return {
            walletNumber: '',
            createStatus: 1,
            wallets: [],
            isShow: 1,
        }
    },

    mounted() {
        this.initWeb3()
    },

    methods: {
        //初始化web3
        initWeb3() {
            this.$nextTick(() => {
                //先执行初始化web3
                CreateWallet.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    // this.getCreateFee()
                });
            });
        },

        createWallet() {
            this.wallets = CreateWallet.createWallet(this.walletNumber);
            this.createStatus = 2;
        },
    }
}
</script>

<style>

</style>