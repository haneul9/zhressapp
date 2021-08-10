sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail04", {
        createContent: function (oController) {
        	var oTable = new sap.m.Table(oController.PAGEID + "_Table4", {
	            inset: false,
				rememberSelections: false,
				noDataText: oBundleText.getText("LABEL_00901"),
				growing: true,
				growingThreshold: 5,
				mode: "None",
	            columns: [
	                new sap.m.Column ({
	                    width: "55%",
	                    hAlign: "Begin"
	                }),
	                new sap.m.Column ({
	                    width: "45%",
	                    hAlign: "End"
	                })
	            ],
	            items: {
	                path: "/Data",
	                template: new sap.m.ColumnListItem({
	                    type: sap.m.ListType.Active,
	                    counter: 5,
	                    customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
	                    press : oController.onSelectTable,
	                    cells: [
	                        new sap.m.VBox({
	                        	items : [new sap.m.Text({ // 입학일~졸업일
	                        				 text: "{Begda} ~ {Endda}"
	                        			 }),
				                         new sap.m.Text({ // 학교유형(학교명)
				                         	 text : "{Stext}({Insti})"
				                         })]
	                        }),
	                        new sap.m.VBox({
	                        	items : [new sap.m.Text({ // 학위
				                             text: "{Etext}"
				                         }),
				                         new sap.m.Text({ // 전공
				                         	 text : "{Ftext1}"
				                         })]
	                        })
	                    ]
	                })
	            }
        	}).addStyleClass("pt-10px");
        	
        	oTable.setModel(new sap.ui.model.json.JSONModel());
        	
            return new sap.m.VBox({
                height: "100%",
                items: [oTable]
            });
        }
    });
});
