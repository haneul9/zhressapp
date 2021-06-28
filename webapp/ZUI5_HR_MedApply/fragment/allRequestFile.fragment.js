sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.allRequestFile", {
        createContent: function (oController) {
            var AllRequestFileHandler = oController.getAllRequestFileHandler();

            return new sap.m.Dialog("AllRequestFileDialog", {
                showHeader: true,
                title: "{i18n>LABEL_47152}", // 일괄신청
                contentWidth: "800px",
                draggable: true,
				verticalScrolling: false,
				busyIndicatorDelay: 0,
				busy: "{= ${/IsBusy}}",
				afterOpen: AllRequestFileHandler.after.bind(AllRequestFileHandler),
                content: [
                    new sap.m.VBox({
                        items: [
							sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
                    }).addStyleClass("mnh-200px mx-10px")
                ],
                buttons: [
                    new sap.m.Button({
						text: "{i18n>LABEL_47006}", // 신청
						busyIndicatorDelay: 0,
						busy: "{= ${/IsBusy}}",
                        press: AllRequestFileHandler.onRequest.bind(AllRequestFileHandler)
                    }).addStyleClass("button-search"),
                    new sap.m.Button({
						text: "{i18n>LABEL_00133}", // 닫기
						busyIndicatorDelay: 0,
						busy: "{= ${/IsBusy}}",
                        press: function () {
                            AllRequestFileHandler.getDialog().close();
                        }
                    }).addStyleClass("button-default")
                ]
            }).setModel(AllRequestFileHandler.getModel());
        }
    });
});
