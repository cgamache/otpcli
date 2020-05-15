import CryptoJS from 'crypto-js'
import { get as keyUtilGet } from './keyUtil'

const INTERVAL = 30
const BASE32CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const dec2hex = (str) => (str < 15.5 ? '0' : '') + Math.round(str).toString(16)
const hex2dec = (str) => parseInt(str, 16)
const leftPad = (str, len) => (Array(len).join('0') + str).slice(-len)
const base32tohex = (base32) => {
  const bits = base32.split('').reduce((p, c) => {
    const val = BASE32CHARS.indexOf(c.toUpperCase())
    return p + leftPad(val.toString(2), 5)
  }, '')
  return bits.match(/.{1,4}/g).reduce((p, c) => {
    return p + parseInt(c, 2).toString(16)
  }, '')
}

const totp = (key) => {
  const keyHex = base32tohex(key)
  const keyHexLength = (keyHex.length * 4) + ' bits'
  const epoch = Math.floor(Date.now() / (INTERVAL * 1000));
  const time = leftPad(dec2hex(epoch), 16)
  const messageWords = CryptoJS.enc.Hex.parse(time)
  const keyWords = CryptoJS.enc.Hex.parse(keyHex)
  const hashWords = CryptoJS.HmacSHA1(messageWords, keyWords)
  const hmac = CryptoJS.enc.Hex.stringify(hashWords)
  const offset = hex2dec(hmac.slice(-2)) & 0xf
  const hash = hmac.match(/.{1,2}/g).map((c) => {
    const d = hex2dec(c)
    return (d > 128) ? d - 256 : d
  })
  const binary = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff)
  return ('000000' + (binary % 1000000).toString()).slice(-6)
}

export const get = async (service) => {
  const key = await keyUtilGet(service)
  return totp(key)
}
