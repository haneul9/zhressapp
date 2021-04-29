sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/export/Spreadsheet"
	],
	function (Common, CommonController, ActAppCommon, SubjectHandler, JSONModel, BusyIndicator, MessageBox, Spreadsheet) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRecDocument"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActRecDocument",
            
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
			_vMolga: "41",
			_vIntca: "",
			_oContext: null,
			_vSelectedPersa: "",

			_vSelected_Reqno: "",
			_vSelected_Pernr: "",
			_vSelected_Actda: "",
			_vSelected_Docno: "",
			_vSelected_VoltId: "",

			vDisplayControl: [],
			vExcelDownControl: [],
			_DetailViewPopover: null,

			_TableCellHeight: 34,
			_OtherHeight: 380,
			_vRecordCount: 0,

			_vListLength: 0,
			_vActionCount: 0,

			_vActiveTabNames: null,

			_vRehireCount: 0,
			_ODialogPopup_RehireDataSelect: null,
			oBusyIndicator: null,

			oSubjectList: null,

			getSubjectHandler: function() {
				this.SubjectHandler = SubjectHandler.initialize(this);
	
				return this.SubjectHandler;
			},

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf ZUI5_HR_ActApp.ActRecDocument
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
			
			onBeforeShow: function() {
				this.getSubjectHandler();
				$.app.byId(this.PAGEID + "_SubjectList").getModel().setData({});
			},
            
			onAfterShow: function (oEvent) {
				var oController = this;
				oController._vListLength = 0;

				var dataProcess = function () {

					var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy.MM.dd" });
					var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });

					if (oEvent) {
						oController._vStatu = oEvent.data.Statu;
						oController._vReqno = oEvent.data.Reqno;
						oController._vDocno = oEvent.data.Docno;
						oController._vDocty = oEvent.data.Docty;
						oController._vEntrs = oEvent.data.Entrs;
						oController._oContext = oEvent.data.context;
						oController._vSelectedPersa = oEvent.data.SelectedPersa;
						var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
						var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
						var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
						var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
						var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
						var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");

						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

						var oPersaModel = sap.ui.getCore().getModel("PersaModel");
						var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

						var vFirstReqno = "";
						var vFirstOrgeh = "";

						//신규작성인 경우
						if (oController._vStatu == "00") {
							oPersa.removeAllItems();
							oOrgeh.removeAllItems();

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

							oActda.setValue(dateFormat.format(new Date()));

							oPersa.setEnabled(true);
							oOrgeh.setEnabled(true);
							oReqno.setEnabled(true);

						} else if (oController._vStatu == "10") {
							//작성중인 경우
							var mActionReqList = sap.ui.getCore().getModel("ActionReqList");

							oPersa.removeAllItems();
							oOrgeh.removeAllItems();

							var vFirstPersa = mActionReqList.getProperty(oController._oContext + "/Persa");
							var vFirstReqdp = mActionReqList.getProperty(oController._oContext + "/Reqdp");
							vFirstReqno = mActionReqList.getProperty(oController._oContext + "/Reqno");
							vFirstOrgeh = mActionReqList.getProperty(oController._oContext + "/Orgeh");

							var isExists = false;
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

							oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));
							oActda.setValue(dateFormat.format(new Date(mActionReqList.getProperty(oController._oContext + "/Actda"))));

							oPersa.setEnabled(false);
							oOrgeh.setEnabled(false);
							oReqno.setEnabled(true);

							oController._vActda = dateFormat2.format(new Date(mActionReqList.getProperty(oController._oContext + "/Actda")));
						}

						oController._vActiveTabNames = [];
						oModel.read("/HiringFormTabInfoSet", {
							async: false,
							filters: [
								new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, oController._vMolga)
							],
							success: function (oData) {
								if (oData && oData.results.length) {
									for (var i = 0; i < oData.results.length; i++) {
										oController._vActiveTabNames.push(oData.results[i]);
									}
								}
							},
							error: function (oResponse) {
								Common.log(oResponse);
							}
						});

						oController.reloadSubjectList(oController);

						//Control제어
						var oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
						var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
						var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
						var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
						var oMod_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
						var oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
						var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
						var oModRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Rec_Btn");
						var oViewRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_View_Rec_Btn");
						var oSyncRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Sync_Rec_Btn");
						var oSyncToolbar = sap.ui.getCore().byId(oController.PAGEID + "_SyncToolbar");
						var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");

						//신규작성인 경우
						if (oController._vStatu == "00") {
							oAdd_Btn.setVisible(false);
							oMod_Btn.setVisible(false);
							oDel_Btn.setVisible(false);
							oAddRec_Btn.setVisible(false);
							oModRec_Btn.setVisible(false);
							oViewRec_Btn.setVisible(false);
							oSyncRec_Btn.setVisible(false);
							oSyncToolbar.setVisible(false);
							// oRequset_Btn.setVisible(false);
							oComplete_Btn.setVisible(false);
							oRequsetDelete_Btn.setVisible(false);
							oUpload_Btn.setVisible(false);
							oExcel_Btn.setVisible(false);
						} else if (oController._vStatu == "10") {
							oAddRec_Btn.setVisible(true);
							oRequsetDelete_Btn.setVisible(true);
						}
					}	// end if

					BusyIndicator.hide();
				};	// end function

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
			},

			onAfterHide: function () {},

			reloadSubjectList: function (oController) {
				// var dataProcess = function () {
					oController.oSubjectList = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList");

					oController.SubjectHandler.setRecSubjectList();
					Common.adjustViewHeightRowCount({
						tableControl: $.app.byId(oController.PAGEID + "_SubjectList"),
						rowHeight: 37,
						viewHeight: 48,
						dataCount: $.app.byId(oController.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
					});

					var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn"),
						oMod_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn"),
						oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn"),
						oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn"),
						oModRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Rec_Btn"),
						oViewRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_View_Rec_Btn"),
						oSyncRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Sync_Rec_Btn"),
						oSyncToolbar = sap.ui.getCore().byId(oController.PAGEID + "_SyncToolbar"),
						oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN"),
						oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN"),
						oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");

					if (oController._vListLength > 0) {
						oAddRec_Btn.setVisible(true);
						oModRec_Btn.setVisible(true);
						oViewRec_Btn.setVisible(true);

						if (oController._vRehireCount > 0) {
							oSyncToolbar.setVisible(true);
							oSyncRec_Btn.setVisible(true);
						} else {
							oSyncRec_Btn.setVisible(false);
							oSyncToolbar.setVisible(false);
						}
						oAdd_Btn.setVisible(true);
						oMod_Btn.setVisible(true);
						oDel_Btn.setVisible(true);
						oExcel_Btn.setVisible(true);
						if (oController._vActionCount > 0) {
							oComplete_Btn.setVisible(true);
						} else {
							oComplete_Btn.setVisible(false);
						}
						oUpload_Btn.setVisible(false);
					} else {
						oAddRec_Btn.setVisible(true);
						oModRec_Btn.setVisible(false);
						oViewRec_Btn.setVisible(false);
						oSyncRec_Btn.setVisible(false);

						oAdd_Btn.setVisible(false);
						oMod_Btn.setVisible(false);
						oDel_Btn.setVisible(false);
						oExcel_Btn.setVisible(false);

						oComplete_Btn.setVisible(false);
						oUpload_Btn.setVisible(true);
					}

					// BusyIndicator.hide();
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
					oModel = sap.ui
						.getCore()
						.byId(oController.PAGEID + "_SubjectList")
						.getModel(),
					vTableData = oModel.getProperty("/ActionSubjectListSet");

				vTableData.forEach(function (elem, i) {
					oModel.setProperty("/ActionSubjectListSet/" + i + "/Pchk", vSelected);
				});
			},

			toggleCheckbox: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oCheckAll = sap.ui.getCore().byId(oController.PAGEID + "_checkAll");

				oCheckAll.setSelected(false);
			},

			addPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var vActionCount = 0;

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
							for (var i = 0; i < oData.results.length; i++) {
								if (oData.results[i].Batyp == "A" && oData.results[i].Massn1 == "") {
									vActionCount++;
								}
							}
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});

				if (vActionCount < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02132"), {});
					return;
				}

				var vActda = oController._vActda;
				vActda.replace(".", "-");

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActAppPersonInfo",
						data: {
							actiontype: "300",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Entrs: oController._vEntrs,
							Actda: vActda,
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument"
						}
					});
			},

			modifyPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var oModel = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");

				var vCheckRows = 0;
				var vCheckIndx;
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							vCheckRows++;
							vCheckIndx = i;
						}
					}
				}

				if (vCheckRows < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				} else if (vCheckRows > 1) {
					MessageBox.alert(oController.getBundleText("MSG_02036"));
					return;
				}

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx);

				if (vOneRecord.Cfmyn == "X") {
					MessageBox.alert(oController.getBundleText("MSG_02037"));
					return;
				}

				var vSelectedMassn1 = vOneRecord.Massn1;
				if (vSelectedMassn1 == "") {
					MessageBox.alert(oController.getBundleText("MSG_02056"));
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
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							Pdata: vOneRecord,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument",
							Pernr: vOneRecord.Pernr,
							Percod: vOneRecord.Percod,
							PernrActda: vOneRecord.Actda,
							PernrVoltId: vOneRecord.VoltId
						}
					});
			},

			deletePerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oActionSubjectModel = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = oActionSubjectModel.getProperty("/ActionSubjectListSet");

				var vCheckRows = 0;
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							vCheckRows++;
						}
					}
				}

				if (vCheckRows < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02038"));
					return;
				}

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");

				var onProcessDelete = function (fVal) {
					if (fVal && fVal == "OK") {
						var process_result = false;
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var sPath = "";

						for (var i = 0; i < vActionSubjectListSet.length; i++) {
							if (vActionSubjectListSet[i].Pchk == true) {
								var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + i);

								if (vOneRecord.Cfmyn == "X") {
									MessageBox.alert(oController.getBundleText("MSG_02037"));
									return;
								}

								process_result = false;

								sPath = oModel.createKey("/ActionSubjectListSet", {
									Docno: oController._vDocno,
									Percod: vOneRecord.Percod,
									VoltId: vOneRecord.VoltId,
									Actda: vOneRecord.Actda
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
				var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
				var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
				var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
				var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
				var vItem = oPersa.getSelectedItem();

				if (!vItem) return;

				var vPersa = vItem.getKey();
				var vFirstReqno = "";
				var vFirstOrgeh = "";

				oController._vPersa = vPersa;
				oOrgeh.removeAllItems();

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

				oController._vIntca = vItem.getCustomData()[1].getValue("Intca");
			},

			onChangeOrgeh: function (oEvent) {
				var oController = $.app.getController(SUB_APP_ID);

				var oOrgeh = oEvent.getSource();
				var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
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

				var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
				var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
				var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
				var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
				var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
				var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");

				oReqno.setValueState(sap.ui.core.ValueState.None);
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);

				var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
				var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
				var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");

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

				var updateData = {};
				var vEapprovalyn = "";
				updateData.Percod = oController.getSessionInfoByKey("Percod");
				updateData.Persa = oPersa.getSelectedKey();
				updateData.Orgeh = oOrgeh.getSelectedKey();
				updateData.Reqno = oReqno.getValue();
				updateData.Title = oTitle.getValue();

				updateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
				var curDate = new Date();
				updateData.Reqda = "/Date(" + Common.getTime(dateFormat.format(curDate)) + ")/";
				updateData.Notes = oNotes.getValue();

				updateData.Docty = oController._vDocty;

				var sPath = "/ActionReqListSet";
				var process_result = false;
				var errData = null;

				if (oController._vStatu == "00") {
					oModel.create(sPath, updateData, {
						async: false,
						success: function (oData) {
							if (oData) {
								oController._vDocno = oData.Docno;
								vEapprovalyn = oData.Eapprovalyn;
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
					updateData.Docno = oController._vDocno;

					sPath = oModel.createKey("/ActionReqListSet", {
						Docno: oController._vDocno
					});

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

							oAddRec_Btn.setVisible(true);
							oRequsetDelete_Btn.setVisible(true);
							if (oController._vListLength > 0) {
								oUpload_Btn.setVisible(false);
							} else {
								oUpload_Btn.setVisible(true);
							}
						}
					});
				} else {
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);

					if (errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: oController.getBundleText("LABEL_00149")
						});
					}
				}
			},

			onPressDelete: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

				var onProcessDelete = function (fVal) {
					if (fVal && fVal == "OK") {
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

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
				var vCfmynCount = 0;

				// 발령확정 자를 제외 한 지원자 수.
				if (vActionSubjectList && vActionSubjectList.length) {
					for (var i = 0; i < vActionSubjectList.length; i++) {
						if (vActionSubjectList[i].Cfmyn == "X") {
							vCfmynCount++;
						}
					}
				}

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
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							ActRecCount: vCfmynCount,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument"
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
					oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionRecDetailView", oController);
					oView.addDependent(oController._DetailViewPopover);
				}

				oController._DetailViewPopover.openBy(oControl);
			},

			onAfterOpenPopover: function () {
				var oController = $.app.getController(SUB_APP_ID);

				ActAppCommon.onAfterOpenRecDetailViewPopover(oController);
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
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument"
						}
					});
			},

			onResizeWindow: function () {
				$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
			},

			addRecPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var vActda = oController._vActda;
				if(vActda.indexOf(".") > -1) vActda = vActda.replace(/[.]/g, "-");

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActRecPInfo",
						data: {
							actiontype: "C",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: vActda,
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument",
							Recno: "",
							VoltId: ""
						}
					});
			},

			modifyRecPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var oModel = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");

				var vCheckRows = 0;
				var vCheckIndx;
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							vCheckRows++;
							vCheckIndx = i;
						}
					}
				}

				if (vCheckRows < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				} else if (vCheckRows > 1) {
					MessageBox.alert(oController.getBundleText("MSG_02036"));
					return;
				}

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx);

				if (vOneRecord.Cfmyn == "X") {
					MessageBox.alert(oController.getBundleText("MSG_02037"));
					return;
				}

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActRecPInfo",
						data: {
							actiontype: "M",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							Pdata: vOneRecord,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument",
							Recno: vOneRecord.Recno,
							VoltId: vOneRecord.VoltId
						}
					});
			},

			syncRecPerson: function () {
				var oView = $.app.getView(SUB_APP_ID);
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
					MessageBox.alert(oController.getBundleText("MSG_02133"));
					return;
				}

				if (!oController._ODialogPopup_RehireDataSelect) {
					oController._ODialogPopup_RehireDataSelect = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Rehire_DataSelect", oController);
					oView.addDependent(oController._ODialogPopup_RehireDataSelect);
				}

				oController._ODialogPopup_RehireDataSelect.open();
			},

			onConfirmRehireDataSelect: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = mActionSubjectList.getProperty("/ActionSubjectListSet");

				var check_idxs = [];
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							check_idxs.push(i);
						}
					}
				}

				var vSelectedTabIds = [];
				for (var t = 0; t < oController._vActiveTabNames.length; t++) {
					if (oController._vActiveTabNames[t].Tabid == "01") {
						continue;
					}

					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[t].Tabid);
					if (oControl && oControl.getSelected() == true) {
						vSelectedTabIds.push(oController._vActiveTabNames[t].Tabid);
					}
				}

				if (oController._ODialogPopup_RehireDataSelect.isOpen()) {
					oController._ODialogPopup_RehireDataSelect.close();
				}

				var actionFunction = function () {
					var process_result = false;

					for (var i = 0; i < check_idxs.length; i++) {
						if (vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
							MessageBox.alert(oController.getBundleText("MSG_02037"));
							return;
						}

						var vOneData = {};
						vOneData.Accty = "S";
						vOneData.Docno = vActionSubjectListSet[check_idxs[i]].Docno;
						vOneData.VoltId = vActionSubjectListSet[check_idxs[i]].VoltId;

						for (var t = 0; t < vSelectedTabIds.length; t++) {
							vOneData["Cnt" + vSelectedTabIds[t]] = "X";
						}

						process_result = false;

						$.app.getModel("ZHR_ACTIONAPP_SRV").create("/RecruitingSubjectsSet", vOneData, {
							success: function () {
								process_result = true;
								Common.log("Sucess RecruitingSubjectsSet Create !!!");
							},
							error: function (oError) {
								BusyIndicator.hide();

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

					BusyIndicator.hide();

					MessageBox.alert(oController.getBundleText("MSG_02134"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose: function () {
							oController.reloadSubjectList(oController);
						}
					});
				};

				BusyIndicator.show(0);

				setTimeout(actionFunction, 300);
			},

			onBeforeOpenRehireDataSelect: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_DataSelect_Layout");

				var oCell = null,
					oRow = null;

				if (oMatrixLayout) {
					for (var i = 0; i < oController._vActiveTabNames.length; i++) {
						if (oController._vActiveTabNames[i].Tabid == "01") {
							continue;
						}

						oRow = new sap.ui.commons.layout.MatrixLayoutRow();

						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign: sap.ui.commons.layout.HAlign.Begin,
							vAlign: sap.ui.commons.layout.VAlign.Middle,
							content: [new sap.m.Label({ text: oController._vActiveTabNames[i].Tabtl }).addStyleClass("L2PFontFamily")]
						}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
						oRow.addCell(oCell);

						var oControl = new sap.m.CheckBox(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid, {
							width: "95%",
							selected: false
						});

						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign: sap.ui.commons.layout.HAlign.Begin,
							vAlign: sap.ui.commons.layout.VAlign.Middle,
							content: oControl
						}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
						oRow.addCell(oCell);

						oMatrixLayout.addRow(oRow);
					}
				}
			},

			onAfterCloseRehireDataSelect: function () {
				var oController = $.app.getController(SUB_APP_ID);

				for (var i = 0; i < oController._vActiveTabNames.length; i++) {
					if (oController._vActiveTabNames[i].Tabid == "01") {
						continue;
					}

					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid);
					if (oControl) {
						oControl.destroy();
					}
				}

				var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_DataSelect_Layout");

				if (oMatrixLayout) {
					oMatrixLayout.removeAllRows();
					oMatrixLayout.destroyRows();
				}
			},

			onCancelRehireDataSelect: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._ODialogPopup_RehireDataSelect.isOpen()) {
					oController._ODialogPopup_RehireDataSelect.close();
				}
			},

			viewRecPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var oModel = sap.ui.getCore().getModel("ActionSubjectList");
				var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");

				var vCheckRows = 0;
				var vCheckIndx;
				if (vActionSubjectListSet && vActionSubjectListSet.length) {
					for (var i = 0; i < vActionSubjectListSet.length; i++) {
						if (vActionSubjectListSet[i].Pchk == true) {
							vCheckRows++;
							vCheckIndx = i;
						}
					}
				}

				if (vCheckRows < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				} else if (vCheckRows > 1) {
					MessageBox.alert(oController.getBundleText("MSG_02036"));
					return;
				}

				var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
				var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx);

				if (vOneRecord.Cfmyn == "X") {
					MessageBox.alert(oController.getBundleText("MSG_02037"));
					return;
				}

				sap.ui
					.getCore()
					.getEventBus()
					.publish("nav", "to", {
						id: "ZUI5_HR_ActApp.ActRecPInfo",
						data: {
							actiontype: "V",
							Persa: oController._vPersa,
							Statu: oController._vStatu,
							Reqno: oController._vReqno,
							Docno: oController._vDocno,
							Docty: oController._vDocty,
							Actda: oController._vActda,
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							Pdata: vOneRecord,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument",
							Recno: vOneRecord.Recno,
							VoltId: vOneRecord.VoltId
						}
					});
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
							Molga: oController._vMolga,
							Intca: oController._vIntca,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActRecDocument"
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
					oTable = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList"),
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

			doOnCheck: function (rowId, cellInd, state) {
				var oController = $.app.getController(SUB_APP_ID),
					mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList"),
					vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet"),
					vPernr = "";

				if (oController.oSubjectList) {
					vPernr = oController.oSubjectList.getUserData(rowId, "Pernr");
				}

				if (vPernr == "") return;

				var r_idx = -1;
				for (var i = 0; i < vActionSubjectList.length; i++) {
					if (vPernr == vActionSubjectList[i].Pernr) {
						r_idx = i;
						break;
					}
				}
				if (r_idx != -1) {
					mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", state);
				}
			},

			onInfoViewPopup: function () {
				var oContext = this.getBindingContext(),
					oControl = this,
					oView = $.app.getView(SUB_APP_ID),
					oController = $.app.getController(SUB_APP_ID),
					oTable = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList"),
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
