sap.ui.jsfragment("ZUI5_HR_EvalResultAgreeM.m.fragment.EvalResultAgree", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_11320}",   // 평가결과
								design: "Bold"
							})
							.addStyleClass("sub-title ml-6px") // 가입 현황
						]
					}),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								text :  "{i18n>LABEL_15003}", // 결과확인 2020-01-05 결과합의→결과확인 텍스트 변경
								visible : {
									parts : [{path : "Flag"}, {path : "Evstaus"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 == "X"){
											return false;
										} else {
											return fVal2 == "30" ? true : false;
										}
									}
								},
								press : function(oEvent){
									oController.onPressSave(oEvent, "50");
								}
							}),
							new sap.m.Button({
								text : "{i18n>LABEL_15004}", // 이의제기
								visible : {
									parts : [{path : "Flag"}, {path : "Evstaus"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 == "X"){
											return false;
										} else {
											return fVal2 == "30" ? true : false;
										}
									}
								},
								press : function(oEvent){
									oController.onPressSave(oEvent, "40");
								}
							}),
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box"); 
			
			/*//////////////////////// 평가결과 내용///////////////////////////////////////////*/	
			var resultInfoBox = new sap.m.VBox({
				width : "100%",
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15005}", design: "Bold", textAlign: "Begin" }), // 상태
						    new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15005}", textAlign: "Begin" }).addStyleClass("FontBold"), // 상태
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Evstaustx}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15006}", design: "Bold", textAlign: "Begin" }), // 평가연도
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15006}", textAlign: "Begin" }).addStyleClass("FontBold"), // 평가연도
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Appye}",
								textAlign: "Begin"
							})
						]
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15007}", design: "Bold", textAlign: "Begin" }), // 업적평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15007}", textAlign: "Begin" }).addStyleClass("FontBold"), // 업적평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Pepnt}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn01",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15008}", design: "Bold", textAlign: "Begin" }), // 역량평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15007}", textAlign: "Begin" }).addStyleClass("FontBold"), // 업적평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Cepnt}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn02",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15009}", design: "Bold", textAlign: "Begin" }), // 다면평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15009}", textAlign: "Begin" }).addStyleClass("FontBold"), // 다면평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Mepnt}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn03",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15010}", design: "Bold", textAlign: "Begin" }), // 1차평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15010}", textAlign: "Begin" }).addStyleClass("FontBold"), // 1차평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Pegrade}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn04",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15011}", design: "Bold", textAlign: "Begin" }), // 2차평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15011}", textAlign: "Begin" }).addStyleClass("FontBold"), // 2차평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Pegrade2}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn05",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							// new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15012}", design: "Bold", textAlign: "Begin" }), // 종합평가
							new sap.m.Text({ width: "105px", text: "{i18n>LABEL_15012}", textAlign: "Begin" }).addStyleClass("FontBold"), // 종합평가
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Cograde}",
								textAlign: "Begin"
							})
						],
						visible: {
						    path: "Btn06",
							formatter: function(v) {
								if(v === "X" ) return true;
								else return false;
							}
			    	    },
					}).addStyleClass("py-25px"),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_15013}", design: "Bold", textAlign: "Begin" }), // 이의제기 사유
						]
					}).addStyleClass("py-25px"),
					new sap.m.TextArea({ value : "{Isstxt}",
											 width : "100%",
											 maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaResultAgreeTableIn", "Isstxt"),
											 	rows : 5,
											 	editable : {
											 		path : "Evstaus",
											 		formatter : function(fVal){
											 			return fVal == "30" ? true : false;
											 		}
											 	}
					}), // 이의제기 사유
					
					
				]
			});
			
			return new sap.m.VBox({
				width : "100%",
				items: [infoBox, resultInfoBox ],
				visible: {
				    path: "Evstaus",
					formatter: function(v) {
						if(v === "30" || v === "35" || v === "40" || v === "50" ) return true;
						else return false;
					}
	    	    }, 
			})
			.setModel(oController._ResultModel)
			.bindElement("/Data");               
	}
});
