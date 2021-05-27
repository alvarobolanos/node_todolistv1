exports.getDate = function() {
	const today = new Date();
	
	year = today.getFullYear().toString();
	month = today.getMonth()+1
	if( month < 10) {
		month = ["0", month.toString()].join("");
	}
	date = today.getDate()
	if( date < 10) {
		date = ["0", date.toString()].join("");
	}
	date = today.getDate().toString();

	day = [year, month, date].join("-");
	return day;
};