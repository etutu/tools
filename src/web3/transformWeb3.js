import Web3 from 'web3'
import create from '../json/createToken.json'

const web3 = {
    async initWeb3() {
        /*
        '1': Ethereum Main Network
        '2': Morden Test network
        '3': Ropsten Test Network
        '4': Rinkeby Test Network
        '5': Goerli Test Network
        '42': Kovan Test Network
        '56': Binance Main Network
        '97': Binance Test Network
        */
		if (window.ethereum) {
			//初始化Web3
			this.web3 = new Web3(window.ethereum)
			// console.log(this.web3.utils.toWei(_ethAmount, 'ether'))
			//第一次和metamask连接
			const accounts = await this.web3.eth.requestAccounts();
			this.account = accounts[0]
			console.log(accounts[0])
			this.createInstance = new this.web3.eth.Contract(create.contractABI, create.contractAddress);
			window.ethereum.on('accountsChanged', function (accounts) {
				this.account = accounts[0]
				console.log("当前账户发生更改:" + accounts)
                window.location.reload()
			})
			window.ethereum.on('chainChanged', function (networkVersion) {
				console.log("chainChanged:" + networkVersion)
			})
		}else{
			alert("请安装MetaMask钱包")
		}
	},

	etherToWei(value) {
		return this.web3.utils.toWei(value, 'ether')
	},

	weiToEther(value) {
		return this.web3.utils.fromWei(value, 'ether')
	},

	transformUnit(unit, value) {
		if(unit === 1) {
			return this.transformUnitFromWei(value);
		}
		if(unit === 2) {
			value = this.web3.utils.toWei(value, 'Kwei');
			return this.transformUnitFromWei(value);
		}
		if(unit === 3) {
			value = this.web3.utils.toWei(value, 'Mwei');
			return this.transformUnitFromWei(value);
		}
		if(unit === 4) {
			value = this.web3.utils.toWei(value, 'Gwei');
			return this.transformUnitFromWei(value);
		}
		if(unit === 5) {
			value = this.web3.utils.toWei(value, 'szabo');
			return this.transformUnitFromWei(value);
		}
		if(unit === 6) {
			value = this.web3.utils.toWei(value, 'finney');
			return this.transformUnitFromWei(value);
		}
		if(unit === 7) {
			value = this.web3.utils.toWei(value, 'ether');
			return this.transformUnitFromWei(value);
		}
		if(unit === 8) {
			value = this.web3.utils.toWei(value, 'kether');
			return this.transformUnitFromWei(value);
		}
		if(unit === 9) {
			value = this.web3.utils.toWei(value, 'mether');
			return this.transformUnitFromWei(value);
		}
		if(unit === 10) {
			value = this.web3.utils.toWei(value, 'gether');
			return this.transformUnitFromWei(value);
		}
		if(unit === 11) {
			value = this.web3.utils.toWei(value, 'tether');
			return this.transformUnitFromWei(value);
		}
	},

	transformUnitFromWei(Wei) {
		if(Wei > 0) {
			let Kwei = this.web3.utils.fromWei(Wei, 'Kwei');
			let Mwei = this.web3.utils.fromWei(Wei, 'Mwei');
			let Gwei = this.web3.utils.fromWei(Wei, 'Gwei');
			let Szabo = this.web3.utils.fromWei(Wei, 'szabo');
			let Finney = this.web3.utils.fromWei(Wei, 'finney');
			let Ether = this.web3.utils.fromWei(Wei, 'ether');
			let Kether = this.web3.utils.fromWei(Wei, 'kether');
			let Mether = this.web3.utils.fromWei(Wei, 'mether');
			let Gether = this.web3.utils.fromWei(Wei, 'gether');
			let Tether = this.web3.utils.fromWei(Wei, 'tether');
			return [Wei, Kwei, Mwei, Gwei, Szabo, Finney, Ether, Kether, Mether, Gether, Tether];
		} else {
			return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		}
		
	},

	getCreateFee() {
		let that = this;
		return new Promise((resolve) => {
            this.createInstance.methods.getCreateFee().call().then(function(createFee) {
				console.log('createFee:', createFee)
                resolve(that.weiToEther(createFee))
            })
        })
	},

	calculateAddr(name, symbol, decimals, totalSupply) {
		return new Promise((resolve) => {
            this.createInstance.methods.calculateAddr(name, symbol, decimals, totalSupply).call({from: this.account}).then(function(address) {
				console.log('name:', name)
				console.log('symbol:', symbol)
				console.log('decimals:', decimals)
				console.log('totalSupply:', totalSupply)
				console.log('address:', address)
                resolve(address)
            })
        })
	},

	createToken(name, symbol, decimals, totalSupply, createFee) {
		createFee = this.etherToWei(createFee);
		return new Promise((resolve, reject) => {
            this.createInstance.methods.createToken(name, symbol, decimals, totalSupply)
			.send({
				from: this.account,
				value: createFee
			})
			.on('receipt', function(receipt){
				// console.log({receipt:receipt})
				resolve(receipt)
			})
			.on('error', function(error,receipt){
				// console.log({error:error,receipt:receipt})
				reject({error:error,receipt:receipt})
			})
			.catch((error) => {
				reject({error:error})
			})
        })
	},
}

export default web3;