sap.ui.define([
	"sap/m/DateRangeSelection"
], function (DateRangeSelection) {
	"use strict";

		return DateRangeSelection.extend("common.PickOnlyDateRangeSelection", {

		constructor: function() {

			DateRangeSelection.apply(this, [].slice.call(arguments));

			this.addEventDelegate({
				onAfterRendering: function() {
					this.$().find("input").prop("readonly", true).off("click").on("click", function() {
						this.toggleOpen(this.isOpen());
					}.bind(this));
				}
			}, this);
		}

	});

});