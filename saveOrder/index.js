'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (orderEvent) => {

  const parsedOrderEvent = JSON.parse(orderEvent);
  const parsedOrder = JSON.parse(parsedOrderEvent.MessageBody);

  const params = {
    TableName : 'slack-n-snack',
    Item: parsedOrder,
  };

  try {
    const response = await dynamodb.put(params).promise();
    console.log('DATABASE SUCCESS RESPONSE:', response);
  } catch (e) {
    console.error('ERROR IN SAVE ORDER:', e.message);
  }
};
