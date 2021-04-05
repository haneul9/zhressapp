sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"./delegate/StatusListHandler",
		"./delegate/DetailHandler"
	], 
	function (Common, CommonController, JSONModelHelper, StatusListHandler) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			
			PAGEID: "Page",

			oDetailDialog: null,
			
			onInit: function () {
				this.setupView().getView().addEventDelegate(
					{
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					},
					this
				);
			},
			
			onBeforeShow: function() {
				this.StatusListHandler.load();
			},
			
			onAfterShow: function() {
				this.StatusListHandler.search();
			},

			getStatusListHandler: function () {
				if (!this.StatusListHandler) {
					this.StatusListHandler = StatusListHandler.initialize(this);
				}

				return this.StatusListHandler;
			},
			
			getDetailHandler: function () {

				return this.DetailHandler;
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20001003"});
			} : null
		});
	}
);