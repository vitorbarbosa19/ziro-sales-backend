const sheetUpdater = (parameters) => {
	return new Promise( async (resolve, reject) => {
		try {
			// authenticate to get permission to edit spreadsheet
			const auth = require('./authenticate')
			const { authResult, spreadsheet } = await auth()
			// add a new row to spreadsheet
			if (authResult === 'success') {
        spreadsheet.addRow(1, parameters, (error, rows) => {
          if(error)
            reject(error)
          resolve('SUCCESS')
        })
			}
		} catch (error) {
			reject(error)
		}
	})
}

module.exports = sheetUpdater