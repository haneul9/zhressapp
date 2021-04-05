sap.ui.jsfragment("ZUI5_HR_LeaveBoost.fragment.Signature", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["520px", "10px", ""],
		});
		
		var oSignurl = oController._ListCondJSonModel.getProperty("/Data/Signurl");
		var oBinary = oController._ListCondJSonModel.getProperty("/Data/Binary");
		
		oMatrix.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							 content : [new sap.m.Text({text : oBundleText.getText("MSG_52006")})], // {Datum} 현재까지 사용하지 않은 연차 유급휴가 {Pronm2}일에 대하여 상기와 같이 사용시기를 지정하여 통보합니다.
							 hAlign : "Begin",
							 vAlign : "Middle",
							 colSpan : 3
						 })]
			})
		);
			
		if(oBinary && oBinary != ""){
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Image("signature-pad", {
											 	src : "data:text/plain;base64," + oBinary,
											 	width : "510px"
											}).addStyleClass("signature-pad")]
							 }),
							 new sap.ui.commons.layout.MatrixLayoutCell(),
							 new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Button({
											 	text : oBundleText.getText("LABEL_52015"), // Clear
											 	press : oController.resetSignature,
											 	visible : {
											 		path : "Status1",
											 		formatter : function(fVal){
											 			return (fVal == "" || fVal == "AA" || fVal == "00") ? true : false;
											 		}
											 	}
											}).addStyleClass("button-default")],
								 hAlign : "Begin",
								 vAlign : "Bottom"
							 }).addStyleClass("pb-4px")]
				})
			);
		} else {
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.ui.core.HTML({content: "<canvas id='signature-pad' width='510' height='200' class='signature-pad'></canvas>", preferDOM: false})],
								 hAlign : "Begin",
								 vAlign : "Middle"
							 }),
							 new sap.ui.commons.layout.MatrixLayoutCell(),
							 new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Button({
											 	text : oBundleText.getText("LABEL_52015"), // Clear
											 	press : function(oEvent){
											 		oController.onSetSignature("X");
											 	},
											 	visible : {
											 		path : "Status1",
											 		formatter : function(fVal){
											 			return (fVal == "" || fVal == "AA" || fVal == "00") ? true : false;
											 		}
											 	}
											}).addStyleClass("button-default")],
								 hAlign : "Begin",
								 vAlign : "Bottom"
							 }).addStyleClass("pb-4px")]
				})
			);
		}
		
		return oMatrix;
	}
});
