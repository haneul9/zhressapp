sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";
	// 주소정보
    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail03", {
        createContent: function (oController) {
        	var oTable = new sap.m.Table(oController.PAGEID + "_Table3", {
	            inset: false,
				rememberSelections: false,
				noDataText: oBundleText.getText("LABEL_00901"),
				growing: true,
				growingThreshold: 5,
				mode: "None",
	            columns: [
	                new sap.m.Column ({
	                    width: "40%",
	                    hAlign: "Begin"
	                }),
	                new sap.m.Column ({
	                    width: "60%",
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
	                        	items : [new sap.m.Text({ // 주소유형
	                        				 text: "{Stext}"
	                        			 }),
				                         new sap.m.Text({ // 전화번호
				                         	 text : "{Telnr}"
				                         })]
	                        }),
	                        new sap.m.VBox({
	                        	items : [new sap.m.Text({ // 주소(우편번호)
				                             text: "{Bezei} {Ort1k} {Ort2k} {Stras}({Pstlz})"
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
