const express = require('express')

const app = express()

app.get('/', async (req, res) => {
	//set header to allow cross origin
  res.setHeader('Access-Control-Allow-Origin', '*')
	const url = require('url')
	const query = url.parse(req.url, true).query
	// save query parameters from front-end form submit
	const { romaneio, boleto, lojista, fornecedor, pagamento, valor,
		venda, comissao, assessor, vencimento, tipo } = query
	// check if parameters are valid
	const validParameters = Boolean(boleto && lojista && fornecedor && pagamento && valor && venda
		&& comissao && assessor && vencimento && tipo)
	// if valid, generate the calculated parameters
	if (validParameters) {
		const findMonth = require('./functions/findMonth')
		const receita = valor * comissao
		const mes = findMonth(venda.substr(3,3))
		const ano = venda.substr(7,4)
		// save all parameters to a google spreadsheet
		const sheetUpdater = require('./functions/sheetUpdater')
		try {
			res.send(await sheetUpdater({ romaneio, boleto, lojista, fornecedor, pagamento, valor, venda,
				comissao, assessor, vencimento, tipo, receita, mes }))
		} catch (error) {
			console.log(error)
			res.send(error)
		}
	} else {
		res.send('INVALID_REQUEST')
	}
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))
