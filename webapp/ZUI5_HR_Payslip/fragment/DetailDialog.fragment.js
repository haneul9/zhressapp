sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_Payslip.fragment.DetailDialog", {
        /** Specifies the Controller belonging to this View.
         * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
         * @memberOf fragment.SelectMassn
         */

        createContent: function (oController) {
            var oDialog = new sap.m.Dialog(oController.PAGEID + "_DetailDialog", {
                contentWidth: "1400px",
                contentHeight: "75vh",
                title: "{i18n>LABEL_54001}", // 급여내역 조회
                content: [
                    this.getSearchHBox(oController), //
                    new sap.ui.layout.VerticalLayout(oController.PAGEID + "_PDF")
                ],
                buttons: [
                    new sap.m.Button({
                        text: oController.getBundleText("LABEL_00133"), // 닫기
                        press: function () {
                            oDialog.close();
                        }
                    }).addStyleClass("button-default custom-button-divide")
                ]
            })
                .addStyleClass("custom-dialog-popup")
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");

            return oDialog;
        },

        getSearchHBox: function (oController) {
            return new sap.m.HBox(oController.PAGEID + "_Searchbar", {
                fitContainer: true,
                items: [
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: "{i18n>LABEL_54002}" }), // 대상년월
                            new sap.m.Select({
                                width: "120px",
                                selectedKey: "{Year}",
                                items: {
                                    path: "/Year",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                },
                                change: function(){
                                    oController.getOcrsnList();
                                }
                            }),
                            new sap.m.Label({
                                text: "{i18n>LABEL_54003}", // 년
                                textAlign: sap.ui.core.HorizontalAlign.Left
                            }).addStyleClass("mx-10px"),
                            new sap.m.Select({
                                width: "80px",
                                selectedKey: "{Month}",
                                items: {
                                    path: "/Month",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                },
                                change: function(){
                                    oController.getOcrsnList();
                                }
                            }),
                            new sap.m.Label({
                                text: "{i18n>LABEL_54004}", // 월
                                textAlign: sap.ui.core.HorizontalAlign.Left
                            }).addStyleClass("mx-10px"),

                            new sap.m.Label({
                                text: "{i18n>LABEL_02045}" // 구분
                            }).addStyleClass("mx-10px"),
                            new sap.m.Select(oController.PAGEID +"_Seqnr",{
                                width: "120px",
                                selectedKey: "{Seqnr}",
                                items: {
                                    path: "/Ocrsn",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Seqnr}", text: "{Ocrtx}" })
                                }
                            })
                        ]
                    }).addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onPressSearchDetail,
                                text: "{i18n>LABEL_00100}" // 조회
                            }).addStyleClass("button-search")
                        ]
                    }).addStyleClass("button-group")
                ]
            })
                .addStyleClass("search-box search-bg pb-7px mt-24px")
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
        }
    });
});
