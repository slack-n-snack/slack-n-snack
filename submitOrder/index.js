'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const { Chance } = require('chance');
const chance = new Chance();

exports.handler = (parsedOrder) => {
  const sns = new AWS.SNS();
  const topic = 'arn:aws:sns:us-west-2:363223802314:slack-orders.fifo';
  // const parsedOrder = JSON.parse(customerOrder);

  const storeQueues = {
    'Bob\'s Burgers': 'https://sqs.us-west-2.amazonaws.com/363223802314/bobs-burgers',
    'Pat\'s Pizza': 'https://sqs.us-west-2.amazonaws.com/363223802314/pats-pizza',
    'Tom\'s Tacos': 'https://sqs.us-west-2.amazonaws.com/363223802314/toms-tacos',
  };

  const storeQueue = storeQueues[parsedOrder.store];

  const orderDetails = {
    id: chance.guid(),
    storeName: parsedOrder.storeName,
    storeId: storeQueue,
    userOrder: {
      meal: parsedOrder.userOrder.meal,
      drink: parsedOrder.userOrder.drink,
      side: parsedOrder.userOrder.side,
    },
    clientId: parsedOrder.clientId,
  };

  const payload = {
    Message: JSON.stringify(orderDetails),
    TopicArn: topic,
    MessageGroupId: parsedOrder.storeName,
  };

  sns.publish(payload).promise()
    .then(data => console.log('CUSTOMER ORDER DATA:', data))
    .catch(err => console.log('ERROR IN CUSTOMER ORDER', err));
};
