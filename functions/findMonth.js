const findMonth = (month) => {
	switch (month) {
		case 'jan': return 01
		case 'fev': return 02
		case 'mar': return 03
		case 'abr': return 04
		case 'mai': return 05
		case 'jun': return 06
		case 'jul': return 07
		case 'ago': return 08
		case 'set': return 09
		case 'out': return 10
		case 'nov': return 11
		case 'dez': return 12
	}
}

module.exports = findMonth