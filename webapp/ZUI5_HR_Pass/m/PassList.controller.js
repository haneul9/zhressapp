sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"../delegate/CondoHandler",
		"../delegate/CondoMobileHandler",
		"../delegate/FacilityHandler",
		"../delegate/FacilityMobileHandler"
	],
	function (Common, CommonController, JSONModelHelper, CondoHandler, CondoMobileHandler, FacilityHandler, FacilityMobileHandler) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "PassList",

			_vCurrentTabKey: "",

			getCondoHandler: function () {
				if (!this.CondoHandler) 
					this.CondoHandler = $.extend(true, CondoHandler.initialize(this), CondoMobileHandler);	// overriding

				return this.CondoHandler;
			},

			getFacilityHandler: function () {
				if (!this.FacilityHandler) 
					this.FacilityHandler = $.extend(true, FacilityHandler.initialize(this), FacilityMobileHandler);	// overriding

				return this.FacilityHandler;
			},

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") return;
			},

			onAfterShow: function () {
				if(this._vCurrentTabKey === "Condo") this.initCondoTabView.call(this);
				else this.initFacilityTabView.call(this);
			},

			initCondoTabView: function(oEvent) {
				if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") {
					if(oEvent.data.isResvRefresh === true) this.CondoHandler.buildResvMyTable();
				} else {
					this.CondoHandler.load();
				}
			},
			
			initFacilityTabView: function(oEvent) {
				if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") {
					if(oEvent.data.isResvRefresh === true) this.FacilityHandler.buildMyApprTable();
				} else {
					this.FacilityHandler.load();
				}
			},

			handleTabBarSelect: function(oEvent) {
				var sKey = oEvent.getParameter("selectedKey");

				if (this._vCurrentTabKey === sKey) return;
				else this._vCurrentTabKey = sKey;

				if (this._vCurrentTabKey === "Facility") this.initFacilityTabView.call(this);
				else this.initCondoTabView.call(this);
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null
		});
	}
);