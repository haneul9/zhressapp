jQuery.sap.require("common.makeTable");
sap.ui.define(
    [
        "common/PageHelper"
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Yeartax.YearTaxDetail", {
            getControllerName: function () {
                return "ZUI5_HR_Yeartax.YearTaxDetail";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_YEARTAX_SRV");
                
                var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
                    expandable : false,
                    expanded : true,
                    backgroundDesign : "Transparent",
                    items : [/*new sap.m.IconTabFilter({
                                 key : "1",
                                 icon : "sap-icon://bbyd-dashboard",
                                 text : "종합안내",
                                 design : "Vertical",
                                 iconColor : "Default",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail01", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://process"}),*/
                             new sap.m.IconTabFilter({
                                 key : "2",
                                 //icon : "sap-icon://family-care",
                                 text : "인적공제",
                                 design : "Vertical",
                                 //iconColor : "Critical",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail02", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
                             new sap.m.IconTabFilter({
                                 key : "3",
                                 //icon : "sap-icon://attachment",
                                 text : "국세청자료",
                                 design : "Vertical",
                                 //iconColor : "Neutral",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail03", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
                             new sap.m.IconTabFilter({
                                 key : "4",
                                 //icon : "sap-icon://money-bills",
                                 text : "소득공제",
                                 design : "Vertical",
                                 //iconColor : "Negative",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
                             new sap.m.IconTabFilter({
                                 key : "7",
                                 //icon : "sap-icon://building",
                                 text : "종(전)근무지",
                                 design : "Vertical",
                                 //iconColor : "Negative",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail07", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
                             new sap.m.IconTabFilter({
                                 key : "5",
                                 //icon : "sap-icon://approvals",
                                 text : "양식출력",
                                 design : "Vertical",
                                 //iconColor : "Positive",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail05", oController)]
                             }),
                             new sap.m.IconTabSeparator({icon : "sap-icon://vertical-grip"}),
                             new sap.m.IconTabFilter({
                                 key : "6",
                                 //icon : "sap-icon://simulate",
                                 text : "모의실행",
                                 design : "Vertical",
                                 //iconColor : "Positive",
                                 content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail06", oController)]
                             })],
                    select : oController.handleIconTabBarSelect,
                    content : []
                }).addStyleClass("tab-group mt-16px");	
                
                /////////////////////////////////////////////////////////////
                var oButton = new sap.m.HBox({
                	justifyContent : "End",
                    items : [
                        new sap.m.Button({
                            text : "삭제",
                            press : oController.onPressDelete7,
                            visible : {
                                parts : [{path : "Pystat"}, {path : "Yestat"}, {path : "Key"}],
                                formatter : function(fVal1, fVal2, fVal3){
                                    return fVal1 == "1" && fVal2 == "1" && fVal3 == "7" ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text : "저장",
                            press : oController.onPressSave,
                            visible : {
                                parts : [{path : "Pystat"}, {path : "Yestat"}],
                                formatter : function(fVal1, fVal2){
                                    return fVal1 == "1" && fVal2 == "1" ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text : "최종입력완료",
                            press : oController.onPressComplete,
                            visible : {
                                parts : [{path : "Pystat"}, {path : "Yestat"}],
                                formatter : function(fVal1, fVal2){
                                    return fVal1 == "1" && fVal2 == "1" ? true : false;
                                }
                            }
                        }).addStyleClass("button-dark")
                    ],
                    visible : {
                        parts : [{path : "Pystat"}, {path : "Yestat"}],
                        formatter : function(fVal1, fVal2){
                            return fVal1 == "1" && fVal2 == "1" ? true : false;
                        }
                    }
                }).addStyleClass("button-group");
        
                var oPage = new PageHelper({
                    idPrefix : oController.PAGEID,
                    contentItems: [oButton, oIcontabbar]
                });
                
                oPage.setModel(oController._DetailJSonModel);
                oPage.bindElement("/Data");
                 
                return oPage;
            }
        });
    }
);
