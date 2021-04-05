jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("control.LinkToOrgTree");
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/DialogHandler",
	"sap/m/MessageToast",
	"../common/OrgOfIndividualHandler",
	"../common/EmployeeModel",
	"../common/AttachFileAction"], 
	function (Common, CommonController, JSONModelHelper,PageHelper, DialogHandler, MessageToast, OrgOfIndividualHandler,EmployeeModel,AttachFileAction) {
	"use strict";

	return CommonController.extend("ZUI5_HR_OutCompEdu.OutCompEduDet", {

		PAGEID: "OutCompEduDet",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Docid : "",
		_Bukrs : "",
		tableViewHeight: 22,
		_SessionData : {},
		EmployeeModel: new EmployeeModel(),
		TestModel: new sap.ui.model.json.JSONModel(),
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
			oController._SessionData=oController._ListCondJSonModel.getProperty("/Data");
			this.TestModel.setData({MyData:[{test:"테스트지요."}]});
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Required: true,
				Mode: "S",
				Max: "1",
				Editable: vStatus==""||vStatus=="99"?true:false,
				FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
			});	
		},

		onBack : function(oEvent){
			var oController = this;
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id : "ZUI5_HR_OutCompEdu.OutCompEdu"
			});
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
		},

		chkAll : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
		},

		getSelector : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
			var oSel1=$.app.byId(oController.PAGEID+"_Sel1");
			var oSel2=$.app.byId(oController.PAGEID+"_Sel2");
			var oSel3=$.app.byId(oController.PAGEID+"_Sel3");
			var oSel4=$.app.byId(oController.PAGEID+"_Year");
			var oSel5=$.app.byId(oController.PAGEID+"_Month");
			for(var i=1;i<=5;i++){
				if(i!=4){
					eval("oSel"+i+".addItem(new sap.ui.core.Item({text:oBundleText.getText('LABEL_00181'),key:''}));");
				}
			}
		},

		oTableInit : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
			var c=sap.ui.commons;
			var oTable=$.app.byId(oController.PAGEID+"_Table");
			oTable.destroyColumns();
			var oFields=["Chk","Orgtx","PGradeTxt","Ename","Position"];			
			var oWidths=["60px","","120px","120px","120px"];			
			var oLabels=new Array();
			for(var i=29;i<=33;i++){
				oLabels.push({Label:"LABEL_400"+i,Width:oWidths[i-29],Align:"Center"});
			}
			oLabels.forEach(function(e,i){
				var oCol=new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : false,
					sorted : false
				});
				oCol.setWidth(e.Width);
				oCol.setHAlign(e.Align);
				oCol.setLabel(new sap.m.Text({text:oBundleText.getText(e.Label),textAlign:e.Align}));
				i==0?oCol.setTemplate(new sap.m.CheckBox({text:"{"+oFields[i]+"}"})):
				oCol.setTemplate(new sap.m.Text({text:"{"+oFields[i]+"}"}));
				oTable.addColumn(oCol);
			});
			var oModel=new sap.ui.model.json.JSONModel();
			oModel.setData({List:[]});
			oTable.setModel(oModel);
			oTable.bindRows("/List");
		},

		onSearch : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
		},

		onSelectedRow: function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
			var sPath = oEvent.getParameters().rowBindingContext.sPath;			
			var oTable = sap.ui.getCore().byId(oController.PAGEID +"_"+oController.vPage+ "_Table1");
			var oData = oTable.getModel().getProperty(sPath);
			oController._tData=oData;		
			oController.nextPage1(oData);
		},

		nextPage1 : function(oEvent){

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

		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vAppnm = oController.OpenHelpModel.getProperty("/FileData/0/Appnm") || "";
			var oFileUploadBox = $.app.byId(oController.PAGEID + "_FileUploadBox");
				
			if(Common.checkNull(vAppnm)) oFileUploadBox.setVisible(false);
			else oFileUploadBox.setVisible(true);

			oController.refreshAttachFileList2(oController);
			
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "10",
				Editable: false,
				FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
			});
		},

//////////사원검색 패키지///////////////////////////////////////////////////////////////////////////////////////////////////////////
		addTargetTableByMulti: function(data) {
			return control.LinkToOrgTree.addTargetTableByMulti(data);
		},
		
		getOrgOfIndividualHandler: function() {
			return control.LinkToOrgTree.OrgOfIndividualHandler;
		},
	
		displayMultiOrgSearchDialog: function(oEvent) {
			return control.LinkToOrgTree.OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
		},
	
		onESSelectPerson: function(data) {
			return control.LinkToOrgTree.OrgOfIndividualHandler.setSelectionTagets(data);
		},

		getOrgOfIndividualHandler : function(){
			return OrgOfIndividualHandler;
		},

		onAddPerson : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEduDet");
			var oController = oView.getController();
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var TargetTable=$.app.byId(oController.PAGEID+"_Table");
			control.LinkToOrgTree.addPerson(oController,TargetTable,oSessionData,4,OrgOfIndividualHandler,DialogHandler,CommonController);
		},
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onSaveProcess : function(oController,Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			var oController = oView.getController();
			var oModel=sap.ui.getCore().getModel("ZHR_APPRAISAL2_SRV");
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
					oModel.create("/AppraisalMboSheetSet", vData, null,
					function(data,res){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_35005"),{
							title:oBundleText.getText("LABEL_35023"),
							onClose:function(){oController.bindData2(oController);}
						})
					},
					function (oError) {
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
				);
						break;
					case "F":
					vData.IConType="9";
					oModel.create("/AppraisalMboSheetSet", vData, null,
					function(data,res){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_35006"),{
							title:oBundleText.getText("LABEL_35023"),
							onClose:function(){oController.bindData2(oController);}
						})
					},
					function (oError) {
						var Err = {};						
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
							else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						} else {
							sap.m.MessageBox.alert(oError.toString());
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
			
			if(fVal1&&fVal2&&fVal3){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_35007"),{title:oBundleText.getText("LABEL_35023"),onClose:function(){dataChecknSave();}});
			}else{
				dataChecknSave();
			}
		},

		onSave : function(Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OutCompEdu.OutCompEdu");
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
				if (pair[0] === "s4hana") { return pair[1]; }
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