'use strict';

const https = require('https');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

exports.handler = (orderEvent) => {

  const parsedMessageBody = JSON.parse(orderEvent).MessageBody;
  const parsedOrder = JSON.parse(parsedMessageBody.Message);

  const payload = JSON.stringify({
    text: `Your order from ${parsedOrder.storeName} with order ID ${parsedOrder.id} has been recieved! Your order is: ${parsedOrder.userOrder.meal}, ${parsedOrder.userOrder.side}, and ${parsedOrder.userOrder.drink} for a total of: $${parsedOrder.userOrder.cost.toFixed(2)}`,
  });

  const options = {
    hostname: 'hooks.slack.com',
    path: 'https://hooks.slack.com/services/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',
    method: 'POST',
  };

  const req = https.request(options,
    (res) => res.on('data', () => console.log('sendOrderConfirmation successful')));
  req.on('error', (error) => console.log('ERROR IN sendOrderConfirmation LAMBDA:', error));
  req.write(payload);
  req.end();
};
