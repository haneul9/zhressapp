/* global common:true */
jQuery.sap.declare("common.Formatter");

jQuery.sap.require("common.Common");
jQuery.sap.require("sap.ui.core.format.DateFormat");

common.Formatter = {
	/**
	 * @memberOf common.Formatter
	 */

	Ename: new String(),

	dateType: new sap.ui.model.type.Date({
		pattern: "yyyy.MM.dd"
	}),

	Date: function (value) {
		//		alert("Date :" + value);
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},

	setTooltip: function (val1) {
		return common.Common.TooltipEmpolyeeCard(val1);
	},

	StatusColor: function (fVal) {
		if (fVal == "10") {
			return "#999999";
		} else if (fVal == "20" || fVal == "25") {
			return "#F0AB00";
		} else if (fVal == "30") {
			return "#00B050";
		} else if (fVal == "40") {
			return "#CC1919";
		} else if (fVal == "50") {
			return "#8DC63F"; //actDesign color change
		}
	},

	RetStatusColor: function (fVal) {
		if (fVal == "" || fVal == "01" || fVal == "10" || fVal == "30" || fVal == "40" || fVal == "50" || fVal == "55") {
			return "#999999";
		} else if (fVal == "60") {
			return "#F0AB00";
		} else if (fVal == "70") {
			return "#00B050";
		} else if (fVal == "75") {
			return "#CC1919";
		} else if (fVal == "80") {
			return "#009DE0";
		}
	},

	RecStatusColor: function (fVal) {
		if (fVal == "A") {
			return "#999999";
		} else if (fVal == "B") {
			return "#F0AB00";
		} else if (fVal == "C") {
			return "#009DE0";
		}
	},

	ChhListStatusColor: function (fVal) {
		if (fVal == "1") {
			return "#CC1919";
		} else if (fVal == "2") {
			return "#999999";
		} else if (fVal == "3") {
			return "#009DE0";
		}
	},

	ProjectHassStatusColor: function (fVal) {
		if (fVal == "N") {
			return "#999999";
		} else if (fVal == "R") {
			return "#F0AB00";
		} else if (fVal == "C") {
			return "#009DE0";
		} else if (fVal == "D") {
			return "#CC1919";
		}
	},

	// Hass 에 9(현황)추가 20160428 KYJ
	ProjectExpHassStatusColor: function (fVal) {
		if (fVal == "1") {
			return "#999999";
		} else if (fVal == "2") {
			return "#F0AB00";
		} else if (fVal == "3") {
			return "#009DE0";
		} else if (fVal == "4") {
			return "#CC1919";
		} else if (fVal == "9") {
			return "#00B050";
		}
	},

	ProjectExpEssStatusColor: function (fVal) {
		if (fVal == "1") {
			return "#999999";
		} else if (fVal == "2") {
			return "#009DE0";
		} else if (fVal == "3") {
			return "#009DE0";
		} else if (fVal == "4") {
			return "#CC1919";
		} else if (fVal == "9") {
			return "#00B050";
		}
	},

	HRDocStatusColor: function (fVal) {
		if (fVal == "10") {
			return "#999999";
		} else if (fVal == "20") {
			return "#00B050";
		} else if (fVal == "25") {
			return "#CC1919";
		} else if (fVal == "30") {
			return "#009DE0";
		}
	}
};
