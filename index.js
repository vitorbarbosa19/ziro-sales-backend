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
		const receita = Math.round(valor * comissao * 100) / 100
		const mes = findMonth(venda.substr(3,3))
		const ano = venda.substr(7,4)
		const cadastro = new Date().toString().substr(4,20)
		const [ polo, rua ] = endereco.split("—").map( string => string.trim() )
		// save all parameters to a google spreadsheet
		const sheetUpdater = require('./functions/sheetUpdater')
		try {
			await sheetUpdater({ sheet: 'ONE', romaneio, boleto, lojista, fornecedor, pagamento, valor, venda,
				comissao, assessor, vencimento, quantidade, tipo, polo, rua, receita, mes, ano, cadastro })
			await sheetUpdater({ sheet: 'TWO', romaneio, boleto, lojista, fornecedor, pagamento, valor, venda,
				comissao, assessor, vencimento, quantidade, tipo, polo, rua, receita, mes, ano, cadastro })
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

// curl "http://localhost:3000/?romaneio=&boleto=11111&lojista=A%20FASHION%20SHOP&fornecedor=100%20Morena&endereco=Br%C3%A1s%20%E2%80%94%20Casemiro%20de%20Abreu,%20602&pagamento=Boleto&valor=0.01&venda=05/Jan/2019&comissao=0.05&quantidade=1&assessor=Alan&vencimento=05/Jan/2019&tipo=Online"