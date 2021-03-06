/* eslint-disable no-eval */
/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/AttachFileAction",
        "common/EmployeeModel",
        "sap/ui/core/BusyIndicator",
        "sap/m/MessageBox",
        "common/Check_Regno"
    ],
    function (Common, CommonController, JSONModelHelper, AttachFileAction, EmployeeModel, BusyIndicator, MessageBox) {
        "use strict";

        return CommonController.extend("ZUI5_HR_FamilyApply.FamilyApply", {
            PAGEID: "FamilyApply",
			
			BusyDialog: new sap.m.BusyDialog().addStyleClass("centerAlign"),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _Docid: "",
            _Bukrs: "",
            _SessionData: {},
            _ViewData: {},
            _tData: null,
            _vArr: [],
            EmployeeModel: new EmployeeModel(),
            _SelectData: null,
            _ModiData: {},
			_onDialog: "N",
			
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            loadModel: function (oController) {
                var oServiceURL = oController.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
                var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
                oModel.setCountSupported(false);
                oModel.setRefreshAfterChange(false);
                sap.ui.getCore().setModel(oModel, "ZHR_COMMON_SRV");
                var oServiceURL2 = oController.getUrl("/sap/opu/odata/sap/ZHR_BENEFIT_SRV/");
                var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
                oModel2.setCountSupported(false);
                oModel2.setRefreshAfterChange(false);
                sap.ui.getCore().setModel(oModel2, "ZHR_BENEFIT_SRV");
            },

            onBeforeShow: function () {
                var oController = this;
                oController._SessionData = oController.getView().getModel("session").getData();
                this._ListCondJSonModel.setData({ Data: oController.getView().getModel("session").getData() });
                this.onSearch();
            },

            getTxt: function (vTxt, vNo) {
                var redStar = "<span style='color:#ce3b3b;font-weight:bold;font-size:14px;'>*</span>";
                return vNo == 15 || vNo == 16 || vNo == 17 || vNo == 18 || vNo == 29 || vNo == 30 ? "<span style='font-weight:bold;font-size:14px;'>" + oBundleText.getText(vTxt) + "</span>" + redStar : "<span style='font-weight:bold;font-size:14px;'>" + oBundleText.getText(vTxt) + "</span>";
            },

            initTdata: function () {
                var oController = $.app.getController();
                oController._tData = {
                    Famsat: "",
                    Kdsvht: "",
                    Fcnam: "",
                    Regnot: "",
                    Zzbdate: null,
                    Fgbdt: null,
                    Fasext: "",
                    Fasart: "",
                    Dptid: "",
                    Livid: "",
                    Helid: "",
                    Apdat: null,
                    Status: "",
                    Reqrs: "",
                    Emetl: "",
                    Notes: "",
                    Famsa: "",
                    Kdsvh: "",
                    Fanat: "KR",
                    Fgbld: "KR",
                    Fasar: "",
                    Lnmhg: "",
                    Fnmhg: "",
                    Regno: "",
                    Zzclass: "1",
                    Appnm: "",
                    Opener: "X"
                };
            },

            onClose: function () {
                var oController = $.app.getController();
                if (oController.oDialog.isOpen()) {
                    oController.oDialog.close();
                    oController.onSearch();
                }
            },

            onDialog: function (flag) {
                var oController = $.app.getController();
                oController._onDialog = flag;
                if (!oController.oDialog) {
                    oController.oDialog = sap.ui.jsfragment("ZUI5_HR_FamilyApply.fragment.popup", oController);
                    $.app.getView().addDependent(oController.oDialog);
                }
                oController.initTdata();
                oController.oDialog.open();
            },

            onRe: function () {
                var oController = $.app.getController();
                var oJSON = $.app.byId(oController.PAGEID + "_Dialog").getModel();
                oJSON.setProperty("/oData/0/Opener", "X");
                oController.setAttachFile(oController, {
                    Required: true,
                    InfoMessage: oBundleText.getText("LABEL_44030"),
                    Mode: "S",
                    Max: "1",
                    Editable: true
                });
                $.app.byId(oController.PAGEID + "_Re").setVisible(false);
            },

            onAfterOpen: function () {
				var oController = $.app.getController();
				var oDialog = $.app.byId(oController.PAGEID + "_Dialog");
                var oJSON = new sap.ui.model.json.JSONModel();
                var aData = { oData: [] };
				
                if (oController._tData.Regno !== "" && oController._tData.Regno.search("-") === -1) {
					oController._tData.Regno = oController._tData.Regno.substring(0, 6) + "-" + oController._tData.Regno.substring(6);
                }
				
				aData.oData.push(oController._tData);
                oJSON.setData(aData);
				oDialog.setModel(oJSON);
                oDialog.bindElement("/oData/0");
				
				oController.onChange("B");
				
				var vAppnm = oJSON.getProperty("/oData")[0].Appnm;
				var vStatus = oJSON.getProperty("/oData")[0].Opener;
				
                oDialog.setBusyIndicatorDelay(0).setBusy(true);
				
                setTimeout(function () {
					if (oController._onDialog == "N") {
						oController.initTdata();
						oDialog.setTitle(oBundleText.getText("LABEL_44037"));
					} else if (oController._onDialog == "M") {
						if (oController._tData.Opener == "X") {
							oDialog.setTitle(oBundleText.getText("LABEL_44038"));
						} else {
							oDialog.setTitle(oBundleText.getText("LABEL_44039"));
						}
						if (oController._tData.Status == "") {
							$.app.byId(oController.PAGEID + "_Sel1").setEditable(false);
							$.app.byId(oController.PAGEID + "_Sel2").setEditable(false);
						}
					}

                    oController._ModiData = {
                        Name: $.app.byId(oController.PAGEID + "_Lnmhg").getValue().trim() + $.app.byId(oController.PAGEID + "_Fnmhg").getValue().trim(),
                        Regno: $.app.byId(oController.PAGEID + "_Regno").getValue().trim()
                    };
					
					var vSetFileData = {
                        Appnm: vAppnm,
                        Required: true,
                        InfoMessage: oBundleText.getText("LABEL_44030"),
                        Mode: "S",
                        Max: "1",
                        Editable: vStatus == "X" ? true : false
                    };

                    if (oController._onDialog == "M") {
                        if (oJSON.getProperty("/oData")[0].Opener != "X" && (oJSON.getProperty("/oData")[0].Status == "99" || oJSON.getProperty("/oData")[0].Status == "")) {
							$("#" + oController.PAGEID + "_ModLine").css("display", "none");
							$("#" + oController.PAGEID + "_ModLine2").css("display", "none");
                        } else {
							$("#" + oController.PAGEID + "_ModLine").css("display", "");
							$("#" + oController.PAGEID + "_ModLine2").css("display", "");
                        }
                    } else {
						$("#" + oController.PAGEID + "_ModLine").css("display", "none");
						$("#" + oController.PAGEID + "_ModLine2").css("display", "");
                    }
					
					if (oController._onDialog == "M") {
						vSetFileData.InfoMessage = oBundleText.getText("LABEL_44043");
						
                        if (oJSON.getProperty("/oData")[0].Opener == "X" && (oJSON.getProperty("/oData")[0].Status == "" || oJSON.getProperty("/oData")[0].Status == "88" || oJSON.getProperty("/oData")[0].Status == "99")) {
                            vSetFileData.Editable = true;
                            vSetFileData.Appnm = "";
                            oController.setAttachFile(oController, vSetFileData);
                        } else if (oJSON.getProperty("/oData")[0].Opener != "X" && (oJSON.getProperty("/oData")[0].Status == "" || oJSON.getProperty("/oData")[0].Status == "88" || oJSON.getProperty("/oData")[0].Status == "99")) {
                            vSetFileData.Editable = false;
                            vSetFileData.Appnm = "";
                            oController.setAttachFile(oController, vSetFileData);
                        } else {
                            vSetFileData.Editable = false;
                            delete vSetFileData.InfoMessage;
                            oController.setAttachFile(oController, vSetFileData);
                        }
                    } else {
                        vSetFileData.Editable = true;
                        vSetFileData.InfoMessage = oBundleText.getText("LABEL_44030");
                        oController.setAttachFile(oController, vSetFileData);
					}
					
                    oDialog.setBusy(false);
                }, 500);
            },

            onAfterShow: function () {
                this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
            },

            chkAll: function () {
                // var	oController = $.app.getController();
            },

            onModLines: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.FamilyApply");
                var oController = oView.getController();
                var oSessionData = oController._ListCondJSonModel.getProperty("/Data");
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oSels = oTable.getSelectedIndices();
                if (oSels.length != 1) {
                    MessageBox.alert(oBundleText.getText("MSG_44018"));
                    return;
                }
                var oPro = oTable.getModel().getProperty("/oData")[oSels[0]];
                var vTmp = false;
                if (oPro.Status != "" && oPro.Status != "99") {
                    vTmp = true;
                    MessageBox.alert(oBundleText.getText("MSG_44020"));
                    return;
                }
                if (!vTmp) {
                    oPro.Pernr = oSessionData.Pernr;
                    oPro.Opener = "X";
                    oController.onDialog("M");
                    oController._tData = oPro;
                    oController.setAttachFile(oController, {
                        Required: true,
                        InfoMessage: oBundleText.getText("LABEL_44030"),
                        Mode: "S",
                        Max: "1",
                        Editable: true
                    });
                    if (oPro.Status == "") {
                        $.app.byId(oController.PAGEID + "_Sel1").setEditable(false);
                        $.app.byId(oController.PAGEID + "_Sel2").setEditable(false);
                    }
                    oController._ModiData = {
                        Name:
                            $.app
                                .byId(oController.PAGEID + "_Lnmhg")
                                .getValue()
                                .trim() +
                            $.app
                                .byId(oController.PAGEID + "_Fnmhg")
                                .getValue()
                                .trim(),
                        Regno: $.app
                            .byId(oController.PAGEID + "_Regno")
                            .getValue()
                            .trim()
                    };
                }
            },
            //refresh
            setAttachFile: function (oController, opt) {
                var options = $.extend(
                        true,
                        {
                            Editable: false,
                            InfoMessage: "",
                            Appnm: "",
                            Mode: "S", // S: single file, M: multi file
                            Max: 2,
                            Required: false,
                            HelpButton: false,
                            HelpTextList: []
                        },
                        opt
                    ),
                    oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
                    oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX");

                oFileUploader.setValue("");

                options.ListMode = options.Editable ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
                options.FileTypes = ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "jpg", "bmp", "gif", "png", "txt", "pdf", "jpeg"];
                if (!common.Common.isEmptyArray(opt.FileTypes)) options.FileTypes = opt.FileTypes;

                oAttachbox.getModel().setProperty("/Settings", options);
                oAttachbox.getModel().setProperty("/DelelteDatas", []);
                oController.refreshAttachFileList(oController);
            },

            /*
             * ???????????? ???????????? Binding??????.
             */
            refreshAttachFileList: function (oController, vExistDataFlag) {
                var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner"),
                    oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
                    oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
                    oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
                    oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
                    JSonModel = oAttachbox.getModel(),
                    vAttachFileDatas = JSonModel.getProperty("/Data"),
                    vAppnm = JSonModel.getProperty("/Settings/Appnm"),
                    Datas = { Data: [] };

                if (!vAppnm) {
                    JSonModel.setProperty("/Settings/Length", 0);
                    JSonModel.setProperty("/Data", []);
                    return;
				}
				
				oAttachbox.setBusyIndicatorDelay(0).setBusy(true);

                if (f1) f1.setAttribute("value", "");

                oFileUploader.clear();
                oFileUploader.setValue("");
                oAttachFileList.removeSelections(true);

                oModel.read("/FileListSet", {
                    async: true,
                    filters: [new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)],
                    success: function (data) {
                        if (data && data.results.length) {
                            data.results.forEach(function (elem) {
                                elem.New = false;
                                elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);

                                Datas.Data.push(elem);
							});
							
							// DB?????? ??? ?????? File List ??? ????????? ?????????. ( ????????? DB??? ?????? ??? File List ??? ???????????? ????????? )
							if (vExistDataFlag == "X" && vAttachFileDatas) {
								vAttachFileDatas.forEach(function (elem) {
									if (elem.New === true) Datas.Data.push(elem);
								});
							}
			
							JSonModel.setProperty("/Settings/Length", Datas.Data.length);
							JSonModel.setProperty("/Data", Datas.Data);
						}

						oAttachbox.setBusy(false);
                    },
                    error: function (res) {
						common.Common.log(res);
						oAttachbox.setBusy(false);
                    }
                });
            },

            onDeleteLines: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.FamilyApply");
                var oController = oView.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._ListCondJSonModel.getProperty("/Data");
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oSels = oTable.getSelectedIndices();
                if (oSels.length != 1) {
                    MessageBox.alert(oBundleText.getText("MSG_44018"));
                    return;
                }
                var oPro = oTable.getModel().getProperty("/oData")[oSels[0]];
                oPro.Pernr = oSessionData.Pernr;
                // var vTmp=false;
                if (oPro.Status != "" && oPro.Status != "99") {
                    // vTmp=true;
                    MessageBox.alert(oBundleText.getText("MSG_44021"));
                    return;
                }

                function goRealDel() {
                    var vData2 = {
                        IMode: "D",
                        IBukrs: "1000",
                        IPernr: oSessionData.Pernr,
                        ILangu: oSessionData.Langu,
                        IDatum: "/Date(" + new Date().getTime() + ")/",
                        FamilyupdateTablein1: [oPro],
                        FamilyupdateTablein2: [],
                        FamilyupdateTablein3: [],
                        FamilyupdateTablein4: []
                    };

                    if (vData2.Status !== "") {
                        vData2.FamilyupdateTablein1[0].Seqnr = oPro.Seqnr;
                    }

                    delete vData2.FamilyupdateTablein1[0].Opener;

                    oModel.create("/FamilyupdateSet", vData2, {
                        success: function () {
                            MessageBox.alert(oBundleText.getText("MSG_44004"), {
                                title: oBundleText.getText("LABEL_35023"),
                                onClose: function () {
                                    oTable.clearSelection();
                                    oController.onSearch();
                                }
                            });
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                                else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            } else {
                                MessageBox.alert(oError.toString());
                            }
                        }
                    });
                }
				
                MessageBox.show(oBundleText.getText("MSG_44003"), {
                    icon: MessageBox.Icon.INFORMATION,
                    title: oBundleText.getText("LABEL_35023"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (fVal) {
                        if (fVal == "YES") {
                            goRealDel();
                        }
                    }
                });
                //}
            },

            changeFile: function () {
                var oController = $.app.getController(),
                    reader = new FileReader(),
                    f = jQuery.sap.domById(oController.PAGEID + "_UPLOAD_BTN" + "-fu").files[0];

                reader.readAsArrayBuffer(f);
            },

            getSelector: function () {
                var oController = $.app.getController();
                var oSel1 = $.app.byId(oController.PAGEID + "_Sel1");
                var oSel2 = $.app.byId(oController.PAGEID + "_Sel2");
                var oSel3 = $.app.byId(oController.PAGEID + "_Sel3");
                var oSel4 = $.app.byId(oController.PAGEID + "_Sel4");
                var oSel5 = $.app.byId(oController.PAGEID + "_Sel5");

                oSel1.removeAllItems();
                oSel1.addItem(new sap.ui.core.Item({ text: "", key: "" }));
                oSel2.removeAllItems();
                oSel2.addItem(new sap.ui.core.Item({ text: "", key: "" }));
                oSel3.removeAllItems();
                oSel3.addItem(new sap.ui.core.Item({ text: "", key: "" }));
                oSel4.removeAllItems();
                oSel4.addItem(new sap.ui.core.Item({ text: "", key: "" }));
                oSel5.removeAllItems();
                oSel5.addItem(new sap.ui.core.Item({ text: "", key: "" }));

                var sData = oController._ViewData.FamilyupdateTablein3.results;
                var oSel1Data = [];

                if (sData && sData.length) {
                    for (var i = 0; i < sData.length; i++) {
                        if (i != 0) {
                            if (sData[i].Famsa != sData[i - 1].Famsa) {
                                oSel1Data.push(sData[i]);
                            }
                        } else {
                            oSel1Data.push(sData[i]);
                        }
                    }
                }
                oSel1Data.forEach(function (e) {
                    oSel1.addItem(new sap.ui.core.Item({ text: e.Famsat, key: e.Famsa }));
                });

                var sData2 = (oController._SelectData || {}).NavCommonCodeList.results;

                if (sData2 && sData2.length) {
                    for (var j = 0; j < sData2.length; j++) {
                        if (sData2[j].Code == "KR") {
                            oSel3.addItem(new sap.ui.core.Item({ text: sData2[j].Text, key: sData2[j].Code }));
                            oSel4.addItem(new sap.ui.core.Item({ text: sData2[j].Text, key: sData2[j].Code }));
                            break;
                        }
                    }

                    sData2.sort(function (a, b) {
                        // ?????? ????????????
                        return a.Text < b.Text ? -1 : a.Text > b.Text ? 1 : 0;
                    });

                    for (var k = 0; k < sData2.length; k++) {
                        if (sData2[k].Code != "KR" && sData2[k].Code != "TF") {
                            oSel3.addItem(new sap.ui.core.Item({ text: sData2[k].Text, key: sData2[k].Code }));
                            oSel4.addItem(new sap.ui.core.Item({ text: sData2[k].Text, key: sData2[k].Code }));
                        }
                    }
                    oSel3.setSelectedKey("KR");
                    oSel4.setSelectedKey("KR");
                }
                var sData3 = oController._ViewData.FamilyupdateTablein4.results;
                if (sData3 && sData3.length) {
                    for (var p = 0; p < sData3.length; p++) {
                        oSel5.addItem(new sap.ui.core.Item({ text: sData3[p].Fasart, key: sData3[p].Fasar }));
                    }
                }
                for (var m = 1; m <= 5; m++) {
                    if (m != 3 && m != 4) {
                        eval("oSel" + m + ".setSelectedKey('');");
                    }
                }
            },

            onChange: function (flag) {
                var oController = $.app.getController();
                var oSel1 = $.app.byId(oController.PAGEID + "_Sel1");
				var oSel2 = $.app.byId(oController.PAGEID + "_Sel2");
                var sData = oController._ViewData.FamilyupdateTablein3.results;
				
                oSel2.removeAllItems();
                oSel2.addItem(new sap.ui.core.Item({ text: "", key: "" }));
				
				if (sData && sData.length) {
                    for (var i = 0; i < sData.length; i++) {
                        if (oSel1.getSelectedKey() == sData[i].Famsa) {
                            oSel2.addItem(new sap.ui.core.Item({ text: sData[i].Kdsvht, key: sData[i].Kdsvh }));
                        }
                    }
                }
                if (flag != "B") {
                    oSel2.setSelectedKey("");
                }
            },

            oTableInit: function () {
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oFields = ["Famsat", "Kdsvht", "Fcnam", "Regnot", "Zzbdatet", "Fasext", "Fasart", "Dptid", "Livid", "Helid", "Apdat", "StatusText", "Notes"];
                var oWidths = ["", "120px", "140px", "120px", "120px", "160px", "90px", "120px", "120px", "90px", "120px", "120px", "120px", ""];
                var oLabels = [];

                oTable.destroyColumns();

                for (var i = 2; i < 15; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }

                    oLabels.push({ Label: "LABEL_440" + i, Width: oWidths[i - 1], Align: "Center" });
                }

                oLabels.forEach(function (e, i) {
                    var oCol = new sap.ui.table.Column({
                        flexible: false,
                        autoResizable: true,
                        resizable: true,
                        showFilterMenuEntry: true,
                        filtered: false,
                        sorted: false
                    });
                    oCol.setWidth(e.Width);
                    oCol.setHAlign(e.Align);
                    oCol.setLabel(new sap.m.Text({ text: oBundleText.getText(e.Label), textAlign: e.Align }).addStyleClass("font-medium"));

                    if (i == 7 || i == 8 || i == 9) {
                        oCol.setTemplate(
                            new sap.ui.core.Icon({
                                src: "sap-icon://accept",
                                color: {
                                    path: oFields[i],
                                    formatter: function (fVal) {
                                        return fVal == "X" ? "black" : "white";
                                    }
                                }
                            })
                        );
                    } else if (i == 10) {
                        oCol.setTemplate(
                            new sap.ui.commons.TextView({
                                text: {
                                    path: oFields[i],
                                    type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                },
                                textAlign: "Center"
                            }).addStyleClass("FontFamily")
                        );
                    } else {
                        oCol.setTemplate(new sap.ui.commons.TextView({ text: "{" + oFields[i] + "}", textAlign: "Center" }).addStyleClass("FontFamily"));
                    }
                    oTable.addColumn(oCol);
                });
            },

            onSearch: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.FamilyApply");
                var oController = oView.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
				var oJSON = new sap.ui.model.json.JSONModel();
				var aData = { oData: [] };
                var vData = {
                    IMode: "L",
                    IBukrs: "1000",
                    IPernr: oSessionData.Pernr,
                    IDatum: "/Date(" + new Date().getTime() + ")/",
                    ILangu: oSessionData.Langu,
                    FamilyupdateTablein1: [],
                    FamilyupdateTablein2: [],
                    FamilyupdateTablein3: [],
                    FamilyupdateTablein4: []
                };

                oModel.create("/FamilyupdateSet", vData, {
                    success: function (data) {
                        if (data) {
                            oController._ViewData = data;
                            if (data && data.FamilyupdateTablein1.results.length) {
                                data.FamilyupdateTablein1.results.forEach(function (e) {
                                    if (e.Zzbdatet != "0000-00-00") {
                                        if (e.Zzclass === "2") {
                                            e.Zzbdatet = e.Zzbdatet + " (" + oBundleText.getText("LABEL_44033") + ")";
                                        } else {
                                            e.Zzbdatet = e.Zzbdatet + " (" + oBundleText.getText("LABEL_44036") + ")";
                                        }
                                    } else {
                                        e.Zzbdatet = "";
                                    }
                                    if (e.Status == "" || e.Status == "99") {
                                        e.Opener = "X";
                                    } else {
                                        e.Opener = "";
                                    }
                                    aData.oData.push(e);
                                });

                                if (data.FamilyupdateTablein1.results.length > 10) {
                                    oTable.setVisibleRowCount(10);
                                } else {
                                    oTable.setVisibleRowCount(data.FamilyupdateTablein1.results.length);
                                }
                            }
                            oJSON.setData(aData);
                        }
                    },
                    error: function (oError) {
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                        } else {
                            MessageBox.alert(oError.toString());
                        }
                    }
                });

                oTable.setModel(oJSON);
				oTable.bindRows("/oData");
				
				if(oController._SelectData === null) {
					$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", {
						ICodeT: "009",
						IPernr: oSessionData.Pernr,
						NavCommonCodeList: [],
						IMolga: oSessionData.Molga
					}, {
						success: function (data) {
							if (data) {
								oController._SelectData = data;
							}
						},
						error: function (oError) {
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
								else MessageBox.alert(Err.error.innererror.errordetails[0].message);
							} else {
								MessageBox.alert(oError.toString());
							}
						}
					});
				}
            },

            onSelectedRow: function (oEvent) {
                var oController = $.app.getController();
                var sPath = oEvent.getParameters().rowBindingContext.sPath;
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oData = oTable.getModel().getProperty(sPath);
                oData.Opener = "";
                oController.onDialog("M");
                oController._tData = oData;
            },

            nextPage1: function () {},

            onCloseDialog: function () {
                var oController = $.app.getController();
                $.app.byId(oController.PAGEID + "_Dialog").close();
            },

            onAutoInputReg: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.FamilyApply");
                var oController = oView.getController();
                var oPro = $.app
                    .byId(oController.PAGEID + "_Dialog")
                    .getModel()
                    .getProperty("/oData")[0];
                var s = oEvent.getParameter("value");
                var oId = oEvent.getSource().getId();
                var vGender = "";

                if (s.length > 0 && s.length < 7 && isNaN(s)) {
                    $.app.byId(oId).setValue();
                }
                if (!/\*/.test(oEvent.getSource().getValue())) {
                    s = s.replace(/-/g, "");
                }
                if ($.app.byId(oId).getValue().search("-") == -1) {
                    if (isNaN(s)) {
                        $.app.byId(oId).setValue();
                    }
                }
                if (s.length == 13) {
                    if ($.app.byId(oId).getValue().search("-") == -1) {
                        $.app.byId(oId).setValue($.app.byId(oId).getValue().substring(0, 6) + "-" + $.app.byId(oId).getValue().substring(6));
                    }

                    vGender = $.app.byId(oId).getValue().substring(7, 8);

                    if (vGender == "3" || vGender == "4" || vGender == "7" || vGender == "8") {
                        oPro.Fgbdt = new Date("20" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                        oPro.Zzbdate = new Date("20" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                    } else {
                        oPro.Fgbdt = new Date("19" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                        oPro.Zzbdate = new Date("19" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                    }
                } else if (s.length == 14) {
                    vGender = $.app.byId(oId).getValue().substring(7, 8);

                    if (vGender == "3" || vGender == "4" || vGender == "7" || vGender == "8") {
                        oPro.Fgbdt = new Date("20" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                        oPro.Zzbdate = new Date("20" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                    } else {
                        oPro.Fgbdt = new Date("19" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                        oPro.Zzbdate = new Date("19" + $.app.byId(oId).getValue().substring(0, 2) + "-" + $.app.byId(oId).getValue().substring(2, 4) + "-" + $.app.byId(oId).getValue().substring(4, 6));
                    }
                }

                var oRrn = oController.rrn($.app.byId(oId).getValue());

                $.app.byId(oId).setValue(oRrn);
            },

            checkNull: function (str) {
                if (typeof str == "undefined" || str == null || str == "") {
                    return true;
                } else {
                    return false;
                }
            },

            rrn: function (str) {
                var oController = $.app.getController();
                var originStr = str;
                var rrnStr;
                var maskingStr;

                if (oController.checkNull(originStr)) {
                    return originStr;
                }

                rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8]{1}[0-9]{6}\b/gi);

                if (!oController.checkNull(rrnStr)) {
                    maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/(-?)([1-8]{1})([0-9]{6})\b/gi, "$1$2******"));
                } else {
                    rrnStr = originStr.match(/\d{13}/gi);

                    if (oController.checkNull(rrnStr) == false) {
                        maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/([0-9]{6})$/gi, "******"));
                    } else {
                        return originStr;
                    }
                }

                $.app
                    .byId(oController.PAGEID + "_Dialog")
                    .getModel()
                    .setProperty("/oData/0/Regno", originStr);

                return maskingStr;
            },

            onValid: function (oController) {
                var oPro = $.app
                    .byId(oController.PAGEID + "_Dialog")
                    .getModel()
                    .getProperty("/oData")[0];
                var oMsg = "";
                var vStatus = $.app
                    .byId(oController.PAGEID + "_Dialog")
                    .getModel()
                    .getProperty("/oData")[0].Status;
                if (oPro.Famsa == "") {
                    oMsg = oBundleText.getText("MSG_44005");
                }
                if (oController._onDialog != "M" && vStatus == "") {
                    if (oPro.Kdsvh == "") {
                        oMsg = oBundleText.getText("MSG_44006");
                    }
                }
                if (oPro.Lnmhg.trim() == "" || oPro.Fnmhg.trim() == "") {
                    oMsg = oBundleText.getText("MSG_44007");
                }
                if (oPro.Fgbdt == "Invalid Date") {
                    oMsg = oBundleText.getText("MSG_44019");
                }
                if (!/\*/.test(oPro.Regnot)) {
                    if (oPro.Regno.trim() === "") {
                        oMsg = oBundleText.getText("MSG_44008");
                    }
                    if (oPro.Regno.length != 14) {
                        oMsg = oBundleText.getText("MSG_44019");
                    }
                }

                if (
                    $.app
                        .byId(oController.PAGEID + "_Dialog")
                        .getModel()
                        .getProperty("/oData")[0].Opener == "X" &&
                    oController._onDialog == "N"
                ) {
                    if (AttachFileAction.getFileLength(oController) === 0) {
                        oMsg = oController.getBundleText("MSG_21007");
                    }
                }
                if (oController._onDialog == "M") {
                    if (vStatus == "99" || vStatus == "" || vStatus == "88") {
                        if (
                            oController._ModiData.Name !=
                            $.app
                                .byId(oController.PAGEID + "_Lnmhg")
                                .getValue()
                                .trim() +
                                $.app
                                    .byId(oController.PAGEID + "_Fnmhg")
                                    .getValue()
                                    .trim()
                        ) {
                            if (AttachFileAction.getFileLength(oController) === 0) {
                                oMsg = oController.getBundleText("MSG_21007");
                            }
                            if (oPro.Reqrs.trim() == "") {
                                oMsg = oBundleText.getText("MSG_44016");
                            }
                        }
                        if (
                            oController._ModiData.Regno !=
                            $.app
                                .byId(oController.PAGEID + "_Regno")
                                .getValue()
                                .trim()
                        ) {
                            if (AttachFileAction.getFileLength(oController) === 0) {
                                oMsg = oController.getBundleText("MSG_21007");
                            }
                            if (oPro.Reqrs.trim() == "") {
                                oMsg = oBundleText.getText("MSG_44016");
                            }
                        }
                    }
                } else {
                    if (AttachFileAction.getFileLength(oController) === 0) {
                        oMsg = oController.getBundleText("MSG_21007");
                    }
                }
                if (oMsg != "") {
                    MessageBox.alert(oMsg);
                    return false;
                }

                var vRegChk = common.Check_Regno.isValidJuminNo(oPro.Regno.split("-")[0] + oPro.Regno.split("-")[1]),
                    vBirth = parseInt(oPro.Regno.split("-")[0]),
                    vGender = oPro.Regno.split("-")[1].substring(0, 1);

                if (vBirth >= 201001 && (vGender === "3" || vGender === "4" || vGender === "7" || vGender === "8")) {
                    Common.log(oPro.Regno);
                } else {
                    if (!/\*/.test(oPro.Regnot) && !vRegChk) {
                        MessageBox.show(oBundleText.getText("MSG_44013"), {
                            icon: MessageBox.Icon.INFORMATION,
                            title: oBundleText.getText("LABEL_35023"),
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (fVal) {
                                if (fVal == "YES") {
                                    oController.onSaveProcess(oController);
                                }
                            }
                        });
                        return false;
                    }
                }
                return true;
            },

            onSaveProcess: function (oController) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._ListCondJSonModel.getProperty("/Data");
                var oPro = $.app
                    .byId(oController.PAGEID + "_Dialog")
                    .getModel()
                    .getProperty("/oData")[0];
                oPro.Pernr = oSessionData.Pernr;
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
                oPro.Appnm = AttachFileAction.uploadFile.call(oController);
                var vData2 = {
                    IMode: "I",
                    IBukrs: "1000",
                    IPernr: oSessionData.Pernr,
                    ILangu: oSessionData.Langu,
                    IDatum: "/Date(" + new Date().getTime() + ")/",
                    FamilyupdateTablein1: [oPro],
                    FamilyupdateTablein2: [],
                    FamilyupdateTablein3: [],
                    FamilyupdateTablein4: [],
                    FamilyupdateExport: []
                };
                if (AttachFileAction.getFileLength(oController) != 0) {
                    vData2.IFile = "X";
                }

                if (oController._onDialog === "M") {
                    vData2.IMode = "U";
                    vData2.FamilyupdateTablein1[0].Seqnr = vData2.FamilyupdateTablein1[0].Seqnr;
                } else {
                    vData2.IMode = "I";
                    vData2.FamilyupdateTablein1[0].Seqnr = "";
                }

                if ($.app.byId(oController.PAGEID + "_Dptid").getSelected()) {
                    vData2.FamilyupdateTablein1[0].Dptid = "X";
                } else {
                    vData2.FamilyupdateTablein1[0].Dptid = "";
                }
                if ($.app.byId(oController.PAGEID + "_Livid").getSelected()) {
                    vData2.FamilyupdateTablein1[0].Livid = "X";
                } else {
                    vData2.FamilyupdateTablein1[0].Livid = "";
                }
                if ($.app.byId(oController.PAGEID + "_Helid").getSelected()) {
                    vData2.FamilyupdateTablein1[0].Helid = "X";
                } else {
                    vData2.FamilyupdateTablein1[0].Helid = "";
                }
                if ($.app.byId(oController.PAGEID + "_Zzclass").getSelected()) {
                    vData2.FamilyupdateTablein1[0].Zzclass = "2";
                } else {
                    vData2.FamilyupdateTablein1[0].Zzclass = "1";
                }

                if (vData2.FamilyupdateTablein1[0].Regno === "") {
                    vData2.FamilyupdateTablein1[0].Fasex = "";
                } else {
                    if (vData2.FamilyupdateTablein1[0].Regno.split("-")[1].substring(0, 1) == "1" || vData2.FamilyupdateTablein1[0].Regno.split("-")[1].substring(0, 1) == "3") {
                        vData2.FamilyupdateTablein1[0].Fasex = "1";
                    } else {
                        vData2.FamilyupdateTablein1[0].Fasex = "2";
                    }
                }

                if (oPro.Zzbdate != "" && oPro.Zzbdate != null && oPro.Zzbdate != "Invalid Date") {
                    vData2.FamilyupdateTablein1[0].Zzbdate = dateFormat.format(vData2.FamilyupdateTablein1[0].Zzbdate);
                    vData2.FamilyupdateTablein1[0].Zzbdate = new Date(vData2.FamilyupdateTablein1[0].Zzbdate + "T09:00:00");
                } else {
                    vData2.FamilyupdateTablein1[0].Zzbdate = null;
                }
                if (oPro.Fgbdt != "" && oPro.Fgbdt != null && oPro.Fgbdt != "Invalid Date") {
                    vData2.FamilyupdateTablein1[0].Fgbdt = dateFormat.format(vData2.FamilyupdateTablein1[0].Fgbdt);
                    vData2.FamilyupdateTablein1[0].Fgbdt = new Date(vData2.FamilyupdateTablein1[0].Fgbdt + "T09:00:00");
                } else {
                    vData2.FamilyupdateTablein1[0].Fgbdt = null;
                }

                if (vData2.FamilyupdateTablein1[0].Regno.search("-") !== -1) {
                    vData2.FamilyupdateTablein1[0].Regno = vData2.FamilyupdateTablein1[0].Regno.split("-")[0] + vData2.FamilyupdateTablein1[0].Regno.split("-")[1];
                }

                delete vData2.FamilyupdateTablein1[0].Opener;

                oModel.create("/FamilyupdateSet", vData2, {
                    success: function (data) {
                        var vMsg = "";
                        if (data && data.FamilyupdateExport.results.length) {
                            vMsg = data.FamilyupdateExport.results[0].EMsg;
                        }

                        if (vMsg === "") {
                            vMsg = oBundleText.getText("MSG_44002");
                        }

                        MessageBox.alert(vMsg, {
                            title: oBundleText.getText("LABEL_35023"),
                            onClose: function () {
								oController.onClose();
                            }
                        });

                        if (oPro.Regno.search("-") === -1) {
                            oPro.Regno = oPro.Regno.substring(0, 6) + "-" + oPro.Regno.substring(6);
                        }
                    },
                    error: function (oError) {
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                        } else {
                            MessageBox.alert(oError.toString());
                        }

                        if (oPro.Regno.search("-") == -1) {
                            Pro.Regno = oPro.Regno.substring(0, 6) + "-" + oPro.Regno.substring(6);
                        }
                        oPro.Opener = "X";
                    }
                });
            },

            onSave: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.FamilyApply");
                var oController = oView.getController();
                var oValid = oController.onValid(oController);
                if (oValid) {
                    var oMsg = oBundleText.getText("MSG_44001");
                    MessageBox.show(oMsg, {
                        icon: MessageBox.Icon.INFORMATION,
                        title: oBundleText.getText("LABEL_35023"),
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (fVal) {
                            if (fVal == "YES") {
                                oController.onSaveProcess(oController);
                            }
                        }
                    });
                }
            },

            getUrl: function (sUrl) {
                var param = $.map(location.search.replace(/\?/, "").split(/&/), function (p) {
                    var pair = p.split(/=/);
                    if (pair[0] === "s4hana") {
                        return pair[1];
                    }
                })[0];

                var destination = common.Common.isPRD() || param === "legacy" ? "/s4hana" : "/s4hana-pjt";

                return destination + sUrl;
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20120220"});
                      // return new JSONModelHelper({name: "931006"});
                      return new JSONModelHelper({ name: "991004" });
                  }
                : null
        });
    }
);
