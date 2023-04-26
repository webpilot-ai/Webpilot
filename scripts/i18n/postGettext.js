/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const jsonfile = require('jsonfile')

const enMessages = require('../../assets/locales/en/messages.json')
const cnMessages = require('../../assets/locales/zh_CN/messages.json')

const {en: latestResource} = require('./gettextOutput/translations.json')

const enMessagesPath = path.resolve(__dirname, '../../assets/locales/en/messages.json')
const cnMessagesPath = path.resolve(__dirname, '../../assets/locales/zh_CN/messages.json')

const WHITELIST = ['extensionDescription']

main()

function main() {
  const leftTransformedCnMessages = pickIntersection(latestResource, cnMessages)

  const enRes = genEnMessages(latestResource)
  const cnRes = genCnMessages(latestResource, leftTransformedCnMessages)

  const callback = err => {
    if (err) console.error(err)
  }

  fs.rm(path.resolve(__dirname, './gettextOutput/en.po'), callback)

  jsonfile.writeFile(enMessagesPath, enRes, {spaces: 2}, callback)
  jsonfile.writeFile(cnMessagesPath, cnRes, {spaces: 2}, callback)
}

function genEnMessages(resource) {
  const whitelistMessages = pickWhitelistMessages(enMessages)

  return Object.keys(resource).reduce((acc, key) => {
    const messageKey = getMessageKey(key)
    acc[messageKey] = {
      message: key,
    }

    return acc
  }, whitelistMessages)
}

function genCnMessages(resource, transformedMessages) {
  const whitelistMessages = pickWhitelistMessages(cnMessages)

  return Object.keys(resource).reduce((acc, key) => {
    const messageKey = getMessageKey(key)
    acc[messageKey] = {
      message: transformedMessages[key]?.message ?? '',
    }

    return acc
  }, whitelistMessages)
}

function pickIntersection(resource, messages) {
  return Object.keys(resource).reduce((acc, key) => {
    const messageKey = getMessageKey(key)
    if (messages[messageKey]) {
      acc[key] = messages[messageKey]
    }

    return acc
  }, {})
}

function pickWhitelistMessages(messages) {
  return WHITELIST.reduce((acc, key) => {
    if (messages[key]) {
      acc[key] = messages[key]
    }
    return acc
  }, {})
}

function getMessageKey(text) {
  return text.replace(/[^A-Za-z0-9_]/g, '_')
}
