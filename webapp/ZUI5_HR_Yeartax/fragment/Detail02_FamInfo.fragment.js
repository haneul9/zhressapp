sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail02_FamInfo", {
	/** 인적공제 - 가족정보 **/
	createContent : function(oController) {
		
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["15%", "35%", "15%", "35%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "성명"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "(성)"}).addStyleClass("FontFamily pt-10px pr-5px"),
								 				new sap.m.Input({
								 					value : "{Lnmhg}",
								 					width : "100px",
								 					maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxGetFamResult", "Lnmhg"),
								 					editable : {
								 						path : "Flag",
								 						formatter : function(fVal){
								 							return fVal == "C" ? true : false; 
								 						}
								 					}
								 				}).addStyleClass("FontFamily"),
								 				new sap.m.Text({text : "(이름)"}).addStyleClass("FontFamily PaddingTop5 PaddingRight5 PaddingLeft5"),
								 				new sap.m.Input({
								 					value : "{Fnmhg}",
								 					width : "100px",
								 					maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxGetFamResult", "Fnmhg"),
								 					editable : {
								 						path : "Flag",
								 						formatter : function(fVal){
								 							return fVal == "C" ? true : false;
								 						}
								 					}
								 				}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								     content : [new sap.m.Label({text : "관계"}).addStyleClass("FontFamily")],
								     hAlign : "Center",
								     vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox(oController.PAGEID + "_Kdsvh", {
											 		selectedKey : "{Kdsvh}",
											 		width : "100%",
											 		editable : {
											 			path : "Flag",
											 			formatter : function(fVal){
											 				return fVal == "C" ? true : false;
											 			}
											 		},
													change : function(oEvent){
														var oKdsvh = oDialog.getModel().getProperty("/Data/Kdsvh");
														// 위탁아동
														oDialog.getModel().setProperty("/Data/Fstid", (oKdsvh == "53" ? true : false));
														oDialog.getModel().setProperty("/Data/Sixid", false);
														oDialog.getModel().setProperty("/Data/Kdbsl", ""); // 자녀구분
													}
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "국적"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox(oController.PAGEID + "_Fanat", {
											 	 	selectedKey : "{Fanat}",
											 	 	width : "100%",
											 	 	editable : {
											 	 		path : "Flag",
											 	 		formatter : function(fVal){
											 	 			return fVal == "C" ? true : false;
											 	 		}
											 	 	}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "주민번호"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Regno1}",
											 	 	width : "100px",
											 	 	maxLength : 6,
											 	 	editable : {
											 	 		path : "Flag",
											 	 		formatter : function(fVal){
											 	 			return fVal == "C" ? true : false;
											 	 		}
											 	 	},
											 	 	liveChange : function(oEvent){
											 	 		var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
											 	 			oEvent.getSource().setValue(value);
											 	 	}
											 	}),
											 	new sap.m.Text({text : "-"}).addStyleClass("FontFamily pt-10px pr-5px pl-5px"),
											 	new sap.m.Input({
											 		value : "{Regno2tx}",
											 		width : "100px",
											 		maxLength : 7,
											 		editable : {
											 			path : "Flag",
											 			formatter : function(fVal){
											 				return fVal == "C" ? true : false;
											 			}
											 		},
											 		// liveChange : function(oEvent){
											 		// 	var value = oEvent.getParameters().value.replace(/[^0-9\*]/g, "");
											 		// 		oEvent.getSource().setValue(value);
											 		// },
											 		// change : function(oEvent){
											 		// 	var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
											 		// 	// 	oEvent.getSource().setValue(value);

													// 	// 주민번호 마스킹처리
													// 	oDialog.getModel().setProperty("/Data/Regno2", value);  
													// 	oEvent.getSource().setValue(value.replace(/(?<=.{1})./gi, "*"));
														
											 		// }
													change : function(oEvent){
														oDialog.getModel().setProperty("/Data/Regno2", oEvent.getParameters().value.replace(/[^0-9\*]/g, ""));
													}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					})]
		}).addStyleClass("mt-5px");
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "250px", "", "", "300px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "기본공제"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "추가공제"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle",
								 	 colSpan : 4
								 }).addStyleClass("Label3")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "부양가족"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "자녀구분"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								//  new sap.ui.commons.layout.MatrixLayoutCell({
								//  	 content : [new sap.m.Text({text : "7세미만\n취학아동", textAlign : "Center"}).addStyleClass("FontFamily font-medium")],
								//  	 hAlign : "Center",
								//  	 vAlign : "Middle"
								//  }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "위탁아동"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "6개월 이상\n위탁아동", textAlign : "Center"}).addStyleClass("FontFamily font-medium")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "장애인"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Dptid}", // 부양가족
												 	select : function(oEvent){
												 		if(oEvent.getParameters().selected == false){
												 			// 부양가족 선택 해제 시 보험료 선택해제
												 			oController._FamInfoDialog.getModel().setProperty("/Data/Zzinsyn", false);
												 		}
												 	}
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox(oController.PAGEID + "_Kdbsl", {
											 	 	selectedKey : "{Kdbsl}", // 자녀구분
											 	 	width : "100%",
													editable : {
														path : "Kdsvh",
														formatter : function(fVal){
															return fVal == "53" ? false : true;
														}
													}
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								//  new sap.ui.commons.layout.MatrixLayoutCell({
								//  	 content : [new sap.m.CheckBox({
								// 			 	 	selected : "{Sesch}" // 7세미만취학아동
								// 			 	})],
								//  	 hAlign : "Center",
								//  	 vAlign : "Middle"
								//  }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.CheckBox({
											 	 	selected : "{Fstid}", // 위탁아동
													editable : false
											 	})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.CheckBox({
											 	 	selected : "{Sixid}", // 6개월 이상 위탁아동
													editable : {
														path : "Kdsvh",
														formatter : function(fVal){
															return fVal == "53" ? true : false;
														}
													}
											 	})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.HBox({
											 	 	items : [
											 	 		new sap.m.CheckBox({
															selected : "{Hndid}", // 장애인
															select : function(oEvent){
																oController._FamInfoDialog.getModel().setProperty("/Data/Hndcd", "");
															}
														}),
														new sap.m.ComboBox(oController.PAGEID + "_Hndid2", {
															selectedKey : "{Hndcd}",
															width : "230px",
															editable : {
																path : "Hndid",
																formatter : function(fVal){
																	return fVal && fVal == true ? true : false;
																}
															}
														})
													]
											 	 })],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					})]
		}).addStyleClass("mt-5px");
		
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "보험료"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "의료비"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "교육비"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "신용카드"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "기부금"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label3")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Zzinsyn}"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Zzmedyn}"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Zzeduyn}"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Zzcrdyn}"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
												 	selected : "{Zzdonyn}"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					})]
		}).addStyleClass("mt-5px");
		
		var oMatrix4 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["20%", "80%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "안내"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	//  content : [new sap.m.Text({
									// 		 	 	text : "• 7세 미만 취학아동의 경우 체크하여 주십시오." +
									// 		 	 		   "\n• 장애인의 경우 장애인에 체크 표시하고, 장애인 코드를 선택하십시오." +
									// 		 	 		   "\n• 주민등록번호가 정확하지 않은 경우 입력이 되지 않습니다." +
									// 		 	 		   "\n• 연말정산에 포함할 가족이면 부양가족에 체크 표시를 하고, 포함하지 않을 가족이면 표시를 지우십시오." +
									// 		 	 		   "\n• 가족관계에 위탁아동으로 등록되어 있으면 위탁아동에 표시됩니다."
									// 		 	}).addStyleClass("FontFamily")],
									 content : [
										 new sap.m.FormattedText({
											 htmlText : "<span>• 기본공제 부양가족 체크 유무에 따라 기본공제 대상자가 반영되며 공제항목별로 요건이 충족하는지 확인</span>" +
											 			"<br/><span>• 기본공제대상자 나이요건</span>" +
														"<br/><span style='padding-left:10px'>- 직계존속(만 60세 이상, " + ((oController._Zyear * 1)-60) + "년 12월 31일 이전 출생)" +
														" / 직계비속(만 20세 이하, " + ((oController._Zyear * 1)-20) + "년 1월 1일 이후 출생)</span>" +
														"<br/><span style='padding-left:10px'>- 장애인의 경우 나이제한은 없으며 장애인인 경우 장애인 체크 표시 후 장애인 코드 입력</span>" +
														"<br/><span>• 기본공제대상자 소득요건 : 연간 소득금액 100만원 이하</span>"
										 })
									 ],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					})]
		}).addStyleClass("mt-5px");
		
		// var oContent = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 3,
		// 	width : "100%",
		// 	widths : ["1rem", "", "1rem"],
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 						 	 content : [new sap.ui.layout.VerticalLayout({
		// 											content : [oMatrix1, new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
		// 													   oMatrix2, new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
		// 													   oMatrix3, new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
		// 													   oMatrix4]
		// 									    })]
		// 						 }),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell()]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"})]
		// });

		var oContent = new sap.m.FlexBox({
			direction : "Column",
			items : [oMatrix1, oMatrix2, oMatrix3, oMatrix4]
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1050px",
			draggable : false,
			content : [oContent],
			title : {
				path : "Flag",
				formatter : function(fVal){
					if(fVal == "C"){
						return "가족정보 신규등록";
					} else if(fVal == "M"){
						return "가족정보 변경";
					}
				}
			},
			beginButton : [new sap.m.Button({
							   text : "저장", 
							   press : oController.onSaveFamInfo
						   }).addStyleClass("button-dark")],			
			endButton : [new sap.m.Button({
							 text : "닫기",
							 press : function(oEvent){oDialog.close();}
						 }).addStyleClass("button-default")]
		});
		
		oDialog.addStyleClass("custom-dialog-popup");
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
