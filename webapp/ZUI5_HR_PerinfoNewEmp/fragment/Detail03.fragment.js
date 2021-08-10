sap.ui.define(
    [
        "common/makeTable"
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail03", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
					selectionMode: "MultiToggle",
					enableColumnReordering: false,
					enableColumnFreeze: false,
					enableBusyIndicator: true,
					visibleRowCount: 1,
					showOverlay: false,
					showNoData: true,
					noData: "{i18n>LABEL_00901}", // No data found
					rowHeight: 37,
					columnHeaderHeight: 38,
					cellClick : function(oEvent){
						oController.onAddAddress(oEvent, "X");
					},
					extension : [new sap.m.Toolbar({
									height : "52px",
									content : [new sap.m.Text({text : "{i18n>LABEL_76004}"}).addStyleClass("sub-title"), // 주소정보
											   new sap.m.ToolbarSpacer(),
											   new sap.m.HBox({
												   items: [
														new sap.m.Button({
															icon : "sap-icon://add",
															press : oController.onAddAddress
														}).addStyleClass("button-light"),
														new sap.m.Button({
															icon : "sap-icon://less",
															press : function(oEvent){
																oController.onPressSave("D3");
															}
														}).addStyleClass("button-light")
													]
											   }).addStyleClass("button-group")]
								}).addStyleClass("toolbarNoBottomLine")]
				}).addStyleClass("mt-10px row-link");
				
				oTable.setModel(new sap.ui.model.json.JSONModel());
				oTable.bindRows("/Data");
				
								// 주소유형, 국가, 우편번호, 주소, 전화번호
				var col_info = [{id: "Stext", label: "{i18n>LABEL_76022}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Latxt", label: "{i18n>LABEL_76023}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Pstlz", label: "{i18n>LABEL_76024}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Address", label: "{i18n>LABEL_76025}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "45%"},
								{id: "Telnr", label: "{i18n>LABEL_76026}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				
				MakeTable.makeColumn(oController, oTable, col_info);
				
				return oTable;
            }
        });
    }
);
   