sap.ui.define(
    [
        "common/makeTable"
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail04", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table4", {
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
						oController.onAddSchool(oEvent, "X");
					},
					extension : [new sap.m.Toolbar({
									height : "52px",
									content : [new sap.m.Text({text : "{i18n>LABEL_76005}"}).addStyleClass("sub-title"), // 학력사항
											   new sap.m.ToolbarSpacer(),
											   new sap.m.HBox({
												   items: [
														new sap.m.Button({
															icon : "sap-icon://add",
															press: oController.onAddSchool
														}).addStyleClass("button-light"),
														new sap.m.Button({
															icon : "sap-icon://less",
															press : function(oEvent){
																oController.onPressSave("D4");
															}
														}).addStyleClass("button-light")
													]
											   }).addStyleClass("button-group")]
								}).addStyleClass("toolbarNoBottomLine")]
				}).addStyleClass("mt-10px row-link");
				
				oTable.setModel(new sap.ui.model.json.JSONModel());
				oTable.bindRows("/Data");
				
								// 입학일, 졸업일, 학교유형, 학위, 학교명, 전공, 최종학력
				var col_info = [{id: "Begda", label: "{i18n>LABEL_76027}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Endda", label: "{i18n>LABEL_76028}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Stext", label: "{i18n>LABEL_76029}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Etext", label: "{i18n>LABEL_76030}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Insti", label: "{i18n>LABEL_76031}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Ftext1", label: "{i18n>LABEL_76032}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Zzlmark", label: "{i18n>LABEL_76033}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true}];
				
				MakeTable.makeColumn(oController, oTable, col_info);
				
				return oTable;
            }
        });
    }
);
