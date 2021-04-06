jQuery.sap.require("sap.m.MessageBox");
$.sap.require("common.Check_Regno");
sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"../../common/PageHelper",
	"../../common/AttachFileAction",
	"../../common/EmployeeModel",
	"../../common/HoverIcon",
	"sap/m/InputBase"], 
	function (Common, CommonController, JSONModelHelper, PageHelper,AttachFileAction, EmployeeModel,HoverIcon,InputBase) {
	var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDetA100"].join($.app.getDeviceSuffix());
	return CommonController.extend(SUB_APP_ID, {

		PAGEID: "MedApplyDetA100",
		BusyDialog : new sap.m.BusyDialog().addStyleClass("centerAlign busyDialog"),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_DataModel : new sap.ui.model.json.JSONModel(),
		_SessionData : {},
		InputBase : InputBase,
		_Bukrs:"",
		_ViewData: {},
		_SelData:{Sel1:[],Sel2:[],Sel3:[],Sel4:[],Sel5:[],Sel6:[]},
		_onDialog:"",
		_onClose:"",
		_MedDate:null,
		_vArr1:["Zdbcrl","Ziftrl","Zfvcrl","Mycharge","SuppAmt","Zmedrl","NsuppAmt","BaseAmt","Zkiobd","Zkibbm","Zkijbd","Zkijbm","Znijcd","Znijcm","Zniiwd","Zniiwm","Znisdd","Znisdm","Znoctd","Znoctm","Znomrd","Znomrm","Znocud","Znocum","Znobcd","Znobcm"],
		_vArr2:["Ptamt","Medsp","Oiamt","Znobcm","Medpp","Insnp","Znobcd","Medmp","Inspp","Zdbcrl","Ziftrl","Framt"],
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

		onBeforeShow: function(oEvent){
			var oController = this;
			this._ListCondJSonModel.setData({Data:oController.getView().getModel("session").getData()});
			oController._SessionData=oController.getView().getModel("session").getData();
			var oSessionData=oController._SessionData;
			var oModel=$.app.getModel("ZHR_BENEFIT_SRV");
			var oModel2=$.app.getModel("ZHR_COMMON_SRV");
			var vData={ IConType:"0",
						IBukrs:oSessionData.Bukrs2,
						IPernr:oSessionData.Pernr,
						ILangu:oSessionData.Langu,
						IDatum:"\/Date("+new Date().getTime()+")\/",
						MedicalApplyExport:[],
						MedicalApplyTableIn:[],
						MedicalApplyTableIn0:[],
						MedicalApplyTableIn3:[],
						MedicalApplyTableIn4:[],
						MedicalApplyTableIn5:[],
						MedicalApplyTableInH:[]
						};
			oModel.create("/MedicalApplySet", vData, null,
					function(data,res){
						if(data){
							if(data&&data.MedicalApplyTableIn0.results.length){
								data.MedicalApplyTableIn0.results.forEach(function(e){
									oController._SelData.Sel1.push(e);
									oController._SelData.Sel5.push(e);
								});
							}
						}					
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
			this._tData=oEvent.data[0];
			this._SelData=oEvent.data[1];
			this._onDialog=oEvent.data[2];
			this._SessionData=oEvent.data[3];
			this._Bukrs=oEvent.data[4];
			this.onAfterOpen2();
		},

		onAfterShow:function(){
// 			common.EmpBasicInfoBoxCustom.setHeader(this._SessionData.Pernr);
// 			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_ApplyDate");            
//             oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
		},

		navBack:function(){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id: [$.app.CONTEXT_PATH, "MedApply"].join($.app.getDeviceSuffix())
			});
		},

		getBukrs : function(vDatum){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");	
			var vData={Pernr:oController._SessionData.Pernr,Datum:"\/Date("+new Date(vDatum.getValue()).getTime()+")\/",BukrsExport:[]};
			oController._MedDate=new Date(vDatum.getValue());
			function getBukrs(){
				oModel.create("/BukrsImportSet", vData, null,
					function(data,res){
						if(data){
							oController._Bukrs=data.BukrsExport.results[0].Bukrs;
							oController.onClose3();
							oController.onDialog("N",oController._Bukrs);
						}					
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
			}
			vDatum.getValue()==null||vDatum.getValue()==""?sap.m.MessageBox.alert(oController.getBundleText("MSG_47011")):getBukrs();
			return;
		},

		onAfterOpen:function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
			var oSessionData=oController._SessionData;
			oController.getSelData();
			oController._DataModel.setData({Pop1:[oController._tData],Pop2:[]});
			oController._tData.Zfvcgb=="X"?oController._tData.Chk1=true:oController._tData.Chk1=false;
			oController._tData.Ziftgb=="X"?oController._tData.Chk2=true:oController._tData.Chk2=false;
			oController._vArr1.forEach(function(e){
				var oPro=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0];
				eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop1/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
			});
			$.app.byId(oController.PAGEID+"_Mat").bindElement("/Pop1/0");
			if(oController._onDialog!="M"){
				oController.changeSel2();
			}
			var vAppnm="";
			oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0].Appnm:null;
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign busyDialog");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}
			var vEdit=true;
			oController._onClose=="X"?vEdit=false:vEdit=true;
			var vStatus=oController._DataModel.getProperty("/Pop1")[0].Status;
			var vClose=oController._onClose;
			if(vStatus==""){
				vClose=="X"?vEdit=false:vEdit=true;
			}else{
				vEdit=false;
			}

			setTimeout(function(){	
				if(oController._onClose!="X"){
					oController.changeSel();
				}			
				var vProperty1={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				var vProperty2={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty1,"001");
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty2,"002");


				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Mode: "S",
					Max: "1",
					Cntnm: "003",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"003");
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Mode: "S",
					Max: "1",
					Cntnm: "004",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"004");
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Mode: "S",
					Max: "1",
					Cntnm: "005",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"005");
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Mode: "S",
					Max: "1",
					Cntnm: "006",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"006");
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Mode: "S",
					Max: "1",
					Cntnm: "007",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"007");
				if(oController._onDialog!="M"){
					oController.changeSel2();
				}
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}
			},100);
		},

		onAfterOpen2 : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
			var oSessionData=oController._SessionData;
			oController._DataModel.setData({Pop1:[],Pop2:[oController._tData]});
			oController._vArr2.forEach(function(e){
				var oPro=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0];
				eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop2/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
			});
			$.app.byId(oController.PAGEID+"_Mat2").bindElement("/Pop2/0");		
			if(oController._onDialog=="M"){
				oController.getSelData2("B");
				$.app.byId(oController.PAGEID+"_dSel5").setSelectedKey($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Relation);
				oController.onChange5("B");				
				$.app.byId(oController.PAGEID+"_dSel6").setSelectedKey($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].PatiName);
				$.app.byId(oController.PAGEID+"_dSel3").setSelectedKey($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Gtz51);
				$.app.byId(oController.PAGEID+"_dSel4").setSelectedKey($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Gtz51s);		
			}else{
				oController.getSelData2();
			}
			$.app.byId(oController.PAGEID+"_Mat2").bindElement("/Pop2/0");		
			var vAppnm="";
			oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat2").getModel().getProperty("/Pop2")[0].Appnm:null;
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign busyDialog");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}
			var vEdit=true;
			oController._onClose=="X"?vEdit=false:vEdit=true;
			var vStatus=oController._DataModel.getProperty("/Pop2")[0].Status;
			var vClose=oController._onClose;
			if(vStatus==""){
				vClose=="X"?vEdit=false:vEdit=true;
			}else{
				vEdit=false;
			}
			setTimeout(function(){
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm:vAppnm,
					Required: true,
					Mode: "M",
					Max: "15",
					Editable: vEdit,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				},"008");
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}
			},100);	
		},

		onAfterOpen3 : function(vDatum){
			vDatum.setValue();
		},

		onSearchMed : function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if (!oController._miniPop) {
				oController._miniPop = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.minipop", oController);
				$.app.getView().addDependent(oController._miniPop);
			}
			oController._miniPop.open();
		},
		
		getTxt:function(vTxt,vNo){
			var redStar="<span style='color:red;font-weight:bold;font-size:14px;'>*</span>";
			var oTxt=vNo<=22||vNo==48||vNo==49||vNo==63||vNo==64||vNo==65||vNo==66||vNo==67||vNo==68||vNo==69||vNo==70||vNo==71||vNo==75||vNo==76||
			vNo==89?"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText(vTxt)+"</span>"+redStar:
			"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText(vTxt)+"</span>";
			return new sap.ui.core.HTML({content:oTxt});
		},

		onClose:function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if(oController.oDialog.isOpen()){
				oController.oDialog.close();
			}			
		},

		onClose2:function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if(oController.oDialog2.isOpen()){
				oController.oDialog2.close();
			}
		},

		onClose3:function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if(oController.oDialog3.isOpen()){
				oController.oDialog3.close();
			}
		},

		initTdata : function(Flag){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSessionData=oController._SessionData;	
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });	
			oController._tData={
				MedDate:null,
				Inpdt:null,
				Begda:new Date(),
				Endda:"\/Date("+new Date().getTime()+")\/",
				HospType:"",
				Kdsvh:"",
				Pernr:oSessionData.Pernr,
				Bukrs:Flag,
				HospName:"",
				Comid:"",
				DiseName:"",
				PatiName:"",
				Remark:"",
				Recno:"",
				Zkiobd:"0",
				Zkijbd:"0",
				Znijcd:"0",
				Zniiwd:"0",
				Znisdd:"0",
				Znoctd:"0",
				Znomrd:"0",
				Znocud:"0",
				Znobcd:"0",
				Zkibbm:"0",
				Zkijbm:"0",
				Znijcm:"0",
				Zniiwm:"0",
				Znijcm:"0",
				Znisdm:"0",
				Znoctm:"0",
				Znomrm:"0",
				Znocum:"0",
				Znobcm:"0",
				Mycharge:"0",
				Npayt:"0",
				SuppAmt:"0",
				Zmedrl:"0",
				NsuppAmt:"0",
				Zfvcrl:"0",
				Ziftrl:"0",
				Zdbcrl:"0",
				Medsp:"0",
				Oiamt:"0",
				Ptamt:"0",
				Medpp:"0",
				Insnp:"0",
				Medmp:"0",
				Inspp:"0",
				Pcamt:"0",
				Status:"",
				Gtz51:"",
				Gtz51s:"",
				StatusText:"",
				Relation:"",
				RelationTx:"",
				Zfvcgb:"",
				Ziftgb:"",
				Chk1:false,
				Chk2:false,
				Zfvcum:"0",
				Ziftum:"0",
				BaseAmt:"0",
				Framt:"0",
				Close:oController._onClose
			};
			if(oController._tData.MedDate==null){
				oController._tData.MedDate=oController._MedDate;
			}
		},

		changeSel : function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel = $.app.byId(oController.PAGEID+"_dSel1");
			var oPro=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0];
			$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/RelationTx",oSel.getSelectedItem().getCustomData()[0].getValue("Data"));
			oPro.Relation=oSel.getSelectedKey();
			if(oPro.Status==""){
				if(oPro.Relation!="01"&&oPro.Relation!="02"){
					$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/Chk1",false);
					$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/Chk2",false);
					$.app.byId(oController.PAGEID+"_Chk1").setEditable(false);
					$.app.byId(oController.PAGEID+"_Chk2").setEditable(false);
				}else{
					$.app.byId(oController.PAGEID+"_Chk1").setEditable(true);
					$.app.byId(oController.PAGEID+"_Chk2").setEditable(true);
				}		
			}else{
				$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/Chk1",false);
				$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/Chk2",false);
				$.app.byId(oController.PAGEID+"_Chk1").setEditable(false);
				$.app.byId(oController.PAGEID+"_Chk2").setEditable(false);
			}
			oController.onChk1();
			oController.onChk2();
		},

		changeSel2 : function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel2 = $.app.byId(oController.PAGEID+"_dSel2");
			if(oSel2.getSelectedKey()=="05"){
				$.app.byId(oController.PAGEID+"_Inp1").setEditable(true);			
				$.app.byId(oController.PAGEID+"_Inp2").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp3").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp3").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp4").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp4").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp5").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp5").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp6").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp6").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp7").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp7").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp8").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp8").setValue("0");
				$.app.byId(oController.PAGEID+"_Inp9").setEditable(true);

				var vAppnm="",vEdit=true;
				oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0].Appnm:null;
				oController._onClose=="X"?vEdit=false:vEdit=true;
				var vStatus=oController._DataModel.getProperty("/Pop1")[0].Status;
				var vClose=oController._onClose;
				var vEdits=null;
				if(vStatus==""){
					vClose=="X"?vEdits=[false,false,false,false,false]:vEdits=[true,false,false,false,true];
				}else{
					vEdits=[false,false,false,false,false];
				}
				for(var i=3;i<=7;i++){
					var vProperty={
						Appnm: vAppnm,
						Mode: "S",
						Cntnm: "00"+i,
						Max: "1",
						Label : "",
						Editable: vEdits[i-3],
						UseMultiCategories : true,
						FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
					}					
					fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty,"00"+i);
				}
			}else{
				$.app.byId(oController.PAGEID+"_Inp1").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp2").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp3").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp4").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp5").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp6").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp7").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp8").setEditable(true);
				$.app.byId(oController.PAGEID+"_Inp9").setEditable(false);
				$.app.byId(oController.PAGEID+"_Inp9").setValue("0");

				var vAppnm="",vEdit=true;
				oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0].Appnm:null;
				oController._onClose=="X"?vEdit=false:vEdit=true;
				var vStatus=oController._DataModel.getProperty("/Pop1")[0].Status;
				var vClose=oController._onClose;
				var vEdits=null;
				if(vStatus==""){
					vClose=="X"?vEdits=[false,false,false,false,false]:vEdits=[true,true,true,true,false];
				}else{
					vEdits=[false,false,false,false,false];
				}
				for(var i=3;i<=7;i++){
					var vProperty={
						Appnm: vAppnm,
						Mode: "S",
						Cntnm: "00"+i,
						Max: "1",
						Label : "",
						Editable: vEdits[i-3],
						UseMultiCategories : true,
						FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
					}					
					fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty,"00"+i);
				}
			}
			oController.eqFunc();
		},

		initFile:function(vPage){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();	
			var	oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"+vPage),
			oJSonModel = oAttachbox.getModel(),
			vPath = "/Data/0",
			vContexts = oJSonModel.getProperty(vPath),
			vIndex = vPath.replace("/Data/", "");

			if(!vContexts) return;

			oTable.removeSelections(true);

			var deleteProcess =	 function (fVal) {
				if(!fVal || fVal === sap.m.MessageBox.Action.NO) return;

				try {
					if(vContexts.New === false) {
						var aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];

						aDeleteFiles.push(vContexts);
						oJSonModel.setProperty("/DelelteDatas", aDeleteFiles);
					}

					oJSonModel.getProperty("/Data").splice(vIndex, 1);
					oJSonModel.setProperty("/Data", oJSonModel.getProperty("/Data"));
					oJSonModel.setProperty("/Settings/Length", oJSonModel.getProperty("/Data").length);


				} catch (ex) {
					common.Common.log(ex);
				}

				// var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				// bReturnFlag = false,
				// sPath = oModel.createKey("/FileListSet", {
				// 	Appnm: oJSonModel.getProperty("/DelelteDatas")[0].Appnm,
				// 	Docid: oJSonModel.getProperty("/DelelteDatas")[0].Docid,
				// 	Cntnm: oJSonModel.getProperty("/DelelteDatas")[0].Cntnm
				// });

				// oModel.remove(sPath, {
				// 	success: function () {

				// 	},
				// 	error: function (res) {
				// 		var errData = common.Common.parseError(res);
				// 		if(errData.Error && errData.Error === "E") {
				// 			sap.m.MessageBox.error(errData.ErrorMessage, {
				// 				title: this.getBundleText("LABEL_09029")
				// 			});
				// 		}
				// 	}
				// });
			};
				//deleteProcess("YES");
		},

		onChk1:function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();	
			var vAppnm="",vEdit=true;
			oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0].Appnm:null;
			if($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1){
				var vProperty1={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				vProperty1.Appnm=vAppnm;
				vProperty1.Editable=true;
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty1,"001");
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2=false;
				oController.onChk2();
			}else{
				oController.initFile("001");
				var vProperty1={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				vProperty1.Appnm='';
				vProperty1.Editable=false;
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty1,"001");
			}			
		},

		onChk2:function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();	
			var vAppnm="",vEdit=true;
			oController._onDialog=="M"?vAppnm=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0].Appnm:null;
			if($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2){
				var vProperty1={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				vProperty1.Appnm=vAppnm;
				vProperty1.Editable=true;
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty1,"002");
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1=false;
				oController.onChk1();
			}else{
				oController.initFile("002");
				var vProperty1={
					Appnm: vAppnm,
					Mode: "S",
					Cntnm: "001",
					Max: "1",
					Label : "",
					Editable: vEdit,
					UseMultiCategories : true,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
				}
				vProperty1.Appnm='';
				vProperty1.Editable=false;
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController,vProperty1,"002");
			}
		},

		getSelData: function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();	
			var oSel = $.app.byId(oController.PAGEID+"_dSel1");
			oSel.removeAllItems();
			oSel.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				}).addCustomData(new sap.ui.core.CustomData({
					key:"Data",
					value:''
				}))
			);
			var oSel2 = $.app.byId(oController.PAGEID+"_dSel2");
			oSel2.removeAllItems();
			oSel2.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				}).addCustomData(new sap.ui.core.CustomData({
					key:"Data",
					value:''
				}))
			);
			var oSessionData=oController._SessionData;		
			oController._SelData.Sel1.forEach(function(e){
				oSel.addItem(new sap.ui.core.Item({
					text:e.Fname,
					key:e.Relation
				}).addCustomData(new sap.ui.core.CustomData({
					key:"Data",
					value:e.RelationTxt
				})))
			});
			var oModel=$.app.getModel("ZHR_COMMON_SRV");
			var vData={ICodeT:"004",
					   IPernr:oSessionData.Pernr,
					   IBukrs:oSessionData.Bukrs2,
					   NavCommonCodeList:[],
					   ICodty:"ZHOSP_TYPE"};
			oModel.create("/CommonCodeListHeaderSet", vData, null,
				function(data,res){
					if(data&&data.NavCommonCodeList.results.length){
						data.NavCommonCodeList.results.forEach(function(e){
							oSel2.addItem(new sap.ui.core.Item({
								text:e.Text,
								key:e.Code
							}));
						});
					}
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
		},

		getSelData2: function(vSig){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSessionData=oController._SessionData;	
			var oModel=$.app.getModel("ZHR_COMMON_SRV");
			var vData={ICodeT:"001",ICodty:"GTZ51",IBukrs:oController._Bukrs,IPernr:oSessionData.Pernr,NavCommonCodeList:[]};				
			if(oController._SelData.Sel3.length==0){
				oModel.create("/CommonCodeListHeaderSet", vData, null,
					function(data,res){
						if(data){
							if(data&&data.NavCommonCodeList.results.length){
								data.NavCommonCodeList.results.forEach(function(e){
									oController._SelData.Sel3.push(e);
								});
							}
						}					
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
			}
			var oSel3 = $.app.byId(oController.PAGEID+"_dSel3");
			oSel3.removeAllItems();
			oSel3.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			oController._SelData.Sel3.forEach(function(e){
				oSel3.addItem(
					new sap.ui.core.Item({
						text:e.Text,
						key:e.Code
					})
				);
			});
			vSig!="B"?oSel3.setSelectedKey():null;
			var oSel4 = $.app.byId(oController.PAGEID+"_dSel4");
			oSel4.removeAllItems();
			oSel4.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			vSig!="B"?oSel4.setSelectedKey():null;
			var oSel5 = $.app.byId(oController.PAGEID+"_dSel5");
			oSel5.removeAllItems();
			oSel5.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				}).addCustomData(new sap.ui.core.CustomData({
					key:"Data",
					value:''
				}))
			);
			vSig!="B"?oSel5.setSelectedKey():null;
			var oA1=new Array();
			var oA2=new Array();
			oController._SelData.Sel5.forEach(function(e){
				oA1.push(e);
			});
			for(var i=0;i<oA1.length;i++){
				if(i!=0){
					if(oA1[i].Relation!=oA1[i-1].Relation){
						oA2.push(oA1[i]);
					}
				}else{
					oA2.push(oA1[i]);
				}
			}
			oA2.forEach(function(e){
				oSel5.addItem(new sap.ui.core.Item({
					text:e.RelationTxt,
					key:e.Relation
				}).addCustomData(new sap.ui.core.CustomData({
					key:"Data",
					value:e
				})))
			});
			var oSel6 = $.app.byId(oController.PAGEID+"_dSel6");
			oSel6.removeAllItems();
			oSel6.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			vSig!="B"?oSel6.setSelectedKey():null;
		},
 
		onDialog : function(New,Flag){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if(New=="N"){
				oController.initTdata(Flag);
			}
			oController._onDialog=New;
			if(Flag=="1000"){
				if (!oController.oDialog) {
					oController.oDialog = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup", oController);
					$.app.getView().addDependent(oController.oDialog);
				}
				oController.oDialog.open();
			}else if(Flag=="A100"){
				if (!oController.oDialog2) {
					oController.oDialog2 = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup2", oController);
					$.app.getView().addDependent(oController.oDialog2);
				}
				oController.oDialog2.open();
			}else if(Flag=="N3"){
				if (!oController.oDialog3) {
					oController.oDialog3 = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.prepopup", oController);
					$.app.getView().addDependent(oController.oDialog3);
				}
				oController.oDialog3.open();
			}					
		},

		oTableInit : function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var c=sap.ui.commons;
			var oTable=$.app.byId(oController.PAGEID+"_Table");
			oTable.destroyColumns();
			var oFields=["Begda","MedDate","PatiName","RelationTx","HospName","DiseName","MychargeT","SuppAmtT","PayDateT","StatusText"];			
			var oWidths=['','','','','200px','200px','','','',''];			
			var oAligns=['Center','Center','Center','Center','Begin','Begin','End','End','Center','Center'];	
			var oLabels=new Array();
			for(var i=91;i<101;i++){
				i<100?i="0"+i:null;
				oLabels.push({Label:"LABEL_47"+i,Width:oWidths[i-91],Align:"Center"});
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
				if(i<2){
					oCol.setTemplate(new sap.ui.commons.TextView({text : {
						path :oFields[i], 						
						type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
					},textAlign:oAligns[i]}).addStyleClass("FontFamily"))
				}else{
					oCol.setTemplate(new sap.ui.commons.TextView({text:"{"+oFields[i]+"}",textAlign:oAligns[i]}).addStyleClass("FontFamily"));			
				}					
				oTable.addColumn(oCol);
			});
		},

		onMiniAdd : function(){
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oTable = sap.ui.getCore().byId(oController.PAGEID+"_dTable");
			if(oTable.getSelectedIndices().length==0){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_47008"));
				return;
			}
			sap.m.MessageBox.alert(oBundleText.getText("MSG_47033"),{
				onClose:function(){
					var oData=oTable.getModel().getProperty("/oData")[oTable.getSelectedIndices()[0]];
					$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/HospName",oData.HospName);
					$.app.byId(oController.PAGEID+"_Mat").getModel().setProperty("/Pop1/0/Comid",oData.Comid);
					$.app.byId($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController().PAGEID+"_miniDialog").close();
				}
			});			
		},

		clickNotice : function(){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oRow,oCell;
			var oModel=$.app.getModel("ZHR_BENEFIT_SRV");
			function closeDialog(oEvent){
				$.app.byId(oController.PAGEID+"_pDial").close();
			}
			function onAfterOpen(){
				$.app.byId(oController.PAGEID+"_Input1").setValue();
				$.app.byId(oController.PAGEID+"_Input2").setValue();
			}
			function onSaveProcess(){
				var vData={Hname:$.app.byId(oController.PAGEID+"_Input1").getValue().trim(),
						   Comid:$.app.byId(oController.PAGEID+"_Input2").getValue().trim()};
				oModel.create("/MedComidSaveSet", vData, null,
				function(data,res){
					new sap.m.MessageBox.alert(oBundleText.getText("MSG_35005"),{
						title:oBundleText.getText("LABEL_35023"),
						onClose:function(){closeDialog();oController.onMini();}
					});
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
			}
			function onSave(){
				if($.app.byId(oController.PAGEID+"_Input1").getValue().trim()==""){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_47012"));
					return;
				}
				if($.app.byId(oController.PAGEID+"_Input2").getValue().trim()==""){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_47013"));
					return;
				}
				if(isNaN($.app.byId(oController.PAGEID+"_Input2").getValue().trim())){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_47014"));
					return;
				}
				sap.m.MessageBox.show(
					oBundleText.getText("MSG_35001"), {				
					icon: sap.m.MessageBox.Icon.INFORMATION,				
					title: oBundleText.getText("LABEL_35023"),				
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
					onClose: function(fVal) {
						if(fVal=="YES"){
							onSaveProcess(oController);
						}
					}				
				});
			}
			if (!oController.oDialog4) {
				var oContent=new sap.ui.commons.layout.MatrixLayout({
					columns:2,
					widths:['30%']
				});
				oRow=new sap.ui.commons.layout.MatrixLayoutRow();
				oCell=new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign:"Center",
					content:new sap.m.Text({text:oBundleText.getText("LABEL_47059")}).addStyleClass("Bold")
				}).addStyleClass("LabelCell");
				oRow.addCell(oCell);
				oCell=new sap.ui.commons.layout.MatrixLayoutCell({
					content:new sap.m.Input(oController.PAGEID+"_Input1",{width:"100%",maxLength:50})
				}).addStyleClass("DataCell");
				oRow.addCell(oCell);
				oContent.addRow(oRow);
				oRow=new sap.ui.commons.layout.MatrixLayoutRow();
				oCell=new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign:"Center",
					content:new sap.m.Text({text:oBundleText.getText("LABEL_47060")}).addStyleClass("Bold")
				}).addStyleClass("LabelCell");
				oRow.addCell(oCell);
				oCell=new sap.ui.commons.layout.MatrixLayoutCell({
					content:new sap.m.Input(oController.PAGEID+"_Input2",{width:"100%",maxLength:10})
				}).addStyleClass("DataCell");
				oRow.addCell(oCell);
				oContent.addRow(oRow);

				var mDialog=new sap.m.Dialog(oController.PAGEID+"_pDial",{
					content: [oContent],
					title: oBundleText.getText("LABEL_47057"),
					buttons: [
						new sap.m.Button({text:oBundleText.getText("LABEL_47101"),press:onSave}).addStyleClass("button-search btn-margin"),
						new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:closeDialog}).addStyleClass("button-delete")],
					contentWidth: "480px",
					afterOpen : onAfterOpen
				});
				oController.oDialog4 = mDialog
				$.app.getView().addDependent(oController.oDialog4);
			}
			oController.oDialog4.open();
		},

		onSearch : function(){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var c=sap.ui.commons;
			oController.initTdata();
			var oTable=$.app.byId(oController.PAGEID+"_Table");
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");	
			var oSessionData=oController._SessionData;		
			var oSel=$.app.byId(oController.PAGEID + "_HeadSel");
			var vFirstDate = $.app.byId(oController.PAGEID + "_ApplyDate").getDateValue();
            var vSecondDate = $.app.byId(oController.PAGEID + "_ApplyDate").getSecondDateValue(); 
			var vData={ IConType:"1",
						IBukrs:oSessionData.Bukrs2,
						IPernr:oSessionData.Pernr,
						ILangu:oSessionData.Langu,
						IMolga:oSessionData.Molga,
						IBegda:Common.adjustGMTOdataFormat(vFirstDate),
						IEndda:vSecondDate,
						IStatus:oSel.getSelectedKey(),
						IDatum:"\/Date("+new Date().getTime()+")\/",
						MedicalApplyExport:[],
						MedicalApplyTableIn:[],
						MedicalApplyTableIn0:[],
						MedicalApplyTableIn3:[],
						MedicalApplyTableIn4:[],
						MedicalApplyTableIn5:[],
						MedicalApplyTableInH:[]
						};
			var aData={oData:new Array()};
			var oJSON=new sap.ui.model.json.JSONModel();
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign busyDialog");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}
			setTimeout(function(){
				oModel.create("/MedicalApplySet", vData, null,
						function(data,res){
							if(data&&data.MedicalApplyTableIn.results.length){
								data.MedicalApplyTableIn.results.forEach(function(e){
									aData.oData.push(e);
								});
								data.MedicalApplyTableIn.results.length>10?oTable.setVisibleRowCount(10):oTable.setVisibleRowCount(data.MedicalApplyTableIn.results.length);
							}
							if(data&&data.MedicalApplyExport.results.length){
//								oController._onClose="";
								oController._onClose=data.MedicalApplyExport.results[0].Close;
							}
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
				oJSON.setData(aData);
				oTable.setModel(oJSON);
				oTable.bindRows("/oData");
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}
				oController._onClose=="X"?$.app.byId(oController.PAGEID+"_NewBtn").setVisible(false):$.app.byId(oController.PAGEID+"_NewBtn").setVisible(true);
			},100);
		},

		onSelectedRow: function(oEvent) {
			var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var sPath = oEvent.getParameters().rowBindingContext.sPath;			
			var oTable = sap.ui.getCore().byId(oController.PAGEID +"_Table");
			var oData = oTable.getModel().getProperty(sPath);
			var oSessionData=oController._SessionData;		
			oController._tData=oData;				
			oController._tData.Close=oController._onClose;	
			oController._Bukrs==""?oController._Bukrs=oData.Bukrs:null;
			oController.onDialog("M",oController._Bukrs);
		},

		onCloseDialog : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			$.app.byId(oController.PAGEID+"_Dialog").close();
		},

		onCloseDialog2 : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			$.app.byId(oController.PAGEID+"_Mat2").close();
		},

		onChange: function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel=$.app.byId(oController.PAGEID+"_mSel");
			var oInp=$.app.byId(oController.PAGEID+"_mInput");			
			oInp.setValue();
			oSel.getSelectedKey()=="1"?oInp.setMaxLength(50):oInp.setMaxLength(10);
		},

		
		onChange3: function(vSig){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel3=$.app.byId(oController.PAGEID+"_dSel3");
			var oSel4=$.app.byId(oController.PAGEID+"_dSel4");
			var oSessionData=oController._SessionData;	
			var vData={ICodeT:"002",ICodty:"GTZ51",IBukrs:oController._Bukrs,IPernr:oSessionData.Pernr,ICode:oSel3.getSelectedKey(),NavCommonCodeList:[]};	
			var oModel=$.app.getModel("ZHR_COMMON_SRV");
			oController._SelData.Sel4=new Array();
			oModel.create("/CommonCodeListHeaderSet", vData, null,
				function(data,res){
					if(data){
						if(data&&data.NavCommonCodeList.results.length){
							data.NavCommonCodeList.results.forEach(function(e){
								oController._SelData.Sel4.push(e);
							});
						}
					}					
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
			oSel4.removeAllItems();
			oSel4.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			oController._SelData.Sel4.forEach(function(e){
				oSel4.addItem(
					new sap.ui.core.Item({
						text:e.Text,
						key:e.Code
					})
				);
			});
			vSig!="B"?oSel4.setSelectedKey():null;
			var oPro=$.app.byId(oController.PAGEID+"_Mat2").getModel().getProperty("/Pop2")[0];			
			if(oSel3.getSelectedKey()=="A"){
				oPro.Inspp="250,000";
			}else if(oSel3.getSelectedKey()=="B"){
				oPro.Inspp="50,000";
			}else{
				oPro.Inspp="0";
			}
			if(oSel3.getSelectedKey()=="C"){
				oPro.Inpdt=null;
				oPro.Ptamt="0";
				oPro.Oiamt="0";
				oPro.Medpp="0";
				oPro.Insnp="0";
			}
			if(oSel3.getSelectedKey()=="D"){
				oPro.Ptamt="0";
				oPro.Medsp="0";
				oPro.Oiamt="0";
				oPro.Znobcm="0";
				oPro.Insnp="0";
			}
			oController.eqFunc();
			oController.onCal(oController._Bukrs);
		},

		
		onChange5: function(vSig){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel3=$.app.byId(oController.PAGEID+"_dSel3");
			var oSel5=$.app.byId(oController.PAGEID+"_dSel5");
			var oSel6=$.app.byId(oController.PAGEID+"_dSel6");
			var oSessionData=oController._SessionData;	
			var sData5=oController._SelData.Sel5;
			var sData6=new Array();
			for(var i=0;i<sData5.length;i++){
				if(oSel5.getSelectedKey()==sData5[i].Relation){
					sData6.push(sData5[i]);
				}
			}
			oSel6.removeAllItems();
			oSel6.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			sData6.forEach(function(e){
				oSel6.addItem(new sap.ui.core.Item({
					text:e.Fname,
					key:e.Fname
				}));
			});
			vSig!="B"?oSel6.setSelectedKey():null;
			
			var oSel3 = $.app.byId(oController.PAGEID+"_dSel3");
			oSel3.removeAllItems();
			oSel3.addItem(
				new sap.ui.core.Item({
					text:oController.getBundleText("LABEL_00181"),
					key:''
				})
			);
			if(oSel5.getSelectedKey()=="03"){
				oController._SelData.Sel3.forEach(function(e){
					oSel3.addItem(
						new sap.ui.core.Item({
							text:e.Text,
							key:e.Code
						})
					);
				});
			}else{
				oController._SelData.Sel3.forEach(function(e){
					if(e.Code!="C"){
						oSel3.addItem(
							new sap.ui.core.Item({
								text:e.Text,
								key:e.Code
							})
						);
					}
				});				
			}
			vSig!="B"?oSel3.setSelectedKey():null;
			oController.onChange3(vSig);
		},

		onMiniSearch : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oTable=$.app.byId(oController.PAGEID+"_dTable");
			var oSel=$.app.byId(oController.PAGEID+"_mSel");
			var oInp=$.app.byId(oController.PAGEID+"_mInput");			
			var vData={MedComidList2TableIn:[]};
			var aData={oData:[]};
			var oJSON=oTable.getModel();
			if(oSel.getSelectedKey()=="1"){
				vData.IConType="";
				vData.IInHosp=oInp.getValue().trim();
			}else{
				vData.IConType="1";
				vData.IComid=oInp.getValue().trim();
			}
			var oModel=$.app.getModel("ZHR_BENEFIT_SRV");
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}
			var oCnt=0;
			setTimeout(function(){
			oModel.create("/MedComidList2Set", vData, null,
				function(data,res){
					if(data&&data.MedComidList2TableIn.results.length){
						data.MedComidList2TableIn.results.forEach(function(e){
							aData.oData.push(e);
						});
						oJSON.setData(aData);
						oTable.bindRows("/oData");
						data.MedComidList2TableIn.results.length>10?oTable.setVisibleRowCount(10):oTable.setVisibleRowCount(data.MedComidList2TableIn.results.length);
					}
					oCnt=data.MedComidList2TableIn.results.length;
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
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}
				if(oCnt==0){
					setTimeout(function(){
						$("#"+oController.PAGEID+"_TableRow").css("display","none");
						$("#"+oController.PAGEID+"_NewRow").css("display","");
					},10);
				}else{
					setTimeout(function(){
						$("#"+oController.PAGEID+"_TableRow").css("display","");
						$("#"+oController.PAGEID+"_NewRow").css("display","none");
					},10);
				}
			},100);			
		},

		onCloseMini : function(){
			$.app.byId($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController().PAGEID+"_miniDialog").close();
		},

		onFocusMini : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oInp=$.app.byId(oController.PAGEID+"_mInput");	
			oInp.focus();
		},

		onMini : function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oSel=$.app.byId(oController.PAGEID+"_mSel");
			oSel.setSelectedKey("1");
			var oInp=$.app.byId(oController.PAGEID+"_mInput");	
			oInp.setValue();
			var oTable=$.app.byId(oController.PAGEID+"_dTable");
			var aData={oData:[]};
			oTable.setVisibleRowCount(1);
			oTable.getModel().setData(aData);
			oTable.bindRows("/oData");
			setTimeout(function(){
				$("#"+oController.PAGEID+"_TableRow").css("display","");
				$("#"+oController.PAGEID+"_NewRow").css("display","none");
			},10);			
		},

		onValid : function(oController){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oMsg="";
			if(oController._Bukrs=="1000"){
				var oPro=$.app.byId(oController.PAGEID+"_Mat").getModel().getProperty("/Pop1")[0];			
				if(oPro.MedDate==""||oPro.MedDate==null){
					oMsg=oBundleText.getText("MSG_47011");				
				}
				if(oPro.Relation==""){
					oMsg=oBundleText.getText("MSG_47017");				
				}
				if(oPro.HospType.trim()==""){
					oMsg=oBundleText.getText("MSG_47019");
				}
				if(oPro.HospName.trim()==""){
					oMsg=oBundleText.getText("MSG_47012");
				}
				if(oPro.Zkibbm.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"003")===0){
					oMsg=oBundleText.getText("MSG_47021");
				}
				if(oPro.Zkijbm.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"003")===0){
					oMsg=oBundleText.getText("MSG_47021");
				}
				if(oPro.Znoctm.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"004")===0){
					oMsg=oBundleText.getText("MSG_47022");
				}
				if(oPro.Znomrm.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"005")===0){
					oMsg=oBundleText.getText("MSG_47023");
				}
				if(oPro.Znocum.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"006")===0){
					oMsg=oBundleText.getText("MSG_47024");
				}
				if(oPro.Znobcm.trim()!="0"&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"007")===0){
					oMsg=oBundleText.getText("MSG_47025");
				}
				if(oPro.Chk1&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"001")===0){
					oMsg=oBundleText.getText("MSG_47031");
				}
				if(oPro.Chk2&&fragment.COMMON_ATTACH_FILES.getFileLength(oController,"002")===0){
					oMsg=oBundleText.getText("MSG_47032");
				}

			}else{
				var oPro=$.app.byId(oController.PAGEID+"_Mat2").getModel().getProperty("/Pop2")[0];		
				if(oPro.MedDate==""||oPro.MedDate==null){
					oMsg=oBundleText.getText("MSG_47011");				
				}
				if(oPro.Relation==""){
					oMsg=oBundleText.getText("MSG_47017");				
				}
				if(oPro.Gtz51.trim()==""){
					oMsg=oBundleText.getText("MSG_47026");
				}
				if(oPro.PatiName.trim()==""){
					oMsg=oBundleText.getText("MSG_47018");
				}
				if(oPro.Gtz51!="C"){
					if(oPro.Inpdt==""||oPro.Inpdt==null){
						oMsg=oBundleText.getText("MSG_47015");				
					}
				}
				if(oPro.HospName.trim()==""){
					oMsg=oBundleText.getText("MSG_47012");
				}
				if(oPro.Recno.trim()==""){
					oMsg=oBundleText.getText("MSG_47016");
				}
				if(oPro.DiseName.trim()==""){
					oMsg=oBundleText.getText("MSG_47027");
				}
				if(oPro.Ptamt.trim()==""){
					oMsg=oBundleText.getText("MSG_47028");
				}
				if(oPro.Medsp.trim()==""){
					oMsg=oBundleText.getText("MSG_47029");
				}
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController,"008")===0){
					oMsg=oBundleText.getText("MSG_47030");
				}
			}
			if(oMsg!=""){
				sap.m.MessageBox.alert(oMsg);
				return false;
			}	
			return true;
		},

		onCal : function(vSig,vSig2){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");	
			var oSessionData=oController._SessionData;		
			var vTmp=false;
			var vData={ IConType:"C",
						IBukrs:vSig,
						IPernr:oSessionData.Pernr,
						ILangu:oSessionData.Langu,
						IMolga:oSessionData.Molga,
						MedicalApplyExport:[],
						MedicalApplyTableIn:[],
						MedicalApplyTableIn0:[],
						MedicalApplyTableIn3:[],
						MedicalApplyTableIn4:[],
						MedicalApplyTableIn5:[],
						MedicalApplyTableInH:[]
						}
			if(vSig=="1000"){
				vData.MedicalApplyTableIn.push($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0]);				
				oController._vArr1.forEach(function(e){
					eval("vData.MedicalApplyTableIn[0]."+e+"=vData.MedicalApplyTableIn[0]."+e+".replace(/\,/gi,'')");
				});
				vData.MedicalApplyTableIn[0].Chk1?vData.MedicalApplyTableIn[0].Zfvcgb="X":vData.MedicalApplyTableIn[0].Zfvcgb="";
				vData.MedicalApplyTableIn[0].Chk2?vData.MedicalApplyTableIn[0].Ziftgb="X":vData.MedicalApplyTableIn[0].Ziftgb="";
				vData.MedicalApplyTableIn[0].PatiName=$.app.byId(oController.PAGEID+"_dSel1").getSelectedItem().getText();
			}else{
				vData.MedicalApplyTableIn.push($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0]);
				oController._vArr2.forEach(function(e){
					eval("vData.MedicalApplyTableIn[0]."+e+"=new String(vData.MedicalApplyTableIn[0]."+e+").replace(/\,/gi,'')");
				});
			}
			delete vData.MedicalApplyTableIn[0].Close;
			delete vData.MedicalApplyTableIn[0].Chk1;
			delete vData.MedicalApplyTableIn[0].Chk2;
			vSig=="1000"?vData.IMedDate=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].MedDate:vData.IMedDate=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].MedDate;
			oModel.create("/MedicalApplySet", vData, null,
					function(data,res){
						if(data&&data.MedicalApplyTableIn.results.length){
							if(vSig=="1000"){
								var oJSON = $.app.byId(oController.PAGEID+"_Mat").getModel();
								var aData={Pop1:[],Pop2:[]};
								data.MedicalApplyTableIn.results.forEach(function(e){							
									aData.Pop1.push(e);
								});
								oJSON.setData(aData);
								$.app.byId(oController.PAGEID+"_Mat").bindElement("/Pop1/0");
								vTmp=true;
							}else{
								var oJSON = $.app.byId(oController.PAGEID+"_Mat2").getModel();
								var aData={Pop1:[],Pop2:[]};
								data.MedicalApplyTableIn.results.forEach(function(e){							
									aData.Pop2.push(e);
								});
								oJSON.setData(aData);
								$.app.byId(oController.PAGEID+"_Mat2").bindElement("/Pop2/0");
								vTmp=true;
							}
						}
					},
					function (oError) {
						if(vSig2!="S"){
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
						vTmp=false;
					}
				);
			vSig=="1000"?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Close=oController._onClose:
						 $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Close=oController._onClose;
			if(vSig=="1000"){
				vData.MedicalApplyTableIn[0].Zfvcgb=="X"?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1=true:
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1=false;
				vData.MedicalApplyTableIn[0].Ziftgb=="X"?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2=true:
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2=false;
				oController._vArr1.forEach(function(e){
					var oPro=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0];
					eval("oPro."+e+"=parseInt(oPro."+e+");");
					eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop1/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
				});
			}else{
				oController._vArr2.forEach(function(e){
					var oPro=$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.getProperty("/Pop2")[0];
					eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop2/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
				});
			}
			return vTmp;
		},

		onSaveProcess : function(oController,vSig){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oCal=oController.onCal(vSig,"S");
			var oModel=sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");	
			var oSessionData=oController._SessionData;		
			if(oCal){
				var vData={ IConType:"",
				IBukrs:vSig,
				IPernr:oSessionData.Pernr,
				ILangu:oSessionData.Langu,
				IMolga:oSessionData.Molga,
				MedicalApplyExport:[],
				MedicalApplyTableIn:[],
				MedicalApplyTableIn0:[],
				MedicalApplyTableIn3:[],
				MedicalApplyTableIn4:[],
				MedicalApplyTableIn5:[],
				MedicalApplyTableInH:[]
				}
				oController._onDialog=="M"?vData.IConType="2":vData.IConType="3";
				vSig=="1000"?vData.IMedDate=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].MedDate:vData.IMedDate=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].MedDate;
				if(vSig=="1000"){
					vData.MedicalApplyTableIn.push($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0]);
					oController._vArr1.forEach(function(e){
						eval("vData.MedicalApplyTableIn[0]."+e+"=vData.MedicalApplyTableIn[0]."+e+".replace(/\,/gi,'')");
					});
					vData.MedicalApplyTableIn[0].Chk1?vData.MedicalApplyTableIn[0].Zfvcgb="X":vData.MedicalApplyTableIn[0].Zfvcgb="";
					vData.MedicalApplyTableIn[0].Chk2?vData.MedicalApplyTableIn[0].Ziftgb="X":vData.MedicalApplyTableIn[0].Ziftgb="";
				}else{
					vData.MedicalApplyTableIn.push($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0]);
					oController._vArr2.forEach(function(e){
						eval("vData.MedicalApplyTableIn[0]."+e+"=vData.MedicalApplyTableIn[0]."+e+".replace(/\,/gi,'')");
					});
				}
				var uFiles=new Array();
				if(vSig=="1000"){
					for(var i=1;i<=7;i++){
						fragment.COMMON_ATTACH_FILES.getFileLength(oController,"00"+i)!=0?uFiles.push("00"+i):null;
					}
					vData.MedicalApplyTableIn[0].Appnm=fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController,uFiles);
					vData.MedicalApplyTableIn[0].PatiName=$.app.byId(oController.PAGEID+"_dSel1").getSelectedItem().getText();
				}else{
					vData.MedicalApplyTableIn[0].Appnm=fragment.COMMON_ATTACH_FILES.uploadFile.call(oController,"008");
				}				
				delete vData.MedicalApplyTableIn[0].Close;
				delete vData.MedicalApplyTableIn[0].Chk1;
				delete vData.MedicalApplyTableIn[0].Chk2;
				oModel.create("/MedicalApplySet", vData, null,
						function(data,res){
							if(data&&data.MedicalApplyTableIn.results.length){
								new sap.m.MessageBox.alert(oBundleText.getText("MSG_44002"),{
									title:oBundleText.getText("LABEL_35023"),
									onClose:function(){
										if(vSig=="1000"){oController.onClose();oController.onSearch();}else{
											oController.onClose2();oController.onSearch();
										}}
								});
							}
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
				if(vSig=="1000"){
					vData.MedicalApplyTableIn[0].Zfvcgb=="X"?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1=true:
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk1=false;
					vData.MedicalApplyTableIn[0].Ziftgb=="X"?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2=true:
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Chk2=false;
					oController._vArr1.forEach(function(e){
						var oPro=$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.getProperty("/Pop1")[0];
						eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop1/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
					});					
				}else{
					oController._vArr2.forEach(function(e){
						var oPro=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0];
						eval("$.app.byId('ZUI5_HR_MedApply.m.MedApplyDetA100').getController()._DataModel.setProperty('/Pop2/0/"+e+"',common.Common.numberWithCommas(oPro."+e+"))");
					});
				}
			}
		},

		onSave : function(Sig){
			var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			var oValid = oController.onValid(oController);
			if(oValid){
				var oMsg=oBundleText.getText("MSG_44001");			
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
				});
			}
		},

		onLiveMoney : function(oEvent){
			var s = oEvent.getParameter("value");
			var vTmp=false;
			isNaN(s.replace(/\,/g,""))?vTmp=true:null;
			var oId=$.app.byId(oEvent.getSource().getId());
			vTmp?oId.setValue("0"):oId.setValue(common.Common.numberWithCommas(new String(parseInt(s.replace(/\,/g,"")))).trim());
			oId.getValue().trim()==""||oId.getValue().trim()=="NaN"?oId.setValue("0"):null;
			$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController().eqFunc();
		},
		
		eqFunc:function(){
			var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
			if(oController._Bukrs=="1000"){
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkiobd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkibbm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkijbd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkijbm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znijcd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znijcm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zniiwd=common.Common.numberWithCommas(Math.round(
					(parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zniiwm.replace(/\,/gi,""))*0.5).toFixed(1)));
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znisdd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znisdm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znoctd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znoctm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znomrd=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znomrm;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znocud=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znocum;
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znobcd=common.Common.numberWithCommas(Math.round(
					(parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znobcm.replace(/\,/gi,""))*0.5).toFixed(1)));
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].BaseAmt=common.Common.numberWithCommas(
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkiobd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkijbd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znijcd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zniiwd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znisdd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znoctd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znocud.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znobcd.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znomrd.replace(/\,/gi,"")));
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].NsuppAmt=common.Common.numberWithCommas(
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].BaseAmt.replace(/\,/gi,""))-
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].SuppAmt.replace(/\,/gi,"")));
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Mycharge=common.Common.numberWithCommas(
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkibbm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zkijbm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znijcm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Zniiwm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znisdm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znoctm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znomrm.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znocum.replace(/\,/gi,""))+
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].Znobcm.replace(/\,/gi,"")));
			}else{
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Znobcd=common.Common.numberWithCommas(Math.round(
					(parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Znobcm.replace(/\,/gi,""))*0.5).toFixed(1)));
				if($.app.byId(oController.PAGEID+"_dSel3").getSelectedKey()!="C"&&$.app.byId(oController.PAGEID+"_dSel3").getSelectedKey()!="D"){
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medmp=common.Common.numberWithCommas(parseInt(
					(parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medsp.replace(/\,/gi,""))*0.1
					+parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medpp.replace(/\,/gi,""))*0.2).toFixed(1)));
				}else{
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medmp="0";
				}
				if($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Gtz51=="D"){
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medpp;
				}else if($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Gtz51=="C"){
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt=common.Common.numberWithCommas(
						parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medpp.replace(/\,/gi,""))+
						parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Znobcd.replace(/\,/gi,"")));
				}else{
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt=
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Ptamt.replace(/\,/gi,""))
					-parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Inspp.replace(/\,/gi,""))-
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Medmp.replace(/\,/gi,""))
					-parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Insnp.replace(/\,/gi,""))-
					parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Oiamt.replace(/\,/gi,""))
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt<0?$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt=0:
					$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt=common.Common.numberWithCommas(parseInt($.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop2")[0].Framt));
				}
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