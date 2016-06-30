'use strict'
var Rx = require('rxjs/Rx');
var mailchimp = require('mailchimp-v3')
var R = require('ramda')
var rp = require('request-promise');


const prepareMemberForBatch = require('./commands').prepareMemberForBatch
const updateList = require('./commands').updateList
const defaults = require('./defaults')




/**
 * @param {String} opts
 * @param {String} opts.apiKey - MAILCIMP API KEY
 * @param {String} opts.listId - MAILCIMP list id
 * @param {String} opts.membersUrl - url to fetch memebers
 * @param {Function} opts.apiResponseFormatter - api output data formatter
 * @param {Integer} opts.intervalTime - interval between fetches in seconds
 * @param {Object} opts.memberMapper - object to map member data 
 * @param {Function} opts.callback - update callback
 * @param {Object} opts.requestOpts - additional request options

 * @return {MailchimpListUpdater new object} element
 */

const MailchimpListUpdater = function (opts) {
  // exceptions for undefined opts
  if (!opts.apiKey) {
    throw new Error('No api key provided')
  }
  if (!opts.listId) {
    throw new Error('No list id provided')
  }
  
  mailchimp.setApiKey(opts.apiKey);
  
  
  opts = Object.assign(defaults, opts)
  let membersRequestOptions = {
      uri: opts.membersUrl,
  };
  Object.assign(membersRequestOptions, opts.requestOpts)
  
  
  let updateMembers = R.compose(
    updateList(opts.listId, opts.callback),
    R.map(prepareMemberForBatch(opts.memberMapper)),
    opts.apiResponseFormatter)
  
  let updateMembersObservable = new Rx.Observable.create(function (observer) {
    Rx.Observable.interval(opts.intervalTime).subscribe(function () {
      rp(membersRequestOptions)
        .then(data => {
          return observer.next(data)
        })
        .catch(err => console.log(err))
    })
  })


  updateMembersObservable.subscribe(updateMembers)
}

module.exports = MailchimpListUpdater