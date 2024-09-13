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
			this.toolsInstance = new this.web3.eth.Contract(tools.contractABI, tools.contractAddress);
			// this.gatGasPrice();
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

	getToolsFee() {
		let that = this;
		this.toolsInstance.methods.getToolsFee().call().then(function(toolsFee) {
			// console.log('toolsFee:',toolsFee)
			that.toolsFee = that.weiToEther(toolsFee);
		})
	},

    gatGasPrice() {
        return new Promise((resolve) => {
            let that = this;
            this.web3.eth.getGasPrice().then(function(res) {
                resolve(that.web3.utils.fromWei(res, 'Gwei'))
            })
        })
    },

    //归集ETH
    async collectEth(receiveAddress, privateKey, ethBalance, gasPrice, gasLimit) {
        gasPrice = this.web3.utils.toWei(gasPrice, 'Gwei');
        let that = this;
        let address = this.privateKeyToAccount(privateKey);
        let gasFee = new Decimal(this.web3.utils.fromWei(gasPrice, 'ether')).times(gasLimit).toString();
        let transferBalance = new Decimal(this.weiToEther(ethBalance)).sub(gasFee).toString();
        console.log('gasPrice:', gasPrice);
        console.log('gasLimit:', gasLimit);
        console.log('gasFee:', gasFee);
        console.log('ethBalance:', ethBalance);
        console.log('transferBalance:', transferBalance);
        if(transferBalance > 0) {
            await this.web3.eth.accounts.signTransaction(
                {
                    // this could be provider.addresses[0] if it exists
                    from: address, 
                    // target address, this could be a smart contract address
                    to: receiveAddress, 
                    // gasPrice
                    gasPrice: gasPrice,
                    // optional if you want to specify the gas limit 
                    gas: gasLimit,
                    // optional if you are invoking say a payable function 
                    value: this.etherToWei(transferBalance),
                    // this encodes the ABI of the method and the arguements
                    // data: 
                }, privateKey).then((res) => {
                that.sign = res.rawTransaction;
            });
            return new Promise((resolve, reject) => {
                this.web3.eth.sendSignedTransaction(this.sign)
                .on('receipt', function(receipt){
                    console.log({receipt: receipt})
                    resolve(receipt.transactionHash)
                })
                .on('error', function(error,receipt){
                    console.log({error:error,receipt:receipt})
                    reject({receipt: receipt.transactionHash})
                })
                .catch((error) => {
                    reject({error: error})
                })
            })
        }
    },

    //归集代币
    async collectToken(tokenAddress, receiveAddress, privateKey, tokenBalance, gasPrice, gasLimit) {
        if(tokenBalance > 0) {
            let that = this;
            let address = this.privateKeyToAccount(privateKey);
            let tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
            await this.web3.eth.accounts.signTransaction(
                {
                    // this could be provider.addresses[0] if it exists
                    from: address, 
                    // target address, this could be a smart contract address
                    to: tokenAddress, 
                    // gasPrice
                    gasPrice: this.web3.utils.toWei(gasPrice, 'Gwei'),
                    // optional if you want to specify the gas limit 
                    gas: gasLimit,
                    // optional if you are invoking say a payable function 
                    // value: value,
                    // this encodes the ABI of the method and the arguements
                    data: tokenInstance.methods.transfer(receiveAddress, tokenBalance).encodeABI() 
                }, privateKey).then((res) => {
                that.sign = res.rawTransaction;
            });
            return new Promise((resolve, reject) => {
                this.web3.eth.sendSignedTransaction(this.sign)
                .on('receipt', function(receipt){
                    console.log({receipt: receipt})
                    resolve(receipt.transactionHash)
                })
                .on('error', function(error,receipt){
                    console.log({error:error,receipt:receipt})
                    reject({receipt: receipt.transactionHash})
                })
                .catch((error) => {
                    reject({error: error})
                })
            })
        }
    },

    async getEthBalance(address) {
        let that = this;
        await this.web3.eth.getBalance(address).then(function(balance) {
            // resolve(balance)
            that.ethBalance = balance;
        })
        return that.ethBalance;
    },

    async getTokenBalance(tokenAddress, address) {
        let that = this;
        this.tokenInstance = new this.web3.eth.Contract(token.contractABI, tokenAddress);
        await this.tokenInstance.methods.balanceOf(address).call().then(function(balance) {
            // resolve(balance)
            that.tokenBalance = balance;
        })
        return that.tokenBalance;
    },

    privateKeyToAccount(privateKey) {
        var result = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        return result['address'];
    },
}

export default web3;