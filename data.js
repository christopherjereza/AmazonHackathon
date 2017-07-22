/**
 * File containing API calls to USDA's NBD API.
 * @author Christopher Jereza, Emily Lo, Michelle Hamilton
 */

//****************************************** ATTRIBUTES **************************************************************

/* The API. */
const NutrientDataLaboratory = require('nutrient-data-laboratory');

/* File containing helper functions for calculating amounts between various units of measurement. */
const CONVERSIONS = require('./conversions.js');

/* The main file for this Alexa Skill. */
const INDEX = require('./index.js');

/* The NutrientDataLaboratory object. */
let NDL = new NutrientDataLaboratory('Zo7ru5UezyJCdMFmNSwqBnZiQUKysRvoRx9skNOc');

//****************************************** FUNCTIONS **************************************************************

/**
 * Main entry function for API
 * @param {number} quantity - numerical amount of ingredient added
 * @param {String} unit - unit of measurement (e.g. ounce/ounces, pound/pounds, cup/cups, etc.
 * @param {String} ingredient - food item to add (e.g. chicken, pasta, rice, tofu, etc.)
 * @param {number} option - "0" if part of AddIntent call, "1" if part of WhatIfIntent call.
 * @return {Object} macros - object with Calories, Protein, Carbs, and Fat attributes.
 */
function getMacros(quantity, unit, ingredient, option){
    const thisCurrent = this;
    NDL.search({
        q: ingredient,
        max: 25,
        ds: 'Standard Reference',
        offset: 0
    }, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            let ndbnoQuery = res.list.item[0].ndbno;
            NDL.foodReports({
                ndbno: ndbnoQuery,
                type: 'b'
            }, function(err, result) {
                if (err) {
                    console.error(err);
                } else {
                    let nutrients = result.report.food.nutrients;
                    let inGrams, calories, fat, carbs, protein;
                    if (isConversionPresent.call(thisCurrent, unit, nutrients[0].measures) !== -1){
                        let index = isConversionPresent.call(thisCurrent, unit, nutrients[0].measures);
                        calories = quantity * getActualValue.call(thisCurrent, nutrients, 'Energy', index);
                        fat = quantity * getActualValue.call(thisCurrent, nutrients, 'Total lipid (fat)', index);
                        carbs = quantity * getActualValue.call(thisCurrent, nutrients, 'Carbohydrate, by difference', index);
                        protein = quantity * getActualValue.call(thisCurrent, nutrients, 'Protein', index);
                    } else {
                        inGrams = CONVERSIONS.getGrams.call(thisCurrent, quantity, unit);
                        calories = getRoughValue.call(thisCurrent, nutrients, 'Energy', inGrams);
                        fat = getRoughValue.call(thisCurrent, nutrients, 'Total lipid (fat)', inGrams);
                        carbs= getRoughValue.call(thisCurrent, nutrients, 'Carbohydrate, by difference', inGrams);
                        protein = getRoughValue.call(thisCurrent, nutrients, 'Protein', inGrams);
                    }
                    if (option === 0) {
                        INDEX.update.call(thisCurrent, quantity, unit, ingredient, macroObject(Math.round(calories), Math.round(fat),
                            Math.round(carbs), Math.round(protein)));
                    } else {
                        INDEX.whatIfHelper.call(thisCurrent, quantity, unit, ingredient, macroObject(Math.round(calories), Math.round(fat),
                            Math.round(carbs), Math.round(protein)));
                    }
                }
            });
        }
    });
}

/**
 * Check if data for desired unit of measurement is provided by the API.
 * @param {String} unitQuery - the desired unit
 * @param {Array} inputOptions - the units provided by the API.
 * @return {number} Non-negative index of desired unit in API result. -1 if unit is not found.
 */
function isConversionPresent(unitQuery, inputOptions){
  for (let i = 0; i < inputOptions.length; i++){
    if (inputOptions[i].label === unitQuery ||
        inputOptions[i].label === unitQuery + 's') {
      return i;
    }
  }
  return -1;
}

/**
 * Construct a object containing macro-nutrient information.
 * @param {number} cals - number of Calories
 * @param {number} fat - number of grams of fat
 * @param {number} carbs - number of grams of carbohydrates
 * @param {number} protein - number of grams of protein
 * @returns {{}} dictionary object with Calories, Fat, Carbs, and Protein attributes
 */
function macroObject(cals, fat, carbs, protein){
  let result = {};
  result.Calories = cals;
  result.Fat = fat;
  result.Carbs = carbs;
  result.Protein = protein;
  return result;
}

/**
 * Use API data to calculate optimally accurate macro-nutrient amount.
 * @param {Array} input - API result
 * @param {String} unit - desired unit of measurement
 * @param {number} index - index of desired data
 * @returns {number} macro-nutrient amount
 */
function getActualValue(input, unit, index){
  for (let i = 0; i < input.length; i++){
    if (input[i].name === unit){
      return input[i].measures[index].value * input[i].measures[index].qty;
    }
  }
  return 0;
}

/**
 * Provide a rough estimate of the macro-nutrient amount via conversion to grams.
 * @param {Array} input - API result
 * @param {String} unit - desired unit of measurement
 * @param {number} grams - number of grams used for estimated calculation
 * @returns {number} estimated macro-nutrient amount
 */
function getRoughValue(input, unit, grams){
  for (let i = 0; i < input.length; i++){
    if (input[i].name === unit){
      return parseFloat((input[i].value * grams / 100.0).toFixed(2));
    }
  }
  return 0.0;
}

//****************************************** EXPORTS *************************************************************

exports.getMacros = getMacros;
