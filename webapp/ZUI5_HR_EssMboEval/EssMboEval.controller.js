jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/EmployeeModel"], 
	function (Common, CommonController, JSONModelHelper, PageHelper,EmployeeModel) {
	"use strict";

	return CommonController.extend("ZUI5_HR_EssMboEval.EssMboEval", {

		PAGEID: "EssMboEval",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Docid : "",
		_Bukrs : "",
		_Zhgrade : "",
		EmployeeModel: new EmployeeModel(),
		_SheetData :{TableIn2:{results:[]},
					 TableIn4:{results:[]}},
		_PreData : {},
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
			
		},
		
		loadModel : function(oController) {
			var oServiceURL = oController.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
			var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
			oModel.setCountSupported(false);
			oModel.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModel, "ZHR_COMMON_SRV");
			var oServiceURL2 = oController.getUrl("/sap/opu/odata/sap/ZHR_APPRAISAL2_SRV/");
			var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
			oModel2.setCountSupported(false);
			oModel2.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModel2, "ZHR_APPRAISAL2_SRV");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			this._ListCondJSonModel.setData({Data:oController.getView().getModel("session").getData()});
			sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("1");	
			oController.getPreData(oController);			
			oController.handleIconTabBarSelect();			
			
		},

		getPreData : function(oController){
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			oController._SessionData=oController.getView().getModel("session").getData();
			var oSessionData=oController._SessionData;
			var vData={IOdkey:"",
				IBukrs:oSessionData.Bukrs,
				IAppyr:String(new Date().getFullYear()),
				IAptyp:oSessionData.Aptyp,
				IOptio:oSessionData.Optio,
				TableIn:[]
				};
			
			oModel.create("/AppraisalListSet", vData, {
				success: function(data,res){
					if(data&&data.TableIn.results){
						oController._PreData=data.TableIn.results[0];
						$.app.byId(oController.PAGEID+"_ToolTxt1").setText(oController._PreData.Appnm);
					}
				},
				error: function (oError) {
					var Err = {};						
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.alert(oError.toString());
					}
				}
			});
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
		},
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EssMboEval.EssMboEval");
			var oController = oView.getController();
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			switch (sKey) {
				case "1":
					oController.bindData1(oController);
					break;			
				default:
					oController.bindData2(oController);
					break;
			}

		},

		getHeaderData : function(oController,vApprc){
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;
			var oSel,sData=new Array();
			var vData={
				IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IMolga:oSessionData.Molga,
				IEmpid:oSessionData.Pernr,
				IPernr:oSessionData.Pernr,
				IAppid:oPreData.Appid,
				IAporg:"",
				IApprc:vApprc,
				IDatum:oPreData.Apbdt,
				ILangu:oSessionData.Langu,
				TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[],TableIn5:[],TableIn6:[]};
			if(vApprc=="40"){
				oSel=$.app.byId(oController.PAGEID+"_Sel1");
				oSel.removeAllItems();
				oSel.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
			}
			
			oModel.create("/AppraisalHeaderSet", vData, {
				success: function(data,res){
					if(vApprc=="01"){
						if(data&&data.TableIn1.results.length){						
							data.TableIn1.results[0].Appr1=="00000000"?$.app.byId(oController.PAGEID+"_1stP").setValue():$.app.byId(oController.PAGEID+"_1stP").setValue(data.TableIn1.results[0].Appr1);
							data.TableIn1.results[0].Appr2=="00000000"?$.app.byId(oController.PAGEID+"_2ndP").setValue():$.app.byId(oController.PAGEID+"_2ndP").setValue(data.TableIn1.results[0].Appr2);
							data.TableIn1.results[0].Appr3=="00000000"?$.app.byId(oController.PAGEID+"_3rdP").setValue():$.app.byId(oController.PAGEID+"_3rdP").setValue(data.TableIn1.results[0].Appr3);
							if(data.TableIn1.results[0].Appr1!="00000000"){
								$.app.byId(oController.PAGEID+"_1stPD").setValue(data.TableIn1.results[0].EnameP2 + "(" + data.TableIn1.results[0].OrgtxP2 + ", " + data.TableIn1.results[0].TitelP2 + ", " + data.TableIn1.results[0].Titl2P2 + ")");
							}else{
								$.app.byId(oController.PAGEID+"_1stPD").setValue();
							}
							if(data.TableIn1.results[0].Appr2!="00000000"){
								$.app.byId(oController.PAGEID+"_2ndPD").setValue(data.TableIn1.results[0].EnameP3 + "(" + data.TableIn1.results[0].OrgtxP3 + ", " + data.TableIn1.results[0].TitelP3 + ", " + data.TableIn1.results[0].Titl2P3 + ")");
							}else{
								$.app.byId(oController.PAGEID+"_2ndD").setValue();
							}
							if(data.TableIn1.results[0].Appr3!="00000000"){
								$.app.byId(oController.PAGEID+"_3rdPD").setValue(data.TableIn1.results[0].EnameP4 + "(" + data.TableIn1.results[0].OrgtxP4 + ", " + data.TableIn1.results[0].TitelP4 + ", " + data.TableIn1.results[0].Titl2P4 + ")");
							}else{
								$.app.byId(oController.PAGEID+"_3rdD").setValue();
							}
							oController._Docid=data.TableIn1.results[0].Docid;
						}
					}else{
						if(data&&data.TableIn1.results.length){
							oController._Zhgrade=data.TableIn1.results[0].ZzhgradeP1;
							if(data.TableIn1.results[0].Apstu=="40"){
								$.app.byId(oController.PAGEID+"_TextA1").setEditable(true)
								$.app.byId(oController.PAGEID+"_TextA2").setEditable(true)
								$.app.byId(oController.PAGEID+"_Sel1").setEnabled(true);
								$.app.byId(oController.PAGEID+"_Save").setVisible(true);
								$.app.byId(oController.PAGEID+"_Finish").setVisible(true);
							}else{
								$.app.byId(oController.PAGEID+"_TextA1").setEditable(false)
								$.app.byId(oController.PAGEID+"_TextA2").setEditable(false)
								$.app.byId(oController.PAGEID+"_Sel1").setEnabled(false);
								$.app.byId(oController.PAGEID+"_Save").setVisible(false);
								$.app.byId(oController.PAGEID+"_Finish").setVisible(false);
							}		
							oController._Docid=data.TableIn1.results[0].Docid;					
						}
						if(data&&data.TableIn2.results.length){						
							sData=data.TableIn2.results;						
						}
					}
				},
				error: function (oError) {
					var Err = {};						
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.alert(oError.toString());
					}
				}
			});
			
			sData.forEach(function(e){
				if(oController._Zhgrade=="13"){
					if(e.Code=="0006"||e.Code=="0007"||e.Code=="0008"){
						oSel.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
					}
				}else{
					if(e.Code=="0001"||e.Code=="0002"||e.Code=="0003"||e.Code=="0004"||e.Code=="0005"){
						oSel.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
					}
				}				
			});	
		},

		bindData1 : function(oController){
			oController.getHeaderData(oController,"01");
		},

		bindData2 : function(oController){
			oController.getHeaderData(oController,"40");
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;
			var vData={IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IAppid:oPreData.Appid,
				IDocid:oController._Docid,
				IPernr:oSessionData.Pernr,
				IApprc:"40",
				IGolst:"",
				ILangu:oSessionData.Langu,
				TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
				};
			
			oModel.create("/AppraisalMboSheetSet", vData, {
				success: function(data,res){
					if(data){
						oController._SheetData=data;
					}
					if(data&&data.TableIn2.results.length){
						var oData=data.TableIn2.results;
						oData.forEach(function(e){
							if(e.Apopt=="28"){
								$.app.byId(oController.PAGEID+"_TextA1").setValue(e.Apop);
							}else if(e.Apopt=="29"){
								$.app.byId(oController.PAGEID+"_TextA2").setValue(e.Apop);
							}							
						});
					}
					if(data&&data.TableIn4.results.length){
						var oData=data.TableIn4.results;
						$.app.byId(oController.PAGEID+"_Sel1").setSelectedKey(oData[0].Apgrd0);
					}
				},
				error: function (oError) {
					var Err = {};						
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.alert(oError.toString());
					}
				}
			});
		},

		onValid : function(oController){
			if($.app.byId(oController.PAGEID+"_TextA1").getValue().trim()==""){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_35002"));
				return false;
			}
			if($.app.byId(oController.PAGEID+"_Sel1").getSelectedKey()==""){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_35003"));
				return false;
			}
			return true;
		},

		onSaveProcess : function(oController,Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EssMboEval.EssMboEval");
			var oController = oView.getController();
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oPreData=oController._PreData;
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oTa1=$.app.byId(oController.PAGEID+"_TextA1");
			var oTa2=$.app.byId(oController.PAGEID+"_TextA2");
			var oSel1=$.app.byId(oController.PAGEID+"_Sel1");
			var oTableIn2=oController._SheetData.TableIn2.results;
			var oTableIn4=oController._SheetData.TableIn4.results;

			function dataChecknSave(){
				if(oController._SheetData.TableIn2.results.length==0){
					oTableIn2.push({
						ApoptT: "",
						Apopt: "28",
						Apop: oTa1.getValue(),
						Docid: oController._Docid,
						IOdkey: ""
					});
					oTableIn2.push({
						ApoptT: "",
						Apopt: "29",
						Apop: oTa2.getValue(),
						Docid: oController._Docid,
						IOdkey: ""
					});
				}

				if(oController._SheetData.TableIn4.results.length==0){
					oTableIn4.push({
						Docid:oController._Docid,
						Apgrd0:oSel1.getSelectedKey(),
						Apgrd0T:oSel1.getSelectedItem().getText(),
					});
				}
				
				oTableIn2.forEach(function(e){
					if(e.Apopt=="28"){
						e.Apop=oTa1.getValue();
					}
					if(e.Apopt=="29"){
						e.Apop=oTa2.getValue();
					}
				});
				oTableIn4.forEach(function(e){
					e.Apgrd0=oSel1.getSelectedKey();
				});
				var vData={IOdkey:"", 
					IBukrs:"1000",
					IAppid:oPreData.Appid,
					IDocid:oController._Docid,
					IPernr:oSessionData.Pernr,
					IApprc:"40",
					IGolst:"",
					ILangu:oSessionData.Langu,
					TableIn2:oTableIn2,
					TableIn4:oTableIn4
				};
				switch (Sig) {
					case "S":
						vData.IConType="2";

						oModel.create("/AppraisalMboSheetSet", vData, {
							success: function(data,res){
								sap.m.MessageBox.alert(oBundleText.getText("MSG_35005"),{
									title:oBundleText.getText("LABEL_35023"),
									onClose:function(){oController.bindData2(oController);}
								})
							},
							error: function (oError) {
								var Err = {};						
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									var msg1 = Err.error.innererror.errordetails;
									if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
									else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
								} else {
									sap.m.MessageBox.alert(oError.toString());
								}
							}
						});
						break;
					case "F":
						vData.IConType="9";

						oModel.create("/AppraisalMboSheetSet", vData, {
							success: function(data,res){
								sap.m.MessageBox.alert(oBundleText.getText("MSG_35006"),{
									title:oBundleText.getText("LABEL_35023"),
									onClose:function(){oController.bindData2(oController);}
								})
							},
							error: function (oError) {
								var Err = {};						
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									var msg1 = Err.error.innererror.errordetails;
									if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
									else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
								} else {
									sap.m.MessageBox.alert(oError.toString());
								}
							}
						});
						
						break;
					default:
						break;
				}
			}
			var fVal1=false;
			var fVal2=false;
			var fVal3=false;
			oTableIn2.forEach(function(e){
				if(e.Apopt=="28"){
					if(e.Apop==oTa1.getValue()){
						fVal1=true;
					}
				}
				if(e.Apopt=="29"){
					if(e.Apop==oTa2.getValue()){
						fVal2=true;
					}
				}
			});
			oTableIn4.forEach(function(e){
				if(e.Apgrd0==oSel1.getSelectedKey()){
					fVal3=true;
				}
			});	
			if(Sig=="S"){
				if(fVal1&&fVal2&&fVal3){
					sap.m.MessageBox.alert(oBundleText.getText("MSG_35007"),{title:oBundleText.getText("LABEL_35023"),onClose:function(){dataChecknSave();}});
				}else{
					dataChecknSave();
				}
			}else{
				dataChecknSave();
			}
		},

		onSave : function(Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EssMboEval.EssMboEval");
			var oController = oView.getController();		
			if(Sig=="F"){
				var oValid = oController.onValid(oController);
				if(oValid){
					var oMsg="";
					Sig=="S"?oMsg=oBundleText.getText("MSG_35001"):oMsg=oBundleText.getText("MSG_35004");
					sap.m.MessageBox.show(
						oMsg, {				
						icon: sap.m.MessageBox.Icon.INFORMATION,				
						title: oBundleText.getText("LABEL_35023"),				
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
						onClose: function(fVal) {
							if(fVal=="YES"){
								oController.onSaveProcess(oController,Sig);
							}
						}				
						}		
					);
				}
			}else{
				var oMsg="";
				Sig=="S"?oMsg=oBundleText.getText("MSG_35001"):oMsg=oBundleText.getText("MSG_35004");
				sap.m.MessageBox.show(
					oMsg, {				
					icon: sap.m.MessageBox.Icon.INFORMATION,				
					title: oBundleText.getText("LABEL_35023"),				
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
					onClose: function(fVal) {
						if(fVal=="YES"){
							oController.onSaveProcess(oController,Sig);
						}
					}				
					}		
				);				
			}
		},
		
		getUrl : function(sUrl) {
			var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
				var pair = p.split(/=/);
				if (pair[0] === "s4hana") { return decodeURIComponent(pair[1]); }
			})[0];
	
			var destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
			
			return (destination + sUrl);
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20120220"});
			// return new JSONModelHelper({name: "931006"});
			return new JSONModelHelper({name: "991004"});
		} : null
		
	});

});