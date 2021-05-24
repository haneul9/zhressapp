jQuery.sap.require("common.makeTable");
sap.ui.define(
    [
        "common/PageHelper"
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Yeartax.YearTaxList", {
            getControllerName: function () {
                return "ZUI5_HR_Yeartax.YearTaxList";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_YEARTAX_SRV");
                
                var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
                    width : "100%",
                    widths : ["2rem", "", "2rem"],
                    columns : 3,
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "10px"
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({
                                                            text : "{Msg}" 
                                                        }).addStyleClass("FontFamily FontBold")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }),
                                         new sap.ui.commons.layout.MatrixLayoutCell()]
                            })]
                });
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oContentMatrix]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                        
                // var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
                // 	content : [oContentMatrix],
                // 	customHeader : [new sap.m.Bar({
                // 						contentMiddle : [new sap.m.Text({text : "연말정산 입력 및 조회"}).addStyleClass("TitleFont")]
                // 				    })],
                // 	footer : [new sap.m.Bar({contentRight : []})]
                // }).addStyleClass("WhiteBackground");
                
                // oPage.setModel(oController._ListCondJSonModel);
                // oPage.bindElement("/Data");
                 
                return oPage;
            }
        });
    }
);
