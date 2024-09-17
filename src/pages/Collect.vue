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
                            <input class="form-control" v-model="tokenAddress" placeholder="请输入代币地址">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">归集地址：</label>
                        <div class="col-sm-6">
                            <textarea class="form-control" v-model="collection" rows="10" placeholder="地址私钥，每行一个，请确保私钥前加上0x"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">收币地址：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="receiveAddress" placeholder="请输入收币地址">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Gas Price(gwei)：</label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="gasPrice" placeholder="请输入收币地址">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Gas Limit：</label>
                        <div class="col-sm-6">
                            <input type="number" class="form-control" v-model="gasLimit" placeholder="请输入收币地址">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6" v-if="selected==='1'">
                            <button type="submit" class="btn btn-primary" @click="collectEth()">执行</button>
                        </div>
                        <div class="col-sm-6" v-if="selected==='2'">
                            <button type="submit" class="btn btn-primary" @click="collectToken()">执行</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6" v-if="collectResult===1">
                            <span type="submit" style="color: green;">地址 {{ sendAddress }} 执行成功,</span>
                            <span type="submit" style="color: green;">交易哈希：{{ transactionHash }}</span>
                        </div>
                        <div class="col-sm-6" v-if="collectResult===2">
                            <span type="submit" style="color: red;">地址 {{ sendAddress }} 执行失败,</span>
                            <span type="submit" style="color: red;">交易哈希：{{ transactionHash }}</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Collect from '../web3/collectWeb3'
export default {
    name: 'CollectPage',
    data() {
        return {
            selected: '1',
            styleTag: 'display: none',
            tokenAddress: '',
            receiveAddress: '',
            collection: '',
            collectionArray: [],
            addressArray: [],
            sendAddress: '123',
            transactionHash: '456',
            gasPrice: 0,
            gasLimit: 21000,
            collectResult: 0,
            tokenBalance: 0,
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
                Collect.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    this.gatGasPrice()
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

        gatGasPrice() {
            let that = this
            Collect.gatGasPrice().then(function (gasPrice) {
            that.gasPrice = gasPrice
            })
        },

        collectEth() {
            let that = this;
            let collectionArrayNew = [];
            this.collectionArray = this.collection.split('\n').map(line => line.trim());
            for(let i = 0; i < this.collectionArray.length; i++) {
                collectionArrayNew[i] = this.collectionArray[i];
            }
            for(let i = 0; i < collectionArrayNew.length; i++) {
                Collect.getEthBalance(Collect.privateKeyToAccount(collectionArrayNew[i])).then(function (ethBalance) {
                    Collect.collectEth(that.receiveAddress, collectionArrayNew[i], ethBalance, that.gasPrice, that.gasLimit).then(function(receipt){
                        that.collectResult = 1;
                        that.sendAddress = Collect.privateKeyToAccount(collectionArrayNew[i]);
                        that.transactionHash = receipt;
                        console.log('receipt:', receipt)
                    }).catch((error) => {
                        that.collectResult = 2;
                        that.sendAddress = Collect.privateKeyToAccount(collectionArrayNew[i]);
                        that.transactionHash = error;
                        console.log('error:', error);  // 输出错误
                        return
                    })
                })
            }
        },

        collectToken(){
            let that = this;
            let collectionArrayNew = [];
            this.collectionArray = this.collection.split('\n').map(line => line.trim());
            for(let i = 0; i < this.collectionArray.length; i++) {
                collectionArrayNew[i] = this.collectionArray[i];
            }
            for(let i = 0; i < collectionArrayNew.length; i++) {
                Collect.getTokenBalance(this.tokenAddress, Collect.privateKeyToAccount(collectionArrayNew[i])).then(function (tokenBalance) {
                    Collect.collectToken(that.tokenAddress, that.receiveAddress, collectionArrayNew[i], tokenBalance, that.gasPrice, that.gasLimit).then(function(receipt){
                        that.collectResult = 1;
                        that.sendAddress = Collect.privateKeyToAccount(collectionArrayNew[i]);
                        that.transactionHash = receipt;
                        console.log('receipt:', receipt)
                    }).catch((error) => {
                        that.collectResult = 2;
                        that.sendAddress = Collect.privateKeyToAccount(collectionArrayNew[i]);
                        that.transactionHash = error;
                        console.log('error:', error);  // 输出错误
                        return
                    })
                })
            }
        },
    }

}
</script>

<style>

</style>