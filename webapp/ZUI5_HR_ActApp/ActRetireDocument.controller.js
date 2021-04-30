sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler"
	],
	function (Common, CommonController, JSONModel, BusyIndicator, MessageBox, ActAppCommon, SubjectHandler) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRetireDocument"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActRetireDocument",
			ListSelectionType: "Multiple",
			ListSelected: false,
			ListFilter: "",

			_vStatu: "",
			_vReqno: "",
			_vDocno: "",
			_vDocty: "",
			_vEntrs: "",
			_vPersa: "",
			_vActda: "",
			_vMolga: "",
			_vIntca: "",
			_oContext: null,
			_vSelectedPersa: "",

			_vSelected_Reqno: "",
			_vSelected_Pernr: "",
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

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf ZUI5_HR_ActApp.ActRetireDocument
			 */
			onInit: function () {
				this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    }, this);

				var vTableHeight = window.innerHeight - this._OtherHeight;
				this._vRecordCount = parseInt(vTableHeight / this._TableCellHeight);
			},

			onBeforeShow: function (oEvent) {
				this.getSubjectHandler();
				$.app.byId(this.PAGEID + "_SubjectList").getModel().setData({});
				
				if (oEvent) {
					this._vStatu = oEvent.data.Statu;
					this._vReqno = oEvent.data.Reqno;
					this._vDocno = oEvent.data.Docno;
					this._vDocty = oEvent.data.Docty;
					this._vEntrs = oEvent.data.Entrs;
					this._oContext = oEvent.data.context;
					this._vSelectedPersa = oEvent.data.SelectedPersa;
				}

				//Control제어
				var oPageTitle = $.app.byId(this.PAGEID + "_PAGE_TITLE");

				var oAdd_Btn = $.app.byId(this.PAGEID + "_Add_Btn");
				var oComplete_Btn = $.app.byId(this.PAGEID + "_COMPLETE_BTN");
				var oRequsetDelete_Btn = $.app.byId(this.PAGEID + "_REQUESTDELETE_BTN");

				var modbtn = $.app.byId(this.PAGEID + "_Mod_Btn");
				var delbtn = $.app.byId(this.PAGEID + "_Del_Btn");
				var oUpload_Btn = $.app.byId(this.PAGEID + "_UPLOAD_BTN");
				var oExcel_Btn = $.app.byId(this.PAGEID + "_Excel_Btn");
				this._vListLength = 0;

				//신규작성인 경우
				if (this._vStatu == "00") {
					oPageTitle.setText(this.getBundleText("LABEL_02338"));

					oAdd_Btn.setVisible(false);
					modbtn.setVisible(false);
					oUpload_Btn.setVisible(false);
					delbtn.setVisible(false);
					oComplete_Btn.setVisible(false);
					oRequsetDelete_Btn.setVisible(false);
					oExcel_Btn.setVisible(false);
				} else if (this._vStatu == "10") {
					oPageTitle.setText(this.getBundleText("LABEL_02338"));

					oAdd_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);
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
					var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

					var vFirstPersa = "";
					var vFirstReqno = "";
					var vFirstOrgeh = "";
					var vFirstReqdp = "";

					//신규작성인 경우
					if (oController._vStatu == "00") {
						oOrgeh.removeAllItems();

						oPersa.removeAllItems();
						var s_idx = 0;
						for (var i = 0; i < vPersaData.length; i++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: vPersaData[i].Persa,
									text: vPersaData[i].Compatx,
									customData: [
										{ key: "Molga", value: vPersaData[i].Molga },
										{ key: "Intca", value: vPersaData[i].Intca }
									]
								})
							);

							if (vPersaData[i].Persa == oController._vSelectedPersa) {
								s_idx = i;
							}
						}

						oController._vPersa = vPersaData[s_idx].Persa;
						oController._vMolga = vPersaData[s_idx].Molga;
						oController._vIntca = vPersaData[s_idx].Intca;
						oPersa.setSelectedKey(oController._vPersa);

						oModel.read("/AppReqDepListSet", {
							async: false,
							filters: [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)
							],
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
						//작성중인 경우
						var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

						oOrgeh.removeAllItems();

						vFirstPersa = mActionReqList.getProperty(oController._oContext + "/Persa");
						vFirstReqno = mActionReqList.getProperty(oController._oContext + "/Reqno");
						vFirstOrgeh = mActionReqList.getProperty(oController._oContext + "/Orgeh");
						vFirstReqdp = mActionReqList.getProperty(oController._oContext + "/Reqdp");

						var isExists = false;
						oPersa.removeAllItems();
						for (var j = 0; j < vPersaData.length; j++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: vPersaData[j].Persa,
									text: vPersaData[j].Compatx,
									customData: [
										{ key: "Molga", value: vPersaData[j].Molga },
										{ key: "Intca", value: vPersaData[j].Intca }
									]
								})
							);

							if (vFirstPersa == vPersaData[j].Persa) {
								oController._vMolga = vPersaData[j].Molga;
								oController._vIntca = vPersaData[j].Intca;
								isExists = true;
							}
						}
						if (isExists == false) {
							MessageBox.alert("The action approval without permission.");
							oController.navToBack();
							return;
						}
						oPersa.setSelectedKey(vFirstPersa);
						oController._vPersa = vFirstPersa;

						var isExistsOrgeh = false;
						oModel.read("/AppReqDepListSet", {
							async: false,
							filters: [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vFirstPersa)
							],
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

						//----------------------------
						if (!isExistsOrgeh) {
							oOrgeh.addItem(
								new sap.ui.core.Item({
									key: vFirstOrgeh,
									text: vFirstReqdp,
									customData: [{ key: "Reqno", value: vFirstReqno }]
								})
							);
						}
						//------------------------------
						oOrgeh.setSelectedKey(vFirstOrgeh);

						oReqno.setValue(vFirstReqno);

						oTitle.setValue(mActionReqList.getProperty(oController._oContext + "/Title"));
						oTitle.setValueState(sap.ui.core.ValueState.None);
						oReqno.setValueState(sap.ui.core.ValueState.None);
						oActda.setValueState(sap.ui.core.ValueState.None);
						oReqda.setValueState(sap.ui.core.ValueState.None);

						oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));

						oActda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda")));
						if (mActionReqList.getProperty(oController._oContext + "/Reqda") != null)
							oReqda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Reqda")));
						else oReqda.setValue(dateFormat.format(new Date()));
						oPersa.setEnabled(false);
						oOrgeh.setEnabled(false);
						oReqno.setEnabled(true);

						oController._vActda = dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda"));
					}

					oController.reloadSubjectList(oController);

					BusyIndicator.hide();
				};

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
			},

			reloadSubjectList: function (oController) {
				// var dataProcess = function () {
					oController.setSubjectList(oController);

					var modbtn = $.app.byId(oController.PAGEID + "_Mod_Btn");
					var delbtn = $.app.byId(oController.PAGEID + "_Del_Btn");
					var oComplete_Btn = $.app.byId(oController.PAGEID + "_COMPLETE_BTN");
					var oUpload_Btn = $.app.byId(oController.PAGEID + "_UPLOAD_BTN");
					var oExcel_Btn = $.app.byId(oController.PAGEID + "_Excel_Btn");

					if (oController._vListLength > 0) {
						modbtn.setVisible(true);
						delbtn.setVisible(true);
						oComplete_Btn.setVisible(true);
						oUpload_Btn.setVisible(true);
						oExcel_Btn.setVisible(true);
					} else {
						modbtn.setVisible(false);
						delbtn.setVisible(false);
						oComplete_Btn.setVisible(false);
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
				sap.ui.getCore().getEventBus().publish("nav", "back", {});
			},

			addPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActRetirePersonInfo",
						data: {
							actiontype: "100",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							Molga: oController._vMolga,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRetireDocument"
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
						id: "ZUI5_HR_ActApp.ActRetirePersonInfo",
						data: {
							actiontype: "200",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							Molga: oController._vMolga,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRetireDocument",
							Pernr: vActionSubjectListSet[check_idxs[0]].Pernr,
							PernrActda: vActionSubjectListSet[check_idxs[0]].Actda,
							PernrVoltId: vActionSubjectListSet[check_idxs[0]].VoltId
						}
					});
			},

			deletePerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
				var check_idxs = [];

				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
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
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = "";

						for (var i = 0; i < check_idxs.length; i++) {
							if (vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
								MessageBox.alert(oController.getBundleText("MSG_02037"));
								return;
							}

							process_result = false;
							sPath = oModel.createKey("/ActionSubjectListSet", {
								Docno: oController._vDocno,
								Pernr: vActionSubjectListSet[check_idxs[i]].Pernr,
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
						filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa)
						],
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
				var vOrgehItem = oOrgeh.getSelectedItem();

				oReqno.setValue("");

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
				var vEapprovalyn = "";
				var updateData = {};

				updateData.Percod = oController.getSessionInfoByKey("Percod");
				updateData.Persa = oPersa.getSelectedKey();
				updateData.Orgeh = oOrgeh.getSelectedKey();
				updateData.Reqno = oReqno.getValue();
				updateData.Title = oTitle.getValue();

				updateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
				updateData.Reqda = "/Date(" + Common.getTime(oReqda.getValue()) + ")/";

				updateData.Notes = oNotes.getValue();

				updateData.Docty = oController._vDocty;

				var sPath = "/ActionReqListSet";
				var process_result = false;

				if (oController._vStatu == "00") {
					oModel.create(sPath, updateData, {
						success: function (oData) {
							if (oData) {
								oController._vDocno = oData.Docno;
								vEapprovalyn = oData.Eapprovalyn;
							}
							process_result = true;
							Common.log("Sucess ActionReqListSet Create !!!");
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
				} else if (oController._vStatu == "10") {
					updateData.Docno = oController._vDocno;
					
					sPath = oModel.createKey("/ActionReqListSet", {
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
				}

				if (process_result) {
					var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

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
						mActionReqList.setProperty(oController._oContext + "/Eapprovalyn", vEapprovalyn);
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
				}
			},

			onPressDelete: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var onProcessDelete = function (fVal) {
					if (fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = oModel.createKey("/ActionReqListSet", {
							Docno: oController._vDocno
						});

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
							FromPageId: "ZUI5_HR_ActApp.ActRetireDocument"
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
				var oView = $.app.getView(SUB_APP_ID);
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
				ActAppCommon.onAfterOpenDetailViewPopover($.app.getController(SUB_APP_ID));
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
							FromPageId: "ZUI5_HR_ActApp.ActRetireDocument"
						}
					});
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
								FromPageId: "ZUI5_HR_ActApp.ActRetireDocument"
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

			getActionDisplayFields: function (oController) {
				oController.vDisplayControl = [];

				try {
					$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionDisplayFieldSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
						],
						success: function (oData) {
							oData.results.forEach(function (element) {
								oController.vDisplayControl.push(element);
							});
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});
				} catch (ex) {
					Common.log(ex);
				}
			},

			setSubjectList: function(oController) {
				var oTable = $.app.byId(oController.PAGEID + "_SubjectList");

				oTable.setBusyIndicatorDelay(0);
				oTable.setBusy(true);

				// Get display fields (ZHR_ACTIONAPP_SRV>ActionDisplayFieldSet)
				oController.getActionDisplayFields(oController);

				// Make Column model
				var aColModel = [
					{ id: "Pchk", label: "", plabel: "", span: 0, type: "Checkbox", width: oController.vDisplayControl.length > 10 ? "50px" : "4%" },
					{ id: "Cfmyn", label: "{i18n>LABEL_02041}", plabel: "", span: 0, type: "string", width: oController.vDisplayControl.length > 10 ? "50px" : "4%" },
					{ id: "Ename", label: "{i18n>LABEL_02070}", plabel: "", span: 0, type: "string", width: oController.vDisplayControl.length > 10 ? "150px" : "10%", align: sap.ui.core.TextAlign.Begin },
					{ id: "Acttx", label: "{i18n>LABEL_02024}", plabel: "", span: 0, type: "string", width: oController.vDisplayControl.length > 10 ? "150px" : "10%", align: sap.ui.core.TextAlign.Begin },
					{ id: "Actda", label: "{i18n>LABEL_02014}", plabel: "", span: 0, type: "date", width: oController.vDisplayControl.length > 10 ? "120px" : "6%" }
				];

				if (oController._vStatu != "00") {
					var leftTableColSize = 66,
						leftTotalColLength = oController.vDisplayControl.length,
						calculatePerColSize = oController.vDisplayControl.length > 10 ? "120px" : Math.floor(leftTableColSize / leftTotalColLength) + "%";

					for (var i = 0; i < oController.vDisplayControl.length; i++) {
						var Fieldname = Common.underscoreToCamelCase(oController.vDisplayControl[i].Fieldname),
							TextFieldname = Fieldname + "_Tx",
							oneCol = {};

						oneCol.id = TextFieldname;
						oneCol.label = oController.vDisplayControl[i].Label;
						oneCol.plabel = "";
						oneCol.span = 0;
						oneCol.type = "template";
						oneCol.templateGetter = "templateDiffColorText";
						oneCol.templateGetterOwner = oController.SubjectHandler;
						oneCol.width = calculatePerColSize;
						oneCol.align = sap.ui.core.TextAlign.Begin;

						aColModel.push(oneCol);
					}
				}
				// Make Column model

				// Set fixed columns
				if(oController.vDisplayControl.length > 10) {
					oTable.setFixedColumnCount(5);
				}

				// Convert Excel column info
				oController._Columns = Common.convertColumnArrayForExcel(oController, aColModel);

				// Build table column object
				oTable.destroyColumns();
				common.ZHR_TABLES.makeColumn(oController, oTable, aColModel);

				var isShowBatyp = false;
				ActAppCommon.buildTableCommonFields(oController, oTable, isShowBatyp);

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectList = { ActionSubjectListSet: [] };
				var fCompleteCount = false;

				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionSubjectListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.csrf-token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
					success: function (oData) {
						if (oData.results && oData.results.length) {
							var oneData = null;

							oData.results.forEach(function (element) {
								if (element.Cfmyn == "X") {
									fCompleteCount = true;
								}

								oneData = {};
								oneData = element;
								oneData.Pchk = oController.ListSelected;
								oneData.Acttx = oneData.Acttx.replace(/<br>/g, "\n");
								oneData.ProcessStatus = "W";
								oneData.ProcessStatusText = oController.getBundleText("LABEL_02252");
								oneData.ProcessMsg = "";

								vActionSubjectList.ActionSubjectListSet.push(oneData);
							});
						}
					},
					error: function (oError) {
						Common.log(oError);
					}
				});

				mActionSubjectList.setData(vActionSubjectList);
				oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;

				var oDeleteBtn = $.app.byId(oController.PAGEID + "_REQUESTDELETE_BTN");

				if (fCompleteCount) {
					if (oDeleteBtn) oDeleteBtn.setVisible(false);
				} else {
					if (oDeleteBtn) oDeleteBtn.setVisible(true);
				}
			},

			onPressUpload: function () {
				var oController = $.app.getController(SUB_APP_ID);

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppRetireUpload",
						data: {
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							Molga: oController._vMolga,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRetireDocument"
						}
					});
			},

			onChangeDate: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = oEvent.getSource();

				if (oEvent.getParameter("valid") == false) {
					MessageBox.alert(oController.getBundleText("MSG_02047"), {
						onClose: function () {
							oControl.setValue("");
						}
					});
				}
			},

			downloadExcel: function () {
				// var oView = $.app.getView(SUB_APP_ID);
				// var oController = $.app.getController(SUB_APP_ID);

				// var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
				// for (var i = 0; i < oController.vDisplayControl.length; i++) {
				// 	var Fieldname = Common.underscoreToCamelCase(oController.vDisplayControl[i].Fieldname),
				// 		TextFieldname = Fieldname + "_Tx";
					
				// 	vCols += TextFieldname + "_Hidden|";
				// }

				// var params = { FileName: "ActionSubject.xls", SheetName: "Sheet", Merge: 1, HiddenColumn: 0, DownCols: vCols };
				// if (typeof ActRetireDocumentSubject == "object") {
				// 	ActRetireDocumentSubject.Down2Excel(params);
				// }
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null
		});
	}
);
