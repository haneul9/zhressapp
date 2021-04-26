sap.ui.define(
	[
		"common/Common",
		"./ODataService"
	],
	function (Common, ODataService) {
		"use strict";

		/**
		 * Mobile handler
		 * ./CondoHandler.js에 overriding하여 사용.
		 */
		var CondoHandler = {
			
			buildResvMyTable: function () {
				var results = ODataService.CondoUseRequestSet.call(this.oController);

				this.oModel.setProperty("/MyResvList", results);
				$.app.byId(this.oController.PAGEID + "_MyResvList").removeSelections();
			},

			buildRequestTable: function () {
				var results = ODataService.CondoUseBookTotSet.call(this.oController);

				this.oModel.setProperty("/RequestList", results);
				this.oModel.setProperty("/RequestList-origin", results);
				$.app.byId(this.oController.PAGEID + "_RequestList").removeSelections();

				var filterItems = [{ Code: "ALL", Text: this.oController.getBundleText("LABEL_00131") }];	// 전체
				results.map(function(elem) {
					return { Code: elem.Condo, Text: elem.Contx };
				}).forEach(function(elem) {
					if(!filterItems.some(function(item) { return item.Code === elem.Code; })) {
						filterItems.push(elem);
					}
				});

				this.oModel.setProperty("/filter", {
					Condo: "ALL",
					CondoItems: filterItems
				});
			},

			navBack: function(isRefresh) {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "PassList"].join($.app.getDeviceSuffix()),
					data: { isResvRefresh: isRefresh || false }
				});
			},

			onPressResvRow: function(oEvent) {
				var oRowData = $.extend(true, {}, oEvent.getParameter("listItem").getBindingContext().getProperty());

				// Set data
				oRowData.Usepn = String(parseInt(oRowData.Usepn, 10));
				oRowData.Rangeda = "${Night}박${Days}일".interpolate(parseInt(oRowData.Stano, 10), parseInt(oRowData.Stano, 10) + 1);

				// Display control
				oRowData.isNew = false;

				this.oModel.setProperty("/Detail/Data", oRowData);

				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "CondoDetail"].join($.app.getDeviceSuffix())
				});
			},

			onPressRequestRow: function(oEvent) {
				var oRowData = $.extend(true, {}, oEvent.getParameter("listItem").getBindingContext().getProperty());
	
				// Set data
				oRowData.Compcd = this.getBasicTechCode(oRowData.Werks);
				oRowData.Appbg = oRowData.Begda;
				oRowData.Appen = oRowData.Endda;
				oRowData.Romno = "01";

				delete oRowData.__metadata;
				delete oRowData.Begda;
				delete oRowData.Endda;
				delete oRowData.Usepn;

				// Display control
				oRowData.isNew = true;

				this.oModel.setProperty("/Detail/Data", oRowData);
	
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "CondoDetail"].join($.app.getDeviceSuffix())
				});
			},

			setFilter: function(oEvent) {
				var vCondoKey = oEvent.getSource().getSelectedKey();

				if(vCondoKey === "ALL") {
					this.oModel.setProperty("/RequestList", this.oModel.getProperty("/RequestList-origin"));
				} else {
					this.oModel.setProperty(
						"/RequestList",
						this.oModel.getProperty("/RequestList-origin").filter(function(elem) {
							return elem.Condo === vCondoKey;
						})
					);
				}
			},

			ProcessAfterNavigation: function() {
				this.navBack(true);
			},

			onPressCondoRequestCancelBtn: function () {

				this.CondoDeleteProcess(this.oModel.getProperty("/Detail/Data"));
			}
		};

		return CondoHandler;
	}
);
