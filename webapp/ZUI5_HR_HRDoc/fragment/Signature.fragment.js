sap.ui.define([],
    function () {
        "use strict";

        var DIALOG_FORM_ID = [$.app.CONTEXT_PATH, "Signature"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_FORM_ID, {
            createContent: function (oController) {
                var PageHandler = oController.PageHandler;

                var oDialog = new sap.m.Dialog({
                    title: "{i18n>LABEL_27038}", // 서명
                    contentWidth: "595px",
                    contentHeight: "247px",
                    afterOpen: PageHandler.initSignaturePad.bind(PageHandler),
                    content: [
                        new sap.ui.core.HTML({ content: "<canvas id='signature-pad' width='510' height='200' class='signature-pad'></canvas>", preferDOM: false }) //
                    ],
                    buttons : [new sap.m.Button({
		                           type: sap.m.ButtonType.Default,
		                           text: oController.getBundleText("LABEL_00190"), // 재작성
		                           enabled: "{= ${/WriteForm/isSigned}}",
		                           press: PageHandler.clearSignaturePad.bind(PageHandler)
		                       }),
		                       new sap.m.Button({
		                           type: sap.m.ButtonType.Default,
		                           text: oController.getBundleText("LABEL_27037"), // 제출
		                           enabled: "{= ${/WriteForm/isSigned}}",
		                           press: PageHandler.transformSignatureToImage.bind(PageHandler)
		                       }),
		                       new sap.m.Button({
		                       	   type : "Default",
		                       	   text : oController.getBundleText("LABEL_00133"), // 닫기
		                       	   press : function(){oDialog.close();}
		                       })]
                    // beginButton: [
                    //     new sap.m.Button({
                    //         type: sap.m.ButtonType.Default,
                    //         text: oController.getBundleText("LABEL_00190"), // 재작성
                    //         enabled: "{= ${/WriteForm/isSigned}}",
                    //         press: PageHandler.clearSignaturePad.bind(PageHandler)
                    //     })
                    // ],
                    // endButton: [
                    //     new sap.m.Button({
                    //         type: sap.m.ButtonType.Default,
                    //         text: oController.getBundleText("LABEL_27037"), // 제출
                    //         enabled: "{= ${/WriteForm/isSigned}}",
                    //         press: PageHandler.transformSignatureToImage.bind(PageHandler)
                    //     })
                    // ]
                })
                    .addStyleClass("custom-dialog-popup")
                    .setModel(oController.PageHandler.Model());

                return oDialog;
            }
        });
    }
);
