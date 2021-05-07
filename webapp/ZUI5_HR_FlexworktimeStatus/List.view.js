sap.ui.define(
    [
        "common/PageHelper"
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_FlexworktimeStatus.List", {
            getControllerName: function () {
                return "ZUI5_HR_FlexworktimeStatus.List";
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
                                        new sap.m.Label({text: "{i18n>LABEL_69013}"}), // 대상연월
                                        new sap.m.DatePicker({
                                            valueFormat : "yyyyMM",
                                            displayFormat : "yyyy.MM",
                                            value : "{Zyymm}",
                                            width : "200px",
                                            textAlign : "Begin",
                                            change : oController.onChangeDate
                                        }),
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
                                            width: "140px",
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
                                            }
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
                
                // summary
                var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
                    columns : 10,
                    width : "100%",
                    widths : ["", "", "", "", "", "", "", "10px", "", ""],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63003}", textAlign : "Center"}).addStyleClass("font-bold")], // 소정근로시간\n(평일X8H)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63004}", textAlign : "Center"}).addStyleClass("font-bold")], // 근무시간(평일)\n(A)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63005}", textAlign : "Center"}).addStyleClass("font-bold")], // 연장근로\n(B)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63006}", textAlign : "Center"}).addStyleClass("font-bold")], // 휴일근로\n(C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63007}", textAlign : "Center"}).addStyleClass("font-bold")], // 연장+휴일\n(B+C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63008}", textAlign : "Center"}).addStyleClass("font-bold")], // 근로시간합계\n(A+B+C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_63010}", textAlign : "Center"}).addStyleClass("font-bold")], // 비고
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [],
                                            hAlign : "Center",
                                            vAlign : "Middle",
                                            rowSpan : 2
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_69055}", textAlign : "Center"}).addStyleClass("font-bold")], // 근로시간합계\n(월말예상)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_69056}", textAlign : "Center"}).addStyleClass("font-bold")], // 상태\n(월말예상)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label2")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Ctrnm}"}).addStyleClass("font-bold")], // 소정근로시간\n(평일X8H)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Wrktm}"})], // 근무시간(평일)\n(A)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Exttm}"})], // 연장근로\n(B)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Holtm}"})], // 휴일근로\n(C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Extholtm}"})], // 연장+휴일\n(B+C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Tottm}"})], // 근로시간합계\n(A+B+C)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({ // 비고
                                                            text : {
                                                                parts : [{path : "Ctrnm"}, {path : "Tottm"}, {path : "Notes"}],
                                                                formatter : function(fVal1, fVal2, fVal3){
                                                                    this.removeStyleClass("color-info-red color-blue color-darkgreen");
                                                                    
                                                                    if(fVal1 && fVal2){
                                                                        if(fVal1.replace(":", "") > fVal2.replace(":", "")){
                                                                            this.addStyleClass("color-blue");
                                                                        } else if(fVal1.replace(":", "") < fVal2.replace(":", "")) {
                                                                            this.addStyleClass("color-info-red");
                                                                        } else {
                                                                            this.addStyleClass("color-darkgreen");
                                                                        }
                                                                    }
                                                                    // else {
                                                                    // 	this.addStyleClass("color-darkgreen");
                                                                    // }
                                                                    
                                                                    return fVal3;
                                                                }
                                                            }
                                                        }).addStyleClass("font-bold")],
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Tottm2}"})], // 근로시간합계(월말예상)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({ // 비고
                                                            text : {
                                                                parts : [{path : "Ctrnm"}, {path : "Tottm2"}, {path : "Notes2"}],
                                                                formatter : function(fVal1, fVal2, fVal3){
                                                                    this.removeStyleClass("color-info-red color-blue color-darkgreen");
                                                                    
                                                                    if(fVal1 && fVal2){
                                                                        if(fVal1.replace(":", "") > fVal2.replace(":", "")){
                                                                            this.addStyleClass("color-blue");
                                                                        } else if(fVal1.replace(":", "") < fVal2.replace(":", "")) {
                                                                            this.addStyleClass("color-info-red");
                                                                        } else {
                                                                            this.addStyleClass("color-darkgreen");
                                                                        }
                                                                    }
                                                                    
                                                                    return fVal3;
                                                                }
                                                            }
                                                        }).addStyleClass("font-bold")], // 상태(월말예상)
                                            hAlign : "Center",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            })]
                });
                
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
                    rowSettingsTemplate : [new sap.ui.table.RowSettings({
                                            highlight : {
                                                    path : "Monyn",
                                                    parts : [{path : "Status"}, {path : "Monyn"}],
                                                    formatter : function(fVal1, fVal2){
                                                        if(fVal2 != ""){
                                                            return "Error";
                                                        } else {
                                                            if(fVal1 == "00"){ // 결재중
                                                                return "Indication02";
                                                            } else if(fVal1 == "88"){ // 반려
                                                                return "Indication03";
                                                            } else if(fVal1 == "99"){ // 결재완료
                                                                return "Indication04";
                                                            } else if(fVal1 == "CC"){ // 조정대상
                                                                return "Indication06";
                                                            } else {
                                                                return "None";
                                                            }
                                                        }
                                                    }
                                            }
                                        })],
                    extension : [new sap.m.Toolbar({
                                    height : "40px",
                                    content : [new sap.m.MessageStrip({
                                                    type : "Error",
                                                    text : "{i18n>MSG_69001}" // 작업 후에는 반드시 저장하여 주십시오.
                                                }),
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.HBox({
                                                    items: [
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00197}"}).addStyleClass("custom-legend-item"), // 결재중
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00198}"}).addStyleClass("custom-legend-item"), // 반려
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00199}"}).addStyleClass("custom-legend-item"), // 결재완료
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-lcc-signature-red"),
                                                        new sap.m.Label({text: "{i18n>LABEL_69002}"}).addStyleClass("custom-legend-item"), // 수정
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-yellow"),
                                                        new sap.m.Label({text: "{i18n>LABEL_69057}"}).addStyleClass("custom-legend-item") // 조정대상
                                                    ]
                                                }).addStyleClass("custom-legend-group mr-20px"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_69014}", // 근무일정 일괄입력
                                                    press : oController.onOpenWorktime
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00101}", // 저장
                                                    press : oController.onPressSave
                                                }).addStyleClass("button-dark")]
                                }).addStyleClass("toolbarNoBottomLine mb-10px")],
                    noData: "{i18n>LABEL_00901}" // No data found
                }).addStyleClass("mt-10px");
                
                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");
                
                var col_info = [{id: "Checkbox", label: "", plabel: "", resize: true, span: 0, type: "checkbox", sort: true, filter: true, width : "60px"},
                                // 상태, 일자, 요일, 근태
                                {id: "Statustx", label: "{i18n>LABEL_69054}", plabel: "", resize: true, span: 0, type: "status", sort: true, filter: true, width : "100px"},
                                {id: "Datum", label: "{i18n>LABEL_69003}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
                                {id: "Weektx", label: "{i18n>LABEL_69004}", plabel: "", resize: true, span: 0, type: "weektx", sort: true, filter: true, width : "60px"},
                                {id: "Atext", label: "{i18n>LABEL_69005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                // 시작시간, 종료시간, 점심시간, 추가휴게
                                {id: "Beguz", label: "{i18n>LABEL_69006}", plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
                                {id: "Enduz", label: "{i18n>LABEL_69007}", plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
                                {id: "Lnctm", label: "{i18n>LABEL_69008}", plabel: "", resize: true, span: 0, type: "combobox", sort: true, filter: true},
                                {id: "Adbtm", label: "{i18n>LABEL_69009}", plabel: "", resize: true, span: 0, type: "input", sort: true, filter: true},
                                // 소정근로, 연장근로, 휴일근로, 변경
                                {id: "Wrktm", label: "{i18n>LABEL_69010}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
                                {id: "Exttm", label: "{i18n>LABEL_69011}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
                                {id: "Holtm", label: "{i18n>LABEL_69012}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
                                {id: "", label: "{i18n>LABEL_69050}", plabel: "", resize: true, span: 0, type: "change", sort: true, filter: true, width : "60px"}];
                
                oController.makeTable(oController, oTable, col_info);
                
                var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
                    expandable: false,
                    expanded: true,
                    backgroundDesign: "Transparent",
                    items: [
                        new sap.m.IconTabFilter({
                            key: "1",
                            text: "List",
                            design: "Vertical",
                            content: [oTable]
                        }),
                        new sap.m.IconTabFilter({
                            key: "2",
                            text: "Calendar",
                            design: "Vertical",
                            content: [new sap.m.HBox({
                                        justifyContent : "End",
                                        items: [
                                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                            new sap.m.Label({text: "{i18n>LABEL_00197}"}).addStyleClass("custom-legend-item"), // 결재중
                                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                            new sap.m.Label({text: "{i18n>LABEL_00198}"}).addStyleClass("custom-legend-item"), // 반려
                                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                            new sap.m.Label({text: "{i18n>LABEL_00199}"}).addStyleClass("custom-legend-item"), // 결재완료
                                            new sap.m.Label().addStyleClass("custom-legend-color bg-yellow"),
                                            new sap.m.Label({text: "{i18n>LABEL_69057}"}).addStyleClass("custom-legend-item") // 조정대상
                                        ]
                                    }).addStyleClass("custom-legend-group mr-10px"),
                        //            new sap.m.Toolbar({
                                        // height : "40px",
                                        // content : [new sap.m.Text({text : oBundleText.getText("LABEL_00197"), width : "100px", textAlign : "Center"}).addStyleClass("legend-green FontWhite p-5px"), // 결재중
                                            // 		 new sap.m.Text({text : oBundleText.getText("LABEL_00198"), width : "100px", textAlign : "Center"}).addStyleClass("legend-orange FontWhite p-5px"), // 반려
                                        // 			 new sap.m.Text({text : oBundleText.getText("LABEL_00199"), width : "100px", textAlign : "Center"}).addStyleClass("legend-blue FontWhite p-5px")] // 결재완료
                                    //}).addStyleClass("toolbarNoBottomLine pt-10px pl-0 pr-0"),
                                    new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Calendar").addStyleClass("pt-10px")]
                        })
                    ],
                    select: oController.onPressSearch,
                    content: []
                }).addStyleClass("tab-group mt-16px");
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oFilter, oMatrix1, oIcontabbar]
                            });
                            
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
