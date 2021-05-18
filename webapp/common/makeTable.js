jQuery.sap.declare("common.makeTable");

common.makeTable = {
	makeColumn : function(oController, oTable, col_info){
		if(!oController || !oTable || !col_info) return;
		
		for(var i=0; i<col_info.length; i++){
			var oColumn = new sap.ui.table.Column({
				flexible : false,
	        	autoResizable : true,
	        	resizable : true,
				showFilterMenuEntry : true,
				filtered : false,
				sorted : false,
				filterProperty : col_info[i].filter == true ? col_info[i].id : "",
				sortProperty : col_info[i].sort == true ? col_info[i].id : "",
				hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
				width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : ""),
				multiLabels : [new sap.ui.commons.TextView({
								   text : col_info[i].label, 
								   textAlign : (col_info[i].plabel && col_info[i].plabel ? "Center" : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center")), 
								   width : "100%"
							   }).addStyleClass("Font15 Font400")]
			});
			
			if(col_info[i].plabel && col_info[i].plabel != ""){
				oColumn.addMultiLabel(new sap.ui.commons.TextView({
										  text : col_info[i].plabel, 
										  textAlign : (col_info[i].plabel2 && col_info[i].plabel2 ? "Center" : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center")), 
										  width : "100%"
									  }).addStyleClass("Font15 Font400"));
				oColumn.setHeaderSpan([col_info[i].span, 1]);
			}
			
			if(col_info[i].plabel2 && col_info[i].plabel2 != ""){
				oColumn.addMultiLabel(new sap.ui.commons.TextView(col_info[i].plabel2, {text : "", textAlign : "Center", width : "100%"}).addStyleClass("Font15 Font400"));
				oColumn.setHeaderSpan([col_info[i].span, 1]);
			}
			
			var oTemplate;
			
			switch(col_info[i].type){
				case "link":
					if(oController.PAGEID == "ZUI5_HR_LeaveUseChart" || oController.PAGEID == "ZUI5_HR_DailyTimeStatus"){
						if(oTable.sId == oController.PAGEID + "_DetailTable"){
							oTemplate = new sap.m.Link({
											text : "{" + col_info[i].id + "}",
											press : oController.onPressPersDetail,
											customData : [new sap.ui.core.CustomData({key : "", value : "{}"}),
														  new sap.ui.core.CustomData({key : "", value : col_info[i].id})]
										});
						} else if(oController.PAGEID == "ZUI5_HR_DailyTimeStatus" && oTable.sId == oController.PAGEID + "_Table3"){
							oTemplate = new sap.m.Link({
											text : "{" + col_info[i].id + "}",
											press : oController.onPressOvertimeStatus,
											customData : [new sap.ui.core.CustomData({key : "", value : "{}"}),
														  new sap.ui.core.CustomData({key : "", value : col_info[i].id})]
										});
						} else {
							oTemplate = new sap.m.Link({
											text : "{" + col_info[i].id + "}",
											press : oController.onPressDetail,
											customData : [new sap.ui.core.CustomData({key : "", value : "{}"}),
														  new sap.ui.core.CustomData({key : "", value : col_info[i].id})]
										});
						}
					} else if(oController.PAGEID == "ZUI5_HR_VacationList" || oController.PAGEID == "ZUI5_HR_WorkhomeList" || oController.PAGEID == "ZUI5_HR_VacationList2"){
						oTemplate = new sap.m.Link({
										text : "{" + col_info[i].id + "}",
										press : oController.onPressStext,
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
									});
					} else {
						oTemplate = new sap.m.Link({
									text : "{" + col_info[i].id + "}",
									press : oController.onDetail4,
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"}),
												  new sap.ui.core.CustomData({key : "", value : col_info[i].id})]
								}).addStyleClass("FontFamily");
					}
					break;
				case "goal":
					oTemplate = new sap.m.Button({
									icon : "sap-icon://activity-assigned-to-goal",
									type : "Transparent",
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
									visible : {
										path : "userId",
										formatter : function(fVal){
											return fVal ? true : false;
										}
									},
									press : function(oEvent){
										var userId = oEvent.getSource().getCustomData()[0].getValue().userId;
										var domain = "";
										
										/** 목표 조회
											개발(g110bc197) : 2019년 데이터가 없어서 2020년부터 1로 계산하여 Entity명 생성
											QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
										var Idx = "", year = oController._ListCondJSonModel.getProperty("/Data/Year") * 1;
										if(document.domain.indexOf("g110bc197") != -1){
											Idx = (year == 2020 ? "1" : (year-2020) + 1);
										} else {
											Idx = (year == 2019 ? "1" : (year-2019) + 1);
										}
										
										if(common.Common.getOperationMode() == "DEV"){
											domain = "https://hcm10preview.sapsf.com";
										} else {
											domain = "https://performancemanager10.successfactors.com";
										}
										
										window.open(domain + "/sf/goals?bplte_company=lottechemiT1&goalPlanId=" + Idx + "&tgmv10pfselect_plan=" + Idx + "&selected_userid=" + userId);
									}
								});
					break;
				case "activity":
					oTemplate = new sap.m.Button({
									icon : "sap-icon://activity-2",
									type : "Transparent",
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
									visible : {
										path : "userId",
										formatter : function(fVal){
											return fVal ? true : false;
										}
									},
									press : function(oEvent){
										var userId = oEvent.getSource().getCustomData()[0].getValue().userId;
										var domain = "";
										
										if(common.Common.getOperationMode() == "DEV"){
											domain = "https://hcm10preview.sapsf.com";
										} else {
											domain = "https://performancemanager10.successfactors.com";
										}
										
										window.open(domain + "/xi/ui/successline/pages/index.xhtml?_s.crb=ejRL1S3dBXTR%2bEFz7RUHIGoqdxD1%2fDpClxf4XUB7Q1c%3d#/oneOnOneMeeting/" + userId);
									}
								});
					break;				
				case "progress":
					oTemplate = new sap.m.ProgressIndicator({
									displayAnimation : true,
									displayValue : {
										path : col_info[i].id,
										formatter : function(fVal){
											return fVal ? parseFloat(fVal) : 0;
										}
									},
									percentValue : {
										path : col_info[i].id,
										formatter : function(fVal){
											return fVal ? parseFloat(fVal) : 0;
										}
									},
									showValue : true,
									// state : "Information",
									state : {
										path : col_info[i].id,
										formatter : function(fVal){
											return (fVal && parseFloat(fVal) < 30 ? "Error" : "Information");
										}
									},
									width : "100%"
								});
					break;
				case "select":
					oTemplate = new sap.ui.core.Icon({
									size : "14px",
									src : "sap-icon://accept",
									color : "#107e3e",
									visible : "{" + col_info[i].id + "}"
								});
					break;
				case "date":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : col_info[i].id, 
										type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
									},
									textAlign : "Center",
									tooltip : " "
								}).addStyleClass("FontFamily");
					break;
				case "mtext":
					oTemplate = new sap.m.Text({
									text : "{" + col_info[i].id + "}",
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : "{" + col_info[i].id + "}"
								}).addStyleClass("FontFamily");
								
					if(col_info[i].maxline){
						oTemplate.setMaxLines(col_info[i].maxline);
					}
					break;
				case "evalresult":
					oTemplate = new sap.m.Button({
									type : "Transparent",
									icon : "sap-icon://history",
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
									press : function(oEvent){
										oController.onPressUserinfo(oEvent, "1");
									},
									visible : {
										path : "Pernr",
										formatter : function(fVal){
											return fVal ? true : false;
										}
									},
									tooltip : oBundleText.getText("LABEL_12100") // 평가 결과조회
								});
					break;
				case "empprofile":
					oTemplate = new sap.m.Button({
									type : "Transparent",
									icon : "sap-icon://customer",
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
									press : function(oEvent){
										oController.onPressUserinfo(oEvent, "2");
									},
									visible : {
										path : "Pernr",
										formatter : function(fVal){
											return fVal ? true : false;
										}
									},
									tooltip : oBundleText.getText("LABEL_18001") // 사원프로파일
								});
					break;
				case "collfin":
					oTemplate = new sap.m.Button({
									type : "Transparent",
									icon : "sap-icon://document-text",
									customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
									press : oController.onPressDetail,
									visible : {
										path : col_info[i].id,
										formatter : function(fVal){
											return (fVal && fVal != "") ? true : false;
										}
									},
									tooltip : oBundleText.getText("LABEL_20030") // 이의제기 처리
								});
					break;
				case "time":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : col_info[i].id,
										formatter : function(fVal){
											return (fVal && fVal != "") ? fVal.substring(0,2) + ":" + fVal.substring(2,4) : "";
										}
									},
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : " "
								});
					break;
				case "money":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : col_info[i].id,
										formatter : function(x){
															 if(x == null || x == "") return "";
															 return (x*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
														}
									},
									textAlign : "End",
									tooltip : " "
								}).addStyleClass("FontFamily");
				case "period":
					oTemplate = new sap.ui.commons.TextView({
									text : col_info[i].id,
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : " "
								});
					break;
				case "cancle":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : "Cancl"}, {path : col_info[i].id}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("color-signature-blue color-signature-red");
											
											if(fVal1 == ""){ // 신규
												this.addStyleClass("color-signature-blue");
											} else { // 취소
												this.addStyleClass("color-signature-red");
											}
											
											return fVal2;
										}
									},
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : " "
								}).addStyleClass("font-bold");
					break;
				case "process":
					if(col_info[i].id == "Delete"){
						oTemplate = new sap.m.Link({
										text : oBundleText.getText("LABEL_53014"), // 삭제
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										visible : {
											parts : [{path : "Cancl"}, {path : "Status"}, {path : "Begda"}],
											formatter : function(fVal1, fVal2, fVal3){
												if(fVal1 == "" && fVal2 == "AA" && fVal3){
													var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
													if(dateFormat.format(new Date(fVal3)) * 1 > dateFormat.format(new Date()) * 1){
														return true;
													} else {
														return false;
													}
												} else {
													return false;
												}
											}
										},
										press : function(oEvent){
											oController.onPressDelete(oEvent, "D");
										}
									});
					} else if(col_info[i].id == "Cancel"){
						oTemplate = new sap.m.Link({
										text : oBundleText.getText("LABEL_53013"), // 취소
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										visible : {
											path : "Status",
											formatter : function(fVal){
												return fVal == "99" ? true : false;
											}
										},
										press : function(oEvent){
											oController.onPressDelete(oEvent, "E");
										}
									});
					}
					
					oTemplate.addStyleClass("color-signature-red");
					
					break;
				case "workschedule":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : col_info[i].id}, {path : col_info[i].id + "C"}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("color-signature-blue color-signature-red");
											
											if(fVal2 == "BLUE"){
												this.addStyleClass("color-signature-blue");
											} else if(fVal2 == "RED"){
												this.addStyleClass("color-signature-red");
											}
											
											return fVal1;
										}
									},
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : " "
								});
					break;
				case "formatter":
					switch(col_info[i].id){
						case "DutycT":
							oTemplate = new sap.ui.commons.TextView({
								text : {
									parts : [{path : col_info[i].id}, {path : "Dutyc"}],
									formatter : function(fVal1, fVal2){
										this.removeStyleClass("color-info-red");
										
										if(fVal2 != "1"){
											this.addStyleClass("color-info-red");
										}
										
										return fVal1;
									}
								},
								textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
								tooltip : " "
							});
							break;
						case "Retrn":
							oTemplate = new sap.m.Input({
											value : "{" + col_info[i].id + "}",
											width : "100%",
											editable : {
												path : "Status",
												formatter : function(fVal){
													return fVal == "88" ? true : false;
												}
											},
											maxLength : common.Common.getODataPropertyLength("ZHR_BATCHAPPROVAL_SRV", "RationaleApprovalTab", col_info[i].id)
										});
							break;
						case "Status":
							oTemplate = new sap.m.ComboBox({
											selectedKey : "{" + col_info[i].id + "}",
											width : "100%",
											change : oController.onChangeStatus,
											customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
										});
										
							var oModel = $.app.getModel("ZHR_COMMON_SRV");
							var createData = {NavCommonCodeList : []};
								createData.ICodeT = "022";
								createData.IPernr = oController.getSessionInfoByKey("Pernr");
								createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
								createData.IBukrs = oController.getSessionInfoByKey("Bukrs");
								createData.IMolga = oController.getSessionInfoByKey("Molga");
								createData.ICodty = "CC";
								createData.ILangu = oController.getSessionInfoByKey("Langu");
							
							oModel.create("/CommonCodeListHeaderSet", createData, null,
								function(data, res){
									if(data){
										if(data.NavCommonCodeList && data.NavCommonCodeList.results){
											var data1 = data.NavCommonCodeList.results;
											
											for(var i=0; i<data1.length; i++){
												oTemplate.addItem(new sap.ui.core.Item({key : data1[i].Code, text : data1[i].Text}));
											}
										}
									}
								},
								function (oError) {
							    	var Err = {};
							    	oController.Error = "E";
											
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										var msg1 = Err.error.innererror.errordetails;
										if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
										else oController.ErrorMessage = Err.error.message.value;
									} else {
										oController.ErrorMessage = oError.toString();
									}
								}
							);	
							
							if(oController.Error == "E"){
								oController.Error = "";
								sap.m.MessageBox.error(oController.ErrorMessage);
							}
							
							break;
						case "Delapptx":
							oTemplate = new sap.ui.commons.TextView({
											text : {
												parts : [{path : "Delapptx"}, {path : "Delapp"}],
												formatter : function(fVal1, fVal2){
													this.removeStyleClass("color-signature-blue color-red");
													
													if(fVal2 == ""){
														this.addStyleClass("color-signature-blue");
													} else if(fVal2 == "X"){
														this.addStyleClass("color-red");
													}

													return fVal1;
												}
											},
											textAlign : "Center",
											tooltip : " "
										}).addStyleClass("FontFamily");
							break; 
					}
					break;
				default:
					oTemplate = new sap.ui.commons.TextView({
									text : "{" + col_info[i].id + "}",
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
									tooltip : " "
								}).addStyleClass("FontFamily");
			}
			
			oColumn.setTemplate(oTemplate); 
			oTable.addColumn(oColumn);  
		}
	},
	
	setRowspan : function(){
	    var oColspan = 1, oCount = 1;
	   
	    $("td[data-sap-ui-colindex]").each(function(index, item){
			if(item.id.match(/_1/g)) return true;
			
			if(item.colSpan == 1){
				if(oColspan == 1){
					$("#" + item.id).attr("rowspan", "2");
					$("#" + item.id + "_1").css("display", "none");
				} else {
					oCount++;
					if(oColspan != oCount){
						return true;
					} else {
						oColspan = 1, oCount = 1;
					}
				}
			} else {
					oColspan = item.colSpan;
					$("#" + item.id).css("border-bottom", "1px solid #dddddd");
			}
		}); 
	},
	
	onTableSort : function(oEvent){
		var oTable = sap.ui.getCore().byId(oEvent.getParameters().id);
		var oData = oTable.getModel().getProperty("/Data");
		var total = oData[oData.length-1];
		
		var oColumn = oEvent.getParameters().column;
		var oSortOrder = oEvent.getParameters().sortOrder;
		
		oEvent.preventDefault();
		for(var i=0; i<oTable.getColumns().length; i++){
			oTable.getColumns()[i].setSorted(false);
		}
		
		oColumn.setSorted(true);
		oColumn.setSortOrder(oSortOrder);
		
		var newData = [];
		for(var i=0; i<oData.length-1; i++){
			newData.push(oData[i]);
		}
		
		newData.sort(function(a,b){
			var item1 = eval("a." + oColumn.getSortProperty());
			var item2 = eval("b." + oColumn.getSortProperty());
			
				item1 = item1 == "-" ? 0 : item1;
				item2 = item2 == "-" ? 0 : item2;
			
			if(oEvent.getParameters().sortOrder == "Ascending"){
				if(item1 > item2){
					return 1;
				} else if(item1 < item2){
					return -1;
				} else {
					return 0;
				}
				
			} else {
				if(item1 > item2){
					return -1;
				} else if(item1 < item2){
					return 1;
				} else {
					return 0;
				}
			}
		});
		
		newData.push(total);
		
		oTable.getModel().setData({Data : newData});
		oTable.bindRows("/Data");
	}
};