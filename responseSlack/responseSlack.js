'use strict';

// This lambda function is used to post a order delivery message to the slack channel

const https = require('https');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

exports.handler = (orderEvent) => {
    
  const parsedEvent = JSON.parse(orderEvent.Records[0].body);
  const parsedOrder = JSON.parse(parsedEvent.Message);

  const payload = JSON.stringify({
    text: `Your order from ${parsedOrder.storeName} with order ID ${parsedOrder.id} for ${parsedOrder.userOrder.meal}, ${parsedOrder.userOrder.side}, and ${parsedOrder.userOrder.drink} has been delivered!`,
  });
    
  const options = {
    hostname: "hooks.slack.com",
    path: "<Slack API webhook goes here>",
    method: 'POST'
  };

  const req = https.request(options,
    (res) => res.on("data", () => console.log('responseSlack successfully sent!')))
    req.on("error", (error) => console.log('ERROR IN responseSlack', error));
    req.write(payload);
    req.end();
};