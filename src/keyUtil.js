import { promisify } from 'util'
import { exec } from 'child_process'
import config from './config'
const execAsync = promisify(exec);

const q = (str) => str.replace("\"","\\\"")

const setCommand = (user, service, key) => `security add-generic-password -a "${q(user)}" -s "${q(service)}" -w "${q(key)}"`
const getCommand = (user, service) => `security find-generic-password -a "${q(user)}" -s "${q(service)}" -w`
const delCommand = (user, service) => `security delete-generic-password -a "${q(user)}" -s "${q(service)}"`

export const set = async (service, key) => {
  return await execAsync(setCommand(config.account, service, key))
}

export const get = async (service) => {
  const { stdout, stderr } = await execAsync(getCommand(config.account, service))
  return stdout.trim()
}

export const del = async (service) => {
  return await execAsync(delCommand(config.account, service))
}
