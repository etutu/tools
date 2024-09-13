<template>
  <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Wei：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Wei" @input="transformUnit(1, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Kwei, Babbage, Femtoether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Kwei" @input="transformUnit(2, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Mwei, Lovelace, Picoether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Mwei" @input="transformUnit(3, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Gwei, Shannon, Nanoether, Nano：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Gwei" @input="transformUnit(4, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Szabo, Microether, Micro：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Szabo" @input="transformUnit(5, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Finney, Milliether, Milli：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Finney" @input="transformUnit(6, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Ether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Ether" @input="transformUnit(7, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Kether, Grand：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Kether" @input="transformUnit(8, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Mether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Mether" @input="transformUnit(9, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Gether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Gether" @input="transformUnit(10, $event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Tether：</label>
                        <div class="col-sm-6">
                            <input class="form-control" v-model="Tether" @input="transformUnit(11, $event)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Transform from '../web3/transformWeb3'
export default {
    name: 'transformPage',
    data() {
        return {
            Wei: 0,
            Kwei: 0,
            Mwei: 0,
            Gwei: 0,
            Szabo: 0,
            Finney: 0,
            Ether: 0,
            Kether: 0,
            Mether: 0,
            Gether: 0,
            Tether: 0,
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
                Transform.initWeb3().then(() => {
                    // 等待web3初始化完成后执行web3方法
                    // this.getAddressData()
                });
            });
        },

        transformUnit(unit, event) {
            let data = Transform.transformUnit(unit, event.target.value);
            this.Wei = data[0];
            this.Kwei = data[1];
            this.Mwei = data[2];
            this.Gwei = data[3];
            this.Szabo = data[4];
            this.Finney = data[5];
            this.Ether = data[6];
            this.Kether = data[7];
            this.Mether = data[8];
            this.Gether = data[9];
            this.Tether = data[10];
        }
    }
}
</script>

<style>

</style>