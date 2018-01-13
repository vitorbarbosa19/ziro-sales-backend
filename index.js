const express = require('express')

const app = express()

app.get('/', (req, res) => {
	const url = require('url')
	const query = url.parse(req.url, true).query
	// query parameters from form submit
	const { boleto, lojista, fornecedor, pagamento, valor,
		venda, comissao, assessor, vencimento, tipo } = query
	// calculated parameters
	const findMonth = require('./functions/findMonth')
	const receita = valor * comissao
	const mes = venda.substr(3,3)
	const mes_num = findMonth(mes)
	console.log(receita, mes, mes_num)
	res.send(query)
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`))

/* query
localhost:3000?boleto=12345&lojista=joao&fornecedor=maria&pagamento=dinheiro&valor=300.00
&venda=03/jan/2018&comissao=0.05&assessor=leandro&vencimento=04/jan/2018&tipo=online
*/
