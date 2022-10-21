# Software Requirements

## Vision

### What is the vision of this product?

This product is intended to allow users to submit orders through a Slack workspace and receive updates on their order.

### What pain point does this product solve?

This product is able to capture user input from Slack using an AWS Chat bot and submit their input to the system automatically. This automates the process, preventing the need for human support personnel. By using Slack, it also prevents the need for a traditional frontend webpage.

### Why should we care about your product?

This functionality is very common for many different business cases, such as:

- An e-commerce customer ordering process, with notifications for order updates
- A support ticketing system, with notifications for support ticket updates
- An application submission system, with notifications for application updates

## Scope

   This product is simulating a serverless back-end for a meal app created using AWS chatbot and other AWS microservices. Snack-n-Slack is open to users with access to the slack channel, orders will be taken through the slack channel and processed using AWS microservices. Users will not be able edit an order after makiing a a request. Once a request is sent,
   the request will be processed and the user will be notified of order processing events through a private direct message. User will not have a follow-up conversation with chatbot outside of creating the order. This app will maintain a database with all orders for admin operators to monitor store activity. (stretch) Admin operators will be able to view all of the orders within the databse using the chatbot - users do not have access to orders database. Access will be handled using role based access control features 

### Minimum Viable Product

- MVP Functionality:
  - User can order from a choice of 3 restaurants.
  - User will pick from a variety of meal options and sides/drinks.
  - User will receive confirmation of order via slack.
  - Admin will be able to pull all orders from database with basic auth.
  - User will receive delivery notifications via slack.

### Stretch Goals

- Stretch Goals:
  - More restaurant choices.
  - User can choose between email and/or slack notifications for confirmation.
  - User will receive delivery notifications via slack and/or email.
  - User can view their personal order history.
  - Role-based access control to access the database for admin operators using slash commands.

## Functional Requirements

  1. User can create orders from a variety of options provided via slackbot.
  2. User can choose to receive notification of order via slack or email.
  3. User can view their order history.
  4. Administrators can view all orders in database. (Stretch Goal)

### Data Flow

User initiates with slackbot start command to begin order process. Slackbot responds with a choice of 3 restaurants. User inputs their restaurant choice and slackbot responds with meal options for that restaurant.  User selects their meal choice and slackbot responds with sides/drink options.  User selects their options and the slackbot will ask them to confirm the order.  Confirmation is sent and the order is queued and stored in the database.  Confirmation of order is passed along to slack/email as well as delivery module.  Delivery module sends delivery confirmation to user email/slack channel. 

## Non-Functional Requirements

### Usability

The application should be intuitive and easy to use for a new user. User prompts should be clear as to what the user needs to provide as input. Users should be re-prompted clearly if their input is unacceptable.

### Testability

The application should be testable and achieve at least 80% test coverage. Testing should include tests at multiple levels, including unit tests, integration tests, and system tests.

### Group Cooperation Plan

[Cooperation Plan](https://docs.google.com/document/d/1nMF5haOiOd4dm0ao0B3r7_l2n9wWtOVYA0FsgM2enT0/edit#heading=h.6wfjyjag1w7h)
