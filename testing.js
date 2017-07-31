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

// args.name = '1. Trivial Launch Test';
// conversation(args)
//     .userSays('LaunchRequest')
//     .plainResponse
//     .shouldEqual(' Welcome to Food Buddy! Add an ingredient or food item to your meal. ')
// .end();
//
// args.name = '2. Launch/Add Test';
// conversation(args)
//     .userSays('LaunchRequest')
//     .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
//     .plainResponse
//     .shouldEqual(' Adding 4 cups of carrots with 388 calories. ')
// .end();

args.name = '3. Launch/Add/Add/Report Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .userSays('AddIntent', {ingredient: 'potatoes', quantity: '8', unit: 'ounces'})
    .userSays('ReportIntent')
    .plainResponse
    .shouldEqual(' You have a total of 989 Calories, 171 grams of carbohydrates, 16 grams of protein, ' +
                 'and 30 grams of fat. ')
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
    .shouldEqual(' You have a total of 388 Calories, 91 grams of carbohydrates, 9 grams of protein, ' +
                 'and 2 grams of fat. ')
.end();

args.name = '5. Launch/Add/Add/Ingredients Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AddIntent', {ingredient: 'carrots', quantity: '4', unit: 'cups'})
    .userSays('AddIntent', {ingredient: 'potatoes', quantity: '8', unit: 'ounces'})
    .userSays('IngredientsIntent')
    .plainResponse
    .shouldEqual(' You have added: 4 cups of carrots with 388 calories and 8 ounces of potatoes with 601 calories. ')
    .end();

args.name = '6. Launch/Ingredients Test';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('IngredientsIntent')
    .plainResponse
    .shouldEqual(' You have a total of 388 Calories, 91 grams of carbohydrates, 9 grams of protein, ' +
                 'and 2 grams of fat. ')
.end();

args.name = '7. Launch/Help/Remove';
conversation(args)
    .userSays('LaunchRequest')
    .userSays('AMAZON.HelpIntent')
    .userSays('RemoveIntent')
    .plainResponse
    .shouldEqual(' You have a total of 388 Calories, 91 grams of carbohydrates, 9 grams of protein, ' +
                 'and 2 grams of fat. ')
.end();
