sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/IconPool"
	],
	function (Common, CommonController, JSONModelHelper, IconPool) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplyReturn"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ClubApplyReturn",

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
				
				//Registering to the icon pool
				IconPool.registerFont({
					fontFamily: "SAP-icons-TNT",
					fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
				});
				IconPool.fontLoaded("SAP-icons-TNT");

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				this.DetailModel.setData({ FormData: {} });
				
				if(oEvent.data)
					this.DetailModel.setData({ FormData: oEvent.data });
					
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				Common.log("onAfterShow");
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
