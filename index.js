'use strict';

var Alexa = require('alexa-sdk');

const WHITESPACE = ' ';

const STATES = {
    'HELP': '_HELPSTATE',
    'MAIN': '_MAINSTATE',
};

const APP_ID = 'amzn1.ask.skill.f7574c4a-fe13-47d7-b1a5-34a199aacf04';

const MESSAGES = {
    'WELCOME': 'Welcome to Food Buddy! Add an ingredient or food item to your meal.',
    'STOP': 'Goodbye!',
    'HELP': 'You can add ingredients to your meal by saying, ADD, and the amount of your ingredient. ' +
    'Say, “what if I add,” followed by your quantity and ingredient, to hear the nutrients and calories you ' +
    'will be adding. Say, “Cancel,” or, “remove,” followed by an ingredient to remove it from your meal. Say “summary” ' +
    'at any point to hear the total nutritional information. ' +
    'Would you like to hear an example?',
    'UNHANDLED': 'I\'m sorry, I didn\'t get that. Please specify a quantity, ' +
    'a unit of measurement, and an ingredient. Or, say REPORT.',
    'START_UNHANDLED': 'Say, \'Open Food Buddy\', to track the nutritional value of your meal.',
    'HELP_UNHANDLED': 'Sorry, I didn\'t get that. Would you like to hear an example? Please say yes or no.'

};

const DATA = require('./data.js');

function add(quantity, unit, ingredient) {
    if (this.attributes.meal === undefined) {
        this.attributes.meal = {};
    }
    if (this.attributes.ingredients === undefined) {
        this.attributes.ingredients = {};
    }
    if (this.attributes.addedItems === undefined) {
        this.attributes.addedItems = [];
    }
    DATA.getMacros.call(this, quantity, unit, ingredient, 0);
}

function update(quantity, unit, ingredient, macros) {
    this.attributes.meal[ingredient] = macros;
    this.attributes.ingredients[ingredient] = [quantity, unit, macros.Calories];
    this.attributes.addedItems.push(ingredient);
    this.emit(':ask', 'Adding ' + stringify.call(this, quantity, unit, ingredient, macros.Calories) + '.');
}

/* Return a string with the quantity, unit, and ingredient of the added item. */
function stringify(quantity, unit, ingredient, calories) {
    return quantity + WHITESPACE + unit + ' of ' + ingredient + ' with ' + calories + ' calories';
}

/* List every ingredient added so far. */
function report() {
    const meal = this.attributes.meal;
    if (meal.length <= 0) {
        return 'No food items have been added.';
    }
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let macros;
    for (let ingredient in meal) {
        if (meal.hasOwnProperty(ingredient) && meal[ingredient] !== undefined) {
            macros = meal[ingredient];
            totalCalories += parseFloat(macros.Calories);
            totalCarbs += parseFloat(macros.Carbs);
            totalProtein += parseFloat(macros.Protein);
            totalFat += parseFloat(macros.Fat);
        }
    }
    let outputSpeech = 'You have a total of ' + totalCalories + ' Calories, ' + totalCarbs + ' grams of carbohydrates, ' +
                        totalProtein + ' grams of protein, and ' + totalFat + ' grams of fat.';
    this.emit(':ask', outputSpeech);
}

function remove() {
    let meal = this.attributes.meal;
    let ingredients = this.attributes.ingredients;
    let itemToDelete = this.attributes.addedItems[this.attributes.addedItems.length - 1];
    delete meal[itemToDelete];
    delete ingredients[itemToDelete];
    this.attributes.meal = meal;
    this.attributes.ingredients = ingredients;
    this.attributes.addedItems.pop();
    let outputSpeech = 'Removing ' + itemToDelete;
    this.emit(':ask', outputSpeech);
}

function ingredients() {
    let meal = this.attributes.ingredients;
    if (meal.length === 0) {
        this.emit(':ask', 'You have no ingredients added.');
    }
    let outputSpeech = 'You have added: ';
    let ingredients = [];
    for (let ingredient in meal) {
        if (meal.hasOwnProperty(ingredient) && meal[ingredient] !== undefined) {
            ingredients.push(ingredient);
        }
    }
    const len = ingredients.length;
    if (len > 0) {
        let ingredient;
        let quantity;
        let unit;
        let calories;
        for (let i = 0; i < len - 1; i += 1) {
            ingredient = ingredients[i];
            quantity = meal[ingredient][0];
            unit = meal[ingredient][1];
            calories = meal[ingredient][2];
            outputSpeech += stringify.call(this, quantity, unit, ingredient, calories);
            if (i < len - 2 || len > 2) {
                outputSpeech += ', ';
            } else {
                outputSpeech += WHITESPACE;
            }
        }
        if (len > 1) {
            outputSpeech += 'and ';
        }
        ingredient = ingredients[len - 1];
        quantity = meal[ingredient][0];
        unit = meal[ingredient][1];
        calories = meal[ingredient][2];
        outputSpeech += stringify.call(this, quantity, unit, ingredient, calories) + '.';
    }
    this.emit(':ask', outputSpeech);
}

function whatIf(quantity, unit, ingredient) {
    if (this.attributes.meal === undefined) {
        this.attributes.meal = {};
    }
    if (this.attributes.ingredients === undefined) {
        this.attributes.ingredients = {};
    }
    DATA.getMacros.call(this, quantity, unit, ingredient, 1);
}

function whatIfHelper(quantity, unit, ingredient, macros) {
    this.emit(':ask', 'Adding ' + quantity + WHITESPACE + unit + ' of ' + ingredient + ' would add ' + macros.Calories +
        ' calories, ' + macros.Carbs + ' grams of carbohydrates, ' + macros.Protein + ' grams of protein, and ' +
        macros.Fat + ' grams of fat to your meal.');
}

var handlers = {
    'LaunchRequest': function () {
        this.handler.state = STATES.MAIN;
        this.emitWithState('LaunchRequest');
    },
    'AddIntent': function () {
        this.handler.state = STATES.MAIN;
        this.emitWithState('AddIntent');
    },
    'WhatIfIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emitWithState('WhatIfIntent');
    },
    'ReportIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emitWithState('ReportIntent');
    },
    'RemoveIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emitWithState('RemoveIntent');
    },
    'IngredientsIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emitWithState('IngredientsIntent');
    },
    'Unhandled': function() {
        this.emit(':tell', MESSAGES.START_UNHANDLED);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', MESSAGES.STOP);
    },
};

const mainStateHandler = Alexa.CreateStateHandler(STATES.MAIN, {
    'LaunchRequest': function () {
        this.emit(':ask', MESSAGES.WELCOME);
    },
    'AddIntent': function () {
        const quantity = this.event.request.intent.slots.quantity.value;
        const unit = this.event.request.intent.slots.unit.value;
        const ingredient = this.event.request.intent.slots.ingredient.value;
        add.call(this, quantity, unit, ingredient);
    },
    'WhatIfIntent': function() {
        const quantity = this.event.request.intent.slots.quantity.value;
        const unit = this.event.request.intent.slots.unit.value;
        const ingredient = this.event.request.intent.slots.ingredient.value;
        whatIf.call(this, quantity, unit, ingredient);
    },
    'ReportIntent': function() {
        report.call(this);
    },
    'RemoveIntent': function() {
        remove.call(this);
    },
    'IngredientsIntent': function() {
        ingredients.call(this)
    },
    'Unhandled': function() {
        this.emit(':ask', MESSAGES.UNHANDLED);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', MESSAGES.STOP);
    },
    'AMAZON.HelpIntent': function() {
        this.handler.state = STATES.HELP;
        this.emit(':tell', MESSAGES.HELP);
    }
    'StartOverIntent': function() {
        this.attributes.meal = {};
        this.attributes.ingredients = {};
        this.attributes.addedItems = [];
        this.emitWithState('LaunchRequest');
    }
});

const helpStateHandler = Alexa.CreateStateHandler(STATES.HELP, {
    'AMAZON.YesIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emit(':ask', 'For example, you could say: Add three ounces of chicken, or you could ask: How many calories ' +
            'would five grams of cheese add?');
    },
    'AMAZON.NoIntent': function() {
        this.handler.state = STATES.MAIN;
        this.emit(':ask', MESSAGES.WELCOME);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', MESSAGES.STOP);
    },
    'AMAZON.HelpIntent': function() {
        this.handler.state = STATES.HELP;
        this.emit(':ask', MESSAGES.HELP);
    },
    'Unhandled': function() {
        this.emit(':ask', MESSSAGES.HELP_UNHANDLED);
    }
});

exports.update = update;
exports.whatIfHelper = whatIfHelper;
exports.handler = function(event, context){
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, mainStateHandler, helpStateHandler);
    alexa.execute();
};
