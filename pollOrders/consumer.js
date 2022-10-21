const { Consumer } = require('sqs-consumer');
const Chance = require('chance');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});
const sqs = new AWS.SQS();
const chance = new Chance();

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/363223802314/slack-orders-queue.fifo',
  handleMessage: async (message) => {
    // do some work with `message`
    
console.log('hello - polling from queue');
    console.log(message);
    const parsedData = JSON.parse(message);

    let params = {
      QueueUrl: parsedData.queueId,
      MessageBody: parsedData,
      MessageDeduplicationId: chance.uuid(),
      MessageGroupId: chance.uuid(),
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
  }
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();