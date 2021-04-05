/* eslint-disable no-undef */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, ActAppCommon, SubjectHandler, JSONModel, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActOrgDocument"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActOrgDocument",
			ListSelectionType: "Multiple",
			ListSelected: false,
			ListFilter: "",
			
			_vStatu: "",
			_vReqno: "",
			_vDocno: "",
			_vDocty: "",
			_vPersa: "",
			_vActda: "",
			_oContext: null,

			_vSelected_Reqno: "",
			_vSelected_Pernr: "",
			_vSelected_Percod: "",
			_vSelected_Actda: "",
			_vSelected_Docno: "",
			_vSelected_VoltId: "",

			_vDisplayControl: null,

			_vListLength: 0,

			_DetailViewPopover: null,
			_SortDialog: null,
			_FilterDialog: null,

			_vInitShow: false,

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
				$.app.byId(oController.PAGEID + "_SubjectList").getModel().setData({});

				var dataProcess = function () {
					oController._vInitShow = true;

					var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });

					if (oEvent) {
						oController._vStatu = oEvent.data.Statu;
						oController._vReqno = oEvent.data.Reqno;
						oController._vDocno = oEvent.data.Docno;
						oController._vDocty = oEvent.data.Docty;
						oController._oContext = oEvent.data.context;

						var oPersa = $.app.byId(oController.PAGEID + "_Persa");
						var oOrgeh = $.app.byId(oController.PAGEID + "_Orgeh");
						var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
						var oTitle = $.app.byId(oController.PAGEID + "_Title");
						var oActda = $.app.byId(oController.PAGEID + "_Actda");
						var oReqda = $.app.byId(oController.PAGEID + "_Reqda");
						var oNotes = $.app.byId(oController.PAGEID + "_Notes");

						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

						var vFirstPersa = "";
						var vFirstReqno = "";
						var vFirstOrgeh = "";
						var oPersaModel = sap.ui.getCore().getModel("PersaModel");
						var vPersaData = oPersaModel.getProperty("/PersAreaListSet") || [];

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
							vFirstPersa = vPersaData[0].Persa;
							oPersa.setSelectedKey(vFirstPersa);
							oController._vPersa = vFirstPersa;
							
							oModel.read("/AppReqDepListSet", {
								async: false,
								filters: [
									new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vFirstPersa)
								],
								success: function(oData) {
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
								error: function(oResponse) {
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
							
							oModel.read("/AppReqDepListSet", {
								async: false,
								filters: [
									new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vFirstPersa)
								],
								success: function(oData) {
									if (oData.results && oData.results.length) {
										for (var i = 0; i < oData.results.length; i++) {
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
								error: function(oResponse) {
									Common.log(oResponse);
								}
							});

							oOrgeh.setSelectedKey(vFirstOrgeh);
							oReqno.setValue(vFirstReqno);

							oTitle.setValue(mActionReqList.getProperty(oController._oContext + "/Title"));
							oTitle.setValueState(sap.ui.core.ValueState.None);
							oReqno.setValueState(sap.ui.core.ValueState.None);
							oActda.setValueState(sap.ui.core.ValueState.None);
							oReqda.setValueState(sap.ui.core.ValueState.None);

							oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));
							oActda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda")));
							oReqda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Reqda")));

							oPersa.setEnabled(false);
							oOrgeh.setEnabled(false);
							oReqno.setEnabled(true);

							oController._vActda = dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda"));
						}

						var oExt_Btn = $.app.byId(oController.PAGEID + "_Ext_Btn");
						var oComplete_Btn = $.app.byId(oController.PAGEID + "_COMPLETE_BTN");
						var oRequsetDelete_Btn = $.app.byId(oController.PAGEID + "_REQUESTDELETE_BTN");
						var modbtn = $.app.byId(oController.PAGEID + "_Mod_Btn");
						var delbtn = $.app.byId(oController.PAGEID + "_Del_Btn");
						var oExcel_Btn = $.app.byId(oController.PAGEID + "_Excel_Btn");
						
						if (oController._vStatu == "00") {
							oExt_Btn.setVisible(false);
							modbtn.setVisible(false);
							delbtn.setVisible(false);
							oComplete_Btn.setVisible(false);
							oRequsetDelete_Btn.setVisible(false);
							oExcel_Btn.setVisible(false);
						} else if (oController._vStatu == "10") {
							oRequsetDelete_Btn.setVisible(true);
						}
					}

					BusyIndicator.hide();
				}

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
			},

			onAfterShow: function () {
				this.reloadSubjectList(this);
			},

			checkAll: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID),
					vSelected = oEvent.getParameters().selected,
					oModel = $.app.byId(oController.PAGEID + "_SubjectList").getModel(),
					vTableData = oModel.getProperty("/ActionSubjectListSet");

				vTableData.forEach(function (elem, i) {
					oModel.setProperty("/ActionSubjectListSet/" + i + "/Pchk", vSelected);
				});
			},
	
			toggleCheckbox: function() {
				var oController = $.app.getController(SUB_APP_ID),
					oCheckAll = $.app.byId(oController.PAGEID + "_checkAll");
	
				oCheckAll.setSelected(false);
			},

			reloadSubjectList: function (oController) {
				var dataProcess = function () {
					oController.SubjectHandler.setSubjectList({isShowBatyp : true});
					Common.adjustViewHeightRowCount({
						tableControl: $.app.byId(oController.PAGEID + "_SubjectList"),
						rowHeight: 37,
						viewHeight: 48,
						dataCount: $.app.byId(oController.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
					});

					var extbtn = $.app.byId(oController.PAGEID + "_Ext_Btn");
					var modbtn = $.app.byId(oController.PAGEID + "_Mod_Btn");
					var delbtn = $.app.byId(oController.PAGEID + "_Del_Btn");
					var oExcel_Btn = $.app.byId(oController.PAGEID + "_Excel_Btn");
					var oComplete_Btn = $.app.byId(oController.PAGEID + "_COMPLETE_BTN");

					if (oController._vListLength > 0) {
						extbtn.setVisible(false);
						modbtn.setVisible(true);
						delbtn.setVisible(true);
						oExcel_Btn.setVisible(true);
						oComplete_Btn.setVisible(true);
					} else {
						if (this._vStatu != "00") {
							extbtn.setVisible(true);
						} else {
							extbtn.setVisible(false);
						}

						modbtn.setVisible(false);
						delbtn.setVisible(false);
						oExcel_Btn.setVisible(false);
						oComplete_Btn.setVisible(false);
					}

					BusyIndicator.hide();
				}

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
			},

			navToBack: function () {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id : "ZUI5_HR_ActApp.ActAppMain"
				});
			},

			extPerson: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

				var actionFunction = function () {
					var oActda = $.app.byId(oController.PAGEID + "_Actda");
					var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
					var updateData = {};

					updateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
					updateData.Docno = oController._vDocno;
					updateData.Pernr = "00000000";
					updateData.Percod = oController.getSessionInfoByKey("Percod");
					updateData.Reqno = oReqno.getValue();
					updateData.Docty = oController._vDocty;
					updateData.Actty = "E";

					var sPath = oModel.createKey("/ActionSubjectListSet", {
						Docno: updateData.Docno,
						VoltId: "0000000000",
						Percod: updateData.Percod,
						Actda: Common.setTime(oActda.getDateValue())
					});
						
					oModel.update(sPath, updateData, {
						success: function () {
							oController.reloadSubjectList(oController);
							Common.log("Sucess ActionSubjectListSet Update !!!");
						},
						error: function (oError) {
							Common.log(oError);
						}
					});

					BusyIndicator.hide();
				};

				BusyIndicator.show(0);

				setTimeout(actionFunction, 300);
			},

			modifyPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var mActionSubjectListSet = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = mActionSubjectListSet.getProperty("/ActionSubjectListSet");
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

				var oModel = sap.ui.getCore().getModel("ActionSubjectList");
				vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");

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
							FromPageId: "ZUI5_HR_ActApp.ActOrgDocument",
							Pernr: vActionSubjectListSet[check_idxs[0]].Pernr,
							Percod: vActionSubjectListSet[check_idxs[0]].Percod,
							PernrActda: vActionSubjectListSet[check_idxs[0]].Actda,
							PernrVoltId: vActionSubjectListSet[check_idxs[0]].VoltId
						}
					});
			},

			deletePerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var mActionSubjectListSet = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = mActionSubjectListSet.getProperty("/ActionSubjectListSet");
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

				var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");

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
									process_result = false;
									Common.log(oError);
								}
							});

							if (!process_result) {
								return;
							}
						}
					}
				};

				MessageBox.alert(oController.getBundleText("MSG_02039"), {
					title: oController.getBundleText("LABEL_02093"),
					onClose: function () {
						oController.reloadSubjectList(oController);
					}
				});

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
						success: function(oData) {
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
						error: function(oResponse) {
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

				var oExt_Btn = $.app.byId(oController.PAGEID + "_Ext_Btn");
				var oRequsetDelete_Btn = $.app.byId(oController.PAGEID + "_REQUESTDELETE_BTN");

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

				var sPath = "/ActionReqListSet";
				var process_result = false;

				if (oController._vStatu == "00") {
					oModel.create(sPath, updateData, {
						success: function (oData) {
							if (oData) {
								oController._vDocno = oData.Docno;
							}
							process_result = true;
							Common.log("Sucess ActionReqListSet Create !!!");
						},
						error: function (oError) {
							process_result = false;
							Common.log(oError);
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
							process_result = false;
							Common.log(oError);
						}
					});
				}

				if (process_result) {
					var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

					if (oController._vStatu == "00") {
						oController._vStatu = "10";

						var insertData = {};

						insertData.Persa = oPersa.getSelectedKey();
						insertData.Orgeh = oOrgeh.getSelectedKey();
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
						mActionReqList.setProperty(
							oController._oContext + "/Actda",
							new Date(Common.setTime(new Date(oActda.getValue())))
						);
						mActionReqList.setProperty(
							oController._oContext + "/Reqda",
							new Date(Common.setTime(new Date(oReqda.getValue())))
						);
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

							oExt_Btn.setVisible(true);
							oRequsetDelete_Btn.setVisible(true);
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
								process_result = false;
								Common.log(oError);
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
							FromPageId: "ZUI5_HR_ActApp.ActOrgDocument"
						}
					});
			},

			onChangeCheckBox: function () {},

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
						Common.log("Data11 : " + oCustomData[i].getKey() + ", " + oCustomData[i].getValue());
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
					oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
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
							FromPageId: "ZUI5_HR_ActApp.ActOrgDocument"
						}
					});
			},
			onResizeWindow: function () {
				$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
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

			onConfirmSortDialog: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var mParams = oEvent.getParameters();

				if (typeof mParams.sortItem != "undefined") {
					var sKey = mParams.sortItem.getKey();
					var bDescending = mParams.sortDescending;
					oController.processSort(oController, sKey, bDescending);
				}
			},

			onConfirmFilterDialog: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var mParams = oEvent.getParameters();

				oController.processFilter(oController, mParams.filterItems);
			},

			downloadExcel: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
				
				for (var i = 0; i < oController._vDisplayControl.length; i++) {
					var Fieldname = Common.underscoreToCamelCase(oController._vDisplayControl[i].Fieldname),
						TextFieldname = Fieldname + "_Tx";
						
					vCols += TextFieldname + "_Hidden|";
				}

				var params = { FileName: "ActionSubject.xls", SheetName: "Sheet", Merge: 1, HiddenColumn: 0, DownCols: vCols };
				if (typeof ActOrgDocumentSubject == "object") {
					ActOrgDocumentSubject.Down2Excel(params);
				}
			},

			onInfoViewPopup: function() {
				var oContext = this.getBindingContext(),
					oControl = this,
					oView = $.app.getView(SUB_APP_ID),
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

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null
		});
	}
);
