sap.ui.define([],
    function () {
        "use strict";

        var DIALOG_FORM_ID = [$.app.CONTEXT_PATH, "Form"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_FORM_ID, {
            createContent: function (oController) {
                var PageHandler = oController.PageHandler;

                var oDialog = new sap.m.Dialog({
                    showHeader: false,
                    // contentWidth: "595px",
                    // contentWidth : "1000px",
                    contentHeight: "842px",
                    content: [],
                    buttons : [new sap.m.Button({
		                           type: sap.m.ButtonType.Default,
		                           text: oController.getBundleText("LABEL_27038"), // 서명 후 제출
		                           //visible: "{= !${/WriteForm/isFinish} }",
		                           press: PageHandler.openSignaturePad.bind(PageHandler),
		                           visible : false
		                       }),
		                       new sap.m.Button({
		                       	   type : "Default",
		                       	   text : oController.getBundleText("LABEL_27041"), // 안내확인
		                       	   press : PageHandler.onPressSave.bind(PageHandler),
		                       	   visible : "{= !${/WriteForm/isFinish} }"
		                       }),
		                       new sap.m.Button({
		                           type: sap.m.ButtonType.Default,
		                           text: oController.getBundleText("LABEL_00133"), // 닫기
		                           press: function () {oDialog.close();},
		                           visible : "{= ${/WriteForm/isFinish} }"
		                       })]
                    // beginButton: [
                    //     new sap.m.Button({
                    //         type: sap.m.ButtonType.Default,
                    //         text: oController.getBundleText("LABEL_00133"), // 닫기
                    //         press: function () {
                    //             oDialog.close();
                    //         }
                    //     })
                    // ],
                    // endButton: [
                    //     new sap.m.Button({
                    //         type: sap.m.ButtonType.Default,
                    //         text: oController.getBundleText("LABEL_27038"), // 서명 후 제출
                    //         visible: "{= !${/WriteForm/isFinish} }",
                    //         press: PageHandler.openSignaturePad.bind(PageHandler)
                    //     })
                    // ],
      //              afterOpen : function(){
						// document.getElementById("signature").src = PageHandler.oModel.getProperty("/WriteForm/signatureImg");
      //              }
                })
                    .addStyleClass("custom-dialog-popup")
                    .setModel(oController.PageHandler.Model());

                return oDialog;
            }
        });
    }
);
