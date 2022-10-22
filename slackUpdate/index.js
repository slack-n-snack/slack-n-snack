'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
const lambda = new AWS.Lambda();

const qs = require('querystring');
const https = require('https');

exports.handler = (event, context, callback) => {

  console.log(event);

  let payloadParsed= qs.parse(event.body);
  console.log('Line 13--------------', payloadParsed.payload);

  let payloadJSONParsed = JSON.parse(payloadParsed.payload);
  console.log(payloadJSONParsed);

  let responseUrl = payloadJSONParsed.response_url;

  let trigger = '';
  let orderObject = {};

  if(payloadJSONParsed.actions[0].action_id === 'submit'){

	  let sum = 0;
	  let sideSum = 0;
	  let mealSum = 0;
	  let drinkSum = 0;
	  let meal = [];
	  let side = [];
	  let drink = [];

	  let mealId = payloadJSONParsed.message.blocks[1].block_id;
	  let sideId = payloadJSONParsed.message.blocks[2].block_id;
	  let drinkId = payloadJSONParsed.message.blocks[3].block_id;

	  if(payloadJSONParsed.state.values[mealId]){
	    for (let i = 0; i < payloadJSONParsed.state.values[mealId].meal.selected_options.length; i++){
		  mealSum = mealSum + parseFloat(payloadJSONParsed.state.values[mealId].meal.selected_options[i].value);
	    }
	  }

	  if(payloadJSONParsed.state.values[sideId]){
	    for (let i = 0; i < payloadJSONParsed.state.values[sideId].sides.selected_options.length; i++){
	      sideSum = sideSum + parseFloat(payloadJSONParsed.state.values[sideId].sides.selected_options[i].value);
	      }
	  }

	  if(payloadJSONParsed.state.values[drinkId]){
      for (let i = 0; i < payloadJSONParsed.state.values[drinkId].drinks.selected_options.length; i++){
		  drinkSum = parseFloat(payloadJSONParsed.state.values[drinkId].drinks.selected_options[i].value);
		  }
	  }

	  sum = sideSum + mealSum + drinkSum;
	  console.log('Line 56 ---------------------------', sum);

	  let store = payloadJSONParsed.message.blocks[0].text.text;

	  if(payloadJSONParsed.state.values[mealId]){
	    for (let i = 0; i < payloadJSONParsed.state.values[mealId].meal.selected_options.length; i++){
        meal.push(payloadJSONParsed.state.values[mealId].meal.selected_options[i].text.text);
	    }
	  }

	  if(payloadJSONParsed.state.values[sideId]){
	    for (let i = 0; i < payloadJSONParsed.state.values[sideId].sides.selected_options.length; i++){
		  side.push(payloadJSONParsed.state.values[sideId].sides.selected_options[i].text.text);
	    }
	  }

	  if(payloadJSONParsed.state.values[drinkId]){
      for (let i = 0; i < payloadJSONParsed.state.values[drinkId].drinks.selected_options.length; i++){
		  drink.push(payloadJSONParsed.state.values[drinkId].drinks.selected_options[i].text.text);
      }
	  }

	  orderObject = {
	  "storeName": store,
	  "userOrder": {
	    "meal": meal,
	    "drink": drink,
	    "side": side,
	    "cost": sum
      },
	  "clientId": payloadJSONParsed.user.username,
    };

	  console.log('Line 89----------------', orderObject);

	  let newPayload = JSON.stringify({
  		"replace_original": "true",
	    "blocks": [
		  {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": store,
            "emoji": true
			        }
		  },
		  {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Thank You!"
			        }
		  },
		  {
          "type": "divider"
		  }
      ]
  						});

	  const params = {
	    FunctionName: 'submitOrder',
	    Payload: JSON.stringify(orderObject),
	    };

	  console.log('Line 120------------', params.Payload);

	  lambda.invoke(params, function(err, data) {
	    if (err) console.log('ERROR IN submitOrder LAMBDA CALL:', err);
	    else console.log('submitOrder LAMBDA RETURN VALUE:', data);
	    });

	    const newOptions = {
    	hostname: "hooks.slack.com",
    	method: "POST",
    	path: responseUrl,
    	};

	  //console.log('Line 133 -------------------', newOptions.path);

    const newReq = https.request(newOptions,
      (res) => res.on("data", () => callback(null, "ok")));
    	newReq.on("error", (error) => callback(JSON.stringify(error)));
    	newReq.write(newPayload);
    	newReq.end();

  } else {


    //console.log('Line 144-----------------', payloadJSONParsed.actions[0]);

    //console.log('Line 146 ---------------------', payloadJSONParsed.actions[0].selected_option);

    if(payloadJSONParsed.actions[0].selected_option){
      trigger = payloadJSONParsed.actions[0].selected_option.text.text;
      console.log(trigger);


      let payload;

      //   Conditional statements that set response payload equal to restaurant menu

      if(trigger === 'Bob\'s Burgers'){
        payload = JSON.stringify({
          "replace_original": "true",
          "block_id": "burger-blockid",
	  "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "Bob's Burgers",
                "emoji": true
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please Choose your Meal."
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Cheeseburger"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$ 5.00 - 1/3 lb. beef burger with lettuce, tomato, pickle and ketchup"
                    },
                    "value": "5.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Double Cheeseburger Deluxe"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$8.50 - 2 x 1/3 lb. beef burger with lettuce, tomato, pickle, onion, jalapeno, ketchup, mustard and mayonnaise"
                    },
                    "value": "8.50"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Grilled Chicken Sandwich"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$9.00 - Juicy grilled chicken sandwich with lettuce, tomato and mayonnaise"
                    },
                    "value": "9.00"
                  }
                ],
                "action_id": "meal"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please select your side dishes"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "French Fries"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$4.00 - Fries with salt and Ketchup"
                    },
                    "value": "4.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Soup of the Day"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$3.50 - Chicken Noodle Soup w/ Vegetables"
                    },
                    "value": "3.50"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "House Salad"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$3.00 - Lettuce, cucmber, carrot and a side of ranch"
                    },
                    "value": "3.00"
                  }
                ],
                "action_id": "sides"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Drinks"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Water"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "FREE w/ purchase"
                    },
                    "value": "0"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Cola"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.00 - Local Made Cola"
                    },
                    "value": "1"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Iced Tea"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.50 - Fresh brewed tea pre-sweetened"
                    },
                    "value": "1.5"
                  }
                ],
                "action_id": "drinks"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please submit when order is complete"
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit",
                  "emoji": true
                },
                "value": "submit",
                "action_id": "submit"
              }
            }
          ]
        });
      }

      // -----------------------------------------------------------------------
      // -----------------------------------------------------------------------
      if(trigger === 'Pat\'s Pizza'){

        payload = JSON.stringify({
          "replace_original": "true",
          "block_id": "pizza-blockid",
          "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "Pat's Pizza",
                "emoji": true
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please Choose your Meal."
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "6 Cheese Pizza"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$ 18.00 - 12\" w/ tomato sauce and six cheeses including mozzarella, feta, provolone, cheddar, parmesan and asiago."
                    },
                    "value": "18.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Meat Lover's Pizza"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$25.00 - 12\" w/ tomato sauce and pepperoni, Italian sausage, ham, bacon, seasoned pork & beef."
                    },
                    "value": "25.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Hawaiian Pizza"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$22.00 - 12\" homemade Honey BBQ pizza sauce, cheese, cooked ham, and pineapple."
                    },
                    "value": "22.00"
                  }
                ],
                "action_id": "meal"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please select your side dishes"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Garlic Knots"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$4.00 - Garlic bread knots w/ salted butter topping."
                    },
                    "value": "4.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Wings"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$9.75 - 8 deep-fried unbreaded chicken wings coated with a vinegar-and-cayenne-pepper sauce."
                    },
                    "value": "9.75"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Cinnamon Desert Bread"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$5.00 - Cinnamon dusted bread sticks w/ vanilla icing."
                    },
                    "value": "5.00"
                  }
                ],
                "action_id": "sides"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Drinks"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Water"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "FREE w/ purchase"
                    },
                    "value": "0"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Cola"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.00 - Local Made Cola"
                    },
                    "value": "1"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Iced Tea"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.50 - Fresh brewed tea pre-sweetened"
                    },
                    "value": "1.5"
                  }
                ],
                "action_id": "drinks"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please submit when order is complete"
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit",
                  "emoji": true
                },
                "value": "submit",
                "action_id": "submit"
              }
            }
          ]
        });
      }
      //   -----------------------------------------------------------------------
      //   -----------------------------------------------------------------------
      if(trigger === 'Tom\'s Tacos'){

        payload = JSON.stringify({
          "replace_original": "true",
          "block_id": "taco-blockid",
          "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "Tom's Tacos",
                "emoji": true
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please Choose your Meal."
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Two Taco Meal"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$ 7.00 - Two hard shell ground beef tacos w/ lettuce, cheese and salsa."
                    },
                    "value": "7.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Quesadilla"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$6.00 - Tortilla filled with cheese and grilled."
                    },
                    "value": "5.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Burrito"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$9.00 - Carne Asada w/ pinto beans, rice, lettuce, cheese, salsa and jalapenos on the side."
                    },
                    "value": "9.00"
                  }
                ],
                "action_id": "meal"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please select your side dishes"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Chips and Salsa"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$4.00 - Home made Chips and Salsa"
                    },
                    "value": "4.00"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Nacho Plate"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$7.50 - Chips topped with cheese, ground beef, salsa w/ jalapenos on the side."
                    },
                    "value": "7.50"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Churros"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$2.25 - Fried Dough topped with cinnamon sugar. "
                    },
                    "value": "2.25"
                  }
                ],
                "action_id": "sides"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Drinks"
              },
              "accessory": {
                "type": "checkboxes",
                "options": [
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Water"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "FREE w/ purchase"
                    },
                    "value": "0"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Cola"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.00 - Local Made Cola"
                    },
                    "value": "1"
                  },
                  {
                    "text": {
                      "type": "mrkdwn",
                      "text": "Iced Tea"
                    },
                    "description": {
                      "type": "mrkdwn",
                      "text": "$1.50 - Fresh brewed tea pre-sweetened"
                    },
                    "value": "1.5"
                  }
                ],
                "action_id": "drinks"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Please submit when order is complete"
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit",
                  "emoji": true
                },
                "value": "submit",
                "action_id": "submit"
              }
            }
          ]
        });
      }


      const options = {
        hostname: "hooks.slack.com",
        method: "POST",
        path: responseUrl,
      };

      console.log(options.path);

      const req = https.request(options,
        (res) => res.on("data", () => (null, "ok")));
      req.on("error", (error) => callback(JSON.stringify(error)));
      req.write(payload);
      req.end();
    }
  }
};
