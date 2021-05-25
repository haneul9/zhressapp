sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail07", {
	/** 종(전)근무지 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["25%", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.CheckBox({
											 	 	selected : "{Checkbox}",
											 	 	text : "삭제 ▶ 종(전)근무지1",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}, {path : "Zdelfg"}],
														formatter : function(fVal1, fVal2, fVal3){
															return (fVal1 == "1" && fVal2 == "1" && fVal3) ? true : false;
														}
													}
											 	})],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2")
								   .bindElement("/Data7/0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.CheckBox({
											 	 	selected : "{Checkbox}",
											 	 	text : "삭제 ▶ 종(전)근무지2",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}, {path : "Zdelfg"}],
														formatter : function(fVal1, fVal2, fVal3){
															return (fVal1 == "1" && fVal2 == "1" && fVal3) ? true : false;
														}
													}
											 	})],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2")
								   .bindElement("/Data7/1")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "회사명"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Comnm}",
											 	 	width : "100%",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", "Comnm")
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Comnm}",
											 	 	width : "100%",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", "Comnm")
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/1")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "사업자등록번호"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
										 	 		value : "{Bizno}",
										 	 		width : "320px",
										 	 		editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													liveChange : function(oEvent){
														var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
														
														oEvent.getSource().setValue(value);
													},
											 	 	// maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", "Bizno")
											 	 	maxLength : 10
										 	   }),
										 	   new sap.m.Text({text : "(하이픈(-) 제외)"}).addStyleClass("FontFamily pl-5px pt-10px")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
										 	 		value : "{Bizno}",
										 	 		width : "320px",
										 	 		editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													liveChange : function(oEvent){
														var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
														
														oEvent.getSource().setValue(value);
													},
											 	 	// maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", "Bizno")
											 	 	maxLength : 10
										 	   }),
										 	   new sap.m.Text({text : "(하이픈(-) 제외)"}).addStyleClass("FontFamily pl-5px pt-10px")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/1")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "근무기간"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.DatePicker({
											 	 	displayFormat : gDtfmt,
											 	 	valueFormat : "yyyy-MM-dd",
											 	 	width : "150px",
											 	 	value : "{Pabeg}",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													change : oController.onChangeDate
											 	}),
											 	new sap.m.Text({text : "~"}).addStyleClass("pl-5px pr-5px pt-10px"),
											 	new sap.m.DatePicker({
											 	 	displayFormat : gDtfmt,
											 	 	valueFormat : "yyyy-MM-dd",
											 	 	width : "150px",
											 	 	value : "{Paend}",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													change : oController.onChangeDate
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.DatePicker({
											 	 	displayFormat : gDtfmt,
											 	 	valueFormat : "yyyy-MM-dd",
											 	 	width : "150px",
											 	 	value : "{Pabeg}",
											 	 	// navigate : function(oEvent){
											 	 	// 	if(oEvent.getSource()._oCalendar.sId){
										 	 		// 		sap.ui.getCore().byId(oEvent.getSource()._oCalendar.sId).setShowWeekNumbers(false)
										 	 		// 	}	
											 	 	// },
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													change : oController.onChangeDate
											 	}),
											 	new sap.m.Text({text : "~"}).addStyleClass("pl-5px pr-5px pt-10px"),
											 	new sap.m.DatePicker({
											 	 	displayFormat : gDtfmt,
											 	 	valueFormat : "yyyy-MM-dd",
											 	 	width : "150px",
											 	 	value : "{Paend}",
											 	 	editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return (fVal1 == "1" && fVal2 == "1") ? true : false;
														}
													},
													change : oController.onChangeDate
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")
								   .bindElement("/Data7/1")]
					})]
		});
		
		var oField = ["정규급여", "상여", "소득세", "주민세", "건강보험료", "고용보험료", "국민연금보험료", "국외근로(100만원)", "기타비과세", "인정상여"];
		var oRow, oCell;
		
		for(var i=0; i<oField.length; i++){
			var field = eval("'{Bet" + ((i+1) >= 10 ? (i+1) : "0" + (i+1)) + "}'");
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "45px",
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Label({text : oField[i]}).addStyleClass("FontFamily")],
								 hAlign : "Center",
								 vAlign : "Middle"
							 }).addStyleClass("Label"),
							 new sap.ui.commons.layout.MatrixLayoutCell({
							 	 content : [new sap.m.Input({
										 	 	value : field,
										 	 	width : "320px",
										 	 	textAlign : "End",
										 	 	liveChange : function(oEvent){
													var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
													
													oEvent.getSource().setValue(common.Common.numberWithCommas(value));
												},
										 	 	maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", eval("'Bet" + (i+1 > 10 ? 10 : "0" + (i+1)) + "'")),
										 	 	editable : {
													parts : [{path : "Pystat"}, {path : "Yestat"}],
													formatter : function(fVal1, fVal2){
														return (fVal1 == "1" && fVal2 == "1") ? true : false;
													}
												}
										 	}),
										 	new sap.m.Text({text : "원"}).addStyleClass("FontFamily pl-5px pt-10px")],
								 hAlign : "Begin",
								 vAlign : "Middle"
							 }).addStyleClass("Data")
							   .bindElement("/Data7/0"),
							 new sap.ui.commons.layout.MatrixLayoutCell({
							 	 content : [new sap.m.Input({
										 	 	value : field,
										 	 	width : "320px",
										 	 	textAlign : "End",
										 	 	liveChange : function(oEvent){
													var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
													
													oEvent.getSource().setValue(common.Common.numberWithCommas(value));
												},
										 	 	maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPrevWorkN2", eval("'Bet" + (i+1 > 10 ? 10 : "0" + (i+1)) + "'")),
										 	 	editable : {
													parts : [{path : "Pystat"}, {path : "Yestat"}],
													formatter : function(fVal1, fVal2){
														return (fVal1 == "1" && fVal2 == "1") ? true : false;
													}
												}
										 	}),
										 	new sap.m.Text({text : "원"}).addStyleClass("FontFamily pl-5px pt-10px")],
								 hAlign : "Begin",
								 vAlign : "Middle"
							 }).addStyleClass("Data")
							   .bindElement("/Data7/1")]
				})
			);
		}
		
		oMatrix.setModel(oController._DetailJSonModel);
		
		return oMatrix;
	}

});
