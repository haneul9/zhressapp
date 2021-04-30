sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Worktime", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController){
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["50%", "50%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_69006")})], // 시작시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										        	value : "{Beguz}",
										        	minutesStep : 30,
										        	width : "100%", 
										        	textAlign : "Begin",
				                                	change : function(oEvent){
				                                		oController.onChangeTime(oEvent, "30");
				                                	}
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_69007")})], // 종료시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										        	value : "{Enduz}",
										        	minutesStep : 10,
										        	width : "100%", 
										        	textAlign : "Begin",
				                                	change : function(oEvent){
				                                		oController.onChangeTime(oEvent, "10");
				                                	}
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_69008")})], // 점심시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox({
													selectedKey : "{Lnctm}",
													width : "100%",
													items : [new sap.ui.core.Item({key : "0", text : ""}),
															 new sap.ui.core.Item({key : "1", text : "01:00"}),
															 new sap.ui.core.Item({key : "2", text : "00:30"}),
															 new sap.ui.core.Item({key : "3", text : "01:30"}),
															 new sap.ui.core.Item({key : "4", text : "02:00"})]
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "500px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_69019"), // 근무일정 일괄적용
			content : [oMatrix],
			buttons : [new sap.m.Button({
						   text : oBundleText.getText("LABEL_00101"), // 저장
						   press : oController.onSaveWorktime
					   }).addStyleClass("button-dark"),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_00133"), // 닫기
						   press : function(){oDialog.close();}
					   }).addStyleClass("button-default custom-button-divide")]
		}).addStyleClass("custom-dialog-popup");
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
