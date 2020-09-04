(function(){
    const appState = {
      prices: [],
      doesPreferKilograms: null,
    }
  
    const fetchUnitOfMeasurementPreference = () => {
      // Use o objeto globalThis para acessar o window 
      // Use optional chaining para ter acesso valor de localStorage se possível
      const doesPreferKilograms = globalThis.localStorage?.getItem?.('prefersKg')
      
      // Use nullish coalescing para usar a preferência ou o padrão para true
      appState.doesPreferKilograms = JSON.parse(doesPreferKilograms ?? 'true')
  
      const kgOption = document.querySelector('#kg')
      const lbsOption = document.querySelector('#lbs')
  
      if (appState.doesPreferKilograms) {
        lbsOption.selected = false
        kgOption.selected = true
      } else {
        kgOption.selected = false
        lbsOption.selected = true
      }
    }
  
    const addEventListeners = () => {
      const unitOfMeasurementDropdown = document.querySelector('#unit')
      unitOfMeasurementDropdown.addEventListener('change', handleUnitChange)
  
      const productDropdown = document.querySelector('#product')
      productDropdown.addEventListener('change', () => populateWeightAndPriceDropdown(appState.prices, appState.doesPreferKilograms))
    
      const form = document.querySelector('#unit-price-calculator-form')
      form.addEventListener('submit', handleFormSubmit)
    }
  
    const handleUnitChange = e => {
      const selectedValue = e.target.value
      const prefersKg = selectedValue === 'kg'
  
      appState.doesPreferKilograms = prefersKg
      // Use o objeto globalThis para acessar o window 
      // Use optional chaining para possívelmente ter acesso valor de localStorage
      globalThis.localStorage?.setItem?.('prefersKg', prefersKg)
  
      populateWeightAndPriceDropdown(appState.prices, prefersKg)
    }
  
    const populateWeightAndPriceDropdown = (prices, doesPreferKilograms) => {
      const selectedSku = Number(document.querySelector('#product').value)
      const skuPriceOptions = prices.find(product => product.sku === selectedSku)
      
      // Use optional chaining para lidar com produtos possívelmente undefined
      const weightAndPriceOptions = skuPriceOptions?.priceOptions[doesPreferKilograms ? 'kg' : 'lbs']
      
      const weightAndPriceDropdown = document.querySelector('#weight-and-price')
      
      if (weightAndPriceOptions) {
        const dropdownOptions = weightAndPriceOptions.map((weightAndPriceOption) =>
          `<option value="${weightAndPriceOption}">${weightAndPriceOption}</option>`
        )
        weightAndPriceDropdown.innerHTML = [
          '<option disabled selected value="">Selecione Aqui</option>',
          ...dropdownOptions,
        ].join('')
      } else {
        weightAndPriceDropdown.innerHTML =
          '<option disabled selected value="">Por favor selecione após selecionar um produto e unidade de medida</option>'
      }
    }
  
    const handleFormSubmit = e => {
      e.preventDefault()
      const resultsContainer = document.querySelector('#results-container')
  
      // Dynamic import para importar o módulo calculate.js
      // para que o código seja carregado lentamente quando o botão enviar é clicado
      import('./calculate.js')
        .then(module => {
          const selectedProductSku = Number(document.querySelector('#product').value)
          const selectedProduct = appState.products.find(product => product.sku === selectedProductSku)
          const selectedProductName = (selectedProduct || {}).name
          const selectedWeightAndPrice = document.querySelector('#weight-and-price').value
          
          const unitPriceResult = module.calculateUnitPrice(selectedProductName, selectedWeightAndPrice)
          resultsContainer.insertAdjacentHTML('afterbegin', `<div class="alert alert-success" role="alert">${unitPriceResult}</div>`)
        })
        .catch(err => {
          resultsContainer.insertAdjacentHTML('afterbegin', `<div class="alert alert-danger" role="alert">Por favor, faça seleções para todos os três campos do formulário.</div>`)
        })
    }
  
    // Promise.allSettled, usado para buscar dados de vários endpoints
    // preenchendo o product dropdown assim que os endpoints responderem
    const fetchInitialProductData = () => {
      const fetchProductsPromise = fetch('/api/products')
        .then(response => response.json())
  
      const fetchPricesPromise = fetch('/api/prices')
        .then(response => response.json())
  
      const fetchDescriptionsPromise = fetch('/api/descriptions')
        .then(response => response.json())
  
      Promise.allSettled([fetchProductsPromise, fetchPricesPromise, fetchDescriptionsPromise])
        .then(data => {
          // Optional chaining para lidar com dados possivelmente ausentes
          if (data?.[0]?.status === 'fulfilled' && data?.[1]?.status === 'fulfilled') {
            const products = data[0].value?.products
            const prices = data[1].value?.prices
            const descriptions = data[2].value?.descriptions
            populateProductDropdown(products, descriptions)
            saveDataToAppState(products, prices, descriptions)
            return
          }
          throw new Error('Dados de produto ou preço ausentes')
        })
        .catch(err => {
          const resultsContainer = document.querySelector('#results-container')
          resultsContainer.insertAdjacentHTML('afterbegin', `<div class="alert alert-danger" role="alert">Erro ao buscar dados do produto. Por favor, tente novamente mais tarde.</div>`)
        })
    }
  
    const populateProductDropdown = (products = [], descriptions = []) => {
      const productDropdown = document.querySelector('#product')
      const productDropdownOptions = products.map((product, index) => {
        const descriptionMarkup = descriptions?.[index]?.description ? ` (${descriptions[index].description})` : ''
        return `<option value="${product.sku}">${product.name}${descriptionMarkup}</option>`
      })
      productDropdown.insertAdjacentHTML('beforeend', productDropdownOptions.join(''))
    }
  
    const saveDataToAppState = (products = [], prices = [], descriptions = []) => {
      appState.products = products
      appState.prices = prices
      appState.descriptions = descriptions
    }
  
    const init = () => {
      fetchUnitOfMeasurementPreference()
      addEventListeners()
      fetchInitialProductData()
    }
    
    init()
  })()
  