import Web3 from 'web3'
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
			this.web3 = new Web3('https://bsc.publicnode.com')
			// console.log(this.web3.utils.toWei(_ethAmount, 'ether'))
			//第一次和metamask连接
			// const accounts = await this.web3.eth.requestAccounts();
			// this.account = accounts[0]
			// console.log(accounts[0])
			// let netId =  await this.web3.eth.net.getId();//获取当前连接的区块链网络
			// console.log(netId);
			// if(netId == 97) {
			// 	this.toolsInstance = new this.web3.eth.Contract(tools.contractABI, tools.contractAddress);
			// 	this.getToolsFee();
			// } else {
			// 	alert('请切换到币安主网');
			// }
			// window.ethereum.on('accountsChanged', function (accounts) {
			// 	this.account = accounts[0]
			// 	console.log("当前账户发生更改:" + accounts)
            //     window.location.reload()
			// })
			// window.ethereum.on('chainChanged', function (networkVersion) {
			// 	console.log("chainChanged:" + networkVersion)
			// })
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
			return 0;
		}
	},

	getTokenDecimals(tokenAddress) {
		let that = this;
		this.web3.eth.call({
			to: tokenAddress,
			data: "0x313ce567"
		}).then(decimals => {
			// var decimals = "0x"+res.substring(res.length, 64)
			console.log(decimals);
			console.log(that.web3.utils.hexToNumber(decimals))
		})
	},

	async checkEthBalance(address) {
		let balance = await this.web3.eth.getBalance(address);
		return this.weiToEther(balance);
	},

	async checkTokenBalance(tokenAddress, address) {
		return new Promise((resolve) => {
			this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
			this.tokenInstance.methods.balanceOf(address).call().then(function(balance) {
				resolve(balance)
			})
		})
	},
}

export default web3;