const express = require('express')

const app = express()

app.get('/', async (req, res) => {
	//set header to allow cross origin
  res.setHeader('Access-Control-Allow-Origin', '*')
	const url = require('url')
	const query = url.parse(req.url, true).query
	// save query parameters from front-end form submit
	const { boleto, lojista, fornecedor, pagamento, valor,
		venda, comissao, assessor, vencimento, tipo } = query
	// check if parameters are valid
	const validParameters = Boolean(boleto && lojista && fornecedor && pagamento && valor && venda
		&& comissao && assessor && vencimento && tipo)
	// if valid, generate the calculated parameters
	if (validParameters) {
		const findMonth = require('./functions/findMonth')
		const receita = valor * comissao
		const mes = findMonth(venda.substr(3,3))
		// save all parameters to a google spreadsheet
		const sheetUpdater = require('./functions/sheetUpdater')
		try {
			res.send(await sheetUpdater({ boleto, lojista, fornecedor, pagamento, valor, venda, comissao,
				assessor, vencimento, tipo, receita, mes }))
		} catch (error) {
			console.log(error)
			res.send(error)
		}
	} else {
		res.send('INVALID_REQUEST')
	}
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))

/* sample query
?boleto=12345&lojista=joao&fornecedor=maria&pagamento=dinheiro&valor=300.00
&venda=03/jan/2018&comissao=0.05&assessor=leandro&vencimento=04/jan/2018&tipo=online
*/
