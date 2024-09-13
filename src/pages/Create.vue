<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币名称：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="name" placeholder="请输入代币名称" @input="calculateAddr()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币符号：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="symbol" placeholder="请输入代币符号" @input="calculateAddr()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币精度：</label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="decimals" placeholder="请输入代币符号" @input="calculateAddr()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">初始供应量：</label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="totalSupply" placeholder="请输入代币符号" @input="calculateAddr()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <span style="color: red;">费用：{{ createFee }} BNB</span>
                        </div>
                    </div>
                    <div class="form-group" v-if="isShowAddress===1">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <span style="color: green;">预计生成地址： {{ estimateAddress }}</span>
                        </div>
                    </div>
                    <div class="form-group" v-if="isShowAddress===2">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <span style="color: green;">生成地址： {{ estimateAddress }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" @click="createToken()">部署代币</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Create from '../web3/createWeb3'
export default {
    name: 'CreatePage',
    data() {
        return {
            name: '',
            symbol: '',
            decimals: 18,
            totalSupply: 0,
            isShowAddress: 0,
            estimateAddress: '',
            createFee: 0,
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
                Create.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    this.getCreateFee()
                });
            });
        },

        getCreateFee() {
            let that = this
            Create.getCreateFee().then(function (createFee) {
                that.createFee = createFee
            })
        },

        calculateAddr() {
            let that = this
            if(this.name !== '' && this.symbol !== '' && this.decimals > 0 && this.totalSupply > 0) {
                Create.calculateAddr(this.name, this.symbol, this.decimals, this.totalSupply).then(function (address) {
                that.isShowAddress = 1;
                that.estimateAddress = address
            })
            }
        },

        createToken() {
            let that = this
            Create.createToken(this.name, this.symbol, this.decimals, this.totalSupply, this.createFee).then(function(receipt){
                console.log('receipt:', receipt)
                that.isShowAddress = 2;
                alert('创建成功')
            }).catch((error) => {
                console.log('error:',error);  // 输出错误
                return
            })
        }

    }

}
</script>

<style>

</style>