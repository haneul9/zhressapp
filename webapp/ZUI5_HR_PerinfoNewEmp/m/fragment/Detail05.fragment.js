sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";
// 경력사항
    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail05", {
        createContent: function (oController) {
        	var oTable = new sap.m.Table(oController.PAGEID + "_Table5", {
	            inset: false,
				rememberSelections: false,
				noDataText: oBundleText.getText("LABEL_00901"),
				growing: true,
				growingThreshold: 5,
				mode: "None",
	            columns: [
	                new sap.m.Column ({
	                    width: "50%",
	                    hAlign: "Begin"
	                }),
	                new sap.m.Column ({
	                    width: "50%",
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
	                        	items : [new sap.m.Text({ // 입사일~퇴사일
	                        				 text: "{Begda} ~ {Endda}"
	                        			 }),
				                         new sap.m.Text({ // 국가/근무지
				                         	 text : "{Latxt}/{Ort01}"
				                         })]
	                        }),
	                        new sap.m.VBox({
	                        	items : [new sap.m.Text({ // 회사명
				                             text: "{Arbgb}"
				                         }),
				                         new sap.m.Text({ // 직위
				                         	 text : "{Zztitle}"
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
