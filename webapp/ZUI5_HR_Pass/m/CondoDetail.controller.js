sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "CondoDetail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "CondoDetail",

			_CondoDetailJSonModel: new JSONModelHelper(),

			getCondoHandler: function () {
				if (!this.CondoHandler) 
					this.CondoHandler = $.app.getController().CondoHandler;

				return this.CondoHandler;
			},

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow
					}, this);
			},

			onBeforeShow: function () {
				// 입/퇴실 가능일자 Set
				this.CondoHandler.setPossibleRangeDate.call(this.CondoHandler);
				
				// 선택가능 객실 수 Set
				this.CondoHandler.setPossibleRoomCount.call(this.CondoHandler);
			},

			onPressCondoRequestCompleteBtn: function () {
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV"),
					vPernr = this.getUserId(),
					oInputData = this._CondoDetailJSonModel.getData().Data,
					oPaylod = {},
					oCopiedIt = {},
					errData = {},
					vBegdaDT,
					vEnddaDT;

				if (!oInputData.Begda || !oInputData.Endda) {
					MessageBox.error(this.getBundleText("MSG_09010"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Romno) {
					MessageBox.error(this.getBundleText("MSG_09011"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Usepn) {
					MessageBox.error(this.getBundleText("MSG_09012"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Comnr) {
					MessageBox.error(this.getBundleText("MSG_09003"), { title: this.getBundleText("LABEL_09030") });
					return false;
				} else {
					if (!Common.RuleCellphone(oInputData.Comnr)) {
						MessageBox.error(this.getBundleText("MSG_09008"), { title: this.getBundleText("LABEL_09030") });
						return false;
					}
				}

				BusyIndicator.show(0);

				// Set Begda, Endda
				vBegdaDT = new Date(oInputData.Begda.getFullYear(), oInputData.Begda.getMonth(), oInputData.Begda.getDate(), 9);
				vEnddaDT = new Date(oInputData.Endda.getFullYear(), oInputData.Endda.getMonth(), oInputData.Endda.getDate(), 9);

				// Set header data
				oPaylod.IOdkey = "";
				oPaylod.IConType = $.app.ConType.CREATE;
				oPaylod.IPernr = vPernr;
				oPaylod.ILangu = "3";
				oPaylod.IBegda = Common.adjustGMTOdataFormat(vBegdaDT);
				oPaylod.IEndda = Common.adjustGMTOdataFormat(vEnddaDT);

				// Set navigation data
				oCopiedIt = Common.copyByMetadata(oModel, "CondoUseRequestIt", oInputData);
				oCopiedIt.Pernr = vPernr;
				oCopiedIt.Begda = Common.adjustGMTOdataFormat(vBegdaDT);
				oCopiedIt.Endda = Common.adjustGMTOdataFormat(vEnddaDT);
				oCopiedIt.Appbg = Common.adjustGMTOdataFormat(oInputData.Appbg);
				oCopiedIt.Appen = Common.adjustGMTOdataFormat(oInputData.Appen);

				oPaylod.It = [];
				oPaylod.It.push(oCopiedIt);

				oModel.create("/CondoUseRequestSet", oPaylod, {
					async: true,
					success: function (data) {
						if (data) {
							MessageBox.success(this.getBundleText("MSG_09001"), {
								title: this.getBundleText("LABEL_09029"),
								onClose: function () {
									this.navBack(true);
								}.bind(this)
							});
						}

						BusyIndicator.hide();
					}.bind(this),
					error: function (res) {
						errData = Common.parseError(res);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								title: this.getBundleText("LABEL_09029")
							});
						}

						BusyIndicator.hide();
					}.bind(this)
				});

				return true;
			},

			onPressCondoRequestUpdateBtn: function() {
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV"),
					vPernr = this.getUserId(),
					oInputData = this._CondoDetailJSonModel.getProperty("/Data"),
					oPaylod = {},
					oCopiedIt = {},
					errData = {},
					vBegdaDT,
					vEnddaDT;

				if (!oInputData.Begda || !oInputData.Endda) {
					MessageBox.error(this.getBundleText("MSG_09010"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Romno) {
					MessageBox.error(this.getBundleText("MSG_09011"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Usepn) {
					MessageBox.error(this.getBundleText("MSG_09012"), { title: this.getBundleText("LABEL_09030") });
					return false;
				}

				if (!oInputData.Comnr) {
					MessageBox.error(this.getBundleText("MSG_09003"), { title: this.getBundleText("LABEL_09030") });
					return false;
				} else {
					if (!Common.RuleCellphone(oInputData.Comnr)) {
						MessageBox.error(this.getBundleText("MSG_09008"), { title: this.getBundleText("LABEL_09030") });
						return false;
					}
				}

				BusyIndicator.show(0);

				// Set Begda, Endda
				vBegdaDT = new Date(oInputData.Begda.getFullYear(), oInputData.Begda.getMonth(), oInputData.Begda.getDate(), 9);
				vEnddaDT = new Date(oInputData.Endda.getFullYear(), oInputData.Endda.getMonth(), oInputData.Endda.getDate(), 9);

				// Set header data
				oPaylod.IOdkey = "";
				oPaylod.IConType = $.app.ConType.UPDATE;
				oPaylod.IPernr = vPernr;
				oPaylod.ILangu = "3";

				// Set navigation data
				oCopiedIt = Common.copyByMetadata(oModel, "CondoUseRequestIt", oInputData);
				oCopiedIt.Pernr = vPernr;
				oCopiedIt.Begda = Common.adjustGMTOdataFormat(vBegdaDT);
				oCopiedIt.Endda = Common.adjustGMTOdataFormat(vEnddaDT);
				oCopiedIt.Appbg = Common.adjustGMTOdataFormat(oInputData.Appbg);
				oCopiedIt.Appen = Common.adjustGMTOdataFormat(oInputData.Appen);

				oPaylod.It = [];
				oPaylod.It.push(oCopiedIt);

				oModel.create("/CondoUseRequestSet", oPaylod, {
					async: true,
					success: function (data) {
						if (data) {
							MessageBox.success(this.getBundleText("MSG_09005"), {
								title: this.getBundleText("LABEL_09029"),
								onClose: function () {
									this.navBack(true);
								}.bind(this)
							});
						}

						BusyIndicator.hide();
					}.bind(this),
					error: function (res) {
						errData = Common.parseError(res);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								title: this.getBundleText("LABEL_09029")
							});
						}

						BusyIndicator.hide();
					}.bind(this)
				});

				return true;
			},

			onPressCondoRequestCancelBtn: function() {
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV"),
					oInputData = this._CondoDetailJSonModel.getProperty("/Data"),
					oCopiedIt = Common.copyByMetadata(oModel, "CondoUseRequestIt", oInputData),
					vPernr = this.getUserId(),
					oPaylod = {},
					errData = {};

				var DeleteProcess = function (fVal) {
					if (fVal && fVal === MessageBox.Action.YES) {
						BusyIndicator.show(0);

						// Set header data
						oPaylod.IOdkey = "";
						oPaylod.IConType = $.app.ConType.DELETE;
						oPaylod.ILangu = "3";
						oPaylod.IPernr = vPernr;

						// Set navigation data
						oPaylod.It = [];
						oPaylod.It.push(oCopiedIt);

						oModel.create("/CondoUseRequestSet", oPaylod, {
							async: true,
							success: function (data) {
								if (data) {
									MessageBox.success(this.getBundleText("MSG_09007"), {
										title: this.getBundleText("LABEL_09029"),
										onClose: function () {
											this.navBack(true);
										}.bind(this)
									});
								}

								BusyIndicator.hide();
							}.bind(this),
							error: function (res) {
								errData = Common.parseError(res);
								if (errData.Error && errData.Error === "E") {
									MessageBox.error(errData.ErrorMessage, {
										title: this.getBundleText("LABEL_09029")
									});
								}

								BusyIndicator.hide();
							}.bind(this)
						});
					}
				};

				MessageBox.show(this.getBundleText("MSG_09006"), {
					title: this.getBundleText("LABEL_09030"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: DeleteProcess.bind(this)
				});
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);