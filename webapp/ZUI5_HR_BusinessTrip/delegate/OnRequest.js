/* global moment */
sap.ui.define([
	// "common/ApprovalLinesHandler",
	"common/Common",
	"common/DialogHandler",
	"common/SearchOrg",
	"common/SearchUser1",
	"./RequestDetailDialogHandler",
	"./EnameDialogHandler",
	"./MainCostCenterDialogHandler",
	"./SubCostCenterDialogHandler",
	"./WBSDialogHandler",
	"./CityDialogHandler",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(
	// ApprovalLinesHandler,
	Common,
	DialogHandler,
	SearchOrg,
	SearchUser1,
	RequestDetailDialogHandler,
	EnameDialogHandler,
	MainCostCenterDialogHandler,
	SubCostCenterDialogHandler,
	WBSDialogHandler,
	CityDialogHandler,
	MessageBox,
	BusyIndicator
) {
"use strict";

var OnRequest = { // 출장 event handler

	// 출장 신청 목록 조회
	pressSearch: function(oEvent) {
		Common.log("OnRequest.pressSearch", oEvent);

		BusyIndicator.show(0);

		var IZzdocno = this.RequestSearchModel.getProperty("/IZzdocno") || ""; // ZUI5_HR_BusinessTripDetail 에서 사용

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtRequestSet",
				{
					IConType: $.app.ConType.READ,
					IPernr: IZzdocno ? "" : this.getSessionInfoByKey("name"),
					IBukrs: this.getSessionInfoByKey("Bukrs"),
					ILangu: this.getSessionInfoByKey("Langu"),
					IBegda: Common.adjustGMTOdataFormat(this.RequestSearchModel.getProperty("/IBegda")),
					IEndda: Common.adjustGMTOdataFormat(this.RequestSearchModel.getProperty("/IEndda")),
					IZzok: this.RequestSearchModel.getProperty("/IZzok"),
					IZzdocno: IZzdocno,
					TableIn01: [],
					TableIn03: []
				},
				{
					async: false,
					success: function(oData) {
						this.RequestListModel.setProperty("/", Common.getTableInResults(oData, "TableIn01"));
						Common.adjustAutoVisibleRowCount.call($.app.byId("RequestListTable"));
						BusyIndicator.hide();
					}.bind(this),
					error: function(oResponse) {
						Common.log("OnRequest.pressSearch error", oResponse);

						this.RequestListModel.setProperty("/", []);
						Common.adjustAutoVisibleRowCount.call($.app.byId("RequestListTable"));
						BusyIndicator.hide();
					}.bind(this)
				}
			);
		}.bind(this));
	},

	clickRequestListCell: function(oEvent) {

		var columnId = oEvent.getParameter("columnId"),
		p = oEvent.getParameter("rowBindingContext").getProperty();

		if (p.Status1 !== "AA" && columnId === "RequestListTableZzokT" && p.UrlA) { // 결재상태
			this.openWindow({ name: "smoin-approval-popup", width: 700, height: 350, url: p.UrlA });

		} else if (p.Status2 !== "AA" && columnId === "RequestListTableBtStatT" && p.UrlA1) { // 정산결재상태
			this.openWindow({ name: "smoin-approval-popup", width: 700, height: 350, url: p.UrlA1 });

		} else {
			OnRequest.openRequestDetailDialog.call(this, p);

		}
	},

	// 출장 신청 상세 dialog
	pressRequestForm: function() {

		OnRequest.openRequestDetailDialog.call(this, {});
	},

	openRequestDetailDialog: function(p) {

		setTimeout(function() {
			DialogHandler.open(RequestDetailDialogHandler.get(this, p));
		}.bind(this), 0);
	},

	// 출장자 선택 dialog : 대리인 자격으로 신청시
	searchEname: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			searchData = {
				ename: oModel.getProperty("/Header/Ename"),
				list: oModel.getProperty("/EnameList")
			},
			callback = function(o) {
				oModel.setProperty("/Header/Ename", o.Ename || "");
				oModel.setProperty("/Header/Pernr", o.Pernr || "");

				this.RequestDetailDialogHandler.retrieveHeader();
			}.bind(this);

			DialogHandler.open(EnameDialogHandler.get(this, searchData, callback));
		}.bind(this), 0);
	},

	clearEname: function() {

		var oModel = this.RequestDetailDialogHandler.getModel();
		oModel.setProperty("/Header/Ename", this.getSessionInfoByKey("Ename"));
		oModel.setProperty("/Header/Pernr", this.getSessionInfoByKey("Pernr"));
	},

	changeSubty: function(oEvent) {

		var oModel = this.RequestDetailDialogHandler.getModel(),
		Useyn = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Useyn");

		setTimeout(function() {
			oModel.setProperty("/Header/SubtyUseyn", Useyn);

			if (Useyn !== "Y") {
				oModel.setProperty("/Header/Encard", "");
			}
		}, 0);
	},

	changeBtPurpose: function() {

		this.RequestDetailDialogHandler.calculateAmount().then(function() {
			this.RequestDetailDialogHandler.changeSubstituteData("changeBtPurpose"); // 대근자
		}.bind(this));
	},

	searchAccompanier: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		target = oEventSource.data("target"),
		rowIndex = oEventSource.getParent().getIndex();

		SearchUser1.oController = this;
		SearchUser1.searchAuth = "A";
		SearchUser1.dialogContentHeight = 480;
		SearchUser1.oTargetPaths = {
			pernr: target.pernr.interpolate(rowIndex),
			ename: target.ename.interpolate(rowIndex)
		};

		this.RequestDetailDialogHandler.isSubstituteAdding = false;

		if (!this._AddPersonDialog) {
			this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
			this.getView().addDependent(this._AddPersonDialog);
		}
		this._AddPersonDialog.open();
	},

	// 사원 검색 공통 팝업에서 사용하는 조직 검색
	searchOrg: function(oEvent) {

		var oEventSourceId = oEvent.getSource().getId();

		setTimeout(function() {
			SearchOrg.oController = this;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEventSourceId;
			SearchOrg.vCallControlType = "MultiInput";

			if (!this.oOrgSearchDialog) {
				this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this);
				this.getView().addDependent(this.oOrgSearchDialog);
			}

			this.oOrgSearchDialog.open();
		}.bind(this), 0);
	},

	// 대근자 한도체크
	checkSubstituteAvailability: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			TableIn07 = oModel.getProperty("/TableIn07");

			if (!TableIn07 || !TableIn07.length) {
				MessageBox.alert(this.getBundleText("MSG_19041"), { // 대근자가 없습니다.
					title: this.getBundleText("LABEL_00149") // 안내
				});
				return;
			}

			var isError = false,
			TableIn = [];
			$.each(TableIn07, function(i, o) {
				if (o.Cntgb !== "0") {
					if (!o.Awtxt) {
						MessageBox.alert(this.getBundleText("MSG_19045"), { // 대근자를 모두 입력해주세요.
							title: this.getBundleText("LABEL_00149") // 안내
						});
						isError = true;
						return false;
					}
					if (o.Offck != "X" && (!o.Beguz || !o.Enduz)) {
						MessageBox.alert(this.getBundleText("MSG_19046"), { // 대근자 OT시간을 모두 입력해주세요.
							title: this.getBundleText("LABEL_00149") // 안내
						});
						isError = true;
						return false;
					}
				}

				o.Beguz = "PT${}H${}M00S".interpolate(o.BeguzHour, o.BeguzMinute);
				o.Enduz = "PT${}H${}M00S".interpolate(o.EnduzHour, o.EnduzMinute);
				o.Ovtim = o.Ovtim || "0.00";
				o.Wt40 = o.Wt40 || "0.00";
				o.Wt12 = o.Wt12 || "0.00";
				o.Wtsum = o.Wtsum || "0.00";
				o.Lttim = o.Lttim || "0.00";

				TableIn.push(Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "VacationCoverTableIn", o));
			}.bind(this));

			if (isError) {
				return;
			}

			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/VacationCoverSet",
				{
					IConType: "1",
					IProType: "2",
					IBt: "X",
					IPernr: this.getSessionInfoByKey("Pernr"),
					IBukrs: this.getSessionInfoByKey("Bukrs"),
					ILangu: this.getSessionInfoByKey("Langu"),
					TableIn: TableIn
				},
				{
					success: function(oData) {
						var ResultTableIn = Common.getTableInResults(oData, "TableIn");
						if (ResultTableIn.length) {
							this.RequestDetailDialogHandler.isCheckedSubstituteAvailability = true;
							this.RequestDetailDialogHandler.setSubstituteSchedule(ResultTableIn);
						}
						MessageBox.alert(this.getBundleText("MSG_19047"), { // 한도체크가 완료되었습니다. 신청 가능합니다.
							title: this.getBundleText("LABEL_00149") // 안내
						});
					}.bind(this),
					error: function(oResponse) {
						Common.log("OnRequest.checkSubstituteAvailability error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							var matcher = errData.ErrorMessage.match(/\d{8}\s[^\]\s]+/);
							if (matcher && matcher.length >= 1) {
								var rowSelector = matcher[0].split(" ");
								$.each(TableIn07, function(i, o) {
									if (moment(o.Datum).format("YYYYMMDD") === rowSelector[0] && o.Awtxt === rowSelector[1]) {
										oModel.setProperty("/TableIn07/${}/Ligbn".interpolate(o.RowIndex), "2"); // 오류 발생 대근자 한도체크 아이콘 변경
										oModel.setProperty("/TableIn07/${}/LigbnTx".interpolate(o.RowIndex), this.getBundleText("LABEL_19818")); // 불가능
										return false;
									}
								}.bind(this));
							}

							MessageBox.error(errData.ErrorMessage); // [ 일자 성명 ] 대근자의 근로시간에 해당되는 OT시간을 입력하세요.
						}
					}.bind(this)
				}
			);
		}.bind(this), 0);
	},

	setSubstitute: function(o) {

		if (!o.Pernr) {
			MessageBox.alert(this.getBundleText("MSG_00076"), { // 대상자를 선택하세요.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		var oModel = this.RequestDetailDialogHandler.getModel(),
		tripperMap = {};

		if (o.Pernr === oModel.getProperty("/Header/Pernr")) {
			MessageBox.alert(this.getBundleText("MSG_19048"), { // 출장자를 대근자로 지정할 수 없습니다.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		$.map(oModel.getProperty("/TableIn04") || [], function(p) { // 동반출장자
			if (p.Pernr) {
				tripperMap[p.Pernr] = true;
			}
		});

		if (tripperMap[o.Pernr]) {
			MessageBox.alert(this.getBundleText("MSG_19049"), { // 동반출장자를 대근자로 지정할 수 없습니다.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		var targetRowData = oModel.getProperty(SearchUser1.targetPath),
		Datum = moment(targetRowData.Datum).format("YYYYMMDD"),
		substituteMap = {};

		$.map(oModel.getProperty("/TableIn07") || [], function(p) { // 대근자
			if ((p.Awper || "").replace(/^0+/, "")) {
				var keys = [moment(p.Datum).format("YYYYMMDD"), p.Awper, p.Flag];
				substituteMap[keys.join()] = keys;
				keys.push(p.Pernr); // keys = [출장 일자, 대근자 사번, 첫번째 or 두번째 대근자 플래그, 출장자 사번]
			}
		});

		var substitute1 = substituteMap[[Datum, o.Pernr, "A"].join()], // 같은 출장 일자에 첫번째 대근자로 이미 지정된 경우
			substitute2 = substituteMap[[Datum, o.Pernr, "X"].join()]; // 같은 출장 일자에 두번째 대근자로 이미 지정된 경우
		if ((substitute1 && substitute1.pop() !== targetRowData.Pernr)
		 || (substitute2 && substitute2.pop() !== targetRowData.Pernr)) {
			MessageBox.alert(this.getBundleText("MSG_19051"), { // 이미 지정된 대근자입니다.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		oModel.setProperty(SearchUser1.targetPath, $.extend(targetRowData, {
			Awper: o.Pernr,
			Awtxt: o.Ename || "",
			Ligbn: "",
			LigbnTx: "",
			Lttim: "",
			Ovtim: "",
			Wt12: "",
			Wt40: "",
			Wtsum: ""
		}));

		this.RequestDetailDialogHandler.isSubstituteAdding = false;
		this.RequestDetailDialogHandler.isCheckedSubstituteAvailability = false;

		SearchUser1.onClose();
	},

	setAccompanier: function(o) {

		if (!o.Pernr) {
			MessageBox.alert(this.getBundleText("MSG_00076"), { // 대상자를 선택하세요.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		var oModel = this.RequestDetailDialogHandler.getModel(),
		oTargetPaths = SearchUser1.oTargetPaths;

		oModel.setProperty(oTargetPaths.pernr, o.Pernr);
		oModel.setProperty(oTargetPaths.ename, o.Ename || "");

		this.RequestDetailDialogHandler.calculateAmount().then(function() {
			this.RequestDetailDialogHandler.changeSubstituteData("setAccompanier"); // 대근자
		}.bind(this));

		SearchUser1.onClose();
	},

	// 소속부서 코스트센터 선택 dialog
	searchMainCostCenter: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			searchData = {
				code: oModel.getProperty("/Header/CdIndpt"),
				list: oModel.getProperty("/MainCostCenterList")
			},
			callback = function(o) {
				oModel.setProperty("/Header/CdIndpt",     o.Kostl || "");
				oModel.setProperty("/Header/CdIndptText", o.Orgtx || "");
				oModel.setProperty("/Header/ZsendKostl",  o.Kostl || "");
				oModel.setProperty("/Header/ZsendKostlT", o.Orgtx || "");
				oModel.setProperty("/Header/OrgehP",      o.Orgeh || "");
			};

			DialogHandler.open(MainCostCenterDialogHandler.get(this, searchData, callback));
		}.bind(this), 0);
	},

	clearMainCostCenter: function() {

		var oModel = this.RequestDetailDialogHandler.getModel();
		oModel.setProperty("/Header/CdIndpt", "");
		oModel.setProperty("/Header/CdIndptText", "");
		oModel.setProperty("/Header/ZsendKostl", "");
		oModel.setProperty("/Header/ZsendKostlT", "");
		oModel.setProperty("/Header/OrgehP", "");
	},

	// Header 비용귀속부서/TableIn04 비용항목 코스트센터 선택 dialog
	searchSubCostCenter: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		dialogTitle = oEventSource.data("dialogTitle"),
		search = oEventSource.data("search"),
		target = oEventSource.data("target"),
		oEventSourceParent = oEventSource.getParent(),
		rowIndex = -1;

		if (typeof oEventSourceParent.getIndex === "function") { // TableIn04(동반출장자) 비용항목
			rowIndex = oEventSourceParent.getIndex();
		}

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			initData = {
				dialogTitle: dialogTitle,
				subCode: oModel.getProperty((search.subCode || "").interpolate(rowIndex)),
				code: oModel.getProperty((search.code || "").interpolate(rowIndex))
			},
			callback = function(o) {
				oModel.setProperty(target.code.interpolate(rowIndex), o.code);
				oModel.setProperty(target.text.interpolate(rowIndex), o.text);

				if (rowIndex > -1) {
					this.RequestDetailDialogHandler.calculateAmount();
				}
			}.bind(this);

			DialogHandler.open(SubCostCenterDialogHandler.get(this, initData, callback));
		}.bind(this), 0);
	},

	clearSubCostCenter: function() {

		var oModel = this.RequestDetailDialogHandler.getModel();
		oModel.setProperty("/Header/ZsendKostl", "");
		oModel.setProperty("/Header/ZsendKostlT", "");
	},

	// WBS 선택 dialog
	searchWBS: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		search = oEventSource.data("search"),
		target = oEventSource.data("target"),
		oEventSourceParent = oEventSource.getParent(),
		rowIndex = -1;

		if (typeof oEventSourceParent.getIndex === "function") { // TableIn04(동반출장자) WBS
			rowIndex = oEventSourceParent.getIndex();
		}

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			initData = {
				subCode: oModel.getProperty((search.subCode || "").interpolate(rowIndex)),
				code: oModel.getProperty((search.code || "").interpolate(rowIndex))
			},
			callback = function(o) {
				oModel.setProperty(target.code.interpolate(rowIndex), o.code);
				oModel.setProperty(target.text.interpolate(rowIndex), o.text);

				if (rowIndex > -1) {
					this.RequestDetailDialogHandler.calculateAmount();
				}
			}.bind(this);

			DialogHandler.open(WBSDialogHandler.get(this, initData, callback));
		}.bind(this), 0);
	},

	clearWBS: function() {

		var oModel = this.RequestDetailDialogHandler.getModel();
		oModel.setProperty("/Header/PsPosid", "");
		oModel.setProperty("/Header/PsPosidT", "");
	},

	searchCity: function(oEvent) {

		var path = oEvent.getSource().getParent().getBindingContext().getPath(), // setTimeout 때문에 oEvent 객체가 빨리 소멸되므로 미리 변수로 받음
		targetRowIndex = Common.toNumber(path.replace(/.*\/(\d+)$/, "$1"));

		setTimeout(function() {
			var callback = function(p) {
				var oModel = this.RequestDetailDialogHandler.getModel(),
				TableIn03 = oModel.getProperty("/TableIn03"),
				rowIndices = $.map(TableIn03, function(o, i) {
					if (i !== targetRowIndex && o.ClDmtr && (o.ClDmtr !== p.ClDmtr)) { // 선택된 도시의 국내외 구분이 다른 행과 다를 경우
						return i;
					}
				});

				if (rowIndices.length) {
					MessageBox.error(this.getBundleText("MSG_19014")); // 국내/해외 출장을 함께 신청 및 정산하실 수는 없습니다.
					throw new Error();
				}

				oModel.setProperty(path + "/ClDmtr", p.ClDmtr);
				oModel.setProperty(path + "/ClDmtrT", p.ClDmtrT);
				oModel.setProperty(path + "/BtCrt", p.BtCrt);
				oModel.setProperty(path + "/BtCrtT", p.BtCrtT);
				oModel.setProperty(path + "/BtCity", p.BtCity);
				oModel.setProperty(path + "/BtCityT", p.BtCityT);
				oModel.setProperty(path + "/BtState", p.BtState);

				this.RequestDetailDialogHandler.calculateAmount();
			}.bind(this);

			DialogHandler.open(CityDialogHandler.get(this, callback));
		}.bind(this), 0);
	},

	pressAddSchedule: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			TableIn03 = oModel.getProperty("/TableIn03");

			TableIn03.push({});

			Common.adjustVisibleRowCount($.app.byId("TableIn03"), 5, TableIn03.length);
			oModel.refresh();
		}.bind(this), 0);
	},

	pressRemoveSchedule: function() {

		setTimeout(function() {
			var oTable = $.app.byId("TableIn03"),
			aIndices = oTable.getSelectedIndices();
			if (aIndices.length < 1) {
				MessageBox.alert(this.getBundleText("MSG_00050"), { // 삭제할 행을 선택하세요.
					title: this.getBundleText("LABEL_00149") // 안내
				});
				return;
			}

			if (aIndices.length === 1) {
				var oModel = this.RequestDetailDialogHandler.getModel(),
				TableIn03 = oModel.getProperty("/TableIn03"),
				o = TableIn03[aIndices[0]];

				if (!o.BtCity && (!o.BtStartdat || !o.BtEnddat)) {
					TableIn03.splice(aIndices[0], 1);

					oModel.setProperty("/TableIn03", TableIn03);
					oModel.refresh();
					Common.adjustVisibleRowCount(oTable.clearSelection(), 5, TableIn03.length);

					this.RequestDetailDialogHandler.calculateAmount();
					return;
				}
			}

			MessageBox.confirm(this.getBundleText("MSG_00051"), { // 선택된 행을 삭제하시겠습니까?
				onClose: function(oAction) {
					if (MessageBox.Action.OK === oAction) {
						var TableIn03Rows = Common.getRowsBySelectionState(oTable),
						oModel = this.RequestDetailDialogHandler.getModel();
						oModel.setProperty("/TableIn03", TableIn03Rows.unselectedRows);
						oModel.refresh();
						Common.adjustVisibleRowCount(oTable.clearSelection(), 5, TableIn03Rows.unselectedRows.length);

						this.RequestDetailDialogHandler.calculateAmount().then(function() {
							this.RequestDetailDialogHandler.changeSubstituteData("pressRemoveSchedule", TableIn03Rows.selectedRows); // 대근자
						}.bind(this));
					}
				}.bind(this)
			});
		}.bind(this), 0);
	},

	pressAddAccompanier: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel(),
			TableIn04 = oModel.getProperty("/TableIn04");

			TableIn04.push({});

			Common.adjustVisibleRowCount($.app.byId("TableIn04"), 5, TableIn04.length);
			oModel.refresh();
		}.bind(this), 0);
	},

	pressRemoveAccompanier: function() {

		setTimeout(function() {
			var oTable = $.app.byId("TableIn04"),
			aIndices = oTable.getSelectedIndices();
			if (aIndices.length < 1) {
				MessageBox.alert(this.getBundleText("MSG_00050"), { // 삭제할 행을 선택하세요.
					title: this.getBundleText("LABEL_00149") // 안내
				});
				return;
			}

			if (aIndices.length === 1) {
				var oModel = this.RequestDetailDialogHandler.getModel(),
				TableIn04 = oModel.getProperty("/TableIn04"),
				o = TableIn04[aIndices[0]];

				if (!o.Pernr && !o.Kostl) {
					TableIn04.splice(aIndices[0], 1);

					oModel.setProperty("/TableIn04", TableIn04);
					oModel.refresh();
					Common.adjustVisibleRowCount(oTable.clearSelection(), 5, TableIn04.length);

					this.RequestDetailDialogHandler.calculateAmount();
					return;
				}
			}

			MessageBox.confirm(this.getBundleText("MSG_00051"), { // 선택된 행을 삭제하시겠습니까?
				onClose: function(oAction) {
					if (MessageBox.Action.OK === oAction) {
						var TableIn04Rows = Common.getRowsBySelectionState(oTable),
						oModel = this.RequestDetailDialogHandler.getModel();
						oModel.setProperty("/TableIn04", TableIn04Rows.unselectedRows);
						oModel.refresh();
						Common.adjustVisibleRowCount(oTable.clearSelection(), 5, TableIn04Rows.unselectedRows.length);

						this.RequestDetailDialogHandler.calculateAmount().then(function() {
							this.RequestDetailDialogHandler.changeSubstituteData("pressRemoveAccompanier", TableIn04Rows.selectedRows); // 대근자
						}.bind(this));
					}
				}.bind(this)
			});
		}.bind(this), 0);
	},

	changeScheduleDate: function(oEvent) {

		var props = oEvent.getSource().getBindingContext().getProperty(), // setTimeout 때문에 oEvent 객체가 빨리 소멸되므로 미리 변수로 받음
		rowIndex = oEvent.getSource().getParent().getIndex(),
		selectedStartDate = oEvent.getParameter("from"),
		selectedEndDate = oEvent.getParameter("to");

		setTimeout(function() {
			selectedStartDate = moment(selectedStartDate || "");
			selectedEndDate = moment(selectedEndDate || "");
			if (!selectedStartDate.isValid() || !selectedEndDate.isValid()) {
				return;
			} else {
				selectedStartDate.startOf("date");
				selectedEndDate.startOf("date");
			}

			var oModel = this.RequestDetailDialogHandler.getModel(),
			rowIndices = $.map(oModel.getProperty("/TableIn03"), function(o, i) {
				if (i === rowIndex) {
					return;
				}

				var BtStartdat = moment(o.BtStartdat || ""), BtEnddat = moment(o.BtEnddat || "");
				if (!BtStartdat.isValid() || !BtEnddat.isValid()) {
					return;
				} else {
					BtStartdat.startOf("date");
					BtEnddat.startOf("date");
				}

				if (          (BtStartdat.isSameOrBefore(selectedStartDate) && selectedStartDate.isSameOrBefore(BtEnddat))        // 입력 출발일이 기입력된 출장기간 중간에 있는 경우
					||        (BtStartdat.isSameOrBefore(selectedEndDate)   &&   selectedEndDate.isSameOrBefore(BtEnddat))        // 입력 도착일이 기입력된 출장기간 중간에 있는 경우
					|| (selectedStartDate.isSameOrBefore(BtStartdat)        &&          BtEnddat.isSameOrBefore(selectedEndDate)) // 입력 출장기간이 기입력된 출장기간을 포함하는 경우
				) {
					return i;
				}
			});

			if (rowIndices.length) {
				MessageBox.error(this.getBundleText("MSG_19015"), { // 기 신청한 출장 내역과 중복이 됩니다.\n확인하세요.
					onClose: function() {
						props.BtStartdat = null;
						props.BtEnddat = null;
						oModel.refresh();
					}
				});
			} else {
				this.RequestDetailDialogHandler.calculateAmount().then(function() {
					this.RequestDetailDialogHandler.changeSubstituteData("changeScheduleDate"); // 대근자
				}.bind(this));
			}
		}.bind(this), 0);
	},

	selectEarlierDeparture: function() {

		this.RequestDetailDialogHandler.calculateAmount();
	},

	changeLodgingAndMeal: function() {

		this.RequestDetailDialogHandler.calculateAmount();
	},

	changeAdvancePaymentAmount: function() {

		this.RequestDetailDialogHandler.getModel().setProperty("/Header/EventFiredOnAdvtot", true);
		this.RequestDetailDialogHandler.calculateAmount();
	},

	// 재작성
	pressRevise: function() {

		setTimeout(function() {
			var oModel = this.RequestDetailDialogHandler.getModel();
			oModel.setProperty("/Header/Btact", true);
			oModel.setProperty("/Header/Edtfg", true);
			oModel.setProperty("/Header/Status1", "");
			oModel.setProperty("/Header/Appkey1", "");

			this.RequestDetailDialogHandler.toggleAdvanceAmtState();
		}.bind(this), 0);
	},

	// 삭제 확인
	pressRemove: function() {
		Common.log("OnRequest.pressRemove");

		MessageBox.confirm(this.getBundleText("MSG_00059"), { // 삭제하시겠습니까?
			onClose: function(oAction) {
				if (MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnRequest.remove.bind(this), 0);
				}
			}.bind(this)
		});
	},

	// 삭제
	remove: function() {
		Common.log("OnRequest.remove");

		this.RequestDetailDialogHandler.toggleButtonsState(false);

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtRequestSet",
			{
				IConType: $.app.ConType.DELETE,
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				TableIn01: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn01", this.RequestDetailDialogHandler.getModel().getProperty("/Header"))],
				TableIn02: [], // 출장 Header 정보
				TableIn03: [], // 출장 일정 목록
				TableIn04: [], // 동반출장자 목록
				TableIn05: [], // 코스트센터 소속부서
				TableIn06: []  // 근태유형 코드 목록
			},
			{
				success: function(oData) {
					Common.log("OnRequest.remove success", oData);

					MessageBox.success(this.getBundleText("MSG_00021"), { // 삭제되었습니다.
						onClose: function() {
							this.RequestDetailDialogHandler.getDialog().close();
							setTimeout(OnRequest.pressSearch.bind(this), 0);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnRequest.remove error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage);
					}

					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},

	// 저장 확인
	pressSave: function() {
		Common.log("OnRequest.pressSave");

		MessageBox.confirm(this.getBundleText("MSG_00058"), { // 저장하시겠습니까?
			onClose: function(oAction) {
				if (MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnRequest.save.bind(this), 0);
				}
			}.bind(this)
		});
	},

	// 저장
	save: function() {
		Common.log("OnRequest.save");

		this.RequestDetailDialogHandler.toggleButtonsState(false);

		var oModel = this.RequestDetailDialogHandler.getModel();

		if (oModel.getProperty("/Header/IfAdv")) {
			MessageBox.warning(this.getBundleText("MSG_19017")); // 가지급금이 한도액(일비)를 초과했습니다.
			this.RequestDetailDialogHandler.toggleButtonsState(true);
			BusyIndicator.hide();
			return;
		}

		var TableIn03 = $.map(oModel.getProperty("/TableIn03"), function(p, i) {
			if (p.BtCity || p.BtStartdat || p.BtEnddat) {
				p.Btseq = Common.lpad(i, 2);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn03", p);
			}
		});

		var TableIn04 = $.map(oModel.getProperty("/TableIn04"), function(p, i) {
			if (p.Pernr || p.Kostl) {
				p.Btseq = Common.lpad(i, 2);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn04", p);
			}
		});

		var TableIn07 = $.map(oModel.getProperty("/TableIn07") || [], function(p) {
			return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn07", p);
		});

		oModel.setProperty("/Header/Accfg", TableIn04.length > 0);

		if (oModel.getProperty("/Header/Status1") === "JJ") { // 상신취소 상태에서 저장시 키값 초기화
			oModel.setProperty("/Header/Status1", "");
			oModel.setProperty("/Header/Appkey1", "");
		}

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtRequestSet",
			{
				IConType: oModel.getProperty("/Header/Zzdocno") ? $.app.ConType.UPDATE : $.app.ConType.CREATE, // 수정 or 생성
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				TableIn01: [],
				TableIn02: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn02", oModel.getProperty("/Header"))], // 출장 Header 정보
				TableIn03: TableIn03,	// 출장 일정 목록
				TableIn04: TableIn04,	// 동반출장자 목록
				TableIn05: [],			// 코스트센터 소속부서
				TableIn06: [],			// 근태유형 코드 목록
				TableIn07: TableIn07	// 대근자
			},
			{
				success: function(oData) {
					Common.log("OnRequest.request success", oData);

					var oModel = this.RequestDetailDialogHandler.getModel(),
					oldHeader = oModel.getProperty("/Header"),
					TableIn02 = Common.getTableInResults(oData, "TableIn02");

					oModel.setProperty("/Header", $.extend(oldHeader, TableIn02[0]));
					oModel.setProperty("/TableIn02", TableIn02);
					oModel.setProperty("/TableIn04", Common.getTableInResults(oData, "TableIn04"));

					MessageBox.success(this.getBundleText("MSG_00017"), { // 저장되었습니다.
						onClose: function() {
							setTimeout(OnRequest.pressSearch.bind(this), 0);
							this.RequestDetailDialogHandler.toggleButtonsState(true);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnRequest.request error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage);
					}

					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},

	// 신청 확인
	pressRequest: function() {
		Common.log("OnRequest.pressRequest");

		var TanleInt07 = this.RequestDetailDialogHandler.getModel().getProperty("/TableIn07") || [];
		if (TanleInt07.length && !this.RequestDetailDialogHandler.isCheckedSubstituteAvailability) {
			MessageBox.alert(this.getBundleText("MSG_19039"), { // 한도체크를 진행 하세요.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			return;
		}

		this.RequestDetailDialogHandler.toggleButtonsState(false);

		MessageBox.confirm(this.getBundleText("MSG_00060"), { // 신청하시겠습니까?
			onClose: function(oAction) {
				if (MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnRequest.checkDuplication.bind(this), 0);
				} else {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
				}
			}.bind(this)
		});
	},

	// 신청 중복 확인
	checkDuplication: function() {

		var oModel = this.RequestDetailDialogHandler.getModel();

		if (oModel.getProperty("/Header/Status1") === "JJ") { // 상신취소 상태에서 신청시 중복 체크 건너뜀
			setTimeout(OnRequest.request.bind(this), 0);
			return;
		}

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtDupCheckSet",
			{
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				IGjahr: oModel.getProperty("/Header/Gjahr"),
				IZzdocno: oModel.getProperty("/Header/Zzdocno"),
				Export: []
			},
			{
				success: function(oData) {
					Common.log("OnRequest.checkDuplication success", oData);

					setTimeout(OnRequest.request.bind(this), 0);
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnRequest.checkDuplication error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage);
					}

					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},

	// 신청
	request: function() {
		Common.log("OnRequest.request");

		var oModel = this.RequestDetailDialogHandler.getModel(),
		value = oModel.getProperty("/Header/CdIndpt");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19305")), { // {소속부서}을 선택하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderCdIndpt").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/Ename");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00054", this.getBundleText("LABEL_19306")), { // {출장자}를 입력하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderEname").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/ZsendKostl");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19307")), { // {비용귀속부서}를 선택하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderZsendKostl").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/BtPurpose1");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19308")), { // {출장구분}을 선택하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderBtPurpose1").focus();
				}.bind(this)
			});
			return;
		}
		if (this.getSessionInfoByKey("Bukrs") === "1000") {
			value = oModel.getProperty("/Header/Subty");
			if (!$.trim(value)) {
				MessageBox.alert(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19310")), { // {근태유형}을 선택하세요.
					title: this.getBundleText("LABEL_00149"), // 안내
					onClose: function() {
						this.RequestDetailDialogHandler.toggleButtonsState(true);
						BusyIndicator.hide();
						$.app.byId("HeaderSubty").focus();
					}.bind(this)
				});
				return;
			}
		}
		value = oModel.getProperty("/Header/Title");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00053", this.getBundleText("LABEL_19312")), { // {출장명}을 입력하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderTitle").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/BtPurpose2");
		if (!$.trim(value)) {
			MessageBox.alert(this.getBundleText("MSG_00053", this.getBundleText("LABEL_19314")), { // {출장목적}을 입력하세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderBtPurpose2").focus();
				}.bind(this)
			});
			return;
		}

		var isInvalid = false, TableIn03 = [];
		if (oModel.getProperty("/TableIn03").length) {
			$.each($.app.byId("TableIn03").getRows(), function(i, o) { // 행이 생성되었더라도 두 필수 항목이 모두 입력된 행만 신청데이터로 취합함.
				var p = o.getRowBindingContext().getProperty();
				if (!p.BtCity) {
					MessageBox.alert(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19335")), { // {도시}를 선택하세요.
						title: this.getBundleText("LABEL_00149"), // 안내
						onClose: function() {
							this.RequestDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"TableIn03BtCityT\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				} else if (!p.BtStartdat || !p.BtEnddat) {
					MessageBox.alert(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19336")), { // {출장 기간}을 선택하세요.
						title: this.getBundleText("LABEL_00149"), // 안내
						onClose: function() {
							this.RequestDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"TableIn03BtPeriod\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				} else {
					TableIn03.push(Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn03", p));
				}
			}.bind(this));
		}

		if (isInvalid) {
			return;
		}

		if (!TableIn03.length) {
			MessageBox.alert(this.getBundleText("MSG_19016"), { // 출장 일정 정보를 입력해주세요.
				title: this.getBundleText("LABEL_00149"), // 안내
				onClose: function() {
					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			});
			return;
		}

		var TableIn04 = [];
		if (oModel.getProperty("/TableIn04").length) {
			$.each($.app.byId("TableIn04").getRows(), function(i, o) { // 행이 생성되었더라도 두 필수 항목이 모두 입력된 행만 신청데이터로 취합함.
				var p = o.getRowBindingContext().getProperty();
				if (!p.Pernr && p.Kostl) {
					MessageBox.alert(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19381")), { // {동반출장자}를 선택하세요.
						title: this.getBundleText("LABEL_00149"), // 안내
						onClose: function() {
							this.RequestDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"TableIn04Pernr\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				}
				if (p.Pernr && !p.Kostl) {
					MessageBox.alert(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19383")), { // {비용항목}을 선택하세요.
						title: this.getBundleText("LABEL_00149"), // 안내
						onClose: function() {
							this.RequestDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"TableIn04Kostl\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				}
				if (p.Pernr && p.Kostl) {
					TableIn04.push(Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn04", p));
				}
			}.bind(this));

			if (isInvalid) {
				return;
			}
		}

		var TableIn07 = $.map(oModel.getProperty("/TableIn07") || [], function(o) {
			return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn07", o);
		});

		oModel.setProperty("/Header/Accfg", TableIn04.length > 0);
		oModel.setProperty("/Header/Status1", "");
		oModel.setProperty("/Header/Appkey1", ""); // 신청시 결재상신없이 SMOIN 결재창을 닫아버리는 경우 Appkey1은 이미 생성되어 SAP에 저장되므로 신청시 무조건 Appkey1을 초기화함

		if (oModel.getProperty("/Header/IfAdv")) {
			MessageBox.alert(this.getBundleText("MSG_19017"), { // 가지급금이 한도액(일비)를 초과했습니다.
				title: this.getBundleText("LABEL_00149") // 안내
			});
			this.RequestDetailDialogHandler.toggleButtonsState(true);
			BusyIndicator.hide();
		} else {
			// if (Common.isExternalIP()) {
			// 	setTimeout(function() {
			// 		var initData = {
			// 			Mode: "P",																	// PC – P, Mobile - M
			// 			Pernr: this.getSessionInfoByKey("Pernr"),									// 각 업무에 맞게 작성
			// 			Empid: this.getSessionInfoByKey("Pernr"),									// 각 업무에 맞게 작성
			// 			Bukrs: this.getSessionInfoByKey("Bukrs"),									// 각 업무에 맞게 작성
			// 			ZappSeq: oModel.getProperty("/TableIn03/0/ClDmtr") === "1" ? "22" : "23"	// 신청서 번호 (국내출장: 22, 해외출장: 23)
			// 		},
			// 		callback = function(TableIn08) {
			// 			OnRequest.callRequestOData.call(this, oModel.getProperty("/Header"), TableIn03, TableIn04, TableIn07, TableIn08);	// 결재선 Dialog에서 신청 버튼 클릭시 호출 되는 Function
			// 		}.bind(this);

			// 		this.ApprovalLinesHandler = ApprovalLinesHandler.get(this, initData, callback);
			// 		DialogHandler.open(this.ApprovalLinesHandler);
			// 	}.bind(this), 0);
			// } else {
				OnRequest.callRequestOData.call(this, oModel.getProperty("/Header"), TableIn03, TableIn04, TableIn07);
			// }
		}
	},

	// 신청 OData 호출
	callRequestOData: function(Header, TableIn03, TableIn04, TableIn07, TableIn08) {
		var vExtryn = Common.isExternalIP() ? "X" : "";

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtRequestSet",
			{
				IConType: "5",
				IEmpid: this.getSessionInfoByKey("name"),
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				IExtryn: vExtryn,
				Export: [],
				TableIn01: [],
				TableIn02: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn02", Header)], // 출장 Header 정보
				TableIn03: TableIn03,		// 출장 일정 목록
				TableIn04: TableIn04,		// 동반출장자 목록
				TableIn05: [],				// 코스트센터 소속부서
				TableIn06: [],				// 근태유형 코드 목록
				TableIn07: TableIn07		// 대근자 목록
				// TableIn08: TableIn08 || []	// 결재자 목록
			},
			{
				success: function(oData) {
					Common.log("OnRequest.request success", oData);
					var smoinUrl;
					if (oData && oData.Export && oData.Export.results) {
						var exports = oData.Export.results;
						if (exports.length) {
							smoinUrl = exports[0].Url;
						}
					}

					if (smoinUrl) {
						if (this.getSessionInfoByKey("Bukrs") === "A100" && TableIn03[0].ClDmtr === "2") { // 해외 출장인 경우에만 안내 메세지 popup
							MessageBox.alert(this.getBundleText("MSG_19020"), { // ※ 출장 사전 품의시 "모인 메모품의(항공권 예약/발권 신청서)" 첨부하시기 바랍니다.
								title: this.getBundleText("LABEL_00149"), // 안내
								onClose: function() {
									// if (!Common.isExternalIP()) {
										this.openWindow({ name: "smoin-approval-popup", width: 1000, height: screen.availHeight * 0.9, url: smoinUrl });
									// }
								}.bind(this)
							});
						} else {
							// if (!Common.isExternalIP()) {
								this.openWindow({ name: "smoin-approval-popup", width: 1000, height: screen.availHeight * 0.9, url: smoinUrl });
							// }
						}
					}

					MessageBox.success(this.getBundleText("MSG_00061"), { // 신청되었습니다.
						onClose: function() {
							BusyIndicator.hide();
							this.RequestDetailDialogHandler.getDialog().close();
							setTimeout(OnRequest.pressSearch.bind(this), 0);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnRequest.request error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage);
					}

					this.RequestDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	}

};

return OnRequest;

});