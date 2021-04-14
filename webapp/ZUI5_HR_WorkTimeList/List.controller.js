jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/AttachFileAction",
    "../common/SearchOrg",
    "../common/SearchUser1",
    "../common/OrgOfIndividualHandler",
    "../common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_WorkTimeList.List", {

		PAGEID: "ZUI5_HR_WorkTimeListList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
		onInit: function () {
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Pernr : $.app.getModel("session").getData().Pernr,
						Orgeh : "",
						Ename : $.app.getModel("session").getData().Ename,
						Molga : $.app.getModel("session").getData().Molga,
						Langu : $.app.getModel("session").getData().Langu,
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
						Type : "1",
						Werks : $.app.getModel("session").getData().Persa
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_WorkTimeList.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
		
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // 대상기간을 입력하여 주십시오.
				return;
			} else if(!oData.Type){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60003")); // 조회구분을 선택하여 주십시오.
				return;
			}
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout5");
				oLayout.destroyContent();
				
			var vData = [];
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {};
				eval('createData.Worktime' + oData.Type + "Nav = [];");
				
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
					createData.IEmpid = oData.Pernr;
				
				oModel.create("/WorktimeListSet", createData, null,
					function(data, res){
						if(data){
							var data1 = eval("data.Worktime" + oData.Type + "Nav");
							
							if(data1 && data1.results){
								var field = [];
								switch(oData.Type){
									case "1":
										field = ["Wtm01", "Wtm02", "Wtm03", "Wtm04", "Wtm05", "Wtm06", "Wtm07", "Wtsum", "Wtsum2"];
										break;
									case "2":
										field = ["Wtm40", "Wtm12", "Wtsum"];
										break;
									case "3":
										field = ["Wtm40", "Wtm12", "Wtsum", "Wta40", "Wta12", "Wtavg"];
										break;
								}
								
								for(var i=0; i<data1.results.length; i++){
									for(var j=0; j<field.length; j++){
										eval("data1.results[i]." + field[j] + " = parseFloat(data1.results[i]." + field[j] + ") == 0 ? '' : parseFloat(data1.results[i]." + field[j] + ");");
									}
									
									vData.push(data1.results[i]);
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
					
				eval("oController.makeContent" + oData.Type + "(oController, oLayout, vData);");

				oController._BusyDialog.close();
				
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 근무시간현황 - 일별
		makeContent1 : function(oController, oLayout, oData){
			var height = parseInt(window.innerHeight - 200), count = parseInt((height - 35) / 38);
			var column_length = 0, flag = "";
			
			if(oData.length < count){
				column_length = oData.length;
			} else {
				column_length = count;
				flag = "X";
			}
			
			var oRow, oCell;
			
			// header
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
								// 사번, 성명, 부서명, 직급, 일자, 근무, 구분
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", "LABEL_60038", "LABEL_60039",
								// 월, 화, 수, 목, 금, 토, 일
								"LABEL_48057", "LABEL_48058", "LABEL_48059", "LABEL_48060", "LABEL_48061", "LABEL_48062", "LABEL_48056",
								// 구분계, 근무계
								"LABEL_60040", "LABEL_60041"];
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
			
			var oWidths = [], oWidths2 = [];
			for(var i=0; i<header_title.length; i++){
				if(i>6){
					oWidths.push("100px");
					oWidths2.push("100px");
				} else {
					oWidths.push("");
					oWidths2.push("");
				}
				
				var title = eval("oBundleText.getText('" + header_title[i] + "');");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [new sap.m.Label({text : title})],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
				
				oRow.addCell(oCell);
			}
			
			if(flag == "X"){
				oWidths.push("13px");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
			
				oRow.addCell(oCell);
			}
			
			oMatrix.setWidths(oWidths);
			oMatrix.addRow(oRow);
			
			// content
			if(oData.length == 0){
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00901")})], // No data found
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 }).addStyleClass("Data")]
					})
				);
			} else {
				var oSpan = [], detail = {};
				for(var i=0; i<oData.length; i++){
					if(i==0){
						detail = {Idx : i, Length : 1};
					} else {
						if(oData[i].Pernr == oData[i-1].Pernr){
							detail.Length = detail.Length + 1;
						} else {
							oSpan.push(detail);
							
							detail = {Idx : i, Length : 1};
						}
						
						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;
							oSpan.push(detail);
						}
					}
				}
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
								   columns : header_title.length,
								   width : "100%"
							   });
				oMatrix2.setWidths(oWidths2);
				
				var field = ["WtgbnTx", "Wtm01", "Wtm02", "Wtm03", "Wtm04", "Wtm05", "Wtm06", "Wtm07", "Wtsum", "Wtsum2"];
				var tmp = 0, tmp2 = 0, oRow = null, style = "";
				
				for(var i=0; i<oData.length; i++){
					for(var j=0; j<oSpan.length; j++){
						if(i == oSpan[j].Idx){
							tmp = oSpan[j].Length;
							oRow = new sap.ui.commons.layout.MatrixLayoutRow({
									   height : "38px",
									   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Pernr})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Ename})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Orgtx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].ZpGradeTx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2")]
								   });
							break;
						}
					}
					
					if(oRow == null){
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
					}
					
					style = oData[i].Wtgrp == "3" ? "Label3" : "Data2";
					
					// 일자
					if(i % 6 == 0){
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : oData[i].BeEn, textAlign : "Center"})],
								hAlign : "Center",
								vAlign : "Middle",
								rowSpan : 6
							}).addStyleClass("Data2")
						);
					}
					
					// 근무
					if(i == 0 || (i != 0 && (oData[i].Wtgrp != oData[i-1].Wtgrp))){
						var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Label({text : oData[i].WtgrpTx})],
										hAlign : "Center",
										vAlign : "Middle"
									}).addStyleClass(style);
									
						switch(oData[i].Wtgrp){
							case "1":
								oCell.setRowSpan(3);
								break;
							case "2":
								oCell.setRowSpan(2);
								break;
							case "3":
								oCell.setColSpan(2);
								break;
						}
						
						oRow.addCell(oCell);
					}
					
					// 구분 ~ 근무계
					for(var a=0; a<field.length; a++){
						if(oData[i].Wtgrp == "3" && a == 0) continue;
						
						var oText = eval("oData[i]." + field[a]);
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Label({text : oText})],
								hAlign : "Center",
								vAlign : "Middle"
							}).addStyleClass(style)
						);
					}
					
					oMatrix2.addRow(oRow);
					
					oRow = null;
				}
				
				var oScrollContainer = new sap.m.ScrollContainer({
					horizontal : false,
					vertical : true,
					height : height + "px",
					content : [oMatrix2]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oScrollContainer],
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 })]
					})
				);
			}
			
			oLayout.addContent(oMatrix);
		},
		
		// 근무시간현황 - 주별
		makeContent2 : function(oController, oLayout, oData){
			var height = parseInt(window.innerHeight - 200), count = parseInt((height - 35) / 38);
			var column_length = 0, flag = "";
			
			if(oData.length < count){
				column_length = oData.length;
			} else {
				column_length = count;
				flag = "X";
			}
			
			var oRow, oCell;
			
			// header
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
								// 사번, 성명, 부서명, 직급, 일자
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", 
								// 주40시간, 주12시간, 계
								"LABEL_60045", "LABEL_60046", "LABEL_60047"];
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
			
			var oWidths = [], oWidths2 = [];
			for(var i=0; i<header_title.length; i++){
				oWidths.push("");
				oWidths2.push("");
				
				var title = eval("oBundleText.getText('" + header_title[i] + "');");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [new sap.m.Label({text : title})],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
				
				oRow.addCell(oCell);
			}
			
			if(flag == "X"){
				oWidths.push("13px");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
			
				oRow.addCell(oCell);
			}
			
			oMatrix.setWidths(oWidths);
			oMatrix.addRow(oRow);
			
			// content
			if(oData.length == 0){
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00901")})], // No data found
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 }).addStyleClass("Data")]
					})
				);
			} else {
				var oSpan = [], detail = {};
				for(var i=0; i<oData.length; i++){
					if(i==0){
						detail = {Idx : i, Length : 1};
					} else {
						if(oData[i].Pernr == oData[i-1].Pernr){
							detail.Length = detail.Length + 1;
						} else {
							oSpan.push(detail);
							
							detail = {Idx : i, Length : 1};
						}
						
						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;
							oSpan.push(detail);
						}
					}
				}
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
								   columns : header_title.length,
								   width : "100%"
							   });
				oMatrix2.setWidths(oWidths2);
				
				var field = ["BeEn", "Wtm40", "Wtm12", "Wtsum"];
				var tmp = 0, tmp2 = 0, oRow = null, style = "";
				
				for(var i=0; i<oData.length; i++){
					for(var j=0; j<oSpan.length; j++){
						if(i == oSpan[j].Idx){
							tmp = oSpan[j].Length;
							oRow = new sap.ui.commons.layout.MatrixLayoutRow({
									   height : "38px",
									   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Pernr})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Ename})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Orgtx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].ZpGradeTx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2")]
								   });
							break;
						}
					}
					
					if(oRow == null){
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
					}
					
					// 일자 ~ 계
					for(var a=0; a<field.length; a++){
						if(oData[i].Wtgrp == "3" && a == 0) continue;
						
						var oText = eval("oData[i]." + field[a]);
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Label({text : oText})],
								hAlign : "Center",
								vAlign : "Middle"
							}).addStyleClass("Data2")
						);
					}
					
					oMatrix2.addRow(oRow);
					
					oRow = null;
				}
				
				var oScrollContainer = new sap.m.ScrollContainer({
					horizontal : false,
					vertical : true,
					height : height + "px",
					content : [oMatrix2]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oScrollContainer],
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 })]
					})
				);
			}
			
			oLayout.addContent(oMatrix);
		},
		
		// 근무시간현황 - 평균
		makeContent3 : function(oController, oLayout, oData){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table5", {
				selectionMode: "None",
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 1,
				showOverlay: false,
				showNoData: true,
				noData: oBundleText.getText("LABEL_00901"), // No data found
				rowHeight: 37,
				columnHeaderHeight: 38
			}).addStyleClass("mt-10px");
			
			oTable.setModel(oJSONModel);
			oJSONModel.setData({Data : oData});
			oTable.bindRows("/Data");
			
							// 사번, 성명, 부서명, 직급, 일자, 주
			var col_info = [{id: "Pernr", label: oBundleText.getText("LABEL_60012"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Ename", label: oBundleText.getText("LABEL_60013"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Orgtx", label: oBundleText.getText("LABEL_60033"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "ZpGradeTx", label: oBundleText.getText("LABEL_00124"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "BeEn", label: oBundleText.getText("LABEL_60009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%"},
							{id: "Wkcnt", label: oBundleText.getText("LABEL_60034"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// 합계(주40시간), 합계(주12시간), 총합계
							{id: "Wtm40", label: oBundleText.getText("LABEL_60035"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtm12", label: oBundleText.getText("LABEL_60036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtsum", label: oBundleText.getText("LABEL_60037"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// 합계(주40시간), 합계(주12시간), 평균
							{id: "Wta40", label: oBundleText.getText("LABEL_60035"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wta12", label: oBundleText.getText("LABEL_60036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtavg", label: oBundleText.getText("LABEL_60032"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
			
			common.makeTable.makeColumn(oController, oTable, col_info);
			
			oLayout.addContent(oTable);
			
			var height = parseInt(window.innerHeight - 130);
			var count = parseInt((height - 35) / 38);
			
			oTable.setVisibleRowCount(oData.length < count ? oData.length : count);
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
                oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
				oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
               
                if(o.Otype == "P"){
                	oController._ListCondJSonModel.setProperty("/Data/Pernr", o.Objid);
                } else if(o.Otype == "O"){
                	oController._ListCondJSonModel.setProperty("/Data/Orgeh", o.Objid);
                }
                
                oController._ListCondJSonModel.setProperty("/Data/Ename", o.Stext);
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		}, 
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});