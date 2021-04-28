sap.ui.define(
	[
		"common/Common",
		"./ODataService",
		"sap/ui/core/BusyIndicator"
	],
	function (Common, ODataService, BusyIndicator) {
		"use strict";

		/**
		 * Mobile handler
		 * ./FacilityHandler.js에 overriding하여 사용.
		 */
		var FacilityHandler = {

			navBack: function() {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "PassList"].join($.app.getDeviceSuffix())
				});
			},

			buildMyApprTable: function () {
				var results = ODataService.FacilityApplySet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

				results.map(function (elem) {
					elem.Reqno = String(parseInt(elem.Reqno, 10));
					elem.Resno = String(parseInt(elem.Resno, 10));
				});

				this.oModel.setProperty("/MyList", results);
			},

			buildRequestTable: function () {
				var results = ODataService.FacilityListSet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

				this.oModel.setProperty("/RequestList", results);
			},

			onPressRowRequest: function (oEvent) {
				BusyIndicator.show(0);

				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = $.extend(true, {}, this.oModel.getProperty(vSpath));

				Common.getPromise(
					function () {
						// Set data
						delete oRowData.Reqno;
						delete oRowData.Cellp;
						delete oRowData.Email;
						delete oRowData.Zbigo;
			
						// Display control
						oRowData.isNew = true;

						this.oModel.setProperty("/Detail", oRowData);
			
						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix())
						});
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			onPressResvRow: function(oEvent) {
				BusyIndicator.show(0);

				var oRowData = $.extend(true, {}, oEvent.getParameter("listItem").getBindingContext().getProperty());

				Common.getPromise(
					function () {
						// Set data
						oRowData.Usepn = String(parseInt(oRowData.Usepn, 10));
						oRowData.Rangeda = "${Night}박${Days}일".interpolate(parseInt(oRowData.Stano, 10), parseInt(oRowData.Stano, 10) + 1);

						// Display control
						oRowData.isNew = false;

						this.oModel.setProperty("/Detail/Data", oRowData);

						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix())
						});
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			ProcessAfterNavigation: function() {
				this.navBack();
			}
		};

		return FacilityHandler;
	}
);
