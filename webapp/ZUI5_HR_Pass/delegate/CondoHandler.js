/* eslint-disable no-undef */
sap.ui.define(
	[
		"common/Common",
		"./ODataService",
		"sap/m/MessageBox",
		"sap/ui/core/BusyIndicator",
		"sap/ui/model/json/JSONModel"
	],
	function (Common, ODataService, MessageBox, BusyIndicator, JSONModel) {
		"use strict";

		var CondoHandler = {
			
			oController: null,
			oModel: new JSONModel(),
			oDialog: null,

			Model: function () {
				return this.oModel;
			},

			/**
			 * constructor
			 * 	- 최초 생성시 호출
			 * 
			 * @param {object} oController 
			 */
			initialize: function (oController) {
				this.oController = oController;
				this.oModel.setData({
					Bukrs: null,
					Detail: {
						Data: {},
						Confirms: []
					},
					Condos: [],
					Locats: [],
					Zyears: [],
					Zmonths: [],
					MyResvList: [],
					RequestList: [],
					Rooms: []
				});

				return this;
			},

			load: function () {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						this.oModel.setProperty("/Bukrs", this.oController.getSessionInfoByKey("Bukrs"));
						this.oModel.setProperty("/Detail/Data/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
						this.oModel.setProperty("/Condos", ODataService.CondoListSet.call(this.oController));
						this.oModel.setProperty("/Locats", ODataService.CondoLocatListSet.call(this.oController, null));
						this.oModel.setProperty("/Zyears", ODataService.YearRangeList.call(this.oController));
						this.oModel.setProperty("/Zmonths", ODataService.MonthRangeList.call(this.oController));

						this.buildResvMyTable();
						this.buildRequestTable();
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			/**
			 * 검색
			 * 	- 나의예약현황, 이용신청 테이블을 조회
			 */
			search: function () {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						this.buildResvMyTable();
						this.buildRequestTable();
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			buildResvMyTable: function () {
				var results = ODataService.CondoUseRequestSet.call(this.oController);

				this.oModel.setProperty("/MyResvList", results);
				Common.adjustVisibleRowCount($.app.byId(this.oController.PAGEID + "_ResvMyTable"), 5, results.length);
			},

			buildRequestTable: function () {
				var results = ODataService.CondoUseBookTotSet.call(this.oController);

				this.oModel.setProperty("/RequestList", results);
				Common.adjustVisibleRowCount($.app.byId(this.oController.PAGEID + "_RequestTable"), 10, results.length);
			},

			handleDrsChange: function (oEvent) {
				var sFrom = oEvent.getParameter("from"),
					sTo = oEvent.getParameter("to"),
					bValid = oEvent.getParameter("valid"),
					oEventSource = oEvent.getSource(),
					vPerDaySeconds = 1000 * 3600 * 24,
					diff = 0,
					vRangeda = "";

				diff = Math.abs(sTo.getTime() - sFrom.getTime());
				diff = Math.ceil(diff / vPerDaySeconds);

				// 첨단 1박2일 이상 선택 불가
				if (this.oModel.getProperty("/Detail/Data/Compcd") === "T" && diff > 2) {
					MessageBox.show(this.oController.getBundleText("MSG_09013"), { title: this.oController.getBundleText("LABEL_09030") });

					diff = 2;
					sTo = new Date(sFrom.getFullYear(), sFrom.getMonth(), sFrom.getDate() + 1);
					oEvent.getSource().setSecondDateValue(sTo);
				} else if (diff === 1) {
					// 0박1일 - 1박2일
					diff = 2;
					sTo = new Date(sFrom.getFullYear(), sFrom.getMonth(), sFrom.getDate() + 1);
					oEvent.getSource().setSecondDateValue(sTo);
				}

				vRangeda = this.oController.getBundleText("LABEL_09072").interpolate(String(diff - 1), String(diff));	// ${Night}박${Days}일

				this.oModel.setProperty("/Detail/Data/Begda", sFrom);
				this.oModel.setProperty("/Detail/Data/Endda", sTo);
				this.oModel.setProperty("/Detail/Data/Stano", String(diff));
				this.oModel.setProperty("/Detail/Data/Rangeda", vRangeda);

				if (bValid) {
					oEventSource.setValueState(sap.ui.core.ValueState.None);
				} else {
					oEventSource.setValueState(sap.ui.core.ValueState.Error);
				}
			},

			getBasicTechCode: function(Werks) {
				return Werks.charAt(0) === "D" ? "T" : "B";
			},

			setPossibleRangeDate: function() {
				var startDate = this.oModel.getProperty("/Detail/Data/Appbg"),
					endDate = this.oModel.getProperty("/Detail/Data/Appen");

				// 기초,첨단 현재일부터  선택가능
				if(moment(startDate).isAfter(moment())) {
					this.oModel.setProperty("/Detail/Data/minDate", moment(startDate).toDate());
				} else {
					this.oModel.setProperty("/Detail/Data/minDate", moment().toDate());
				}
				this.oModel.setProperty("/Detail/Data/maxDate", moment(endDate).toDate());
			},

			setPossibleRoomCount: function() {
				//  첨단은 객실1개만 활성
				if(this.oModel.getProperty("/Detail/Data/Compcd") === "T") {
					this.oModel.setProperty("/Rooms", [
						{ Code: "01", Text: this.oController.getBundleText("LABEL_09069").interpolate("1")}
					]);
				} else {
					this.oModel.setProperty("/Rooms", [
						{ Code: "01", Text: this.oController.getBundleText("LABEL_09069").interpolate("1")},
						{ Code: "02", Text: this.oController.getBundleText("LABEL_09069").interpolate("2")}
					]);
				}
			},

			onPressCondoModifyRowBtn: function (oEvent) {
				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {},
					oDetailData = {};

				if (!this.oDialog) {
					this.oDialog = sap.ui.jsfragment("ZUI5_HR_Pass.fragment.CondoDetail", this.oController);
					$.app.getView().addDependent(this.oDialog);
				}

				// Set dialog height
				this.oDialog.setContentHeight("650px");

				// Set data
				oDetailData = $.extend(true, {}, oRowData);
				oDetailData.Compcd = this.getBasicTechCode(oRowData.Werks);
				oDetailData.Usepn = String(parseInt(oRowData.Usepn, 10));
				oDetailData.Rangeda = "${Night}박${Days}일".interpolate(parseInt(oRowData.Stano, 10), parseInt(oRowData.Stano, 10) + 1);

				// Display control
				oDetailData.isNew = false;

				this.oModel.setProperty("/Detail/Data", oDetailData);

				// 확정현황
				this.getCondoConfirmListData.call(this);

				this.oDialog.open();
			},

			getCondoConfirmListData: function () {
				var results = ODataService.CondoBookingListSet.call(this.oController, this.oModel.getProperty("/Detail/Data"));

				this.oModel.setProperty("/Detail/Confirms", results.list);
				Common.adjustVisibleRowCount($.app.byId(this.oController.PAGEID + "_CondoConfirmTable"), 5, results.list.length);
			},

			onPressCondoCreateBtn: function (oEvent) {
				var oView = $.app.getView(),
					vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {},
					oDetailData = {};

				if (!this.oDialog) {
					this.oDialog = sap.ui.jsfragment("ZUI5_HR_Pass.fragment.CondoDetail", this.oController);
					oView.addDependent(this.oDialog);
				}

				// Set dialog height
				this.oDialog.setContentHeight("460px");

				// Set data
				oDetailData = $.extend(true, {}, oRowData);
				oDetailData.Compcd = this.getBasicTechCode(oRowData.Werks);
				oDetailData.Appbg = oDetailData.Begda;
				oDetailData.Appen = oDetailData.Endda;
				oDetailData.Romno = "01";
				delete oDetailData.Begda;
				delete oDetailData.Endda;
				delete oDetailData.Usepn;

				// Display control
				oDetailData.isNew = true;

				this.oModel.setProperty("/Detail/Data", oDetailData);

				this.oDialog.open();
			},

			onBeforeCondoDetail: function () {
				// 입/퇴실 가능일자 Set
				this.setPossibleRangeDate();
				
				// 선택가능 객실 수 Set
				this.setPossibleRoomCount();
			},

			openUri: function() {
				var url = this.oModel.getProperty("/Detail/Data/UsridLong");
				if(!url) return;

				if(url.toLowerCase().indexOf("http") < 0) url = "http://" + url;

                setTimeout(function() {
                    var width = 1000, height = screen.availHeight * 0.9,
                    left = (screen.availWidth - width) / 2,
                    top = (screen.availHeight - height) / 2,
                    popup = window.open(url, "condo-info-popup", [
                        "width=" + width,
                        "height=" + height,
                        "left=" + left,
                        "top=" + top,
                        "status=yes,resizable=yes,scrollbars=yes"
                    ].join(","));

                    setTimeout(function() {
                        popup.focus();
                    }, 500);
                }, 0);
			},

			DetailProcessValidation: function (detailData) {
				if (!detailData.Begda || !detailData.Endda) {
					MessageBox.error(this.oController.getBundleText("MSG_09010"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				}

				if (!detailData.Romno) {
					MessageBox.error(this.oController.getBundleText("MSG_09011"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				}

				if (!detailData.Usepn) {
					MessageBox.error(this.oController.getBundleText("MSG_09012"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				}

				if (!detailData.Comnr) {
					MessageBox.error(this.oController.getBundleText("MSG_09003"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				} else {
					if (!Common.RuleCellphone(detailData.Comnr)) {
						MessageBox.error(this.oController.getBundleText("MSG_09008"), {
							title: this.oController.getBundleText("LABEL_09030")
						});
						return false;
					}
				}

				return true;
			},

			ProcessAfterNavigation: function() {
				if(this.oDialog && this.oDialog.isOpen()) this.oDialog.close();
				this.search.call(this);
			},

			ProcessOnSuccess: function(conType, data) {
				
				var successMessage = "";
				switch(conType) {
					case $.app.ConType.UPDATE:
						successMessage = this.oController.getBundleText("MSG_09005");
						break;
					case $.app.ConType.CREATE:
						successMessage = this.oController.getBundleText("MSG_09001");
						break;
					case $.app.ConType.DELETE:
						successMessage = this.oController.getBundleText("MSG_09007");
						break;
					default:
						break;
				}

				if (data) {
					MessageBox.success(successMessage, {
						title: this.oController.getBundleText("LABEL_09029"),
						onClose: function () {
							this.ProcessAfterNavigation.call(this);
						}.bind(this)
					});
				}

				BusyIndicator.hide();
			},

			ProcessOnFail: function(res) {
				var errData = Common.parseError(res);
				if (errData.Error && errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: this.oController.getBundleText("LABEL_09029")
					});
				}

				BusyIndicator.hide();
			},

			onPressCondoModifyCompleteBtn: function () {
				var oInputData = this.oModel.getProperty("/Detail/Data");

				if (!this.DetailProcessValidation.bind(this)(oInputData)) return;

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					// Set Begda, Endda
					var vBegdaDT = new Date(oInputData.Begda.getFullYear(), oInputData.Begda.getMonth(), oInputData.Begda.getDate(), 9);
					var vEnddaDT = new Date(oInputData.Endda.getFullYear(), oInputData.Endda.getMonth(), oInputData.Endda.getDate(), 9);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "CondoUseRequestIt", oInputData);
					sendData.Pernr = this.oController.getSessionInfoByKey("name");
					sendData.Begda = Common.adjustGMTOdataFormat(vBegdaDT);
					sendData.Endda = Common.adjustGMTOdataFormat(vEnddaDT);
					sendData.Appbg = Common.adjustGMTOdataFormat(oInputData.Appbg);
					sendData.Appen = Common.adjustGMTOdataFormat(oInputData.Appen);

					ODataService.CondoUseRequestSetByProcess.call(this.oController, $.app.ConType.UPDATE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09017"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			onPressCondoRequestCompleteBtn: function () {
				var oInputData = this.oModel.getProperty("/Detail/Data");

				if (!this.DetailProcessValidation.bind(this)(oInputData)) return;

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					// Set Begda, Endda
					var vBegdaDT = new Date(oInputData.Begda.getFullYear(), oInputData.Begda.getMonth(), oInputData.Begda.getDate(), 9);
					var vEnddaDT = new Date(oInputData.Endda.getFullYear(), oInputData.Endda.getMonth(), oInputData.Endda.getDate(), 9);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "CondoUseRequestIt", oInputData);
					sendData.Pernr = this.oController.getSessionInfoByKey("name");
					sendData.Begda = Common.adjustGMTOdataFormat(vBegdaDT);
					sendData.Endda = Common.adjustGMTOdataFormat(vEnddaDT);
					sendData.Appbg = Common.adjustGMTOdataFormat(oInputData.Appbg);
					sendData.Appen = Common.adjustGMTOdataFormat(oInputData.Appen);

					ODataService.CondoUseRequestSetByProcess.call(this.oController, $.app.ConType.CREATE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09016"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			onPressCondoCancleRowBtn: function (oEvent) {
				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {};

				this.CondoDeleteProcess(oRowData);
			},

			CondoDeleteProcess: function(detailData) {
				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "CondoUseRequestIt", detailData);

					ODataService.CondoUseRequestSetByProcess.call(this.oController, $.app.ConType.DELETE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09006"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			getDateRangeText: function () {
				return new sap.ui.commons.TextView({
					text: {
						parts: [{ path: "Begda" }, { path: "Endda" }],
						formatter: function (v1, v2) {
							if (!v1 || !v2) {
								return "";
							}

							return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
						}
					},
					textAlign: "Center"
				}).addStyleClass("FontFamily");
			},

			getRomnoConvertNumber: function () {
				return new sap.ui.commons.TextView({
					text: {
						path: "Romno",
						formatter: function (v) {
							if (!v) {
								return "";
							}

							return String(parseInt(v, 10));
						}
					},
					textAlign: "Center"
				}).addStyleClass("FontFamily");
			},

			getCondoProcessButtons: function (columnInfo, oController) {
				var CondoHandler = oController.CondoHandler;

				return new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.m.Button({
							press: CondoHandler.onPressCondoModifyRowBtn.bind(CondoHandler),
							text: "{i18n>LABEL_09008}" // 수정
						}).addStyleClass("button-light-sm"),
						new sap.m.Button({
							press: CondoHandler.onPressCondoCancleRowBtn.bind(CondoHandler),
							text: "{i18n>LABEL_09009}" // 취소
						}).addStyleClass("button-light-sm ml-10px")
					],
					visible: {
						path: "Statu",
						formatter: function (v) {
							if (v === "W") {
								return true;
							} else {
								return false;
							}
						}
					}
				});
			},

			getCondoRequestButton: function (columnInfo, oController) {
				var CondoHandler = oController.CondoHandler;

				return new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.m.Button({
							press: CondoHandler.onPressCondoCreateBtn.bind(CondoHandler),
							text: "{i18n>LABEL_09054}" // 신청
						}).addStyleClass("button-light-sm")
					]
				});
			},

			getCondoDetailTitle: function () {
				return new sap.m.Text({
					text: {
						parts: [{ path: "Contx" }, { path: "Loctx" }, { path: "Seasn" }],
						formatter: function (v1, v2, v3) {
							if (v3 === "S") {
								this.toggleStyleClass("color-signature-blue", false);
								this.toggleStyleClass("color-signature-red", true);
							} else {
								this.toggleStyleClass("color-signature-red", false);
								this.toggleStyleClass("color-signature-blue", true);
							}

							return [v1, "(", v2, ")"].join("");
						}
					},
					textAlign: "Center"
				}).addStyleClass("FontFamily");
			}
		};

		return CondoHandler;
	}
);
