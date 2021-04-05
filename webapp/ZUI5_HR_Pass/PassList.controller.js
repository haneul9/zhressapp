/* eslint-disable no-mixed-spaces-and-tabs */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"./delegate/CondoHandler",
		"./delegate/FacilityHandler",
		"common/JSONModelHelper"
	],
	function (Common, CommonController, CondoHandler, FacilityHandler, JSONModelHelper) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "PassList",

			_vCurrentTabKey: "",

			getCondoHandler: function () {
				if (!this.CondoHandler)
					this.CondoHandler = CondoHandler.initialize(this);

				return this.CondoHandler;
			},

			getFacilityHandler: function () {
				if (!this.FacilityHandler)
					this.FacilityHandler = FacilityHandler.initialize(this);

				return this.FacilityHandler;
			},

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onAfterShow: function () {
				this.FacilityHandler.load();
			},

			handleTabBarSelect: function (oEvent) {
				var sKey = oEvent.getParameter("selectedKey");

				if (this._vCurrentTabKey === sKey) return;
				else this._vCurrentTabKey = sKey;

				if (this._vCurrentTabKey === "Facility") this.FacilityHandler.load();
				else this.CondoHandler.load();
			},

			getLocalSessionModel: Common.isLOCAL()
				? function () { return new JSONModelHelper({ name: "35110041" }); }
				: null
		});
	}
);
