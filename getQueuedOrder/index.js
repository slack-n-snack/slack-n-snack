'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const lambda = new AWS.Lambda();

exports.handler = function(orderEvent) {

  const parsedOrder = JSON.parse(orderEvent.Records[0].body);

  const orderMessage = {
    QueueUrl: parsedOrder.storeId,
    MessageBody: parsedOrder,
  };

  const orderMessageJSON = JSON.stringify(JSON.stringify(orderMessage)); // No idea why, but it only works this way

  const databaseParams = {
    FunctionName: 'saveOrder',
    Payload: orderMessageJSON,
  };

  lambda.invoke(databaseParams, function(err, data) {
    if (err) console.log('ERROR IN getQueueOrder LAMBDA CALL:', err);
    else console.log('saveOrder LAMBDA RETURN VALUE:', data);
  });

  const orderConfirmationParams = {
    FunctionName: 'sendOrderConfirmation',
    Payload: orderMessageJSON,
  };

  lambda.invoke(orderConfirmationParams, function(err, data) {
    if (err) console.log('ERROR IN orderDeliveryConfirmation LAMBDA CALL:', err);
    else console.log('orderDeliveryConfirmation LAMBDA RETURN VALUE:', data);
  });

  const deliveryConfirmationParams = {
    FunctionName: 'sendDeliveryConfirmation',
    Payload: orderMessageJSON,
  };

  lambda.invoke(deliveryConfirmationParams, function(err, data) {
    if (err) console.log('ERROR IN sendDeliveryConfirmation LAMBDA CALL:', err);
    else console.log('sendDeliveryConfirmation LAMBDA RETURN VALUE:', data);
  });
};
