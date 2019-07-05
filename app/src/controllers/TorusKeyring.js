const EventEmitter = require('events').EventEmitter
const Wallet = require('ethereumjs-wallet')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const log = require('loglevel')
const type = 'Torus Keyring'

export default class TorusKeyring extends EventEmitter {
  constructor(opts) {
    super()
    this.type = type
    this.wallets = []
    this.deserialize(opts)
    log.info('wallet initialised')
  }

  serialize() {
    return Promise.resolve(this.wallets.map(this.generatePrivKey))
  }

  generatePrivKey(wallet) {
    return wallet.getPrivateKey().toString('hex')
  }

  generateWallet(privateKey) {
    const stripped = ethUtil.stripHexPrefix(privateKey)
    const buffer = Buffer.from(stripped, 'hex')
    const wallet = Wallet.fromPrivateKey(buffer)
    return wallet
  }

  deserialize(privateKeys = []) {
    return new Promise((resolve, reject) => {
      try {
        this.wallets = privateKeys.map(this.generateWallet)
      } catch (e) {
        reject(e)
      }
      resolve()
    })
  }

  addAccount(privKey) {
    return new Promise(async (resolve, reject) => {
      try {
        for (let index = 0; index < this.wallets.length; index++) {
          const element = this.generatePrivKey(this.wallets[index])
          if (element === privKey) reject(new Error('Already added'))
        }
        this.wallets.push(this.generateWallet(privKey))
      } catch (error) {
        reject(error)
      }
      resolve()
    })
  }

  addRandomAccounts(n = 1) {
    var newWallets = []
    for (var i = 0; i < n; i++) {
      newWallets.push(Wallet.generate())
    }
    this.wallets = this.wallets.concat(newWallets)
    const hexWallets = newWallets.map(w => ethUtil.bufferToHex(w.getAddress()))
    return Promise.resolve(hexWallets)
  }

  getAccounts() {
    return Promise.resolve(this.wallets.map(w => ethUtil.bufferToHex(w.getAddress())))
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction(tx, address) {
    const wallet = this._getWalletForAccount(address)
    var privKey = wallet.getPrivateKey()
    tx.sign(privKey)
    return Promise.resolve(tx)
  }

  // For eth_sign, we need to sign arbitrary data:
  signMessage(withAccount, data) {
    const wallet = this._getWalletForAccount(withAccount)
    const message = ethUtil.stripHexPrefix(data)
    var privKey = wallet.getPrivateKey()
    var msgSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privKey)
    var rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
    return Promise.resolve(rawMsgSig)
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage(withAccount, msgHex) {
    const wallet = this._getWalletForAccount(withAccount)
    const privKey = ethUtil.stripHexPrefix(wallet.getPrivateKey())
    const privKeyBuffer = Buffer.from(privKey, 'hex')
    const sig = sigUtil.personalSign(privKeyBuffer, { data: msgHex })
    return Promise.resolve(sig)
  }

  // personal_signTypedData, signs data along with the schema
  signTypedData(withAccount, typedData) {
    const wallet = this._getWalletForAccount(withAccount)
    const privKey = ethUtil.toBuffer(wallet.getPrivateKey())
    const sig = sigUtil.signTypedData(privKey, { data: typedData })
    return Promise.resolve(sig)
  }

  // exportAccount should return a hex-encoded private key:
  exportAccount(address) {
    const wallet = this._getWalletForAccount(address)
    return Promise.resolve(wallet.getPrivateKey().toString('hex'))
  }

  removeAccount(address) {
    if (!this.wallets.map(w => ethUtil.bufferToHex(w.getAddress()).toLowerCase()).includes(address.toLowerCase())) {
      throw new Error(`Address ${address} not found in this keyring`)
    }
    this.wallets = this.wallets.filter(w => ethUtil.bufferToHex(w.getAddress()).toLowerCase() !== address.toLowerCase())
  }

  /* PRIVATE METHODS */

  _getWalletForAccount(account) {
    const address = sigUtil.normalize(account)
    let wallet = this.wallets.find(w => ethUtil.bufferToHex(w.getAddress()) === address)
    if (!wallet) throw new Error('Torus Keyring - Unable to find matching address.')
    return wallet
  }
}
TorusKeyring.type = type