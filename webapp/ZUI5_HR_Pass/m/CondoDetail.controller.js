sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper"
	],
	function (Common, CommonController, JSONModelHelper) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "CondoDetail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "CondoDetail",

			_CondoDetailJSonModel: new JSONModelHelper(),

			getCondoHandler: function () {
				if (!this.CondoHandler) 
					this.CondoHandler = $.app.getController().CondoHandler;

				return this.CondoHandler;
			},

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow
					}, this);
			},

			onBeforeShow: function () {
				// 입/퇴실 가능일자 Set
				this.CondoHandler.setPossibleRangeDate.call(this.CondoHandler);
				
				// 선택가능 객실 수 Set
				this.CondoHandler.setPossibleRoomCount.call(this.CondoHandler);
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);