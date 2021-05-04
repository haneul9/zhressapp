sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_FreeWorkReportMonthly.List", {
            getControllerName: function () {
                return "ZUI5_HR_FreeWorkReportMonthly.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_FLEX_TIME_SRV");
                
                var oFilter = new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({text: "{i18n>LABEL_60008}"}), // 대상기간
                                        new sap.m.DatePicker({
                                            valueFormat : "yyyyMM",
                                            displayFormat : "yyyy.MM",
                                            value : "{Zyymm1}",
                                            width : "200px",
                                            textAlign : "Begin",
                                            change : oController.onChangeDate
                                        }),
                                        new sap.m.DatePicker({
                                            valueFormat : "yyyyMM",
                                            displayFormat : "yyyy.MM",
                                            value : "{Zyymm2}",
                                            width : "200px",
                                            textAlign : "Begin",
                                            change : oController.onChangeDate
                                        }).addStyleClass("pl-5px"),
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_48002}", // 부서/사원
                                            visible : {
                                                path : "Werks",
                                                formatter : function(fVal){
                                                    if(gAuth == "M"){
                                                        return true;	
                                                    } else {
                                                        if(fVal && fVal.substring(0,1) != "D"){
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                        }), 
                                        new sap.m.Input({
                                            width: "200px",
                                            value: "{Ename}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: oController.searchOrgehPernr,
                                            visible : {
                                                path : "Werks",
                                                formatter : function(fVal){
                                                    if(gAuth == "M"){
                                                        return true;	
                                                    } else {
                                                        if(fVal && fVal.substring(0,1) != "D"){
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                }
                                            },
                                            // editable : {
                                            //     path : "Chief",
                                            //     formatter : function(fVal){
                                            //         return ($.app.APP_AUTH == "M" && fVal == "") ? false : true;
                                            //     }
                                            // } // 2021-05-04 부서장 확인 여부 주석처리
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button({
                                            press: oController.onPressSearch,
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                }).addStyleClass("search-box search-bg pb-7px mt-16px");
                
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}" // No data found
                }).addStyleClass("mt-10px");
                
                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");
                
                                // 연월, 사번, 성명, 소정근로시간, 근무시간(평일), 연장근로, 휴일근로, 연장+휴일, 근로시간합계, 재근시간기준, 비고
                var col_info = [{id: "Wkym", label: "{i18n>LABEL_64004}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
				                {id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
				                {id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Dutyt", label: "{i18n>LABEL_64005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Workt", label: "{i18n>LABEL_64006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Overt", label: "{i18n>LABEL_64007}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Holit", label: "{i18n>LABEL_64008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Sumoh", label: "{i18n>LABEL_64009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Sumtm", label: "{i18n>LABEL_64010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Workt2", label: "{i18n>LABEL_64011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "DutycT", label: "{i18n>LABEL_64012}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "20%"}];
                
                MakeTable.makeColumn(oController, oTable, col_info);
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oFilter, oTable]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
