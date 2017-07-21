var Alexa = require('alexa-sdk');

const WHITESPACE = ' ';

const STATES = {
    'HELP': '_HELPSTATE',
    'MAIN': '_MAINSTATE',
}

const MESSAGES = {
    'WELCOME': 'Welcome to Food Buddy! Add an ingredient or food item to your meal.',
    'STOP': 'Goodbye!',
    'HELP': 'You can add ingredients to your meal by saying, ADD and the amount of your ingredient. ' +
    'Say “what if I add..” followed by your quantity and ingredient to hear how much nutrients and calories you ' +
    'will be adding. Say “Cancel” or “remove” with an ingredient to remove it from your meal and say “summary” ' +
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
    const macros = DATA.getMacros(quantity, unit, ingredient);
    console.log(macros);
    this.attributes.meal[ingredient] = macros;
    this.attributes.ingredients[ingredient] = [quantity][unit];
    this.attributes.lastItemAdded = ingredient;
    this.emit(':ask', 'Adding ' + stringify.call(this, quantity, unit, ingredient, macros.Calories));
}

/* Return a string with the quantity, unit, and ingredient of the added item. */
function stringify(quantity, unit, ingredient, calories) {
    return quantity + WHITESPACE + unit + ' of ' + ingredient + ' with ' + calories + ' calories.';
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
            totalCalories += macros.Calories;
            totalCarbs += macros.Carbs;
            totalProtein += macros.Protein;
            totalFat += macros.Fat;
        }
    }
    let outputSpeech = 'You have a total of ' + totalCalories + ' Calories, ' + totalCarbs + ' grams of carbohydrates, ' +
                        totalProtein + ' grams of protein, and ' + totalFat + ' grams of fat.';
    this.emit(':ask', outputSpeech);
}

function remove() {
    let meal = this.attributes.meal;
    let itemToDelete = this.attributes.lastItemAdded;
    delete meal[itemToDelete];
    this.attributes.meal = meal;
    let outputSpeech = 'Removing ' + itemToDelete;
    this.emit(':ask', outputSpeech);
}

function ingredients() {
    let meal = this.attributes.ingredients;
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
        for (let i = 0; i < len - 1; i += 1) {
            ingredient = ingredients[i];
            quantity = meal[ingredient][0];
            unit = meal[ingredient][1];
            outputSpeech += stringify.call(this, quantity, unit, ingredient);
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
        outputSpeech += stringify.call(this, quantity, unit, ingredient) + '.';
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
    const macros = DATA.getMacros(quantity, unit, ingredient);

    this.emit(':ask', 'Adding ' + quantity + WHITESPACE + unit + ' of ' + ingredient + ' would add ' + macros.Calories +
        ' calories, ' + macros.Carbs + ' grams of carbohydrates, ' + macros.Protein + ' grams of protein, and ' +
        macros.Fat + ' grams of fat to your meal. Would you like to add this?');

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
        this.attributes.meal = {};
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
        this.emit(':tell', MESSAGES.HELP);
    },
    'Unhandled': function() {
        this.emit(':ask', MESSSAGES.HELP_UNHANDLED);
    }
});

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers, mainStateHandler, helpStateHandler);
    alexa.execute();
};
