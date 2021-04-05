sap.ui.define([
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/Fragment"
], function(BusyIndicator, Fragment) {
"use strict";

// Fragment popup open util.
// ZUI5_HR_BusinessTrip/delegate/On.js pressRequestListRowAction function 참고

return {

	open: function(dialogHandler) {

		BusyIndicator.show(0);

		if (!dialogHandler.getDialog()) {
			Fragment.load(
				dialogHandler.getLoadingProperties()
			)
			.then(function(oDialog) {

				dialogHandler.setDialog(oDialog);
				dialogHandler.getParentView().addDependent(oDialog); // connect dialog to the root view of this component (models, lifecycle)

				if (typeof dialogHandler.once === "function") {
					dialogHandler
						.once()
						.then(function() {
							this._(dialogHandler);
						}.bind(this));

				} else {
					this._(dialogHandler);

				}
			}.bind(this));

		} else {
			this._(dialogHandler);

		}
	},

	_: function(dialogHandler) {

		if (typeof dialogHandler.onBeforeOpen === "function") {
			dialogHandler
				.onBeforeOpen()
				.then(function() {
					BusyIndicator.hide();

					dialogHandler.getDialog().open();
				});

		} else {
			BusyIndicator.hide();

			dialogHandler.getDialog().open();

		}
	}

};

});