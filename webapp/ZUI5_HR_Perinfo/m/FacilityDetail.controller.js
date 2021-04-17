sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"common/SearchUserMobile",
	],
	function (Common, CommonController, JSONModelHelper, SearchUserMobile) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "FacilityDetail",
			LoginSession  : new sap.ui.model.json.JSONModel(), 
			// getFacilityHandler: function () {
			// 	if (!this.FacilityHandler) 
			// 		this.FacilityHandler = $.app.getController().FacilityHandler;

			// 	return this.FacilityHandler;
			// },	

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);
			},

			onBeforeShow: function (oEvent) {
				// if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") return;
				if(oEvent && oEvent.data ){
					this.LoginSession.setProperty("/Data", oEvent.data);
					SearchUserMobile.oController = this;
					SearchUserMobile.fPersaEnabled = false;
					SearchUserMobile._vPersa = oEvent.data.Session.Persa;
				}
			},
			
			// onESSelectPerson: function (oEvent) {
			// 	var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
			// 		oRowData = $.extend(true, {}, this.oModel.getProperty(vSpath));
	
			// 	sap.ui.getCore().getEventBus().publish("nav", "to", {
			// 		id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix()),
			// 		data : oRowData
			// 	});
			// },

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);