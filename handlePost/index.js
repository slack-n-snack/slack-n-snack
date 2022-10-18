const dynamoose = require('dynamoose');

const orderSchema = new dynamoose.Schema({
  id: Number,
  clientId: String,
  orderPayload: {
    type: Object, 
    schema: {
     meal: String,
     drink: String,
     side: String
    },
  },
  storeId: String,
  storeName: String,
});

const orderModel = dynamoose.model('slack-n-snack-table', orderSchema);

exports.handler = async (event) => {
  
  const body = event.Records[0].body;
  
  const { id, clientId, storeId, orderPayload, storeName } = body; 
  const order = { id, clientId, orderPayload, storeId, storeName };
  
  const response = {
    status: null,
    body: null,
  };
  
  console.log('order payload::::::::::::: ',order);
  try {
    const postResponse = await orderModel.create(order);
    response.status = 200;
    response.body = JSON.stringify(postResponse);
    
    console.log('order payload:::::::::::::', postResponse);
  } catch (e) {
    response.status = 400;
    response.body = JSON.stringify('An error has occured. Order Incomplete!');
    console.error(e);
  } 
    
  
  // TODO implement
  return response;
};