'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();
const { Chance } = require('chance');
const chance = new Chance();

<<<<<<< HEAD

  const parsedOrder = {   
    storeName: "Bob's Burgers",
    userOrder: {
      meal: "burger",
      drink: "water",
      side: "fries"
    }, 
    clientId: 8
   };
   

  const sns = new AWS.SNS();
=======
exports.handler = (parsedOrder) => {

>>>>>>> 9ca35ea3e7f5f09cca0d91983d2888c54e4189bd
  const topic = 'arn:aws:sns:us-west-2:363223802314:slack-orders.fifo';

  const { storeName, clientId, userOrder: { meal, drink, side, cost } } = parsedOrder;

  const orderDetails = {
    id: chance.guid(),
    storeName,
    clientId,
    userOrder: { meal, drink, side, cost },
  };

  const payload = {
    Message: JSON.stringify(orderDetails),
    TopicArn: topic,
    MessageGroupId: parsedOrder.storeName.replace(' ', '_'),
  };

<<<<<<< HEAD
  console.log('ORDER DETAILS', orderDetails);

//   sns.publish(payload).promise()
//     .then(data => {
//       console.log('HELOOOOOOOOOOO');
//       console.log('CUSTOMER ORDER DATA:', data);
//     })
//     .catch(err => console.log('ERROR IN CUSTOMER ORDER', err));
// };

sns.publish(payload, (err, data) => {
  if(err){
    console.log(err)
  } else {
    console.log('data:::::::::::', data);
    console.log('HELOOOOOOO');
  }
});
console.log('payload published to SNS');
=======
  sns.publish(payload).promise()
    .then(data => console.log('CUSTOMER ORDER DATA:', data))
    .catch(err => console.log('ERROR IN CUSTOMER ORDER', err));
};
>>>>>>> 9ca35ea3e7f5f09cca0d91983d2888c54e4189bd
