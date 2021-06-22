/* global moment */
sap.ui.define([
	"ZUI5_HR_BusinessTrip/delegate/OnRequest",
	"ZUI5_HR_BusinessTrip/delegate/OnSettlement",
	"common/Common",
	"common/CommonController",
	"common/DialogHandler",
	"common/SearchOrg",
	"common/SearchUser1",
	"sap/base/util/UriParameters",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(
	OnRequest,
	OnSettlement,
	Common,
	CommonController,
	DialogHandler,
	SearchOrg,
	SearchUser1,
	UriParameters,
	MessageBox,
	BusyIndicator,
	JSONModel
) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 출장 관리 HASS

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

	AdminSessionModel: new JSONModel(),
	ProxyModel: new JSONModel(),
	RequestSearchModel: new JSONModel(),
	RequestListModel: new JSONModel(),
	RequestDetailModel: new JSONModel(),
	SettlementSearchModel: new JSONModel(),
	SettlementListModel: new JSONModel(),
	SettlementDetailModel: new JSONModel(),

	onInit: function() {
		Common.log("onInit");

		this.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		this.AdminSessionModel.setData($.extend(true, {}, this.getSessionModel().getData()));

		var Dtfmt = this.getSessionInfoByKey("Dtfmt"),
		IBegda = moment().startOf("date").subtract(1, "months").add(1, "days").toDate(),
		IEndda = moment().startOf("date").toDate();

		this.RequestSearchModel.setData({
			HassMode: true,
			Dtfmt: Dtfmt,
			IBegda: IBegda,
			IEndda: IEndda,
			IZzok: "0",
			ApprovalStatusList: this.ApprovalStatusMap[this.getSessionInfoByKey("Langu")]
		});
		this.SettlementSearchModel.setData({
			HassMode: true,
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
			} else {
				$.app.byId("BusinessTripTabBar").setSelectedKey("RequestList");
			}
		// });
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

	// 출장자 선택 dialog : 담당자 자격으로 신청시
	searchProxyTarget: function() {

		SearchUser1.oController = this;
		SearchUser1.searchAuth = "H";
		SearchUser1.sessionModel = this.AdminSessionModel;
		SearchUser1.dialogContentHeight = 480;

		this.isProxyTargetSelecting = true;

		if (!this._AddPersonDialog) {
			this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
			this.getView().addDependent(this._AddPersonDialog);
		}
		this._AddPersonDialog.open();
	},

	setProxyTargetEmpInfo: function(Pernr) {

		if (!Pernr) {
			MessageBox.alert(this.getBundleText("MSG_02050")); // 대상자를 선택해 주시기 바랍니다.
			return;
		}

		BusyIndicator.show(0);

		var EmpBasicInfoBoxModel = window._CommonEmployeeModel;
		if (EmpBasicInfoBoxModel) {
			EmpBasicInfoBoxModel.backup().reset();
		}

		Promise.all([
			Common.retrieveLoginInfo(true, Pernr),
			Common.retrieveSFUserPhoto(Pernr, EmpBasicInfoBoxModel)
		])
		.then(function(resolvedResults) {
			var mLoginData = resolvedResults[0] || {};

			if (EmpBasicInfoBoxModel) {
				EmpBasicInfoBoxModel.setData({ User: mLoginData }, true);
			}
			this.ProxyModel.setData(mLoginData);
			this.RequestSearchModel.setData(mLoginData, true);
			this.SettlementSearchModel.setData(mLoginData, true);

			this.getView().setModel(this.ProxyModel, "session");

			this.isProxyTargetSelecting = false;

			// 출장 사전 신청 목록 초기화
			this.RequestListModel.setProperty("/", []);
			Common.adjustAutoVisibleRowCount.call($.app.byId("RequestListTable"));
			
			// 출장 비용 정산 목록 초기화
			this.SettlementListModel.setProperty("/", []);
			Common.adjustAutoVisibleRowCount.call($.app.byId("SettlementListTable"));

			BusyIndicator.hide();

			SearchUser1.onClose();

			this.selectBusinessTripTabBar({
				getParameter: function() {
					return $.app.byId("BusinessTripTabBar").getSelectedKey();
				}
			});
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

		// HASS 대상자 지정
		if (this.isProxyTargetSelecting) {
			this.setProxyTargetEmpInfo(o.Pernr);
		}
		// 외부망인 경우 결재자 지정
		else if (this.EmployeeSearchCallOwner) {
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