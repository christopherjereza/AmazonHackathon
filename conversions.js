/**
 * File containing conversions from various units of measurement to grams.
 * @authors Christopher Jereza
 */

//****************************************** FUNCTIONS **************************************************************

/**
 * Convert a quantity and unit to grams.
 * @param {number} quantity - numerical amount to convert
 * @param {String} unit - specified unit of measurement
 * @return float
 */
function getGrams(quantity, unit) {
    if (unit === 'ounces' || unit === 'ounce') {
        return quantity * 28.3495;
    } else if (unit === 'grams' || unit === 'gram') {
        return quantity;
    } else if (unit === 'fluid ounces' || unit === 'fluid ounce') {
        return quantity * 29.5735296875;
    } else if (unit === 'pounds' || unit === 'pound') {
        return quantity * 453.592;
    } else if (unit === 'cups' || unit === 'cup') {
        return quantity * 236.5882375;
    } else if (unit === 'tablespoons' || unit === 'tablespoon') {
        return quantity * 14.7867648437
    } else if (unit === 'teaspoons' || unit === 'teaspoon') {
        return quantity * 4.92892161457;
    } else if (unit === 'liters' || unit === 'liter') {
        return quantity * 1000;
    } else if (unit === 'quarts' || unit === 'quart') {
        return quantity * 946.35295;
    } else if (unit === 'gallons' || unit === 'gallon') {
        return quantity * 3785.4118;
    } else {
        return quantity;
    }
}

//****************************************** EXPORTS *************************************************************

exports.getGrams = getGrams;
