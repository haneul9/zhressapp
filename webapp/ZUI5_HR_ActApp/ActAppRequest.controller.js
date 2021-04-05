sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"ZUI5_HR_ActApp/fragment/AttachFileAction",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, ActAttachFileAction, JSONModel, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppRequest"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActAppRequest",

			_vStatu: "",
			_vPersa: "",
			_vReqno: "",
			_vDocno: "",
			_vDocty: "",
			_vActda: "",
			_oContext: null,

			_vFromPageId: "",

			_PreviewDialog: null,
			_NoticeDialog: null,

			_fUpdateFlag: false,
			
			onInit: function () {
				this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow
                    }, this);
			},

			onBeforeShow: function (oEvent) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

				if (oEvent) {
					this._vStatu = oEvent.data.Statu;
					this._vReqno = oEvent.data.Reqno;
					this._vDocno = oEvent.data.Docno;
					this._vDocty = oEvent.data.Docty;
					this._vPersa = oEvent.data.Persa;
					this._vActda = oEvent.data.Actda;
					this._oContext = oEvent.data.context;

					this._vFromPageId = oEvent.data.FromPageId;

					var oOrgeh = $.app.byId(this.PAGEID + "_Orgeh");
					var oReqno = $.app.byId(this.PAGEID + "_Reqno");
					var oTitle = $.app.byId(this.PAGEID + "_Title");
					var oReqda = $.app.byId(this.PAGEID + "_Reqda");

					var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

					oReqno.setText(mActionReqList.getProperty(this._oContext + "/Reqno"));
					oTitle.setText(mActionReqList.getProperty(this._oContext + "/Title"));

					oOrgeh.setText(mActionReqList.getProperty(this._oContext + "/Reqdp"));
					oReqda.setText(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Reqda")));

					this.setAddInfoSort(this);

					this.setAppGrouping(this);

					ActAttachFileAction.oController = this;

					ActAttachFileAction.setAttachFile(this);

					ActAttachFileAction.refreshAttachFileList(this);

					this._fUpdateFlag = false;
				}
			},

			setAddInfoSort: function (oController) {
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var oNotet = $.app.byId(this.PAGEID + "_Notet");
				var oNoteb = $.app.byId(this.PAGEID + "_Noteb");

				var sPath = oModel.createKey("/ActionAppContentsSet", {
					Persa: oController._vPersa,
					Docno: oController._vDocno
				});

				oModel.read(sPath, {
					async: false,
					success: function (oData) {
						if (oData) {
							oNotet.setValue(oData.Notet);
							oNoteb.setValue(oData.Noteb);
							for (var i = 1; i < 5; i++) {
								var oSrtf = $.app.byId(oController.PAGEID + "_Srtf" + i);
								var oSrtt = $.app.byId(oController.PAGEID + "_Srtt" + i);
								if (oSrtf) oSrtf.setSelectedKey(oData["Srtf" + i]);
								if (oSrtt) oSrtt.setSelectedKey(oData["Srtt" + i]);
							}
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});
			},

			setAppGrouping: function (oController) {
				var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
				var vActionAppGrouping = { ActionAppGroupingSet: [] };

				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionAppGroupingSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno),
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
					],
					success: function (oData) {
						if (oData.results && oData.results.length) {
							for (var i = 0; i < oData.results.length; i++) {
								var oneData = {};

								oneData.Persa = oData.results[i].Persa;
								oneData.Reqno = oData.results[i].Reqno;
								oneData.Docno = oData.results[i].Docno;
								oneData.Actin = oData.results[i].Actin;
								oneData.Acttx = oData.results[i].Acttx;
								oneData.Grpn1 = parseInt(oData.results[i].Grpn1);
								oneData.Grpn2 = parseInt(oData.results[i].Grpn2);
								oneData.Grpt1 = oData.results[i].Grpt1;
								oneData.Grpt2 = oData.results[i].Grpt2;

								if (oData.results[i].Farea == "X") oneData.Farea = true;
								else oneData.Farea = false;
								if (oData.results[i].Posgr == "X") oneData.Posgr = true;
								else oneData.Posgr = false;

								if (oneData.Grpt1 != "") oneData.Grpt1E = true;
								else oneData.Grpt1E = false;
								vActionAppGrouping.ActionAppGroupingSet.push(oneData);
							}
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});

				mActionAppGrouping.setData(vActionAppGrouping);
			},

			navToBack: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: oController._vFromPageId,
						data: {
							context: oController._oContext,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty
						}
					});
			},

			onPressSave: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var updateData_AddInfoSort = {};
				var UpdateData_Grouping = [];
				var oNotet = $.app.byId(oController.PAGEID + "_Notet");
				var oNoteb = $.app.byId(oController.PAGEID + "_Noteb");

				updateData_AddInfoSort.Persa = oController._vPersa;
				updateData_AddInfoSort.Reqno = oController._vReqno;
				updateData_AddInfoSort.Docno = oController._vDocno;

				oNotet.setValueState(sap.ui.core.ValueState.None);

				if (oNotet.getValue() == "") {
					oNotet.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02066"));
					return false;
				}

				var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
				var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");
				if (vActionAppGrouping && vActionAppGrouping.length) {
					for (var i = 0; i < vActionAppGrouping.length; i++) {
						var OneData_Grouping = {};

						OneData_Grouping.Persa = vActionAppGrouping[i].Persa;
						OneData_Grouping.Reqno = vActionAppGrouping[i].Reqno;
						OneData_Grouping.Docno = vActionAppGrouping[i].Docno;
						OneData_Grouping.Actin = vActionAppGrouping[i].Actin;
						OneData_Grouping.Acttx = vActionAppGrouping[i].Acttx;

						if (vActionAppGrouping[i].Grpn1 == "" || vActionAppGrouping[i].Grpn1 == "0000") {
							MessageBox.alert(i + 1 + oController.getBundleText("MSG_02017"));
							return false;
						} //Grpt1

						if (vActionAppGrouping[i].Grpt1E == true && vActionAppGrouping[i].Grpt1 == "") {
							MessageBox.alert(
								oController.getBundleText("MSG_02018").replace("$NO$", i + 1)
							);
							return false;
						}

						OneData_Grouping.Grpn1 = "" + vActionAppGrouping[i].Grpn1;
						if (vActionAppGrouping[i].Grpn2 == "0000" || vActionAppGrouping[i].Grpn2 == "") {
							OneData_Grouping.Grpn2 = "";
						} else {
							OneData_Grouping.Grpn2 = "" + vActionAppGrouping[i].Grpn2;
						}

						OneData_Grouping.Grpt1 = vActionAppGrouping[i].Grpt1;
						OneData_Grouping.Grpt2 = vActionAppGrouping[i].Grpt2;

						if (vActionAppGrouping[i].Farea == true) {
							OneData_Grouping.Farea = "X";
						} else {
							OneData_Grouping.Farea = "";
						}
						if (vActionAppGrouping[i].Posgr == true) {
							OneData_Grouping.Posgr = "X";
						} else {
							OneData_Grouping.Posgr = "";
						}

						UpdateData_Grouping.push(OneData_Grouping);
					}
				}

				updateData_AddInfoSort.Notet = oNotet.getValue();
				updateData_AddInfoSort.Noteb = oNoteb.getValue();

				for (var j = 1; j < 5; j++) {
					var oSrtf = $.app.byId(oController.PAGEID + "_Srtf" + j);
					var oSrtt = $.app.byId(oController.PAGEID + "_Srtt" + j);
					if (oSrtf) {
						if (oSrtf.getSelectedKey() != "0000")
							updateData_AddInfoSort["Srtf" + j] = oSrtf.getSelectedKey();
						else 
							updateData_AddInfoSort["Srtf" + j] = '';
					}

					if (oSrtt) {
						if (oSrtt.getSelectedKey() != "0000")
							updateData_AddInfoSort["Srtt" + j] = oSrtt.getSelectedKey();
						else
							updateData_AddInfoSort["Srtt" + j] = '';
					}
				}

				var process_result = false;

				try {
					var sPath = oModel.createKey("/ActionAppContentsSet", {
						Persa: oController._vPersa,
						Docno: oController._vDocno
					});

					oModel.update(sPath, updateData_AddInfoSort, {
						success: function () {
							process_result = true;
							Common.log("Sucess ActionAppContentsSet Update !!!");
						},
						error: function (oError) {
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								Common.showErrorMessage(oError);
							}
							process_result = false;
						}
					});

					if (!process_result) {
						return false;
					}

					if (UpdateData_Grouping && UpdateData_Grouping.length) {
						for (var k = 0; k < UpdateData_Grouping.length; k++) {
							sPath = oModel.createKey("/ActionAppGroupingSet", {
								Docno: UpdateData_Grouping[k].Docno,
								Actin: UpdateData_Grouping[k].Actin
							});

							oModel.update(sPath, UpdateData_Grouping[k], {
								success: function () {
									process_result = true;
									Common.log("Sucess ActionAppGroupingSet Create !!!");
								},
								error: function (oError) {
									var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(oError);
									}
									process_result = false;
								}
							});

							if (!process_result) {
								return false;
							}
						}
					}
				} catch (ex) {
					process_result = false;
					Common.log(ex);
				}

				if (!process_result) {
					return false;
				}

				if (oEvent != null) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093")
					});
				}

				oNotet.setValueState(sap.ui.core.ValueState.None);
				oController._fUpdateFlag = false;

				return true;
			},

			onPressPreview: function () {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				if (!oController.onPressSave()) {
					return;
				}

				if (!oController._PreviewDialog) {
					oController._PreviewDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionAppPreview", oController);
					oView.addDependent(oController._PreviewDialog);
				}
				oController._PreviewDialog.open();
			},

			getNoticeCheck: function (oController) {
				if (oController._vPersa != "7700") return false;

				var vOrgehs = [
					oController.getBundleText("LABEL_02351"), 
					oController.getBundleText("LABEL_02352"), 
					oController.getBundleText("LABEL_02353"), 
					oController.getBundleText("LABEL_02354")
				];

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");

				var fNotice = false;

				for (var i = 0; i < vActionSubjectList.length; i++) {
					if (vActionSubjectList[i].Batyp != "A") continue;

					//발령유형이 채용/이동 인 경우에만 적용
					var fMassn = false;
					for (var j = 1; j <= 5; j++) {
						var tmp = vActionSubjectList[i]["Massn" + j];
						if (tmp == "10" || tmp == "50") {
							fMassn = true;
							break;
						}
					}

					//발령품의서 종류에 따라 소속명 항목을 가져온다.
					var vOrgeh_Tx = "";
					if (oController._vDocty == "20") {
						vOrgeh_Tx = vActionSubjectList[i].Orgeh_Tx;
					} else {
						vOrgeh_Tx = vActionSubjectList[i].A_Orgeh_Tx;
					}

					var fOrgeh = false;
					for (var k = 0; k < vOrgehs.length; k++) {
						if (vOrgeh_Tx.toUpperCase().search(vOrgehs[k]) > 0) {
							fOrgeh = true;
							break;
						}
					}

					if (fMassn && fOrgeh) {
						fNotice = true;
						break;
					}
				}

				return fNotice;
			},

			onPressRequest: function (oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				if (!oController.onPressSave()) {
					return;
				}

				if (oController.getNoticeCheck(oController)) {
					if (!oController._NoticeDialog) {
						oController._NoticeDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.Notice1Dialog", oController);
						oView.addDependent(oController._NoticeDialog);
					}
					oController._NoticeDialog.open();
				} else {
					oController.onProcessRequest(oEvent);
				}
			},

			onProcessRequest: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var updateData = {};

				updateData.Persa = oController._vPersa;
				updateData.Reqno = oController._vReqno;
				updateData.Docno = oController._vDocno;
				updateData.ApprvX = "X";

				var process_result = false;

				BusyIndicator.show(0);

				var updateProcess = function () {
					try {
						var sPath = oModel.createKey("/ActionReqListSet", {
							Docno: oController._vDocno
						});

						oModel.update(sPath, updateData, {
							success: function () {
								process_result = true;
								Common.log("Sucess ActionReqListSet Update !!!");
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						if (!process_result) {
							BusyIndicator.hide();
							return;
						}

						var vDocUri = "";

						oModel.read(sPath, {
							async: false,
							success: function (oData) {
								if (oData) vDocUri = oData.Uri;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						if (!process_result) {
							BusyIndicator.hide();
							return;
						}

						//vDocUri = "SettleDoc.html";
						if (vDocUri != "") {
							//결재자 지정 Window를 open 한다.
							var newwindow = window.open(vDocUri, "SettleDoc", "height=500,width=850");
							if (window.focus) {
								newwindow.focus();
							}

							newwindow.onbeforeunload = function () {
								MessageBox.alert(oController.getBundleText("MSG_02068"), {
									title: oController.getBundleText("LABEL_02093"),
									onClose: function () {}
								});
							};
						}

						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: "ZUI5_HR_ActApp.ActAppMain",
							data: {}
						});
					} catch (Ex) {
						Common.log(Ex);
					} finally {
						BusyIndicator.hide();
					}
				};

				setTimeout(updateProcess, 300);
			},

			onChangeData: function () {
				$.app.getController(SUB_APP_ID)._fUpdateFlag = true;
			},

			onChangeGrpn1: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vKey = oEvent.getSource().getSelectedKey();
				var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
				var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");
				
				oController._fUpdateFlag = true;

				if (vKey != "0000" && vKey != "") {
					var vTmpGrpn1 = [];
					for (var i = 0; i < vActionAppGrouping.length; i++) {
						var vrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + i + "/Grpn1");
						var isExists = false;
						for (var j = 0; j < vTmpGrpn1.length; j++) {
							if (vTmpGrpn1[j] == vrpn1) {
								isExists = true;
								break;
							}
						}
						if (!isExists) {
							vTmpGrpn1.push(vrpn1);
						}
					}

					for (var k = 0; k < vTmpGrpn1.length; k++) {
						vKey = vTmpGrpn1[k];
						var vSameCnt = [];
						for (var m = 0; m < vActionAppGrouping.length; m++) {
							var vGrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + m + "/Grpn1");
							if (vGrpn1 == vKey) {
								vSameCnt.push(m);
							}
						}

						for (var n = 0; n < vSameCnt.length; n++) {
							if (n > 0) {
								mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1", "");
								mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1E", false);
							} else {
								mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1E", true);
							}
						}
					}
				}
			},

			onChangeGrpn2: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vKey = oEvent.getSource().getSelectedKey();

				oController._fUpdateFlag = true;

				if (vKey == "0000" || vKey == "") {
					var vControlId = oEvent.getSource().getId();
					var vIdxs = vControlId.split("-");
					var vIdx = vIdxs[vIdxs.length - 1];

					var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
					mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vIdx + "/Grpt2", "");
				}
			},

			onAAPClose: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
					oController._PreviewDialog.close();
				}
			},

			onBeforeOpenHtmlDialog: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var oHTMLPanel = $.app.byId(oController.PAGEID + "_APP_HtmlPanel");
				var oHtml = new sap.ui.core.HTML({ preferDOM: true, sanitizeContent: false });

				oHTMLPanel.removeAllContent();
				oHTMLPanel.destroyContent();

				try {
					var sPath = oModel.createKey("ActionAppHtmlSet", {
						Docno: oController._vDocno
					});

					oModel.read(sPath, {
						async: false,
						success: function (oData) {
							if (oData) {
								oHtml.setContent(oData.Htmlc);
							}
						},
						error: function (oResponse) {
							oHtml.setContent("<div><h3 style='color:darkred'>" + oController.getBundleText("MSG_02108") + "</h3></div>");
							Common.log(oResponse);
						}
					});
				} catch (ex) {
					Common.log(ex);
				}
				oHTMLPanel.addContent(oHtml);
			},

			onNDClose: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._NoticeDialog && oController._NoticeDialog.isOpen()) {
					oController._NoticeDialog.close();
				}
			},

			onConfirmNotice: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);

				oController.onNDClose(oEvent);
				oController.onProcessRequest(oEvent);
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null
		});
	}
);
