export const calculateUnitPrice = (productName, weightAndPrice) => {
  // Use String.prototype.matchAll para obter facilmente todos os resultados
  // para price, weight, e unit of measurement
  const matchResults = [...weightAndPrice.matchAll(/\d+|lb|kg/g)]

  // Use BigInt apenas no caso de os números com os quais estamos lidando serem REALMENTE grandes
  console.log(weightAndPrice)
  const price = BigInt(matchResults[0][0])
  const priceInCents = BigInt(matchResults[0][0] * 100)
  const weight = BigInt(matchResults[1][0])
  const unit = matchResults[2][0]

  const unitPriceInCents = Number(priceInCents / weight)
  const unitPriceInDollars = unitPriceInCents / 100
  const unitPriceFormatted = unitPriceInDollars.toFixed(2)

//   return `The unit price for ${weight} ${unit} of ${productName.toLowerCase()}s for $${price} is <b>$${unitPriceFormatted} per ${unit}</b>`
  return `O preço unitário de ${weight} ${unit} de ${productName.toLowerCase()}s por $${price} é <b>$${unitPriceFormatted} por ${unit}</b>`
}
