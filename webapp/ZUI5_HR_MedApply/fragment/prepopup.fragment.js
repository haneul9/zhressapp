sap.ui.define(
    [
        "common/PickOnlyDatePicker" //
    ],
    function (PickOnlyDatePicker) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.prepopup", {
            
            createContent: function (oController) {

                var oDatum = new PickOnlyDatePicker({
                    width: "156px",
                    displayFormat: gDtfmt,
                    placeholder: gDtfmt,
                    valueFormat: "yyyy-MM-dd"
                });

                var oDialog = new sap.m.Dialog({
                    content: [
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            fitContainer: true,
                            items: [
                                this.buildBody(oController, oDatum)
                            ]
                        }).addStyleClass("paddingbody")
                    ],
                    title: "{i18n>LABEL_47088}",    // 진료일 지정
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00133}", // 닫기
                            press: oController.onClose3
                        }).addStyleClass("button-default")
                    ],
                    contentWidth: "350px",
                    afterOpen: function () {
                        oController.onAfterOpen3(oDatum);
                    }
                });

                return oDialog;
            },

            buildBody: function(oController, oDatum) {

                return new sap.ui.commons.layout.MatrixLayout({
                    columns: 2,
                    widths: ["20%"],
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    hAlign: "End",
                                    content: new sap.m.Label({text: "{i18n>LABEL_47089}", textAlign: "End", required: true})    // 진료일
                                }).addStyleClass("LabelCell"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    hAlign: "Begin",
                                    content: [
                                        oDatum,
                                        new sap.m.Button({
                                            text: "{i18n>LABEL_47090}", // 실행
                                            press: function () {
                                                oController.getBukrs(oDatum);
                                            }
                                        }).addStyleClass("button-light righter mt-4px")
                                    ]
                                }).addStyleClass("DataCell")
                            ]
                        })
                    ]
                });
            }
        });
    }
);
