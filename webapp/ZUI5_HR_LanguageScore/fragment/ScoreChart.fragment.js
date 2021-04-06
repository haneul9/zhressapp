/* eslint-disable no-undef */
sap.ui.define(
    [],
    function () {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "ScoreChart"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {

                var oDialog = new sap.m.Dialog({
                    showHeader: false,
                    content: [
                        new sap.m.Image({
                            decorative: false,
                            src: $.app.CONTEXT_PATH + "/img/scorechart.jpg"
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default")
                    ]
                })
                .addStyleClass("custom-dialog-popup");

                return oDialog;
            }
        });
    }
);
