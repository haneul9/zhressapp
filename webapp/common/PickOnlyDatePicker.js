sap.ui.define([
	"sap/m/DatePicker"
], function(DatePicker) {
	"use strict";

	return DatePicker.extend("common.PickOnlyDatePicker", {

		constructor: function() {

			DatePicker.apply(this, [].slice.call(arguments));

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