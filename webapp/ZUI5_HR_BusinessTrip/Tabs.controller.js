/* global moment */
sap.ui.define([
	"common/Common",
	"common/CommonController",
	"./delegate/OnRequest",
	"./delegate/OnSettlement",
	"sap/base/util/UriParameters",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	CommonController,
	OnRequest,
	OnSettlement,
	UriParameters,
	JSONModel
) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 출장

	PAGEID: "",
	RequestSearchModel: new JSONModel(),
	RequestListModel: new JSONModel(),
	RequestDetailModel: new JSONModel(),
	SettlementSearchModel: new JSONModel(),
	SettlementListModel: new JSONModel(),
	SettlementDetailModel: new JSONModel(),
	SetPerSon:"",
	SetAddLine:"",

	onInit: function() {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		var Dtfmt = this.getSessionInfoByKey("Dtfmt"),
		IBegda = moment().startOf("date").subtract(1, "months").add(1, "days").toDate(),
		IEndda = moment().startOf("date").toDate();

		this.RequestSearchModel.setData({
			Dtfmt: Dtfmt,
			IBegda: IBegda,
			IEndda: IEndda,
			IZzok: "0",
			ApprovalStatusList: []
		});
		this.SettlementSearchModel.setData({
			Dtfmt: Dtfmt,
			IBegda: IBegda,
			IEndda: IEndda,
			IBtStat: "0",
			ApprovalStatusList: []
		});

		this.RequestListModel.setData([]);
		this.SettlementListModel.setData([]);

		setTimeout(function() {
			this.retrieveApprovalStatusList.call(this, "ZHRD_OK_G", this.RequestSearchModel); // 출장 사전 신청 - 결재상태
		}.bind(this), 0);
		setTimeout(function() {
			this.retrieveApprovalStatusList.call(this, "ZHRD_BT_STAT", this.SettlementSearchModel); // 출장 비용 정산 - 결재상태
		}.bind(this), 0);
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		var tab = (UriParameters.fromQuery(document.location.search).get("tab") || "").toLowerCase(),
			html = (document.location.pathname || "").replace(/.*\/BusinessTrip(.+)\.html/, "$1").toLowerCase();

		if (tab === "settlement" || html === "settlement") {
			$.app.byId("BusinessTripTabBar").setSelectedKey("SettlementList");
			setTimeout(OnSettlement.pressSearch.bind(this), 0);
		} else {
			$.app.byId("BusinessTripTabBar").setSelectedKey("RequestList");
			setTimeout(OnRequest.pressSearch.bind(this), 0);
		}
	},

	// 결재상태 ComboBox 공통코드 목록 조회
	retrieveApprovalStatusList: function(ICodty, oModel) {

		$.app.getModel("ZHR_COMMON_SRV").create(
			"/CommonCodeListHeaderSet",
			{
				ICodeT: "004",
				ICodty: ICodty,
				ILangu: this.getSessionInfoByKey("Langu"),
				NavCommonCodeList: []
			},
			{
				success: function(oData) {
					if (oData && oData.NavCommonCodeList.results) {
						oModel.setProperty("/ApprovalStatusList", oData.NavCommonCodeList.results);
					} else {
						oModel.setProperty("/ApprovalStatusList", []);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);

					oModel.setProperty("/ApprovalStatusList", []);
				}
			}
		);
	},

	selectBusinessTripTabBar: function(oEvent) {

		var selectedKey = oEvent.getParameter("key"),
		IBegda = moment().startOf("date").subtract(1, "months").add(1, "days").toDate(),
		IEndda = moment().startOf("date").toDate();

		if (selectedKey === "RequestList") {
			// this.RequestSearchModel.setProperty("/IBegda", IBegda);
			// this.RequestSearchModel.setProperty("/IEndda", IEndda);
			// this.RequestSearchModel.setProperty("/IZzok", "0");
			// this.RequestListModel.setData([]);

			setTimeout(OnRequest.pressSearch.bind(this), 0);

		} else if (selectedKey === "SettlementList") {
			// this.SettlementListModel.setProperty("/IBegda", IBegda);
			// this.SettlementListModel.setProperty("/IEndda", IEndda);
			// this.SettlementListModel.setProperty("/IBtStat", "0");
			// this.SettlementListModel.setData([]);

			setTimeout(OnSettlement.pressSearch.bind(this), 0);

		}
	},

	openWindow: function(p) {

		Common.openPopup(p.url);
	},

	onESSelectPerson: function(oEvent) {

		this.RequestDetailDialogHandler.flag == "5"
			? OnRequest.setAdded.call($.app.getController(), oEvent)
			: OnRequest.setAccompanier.call($.app.getController(), oEvent);
	},

	displayMultiOrgSearchDialog: OnRequest.searchOrg,

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