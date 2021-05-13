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

		var FacilityHandler = {
			
			oController: null,
			oModel: new JSONModel(),
			oDialog: null,

			Model: function () {
				return this.oModel;
			},

			initialize: function (oController) {
				this.oController = oController;
				this.oModel.setData({
					SearchConditions: {
						Zyear: "",
						Facty: ""
					},
					Detail: {},
					Zyears: [],
					Factys: [],
					MyList: [],
					RequestList: []
				});

				return this;
			},

			search: function () {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						this.buildMyApprTable();
						this.buildRequestTable();
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			load: function () {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						var vFactys = ODataService.CommonCodeListHeaderSet.call(this.oController);

						this.oModel.setProperty("/SearchConditions", {
							Zyear: new Date().getFullYear(),
							Facty: vFactys[0].Code || ""
						});
						this.oModel.setProperty("/Zyears", ODataService.YearRangeList.call(this.oController));
						this.oModel.setProperty("/Factys", vFactys.slice(0, 1));

						this.buildMyApprTable();
						this.buildRequestTable();
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			buildMyApprTable: function () {
				var results = ODataService.FacilityApplySet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

				this.oModel.setProperty("/MyList", results);
				Common.adjustVisibleRowCount($.app.byId(this.oController.PAGEID + "_RequestMyTable"), 3, results.length);
			},

			buildRequestTable: function () {
				var results = ODataService.FacilityListSet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

				this.oModel.setProperty("/RequestList", results);
				Common.adjustVisibleRowCount($.app.byId(this.oController.PAGEID + "_RequestFacTable"), 6, results.length);
			},

			onPressRowModifyDialog: function (oEvent) {
				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {},
					oDetailData = {};

				if (!this.oDialog) {
					this.oDialog = sap.ui.jsfragment("ZUI5_HR_Pass.fragment.FacilityDetail", this.oController);
					$.app.getView().addDependent(this.oDialog);
				}

				// Set dialog height
				this.oDialog.setContentHeight("460px");

				// Set data
				oDetailData = $.extend(true, {}, oRowData);

				// Display control
				oDetailData.isNew = false;

				this.oModel.setProperty("/Detail", oDetailData);
				this.oDialog.open();
			},

			onPressRowRequest: function (oEvent) {
				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {},
					oDetailData = {};

				if (!this.oDialog) {
					this.oDialog = sap.ui.jsfragment("ZUI5_HR_Pass.fragment.FacilityDetail", this.oController);
					$.app.getView().addDependent(this.oDialog);
				}

				// Set dialog height
				this.oDialog.setContentHeight("330px");

				// Set data
				oDetailData = $.extend(true, {}, oRowData);
				delete oDetailData.Reqno;
				delete oDetailData.Cellp;
				delete oDetailData.Email;
				delete oDetailData.Zbigo;

				// Display control
				oDetailData.isNew = true;

				this.oModel.setProperty("/Detail", oDetailData);
				this.oDialog.open();
			},

			DetailProcessValidation: function (detailData) {
				if (!detailData.Reqno || detailData.Reqno === "0") {
					MessageBox.error(this.oController.getBundleText("MSG_09002"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				}

				if (!detailData.Cellp) {
					MessageBox.error(this.oController.getBundleText("MSG_09003"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				} else {
					if (!Common.RuleCellphone(detailData.Cellp)) {
						MessageBox.error(this.oController.getBundleText("MSG_09008"), {
							title: this.oController.getBundleText("LABEL_09030")
						});
						return false;
					}
				}

				if (!detailData.Email) {
					MessageBox.error(this.oController.getBundleText("MSG_09004"), { title: this.oController.getBundleText("LABEL_09030") });
					return false;
				} else {
					if (!Common.RuleEmail(detailData.Email)) {
						MessageBox.error(this.oController.getBundleText("MSG_09009"), {
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

			onPressApprovalBtn: function () {
				var oInputData = this.oModel.getProperty("/Detail");

				if (!this.DetailProcessValidation.bind(this)(oInputData)) return;

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "FacilityApplyTableIn", oInputData);
					sendData.Pernr = this.oController.getSessionInfoByKey("name");
					sendData.Bukrs = "1000";
					sendData.Usday = moment(oInputData.Usday).hours(10).toDate();
					sendData.Begda = sendData.Usday;

					ODataService.FacilityApplySetByProcess.call(this.oController, $.app.ConType.CREATE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09016"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			onPressSaveBtn: function () {
				var oInputData = this.oModel.getProperty("/Detail");

				if (!this.DetailProcessValidation.bind(this)(oInputData)) return;

				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "FacilityApplyTableIn", oInputData);

					ODataService.FacilityApplySetByProcess.call(this.oController, $.app.ConType.UPDATE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09017"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			onPressRowCancle: function (oEvent) {
				var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
					oRowData = this.oModel.getProperty(vSpath) || {};

				this.FacilityDeleteProcess(oRowData);
			},

			FacilityDeleteProcess: function(detailData) {
				var Process = function (fVal) {
					if (!fVal || fVal === MessageBox.Action.NO) return;

					BusyIndicator.show(0);

					var sendData = Common.copyByMetadata($.app.getModel("ZHR_BENEFIT_SRV"), "FacilityApplyTableIn", detailData);

					ODataService.FacilityApplySetByProcess.call(this.oController, $.app.ConType.DELETE, sendData, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
				};

				MessageBox.show(this.oController.getBundleText("MSG_09006"), {
					title: this.oController.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: Process.bind(this)
				});
			},

			getProcessButtons: function (columnInfo, oController) {
				var FacilityHandler = oController.FacilityHandler;

				return new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.m.Button({
							press: FacilityHandler.onPressRowModifyDialog.bind(FacilityHandler),
							text: "{i18n>LABEL_09008}" // 수정
						}).addStyleClass("button-light-sm"),
						new sap.m.Button({
							press: FacilityHandler.onPressRowCancle.bind(FacilityHandler),
							text: "{i18n>LABEL_09009}" // 취소
						}).addStyleClass("button-light-sm ml-10px")
					],
					visible: {
						path: "Revcn",
						formatter: function (v) {
							if (v === "X") {
								return true;
							} else {
								return false;
							}
						}
					}
				});
			},

			getRequestButton: function (columnInfo, oController) {
				var FacilityHandler = oController.FacilityHandler;

				return new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.m.Button({
							press: FacilityHandler.onPressRowRequest.bind(FacilityHandler),
							text: "{i18n>LABEL_09023}" // 신청
						}).addStyleClass("button-light-sm")
					]
				});
			}
		};

		return FacilityHandler;
	}
);
