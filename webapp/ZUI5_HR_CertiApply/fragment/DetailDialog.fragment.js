sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_CertiApply.fragment.DetailDialog", {
        /** Specifies the Controller belonging to this View.
         * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
         * @memberOf fragment.SelectMassn
         */

        createContent: function (oController) {
            var oDialog = new sap.m.Dialog("ZUI5_HR_CertiApply_DetailDialog", {
                contentWidth: "1400px",
                contentHeight: "75vh",
                title: "{i18n>LABEL_65025}", // 신청문서 출력
                content: [new sap.ui.layout.VerticalLayout(oController.PAGEID + "_PDF")],
                buttons: [
                    new sap.m.Button({
                        text: oController.getBundleText("LABEL_00133"), // 닫기
                        press: function () {
                            oDialog.close();
                        }
                    }).addStyleClass("button-default custom-button-divide")
                ]
            }).addStyleClass("custom-dialog-popup");

            return oDialog;
        }
    });
});
