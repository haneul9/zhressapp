/* eslint-disable no-undef */
jQuery.sap.declare("ZUI5_HR_ActApp.common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");

ZUI5_HR_ActApp.common.Common = {
    /**
     * @memberOf ZUI5_HR_ActApp.common.Common
     */

    oSubjectList: null,

    loadCodeData: function (oController, Persa, Actda, Controls, Persa_nc) {
        if (!Controls || !Controls.length) {return;}

        var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList"),
            vEmpCodeList = {
                EmpCodeListSet: []
            },
            aFilters = [],
            aSubFilters = [];

        aFilters = [
			new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, Persa),
            new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(Actda)),
            new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
            new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
            new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
            new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
		];

        if (Persa_nc == "X") {
            aFilters.push(new sap.ui.model.Filter("Persa_nc", sap.ui.model.FilterOperator.EQ, "X"));
        }

        var vPercod;

        vEmpCodeList.EmpCodeListSet = Controls.map(function (elem) {
            var Fieldname = common.Common.underscoreToCamelCase(elem.Fieldname);
            aSubFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, Fieldname));

            if (Fieldname === "AddOrgeh") {
                var oListControl = $.app.byId("ActAppPersonInfo_List");
                var selectedItems = oListControl.getSelectedItems();
                var oEmpModel = sap.ui.getCore().getModel("ActionSubjectList_Temp");

                if (oListControl.getMode() === "None") {
                    vPercod = oEmpModel.getProperty("/ActionSubjectListSet/0/Percod");
                } else {
                    vPercod = oEmpModel.getProperty(selectedItems[0].getBindingContextPath() + "/Percod");
                }
            }

            return {
                Field: Fieldname,
                Ecode: "0000",
                Etext: oController.getBundleText("LABEL_02035") // -- 선택 --
            };
        });

        if (vPercod) {
            aFilters.push(new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, vPercod));
        }

        if (aSubFilters.length) {
            aFilters.push(new sap.ui.model.Filter({
                filters: aSubFilters,
                and: false
            }));
        }

        $.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
            async: false,
            filters: aFilters,
            success: function (data) {
                if (data && data.results) {
                    vEmpCodeList.EmpCodeListSet = vEmpCodeList.EmpCodeListSet.concat(data.results);
                    mEmpCodeList.setData(vEmpCodeList);
                }
            },
            error: function (res) {
                common.Common.log(res);
            }
        });
    },

    buildTableCommonFields: function (oController, oTable, isShowBatyp) {
        // Column id: Pchk, index: 0
        oTable.getColumns()[0].setTemplate(
            new sap.m.CheckBox({
                selected: "{Pchk}",
                select: oController.toggleCheckbox
            }).addStyleClass("FontFamily")
        );

        // Checkbox select all Add
        oTable.getColumns()[0].removeAllMultiLabels();
        oTable.getColumns()[0].addMultiLabel(
            new sap.m.CheckBox(oController.PAGEID + "_checkAll", {
                select: oController.checkAll
            })
        );

        // Column id: Cfmyn, index: 1
        oTable.getColumns()[1].setTemplate(
            new sap.ui.core.Icon({
                size: "1.0rem",
                src: {
                    path: "Cfmyn",
                    formatter: function (fVal) {
                        if (fVal == "X") {
                            // 완료
                            return "sap-icon://accept";
                        } else if (fVal == "E") {
                            // 오류
                            return "sap-icon://error";
                        } else if (fVal == "L") {
                            // 잠금
                            return "sap-icon://locked";
                        } else {
                            return null;
                        }
                    }
                },
                color: {
                    path: "Cfmyn",
                    formatter: function (fVal) {
                        if (fVal == "X") {
                            // 완료
                            return "#8DC63F";
                        } else if (fVal == "E") {
                            // 오류
                            return "#F45757";
                        } else if (fVal == "L") {
                            // 잠금
                            return "#54585A";
                        } else {
                            return "";
                        }
                    }
                },
                alt: {
                    path: "Cfmyn",
                    formatter: function (fVal) {
                        if (fVal == "X") {
                            // 완료
                            return oController.getBundleText("LABEL_02149");
                        } else if (fVal == "E") {
                            // 오류
                            return oController.getBundleText("LABEL_02150");
                        } else if (fVal == "L") {
                            // 잠금
                            return oController.getBundleText("LABEL_02151");
                        } else {
                            return "";
                        }
                    }
                }
            })
        );

        // Column id: Ename, index: 2
        oTable.getColumns()[2].setTemplate(
            new sap.m.Link({
                text: "{Ename}({Pernr})"
            })
            .addStyleClass("L2PFontFamily L2PFontColorBlue")
            .attachBrowserEvent("click", oController.onInfoViewPopup)
        );

        if (isShowBatyp) {
            // Column id: Batyp, index: 5
            oTable.getColumns()[5].setTemplate(
                new sap.ui.commons.TextView({
                    text: {
                        path: "Batyp",
                        formatter: function (fVal) {
                            if (fVal == "A") {
                                return "After";
                            } else {
                                return "Before";
                            }
                        }
                    },
                    textAlign: sap.ui.core.TextAlign.Center,
                    design: sap.ui.commons.TextViewDesign.Bold,
                    tooltip: " ",
                    semanticColor: {
                        path: "Batyp",
                        formatter: function (fVal) {
                            if (fVal == "A") {
                                return sap.ui.commons.TextViewColor.Critical;
                            } else {
                                return sap.ui.commons.TextViewColor.Default;
                            }
                        }
                    }
                })
            );
        }
    },

    onAfterOpenDetailViewPopover: function (oController) {
        var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
        var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: gDtfmt
        });
        var vAfterData = {};
        var vBeforeData = {};
        var vDisplayControl = [];

        try {
            oModel.read("/ActionSubjectListSet", {
                async: false,
                filters: [
					new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vSelected_Reqno),
					new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vSelected_Docno),
					new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController._vSelected_Percod),
					new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vSelected_VoltId),
                    new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vSelected_Actda)),
                    new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
                    new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
                    new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
                    new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
				],
                success: function (oData) {
                    if (oData.results && oData.results.length) {
                        vAfterData = oData.results[0];
                        vBeforeData = oData.results[1];
                    }
                },
                error: function (oResponse) {
                    common.Common.log(oResponse);
                }
            });
        } catch (ex) {
            common.Common.log(ex);
        }

        var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
        oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));

        var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
        oIssuedTypeMatrix.removeAllRows();

        var oCell, oRow;

        var vMassLabels = [
			oController.getBundleText("LABEL_02008"),
			oController.getBundleText("LABEL_02009"),
			oController.getBundleText("LABEL_02010"),
			oController.getBundleText("LABEL_02011"),
			oController.getBundleText("LABEL_02012")
		];

        for (var i = 0; i < vMassLabels.length; i++) {
            var vMntxt = vAfterData["Mntxt" + (i + 1)];
            var vMgtxt = vAfterData["Mgtxt" + (i + 1)];

            var vMassn = vAfterData["Massn" + (i + 1)];
            var vMassg = vAfterData["Massg" + (i + 1)];

            if (vMassn != "" && vMassg != "") {
                oRow = new sap.ui.commons.layout.MatrixLayoutRow();

                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    hAlign: sap.ui.commons.layout.HAlign.Begin,
                    vAlign: sap.ui.commons.layout.VAlign.Middle,
                    content: [new sap.m.Label({
                        text: vMassLabels[i]
                    }).addStyleClass("L2PFontFamily")]
                }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
                oRow.addCell(oCell);

                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    hAlign: sap.ui.commons.layout.HAlign.Begin,
                    vAlign: sap.ui.commons.layout.VAlign.Middle,
                    content: new sap.m.Text({
                        text: vMntxt + " / " + vMgtxt
                    }).addStyleClass("L2PFontFamily")
                }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
                oRow.addCell(oCell);

                oIssuedTypeMatrix.addRow(oRow);
            }
        }

        oModel.read("/ActionDisplayFieldSet", {
            async: false,
            filters: [
				new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
			],
            success: function (oData) {
                if (oData.results && oData.results.length) {
                    for (var i = 0; i < oData.results.length; i++) {
                        var isExists = false;
                        if (vDisplayControl) {
                            for (var j = 0; j < vDisplayControl.length; j++) {
                                if (vDisplayControl[j].Fieldname == oData.results[i].Fieldname) {
                                    isExists = true;
                                    break;
                                }
                            }
                        }

                        if (isExists == false) {
                            vDisplayControl.push(oData.results[i]);
                        }
                    }
                }
            },
            error: function (oResponse) {
                common.Common.log(oResponse);
            }
        });

        oCell = null;
        oRow = null;

        var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_AD_MatrixLayout");
        if (oMatrixLayout) {
            oMatrixLayout.removeAllRows();
            oMatrixLayout.destroyRows();
        }

        oRow = new sap.ui.commons.layout.MatrixLayoutRow();

        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Begin,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: [new sap.m.Label({
                text: oController.getBundleText("LABEL_02022")
            }).addStyleClass("L2PFontFamily")]
        }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
        oRow.addCell(oCell);

        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Begin,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: [new sap.m.Label({
                text: oController.getBundleText("LABEL_02044")
            }).addStyleClass("L2PFontFamily")]
        }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
        oRow.addCell(oCell);

        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Begin,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: [new sap.m.Label({
                text: oController.getBundleText("LABEL_02003")
            }).addStyleClass("L2PFontFamily")]
        }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
        oRow.addCell(oCell);

        oMatrixLayout.addRow(oRow);

        vDisplayControl.forEach(function (elem) {
            var Fieldname = common.Common.underscoreToCamelCase(elem.Fieldname),
                TextFieldname = Fieldname + "_Tx",
                ChangeFieldname = Fieldname + "C";

            oRow = new sap.ui.commons.layout.MatrixLayoutRow();

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                hAlign: sap.ui.commons.layout.HAlign.Begin,
                vAlign: sap.ui.commons.layout.VAlign.Middle,
                content: [new sap.m.Label({
                    text: elem.Label
                }).addStyleClass("L2PFontFamily")]
            }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
            oRow.addCell(oCell);

            var oAfterControl = new sap.m.Text().addStyleClass("L2PFontFamily");
            var oBeforeControl = new sap.m.Text().addStyleClass("L2PFontFamily");

            oAfterControl.setText(vAfterData[TextFieldname]);
            oBeforeControl.setText(vBeforeData[TextFieldname]);

            var vTmp = vAfterData[ChangeFieldname];
            if (vTmp == "X") {
                oAfterControl.addStyleClass("L2PFontColorBlue L2PFontFamilyBold");
            }

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                hAlign: sap.ui.commons.layout.HAlign.Begin,
                vAlign: sap.ui.commons.layout.VAlign.Middle,
                content: oBeforeControl
            }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
            oRow.addCell(oCell);

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                hAlign: sap.ui.commons.layout.HAlign.Begin,
                vAlign: sap.ui.commons.layout.VAlign.Middle,
                content: oAfterControl
            }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
            oRow.addCell(oCell);

            oMatrixLayout.addRow(oRow);
        });
    },

    onAfterOpenRecDetailViewPopover: function (oController) {
        var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
        var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: gDtfmt
        });
        var vAfterData = {};
        var vDisplayControl = [];

        try {
            oModel.read("/ActionSubjectListSet", {
                async: false,
                filters: [
					new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vSelected_Reqno),
					new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vSelected_Docno),
					new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController._vSelected_Percod),
					new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vSelected_VoltId),
                    new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vSelected_Actda)),
                    new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
                    new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
                    new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
                    new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
				],
                success: function (oData) {
                    if (oData.results && oData.results.length) {
                        vAfterData = oData.results[0];
                    }
                },
                error: function (oResponse) {
                    common.Common.log(oResponse);
                }
            });

            oModel.read("/ActionDisplayFieldSet", {
                async: false,
                filters: [
					new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vSelected_Docno)
				],
                success: function (data) {
                    if (data.results && data.results.length) {
                        for (var i = 0; i < data.results.length; i++) {
                            vDisplayControl.push(data.results[i]);
                        }
                    }
                },
                error: function (res) {
                    common.Common.log(res);
                }
            });
        } catch (ex) {
            common.Common.log(ex);
        }

        var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_Actda");
        oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));

        var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_IssuedTyp");
        oIssuedTypeMatrix.removeAllRows();

        var oCell, oRow;

        var vMassLabels = [oController.getBundleText("LABEL_02013")];

        for (var i = 0; i < vMassLabels.length; i++) {
            var vMassn = vAfterData["Mntxt" + (i + 1)];
            var vMassg = vAfterData["Mgtxt" + (i + 1)];

            if (vMassn != "" && vMassg != "") {
                oRow = new sap.ui.commons.layout.MatrixLayoutRow({
                    height: "40px"
                });

                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    hAlign: sap.ui.commons.layout.HAlign.Begin,
                    vAlign: sap.ui.commons.layout.VAlign.Middle,
                    content: [new sap.m.Label({
                        text: vMassLabels[i]
                    }).addStyleClass("L2PFontFamily")]
                }).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
                oRow.addCell(oCell);

                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    hAlign: sap.ui.commons.layout.HAlign.Begin,
                    vAlign: sap.ui.commons.layout.VAlign.Middle,
                    content: new sap.m.Text({
                        text: vMassn + " / " + vMassg
                    }).addStyleClass("L2PFontFamily")
                }).addStyleClass("L2PMatrixData L2PPaddingLeft10");
                oRow.addCell(oCell);

                oIssuedTypeMatrix.addRow(oRow);
            }
        }

        oCell = null;
        oRow = null;

        var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_MatrixLayout");
        if (oMatrixLayout) {
            oMatrixLayout.removeAllRows();
            oMatrixLayout.destroyRows();
        }

        vDisplayControl.forEach(function (elem, index) {
            var Fieldname = common.Common.underscoreToCamelCase(elem.Fieldname),
                TextFieldname = Fieldname + "_Tx";

            if (index % 2 == 0) {oRow = new sap.ui.commons.layout.MatrixLayoutRow({
                height: "40px"
            });}

            var vHeaderText = "";
            if (elem.Label && elem.Label != "") {
                vHeaderText = elem.Label;
            } else {
                vHeaderText = elem.Label;
            }

            var oLabel = new sap.m.Label({
                text: vHeaderText
            }).addStyleClass("L2PFontFamily");
            oLabel.setTooltip(vHeaderText);

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                hAlign: sap.ui.commons.layout.HAlign.Begin,
                vAlign: sap.ui.commons.layout.VAlign.Middle,
                content: [oLabel]
            }).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
            oRow.addCell(oCell);

            var oAfterControl = new sap.m.Text().addStyleClass("L2PFontFamily");
            oAfterControl.setText(vAfterData[TextFieldname]);
            oAfterControl.setTooltip(vAfterData[TextFieldname]);

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                hAlign: sap.ui.commons.layout.HAlign.Begin,
                vAlign: sap.ui.commons.layout.VAlign.Middle,
                content: oAfterControl
            }).addStyleClass("L2PMatrixData L2PPaddingLeft10");
            oRow.addCell(oCell);

            if (index % 2 == 1) {
                oMatrixLayout.addRow(oRow);
            }
        });
    }
};