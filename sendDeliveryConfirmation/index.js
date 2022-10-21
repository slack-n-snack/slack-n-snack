const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const sns = new AWS.SNS();

exports.handler = (orderEvent) => {

  const parsedMessageBody = JSON.parse(orderEvent).MessageBody;
  const parsedOrder = JSON.parse(parsedMessageBody.Message);

  const storeTopicARN = {
    'Bob\'s Burgers': 'arn:aws:sns:us-west-2:363223802314:bobs-burgers-topic.fifo',
    'Pat\'s Pizza': 'arn:aws:sns:us-west-2:363223802314:pats-pizza-topic.fifo',
    'Tom\'s Tacos': 'arn:aws:sns:us-west-2:363223802314:toms-tacos-topic.fifo',
  };

  const topic = storeTopicARN[parsedOrder.storeName];

  const payload = {
    Message: JSON.stringify(parsedOrder),
    TopicArn: topic,
    MessageGroupId: parsedOrder.storeName.replace(' ', '_'),
  };

  sns.publish(payload).promise()
    .then(data => console.log('DELIVERY CONFIRMATION SENT:', data))
    .catch(err => console.log('ERROR IN sendDeliveryConfirmation LAMBDA', err));
};
