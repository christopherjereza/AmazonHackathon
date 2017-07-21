var Alexa = require('alexa-sdk');

const WHITESPACE = ' ';

const MESSAGES = {
    'WELCOME': 'Welcome to Food Buddy! Add an ingredient or food item to your meal.',
};

function add(quantity, unit, ingredient) {
    this.attributes.meal[ingredient] = [quantity, unit];
    this.attributes.lastItemAdded = ingredient;
    this.emit(':ask', 'Adding ' + stringify.call(this, quantity, unit, ingredient));
}

/* Return a string with the quantity, unit, and ingredient of the added item. */
function stringify(quantity, unit, ingredient) {
    return quantity + WHITESPACE + unit + WHITESPACE + ' of ' + ingredient;
}

/* List every ingredient added so far. */
function report() {
    const meal = this.attributes.meal;
    let outputSpeech = '';
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
        outputSpeech += stringify.call(this, quantity, unit, ingredient);
    }
    return outputSpeech
}

function remove() {
    let meal = this.attributes.meal;
    let itemToDelete = this.attributes.lastItemAdded;
    delete meal[itemToDelete];
    this.attributes.meal = meal;
    let outputSpeech = 'Removing ' + itemToDelete;
    this.emit(':ask', outputSpeech);
}

var handlers = {
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
        this.emit(':ask', 'What If Intent triggered');
    },
    'ReportIntent': function() {
        report.call(this);
    },
    'RemoveIntent': function() {
        remove.call(this);
    }
};



exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};