'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const lambda = new AWS.Lambda();
const { Chance } = require('chance');
const chance = new Chance();

exports.handler = function(event) {

  const parsedData = JSON.parse(event.Records[0].body);
  const message = parsedData.Message;
  const parsedMessage = JSON.parse(message);

  console.log('PARSED MESSAGE:', parsedMessage);

  const orderMessage = {
    QueueUrl: parsedMessage.storeId,
    MessageBody: message,
    MessageDeduplicationId: chance.guid(),
    MessageGroupId: chance.guid(),
  };

  const stringifiedOrderMessage = JSON.stringify(orderMessage);

  const databaseParams = {
    FunctionName: 'createOrder-SNS',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(stringifiedOrderMessage),
  };

  lambda.invoke(databaseParams, function(err, data) {
    if (err) console.log('ERROR IN getQueueOrder CALL TO DATABASE LAMBDA:', err);
    else console.log('DATABASE LAMBDA RETURN VALUE:', data);
  });

  //   const orderConfirmationParams = {
  //   FunctionName: 'createOrder-SNS',
  //   InvocationType: 'RequestResponse',
  //   LogType: 'Tail',
  //   Payload: JSON.stringify(orderMessage),
  // };

  // lambda.invoke(params, function(err, data) {
  //     console.log('DATABASE LAMBDA RETURN VALUE:', data);
  // });

  const deliveryConfirmationParams = {
    FunctionName: 'pollFIFOSnackQueue',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(stringifiedOrderMessage),
  };

  lambda.invoke(deliveryConfirmationParams, function(err, data) {
    if (err) console.log('ERROR IN getQueueOrder CALL TO DELIVERY CONFIRMATION LAMBDA:', err);
    else console.log('DELIVERY CONFIRMATION LAMBDA RETURN VALUE:', data);
  });
};
