const authenticate = () => {
	try {
		// load google credential file for authentication
		require('dotenv').config()
		const GoogleSpreadsheet = require('google-spreadsheet')
		const credentials = require('./credentials')
		const spreadsheet = new GoogleSpreadsheet(process.env.SPREADSHEET_ID)
		return new Promise( (resolve, reject) => {
			spreadsheet.useServiceAccountAuth(credentials, (error) => {
				if(error)
					reject({
						authResult: error,
						spreadsheet: null
					})
				resolve({
					authResult: 'success',
					spreadsheet: spreadsheet
				})
			})
		})
	}	catch (error) {
		return error
	}
}

module.exports = authenticate
