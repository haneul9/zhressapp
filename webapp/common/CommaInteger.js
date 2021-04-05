sap.ui.define([
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException",
	"sap/ui/model/SimpleType"
], function (FormatException, ParseException, SimpleType) {
	"use strict";

	return SimpleType.extend("common.CommaInteger", {

		formatValue: function(vValue, sTargetType) {

			var p = this.oFormatOptions;
			if (!vValue) {
				return typeof p.defaultValue !== "undefined" ? String(p.defaultValue) : "0";
			}
			var sValue = String(vValue).replace(/[^+-\d.eE]/g, "");
			if (isNaN(sValue)) {
				return typeof p.defaultValue !== "undefined" ? String(p.defaultValue) : "0";
			}

			sValue = String(Number(sValue));
			if (this.oFormatOptions.maxNumberLength) {
				sValue = sValue.replace(new RegExp("^(-?\\d{" + this.oFormatOptions.maxNumberLength + "}).*"), "$1");
			}
			return sValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},

		parseValue: function(vValue, sSourceType) {

			var p = this.oFormatOptions;
			if (!vValue) {
				return typeof p.defaultValue !== "undefined" ? p.defaultValue : 0;
			}
			var sValue = String(vValue).replace(/[^+-\d.eE]/g, "");
			if (isNaN(sValue)) {
				return typeof p.defaultValue !== "undefined" ? p.defaultValue : 0;
			}

			sValue = String(Number(sValue));
			if (this.oFormatOptions.maxNumberLength) {
				sValue = sValue.replace(new RegExp("^(-?\\d{" + this.oFormatOptions.maxNumberLength + "}).*"), "$1");
			}
			return Number(sValue);
		},

		validateValue: function(vValue) {}

	});

});