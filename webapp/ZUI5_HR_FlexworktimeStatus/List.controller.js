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
    "common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_FlexworktimeStatus.List", {

		PAGEID: "ZUI5_HR_FlexworktimeStatusList",
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
						Werks : oController.getSessionInfoByKey("Persa"),
						Bukrs : oController.getSessionInfoByKey("Bukrs3"),
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Ename : oController.getSessionInfoByKey("Ename"),                                                                                                           
						Langu : oController.getSessionInfoByKey("Langu"),
						Zyymm : today.getFullYear() + (today.getMonth() + 1 < 10 ? ("0" + (today.getMonth()+1)) : (today.getMonth()+1))
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.List",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var key = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			
			var vData = {Data : []}, vData2 = [], vData5 = [];
			
			if(key == "1"){
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel = oTable.getModel();
				
				var column = oTable.getColumns();
				for(var i=0; i<column.length; i++){
					column[i].setSorted(false);
					column[i].setFiltered(false);
				}
			} else {
				var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Calendar");
					oLayout.destroyContent();
			}
			
			var search = function(){
				var field = ["Ctrnm", "Wrktm", "Exttm", "Holtm", "Extholtm", "Tottm", "Notes", "Tottm2", "Notes2"];
				for(var i=0; i<field.length; i++){
					eval("oController._ListCondJSonModel.setProperty('/Data/" + field[i] + "', '');");
				}
				
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
				var today = new Date();
				
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : [], FlexWorktime5Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = oData.Zyymm;
					createData.Langu = oData.Langu;
					createData.Prcty = "1";

				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							for(var i=0; i<field.length; i++){
								eval("oController._ListCondJSonModel.setProperty('/Data/" + field[i] + "', data." + field[i] + ");");
							}
							
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results){
								var data1 = data.FlexWorktime1Nav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									data1[i].Checkbox = false;
									
									data1[i].Datum = data1[i].Datum ? new Date(common.Common.setTime(data1[i].Datum)) : null;
									
									data1[i].Adbtm = data1[i].Adbtm == "" || data1[i].Adbtm == "0000" ? "" : data1[i].Adbtm.substring(0,2) + ":" + data1[i].Adbtm.substring(2,4);
									
									if(data1[i].Offyn == ""){
										// ????????? ????????? ????????? ?????? OFFYN??? ???????????? ????????? ????????? ??????????????? ????????????.
										if((dateFormat.format(data1[i].Datum) * 1) < (dateFormat.format(today) * 1)){
											data1[i].Offyn = "1";
										} else if((dateFormat.format(data1[i].Datum) * 1) == (dateFormat.format(today) * 1)){
											data1[i].Offyn = "2"; // ???????????? ?????? ??????????????? ?????? ?????????
										}
									}
									
									// ???????????? ???????????? true ??? ?????? ?????? ?????? ????????????
									if(data1[i].Alldf == true){
										data1[i].Offyn = "1";
										// data1[i].Lnctm = "0"; // ???????????? ????????? 0 ?????? ?????? 2021-05-03 ?????? ????????????
									}
									
									vData.Data.push(data1[i]);
								}
							}
							
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									vData2.push(data2[i]);
								}
							}
							
							if(data.FlexWorktime5Nav && data.FlexWorktime5Nav.results){
								var data5 = data.FlexWorktime5Nav.results;
								
								for(var i=0; i<data5.length; i++){
									data5[i].Datum = data5[i].Datum ? new Date(common.Common.setTime(data5[i].Datum)) : null;
									
									vData5.push(data5[i]);
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
				
				if(key == "1"){
					oJSONModel.setData(vData);
					oTable.bindRows("/Data");
					
					var row = parseInt((window.innerHeight - 430) / 37);
					oTable.setVisibleRowCount(vData.Data.length < row ? vData.Data.length : row);
				} else {
					oController.addCalendar(oController, oLayout, vData.Data);
				}
				
				// ??????????????????
				oController._ListCondJSonModel.setProperty("/Data2", vData2);
				// ??????????????????????????????
				oController._ListCondJSonModel.setProperty("/Data5", vData5);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			};
			
			// ????????? ??? ?????? ????????? ?????? ???????????? ??????, confirm message ?????? ?????? ????????????
			var oMonyn = "";
			if(key == "1"){
				var tabledata = oJSONModel.getProperty("/Data");
				if(tabledata){
					for(var i=0; i<tabledata.length; i++){
						if(tabledata[i].Monyn != ""){
							oMonyn = tabledata[i].Monyn;
						}
					}
				}
			}
			
			if(!oEvent || oMonyn == ""){
				oController._BusyDialog.open();
				setTimeout(search, 100);
			} else {
				sap.m.MessageBox.confirm(oController.getBundleText("MSG_69008"), { // ???????????? ?????? ??????????????? ???????????????. ????????? ?????????????????????????
					actions : ["YES", "NO"],
					onClose : function(fVal){
						if(fVal && fVal == "YES"){
							oController._BusyDialog.open();
							setTimeout(search, 100);
						}
					}
				});
			}
		},
		
		addCalendar : function(oController, oLayout, oData){
			oLayout.addContent(sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.MainCalendar", oController));
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
			var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM/dd"});
			
			var makeData = function(time, time2, flag, style){
				time = time.replace(":", "");
				time = (time && time != "") ? time.substring(0,2) + ":" + time.substring(2,4) : "";
				
				if(time2){
					time = time == "" ? "" : (time + flag);
					time = time + (time2 == "" ? "" : (time2.substring(0,2) + ":" + time2.substring(2,4)));
				}
				
				style = style ? style : (time == "" ? "" : "cursor-pointer");
						
				return new sap.ui.commons.layout.MatrixLayoutRow({
						   height : "20px",
						   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Text({
													   text : time,
													   width : "100%",
													   textAlign : "Center"
												   }).addStyleClass(style)],
										hAlign : "Center",
										vAlign : "Middle"
									})]
					   });
			};
			
			for(var i=0; i<oData.length; i++){
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + dateFormat.format(oData[i].Datum));
				
				if(oControl){
					var title = new sap.m.Text({text : dateFormat2.format(oData[i].Datum)}).addStyleClass("font-bold");
					if(oData[i].Offyn == "X"){
						title.addStyleClass("color-red");
					}
					
					var titleStyle = "";
					switch(oData[i].Status){
						case "99": // ??????
							titleStyle = "calendar-background-blue";
							break;
						case "88": // ??????
							titleStyle = "calendar-background-orange";
							break;
						case "00": // ?????????
							titleStyle = "calendar-background-green";
							break;
						case "CC": // ????????????
							titleStyle = "bg-yellow";
							break;
						default:
							titleStyle = "calendar-datum";
					}
					
					var oMatrix = new sap.ui.commons.layout.MatrixLayout({
						  columns : 1,
						  width : "100%",
						  rows : [new sap.ui.commons.layout.MatrixLayoutRow({
								  	  height : "20px",
								  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										  	  	   content : [title],
										  	  	   hAlign : "Center",
										  	  	   vAlign : "Middle"
										  	   }).addStyleClass(titleStyle)] 
								  })]
					});
					
					// ???/??????
					oMatrix.addRow(makeData(oData[i].Beguz, oData[i].Enduz, " ~ "));
					// ????????????
					oMatrix.addRow(makeData(oData[i].Brktot));
					// ????????????
					oMatrix.addRow(makeData(oData[i].Wrktm, "", "", (oData[i].Wrktm == "" ? "" : "calendar-background-lightblue cursor-pointer")));
					// ??????/??????
					oMatrix.addRow(makeData(oData[i].Exttm, oData[i].Holtm, "/"));
					// ??????
					oMatrix.addRow(
						new sap.ui.commons.layout.MatrixLayoutRow({
							height : "20px",
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										 content : [new sap.m.Text({
													 	text : oData[i].Atext,
													 	width : "100%",
													 	textAlign : "Center"
													}).addStyleClass((oData[i].Atext == "" ? "" : "calendar-background-atext FontWhite cursor-pointer"))],
										 hAlign : "Center",
										 vAlign : "Middle"
								 	 })]
						})
					);
					
					oControl.addContent(oMatrix);
					
					if(oData[i].Offyn != "X"){
						oControl.addStyleClass("cursor-pointer");
					}
					
					oControl.attachBrowserEvent("click", oController.onSelectDate);
					
					var oJSONModel = new sap.ui.model.json.JSONModel();
						oJSONModel.setData({Data : oData[i]});
					oControl.setModel(oJSONModel);
				}
			}
		},
		
		onChangeSchedule : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(oData.Alldf == true || oData.Offyn == "X") return;
			
			if(!oController._WorkScheduleDialog){
				oController._WorkScheduleDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.WorkSchedule", oController);
				oView.addDependent(oController._WorkScheduleDialog);
			}
			
			var oJSONModel = oController._WorkScheduleDialog.getModel();
			
			oController.setBreak(oData, "2");
			
			// ????????? ???????????? ?????? ?????? ???????????? ???????????? ???????????? ?????????
			if(oData.Status == "00"){
				oJSONModel.setProperty("/Data/0", $.extend(true, {}, oData, {Adbtm : oJSONModel.getProperty("/Data/0/Adbtm"), Beguz : oData.Beguz2, Enduz : oData.Enduz2, Lnctm : oData.Lnctm2}));
			} else {
				oJSONModel.setProperty("/Data/0", $.extend(true, {}, oData, {Adbtm : oJSONModel.getProperty("/Data/0/Adbtm")}));
			}

			// 2021-05-17 ???????????? ??????????????? ?????? ???????????? ????????? ??? ????????? ?????????
			oController.setAppName(oController); 
			
			// oController._WorkScheduleDialog.open();
		},
		
		onSelectDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			if(oController._ListCondJSonModel.getProperty("/Data/Tottm2") == "") return;
			
			var oControl = sap.ui.getCore().byId(oEvent.currentTarget.id);
			if(oControl == undefined) return;
			
			var oJSONModel = oControl.getModel();
			var oData = oJSONModel.getProperty("/Data");
			
			if(oData.Alldf == true || oData.Offyn == "X") return;
			
			if(!oController._WorkScheduleDialog){
				oController._WorkScheduleDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.WorkSchedule", oController);
				oView.addDependent(oController._WorkScheduleDialog);
			}
			
			var oJSONModel = oController._WorkScheduleDialog.getModel();
			
			oController.setBreak(oData, "2");
			
			oJSONModel.setProperty("/Data/0", $.extend(true, {}, oData, {Title : oController.getBundleText("LABEL_69048"), Adbtm : oJSONModel.getProperty("/Data/0/Adbtm")})); // ?????? ??????

			// 2021-05-17 ???????????? ??????????????? ?????? ???????????? ????????? ??? ????????? ?????????
			oController.setAppName(oController);
			
			// oController._WorkScheduleDialog.open();
		},

		// ????????? ????????? ??????
		setAppName : function(oController){
			var oData = oController._WorkScheduleDialog.getModel().getProperty("/Data/0");
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_AppNameLayout");
			var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
				oAppName.destroyItems();
				oAppName.setValue("");

			if(oData.Offyn == "1"){
				oLayout.removeStyleClass("displayNone");

				oController._BusyDialog.open();
				setTimeout(function(){
					var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
					var createData = {ApprlistNav : []};
						createData.IPernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
						createData.IBukrs = oController._ListCondJSonModel.getProperty("/Data/Bukrs");
						createData.IExtryn = "X"; // ????????????????????? ?????? ???/?????? ???????????? ????????? ??????
						createData.IMobyn = "";
						createData.IZappSeq = "99";
						createData.IAppkey = (oData.Appkey1 ? oData.Appkey1 : "");
					
					if(oData.Status == "00"){
						createData.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Datum)) + ")\/";
						createData.IPrcty = "2";
					} else {
						createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
						createData.IPrcty = "1";
					}

					oModel.create("/ApprListSet", createData, {
						success: function(data, res){
							if(data){
								if(data.ApprlistNav && data.ApprlistNav.results){
									var data1 = data.ApprlistNav.results;
									
									if(data1){
										for(var i=0; i<data1.length; i++){
											oAppName.addItem(new sap.ui.core.Item({key : data1[i].AppName, text : data1[i].AppText}));

											if(data1[i].Defyn == "X"){
												oController._WorkScheduleDialog.getModel().setProperty("/Data/0/AppName", data1[i].AppName);
											}
										}
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
		
					if(oController.Error == "E"){
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage);
					}

					oController._BusyDialog.close();
		
					// ???????????? ???????????? ????????? ????????? row??? invisible ????????????.
					if(oAppName.getItems().length == 0){
						oController._WorkScheduleDialog.getModel().setProperty("/Data/0/AppName", "");
						// oLayout.addStyleClass("displayNone");
					} 

					oController._WorkScheduleDialog.open();
				}, 100);

			} else {
				oLayout.addStyleClass("displayNone");
				oController._WorkScheduleDialog.open();
			}
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
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
		
		onChangeTime : function(oEvent, m){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			} else if(oEvent && m && oEvent.getParameters().value){
				if(parseInt(oEvent.getParameters().value.substring(2,4)) % m != 0){
					sap.m.MessageBox.error(oController.getBundleText("MSG_69009").replace("MM", m)); // ????????? MM??? ????????? ???????????? ????????????.
					oEvent.getSource().setValue("");
					return;
				}
			}
			
			// ???????????? ?????????
			oController.onSetLnctm(oEvent);
			
			if(oController._WorkScheduleDialog && oController._WorkScheduleDialog.isOpen() == true){
				
			} else if(oController._WorktimeDialog && oController._WorktimeDialog.isOpen() == true){
				
			} else {
				oController.onChangeModyn(oEvent);
			}
		},
		
		// ???????????? ?????????
		onSetLnctm : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = null;
			
            if(oController._WorkScheduleDialog && oController._WorkScheduleDialog.isOpen() == true){
                oData = oController._WorkScheduleDialog.getModel().getProperty("/Data/0");
            } else if(oController._WorktimeDialog && oController._WorktimeDialog.isOpen() == true){
            	oData = oController._WorktimeDialog.getModel().getProperty("/Data");
            } else {
            	oData = oEvent.getSource().getCustomData()[0].getValue();
            }
			
			if(oData.Beguz && oData.Enduz){
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : []};
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Langu = oController._ListCondJSonModel.getProperty("/Data/Langu");
					createData.Prcty = "4";
					
				var detail = {};
					detail.Datum = "\/Date(" + common.Common.getTime(oData.Datum) + ")\/";
					detail.Beguz = oData.Beguz;
					detail.Enduz = oData.Enduz;
					detail.Lnctm = oData.Lnctm;
				
				createData.FlexWorktime1Nav.push(detail);	
				
				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results && data.FlexWorktime1Nav.results.length){
								var data1 = data.FlexWorktime1Nav.results[0];
								
								if(oController._WorkScheduleDialog && oController._WorkScheduleDialog.isOpen() == true){
									oController._WorkScheduleDialog.getModel().setProperty("/Data/0/Lnctm", data1.Lnctm);
								} else if(oController._WorktimeDialog && oController._WorktimeDialog.isOpen() == true){
									oController._WorktimeDialog.getModel().setProperty("/Data/Lnctm", data1.Lnctm);
								} else {
									var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
										oJSONModel.setProperty("/Data/" + oData.Idx + "/Lnctm", data1.Lnctm);
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
					return;
				}
				
			}
		},
		
		onTableSelectAll : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
			
			for(var i=0; i<oData.length; i++){
				if(oData[i].Offyn == "" || oData[i].Offyn == "2"){
					oJSONModel.setProperty("/Data/" + i + "/Checkbox", oEvent.getParameters().selected);
				}
			}
		},
		
		onSelectCheckbox : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var select = oEvent.getParameters().selected;
			var oAll = sap.ui.getCore().byId(oController.PAGEID + "_CheckBoxAll");
			
			if(select == false){
				oAll.setSelected(false);
			} else {
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel = oTable.getModel();
				var oData = oJSONModel.getProperty("/Data");
				
				var check = "";
				for(var i=0; i<oData.length; i++){
					if((oData[i].Offyn == "" || oData[i].Offyn == "2") && oData[i].Checkbox == true){
						check = "X";
					} else if((oData[i].Offyn == "" || oData[i].Offyn == "2") && oData[i].Checkbox == false){
						check = "";
						oAll.setSelected(false);
						break;
					}
				}
				
				if(check == "X"){
					oAll.setSelected(true);
				}
			}
		},
		
		onChangeModyn : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			oJSONModel.setProperty("/Data/" + oData.Idx + "/Monyn", (oData.Modyn == "1" ? "1" : (oData.Monyn == "2" ? "3" : "1")));
		},
		
		// ?????????????????? ????????? ?????? : ???????????????, table???
		setBreak : function(oData, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData2 = null, vData = [];
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			
			if(oData.Status == "00"){
				oData2 = oController._ListCondJSonModel.getProperty("/Data5");
			} else {
				oData2 = oController._ListCondJSonModel.getProperty("/Data2");
			}
			
			for(var i=0; i<oData2.length; i++){
				if(dateFormat.format(oData2[i].Datum) == dateFormat.format(oData.Datum)){
					vData.push(oData2[i]);
				}
			}
			
			vData.sort(function(a,b){
				var item1 = a.Austy, item2 = b.Austy;
				
				if(item1 > item2){
					return 1;
				} else if(item1 < item2){
					return -1;
				} else {
					return 0;
				}
			});
			
			var tableData = {Data : []}, data = {Data : []};
			
			if(vData.length == 0){
				for(var i=0; i<5; i++){
					tableData.Data.push({Idx : tableData.Data.length, Datum : oData.Datum, Beguz : "", Enduz : "", Offyn : oData.Offyn});
				}
				
				data.Data.push({Datum : oData.Datum, Austy : "A", Offyn : oData.Offyn});
			} else {
				for(var i=0; i<vData.length; i++){
					if(vData[i].Austy == "A"){
						if(tableData.Data.length < 5){
							var length = 5 - tableData.Data.length;
							for(var j=0; j<length; j++){
								tableData.Data.push({Idx : tableData.Data.length, Datum : oData.Datum, Beguz : "", Enduz : "", Offyn : oData.Offyn});
							}
						}
						
						data.Data.push($.extend(true, {Offyn : oData.Offyn}, vData[i]));
						break;
					}
					
					tableData.Data.push($.extend({Offyn : oData.Offyn}, vData[i], {Idx : tableData.Data.length}));
				}
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable" + (Flag == "1" ? "" : Flag));
			var oJSONModel = oTable.getModel();
				oJSONModel.setData(tableData);
			
			oTable.setVisibleRowCount(tableData.Data.length);
			oTable.bindRows("/Data");
			
			if(Flag == "1"){
				oController._AddBreakDialog.getModel().setData(data);
			} else {
				data.Data[0].Offyn = oData.Offyn;
				
				oController._WorkScheduleDialog.getModel().setData(data);
			}
		},
		
		// ??????????????????
		openAddBreak : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(!oController._AddBreakDialog){
				oController._AddBreakDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.AddBreak", oController);
				oView.addDependent(oController._AddBreakDialog);
			}
			
			oController.setBreak(oData, "1");
		
			oController._AddBreakDialog.open();
		},
		
		// ?????????????????? - ????????????
		onChangeTime2 : function(oEvent, oTable){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			} else if(oEvent && oEvent.getParameters().value != ""){
				if(parseInt(oEvent.getParameters().value.substring(2,4)) % 10 != 0){
					sap.m.MessageBox.error(oController.getBundleText("MSG_69009").replace("MM", "10")); // ????????? MM??? ????????? ???????????? ????????????.
					oEvent.getSource().setValue("");
					return;
				}
			}
			
			var calTime = function(){
				var oJSONModel = oTable.getModel();
				var oData2 = oJSONModel.getProperty("/Data");
				
				var createData = {FlexWorktime2Nav : []};
					createData.Langu = oController._ListCondJSonModel.getProperty("/Data/Langu");
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Prcty = "3";
				
				for(var i=0; i<oData2.length; i++){
					var detail = {};
						detail.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
						detail.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
						detail.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Notes = oData2[i].Notes;
					
					createData.FlexWorktime2Nav.push(detail);
				}
				
				var vData = {Data : []}, vData2 = {Data : []};
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				
				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Idx = i;
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									data2[i].Offyn = oData2[0].Offyn;
									
									if(data2[i].Austy == "A"){
										vData2.Data.push(data2[i]);
									} else {
										vData.Data.push(data2[i]);
									}
								}
								
								if(vData2.Data.length == 0){
									vData2.Data.push({Austy : "A", Datum : data2[0].Datum});
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
				
				oJSONModel.setData(vData);
				oTable.bindElement("/Data");
				
				if(oTable.sId == oController.PAGEID + "_AddBreakTable"){
					oController._AddBreakDialog.getModel().setData(vData2);
				} else if(oTable.sId == oController.PAGEID + "_AddBreakTable2"){
					var oMonyn = oController._WorkScheduleDialog.getModel().getProperty("/Data/0/Monyn");
						oMonyn = (!oMonyn || oMonyn == "") ? "2" : (oMonyn == "1" ? "3" : "2");
					
					vData2.Data[0] = $.extend({}, oController._WorkScheduleDialog.getModel().getProperty("/Data/0"), {Adbtm : vData2.Data[0].Adbtm, Monyn : oMonyn});
					
					oController._WorkScheduleDialog.getModel().setData(vData2);
				} 
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
			
			if(oEvent){
				var oData = oEvent.getSource().getCustomData()[0].getValue();
				
				if(oData.Beguz && oData.Enduz){
					calTime();
				}
			} else {
				calTime();
			}
		},
		
		// ???????????? ??????
		onSaveBreak : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var onProcess = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
				var oData = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable").getModel().getProperty("/Data");
				
				// validation check
				var save = [];
				for(var i=0; i<oData.length; i++){
					if(oData[i].Beguz != "" && oData[i].Enduz != ""){
						if(oData[i].Beguz > oData[i].Enduz){
							sap.m.MessageBox.error(oController.getBundleText("MSG_69002")); // ??????????????? ???????????? ????????? ?????? ????????? ???????????????.
							return;
						}
						
						save.push(oData[i]);
					}
				}
				
				save.push(oController._AddBreakDialog.getModel().getProperty("/Data/0"));
				
				// ?????????????????? ??????????????? ????????? ????????? ????????? ????????? ????????? ??????
				var breakData = oController._ListCondJSonModel.getProperty("/Data2"), newData = [];
				for(var i=0; i<breakData.length; i++){
					if(dateFormat.format(breakData[i].Datum) == dateFormat.format(save[0].Datum)){
						continue;
					} else {
						newData.push(breakData[i]);
					}
				}
				
				for(var i=0; i<save.length; i++){
					newData.push(save[i]);
				}
				
				oController._ListCondJSonModel.setProperty("/Data2", newData);
				
				// ???????????? ????????? ????????? ???????????? ?????????, ???????????? ??? ??????
				var list = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var listmodel = list.getModel(), listdata = listmodel.getProperty("/Data");
				
				for(var i=0; i<listdata.length; i++){
					if(dateFormat.format(listdata[i].Datum) == dateFormat.format(save[0].Datum)){
						var adbtm = save[save.length-1].Adbtm;
						
						listmodel.setProperty("/Data/" + listdata[i].Idx + "/Monyn", (listdata[i].Monyn == "" ? "2" : (listdata[i].Monyn == "1" ? "3" : "2")));
						listmodel.setProperty("/Data/" + listdata[i].Idx + "/Adbtm", adbtm ? (adbtm.substring(0,2) + ":" + adbtm.substring(2,4)) : "");
						break;
					}
				}
				
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oController.getBundleText("MSG_69010"), { // ????????? ?????? ????????? ??????????????? ????????????. ???????????? ????????? ???????????? ????????????.
					title : oController.getBundleText("LABEL_00149"), // ??????
					onClose : function(){
						oController._AddBreakDialog.close();
					}
				});
			};
			
			// sap.m.MessageBox.confirm(oController.getBundleText("MSG_00058"), { // ?????????????????????????
			// 	actions : ["YES", "NO"],
			// 	onClose : function(fVal){
			// 		if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
			// 		}
			// 	}
			// });
		},
		
		// ???????????? ??????
		onDeleteBreak : function(oEvent, oTable){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();	
			
			// var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable");
			var oJSONModel = oTable.getModel();
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var onProcess = function(){
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Beguz", "");
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Enduz", "");
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Adbtm", "");
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Notes", "");
				
				// ???????????? ?????????
				oController.onChangeTime2(null, oTable);
				
				if(oTable.sId == oController.PAGEID + "_AddBreakTable2"){
					var oMonyn = oController._WorkScheduleDialog.getModel().getProperty("/Data/0/Monyn");
						oMonyn = (!oMonyn || oMonyn == "") ? "2" : (oMonyn == "1" ? "3" : "2");
						
					oController._WorkScheduleDialog.getModel().setProperty("/Data/0/Monyn", oMonyn);	
				}
				
				oController._BusyDialog.close();
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_00059"), { // ?????????????????????????
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		// ???????????? ????????????
		onOpenWorktime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oData = oTable.getModel().getProperty("/Data");
			var oIndices = [];
			
			for(var i=0; i<oData.length; i++){
				if(oData[i].Checkbox == true){
					oIndices.push(oData[i].Idx);
				}
			}
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_69004")); // ??????????????? ???????????? ???????????? ????????????.
				return;
			}
			
			if(!oController._WorktimeDialog){
				oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Worktime", oController);
				oView.addDependent(oController._WorktimeDialog);
			}
			
			var vData = {Indices : oIndices, Data : {Beguz : "", Enduz : "", Lnctm : ""}};
			
			oController._WorktimeDialog.getModel().setData(vData);
			oController._WorktimeDialog.open();
		},
		
		// ???????????? ???????????? ??????
		onSaveWorktime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._WorktimeDialog.getModel().getProperty("/Data");
			
			var oIndices = oController._WorktimeDialog.getModel().getProperty("/Indices");
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			
			// validation check
			if(oData.Beguz == "" || oData.Enduz == "" || oData.Lnctm == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_69005")); // ??????????????? ???????????? ?????? ???????????? ????????????.
				return;
			} else if((oData.Beguz != "" && oData.Enduz != "") && (oData.Beguz > oData.Enduz)){
				sap.m.MessageBox.error(oController.getBundleText("MSG_69002")); // ??????????????? ???????????? ????????? ?????? ????????? ???????????????.
				return;
			}
			
			for(var i=0; i<oIndices.length; i++){
				var data = oJSONModel.getProperty("/Data/" + oIndices[i]);
				
				if(dateFormat.format(data.Datum) == dateFormat.format(new Date())){
					if(data.Beguz != oData.Beguz){
						sap.m.MessageBox.error(oController.getBundleText("MSG_69006")); // ????????? ???????????? ???????????? ????????? ???????????????.
						return;
					}
				}
			}
			
			var onProcess = function(){
				for(var i=0; i<oIndices.length; i++){
					var tmp = oJSONModel.getProperty("/Data/" + oIndices[i]);
					
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Beguz", oData.Beguz);
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Enduz", oData.Enduz);
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Lnctm", (oData.Lnctm == "" ? "0" : oData.Lnctm));
					
					// ???????????? ??????
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Monyn", (tmp.Monyn == "" ? "1" : (tmp.Monyn == "2" ? "3" : "1")));
					
					// ???????????? ?????????
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Checkbox", false);
				}
				
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oController.getBundleText("MSG_00017"), { // ?????????????????????.
					onClose : function(){
						oController._WorktimeDialog.close();
					}
				});
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_00058"), { // ?????????????????????????
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		// ???????????? ????????????/?????? ?????? ??? ??????
		onSaveWorkSchedule : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._WorkScheduleDialog.getModel().getProperty("/Data/0");

			// ????????? ???????????? ???????????? ?????? ????????? ?????? ??????
			var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// if(oAppName.getItems().length != 0){
				if(!oData.AppName && oData.Offyn == "1"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // ???????????? ???????????? ????????????.
					return;
				}
			// }
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : [], FlexWorktime5Nav : []};
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Prcty = oData.Offyn == "1" ? "5" : "2";
					
				var detail = {};
					detail.Datum = "\/Date(" + common.Common.adjustGMT(oData.Datum) + ")\/";
					detail.Beguz = oData.Beguz;
					detail.Enduz = oData.Enduz;
					detail.Lnctm = oData.Lnctm;
					detail.Adbtm = oData.Adbtm ? oData.Adbtm.replace(":", "") : "";
					detail.Monyn = oData.Offyn == "1" ? "5" : oData.Monyn;
					detail.Chgrsn = oData.Chgrsn;
					detail.Appkey1 = oData.Appkey1;
					detail.AppName = oData.AppName ? oData.AppName : "";
				
				createData.FlexWorktime1Nav.push(detail);
				
				var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable2").getModel().getProperty("/Data");
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Austy == "A" || (oData2[i].Beguz == "" && oData2[i].Enduz == "")) continue;
					
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Adbtm = oData2[i].Adbtm ? oData2[i].Adbtm.replace(":", "") : "";
						detail.Notes = oData2[i].Notes;
					
					if(oData.Offyn == "1"){
						createData.FlexWorktime5Nav.push(detail);
					} else {
						createData.FlexWorktime2Nav.push(detail);
					}
				}
				
				var oChief = "";
				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							oChief = data.Chief == "00000000" ? "" : data.Chief;
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}

				// 2021-06-01 ???????????? ?????? ??? ??????????????? push ?????? ??????
				if(oData.Monyn == "1" || oData.Monyn == "3"){
					var oPush = [], 
						dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getSessionInfoByKey("Dtfmt")}),
						oLnctm = "",
						oAdbtm = "";

					switch(oData.Lnctm){ // ????????????
						case "1":
							oLnctm = "00:30";
							break;
						case "2":
							oLnctm = "01:00";
							break;
						case "3":
							oLnctm = "01:30";
							break;
						case "4":
							oLnctm = "02:00";
							break;
						default:
							oLnctm = "-";
							break;
					};

					// ????????????
					oAdbtm = (!oData2[0].Adbtm || oData2[0].Adbtm == "") ? "-" : (oData2[0].Adbtm.substring(0,2) + ":" + oData2[0].Adbtm.substring(2,4));

					// title : [Hi HR] ${Ename} ???????????? ?????? ??????
					// body : ${Datum} ${Time} (???????????? ${Lnctm}, ???????????? ${Adbtm})
					oPush.push({
						title : oController.getBundleText("MSG_69011").interpolate(oData.Ename),
						body : oController.getBundleText("MSG_69012")
								.interpolate(dateFormat.format(oData.Datum), 
											 (oData.Beguz.substring(0,2) + ":" + oData.Beguz.substring(2,4) + "~" + oData.Enduz.substring(0,2) + ":" + oData.Enduz.substring(2,4)),
											 oLnctm,
											 oAdbtm)
					});

					if(oController.sendPush(oPush, oChief) == false) return;
				}
				
				sap.m.MessageBox.success(oController.getBundleText("MSG_00061"), { // ?????????????????????.
					onClose : function(oEvent){
						oController._WorkScheduleDialog.close();
						oController.onPressSearch();
					}
				});
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_00060"), { // ?????????????????????????
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : []};
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Prcty = "2";
					
				var oData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data");
				var oPush = [], dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getSessionInfoByKey("Dtfmt")});

				for(var i=0; i<oData.length; i++){
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData[i].Datum) + ")\/";
						detail.Beguz = oData[i].Beguz;
						detail.Enduz = oData[i].Enduz;
						detail.Lnctm = oData[i].Lnctm;
						detail.Adbtm = oData[i].Adbtm ? oData[i].Adbtm.replace(":", "") : "";
						detail.Monyn = oData[i].Monyn; // 1-???????????? 2-???????????? 3-??????
						detail.Appkey1 = oData[i].Appkey1;

					if(detail.Monyn == "1" || detail.Monyn == "3"){
						var oLnctm = "";
						switch(oData[i].Lnctm){
							case "1":
								oLnctm = "00:30";
								 break;
							case "2":
								oLnctm = "01:00";
								break;
							case "3":
								oLnctm = "01:30";
								break;
							case "4":
								oLnctm = "02:00";
								break;
							default:
								oLnctm = "-";
								break;
						};
						
						// title : [Hi HR] ${Ename} ???????????? ?????? ??????
						// body : ${Datum} ${Time} (???????????? ${Lnctm}, ???????????? ${Adbtm})
						oPush.push({
							title : oController.getBundleText("MSG_69011").interpolate(oData[i].Ename),
							body : oController.getBundleText("MSG_69012")
									.interpolate(dateFormat.format(oData[i].Datum), 
												 (detail.Beguz.substring(0,2) + ":" + detail.Beguz.substring(2,4) + "~" + detail.Enduz.substring(0,2) + ":" + detail.Enduz.substring(2,4)),
												 oLnctm,
												 (oData[i].Adbtm ? oData[i].Adbtm : "-"))
						});
					}
					
					createData.FlexWorktime1Nav.push(detail);
				}
				
				var oData2 = oController._ListCondJSonModel.getProperty("/Data2");
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Austy == "A") continue;
					
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Adbtm = oData2[i].Adbtm ? oData2[i].Adbtm.replace(":", "") : "";
						detail.Notes = oData2[i].Notes;
					
					createData.FlexWorktime2Nav.push(detail);
				}
				
				var oChief = "";
				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							oChief = data.Chief == "00000000" ? "" : data.Chief;
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}

				// 2021-06-01 ???????????? ?????? ??? ??????????????? push ?????? ??????
				if(oPush.length > 0){
					if(oController.sendPush(oPush, oChief) == false) return;
				}
				
				sap.m.MessageBox.success(oController.getBundleText("MSG_00017"), { // ?????????????????????.
					onClose : function(oEvent){
						oController.onPressSearch();
					}
				});
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_00058"), { // ?????????????????????????
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},

		// 2021-06-01 ???????????? ?????? ??? ??????????????? push ?????? ??????
		sendPush : function(oPush, oChief){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			if(oChief != ""){
				var oModel = $.app.getModel("ZHR_COMMON_SRV");

				// ????????? token ??????
				var createData = {AppPushAlarmTokenSet : [{Pernr : oChief}], AppPushAlarmLogSet : []};
					createData.IPernr = oController.getSessionInfoByKey("Pernr");
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = "1";
				var oToken = "";

				oModel.create("/AppPushAlarmHeaderSet", createData, {
					success: function(data){
						if(data){
							if(data.AppPushAlarmTokenSet && data.AppPushAlarmTokenSet.results){
								var data1 = data.AppPushAlarmTokenSet.results;
								
								oToken = data1[0].Token;
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

				if(oController.Error == "E"){
					oController.Error = "";
					MessageBox.error(oController.ErrorMessage);
					return false;
				}

				if(oToken != ""){
					createData.IConType = "2";

					for(var i=0; i<oPush.length; i++){
						if(Common.sendPush({
							title: oPush[i].title,
							body: oPush[i].body,
							token: oToken
						}) != false){
							createData.AppPushAlarmLogSet.push({Pernr : oChief, HeadTxt : oPush[i].title, BodyTxt : oPush[i].body});
						} 
					}

					oModel.create("/AppPushAlarmHeaderSet", createData, {
						success: function(data){
							if(data){
								
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

					if(oController.Error == "E"){
						oController.Error = "";
						MessageBox.error(oController.ErrorMessage);
						return false;
					}
				} else {
					Common.log("?????????", oChief ," HI HR APP ?????????");
				}
			}
		},
		
		makeTable : function(oController, oTable, col_info){
			for(var i=0; i<col_info.length; i++){
				var oColumn = new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : false,
					sorted : false,
					hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
					width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : "")
				});
				
				if(col_info[i].id == "Checkbox"){
					oColumn.addMultiLabel(
						new sap.m.CheckBox(oController.PAGEID + "_CheckBoxAll", {
							width : "100%",
							select : oController.onTableSelectAll
						})
					);
				} else {
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}));
				}
				
				if(col_info[i].plabel != ""){
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}));
					oColumn.setHeaderSpan([col_info[i].span, 1]);
				}
				
				var oTemplate;
				
				switch(col_info[i].type){
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
					case "timepicker":
						if(col_info[i].id == "Beguz"){
							oTemplate = new sap.m.TimePicker({
											valueFormat : "HHmm",
											displayFormat : "HH:mm",
								        	value : "{" + col_info[i].id + "}",
								        	minutesStep : 30,
								        	width : "100%", 
								        	textAlign : "Begin",
		                                	editable : {
			                                    path : "Offyn",
			                                    formatter : function(fVal){
													if(fVal == "2"){ // 2021-05-26 ???????????? ?????? ??????????????? 0~6?????? ?????? ???????????? ?????? ??????
														var hours = new Date().getHours();

														return hours < 6 ? true : false;
													} else {
														return fVal == "" ? true : false;
													}			                                    	
			                                    }
		                                	},
		                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
		                                	change : function(oEvent){
		                                		oController.onChangeTime(oEvent, "30");
		                                	}
										});
						} else {
							oTemplate = new sap.m.TimePicker({
											valueFormat : "HHmm",
											displayFormat : "HH:mm",
								        	value : "{" + col_info[i].id + "}",
								        	minutesStep : 10,
								        	width : "100%", 
								        	textAlign : "Begin",
		                                	editable : {
			                                    path : "Offyn",
			                                    formatter : function(fVal){
			                                    	return (fVal == "" || fVal == "2") ? true : false;
			                                    }
		                                	},
		                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
		                                	change : function(oEvent){ 
		                                		oController.onChangeTime(oEvent, "10");
		                                	}
										});
						}
						break;
					case "timepicker2":
						oTemplate = new sap.m.TimePicker({
										valueFormat : "HHmm",
										displayFormat : "HH:mm",
							        	value : "{" + col_info[i].id + "}",
							        	minutesStep : 10,
							        	width : "100%", 
							        	textAlign : "Begin",
	                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
	                                	change : function(oEvent){
	                                		oController.onChangeTime2(oEvent, oTable);
	                                	},
	                                	editable : {
	                                		path : "Offyn",
	                                		formatter : function(fVal){
	                                			return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
	                                		}
	                                	}
									});
						break;
					case "combobox":
						oTemplate = new sap.m.ComboBox({
										selectedKey : "{" + col_info[i].id + "}",
										width : "100%",
										items : [new sap.ui.core.Item({key : "0", text : ""}),
												 new sap.ui.core.Item({key : "1", text : "00:30"}),
												 new sap.ui.core.Item({key : "2", text : "01:00"}),
												 new sap.ui.core.Item({key : "3", text : "01:30"}),
												 new sap.ui.core.Item({key : "4", text : "02:00"})],
										change : oController.onChangeModyn,
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										}
									});
						oColumn.setHAlign("Begin");
						break;
					case "time":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											path : col_info[i].id,
											formatter : function(fVal){
												return (!fVal || fVal == "") ? "" : (fVal.substring(0,2) + ":" + fVal.substring(2,4));
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					case "icon":
						oTemplate = new sap.ui.core.Icon({
										src : "sap-icon://accept",
										size : "14px",
										color : "#f00",
										visible : {
											path : col_info[i].id,
											formatter : function(fVal){
												return fVal && fVal != "" ? true : false;
											}
										}
									});
						break;
					case "checkbox":
						oTemplate = new sap.m.CheckBox({
										width : "100%",
										selected : "{" + col_info[i].id + "}",
										select : oController.onSelectCheckbox,
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										},
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
									});
						break;
					case "weektx":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											parts : [{path : col_info[i].id}, {path : "Offyn"}, {path : "Alldf"}],
											formatter : function(fVal1, fVal2, fVal3){
												this.removeStyleClass("color-red");
												
												if(fVal2 == "X" && fVal3 == false){
													this.addStyleClass("color-red");
												}
												
												return fVal1;
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					case "input":
						oTemplate = new sap.m.Input({
										value : "{" + col_info[i].id + "}",
										showValueHelp : true,
										valueHelpOnly : true,
										valueHelpRequest : oController.openAddBreak,
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										}
									});
						break;
					case "note":
						oTemplate = new sap.m.Input({
										value : "{" + col_info[i].id + "}",
										width : "100%",
										maxLength : common.Common.getODataPropertyLength("ZHR_FLEX_TIME_SRV", "AddBreakList", col_info[i].id),
	                                	editable : {
	                                		path : "Offyn",
	                                		formatter : function(fVal){
	                                			return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
	                                		}
	                                	}
									});
					
					if(oTable.sId == oController.PAGEID + "_AddBreakTable2"){
						oTemplate.attachChange(function(){
							var oMonyn = oController._WorkScheduleDialog.getModel().getProperty("/Data/0/Monyn");
								oMonyn = (!oMonyn || oMonyn == "") ? "2" : (oMonyn == "1" ? "3" : "2");
								
							oController._WorkScheduleDialog.getModel().setProperty("/Data/0/Monyn", oMonyn);	
						});
					}
					
						break;
					case "change":
						oTemplate = new sap.m.Button({
										icon : "sap-icon://edit",
										visible : {
											parts : [{path : "Offyn"}, {path : "Alldf"}],
											formatter : function(fVal1, fVal2){
												return fVal1 == "1" && fVal2 == false ? true : false;
											}
										},
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										press : oController.onChangeSchedule
									}).addStyleClass("pl-3px");
						break;
					case "delete":
						oTemplate = new sap.m.Button({
										icon : "sap-icon://decline",
										visible : {
											parts : [{path : "Beguz"}, {path : "Enduz"}, {path : "Offyn"}],
											formatter : function(fVal1, fVal2, fVal3){
												if(fVal3 == "X"){
													return false;
												} else {
													return fVal1 && fVal2 ? true : false;
												}
											}
										},
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										press : function(oEvent){
											oController.onDeleteBreak(oEvent, oTable);
										}
									}).addStyleClass("pl-3px");
						break;
					case "status":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											parts : [{path : "Statustx"}, {path : "Monyn"}],
											formatter : function(fVal1, fVal2){
												if(fVal2 != ""){
													return oController.getBundleText("LABEL_69002"); // ??????
												} else {
													return fVal1;
												}
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					default:
						oTemplate = new sap.ui.commons.TextView({
										text : "{" + col_info[i].id + "}",
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
				}
				
				oColumn.setTemplate(oTemplate);
				oTable.addColumn(oColumn);
			}	
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});