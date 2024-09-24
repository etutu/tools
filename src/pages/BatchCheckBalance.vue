<template>
  <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币地址：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="tokenAddress" placeholder="请输入代币地址">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">查询地址列表：</label>
                        <div class="col-sm-6">
                            <textarea class="form-control" v-model="collection" rows="10" placeholder="每一行输入一个地址"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <button type="submit" class="btn btn-primary" @click="checkBalance()">查询余额</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BatchCheckBalanceWeb3 from '../web3/batchCheckBalanceWeb3'
export default {
    name: 'BatchCheckBalance',
    data() {
        return {
            tokenAddress: '0xBB23b42Ac76090165d52181Ec08e3290243fB2a2',
            collection: '',
            addressArray: [],
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
                BatchCheckBalanceWeb3.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    // BatchCheckBalanceWeb3.getTokenDecimals()
                });
            });
        },

        checkBalance() {
            this.addressArray = this.collection.split('\n').map(line => line.trim());
            if(this.tokenAddress === '') {
                this.checkEthBalance(this.addressArray);
            } else {
                this.checkTokenBalance(this.tokenAddress, JSON.parse(JSON.stringify(this.addressArray)));
            }
            
        },

        checkEthBalance(addressArray) {
            addressArray.forEach(async (item) => {
                await BatchCheckBalanceWeb3.checkEthBalance(item).then(function(receipt){
                    console.log(item)
                    console.log(receipt)
                }).catch((error) => {
                    console.log('error:',error);  // 输出错误
                    return
                })
            });
        },

        checkTokenBalance(tokenAddress, addressArray) {
            addressArray.forEach(async (item) => {
                BatchCheckBalanceWeb3.checkTokenBalance(tokenAddress, item).then(function(receipt){
                    console.log(item)
                    console.log('balance', receipt)
                }).catch((error) => {
                    console.log('error:',error);  // 输出错误
                    return
                })
            });
        },
    }
}
</script>

<style>

</style>