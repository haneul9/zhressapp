jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"sap/ui/export/Spreadsheet"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler, Spreadsheet) {
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
			gDtfmt = this.getSessionInfoByKey("Dtfmt");		
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : oController.getSessionInfoByKey("Bukrs2"),
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Orgeh : "",
						Ename : oController.getSessionInfoByKey("Ename"),
						Molga : oController.getSessionInfoByKey("Molga"),
						Langu : oController.getSessionInfoByKey("Langu"),
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
						Type : "1",
						Werks : oController.getSessionInfoByKey("Persa"),
						Chief : oController.getSessionInfoByKey("Chief")
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
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
		
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // ??????????????? ???????????? ????????????.
				return;
			} else if(!oData.Type){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60003")); // ??????????????? ???????????? ????????????.
				return;
			}
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout5");
				oLayout.destroyContent();
				
			var vData = [];
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_DASHBOARD_SRV");
				var createData = {};
				eval('createData.Worktime' + oData.Type + "Nav = [];");
				
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
					createData.IEmpid = oData.Pernr;
				
				oModel.create("/WorktimeListSet", createData, {
					success: function(data, res){
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
					error: function (oError) {
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
				});
					
				eval("oController.makeContent" + oData.Type + "(oController, oLayout, vData);");

				oController._BusyDialog.close();
				
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// ?????????????????? - ??????
		makeContent1 : function(oController, oLayout, oData){
			oController._ListCondJSonModel.setProperty("/Export", oData);

			var height = parseInt(window.innerHeight - (oData.length == 0 ? 210 : 250)), count = parseInt((height - 35) / 38);
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
				rows : [/*new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})*/]
			});
								// ??????, ??????, ?????????, ??????, ??????, ??????, ??????
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", "LABEL_60038", "LABEL_60039",
								// ???, ???, ???, ???, ???, ???, ???
								"LABEL_48057", "LABEL_48058", "LABEL_48059", "LABEL_48060", "LABEL_48061", "LABEL_48062", "LABEL_48056",
								// ?????????, ?????????
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
				// Excel ???????????? ?????? ??????
				oLayout.addContent(
					new sap.m.Toolbar({
						height : "40px",
						content : [new sap.m.ToolbarSpacer(),
								   new sap.m.Button({
									   text : "{i18n>LABEL_00129}", // Excel
									   press : oController.onExport
								   }).addStyleClass("button-light")]
					}).addStyleClass("toolbarNoBottomLine")
				);

				var oPernr = [{Idx : 0, Length : 0, Field : "Pernr"}], 
				    oEname = [{Idx : 0, Length : 0, Field : "Ename"}], 
				    oOrgtx = [{Idx : 0, Length : 0, Field : "Orgtx"}], 
				    oZpGradeTx = [{Idx : 0, Length : 0, Field : "ZpGradeTx"}];
				var detail = {};
				var oHeaderField = ["Pernr","Ename","Orgtx","ZpGradeTx"];

				for(var i=0; i<oData.length; i++){
					if(i==0) continue;
					for(var j=0; j<oHeaderField.length; j++){
						var array = eval("o" + oHeaderField[j]);

						detail = array[array.length - 1];

						if(oData[i].Pernr != oData[i-1].Pernr){
							detail.Length = detail.Length + 1;

							detail = {Idx : i, Length : 0, Field : oHeaderField[j]};
							array.push(detail);
						} else if(oData[i][oHeaderField[j]] == oData[i-1][oHeaderField[j]]){
							detail.Length = detail.Length + 1;
						} else {
							detail.Length = detail.Length + 1;					

							detail = {Idx : i, Length : 0};
							array.push(detail);
						}

						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;

						   if(oData[i][oHeaderField[j]] != oData[i-1][oHeaderField[j]]){
								array.push(detail);
						   }							
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
					oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});

					for(var j=0; j<oHeaderField.length; j++){
                        var array = eval("o" + oHeaderField[j]);

                        for(var a=0; a<array.length; a++){
                        	if(i == array[a].Idx){
                        		oRow.addCell(
                                    new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Text({text : oData[i][oHeaderField[j]], textAlign : "Center"})],
										hAlign : "Center",
										vAlign : "Middle",
										rowSpan : array[a].Length
									}).addStyleClass("Data2")
                        		)
                        	}
                        }
					}
					
					style = oData[i].Wtgrp == "3" ? "Label3" : "Data2";
					
					// ??????
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
					
					// ??????
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
					
					// ?????? ~ ?????????
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
		
		// ?????????????????? - ??????
		makeContent2 : function(oController, oLayout, oData){
			oController._ListCondJSonModel.setProperty("/Export", oData);

			var height = parseInt(window.innerHeight - (oData.length == 0 ? 210 : 250)), count = parseInt((height - 35) / 38);
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
				rows : [/*new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})*/]
			});
								// ??????, ??????, ?????????, ??????, ??????
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", 
								// ???40??????, ???12??????, ???
								"LABEL_60045", "LABEL_60046", "LABEL_60047"];
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
			
			var oWidths = [], oWidths2 = [];
			for(var i=0; i<header_title.length; i++){
				oWidths.push("");
				oWidths2.push("");
				
				var title = eval("oController.getBundleText('" + header_title[i] + "');");
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
				// Excel ???????????? ?????? ??????
				oLayout.addContent(
					new sap.m.Toolbar({
						height : "40px",
						content : [new sap.m.ToolbarSpacer(),
								   new sap.m.Button({
									   text : "{i18n>LABEL_00129}", // Excel
									   press : oController.onExport
								   }).addStyleClass("button-light")]
					}).addStyleClass("toolbarNoBottomLine")
				);

				var oPernr = [{Idx : 0, Length : 0, Field : "Pernr"}], 
				    oEname = [{Idx : 0, Length : 0, Field : "Ename"}], 
				    oOrgtx = [{Idx : 0, Length : 0, Field : "Orgtx"}], 
				    oZpGradeTx = [{Idx : 0, Length : 0, Field : "ZpGradeTx"}];
				var detail = {};
				var oHeaderField = ["Pernr","Ename","Orgtx","ZpGradeTx"];

				for(var i=0; i<oData.length; i++){
					if(i==0) continue;
					for(var j=0; j<oHeaderField.length; j++){
						var array = eval("o" + oHeaderField[j]);

						detail = array[array.length - 1];

						if(oData[i].Pernr != oData[i-1].Pernr){
							detail.Length = detail.Length + 1;
							
							detail = {Idx : i, Length : 0, Field : oHeaderField[j]};
							array.push(detail);
						} else if(oData[i][oHeaderField[j]] == oData[i-1][oHeaderField[j]]){
							detail.Length = detail.Length + 1;
						} else {
							detail.Length = detail.Length + 1;					

							detail = {Idx : i, Length : 0};
							array.push(detail);
						}

						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;

						   if(oData[i][oHeaderField[j]] != oData[i-1][oHeaderField[j]]){
								array.push(detail);
						   }							
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
					oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});

					for(var j=0; j<oHeaderField.length; j++){
                        var array = eval("o" + oHeaderField[j]);

                        for(var a=0; a<array.length; a++){
                        	if(i == array[a].Idx){
                        		oRow.addCell(
                                    new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Text({text : oData[i][oHeaderField[j]], textAlign : "Center"})],
										hAlign : "Center",
										vAlign : "Middle",
										rowSpan : array[a].Length
									}).addStyleClass("Data2")
                        		)
                        	}
                        }
					}
					
					// ?????? ~ ???
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
		
		// ?????????????????? - ??????
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
			});
			
			oTable.setModel(oJSONModel);
			oJSONModel.setData({Data : oData});
			oTable.bindRows("/Data");
			
							// ??????, ??????, ?????????, ??????, ??????, ???
			var col_info = [{id: "Pernr", label: "{i18n>LABEL_60012}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Ename", label: "{i18n>LABEL_60013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Orgtx", label: "{i18n>LABEL_60033}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "ZpGradeTx", label: "{i18n>LABEL_00124}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "BeEn", label: "{i18n>LABEL_60009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%"},
							{id: "Wkcnt", label: "{i18n>LABEL_60034}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// ??????(???40??????), ??????(???12??????), ?????????
							{id: "Wtm40", label: "{i18n>LABEL_60035}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtm12", label: "{i18n>LABEL_60036}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtsum", label: "{i18n>LABEL_60037}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// ??????(???40??????), ??????(???12??????), ??????
							{id: "Wta40", label: "{i18n>LABEL_60035}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wta12", label: "{i18n>LABEL_60036}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtavg", label: "{i18n>LABEL_60032}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
			
			common.makeTable.makeColumn(oController, oTable, col_info);
			
			if(oData.length != 0){
				// Excel ???????????? ?????? ??????
				oLayout.addContent(
					new sap.m.Toolbar({
						height : "40px",
						content : [new sap.m.ToolbarSpacer(),
								   new sap.m.Button({
									   text : "{i18n>LABEL_00129}", // Excel
									   press : oController.onExport
								   }).addStyleClass("button-light")]
					}).addStyleClass("toolbarNoBottomLine")
				);
			}

			oLayout.addContent(oTable);
			
			var height = parseInt(window.innerHeight - (oData.length == 0 ? 140 : 180));
			var count = parseInt((height - 35) / 38);
			
			oTable.setVisibleRowCount(oData.length < count ? oData.length : count);
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: ($.app.APP_AUTH == "M" ? $.app.APP_AUTH : "")
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
        
		/**
         * @brief ??????-???????????? > ???????????? ?????? ?????? event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			var oController = $.app.getController();

			SearchOrg.oController = oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				$.app.getView().addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

		onESSelectPerson : function(data){
			var oController = $.app.getController();

			oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
			oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		}, 

		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkTimeList.List");
			var oController = oView.getController();

			var oType = oController._ListCondJSonModel.getProperty("/Data/Type");

			var header = [], oColumn = [], title = "", oData = null;

			if(oType == "1"){ // ??????								
				header = [{Text : "LABEL_60012", Field : "Pernr"}, {Text : "LABEL_60013", Field : "Ename"}, // ??????, ??????								
						  {Text : "LABEL_60033", Field : "Orgtx"}, {Text : "LABEL_00124", Field : "ZpGradeTx"}, // ?????????, ??????
						  {Text : "LABEL_60009", Field : "BeEn"},  {Text : "LABEL_60038", Field : "WtgrpTx"}, {Text : "LABEL_60039", Field : "WtgbnTx"},// ??????, ??????, ??????
						   // ???, ???, ???, ???, ???, ???, ???
						   {Text : "LABEL_48057", Field : "Wtm01"}, {Text : "LABEL_48058", Field : "Wtm02"}, {Text : "LABEL_48059", Field : "Wtm03"},
						   {Text : "LABEL_48060", Field : "Wtm04"}, {Text : "LABEL_48061", Field : "Wtm05"}, {Text : "LABEL_48062", Field : "Wtm06"}, 
						   {Text : "LABEL_48056", Field : "Wtm07"},
						   // ?????????, ?????????
						   {Text : "LABEL_60040", Field : "Wtsum"}, {Text : "LABEL_60041", Field : "Wtsum2"}];
				title = oController.getBundleText("LABEL_60030");
				oData = oController._ListCondJSonModel.getProperty("/Export");
			} else if(oType == "2"){ // ??????
				header = [{Text : "LABEL_60012", Field : "Pernr"}, {Text : "LABEL_60013", Field : "Ename"}, // ??????, ??????								
						  {Text : "LABEL_60033", Field : "Orgtx"}, {Text : "LABEL_00124", Field : "ZpGradeTx"}, // ?????????, ??????
						  {Text : "LABEL_60009", Field : "BeEn"},  // ??????
						  {Text : "LABEL_60045", Field : "Wtm40"}, {Text : "LABEL_60046", Field : "Wtm12"}, {Text : "LABEL_60047", Field : "Wtsum"}]; // ???40??????, ???12??????, ???
				title = oController.getBundleText("LABEL_60031");
				oData = oController._ListCondJSonModel.getProperty("/Export");
			} else if(oType == "3"){ // ??????
				header = [{Text : "LABEL_60012", Field : "Pernr"}, {Text : "LABEL_60013", Field : "Ename"}, // ??????, ??????								
						  {Text : "LABEL_60033", Field : "Orgtx"}, {Text : "LABEL_00124", Field : "ZpGradeTx"}, // ?????????, ??????
						  {Text : "LABEL_60009", Field : "BeEn"},  {Text : "LABEL_60034", Field : "Wkcnt"}, // ??????, ???
						  {Text : "LABEL_60035", Field : "Wtm40"},  {Text : "LABEL_60036", Field : "Wtm12"}, {Text : "LABEL_60037", Field : "Wtsum"}, 
						  // ??????(???40??????), ??????(???12??????), ?????????
						  {Text : "LABEL_60035", Field : "Wta40"},  {Text : "LABEL_60036", Field : "Wta12"}, {Text : "LABEL_60032", Field : "Wtavg"}]; 
						  // ??????(???40??????), ??????(???12??????), ??????
				title = oController.getBundleText("LABEL_60032");
				oData = sap.ui.getCore().byId(oController.PAGEID + "_Table5").getModel().getProperty("/Data")
			}

			if(header.length == 0 || oData == null) return;

			for(var i=0; i<header.length; i++){
				var detail = {};
					detail.label = oController.getBundleText(header[i].Text);
					detail.property = header[i].Field;
					detail.type = "string";
					detail.width = 25;
				
				oColumn.push(detail);
			}

			var oSettings = {
				workbook: { columns: oColumn },
				dataSource: oData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: (oController.getBundleText("LABEL_60006") + "-" + title) + ".xlsx" // ???????????? ??????
			};
	
			new Spreadsheet(oSettings).build();
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});