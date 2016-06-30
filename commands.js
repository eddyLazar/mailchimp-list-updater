'use strict'
var mailchimp = require('mailchimp-v3')
var R = require('ramda')

const logResponse = res => console.log(res);


const prepareMemberForBatch = R.curry((memberMapper, data) => {
  let fMap = R.apply(R.__, [data])
  return R.map(fMap , memberMapper)
})

const prepareMembersForBatch = R.map( R.assoc('body', R.__, {}) )


const updateList = R.curry((listId, callback, contacts) => {
  let batch = mailchimp.createBatch(`lists/${listId}/members`, 'POST')
  batch
    .add(prepareMembersForBatch(contacts))
    .send()
    .then(function () {
      if (callback) {
        callback()
      }
    })
    .catch(logResponse);
})


module.exports = {
  updateList,
  prepareMemberForBatch
}