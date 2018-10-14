const express = require('express')

const app = express()

app.get('/', async (req, res) => {
	//set header to allow cross origin
	res.setHeader('Access-Control-Allow-Origin', '*')
	const url = require('url')
	const query = url.parse(req.url, true).query
	// save query parameters from front-end form submit
	const { romaneio, boleto, lojista, fornecedor, pagamento, valor,
		venda, comissao, quantidade, assessor, vencimento, tipo, endereco } = query
	// check if parameters are valid
	const validParameters = Boolean(boleto && lojista && fornecedor && pagamento && valor && venda
		&& comissao && quantidade && assessor && vencimento && tipo && endereco)
	// if valid, generate the calculated parameters
	if (validParameters) {
		const findMonth = require('./functions/findMonth')
		const receita = valor * comissao
		const mes = findMonth(venda.substr(3,3))
		const ano = venda.substr(7,4)
		const cadastro = new Date().toString().substr(4,20)
		// save all parameters to a google spreadsheet
		const sheetUpdater = require('./functions/sheetUpdater')
		try {
			await sheetUpdater({ sheet: 'ONE', romaneio, boleto, lojista, fornecedor, pagamento, valor, venda,
				comissao, assessor, vencimento, quantidade, tipo, endereco, receita, mes, ano, cadastro })
			await sheetUpdater({ sheet: 'TWO', romaneio, boleto, lojista, fornecedor, pagamento, valor, venda,
				comissao, assessor, vencimento, tipo, endereco, receita, mes, ano, cadastro })
			res.send('_SUCCESS')
		} catch (error) {
			console.log(error)
			res.send(error)
		}
	} else {
		res.send('INVALID_REQUEST')
	}
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))
