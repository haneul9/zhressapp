sap.ui.define([
], function () {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_StudentFundsApply.m.fragment.SearchNation", {

		createContent: function (oController) {
			
            return  new sap.m.SelectDialog({
                contentHeight: "50%",
                title: oController.getBundleText("{i18n>LABEL_38050}"), // 국가 검색
                search: oController.onSearchNationBtn.bind(oController),
                confirm: oController.onConfirmNationBtn.bind(oController),
                draggable: true,
                resizable: true,
                growing: false,
                items: {
                    path: "/Data",
                    template: new sap.m.StandardListItem({
                        title: "({Code})",
                        description: "{Text}",
                        type: sap.m.ListType.Active
                    })
                }
            })
            .setModel(oController.NationModel);
		}
	});
});
