<template>
  <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币地址：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="tokenAddress" placeholder="请输入代币或LP代币地址" @input="loadTokenInstance()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">是否LP代币：</label>
                        <div class="col-sm-6">
                            <select class="form-control" v-model="isLpToken">
                                <option value="false">否</option>
                                <option value="true">是</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">锁定数量：</label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="lockNumber" placeholder="请输入锁定数量">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">解锁时间：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="unlockTime" placeholder="请选择解锁时间">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <span style="color: red;">费用：{{ lockFee }} BNB</span>
                        </div>
                    </div>
                    <div class="form-group" v-if="allowanceAmount == 0">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" @click="approveContract()">授权</button> 

                            <button type="submit" class="btn btn-primary" disabled>锁定</button>
                        </div>
                    </div>
                    <div class="form-group" v-if="allowanceAmount > 0">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" disabled>授权</button> 

                            <button type="submit" class="btn btn-primary" @click="lock()">锁定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TokenLock from '../web3/tokenLockWeb3'
export default {
    name: 'TokenLock',
    data() {
        return {
            tokenAddress: '',
            isLpToken: false,
            lockNumber: '',
            unlockTime: '',
            lockFee: 0,
            allowanceAmount: 0,
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
                TokenLock.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    this.getLockFee()
                });
            });
        },

        getLockFee() {
            let that = this
            TokenLock.getLockFee().then(function (lockFee) {
                that.lockFee = lockFee
            })
        },

        //加载代币实例
        loadTokenInstance() {
            TokenLock.getTokenDecimals(this.tokenAddress);
            this.getTokenAllowanceAmount();
        },

        //获取代币授权数量
        getTokenAllowanceAmount() {
            let that = this
            TokenLock.getTokenAllowanceAmount(this.tokenAddress).then(function (allowanceAmount) {
                that.allowanceAmount = allowanceAmount
            })
        },

        //代币授权
        approveContract() {
            let that = this
            TokenLock.approveContract(this.tokenAddress).then(function(receipt){
                console.log('receipt:', receipt)
                that.getTokenAllowanceAmount()
                alert('授权代币成功')
            }).catch((error) => {
                console.log('error:',error.error.message);  // 输出错误
                return
            })
        },

        lock() {
            console.log(this.isLpToken)
            TokenLock.lock(this.tokenAddress, this.isLpToken, this.lockNumber, this.unlockTime, this.lockFee).then(function(receipt){
                console.log('receipt:', receipt)
                alert('锁定成功')
            }).catch((error) => {
                console.log('error:',error.error.message);  // 输出错误
                return
            })
        },
    }
}
</script>

<style>

</style>