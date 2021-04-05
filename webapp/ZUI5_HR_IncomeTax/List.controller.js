/* global moment:true */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/moment-with-locales",
    "../common/SearchUser1",
    "../common/SearchOrg",
    "../common/DialogHandler",
    "../common/OrgOfIndividualHandler",
	"sap/base/util/UriParameters",
	"sap/ui/model/json/JSONModel",
	"../common/EmployeeModel",
], function(Common, CommonController, momentjs, SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, UriParameters, JSONModel,EmployeeModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 

	PAGEID: "",
	_DetailJSonModel : new JSONModel(),
	EmployeeModel: new EmployeeModel(),
	_BusyDialog : new sap.m.BusyDialog(),
	
	onInit: function() {
		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
	},
	
	onAfterShow: function() {
		var oController = $.app.getController();
		this.EmployeeModel.retrieve(oController.getView().getModel("session").getData().name);
		oController.onPressSearch();
	},

	onPressSearch : function(){
		var oController = $.app.getController();
		var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
		var vData = { Data : {} , Itpct : [] }; 
		
		var oItpct = $.app.byId(oController.PAGEID + "_Itpct");
		oItpct.destroyButtons();
		
		
		var search = function(){
			var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt});
			var oPath = "",
			    vApitpctIdx = -1;
			var createData = {IncomeTax1Nav : [],
							  IncomeTax2Nav : []};
			
			oPath = "/IncomeTaxSet";
			createData.IConType =   "1"; 
			createData.IPernr =  oController.getView().getModel("session").getData().Pernr;
			createData.ILangu =  oController.getView().getModel("session").getData().Langu;
			createData.IEmpid =  oController.getView().getModel("session").getData().Pernr;
			createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
				
			oModel.create(oPath, createData, null,
				function(data, res){
					if(data){
						if(data.IncomeTax1Nav && data.IncomeTax1Nav.results.length > 0){
							vData.Data = data.IncomeTax1Nav.results[0];
							
							vData.Data.Apbeg =  vData.Data.Apbeg && vData.Data.Apbeg != "" ? 
							                    dateFormat.format(new Date(common.Common.setTime(vData.Data.Apbeg))) :
							                    null;
	                    	vData.Data.Apend =  vData.Data.Apend && vData.Data.Apend != "" ? 
							                    dateFormat.format(new Date(common.Common.setTime(vData.Data.Apend))) :
							                    null;
		                    vData.Data.Begda =  vData.Data.Begda && vData.Data.Begda != "" ? 
							                    dateFormat.format(new Date(common.Common.setTime(vData.Data.Begda))) :
							                    null;
	                    	vData.Data.Endda =  vData.Data.Endda && vData.Data.Endda != "" ? 
							                    dateFormat.format(new Date(common.Common.setTime(vData.Data.Endda))) :
							                    null;
							vData.Data.Period = vData.Data.Apbeg + " ~ " + vData.Data.Apend;
						}
						if(data.IncomeTax2Nav && data.IncomeTax2Nav.results.length > 0){
							for(var i = 0; i < data.IncomeTax2Nav.results.length; i++){
								if(vData.Data.Apitpct == data.IncomeTax2Nav.results[i].Itpct ){
									vApitpctIdx = i;
								}
								vData.Itpct.push(data.IncomeTax2Nav.results[i]);
								oItpct.addButton(
									new sap.m.RadioButton({
                                        text: data.IncomeTax2Nav.results[i].Itpctx,
                                        width: "auto",
                                        selected: {
                                            path: "Result",
                                            formatter: function(v) {
                                                if(v == i) return true;
                                                else return false;
                                            }
                                        },
                                    })
								);
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
			
			oController._DetailJSonModel.setProperty("/Data",vData.Data);
			oController._DetailJSonModel.setProperty("/Itpct",vData.Itpct);
			if(vApitpctIdx != -1){
				oItpct.setSelectedIndex(vApitpctIdx);
			}
			
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
	
	onPressSave : function(){
		var oController = $.app.getController();
		var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
		var oItpct = $.app.byId(oController.PAGEID + "_Itpct"),
			vItpctIndex = oItpct.getSelectedIndex();
		
		if(vItpctIndex == -1){
			// 근로소득세을 선택 후 신청하시기 바랍니다.
			sap.m.MessageBox.error(oController.getBundleText("MSG_58001"));
			return;
		}
		 
		var create = function(){
			var oPath = "";
			var createData = {IncomeTax1Nav : []};
			var detailData = {};
			
			oPath = "/IncomeTaxSet";
			createData.IConType = "2";
			createData.IEmpid = oController.getView().getModel("session").getData().Pernr;
			createData.IPernr = oController.getView().getModel("session").getData().Pernr;
			
			detailData.Pernr = oController.getView().getModel("session").getData().Pernr;  
			detailData.Apitpct = oController._DetailJSonModel.getProperty("/Itpct")[vItpctIndex].Itpct ;
			detailData.Apbeg = "\/Date(" + common.Common.getTime(new Date(oController._DetailJSonModel.getProperty("/Data/Apbeg"))) + ")\/";
			detailData.Apend = "\/Date(" + common.Common.getTime(new Date(oController._DetailJSonModel.getProperty("/Data/Apend"))) + ")\/";
			createData.IncomeTax1Nav.push(detailData);
			var oModel = sap.ui.getCore().getModel("ZHR_PAY_RESULT_SRV");
			oModel.create(oPath, createData, null,
				function(data, res){
					if(data){
						
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
			)
			
			oController._BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			sap.m.MessageBox.alert( oController.getBundleText("MSG_45002"), {
				title: oController.getBundleText("LABEL_00149"),
				onClose: function () {
					// Data setting
		            oController.onPressSearch();
				}
			});
			
		}
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController._BusyDialog.open();
				setTimeout(create, 100);
			}
		}	
		
		sap.m.MessageBox.confirm( oController.getBundleText("MSG_17003"),{ // 신청하시겠습니까?
			title : oController.getBundleText("LABEL_02053") ,	// 확인
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});	
	},

	
	getLocalSessionModel: Common.isLOCAL() ? function() {
		return new JSONModel({name: "20140099"}); // 
		// return new JSONModel({name: "35132258"}); // 첨단
		// return new JSONModel({name: "35132259"}); // 첨단
		// return new JSONModel({name: "35132260"}); // 첨단
		// return new JSONModel({name: "35132261"}); // 첨단
		// return new JSONModel({name: "981014"}); // 기초
		// return new JSONModel({name: "991002"}); // 기초
		// return new JSONModel({name: "991004"}); // 기초
		// return new JSONModel({name: "8900366"}); // 기초
		// return new JSONModel({name: "8903376"}); // 기초
		// return new JSONModel({name: "9000290"}); // 기초
	} : null

});

});