jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"],
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_EvalComp.Detail", {
	
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
			
			oController.FromPageId = oEvent.data.FromPageId ? oEvent.data.FromPageId : "ZUI5_HR_EvalComp.List";
			
			var oData = {Data : {}};
			
			if(oEvent.data){
				oData.Data = oEvent.data.Data;
				
				oData.Data.Ylgupt = ""; // title
				oData.Data.Weight = ""; // 가중치
				oData.Data.Zeropn = ""; // 평가자 의견
				oData.Data.Point1 = 0; // 전체합계
				
				// 평가진행상태
				if(oData.Data.Apstat == "31"){
					if(oData.Data.Apstatus == "01" || oData.Data.Apstatus == "02"){
						var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
						if((parseInt(dateFormat.format(oData.Data.AppBegda)) <= parseInt(dateFormat.format(new Date()))) && 
							parseInt(dateFormat.format(oData.Data.AppEndda)) >= parseInt(dateFormat.format(new Date()))){
							oData.Data.Editable = true;
						} else {
							oData.Data.Editable = false;
						}
					} else {
						oData.Data.Editable = false;
					}
				} else {
					oData.Data.Editable = false;
				}
			}
			
			oController._DetailJSonModel.setData(oData);
			
			// 테이블 초기화
			sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().setData(null);
			sap.ui.getCore().byId(oController.PAGEID + "_Table").setVisibleRowCount(1);
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.Detail");
			var oController = oView.getController();
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController.FromPageId,
			      data : {}
			});
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.Detail");
			var oController = oView.getController();
			
			var search = function(){
				var oData = oController._DetailJSonModel.getProperty("/Data");
				
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel = oTable.getModel();
				var vData = {Data : []};
				
				var createData = {TableIn1 : [], TableIn2 : [], TableIn3 : [], TableIn4 : [], TableIn5 : []};
					createData.IBukrs = oData.Bukrs;
					createData.IApyear = oData.Apyear;
					createData.IAptype = oData.Aptype;
					createData.IApcnt = oData.Apcnt;
					createData.IEePernr = oData.EePernr;
					createData.IApcha = oData.Apcha;
				
				var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL2_SRV");
				oModel.create("/ApAppCompSet", createData, null,
					function(data, res){
						if(data){
							if(data.TableIn1 && data.TableIn1.results){
								for(var i=0; i<data.TableIn1.results.length; i++){
									if(i==0){
										oController._DetailJSonModel.setProperty("/Data/Ylgupt", data.TableIn1.results[i].Ylgupt);
										oController._DetailJSonModel.setProperty("/Data/Weight", parseFloat(data.TableIn1.results[i].Weight));
									}
									
									data.TableIn1.results[i].Idx = i;
									data.TableIn1.results[i].Editable = oData.Editable;
									data.TableIn1.results[i].Goal2 = parseFloat(data.TableIn1.results[i].Goal2) == 0 ? "" : (parseFloat(data.TableIn1.results[i].Goal2) + "");
										
									if(data.TableIn2 && data.TableIn2.results){
										for(var j=0; j<data.TableIn2.results.length; j++){
											if(data.TableIn1.results[i].Tabnr1 == data.TableIn2.results[j].Tabnr){
												data.TableIn1.results[i].Tabseqnr = data.TableIn2.results[j].Tabseqnr;
												data.TableIn1.results[i].Text1 = data.TableIn2.results[j].Tline;
											}
										}
									}
									
									if(data.TableIn3 && data.TableIn3.results){
										for(var j=0; j<data.TableIn3.results.length; j++){
											if(data.TableIn1.results[i].Tabnr2 == data.TableIn3.results[j].Tabnr){
												data.TableIn1.results[i].Text2 = data.TableIn3.results[j].Tline;
											}
										}
									}
										
									vData.Data.push(data.TableIn1.results[i]);
								}
							}
							
							if(data.TableIn5 && data.TableIn5.results && data.TableIn5.results.length){
								oController._DetailJSonModel.setProperty("/Data/Zeropn", data.TableIn5.results[0].Zeropn);
								oController._DetailJSonModel.setProperty("/Data/Point1", parseFloat(data.TableIn5.results[0].Point1) == 0 ? "0" : data.TableIn5.results[0].Point1);
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				oTable.setVisibleRowCount((vData.Data.length >= 10) ? 10 : vData.Data.length);
				
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
		
		// 합계
		onSetTotal : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.Detail");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
			
			var oPoint1 = 0;
			// (점수 / 역량개수) * (가중치 / 100)
			for(var i=0; i<oData.length; i++){
				var oCalcP2 = 0;
					oCalcP2 = ((oData[i].Goal2 * 1) / oData.length) * (parseFloat(oController._DetailJSonModel.getProperty("/Data/Weight")) / 100);
					oCalcP2 = oCalcP2.toFixed(3);
					
				oJSONModel.setProperty("/Data/" + i + "/CalcP2", oCalcP2);
				
				oPoint1 = oPoint1 + (parseFloat(oCalcP2));
			}
			
			oController._DetailJSonModel.setProperty("/Data/Point1", oPoint1.toFixed(3));
		},
		
		// Flag : S 저장 C 완료
		onPressSave : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalComp.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oData2 = oTable.getModel().getProperty("/Data");
			
			// validation check
			for(var i=0; i<oData2.length; i++){
				if(oData2[i].Goal2 == ""){
					sap.m.MessageBox.error(oData2[i].Ylgupt + " - " + oData2[i].Zobjtx + " " + oBundleText.getText("MSG_26007")); // OOO-OO 역량을 평가하여 주십시오.
					return;
				}
			}
			
			var process = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL2_SRV");
				var createData = {TableIn1 : [], TableIn2 : []};
					createData.IBukrs = oData.Bukrs;
					createData.IApyear = oData.Apyear;
					createData.IAptype = oData.Aptype;
					createData.IApcnt = oData.Apcnt;
					createData.IEePernr = oData.EePernr;
					createData.IPernr = oData.ErPernr;
					createData.IEdPernr = oData.EdPernr;
					
				for(var i=0; i<oData2.length; i++){
					var detail = {};
						detail.Zobjid = oData2[i].Zobjid;
						detail.Goal = oData2[i].Goal2;
						detail.CalcP = oData2[i].CalcP2;
						
					createData.TableIn1.push(detail);
				}
				
					var detail = {};
						detail.Zeropn = oData.Zeropn;
						detail.CalcP = oData.Point1;                         
						detail.Apstat = Flag == "S" ? oData.Apstatus : "03";
						detail.Apstat1 = oData.Apstat;
					
					createData.TableIn2.push(detail);
					
				oModel.create("/ApAppCompUSet", createData, null,
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
				
				sap.m.MessageBox.success(successMessage, {
					onClose : function(){
						if(Flag == "C"){
							oController.onBack();
						}
					}
				});
			};
			
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
			};
			
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
					case "select":
						oColumn.setHAlign("Begin");
						oTemplate = new sap.m.Select({
										selectedKey : "{" + col_info[i].id +"}",
										width : "100%",
										items : [new sap.ui.core.Item({key : "", text : oBundleText.getText("LABEL_00181")}), // 선택
												 new sap.ui.core.Item({key : "5", text : "5"}),
												 new sap.ui.core.Item({key : "4", text : "4"}),
												 new sap.ui.core.Item({key : "3", text : "3"}),
												 new sap.ui.core.Item({key : "2", text : "2"}),
												 new sap.ui.core.Item({key : "1", text : "1"})],
										change : oController.onSetTotal,
										editable : "{Editable}"
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
			return new JSONModelHelper({name: "911105"});
		} : null
		
	});

});