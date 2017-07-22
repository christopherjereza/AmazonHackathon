/**
 * The testing file for this Skill, using Mocha and the "alexa-conversation" testing framework.
 * See README for testing instructions.
 * @author Christopher Jereza
 */

//****************************************** ATTRIBUTES **************************************************************

/* The Alexa Skill conversation testing framework. */
const conversation = require('alexa-conversation');

/* The main file to be tested. Replace with appropriate index file. */
const app = require('./index.js');

/* Parameters for initializing a test conversation. */
const args = {
    name: 'Test Conversation',
    app: app,
    appId: 'amzn1.ask.skill.f7574c4a-fe13-47d7-b1a5-34a199aacf04',
    handler: app.handler
};

//****************************************** TEST CASES *************************************************************

args.name = '1. Trivial Launch Test';
conversation(args)
    .userSays('LaunchRequest')
    .plainResponse
    .shouldEqual(' Welcome to Food Buddy! Add an ingredient or food item to your meal. ')
.end();

args.name = '2. Launch/Add Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .plainResponse
    .shouldEqual(' Adding 4 cups of carrots ')
.end();

args.name = '3. Launch/Add/Add/Report Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .userSays('AddIntent', {ingredient: 'potatoes', quantity: '8', unit: 'ounces'})
    .userSays('ReportIntent')
    .plainResponse
    .shouldEqual(' You have added 4 cups of carrots and 8 ounces of potatoes. ')
.end();

args.name = '4. Launch/Add/Add/Remove/Report Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .userSays('AddIntent', {ingredient: 'potatoes', quantity: '8', unit: 'ounces'})
    .userSays('AddIntent', {ingredient: 'tomatoes', quantity: '8', unit: 'ounces'})
    .userSays('RemoveIntent')
    .userSays('RemoveIntent')
    .userSays('ReportIntent')
    .plainResponse
    .shouldEqual(' You have added 4 cups of carrots. ')
.end();

args.name = '5. Launch/Add/Add/Ingredients Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .userSays('AddIntent', {ingredient: 'potatoes', quantity: '8', unit: 'ounces'})
    .userSays('IngredientsIntent')
    .plainResponse
    .shouldEqual(' You have added 4 cups of carrots and 8 ounces of potatoes. ')
    .end();
