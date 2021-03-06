sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_WorkCalendarBasic.List", {
            getControllerName: function () {
                return "ZUI5_HR_WorkCalendarBasic.List";
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
                                        new sap.m.Label({text: "{i18n>LABEL_63002}"}), // 대상연월
                                        new sap.m.DatePicker({
                                            valueFormat : "yyyyMM",
                                            displayFormat : "yyyy.MM",
                                            value : "{Zyymm}",
                                            width : "200px",
                                            textAlign : "Begin",
                                            change : oController.onChangeDate
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
                
                var oLegend = new sap.m.Toolbar({
                    height : "46px",
                    content : [new sap.m.Text({text : "{i18n>LABEL_63011}", width : "100px", textAlign : "Center"}).addStyleClass("legend-blue FontWhite p-5px"), // 승인데이터
                               new sap.m.Text({text : "{i18n>LABEL_63012}", width : "100px", textAlign : "Center"}).addStyleClass("legend-orange FontWhite p-5px"), // 이상데이터
                               new sap.m.Text({text : "{i18n>LABEL_63013}", width : "100px", textAlign : "Center"}).addStyleClass("legend-green FontWhite p-5px"), // 소명신청
                               new sap.m.ToolbarSpacer(),
                               new sap.m.MessageStrip({
                                      type : "Success",
                                      text : "{i18n>MSG_63009}" // 근무시간 집계는 매일 오전 중 집계됩니다. (전일 데이터 집계)
                               })]
                }).addStyleClass("toolbarNoBottomLine pt-10px pl-0 pr-0");
                
                var oCalendar = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Calendar").addStyleClass("pt-10px pb-10px");
                
                var oPage = new common.PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oFilter, oLegend, oCalendar]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
