<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">代币选择：</label>
                        <div class="col-sm-6">
                            <select class="form-control" v-model="selected" @change="getAirdropTokenSort">
                                <option value="1">BNB</option>
                                <option value="2">BRC20</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" :style="styleTag">
                        <label class="col-sm-2 control-label">代币地址：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="tokenAddress" placeholder="请输入代币地址" @input="getTokenAllowanceAmount()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">收款地址和数量：</label>
                        <div class="col-sm-6">
                            <textarea class="form-control" v-model="collection" rows="10" placeholder="每一行应包括地址和数量，逗号分隔"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6" v-if="selected==='1'">
                            <button type="submit" class="btn btn-primary" @click="sendEth()">发送</button>
                        </div>
                        <div class="col-sm-6" v-if="selected==='2'">
                            <button type="submit" v-if="allowanceAmount > 0" class="btn btn-primary" @click="sendErc20()">发送</button>
                            <button type="submit" v-if="allowanceAmount == 0" class="btn btn-primary" @click="approveContract()">授权</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Airdrop from '../web3/airdropWeb3'
export default {
    name: 'AirdropPage',
    data() {
        return {
            selected: '1',
            styleTag: 'display: none',
            tokenAddress: '',
            collection: '',
            collectionArray: [],
            addressArray: [],
            amountsArray: [],
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
                Airdrop.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    Airdrop.getTokenDecimals()
                });
            });
        },

        getAirdropTokenSort() {
            if(this.selected === '2') {
                this.styleTag = 'display: block';
            } else {
                this.styleTag = 'display: none';
            }
        },

        //加载代币实例
        loadTokenInstance() {
            Airdrop.getTokenDecimals(this.tokenAddress);
            this.getTokenAllowanceAmount();
        },

        //获取代币授权数量
        getTokenAllowanceAmount() {
            let that = this
            Airdrop.getTokenAllowanceAmount(this.tokenAddress).then(function (allowanceAmount) {
                that.allowanceAmount = allowanceAmount
            })
        },

        //代币授权
        approveContract() {
            let that = this
            Airdrop.approveContract(this.tokenAddress).then(function(receipt){
                console.log('receipt:', receipt)
                that.getTokenAllowanceAmount()
                alert('授权代币成功')
            }).catch((error) => {
                console.log('error:',error.error.message);  // 输出错误
                return
            })
        },

        sendEth() {
            this.collectionArray = this.collection.split('\n').map(line => line.trim());
            console.log(this.collectionArray);
            for(let i = 0; i < this.collectionArray.length; i++) {
                this.addressArray.push(this.collectionArray[i].split(",").map(line => line.trim())[0]);
                this.amountsArray.push(this.collectionArray[i].split(",").map(line => line.trim())[1]);
            }
            console.log(JSON.parse(JSON.stringify(this.collectionArray)));
            console.log(JSON.parse(JSON.stringify(this.addressArray)));
            console.log(JSON.parse(JSON.stringify(this.amountsArray)));
            Airdrop.sendEth(JSON.parse(JSON.stringify(this.addressArray)), JSON.parse(JSON.stringify(this.amountsArray))).then(function(receipt){
                console.log('receipt:', receipt)
                alert('发送成功')
            }).catch((error) => {
                console.log('error:',error);  // 输出错误
                return
            })
        },

        sendErc20() {
            this.collectionArray = this.collection.split('\n');
            console.log('collectionArray:' + this.collectionArray);
            for(let i = 0; i < this.collectionArray.length; i++) {
                this.addressArray.push(this.collectionArray[i].split(",")[0]);
                this.amountsArray.push(this.collectionArray[i].split(",")[1]);
            }
            Airdrop.sendErc20(this.tokenAddress, this.addressArray, this.amountsArray).then(function(receipt){
                console.log('receipt:', receipt)
                alert('发送成功')
            }).catch((error) => {
                console.log('error:',error);  // 输出错误
                return
            })
        },


    }

}
</script>

<style>

</style>