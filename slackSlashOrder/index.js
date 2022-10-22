
const qs = require('querystring');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

const sns = new AWS.SNS();

//---------------------------------
let https = require('https');

exports.handler = (event, context, callback) => {

  const payload = JSON.stringify({

    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "New Order",
          "emoji": true
        }
      },
      {
        "type": "section",
        "block_id": "section678",
        "text": {
          "type": "mrkdwn",
          "text": "Pick a restaurant dropdown list"
        },
        "accessory": {
          "action_id": "text1234",
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item"
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Bob's Burgers"
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Pat's Pizza"
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Tom's Tacos"
              },
              "value": "value-2"
	        }
	      ]
	    }
	  }
    ]
  });

  const options = {
    hostname: "hooks.slack.com",
    method: "POST",
    path: "insert_webhook",
  };


  const req = https.request(options,
    (res) => res.on("data", () => (null, "ok")))
  console.log(req);
  req.on("error", (error) => callback(JSON.stringify(error)));
  req.write(payload);
  req.end();
}
