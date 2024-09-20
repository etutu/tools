import Web3 from 'web3'
import tokenLock from '../json/tokenLock.json'
import token from '../json/token.json'

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
			this.lockInstance = new this.web3.eth.Contract(tokenLock.contractABI, tokenLock.contractAddress);
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
		if(value > 0) {
			return this.web3.utils.fromWei(value, 'ether')
		} else {
			return 0
		}
	},

	async normalLocksForUser() {
		let that = this;
		return new Promise((resolve) => {
            this.lockInstance.methods.normalLocksForUser(this.account).call().then(function(myLocks) {
				myLocks.forEach(async (item)=>{
					item.tokenName = await that.getTokenName(item.token);
					console.log(item.tokenName)
					item.amount = that.weiToEther(item.amount);
				})
				console.log(myLocks)
                resolve(myLocks)
            })
        })
	},

	getTokenDecimals(tokenAddress) {
		let that = this;
		this.web3.eth.call({
			to: tokenAddress,
			data: "0x313ce567"
		}).then(decimals => {
			// var decimals = "0x"+res.substring(res.length, 64)
			that.web3.utils.hexToNumber(decimals);
		})
	},

	async getTokenName(tokenAddress) {
		let that = this;
		return new Promise((resolve) => {
		this.web3.eth.call({
			to: tokenAddress,
			data: "0x06fdde03"
		}).then(name => {
			console.log(that.web3.utils.hexToUtf8(name))
			resolve(that.web3.utils.hexToUtf8(name))
		})
	})
	},

	editLock(id, timestamp) {
		return new Promise((resolve, reject) => {
			this.lockInstance.methods.editLock(id, token, 0, timestamp)
			.send({
				from:this.account,
			})
			.on('receipt', function(receipt){
				console.log({receipt:receipt})
				resolve(receipt)
			})
			.on('error', function(error,receipt){
				console.log({error:error,receipt:receipt})
				reject({error:error,receipt:receipt})
			})
			.catch((error) => {
				reject({error:error})
			})
		})
	},

	unlock(id) {
		return new Promise((resolve, reject) => {
			this.lockInstance.methods.unlock(id)
			.send({
				from:this.account,
			})
			.on('receipt', function(receipt){
				console.log({receipt:receipt})
				resolve(receipt)
			})
			.on('error', function(error,receipt){
				console.log({error:error,receipt:receipt})
				reject({error:error,receipt:receipt})
			})
			.catch((error) => {
				reject({error:error})
			})
		})
	},
}

export default web3;