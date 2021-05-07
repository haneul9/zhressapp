sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Workhome.List", {
            getControllerName: function () {
                return "ZUI5_HR_Workhome.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                
                var oFilter = new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({text: "{i18n>LABEL_48002}"}), // 부서/사원
                                        new sap.m.Input({
                                            width: "140px",
                                            value: "{Ename}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: oController.searchOrgehPernr,
                                            editable : {
                                                path : "Persa",
                                                formatter : function(fVal){
                                                    return (fVal && fVal.substring(0,1) == "D") ? false : true;
                                                }
                                            }
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_48003}"}), // 대상기간
                                        new sap.m.DateRangeSelection({
                                            displayFormat: gDtfmt,
                                            dateValue: "{Begda}",
                                            secondDateValue: "{Endda}",
                                            delimiter: "~",
                                            width: "210px"
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button({
                                            press: oController.onPressSearch,
                                            text: "{i18n>LABEL_00104}" // 검색
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
                    noData: oBundleText.getText("LABEL_00901"), // No data found
                    // cellClick : oController.onPressTable,
                    // rowActionCount : 1,
                    // rowActionTemplate : [new sap.ui.table.RowAction({
                    // 						 items : [new sap.ui.table.RowActionItem({
                    // 								 	  type : "Navigation",
                    // 								 	  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
                    // 								 	  press : function(oEvent){
                    // 								 	  		oController.onPressTable(oEvent, "X");
                    // 								 	  }
                    // 								  })]
                    // 					 })],
                    rowSettingsTemplate : [new sap.ui.table.RowSettings({
                                               highlight : {
                                                       path : "Status",
                                                       formatter : function(fVal){
                                                           if(fVal == "AA"){ // 작성중
                                                               return "Indication01";
                                                           } else if(fVal == "00"){ // 결재중
                                                               return "Indication02";
                                                           } else if(fVal == "88"){ // 반려
                                                               return "Indication03";
                                                           } else if(fVal == "99"){ // 결재완료
                                                               return "Indication04";
                                                           } else {
                                                               return "None";
                                                           }
                                                       }
                                               }
                                           })],
                    extension : [new sap.m.Toolbar({
                                     height : "50px",
                                     content : [new sap.m.ToolbarSpacer(),
                                                new sap.m.HBox({
                                                    items: [
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00196}"}).addStyleClass("custom-legend-item"), // 미결재
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00197}"}).addStyleClass("custom-legend-item"), // 결재중
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-purple"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00201}"}).addStyleClass("custom-legend-item"), // 담당자확인
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00198}"}).addStyleClass("custom-legend-item"), // 반려
                                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                                        new sap.m.Label({text: "{i18n>LABEL_00199}"}).addStyleClass("custom-legend-item") // 결재완료
                                                    ]
                                                }).addStyleClass("custom-legend-group mr-20px"),
                                                new sap.m.HBox({
                                                    items: [
                                                        new sap.m.Button({
                                                            text: "{i18n>LABEL_00129}", // Excel
                                                            press: oController.onExport
                                                        }).addStyleClass("button-light"),
                                                        new sap.m.Button({
                                                            text: "{i18n>LABEL_00152}", // 신청
                                                            press : oController.onPressNew
                                                        }).addStyleClass("button-light")
                                                    ]
                                                }).addStyleClass("button-group")]
                                 }).addStyleClass("toolbarNoBottomLine")]
                }).addStyleClass("mt-10px");
                
                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");
                
                                // 결재상태, 구분, 사번, 성명, 재택근무일, 신청사유, 연락처, 삭제처리, 취소처리
                var col_info = [{id: "Statust", label: "{i18n>LABEL_53005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Cancltx", label: "{i18n>LABEL_48047}", plabel: "", resize: true, span: 0, type: "cancle", sort: true, filter: true},
                                {id: "Pernr", label: "{i18n>LABEL_48004}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Ename", label: "{i18n>LABEL_48005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Begda", label: "{i18n>LABEL_53002}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Bigo", label: "{i18n>LABEL_53003}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "20%", align : "Begin"},
                                {id: "Telnum", label: "{i18n>LABEL_53004}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Delete", label: "{i18n>LABEL_53006}", plabel: "", resize: true, span: 0, type: "process", sort: true, filter: true},
                                {id: "Cancel", label: "{i18n>LABEL_53007}", plabel: "", resize: true, span: 0, type: "process", sort: true, filter: true}];
                
                MakeTable.makeColumn(oController, oTable, col_info);
                
                oTable.addEventDelegate({
                    onAfterRendering : function(){
                        oController._Columns = [];
                        for(var i=0; i<col_info.length-2; i++){
                            var column = {};
                                column.label = oController.getBundleText(common.Common.stripI18nExpression(col_info[i].label));
                                column.property = col_info[i].id;
                                column.type = "string";
                                column.width = 20;
                            oController._Columns.push(column);
                        }
                    }
                });
                
                // 신청안내
                var oInfo = new sap.ui.commons.layout.MatrixLayout({
                    columns : 1,
                    width : "100%",
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Toolbar({
                                                             height : "45px",
                                                             content : [new sap.m.Text({text : "{i18n>LABEL_53008}"}).addStyleClass("sub-title"),
                                                                        new sap.m.ToolbarSpacer(),
                                                                        new sap.m.Button({
                                                                               text : "{i18n>LABEL_53016}",  // 재택근무 가이드
                                                                               press : function(){
                                                                                       window.open("/cmis/3868fc5f124c35d7e47cc206/root/zhressapp/manual/workathome.pdf");
                                                                               }
                                                                        }).addStyleClass("button-light")]
                                                        }).addStyleClass("toolbarNoBottomLine")],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.FormattedText({
                                                             htmlText : "<span>" + "{i18n>MSG_53001}" + "</span><br/>" + // • 재택근무 1일 전까지 부서장 승인을 필수로 받아야 합니다.
                                                                        "<span class='color-info-red'>" + "{i18n>MSG_53002}" + "</span><br/>" + // • 기한 내 승인되지 않을 경우 TMS 사용이 불가합니다.
                                                                        "<span>" + "{i18n>MSG_53003}" + "</span><br/>" + // • 일정 변경을 희망할 경우 해당 일정을 선택/취소한 뒤, 신규 신청해야 합니다.
                                                                        "<span class='color-info-red'>" + "{i18n>MSG_53004}" + "</span>" // • 단, 예정된 재택근무일 포함, 사후 일정 변경은 불가하므로 반드시 사전에 부서장 승인 필요합니다.
                                                         })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("p-15px")]
                            }).addStyleClass("custom-OpenHelp-msgBox")]
                });
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oFilter, oTable, new sap.ui.core.HTML({content : "<div style='height:10px' />"}), oInfo]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
