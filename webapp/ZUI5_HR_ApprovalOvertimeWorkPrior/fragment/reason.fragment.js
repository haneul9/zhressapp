sap.ui.define([
    "../../common/Common"
],
    function (Common) {
        "use strict";

        var DIALOG_FORM_ID = [$.app.CONTEXT_PATH, "reason"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_FORM_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.ApprovalHandler;

                var oDialog = new sap.m.Dialog({
                    title: "{i18n>LABEL_32023}", // 반려사유
                    contentWidth: "595px",
                    content: [
                        new sap.m.TextArea({
                            width: "100%",
                            rows: 8,
                            value: "{/Rjres}",
                            valueLiveUpdate: true,
                            maxLength: Common.getODataPropertyLength("ZHR_BATCHAPPROVAL_SRV", "OtworkConfirmTableIn", "Rjres")
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00198}", // 반려
                            enabled: "{= ${/Rjres} === '' ? false : true }",
                            press: ApprovalHandler.pressConfirmRejectReasonBtn.bind(ApprovalHandler)
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(oController.ApprovalHandler.Model());

                return oDialog;
            }
        });
    }
);
