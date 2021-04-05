sap.ui.define([
    "common/Common",
    "common/ZHR_TABLES"
], function (Common, ZHR_TABLES) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_Pass.fragment.CondoList", {

        createContent: function (oController) {

            // init condo-handler
            var oModel = oController.getCondoHandler.call(oController).Model();

            return new sap.m.FlexBox({
                    direction: sap.m.FlexDirection.Column,
                    items: [
                    this.getResvMyInfoBox(),
                    this.getResvMyTableBox(oController),
					this.getRequestInfoBox(),
					this.getRequestTableBox(oController)
				]
                })
                .setModel(oModel);
        },

        getResvMyInfoBox: function () {
            return new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [
					new sap.m.FlexBox({
                        items: [
							new sap.m.Label({
                                text: "{i18n>LABEL_09038}",                                
                            }).addStyleClass("sub-title") // 나의 예약 현황
						]
                    })
				]
            }).addStyleClass("info-box");
        },

        getResvMyTableBox: function (oController) {
            var CondoHandler = oController.CondoHandler;

            var oTable = new sap.ui.table.Table(oController.PAGEID + "_ResvMyTable", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                .addStyleClass("mt-10px")
                .bindRows("/MyResvList");

            var columnModels = [
                { id: "Contx", label: "{i18n>LABEL_09033}" /* 콘도      */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%" },
                { id: "Loctx", label: "{i18n>LABEL_09034}" /* 위치      */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%" },
                { id: "Appbg", label: "{i18n>LABEL_09039}" /* 예약기간  */ , plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getDateRangeText", templateGetterOwner: CondoHandler },
                { id: "Romno", label: "{i18n>LABEL_09040}" /* 객실 수   */ , plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "8%", templateGetter: "getRomnoConvertNumber", templateGetterOwner: CondoHandler },
                { id: "SeasnT", label: "{i18n>LABEL_09041}" /* 구분      */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                { id: "StatusT", label: "{i18n>LABEL_09006}" /* 진행상태  */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                { id: "Proc", label: "{i18n>LABEL_09007}" /* 처리      */ , plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "12%", templateGetter: "getCondoProcessButtons", templateGetterOwner: CondoHandler }
			];

            ZHR_TABLES.makeColumn(oController, oTable, columnModels);

            return oTable;
        },

        getRequestInfoBox: function () {
            return new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [
					new sap.m.FlexBox({
                        items: [
							new sap.m.Label({
                                text: "{i18n>LABEL_09051}",                                
                            }).addStyleClass("sub-title") // 이용신청
						]
                    })
				]
            }).addStyleClass("info-box");
        },

        getRequestTableBox: function (oController) {
            var CondoHandler = oController.CondoHandler;

            var oRequestTable = new sap.ui.table.Table(oController.PAGEID + "_RequestTable", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 10,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                .addStyleClass("mt-8px mb-20px")
                .bindRows("/RequestList");

            var columnModels = [
                { id: "Contx", label: "{i18n>LABEL_09033}" /* 콘도          */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%" },
                { id: "Loctx", label: "{i18n>LABEL_09034}" /* 위치          */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%" },
                { id: "Begda", label: "{i18n>LABEL_09052}" /* 예약가능기간  */ , plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getDateRangeText", templateGetterOwner: CondoHandler },
                { id: "SeasnT", label: "{i18n>LABEL_09041}" /* 구분          */ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                { id: "Proc", label: "{i18n>LABEL_09007}" /* 처리          */ , plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "12%", templateGetter: "getCondoRequestButton", templateGetterOwner: CondoHandler }
			];

            ZHR_TABLES.makeColumn(oController, oRequestTable, columnModels);

            return oRequestTable;
        }

    });
});