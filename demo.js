const NutrientDataLaboratory = require("nutrient-data-laboratory");

let ndl = new NutrientDataLaboratory('Zo7ru5UezyJCdMFmNSwqBnZiQUKysRvoRx9skNOc');
const searchQuery = 'carrots';

ndl.search({
  q: searchQuery,
  max: 25,
  offset: 0
  }, (err, res) => {
  if (err) {
    console.error(err);
  }
  else {
    //console.log(res.list.item);
    let ndbnoQuery = res.list.item[0].ndbno;
    console.log(searchQuery + " ndbno is: " + ndbnoQuery);
    ndl.foodReports({
      ndbno: ndbnoQuery,
      type: 'b'
    }, (err, result) => {
      if (err) {
        console.error(err);
      }
      else {
        let energyIndex = findEnergy(result.report.food.nutrients);
        console.log("100 grams of " + searchQuery + " is " +
        result.report.food.nutrients[energyIndex].value + " " +
        result.report.food.nutrients[energyIndex].unit);
      }
    });
  }
});

function findEnergy(input){
  for (let i = 0; i < input.length; i++){
    if (input[i].name === 'Energy'){
      return i;
    }
  }
  return -1;
}
