var express = require('express');
var router = express.Router();

router.get('/products', function(req, res) {
  res.json({
    products: [
      { name: 'Funko', sku: 100 },
      { name: 'Glasses', sku: 101 },
      { name: 'T-shirt', sku: 102 },
    ]
  })
});

router.get('/descriptions', (req, res) => {
  // Esse endpoint irá simular uma falha na API com intuito de ilustrar o `Promise.allSettled()`
  const shouldFail = Math.random() > 0.5
  const jsonOutput = {
    descriptions: [
      { sku: 100, description: 'comes in various models' },
      { sku: 101, description: 'currently on backorder' },
      { sku: 102, description: 'available in pink and blue' },
    ]
  }
  if (shouldFail) {
    res.sendStatus(500)
  } else {
    res.json(jsonOutput)
  }
});

router.get('/prices', (req, res) => {
  res.json({
    prices: [
      {
        sku: 100,
        priceOptions: {
          kg: [
            '$200 for 10 kg',
            '$300 for 20 kg',
            '$1000 for 100 kg',
          ],
          lbs: [
            '$200 for 22 lbs',
            '$300 for 44 lbs',
            '$1000 for 220 lbs',
          ]
        },
      },
      {
        sku: 101,
        priceOptions: {
          kg: [
            '$40 for 10 kg',
            '$70 for 20 kg',
            '$100 for 100 kg',
          ],
          lbs: [
            '$40 for 22 lbs',
            '$70 for 44 lbs',
            '$100 for 220 lbs',
          ]
        },
      },
      {
        sku: 102,
        priceOptions: {
          kg: [
            '$15 for 2 kg',
            '$17 for 3 kg',
            '$20 for 5 kg',
          ],
          lbs: [
            '$15 for 4 lbs',
            '$17 for 6 lbs',
            '$20 for 11 lbs',
          ]
        },
      },
    ]
  })
})

module.exports = router;
