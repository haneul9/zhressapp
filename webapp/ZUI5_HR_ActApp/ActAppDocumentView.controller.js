sap.ui.define(
	[
		"common/Common",
		"common/SearchUser1",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/export/Spreadsheet"
	],
	function (Common, SearchUser1, CommonController, JSONModel, AcpAppCommon, SubjectHandler, BusyIndicator, MessageBox, Spreadsheet) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppDocumentView"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActAppDocumentView",
            
            ListSelectionType: "None",
			ListSelected: false,
			ListFilter: "",

			_Columns: "",

			_vStatu: "",
			_vReqno: "",
			_vDocno: "",
			_vDocty: "",
			_vPersa: "",
			_vActda: "",
			_vMolga: "",
			_oContext: null,

			_vOneReq: null,

			_PortalUri: "",

			_vSelected_Reqno: "",
			_vSelected_Pernr: "",
			_vSelected_Percod: "",
			_vSelected_Actda: "",
			_vSelected_Docno: "",
			_vSelected_VoltId: "",

			vDisplayControl: [],

			_DetailViewPopover: null,
			_PreviewDialog: null,

			_TableCellHeight: 70,
			_OtherHeight: 380,
			_vRecordCount: 0,

			_vActiveTabNames: null,

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
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });
				var oController = this;
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

				this.getSubjectHandler();
				$.app.byId(this.PAGEID + "_SubjectList").getModel().setData({});

				if (oEvent) {
					this._vStatu = oEvent.data.Statu;
					this._vReqno = oEvent.data.Reqno;
					this._vDocno = oEvent.data.Docno;
					this._vDocty = oEvent.data.Docty;
					this._oContext = oEvent.data.context;

					try {
						var sPath = oModel.createKey("/ActionReqListSet", {
							Docno: this._vDocno
						});

						oModel.read(sPath, {
							async: false,
							success: function (oData) {
								if (oData) {
									oController._vOneReq = oData;
								}
							},
							error: function (oResponse) {
								Common.log(oResponse);
							}
						});
					} catch (ex) {
						Common.log(ex);
					}

					var oStatusPanel = $.app.byId(this.PAGEID + "_StatusPanel");
					oStatusPanel.setExpanded(false);

					var oPersa = $.app.byId(this.PAGEID + "_Persa");
					var oOrgeh = $.app.byId(this.PAGEID + "_Orgeh");
					var oReqno = $.app.byId(this.PAGEID + "_Reqno");
					var oTitle = $.app.byId(this.PAGEID + "_Title");
					var oActda = $.app.byId(this.PAGEID + "_Actda");
					var oNotes = $.app.byId(this.PAGEID + "_Notes");
					var oReqda = $.app.byId(this.PAGEID + "_Reqda");

					this._vStatu = this._vOneReq.Statu;

					this._vPersa = oController._vOneReq.Persa;
					this._vActda = oController._vOneReq.Actda;

					this._PortalUri = oController._vOneReq.Uri;

					var vPostc = oController._vOneReq.Postc;

					oPersa.setText(oController._vOneReq.Pbtxt);
					var oPersaModel = sap.ui.getCore().getModel("PersaModel");
					var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
					for (var i = 0; i < vPersaData.length; i++) {
						if (oController._vOneReq.Persa == vPersaData[i].Persa) {
							this._vMolga = vPersaData[i].Molga;
							break;
						}
					}

					oOrgeh.setText(oController._vOneReq.Reqdp);

					oReqno.setText(oController._vOneReq.Reqno);
					oTitle.setText(oController._vOneReq.Title);

					oNotes.setText(oController._vOneReq.Notes);
					oActda.setText(dateFormat.format(oController._vOneReq.Actda));
					oReqda.setText(dateFormat.format(oController._vOneReq.Reqda));

					var oCompleteBtn = $.app.byId(this.PAGEID + "_COMPLETE_BTN");
					var oAnnounceBtn = $.app.byId(this.PAGEID + "_ANNOUNCE_BTN");

					if (this._vStatu == "30") {
						oCompleteBtn.setVisible(true);
						oAnnounceBtn.setVisible(true);
						oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({ key: "Postc", value: vPostc }));
						if (vPostc == "X") {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02033"));
						} else {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02032"));
						}
					} else if (this._vStatu == "20") {
						oCompleteBtn.setVisible(true);
						oAnnounceBtn.setVisible(true);
						oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({ key: "Postc", value: vPostc }));
						if (vPostc == "X") {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02033"));
						} else {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02032"));
						}
					} else if (this._vStatu == "50") {
						oCompleteBtn.setVisible(true);
						oAnnounceBtn.setVisible(true);
						oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({ key: "Postc", value: vPostc }));
						if (vPostc == "X") {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02033"));
						} else {
							oAnnounceBtn.setText(oController.getBundleText("LABEL_02032"));
						}
					} else {
						oCompleteBtn.setVisible(false);
						oAnnounceBtn.setVisible(false);
						oAnnounceBtn.removeAllCustomData();
					}
				}

				var oViewRec_Btn = $.app.byId(this.PAGEID + "_View_Rec_Btn");
				if (oController._vDocty == "20") {
					oViewRec_Btn.setVisible(true);
				} else {
					oViewRec_Btn.setVisible(false);
				}
			},

			onAfterShow: function () {
				var oController = this;

				var dataProcess = function () {
					oController._vActiveTabNames = [];

					$.app.getModel("ZHR_ACTIONAPP_SRV").read("/HiringFormTabInfoSet", {
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

					oController.setProcessFlow(oController);

					BusyIndicator.hide();
				};

				BusyIndicator.show(0);

				setTimeout(dataProcess, 100);
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

			reloadSubjectList: function (oController) {
				// var dataProcess = function () {
					if (oController._vDocty == "20") oController.SubjectHandler.setRecSubjectList();
					else oController.SubjectHandler.setSubjectList({isShowBatyp : true});

					Common.adjustViewHeightRowCount({
						tableControl: $.app.byId(oController.PAGEID + "_SubjectList"),
						rowHeight: 37,
						viewHeight: 48,
						dataCount: $.app.byId(oController.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
					});

					// BusyIndicator.hide();
				// }

				// BusyIndicator.show(0);

				// setTimeout(dataProcess, 300);
			},

			setProcessFlow: function (oController) {
				var oProcessFlow = $.app.byId(oController.PAGEID + "_ProcessFlow");
				var oStatusPanelTitle = $.app.byId(oController.PAGEID + "_StatusPanel_Title");

				oProcessFlow.removeAllLanes();
				oProcessFlow.removeAllNodes();

				var vStatusTitle = oController.getBundleText("LABEL_02269") + " : ";
				if (oController._vStatu == "10") vStatusTitle += oController.getBundleText("LABEL_02157");
				else if (oController._vStatu == "20") vStatusTitle += oController.getBundleText("LABEL_02158");
				else if (oController._vStatu == "25") vStatusTitle += oController.getBundleText("LABEL_02248");
				else if (oController._vStatu == "40") vStatusTitle += oController.getBundleText("LABEL_02160");
				else if (oController._vStatu == "30") vStatusTitle += oController.getBundleText("LABEL_02159");
				else if (oController._vStatu == "50") vStatusTitle += oController.getBundleText("LABEL_02161");

				oStatusPanelTitle.setText(vStatusTitle);

				var vLanes = [
					{
						laneId: oController.PAGEID + "_LaneHeader0",
						iconSrc: "sap-icon://create",
						text: oController.getBundleText("LABEL_02157"),
						status: "10"
					},
					{
						laneId: oController.PAGEID + "_LaneHeader1",
						iconSrc: "sap-icon://approvals",
						text: oController.getBundleText("LABEL_02158"),
						status: "20"
					},
					{
						laneId: oController.PAGEID + "_LaneHeader2",
						iconSrc: "sap-icon://sys-enter",
						text: oController.getBundleText("LABEL_02248"),
						status: "30"
					},
					{
						laneId: oController.PAGEID + "_LaneHeader3",
						iconSrc: "sap-icon://accept",
						text: oController.getBundleText("LABEL_02161"),
						status: "40"
					},
					{
						laneId: oController.PAGEID + "_LaneHeader4",
						iconSrc: "sap-icon://notification-2",
						text: oController.getBundleText("LABEL_02249"),
						status: "51"
					}
				];

				for (var i = 0; i < vLanes.length; i++) {
					var oLaneHeader = new sap.suite.ui.commons.ProcessFlowLaneHeader({
						laneId: vLanes[i].laneId,
						iconSrc: vLanes[i].iconSrc,
						text: vLanes[i].text,
						position: i,
						state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 100 }]
					}).addStyleClass("L2PCursorDefualt");

					var oNode = new sap.suite.ui.commons.ProcessFlowNode({
						laneId: vLanes[i].laneId,
						nodeId: i + "",
						title: oController.getBundleText("LABEL_02002"),
						state: sap.suite.ui.commons.ProcessFlowNodeState.Planned
					}).addStyleClass("L2PCursorDefualt");

					if (i < 4) {
						oNode.setChildren([i + 1]);
					} else {
						oNode.setChildren(null);
					}

					oProcessFlow.addLane(oLaneHeader);

					oProcessFlow.addNode(oNode);
				}

				var vNodes = oProcessFlow.getNodes();
				vLanes = oProcessFlow.getLanes();

				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy.MM.dd HH:mm" });

				try {
					$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionReqChangeHistorySet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno),
							new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
						],
						success: function (oData) {
							if (oData && oData.results) {
								for (var i = 0; i < oData.results.length; i++) {
									var vReqst = oData.results[i].Reqst;
									if (vReqst == "10") {
										if (i == oData.results.length - 1) {
											vLanes[0].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[0].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[0].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[0].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[0].setHighlighted(true);
										vNodes[0].setFocused(true);
										vNodes[0].setStateText(oController.getBundleText("LABEL_02157"));
										vNodes[0].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "20") {
										if (i == oData.results.length - 1) {
											vLanes[1].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[1].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[1].setHighlighted(true);
										vNodes[1].setFocused(true);
										vNodes[1].setStateText(oController.getBundleText("LABEL_02158"));
										vNodes[1].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "25") {
										if (i == oData.results.length - 1) {
											vLanes[1].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[1].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[1].setHighlighted(true);
										vNodes[1].setFocused(true);
										vNodes[1].setStateText(oController.getBundleText("LABEL_02248"));
										//vNodes[1].seTexts([dateFormat.format(new Date(oData.results[i].Datlo)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "30") {
										if (i == oData.results.length - 1) {
											vLanes[2].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[2].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vLanes[2].setText(oController.getBundleText("LABEL_02159"));
										vNodes[2].setHighlighted(true);
										vNodes[2].setFocused(true);
										vNodes[2].setStateText(oController.getBundleText("LABEL_02159"));
										vNodes[2].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "40") {
										if (i == oData.results.length - 1) {
											vLanes[2].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 100 }]);
											vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
										} else {
											vLanes[2].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 100 }]);
											vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
										}
										vLanes[2].setText(oController.getBundleText("LABEL_02160"));
										vNodes[2].setHighlighted(true);
										vNodes[2].setFocused(true);
										vNodes[2].setStateText(oController.getBundleText("LABEL_02160"));
										vNodes[2].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "50") {
										if (i == oData.results.length - 1) {
											vLanes[3].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[3].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[3].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[3].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[3].setHighlighted(true);
										vNodes[3].setFocused(true);
										vNodes[3].setStateText(oController.getBundleText("LABEL_02161"));
										vNodes[3].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "51") {
										if (i == oData.results.length - 1) {
											vLanes[4].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[4].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[4].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[4].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[4].setHighlighted(true);
										vNodes[4].setFocused(true);
										vNodes[4].setStateText(oController.getBundleText("LABEL_02249"));
										vNodes[4].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									} else if (vReqst == "60") {
										if (i == oData.results.length - 1) {
											vLanes[5].setState([
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 },
												{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
											]);
											vNodes[5].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
										} else {
											vLanes[5].setState([{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }]);
											vNodes[5].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
										}
										vNodes[5].setHighlighted(true);
										vNodes[5].setFocused(true);
										vNodes[5].setStateText(oController.getBundleText("LABEL_02250"));
										vNodes[5].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
									}
								}
							}
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});
				} catch (ex) {
					Common.log(ex);
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

			navToBack: function () {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: "ZUI5_HR_ActApp.ActAppMain"
				});
			},

			onAfterOpenPopover: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._vDocty == "20") {
					AcpAppCommon.onAfterOpenRecDetailViewPopover(oController);
				} else {
					AcpAppCommon.onAfterOpenDetailViewPopover(oController);
				}
			},

			onPressCell: function (oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				var oControl = oEvent.getParameter("cellControl");
				var oCustomData = oControl.getCustomData();

				oController._vSelected_Reqno = null;
				oController._vSelected_Reqno = null;
				oController._vSelected_Actda = null;

				if (oCustomData && oCustomData.length && oCustomData.length > 2) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Reqno") {
							oController._vSelected_Reqno = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Pernr") {
							oController._vSelected_Pernr = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Percod") {
							oController._vSelected_Percod = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Actda") {
							oController._vSelected_Actda = oCustomData[i].getValue();
						}
					}

					if (oController._vSelected_Reqno != "") {
						if (!oController._DetailViewPopover) {
							oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
							oView.addDependent(oController._DetailViewPopover);
						}

						oController._DetailViewPopover.openBy(oControl);
					}
				}
			},

			downloadExcel: function () {
				var oController = $.app.getController(SUB_APP_ID),
					oTable = $.app.byId(oController.PAGEID + "_SubjectList"),
					oJSONModel = oTable.getModel(),
					aSubjectList = oJSONModel.getProperty("/ActionSubjectListSet"),
					oDataSource = {},
					dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" }),
					curDate = new Date(),
					oSettings;
				
				// Delete checkbox field
				oController._Columns.splice(0, 1);

				oDataSource = aSubjectList.map(function(elem) {
					var copy = Object.assign({}, elem);
					copy.Actda = Common.DateFormatter(copy.Actda);
					copy.Ename = copy.Ename + "(" + copy.Pernr + ")";
					switch(copy.Cfmyn) {
						case "X":
							copy.Cfmyn = oController.getBundleText("LABEL_00138");	// 완료
							break;
						case "E":
							copy.Cfmyn = oController.getBundleText("LABEL_00139");	// 오류
							break;
						case "L":
							copy.Cfmyn = oController.getBundleText("LABEL_00132");	// 잠금
							break;
						default:
							copy.Cfmyn = "";
							break;
					}

					return copy;
				});

				oSettings = {
					workbook: { columns: oController._Columns },
					dataSource: oDataSource,
					worker: false, // We need to disable worker because we are using a MockServer as OData Service
					fileName: oController.getBundleText("LABEL_02002") + "-" + dateFormat.format(curDate) + ".xlsx"
				};

				if (oSettings.dataSource && oSettings.dataSource.length > 0) {
					var oSpreadsheet = new Spreadsheet(oSettings);
					oSpreadsheet.build();
				}
			},

			onPressCompelte: function () {
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
							Molga: oController._vMolga,
							context: oController._oContext,
							FromPageId: "ZUI5_HR_ActApp.ActAppDocumentView"
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
								FromPageId: "ZUI5_HR_ActApp.ActAppDocumentView"
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

			onPressDocPreview: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._PortalUri != "") {
					var win1 = window.open(oController._PortalUri, "DOCPREVIEW");
					win1.focus();
				} else {
					MessageBox.alert(oController.getBundleText("MSG_02048"));
				}
			},

			onPressPreview: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (!oController._PreviewDialog) {
					oController._PreviewDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionAppPreview", oController);
					$.app.getView(SUB_APP_ID).addDependent(oController._PreviewDialog);
				}
				oController._PreviewDialog.open();
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
				var oPanel = $.app.byId(oController.PAGEID + "_APP_HtmlPanel");
				var oHtml = new sap.ui.core.HTML({ preferDOM: true, sanitizeContent: false }).addStyleClass("L2PBackgroundWhite");

				oPanel.removeAllContent();
				oPanel.destroyContent();

				try {
					var sPath = oModel.createKey("ActionAppHtmlSet", {
						Docno: oController._vDocno
					});

					oModel.read(sPath, {
						async: false,
						success: function (oData) {
							if (oData) oHtml.setContent(oData.Htmlc);
						},
						error: function (oResponse) {
							oHtml.setContent("<div><h3 style='color:darkred'>" + oController.getBundleText("MSG_02108") + "</h3></div>");
							Common.log(oResponse);
						}
					});
				} catch (ex) {
					Common.log(ex);
				}
				
				oPanel.addContent(oHtml);
			},

			_ODialogPopupMailingList: null,
			_AddPersonDialog: null,
			_SerachOrgDialog: null,
			_oMsgObj: { Msg: "", Cnt: 0, AllSuccess: true },
			_oNum: 0,

			ProgInd: new sap.ui.commons.ProgressIndicator({
				width: "100%",
				percentValue: 0,
				displayValue: "Sending eMail, please wait... ",
				barColor: sap.ui.core.BarColor.POSITIVE
			}),

			onBeforeCloseMailingListDialog: function () {
				var oTableMail = $.app.byId("MailingList_Table");
				var oJSONModel = oTableMail.getModel();
				oJSONModel.setData(null);
			},

			onPressSendEmail: function () {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				if (!oController._ODialogPopupMailingList) {
					oController._ODialogPopupMailingList = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.MailingList", oController);
					oView.addDependent(oController._ODialogPopupMailingList);
				}
				oController._ODialogPopupMailingList.open();
			},

			onSendEmailClose: function () {
				var oController = $.app.getController(SUB_APP_ID);

				if (oController._ODialogPopupMailingList && oController._ODialogPopupMailingList.isOpen()) {
					oController._ODialogPopupMailingList.close();
				}
			},

			onSendMail: function () {
				var oController = $.app.getController(SUB_APP_ID);

				BusyIndicator.show(0);

				setTimeout(oController.onSendMailAction, 300);
			},

			// 메일전송
			onSendMailAction: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oTableMail = $.app.byId("MailingList_Table");
				var oJSONModel = oTableMail.getModel();
				var JSONData = oJSONModel.getProperty("/ActionMailingList");

				var sendMail = function () {
					var createData = {
						Docno: JSONData[oController._oNum].Docno,
						Persa: JSONData[oController._oNum].Persa,
						Reqno: JSONData[oController._oNum].Reqno,
						Pernr: JSONData[oController._oNum].Pernr,
						Rnoyn: JSONData[oController._oNum].Rnoyn ? "X" : "",
						Pnryn: JSONData[oController._oNum].Pnryn ? "X" : "",
						Payyn: JSONData[oController._oNum].Payyn ? "X" : "",
						Type: "",
						Message: ""
					};

					$.app.getModel("ZHR_ACTIONAPP_SRV").create("/ActionMailRecipientSet", createData, {
						success: function (oData) {
							if (oController._oMsgObj.Msg != "") oController._oMsgObj.Msg += "\n";
							if (oData.Type == "S") {
								oController._oMsgObj.Msg += "[" + oController.getBundleText("MSG_02031") + "] " + oData.Message;
							} else {
								oController._oMsgObj.Msg += "[" + oController.getBundleText("MSG_02032") + "] " + oData.Message;
								oController._oMsgObj.AllSuccess = false;
							}
						},
						error: function (oError) {
							Common.log(oError);
						}
					});

					oController._oNum++;
					if (oController._oMsgObj.Cnt > oController._oNum) {
						setTimeout(sendMail, 500); //, num, theObject);
						var vPercentValue = parseInt(((oController._oNum + 1) / oController._oMsgObj.Cnt) * 100);
						if (vPercentValue > 80) vPercentValue = 100;
						else vPercentValue += 20;
						oController.ProgInd.setPercentValue(vPercentValue);
					} else {
						oController.ProgInd.setPercentValue(100);
						if (oController._oMsgObj.Msg != "") {
							if (oController._oMsgObj.AllSuccess) {
								MessageBox.alert(oController._oMsgObj.Msg, {
									title: oController.getBundleText("LABEL_02241"),
									onClose: oController.onSendEmailClose,
									styleClass: "L2PMessageDialog"
								});
							} else {
								MessageBox.alert(oController._oMsgObj.Msg, {
									title: oController.getBundleText("LABEL_02241"),
									styleClass: "L2PMessageDialog"
								});
							}
						}
						
						BusyIndicator.hide();
					}
				};

				if (JSONData && JSONData.length) {
					oController._oMsgObj.Cnt = JSONData.length;
					oController._oMsgObj.Msg = "";
					oController._oMsgObj.AllSuccess = true;

					oController._oNum = 0;

					sendMail();
				} else {
					MessageBox.alert(oController.getBundleText("MSG_02049"));
					return;
				}
			},

			delPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var oTableMail = $.app.byId("MailingList_Table");
				var vContexts = oTableMail.getSelectedContexts(true);
				var oJSONModel = oTableMail.getModel();
				var JSONData = oJSONModel.getProperty("/ActionMailingList");
				var vTmp = { ActionMailingList: [] };
				var vNumbr = 1;

				if (JSONData && JSONData.length) {
					if (vContexts && vContexts.length) {
						for (var i = 0; i < JSONData.length; i++) {
							var checkDel = false;
							for (var j = 0; j < vContexts.length; j++) {
								if (JSONData[i].Pernr == vContexts[j].getProperty("LABEL_02247")) {
									checkDel = true;
									break;
								}
							}
							if (checkDel) continue;
							JSONData[i].Numbr = vNumbr++;
							vTmp.ActionMailingList.push(JSONData[i]);
						}
						oJSONModel.setData(vTmp);
					} else {
						MessageBox.alert(oController.getBundleText("MSG_02029"));
						return;
					}
				} else {
					MessageBox.alert(oController.getBundleText("MSG_02030"));
					return;
				}
			},

			// 직원검색 POPUP창을 연다 (메일수신자 추가)
			addPerson: function () {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				SearchUser1.oController = oController;
				SearchUser1.searchAuth = "A";

				if (!oController._AddPersonDialog) {
					oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
					oView.addDependent(oController._AddPersonDialog);
				}
				oController._AddPersonDialog.open();
			},

			onESSelectPerson: function () {
				var oController = $.app.getController(SUB_APP_ID);
				var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
				var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
				var oTableMail = $.app.byId("MailingList_Table");
				var oJSONModel = oTableMail.getModel();
				var JSONData = oJSONModel.getProperty("/ActionMailingList");
				var vTmp = { ActionMailingList: [] };
				var vNumbr = 1;
				var vNoData = true;

				if (vEmpSearchResult && vEmpSearchResult.length) {
					if (JSONData && JSONData.length) {
						for (var j = 0; j < JSONData.length; j++) {
							JSONData[j].Numbr = vNumbr++;
							vTmp.ActionMailingList.push(JSONData[j]);
						}
					}

					for (var i = 0; i < vEmpSearchResult.length; i++) {
						if (vEmpSearchResult[i].Chck == true) {
							var checkDup = false;
							vNoData = false;

							for (var k = 0; k < vTmp.ActionMailingList.length; k++) {
								if (mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr") == vTmp.ActionMailingList[k].Pernr) {
									checkDup = true;
									break;
								}
							}
							if (checkDup) continue;

							vTmp.ActionMailingList.push({
								Numbr: vNumbr++,
								Docno: oController._vDocno,
								Persa: oController._vPersa,
								Reqno: oController._vReqno,
								Pernr: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
								Ename: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"),
								Fulln: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
								Rnoyn: false,
								Pnryn: false,
								Payyn: false
							});
						}
					}

					if (vNoData) {
						MessageBox.alert(oController.getBundleText("MSG_02050"));
						return;
					} else {
						oJSONModel.setData(vTmp);
					}
				} else {
					MessageBox.alert(oController.getBundleText("MSG_02050"));
					return;
				}

				SearchUser1.onClose();
			},

			displayMultiOrgSearchDialog: function (oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);

				jQuery.sap.require("common.SearchOrg");

				common.SearchOrg.oController = oController;
				common.SearchOrg.vActionType = "Multi";
				common.SearchOrg.vCallControlId = oEvent.getSource().getId();
				common.SearchOrg.vCallControlType = "MultiInput";

				if (!oController._SerachOrgDialog) {
					oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
					oView.addDependent(oController._SerachOrgDialog);
				}
				oController._SerachOrgDialog.open();
			},

			onResizeWindow: function () {
				$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 350);
			},

			viewRecPerson: function () {
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
					MessageBox.alert(oController.getBundleText("MSG_02051"));
					return;
				}

				if (check_idxs.length != 1) {
					MessageBox.alert(oController.getBundleText("MSG_02052"));
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
							context: oController._oContext,
							Pdata: vActionSubjectListSet[check_idxs[0]],
							FromPageId: "ZUI5_HR_ActApp.ActAppDocumentView",
							Recno: vActionSubjectListSet[check_idxs[0]].Recno,
							VoltId: vActionSubjectListSet[check_idxs[0]].VoltId
						}
					});
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
							FromPageId: "ZUI5_HR_ActApp.ActAppDocumentView"
						}
					});
			},

			onChangeStatus: function () {
				var oController = $.app.getController(SUB_APP_ID);

				var onProcessChange = function (fVal) {
					if (fVal && fVal == "OK") {
						var updateData = {};
						updateData.Docno = oController._vDocno;
						updateData.Persa = oController._vPersa;
						updateData.Reqno = oController._vReqno;
						updateData.Actty = "S";

						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = oModel.createKey("/ActionReqListSet", {
							Docno: oController._vDocno
						});

						oModel.update(sPath, updateData, {
							success: function () {
								process_result = true;
								Common.log("Sucess ActionReqListSet UPdate !!!");
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
								Common.log(oError);
							}
						});

						if (process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02053"), {
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

				MessageBox.confirm(oController.getBundleText("MSG_02054"), {
					title: oController.getBundleText("LABEL_02053"),
					onClose: onProcessChange
				});
			},

			onInfoViewPopup: function () {
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
