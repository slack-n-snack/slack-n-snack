'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (orderEvent) => {

  console.log('orderEvent FROM saveOrder', orderEvent);

  const parsedOrderEvent = JSON.parse(orderEvent).MessageBody;
  const parsedOrder = JSON.parse(parsedOrderEvent.Message);

  const params = {
    TableName : 'slack-n-snack',
    Item: parsedOrder,
  };

  console.log('parsedOrder FROM saveOrder', parsedOrder);

  try {
    const response = await dynamodb.put(params).promise();
    console.log('DATABASE SUCCESS RESPONSE:', response);
  } catch (e) {
    console.error('ERROR IN SAVE ORDER:', e.message);
  }
};
