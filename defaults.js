'use strict'

const R = require('ramda')

const intervalTime = 1000

const requestOpts = {
  json: true // Automatically parses the JSON string in the response
}

const memberMapper = {
  email_address: R.prop('email'),
  status: () => 'subscribed'
}

module.exports = {
  intervalTime,
  apiResponseFormatter: d => d,
  memberMapper,
  requestOpts
}