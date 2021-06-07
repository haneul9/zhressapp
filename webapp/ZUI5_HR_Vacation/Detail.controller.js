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

	return CommonController.extend("ZUI5_HR_Vacation.Detail", {

		PAGEID: "ZUI5_HR_VacationDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		oData : null,

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
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			var oData = {
				Data : {
					FromPageId : oEvent.data.FromPageId,
					Status1 : oEvent.data.Status1,
					ListStatus : oEvent.data.Status1,
					Werks : oController.getSessionInfoByKey("Persa"),
					Flag : (oEvent.data.Flag ? oEvent.data.Flag : ""),
					Delapp : oEvent.data.Delapp ? oEvent.data.Delapp : "",
					Chief : oController.getSessionInfoByKey("Chief"),
					Extryn : Common.isExternalIP() === true ? "X" : ""
				}
			};
			
			if(oEvent.data.Status1 != ""){
				oData.Data.Begda = oEvent.data.Begda;
				oData.Data.Endda = oEvent.data.Endda;
				oData.Data.Awart = oEvent.data.Awart;
				oData.Data.Subty = oEvent.data.Subty;
				oData.Data.Pernr = oEvent.data.Pernr;
				oData.Data.Delapp = oEvent.data.Delapp;
				oData.Data.Seqnr = oEvent.data.Seqnr;
				oData.Data.Sprps = oEvent.data.Sprps;
			}
			
			if(oEvent.data.Delapp != ""){
				oData.Data.ListAppkey = oEvent.data.Appkey;
				oData.Data.ListAppkey1 = oEvent.data.Appkey1;
			}
			
			oController._DetailJSonModel.setData(oData);
			oController.onPressSearch(oEvent);
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			// oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Vacation.Detail",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
			
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			// 근태일수, 휴일일수 초기화
			oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
			oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
			oController._DetailJSonModel.setProperty("/Data/Holyt", "");
			// 대근신청 비활성화
			oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
		},
		
		onChangeTime2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onSetInfo : function(Pernr){
			if(!Pernr) return;
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			var oPhoto = "";
			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + (Pernr * 1) + "' and photoType eq '1'")
				 .select("photo")
				 .setAsync(false)
				 .attachRequestCompleted(function(){
						var data = this.getData().d;
						
						if(data && data.results.length){
							oPhoto = "data:text/plain;base64," + data.results[0].photo;
						} else {
							oPhoto = "images/male.jpg";
						}
				 })
				 .attachRequestFailed(function() {
						oPhoto = "images/male.jpg";
				 })
				 .load();
				 
			var vData = {};
				vData.photo = oPhoto;
				 
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			// var oModel = $.app.getModel("ZHR_COMMON_SRV");
			// var oPath = "/EmpSearchResultSet?$filter=Percod eq '" + encodeURIComponent(common.Common.encryptPernr($.app.getModel("session").getData().Pernr)) + "'";
			// 	oPath += " and Actty eq '" + gAuth + "'";
			// 	oPath += " and Actda eq datetime'" + dateFormat.format(new Date()) + "T00:00:00'";
			// 	oPath += " and Ename eq '" + Pernr + "'";
			// 	oPath += " and Persa eq '0AL1' and Stat2 eq '3'";
			// 	oPath += " and BukrsOld eq '" + $.app.getModel("session").getData().Bukrs + "'";
			// 	oPath += " and ICusrid eq '" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "'";
			// 	oPath += " and ICusrse eq '" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "'";
			// 	oPath += " and ICusrpn eq '" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "'";
			// 	oPath += " and ICmenuid eq '" + $.app.getMenuId() + "'";
				
			// oModel.read(oPath, null, null, false,
			// 			function(data, oResponse) {
			// 				if(data && data.results.length) {
			// 					data.results[0].nickname = data.results[0].Ename;
			// 					data.results[0].Stext = data.results[0].Fulln;
	  //                      	data.results[0].PGradeTxt = data.results[0].ZpGradetx;
	  //                      	data.results[0].ZtitleT = data.results[0].Ztitletx;
	                        	
			// 					Object.assign(vData, data.results[0]);
			// 				}
			// 			},
			// 			function(Res) {
			// 				oController.Error = "E";
			// 				if(Res.response.body){
			// 					ErrorMessage = Res.response.body;
			// 					var ErrorJSON = JSON.parse(ErrorMessage);
			// 					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
			// 						oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
			// 					} else {
			// 						oController.ErrorMessage = ErrorMessage;
			// 					}
			// 				}
			// 			}
			// );
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var createData = {TableIn : []};
				createData.IPernr = Pernr;
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				
			oModel.create("/HeaderSet", createData, {
				success: function(data, res){
					if(data){
						if(data.TableIn && data.TableIn.results){
								var data1 = data.TableIn.results[0];
								
								if(data1){
									Object.assign(vData, data1);
								} else {
									sap.m.MessageBox.error(oController.getBundleText("MSG_48015"), { // 데이터 조회 중 오류가 발생하였습니다.
										onClose : oController.onBack
									});
									return;
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
			
			oController._DetailJSonModel.setProperty("/User", vData);
			oController._DetailJSonModel.setProperty("/Data/Bukrs", vData.Bukrs3);
			oController._DetailJSonModel.setProperty("/Data/Molga", vData.Molga);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
			}
		},
		
		// 결재자 리스트 생성 : Defyn == "X"인 경우 default 결재자로 세팅한다.
		setAppName : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			var oRow = sap.ui.getCore().byId(oController.PAGEID + "_AppNameRow");
			var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
				oAppName.destroyItems();
				oAppName.setValue("");
			
			var oModel2 = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
			var createData2 = {ApprlistNav : []};
				createData2.IPernr = oData.Pernr;
				createData2.IExtryn = oData.Extryn;
				createData2.IZappSeq = "11";
				createData2.IBukrs = oData.Bukrs;
				createData2.IMobyn = "";
				createData2.IAppkey = (oData.Appkey ? oData.Appkey : "");

			if(oData.Status1 == "" || oData.Status1 == "AA" || oData.Status1 == "JJ"){
				createData2.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
				createData2.IPrcty = "1";
			} else {
				createData2.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				createData2.IPrcty = "2";
			}

			oModel2.create("/ApprListSet", createData2, {
				success: function(data, res){
					if(data){
						if(data.ApprlistNav && data.ApprlistNav.results){
								var data1 = data.ApprlistNav.results;
								
								if(data1){
									for(var i=0; i<data1.length; i++){
										oAppName.addItem(
											new sap.ui.core.Item({
												key : data1[i].AppName,
												text : data1[i].AppText
											})
										);

										if(data1[i].Defyn == "X"){
											oController._DetailJSonModel.setProperty("/Data/AppName", data1[i].AppName);
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

			// 리스트가 존재하지 않으면 결재자 row를 invisible 처리한다.
			if(oAppName.getItems().length == 0){
				oController._DetailJSonModel.setProperty("/Data/AppName", "");
				oRow.addStyleClass("displayNone");
			} else {
				oRow.removeStyleClass("displayNone");
			}	
		},
		
		// 대상자 변경 시 pernr
		onPressSearch : function(oEvent, pernr){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var resetTable = function(table, model, data){
				model.setData(data);
				table.setVisibleRowCount(1);
				
				var column = table.getColumns();
				for(var i=0; i<column.length; i++){
					column[i].setFiltered(false);
					column[i].setSorted(false);
				}
			}
			
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel2 = oTable2.getModel();
			var vData2 = {Data : []};
			
			var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oJSONModel3 = oTable3.getModel();
			var vData3 = {Data : []};
			
			resetTable(oTable2, oJSONModel2, vData2);
			resetTable(oTable3, oJSONModel3, vData3);
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				
				if(oData.Status1 == "" || (pernr && pernr != "")){
					
					// 대상자
					oController.onSetInfo((pernr && pernr != "" ? pernr : oController.getSessionInfoByKey("Pernr")));

					var vData = {
						FromPageId : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
						Status1 : oController._DetailJSonModel.getProperty("/Data/Status1"),
						Bukrs : oController._DetailJSonModel.getProperty("/Data/Bukrs"),
						Werks :	oController._DetailJSonModel.getProperty("/Data/Werks"),
						Molga : oController._DetailJSonModel.getProperty("/Data/Molga"),
						Pernr : (pernr && pernr != "" ? pernr : oController.getSessionInfoByKey("Pernr")),
						Flag : oController._DetailJSonModel.getProperty("/Data/Flag"),
						Delapp : oController._DetailJSonModel.getProperty("/Data/Delapp"),
						Extryn : oController._DetailJSonModel.getProperty("/Data/Extryn"),
						AppName : oController._DetailJSonModel.getProperty("/Data/AppName")
					};
					
					oController._DetailJSonModel.setProperty("/Data", vData);
					
					// 결재자
					oController.setAppName();
					
					// 대근신청 비활성화
					oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				} else {	
					// 대상자
					oController.onSetInfo(oData.Pernr);
				
					// 데이터 조회
					var createData = {VacationApply1Nav : [], VacationApply2Nav : []};
						createData.IEmpid = oData.Pernr;
						createData.IBukrs = oData.Bukrs;
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IMolga = oData.Molga;
						createData.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
						createData.IConType = "1";
						
					var detail = {};
						detail.Pernr = oData.Pernr;
						detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
						detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
						detail.Awart = oData.Awart;
						detail.Subty = oData.Subty; 
						detail.Seqnr = oData.Seqnr;
						detail.Sprps = oData.Sprps;
						
						createData.VacationApply1Nav.push(detail);
						
					oModel.create("/VacationApplySet", createData, {
						success: function(data, res){
							if(data){
								// 근태신청
								if(data.VacationApply1Nav && data.VacationApply1Nav.results){
									var data1 = data.VacationApply1Nav.results[0];
									
									if(data1){
										var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
										
										data1.Begda = dateFormat.format(new Date(common.Common.setTime(data1.Begda)));
										data1.Endda = dateFormat.format(new Date(common.Common.setTime(data1.Endda)));
										
										data1.Kaltg = parseFloat(data1.Kaltg) == 0 ? "" : parseFloat(data1.Kaltg);
										data1.Hldtg = parseFloat(data1.Hldtg) == 0 ? "" : parseFloat(data1.Hldtg);
										data1.Kjdate = parseFloat(data1.Kjdate) == 0 ? "" : parseFloat(data1.Kjdate);
										
										if(data1.Holyt != ""){
											data1.Holyt = "(" + data1.Holyt + ")";              
										} else {
											data1.Holyt = "";
										}
										
										oController._DetailJSonModel.setProperty("/Data", Object.assign(oController._DetailJSonModel.getProperty("/Data"), data1));
									} else {
										sap.m.MessageBox.error(oController.getBundleText("MSG_48015"), { // 데이터 조회 중 오류가 발생하였습니다.
											onClose : oController.onBack
										});
										return;
									}
								}
								
								// 대근신청
								if(data.VacationApply2Nav && data.VacationApply2Nav.results){
									var data2 = data.VacationApply2Nav.results;
									
									if(data2.length == 0){
										oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
									} else {
										oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
										
										for(var i=0; i<data2.length; i++){
											data2[i].Idx = i;
											data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
											
											data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
											
											data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
											data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
											data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
											data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
											
											if(data2[i].Offck == "X"){
												data2[i].Status1 = "ZZ";
											} else {
												data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
											}
											
											data2[i].Flag = data2[i].Flag == "" ? "X" : data2[i].Flag;
											
											vData2.Data.push(data2[i]);
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
					
					oJSONModel2.setData(vData2);
					oTable2.bindRows("/Data");
					oTable2.setVisibleRowCount(vData2.Data.length);
					
					if(oController.Error == "E"){
						oController._BusyDialog.close();
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage, {
							onClose : oController.onBack
						});
						return;
					}
				}
				
				// 결재자
				oController.setAppName();
				
				oData = oController._DetailJSonModel.getProperty("/Data");
				
				// 근태코드 리스트
				var oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart");
					oAwart.destroyItems();
				var createData = {VacationTypeNav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
				
				oModel.create("/VacationTypePeSet", createData, {
					success: function(data, res){
						if(data){
							if(data.VacationTypeNav && data.VacationTypeNav.results){
								for(var i=0; i<data.VacationTypeNav.results.length; i++){   
									// 2021-05-21 재택근무 리스트에 추가하지 않음
									if(data.VacationTypeNav.results[i].Subty == "1615" || data.VacationTypeNav.results[i].Subty == "1LA1"){
										continue;
									}
									
									oAwart.addItem(
										new sap.ui.core.Item({
											key : data.VacationTypeNav.results[i].Subty,
											text : data.VacationTypeNav.results[i].Stext,
											customData : [new sap.ui.core.CustomData({key : "", value : data.VacationTypeNav.results[i]})]
										})
									);

									if(oData && oData.Awart != ""){
										if(oData.Awart == data.VacationTypeNav.results[i].Subty){
											oController._DetailJSonModel.setProperty("/Data/Halfc", data.VacationTypeNav.results[i].Halfc);
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
					oController._BusyDialog.close();
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				// 데이터 조회 시 근태코드에 따라 세팅 추가
				if(oData.Status1 != ""){
					oController.onChangeAwart();
				}
				
				// 휴가쿼터조회
				var createData2 = {VacationQuotaNav : []};
					createData2.IPernr = oData.Pernr;
					createData2.IBukrs = oData.Bukrs;
					createData2.ILangu = oController.getSessionInfoByKey("Langu");
					createData2.IMolga = oData.Molga;
					createData2.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
					createData2.ICorre = "X";
		
				oModel.create("/VacationQuotaSet", createData2, {
					success: function(data, res){
						if(data){
							if(data.VacationQuotaNav && data.VacationQuotaNav.results){
								for(var i=0; i<data.VacationQuotaNav.results.length; i++){   
									
									data.VacationQuotaNav.results[i].Anzhl = parseFloat(data.VacationQuotaNav.results[i].Anzhl);
									data.VacationQuotaNav.results[i].Kverb = parseFloat(data.VacationQuotaNav.results[i].Kverb);
									data.VacationQuotaNav.results[i].Reman = parseFloat(data.VacationQuotaNav.results[i].Reman);
									
									vData3.Data.push(data.VacationQuotaNav.results[i]);
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
				
				oJSONModel3.setData(vData3);
				oTable3.bindRows("/Data");
				oTable3.setVisibleRowCount(vData3.Data.length);
			
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 근태코드 변경
		onChangeAwart : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			oController._DetailJSonModel.setProperty("/Data/Half", "");
			
			var oMessage = sap.ui.getCore().byId(oController.PAGEID + "_MessageRow");
				oMessage.addStyleClass("displayNone");
				
			var oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart");
			
			if(oEvent){
				// 근태일수, 휴일일수 초기화
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// 대근신청 비활성화
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				// 근태시간 초기화
				oController._DetailJSonModel.setProperty("/Data/Beguz", "");
				oController._DetailJSonModel.setProperty("/Data/Enduz", "");
			}
			
			if(oController._DetailJSonModel.getProperty("/Data/Awart")){
				var oData = oController._DetailJSonModel.getProperty("/Data");
				
				if(oEvent){
					var vData = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
					
					oController._DetailJSonModel.setProperty("/Data/Halfc", vData.Halfc);
					
					// 경조일수
					if(vData.Congt == "X"){
						oController._DetailJSonModel.setProperty("/Data/Kjdate", vData.Maxtg);
					} else {
						oController._DetailJSonModel.setProperty("/Data/Kjdate", "");
					}
					
					// 출입카드신청
					oController._DetailJSonModel.setProperty("/Data/Encard", "");
				}
				
				switch(oData.Awart){
					case "1511": // 자녀출생, 배우자출산의 경우 근태사유 하단 메세지 표시
					case "1GF":
						oMessage.removeStyleClass("displayNone");
						break;
					case "1700": // 출산휴가 선택 시 메세지 처리
					case "1705":
					case "1715":
					case "1720":
						sap.m.MessageBox.information(oController.getBundleText("MSG_48004"), { // 남직원이시면 '자녀출생'으로 신청하셔야 합니다. 여성인재는 계속 진행하세요.
							title : oController.getBundleText("LABEL_00149")
						});
						break;
					case "1424": // 출장(근로미포함) 선택 시 출입카드신청 리스트 생성
						var oEncard = sap.ui.getCore().byId(oController.PAGEID + "_Encard");
							oEncard.destroyItems();
							
						var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
						var createData = {BztrCodeListNav : []};
							createData.IPernr = oData.Pernr;
							createData.IBukrs = oData.Bukrs;
							createData.ILangu = oController.getSessionInfoByKey("Langu");
							createData.IMolga = oData.Molga;
							createData.IInpType = "04";
						
						oModel.create("/BztrCodeTextSet", createData, {
							success: function(data, res){
								if(data){
									if(data.BztrCodeListNav && data.BztrCodeListNav.results){
										for(var i=0; i<data.BztrCodeListNav.results.length; i++){   
											oEncard.addItem(
												new sap.ui.core.Item({
													key : data.BztrCodeListNav.results[i].Code,
													text : data.BztrCodeListNav.results[i].Text
												})
											);
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

						break;
					default:
				}
			} else {
				oController._DetailJSonModel.setProperty("/Data/Halfc", "");
			}
		},
		
		onChangeHalf : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			var oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart");
			var vData = oAwart.getSelectedItem().getCustomData()[0].getValue();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// 근태일수, 휴일일수 초기화
			oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
			oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
			oController._DetailJSonModel.setProperty("/Data/Holyt", "");
			// 대근신청 비활성화
			oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
		
			if(oData.Halfc == "X"){
				if(oData.Half == "1"){ // 오전
					oController._DetailJSonModel.setProperty("/Data/Beguz", vData.Beguz1);
					oController._DetailJSonModel.setProperty("/Data/Enduz", vData.Enduz1);
				} else if(oData.Half == "2"){ // 오후
					oController._DetailJSonModel.setProperty("/Data/Beguz", vData.Beguz2);
					oController._DetailJSonModel.setProperty("/Data/Enduz", vData.Enduz2);
				} else {
					oController._DetailJSonModel.setProperty("/Data/Beguz", "");
					oController._DetailJSonModel.setProperty("/Data/Enduz", "");
				}
			} else {
				oController._DetailJSonModel.setProperty("/Data/Beguz", "");
				oController._DetailJSonModel.setProperty("/Data/Enduz", "");
			}
		},
		
		// 휴일계산 - 기초
		onPressOvertimePe : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// validation check
			if(!oData.Awart || oData.Awart == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // 근태코드를 선택하여 주십시오.
				return;
			} else if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // 근태기간을 입력하여 주십시오.
				return;
			} else if(oData.Begda > oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48018")); // 시작일이 종료일 이후입니다. 일자를 확인하여 주십시오.
				return;
			}
			
			var search = function(){
				// 근태일수, 휴일일수 초기화
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// 대근신청 비활성화
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {OvertimePe1Nav : [], OvertimePe2Nav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					createData.IAwart = oData.Awart;
				
				oModel.create("/OvertimePeSet", createData, {
					success: function(data, res){
						if(data){
							// 근태일수
							oController._DetailJSonModel.setProperty("/Data/Kaltg", (parseFloat(data.EKaltg) + ""));
							
							// 휴일일수
							oController._DetailJSonModel.setProperty("/Data/Hldtg", (parseFloat(data.EAbwtg) + ""));
							
							if(data.OvertimePe1Nav && data.OvertimePe1Nav.results){
								var data1 = data.OvertimePe1Nav.results;
								
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
								var oHolyt = "";
								
								for(var i=0; i<data1.length; i++){
									if(i==0){
										oHolyt = "(";
									} else {
										oHolyt += ", ";
									}
									
									oHolyt += dateFormat.format(new Date(common.Common.getTime(data1[i].Mldda)));
								}
								
								oHolyt = (oHolyt == "" ? "" : oHolyt + ")");
								
								oController._DetailJSonModel.setProperty("/Data/Holyt", oHolyt);
							}
							
							if(data.OvertimePe2Nav && data.OvertimePe2Nav.results){
								var data2 = data.OvertimePe2Nav.results;
								if(data2.length > 0){ // 대근신청 활성화
									oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
									
									var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
									var oJSONModel = oTable.getModel();
									var vData = {Data : []};
									
									for(var i=0; i<data2.length; i++){
										data2[i].Idx = i;
										data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
										data2[i].Flag = "A";
										
										data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
										
										data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
										data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
										data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
										data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
										
										if(data2[i].Offck == "X"){
											data2[i].Status1 = "ZZ";
										} else {
											data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
										}
										
										vData.Data.push(data2[i]);
									}
									
									oJSONModel.setData(vData);
									oTable.bindRows("/Data");
									oTable.setVisibleRowCount(vData.Data.length);
									
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
			}
			          
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 휴일계산 - 첨단
		onPressCheckAbsence : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// validation check
			if(!oData.Awart || oData.Awart == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // 근태코드를 선택하여 주십시오.
				return;
			} else if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // 근태기간을 입력하여 주십시오.
				return;
			} else if(oData.Begda > oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48018")); // 시작일이 종료일 이후입니다. 일자를 확인하여 주십시오.
				return;
			} 
				
			var search = function(){
				// 근태일수, 휴일일수 초기화
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// 대근신청 비활성화
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				// 근태시간계산 초기화
				oController._DetailJSonModel.setProperty("/Data/EAbshr", "");
				oController._DetailJSonModel.setProperty("/Data/EAbsmm", "");
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {ChkAbsenceNav : [], ChkAbsence2Nav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					createData.IAwart = oData.Awart;
					createData.IBeguz = oData.Beguz;
					createData.IEnduz = oData.Enduz;
					createData.IVtken = oData.Vtken ? oData.Vtken : false;
				
				oModel.create("/CheckAbsenceSet", createData, {
					success: function(data, res){
						if(data){
							// 근태일수
							oController._DetailJSonModel.setProperty("/Data/Kaltg", (parseFloat(data.EKaltg) + ""));
							
							// 휴일일수
							oController._DetailJSonModel.setProperty("/Data/Hldtg", (parseFloat(data.EAbwtg) + ""));
							
							// 근태시간계산결과
							if(data.EAbshr == "00" && data.EAbsmm == "00"){
								
							} else {
								oController._DetailJSonModel.setProperty("/Data/EAbshr", data.EAbshr);
								oController._DetailJSonModel.setProperty("/Data/EAbsmm", data.EAbsmm);
							}
							
							if(data.ChkAbsence2Nav && data.ChkAbsence2Nav.results){
								var data1 = data.ChkAbsence2Nav.results;
								
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
								var oHolyt = "";
								
								for(var i=0; i<data1.length; i++){
									if(i==0){
										oHolyt = "(";
									} else {
										oHolyt += ", ";
									}
									
									oHolyt += dateFormat.format(new Date(common.Common.getTime(data1[i].Mldda)));
								}
								
								oHolyt = (oHolyt == "" ? "" : oHolyt + ")");
								
								oController._DetailJSonModel.setProperty("/Data/Holyt", oHolyt);
							}
							
							if(data.ChkAbsenceNav && data.ChkAbsenceNav.results){
								var data2 = data.ChkAbsenceNav.results;
								if(data2.length > 0){ // 대근신청 활성화
									oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
									
									var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
									var oJSONModel = oTable.getModel();
									var vData = {Data : []};
									
									for(var i=0; i<data2.length; i++){
										data2[i].Idx = i;
										data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
										data2[i].Flag = "A";
										
										data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
										
										data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
										data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
										data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
										data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
										
										if(data2[i].Offck == "X"){
											data2[i].Status1 = "ZZ";
										} else {
											data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
										}
										
										vData.Data.push(data2[i]);
									}
									
									oJSONModel.setData(vData);
									oTable.bindRows("/Data");
									oTable.setVisibleRowCount(vData.Data.length);
									
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
			}	
				
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 한도체크
		onPressVacationCover : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var vData = oController._DetailJSonModel.getProperty("/Data");
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
			var oData2 = {Data : []};
			
			// validation check
			for(var i=0; i<oData.length; i++){
				if(oData[i].Offck == "" && oData[i].Cntgb != "0"){
					if(!oData[i].Awper || oData[i].Awper == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48002")); // 대근자를 모두 지정하십시오.
						return;
					} else if(!oData[i].Beguz || !oData[i].Enduz){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48014")); // OT시간을 입력하여 주십시오.
						return;
					}
				}
			}
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {VacationCovNav : []};
					createData.IProType = "2";
					createData.IPernr = vData.Pernr;
					createData.IAwart = vData.Awart;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(vData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(vData.Endda)) + ")\/"; 
					createData.IBukrs = vData.Bukrs;
					createData.IMolga = vData.Molga;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					
				for(var i=0; i<oData.length; i++){
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(new Date(oData[i].Datum)) + ")\/"; 
						detail.Offck = oData[i].Offck;
						detail.Awper = oData[i].Awper;
						detail.Awtxt = oData[i].Awtxt;
						detail.Beguz = oData[i].Beguz;
						detail.Enduz = oData[i].Enduz;
						detail.Cntgb = oData[i].Cntgb;
						detail.Flag = oData[i].Flag;
						
					createData.VacationCovNav.push(detail);
				}
				
				oModel.create("/VacationCoverSet", createData, {
					success: function(data, res){
						if(data){
							if(data.VacationCovNav && data.VacationCovNav.results){
								var datas = data.VacationCovNav.results;
								
								for(var i=0; i<datas.length; i++){
									datas[i].Idx = i;
									datas[i].Datum = new Date(common.Common.getTime(datas[i].Datum));
									
									datas[i].Ovtim = parseFloat(datas[i].Ovtim) == 0 ? "-" : datas[i].Ovtim;
									datas[i].Wt40 = parseFloat(datas[i].Wt40) == 0 ? "-" : datas[i].Wt40;
									datas[i].Wt12 = parseFloat(datas[i].Wt12) == 0 ? "-" : datas[i].Wt12;
									datas[i].Wtsum = parseFloat(datas[i].Wtsum) == 0 ? "-" : datas[i].Wtsum;
									
									if(datas[i].Offck == "X"){
										datas[i].Status1 = "ZZ";
									} else {
										datas[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
									}
									
									oData2.Data.push(datas[i]);
								}
								
							}
							
							oJSONModel.setData(oData2);
							oTable.bindRows("/Data");
							oTable.setVisibleRowCount(oData2.Data.length);
							
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
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			}
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_48001"), { // 한도체크 하시겠습니까?
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
			
		},
		
		onChangeCntgb : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
		
			var vData = oEvent.getSource().getCustomData()[0].getValue();
			
			// 인원 변경 시 한도체크 변수값 초기화
			oJSONModel.setProperty("/Data/" + vData.Idx + "/Ligbn", "");
			oJSONModel.setProperty("/Data/" + vData.Idx + "/LigbnTx", "");
			
			if(vData.Cntgb == "2"){ // 2명 선택 시 아래에 라인 추가함
				var oNewData = {Data : []};
				
				var tmp = "";
				for(var i=0; i<oData.length; i++){
					var detail = Object.assign(oData[i]);
						detail.Idx = oNewData.Data.length;
					oNewData.Data.push(detail);
					
					if(tmp == "" && (oData[i].Idx == vData.Idx)){
						tmp = "X";
						
						var detail2 = {};
							detail2.Idx = oNewData.Data.length;
							detail2.Datum = oData[i].Datum;
							detail2.Offck = oData[i].Offck;
							detail2.Awtxt = "";
							detail2.Awper = "";
							detail2.Beguz = oData[i].Beguz;
							detail2.Enduz = oData[i].Enduz;
							detail2.Ovtim = "";
							detail2.Wt40 = "";
							detail2.Wt12 = "";
							detail2.Wtsum = "";
							detail2.Ligbn = "";
							detail2.LigbnTx = "";
							detail2.Cntgb = "";
							detail2.Flag = "X";
							detail2.Status1 = oData[i].Status1;
						oNewData.Data.push(detail2);
					}
				}
				
				oJSONModel.setData(oNewData);
				oTable.bindRows("/Data");
				oTable.setVisibleRowCount(oNewData.Data.length);
			} else {
				if(vData.Cntgb == "0"){ // 없음 선택 시 해당 라인 데이터 clear
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Awtxt", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Awper", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Beguz", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Enduz", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Ovtim", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wt40", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wt12", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wtsum", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Ligbn", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/LigbnTx", "");
				}
				
				// 인원수 변경된 아래 라인의 Flag 가 X인 경우 삭제함
				if(oJSONModel.getProperty("/Data/" + (vData.Idx + 1) + "/Flag") == "X"){
					var oNewData = {Data : []};
					for(var i=0; i<oData.length; i++){
						if(i == (vData.Idx + 1)){
							continue;
						}
						
						var detail = Object.assign(oData[i]);
							detail.Idx = oNewData.Data.length;
						oNewData.Data.push(detail);
					}
					
					oJSONModel.setData(oNewData);
					oTable.bindRows("/Data");
					oTable.setVisibleRowCount(oNewData.Data.length);
				}
			}
		},
		
		// OT시간 변경 시 한도체크여부 초기화
		onChangeTime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			if(oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
			}
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel();
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Ligbn", "");
				oJSONModel.setProperty("/Data/" + oData.Idx + "/LigbnTx", "");
				
		}, 
		
		// 신청 (Flag : C 신청, D 삭제)
		onPressSave : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data");
			
			var createData = {VacationApply1Nav : [], VacationApply2Nav : []};
			var vExtyn = Common.isExternalIP() === true ? "X" : "";
			var oUrl = "";
			
			// validation check
			if(Flag == "C" && oData.Flag == ""){
				if(oData.Delapp == ""){
					if(!oData.Awart || oData.Awart == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // 근태코드를 선택하여 주십시오.
						return;
					} else if(oData.Halfc == "H" && !oData.Half){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48008")); // 오전/오후 구분을 선택하여 주십시오.
						return;
					} else if(oData.Halfc == "X" && (oData.Beguz == "" || oData.Enduz == "")){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48024")); // 근태시간을 입력하여 주십시오.
						return;
					} else if(!oData.Begda || !oData.Endda){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // 근태기간을 입력하여 주십시오.
						return;
					} else if(oData.Kaltg == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48007")); // 먼저 휴일계산을 실행하시기 바랍니다.
						return;
					} else if(!oData.Telnum || oData.Telnum.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48009")); // 연락처를 입력하여 주십시오.
						return;
					} else if(!oData.Desti || oData.Desti.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48010")); // 행선지를 입력하여 주십시오.
						return;
					}

					// 2021-05-11 결재자 리스트가 있는 경우 결재자 선택 여부 체크
					var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
					if(oAppName.getItems().length != 0){
						if(!oData.AppName){
							sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // 결재자를 선택하여 주십시오.
							return;
						}
					}
				}
			} else if(Flag == "C" && oData.Flag == "D"){
				if(oData.Awart == "1615" || oData.Awart == "1LA1"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48027")); // 재택근무는 삭제신청이 불가합니다.
					return;
				}
			}
			
			// 대근신청
			if(oData.Panel2Visible == true){
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Offck == ""){
						if(oData2[i].Ligbn == "" && oData2[i].Cntgb != "0"){
							sap.m.MessageBox.error(oController.getBundleText("MSG_48011")); // 먼저 한도체크를 실행하시기 바랍니다.
							return;
						} else if(oData2[i].Cntgb != "0"){
							if(!oData2[i].Awper){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48002")); // 대근자를 모두 지정하십시오.
								return;
							} else if(!oData2[i].Beguz || !oData2[i].Enduz){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48014")); // OT시간을 입력하여 주십시오.
								return;
							}
						}
					}
					
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/"; 
						detail.Offck = oData2[i].Offck;
						detail.Awper = oData2[i].Awper;
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Ovtim = oData2[i].Ovtim == "" || oData2[i].Ovtim == "-" ? "0" : oData2[i].Ovtim;
						detail.Wt40 = oData2[i].Wt40 == "" || oData2[i].Wt40 == "-" ? "0" : oData2[i].Wt40;
						detail.Wt12 = oData2[i].Wt12 == "" || oData2[i].Wt12 == "-" ? "0" : oData2[i].Wt12;
						detail.Wtsum = oData2[i].Wtsum == "" || oData2[i].Wtsum == "-" ? "0" : oData2[i].Wtsum;
						detail.Ligbn = oData2[i].Ligbn;
						detail.Cntgb = oData2[i].Cntgb;
						detail.Flag = oData2[i].Flag;
					
					createData.VacationApply2Nav.push(detail);
				}
			}
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				
					createData.IEmpid = oController.getSessionInfoByKey("Pernr");
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
					createData.IExtryn = oData.Extryn;
					
					// 신청구분값에 따라 구분값 변경
					// 신규신청 3, 삭제 4, 삭제신청 5
					if(oData.Flag == "D" && Flag == "C"){
						createData.IConType = "5";
					} else if(Flag == "C"){
						createData.IConType = "3";
					} else {
						createData.IConType = "4";
					}
				
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Awart = oData.Awart;
					detail.Subty = oData.Subty ? oData.Subty : oData.Awart;
					detail.Half = oData. Half ? oData.Half : "";
					detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					detail.Beguz = oData.Beguz ? oData.Beguz : "";
					detail.Enduz = oData.Enduz ? oData.Enduz : "";
					detail.Kaltg = oData.Kaltg ? oData.Kaltg + "" : "0";
					detail.Hldtg = oData.Hldtg ? oData.Hldtg + "" : "0";
					detail.Kjdate = oData.Kjdate ? oData.Kjdate + "" : "0";
					detail.Telnum = oData.Telnum;
					detail.Desti = oData.Desti;
					detail.Encard = oData.Encard;
					detail.Bigo = oData.Bigo;
					detail.Abrtg = oData.Abrtg;
					detail.Seqnr = oData.Seqnr;
					detail.Sprps = oData.Sprps;
					detail.AppName1 = oData.AppName; // 2021-05-11 결재자 사번
					
					if(oData.Delapp != "" && Flag == "D"){
						detail.Appkey = oData.ListAppkey;
						detail.Appkey1 = oData.ListAppkey1;
					} else {
						detail.Appkey = oData.Appkey ? oData.Appkey : "";
						detail.Appkey1 = oData.Appkey1 ? oData.Appkey1 : "";
					}
				
					createData.VacationApply1Nav.push(detail);
				
				oModel.create("/VacationApplySet", createData, {
					success: function(data, res){
						if(data){
							// 2021-05-04 리턴된 결재키 세팅
							if(data.VacationApply1Nav.results && data.VacationApply1Nav.results.length){
								oController._DetailJSonModel.setProperty("/Data/Appkey", data.VacationApply1Nav.results[0].Appkey);
								oController._DetailJSonModel.setProperty("/Data/Appkey1", data.VacationApply1Nav.results[0].Appkey1);
							}

							oUrl = data.EUrl;
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

				// 신청 시 팝업차단 여부 확인 후 이후 프로세스 수행				
				if(Flag == "C" && oUrl != ""){ //  && vExtyn == "" // 2021-05-07 결재 url이 리턴된 경우만 체크하여 결재창 오픈
					if(common.Common.openPopup.call(oController, oUrl) == false){
						return;
					}
				}
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				if(oData.Flag == "" && Flag == "C"){
					switch(oData.Awart){
						case "1501": // 본인결혼
						case "1502": // 자녀결혼
						case "1511": // 자녀출생
						case "1512": // 배우자사망
						case "1513": // 부친사망
						case "1514": // 모친사망
						case "1515": // 배우자 부친사망
						case "1516": // 배우자 모친사망
						case "1517": // 자녀사망
						case "1519": // 형제사망
						case "1520": // 자매사망
						case "1521": // 배우자형제사망
						case "1522": // 배우자자매사망
						case "1530": // 숭중상
						case "1537": // 형제결혼
						case "1538": // 자매결혼
						case "1539": // 배우자형제자매결혼
						case "1541": // 조부상
						case "1542": // 조모상
						case "1552": // 고희(부)
						case "1553": // 고희(모)
						case "1554": // 고희(배우자부)
						case "1555": // 고희(배우자모)
						case "1557": // 외조부사망
						case "1558": // 외조모사망
							sap.m.MessageBox.success(oController.getBundleText("MSG_48020"), { // 신청되었습니다. 경조금 신청을 위해 해당 화면으로 이동하시겠습니까?
								actions : ["YES", "NO"],
								onClose : function(fVal){
									if(fVal && fVal == "YES"){
										setTimeout(function(){
											parent._gateway.redirect($.app.getAuth() == $.app.Auth.HASS ? "CongratulationHASS.html" : "Congratulation.html");
										}, 100);
									} else {
										oController.onBack();
									}
								}
							});
							
							return;
							break;
					}
				}
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onBack
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			var confirmMessage = "", successMessage = "";
			if(oData.Flag == "" && Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
				successMessage = oController.getBundleText("MSG_48013"); // 신청되었습니다.
			} else if(oData.Flag == "D" && Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_48019"); // 삭제신청 하시겠습니까?
				successMessage = oController.getBundleText("MSG_48013"); // 신청되었습니다.
			} else {
				confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
				successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		// 근무일정 조회
		onPressSchedule : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			if(!oController._WorkScheduleDialog){
				oController._WorkScheduleDialog = sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.WorkSchedule", oController);
				oView.addDependent(oController._WorkScheduleDialog);
			}
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var date = oData.Begda ? new Date(oData.Begda) : new Date();
			
			var vData = {Data : {Pernr : oData.Pernr, Bukrs : oData.Bukrs, Molga : oData.Molga, Year : date.getFullYear(), Month : date.getMonth() + 1}};
			
			oController._WorkScheduleDialog.getModel().setData(vData);
			if(oController.addCalendar() == false) return;
			
			oController._WorkScheduleDialog.open();
		},
		
		onSetYearMonth : function(value){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var year = oController._WorkScheduleDialog.getModel().getProperty("/Data/Year");
			var month = oController._WorkScheduleDialog.getModel().getProperty("/Data/Month");
				month = month + value;
				
			if(month < 1){
				year = year - 1;
				month = 12;
			} else if(month > 12){
				year = year + 1;
				month = 1;
			}
			
			oController._WorkScheduleDialog.getModel().setProperty("/Data/Year", year);
			oController._WorkScheduleDialog.getModel().setProperty("/Data/Month", month);
			
			oController.addCalendar();
		},
		
		addCalendar : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			var oData = oController._WorkScheduleDialog.getModel().getProperty("/Data");
			
			oController._WorkScheduleDialog.destroyContent();
			oController._WorkScheduleDialog.addContent(sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.Calendar", oController));
			
			var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
			var createData = {PerScheduleNav : []};
				createData.IPernr = oData.Pernr;
				createData.IBukrs = oData.Bukrs;
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				createData.IMolga = oData.Molga;
				createData.IYear = oData.Year + "";
				createData.IMonth = (oData.Month >= 10 ? (oData.Month + "") : ("0" + oData.Month));
			
			oModel.create("/PernrScheduleSet", createData, {
				success: function(data, res){
					if(data){
						if(data.PerScheduleNav && data.PerScheduleNav.results){
							var data1 = data.PerScheduleNav.results;
							
							var month = (oData.Month >= 10 ? (oData.Month + "") : ("0" + oData.Month));
							
							for(var i=0; i<data1.length; i++){
								var id = oController.PAGEID + "_" + (oData.Year + month + data1[i].Indate);
								
								var oControl = sap.ui.getCore().byId(id);
								if(oControl == undefined) continue;
								
								var style = (data1[i].Tpr0a == "OFF" || data1[i].Tpr0a.substring(data1[i].Tpr0a.length-1) == "O") ? "color-info-red font-bold" : "color-darkgreen font-bold";
								
								var oMatrix = new sap.ui.commons.layout.MatrixLayout({
									columns : 1,
									width : "100%",
									rows : [new sap.ui.commons.layout.MatrixLayoutRow({
												height : "30px",
												cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															 content : [new sap.m.Text({text : parseInt(data1[i].Indate)})],
															 hAlign : "Center",
															 vAlign : "Middle"
														 })]
											}),
											new sap.ui.commons.layout.MatrixLayoutRow({
												height : "30px",		
												cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															 content : [new sap.m.Text({text : data1[i].Tpr0a}).addStyleClass(style)],
															 hAlign : "Center",
															 vAlign : "Middle"
														 })]
											})]
								});
								
								oControl.addContent(oMatrix);
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
				return false;
			}

		},
		
		makeColumn : function(oController, oTable, col_info){
			for(var i=0; i<col_info.length; i++){
				var oColumn = new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : false,
					sorted : false,
					hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
					width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : ""),
					multiLabels : [new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"})]
				});
				
				if(col_info[i].plabel != ""){
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}));
					oColumn.setHeaderSpan([col_info[i].span, 1]);
				}
				
				var oTemplate;
				
				switch(col_info[i].type){
					case "date":
						oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : col_info[i].id}, {path : "Offck"}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("color-red font-bold");
											if(fVal2 && fVal2 == "X"){
												this.addStyleClass("color-red font-bold");
											}
											
											if(fVal1){
												var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
												return dateFormat.format(fVal1);
											} else {
												return "";
											}
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
						break;
					case "pernr":
						oTemplate = new sap.m.Input({
	                                    width: "100%",
	                                    value: "{Awtxt}",
	                                    showValueHelp: true,
	                                    valueHelpOnly: true,
	                                    valueHelpRequest: function(oEvent){
	                                    	oController.searchOrgehPernr(oEvent, "X");
	                                    },
	                                    customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
	                                    editable : {
	                                    	parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
	                                    	formatter : function(fVal1, fVal2, fVal3){
	                                    		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
	                                    			if(fVal2 == "1" || fVal2 == "2"){
	                                    				return true;
	                                    			} else if(fVal3 == "X"){
	                                    				return true;
	                                    			} else {
	                                    				return false;
	                                    			}
	                                    		} else {
	                                    			return false;
	                                    		}
	                                    	}
	                                    }
	                                });
						break;
					case "time":
						oTemplate = new sap.ui.layout.HorizontalLayout({ 
										content : [new sap.m.TimePicker({
													   valueFormat : "HHmm",
													   displayFormat : "HH:mm",
											           value : "{Beguz}",
											           minutesStep : 10,
											           width : "100px", 
											           textAlign : "Begin",
					                                   editable : {
					                                    	parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
					                                    	formatter : function(fVal1, fVal2, fVal3){
					                                    		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
					                                    			if(fVal2 == "1" || fVal2 == "2"){
					                                    				return true;
					                                    			} else if(fVal3 == "X"){
					                                    				return true;
					                                    			} else {
					                                    				return false;
					                                    			}
					                                    		} else {
					                                    			return false;
					                                    		}
					                                    	}
					                                   },
					                                   customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
					                                   change : oController.onChangeTime
												   }),
												   new sap.m.TimePicker({
													   valueFormat : "HHmm",
													   displayFormat : "HH:mm",
											           value : "{Enduz}",
											           minutesStep : 10,
											           width : "100px", 
											           textAlign : "Begin",
					                                   editable : {
					                                    	parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
					                                    	formatter : function(fVal1, fVal2, fVal3){
					                                    		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
					                                    			if(fVal2 == "1" || fVal2 == "2"){
					                                    				return true;
					                                    			} else if(fVal3 == "X"){
					                                    				return true;
					                                    			} else {
					                                    				return false;
					                                    			}
					                                    		} else {
					                                    			return false;
					                                    		}
					                                    	}
					                                   },
					                                   customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
					                                   change : oController.onChangeTime
												   }).addStyleClass("pl-5px")]
									});
						break;
					case "link":
						oTemplate = new sap.m.Link({
										text : "{" + col_info[i].id + "}",
										press : oController.onDetail4,
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"}),
													  new sap.ui.core.CustomData({key : "", value : col_info[i].id})]
									});
						break;
					case "combobox":
						oTemplate = new sap.m.ComboBox({
										selectedKey : "{" + col_info[i].id + "}",
										width : "100%",
										editable : {
											path : "Status1",
											formatter : function(fVal){
												return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
											}
										},
										visible : {
											path : "Flag",
											formatter : function(fVal){
												return fVal == "A" ? true : false;
											}
										},
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										change : oController.onChangeCntgb,
										items : [new sap.ui.core.Item({key : "1", text : oController.getBundleText("LABEL_48042")}), // 1명
												 new sap.ui.core.Item({key : "2", text : oController.getBundleText("LABEL_48043")}), // 2명
												 new sap.ui.core.Item({key : "0", text : oController.getBundleText("LABEL_48044")})] // 없음
									});
						break;
					default:
						oTemplate = new sap.ui.commons.TextView({
										text : "{" + col_info[i].id + "}",
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center"
									});
				}
				
				oColumn.setTemplate(oTemplate);
				oTable.addColumn(oColumn);
			}
		},
		
		searchOrgehPernr : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();
			
			if(Flag && Flag == "X"){
				oController.oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				oController.oData = null;
			}
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: "",
                autoClose : false
            },
            callback = function(o) {
				var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
				var oController = oView.getController();
				
				if(o.Otype == "O"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48016")); // 대상자를 선택하여 주십시오.
					return;
				}
			
    			if(oController.oData){ // 대근신청 - 대근자 변경
    				var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel();
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awper", o.Objid);
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awtxt", o.Stext);
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Ligbn", ""); // 한도체크 여부 초기화
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/LigbnTx", "");
    			} else { // 대상자 변경
    				oController.onPressSearch(null, o.Objid);
    			}
    			
    			oController.OrgOfIndividualHandler.getDialog().close();
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},

		/**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.Detail");
			var oController = oView.getController();

			if(oController.oData){ // 대근신청 - 대근자 변경
				var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel();
					oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awper", data.Pernr);
					oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awtxt", data.Ename);
					oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Ligbn", ""); // 한도체크 여부 초기화
					oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/LigbnTx", "");
			} else { // 대상자 변경
				oController.onPressSearch(null, data.Pernr);
			}

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35110335"});
			return new JSONModelHelper({name: "20180126"});
			return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});