/* global moment */
sap.ui.define([
	"common/Common",
	"common/CommonController",
	"./delegate/OnRequest",
	"./delegate/OnSettlement",
	"sap/base/util/UriParameters",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	CommonController,
	OnRequest,
	OnSettlement,
	UriParameters,
	BusyIndicator,
	JSONModel
) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 출장

	ApprovalStatusMap: {
		KO: [
			{ Code: "0", Text: "전체" },
			{ Code: "1", Text: "미결재" },
			{ Code: "2", Text: "결재중" },
			{ Code: "3", Text: "결재완료" },
			{ Code: "4", Text: "반려" }
		],
		EN: [
			{ Code: "0", Text: "All" },
			{ Code: "1", Text: "Not Submitted" },
			{ Code: "2", Text: "In Progress" },
			{ Code: "3", Text: "Complete" },
			{ Code: "4", Text: "Rejected" }
		],
		ZH: [
			{ Code: "0", Text: "All" },
			{ Code: "1", Text: "Not Submitted" },
			{ Code: "2", Text: "In Progress" },
			{ Code: "3", Text: "Complete" },
			{ Code: "4", Text: "Rejected" }
		]
	},

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
			ApprovalStatusList: this.ApprovalStatusMap[this.getSessionInfoByKey("Langu")]
		});
		this.SettlementSearchModel.setData({
			Dtfmt: Dtfmt,
			IBegda: IBegda,
			IEndda: IEndda,
			IBtStat: "0",
			ApprovalStatusList: this.ApprovalStatusMap[this.getSessionInfoByKey("Langu")]
		});

		this.RequestListModel.setData([]);
		this.SettlementListModel.setData([]);
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		// Promise.all([
		// 	this.retrieveApprovalStatusList("ZHRD_OK_G", this.RequestSearchModel),		// 출장 사전 신청 - 결재상태
		// 	this.retrieveApprovalStatusList("ZHRD_BT_STAT", this.SettlementSearchModel)	// 출장 비용 정산 - 결재상태
		// ])
		// .then(function() {
			var tab = (UriParameters.fromQuery(document.location.search).get("tab") || "").toLowerCase(),
			html = (document.location.pathname || "").replace(/.*\/BusinessTrip(.+)\.html/, "$1").toLowerCase();

			if (tab === "settlement" || html === "settlement") {
				$.app.byId("BusinessTripTabBar").setSelectedKey("SettlementList");
				setTimeout(OnSettlement.pressSearch.bind(this), 0);
			} else {
				$.app.byId("BusinessTripTabBar").setSelectedKey("RequestList");
				setTimeout(OnRequest.pressSearch.bind(this), 0);
			}
		// }.bind(this));
	},

	// 결재상태 ComboBox 공통코드 목록 조회
	retrieveApprovalStatusList: function(ICodty, oModel) {

		return Common.getPromise(true, function(resolve, reject) {
			$.app.getModel("ZHR_COMMON_SRV").create(
				"/CommonCodeListHeaderSet",
				{
					ICodeT: "004",
					ICodty: ICodty,
					ILangu: this.getSessionInfoByKey("Langu"),
					NavCommonCodeList: []
				},
				{
					async: true,
					success: function(oData) {
						if (oData && oData.NavCommonCodeList.results) {
							oModel.setProperty("/ApprovalStatusList", oData.NavCommonCodeList.results);
						} else {
							oModel.setProperty("/ApprovalStatusList", []);
						}

						resolve();
					},
					error: function(oResponse) {
						Common.log(oResponse);

						oModel.setProperty("/ApprovalStatusList", []);

						reject();
					}
				}
			);
		}.bind(this));
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

		// 동반출장자 지정
		if (this.RequestDetailDialogHandler.isAccompanierAdding) {
			OnRequest.setAccompanier.call(this, o);
		}
		// 대근자 지정
		else if (this.RequestDetailDialogHandler.isSubstituteAdding) {
			OnRequest.setSubstitute.call(this, o);
		}
		else {
			// 외부망인 경우 결재자 지정
			if (this.EmployeeSearchCallOwner) {
				this.EmployeeSearchCallOwner.setSelectionTagets(o);
			}
		}
	},

	displayMultiOrgSearchDialog: function(oEvent) {

		var oController = $.app.getController();
		// 동반출장자/대근자 검색시
		if (oController.RequestDetailDialogHandler.isAccompanierAdding
		 || oController.RequestDetailDialogHandler.isSubstituteAdding) {
			OnRequest.searchOrg.call(oController, oEvent);
		}
		else {
			// 외부망인 경우 결재자 검색시
			if (oController.EmployeeSearchCallOwner) {
				oController.EmployeeSearchCallOwner.openOrgSearchDialog.call(oController, oEvent);
			}
		}
	},

	getApprovalLinesHandler: function() {

		return this.ApprovalLinesHandler;
	}

});

});