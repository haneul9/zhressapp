jQuery.sap.declare("common.SearchEvalSurvey");

common.SearchEvalSurvey = {
	PAGEID : "EvalSurvey",
	oController : null,
	
	userId : null,
	Appye : null,
	
	_JSONModel : new sap.ui.model.json.JSONModel(),
	_MessageJSONModel : new sap.ui.model.json.JSONModel(),
	_BusyDialog : new sap.m.BusyDialog(),
	
	// 번역
	oBundleText : jQuery.sap.resources({
		url : "i18n/i18n.properties" + "?" + new Date().getTime(),
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
	onBeforeOpen : function(oEvent){
		common.SearchEvalSurvey._JSONModel.setData({Data : []});
		
		if(sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV") == undefined){
			var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
					var pair = p.split(/=/);
					if (pair[0] === "s4hana") { return pair[1]; }
				})[0],
				destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
				
			var oModel = new sap.ui.model.odata.ODataModel(destination + "/sap/opu/odata/sap/ZHR_APPRAISAL_SRV/", true, undefined, undefined, undefined, undefined, undefined, false);
				oModel.setCountSupported(false);
				oModel.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModel, "ZHR_APPRAISAL_SRV");
		}
		
		var oContent = sap.ui.getCore().byId(common.SearchEvalSurvey.PAGEID + "_Content");
			oContent.destroyItems();
			
	},
	
	onAfterOpen : function(oEvent){
		// 데이터 조회
		var vData = {Data : []};
		var createData = {TableIn : []};
			createData.IConType = "2";
			createData.IAppye = common.SearchEvalSurvey.Appye;
			createData.IEmpid = common.SearchEvalSurvey.userId;        
			
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		oModel.create("/EvaSurveySet", createData, null,
			function(data,res){
				if(data && data.TableIn) {
					if(data.TableIn.results && data.TableIn.results.length){
						for(var i=0; i<data.TableIn.results.length; i++){
							vData.Data.push(data.TableIn.results[i]);
						}
					}
				} 
			},
			function (oError) {
		    	var Err = {};
		    	common.SearchEvalSurvey.Error = "E";
		    	
				if (oError.response) {
					Err = window.JSON.parse(oError.response.body);
					var msg1 = Err.error.innererror.errordetails;
					if(msg1 && msg1.length) common.SearchEvalSurvey.ErrorMessage = Err.error.innererror.errordetails[0].message;
					else common.SearchEvalSurvey.ErrorMessage = Err.error.message.value;
				} else {
					common.SearchEvalSurvey.ErrorMessage = oError.toString();
				}
			}
		);
		    
		if(common.SearchEvalSurvey.Error == "E"){                                                                                 
			common.SearchEvalSurvey.Error = "";
			sap.m.MessageBox.error(common.SearchEvalSurvey.ErrorMessage, {
				onClose : function(){
					sap.ui.getCore().byId(common.SearchEvalSurvey.PAGEID + "_SurveyDialog").close();
				}
			});
			return;
		}                                                                                                                                       
		
		if(vData.Data.length == 0){ 
			sap.m.MessageBox.error(common.SearchEvalSurvey.oBundleText.getText("MSG_16004"), { // 설문 데이터가 존재하지 않습니다. 
				onClose : function(){
					sap.ui.getCore().byId(common.SearchEvalSurvey.PAGEID + "_SurveyDialog").close();
				}
			});
			return;
		}
		
		// 항목별로 데이터를 생성해서 바인딩함
		var oData = {Data : []};
		var survey = [];
		
		var pushData = function(vData, survey){
			var detail = {};
				detail.Appye = vData.Appye;
				detail.Pernr = vData.Pernr;
				detail.Svygrp = vData.Svygrp;
				detail.Svyty = vData.Svyty;
				detail.Result = (vData.Svyty == "1" ? -1 : "");
				detail.Svyno = vData.Svyno;	  // 설문항목
				detail.Svyitm = vData.Svyitm; // 설문항목 text
				detail.Mandyn = vData.Mandyn; // 필수여부
				detail.Etctxtyn = vData.Etctxtyn ? vData.Etctxtyn : "";
				detail.Survey = survey;
	
			oData.Data.push(detail);
		}
		
		var check = "";
		for(var i=0; i<vData.Data.length; i++){
			if((i!=0 && (vData.Data[i].Svyno != vData.Data[i-1].Svyno))){
				check = "X";
				pushData(vData.Data[i-1], survey);
			}
			
			if(check == "X"){
				check = "";
				survey = [];
			}
			
			survey.push({key : vData.Data[i].Svyselno, text : vData.Data[i].Svyseltx});
		}
		
		// 마지막 데이터 추가
		pushData(vData.Data[(vData.Data.length-1)], survey);
		
		var oContent = sap.ui.getCore().byId(common.SearchEvalSurvey.PAGEID + "_Content");
			oContent.addItem(common.SearchEvalSurvey.makeContent(oData));
		
		common.SearchEvalSurvey._JSONModel.setData(oData);
	},
	
	onPressSave : function(oEvent){
		var oData = common.SearchEvalSurvey._JSONModel.getProperty("/Data");
		
		// validation check
		var createData = {TableIn : []};
		for(var i=0; i<oData.length; i++){
			if(oData[i].Mandyn == "Y"){ // 필수입력
				if((oData[i].Svyty == "1" && oData[i].Result == -1) || (oData[i].Svyty == "2" && oData[i].Result == "") || (oData[i].Svyty == "3" && oData[i].Result.trim() == "")){
					sap.m.MessageBox.error(oData[i].Svyno + " " + common.SearchEvalSurvey.oBundleText.getText("MSG_16001")); // 항목은 필수입력입니다. 입력하여 주시기 바랍니다.
					return;
				}
			}
			
			var detail = {};
				detail.Svyno = oData[i].Svyno;
			
			switch(oData[i].Svyty){
				case "1":
				case "3":
					detail.Svyval01 = oData[i].Result;
					break;
				case "2":
					for(var j=0; j<oData[i].Result.length; j++){
						eval("detail.Svyval0" + (j+1) + " = oData[i].Result[" + j + "];");
						if(oData[i].Etctxt && oData[i].Etctxt != ""){
							detail.Etctxt = oData[i].Etctxt;
						}
					}
					break;
			}
			
			createData.TableIn.push(detail);
		}
		
		var onProcess = function(){
			createData.IAppye = oData[0].Appye;
			createData.IEmpid = oData[0].Pernr;
			createData.IConType = "1";
			
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
			oModel.create("/EvaSurveySet", createData, null,
				function(data,res){
					if(data) {
						
					} 
				},
				function (oError) {
			    	var Err = {};
			    	common.SearchEvalSurvey.Error = "E";
			    	
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) common.SearchEvalSurvey.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else common.SearchEvalSurvey.ErrorMessage = Err.error.message.value;
					} else {
						common.SearchEvalSurvey.ErrorMessage = oError.toString();
					}
				}
			);
			
			if(common.SearchEvalSurvey.Error == "E"){
				common.SearchEvalSurvey.Error = "";
				sap.m.MessageBox.error(common.SearchEvalSurvey.ErrorMessage);
				return;
			}
			
			common.SearchEvalSurvey._BusyDialog.close();
			
			sap.m.MessageBox.success(common.SearchEvalSurvey.oBundleText.getText("MSG_16003"), { // 제출 완료되었습니다.
				onClose : function(){
					sap.ui.getCore().byId(common.SearchEvalSurvey.PAGEID + "_SurveyDialog").close();
					
					// 평가결과 조회
					// common.SearchEvalSurvey.oController.onSearchEvalResult();
					common.SearchEvalResultAgree.onSearchEvalResult();
				}
			});
		};
		
		var onBeforeSave = function(fVal){
			if(fVal && fVal == "YES"){
				common.SearchEvalSurvey._BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm(common.SearchEvalSurvey.oBundleText.getText("MSG_16002"), { // 제출하시겠습니까?
			actions : ["YES", "NO"],
			onClose : onBeforeSave
		});
	},
	
	onSelectRadio : function(oEvent){
		var key = oEvent.getSource().getCustomData()[0].getValue();
		var idx = oEvent.getSource().getCustomData()[1].getValue();
		
		common.SearchEvalSurvey._JSONModel.setProperty("/Data/" + idx + "/Result", key);
	},
	
	onSelectCheckbox : function(oEvent, Flag){
		var key = oEvent.getSource().getCustomData()[0].getValue();
		var idx = oEvent.getSource().getCustomData()[1].getValue();
		
		var result = common.SearchEvalSurvey._JSONModel.getProperty("/Data/" + idx + "/Result");
		var newResult = [], oSelected = oEvent.getParameters().selected;
		
		// '기타' 선택 시 : 의견 입력하는 칸 수정할 수 있게 열어준다.
		if(Flag){
			if(Flag == "X" && oSelected == true){
				common.SearchEvalSurvey._JSONModel.setProperty("/Data/" + idx + "/Etcedit", "X");
			} else if(Flag == "X" && oSelected == false){
				common.SearchEvalSurvey._JSONModel.setProperty("/Data/" + idx + "/Etctxt", "");
				common.SearchEvalSurvey._JSONModel.setProperty("/Data/" + idx + "/Etcedit", "");
			}
		}
		
		if(result.length == 0 && oSelected == true){
			newResult.push(key);
		} else {
			if(oSelected == true){
				for(var i=0; i<result.length; i++){
					newResult.push(result[i]);
				}
				
				newResult.push(key);
			} else {
				for(var i=0; i<result.length; i++){
					if(result[i] == key) continue;
					
					newResult.push(result[i]);
				}
			}
		}
		
		newResult.sort();
		
		common.SearchEvalSurvey._JSONModel.setProperty("/Data/" + idx + "/Result", newResult);
	},
	
	makeContent : function(oData){
		var oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});
		
		for(var i=0; i<oData.Data.length; i++){
			
			// 설문그룹
			if(i==0 || (oData.Data[i].Svygrp != oData.Data[i-1].Svygrp)){
				// 이전 설문그룹과 다른 경우 설문 항목 아래쪽에 border 넣어준다.
				if(oCell){
					oCell.addStyleClass("survey_lastcontent");
				}
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
					   height : "30px",
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							   		content : [new sap.m.Text({text : oData.Data[i].Svygrp}).addStyleClass("Font18 Font700")],
									hAlign : "Begin",
									vAlign : "Middle"
							    })]
				   })
				);
				
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "7px"}).addStyleClass("survey_group"));
			}
			
			// 설문항목
			var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
				columns : 1,
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({
							height : "40px",
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										 content : [new sap.m.Label({
													 	text : (oData.Data[i].Svyno + ". " + oData.Data[i].Svyitm),
													 	required : (oData.Data[i].Mandyn == "Y" ? true : false)
													}).addStyleClass("survey_title_text")]
									 })]
						}).addStyleClass("survey_title"),
						new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
			
			oMatrix2.bindElement("/Data/" + i);
			
			// 설문 답변
			var oContent;
			switch(oData.Data[i].Svyty){
				case "1": // 단일선택
					oContent = new sap.ui.commons.layout.MatrixLayout({
						columns : 2,
						widths : ["50px",""],
						width : "100%"
					});
					
					oContent = new sap.m.RadioButtonGroup({
								   width : "100%",
								   selectedIndex : {
								   		path : "Result",
								   		formatter : function(fVal){
								   			return fVal ? parseInt(fVal) : -1;
								   		}
								   }
				    });
						
					for(var j=0; j<oData.Data[i].Survey.length; j++){
						oContent.addButton(
							new sap.m.RadioButton({
								useEntireWidth : true,
								// text : oData.Data[i].Survey[j].text,
								customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
											  new sap.ui.core.CustomData({key : "", value : i})],
								select : common.SearchEvalSurvey.onSelectRadio
							})
						);
					}
					
					break;
				case "2": // 복수선택
					oContent = new sap.ui.layout.VerticalLayout();
					
					for(var j=0; j<oData.Data[i].Survey.length; j++){
						// 기타
						if((j == oData.Data[i].Survey.length-1) && oData.Data[i].Etctxtyn == "X"){
							oContent.addContent(
								new sap.ui.layout.HorizontalLayout({
									content : [new sap.m.CheckBox({
												   selected : false,
												   text : common.SearchEvalSurvey.oBundleText.getText("LABEL_16004"), // 기타
												   customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}), // "X"
																 new sap.ui.core.CustomData({key : "", value : i})],
												   select : function(oEvent){
												   		common.SearchEvalSurvey.onSelectCheckbox(oEvent, "X");
												   }
											   }),
											   new sap.m.Input({
											   	   value : "{Etctxt}",
											   	   width : "635px",
											   	   editable : {
											   	   		path : "Etcedit",
											   	   		formatter : function(fVal){
											   	   			return fVal == "X" ? true : false;
											   	   		}
											   	   },
											   	   maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaSurveyTableIn", "Etctxt"),
											   }).addStyleClass("paddingLeft10")]
								})
							);
						} else {
							oContent.addContent(
								new sap.m.CheckBox({
									selected : false,
									text : oData.Data[i].Survey[j].text,
									customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
												  new sap.ui.core.CustomData({key : "", value : i})],
									select : common.SearchEvalSurvey.onSelectCheckbox
								})
							);
						}
					}
					break;
				case "3": // 단답형
					oContent = new sap.m.TextArea({
								   value : "{Result}",
								   width : "100%",
								   growing : true,
								   rows : 1,
								   growingMaxLines : 5,
								   maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaSurveyTableIn", "Svyval01")
							   }).addStyleClass("FontFamily");
					break;
			}
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : [oContent],
				hAlign : "Begin",
				vAlign : "Middle"
			});
			
			oMatrix2.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [oCell]
				})
			);
			
			oMatrix2.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}));
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
				})	
			);
		}
		
		oMatrix.addStyleClass("sapUiSizeCompact");
		
		return oMatrix;
	},
	
	makeMobileContent : function(oData){
		var oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});
		
		var hbox = new sap.m.HBox({
			wrap: "Wrap",
		});
		
		var oFBox = new sap.m.FlexBox({
		
		});
			
		for(var i=0; i<oData.Data.length; i++){
			
			// 설문그룹
			if(i==0 || (oData.Data[i].Svygrp != oData.Data[i-1].Svygrp)){
				// 이전 설문그룹과 다른 경우 설문 항목 아래쪽에 border 넣어준다.
				if(oCell){
					oCell.addStyleClass("survey_lastcontent");
				}
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
					   height : "30px",
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							   		content : [new sap.m.Text({text : oData.Data[i].Svygrp}).addStyleClass("Font16 Font700")],
									hAlign : "Begin",
									vAlign : "Middle"
							    })]
				   })
				);
				
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "7px"}).addStyleClass("survey_group"));
			}
			
			// 설문항목
			var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
				columns : 1,
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({
							// height : "40px",
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										 content : [new sap.m.Text({
													 	// text :  {
													 	// 	parts : [{path : oData.Data[i].Svyno}, {path : oData.Data[i].Svyitm}, {path:oData.Data[i].Mandyn} ],
												   //	   		formatter : function(fVal1,fVal2,fVal3){
												   //	   			return fVal3 == "X" ? fVal1 + ". " + fVal2 + " *" : fVal1 + ". " + fVal2;
												   //	   		}
												   //	    },
													 	
													 	
														text : (oData.Data[i].Svyno + ". " + oData.Data[i].Svyitm),
													 	// required : (oData.Data[i].Mandyn == "Y" ? true : false)
													}).addStyleClass("msurvey_title_text")]
									 }).addStyleClass("paddingTop10 paddingBottom10")]
						}).addStyleClass("survey_title"),
						new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
			oMatrix2.setModel(common.SearchEvalSurvey._JSONModel);
			oMatrix2.bindElement("/Data/" + i);
			
			// 설문 답변
			var oContent;
			switch(oData.Data[i].Svyty){
				case "1": // 단일선택
					oContent = new sap.m.RadioButtonGroup({
								   width : "100%",
								   selectedIndex : {
								   		path : "Result",
								   		formatter : function(fVal){
								   			return fVal ? parseInt(fVal) : -1;
								   		}
								   }
							   });
					
					for(var j=0; j<oData.Data[i].Survey.length; j++){
						// var oButton = 	new sap.m.RadioButton({
						// 		useEntireWidth : true,
						// 		layoutData: new sap.m.FlexItemData({growFactor: 0}),
						// 		text : oData.Data[i].Survey[j].text,
						// 		customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
						// 					  new sap.ui.core.CustomData({key : "", value : i})],
						// 		select : common.SearchEvalSurvey.onSelectRadio
						// 	});
							
						oContent.addButton(
							new sap.m.RadioButton({
								useEntireWidth : true,
								layoutData: new sap.m.FlexItemData({growFactor: 0}),
								text : oData.Data[i].Survey[j].text,
								customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
											  new sap.ui.core.CustomData({key : "", value : i})],
								select : common.SearchEvalSurvey.onSelectRadio
							}).addStyleClass("paddingtop10")
						)
					}
					
			
					
					// oContent = new sap.ui.commons.layout.MatrixLayout({
					// 	columns : 2,
					// 	widths : ["50px",""],
					// 	width : "100%"
					// });
					
					// var oRaidoBG = new sap.m.RadioButtonGroup({
					// 			   width : "100%",
					// 			   selectedIndex : {
					// 			   		path : "Result",
					// 			   		formatter : function(fVal){
					// 			   			return fVal ? parseInt(fVal) : -1;
					// 			   		}
					// 			   }
					// 		   });
							   
					// var oRadioRow = new sap.ui.commons.layout.MatrixLayoutRow({
					// 	height : "100%",
					// 	cells : [new sap.ui.commons.layout.MatrixLayoutCell({
					// 				 content : [oRaidoBG],
					// 				 rowSpan : oData.Data[i].Survey.length
					// 			 })]
					// });
						
					// for(var j=0; j<oData.Data[i].Survey.length; j++){
					// 	oRaidoBG.addButton(
					// 		new sap.m.RadioButton({
					// 			useEntireWidth : true,
					// 			// text : oData.Data[i].Survey[j].text,
					// 			customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
					// 						  new sap.ui.core.CustomData({key : "", value : i})],
					// 			select : common.SearchEvalSurvey.onSelectRadio
					// 		})
					// 	);
						
					// 	if(j==0){
					// 		oRadioRow.addCell(
					// 			new sap.ui.commons.layout.MatrixLayoutCell({
					// 				 content : [new sap.m.Text({
					// 				 	text : oData.Data[i].Survey[j].text
					// 				 })],
					// 			 })
					// 		);
					// 		oContent.addRow(oRadioRow);
					// 	}else{
					// 		oContent.addRow(
					// 			new sap.ui.commons.layout.MatrixLayoutRow({
					// 				height : "100%",
					// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
					// 							 content : [new sap.m.Text({
					// 				 						text : oData.Data[i].Survey[j].text
					// 									})]
					// 				})]
					// 			})
					// 		)
					// 	}
					// }
					
					
					// oContent = new sap.m.VBox({
					// 	width : "100%",
					// });
					
					// for(var j=0; j<oData.Data[i].Survey.length; j++){
					// 	oContent.addItem(new sap.m.HBox({
					// 			height: "40px",
					// 			width : "100%",
					// 			alignItems: sap.m.FlexAlignItems.Begin,
					// 			items: [
					// 				new sap.m.RadioButton({
					// 					useEntireWidth : false,
					// 					// width : "30px",
					// 					customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
					// 								  new sap.ui.core.CustomData({key : "", value : i})],
					// 					select : common.SearchEvalSurvey.onSelectRadio
					// 				}),
					// 				new sap.m.Text({
					// 					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					// 					text: oData.Data[i].Survey[j].text,
					// 					textAlign: "Begin"
					// 				}),
					// 				new sap.m.Image({
					// 					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					// 					text: oData.Data[i].Survey[j].text,
					// 					textAlign: "Begin"
					// 				})
					// 			]
					// 		})
					// 	)
					// }
							
							
					break;
				case "2": // 복수선택
					oContent = new sap.ui.layout.VerticalLayout();
					
					for(var j=0; j<oData.Data[i].Survey.length; j++){
						// 기타
						if((j == oData.Data[i].Survey.length-1) && oData.Data[i].Etctxtyn == "X"){
							oContent.addContent(
								new sap.ui.layout.HorizontalLayout({
									content : [new sap.m.CheckBox({
												   selected : false,
												   text : common.SearchEvalSurvey.oBundleText.getText("LABEL_16004"), // 기타
												   customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}), // "X"
																 new sap.ui.core.CustomData({key : "", value : i})],
												   select : function(oEvent){
												   		common.SearchEvalSurvey.onSelectCheckbox(oEvent, "X");
												   }
											   }),
											   new sap.m.Input({
											   	   value : "{Etctxt}",
											   	   width : "100%",
											   	   editable : {
											   	   		path : "Etcedit",
											   	   		formatter : function(fVal){
											   	   			return fVal == "X" ? true : false;
											   	   		}
											   	   },
											   	   maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaSurveyTableIn", "Etctxt"),
											   }).addStyleClass("paddingLeft10")]
								})
							);
						} else {
							oContent.addContent(
								new sap.m.CheckBox({
									selected : false,
									text : oData.Data[i].Survey[j].text,
									customData : [new sap.ui.core.CustomData({key : "", value : oData.Data[i].Survey[j].key}),
												  new sap.ui.core.CustomData({key : "", value : i})],
									select : common.SearchEvalSurvey.onSelectCheckbox
								})
							);
						}
					}
					break;
				case "3": // 단답형
					oContent = new sap.m.TextArea({
								   value : "{Result}",
								   width : "100%",
								   growing : true,
								   rows : 1,
								   growingMaxLines : 5,
								   maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaSurveyTableIn", "Svyval01")
							   }).addStyleClass("FontFamily");
					break;
			}
	
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : [oContent],
				hAlign : "Begin",
				vAlign : "Middle"
			});
			
			oMatrix2.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [oCell]
				})
			);
			
			oMatrix2.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}));
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
				})	
			);
		}
		
		// oFBox.addItem(hbox)
		// oFBox.addStyleClass("sapUiSizeCompact");
		
		// return oFBox;
		// oMatrix.addStyleClass("sapUiSizeCompact");
		
		return oMatrix;
	},
	
	onMPressSave : function(oEvent){
		var oData = common.SearchEvalSurvey._JSONModel.getProperty("/Data");
		
		// validation check
		var createData = {TableIn : []};
		for(var i=0; i<oData.length; i++){
			if(oData[i].Mandyn == "Y"){ // 필수입력
				if((oData[i].Svyty == "1" && oData[i].Result == -1) || (oData[i].Svyty == "2" && oData[i].Result == "") || (oData[i].Svyty == "3" && oData[i].Result.trim() == "")){
					sap.m.MessageBox.error(oData[i].Svyno + " " + common.SearchEvalSurvey.oBundleText.getText("MSG_16001")); // 항목은 필수입력입니다. 입력하여 주시기 바랍니다.
					return;
				}
			}
			
			var detail = {};
				detail.Svyno = oData[i].Svyno;
			
			switch(oData[i].Svyty){
				case "1":
				case "3":
					detail.Svyval01 = oData[i].Result;
					break;
				case "2":
					for(var j=0; j<oData[i].Result.length; j++){
						eval("detail.Svyval0" + (j+1) + " = oData[i].Result[" + j + "];");
						if(oData[i].Etctxt && oData[i].Etctxt != ""){
							detail.Etctxt = oData[i].Etctxt;
						}
					}
					break;
			}
			
			createData.TableIn.push(detail);
		}
		
		var onProcess = function(){
			createData.IAppye = oData[0].Appye;
			createData.IEmpid = oData[0].Pernr;
			createData.IConType = "1";
			
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
			oModel.create("/EvaSurveySet", createData, null,
				function(data,res){
					if(data) {
						
					} 
				},
				function (oError) {
			    	var Err = {};
			    	common.SearchEvalSurvey.Error = "E";
			    	
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) common.SearchEvalSurvey.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else common.SearchEvalSurvey.ErrorMessage = Err.error.message.value;
					} else {
						common.SearchEvalSurvey.ErrorMessage = oError.toString();
					}
				}
			);
			
			common.SearchEvalSurvey._BusyDialog.close();
			
			if(common.SearchEvalSurvey.Error == "E"){
				common.SearchEvalSurvey.Error = "";
				sap.m.MessageBox.error(common.SearchEvalSurvey.ErrorMessage);
				return;
			}
			
			
			sap.m.MessageBox.success(common.SearchEvalSurvey.oBundleText.getText("MSG_16003"), { // 제출 완료되었습니다.
				onClose : function(){
					// 평가결과 조회
					common.SearchEvalSurvey.oController.onSearchEvalResult();
				}
			});
		};
		
		var onBeforeSave = function(fVal){
			if(fVal && fVal == "YES"){
				common.SearchEvalSurvey._BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm(common.SearchEvalSurvey.oBundleText.getText("MSG_16002"), { // 제출하시겠습니까?
			actions : ["YES", "NO"],
			onClose : onBeforeSave
		});
	},
};
