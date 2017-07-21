var NutrientDataLaboratory = require("nutrient-data-laboratory");

let ndl = new NutrientDataLaboratory('Zo7ru5UezyJCdMFmNSwqBnZiQUKysRvoRx9skNOc');

ndl.foodReports({
  ndbno: '01009',
  type: 'b'
}, (err, res) => {
  if (err) console.error(err)
  else console.log(res.report.food.nutrients[1].value + " " + res.report.food.nutrients[1].unit);
})

ndl.search({
  q: 'butter',
  max: 25,
  offset: 0
}, (err, res) => {
  if (err) console.error(err)
  else console.log(res.list.item[0].ndbno);
})
