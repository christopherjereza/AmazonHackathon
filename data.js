/**
 * File containing apiCalls to USDA's ndb API.
 * @author Unity
 */

const NutrientDataLaboratory = require('nutrient-data-laboratory');
const CONVERSIONS = require('./conversions.js');
const INDEX = require('./index.js');

let ndl = new NutrientDataLaboratory('Zo7ru5UezyJCdMFmNSwqBnZiQUKysRvoRx9skNOc');

getMacros(2, 'cups', 'cheese');

// Main entry function, returns object with fields of macro nutrition data
function getMacros(quantity, unit, ingredient){
  const thisCurrent = this;
  ndl.search({
    q: ingredient,
    max: 25,
    ds: 'Standard Reference',
    offset: 0
    }, function(err, res) {
    if (err) {
      console.error(err);
    }
    else {
      let ndbnoQuery = res.list.item[0].ndbno;
      ndl.foodReports({
        ndbno: ndbnoQuery,
        type: 'b'
      }, (err, result) => {
        if (err) {
          console.error(err);
        }
        else {
          let nutrients = result.report.food.nutrients;
          let inGrams, calories, fat, carbs, protein;
          if (isConversionPresent.call(thisCurrent, unit, nutrients[0].measures)){
            let index = isConversionPresent.call(thisCurrent, unit, nutrients[0].measures);
            calories = quantity * getActualValue.call(thisCurrent, nutrients, 'Energy', index);
            fat = quantity * getActualValue.call(thisCurrent, nutrients, 'Total lipid (fat)', index);
            carbs = quantity * getActualValue.call(thisCurrent, nutrients, 'Carbohydrate, by difference', index);
            protein = quantity * getActualValue.call(thisCurrent, nutrients, 'Protein', index);
          }
          else{
            inGrams = CONVERSIONS.getGrams.call(thisCurrent, quantity, unit);
            calories = getRoughValue.call(thisCurrent, nutrients, 'Energy', inGrams);
            fat = getRoughValue.call(thisCurrent, nutrients, 'Total lipid (fat)', inGrams);
            carbs= getRoughValue.call(thisCurrent, nutrients, 'Carbohydrate, by difference', inGrams);
            protein = getRoughValue.call(thisCurrent, nutrients, 'Protein', inGrams);
          }
          INDEX.update.call(thisCurrent, macroObject(calories, fat, carbs, protein));
        }
      });
    }
  });
}

function isConversionPresent(unitQuery, inputOptions){
  for (let i = 0; i < inputOptions.length; i++){
    if (inputOptions[i].label === unitQuery ||
        inputOptions[i].label === unitQuery + 's') {
      return i;
    }
  }
  return false;
}

function macroObject(cal, fat, carb, protein){
  let result = {};
  result.Calories = cal;
  result.Fat = fat;
  result.Carbs = carb;
  result.Protein = protein;
  return result;
}

function getActualValue(input, category, index){
  for (let i = 0; i < input.length; i++){
    if (input[i].name === category){
      return (input[i].measures[index].value * input[i].measures[index].qty);
    }
  }
  return 0;
}

function getRoughValue(input, category, grams){
  for (let i = 0; i < input.length; i++){
    if (input[i].name === category){
      return (input[i].value * grams / 100.0).toFixed(2);
    }
  }
  return 0;
}

exports.getMacros = getMacros;
