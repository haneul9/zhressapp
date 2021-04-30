jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_EvalComp.List", {

		PAGEID: "EvalCompList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Bukrs : "",
		
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
			
			if(!oController._ListCondJSonModel.getProperty("/Data")){
				var oPhoto = "";
				
				new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + oController.getView().getModel("session").getData().Pernr + "' and photoType eq '1'")
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
							 
				var vData = {
					Data : Object.assign({photo : oPhoto, Apyear : new Date().getFullYear() + ""}, oController.getView().getModel("session").getData())
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.handleIconTabBarSelect(oEvent);
		},
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			
			eval("oController.onPressSearch" + sKey + "();")
		},
		
		// 역량평가(1차)
		onPressSearch1 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++){
				oColumns[i].setFiltered(false);
				oColumns[i].setSorted(false);
			}
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oData.Dtfmt});
				var createData = {TableIn1 : []};
					createData.IErPer = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.IApyear = oData.Apyear;
					createData.IApcnt = "3";
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
					createData.IAptype = "22";
					createData.IApcha = "21";
					createData.IMtype = "M";
					createData.IContType = "1";
					createData.IScore = "X";

				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApHeaderSet", createData, {
					success: function(data, res){
						if(data){
							if(data.TableIn1 && data.TableIn1.results && data.TableIn1.results.length){
								for(var i=0; i<data.TableIn1.results.length; i++){
									data.TableIn1.results[i].AppBegda = new Date(common.Common.setTime(data.TableIn1.results[i].AppBegda));
									data.TableIn1.results[i].AppEndda = new Date(common.Common.setTime(data.TableIn1.results[i].AppEndda));
									
									data.TableIn1.results[i].Period = dateFormat.format(data.TableIn1.results[i].AppBegda) + " ~ " + dateFormat.format(data.TableIn1.results[i].AppEndda);
									
									vData.Data.push(data.TableIn1.results[i]);
								}
							}
						}
					},
					error:function (oError) {
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
				oTable.bindRows("/Data");
				oTable.setVisibleRowCount((vData.Data.length >= 10) ? 10 : vData.Data.length);
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 대리자 지정
		onOpenSearchTable : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
		
			var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oIndices = oTable1.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_26001")); // 대리평가자를 지정할 피평가자를 선택하여 주십시오.
				return;
			}
			
			if(!oController._SearchDialog){
				oController._SearchDialog = sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.Search", oController);
				oView.addDependent(oController._SearchDialog);
			}
			
			// Dialog 초기화
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchTable");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
			oTable.setVisibleRowCount(1);
			
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++){
				oColumns[i].setFiltered(false);
				oColumns[i].setSorted(false);
			}
			
			// 리스트에서 선택한 대상자
			var oEePernr = [], vData2 = {};
			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable1.getContextByIndex(oIndices[i]).sPath;
				
				oEePernr.push(oTable1.getModel().getProperty(sPath + "/EePernr"));
				
				if(i == 0){
					vData2.Apyear = oTable1.getModel().getProperty(sPath + "/Apyear");
					vData2.Aptype = oTable1.getModel().getProperty(sPath + "/Aptype");
					vData2.Apcnt = oTable1.getModel().getProperty(sPath + "/Apcnt");
					vData2.Apcha = oTable1.getModel().getProperty(sPath + "/Apcha");
					vData2.Bukrs = oTable1.getModel().getProperty(sPath + "/Bukrs");
				}
			}
				vData2.EePernr = oEePernr;
				vData2.Key = "1";
				vData2.Text = "";
			
			oController._SearchDialog.getModel().setData({Data : vData2});
			
			oController._SearchDialog.open();
		},
		
		// 대리자 검색
		onSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oData = oController._SearchDialog.getModel().getProperty("/Data");
			if(oData.Text.trim() == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_00037")); // 검색어를 입력해 주시기 바랍니다.
				return;
			}
			
			var search = function(){
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchTable");
				var oJSONModel = oTable.getModel();
				var vData = {Data : []};
				
				var createData = {TableIn : []};
					createData.IPernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.IBukrs = oController._ListCondJSonModel.getProperty("/Data/Bukrs");
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
					createData.ILangu = "3";
					
				if(oData.Key == "1"){ // 사원
					createData.IText = oData.Text;
				} else { // 부서
					createData.IOrgtx = oData.Text;
				}
				
				var oModel = $.app.getModel("ZHR_COMMON_SRV");
				oModel.create("/F4PernrAuthSet", createData, {
					success: function(data, res){
						if(data){
							if(data.TableIn && data.TableIn.results && data.TableIn.results.length){
								for(var i=0; i<data.TableIn.results.length; i++){
									vData.Data.push(data.TableIn.results[i]);
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
				oTable.bindRows("/Data");
				oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 대리자 선택
		onSaveSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oData = oController._SearchDialog.getModel().getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchTable");
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length != 1){
				sap.m.MessageBox.error(oBundleText.getText("MSG_26005")); // 대리평가자를 한명만 선택하여 주십시오.
				return;
			}
			
			var process = function(){
				var createData = {TableIn : []};
				for(var i=0; i<oData.EePernr.length; i++){
					var detail = {};
						detail.Bukrs = oData.Bukrs;
						detail.Apyear = oData.Apyear;
						detail.Aptype = oData.Aptype;
						detail.Apcnt = oData.Apcnt;
						detail.Apcha = oData.Apcha;
						detail.EePernr = oData.EePernr[i];
						detail.EdPernr = oTable.getModel().getProperty(oTable.getContextByIndex(oIndices[0]).sPath + "/Pernr");
						
					createData.TableIn.push(detail);
				}
				
				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApSubappSet", createData, {
					success: function(data, res){
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_26002"), { // 대리평가자를 지정하였습니다.
					onClose : function(){
						oController._SearchDialog.close();
						oController.onPressSearch1();
					}
				});
			}
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(process, 100);
				}
			}
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_26006"),{ // 대리평가자를 지정하시겠습니까?
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		// 대리자 삭제
		onPressDelete : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_26003")); // 대리평가자를 삭제할 피평가자를 선택하여 주십시오.
				return;
			}
			
			var process = function(){
				var createData = {TableIn : []};
				for(var i=0; i<oIndices.length; i++){
					var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
					var oData = oTable.getModel().getProperty(sPath);
					
					var detail = {};
						detail.Bukrs = oData.Bukrs;
						detail.Apyear = oData.Apyear;
						detail.Aptype = oData.Aptype;
						detail.Apcnt = oData.Apcnt;
						detail.Apcha = oData.Apcha;
						detail.EePernr = oData.EePernr;
						detail.EdPernr = "";		
					
					createData.TableIn.push(detail);
				}
				
				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApSubappSet", createData, {
					success: function(data, res){
						if(data){
							
						}
					},
					error:function (oError) {
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
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_26011"), { // 대리평가자를 삭제하였습니다.
					onClose : oController.onPressSearch1
				});
			}
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(process, 100);
				}
			}
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_26010"), { // 대리평가자를 삭제하시겠습니까?
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		onPressTable : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oData;
		
			if(Flag && Flag == "X"){
				oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				var sPath = oEvent.getParameters().rowBindingContext.sPath;
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
				
				oData = oTable.getModel().getProperty(sPath);
			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_EvalComp.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_EvalComp.List",
			    	  Data : oData
			      }
			});
		},
		
		// 역량평가(2차)
		onPressSearch2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var search = function(){
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				
				var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
				var oJSONModel2 = oTable2.getModel();
				var vData2 = {Data : []};
				
				var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
				var oJSONModel3 = oTable3.getModel();
				var vData3 = {Data : []};
				
				var oColumns = oTable3.getColumns();
				for(var i=0; i<oColumns.length; i++){
					oColumns[i].setFiltered(false);
					oColumns[i].setSorted(false);
				}
				
				var createData = {TableIn1 : [], TableIn2 : [], Export : []};
					createData.IConType = "1"; 
					createData.IPernr = oData.Pernr;
					createData.IApyear = oData.Apyear;
					createData.IBukrs = oData.Bukrs;
					createData.IAptype = "22";
					createData.IApgup = "50";
					createData.IApcnt = "3";
					
				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApGrade2Set", createData, {
					success: function(data, res){
						if(data){
							// 평가인원 summary
							if(data.TableIn2 && data.TableIn2.results && data.TableIn2.results.length){
								vData2.Data.push(data.TableIn2.results[0]);
							}
							
							if(data.Export && data.Export.results && data.Export.results.length){
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oData.Dtfmt});
								
								oController._ListCondJSonModel.setProperty("/Data/Begda", dateFormat.format(new Date(common.Common.setTime(data.Export.results[0].Begda))));
								oController._ListCondJSonModel.setProperty("/Data/Endda", dateFormat.format(new Date(common.Common.setTime(data.Export.results[0].Endda))));
								oController._ListCondJSonModel.setProperty("/Data/EditMode", data.Export.results[0].EditMode);
							}
							
							if(data.TableIn1 && data.TableIn1.results){
								for(var i=0; i<data.TableIn1.results.length; i++){
									data.TableIn1.results[i].EditMode = oController._ListCondJSonModel.getProperty("/Data/EditMode");
									
									vData3.Data.push(data.TableIn1.results[i]);
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
				// oTable2.bindRows("/Data");
				
				oJSONModel3.setData(vData3);
				oTable3.bindRows("/Data");
				oTable3.setVisibleRowCount((vData3.Data.length >= 10) ? 10 : vData3.Data.length);
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController._ListCondJSonModel.setProperty("/Data/Begda", null);
					oController._ListCondJSonModel.setProperty("/Data/Endda", null);
					oController._ListCondJSonModel.setProperty("/Data/EditMode", "");
								
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 2차: 등급변경 시 summary 데이터 필드값 변경
		onChangeCalcD : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel2 = oTable2.getModel();
			
			var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oData3 = oTable3.getModel().getProperty("/Data");
			
			var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0;
			for(var i=0; i<oData3.length; i++){
				switch(oData3[i].CalcD){
					case "0005":
						count5++;
						break;
					case "0004":
						count4++;
						break;
					case "0003":
						count3++;
						break;
					case "0002":
						count2++;
						break;
					case "0001":
						count1++;
						break;
				}
			}
			
			oJSONModel2.setProperty("/Data/0/Clas5A", count5);
			oJSONModel2.setProperty("/Data/0/Clas4A", count4);
			oJSONModel2.setProperty("/Data/0/Clas3A", count3);
			oJSONModel2.setProperty("/Data/0/Clas2A", count2);
			oJSONModel2.setProperty("/Data/0/Clas1A", count1);
		},
		
		// Flag: S 저장, C 완료
		onPressSave2 : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oData = oTable.getModel().getProperty("/Data");
			
			var createData = {TableIn1 : [], TableIn2 : []};
			for(var i=0; i<oData.length; i++){
				var detail = {};
					detail.EePernr = oData[i].EePernr;
					detail.CalcD = oData[i].CalcD;
				
				createData.TableIn1.push(detail);	
				
				if(Flag == "C" && oData[i].CalcD == ""){
					sap.m.MessageBox.error(oBundleText.getText("MSG_26012")); // 평가등급을 선택하여 주십시오.
					return;
				}	
			}
			
			if(Flag == "C"){
				// D 제외 배분율 인원 초과 여부 확인
				var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data/0");
				var field = ["Clas5A", "Clas4A", "Clas3A", "Clas2A"];
				for(var i=0; i<field.length; i++){
					var field1 = eval("oData2." + field[i]); // 등급부여인원
					var field2 = eval("oData2." + (field[i].substring(0, field[i].length-1))); // 배분율인원
					
					if(field1 > field2){
						sap.m.MessageBox.error(oBundleText.getText("MSG_26013")); // 등급별 부여 인원을 확인하시기 바랍니다.
						return;
					}
				}
			}
			
			var process = function(){
				createData.IConType = (Flag == "S" ? "2" : "3");
				createData.IPernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
				createData.IApyear = oController._ListCondJSonModel.getProperty("/Data/Apyear");
				createData.IBukrs = oController._ListCondJSonModel.getProperty("/Data/Bukrs");
				createData.IAptype = "22";
				createData.IApgup = "50";
				createData.IApcnt = "3";
				
				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApGrade2Set", createData, {
					success: function(data, res){
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onPressSearch2
				});
			}
			
			var confirmMessage = "", successMessage = "";
			if(Flag == "S"){
				confirmMessage = oBundleText.getText("MSG_00058"); // 저장하시겠습니까?
				successMessage = oBundleText.getText("MSG_00017"); // 저장되었습니다.
			} else {
				confirmMessage = oBundleText.getText("MSG_26008"); // 완료하시겠습니까?
				successMessage = oBundleText.getText("MSG_26009"); // 완료되었습니다.
			}
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(process, 100);
				}
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
			
		},
		
		makeColumn : function(oController, oTable, col_info){
			if(!oController || !oTable || !col_info) return;
			
			for(var i=0; i<col_info.length; i++){
				var oColumn = new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : col_info[i].filter,
					sorted : col_info[i].sort,
					hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
					width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : ""),
					multiLabels : [new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"})]
				});
				
				if(col_info[i].plabel != ""){
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}));
					oColumn.setHeaderSpan([col_info[i].span, 1]);
				}
				
				if(col_info[i].sort){
					oColumn.setSortProperty(col_info[i].id);
				}
				
				if(col_info[i].filter){
					oColumn.setFilterProperty(col_info[i].id);
				}
				
				var oTemplate;
				
				switch(col_info[i].type){
					case "select":
						oColumn.setHAlign("Begin");
						oTemplate = new sap.m.Select({
										selectedKey : "{" + col_info[i].id +"}",
										width : "100%",
										items : [new sap.ui.core.Item({key : "", text : oBundleText.getText("LABEL_00181")}), // 선택
												 new sap.ui.core.Item({key : "0005", text : "S"}),
												 new sap.ui.core.Item({key : "0004", text : "A"}),
												 new sap.ui.core.Item({key : "0003", text : "B"}),
												 new sap.ui.core.Item({key : "0002", text : "C"}),
												 new sap.ui.core.Item({key : "0001", text : "D"})],
										change : oController.onChangeCalcD,
										editable : {
											path : "EditMode",
											formatter : function(fVal){
												return fVal == "X" ? true : false;
											}
										}
									});
						break;
					case "string2":
						oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : col_info[i].id}, {path : (col_info[i].id.substring(0, col_info[i].id.length-1))}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("FontRed");
											
											if(fVal1 > fVal2){
												this.addStyleClass("FontRed");
											}
											
											return fVal1;
										}
									},
									textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center"
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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20120220"});
			// return new JSONModelHelper({name: "931006"});
			return new JSONModelHelper({name: "991004"});
		} : null
		
	});

});