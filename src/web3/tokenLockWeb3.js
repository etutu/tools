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

	getLockFee() {
		let that = this;
		return new Promise((resolve) => {
            this.lockInstance.methods.getLockFee().call().then(function(lockFee) {
                resolve(that.weiToEther(lockFee))
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
			console.log(that.web3.utils.hexToNumber(decimals))
		})
	},

	//获取代币授权数量
	getTokenAllowanceAmount(tokenAddress) {
		return new Promise((resolve) => {
			this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
            this.tokenInstance.methods.allowance(this.account, tokenLock.contractAddress).call().then(function(allowanceAmount) {
				console.log('allowanceAmount:',allowanceAmount)
                resolve(allowanceAmount)
            })
        })
	},

	//授权合约使用代币
	approveContract(tokenAddress) {
		return new Promise((resolve, reject) => {
			this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
			this.tokenInstance.methods.approve(tokenLock.contractAddress, tokenLock.MAX_NUMBER).send({from:this.account})
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

	lock(token, isLpToken, amount, unlockTime, lockFee) {
		amount = this.etherToWei(amount);
		lockFee = this.etherToWei(lockFee);
		return new Promise((resolve, reject) => {
			this.lockInstance.methods.lock(this.account, token, isLpToken, amount, unlockTime)
			.send({
				from:this.account,
				value: lockFee
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