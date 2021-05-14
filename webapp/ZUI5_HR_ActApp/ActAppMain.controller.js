/* eslint-disable no-native-reassign */
/* eslint-disable no-global-assign */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/export/Spreadsheet"
	],
	function (Common, CommonController, JSONModel, BusyIndicator, MessageBox, Spreadsheet) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "ActAppMain",

			_Columns : "",

			_ActPersonPopover: null,
			_ActTimelinePopover: null,
			_EmpProfilePopover: null,
			_SortDialog: null,
			_MassnDialog: null,

			_vSelectedReqnoActPerson: "",
			_vSelectedDocnoActPerson: "",
			_vSelectedReqnoActTimeline: "",
			_vSelectedDocnoActTimeline: "",
			_vSelectedPernr: "",

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf epmproductapp.EPMProductApp
			 */
			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				sap.ui.getCore().getEventBus().subscribe("ui-body", "ResizeWindow", this.onResizeWindow, this);

				gDtfmt = this.getSessionInfoByKey("Dtfmt");
			},

			onResizeWindow: function() {
				$("#ActAppMain_ICONBAR-content").css("height", (window.innerHeight - 300) + "px");	
			},

			onBeforeShow: function () {
				var oPersa = $.app.byId(this.PAGEID + "_Persa");
				var oControl = $.app.byId(this.PAGEID + "_Pbtxt");
				var vPersa = $.app.getController().getSessionInfoByKey("Persa");
				// var oIconTabbar = $.app.byId(this.PAGEID + "_ICONBAR");
				// var skey = jQuery.sap.getUriParameters().get("skey");
				// var vPersa = jQuery.sap.getUriParameters().get("Persa");

				try {
					var PersaJSONModel = new JSONModel();
					var vPersaDatas = { PersAreaListSet: [] };
					sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");

					var setPersaData = function () {
						oPersa.destroyItems();
						oControl.setText("");

						if (vPersaDatas.PersAreaListSet.length < 1) {
							// document.location.href = "NoSAuth.html";
							return;
						}

						for (var i = 0; i < vPersaDatas.PersAreaListSet.length; i++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: vPersaDatas.PersAreaListSet[i].Persa,
									text: vPersaDatas.PersAreaListSet[i].Pbtxt
								})
							);
							
							if (vPersa === vPersaDatas.PersAreaListSet[i].Persa) {
								oPersa.addSelectedKeys([vPersa]);
								oControl.setText(vPersaDatas.PersAreaListSet[i].Pbtxt);
							}

							// if (skey && skey != "") {
							// 	oIconTabbar.setSelectedKey(skey);
							// } else {
							// 	oPersa.addSelectedKeys([vPersaDatas.PersAreaListSet[0].Persa]);
							// 	oControl.setText(vPersaDatas.PersAreaListSet[0].Pbtxt);
							// }
							// if (!Common.checkNull(vPersa) && vPersa != vPersaDatas.PersAreaListSet[0].Persa) {
							// 	oPersa.addSelectedKeys([vPersa]);
							// 	oControl.setText(oControl.getText() + "," + vPersa_Txt);
							// }
						}

					};

					$.app.getModel("ZHR_ACTIONAPP_SRV").read("/PersAreaListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "1"),
							new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, $.app.getController().getSessionInfoByKey("Percod"))
						],
						success: function (oData) {
							if (oData && oData.results.length) {
								for (var i = 0; i < oData.results.length; i++) {
									vPersaDatas.PersAreaListSet.push(oData.results[i]);
								}
								PersaJSONModel.setData(vPersaDatas);
								setPersaData();
							}
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});
				} catch (ex) {
					Common.log(ex);
				}

				this.setMassn.call(this);
			},

			setMassn: function() {
				var oMassn = $.app.byId(this.PAGEID + "_Massn"),
					vPersa = $.app.byId(this.PAGEID + "_Persa").getSelectedKeys()[0];

				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: true,
					filters: [
						new sap.ui.model.Filter("PersaNc", sap.ui.model.FilterOperator.EQ, "X"),
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Massn"),
						new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, "W2"),
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa),
						new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
					success: function(data) {
						if(data && data.results) {
							data.results.forEach(function(elem) {
								oMassn.addItem(
									new sap.ui.core.Item({
									key: elem.Ecode,
									text: elem.Etext
								}));
							});
						}
					},
					error: function() {}
				});
			},

			onAfterShow: function () {
				this.onPressSearch();
			},

			handleIconTabBarSelect: function (oEvent) {
				var oController = $.app.getController();
				var oTable = $.app.byId(oController.PAGEID + "_Table");
				var oBinding = oTable.getBinding(),
					sKey = oEvent.getParameter("selectedKey"),
					oFilters = [];

				if (sKey === "creation") {
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "10"));
				} else if (sKey === "approval") {
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "20"));
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "25"));
				} else if (sKey === "confirmation") {
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "30"));
				} else if (sKey === "reject") {
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "40"));
				} else if (sKey === "complete") {
					oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "50"));
				}

				oBinding.filter(oFilters);
			},

			onPressSearch: function () {
				var oController = $.app.getController();
				var oPersa = $.app.byId(oController.PAGEID + "_Persa");
				var oReqno = $.app.byId(oController.PAGEID + "_Reqno");
				var oMassn = $.app.byId(oController.PAGEID + "_Massn");
				var oActda_From = $.app.byId(oController.PAGEID + "_Actda_From");
				var oActda_To = $.app.byId(oController.PAGEID + "_Actda_To");
				var oFilterAll = $.app.byId(oController.PAGEID + "_ICONFILTER_ALL");
				var oFilterCreate = $.app.byId(oController.PAGEID + "_ICONFILTER_CRETAE");
				var oFilterConfirm = $.app.byId(oController.PAGEID + "_ICONFILTER_CONFIRM");
				var oFilterReject = $.app.byId(oController.PAGEID + "_ICONFILTER_REJECT");
				var oFilterCompalte = $.app.byId(oController.PAGEID + "_ICONFILTER_COMPLETE");

				if (oActda_From.getValue() == "" || oActda_To.getValue() == "") {
					MessageBox.alert(oController.getBundleText("MSG_02043"));
					return;
				} else if(oActda_From.getDateValue() > oActda_To.getDateValue()) {
					MessageBox.alert(oController.getBundleText("MSG_02154"));
					return;
				}

				var aFilters = [
					new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
					new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
					new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
					new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
				];

				aFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.BT, oActda_From.getValue(), oActda_To.getValue()));

				if (oReqno.getValue() != "") {
					aFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oReqno.getValue()));
				}

				var vPersaData = oPersa.getSelectedKeys();
				var aSubFilters = [];
				if (vPersaData && vPersaData.length) {
					for (var i = 0; i < vPersaData.length; i++) {
						if (vPersaData[i]) {
							aSubFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersaData[i]));
						}
					}
				}
				if (aSubFilters.length > 0) aFilters.push(new sap.ui.model.Filter({ filters: aSubFilters, and: false }));

				aSubFilters = [];
				var vMassnData = oMassn.getSelectedKeys();
				if (vMassnData && vMassnData.length) {
					for (var j = 0; j < vMassnData.length; j++) {
						if (vMassnData[j]) {
							aSubFilters.push(new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vMassnData[j]));
						}
					}
				}
				if (aSubFilters.length > 0) aFilters.push(new sap.ui.model.Filter({ filters: aSubFilters, and: false }));

				BusyIndicator.show(0);

				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				var vActionReqList = { ActionReqListSet: [] };

				var vReqCntAll = 0,
					vReqCnt1 = 0,
					vReqCnt3 = 0,
					vReqCnt4 = 0,
					vReqCnt5 = 0;

				var readAfterProcess = function () {
					oFilterAll.setCount(vReqCntAll);
					oFilterCreate.setCount(vReqCnt1);
					oFilterConfirm.setCount(vReqCnt3);
					oFilterReject.setCount(vReqCnt4);
					oFilterCompalte.setCount(vReqCnt5);

					var oTable = $.app.byId(oController.PAGEID + "_Table");

					var oIconTabbar = $.app.byId(oController.PAGEID + "_ICONBAR");
					var sKey = oIconTabbar.getSelectedKey();

					var oBinding = oTable.getBinding();
					var oFilters = [];

					if (sKey === "creation") {
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "10"));
					} else if (sKey === "approval") {
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "20"));
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "25"));
					} else if (sKey === "confirmation") {
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "30"));
					} else if (sKey === "reject") {
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "40"));
					} else if (sKey === "complete") {
						oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "50"));
					}
					oBinding.filter(oFilters);

					BusyIndicator.hide();
				};

				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionReqListSet", {
					async: true,
					filters: aFilters,
					success: function (oData) {
						if (oData && oData.results) {
							for (var i = 0; i < oData.results.length; i++) {
								var oneData = oData.results[i];

								vActionReqList.ActionReqListSet.push(oneData);

								if (oData.results[i].Statu == "10") vReqCnt1++;
								else if (oData.results[i].Statu == "30") vReqCnt3++;
								else if (oData.results[i].Statu == "40") vReqCnt4++;
								else if (oData.results[i].Statu == "50") vReqCnt5++;
							}
							vReqCntAll = oData.results.length;
							mActionReqList.setData(vActionReqList);

							readAfterProcess();
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
						BusyIndicator.hide();
					}
				});
			},

			onChnageComboBox: function () {
				var oController = $.app.getController();
				var vPersas = $.app.byId(oController.PAGEID + "_Persa").getSelectedItems();
				var vMassns = $.app.byId(oController.PAGEID + "_Massn").getSelectedItems();
				var oControl = $.app.byId(oController.PAGEID + "_Pbtxt");
				var vFilterInfo = [];

				if (!oControl) return;

				vPersas.forEach(function(elem) {
					vFilterInfo.push(elem.getText());
				});
				vMassns.forEach(function(elem) {
					vFilterInfo.push(elem.getText());
				});
				
				oControl.setText(vFilterInfo.join(", "));
			},

			createAction: function () {
				var oController = $.app.getController();

				if (!oController._MassnDialog) {
					oController._MassnDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SelectDoctype", oController);
					$.app.getView().addDependent(oController._MassnDialog);
				}

				oController._MassnDialog.open();
			},

			onSMClose: function () {
				var oController = $.app.getController();

				if (oController._MassnDialog && oController._MassnDialog.isOpen()) {
					oController._MassnDialog.close();
				}
			},

			onSMSelectType: function () {
				var oController = $.app.getController();
				var toPageId = "";
				var vDocty = "";
				var oPersa = $.app.byId(oController.PAGEID + "_Persa");
				var vPersa = oPersa.getSelectedItems().length ? oPersa.getSelectedItems()[0].getKey() : "1000";

				for (var i = 1; i <= 6; i++) {
					var oControl = $.app.byId(oController.PAGEID + "_SM_RadioButton" + i);
					if (oControl) {
						if (oControl.getSelected()) {
							var vCustomData = oControl.getCustomData();
							if (vCustomData && vCustomData.length) {
								for (var j = 0; j < vCustomData.length; j++) {
									if (vCustomData[j].getKey() == "PageId") {
										toPageId = vCustomData[j].getValue();
									} else if (vCustomData[j].getKey() == "Docty") {
										vDocty = vCustomData[j].getValue();
									}
								}
							}
							break;
						}
					}
				}

				if (toPageId != "") {
					sap.ui.getCore().getEventBus().publish("nav", "to", {
						id: toPageId,
						data: {
							Statu: "00",
							Reqno: "",
							Docno: "",
							Docty: vDocty,
							Persa: vPersa
						}
					});
				} else {
					MessageBox.alert("Invalid Action Document Type");
				}

				oController.onSMClose();
			},

			onSelectRow: function (oEvent) {
				var oContext = oEvent.getParameters().rowBindingContext,
					mActionReqList = sap.ui.getCore().getModel("ActionReqList"),
					vStatu = mActionReqList.getProperty(oContext + "/Statu"),
					vDocty = mActionReqList.getProperty(oContext + "/Docty");

				if (vStatu == "10") {
					var mDocTypeList = sap.ui.getCore().getModel("DocTypeList"),
						vDocTypeList = mDocTypeList.getProperty("/DocTypeListSet"),
						vToPage = "";

					for (var i = 0; i < vDocTypeList.length; i++) {
						if (vDocTypeList[i].Docty == vDocty) {
							vToPage = vDocTypeList[i].PageId;
							break;
						}
					}
					if (vToPage != "") {
						sap.ui
							.getCore()
							.getEventBus()
							.publish("nav", "to", {
								id: vToPage,
								data: {
									context: oContext,
									Statu: vStatu,
									Reqno: mActionReqList.getProperty(oContext + "/Reqno"),
									Docno: mActionReqList.getProperty(oContext + "/Docno"),
									Docty: mActionReqList.getProperty(oContext + "/Docty"),
									Entrs: mActionReqList.getProperty(oContext + "/Entrs")
								}
							});
					} else {
						MessageBox.alert("Invalid Action Document Type");
					}
				} else {
					sap.ui
						.getCore()
						.getEventBus()
						.publish("nav", "to", {
							id: "ZUI5_HR_ActApp.ActAppDocumentView",
							data: {
								context: oContext,
								Statu: vStatu,
								Reqno: mActionReqList.getProperty(oContext + "/Reqno"),
								Docno: mActionReqList.getProperty(oContext + "/Docno"),
								Docty: mActionReqList.getProperty(oContext + "/Docty")
							}
						});
				}
			},

			onPressRow: function (oEvent) {
				var oContext = oEvent.getSource().getBindingContext(),
					mActionReqList = sap.ui.getCore().getModel("ActionReqList"),
					vStatu = mActionReqList.getProperty(oContext + "/Statu"),
					vDocty = mActionReqList.getProperty(oContext + "/Docty");

				if (vStatu == "10") {
					var mDocTypeList = sap.ui.getCore().getModel("DocTypeList"),
						vDocTypeList = mDocTypeList.getProperty("/DocTypeListSet"),
						vToPage = "";

					for (var i = 0; i < vDocTypeList.length; i++) {
						if (vDocTypeList[i].Docty == vDocty) {
							vToPage = vDocTypeList[i].PageId;
							break;
						}
					}
					if (vToPage != "") {
						sap.ui
							.getCore()
							.getEventBus()
							.publish("nav", "to", {
								id: vToPage,
								data: {
									context: oContext,
									Statu: vStatu,
									Reqno: mActionReqList.getProperty(oContext + "/Reqno"),
									Docno: mActionReqList.getProperty(oContext + "/Docno"),
									Docty: mActionReqList.getProperty(oContext + "/Docty"),
									Entrs: mActionReqList.getProperty(oContext + "/Entrs")
								}
							});
					} else {
						MessageBox.alert("Invalid Action Document Type");
					}
				} else {
					sap.ui
						.getCore()
						.getEventBus()
						.publish("nav", "to", {
							id: "ZUI5_HR_ActApp.ActAppDocumentView",
							data: {
								context: oContext,
								Statu: vStatu,
								Reqno: mActionReqList.getProperty(oContext + "/Reqno"),
								Docno: mActionReqList.getProperty(oContext + "/Docno"),
								Docty: mActionReqList.getProperty(oContext + "/Docty")
							}
						});
				}
			},

			displayPopoverEmpProfile: function () {
				var oController = $.app.getController();
				var oControl = this;
				var oCustomData = oControl.getCustomData();

				if (oCustomData && oCustomData.length) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Pernr") {
							oController._vSelectedPernr = oCustomData[i].getValue();
							break;
						}
					}
				}

				if (!oController._EmpProfilePopover) {
					oController._EmpProfilePopover = sap.ui.jsfragment("fragment.EmpProfilePopover", oController);
					$.app.getView().addDependent(oController._EmpProfilePopover);
				}

				oController._EmpProfilePopover.openBy(oControl);
			},

			onBeforeOpenPopoverEmpProfile: function () {
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_COMMON_SRV");
				var oEname = $.app.byId(oController.PAGEID + "_EP_ENAME");
				var oFulln = $.app.byId(oController.PAGEID + "_EP_FULLN");
				var oPhoto = $.app.byId(oController.PAGEID + "_EP_PHOTO");
				var oCelno = $.app.byId(oController.PAGEID + "_EP_CELNO");
				var oTelno = $.app.byId(oController.PAGEID + "_EP_TELNO");
				var oEmail = $.app.byId(oController.PAGEID + "_EP_EMAIL");
				var oPbtxt = $.app.byId(oController.PAGEID + "_EP_PBTXT");
				var oZzempwptx = $.app.byId(oController.PAGEID + "_EP_ZZEMPWPTX");

				try {
					var sPath = oModel.createKey("EmpQuickProfileSet", {
						Pernr: oController._vSelectedPernr
					});

					oModel.read(sPath, {
						async: false,
						success: function (oData) {
							if (oData) {
								oEname.setText(oData.Ename);
								oFulln.setText(oData.Fulln);
								oCelno.setText(oData.Celno);
								oCelno.setHref("tel:" + oData.Celno);
								oTelno.setText(oData.Telno);
								oEmail.setText(oData.Email);
								oEmail.setHref("mailto://" + oData.Email);
								oPbtxt.setText(oData.Pbtxt);
								oZzempwptx.setText(oData.Zzempwptx);
								oPhoto.setSrc(oData.Photo);
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

			displayPopoverActPerson: function () {
				var oController = $.app.getController();
				var oControl = this;
				var oCustomData = oControl.getCustomData();

				if (oCustomData && oCustomData.length) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Reqno") {
							oController._vSelectedReqnoActPerson = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Docno") {
							oController._vSelectedDocnoActPerson = oCustomData[i].getValue();
						}
					}
				}

				if (!oController._ActPersonPopover) {
					oController._ActPersonPopover = sap.ui.jsfragment("fragment.ActPersonPopover", oController);
					$.app.getView().addDependent(oController._ActPersonPopover);
				}

				oController._ActPersonPopover.openBy(oControl);
			},

			onBeforeOpenPopoverActPerson: function () {
				var oController = $.app.getController();
				var oList = $.app.byId(oController.PAGEID + "_AP_List");
				var oListItem = $.app.byId(oController.PAGEID + "_AP_ListItem");

				var filterString = "?$filter=Reqno%20eq%20%27" + encodeURIComponent(oController._vSelectedReqnoActPerson) + "%27";
				filterString += "%20and%20Docno%20eq%20%27" + oController._vSelectedDocnoActPerson + "%27";
				filterString += "%20and%20ICusrid%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "%27";
				filterString += "%20and%20ICusrse%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "%27";
				filterString += "%20and%20ICusrpn%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "%27";
				filterString += "%20and%20ICmenuid%20eq%20%27" + $.app.getMenuId() + "%27";

				oList.bindItems("/ActionEmpSummaryListSet/" + filterString, oListItem);
			},

			displayPopoverActTimeline: function () {
				var oController = $.app.getController();
				var oControl = this;
				var oCustomData = oControl.getCustomData();

				if (oCustomData && oCustomData.length) {
					for (var i = 0; i < oCustomData.length; i++) {
						if (oCustomData[i].getKey() == "Reqno") {
							oController._vSelectedReqnoActTimeline = oCustomData[i].getValue();
						} else if (oCustomData[i].getKey() == "Docno") {
							oController._vSelectedDocnoActTimeline = oCustomData[i].getValue();
						}
					}
				}

				if (!oController._ActTimelinePopover) {
					oController._ActTimelinePopover = sap.ui.jsfragment("fragment.ActTimelinePopover", oController);
					$.app.getView().addDependent(oController._ActTimelinePopover);
				}

				oController._ActTimelinePopover.openBy(oControl);
			},

			onBeforeOpenPopoverActTimeline: function () {
				var oController = $.app.getController();
				var oTimeline = $.app.byId(oController.PAGEID + "_AT_Timeline");
				var oTimeItem = $.app.byId(oController.PAGEID + "_AT_TimeItem");

				oTimeline.bindAggregation("content", {
					path: "/ActionReqChangeHistorySet",
					template: oTimeItem,
					filters: [new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vSelectedReqnoActTimeline), new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vSelectedDocnoActTimeline)]
				});
			},

			onPressSort: function () {
				var oController = $.app.getController();

				if (!oController._SortDialog) {
					oController._SortDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionReqListSort", oController);
					$.app.getView().addDependent(oController._SortDialog);
				}

				oController._SortDialog.open();
			},

			onConfirmSortDialog: function (oEvent) {
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				var oDatas = mActionReqList.getProperty("/ActionReqListSet");

				var mParams = oEvent.getParameters();
				var sKey = mParams.sortItem.getKey();
				var bDescending = mParams.sortDescending;

				if (bDescending) {
					oDatas.sort(function (a, b) {
						var a1 = a[sKey];
						var b1 = b[sKey];
						return a1 < b1 ? 1 : a1 > b1 ? -1 : 0;
					});
				} else {
					oDatas.sort(function (a, b) {
						var a1 = a[sKey];
						var b1 = b[sKey];
						return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
					});
				}

				var vNewDatas = { ActionReqListSet: [] };

				for (var i = 0; i < oDatas.length; i++) {
					oDatas[i].Numbr = i + 1 + "";
					vNewDatas.ActionReqListSet.push(oDatas[i]);
				}

				mActionReqList.setData(vNewDatas);
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

			/*
			 * Excel download
			 */
			downloadExcel: function () {
				var oController = $.app.getController(),
					oTable = $.app.byId(oController.PAGEID + "_Table"),
					oJSONModel = oTable.getModel(),
					dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" }),
					curDate = new Date(),
					oSettings = {
						workbook: { columns: oController._Columns },
						dataSource: oJSONModel.getProperty("/ActionReqListSet"),
						worker: false, // We need to disable worker because we are using a MockServer as OData Service
						fileName: oController.getBundleText("LABEL_02002") + "-" + dateFormat.format(curDate) + ".xlsx"
					};

				var oSpreadsheet = new Spreadsheet(oSettings);
				oSpreadsheet.build();
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null
		});
	}
);
