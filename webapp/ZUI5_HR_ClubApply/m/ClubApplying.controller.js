sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/IconPool",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, JSONModelHelper, IconPool, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplying"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ClubApplying",

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
			
			onPressCancel: function() {
				var oController = $.app.getController();
				var oController2 = this.getView().getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				
				var sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "3";
				sendObject.ILangu = "3";
				
				// Navigation property
				sendObject.TableIn = [this.DetailModel.getProperty("/FormData")];
				
				try{
					BusyIndicator.show(0);
					
					oModel.create("/DonghoListSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							sap.m.MessageBox.alert(oController.getBundleText("MSG_10002"), {
								title: oController.getBundleText("LABEL_09030")
							});
							oController.onTableSearch(); //Table Reflesh
							oController2.navBack();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							BusyIndicator.hide();
						}
					});
				} catch (ex) {
					Common.log(ex);
					BusyIndicator.hide();
				}
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
