/* global moment */
sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"common/moment-with-locales",
	"./SettlementTargetAbsenceListDialogHandler",
	"./SettlementDetailDialogHandler",
	"./CardExpenseDialogHandler",
	"./ExpenseDetailDialogHandler",
	"./EnameDialogHandler",
	"./MainCostCenterDialogHandler",
	"./SubCostCenterDialogHandler",
	"./WBSDialogHandler",
	"./CityDialogHandler",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(
	Common,
	DialogHandler,
	momentjs,
	SettlementTargetAbsenceListDialogHandler,
	SettlementDetailDialogHandler,
	CardExpenseDialogHandler,
	ExpenseDetailDialogHandler,
	EnameDialogHandler,
	MainCostCenterDialogHandler,
	SubCostCenterDialogHandler,
	WBSDialogHandler,
	CityDialogHandler,
	MessageBox,
	BusyIndicator
) {
"use strict";

var OnSettlement = { // 출장 비용 정산 event handler

	// 출장 비용 정산 목록 조회
	pressSearch: function(oEvent) {
		Common.log("OnSettlement.pressSearch", oEvent);

		BusyIndicator.show(0);

		var IZzdocno = this.SettlementSearchModel.getProperty("/IZzdocno") || ""; // ZUI5_HR_BusinessTripDetail 에서 사용

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtSettlementSet",
				{
					IConType: $.app.ConType.READ,
					IPernr: IZzdocno ? "" : this.getSessionInfoByKey("name"),
					IBukrs: this.getSessionInfoByKey("Bukrs"),
					ILangu: this.getSessionInfoByKey("Langu"),
					IBegda: Common.adjustGMTOdataFormat(this.SettlementSearchModel.getProperty("/IBegda")),
					IEndda: Common.adjustGMTOdataFormat(this.SettlementSearchModel.getProperty("/IEndda")),
					IBtStat: this.SettlementSearchModel.getProperty("/IBtStat"),
					IZzdocno: IZzdocno,
					TableIn01: []
				},
				{
					async: false,
					success: function(oData) {
						this.SettlementListModel.setProperty("/", Common.getTableInResults(oData, "TableIn01"));
						Common.adjustAutoVisibleRowCount.call($.app.byId("SettlementListTable"));
						BusyIndicator.hide();
					}.bind(this),
					error: function(oResponse) {
						Common.log("OnSettlement.pressSearch error", oResponse);

						this.SettlementListModel.setProperty("/", []);
						Common.adjustAutoVisibleRowCount.call($.app.byId("SettlementListTable"));
						BusyIndicator.hide();
					}.bind(this)
				}
			);
		}.bind(this));
	},

	clickSettlementListCell: function(oEvent) {

		var columnId = oEvent.getParameter("columnId"),
		p = oEvent.getParameter("rowBindingContext").getProperty();

		// if (p.Status1 !== "AA" && columnId === "SettlementListTableBtStatT" && p.UrlA) { // 승인상태
		// 	this.openWindow({ name: "smoin-approval-popup", width: 700, height: 350, url: p.UrlA });

		// } else {
			p.isEnameEditable = false;

			OnSettlement.openSettlementDetailDialog.call(this, p);

		// }
	},

	// 신청 : 출장정산 대상 근태정보 선택 dialog
	pressSettlementForm: function() {

		if (this.getSessionInfoByKey("Bukrs") === "A100" || this.getSessionInfoByKey("Ztitle") === "71") { // 첨단 or 수행비서
			OnSettlement.openSettlementDetailDialog.call(this, { isA100OrZtitle71: true, isEnameEditable: false });
			return;
		}

		var callback = function(o) {
			o.isEnameEditable = false;

			OnSettlement.openSettlementDetailDialog.call(this, o);
		}.bind(this);

		setTimeout(function() {
			DialogHandler.open(SettlementTargetAbsenceListDialogHandler.get(this, callback));
		}.bind(this), 0);
	},

	openSettlementDetailDialog: function(p) {

		setTimeout(function() {
			DialogHandler.open(SettlementDetailDialogHandler.get(this, p));
		}.bind(this), 0);
	},

	// 출장자 선택 dialog : 대리인 자격으로 신청시
	searchEname: function() {

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel(),
			searchData = {
				ename: oModel.getProperty("/Header/Ename"),
				list: oModel.getProperty("/EnameList")
			},
			callback = function(o) {
				oModel.setProperty("/Header/Ename", o.Ename || "");
				oModel.setProperty("/Header/Pernr", o.Pernr || "");

				this.SettlementDetailDialogHandler.retrieveHeader();
			};

			DialogHandler.open(EnameDialogHandler.get(this, searchData, callback));
		}.bind(this), 0);
	},

	clearEname: function() {

		var oModel = this.SettlementDetailDialogHandler.getModel();
		oModel.setProperty("/Header/Ename", this.getSessionInfoByKey("Ename"));
		oModel.setProperty("/Header/Pernr", this.getSessionInfoByKey("Pernr"));
	},

	// 출장구분 변경 event handler
	changeBtPurpose: function(oEvent) {

		var checkedPer = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Code") === "5";
		this.SettlementDetailDialogHandler.getModel().setProperty("/Header/ChkPer", checkedPer);

		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 소속부서 코스트센터 선택 dialog
	searchMainCostCenter: function() {

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel(),
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

		var oModel = this.SettlementDetailDialogHandler.getModel();
		oModel.setProperty("/Header/CdIndpt", "");
		oModel.setProperty("/Header/CdIndptText", "");
		oModel.setProperty("/Header/ZsendKostl", "");
		oModel.setProperty("/Header/ZsendKostlT", "");
		oModel.setProperty("/Header/OrgehP", "");
	},

	// Header 비용귀속부서 코스트센터 선택 dialog
	searchSubCostCenter: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		dialogTitle = oEventSource.data("dialogTitle"),
		search = oEventSource.data("search"),
		target = oEventSource.data("target");

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel(),
			initData = {
				dialogTitle: dialogTitle,
				subCode: oModel.getProperty(search.subCode || ""),
				code: oModel.getProperty(search.code || "")
			},
			callback = function(o) {
				oModel.setProperty(target.code, o.code);
				oModel.setProperty(target.text, o.text);
			}.bind(this);

			DialogHandler.open(SubCostCenterDialogHandler.get(this, initData, callback));
		}.bind(this), 0);
	},

	clearSubCostCenter: function() {

		var oModel = this.SettlementDetailDialogHandler.getModel();
		oModel.setProperty("/Header/ZsendKostl", "");
		oModel.setProperty("/Header/ZsendKostlT", "");
	},

	// WBS 선택 dialog
	searchWBS: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		search = oEventSource.data("search"),
		target = oEventSource.data("target");

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel(),
			initData = {
				subCode: oModel.getProperty(search.subCode || ""),
				code: oModel.getProperty(search.code || "")
			},
			callback = function(o) {
				oModel.setProperty(target.code, o.code);
				oModel.setProperty(target.text, o.text);
			}.bind(this);

			DialogHandler.open(WBSDialogHandler.get(this, initData, callback));
		}.bind(this), 0);
	},

	clearWBS: function() {

		var oModel = this.SettlementDetailDialogHandler.getModel();
		oModel.setProperty("/Header/PsPosid", "");
		oModel.setProperty("/Header/PsPosidT", "");
	},

	searchCity: function(oEvent) {

		var path = oEvent.getSource().getParent().getBindingContext().getPath(), // setTimeout 때문에 oEvent 객체가 빨리 소멸되므로 미리 변수로 받음
		targetRowIndex = Common.toNumber(path.replace(/.*\/(\d+)$/, "$1"));

		setTimeout(function() {
			var callback = function(p) {
				var oModel = this.SettlementDetailDialogHandler.getModel(),
				TableIn04 = oModel.getProperty("/SettlementTableIn04"),
				rowIndices = $.map(TableIn04, function(o, i) {
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

				this.SettlementDetailDialogHandler.calculateAmount();
			}.bind(this);

			DialogHandler.open(CityDialogHandler.get(this, callback));
		}.bind(this), 0);
	},

	// 출장일정 row insert
	pressAddSchedule: function() {

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel(),
			TableIn04 = oModel.getProperty("/SettlementTableIn04");
			TableIn04.push({ Relindex: Common.lpad(TableIn04.length, 2) });
			oModel.refresh();
			Common.adjustVisibleRowCount($.app.byId("SettlementTableIn04"), 5, TableIn04.length);
		}.bind(this), 0);
	},

	// 출장일정 row delete
	pressRemoveSchedule: function() {

		setTimeout(function() {
			var oTableIn04 = $.app.byId("SettlementTableIn04"),
			oTableIn05 = $.app.byId("SettlementTableIn05"),
			aIndices = oTableIn04.getSelectedIndices();
			if (aIndices.length < 1) {
				MessageBox.warning(this.getBundleText("MSG_00050")); // 삭제할 행을 선택하세요.
				return;
			}

			if (aIndices.length === 1) {
				var oModel = this.SettlementDetailDialogHandler.getModel(),
				TableIn04 = oModel.getProperty("/SettlementTableIn04"),
				o = TableIn04[aIndices[0]];

				if (!o.BtCity && (!o.BtStartdat || !o.BtEnddat)) {
					TableIn04.splice(aIndices[0], 1);

					var TableIn05 = OnSettlement.getExpensesFor.call(this, TableIn04);

					if (!TableIn04.length) {
						TableIn04.push({ Relindex: "00" });
					}

					oModel.setProperty("/SettlementTableIn04", TableIn04);
					oModel.setProperty("/SettlementTableIn05", TableIn05);
					oModel.refresh();
					Common.adjustVisibleRowCount(oTableIn04.clearSelection(), 5, TableIn04.length);
					Common.adjustVisibleRowCount(oTableIn05.clearSelection(), 5, TableIn05.length);

					this.SettlementDetailDialogHandler.calculateAmount();
					return;
				}
			}

			MessageBox.confirm(this.getBundleText("MSG_00051"), { // 선택된 행을 삭제하시겠습니까?
				onClose: function(oAction) {
					if (sap.m.MessageBox.Action.OK === oAction) {
						var TableIn04 = Common.getUnselectedRowsModelProperties(oTableIn04), // 선택되지 않은 행들의 데이터만 array로 받음
						TableIn05 = OnSettlement.getExpensesFor.call(this, TableIn04),
						oModel = this.SettlementDetailDialogHandler.getModel();

						if (!TableIn04.length) {
							TableIn04.push({ Relindex: "00" });
						}

						oModel.setProperty("/SettlementTableIn04", TableIn04);
						oModel.setProperty("/SettlementTableIn05", TableIn05);
						oModel.refresh();
						Common.adjustVisibleRowCount(oTableIn04.clearSelection(), 5, TableIn04.length);
						Common.adjustVisibleRowCount(oTableIn05.clearSelection(), 5, TableIn05.length);

						this.SettlementDetailDialogHandler.calculateAmount();
					}
				}.bind(this)
			});
		}.bind(this), 0);
	},

	// 삭제되고 남아있는 출장일정에 해당하는 비용항목 목록 추출
	getExpensesFor: function(TableIn04) {

		var RelindexArray = $.map(TableIn04, function(p) {
			return p.Relindex;
		});
		return $.map(this.SettlementDetailDialogHandler.getModel().getProperty("/SettlementTableIn05"), function(p) {
			if ($.inArray(p.Relindex, RelindexArray) > -1) {
				return p;
			}
		});
	},

	// 비용정산항목 추가 dialog
	pressAddExpense: function(oEvent) {

		BusyIndicator.show(0);

		var CardPy = oEvent.getSource().data("CardPy");

		setTimeout(function() {
			if (!this.SettlementDetailDialogHandler.getModel().getProperty("/SettlementTableIn04").length) {
				MessageBox.error(this.getBundleText("MSG_19024")); // 출장 일정 정보를 먼저 입력해주세요.
				BusyIndicator.hide();
				return;
			}

			var isInvalid = false;
			$.each($.app.byId("SettlementTableIn04").getRows(), function(i, o) {
				var p = o.getRowBindingContext().getProperty();
				if (!p.BtCity) {
					MessageBox.error(this.getBundleText("MSG_19024"), { // 출장 일정 정보를 먼저 입력해주세요.
						onClose: function() {
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
							$.app.byId(o.$().find("[data-sap-ui-colid=\"SettlementTableIn04BtCityT\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				} else if (!p.BtStartdat || !p.BtEnddat) {
					MessageBox.error(this.getBundleText("MSG_19024"), { // 출장 일정 정보를 먼저 입력해주세요.
						onClose: function() {
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
							$.app.byId(o.$().find("[data-sap-ui-colid=\"SettlementTableIn04BtPeriod\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				}
			}.bind(this));

			BusyIndicator.hide();

			if (isInvalid) {
				return;
			}

			if (CardPy === "5") {
				var SelectedCardApprNoMap = {};
				$.map(this.SettlementDetailDialogHandler.getModel().getProperty("/SettlementTableIn05") || [], function(p) {
					if (p.ApprNo) {
						SelectedCardApprNoMap[p.ApprNo] = true;
					}
				});

				DialogHandler.open(CardExpenseDialogHandler.get(this, SelectedCardApprNoMap, function(p) {
					var initData = $.extend({
						dialogTitle: this.getBundleText("LABEL_19573"), // 법인카드
						UseGis: this.SettlementDetailDialogHandler.getModel().getProperty("/Header/UseGis"),
						CardPy: "5",
						CardPyDetail: "2",
						RowIndex: -1
					}, p);
					DialogHandler.open(ExpenseDetailDialogHandler.get(this, initData, OnSettlement.addSettlementTableIn05.bind(this)));
				}.bind(this)));
			} else {
				var initData = {
					dialogTitle: this.getBundleText("LABEL_19574"), // 현금/기타
					UseGis: this.SettlementDetailDialogHandler.getModel().getProperty("/Header/UseGis"),
					CardPy: "1",
					CardPyDetail: "1",
					RowIndex: -1
				};
				DialogHandler.open(ExpenseDetailDialogHandler.get(this, initData, OnSettlement.addSettlementTableIn05.bind(this)));
			}
		}.bind(this), 0);
	},

	// 비용정산항목 row delete
	pressRemoveExpense: function() {

		setTimeout(function() {
			var oTable = $.app.byId("SettlementTableIn05"),
			aSelectedIndices = oTable.getSelectedIndices();
			if (aSelectedIndices.length < 1) {
				MessageBox.warning(this.getBundleText("MSG_00050")); // 삭제할 행을 선택하세요.
				return;
			}

			MessageBox.confirm(this.getBundleText("MSG_00051"), { // 선택된 행을 삭제하시겠습니까?
				onClose: function(oAction) {
					if (sap.m.MessageBox.Action.OK === oAction) {
						var TableIn05 = Common.getUnselectedRowsModelProperties(oTable),
						oModel = this.SettlementDetailDialogHandler.getModel();
						oModel.setProperty("/SettlementTableIn05", TableIn05);
						oModel.refresh();
						Common.adjustVisibleRowCount(oTable.clearSelection(), 5, TableIn05.length);

						this.SettlementDetailDialogHandler.calculateAmount();
					}
				}.bind(this)
			});
		}.bind(this), 0);
	},

	// 비용정산항목 수정 dialog
	clickSettlementTableIn05Cell: function(oEvent) {

		var rowIndex = oEvent.getParameter("rowIndex"),
		p = oEvent.getParameter("rowBindingContext").getProperty();

		setTimeout(function() {
			var initData = $.extend(p, {
				dialogTitle: p.CardPy === "5" ? this.getBundleText("LABEL_19573") : this.getBundleText("LABEL_19574"), // 법인카드 : 현금/기타
				UseGis: this.SettlementDetailDialogHandler.getModel().getProperty("/Header/UseGis"),
				RowIndex: rowIndex
			});
			DialogHandler.open(ExpenseDetailDialogHandler.get(this, initData, OnSettlement.updateSettlementTableIn05.bind(this)));
		}.bind(this), 0);
	},

	// 비용정산항목 row insert
	addSettlementTableIn05: function(p) {

		p.CardPyT = p.CardPy === "5" ? this.getBundleText("LABEL_19573") : (p.CardPy === "1" ? this.getBundleText("LABEL_19574") : ""); // 법인카드 : 현금/기타

		var oModel = this.SettlementDetailDialogHandler.getModel(),
		TableIn05 = oModel.getProperty("/SettlementTableIn05");
		TableIn05.push(p);
		oModel.refresh();
		Common.adjustVisibleRowCount($.app.byId("SettlementTableIn05"), 5, TableIn05.length);

		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 비용정산항목 row update
	updateSettlementTableIn05: function(p) {

		p.CardPyT = p.CardPy === "5" ? this.getBundleText("LABEL_19573") : (p.CardPy === "1" ? this.getBundleText("LABEL_19574") : ""); // 법인카드 : 현금/기타

		this.SettlementDetailDialogHandler.getModel().setProperty("/SettlementTableIn05/" + p.RowIndex, p);
		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 출장 기간 change event handler
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

			var oModel = this.SettlementDetailDialogHandler.getModel(),
			rowIndices = $.map(oModel.getProperty("/SettlementTableIn04"), function(o, i) {
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
					}.bind(this)
				});
			} else {
				this.SettlementDetailDialogHandler.calculateAmount();
			}
		}.bind(this), 0);
	},

	// 일비 제외 checkbox event handler
	selectExceptDailyAmount: function(oEvent) {

		this.SettlementDetailDialogHandler.getModel().setProperty("/Header/ChkPer", oEvent.getParameter("selected"));
		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 전일 출발 checkbox event handler
	selectEarlierDeparture: function() {

		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 숙박, 식사 수정 event handler
	changeLodgingAndMeal: function() {

		this.SettlementDetailDialogHandler.calculateAmount();
	},

	// 재작성
	pressRevise: function() {

		setTimeout(function() {
			var oModel = this.SettlementDetailDialogHandler.getModel();
			oModel.setProperty("/Header/Btact", true);
			oModel.setProperty("/Header/Edtfg", true);
			oModel.setProperty("/Header/Status1", "");
			oModel.setProperty("/Header/Appkey1", "");
		}.bind(this), 0);
	},

	// 삭제 확인
	pressRemove: function() {
		Common.log("OnSettlement.pressRemove");

		MessageBox.confirm(this.getBundleText("MSG_00059"), { // 삭제하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnSettlement.remove.bind(this), 0);
				}
			}.bind(this)
		});
	},
	
	// 삭제
	remove: function() {
		Common.log("OnSettlement.remove");

		this.SettlementDetailDialogHandler.toggleButtonsState(false);

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtSettlementSet",
			{
				IConType: $.app.ConType.DELETE,
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				TableIn01: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn01", this.SettlementDetailDialogHandler.getModel().getProperty("/Header"))],
				TableIn02: [], // 출장 Header 정보
				TableIn03: [], // 경비현황 목록
				TableIn04: [], // 출장일정 목록
				TableIn05: [], // 비용정산항목 목록
				TableIn06: [], // 코스트센터 코드 목록
				TableIn07: [], // 근태유형 코드 목록
				TableIn08: []  // 연료유형 코드 목록
			},
			{
				success: function(oData) {
					Common.log("OnSettlement.remove success", oData);

					MessageBox.success(this.getBundleText("MSG_00021"), { // 삭제되었습니다.
						onClose: function() {
							BusyIndicator.hide();
							this.SettlementDetailDialogHandler.getDialog().close();
							setTimeout(OnSettlement.pressSearch.bind(this), 0);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnSettlement.remove error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_09029") // 확인
						});
					}

					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},

	// 저장 확인
	pressSave: function() {
		Common.log("OnSettlement.pressSave");

		MessageBox.confirm(this.getBundleText("MSG_00058"), { // 저장하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnSettlement.save.bind(this), 0);
				}
			}.bind(this)
		});
	},

	// 저장
	save: function() {
		Common.log("OnSettlement.save");

		this.SettlementDetailDialogHandler.toggleButtonsState(false);

		var oModel = this.SettlementDetailDialogHandler.getModel(),
		TableIn04 = $.map(oModel.getProperty("/SettlementTableIn04"), function(p, i) {
			if (p.BtCity || p.BtStartdat || p.BtEnddat) {
				p.Btseq = Common.lpad(i, 2);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn04", p);
			}
		});

		var TableIn05 = $.map(oModel.getProperty("/SettlementTableIn05"), function(p, i) {
			p.Btseq = Common.lpad(i, 2);
			return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn05", p);
		});

		oModel.setProperty("/Header/Status1", "");
		oModel.setProperty("/Header/Appnm", "");
		oModel.setProperty("/Header/Appkey1", "");
		oModel.setProperty("/Header/ApplyDt1", null);
		oModel.setProperty("/Header/ApplyTm1", null);
		oModel.setProperty("/Header/ApplyNm1", "");
		oModel.setProperty("/Header/AppDate1", null);
		oModel.setProperty("/Header/AppTime1", null);
		oModel.setProperty("/Header/AppName1", "");

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtSettlementSet",
			{
				IConType: oModel.getProperty("/Header/Zzdocno") ? $.app.ConType.UPDATE : $.app.ConType.CREAT, // 수정 or 생성
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				TableIn01: [],
				TableIn02: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn02", oModel.getProperty("/Header"))], // 출장 Header 정보
				TableIn03: [],        // 경비현황 목록
				TableIn04: TableIn04, // 출장일정 목록
				TableIn05: TableIn05, // 비용정산항목 목록
				TableIn06: []         // 코스트센터 코드 목록
			},
			{
				success: function(oData) {
					Common.log("OnSettlement.request success", oData);

					var oModel = this.SettlementDetailDialogHandler.getModel(),
					oldHeader = oModel.getProperty("/Header"),
					TableIn02 = Common.getTableInResults(oData, "TableIn02");

					oModel.setProperty("/Header", $.extend(oldHeader, TableIn02[0]));
					oModel.setProperty("/SettlementTableIn02", TableIn02);

					MessageBox.success(this.getBundleText("MSG_00017"), { // 저장되었습니다.
						onClose: function() {
							setTimeout(OnSettlement.pressSearch.bind(this), 0);
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnSettlement.request error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_09029") // 확인
						});
					}

					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},
	
	// 신청 확인
	pressRequest: function() {
		Common.log("OnSettlement.pressRequest");

		this.SettlementDetailDialogHandler.toggleButtonsState(false);

		MessageBox.confirm(this.getBundleText("MSG_00060"), { // 신청하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					BusyIndicator.show(0);
					setTimeout(OnSettlement.checkDuplication.bind(this), 0);
				} else {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
				}
			}.bind(this)
		});
	},

	// 신청 중복 확인
	checkDuplication: function() {

		var oModel = this.SettlementDetailDialogHandler.getModel();

		if (oModel.getProperty("/Header/Status1") === "JJ") { // 상신취소 상태에서 신청시 중복 체크 건너뜀
			setTimeout(OnSettlement.checkLodgeLimit.bind(this), 0);
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
					Common.log("OnSettlement.checkDuplication success", oData);

					setTimeout(OnSettlement.checkLodgeLimit.bind(this), 0);

				}.bind(this),
				error: function(oResponse) {
					Common.log("OnSettlement.checkDuplication error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, { // 결재 신청한 내역이 있습니다.
							title: this.getBundleText("LABEL_09029") // 확인
						});
					}

					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	},

	checkLodgeLimit: function() {

		var oModel = this.SettlementDetailDialogHandler.getModel(),
		ZlodgeLimit = oModel.getProperty("/Header/ZlodgeLimit") !== "X",
		Olamt = Common.toNumber(oModel.getProperty("/Header/Olamt") || 0);

		if (ZlodgeLimit && Olamt > 0) {
			MessageBox.warning(this.getBundleText("MSG_19034"), { // 숙박비 한도초과는 사내규정에 어긋나며, 감사팀과 재무그룹에 통보됨을 유념하시기 바랍니다.
				onClose: function() {
					BusyIndicator.hide();
					setTimeout(OnSettlement.openLodgeCommentDialog.bind(this), 0);
				}.bind(this)
			});
		} else {
			setTimeout(OnSettlement.request.bind(this), 0);
		}
	},

	openLodgeCommentDialog: function() {

		if (!this.oLodgeCommentDialog) {
			this.oLodgeCommentDialog = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: this.getBundleText("LABEL_19702"), // 숙박비 초과사유
				draggable: true,
				content: [
					new sap.m.Label({
						text: this.getBundleText("MSG_19035"), // 숙박비 한도가 초과되었습니다.\n한도초과 사유를 입력해주세요.
						labelFor: "HeaderComment"
					}),
					new sap.m.TextArea("HeaderComment", {
						width: "100%",
						rows: 5,
						maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn02", "Comment"),
						liveChange: function(oEvent) {
							this.oLodgeCommentDialog.getButtons()[0].setEnabled(oEvent.getParameter("value").length > 0);
						}.bind(this)
					})
				],
				buttons: [
					new sap.m.Button({
						text: this.getBundleText("LABEL_00101"), // 저장
						enabled: false,
						press: function() {
							BusyIndicator.show(0);
							this.SettlementDetailDialogHandler.getModel().setProperty("/Header/Comment", $.app.byId("HeaderComment").getValue());
							this.oLodgeCommentDialog.close();
							setTimeout(OnSettlement.request.bind(this), 0);
						}.bind(this)
					})
					.addStyleClass("button-light"),
					new sap.m.Button({
						type: sap.m.ButtonType.Default,
						text: this.getBundleText("LABEL_00133"), // 닫기
						press: function() {
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
							this.oLodgeCommentDialog.close();
						}.bind(this)
					})
					.addStyleClass("button-default custom-button-divide")
				]
			});
		}

		this.oLodgeCommentDialog.open();
	},

	// 신청
	request: function() {
		Common.log("OnSettlement.request");

		var oModel = this.SettlementDetailDialogHandler.getModel(),
		value = oModel.getProperty("/Header/CdIndpt");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19305")), { // {소속부서}을 선택하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderCdIndpt").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/Ename");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00054", this.getBundleText("LABEL_19306")), { // {출장자}를 입력하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderEname").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/ZsendKostl");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19307")), { // {비용귀속부서}를 선택하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderZsendKostl").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/BtPurpose1");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19308")), { // {출장구분}을 선택하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderBtPurpose1").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/Title");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00053", this.getBundleText("LABEL_19312")), { // {출장명}을 입력하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderTitle").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/BtPurpose2");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00053", this.getBundleText("LABEL_19314")), { // {출장목적}을 입력하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderBtPurpose2").focus();
				}.bind(this)
			});
			return;
		}
		value = oModel.getProperty("/Header/BtResult");
		if (!$.trim(value)) {
			MessageBox.error(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19319")), { // {출장결과}를 입력하세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
					$.app.byId("HeaderBtResult").focus();
				}.bind(this)
			});
			return;
		}

		var isInvalid = false, TableIn04 = [];
		if (oModel.getProperty("/SettlementTableIn04").length) {
			$.each($.app.byId("SettlementTableIn04").getRows(), function(i, o) { // 행이 생성되었더라도 두 필수 항목이 모두 입력된 행만 신청데이터로 취합함.
				var p = o.getRowBindingContext().getProperty();
				if (!p.BtCity) {
					MessageBox.error(this.getBundleText("MSG_00056", this.getBundleText("LABEL_19335")), { // {도시}를 선택하세요.
						onClose: function() {
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"SettlementTableIn04BtCityT\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				} else if (!p.BtStartdat || !p.BtEnddat) {
					MessageBox.error(this.getBundleText("MSG_00055", this.getBundleText("LABEL_19336")), { // {출장 기간}을 선택하세요.
						onClose: function() {
							this.SettlementDetailDialogHandler.toggleButtonsState(true);
							BusyIndicator.hide();
							$.app.byId(o.$().find("[data-sap-ui-colid=\"SettlementTableIn04BtPeriod\"] .sapUiTableCellInner>[data-sap-ui]").attr("id")).focus();
						}.bind(this)
					});
					isInvalid = true;
					return false;
				} else {
					TableIn04.push(Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn04", p));
				}
			}.bind(this));
		}

		if (isInvalid) {
			return;
		}

		if (!TableIn04.length) {
			MessageBox.error(this.getBundleText("MSG_19016"), { // 출장 일정 정보를 입력해주세요.
				onClose: function() {
					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			});
			return;
		}

		var TableIn05 = $.map(oModel.getProperty("/SettlementTableIn05"), function(p) {
			return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn05", p);
		});

		oModel.setProperty("/Header/Status1", "");
		oModel.setProperty("/Header/Appnm", "");
		oModel.setProperty("/Header/Appkey1", ""); // 신청시 결재상신없이 SMOIN 결재창을 닫아버리는 경우 Appkey1은 이미 생성되어 SAP에 저장되므로 신청시 무조건 Appkey1을 초기화함
		oModel.setProperty("/Header/ApplyDt1", null);
		oModel.setProperty("/Header/ApplyTm1", null);
		oModel.setProperty("/Header/ApplyNm1", "");
		oModel.setProperty("/Header/AppDate1", null);
		oModel.setProperty("/Header/AppTime1", null);
		oModel.setProperty("/Header/AppName1", "");

		OnSettlement.callRequestOData.call(this, oModel.getProperty("/Header"), TableIn04, TableIn05);
	},

	// 신청 OData 호출
	callRequestOData: function(Header, TableIn04, TableIn05) {

		$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
			"/BtSettlementSet",
			{
				IConType: "5",
				IEmpid: this.getSessionInfoByKey("name"),
				IPernr: this.getSessionInfoByKey("name"),
				IBukrs: this.getSessionInfoByKey("Bukrs"),
				ILangu: this.getSessionInfoByKey("Langu"),
				Export: [],
				TableIn01: [],
				TableIn02: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn02", Header)], // 출장 Header 정보
				TableIn03: [],        // 경비현황 목록
				TableIn04: TableIn04, // 출장일정 목록
				TableIn05: TableIn05, // 비용정산항목 목록
				TableIn06: []         // 코스트센터 코드 목록
			},
			{
				success: function(oData) {
					Common.log("OnSettlement.request success", oData);
					var smoinUrl;
					if (oData && oData.Export && oData.Export.results) {
						var exports = oData.Export.results;
						if (exports.length) {
							smoinUrl = exports[0].Url;
						}
					}

					MessageBox.success(this.getBundleText("MSG_00061"), { // 신청되었습니다.
						onClose: function() {
							if (smoinUrl) {
								this.openWindow({ name: "smoin-approval-popup", width: 1000, height: screen.availHeight * 0.9, url: smoinUrl });
							}

							BusyIndicator.hide();
							this.SettlementDetailDialogHandler.getDialog().close();
							setTimeout(OnSettlement.pressSearch.bind(this), 0);
						}.bind(this)
					});
				}.bind(this),
				error: function(oResponse) {
					Common.log("OnSettlement.request error", oResponse);

					var errData = Common.parseError(oResponse);
					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_09029") // 확인
						});
					}

					this.SettlementDetailDialogHandler.toggleButtonsState(true);
					BusyIndicator.hide();
				}.bind(this)
			}
		);
	}

};

return OnSettlement;

});