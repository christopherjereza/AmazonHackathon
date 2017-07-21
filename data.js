/**
 * File containing apiCalls to USDA's ndb API.
 * @author Unity
 */

const NutrientDataLaboratory = require('nutrient-data-laboratory');
const CONVERSIONS = require('./conversions.js');

let ndl = new NutrientDataLaboratory('Zo7ru5UezyJCdMFmNSwqBnZiQUKysRvoRx9skNOc');

// Main entry function, returns object with fields of macro nutrition data
function getMacros(quantity, unit, ingredient){
    // Search for USDA's ID code, ndbno, of given ingredient
    ndl.search({
        q: ingredient,
        max: 25,
        ds: 'Standard Reference',
        offset: 0
    }, (err, res) => {
        if (err) {
            console.error(err);
        }
        else {
            // Retrieve most relevant item's ndbno
            let ndbnoQuery = res.list.item[0].ndbno;
    console.log(ingredient + ' ndbno is: ' + ndbnoQuery);
    // Call food reports to get nutritional value from ndb API
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
    if (isConversionPresent(unit, nutrients[0].measures)){
        let index = isConversionPresent(unit, nutrients[0].measures);
        calories = quantity * getActualValue(nutrients, 'Energy', index);
        fat = quantity * getActualValue(nutrients, 'Total lipid (fat)', index);
        carbs = quantity * getActualValue(nutrients, 'Carbohydrate, by difference', index);
        protein = quantity * getActualValue(nutrients, 'Protein', index);
    }
    else{
        let inGrams = CONVERSIONS.getGrams(quantity, unit);
        calories = getRoughValue(nutrients, 'Energy', inGrams);
        fat = getRoughValue(nutrients, 'Total lipid (fat)', inGrams);
        carbs= getRoughValue(nutrients, 'Carbohydrate, by difference', inGrams);
        protein = getRoughValue(nutrients, 'Protein', inGrams);
    }

    console.log(calories);
    console.log(fat);
    console.log(carbs);
    console.log(protein);
    //console.log(numGrams);
    let test = macroObject(calories, fat, carbs, protein);
    console.log(test);
    console.log(test.Protein);
    return macroObject(calories, fat, carbs, protein);
}
});
}
});
}

function isConversionPresent(unitQuery, inputOptions){
    for (let i = 0; i < inputOptions.length; i++){
        if (inputOptions[i].label === inputOptions){
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
            return (input[i].name.measures[index].value).toFixed(2);
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

exports.getCals = getMacros;