/* eslint-disable no-undef */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV",
        "common/moment-with-locales"
	],
    function (Common, CommonController, JSONModel, BusyIndicator, MessageBox, Export, ExportTypeCSV) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppUpload"].join(".");

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "ActAppUpload",

            ContentHeight: 0,
            OtherHeight: 90,

            _vActionType: "",
            _vStatu: "",
            _vPersa: "",
            _vDocno: "",
            _vDocty: "",
            _vReqno: "",
            _vActda: "",
            _vPernr: "",
            _oContext: null,

            _vFromPageId: "",

            _vActiveControl: [],

            _vVilidData: [],
            _vTableUploadField: [],
            _vTableUploadRecruitField: [],
            _vHiringPersonalInfomationLayout: [],

            _BasicControl: [
                {
                    label: "No.",
                    id: "Recno",
                    Align: "Center",
                    Width: 100,
                    control: "Text",
                    required: false
                },
                {
                    label: "{i18n>LABEL_02041}",
                    id: "Cfmyn",
                    Align: "Center",
                    Width: 40,
                    control: "Img",
                    required: false
                },
                {
                    label: "{i18n>LABEL_02359}",
                    id: "Pernr",
                    Align: "Left",
                    Width: 100,
                    control: "Text",
                    required: true
                },
                {
                    label: "{i18n>LABEL_02070}",
                    id: "Ename",
                    Align: "Left",
                    Width: 100,
                    control: "Text",
                    required: false
                },
                {
                    label: "{i18n>LABEL_02272}",
                    id: "PerOrgeh_Tx",
                    Align: "Left",
                    Width: 150,
                    control: "Text",
                    required: false
                },
                {
                    label: "{i18n>LABEL_02219}",
                    id: "Per_zzcaltl_Tx",
                    Align: "Left",
                    Width: 100,
                    control: "Text",
                    required: false
                },
                {
                    label: "{i18n>LABEL_02014}",
                    id: "Actda",
                    Align: "Left",
                    Width: 80,
                    control: "Date",
                    required: true
                }
			],

            onInit: function () {
                this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow
                    }, this);
            },

            onBeforeShow: function (oEvent) {
                if (oEvent) {
                    this._vActionType = oEvent.data.actiontype;
                    this._vStatu = oEvent.data.Statu;
                    this._vReqno = oEvent.data.Reqno;
                    this._vDocno = oEvent.data.Docno;
                    this._vDocty = oEvent.data.Docty;
                    this._vPersa = oEvent.data.Persa;
                    this._vActda = oEvent.data.Actda;
                    this._oContext = oEvent.data.context;
                    this._vFromPageId = oEvent.data.FromPageId;
                }
                var oListTable = $.app.byId(this.PAGEID + "_TABLE");
                oListTable.removeAllColumns();
                oListTable.destroyColumns();

                var oJModel = new JSONModel();
                var Datas = {
                    Data: []
                };
                oJModel.setData(Datas);
                oListTable.setModel(oJModel);

                var oSaveBtn = $.app.byId(this.PAGEID + "_SAVE_BTN");
                oSaveBtn.setVisible(false);

                var oDownloadBtn = $.app.byId(this.PAGEID + "_EXCEL_DOWNLOAD_BTN");
                oDownloadBtn.setVisible(false);

                var oUploadBtn = $.app.byId(this.PAGEID + "_EXCEL_UPLOAD_BTN");
                oUploadBtn.setVisible(false);

                var oInputSwith = $.app.byId(this.PAGEID + "_Input_Switch");
                oInputSwith.setState(false);
                oInputSwith.setEnabled(false);

                var oUploadNoticeBar1 = $.app.byId(this.PAGEID + "_UploadNoticeBar1");
                oUploadNoticeBar1.setVisible(false);

                this.loadActionTypeList();
            },

            loadActionTypeList: function () {
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV"),
                    oController = this;

                oModel.read("/ActionTypeListSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
					],
                    success: function (data) {
                        if (data.results && data.results.length) {
                            for (var i = 0; i < 5; i++) {
                                var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                                var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));
                                if (oMassg) {
                                    oMassg.destroyItems();
                                }
                                if (oMassn) {
                                    oMassn.destroyItems();
                                    oMassn.addItem(
                                        new sap.ui.core.Item({
                                            key: "0000",
                                            text: oController.getBundleText("LABEL_02035")
                                        })
                                    );
                                    for (var j = 0; j < data.results.length; j++) {
                                        //채용과 발령유형이 8로 시작하는 법인간 발령관련은 제외
                                        if (data.results[j].Massn.substring(0, 1) == "8") {
                                            continue;
                                        } else if (data.results[j].Massn == "10" && oController._vDocty != "20") {
                                            continue;
                                        } else if (oController._vDocty == "10" && data.results[j].Massn == "11") {
                                            //문서유형이 일반이고 발령유형이 재입사이면 Skip
                                            continue;
                                        } else {
                                            oMassn.addItem(
                                                new sap.ui.core.Item({
                                                    key: data.results[j].Massn,
                                                    text: data.results[j].Mntxt
                                                })
                                            );
                                        }
                                    }
                                    oMassn.setSelectedKey("0000");
                                }
                            }
                        }
                    },
                    error: function (res) {
                        Common.log(res);
                    }
                });

                if (oController._vDocty == "20") {
                    var oMassn1 = $.app.byId(oController.PAGEID + "_Massn1");
                    var oMassg1 = $.app.byId(oController.PAGEID + "_Massg1");

                    oMassn1.setEnabled(true);
                    oMassg1.setEnabled(true);

                    for (var i = 1; i < 5; i++) {
                        $.app.byId(oController.PAGEID + "_Massn" + (i + 1)).setEnabled(false);
                        $.app.byId(oController.PAGEID + "_Massg" + (i + 1)).setEnabled(false);
                    }

                    oModel.read("/ActionReasonListSet", {
                        async: false,
                        filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
							new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, "11")
						],
                        success: function (data) {
                            if (data.results && data.results.length) {
                                oMassg1.addItem(
                                    new sap.ui.core.Item({
                                        key: "0000",
                                        text: oController.getBundleText("LABEL_02035")
                                    })
                                );
                                for (var i = 0; i < data.results.length; i++) {
                                    oMassg1.addItem(
                                        new sap.ui.core.Item({
                                            key: data.results[i].Massg,
                                            text: data.results[i].Mgtxt
                                        })
                                    );
                                }
                            }
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    });

                    oMassg1.setSelectedKey("0000");
                } else {
                    for (var k = 0; k < 5; k++) {
                        $.app.byId(oController.PAGEID + "_Massn" + (k + 1)).setEnabled(true);
                        $.app.byId(oController.PAGEID + "_Massg" + (k + 1)).setEnabled(false);
                    }
                }
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

            onChangeMassn: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID),
                    vControlId = oEvent.getSource().getId(),
                    vSelectedItem = oEvent.getParameter("selectedItem"),
                    vSelectedKey = vSelectedItem.getKey(),
                    vControl_Idx = vControlId.substring(vControlId.length - 1);

                //발령유형이 채용, 겸직/겸무, 휴직, 퇴사의 경우 1개의 발령유형만 선택가능하다.  10, 11, 15, 60, 61, 90, 91
                if (vSelectedKey != "0000") {
                    if (vControl_Idx == "1") {
                        if (
                            vSelectedKey == "10" ||
                            vSelectedKey == "11" ||
                            vSelectedKey == "60" ||
                            vSelectedKey == "61" ||
                            vSelectedKey == "90" ||
                            vSelectedKey == "91"
                        ) {
                            for (var i = 2; i <= 5; i++) {
                                var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + i);
                                var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + i);
                                oMassn1.setEnabled(false);
                                oMassg1.setEnabled(false);
                            }
                        } else {
                            for (var k = 2; k <= 5; k++) {
                                $.app.byId(oController.PAGEID + "_Massn" + k).setEnabled(true);
                                $.app.byId(oController.PAGEID + "_Massg" + k).setEnabled(true);
                            }
                        }
                    } else {
                        if (
                            vSelectedKey == "10" ||
                            vSelectedKey == "11" ||
                            vSelectedKey == "60" ||
                            vSelectedKey == "61" ||
                            vSelectedKey == "90" ||
                            vSelectedKey == "91"
                        ) {
                            MessageBox.alert(oController.getBundleText("MSG_02058"));
                            for (var p = 1; p <= 5; p++) {
                                var oMassn2 = $.app.byId(oController.PAGEID + "_Massn" + p);
                                var oMassg2 = $.app.byId(oController.PAGEID + "_Massg" + p);
                                oMassn2.setEnabled(true);
                                oMassn2.setSelectedKey("0000");
                                oMassg2.setEnabled(true);
                                oMassg2.removeAllItems();
                            }
                            return;
                        }
                    }
                }

                var oMassg = $.app.byId(oController.PAGEID + "_Massg" + vControl_Idx);

                if (vSelectedKey == "0000") {
                    oMassg.setEnabled(false);
                    oMassg.removeAllItems();
                } else {
                    oMassg.removeAllItems();
                    oMassg.setEnabled(true);

                    $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionReasonListSet", {
                        async: false,
                        filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
							new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vSelectedKey)
						],
                        success: function (data) {
                            if (data.results && data.results.length) {
                                oMassg.addItem(
                                    new sap.ui.core.Item({
                                        key: "0000",
                                        text: oController.getBundleText("LABEL_02035")
                                    })
                                );
                                for (var i = 0; i < data.results.length; i++) {
                                    oMassg.addItem(
                                        new sap.ui.core.Item({
                                            key: data.results[i].Massg,
                                            text: data.results[i].Mgtxt
                                        })
                                    );
                                }

                                oMassg.setSelectedKey("0000");
                            }
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    });
                }

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setState(false);

                oController.initInputControl(oController);
            },

            onChangeMassg: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");

                oInputSwith.setState(false);
                oInputSwith.setEnabled(true);

                oController.initInputControl(oController);
            },

            onChangeSwitch: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oDownloadBtn = $.app.byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
                var oUploadBtn = $.app.byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
                var oUploadNoticeBar1 = $.app.byId(oController.PAGEID + "_UploadNoticeBar1");

                if (oEvent.getParameter("state") == false) {
                    oController.initInputControl(oController);
                    return;
                }

                // var isValid = true;
                var vSelectMassnCnt = 0;

                oController.initInputControl(oController);

                var fReent = false;

                for (var i = 0; i < 5; i++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                    var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));

                    if (oMassn) {
                        if (oMassn.getSelectedKey() != "0000" && oMassn.getSelectedKey() != "") {
                            vSelectMassnCnt++;

                            if (oMassn.getSelectedKey() == "11") {
                                fReent = true;
                            }

                            var aFilters = [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
								new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
								new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, oMassg.getSelectedKey())
							];

                            if (oMassn.getSelectedKey() != "" && oMassn.getSelectedKey() != "0000") {
                                aFilters.push(new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, oMassn.getSelectedKey()));
                            }

                            $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionInputFieldSet", {
                                async: false,
                                filters: aFilters,
                                success: function (data) {
                                    if (data.results && data.results.length) {
                                        for (var i = 0; i < data.results.length; i++) {
                                            var isExists = false;
                                            for (var j = 0; j < oController._vActiveControl.length; j++) {
                                                if (oController._vActiveControl[j].Fieldname == data.results[i].Fieldname) {
                                                    if (data.results[i].Incat.substring(0, 1) == "M") {
                                                        oController._vActiveControl[j].Incat = data.results[i].Incat;
                                                    }
                                                    isExists = true;
                                                    break;
                                                }
                                            }
                                            if (isExists == false) {
                                                oController._vActiveControl.push(data.results[i]);
                                            }
                                        }
                                    }
                                },
                                error: function (res) {
                                    var Err = {},
                                        vErrMsg = "";
                                    if (res.response) {
                                        Err = window.JSON.parse(res.response.body);
                                        vErrMsg = Err.error.innererror.errordetails[0].message;
                                    } else {
                                        vErrMsg = res;
                                    }
                                    Common.showErrorMessage(vErrMsg);
                                }
                            });
                        }
                    }
                }

                if (vSelectMassnCnt < 1) {
                    oEvent.getSource().setState(false);
                    MessageBox.alert(oController.getBundleText("MSG_02059"));
                    return;
                }

                oController.setInputFiled(oController, fReent);

                oUploadNoticeBar1.setVisible(true);

                oDownloadBtn.setVisible(true);
                oUploadBtn.setVisible(true);
            },

            onAfterRenderingListTable: function (oController) {
                var oListTable = $.app.byId(oController.PAGEID + "_TABLE"),
                    $tr = oListTable.$().find("TBODY").find(".sapUiTableColHdrTr"),
                    vTotalColumns = $($tr[0]).find("td").length;

                for (var i = 0; i < vTotalColumns; i++) {
                    var $firstRowTd = $($tr[0]).find("td").eq(i),
                        $secondRowTd = $($tr[1]).find("td").eq(i);

                    if ($firstRowTd.find(".sapMLabelTextWrapper").text() === $secondRowTd.find(".sapMLabelTextWrapper").text()) {
                        $secondRowTd.hide();
                        $firstRowTd.attr("rowspan", 2);
                    }

                    if (parseInt($firstRowTd.attr("colspan")) > 1) {
                        $firstRowTd.css('border-bottom', '.0625rem solid #e5e5e5');
                    }
                }
            },

            setInputFiled: function (oController, fReent) {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd"
                    }),
                    oListTable = $.app.byId(oController.PAGEID + "_TABLE");

                oController._vTableUploadField = [];

                oListTable.removeAllColumns();
                oListTable.destroyColumns();

                if (oController._vDocty == "20") {
                    oController.setHireTable(oController, oListTable);
                } else {
                    var multiHeaderLine = fReent == true ? 5 : 4;
                    oListTable.setFixedColumnCount(multiHeaderLine + 2);

                    var oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "No.",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "No.",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [1, 1],
                        width: "80px",
                        template: new sap.ui.commons.TextView({
                            width: "100%",
                            text: "{Recno}",
                            textAlign: "Center"
                        }).addStyleClass("L2PFontFamily")
                    });
                    oListTable.addColumn(oColumn);

                    oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "{i18n>LABEL_02041}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "{i18n>LABEL_02041}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [1, 1],
                        width: "60px",
                        template: new sap.m.Image({
                            width: "16px",
                            height: "16px",
                            src: {
                                path: "Cfmyn",
                                formatter: function (fVal) {
                                    if (fVal == undefined || fVal == "") {
                                        return "";
                                    } else {
                                        return fVal;
                                    }
                                }
                            }
                        })
                    });
                    oListTable.addColumn(oColumn);

                    oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "{i18n>LABEL_02007}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "* {i18n>LABEL_02359}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [multiHeaderLine, 1],
                        width: "100px",
                        template: new sap.ui.commons.TextView({
                            width: "100%",
                            text: "{Pernr}",
                            textAlign: "Center"
                        }).addStyleClass("L2PFontFamily")
                    });
                    oListTable.addColumn(oColumn);

                    var vTableUploaData = {};
                    vTableUploaData.Incat = "M1";
                    vTableUploaData.Fieldname = "Pernr";
                    oController._vTableUploadField.push(vTableUploaData);

                    oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "{i18n>LABEL_02007}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "{i18n>LABEL_02070}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [multiHeaderLine, 1],
                        width: "100px",
                        template: new sap.ui.commons.TextView({
                            width: "100%",
                            text: "{Ename}",
                            textAlign: "Center"
                        }).addStyleClass("L2PFontFamily")
                    });
                    oListTable.addColumn(oColumn);

                    oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "{i18n>LABEL_02007}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "{i18n>LABEL_02272}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [multiHeaderLine, 1],
                        width: "150px",
                        template: new sap.ui.commons.TextView({
                            width: "100%",
                            text: "{PerOrgeh_Tx}",
                            textAlign: "Center"
                        }).addStyleClass("L2PFontFamily")
                    });
                    oListTable.addColumn(oColumn);

                    oColumn = new sap.ui.table.Column({
                        hAlign: "Center",
                        flexible: false,
                        resizable: false,
                        multiLabels: [
							new sap.m.Label({
                                text: "{i18n>LABEL_02007}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily"),
							new sap.m.Label({
                                text: "* " + "{i18n>LABEL_02014}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
						],
                        headerSpan: [multiHeaderLine, 1],
                        width: "120px",
                        template: new sap.ui.commons.TextView({
                            width: "100%",
                            text: {
                                path: "Actda",
                                formatter: function (fVal) {
                                    if (fVal == undefined || fVal == "") {
                                        return "";
                                    } else {
                                        return dateFormat.format(fVal);
                                        //							return fVal;
                                    }
                                }
                            },
                            textAlign: "Center"
                        }).addStyleClass("L2PFontFamily")
                    });
                    oListTable.addColumn(oColumn);

                    vTableUploaData = {};
                    vTableUploaData.Incat = "M4";
                    vTableUploaData.Fieldname = "Actda";
                    vTableUploaData.Lebel = "* " + oController.getBundleText("LABEL_02014");
                    oController._vTableUploadField.push(vTableUploaData);

                    if (fReent == true) {
                        oColumn = new sap.ui.table.Column({
                            hAlign: "Center",
                            flexible: false,
                            resizable: false,
                            multiLabels: [
								new sap.m.Label({
                                    text: "{i18n>LABEL_02007}",
                                    textAlign: "Center"
                                }).addStyleClass("L2PFontFamily"),
								new sap.m.Label({
                                    text: "* " + "{i18n>LABEL_02278}",
                                    textAlign: "Center"
                                }).addStyleClass("L2PFontFamily")
							],
                            headerSpan: [multiHeaderLine, 1],
                            width: "150px",
                            template: new sap.ui.commons.TextView({
                                width: "100%",
                                text: "{Icnum}",
                                textAlign: "Center"
                            }).addStyleClass("L2PFontFamily")
                        });
                        oListTable.addColumn(oColumn);
                    }
                }

                if (oController._vActiveControl && oController._vActiveControl.length) {
                    for (var i = 0; i < oController._vActiveControl.length; i++) {
                        var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                            TextFieldname = Fieldname + "_Tx",
                            oneCol = {},
                            Fieldtype = oController._vActiveControl[i].Incat;

                        if (Fieldtype == "TB" || Fieldtype == "D1" || Fieldtype == "D0" || Fieldtype == "D2") continue;

                        var vLabelText = "";
                        if (oController._vActiveControl[i].Label && oController._vActiveControl[i].Label != "")
                            vLabelText = oController._vActiveControl[i].Label;
                        else vLabelText = oController._vActiveControl[i].Label;

                        //입력항목 라벨를 만든다.
                        var vHeader = ""; // "발령데이터" + "|";
                        if (Fieldtype.substring(0, 1) == "M") {
                            vHeader += "* " + vLabelText;
                        } else {
                            vHeader += vLabelText;
                        }

                        oneCol.Header = vHeader;
                        if (Fieldtype == "M4" || Fieldtype == "O4") {
                            oneCol.Type = "Date";
                            oneCol.Format = gDtfmt;
                        } else {
                            oneCol.Type = "Text";
                        }

                        if (Fieldtype == "M1" || Fieldtype == "M2" || Fieldtype == "M5" || Fieldtype == "O1" || Fieldtype == "O2" || Fieldtype == "O5") {
                            // 사번 조직 직무 직급호칭
                            vTableUploaData = {};
                            vTableUploaData.Incat = Fieldtype;
                            vTableUploaData.Fieldname = TextFieldname;
                            vTableUploaData.Codename = Fieldname;
                            vTableUploaData.Lebel = vHeader;
                            oController._vTableUploadField.push(vTableUploaData);
                            oneCol.SaveName = TextFieldname;
                        } else {
                            oneCol.SaveName = TextFieldname;
                            if (oController._vDocty == "20" || Fieldtype.substring(0, 1) == "M") {
                                vTableUploaData = {};
                                vTableUploaData.Incat = Fieldtype;
                                vTableUploaData.Fieldname = Fieldname;
                                vTableUploaData.Lebel = vHeader;
                                oController._vTableUploadField.push(vTableUploaData);
                                oneCol.SaveName = Fieldname;
                            }
                        }

                        if (oneCol.Type == "Date") {
                            oColumn = new sap.ui.table.Column({
                                hAlign: "Center",
                                flexible: false,
                                resizable: false,
                                multiLabels: [
									new sap.m.Label({
                                        text: "{i18n>LABEL_02016}",
                                        textAlign: "Center"
                                    }),
									new sap.m.Label({
                                        text: vHeader,
                                        textAlign: "Center"
                                    })
								],
                                headerSpan: [oController._vActiveControl.length, 1],
                                width: "100px",
                                template: new sap.ui.commons.TextView({
                                    width: "100%",
                                    text: {
                                        path: oneCol.SaveName,
                                        formatter: function (fVal) {
                                            if (fVal == undefined || fVal == "") {
                                                return "";
                                            } else {
                                                return dateFormat.format(fVal);
                                            }
                                        }
                                    },
                                    textAlign: "Center"
                                }).addStyleClass("L2PFontFamily")
                            });
                            oListTable.addColumn(oColumn);
                        } else {
                            oColumn = new sap.ui.table.Column({
                                hAlign: "Center",
                                flexible: false,
                                resizable: false,
                                multiLabels: [
									new sap.m.Label({
                                        text: "{i18n>LABEL_02016}",
                                        textAlign: "Center"
                                    }),
									new sap.m.Label({
                                        text: vHeader,
                                        textAlign: "Center"
                                    })
								],
                                headerSpan: [oController._vActiveControl.length, 1],
                                width: "100px",
                                template: new sap.ui.commons.TextView({
                                    width: "100%",
                                    text: "{" + oneCol.SaveName + "}",
                                    textAlign: "Center"
                                }).addStyleClass("L2PFontFamily")
                            });
                            oListTable.addColumn(oColumn);
                        }
                    }
                }
                oColumn = new sap.ui.table.Column({
                    hAlign: "Center",
                    flexible: false,
                    resizable: false,
                    width: "300px",
                    multiLabels: [
						new sap.m.Label({
                            text: "{i18n>LABEL_02242}",
                            textAlign: "Center"
                        }),
						new sap.m.Label({
                            text: "{i18n>LABEL_02242}",
                            textAlign: "Center"
                        })
					],
                    headerSpan: [1, 1],
                    template: new sap.ui.commons.TextView({
                        text: "{Upbigo}",
                        textAlign: "Center"
                    }).addStyleClass("L2PFontFamily")
                });
                oListTable.addColumn(oColumn);
            },

            setHireTable: function (oController, Table) {
                var MultiHeaderLength = 0,
                    oColumn = null;

                oController._vHiringPersonalInfomationLayout = [];

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/HiringPersonalInfomationLayoutSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, "41"),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
					],
                    success: function (data) {
                        if (data && data.results) {
                            var vHireData = {};

                            for (var i = 0; i < data.results.length; i++) {
                                if (
                                    data.results[i].Incat == "M1" ||
                                    data.results[i].Incat == "M2" ||
                                    data.results[i].Incat == "M5" ||
                                    data.results[i].Incat == "M8" ||
                                    data.results[i].Incat == "O1" ||
                                    data.results[i].Incat == "O2" ||
                                    data.results[i].Incat == "O5" ||
                                    data.results[i].Incat == "O8"
                                ) {
                                    var tempText = oController.changeChar(data.results[i].Fieldname) + "_Tx";
                                    oColumn = new sap.ui.table.Column({
                                        hAlign: "Center",
                                        flexible: false,
                                        resizable: false,
                                        width: "100px",
                                        multiLabels: [
											new sap.m.Label({
                                                text: "{i18n>LABEL_02360}",
                                                textAlign: "Center"
                                            }),
											new sap.m.Label({
                                                text: data.results[i].Label,
                                                textAlign: "Center"
                                            })
										],
                                        headerSpan: [data.results.length, 1],
                                        template: new sap.ui.commons.TextView({
                                            width: "100%",
                                            text: "{" + tempText + "}",
                                            textAlign: "Center"
                                        }).addStyleClass("L2PFontFamily")
                                    });
                                    Table.addColumn(oColumn);

                                    vHireData = {};
                                    vHireData.Incat = data.results[i].Incat;
                                    vHireData.Fieldname = oController.changeChar(data.results[i].Fieldname) + "_Tx";
                                    vHireData.Codename = oController.changeChar(data.results[i].Fieldname);
                                    oController._vHiringPersonalInfomationLayout.push(vHireData);
                                } else if (data.results[i].Incat == "O4" || data.results[i].Incat == "M4") {
                                    //
                                    oColumn = new sap.ui.table.Column({
                                        hAlign: "Center",
                                        flexible: false,
                                        resizable: false,
                                        width: "100px",
                                        multiLabels: [
											new sap.m.Label({
                                                text: "{i18n>LABEL_02360}",
                                                textAlign: "Center"
                                            }),
											new sap.m.Label({
                                                text: data.results[i].Label,
                                                textAlign: "Center"
                                            })
										],
                                        headerSpan: [MultiHeaderLength, 1],
                                        template: new sap.ui.commons.TextView({
                                            text: {
                                                path: oController.changeChar(data.results[i].Fieldname),
                                                type: new sap.ui.model.type.Date({
                                                    pattern: "yyyy-MM-dd"
                                                })
                                            },
                                            textAlign: "Center"
                                        }).addStyleClass("L2PFontFamily")
                                    });
                                    Table.addColumn(oColumn);

                                    vHireData = {};
                                    vHireData.Incat = data.results[i].Incat;
                                    vHireData.Fieldname = oController.changeChar(data.results[i].Fieldname);
                                    oController._vHiringPersonalInfomationLayout.push(vHireData);
                                } else if (
                                    data.results[i].Incat == "M3" ||
                                    data.results[i].Incat == "M7" ||
                                    data.results[i].Incat == "O3" ||
                                    data.results[i].Incat == "O7"
                                ) {
                                    oColumn = new sap.ui.table.Column({
                                        hAlign: "Center",
                                        flexible: false,
                                        resizable: false,
                                        width: "100px",
                                        multiLabels: [
											new sap.m.Label({
                                                text: "{i18n>LABEL_02360}",
                                                textAlign: "Center"
                                            }),
											new sap.m.Label({
                                                text: data.results[i].Label,
                                                textAlign: "Center"
                                            }).addStyleClass("L2PFontFamily")
										],
                                        headerSpan: [data.results.length, 1],
                                        template: new sap.ui.commons.TextView({
                                            width: "100%",
                                            text: "{" + oController.changeChar(data.results[i].Fieldname) + "}",
                                            textAlign: "Center"
                                        }).addStyleClass("L2PFontFamily")
                                    });
                                    Table.addColumn(oColumn);

                                    vHireData = {};
                                    vHireData.Incat = data.results[i].Incat;
                                    vHireData.Fieldname = oController.changeChar(data.results[i].Fieldname);
                                    oController._vHiringPersonalInfomationLayout.push(vHireData);
                                }
                            }
                        }
                    },
                    error: function (res) {
                        Common.log(res);
                    }
                });

                Table.setFixedColumnCount(MultiHeaderLength);
            },

            changeChar: function (vItext) {
                if (vItext.indexOf("_") > -1) {
                    var fields = vItext.split("_");
                    vItext =
                        fields[0].substring(0, 1) + fields[0].substring(1).toLowerCase() + fields[1].substring(0, 1) + fields[1].substring(1).toLowerCase();
                } else {
                    vItext = vItext.substring(0, 1) + vItext.substring(1).toLowerCase();
                }

                return vItext;
            },

            initInputControl: function (oController) {
                oController._vActiveControl = [];

                var oDownloadBtn = $.app.byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN"),
                    oUploadBtn = $.app.byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"),
                    oUploadNoticeBar1 = $.app.byId(oController.PAGEID + "_UploadNoticeBar1");

                oUploadNoticeBar1.setVisible(false);

                oDownloadBtn.setVisible(false);
                oUploadBtn.setVisible(false);

                oController._vTableUploadField = [];

                var oListTable = $.app.byId(oController.PAGEID + "_TABLE"),
                    oJModel = new JSONModel(),
                    Datas = {
                        Data: []
                    };

                oJModel.setData(Datas);
                oListTable.setModel(oJModel);
                oListTable.unbindRows();
                oListTable.removeAllColumns();
                oListTable.destroyColumns();
            },

            onPressDownload: function () {
                var oController = $.app.getController(SUB_APP_ID),
                    oListTable = $.app.byId(oController.PAGEID + "_TABLE"),
                    oModel = oListTable.getModel();

                var oExport = new Export({
                    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                    exportType: new ExportTypeCSV({
                        separatorChar: ","
                    }),
                    // Pass in the model created above
                    models: oModel,
                    // binding information for the rows aggregation
                    rows: {
                        path: "/Data/0"
                    }
                });

                var columns = oListTable.getColumns();

                //push header column names to array
                for (var j = 0; j < columns.length - 1; j++) {
                    var headerCol = columns[j].getMultiLabels()[1].getText();
                    if (oController._vDocty !== "20" && j < 6) {
                        if (headerCol && headerCol.substring(0, 1) == "*") {
                            oExport.addColumn(
                                new sap.ui.core.util.ExportColumn({
                                    name: headerCol,
                                    template: {
                                        content: "{test}"
                                    }
                                })
                            );
                        }
                    } else {
                        oExport.addColumn(
                            new sap.ui.core.util.ExportColumn({
                                name: headerCol,
                                template: {
                                    content: "{test}"
                                }
                            })
                        );
                    }
                }
                oExport.saveFile().always(function () {
                    this.destroy();
                });
            },

            changeFile: function () {
                var oController = $.app.getController(SUB_APP_ID),
                    reader = new FileReader(),
                    f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];

                reader.onload = function (e) {
                    // eslint-disable-next-line no-undef
                    oController.X = XLSX;
                    var data = e.target.result;
                    var arr = oController.fixdata(data);
                    var wb = oController.X.read(btoa(arr), {
                        type: "base64"
                    });
                    oController.to_json(wb);
                };

                reader.readAsArrayBuffer(f);
            },

            fixdata: function (data) {
                var o = "",
                    l = 0,
                    w = 10240;

                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

                return o;
            },

            to_json: function (workbook) {
                var oController = $.app.getController(SUB_APP_ID),
                    oFileUploader = $.app.byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"),
                    oListTable = $.app.byId(oController.PAGEID + "_TABLE"),
                    oJModel = new JSONModel(),
                    Datas = {
                        Data: []
                    },
                    oSaveBtn = $.app.byId(oController.PAGEID + "_SAVE_BTN"),
                    oModel = $.app.getModel("ZHR_ACTIONAPP_SRV"),
                    icon1 = "images/OK.png",
                    icon2 = "images/No-entry.png",
                    process_result = false;

                workbook.SheetNames.forEach(function (sheetName) {
                    var vIdx = 1;
                    var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var controlData = {};
                    var s_cnt = 0;
                    var f_cnt = 0;
                    // TODO: 코드 저장용 임시
                    var MappWerks = {
                        "본사": "1000",
                        "연구소": "2000",
                        "여수": "3000",
                        "대산": "A100",
                        "울산": "B200",
                        "의왕": "D100",
                        "여수(첨단)": "D101"
                    };

                    for (var i = 0; i < 5; i++) {
                        var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                        var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));

                        if (oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
                            controlData["Massn" + (i + 1)] = '';
                        } else {
                            controlData["Massn" + (i + 1)] = oMassn.getSelectedKey();
                        }

                        if (oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
                            controlData["Massg" + (i + 1)] = '';
                        } else {
                            controlData["Massg" + (i + 1)] = oMassg.getSelectedKey();
                        }
                    }

                    if (roa.length > 0) {
                        var vExLength = oController._vHiringPersonalInfomationLayout.length;
                        for (var k = 0; k < roa.length; k++) {
                            var vReturn = {};
                            var vRecReturn = {};
                            process_result = false;
                            if (oController._vDocty == "20") {
                                var vOneData = {};
                                vOneData.Accty = "V";
                                vOneData.Docno = oController._vDocno;
                                vOneData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";
                                for (var m = 0; m < vExLength; m++) {
                                    var vCheckData = roa[k]["Coulmn_" + m];

                                    if (vCheckData == "" || vCheckData == undefined || vCheckData === "#") continue;
                                    if (
                                        oController._vHiringPersonalInfomationLayout[m].Incat == "M4" ||
                                        oController._vHiringPersonalInfomationLayout[m].Incat == "O4"
                                    ) {
                                        // var vTempDate = roa[k]["Coulmn_" + m];
                                        // var vNewDate = new Date();
                                        // vNewDate.setUTCFullYear(parseInt(vTempDate.substring(0, 4)));
                                        // vNewDate.setUTCMonth(parseInt(vTempDate.substring(4, 6)) - 1);
                                        // vNewDate.setUTCDate(parseInt(vTempDate.substring(6, 8)));
                                        // vTempDate = "/Date(" + vNewDate.getTime() + ")/";
                                        vOneData[oController._vHiringPersonalInfomationLayout[m].Fieldname] = moment(vCheckData).hours(10).toDate();
                                    } else {
                                        vOneData[oController._vHiringPersonalInfomationLayout[m].Fieldname] = roa[k]["Coulmn_" + m];
                                    }
                                }

                                oModel.create("/RecruitingSubjectsSet", vOneData, {
                                    success: function (oData) {
                                        process_result = true;
                                        vRecReturn = oData;
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
                            var vTempIdx = 0;
                            controlData = {};
                            for (var j = 0 + vExLength; j < oController._vTableUploadField.length + vExLength; j++) {
                                var vCheckData2 = roa[k]["Coulmn_" + j];
                                if (vCheckData2 == "" || vCheckData2 == undefined || vCheckData2 === "#") {
                                    vTempIdx++;
                                    continue;
                                }

                                var vTFieldname = oController._vTableUploadField[vTempIdx].Fieldname;

                                if (vTFieldname == "Orgeh_Tx" || vTFieldname == "Stell_Tx" || vTFieldname == "Zzjiktl") {
                                    controlData[oController._vTableUploadField[vTempIdx].Codename] = roa[k]["Coulmn_" + j];
                                } else if (vTFieldname == "Bet01") {
                                    var tmp = roa[k]["Coulmn_" + j];
                                    tmp = tmp / 100 + "";
                                    controlData[oController._vTableUploadField[vTempIdx].Fieldname] = tmp;
                                } else {
                                    controlData[oController._vTableUploadField[vTempIdx].Fieldname] = roa[k]["Coulmn_" + j];
                                }

                                if (vTFieldname == "Bet01_v2") {
                                    controlData.Waers2 = "KRW";
                                }

                                if (oController._vTableUploadField[vTempIdx].Incat == "M4" || oController._vTableUploadField[vTempIdx].Incat == "O4") {
                                    var vTempDate2 = roa[k]["Coulmn_" + j];
                                    // var vNewDate2 = new Date();
                                    // vNewDate2.setUTCFullYear(parseInt(vTempDate2.substring(0, 4)));
                                    // vNewDate2.setUTCMonth(parseInt(vTempDate2.substring(4, 6)) - 1);
                                    // vNewDate2.setUTCDate(parseInt(vTempDate2.substring(6, 8)));
                                    // vTempDate2 = "/Date(" + vNewDate2.getTime() + ")/";
                                    controlData[oController._vTableUploadField[vTempIdx].Fieldname] = moment(vTempDate2).hours(10).toDate();
                                }
                                vTempIdx++;
                            }
                            controlData.Docno = oController._vDocno;
                            controlData.Actty = "V";
                            if (oController._vDocty == "20") {
                                controlData.Actty = "VC";
                            }
                            controlData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";

                            controlData.Werks = MappWerks[controlData.Werks_Tx] ? MappWerks[controlData.Werks_Tx] : null; // 코드
                            controlData.Persa = MappWerks[controlData.Werks_Tx] ? MappWerks[controlData.Werks_Tx] : null; // 코드

                            oModel.create("/ActionSubjectListSet", controlData, {
                                success: function (oData) {
                                    if (oData) {
                                        vReturn = oData;

                                        if (oData.Upbigo != "") {
                                            oData.Cfmyn = icon2;
                                            f_cnt++;
                                        } else {
                                            oData.Upbigo = "Success";
                                            oData.Cfmyn = icon1;
                                            s_cnt++;
                                        }
                                        vReturn.Cfmyn = oData.Cfmyn;
                                        vReturn.Upbigo = oData.Upbigo;

                                        if (vRecReturn != null && vRecReturn != "") {
                                            // RecruitingSubjectsSet 결과
                                            for (var j = 0; j < vExLength; j++) {
                                                if (oController._vHiringPersonalInfomationLayout[j].Codename) {
                                                    vReturn[oController._vHiringPersonalInfomationLayout[j].Codename] = vRecReturn[oController._vHiringPersonalInfomationLayout[j].Codename];
                                                }

                                                vReturn[oController._vHiringPersonalInfomationLayout[j].Fieldname] = vRecReturn[oController._vHiringPersonalInfomationLayout[j].Fieldname];
                                            }
                                        }
                                        vReturn.Recno = vIdx;
                                        Datas.Data.push(vReturn);
                                        vIdx++;
                                    }
                                },
                                error: function (oError) {
                                    var Err = {};
                                    var vMsg = "";
                                    if (oError.response) {
                                        Err = window.JSON.parse(oError.response.body);
                                        if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                            vMsg = Err.error.innererror.errordetails[0].message;
                                        } else {
                                            vMsg = Err.error.message.value;
                                        }
                                    } else {
                                        vMsg = oError.toString();
                                    }

                                    Common.log(vMsg);
                                }
                            });
                        }

                        Common.log(Datas);
                        Common.log(s_cnt);
                        oJModel.setData(Datas);
                        oListTable.setModel(oJModel);
                        oListTable.bindRows("/Data");

                        if (f_cnt > 0) oSaveBtn.setVisible(false);
                        else oSaveBtn.setVisible(true);
                    } else {
                        oSaveBtn.setVisible(false);
                        MessageBox.alert("엑셀에 데이터가 존재하지 않습니다");
                        return;
                    }
                });

                oFileUploader.setValue("");
                oFileUploader.setVisible(false);
                oFileUploader.setVisible(true);
            },

            onPressSave: function () {
                var oController = $.app.getController(SUB_APP_ID),
                    oListTable = $.app.byId(oController.PAGEID + "_TABLE"),
                    oListModel = oListTable.getModel(),
                    oListData = oListModel.getProperty("/Data"),
                    oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var saveProcess = function () {
                    var vExLength = oController._vHiringPersonalInfomationLayout.length;
                    for (var idx = 0; idx < oListData.length; idx++) {
                        if (vExLength > 0 && oController._vDocty == "20") {
                            var tableIdxData = oListData[idx],
                                vOneData = {};

                            vOneData.Docno = oController._vDocno;
                            vOneData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";

                            for (var j = 0; j < vExLength; j++) {
                                var vCheckData = "";

                                vCheckData = tableIdxData[oController._vHiringPersonalInfomationLayout[j].Fieldname];

                                if (vCheckData == "" || vCheckData == undefined) continue;

                                if (
                                    oController._vHiringPersonalInfomationLayout[j].Incat == "M4" ||
                                    oController._vHiringPersonalInfomationLayout[j].Incat == "O4"
                                ) {
                                    var tempDate = tableIdxData[oController._vHiringPersonalInfomationLayout[j].Fieldname];

                                    tempDate = "/Date(" + Common.getTime(tempDate) + ")/";
                                    vOneData[oController._vHiringPersonalInfomationLayout[j].Fieldname] = tempDate;
                                } else {
                                    if (
                                        oController._vHiringPersonalInfomationLayout[j].Codename != undefined &&
                                        oController._vHiringPersonalInfomationLayout[j].Codename != null
                                    ) {
                                        vOneData[oController._vHiringPersonalInfomationLayout[j].Codename] = tableIdxData[oController._vHiringPersonalInfomationLayout[j].Codename];
                                    } else {
                                        vOneData[oController._vHiringPersonalInfomationLayout[j].Fieldname] = tableIdxData[oController._vHiringPersonalInfomationLayout[j].Fieldname];
                                    }
                                }
                            }

                            var process_result = false;

                            var vReturn = "";

                            oModel.create("/RecruitingSubjectsSet", vOneData, {
                                success: function (data) {
                                    process_result = true;
                                    vReturn = data;
                                    Common.log(oController.getBundleText("MSG_02154"));
                                },
                                error: function (res) {
                                    process_result = false;
                                    BusyIndicator.hide();

                                    var Err = {};
                                    if (res.response) {
                                        Err = window.JSON.parse(res.response.body);
                                        if (Err.error.innererror.errordetails) {
                                            Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                        } else {
                                            Common.showErrorMessage(Err.error.message.value);
                                        }
                                    } else {
                                        Common.showErrorMessage(res);
                                    }
                                }
                            });

                            if (!process_result) return;
                        }

                        var createData = {},
                            tableIdxData2 = oListData[idx];

                        for (var k = 0; k < oController._vTableUploadField.length; k++) {
                            var vCheckData2 = tableIdxData2[oController._vTableUploadField[k].Fieldname];

                            if (vCheckData2 == "" || vCheckData2 == undefined) continue;

                            createData[oController._vTableUploadField[k].Fieldname] = tableIdxData2[oController._vTableUploadField[k].Fieldname];

                            if (oController._vTableUploadField[k].Incat == "M4" || oController._vTableUploadField[k].Incat == "O4") {
                                var tempDate2 = createData[oController._vTableUploadField[k].Fieldname];

                                tempDate2 = "/Date(" + Common.getTime(tempDate2) + ")/";
                                createData[oController._vTableUploadField[k].Fieldname] = tempDate2;
                            }
                            // Code data
                            if (oController._vTableUploadField[k].Codename != undefined && oController._vTableUploadField[k].Codename != "") {
                                createData[oController._vTableUploadField[k].Codename] = tableIdxData2[oController._vTableUploadField[k].Codename];
                            }

                            if (oController._vTableUploadField[k].Fieldname == "Bet01_v2") {
                                createData.Waers2 = "KRW";
                            }
                        }

                        createData.Cfmyn = "";
                        createData.Actty = "UP";
                        createData.Docty = oController._vDocty;
                        createData.Reqno = oController._vReqno;
                        createData.Docno = oController._vDocno;
                        createData.Batyp = "A";
                        createData.Persa = oController._vPersa;
                        createData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";

                        if (oController._vDocty == "20" && vReturn != "") {
                            createData.VoltId = vReturn.VoltId;
                            createData.Pernr = vReturn.VoltId.substring(2, 10);
                        }

                        var fReEntry = false;

                        for (var i = 0; i < 5; i++) {
                            var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                            var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));

                            if (oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
                                createData["Massn" + (i + 1)] = '';
                            } else {
                                if (oMassn.getSelectedKey() == "11") fReEntry = true;
                                createData["Massn" + (i + 1)] = oMassn.getSelectedKey();
                            }

                            if (oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
                                createData["Massg" + (i + 1)] = '';
                            } else {
                                createData["Massg" + (i + 1)] = oMassg.getSelectedKey();
                            }
                        }

                        if (fReEntry) createData.Actty = "UC";

                        var fProcess_flag = false;

                        oModel.create("/ActionSubjectListSet", createData, {
                            success: function (data) {
                                if (data) fProcess_flag = true;
                            },
                            error: function (res) {
                                var Err = {};

                                if (res.response) {
                                    Err = window.JSON.parse(res.response.body);
                                    if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                        Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                    } else {
                                        Common.showErrorMessage(Err.error.message.value);
                                    }
                                } else {
                                    Common.showErrorMessage(res);
                                }

                                fProcess_flag = false;
                            }
                        });

                        if (fProcess_flag == false) {
                            BusyIndicator.hide();
                            return;
                        }
                    }

                    BusyIndicator.hide();

                    MessageBox.alert(oController.getBundleText("MSG_02020"), {
                        title: oController.getBundleText("LABEL_02093"),
                        onClose: function () {
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
                        }
                    });
                };

                BusyIndicator.show(0);

                setTimeout(saveProcess, 300);
            },

            onChangeReasonSwitch: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oIssuedTypeMatrix2 = $.app.byId(oController.PAGEID + "_IssuedTypeMatrix2");

                if (oEvent.getParameter("state") == false) {
                    oIssuedTypeMatrix2.setVisible(false);
                } else {
                    oIssuedTypeMatrix2.setVisible(true);
                }
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModel({
                    name: "951009"
                });
            } : null
        });
    }
);