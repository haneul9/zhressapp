/* eslint-disable no-eval */
/* eslint-disable no-undef */
jQuery.sap.require("sap.m.MessageBox");
$.sap.require("common.Check_Regno");
sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"../../common/PageHelper",
	"../../common/AttachFileAction",
	"../../common/EmployeeModel",
	"sap/ui/core/BusyIndicator"], 
	function (Common, CommonController, JSONModelHelper, PageHelper,AttachFileAction, EmployeeModel, BusyIndicator) {
	var SUB_APP_ID = [$.app.CONTEXT_PATH, "FamilyApplyDet"].join($.app.getDeviceSuffix());
	return CommonController.extend(SUB_APP_ID, {

		PAGEID: "FamilyApplyDet",
		BusyDialog : new sap.m.BusyDialog().addStyleClass("centerAlign"),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Docid : "",
		_Bukrs : "",
		_SessionData : {},
		_ViewData : {},
		_tData : null,
		_vArr : new Array(),
		EmployeeModel: new EmployeeModel(),
		_SelectData : {},
		_ModiData : {},
		_onDialog : "N",
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
			var oServiceURL2 = oController.getUrl("/sap/opu/odata/sap/ZHR_BENEFIT_SRV/");
			var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
			oModel2.setCountSupported(false);
			oModel2.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModel2, "ZHR_BENEFIT_SRV");
		},

		onBeforeShow: function(oEvent){
			this.getSelector(oEvent.data[1],oEvent.data[2],oEvent.data[3]);
			this._tData=oEvent.data[0];
			this._onDialog=oEvent.data[4];
			this._SessionData=oEvent.data[5];
		},

		navBack : function(){
			BusyIndicator.show(0);
			setTimeout(function(){
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "FamilyApply"].join($.app.getDeviceSuffix())
				});
				BusyIndicator.hide();
			}, 1);
		},
		
		getTxt:function(vTxt,vNo){
			var redStar="<span style='color:red;font-weight:bold;font-size:14px;'>*</span>";
			return vNo==15||vNo==16||vNo==17||vNo==18||vNo==29||vNo==30?"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText(vTxt)+"</span>"+redStar:
			"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText(vTxt)+"</span>";
		},

		getMobileTxt:function(vTxt,vNo){  
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			return vNo==15||vNo==16||vNo==17||vNo==18||vNo==29||vNo==30?new sap.m.Label({required:true,text:oController.getBundleText(vTxt),width:"100%"}):
			new sap.m.Label({required:false,text:oController.getBundleText(vTxt),width:"100%"});
		},

		initTdata:function(){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			oController._tData={
				Famsat:"",
				Kdsvht:"",
				Fcnam:"",
				Regnot:"",
				Zzbdate:null,
				Fgbdt:null,
				Fasext:"",
				Fasart:"",
				Dptid:"",
				Livid:"",
				Helid:"",
				Apdat:null,
				Status:"",
				Reqrs:"",
				Emetl:"",
				Notes:"",
				Famsa:"",
				Kdsvh:"",
				Fanat:"KR",
				Fgbld:"KR",
				Fasar:"",
				Lnmhg:"",
				Fnmhg:"",
				Regno:"",
				Zzclass:"1",
				Appnm:"",
				Opener:"X"};	
		},

		onClose:function(){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			if(oController.oDialog.isOpen()){
				oController.oDialog.close();
			}
		},

		onDialog : function(flag){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			oController._onDialog=flag;
			if (!oController.oDialog) {
				oController.oDialog = sap.ui.jsfragment("ZUI5_HR_FamilyApply.fragment.popup", oController);
				$.app.getView().addDependent(oController.oDialog);
			}
			oController.initTdata();
			oController.oDialog.open();

		},

		onRe : function(){  
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			var oJSON=$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel();
			oJSON.setProperty("/oData/0/Opener","X");
			var vAppnm = oJSON.getProperty("/oData")[0].Appnm;
			var vStatus = oJSON.getProperty("/oData")[0].Opener;
			oController.setAttachFile(oController, {
				Required: true,
				InfoMessage:oBundleText.getText("LABEL_44030"),
				Mode: "S",
				Max: "1",
				Editable: true
			});	
			$.app.byId(oController.PAGEID+"_Re").setVisible(false);
		},

		onAfterOpen : function(oEvent){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			var oJSON=new sap.ui.model.json.JSONModel();
			var aData={oData:[]};
			aData.oData.push(oController._tData);
			oController._tData.Regno!=""&&
			oController._tData.Regno.search("-")==-1?oController._tData.Regno=oController._tData.Regno.substring(0,6)+"-"+oController._tData.Regno.substring(6):null;
			oJSON.setData(aData);
			$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").setModel(oJSON);
			$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").bindElement("/oData/0");
			oController.onChange("B");
			$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").bindElement("/oData/0");
			var vAppnm = oJSON.getProperty("/oData")[0].Appnm;
			var vStatus = oJSON.getProperty("/oData")[0].Opener;
			$("#"+this.PAGEID+"_ATTACHBOX").children()[0].childNodes[0].childNodes[0].style.width="70px";
			BusyIndicator.show(0);			
			if(oController._onDialog=="N"){
				oController.initTdata();
				$.app.byId(oController.PAGEID+"-app-title").setText(oBundleText.getText("LABEL_44037"));
			}else if(oController._onDialog=="M"){
				if(oController._tData.Opener=="X"){
					$.app.byId(oController.PAGEID+"-app-title").setText(oBundleText.getText("LABEL_44038"));
				}else{
					$.app.byId(oController.PAGEID+"-app-title").setText(oBundleText.getText("LABEL_44039"));
				}
				if(oController._tData.Status==""){
					$.app.byId(oController.PAGEID+"_Sel1").setEditable(false);
					$.app.byId(oController.PAGEID+"_Sel2").setEditable(false);
				}				
			}
			setTimeout(function(){
				oController._ModiData={Name:$.app.byId(oController.PAGEID+"_Lnmhg").getValue().trim()+
					$.app.byId(oController.PAGEID+"_Fnmhg").getValue().trim(),Regno:$.app.byId(oController.PAGEID+"_Regno").getValue().trim()};
				var vSetFileData={
					Appnm: vAppnm,
					Required: true,
					InfoMessage:oBundleText.getText("LABEL_44030"),
					Mode: "S",
					Max: "1",
					Editable: vStatus=="X"?true:false
				};
					
				var oDialog=$.app.byId(oController.PAGEID+"_Dialog");
				if(oController._onDialog=="M"){
					if(oJSON.getProperty("/oData")[0].Opener!="X"&&(oJSON.getProperty("/oData")[0].Status=="99"||oJSON.getProperty("/oData")[0].Status=="")){
						setTimeout(function(){
							$("#"+oController.PAGEID+"_ModLine").css("display","none");
							$("#"+oController.PAGEID+"_ModLine2").css("display","none");
						},10);
					}else{
						setTimeout(function(){
							$("#"+oController.PAGEID+"_ModLine").css("display","");
							$("#"+oController.PAGEID+"_ModLine2").css("display","");
						},10);
					}
				}else{
					setTimeout(function(){
						$("#"+oController.PAGEID+"_ModLine").css("display","none");
						$("#"+oController.PAGEID+"_ModLine2").css("display","");
					},10);
				}  
				
				if(oController._onDialog=="M"){
					vSetFileData.InfoMessage=oBundleText.getText("LABEL_44043");
					if(oJSON.getProperty("/oData")[0].Opener=="X"&&(oJSON.getProperty("/oData")[0].Status==""||oJSON.getProperty("/oData")[0].Status=="88"||oJSON.getProperty("/oData")[0].Status=="99")){
						vSetFileData.Editable=true;
						vSetFileData.Appnm="";
						oController.setAttachFile(oController,vSetFileData);
					}else if(oJSON.getProperty("/oData")[0].Opener!="X"&&(oJSON.getProperty("/oData")[0].Status==""||oJSON.getProperty("/oData")[0].Status=="88"||oJSON.getProperty("/oData")[0].Status=="99")){
						vSetFileData.Editable=false;
						vSetFileData.Appnm="";
						oController.setAttachFile(oController,vSetFileData);
					}else{
						vSetFileData.Editable=false;
						delete vSetFileData.InfoMessage;
						oController.setAttachFile(oController,vSetFileData);
					}					
				}else{
					vSetFileData.Editable=true;
					oController.setAttachFile(oController,vSetFileData);
				}
				BusyIndicator.hide();
			},10);
		},
		
		onAfterShow: function(oEvent){
			this.onAfterOpen();
		},

		chkAll : function(){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
		},
												  //refresh
		setAttachFile: function (oController, opt) {
			var options = $.extend(
					true,
					{ 
						Editable: false, 
						InfoMessage: "", 
						Appnm: "",
						Mode: "S",	// S: single file, M: multi file
						Max: 2,
						Required: false,
						HelpButton: false,
						HelpTextList: []
					},
					opt
				),
				oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
				oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX");
	
			oFileUploader.setValue("");
	
			options.ListMode = options.Editable ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
			options.FileTypes = ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "jpg", "bmp", "gif", "png", "txt", "pdf", "jpeg"];
			if (!common.Common.isEmptyArray(opt.FileTypes)) options.FileTypes = opt.FileTypes;
	
			oAttachbox.getModel().setProperty("/Settings", options);
			oAttachbox.getModel().setProperty("/DelelteDatas", []);
			oController.refreshAttachFileList(oController);
		},

			/*
	 * ???????????? ???????????? Binding??????.
	 */
	refreshAttachFileList: function (oController, vExistDataFlag) {
		var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner"),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
			oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
			JSonModel = oAttachbox.getModel(),
			vAttachFileDatas = JSonModel.getProperty("/Data"),
			vAppnm = JSonModel.getProperty("/Settings/Appnm"),
			Datas = { Data: [] };

		if(!vAppnm) {
			JSonModel.setProperty("/Settings/Length", 0);
			JSonModel.setProperty("/Data", []);
			return;
		}

		if (f1) f1.setAttribute("value", "");

		oFileUploader.clear();
		oFileUploader.setValue("");
		oAttachFileList.removeSelections(true);

		oModel.read("/FileListSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)
			],
			success: function (data) {
				if (data && data.results.length) {
					data.results.forEach(function (elem) {
						elem.New = false;
						elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);

						Datas.Data.push(elem);
					});
				}
			},
			error: function (res) {
				common.Common.log(res);
			}
		});

		// DB?????? ??? ?????? File List ??? ????????? ?????????. ( ????????? DB??? ?????? ??? File List ??? ???????????? ????????? )
		if (vExistDataFlag == "X" && vAttachFileDatas) {
			vAttachFileDatas.forEach(function (elem) {
				if(elem.New === true) Datas.Data.push(elem);
			});
		}

		JSonModel.setProperty("/Settings/Length", Datas.Data.length);
		JSonModel.setProperty("/Data", Datas.Data);
	},

		changeFile: function () {
			var oController = $.app.getController(),
				reader = new FileReader(),
				f = jQuery.sap.domById(oController.PAGEID + "_UPLOAD_BTN" + "-fu").files[0];
			reader.readAsArrayBuffer(f);
		},

		getSelector : function(sData,sData2,sData3){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			var oSel1=$.app.byId(oController.PAGEID+"_Sel1");
			var oSel2=$.app.byId(oController.PAGEID+"_Sel2");
			var oSel3=$.app.byId(oController.PAGEID+"_Sel3");
			var oSel4=$.app.byId(oController.PAGEID+"_Sel4");
			var oSel5=$.app.byId(oController.PAGEID+"_Sel5");
			for(var i=1;i<=5;i++){
				eval("oSel"+i+".removeAllItems();");
				eval("oSel"+i+".addItem(new sap.ui.core.Item({text:'',key:''}));");
			}
			
			var oSel1Data=new Array();
			if(sData&&sData.length){
				for(var i=0;i<sData.length;i++){
					if(i!=0){
						if(sData[i].Famsa!=sData[i-1].Famsa){
							oSel1Data.push(sData[i]);
						}
					}else{
						oSel1Data.push(sData[i]);
					}
				}
			}
			oSel1Data.forEach(function(e){
				oSel1.addItem(new sap.ui.core.Item({text:e.Famsat,key:e.Famsa}));
			});
			
			if(sData2&&sData2.length){				
				for(var i=0;i<sData2.length;i++){
					if(sData2[i].Code=="KR"){
						oSel3.addItem(new sap.ui.core.Item({text:sData2[i].Text,key:sData2[i].Code}));
						oSel4.addItem(new sap.ui.core.Item({text:sData2[i].Text,key:sData2[i].Code}));
						break;
					}
				}
				sData2.sort(function(a, b) {
					return a.Text < b.Text ? -1 : a.Text > b.Text ? 1 : 0;
				});
				for(var i=0;i<sData2.length;i++){
					if(sData2[i].Code!="KR"&&sData2[i].Code!="TF"){
						oSel3.addItem(new sap.ui.core.Item({text:sData2[i].Text,key:sData2[i].Code}));
						oSel4.addItem(new sap.ui.core.Item({text:sData2[i].Text,key:sData2[i].Code}));
					}
				}
				oSel3.setSelectedKey("KR");
				oSel4.setSelectedKey("KR");
			}
			
			if(sData3&&sData3.length){
				for(var i=0;i<sData3.length;i++){
					oSel5.addItem(new sap.ui.core.Item({text:sData3[i].Fasart,key:sData3[i].Fasar}));
				}
			}
			for(var i=1;i<=5;i++){
				if(i!=3&&i!=4){
					eval("oSel"+i+".setSelectedKey('');");
				}
			}
		},

		onChange : function(flag){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			var oSel1=$.app.byId(oController.PAGEID+"_Sel1");
			var oSel2=$.app.byId(oController.PAGEID+"_Sel2");
			oSel2.removeAllItems();
			oSel2.addItem(new sap.ui.core.Item({text:'',key:''}));
			var sData=$.app.getController()._ViewData.FamilyupdateTablein3.results;
			if(sData&&sData.length){
				for(var i=0;i<sData.length;i++){
					if(oSel1.getSelectedKey()==sData[i].Famsa){
						oSel2.addItem(new sap.ui.core.Item({text:sData[i].Kdsvht,key:sData[i].Kdsvh}));
					}
				}
			}
			if(flag!="B"){
				oSel2.setSelectedKey('');
			}
		},

		oTableInit : function(){
			var oController=sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getController();
			var c=sap.ui.commons;
			var oTable=$.app.byId(oController.PAGEID+"_Table");
			oTable.destroyColumns();
			var oFields=["Famsat","Kdsvht","Fcnam","Regnot","Zzbdatet","Fasext","Fasart","Dptid","Livid","Helid","Apdat","StatusText","Notes"];			
			var oWidths=['','120px','140px','120px','120px','160px','90px','120px','120px','90px','120px','120px','120px',''];			
			var oLabels=new Array();
			for(var i=2;i<15;i++){
				i<10?i="0"+i:null;
				oLabels.push({Label:"LABEL_440"+i,Width:oWidths[i-1],Align:"Center"});
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
				
				if(i==7||i==8||i==9){
					oCol.setTemplate(new sap.ui.core.Icon({
						src:"sap-icon://accept",
						color:{path:oFields[i],formatter:function(fVal){return fVal=="X"?"black":"white";}}
					}));
				}else if(i==10){
					oCol.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : oFields[i], 
							type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
						},
						textAlign : "Center"
					}).addStyleClass("FontFamily"));
				}else{
					oCol.setTemplate(new sap.ui.commons.TextView({text:"{"+oFields[i]+"}",textAlign:"Center"}).addStyleClass("FontFamily"));
				}				
				oTable.addColumn(oCol);
			});
		},

		nextPage1 : function(oEvent){

		},
		
		onAutoInputReg : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet");
			var oController = oView.getController();
			var oPro=$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().getProperty("/oData")[0];
			var s = oEvent.getParameter("value");
			var oId=oEvent.getSource().getId();
			var vGender = "";

			if(s.length>0&&s.length<7&&isNaN(s)){
				$.app.byId(oId).setValue();
			}
			if(!/\*/.test(oEvent.getSource().getValue())) {
				s = s.replace(/-/g, "");
			}
			if($.app.byId(oId).getValue().search("-")==-1){
				isNaN(s)?$.app.byId(oId).setValue():null;
			}
			if(s.length==13){
				if($.app.byId(oId).getValue().search("-")==-1){
					$.app.byId(oId).setValue($.app.byId(oId).getValue().substring(0,6)+"-"+$.app.byId(oId).getValue().substring(6));
				}

				vGender = $.app.byId(oId).getValue().substring(7,8);

				if(vGender=="3" || vGender=="4" || vGender=="7" || vGender=="8"){
					oPro.Fgbdt=new Date("20"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
					oPro.Zzbdate=new Date("20"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
				}else{
					oPro.Fgbdt=new Date("19"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
					oPro.Zzbdate=new Date("19"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
				}
			}else if(s.length==14){
				vGender = $.app.byId(oId).getValue().substring(7,8);

				if(vGender=="3" || vGender=="4" || vGender=="7" || vGender=="8"){
					oPro.Fgbdt=new Date("20"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
					oPro.Zzbdate=new Date("20"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
				}else{
					oPro.Fgbdt=new Date("19"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
					oPro.Zzbdate=new Date("19"+$.app.byId(oId).getValue().substring(0,2)+"-"+$.app.byId(oId).getValue().substring(2,4)+"-"+$.app.byId(oId).getValue().substring(4,6));
				}
			}
			var oRrn=oController.rrn($.app.byId(oId).getValue());
			$.app.byId(oId).setValue(oRrn);
		},

		checkNull : function (str){ if(typeof str == "undefined" || str == null || str == ""){ return true; } else{ return false; } },

		rrn : function(str){ 
			var oController=$.app.getController();
			var originStr = str; 
			var rrnStr; 
			var maskingStr;

			if(oController.checkNull(originStr)) {
				return originStr;
			} 

			rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8]{1}[0-9]{6}\b/gi);

			if(!oController.checkNull(rrnStr)){
				maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/(-?)([1-8]{1})([0-9]{6})\b/gi,"$1$2******"));
			} else { 
				rrnStr = originStr.match(/\d{13}/gi);

				if(oController.checkNull(rrnStr) == false) {
					maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/([0-9]{6})$/gi,"******"));
				} else { 
					return originStr;
				}
			} 

			$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().setProperty("/oData/0/Regno",originStr);
			
			return maskingStr;
		},

		onValid : function(oController){ 
			var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet");
			var oController = oView.getController();
			var oPro=$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().getProperty("/oData")[0];
			var oMsg="";
			var vStatus = $.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().getProperty("/oData")[0].Status;
			if(oPro.Famsa==""){
				oMsg=oBundleText.getText("MSG_44005");				
			}
			if(oController._onDialog!="M"&&vStatus!=""){
				if(oPro.Kdsvh==""){
					oMsg=oBundleText.getText("MSG_44006");				
				}
			}
			if(oPro.Lnmhg.trim()==""||oPro.Fnmhg.trim()==""){
				oMsg=oBundleText.getText("MSG_44007");
			}
			if(oPro.Fgbdt=="Invalid Date"){
				oMsg=oBundleText.getText("MSG_44019");
			}
			if(!/\*/.test(oPro.Regnot)) {
				if(oPro.Regno.trim()==""){
					oMsg=oBundleText.getText("MSG_44008");
				}
				if(oPro.Regno.length!=14){
					oMsg=oBundleText.getText("MSG_44019");
				}
			}
			if($.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().getProperty("/oData")[0].Opener=="X"&&oController._onDialog=="N"){
				if(AttachFileAction.getFileLength(oController) === 0) {
					oMsg=oController.getBundleText("MSG_21007");
				}
			}
			if(oController._onDialog=="M"){
				if(vStatus=="99"||vStatus==""||vStatus=="88"){
					if(oController._ModiData.Name!=($.app.byId(oController.PAGEID+"_Lnmhg").getValue().trim()+$.app.byId(oController.PAGEID+"_Fnmhg").getValue().trim())){
						if(AttachFileAction.getFileLength(oController) === 0) {
							oMsg=oController.getBundleText("MSG_21007");
						}
						if(oPro.Reqrs.trim()==""){
							oMsg=oBundleText.getText("MSG_44016");
						}
					}
					if(oController._ModiData.Regno!=($.app.byId(oController.PAGEID+"_Regno").getValue().trim())){
						if(AttachFileAction.getFileLength(oController) === 0) {
							oMsg=oController.getBundleText("MSG_21007");
						}
						if(oPro.Reqrs.trim()==""){
							oMsg=oBundleText.getText("MSG_44016");
						}
					}
				}
			}else{
				if(AttachFileAction.getFileLength(oController) === 0) {
					oMsg=oController.getBundleText("MSG_21007");
				}
			}
			if(oMsg!=""){
				sap.m.MessageBox.alert(oMsg);
				return false;
			}

			var vRegChk=common.Check_Regno.isValidJuminNo(oPro.Regno.split("-")[0]+oPro.Regno.split("-")[1]),
				vBirth = parseInt(oPro.Regno.split("-")[0]),
				vGender = oPro.Regno.split("-")[1].substring(0,1);

			if(vBirth >= 201001 && (vGender === "3" || vGender === "4" || vGender === "7" || vGender === "8")) {
				Common.log(oPro.Regno);
			} else {
				if(!/\*/.test(oPro.Regnot) && !vRegChk){
					sap.m.MessageBox.show(
						oBundleText.getText("MSG_44013"), {				
						icon: sap.m.MessageBox.Icon.INFORMATION,				
						title: oBundleText.getText("LABEL_35023"),				
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
						onClose: function(fVal) {
							if(fVal=="YES"){
								oController.onSaveProcess(oController);
							}
						}				
					});
					return false;
				}	
			}				
			return true;
		},

		onSaveProcess : function(oController,Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet");
			var oController = oView.getController();
			var oModel=$.app.getModel("ZHR_BENEFIT_SRV");
			var oSessionData=oController._SessionData;
			var oPro=$.app.byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet").getModel().getProperty("/oData")[0];
			oPro.Pernr=oSessionData.Pernr;
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			oPro.Appnm=AttachFileAction.uploadFile.call(oController);
			var vData2={
				IMode:"I",
				IBukrs:"1000",
				IPernr:oSessionData.Pernr,
				ILangu:oSessionData.Langu,
				IDatum:"\/Date("+new Date().getTime()+")\/",
				FamilyupdateTablein1:[oPro],FamilyupdateTablein2:[],FamilyupdateTablein3:[],FamilyupdateTablein4:[],FamilyupdateExport:[]
			};
			if(AttachFileAction.getFileLength(oController) != 0) {
				vData2.IFile="X";
			}				
			oController._onDialog=="M"?vData2.IMode="U":vData2.IMode="I";
			oController._onDialog=="M"?vData2.FamilyupdateTablein1[0].Seqnr=vData2.FamilyupdateTablein1[0].Seqnr:vData2.FamilyupdateTablein1[0].Seqnr="";	
			$.app.byId(oController.PAGEID+"_Dptid").getSelected()?vData2.FamilyupdateTablein1[0].Dptid="X":vData2.FamilyupdateTablein1[0].Dptid="";
			$.app.byId(oController.PAGEID+"_Livid").getSelected()?vData2.FamilyupdateTablein1[0].Livid="X":vData2.FamilyupdateTablein1[0].Livid="";
			$.app.byId(oController.PAGEID+"_Helid").getSelected()?vData2.FamilyupdateTablein1[0].Helid="X":vData2.FamilyupdateTablein1[0].Helid="";
			$.app.byId(oController.PAGEID+"_Zzclass").getSelected()?vData2.FamilyupdateTablein1[0].Zzclass="2":vData2.FamilyupdateTablein1[0].Zzclass="1";
			
			if(vData2.FamilyupdateTablein1[0].Regno === "") {
				vData2.FamilyupdateTablein1[0].Fasex = "";
			} else {
				vData2.FamilyupdateTablein1[0].Regno.split("-")[1].substring(0,1) == "1" || vData2.FamilyupdateTablein1[0].Regno.split("-")[1].substring(0,1) == "3" 
					? vData2.FamilyupdateTablein1[0].Fasex="1"
					: vData2.FamilyupdateTablein1[0].Fasex="2";
			}

			if(oPro.Zzbdate!=""&&oPro.Zzbdate!=null&&oPro.Zzbdate!="Invalid Date"){
				vData2.FamilyupdateTablein1[0].Zzbdate=dateFormat.format(vData2.FamilyupdateTablein1[0].Zzbdate);
				vData2.FamilyupdateTablein1[0].Zzbdate=new Date(vData2.FamilyupdateTablein1[0].Zzbdate+"T09:00:00");
			}else{
				vData2.FamilyupdateTablein1[0].Zzbdate=null;
			}
			if(oPro.Fgbdt!=""&&oPro.Fgbdt!=null&&oPro.Fgbdt!="Invalid Date"){
				vData2.FamilyupdateTablein1[0].Fgbdt=dateFormat.format(vData2.FamilyupdateTablein1[0].Fgbdt);
				vData2.FamilyupdateTablein1[0].Fgbdt=new Date(vData2.FamilyupdateTablein1[0].Fgbdt+"T09:00:00");
			}else{
				vData2.FamilyupdateTablein1[0].Fgbdt=null;
			}			
			
			vData2.FamilyupdateTablein1[0].Regno.search("-")!=-1
				? vData2.FamilyupdateTablein1[0].Regno = vData2.FamilyupdateTablein1[0].Regno.split("-")[0]+vData2.FamilyupdateTablein1[0].Regno.split("-")[1]
				: null;
			
			delete vData2.FamilyupdateTablein1[0].Opener;
			
			oModel.create("/FamilyupdateSet", vData2, {
				success: function(data,res){
					var vMsg="";
					if(data&&data.FamilyupdateExport.results.length){
						vMsg=data.FamilyupdateExport.results[0].EMsg;
					}
					vMsg==""?vMsg=oBundleText.getText("MSG_44002"):null;
					new sap.m.MessageBox.alert(vMsg,{
						title:oBundleText.getText("LABEL_35023"),
						onClose:function(){oController.navBack();}
					});
					oPro.Regno.search("-")==-1?oPro.Regno=oPro.Regno.substring(0,6)+"-"+oPro.Regno.substring(6):null;
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
					oPro.Regno.search("-")==-1?oPro.Regno=oPro.Regno.substring(0,6)+"-"+oPro.Regno.substring(6):null;
					oPro.Opener="X";
				}
			});
		},

		onSave : function(Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyApply.m.FamilyApplyDet");
			var oController = oView.getController();
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