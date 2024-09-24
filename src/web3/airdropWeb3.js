import Web3 from 'web3'
import Decimal from 'decimal.js';
import tools from '../json/tools.json'
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
			console.log(accounts[0])
			let netId =  await this.web3.eth.net.getId();//获取当前连接的区块链网络
			console.log(netId);
			if(netId == 97) {
				this.toolsInstance = new this.web3.eth.Contract(tools.contractABI, tools.contractAddress);
				this.getToolsFee();
			} else {
				alert('请切换到币安主网');
			}
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

	getTokenDecimals() {
		let that = this;
		this.web3.eth.call({
			to: '0x55d398326f99059fF775485246999027B3197955',
			data: "0x313ce567"
		}).then(decimals => {
			// var decimals = "0x"+res.substring(res.length, 64)
			console.log(decimals);
			console.log(that.web3.utils.hexToNumber(decimals))
		})
	},

	getToolsFee() {
		let that = this;
		this.toolsInstance.methods.getToolsFee().call().then(function(toolsFee) {
			// console.log('toolsFee:',toolsFee)
			that.toolsFee = that.weiToEther(toolsFee);
		})
	},

	//获取代币授权数量
	getTokenAllowanceAmount(tokenAddress) {
		return new Promise((resolve) => {
			this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
            this.tokenInstance.methods.allowance(this.account, tools.contractAddress).call().then(function(allowanceAmount) {
				console.log('allowanceAmount:',allowanceAmount)
                resolve(allowanceAmount)
            })
        })
	},

	//授权合约使用代币
	approveContract(tokenAddress) {
		return new Promise((resolve, reject) => {
			this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
			this.tokenInstance.methods.approve(tools.contractAddress, tools.MAX_NUMBER).send({from:this.account})
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

	//批量发送ETH
	sendEth(addressArray, amountsArray) {
		let sendValue = 0;
		let feeValue = new Decimal(this.toolsFee).times(addressArray.length).toString();
		for(let i = 0; i < amountsArray.length; i++) {
			sendValue = new Decimal(sendValue).plus(amountsArray[i]).toString();
			amountsArray[i] = this.web3.utils.toWei(amountsArray[i], 'ether')
		}
		let allValue = new Decimal(feeValue).plus(sendValue).toString();
		console.log(sendValue);
		console.log(feeValue);
		console.log(allValue);
		return new Promise((resolve, reject) => {
            this.toolsInstance.methods.sendEth(addressArray, amountsArray)
			.send({
				from: this.account,
				value: this.etherToWei(allValue)
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

	//批量发送erc20代币
	sendErc20(tokenAddress, addressArray, amountsArray) {
		let addressArrayNew = [];
		let amountsArrayNew = [];
		for(let i = 0; i < amountsArray.length; i++) {
			addressArrayNew.push(addressArray[i]);
			// amountsArrayNew.push(this.etherToWei(amountsArray[i]));
		}
		return new Promise((resolve, reject) => {
            this.toolsInstance.methods.sendErc20(tokenAddress, addressArrayNew, amountsArrayNew)
			.send({
				from: this.account,
				value: this.etherToWei(new Decimal(this.toolsFee).times(addressArray.length + 1).toString())
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