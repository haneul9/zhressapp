sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/export/Spreadsheet"
	],
	function (Common, CommonController, JSONModel, AcpAppCommon, SubjectHandler, BusyIndicator, MessageBox, Spreadsheet) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppDocument"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActAppDocument",
			ListSelectionType: "Multiple",
			ListSelected: false,
			ListFilter: "",

			_Columns: "",

			_vStatu: "",
			_vReqno: "",
			_vDocno: "",
			_vDocty: "",
			_vEntrs: "",
			_vPersa: "",
			_vActda: "",
			_vMolga: "",
			_oContext: null,

			_vSelected_Reqno: "",
			_vSelected_Pernr: "",
			_vSelected_Percod: "",
			_vSelected_Actda: "",
			_vSelected_Docno: "",
			_vSelected_VoltId: "",

			vDisplayControl: [],

			_DetailViewPopover: null,

			_TableCellHeight: 70,
			_OtherHeight: 380,
			_vRecordCount: 0,

			_vListLength: 0,

			UploadDialog: null,

			getSubjectHandler: function() {
				this.SubjectHandler = SubjectHandler.initialize(this);
	
				return this.SubjectHandler;
			},

			onInit: function () {
                this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    }, this);
			},

			onBeforeShow: function (oEvent) {
				var oController = this;

				this.getSubjectHandler();
				$.app.byId(this.PAGEID + "_SubjectList").getModel().setData({});

				if (oEvent) {
					this._vStatu = oEvent.data.Statu;
					this._vReqno = oEvent.data.Reqno;
					this._vDocno = oEvent.data.Docno;
					this._vDocty = oEvent.data.Docty;
					this._vPersa = oEvent.data.Persa;
					this._vEntrs = oEvent.data.Entrs;
					this._oContext = oEvent.data.context;
				}

				var oPageTitle = $.app.byId(this.PAGEID + "_PAGE_TITLE");

				var oAdd_Btn = $.app.byId(this.PAGEID + "_Add_Btn");
				var oComplete_Btn = $.app.byId(this.PAGEID + "_COMPLETE_BTN");
				var oAnnounce_Btn = $.app.byId(this.PAGEID + "_ANNOUNCE_BTN");
				var oRequsetDelete_Btn = $.app.byId(this.PAGEID + "_REQUESTDELETE_BTN");

				var modbtn = $.app.byId(this.PAGEID + "_Mod_Btn");
				var delbtn = $.app.byId(this.PAGEID + "_Del_Btn");
				var oUpload_Btn = $.app.byId(this.PAGEID + "_UPLOAD_BTN");
				var oExcel_Btn = $.app.byId(this.PAGEID + "_Excel_Btn");

				this._vListLength = 0;
				if (this._vStatu == "00") {
					oPageTitle.setText(oController.getBundleText("LABEL_02188"));

					oAdd_Btn.setVisible(false);
					modbtn.setVisible(false);
					oUpload_Btn.setVisible(false);
					delbtn.setVisible(false);
					oComplete_Btn.setVisible(false);
					oAnnounce_Btn.setVisible(false);
					oRequsetDelete_Btn.setVisible(false);
					oExcel_Btn.setVisible(false);
				} else if (this._vStatu == "10") {
					var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

					var vPostc = mActionReqList.getProperty(this._oContext + "/Postc");

					oPageTitle.setText(oController.getBundleText("LABEL_02267"));

					oAdd_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);

					oAnnounce_Btn.setVisible(true);
					oAnnounce_Btn.addCustomData(new sap.ui.core.CustomData({ key: "Postc", value: vPostc }));
					if (vPostc == "X") {
						oAnnounce_Btn.setText(oController.getBundleText("LABEL_02033"));
					} else {
						oAnnounce_Btn.setText(oController.getBundleText("LABEL_02032"));
					}
				}
			},

			onAfterShow: function () {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
				var oController = this;
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

				var dataProcess = function () {
					var oPersa = $.app.byId(oController.PAGEID + "_Persa");
					var oOrgeh = $.app.byId(oController.PAGEID + "_Orgeh");
					var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
					var oTitle = $.app.byId(oController.PAGEID + "_Title");
					var oActda = $.app.byId(oController.PAGEID + "_Actda");
					var oReqda = $.app.byId(oController.PAGEID + "_Reqda");
					var oNotes = $.app.byId(oController.PAGEID + "_Notes");

					var oPersaModel = sap.ui.getCore().getModel("PersaModel");
					var vPersaData = oPersaModel.getProperty("/PersAreaListSet") || [];
					var vFirstPersa = "";
					var vFirstReqno = "";
					var vFirstOrgeh = "";
					var vFirstReqdp = "";
					if (oController._vStatu == "00") {
						oPersa.removeAllItems();
						oOrgeh.removeAllItems();

						for (var i = 0; i < vPersaData.length; i++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: vPersaData[i].Persa,
									text: vPersaData[i].Pbtxt
								})
							);
						}
						oPersa.setSelectedKey(oController._vPersa);
						// vFirstPersa = vPersaData[0].Persa;
						// oPersa.setSelectedKey(vFirstPersa);
						// oController._vPersa = vFirstPersa;

						oModel.read("/AppReqDepListSet", {
							async: false,
							filters: [new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)],
							success: function (oData) {
								if (oData.results && oData.results.length) {
									for (var i = 0; i < oData.results.length; i++) {
										if (i == 0) {
											vFirstReqno = oData.results[i].Reqno;
											vFirstOrgeh = oData.results[i].Orgeh;
										}
										oOrgeh.addItem(
											new sap.ui.core.Item({
												key: oData.results[i].Orgeh,
												text: oData.results[i].Orgtx,
												customData: [{ key: "Reqno", value: oData.results[i].Reqno }]
											})
										);
									}
								}
							},
							error: function (oResponse) {
								Common.log(oResponse);
							}
						});

						oOrgeh.setSelectedKey(vFirstOrgeh);
						oReqno.setValue(vFirstReqno);

						oTitle.setValue("");
						oNotes.setValue("");
						oTitle.setValueState(sap.ui.core.ValueState.None);
						oReqno.setValueState(sap.ui.core.ValueState.None);
						oActda.setValueState(sap.ui.core.ValueState.None);
						oReqda.setValueState(sap.ui.core.ValueState.None);

						oActda.setValue(dateFormat.format(new Date()));
						oReqda.setValue(dateFormat.format(new Date()));

						oPersa.setEnabled(true);
						oOrgeh.setEnabled(true);
						oReqno.setEnabled(true);
					} else if (oController._vStatu == "10") {
						var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

						oPersa.removeAllItems();
						oOrgeh.removeAllItems();

						vFirstPersa = mActionReqList.getProperty(oController._oContext + "/Persa");
						vFirstReqno = mActionReqList.getProperty(oController._oContext + "/Reqno");
						vFirstOrgeh = mActionReqList.getProperty(oController._oContext + "/Orgeh");
						vFirstReqdp = mActionReqList.getProperty(oController._oContext + "/Reqdp");

						oPersa = $.app.byId(oController.PAGEID + "_Persa");

						for (var j = 0; j < vPersaData.length; j++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: vPersaData[j].Persa,
									text: vPersaData[j].Pbtxt
								})
							);
						}
						oPersa.setSelectedKey(vFirstPersa);
						oController._vPersa = vFirstPersa;

						var isExistsOrgeh = false;

						oModel.read("/AppReqDepListSet", {
							async: false,
							filters: [new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vFirstPersa)],
							success: function (oData) {
								if (oData.results && oData.results.length) {
									for (var i = 0; i < oData.results.length; i++) {
										if (vFirstOrgeh == oData.results[i].Orgeh) {
											isExistsOrgeh = true;
										}
										oOrgeh.addItem(
											new sap.ui.core.Item({
												key: oData.results[i].Orgeh,
												text: oData.results[i].Orgtx,
												customData: [{ key: "Reqno", value: oData.results[i].Reqno }]
											})
										);
									}
								}
							},
							error: function (oResponse) {
								Common.log(oResponse);
							}
						});

						if (!isExistsOrgeh) {
							oOrgeh.addItem(
								new sap.ui.core.Item({
									key: vFirstOrgeh,
									text: vFirstReqdp,
									customData: [{ key: "Reqno", value: vFirstReqno }]
								})
							);
						}
						oOrgeh.setSelectedKey(vFirstOrgeh);

						oReqno.setValue(vFirstReqno);

						oTitle.setValue(mActionReqList.getProperty(oController._oContext + "/Title"));
						oTitle.setValueState(sap.ui.core.ValueState.None);
						oReqno.setValueState(sap.ui.core.ValueState.None);
						oActda.setValueState(sap.ui.core.ValueState.None);
						oReqda.setValueState(sap.ui.core.ValueState.None);

						oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));

						var vActda = mActionReqList.getProperty(oController._oContext + "/Actda");

						oActda.setValue(vActda ? dateFormat.format(vActda) : "");
						if (mActionReqList.getProperty(oController._oContext + "/Reqda") != null)
							oReqda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Reqda")));
						else oReqda.setValue(dateFormat.format(new Date()));
						oPersa.setEnabled(false);
						oOrgeh.setEnabled(false);
						oReqno.setEnabled(true);

						oController._vActda = vActda ? dateFormat.format(vActda) : "";
					}

					oController.reloadSubjectList(oController);

					BusyIndicator.hide();
				};

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
			},

			reloadSubjectList: function (oController) {
				// var dataProcess = function () {
					oController.SubjectHandler.setSubjectList({isShowBatyp : true});
					Common.adjustViewHeightRowCount({
						tableControl: $.app.byId(oController.PAGEID + "_SubjectList"),
						rowHeight: 37,
						viewHeight: 48,
						dataCount: $.app.byId(oController.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
					});

					var modbtn = $.app.byId(oController.PAGEID + "_Mod_Btn");
					var delbtn = $.app.byId(oController.PAGEID + "_Del_Btn");
					var oComplete_Btn = $.app.byId(oController.PAGEID + "_COMPLETE_BTN");
					var oAnnounce_Btn = $.app.byId(oController.PAGEID + "_ANNOUNCE_BTN");
					var oUpload_Btn = $.app.byId(oController.PAGEID + "_UPLOAD_BTN");
					var oExcel_Btn = $.app.byId(oController.PAGEID + "_Excel_Btn");

					if (oController._vListLength > 0) {
						modbtn.setVisible(true);
						delbtn.setVisible(true);
						oComplete_Btn.setVisible(true);
						oAnnounce_Btn.setVisible(true);
						oUpload_Btn.setVisible(true);
						oExcel_Btn.setVisible(true);

						// 확정 버튼 기안부서와 내부서가 같으면 활성
						var oOrgeh = $.app.byId(oController.PAGEID + "_Orgeh");
						if($.app.getController().getSessionInfoByKey("Orgeh") === oOrgeh.getSelectedKey()) {
							oComplete_Btn.setEnabled(true);
						} else {
							oComplete_Btn.setEnabled(false);
						}
					} else {
						modbtn.setVisible(false);
						delbtn.setVisible(false);
						oComplete_Btn.setVisible(false);
						oAnnounce_Btn.setVisible(false);
						oExcel_Btn.setVisible(false);
						if (oController._vStatu != "00") {
							oUpload_Btn.setVisible(true);
						} else {
							oUpload_Btn.setVisible(false);
						}
					}

				// 	BusyIndicator.hide();
				// }

				// BusyIndicator.show(0);

				// setTimeout(dataProcess, 300);
			},

			navToBack: function () {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: "ZUI5_HR_ActApp.ActAppMain"
				});
			},

			checkAll: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID),
					vSelected = oEvent.getParameters().selected,
					oModel = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList").getModel(),
					vTableData = oModel.getProperty("/ActionSubjectListSet");

				vTableData.forEach(function (elem, i) {
					oModel.setProperty("/ActionSubjectListSet/" + i + "/Pchk", vSelected);
				});
			},

			toggleCheckbox: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oCheckAll = $.app.byId(oController.PAGEID + "_checkAll");

				oCheckAll.setSelected(false);
			},

			addPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppPersonInfo",
						data: {
							actiontype: "100",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocument"
						}
					});
			},

			modifyPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");

				var check_idxs = [];
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							check_idxs.push(i);
						}
					}
				}

				if (check_idxs.length < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				}

				if (check_idxs.length != 1) {
					MessageBox.alert(oController.getBundleText("MSG_02036"));
					return;
				}

				if (vActionSubjectListSet[check_idxs[0]].Cfmyn == "X") {
					MessageBox.alert(oController.getBundleText("MSG_02037"));
					return;
				}

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppPersonInfo",
						data: {
							actiontype: "200",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocument",
							Pernr: vActionSubjectListSet[check_idxs[0]].Pernr,
							Percod: vActionSubjectListSet[check_idxs[0]].Percod,
							PernrActda: vActionSubjectListSet[check_idxs[0]].Actda,
							PernrVoltId: vActionSubjectListSet[check_idxs[0]].VoltId
						}
					});
			},

			deletePerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");

				var check_idxs = [];
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						Common.log("Pchk " + (i + 1) + " : " + vActionSubjectListSet[i].Pchk);
						if (vActionSubjectListSet[i].Pchk == true) {
							check_idxs.push(i);
						}
					}
				}

				if (check_idxs.length < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02038"));
					return;
				}

				var onProcessDelete = function (fVal) {
					if (fVal && fVal == "OK") {
						var process_result = false;

						for (var i = 0; i < check_idxs.length; i++) {
							// if (vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
							// 	MessageBox.alert(oController.getBundleText("MSG_02037"));
							// 	return;
							// }

							process_result = false;

							var sPath = oModel.createKey("/ActionSubjectListSet", {
								Docno: oController._vDocno,
								Percod: vActionSubjectListSet[check_idxs[i]].Percod,
								VoltId: vActionSubjectListSet[check_idxs[i]].VoltId,
								Actda: vActionSubjectListSet[check_idxs[i]].Actda
							});

							oModel.remove(sPath, {
								success: function () {
									process_result = true;
									Common.log("Sucess ActionSubjectListSet Delete !!!");
								},
								error: function (oError) {
									var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										if (Err.error.innererror.errordetails) {
											Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
										} else {
											Common.showErrorMessage(Err.error.message.value);
										}
									} else {
										Common.showErrorMessage(oError);
									}
									process_result = false;
								}
							});

							if (!process_result) {
								return;
							}
						}

						MessageBox.alert(oController.getBundleText("MSG_02039"), {
							title: oController.getBundleText("LABEL_02093"),
							onClose: function () {
								oController.reloadSubjectList(oController);
							}
						});
					}
				};

				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title: oController.getBundleText("LABEL_02053"),
					onClose: onProcessDelete
				});
			},

			onChangePersa: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oPersa = oEvent.getSource();
				var oOrgeh = $.app.byId(oController.PAGEID + "_Orgeh");
				var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
				var oTitle = $.app.byId(oController.PAGEID + "_Title");
				var oActda = $.app.byId(oController.PAGEID + "_Actda");
				var oReqda = $.app.byId(oController.PAGEID + "_Reqda");

				var vItem = oPersa.getSelectedItem();
				if (vItem) {
					var vPersa = vItem.getKey();

					oController._vPersa = vPersa;

					oOrgeh.removeAllItems();

					var vFirstReqno = "";
					var vFirstOrgeh = "";

					$.app.getModel("ZHR_ACTIONAPP_SRV").read("/AppReqDepListSet", {
						async: false,
						filters: [new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa)],
						success: function (oData) {
							if (oData.results && oData.results.length) {
								for (var i = 0; i < oData.results.length; i++) {
									if (i == 0) {
										vFirstReqno = oData.results[i].Reqno;
										vFirstOrgeh = oData.results[i].Orgeh;
									}
									oOrgeh.addItem(
										new sap.ui.core.Item({
											key: oData.results[i].Orgeh,
											text: oData.results[i].Orgtx,
											customData: [{ key: "Reqno", value: oData.results[i].Reqno }]
										})
									);
								}
							}
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});

					oOrgeh.setSelectedKey(vFirstOrgeh);
					oReqno.setValue(vFirstReqno);

					oReqno.setValueState(sap.ui.core.ValueState.None);
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
					oReqda.setValueState(sap.ui.core.ValueState.None);
				}
			},

			onChangeOrgeh: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oOrgeh = oEvent.getSource();
				var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
				
				oReqno.setValue("");

				var vOrgehItem = oOrgeh.getSelectedItem();
				if (vOrgehItem) {
					var oCustomDataList = vOrgehItem.getCustomData();
					if (oCustomDataList) {
						for (var i = 0; i < oCustomDataList.length; i++) {
							if (oCustomDataList[i].getKey() == "Reqno") {
								oReqno.setValue(oCustomDataList[i].getValue());
							}
						}
					}
				}
			},

			onPressSave: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var oPersa = $.app.byId(oController.PAGEID + "_Persa");
				var oOrgeh = $.app.byId(oController.PAGEID + "_Orgeh");
				var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
				var oTitle = $.app.byId(oController.PAGEID + "_Title");
				var oActda = $.app.byId(oController.PAGEID + "_Actda");
				var oReqda = $.app.byId(oController.PAGEID + "_Reqda");
				var oNotes = $.app.byId(oController.PAGEID + "_Notes");

				oReqno.setValueState(sap.ui.core.ValueState.None);
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
				oReqda.setValueState(sap.ui.core.ValueState.None);

				var oAdd_Btn = $.app.byId(oController.PAGEID + "_Add_Btn");
				var oRequsetDelete_Btn = $.app.byId(oController.PAGEID + "_REQUESTDELETE_BTN");
				var oUpload_Btn = $.app.byId(oController.PAGEID + "_UPLOAD_BTN");

				if (oReqno.getValue() == "") {
					oReqno.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02041"));
					return;
				}

				if (oTitle.getValue() == "") {
					oTitle.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02042"));
					return;
				}

				if (oActda.getValue() == "") {
					oActda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02043"));
					return;
				}

				if (oReqda.getValue() == "") {
					oReqda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02044"));
					return;
				}

				var updateData = {};

				updateData.Percod = $.app.getController().getSessionInfoByKey("Percod");
				updateData.Persa = oPersa.getSelectedKey();
				updateData.Orgeh = oOrgeh.getSelectedKey();
				updateData.Reqno = oReqno.getValue();
				updateData.Title = oTitle.getValue();

				updateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
				updateData.Reqda = "/Date(" + Common.getTime(oReqda.getValue()) + ")/";

				updateData.Notes = oNotes.getValue();

				updateData.Docty = oController._vDocty;

				var oPath = "/ActionReqListSet";
				var process_result = false;
				var errData = null;

				if (oController._vStatu == "00") {
					oModel.create(oPath, updateData, {
						async: false,
						success: function (oData) {
							if (oData) {
								oController._vDocno = oData.Docno;
							}
							process_result = true;
							Common.log("Sucess ActionReqListSet Create !!!");
						},
						error: function (oError) {
							process_result = false;
							errData = Common.parseError(oError);
							Common.log(oError);
						}
					});
				} else if (oController._vStatu == "10") {
					var sPath = oModel.createKey("/ActionReqListSet", {
						Docno: oController._vDocno
					});
					
					updateData.Docno = oController._vDocno;
					
					oModel.update(sPath, updateData, {
						async: false,
						success: function () {
							process_result = true;
							Common.log("Sucess ActionReqListSet Update !!!");
						},
						error: function (oError) {
							process_result = false;
							errData = Common.parseError(oError);
							Common.log(oError);
						}
					});
				}

				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				if (process_result) {
					if (oController._vStatu == "00") {
						oController._vStatu = "10";

						var insertData = {};

						insertData.Persa = oPersa.getSelectedKey();
						var oItem = oOrgeh.getSelectedItem();
						insertData.Orgeh = oItem.getKey();
						insertData.Reqdp = oItem.getText();
						insertData.Reqno = oReqno.getValue();
						insertData.Title = oTitle.getValue();
						insertData.Actda = new Date(Common.setTime(new Date(oActda.getValue())));
						insertData.Reqda = new Date(Common.setTime(new Date(oReqda.getValue())));
						insertData.Notes = oNotes.getValue();
						insertData.Statu = "10";

						var vActionReqListSet = mActionReqList.getProperty("/ActionReqListSet");
						var vActionReqList = { ActionReqListSet: [] };
						for (var i = 0; i < vActionReqListSet.length; i++) {
							vActionReqList.ActionReqListSet.push(vActionReqListSet[i]);
						}
						vActionReqList.ActionReqListSet.push(insertData);
						oController._oContext = "/ActionReqListSet/" + vActionReqListSet.length;
						mActionReqList.setData(vActionReqList);
					} else {
						mActionReqList.setProperty(oController._oContext + "/Title", oTitle.getValue());
						mActionReqList.setProperty(oController._oContext + "/Actda", new Date(Common.setTime(new Date(oActda.getValue()))));
						mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(Common.setTime(new Date(oReqda.getValue()))));
						mActionReqList.setProperty(oController._oContext + "/Notes", oNotes.getValue());
					}

					oController._vReqno = oReqno.getValue();
					oController._vActda = oActda.getValue();
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose: function () {
							oPersa.setEnabled(false);
							oOrgeh.setEnabled(false);
							oReqno.setEnabled(false);

							oTitle.setValueState(sap.ui.core.ValueState.None);
							oReqno.setValueState(sap.ui.core.ValueState.None);
							oActda.setValueState(sap.ui.core.ValueState.None);
							oReqda.setValueState(sap.ui.core.ValueState.None);

							oAdd_Btn.setVisible(true);
							oRequsetDelete_Btn.setVisible(true);

							if (oController._vListLength > 0) {
								oUpload_Btn.setVisible(true);
							} else {
								oUpload_Btn.setVisible(true);
							}
						}
					});
				} else {
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
					oReqda.setValueState(sap.ui.core.ValueState.None);

					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: oController.getBundleText("LABEL_00149")
						});
					}
				}
			},

			onPressDelete: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var onProcessDelete = function (fVal) {
					if (fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var sPath = oModel.createKey("/ActionReqListSet", {
							Docno: oController._vDocno
						});
						var process_result = false;
						
						oModel.remove(sPath, {
							success: function () {
								process_result = true;
								Common.log("Sucess ActionReqListSet Delete !!!");
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						if (process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose: function () {
									sap.ui.getCore().getEventBus().publish("nav", "to", {
										id: "ZUI5_HR_ActApp.ActAppMain",
										data: {}
									});
								}
							});
						}
					}
				};

				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title: oController.getBundleText("LABEL_02053"),
					onClose: onProcessDelete
				});
			},

			onPressComplete: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppComplete",
						data: {
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocument"
						}
					});
			},

			onChangeCheckBox: function (oEvent) {
				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet"); //{ActionSubjectListSet : []};

				var vTempData = { ActionSubjectListSet: [] };

				if (vActionSubjectList && vActionSubjectList.length) {
					for (var i = 0; i < vActionSubjectList.length; i++) {
						var Batyp = vActionSubjectList[i].Batyp;
						var oneData = vActionSubjectList[i];
						if (Batyp == "A") oneData.Pchk = oEvent.getParameter("checked");
						vTempData.ActionSubjectListSet.push(oneData);
					}
					mActionSubjectList.setData(vTempData);
				}
			},

			displayDetailView: function (oEvent) {
				var oView = $.app.byId("ZUI5_HR_ActApp.ActAppDocument");
				var oController = $.app.getController(SUB_APP_ID);

				var oControl = oEvent.getSource();
				var oCustomData = oControl.getCustomData();

				oController._vSelected_Reqno = null;
				oController._vSelected_Reqno = null;
				oController._vSelected_Actda = null;
				oController._vSelected_Docno = null;

				if (oCustomData && oCustomData.length) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Reqno") {
							oController._vSelected_Reqno = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Pernr") {
							oController._vSelected_Pernr = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Percod") {
							oController._vSelected_Percod = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Actda") {
							oController._vSelected_Actda = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Docno") {
							oController._vSelected_Docno = oCustomData[i].getValue();
						}
					}
				}

				if (!oController._DetailViewPopover) {
					if (oController._vDocty == "20") {
						oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionRecDetailView", oController);
					} else {
						oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
					}
					oView.addDependent(oController._DetailViewPopover);
				}

				oController._DetailViewPopover.openBy(oControl);
			},

			onAfterOpenPopover: function () {
				AcpAppCommon.onAfterOpenDetailViewPopover($.app.getController(SUB_APP_ID));
			},

			onPressRequest: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppRequest",
						data: {
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocument"
						}
					});
			},

			onResizeWindow: function () {
				$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
			},

			onPressAnnounce: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oSrc = oEvent.getSource();
				var vPostc = "";
				var oCustomData = oSrc.getCustomData();

				if (oCustomData && oCustomData.length) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Postc") {
							vPostc = oCustomData[i].getValue();
						}
					}
				}

				var vTitle = oController.getBundleText("LABEL_02258");
				var vMsg = oController.getBundleText("MSG_02022");
				if (vPostc == "X") {
					vTitle = oController.getBundleText("LABEL_02268");
					vMsg = oController.getBundleText("MSG_02045");
				} else {
					sap.ui
						.getCore()
						.getEventBus()
						.publish("nav", "to", {
							id: "ZUI5_HR_ActApp.ActAppAnnounce",
							data: {
								Persa: oController._vPersa,
								Statu: oController._vStatu,
								Reqno: oController._vReqno,
								Docno: oController._vDocno,
								Docty: oController._vDocty,
								Actda: oController._vActda,
								context: oController._oContext,
								FromPageId: "ZUI5_HR_ActApp.ActAppDocument"
							}
						});
					return;
				}

				var DataProcess = function () {
					var createData = {
						Docno: oController._vDocno,
						Persa: oController._vPersa,
						Reqno: oController._vReqno
					};

					var msg = "";
					if (vPostc == "X") {
						createData.Reqst = "52";
						msg = oController.getBundleText("MSG_02046");
					}

					$.app.getModel("ZHR_ACTIONAPP_SRV").create("/ActionReqChangeHistorySet", createData, {
						success: function () {
							MessageBox.alert(msg, {
								title: oController.getBundleText("LABEL_02093"),
								onClose: function () {
									oController.navToBack();
								}
							});
						},
						error: function (oError) {
							Common.log(oError);
						}
					});
				};

				MessageBox.show(vMsg, {
					icon: MessageBox.Icon.INFORMATION,
					title: vTitle,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							DataProcess();
						}
					}
				});
			},

			onInfoViewPopup: function () {
				var oContext = this.getBindingContext(),
					oControl = this,
					oView = $.app.byId("ZUI5_HR_ActApp.ActAppDocument"),
					oController = $.app.getController(SUB_APP_ID),
					oTable = $.app.byId(oController.PAGEID + "_SubjectList"),
					oSubjectModel = oTable.getModel();

				oController._vSelected_Pernr = oSubjectModel.getProperty(oContext + "/Pernr");
				oController._vSelected_Percod = oSubjectModel.getProperty(oContext + "/Percod");
				oController._vSelected_Reqno = oSubjectModel.getProperty(oContext + "/Reqno");
				oController._vSelected_Actda = oSubjectModel.getProperty(oContext + "/Actda");
				oController._vSelected_Docno = oSubjectModel.getProperty(oContext + "/Docno");
				oController._vSelected_VoltId = oSubjectModel.getProperty(oContext + "/VoltId");

				if(oController._vDocty == "20" || oController._vDocty == "50") {
					if(!oController._DetailRecViewPopover){
						oController._DetailRecViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionRecDetailView", oController);
						oView.addDependent(oController._DetailRecViewPopover);
					}
					oController._DetailRecViewPopover.openBy(oControl);
				} else {
					if(!oController._DetailViewPopover){
						oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
						oView.addDependent(oController._DetailViewPopover);
					}
					oController._DetailViewPopover.openBy(oControl);
				}
			},

			onPressUpload: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppUpload",
						data: {
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocument"
						}
					});
			},

			onChangeDate: function (oEvent) {
				var oControl = oEvent.getSource();
				if (oEvent.getParameter("valid") == false) {
					MessageBox.alert(this.getBundleText("MSG_02047"), {
						onClose: function () {
							oControl.setValue("");
						}
					});
				}
			},

			downloadExcel: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oTable = $.app.byId(oController.PAGEID + "_SubjectList"),
					oJSONModel = oTable.getModel(),
					dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" }),
					curDate = new Date(),
					oSettings = {
						workbook: { columns: oController._Columns },
						dataSource: oJSONModel.getProperty("/ActionSubjectListSet"),
						worker: false, // We need to disable worker because we are using a MockServer as OData Service
						fileName: oController.getBundleText("LABEL_02188") + "-" + dateFormat.format(curDate) + ".xlsx"
					};

				if (oSettings.dataSource && oSettings.dataSource.length > 0) {
					var oSpreadsheet = new Spreadsheet(oSettings);
					oSpreadsheet.build();
				}
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null
		});
	}
);
