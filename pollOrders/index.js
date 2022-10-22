const aws = require('aws-sdk');
const Chance = require('chance');

const sqs = new aws.SQS();
const chance = new Chance();

exports.handler = async (event) => {
    
  console.log('event::::::::::::', event);
  
  const payload = event.Records[0].body.Message;
  const { id, storeName, userOrder, clientId } = payload;
  
  const message = { id, storeName, userOrder, clientId };
  
  const params = {
    QueueUrl: payload.storeId,
    MessageBody: message,
    MessageDeduplicationId: chance.guid(),
    MessageGroupId: chance.guid(),
  }
  
  sqs.sendMessage(params, (err, data) => {
    if(err){
      console.log(err);
    } else {
      const parsedData = JSON.stringify(data);
      console.log('data:::::::::::::', parsedData);
      console.log('sqs message sent to store queue');
    }
  })
  
  // TODO implement
  const response = {
      statusCode: 200,
      body: JSON.stringify('Hello order send to vendor queue!'),
  };
  return response;
};