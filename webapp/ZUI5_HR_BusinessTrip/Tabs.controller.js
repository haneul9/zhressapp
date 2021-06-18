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

	RequestSearchModel: new JSONModel(),
	RequestListModel: new JSONModel(),
	RequestDetailModel: new JSONModel(),
	SettlementSearchModel: new JSONModel(),
	SettlementListModel: new JSONModel(),
	SettlementDetailModel: new JSONModel(),

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
			this.retrieveApprovalStatusList("ZHRD_OK_G", this.RequestSearchModel); // 출장 사전 신청 - 결재상태
		}.bind(this), 0);
		setTimeout(function() {
			this.retrieveApprovalStatusList("ZHRD_BT_STAT", this.SettlementSearchModel); // 출장 비용 정산 - 결재상태
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

		var selectedKey = oEvent.getParameter("key");
		if (selectedKey === "RequestList") {
			setTimeout(OnRequest.pressSearch.bind(this), 0);

		} else if (selectedKey === "SettlementList") {
			setTimeout(OnSettlement.pressSearch.bind(this), 0);

		}
	},

	openWindow: function(p) {

		Common.openPopup.call(this, p.url);
	},

	onESSelectPerson: function(o) {

		// 외부망인 경우 결재자 지정
		if (this.EmployeeSearchCallOwner) {
			this.EmployeeSearchCallOwner.setSelectionTagets(o);
		}
		// 대근자 지정
		else if (this.RequestDetailDialogHandler.isSubstituteAdding) {
			OnRequest.setSubstitute.call(this, o);
		}
		// 동반출장자 지정
		else {
			OnRequest.setAccompanier.call(this, o);
		}
	},

	displayMultiOrgSearchDialog: function(oEvent) {

		var oController = $.app.getController();
		// 외부망인 경우 결재자 검색시
		if (oController.EmployeeSearchCallOwner) {
			oController.EmployeeSearchCallOwner.openOrgSearchDialog.call(oController, oEvent);
		}
		// 동반출장자/대근자 검색시
		else {
			OnRequest.searchOrg.call(oController, oEvent);
		}
	},

	getApprovalLinesHandler: function() {

		return this.ApprovalLinesHandler;
	}

});

});