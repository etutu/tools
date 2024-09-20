<template>
  <div>
    <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <h3>我的锁</h3>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-6">
                            <table class="table">
                                <tr v-for="(item, index) in myLocks" :key="index">
                                    <td>锁定{{ item.tokenName }}-{{ item.amount }}{{ item.tokenName }}</td>
                                    <td>锁定：{{ item.lockDate }} 解锁：{{ item.unlockDate }}</td>
                                    <td>
                                        <button type="submit" class="btn btn-primary" @click="editLock(item.id, item.unlockDate)">延迟</button> 
                                        <button type="submit" class="btn btn-primary" :disabled="item.unlockDate > getTimestamp()" @click="unlock(item.id)">提取</button> 
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import LockedLp from '../web3/lockedLpWeb3'
export default {
    name: 'LockedLp',
    data() {
        return {
            myLocks: [],
            tokenName: '',
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
                LockedLp.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    this.lpLocksForUser()
                });
            });
        },

        getTimestamp() {
            return new Date().getTime();
        },

        lpLocksForUser() {
            let that = this
            LockedLp.lpLocksForUser().then(function (myLocks) {
                that.myLocks = myLocks
            })
        },

        editLock(id, unlockDate) {
            console.log('unlockDate', unlockDate);
            let timestamp = this.getTimestamp();
            LockedLp.editLock(id, timestamp).then(function (receipt) {
                console.log('receipt:', receipt)
                alert('操作成功')
            }).catch((error) => {
                console.log('error:',error.error.message);  // 输出错误
                return
            })
        },

        unlock(id) {
            LockedLp.unlock(id).then(function (receipt) {
                console.log('receipt:', receipt)
                alert('提取成功')
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