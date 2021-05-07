/* global moment:true */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../ZUI5_HR_BusinessTrip/delegate/OnRequest",
	"../ZUI5_HR_BusinessTrip/delegate/OnSettlement",
	"sap/base/util/UriParameters",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	CommonController,
	OnRequest,
	OnSettlement,
	UriParameters,
	MessageBox,
	JSONModel
) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 출장 신청/정산 상세

	PAGEID: "",
	RequestSearchModel: null,
	RequestListModel: new JSONModel(),
	RequestDetailModel: new JSONModel(),
	SettlementSearchModel: null,
	SettlementListModel: new JSONModel(),
	SettlementDetailModel: new JSONModel(),

	onInit: function() {
		Common.log("onInit");

		this.getView().addEventDelegate({
			onBeforeShow: this.onBeforeShow
		}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		var parameters = UriParameters.fromQuery(document.location.search),
		tab = parameters.get("tab"),
		date = moment(parameters.get("date"), "YYYYMMDD").toDate();

		if (tab === "settlement") {
			this.SettlementSearchModel = new JSONModel({
				IBegda: date,
				IEndda: date,
				IZzdocno: parameters.get("id")
			});

			OnSettlement.pressSearch.call(this)
				.then(function() {
					var list = this.SettlementListModel.getProperty("/");
					if (list && list.length) {
						list[0].isReportPopup = true;

						this.SettlementDetailDialogHandler.get(this, list[0])
							.once()
							.then(function() {
								this.SettlementDetailDialogHandler.onBeforeOpen();
							}.bind(this));
					} else {
						MessageBox.error(this.getBundleText("MSG_19031")); // 해당 신청번호로 검색된 정보가 없습니다.
					}
				}.bind(this));

		} else {
			this.RequestSearchModel = new JSONModel({
				IBegda: date,
				IEndda: date,
				IZzdocno: parameters.get("id")
			});

			OnRequest.pressSearch.call(this)
				.then(function() {
					var list = this.RequestListModel.getProperty("/");
					if (list && list.length) {
						list[0].isReportPopup = true;

						this.RequestDetailDialogHandler.get(this, list[0])
							.once()
							.then(function() {
								this.RequestDetailDialogHandler.onBeforeOpen();
							}.bind(this));
					} else {
						MessageBox.error(this.getBundleText("MSG_19031")); // 해당 신청번호로 검색된 정보가 없습니다.
					}
				}.bind(this));

		}
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		return new JSONModel({name: "20001003"}); // 
		// return new JSONModel({name: "35132258"}); // 첨단
		// return new JSONModel({name: "35132259"}); // 첨단
		// return new JSONModel({name: "35132260"}); // 첨단
		// return new JSONModel({name: "35132261"}); // 첨단
		// return new JSONModel({name: "981014"}); // 기초
		// return new JSONModel({name: "991002"}); // 기초
		// return new JSONModel({name: "991004"}); // 기초
		// return new JSONModel({name: "8900366"}); // 기초
		// return new JSONModel({name: "8903376"}); // 기초
		// return new JSONModel({name: "9000290"}); // 기초
	} : null

});

});