sap.ui.define(
    [
        "common/makeTable"
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail05", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table5", {
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
						oController.onAddCareer(oEvent, "X");
					},
					extension : [new sap.m.Toolbar({
									height : "52px",
									content : [new sap.m.Text({text : "{i18n>LABEL_76006}"}).addStyleClass("sub-title"), // 경력사항
											   new sap.m.ToolbarSpacer(),
											   new sap.m.HBox({
												   items: [
														new sap.m.Button({
															icon : "sap-icon://add",
															press: oController.onAddCareer
														}).addStyleClass("button-light"),
														new sap.m.Button({
															icon : "sap-icon://less",
															press : function(oEvent){
																oController.onPressSave("D5");
															}
														}).addStyleClass("button-light")
													]
											   }).addStyleClass("button-group")]
								}).addStyleClass("toolbarNoBottomLine")]
				}).addStyleClass("mt-10px row-link");
				
				oTable.setModel(new sap.ui.model.json.JSONModel());
				oTable.bindRows("/Data");
				
								// 입사일, 퇴사일, 국가, 회사명, 근무지, 직위, 담당업무
				var col_info = [{id: "Begda", label: "{i18n>LABEL_76034}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Endda", label: "{i18n>LABEL_76035}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Latxt", label: "{i18n>LABEL_76036}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Arbgb", label: "{i18n>LABEL_76037}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Ort01", label: "{i18n>LABEL_76038}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Zztitle", label: "{i18n>LABEL_76039}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Zzjob", label: "{i18n>LABEL_76040}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				
				MakeTable.makeColumn(oController, oTable, col_info);
				
				return oTable;
            }
        });
    }
);
