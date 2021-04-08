sap.ui.define([
	"common/Common",
	"common/ZHR_TABLES",
    "ZUI5_HR_ActApp/common/Common"
], function (Common, ZHR_TABLES, AcpAppCommon) {
    "use strict";

    var SubjectHandler = {

        oController: null,

        initialize: function(oController) {
            this.oController = oController;

            return this;
        },

        setSubjectList: function (param) {
            var oTable = $.app.byId(this.oController.PAGEID + "_SubjectList");

            param = $.extend(true, {isShowBatyp : false}, param);

            // oTable.setBusyIndicatorDelay(0);
            // oTable.setBusy(true);
            oTable.setFixedColumnCount(0);

            // Get display fields (ZHR_ACTIONAPP_SRV>ActionDisplayFieldSet)
            var vDisplayControl = this.getActionDisplayFields();

            // Make Column model
            var aColModel = [
                { id: "Pchk", label: "", plabel: "", span: 0, type: "Checkbox", width: vDisplayControl.length > 10 ? "50px" : "4%" },
                { id: "Cfmyn", label: "{i18n>LABEL_02041}", plabel: "", span: 0, type: "string", width: vDisplayControl.length > 10 ? "50px" : "4%" },
                { id: "Ename", label: "{i18n>LABEL_02070}", plabel: "", span: 0, type: "string", width: vDisplayControl.length > 10 ? "150px" : "10%", align: sap.ui.core.TextAlign.Begin },
                { id: "Acttx", label: "{i18n>LABEL_02024}", plabel: "", span: 0, type: "string", width: vDisplayControl.length > 10 ? "150px" : "10%", align: sap.ui.core.TextAlign.Begin },
                { id: "Actda", label: "{i18n>LABEL_02014}", plabel: "", span: 0, type: "date", width: vDisplayControl.length > 10 ? "120px" : "6%" }
            ];

            if(param.isShowBatyp === true) {
                aColModel.push(
                    { id: "Batyp", label: "{i18n>LABEL_02045}", plabel: "", span: 0, type: "string", width: vDisplayControl.length > 10 ? "120px" : "6%" }
                );
            } else {
                aColModel.push(
                    { id: "Sub01", label: "{i18n>LABEL_02259}", plabel: "", span: 0, type: "template", width: vDisplayControl.length > 10 ? "120px" : "5%", templateGetter: "templateIconCheck", templateGetterOwner: this.oController.SubjectHandler }
                );
            }

            if (this.oController._vStatu != "00") {
                var leftTableColSize = 60,
                    leftTotalColLength = vDisplayControl.length,
                    calculatePerColSize = vDisplayControl.length > 10 ? "120px" : Math.floor(leftTableColSize / leftTotalColLength) + "%";

                vDisplayControl.forEach(function(elem) {
                    var Fieldname = Common.underscoreToCamelCase(elem.Fieldname),
                        TextFieldname = Fieldname + "_Tx",
                        oneCol = {};

                    oneCol.id = TextFieldname;
                    oneCol.label = elem.Label;
                    oneCol.plabel = "";
                    oneCol.span = 0;
                    oneCol.width = calculatePerColSize;
                    oneCol.align = sap.ui.core.TextAlign.Begin;
                    if(param.isShowBatyp === true) {
                        oneCol.type = "template";
                        oneCol.templateGetter = "templateDiffColorText";
                        oneCol.templateGetterOwner = this.oController.SubjectHandler;
                    } else {
                        oneCol.type = "string";
                    }

                    aColModel.push(oneCol);
                }.bind(this));
            }
            // Make Column model

            // Set fixed columns
            if(vDisplayControl.length > 10) {
                oTable.setFixedColumnCount((param.isShowBatyp === true) ? 6 : 5);
            }

            // Convert Excel column info
            this.oController._Columns = Common.convertColumnArrayForExcel(this.oController, aColModel);

            // Build table column object
            oTable.destroyColumns();
            ZHR_TABLES.makeColumn(this.oController, oTable, aColModel);

            AcpAppCommon.buildTableCommonFields(this.oController, oTable, param.isShowBatyp);

            var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
            var vActionSubjectList = { ActionSubjectListSet: [] };
            var fCompleteCount = false;
            var oneData = null;

            this.getActionSubjectList().forEach(function(element) {
                if (element.Cfmyn == "X") {
                    fCompleteCount = true;
                }

                oneData = {};
                oneData = element;
                oneData.Pchk = this.oController.ListSelected;
                oneData.Acttx = oneData.Acttx.replace(/<br>/g, "\n");
                oneData.ProcessStatus = "W";
                oneData.ProcessStatusText = this.oController.getBundleText("LABEL_02252");
                oneData.ProcessMsg = "";

                vActionSubjectList.ActionSubjectListSet.push(oneData);
            }.bind(this));

            mActionSubjectList.setData(vActionSubjectList);
            this.oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
            
            // oTable.setVisibleRowCount(this.oController._vListLength);
            // Common.adjustAutoVisibleRowCount.call(oTable);

            var oDeleteBtn = $.app.byId(this.oController.PAGEID + "_REQUESTDELETE_BTN");
            if (oDeleteBtn) {oDeleteBtn.setVisible(fCompleteCount ? false : true);}
        },

        setRecSubjectList: function () {
            var oTable = $.app.byId(this.oController.PAGEID + "_SubjectList");

            // oTable.setBusyIndicatorDelay(0);
            // oTable.setBusy(true);
            oTable.setFixedColumnCount(0);

            // Make Column model
            var aColModel = [
                { id: "Pchk", label: "", plabel: "", span: 0, type: "Checkbox", width: "" },
                { id: "Cfmyn", label: "{i18n>LABEL_02041}", plabel: "", span: 0, type: "string", width: "6%" },
                { id: "Ename", label: "{i18n>LABEL_02070}", plabel: "", span: 0, type: "string", width: "10%", align: sap.ui.core.TextAlign.Begin },
                { id: "Acttx", label: "{i18n>LABEL_02024}", plabel: "", span: 0, type: "string", width: "10%", align: sap.ui.core.TextAlign.Begin },
                { id: "Actda", label: "{i18n>LABEL_02014}", plabel: "", span: 0, type: "date", width: "10%" }
            ];

            if (this.oController._vStatu != "00") {
                if (this.oController._vDocty == "20") {
                    for (var i = 0; i < this.oController._vActiveTabNames.length; i++) {
                        aColModel.push({ 
                            id: "Sub" + this.oController._vActiveTabNames[i].Tabid, 
                            label: this.oController._vActiveTabNames[i].Tabtl, 
                            plabel: "", 
                            type: "string", 
                            span: 0, 
                            width: "" 
                        });
                    }
                } else {
                    for (var j = 0; j < 1; j++) {
                        aColModel.push({ 
                            id: "Sub" + this.oController._vActiveTabNames[j].Tabid, 
                            label: this.oController._vActiveTabNames[j].Tabtl, 
                            plabel: "", 
                            type: "string", 
                            span: 0, 
                            width: "" 
                        });
                    }
                }

                var calculatePerColSize = Math.floor(90 / (aColModel.length - 2));
                aColModel.forEach(function(elem, idx) {
                    if(idx > 1) {elem.width = calculatePerColSize + "%";}
                });
            }
            // Make Column model

            // Convert Excel column info
            this.oController._Columns = Common.convertColumnArrayForExcel(this.oController, aColModel);

            // Build table column object
            oTable.destroyColumns();
            ZHR_TABLES.makeColumn(this.oController, oTable, aColModel);

            var isShowBatyp = false;
            AcpAppCommon.buildTableCommonFields(this.oController, oTable, isShowBatyp);

            aColModel.forEach(function (element, index) {
                if (index > 4) {
                    oTable.getColumns()[index].setTemplate(
                        this.templateIconCheck(element)
                    );
                }
            }.bind(this));

            var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
            var vActionSubjectList = { ActionSubjectListSet: [] };
            var fCompleteCount = false;
            var oneData = null;

            this.oController._vActionCount = 0;
            this.oController._vRehireCount = 0;

            this.getActionSubjectList().forEach(function(element) {
                if (element.Cfmyn == "X") {
                    fCompleteCount = true;
                }

                oneData = {};
                oneData = element;
                oneData.Pchk = this.oController.ListSelected;
                oneData.Acttx = oneData.Acttx.replace(/<br>/g, "\n");
                oneData.ProcessStatus = "W";
                oneData.ProcessStatusText = this.oController.getBundleText("LABEL_02252");
                oneData.ProcessMsg = "";

                if (oneData.Massn1 != "") {this.oController._vActionCount++;}
                if (oneData.Sub08 != "") {this.oController._vRehireCount++;}

                vActionSubjectList.ActionSubjectListSet.push(oneData);
            }.bind(this));

            mActionSubjectList.setData(vActionSubjectList);
            this.oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
            
            // oTable.setVisibleRowCount(this.oController._vListLength);
            // Common.adjustAutoVisibleRowCount.call(oTable);

            var oDeleteBtn = $.app.byId(this.oController.PAGEID + "_REQUESTDELETE_BTN");
            if (oDeleteBtn) {oDeleteBtn.setVisible(fCompleteCount? false : true);}
        },

        getActionSubjectList: function() {
            var results = [];

            if(!this.oController._vDocno) {return [];}

            $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionSubjectListSet", {
                async: false,
                filters: [
                    new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, this.oController._vDocno),
                    new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, this.oController._vReqno)
                ],
                success: function (oData) {
                    if (oData.results && oData.results.length) {
                        results = oData.results;
                    }
                },
                error: function (oError) {
                    Common.log(oError);
                }
            });

            return results;
        },

        getActionDisplayFields: function () {

            var results = [];

            try {
                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionDisplayFieldSet", {
                    async: false,
                    filters: [
                        new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, this.oController._vDocno)
                    ],
                    success: function (oData) {
                        oData.results.forEach(function (element) {
                            results.push(element);
                        });
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            } catch (ex) {
                Common.log(ex);
            }

            return results;
        },
        
        templateDiffColorText: function(oColumnInfo) {
            return new sap.ui.commons.TextView({
                text: "{" + oColumnInfo.id + "}",
                textAlign: sap.ui.core.TextAlign.Begin,
                design: sap.ui.commons.TextViewDesign.Bold,
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
            });
        },

        templateIconCheck: function(oColumnInfo) {
            return new sap.m.Image({
                width: {
                    path: oColumnInfo.id,
                    formatter: function (fVal) {
                        if (fVal == undefined || fVal == "") {
                            return "";
                        } else {
                            return "16px";
                        }
                    }
                },
                height: {
                    path: oColumnInfo.id,
                    formatter: function (fVal) {
                        if (fVal == undefined || fVal == "") {
                            return "";
                        } else {
                            return "16px";
                        }
                    }
                },
                src: {
                    path: oColumnInfo.id,
                    formatter: function (fVal) {
                        if (fVal == undefined || fVal == "") {
                            return "";
                        } else {
                            fVal = parseInt(fVal);
                            return fVal > 0 ? "images/check-icon.png" : "";
                        }
                    }
                }
            });
        },

        afterScroll: function() {
            Common.clearRowspan($.app.byId(this.oController.PAGEID + "_SubjectList"));

            setTimeout(this.onAfterRenderingTable.bind(this), 100);
        },

        onAfterRenderingTable : function() {
            var oTable = $.app.byId(this.oController.PAGEID + "_SubjectList");
            var aRows = oTable.getRows();
            var byCols = [2];   // group by the cols "byCols"
            var theCols = [0, 1, 2, 3, 4];  // the cols "theCols" (if none selected, we will use all)

            oTable.setBusyIndicatorDelay(0).setBusy(true);
    
            // Aggregate columns (by cols) for similar values
            if (aRows && aRows.length > 0) {
                var pRow;
                aRows.map(function(aRow, idx) {
                    if (idx > 0) {
                        var cCells = aRow.getCells();
                        var pCells = pRow.getCells();

                        // if theCols is empty we use aggregation for all cells in a row
                        if (theCols.length < 1) {byCols = cCells.map(function(x, i) { return i; });}

                        if (byCols.filter(function(x) { return pCells[x].getText() == cCells[x].getText(); }).length == byCols.length) {
                            theCols.forEach(function(i) {
                                var rowspan = $("#" + pCells[i].getId()).attr("rowspan") || 1;
                                rowspan = Number(rowspan) + 1;

                                if($("#" + pCells[i].getId()).parent().parent().is(":visible")) {
                                    $("#" + cCells[i].getId()).parent().parent().hide();
                                }
                                $("#" + pCells[i].getId()).parent().parent().attr("rowspan", rowspan);
                                if (aRows.length === idx + 1) {
                                    $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
                                }
                            });
                        }
                    }
                    pRow = aRow;
                });
            }
                
            oTable.setBusy(false);
        }
    };

    return SubjectHandler;
});