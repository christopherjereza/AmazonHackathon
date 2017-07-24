# Food Buddy <img src="food-buddy-badge.jpg" width="100">

Food Buddy is an Alexa Skill that tracks the nutritional content of your meals from its ingredients as you cook!
### Contents:
- [Getting Started](#started)
- [How to Use](#use)
- [Testing](#testing)
- [Acknowledgments and Development Notes](#acknowledgments)
- [Demo](#demo)

<a name="started"/>

## Getting Started

Visit the Alexa Skill Store and search for "Food Buddy" Skill, which has the following App ID:
```
amzn1.ask.skill.f7574c4a-fe13-47d7-b1a5-34a199aacf04
```
then, you can enable this Skill on your Alexa device!

<a name="use"/>

## How to Use

### Launch
Start the Food Buddy Skill by saying,
```
"Alexa, open Food Buddy."
```
You can also jump straight into the conversation with Food Buddy by saying,
```
"Alexa, ask food buddy to _____"
```
followed by any of the following intents.

### Add an ingredient

Once the Skill is launched, you can add an ingredient by specifying it's quantity and the food item. For example, you can say:
```
"Add ten ounces of spinach."
```
or
```
"Put in one cup of tomatoes."
```
or
```
"Include fifty grams of chicken."
```
Alexa will then report the number of calories in your item item and add it to your meal!
### Remove an ingredient
To remove the item that was most recently added to your meal, just say
```
"Remove."
```
or
```
"Take out the last ingredient."
```

### List current ingredients
To hear a list of all items added to your meal so far, followed by the Calorie count for each, you can ask Food Buddy,
```
"What ingredients have I added?"
```
or
```
"Tell me what's in my recipe."
```

### Nutritional Summary
Food Buddy can give you a summary of the Calorie and macronutrient (protein, carbohydrate, fat) breakdown of your
meal! Just ask,
```
"What's my summary?"
```
or
```
"Give me the final report."
```
### Exit
Just say
```
"Stop."
```
or
```
"Exit"
```
to end your current session.

## Notes (regarding Skill use)
- Once the session ends, whether by unexpected error, exiting the Skill, or timing out after not receiving a response, your
current meal and all ingredients added so far will be removed. I am currently working on setting up a persistent database
that will allow the Skill to keep track of ingredients, meals, and food items across multiple sessions.

- This skill was not intended for use with an Echo Show. I plan to add a visual component (for both Echo Show and the mobile
Amazon Alexa app that would provide additional functionality.

<a name="testing"/>

## Testing

This skill was tested with three methods:
1. Automated unit testing using a Mocha testing framework
2. Testing JSON requests in the Lambda function
3. Verbal testing on an Echo device.

### Running the Mocha tests
- First, make sure you have Node.js (and npm) installed on your computer.
- Then, ensure that the Mocha testing framework is installed. If you don't have it, you can get it by running
the following from the command line:
```
npm install mocha
```
- The node module used for mocking an Alexa conversation, "alexa-conversation", is included in this repo. You can also
install it yourself by running:
```
npm install --save-dev alexa-conversation
```
Then, using the provided testing file, you can run the tests with:
```
mocha testing.js
```
Feel free to add more unit tests! Documentation on the "alexa-conversation" framework can be found
with this [link](https://www.npmjs.com/package/alexa-conversation)

<a name="demo"/>
## Demo

https://www.youtube.com/watch?v=REKBjWrvN7A

<a name="acknowledgments"/>
## Acknowledgments and Development Notes

* Developers: Christopher Jereza, Emily Lo, Stephanie Zhang, and Michelle Hamilton
* UX and Logo Design: Scott Yu-Jan
* Brainstormed, designed, developed, and deployed on July 21, 2017 at the 10-hour "Amazon Global Intern Hackathon"

### Built With

* [AWS Lambda](https://aws.amazon.com/lambda/)
* [Alexa Developer Portal](https://developer.amazon.com/)
* [USDA Nutrient Data Laboratory API](https://www.npmjs.com/package/nutrient-data-laboratory)
