sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/IconPool",
		"sap/ui/core/BusyIndicator"
	],
	function (Common, CommonController, JSONModelHelper, IconPool, BusyIndicator) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplyInfo"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ClubApplyInfo",

			DetailModel: new JSONModelHelper(), 

			getUserId: function() {
				
				return $.app.getController().getUserId();
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);
				
				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				BusyIndicator.show(0);

				this.DetailModel.setData({ FormData: {} });
				
				if(oEvent.data)
					this.DetailModel.setData({ FormData: oEvent.data });
					
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				Common.log("onAfterShow");
				BusyIndicator.hide();
			},
			
			navBack: function() {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "9104340"});
			} : null
			 
		});
	}
);
