/* eslint-disable no-empty */
sap.ui.define(
	[
		"common/Common", //
		"common/SearchUser1",
		"common/SearchOrg",
		"common/DialogHandler",
		"common/OrgOfIndividualHandler",
		"common/ApprovalLinesHandler",
		"./OvertimeWork",
		"./ODataService",
		"./PriorOverWorkDialogHandler",
		"./MealDialogHandler",
		"sap/m/MessageBox",
		"sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
		"sap/ui/model/json/JSONModel"
	],
	function (Common, SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, ApprovalLinesHandler, OvertimeWork, ODataService,
		PriorOverWorkDialogHandler, MealDialogHandler, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
		"use strict";

		var Handler = {
			oController: null,
			oModel: new JSONModel(),

			oDetailDialog: null,
			aColumnModel: null,

			Model: function () {
				return this.oModel;
			},

			/**
			 * @brief constructor
			 * 	- 최초 생성시 호출
			 *
			 * @this {Handler}
			 * 
			 * @param {object} oController
			 */
			initialize: function (oController) {
				this.oController = oController;
				this.oModel.setData({
					Dtfmt: "yyyy-MM-dd",
					Auth: $.app.getAuth(),
					IsSearch: false,
					IsPossibleExcelButton: false, // 엑셀 버튼 활성화 여부
					SearchConditions: { // 검색조건
						Pernr: null,
						Orgeh: null,
						Bukrs3: null,
						EnameOrOrgehTxt: null,
						Begda: null,
						Endda: null,
						Aftck: OvertimeWork.POST
					},
					List: [],
					Hours: Common.makeNumbersArray({
						length: 24
					}).map(function (h) {
						return {
							Code: Common.lpad(h, 2),
							Text: Common.lpad(h, 2)
						};
					}),
					Minutes: Common.makeNumbersArray({
						length: 60
					}).map(function (m) {
						return {
							Code: Common.lpad(m, 2),
							Text: Common.lpad(m, 2)
						};
					}),
					Minutes30: null,
					Detail: {
						IsViewMode: false, // 조회모드 여부
						IsPossibleSave: false, // 저장버튼 활성화 여부
						IsPossibleApproval: false, // 신청버튼 활성화 여부
						IsPossibleDelete: false, // 삭제버튼 활성화 여부
						VisibleApprs: false, // 결재라인 테이블 show
						Header: {},
						List: []
					} // 상세
				});

				return this;
			},

			load: function () {
				var currDate = new Date();

				this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
				this.oModel.setProperty("/SearchConditions/Begda", new Date(currDate.getFullYear(), currDate.getMonth(), 1));
				this.oModel.setProperty("/SearchConditions/Endda", new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0));
				if ($.app.getAuth() === $.app.Auth.ESS && this.oController.getSessionInfoByKey("Zshft") !== "X") {
					this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
					this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
					this.oModel.setProperty("/SearchConditions/Bukrs3", this.oController.getSessionInfoByKey("Bukrs3"));
				} else {
					this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
					this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
				}
				if (this.oController.getSessionInfoByKey("Bukrs3") === "1000") {
					this.oModel.setProperty("/Minutes30", [{
							Code: "00",
							Text: "00"
						}, //
						{
							Code: "30",
							Text: "30"
						}
					]);
				} else {
					this.oModel.setProperty("/Minutes30", this.oModel.getProperty("/Minutes"));
				}

				return this;
			},

			/**
			 * @brief 검색
			 * 
			 * @this {Handler}
			 */
			search: function () {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						this.loadTableData();
						this.toggleExcelBtn();
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			/**
			 * @brief 목록 조회
			 * 
			 * @this {Handler}
			 */
			loadTableData: function () {
				var results = ODataService.OvertimeWorkApplySet.call(
					this.oController,
					OvertimeWork.ProcessType.READ,
					this.oModel.getProperty("/SearchConditions")
				);

				this.oModel.setProperty("/IsSearch", true);
				this.oModel.setProperty("/List", results.OtWorkTab1);

				$.app.byViewId("PostTable").setFirstVisibleRow(0);
				$.app.byViewId("PostTable").clearSelection();
				Common.adjustAutoVisibleRowCount.call($.app.byViewId("PostTable"));
			},

			toggleExcelBtn: function () {
				this.oModel.setProperty(
					"/IsPossibleExcelButton",
					this.oModel.getProperty("/List").length ? true : false
				);
			},

			pressExcelDownloadBtn: function () {
				var aTableDatas = this.oModel.getProperty("/List");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Otbet", "Otent"),
					workbook: {
						columns: this.aColumnModel
					},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_32003"), sap.ui.core.format.DateFormat
						.getDateTimeInstance({
							pattern: "yyyy-MM-dd"
						}).format(new Date()))
				}).build();
			},

			/**
			 * @brief 목록 row Click event handler
			 * 
			 * @param rowData
			 */
			pressSelectRowDetail: function (oEvent) {

				var columnId = oEvent.getParameter("columnId"),
					p = columnId ? oEvent.getParameter("rowBindingContext").getProperty() : oEvent.getSource().getBindingContext().getProperty();

				if (p.Status1 !== "AA" && columnId === "ZUI5_HR_OvertimeWorkTech.Tab--PostTableStatus1T" && p.UrlA1) { // 결재상태
					Common.openPopup.call(this.oController, p.UrlA1);
				} else {
					this.loadApprovalDetail(p);
				}
			},

			loadApprovalDetail: function (rowData) {
				var results = ODataService.OvertimeWorkApplySet.call(
					this.oController,
					OvertimeWork.ProcessType.READ, {
						Aftck: OvertimeWork.POST,
						Pernr: rowData.Pernr,
						Begda: rowData.Begda,
						Endda: rowData.Endda,
						Datum: rowData.Begda,
						OtWorkTab1: [Common.copyByMetadata($.app.getModel("ZHR_WORKTIME_APPL_SRV"), "OvertimeWorkApplyTab1", rowData)]
					}
				);

				if (!results.OtWorkTab1.length) {
					MessageBox.error(this.oController.getBundleText("MSG_32018"), { // 조회된 데이터가 없습니다.
						title: this.oController.getBundleText("LABEL_00149")
					});
					return;
				}

				this.oModel.setProperty("/Detail/IsViewMode", rowData.Status1 === OvertimeWork.Approval.NONE ? false : true);
				this.oModel.setProperty("/Detail/IsPossibleSave", true);
				this.oModel.setProperty("/Detail/IsPossibleApproval", true);
				this.oModel.setProperty("/Detail/IsPossibleDelete", true);
				this.oModel.setProperty("/Detail/Header", $.extend(true, results.OtWorkTab1[0], {
					Holick: results.OtWorkTab1[0].Holick === "X" ? true : false,
					OtbetmT: results.OtWorkTab1[0].Otbetm.substring(0, 2) === "24" ? "00" : results.OtWorkTab1[0].Otbetm.substring(0, 2),
					OtbetmM: results.OtWorkTab1[0].Otbetm.substring(2, 4),
					OtentmT: results.OtWorkTab1[0].Otentm.substring(0, 2) === "24" ? "00" : results.OtWorkTab1[0].Otentm.substring(0, 2),
					OtentmM: results.OtWorkTab1[0].Otentm.substring(2, 4)
				}));
				this.oModel.setProperty("/Detail/VisibleApprs", results.OtWorkTab2.length ? true : false);
				this.oModel.setProperty("/Detail/List", results.OtWorkTab2.map(function (elem) {
					return $.extend(true, elem, {
						AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(elem.Aprsq) // ${v}차 결재자
					});
				}.bind(this)));

				this.openDetailDialog();
			},

			/**
			 * 신청 Dialog 호출 버튼 event
			 * 
			 * @this {Handler}
			 */
			pressOpenApprovalBtn: function () {

				var vZshft = this.oController.getSessionInfoByKey("Zshft");

				this.oModel.setProperty("/Detail", {
					IsViewMode: false,
					IsPossibleSave: false,
					IsPossibleApproval: false,
					IsPossibleDelete: false,
					VisibleApprs: false,
					Header: {
						Status1: "",
						Ename: vZshft === "X" ? "" : this.oController.getSessionInfoByKey("Ename"),
						Pernr: vZshft === "X" ? "" : this.oController.getSessionInfoByKey("name"),
						Bukrs3: vZshft === "X" ? "" : this.oController.getSessionInfoByKey("Bukrs3"),
						OtbetmT: "00",
						OtbetmM: "00",
						OtentmT: "00",
						OtentmM: "00",
						Brkhr1: "00",
						Brkmm1: "00",
						Brkhr2: "00",
						Brkmm2: "00",
						Brkhr3: "00",
						Brkmm3: "00",
						BrktmHr: "00",
						BrktmMm: "00",
						Begda: null
					},
					List: []
				});

				this.openDetailDialog();
			},

			/**
			 * 상세Dialog 필수입력 체크
			 * 
			 */
			checkFormControl: function (oEvent) {
				switch (oEvent.getSource().constructor) {
				case common.PickOnlyDatePicker:
					this.calculationOverWork("X");
					break;
				case sap.m.Select:
					this.calculationOverWork("");
					break;
				default:
					break;
				}

				this.toggleIsPossibleSave();
			},

			/**
			 * @brief 저장/신청버튼 활성화 여부
			 *        - 필수 항목이 모두 작성된 경우
			 */
			toggleIsPossibleSave: function () {
				this.NOT_VALID_FORM_CONTROL_COUNT = 0;
				this.validControl($.app.byViewId("PostInputForm")); // recursive call

				this.oModel.setProperty(
					"/Detail/IsPossibleSave",
					(this.NOT_VALID_FORM_CONTROL_COUNT === 0) ? true : false
				);
				this.oModel.setProperty(
					"/Detail/IsPossibleApproval",
					(this.NOT_VALID_FORM_CONTROL_COUNT === 0) ? true : false
				);
			},

			validControl: function (oControl) {
				// base case
				var childItems = oControl.getAggregation("items");
				if (oControl === null || childItems === null) return;

				// Recursion
				childItems.forEach(function (control) {
					try {
						var constructorName = control.constructor.getMetadata().getName();
						if (Object.keys(OvertimeWork.ValidateProperties).indexOf(constructorName) > -1 && control.getRequired() && control.getProperty(
								OvertimeWork.ValidateProperties[constructorName]) === "") {
							this.NOT_VALID_FORM_CONTROL_COUNT++;
						}
					} catch (ex) {
						Common.log(ex);
					} // Not valid control
					this.validControl(control);
				}, this);

				return;
			},

			/**
			 * @brief 사전신청일 선택 버튼 이벤트(Dialog 호출)
			 */
			pressSelectPriorBtn: function () {
				setTimeout(function () {
					var oModel = this.Model(),
						currDate = new Date(),
						initData = {
							Pernr: oModel.getProperty("/Detail/Header/Pernr"),
							Datum: currDate,
							Begda: new Date(currDate.getFullYear(), currDate.getMonth(), 1),
							Endda: new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0)
						},
						callback = function (o) {
							oModel.setProperty("/Detail/Header/Begda", o.Otdat);
							oModel.setProperty("/Detail/Header/Otbetm", o.Otbetm);
							oModel.setProperty("/Detail/Header/OtbetmT", o.Otbetm && !/^24/.test(o.Otbetm) ? o.Otbetm.split(":")[0] : "00");
							oModel.setProperty("/Detail/Header/OtbetmM", o.Otbetm ? o.Otbetm.split(":")[1] : "00");
							oModel.setProperty("/Detail/Header/Otentm", o.Otentm);
							oModel.setProperty("/Detail/Header/OtentmT", o.Otentm && !/^24/.test(o.Otentm) ? o.Otentm.split(":")[0] : "00");
							oModel.setProperty("/Detail/Header/OtentmM", o.Otentm ? o.Otentm.split(":")[1] : "00");
							oModel.setProperty("/Detail/Header/Holick", o.Holick === "X" ? true : false);
							oModel.setProperty("/Detail/Header/Horex", o.Horex);
							oModel.setProperty("/Detail/Header/Brkhr1", "00");
							oModel.setProperty("/Detail/Header/Brkmm1", "00");
							oModel.setProperty("/Detail/Header/Brkhr2", "00");
							oModel.setProperty("/Detail/Header/Brkmm2", "00");
							oModel.setProperty("/Detail/Header/Brkhr3", "00");
							oModel.setProperty("/Detail/Header/Brkmm3", "00");
							oModel.setProperty("/Detail/Header/BrktmHr", "00");
							oModel.setProperty("/Detail/Header/BrktmMm", "00");

							this.calculationOverWork();
						}.bind(this);

					DialogHandler.open(PriorOverWorkDialogHandler.get(this.oController, initData, callback));
				}.bind(this), 0);
			},

			/**
			 * 식사/웰리스 선택 버튼 이벤트(Dialog 호출)
			 */
			pressSelectMealBtn: function (oEvent) {
				var oEventSource = oEvent.getSource(),
					dialogTitle = oEventSource.data("dialogTitle"),
					type = oEventSource.data("type");
				// target = oEventSource.data("target");

				setTimeout(function () {
					var oModel = this.Model(),
						searchData = {
							Pernr: oModel.getProperty("/Detail/Header/Pernr"),
							Begda: oModel.getProperty("/Detail/Header/Begda"),
							DialogTitle: dialogTitle,
							Tmtyp: type
						},
						callback = function () {
							// oModel.setProperty(target.time, o.time);
							// oModel.setProperty(target.minute, o.minute);
						};

					DialogHandler.open(MealDialogHandler.get(this.oController, searchData, callback));
				}.bind(this), 0);
			},

			ProcessOnSuccess: function (data, conType, vReqes) {
				var successMessage = "";

				switch (conType) {
				case OvertimeWork.ProcessType.CREATE:
				case OvertimeWork.ProcessType.UPDATE:
					successMessage = (vReqes === "X") ? this.oController.getBundleText("MSG_00061") // 신청되었습니다.
						: this.oController.getBundleText("MSG_00017"); // 저장되었습니다.
					break;
				case OvertimeWork.ProcessType.DELETE:
					successMessage = this.oController.getBundleText("MSG_00021"); // 삭제되었습니다.
					break;
				default:
					break;
				}

				if (vReqes === "X" && !Common.isExternalIP()) {
					if (!Common.openPopup.call(this.oController, data.EUrl)) {
						BusyIndicator.hide();
						return;
					}
				}

				MessageBox.success(successMessage, {
					title: this.oController.getBundleText("LABEL_00150"),
					onClose: function () {
						this.search.call(this);
						this.oDetailDialog.close();
					}.bind(this)
				});

				BusyIndicator.hide();
			},

			ProcessOnFail: function (res) {
				var errData = Common.parseError(res);
				if (errData.Error && errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: this.oController.getBundleText("LABEL_00149")
					});
				}

				BusyIndicator.hide();
			},

			/**
			 * 저장 버튼 event
			 * 
			 * @this {Handler}
			 */
			pressSaveBtn: function () {
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oInputData = this.oModel.getProperty("/Detail");

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var payload = {};
					payload.Aftck = OvertimeWork.POST;
					payload.Reqes = "";
					payload.Empid = oInputData.Header.Pernr;
					payload.Datum = moment(oInputData.Header.Begda).hours(10).toDate();
					payload.OtWorkTab1 = [
						$.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
							Holick: oInputData.Header.Holick === true ? "X" : "",
							Otdat: moment(oInputData.Header.Begda).hours(10).toDate(),
							Otbetm: oInputData.Header.OtbetmT + oInputData.Header.OtbetmM,
							Otentm: oInputData.Header.OtentmT + oInputData.Header.OtentmM
						})
					];
					payload.OtWorkTab2 = oInputData.List.map(function (elem) {
						return Common.copyByMetadata(oModel, "OvertimeWorkApplyTab2", elem);
					});

					ODataService.OvertimeWorkApplySetByProcess.call(
						this.oController,
						(oInputData.Header.Status1 === OvertimeWork.Approval.NONE) ? OvertimeWork.ProcessType.UPDATE : OvertimeWork.ProcessType.CREATE,
						payload,
						this.ProcessOnSuccess.bind(this),
						this.ProcessOnFail.bind(this)
					);
				};

				MessageBox.show(this.oController.getBundleText("MSG_00058"), {
					// 저장하시겠습니까?
					title: this.oController.getBundleText("LABEL_00150"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			/**
			 * 신청 버튼 event
			 * 
			 * @this {Handler}
			 */
			pressApprovalBtn: function () {
				if (Common.isExternalIP()) {
					setTimeout(function () {
						var initData = {
								Mode: "P",
								Pernr: this.oController.getSessionInfoByKey("Pernr"),
								Empid: this.oController.getSessionInfoByKey("Pernr"),
								Bukrs: this.oController.getSessionInfoByKey("Bukrs3"),
								ZappSeq: "35"
							},
							callback = function (o) {
								this.onRequest.call(this, o);
							}.bind(this);

						this.oController.ApprovalLinesHandler = ApprovalLinesHandler.get(this.oController, initData, callback);
						DialogHandler.open(this.oController.ApprovalLinesHandler);
					}.bind(this), 0);
				} else {
					this.onRequest.call(this, null);
				}
			},

			onRequest: function (vAprdatas) {
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oInputData = this.oModel.getProperty("/Detail");

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var payload = {};
					payload.Aftck = OvertimeWork.POST;
					payload.Reqes = "X";
					payload.Empid = oInputData.Header.Pernr;
					payload.Datum = moment(oInputData.Header.Begda).hours(10).toDate();
					payload.OtWorkTab1 = [
						$.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
							Holick: oInputData.Header.Holick === true ? "X" : "",
							Otdat: moment(oInputData.Header.Begda).hours(10).toDate(),
							Otbetm: oInputData.Header.OtbetmT + oInputData.Header.OtbetmM,
							Otentm: oInputData.Header.OtentmT + oInputData.Header.OtentmM
						})
					];
					payload.OtWorkTab2 = [];
					payload.OtWorkTab3 = vAprdatas || [];

					ODataService.OvertimeWorkApplySetByProcess.call(
						this.oController,
						(oInputData.Header.Status1 === OvertimeWork.Approval.NONE) ? OvertimeWork.ProcessType.UPDATE : OvertimeWork.ProcessType.CREATE,
						payload,
						this.ProcessOnSuccess.bind(this),
						this.ProcessOnFail.bind(this)
					);
				};

				var confirmMessage = this.oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
				//월누적연장근로시간+신청 근로시간이 20시간 초과이면 확인 메시지(예/아니요) 출력
				if (oInputData.Header.Over20 && parseInt(oInputData.Header.Over20.substring(0, 3)) > 20) {
					confirmMessage = this.oController.getBundleText("MSG_32017"); // 월누적연장근로시간이 20시간 초과되었습니다.\n계속 진행하시겠습니까?
				}

				MessageBox.show(confirmMessage, {
					title: this.oController.getBundleText("LABEL_00150"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			/**
			 * 삭제 버튼 event
			 * 
			 * @this {Handler}
			 */
			pressDeleteBtn: function () {
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oInputData = this.oModel.getProperty("/Detail");

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var payload = {};
					payload.Aftck = OvertimeWork.POST;
					payload.Reqes = "";
					payload.Empid = oInputData.Header.Pernr;
					payload.Datum = moment(oInputData.Header.Begda).hours(10).toDate();
					payload.OtWorkTab1 = [
						$.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
							Holick: oInputData.Header.Holick === true ? "X" : ""
						})
					];
					payload.OtWorkTab2 = oInputData.List.map(function (elem) {
						return Common.copyByMetadata(oModel, "OvertimeWorkApplyTab2", elem);
					});

					ODataService.OvertimeWorkApplySetByProcess.call(
						this.oController,
						OvertimeWork.ProcessType.DELETE,
						payload,
						this.ProcessOnSuccess.bind(this),
						this.ProcessOnFail.bind(this)
					);
				};

				MessageBox.show(this.oController.getBundleText("MSG_00059"), {
					// 삭제하시겠습니까?
					title: this.oController.getBundleText("LABEL_00149"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			openDetailDialog: function () {
				if (!this.oDetailDialog) {
					this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "postDetail"].join(".fragment."), this.oController);
					$.app.getView().addDependent(this.oDetailDialog);
				}

				Common.adjustVisibleRowCount($.app.byViewId("PostApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);

				this.oDetailDialog.open();
			},

			/**
			 * @brief 결재라인 추가 버튼 event handler
			 */
			pressAddApprovalLine: function () {
				this.oController.EmployeeSearchCallOwner = this;
				SearchUser1.oController = this.oController;
				SearchUser1.searchAuth = "A";
				SearchUser1.oTargetPaths = null;

				if (!this.oController._AddPersonDialog) {
					this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
					this.oController.getView().addDependent(this.oController._AddPersonDialog);
				}

				this.oController._AddPersonDialog.open();
			},

			/**
			 * @brief 공통-사원검색 callback function
			 */
			setSelectionTagets: function (data) {
				var vApprovalLines = this.oModel.getProperty("/Detail/List"),
					oTargetPaths = SearchUser1.oTargetPaths;

				if (vApprovalLines.some(function (elem) {
						return elem.Apper === data.Pernr;
					})) {
					MessageBox.warning(this.oController.getBundleText("MSG_00065")); // 중복된 결재자입니다.
					return;
				}

				if (Common.checkNull(oTargetPaths)) {
					// Line add
					vApprovalLines.push({
						Aprsq: String(vApprovalLines.length + 1),
						AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(vApprovalLines.length + 1), // ${v}차 결재자
						ApstaT: "",
						Apper: data.Pernr,
						Apnam: data.Ename,
						Aporx: data.Fulln,
						ApgrdT: data.ZpGradetx
					});
					this.oModel.refresh();
					Common.adjustVisibleRowCount($.app.byViewId("PostApprovalLineTable"), 3, vApprovalLines.length);
					this.toggleIsPossibleSave();
				} else {
					// Line modify
					this.oModel.setProperty(oTargetPaths.sPath + "/Apper", data.Pernr);
					this.oModel.setProperty(oTargetPaths.sPath + "/Apnam", data.Ename);
					this.oModel.setProperty(oTargetPaths.sPath + "/Aporx", data.Fulln);
					this.oModel.setProperty(oTargetPaths.sPath + "/ApgrdT", data.ZpGradetx);
				}

				SearchUser1.oTargetPaths = null;
				SearchUser1.onClose();
			},

			/**
			 * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
			 */
			openOrgSearchDialog: function (oEvent) {
				SearchOrg.oController = this.oController;
				SearchOrg.vActionType = "Multi";
				SearchOrg.vCallControlId = oEvent.getSource().getId();
				SearchOrg.vCallControlType = "MultiInput";

				if (!this.oOrgSearchDialog) {
					this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
					$.app.getView().addDependent(this.oOrgSearchDialog);
				}

				this.oOrgSearchDialog.open();
			},

			/**
			 * @brief 결재라인 변경 버튼 event handler
			 */
			pressApprovalLineModify: function (oEvent) {
				this.oController.EmployeeSearchCallOwner = this;
				SearchUser1.oController = this.oController;
				SearchUser1.searchAuth = "A";
				SearchUser1.oTargetPaths = {
					sPath: oEvent.getSource().getBindingContext().getPath()
				};

				if (!this.oController._AddPersonDialog) {
					this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
					this.oController.getView().addDependent(this.oController._AddPersonDialog);
				}

				this.oController._AddPersonDialog.open();
			},

			/**
			 * @brief 결재라인 삭제 버튼 event handler
			 */
			pressApprovalLineDelete: function (oEvent) {
				this.oModel.setProperty(
					"/Detail/List",
					this.oModel.getProperty("/Detail/List")
					.filter(function (elem) {
						return elem.Apper !== oEvent.getSource().getBindingContext().getProperty().Apper;
					})
					.map(function (elem, idx) {
						return $.extend(true, elem, {
							AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(idx + 1) // ${v}차 결재자
						});
					}.bind(this))
				);

				Common.adjustVisibleRowCount($.app.byViewId("PostApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
				this.toggleIsPossibleSave();
			},

			/**
			 * 목록에서 [공통]부서/사원 조직도 Dialog 호출
			 */
			searchOrgehPernrByList: function () {
				this.searchOrgehPernr.call(this.oController, function (o) {
					if (o.Otype === "P" && o.Zshft === "X") {
						MessageBox.warning(this.oController.getBundleText("MSG_32025")); // 교대근무자는 선택할 수 없습니다.
						return;
					}

					this.oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
					this.oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
					this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
				}.bind(this));
			},

			/**
			 * 대상자, 근무일, 근무시간, 예상제외시간 변경시 호출
			 * 
			 * @param {string} vFirst - 대상자, 근무일 변경시에 "X"로 호출한다.
			 */
			calculationOverWork: function (vFirst) {
				var vDetailInfo = this.oModel.getProperty("/Detail/Header");

				if (!vDetailInfo.Pernr || !vDetailInfo.Begda) return;

				$.app.byViewId("PostInputForm").setBusyIndicatorDelay(0).setBusy(true);

				Common.getPromise(
					function () {
						// 기본정보 조회
						var results = ODataService.OvertimeWorkApplySet.call(
							this.oController,
							OvertimeWork.ProcessType.CODE, {
								isErrorShow: true,
								Aftck: OvertimeWork.POST,
								First: vFirst,
								Pernr: vDetailInfo.Pernr,
								Begda: vDetailInfo.Begda,
								Endda: vDetailInfo.Begda,
								Datum: vDetailInfo.Begda,
								OtWorkTab1: [{
									Pernr: vDetailInfo.Pernr,
									Otdat: moment(vDetailInfo.Begda).hours(10).toDate(),
									Otbetm: Common.nvl(vDetailInfo.OtbetmT, "00") + Common.nvl(vDetailInfo.OtbetmM, "00"),
									Otentm: Common.nvl(vDetailInfo.OtentmT, "00") + Common.nvl(vDetailInfo.OtentmM, "00"),
									BrktmHr: Common.nvl(vDetailInfo.BrktmHr, "00"),
									BrktmMm: Common.nvl(vDetailInfo.BrktmMm, "00"),
									Brkhr1: Common.nvl(vDetailInfo.Brkhr1, "00"),
									Brkmm1: Common.nvl(vDetailInfo.Brkmm1, "00"),
									Brkhr2: Common.nvl(vDetailInfo.Brkhr2, "00"),
									Brkmm2: Common.nvl(vDetailInfo.Brkmm2, "00"),
									Brkhr3: Common.nvl(vDetailInfo.Brkhr3, "00"),
									Brkmm3: Common.nvl(vDetailInfo.Brkmm3, "00")
								}]
							}
						);
						var vOtWorkTab1 = results.OtWorkTab1[0] || {};

						this.oModel.setProperty(
							"/Detail/List",
							results.OtWorkTab2.map(function (elem) {
								return $.extend(true, elem, {
									AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(elem.Aprsq) // ${v}차 결재자
								});
							}.bind(this))
						);
						this.oModel.setProperty(
							"/Detail/Header",
							$.extend(true, this.oModel.getProperty("/Detail/Header"), {
								Holick: vOtWorkTab1.Holick === "X" ? true : false, // 휴일여부
								EntbeW: vOtWorkTab1.EntbeW, // 입출문시간
								ComtmW: vOtWorkTab1.ComtmW, // 근태인정시간
								TottmW: vOtWorkTab1.TottmW, // 총근로시간
								MottmW: vOtWorkTab1.MottmW, // 월누적연장근로시간
								Over20: vOtWorkTab1.Mottm2, // 월누적연장근로시간(신청 총근로시간 포함)
								Otbetm: vOtWorkTab1.Otbetm || "", // 근무시작시간
								Otentm: vOtWorkTab1.Otentm || "", // 근무종료시간
								BrktmHr: vOtWorkTab1.BrktmHr || "00", // 휴게시간-시
								Brkhr1: vOtWorkTab1.Brkhr1 || "00", // 식사시간-시
								Brkhr2: vOtWorkTab1.Brkhr2 || "00", // 웰리스시간-시
								Brkhr3: vOtWorkTab1.Brkhr3 || "00", // 기타시간-시
								BrktmMm: vOtWorkTab1.BrktmMm || "00", // 휴게시간-분
								Brkmm1: vOtWorkTab1.Brkmm1 || "00", // 식사시간-분
								Brkmm2: vOtWorkTab1.Brkmm2 || "00", // 웰리스시간-분
								Brkmm3: vOtWorkTab1.Brkmm3 || "00", // 기타시간-분
								OtbetmT: !Common.checkNull(vOtWorkTab1.Otbetm) ? vOtWorkTab1.Otbetm.substring(0, 2) : "00", // 근무시작시간
								OtbetmM: !Common.checkNull(vOtWorkTab1.Otbetm) ? vOtWorkTab1.Otbetm.substring(2, 4) : "00", // 근무시작시간
								OtentmT: !Common.checkNull(vOtWorkTab1.Otentm) ? vOtWorkTab1.Otentm.substring(0, 2) : "00", // 근무종료시간
								OtentmM: !Common.checkNull(vOtWorkTab1.Otentm) ? vOtWorkTab1.Otentm.substring(2, 4) : "00" // 근무종료시간
							})
						);

						Common.adjustVisibleRowCount($.app.byViewId("PostApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
						this.toggleIsPossibleSave();
					}.bind(this)
				).then(function () {
					$.app.byViewId("PostInputForm").setBusy(false);
				});
			},

			/**
			 * 상세에서 [공통]부서/사원 조직도 Dialog 호출
			 */
			searchOrgehPernrByDetail: function () {
				this.searchOrgehPernr.call(this.oController, function (o) {
					if (o.Otype === "O") {
						MessageBox.warning(this.oController.getBundleText("MSG_32007")); // 사원을 선택하세요.
						return;
					} else if (o.Otype === "P" && o.Zshft === "X") {
						MessageBox.warning(this.oController.getBundleText("MSG_32025")); // 교대근무자는 선택할 수 없습니다.
						return;
					}

					this.oModel.setProperty("/Detail/Header/Pernr", o.Objid);
					this.oModel.setProperty("/Detail/Header/Ename", o.Stext);

					// 기본정보 조회
					this.calculationOverWork("X");
				}.bind(this));
			},

			/**
			 * @brief [공통]부서/사원 조직도 Dialog 호출
			 * 
			 * @this {Handler}
			 */
			searchOrgehPernr: function (callback) {

				setTimeout(function () {
					var initData = {
						Percod: this.getSessionInfoByKey("Percod"),
						Bukrs: this.getSessionInfoByKey("Bukrs2"),
						Langu: this.getSessionInfoByKey("Langu"),
						Molga: this.getSessionInfoByKey("Molga"),
						Datum: new Date(),
						Mssty: "",
						Zshft: true
					};

					this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
					this.EmployeeSearchCallOwner = this.OrgOfIndividualHandler;
					DialogHandler.open(this.OrgOfIndividualHandler);
				}.bind(this), 0);
			},

			getCheckboxTemplate: function (columnInfo) {

				var oCheckBox = new sap.m.CheckBox({
					useEntireWidth: true,
					editable: false,
					selected: {
						path: columnInfo.id,
						formatter: function (v) {
							return v === "X" ? true : false;
						}
					}
				});

				oCheckBox.addEventDelegate({
					onAfterRendering: function () {
						this.toggleStyleClass("plain-text-mimic", !this.getEditable());
					}
				}, oCheckBox);

				return oCheckBox;
			},

			getLinkMimicTemplate: function (columnInfo) {

				return new sap.m.Text({
					textAlign: sap.ui.core.HorizontalAlign.Center,
					text: {
						parts: [{
							path: columnInfo.id
						}, {
							path: "Status1"
						}, {
							path: "UrlA1"
						}],
						formatter: function (v, Status1, UrlA1) {
							this.toggleStyleClass("mimic-link", Status1 !== "AA" && !!UrlA1);
							return v;
						}
					}
				});
			}
		};

		return Handler;
	}
);