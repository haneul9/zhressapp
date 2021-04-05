sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper"
	],
	function (Common, CommonController, JSONModelHelper) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "FacilityDetail",

			getFacilityHandler: function () {
				if (!this.FacilityHandler) 
					this.FacilityHandler = $.app.getController().FacilityHandler;

				return this.FacilityHandler;
			},

			onInit: function () {
				this.setupView();
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);