jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"],
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_EvalPro.Detail", {
	
		PAGEID: "EvalProDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		FromPageId : "",
		
		onInit: function () {
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
				
			this.getView().addStyleClass("sapUiSizeCompact");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			
			oController.FromPageId = oEvent.data.FromPageId ? oEvent.data.FromPageId : "ZUI5_HR_EvalPro.List";
			
			var oData = {Data : {}};
			
			if(oEvent.data){
				oData.Data.Appid = oEvent.data.Appid;
				oData.Data.Appnm = oEvent.data.Appnm;
				oData.Data.Sndflg = oEvent.data.Sndflg;
			}
			
			oController._DetailJSonModel.setData(oData);
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.Detail");
			var oController = oView.getController();
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController.FromPageId,
			      data : {}
			});
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.Detail");
			var oController = oView.getController();
			
			var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content");
				oContent.destroyContent();
				
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oView.getModel("session").getData().Dtfmt});
			
				var oData = {Data : []};
				var vData = {Data : oController._DetailJSonModel.getProperty("/Data")};
				
				var createData = {TableIn1 : [], TableIn2 : [], TableIn3 : []};
					createData.IPernr = oEvent.data.Pernr;
					createData.IAppid = oEvent.data.Appid;
					createData.IAppnm = oEvent.data.Appnm;
					createData.IFlag = "1";
					
				var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/AppraisalSheetSet", createData, null,
					function(data, res){
						if(data){
							if(data.TableIn1 && data.TableIn1.results && data.TableIn1.results.length){
								data.TableIn1.results[0].Score = parseFloat(data.TableIn1.results[0].Score);
								
								for(var i=1; i<=10; i++){
									var item = eval("data.TableIn1.results[0].Item" + (i>=10 ? i : ("0"+i)));
										item = item ? ((parseInt(item) == 0 ? "" : parseInt(item))) : "";
										
									eval("data.TableIn1.results[0].Item" + (i>=10 ? i : ("0"+i)) + " = item");
								}
								
								vData.Data = Object.assign(vData.Data, data.TableIn1.results[0]);
							}
						
							if(data.TableIn2 && data.TableIn2.results && data.TableIn2.results.length){
								data.TableIn2.results[0].Begda = data.TableIn2.results[0].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn2.results[0].Begda))) : null;
								data.TableIn2.results[0].Endda = data.TableIn2.results[0].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn2.results[0].Endda))) : null;
								data.TableIn2.results[0].Dardt = data.TableIn2.results[0].Dardt ? dateFormat.format(new Date(common.Common.setTime(data.TableIn2.results[0].Dardt))) : null;
								
								vData.Data = Object.assign(vData.Data, data.TableIn2.results[0]);
							}
							
							if(data.TableIn3 && data.TableIn3.results && data.TableIn3.results.length){
								var count = 0, text = "";
								
								for(var i=0; i<data.TableIn3.results.length; i++){
									if(i == 0){
										
									} else if(data.TableIn3.results[i-1].Grp02 != data.TableIn3.results[i].Grp02){
										oData.Data.push({count : count, Grp01 : data.TableIn3.results[i-1].Grp01, Grp02 : data.TableIn3.results[i-1].Grp02, text : text});
										count = 0, text = "";
									} 
									
									count++;
									text += (text == "" ? data.TableIn3.results[i].Taget : ("\n" + data.TableIn3.results[i].Taget));
									
									if(i == data.TableIn3.results.length-1){
										oData.Data.push({count : count, Grp01 : data.TableIn3.results[i].Grp01, Grp02 : data.TableIn3.results[i].Grp02, text : text});
									}
								}
							}
						}
					},
					function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if(oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				);
				
				oController._DetailJSonModel.setData(vData);
				oContent.addContent(oController.makeMatrix(oData.Data));
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage, {
						onClose : oController.onBack
					});
					return;
				}
			};
				
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 합계점수 계산
		onSetScore : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var score = 0;
			for(var i=1; i<=10; i++){
				var item = eval("oData.Item" + (i>=10 ? i : "0"+i));
				if(item == "") continue;
				
				score += parseInt(item);
			}
			
			oController._DetailJSonModel.setProperty("/Data/Score", score);
		},
		
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			var oData2 = oController._DetailJSonModel.getProperty("/Data2");
			
			// validation check
			for(var i=1; i<=10; i++){
				var item = eval("oData.Item" + (i>=10 ? i : "0"+i));
				if(item == ""){
					sap.m.MessageBox.error(oData2[i-1].Grp01 + " - " + oData2[i-1].Grp02 + " " + oBundleText.getText("MSG_24003")); // 항목의 점수를 입력하여 주십시오.
					return;
				}
			}
			
			if((oData.Score <= 70 || oData.Score >= 90) && oData.Ztext.trim() == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_24004")); // 합계점수가 70점 이하 또는 90점 이상인 경우 평가자 의견사항은 필수입력항목입니다.
				return;
			}
			
			var process = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL2_SRV");
				var createData = {TableIn1 : [], TableIn2 : [], TableIn3 : []};
					createData.IPernr = oData.Pernr;
					createData.IAppid = oData.Appid;
					createData.IAppnm = oData.Appnm;
					createData.IFlag = "2";

				var detail = {};
					detail.Appid = oData.Appid;
					detail.Pernr = oData.Pernr;
					detail.Appnm = oData.Appnm;
					detail.Appnr = oView.getModel("session").getData().Pernr;
					detail.Item01 = oData.Item01 + "";
					detail.Item02 = oData.Item02 + "";
					detail.Item03 = oData.Item03 + "";
					detail.Item04 = oData.Item04 + "";
					detail.Item05 = oData.Item05 + "";
					detail.Item06 = oData.Item06 + "";
					detail.Item07 = oData.Item07 + "";
					detail.Item08 = oData.Item08 + "";
					detail.Item09 = oData.Item09 + "";
					detail.Item10 = oData.Item10 + "";
					detail.Ztext = oData.Ztext;
					
					createData.TableIn1.push(detail);
					
				oModel.create("/AppraisalSheetSet", createData, null,
					function(data, res){
						if(data){
							
						}
					},
					function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if(oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				);	
					
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_00017"), { // 저장되었습니다.
					onClose : oController.onBack
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(process, 100);                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
				}
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00058"), { // 저장하시겠습니까?
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		makeMatrix : function(oData){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.Detail");
			var oController = oView.getController();
			
			oController._DetailJSonModel.setProperty("/Data2", oData);
			
			var oWidths = [];
			if(oData && oData.length > 5){
				var isIE = (navigator.userAgent.toLowerCase().indexOf("trident") != -1) ? true : false;
				
				oWidths = ["", "", "", "", "", "", ""];
				
				if(isIE == true){
					oWidths.push("17px");
				} else {
					oWidths.push("13px");
				}
			} else {
				oWidths = ["", "", "", "", "", "", ""];
			}
			
			var oRow, oCell;
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : oWidths.length,
				width : "100%",
				widths : oWidths
			});
			
			oMatrix.setModel(oController._DetailJSonModel);
			oMatrix.bindElement("/Data")
			
			// button
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							   	    content : [new sap.ui.layout.HorizontalLayout({
										   	       content : [new sap.m.Button({
													   	          text : oBundleText.getText("LABEL_24026"), // 저장
													   	    	  press : oController.onPressSave,
													   	    	  visible : {
														   	    	  	path : "Sndflg",
														   	    	  	formatter : function(fVal){
														   	    	  		return fVal == "" ? true : false;
														   	    	  	}
													   	    	  }
													   	      }).addStyleClass("button-dark")]
													   	      //new sap.ui.core.HTML({content : "<div style='width:10px' />"}),
										   	    			  //new sap.m.Button({
										   	    		   //		  text : oBundleText.getText("LABEL_24027"), // 취소
										   	    		   //		  press : oController.onBack
										   	    			  //}).addStyleClass("button-dark")]
										   	   })],
							   	    hAlign : "End",
							   	    vAlign : "Middle",
							   	    colSpan : (oWidths.length)
							    }).addStyleClass("paddingBottom5")]
					});
			oMatrix.addRow(oRow);
			
			// header
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({
					   height : "35px",
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							   	    content : [new sap.m.Text({text : oBundleText.getText("LABEL_24021")})], // 평가요소
							   	    hAlign : "Center",
							   	    vAlign : "Middle",
							   	    rowSpan : 3
							    }).addStyleClass("Label border_left0"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Text({text : oBundleText.getText("LABEL_24022")})], // 평가항목
							    	hAlign : "Center",
							    	vAlign : "Middle",
							    	rowSpan : 3
							    }).addStyleClass("Label"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Text({text : oBundleText.getText("LABEL_24023")})], // 평가내용 및 평점
							    	hAlign : "Center",
							    	vAlign : "Middle",
							    	colSpan : 4
							    }).addStyleClass("Label"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Label({text : oBundleText.getText("LABEL_24025"), required : true, textDirection: "RTL"})], // 점수
							    	hAlign : "Center",
							    	vAlign : "Middle",
							    	rowSpan : 3
							    }).addStyleClass("Label border_right0")]
				   });
				   
			if(oData.length > 5){
				oRow.addCell(
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [],
						rowSpan : 3
					}).addStyleClass("Label border_right0")
				);
			}
			oMatrix.addRow(oRow);
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({
					   height : "35px",
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								   	content : [new sap.m.Text({text : oBundleText.getText("LABEL_24024")})], // 구분
								   	hAlign : "Center",
								   	vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : "A"})],
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : "B"})],
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : "C"})],
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label")]
				   });
			oMatrix.addRow(oRow);
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({
					   height : "35px",
					   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
							   	    content : [new sap.m.Text({text : oBundleText.getText("LABEL_24025")})], // 점수
							   	    hAlign : "Center",
							   	    vAlign : "Middle"
							    }).addStyleClass("Label"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Text({text : "10 - 9"})],
							    	hAlign : "Center",
							    	vAlign : "Middle"
							    }).addStyleClass("Label"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Text({text : "8 - 7"})],
							    	hAlign : "Center",
							    	vAlign : "Middle"
							    }).addStyleClass("Label"),
							    new sap.ui.commons.layout.MatrixLayoutCell({
							    	content : [new sap.m.Text({text : "6 - 5"})],
							    	hAlign : "Center",
							    	vAlign : "Middle"
							    }).addStyleClass("Label")]
				   });
			oMatrix.addRow(oRow);
			
			// Detail
			if(oData && oData.length > 0){
				// 점수 combobox 
				var grade = [];
				var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
				var createData = {NavCommonCodeList : []};
					createData.ICodeT = "004";
					createData.IPernr = oView.getModel("session").getData().Pernr;
					createData.IBukrs = oView.getModel("session").getData().Bukrs;
					createData.ICodty = "ZHRD_ZITEM1";
					
				oModel.create("/CommonCodeListHeaderSet", createData, null,
					function(data, res){
						if(data){
							if(data.NavCommonCodeList && data.NavCommonCodeList.results && data.NavCommonCodeList.results.length){
								for(var i=0; i<data.NavCommonCodeList.results.length; i++){
									grade.push({key : parseInt(data.NavCommonCodeList.results[i].Code) + "", text : parseInt(data.NavCommonCodeList.results[i].Text) + ""});
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
					oController._BusyDialog.close();
					sap.m.MessageBox.error(oController.ErrorMessage, {
						onClose : oController.onBack
					});
					return;
				}
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
					columns : (oData.length > 5 ? oWidths.length-1 : oWidths.length),
					width : "100%",
					widths : oWidths
				});
				
				var oCell, oCell2;
				var count = 0;
				
				for(var i=0; i<oData.length; i++){
					oRow = new sap.ui.commons.layout.MatrixLayoutRow();
					
					if(i==0 || (oData[i-1].Grp01 != oData[i].Grp01)){
						if(oCell2){
							oCell2.setRowSpan(count);
							count = 0;
						}
						
						oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oData[i].Grp01})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data border_left0");
								 
						oRow.addCell(oCell2);
					} else if(i == oData.length - 1){
						if(oCell2) oCell2.setRowSpan(count+1);
					}
					
					count++;
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : oData[i].Grp02})],
								hAlign : "Center",
								vAlign : "Middle"
							}).addStyleClass("Data");
					oRow.addCell(oCell);
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : oData[i].text})],
								hAlign : "Begin",
								vAlign : "Top",
								colSpan : 4
							}).addStyleClass("Data paddingTop10 paddingBottom10");
					oRow.addCell(oCell);      
					
					var oGrade = new sap.m.Select({
									 selectedKey : eval("'{Item" + (i+1>=10 ? i+1 : ("0"+(i+1))) + "}'"),
									 width : "100%",
									 change : oController.onSetScore,
									 editable : {
									 	path : "Sndflg",
									 	formatter : function(fVal){
									 		return fVal == "" ? true : false;
									 	}
									 }
								 });
								 
				 	oGrade.addItem(new sap.ui.core.Item({key : "", text : oBundleText.getText("LABEL_00181")})); // 선택
				 	
					for(var j=0; j<grade.length; j++){
						oGrade.addItem(new sap.ui.core.Item({key : grade[j].key, text : grade[j].text}));
					}
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [oGrade],
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("Data");
					oRow.addCell(oCell);
					
					if(oData.length > 5){
						oMatrix2.addRow(oRow);
					} else {
						oMatrix.addRow(oRow);
					}
				}
				
				if(oData.length > 5){
					oRow = new sap.ui.commons.layout.MatrixLayoutRow();
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.ScrollContainer({
											   horizontal : false,
											   vertical : true,
											   width : "100%",
											   height : "450px",
											   content : [oMatrix2]
										   })],
								hAlign : "Begin",
								vAlign : "Middle",
								colSpan : oWidths.length
							});
					oRow.addCell(oCell);
					oMatrix.addRow(oRow);
				}
				
			} else {
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({
						   height : "35px",
						   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								   		content : [new sap.m.Text({text : oBundleText.getText("MSG_15018")})], // 데이터가 존재하지 않습니다.
								   		hAlign : "Center",
								   		vAlign : "Middle",
								   		colSpan : oWidths.length
								    }).addStyleClass("Data border_left0 border_right0")]
					   });
				
				oMatrix.addRow(oRow);
			}
			
			return oMatrix;
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "911105"});
		} : null
		
	});

});