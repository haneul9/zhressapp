sap.ui.define([], function () {
    "use strict";

    sap.ui.jsview("ZUI5_HR_DailyTimeStatus.List", {
        getControllerName: function () {
            return "ZUI5_HR_DailyTimeStatus.List";
        },

        createContent: function (oController) {
            $.app.setModel("ZHR_COMMON_SRV");
            $.app.setModel("ZHR_WORKSCHEDULE_SRV");

            var oFilter = new sap.m.FlexBox({
                fitContainer: true,
                items: [
                    new sap.m.FlexBox({
                        // 검색
                        items: [
                            new sap.m.FlexBox({
                                items: [
                                    new sap.m.Label({ text: "{i18n>LABEL_43002}" }), // 조회일자
                                    new sap.m.DatePicker({
                                        valueFormat: "yyyy-MM-dd",
                                        displayFormat: gDtfmt,
                                        value: "{Tmdat}",
                                        width: "200px",
                                        textAlign: "Begin",
                                        change: oController.onChangeDate
                                    }),
                                    new sap.m.Label({ text: "{i18n>LABEL_43003}" }), // 사업장
                                    new sap.m.ComboBox(oController.PAGEID + "_Werks", {
                                        width: "200px",
                                        selectedKey: "{Werks}",
                                        editable: $.app.getAuth() == "H" ? true : false
                                    }),
                                    new sap.m.Label({ text: "{i18n>LABEL_00122}" }), // 소속부서
                                    new sap.m.MultiInput(oController.PAGEID + "_Orgeh", {
                                        width: "200px",
                                        showValueHelp: true,
                                        valueHelpOnly: true,
                                        valueHelpRequest: oController.displayMultiOrgSearchDialog
                                    })
                                ]
                            }).addStyleClass("search-field-group"),
                            new sap.m.FlexBox({
                                items: [
                                    new sap.m.Button({
                                        press: oController.onPressSearch,
                                        text: "{i18n>LABEL_00104}" // 검색
                                    }).addStyleClass("button-search")
                                ]
                            }).addStyleClass("button-group")
                        ]
                    })
                ]
            }).addStyleClass("search-box search-bg pb-7px mt-16px");

            // var oContent = new sap.m.FlexBox({
            //     justifyContent: "Center",
            //     fitContainer: true,
            //     items: [
            //         new sap.m.FlexBox({
            //             direction: sap.m.FlexDirection.Column,
            //             items: [
            //                 new sap.m.FlexBox({
            //                     alignItems: "End",
            //                     fitContainer: true,
            //                     items: [new sap.m.Text({ text: "{i18n>LABEL_43001}" }).addStyleClass("app-title")] // 일근태현황
            //                 }).addStyleClass("app-title-container"),
            //                 oFilter,
            //                 new sap.ui.core.HTML({ content: "<div style='height:20px' />" }),
            //                 sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail1", oController),
            //                 sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail2", oController),
            //                 sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail3", oController),
            //                 // sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail4", oController),
            //                 new sap.ui.core.HTML({ content: "<div style='height:10px' />" })
            //             ]
            //         }).addStyleClass("app-content-container-wide")
            //     ]
            // }).addStyleClass("app-content-body");

            // /////////////////////////////////////////////////////////

            // var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
            //     // customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
            //     showHeader: false,
            //     content: [oContent]
            // }).addStyleClass("app-content");
            
            
			$.sap.require("common.PageHelper");
			var oPage = new common.PageHelper({
				idPrefix : oController.PAGEID,
	            contentItems: [oFilter,
							   sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail1", oController),
							   sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail2", oController),
							   sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail3", oController),]
	        });

            oPage.setModel(oController._ListCondJSonModel);
            oPage.bindElement("/Data");

            return oPage;
        }
    });
});
