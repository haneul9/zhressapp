jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"sap/ui/core/dnd/DragInfo",
	"sap/ui/core/dnd/DropPosition",
	"sap/f/dnd/GridDropInfo",
	"sap/f/GridContainerSettings",
	"sap/f/GridContainer"], 
	function (Common, CommonController, JSONModelHelper, PageHelper ,DragInfo, DropPosition, GridDropInfo, GridContainerSettings, GridContainer) {
	"use strict";

	return CommonController.extend("ZUI5_HR_MssMboEval.MssMboEval", {

		PAGEID: "MssMboEval",
		BusyDialog : new sap.m.BusyDialog().addStyleClass("centerAlign"),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Docid : "",
		_Bukrs : "",
		_SheetData :{TableIn2:{results:[]},
					 TableIn4:{results:[]}},
		_PreData : {},
		_tableLength : 0,
		_tData: {},
		_pData : new Array(),
		vPage : "0",
		_vArr : null,
		_realTimeData : null,
		_gvApstu : "",
		_FinSet : {},
		_oTmp: true,
		_CompleteBtn:true,
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
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var vData={
				IOdkey:"",
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
		},
		
		onAfterRenderingTable : function() {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
            var oTable = $.app.byId(oController.PAGEID + "_Table1");
            var aRows = oTable.getRows();
			var byCols = [0];
            var theCols = [0];
			var myArray = new Array();
            if (aRows && aRows.length > 0) {
                var pRow; 
				var rowspan = 1;
                aRows.map(function(aRow, idx) {
					var a=0;
                    if (idx > 0) {
                        var cCells = aRow.getCells();
                        var pCells = pRow.getCells();
                        if (theCols.length < 1) byCols = cCells.map(function(x, i) { return i; });
						
                        if (byCols.filter(function(x) { return pCells[x].getText() == cCells[x].getText(); }).length == byCols.length) {
                            theCols.forEach(function(i) {								
                                rowspan = pCells[i].$().parent().parent().attr("rowspan") || 1;
                                rowspan = Number(rowspan) + 1;
                                $("#" + cCells[i].getId()).parent().parent().hide();
                                $("#" + pCells[i].getId()).parent().parent().attr("rowspan", rowspan);
                                if (aRows.length === idx + 1) {
                                    $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
                                }								
                            });
                        } else {
							rowspan = 1;
						}
                    }
                    if(rowspan === 1) pRow = aRow;
                });
            }
        },
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			switch (sKey) {
				case "1":
					oController.vPage=sKey;
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_1").setVisible(true);
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_2").setVisible(false);
					oController.bindData1(oController,"4"+sKey);
					break;			
				case "2":
					oController.vPage=sKey;
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_1").setVisible(true);
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_2").setVisible(false);
					oController.bindData1(oController,"4"+sKey);
					break;
				case "3":
					oController.vPage=sKey;
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_1").setVisible(true);
					$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_2").setVisible(false);
					oController.bindData1(oController,"4"+sKey);
					break;
				case "2a":
					oController.vPage=sKey;
					oController.bindData2(oController,"42");
					break;
				case "3a":
					oController.vPage=sKey;
					oController.bindData2(oController,"43");
					break;
				default :
					break;
			}
		},

		bindHeader : function(vData,oController,vPage){
			$.app.byId(oController.PAGEID+"_"+vPage+"_HoriArea").removeAllContent();
			$.app.byId(oController.PAGEID+"_"+vPage+"_HoriArea").addContent(common.EmpBasicInfoBoxCustom.renderHeader());
			return common.EmpBasicInfoBoxCustom.setHeader(vData.Appee);
		},

		getHeaderData : function(oController,vApprc,tData,Signal){
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;
			var oSel1,oSel2,oRow,oCell,oSel3;
			var c=sap.ui.commons;
			if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
				oController._BusyDialog.close();
			}
//INIT MTABLE////////////////////////////////////////////////////////////////////////////////
			var mTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mTable1");
			var mCol=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mCol1");
			var oSelPage2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_2");
			var oSelPage3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_3");
			var oSelPage4=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2_3");
			var oSelPage5=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3_3");
			oController.mTableInit(oController,mTable,mCol);
/////////////////////////////////////////////////////////////////////////////////////////////
//INIT GTABLE////////////////////////////////////////////////////////////////////////////////
			if(oController.vPage=="2a"||oController.vPage=="3a"){
				var gTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gTable");
				var gCol=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gCol");
				oController.gTableInit(oController,gTable,gCol);
			}
/////////////////////////////////////////////////////////////////////////////////////////////
			oController.oTableInit(oController);
			var oFields=["PgccdT","Gubun"];
			for(var i=1;i<=20;i++){
				i<=9?oFields.push("Cnt0"+i):oFields.push("Cnt"+i);
			}			
			if(vApprc=="41"||vApprc=="42"||vApprc=="43"){
				if(oController.vPage!="2a"&&oController.vPage!="3a"){
					oSel1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1");
					oSel2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2");
					oSel3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3");
					if(Signal==null){						
						oSel1.removeAllItems();
						oSel1.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
						oSel1.setSelectedKey('');						
						oSel2.removeAllItems();
						oSel2.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
						oSel2.setSelectedKey('');
						oSel3.removeAllItems();
						oSel3.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
						oSel3.setSelectedKey('');
					}
					oSelPage2.removeAllItems();
					oSelPage2.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
					oSelPage2.setSelectedKey('');
					oSelPage3.removeAllItems();
					oSelPage3.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
					oSelPage3.setSelectedKey('');
					if(vApprc=="42"||vApprc=="43"){
						oSelPage4.removeAllItems();
						oSelPage4.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
						oSelPage4.setSelectedKey('');
					}
					if(vApprc=="43"){
						oSelPage5.removeAllItems();
						oSelPage5.addItem(new sap.ui.core.Item({key:"",text:oBundleText.getText("LABEL_00181")}));
						oSelPage5.setSelectedKey('');
					}
				}
			}
			var vData={
				IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IMolga:oSessionData.Molga,
				IEmpid:oSessionData.Pernr,
				IPernr:oSessionData.Pernr,
				IAppid:oPreData.Appid,
				IApprc:vApprc,
				IDatum:oPreData.Apbdt,
				ILangu:oSessionData.Langu,
				TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[],TableIn5:[],TableIn6:[]};
			if(tData!=null){
				vData.IEmpid=tData.Appee;
				vData.IAppid=tData.Appid;
			}
			if(oController.vPage=="2a"||oController.vPage=="3a"){
				vData.IAporg="";
				vData.IAppgr="";
			}else{
				vData.IAporg=oSel1.getSelectedKey();
				vData.IAppgr=oSel2.getSelectedKey();
			}
			
			oModel.create("/AppraisalHeaderSet", vData, {
				success: function(data,res){
					if(vApprc=="41"||vApprc=="42"||vApprc=="43"){
						if(oController.vPage!="2a"&&oController.vPage!="3a"){
							if(data&&data.TableIn1.results.length){						
								oController._Docid=data.TableIn1.results[0].Docid;	
								oController._pData=data.TableIn1.results;						
								oController.oTableMapping(oController,data.TableIn1.results);										
							}else{
								oController.oTableMapping(oController,[]);
							}
							if(Signal==null){
								if(data&&data.TableIn4.results.length){			
									data.TableIn4.results.forEach(function(e){
										oSel1.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}))
									});	
								}
								if(data&&data.TableIn5.results.length){						
									data.TableIn5.results.forEach(function(e){
										oSel2.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}))
									});	
								}
							}
							if(data&&data.TableIn2.results.length){						
								var sData=data.TableIn2.results;
								sData.forEach(function(e){
									oSelPage2.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
									oSelPage3.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
									if(vApprc=="42"||vApprc=="43"){
										oSelPage4.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
										if(vApprc=="43"){
											oSelPage5.addItem(new sap.ui.core.Item({key:e.Code,text:e.Text}));
										}
									}
								});							
							}
							data&&data.TableIn6.results.length?
							oController.mTableMapping(oController,mTable,mCol,oFields,data.TableIn6.results):
							oController.mTableMapping(oController,mTable,mCol,oFields,[]);	
								
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
		},

		getHeaderData2 : function(oController,vApprc,tData){
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;
			var oSel1,oSel2,oRow,oCell;
			var c=sap.ui.commons;
			if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
				oController._BusyDialog.close();
			}
//INIT MTABLE////////////////////////////////////////////////////////////////////////////////
			var mTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mTable1");
			var mCol=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mCol1");
			oController.mTableInit(oController,mTable,mCol);
/////////////////////////////////////////////////////////////////////////////////////////////
//INIT GTABLE////////////////////////////////////////////////////////////////////////////////
			var gTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gTable");
			var gCol=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gCol");
			oController.gTableInit(oController,gTable,gCol);
/////////////////////////////////////////////////////////////////////////////////////////////
			var oFields=["PgccdT","Gubun","Cnt01","Cnt02"];
			for(var i=3;i<=20;i++){
				i<=9?oFields.push("Cnt0"+i):oFields.push("Cnt"+i);				
			}			
			var vData={
				IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IMolga:oSessionData.Molga,
				IEmpid:oSessionData.Pernr,
				IPernr:oSessionData.Pernr,
				IAppid:oPreData.Appid,
				IApprc:vApprc,
				IDatum:oPreData.Apbdt,
				ILangu:oSessionData.Langu,
				IAporg:"",
				IAppgr:"",
				TableIn1:[],TableIn2:[],TableIn3:[],Export:[]};

				var vDataA={
					IOdkey:"",
					IConType:"1",
					IBukrs:"1000",
					IMolga:oSessionData.Molga,
					IEmpid:oSessionData.Pernr,
					IPernr:oSessionData.Pernr,
					IAppid:oPreData.Appid,
					IApprc:vApprc,
					IDatum:oPreData.Apbdt,
					ILangu:oSessionData.Langu,
					TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[],TableIn5:[],TableIn6:[]};

//mTABLE 수정/////////////////////////////////////////////////////////////////////////////////////////////////

			oModel.create("/AppraisalHeaderSet", vDataA, {
				success: function(data,res){	
					data&&data.TableIn6.results.length?
					oController.mTableMapping(oController,mTable,mCol,oFields,data.TableIn6.results):
					oController.mTableMapping(oController,mTable,mCol,oFields,[]);					
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
			oModel.create("/AppraisalMboFinSet", vData, {
				success: function(data,res){
					if(data&&data.Export.results.length){						
						data.Export.results[0].Finyn=="X"?oController._CompleteBtn=false:oController._CompleteBtn=true;
					}else{
						oController._CompleteBtn=true;	
					}
					if(data&&data.TableIn3.results.length){						
						oController.gTableMapping(oController,gTable,gCol,null,data.TableIn3.results,data.TableIn2.results);	
					}else{
						oController.gTableMapping(oController,gTable,gCol,null,data.TableIn3.results,[]);	
					}
					if(data&&data.Export.results.length){						
						data.Export.results[0].Finyn=="X"?oController._CompleteBtn=false:oController._CompleteBtn=true;
					}else{
						oController._CompleteBtn=true;	
					}
					oController._FinSet=data;
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

		onOpenImg : function(vSig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var c=sap.ui.commons;
			var oMat = new c.layout.MatrixLayout();
			var oRow,oCell,oImg;
			oImg=new sap.m.Image();
			var oSrc="ZUI5_HR_MssMboEval/imgs/eval"+vSig+".JPG";
			oImg.setSrc(null);
			oImg.setSrc(oSrc);
			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				hAlign: "Center",
				vAlign : "Middle",
				content : oImg
			});
			oRow.addCell(oCell);
			oMat.addRow(oRow);
			var oScr=new sap.m.ScrollContainer({
				vertical:true,
				horizontal:true,
				content:oMat,
				width:"100%"
			});
			var oDialog = new sap.m.Dialog({
				content: [oScr],
				buttons: [new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:function(){
					oDialog.close();
				}})],
				contentHeight: "830px",
				contentWidth: "750px"
			});	
			oDialog.open();
		},

		oTableInit : function(oController){
			var c=sap.ui.commons;
			var oTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Table1");
			oTable.destroyColumns();
			var oFields=["Seqno","AporgTx","EnameP1","Appee","AppgrTx","AptypeTx","ApstuTx","Apgrd0T","Apgrd1T"];			
			var oLabels=new Array();
			for(var i=27;i<36;i++){
				i==27?oLabels.push({Label:"LABEL_360"+i,Width:"60px",Align:"Center"}):
				oLabels.push({Label:"LABEL_360"+i,Width:"",Align:"Center"});
			}

			if(oController.vPage=="1"){
				oFields.push("icon");
				oLabels.push({Label:"",Width:"30px",Align:"Center"});
			}
			if(oController.vPage=="2"){
				oFields.push("Apgrd2T");
				oLabels.push({Label:"LABEL_36047",Width:"",Align:"Center"});
				oFields.push("icon");
				oLabels.push({Label:"",Width:"30px",Align:"Center"});
			}
			if(oController.vPage=="3"){
				oFields.push("Apgrd2T");
				oLabels.push({Label:"LABEL_36047",Width:"",Align:"Center"});
				oFields.push("Apgrd3T");
				oLabels.push({Label:"LABEL_36048",Width:"",Align:"Center"});
				oFields.push("icon");
				oLabels.push({Label:"",Width:"30px",Align:"Center"});
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
				e.Label!=""?oCol.setLabel(new sap.m.Text({text:oBundleText.getText(e.Label),textAlign:e.Align})):
				oCol.setLabel(new sap.m.Text({text:"",textAlign:e.Align}));
				if(oFields[i]!="icon"){
					oCol.setTemplate(new sap.m.Text({text:"{"+oFields[i]+"}"}));
				}else{
					oCol.setTemplate(new sap.ui.core.Icon({src:"sap-icon://navigation-right-arrow"}));
				}
				oTable.addColumn(oCol);
			});
		},

		oTableMapping : function(oController,xData){
			var oTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Table1");
			var oJSON=new sap.ui.model.json.JSONModel();
			var aData={tData:[]};

			aData.tData = xData.map(function(elem, idx) {
				return $.extend(true, elem, {
					Seqno: String(++idx)
				});
			});

			common.Common.adjustVisibleRowCount(oTable, 10, aData.tData.length);
			oJSON.setData(aData);
			oTable.setModel(oJSON);
			oTable.bindRows("/tData");
			oController.setCurtxt(oController,xData);
		},

		gTableInit : function(oController,mTable,mCol){
			var oRow,oCell;
			var c=sap.ui.commons;
			for(var i=0;i<100;i++){
				for(var j=0;j<100;j++){
					var oId1=$.app.byId(oController.PAGEID+"_Grid_"+oController.vPage+"_"+j+"_"+i);
					var oId3=$.app.byId(oController.PAGEID+"_Grid_"+oController.vPage+"_"+j+"_"+i);
					var oId4=$.app.byId(oController.PAGEID+"_Cal_"+oController.vPage+"_"+j+"_"+i);
					for(var a=0;a<100;a++){						
						var oId2=$.app.byId(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i);						
						if(oId2){
							oId2.destroy();
						}
					}
					if(oId1){
						oId1.destroy();
					}
					if(oId3){
						oId3.destroy();
					}
					if(oId4){
						oId4.destroy();
					}
				}
			}			
			mCol.removeAllRows();
			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				colSpan:22,
				hAlign:"Center",
				content:[new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"}),
				new sap.m.Text({text:oBundleText.getText("LABEL_00901")}),
				new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"})]
			}).addStyleClass("UnderBar");
			oRow.addCell(oCell);
			mCol.addRow(oRow);
		},

		mTableInit : function(oController,mTable,mCol){
			var oRow,oCell;
			var c=sap.ui.commons;
			mCol.removeAllRows();
			oRow=new c.layout.MatrixLayoutRow();
			oCell=new c.layout.MatrixLayoutCell({
				colSpan:22,
				hAlign:"Center",
				content:[new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"}),
				new sap.m.Text({text:oBundleText.getText("LABEL_00901")}),
				new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"})]
			}).addStyleClass("UnderBar");
			oRow.addCell(oCell);
			mCol.addRow(oRow);
		},

		gTableSizing : function(oController,mTable,mCol,dLength){
			var c=sap.ui.commons;
			var oRow,oCell;
			var oCnt1=12;
			var oCnt2=11;
			if(dLength>4){
				var width1=new Array();
				for(var i=0;i<11;i++){
					if(i==0){
						width1.push("90px");
					}else if(i==1){
						width1.push("65px");
					}else if(i==2){
						width1.push("100px");
					}else{
//						width1.push("");
						width1.push("200px");
					}
				}
				width1.push("13px");
				mTable.setWidths(width1);
				mTable.setColumns(oCnt1);
				$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gContentCell").setColSpan(oCnt1);
			}else{
				var width1=new Array();
				for(var i=0;i<11;i++){
					if(i==0){
						width1.push("90px");
					}else if(i==1){
						width1.push("65px");
					}else if(i==2){
						width1.push("100px");
					}else{
//						width1.push("");
						width1.push("200px");
					}
				}
				mTable.setWidths(width1);
				mTable.setColumns(oCnt2);
				$.app.byId(oController.PAGEID+"_"+oController.vPage+"_gContentCell").setColSpan(oCnt2);
			}
		},

		mTableSizing : function(oController,mTable,mCol){
			var c=sap.ui.commons;
			var oRow,oCell;
			var oCnt1=23;
			var oCnt2=22;
			if(oController._tableLength>4){
				var width1=new Array();
				for(var i=0;i<22;i++){
					width1.push("");
				}
				width1.push("13px");
				mTable.setWidths(width1);
				mTable.setColumns(oCnt1);
				$.app.byId(oController.PAGEID+"_"+oController.vPage+"_ContentCell").setColSpan(oCnt1);
			}else{
				var width1=new Array();
				for(var i=0;i<22;i++){
					width1.push("");
				}
				mTable.setWidths(width1);
				mTable.setColumns(oCnt2);
				$.app.byId(oController.PAGEID+"_"+oController.vPage+"_ContentCell").setColSpan(oCnt2);
			}
		},

		gTableMapping : function(oController,mTable,mCol,oFields,xData,wData){
			var c=sap.ui.commons;
			var oRow,oCell;
			mCol.removeAllRows();
//직급별로 나눈 데이터
			var ArrayJSON=new Array();
			var idx=0;
			for(var i=0;i<xData.length;i++){			
				if(i==0){
					ArrayJSON.push({Gubun:xData[0].AppgrTx,Datas:[xData[0]]});
				}else{
					if(xData[i].AppgrTx==xData[i-1].AppgrTx){
						ArrayJSON[idx].Datas.push(xData[i]);
					}else{		
						idx++;				
						ArrayJSON.push({Gubun:xData[i].AppgrTx,Datas:[xData[i]]});
					}
				}				
			}
			for(var i=0;i<ArrayJSON.length;i++){
				for(var a=0;a<wData.length;a++){
					if(ArrayJSON[i].Gubun==wData[a].Gubun){
						ArrayJSON[i].Total=wData[a].Cnt01;
						ArrayJSON[i].Over=wData[a].Cnt02;
						break;
					}
				}
			}			
//아래 셀 계산을 위한 데이터넣기(
			for(var i=0;i<ArrayJSON.length;i++){
				var idx1=0,idx2=0,idx3=0,idx4=0,idx5=0,idx6=0,idx7=0,idx8=0;
				for(var a=0;a<ArrayJSON[i].Datas.length;a++){					
					var oData=ArrayJSON[i].Datas[a];
					if(oData.Apgrd2=="0001"){
						idx1++;
					}
					if(oData.Apgrd2=="0002"){
						idx2++;
					}
					if(oData.Apgrd2=="0003"){
						idx3++;
					}
					if(oData.Apgrd2=="0004"){
						idx4++;
					}
					if(oData.Apgrd2=="0005"){
						idx5++;
					}
					if(oData.Apgrd2=="0006"){
						idx6++;
					}
					if(oData.Apgrd2=="0007"){
						idx7++;
					}
					if(oData.Apgrd2=="0008"){
						idx8++;
					}					
				}
				for(var j=0;j<8;j++){
					eval("ArrayJSON[i].Person"+parseInt(j+1)+"=idx"+parseInt(j+1));
				}		
			}
			for(var i=0;i<ArrayJSON.length;i++){
				for(var j=0;j<8;j++){
					eval("ArrayJSON[i].TotPer"+parseInt(j+1)+"=(parseFloat(ArrayJSON[i].Person"+parseInt(j+1)+"/parseInt(ArrayJSON[i].Total))*100).toFixed(1);");
				}
			}
			oController._vArr=ArrayJSON;
			var dLength=ArrayJSON.length;
			if(dLength!=0){
				oController.renderDTable(ArrayJSON,mCol);
			}
			oController.gTableSizing(oController,mTable,mCol,dLength);
		},

		disableLogic : function(tData){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			$.app.byId(oController.PAGEID+"_"+oController.vPage+"_SaveFin").setVisible(oController._CompleteBtn);
			$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Fin").setVisible(oController._CompleteBtn);
			return oController._CompleteBtn;
		},

		renderDTable : function(tData,mCol){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var c=sap.ui.commons;
			var oRow,oCell;		
			oController.vPage=="2a"?oController._gvApstu="60":oController._gvApstu="70";
			var oDisable=oController.disableLogic(tData);
			tData.forEach(function(e,i){
				oRow=new c.layout.MatrixLayoutRow();
				for(var j=0;j<11;j++){
					if(j==0){
						oCell=new c.layout.MatrixLayoutCell({
							hAlign:"Center",
							vAlign:"Middle",
							rowSpan : 2,
							content : new sap.m.Text({text:e.Gubun})
						}).addStyleClass("gTableDataCell");
						oRow.addCell(oCell);
					}else if(j==1){
						oCell=new c.layout.MatrixLayoutCell({
							hAlign:"Center",
							vAlign:"Middle",
							rowSpan : 2,
							content : new sap.m.Text({text:e.Total})
						}).addStyleClass("gTableDataCell");
						oRow.addCell(oCell);
					}else if(j==2){
						oCell=new c.layout.MatrixLayoutCell({
							hAlign:"Center",
							vAlign:"Middle",
							rowSpan : 2,
							content : new sap.m.Text({text:e.Over})
						}).addStyleClass("gTableDataCell");
						oRow.addCell(oCell);
					}else{
						var oGrid = new sap.f.GridContainer(oController.PAGEID+"_Grid_"+oController.vPage+"_"+j+"_"+i,{
							containerQuery : true,
							snapToRow : false,
							width : "100%",
							layout : new sap.f.GridContainerSettings({rowSize:"13px",columnSize:"",gap:"2px"}),
							minHeight : "2rem"
						}).addStyleClass("PointerCursor");
						for(var a=0;a<tData[i].Datas.length;a++){							
							var oTxt=tData[i].Datas[a].EnameP1+" ( "+tData[i].Datas[a].PGradeTxtP1;
							tData[i].Datas[a].TitelP1!=""?oTxt+=" / "+tData[i].Datas[a].TitelP1:null;
							tData[i].Datas[a].Titl2P1!=""?oTxt+=" / "+tData[i].Datas[a].Titl2P1+ " ) ":oTxt+=" )";
							if(j==3){					
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0001"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));		
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));														
									}	
								}else{
									if(tData[i].Datas[a].Apgrd3=="0001"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));		
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));														
									}	
								}
							}else if(j==4){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0002"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));		
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0002"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));		
									}
								}
							}else if(j==5){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0003"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0003"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}
							}else if(j==6){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0004"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0004"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}
							}else if(j==7){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0005"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0005"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}
							}else if(j==8){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0006"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0006"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}
							}else if(j==9){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0007"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0007"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}
							}else if(j==10){
								if(oController.vPage=="2a"){
									if(tData[i].Datas[a].Apgrd2=="0008"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}else{
									if(tData[i].Datas[a].Apgrd3=="0008"){
										var oText=new sap.m.Text(oController.PAGEID+"_Text_"+oController.vPage+"_"+a+"_"+j+"_"+i,
											{text:oTxt,textAlign:"Center"}).addCustomData(new sap.ui.core.CustomData({key:"Apstu",value:tData[i].Datas[a].Apstu}))
											.addCustomData(new sap.ui.core.CustomData({key:"Datas",value:tData[i].Datas[a]}));	
										tData[i].Datas[a].Apstu==oController._gvApstu?						
											oGrid.addItem(oText.addStyleClass("BlueBox")):
											oGrid.addItem(oText.addStyleClass("NoBox"));
									}
								}		
							}	
							oDisable?oController.addDragLogic(oGrid):null;									
						}										
						oCell=new c.layout.MatrixLayoutCell({
							hAlign:"Center",
							vAlign:"Middle",
							content : oGrid
						}).addStyleClass("gTableDataCell");
						oRow.addCell(oCell);
					}
				}					
				mCol.addRow(oRow);	
				oRow=new c.layout.MatrixLayoutRow();
				for(var j=1;j<9;j++){				
					var oTxt=new sap.m.Text(oController.PAGEID+"_Cal_"+oController.vPage+"_"+(j+2)+"_"+i,{text:"0명 (0.0%)"}).addCustomData(
						new sap.ui.core.CustomData({key:"Total",value:e.Total})
					);
					eval("oController.setTxt(oTxt,e.Person"+j+",e.TotPer"+j+");");
					oCell=new c.layout.MatrixLayoutCell({
						hAlign : "Center",
						content: oTxt
					}).addStyleClass("TableDataCell");
					oRow.addCell(oCell);					
				}
				mCol.addRow(oRow);	
			});
			oController.getGTableDatas();
		},
 
		getGTableDatas : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var scrData=new Array();
			var calData=new Array();
			var oSel=oController.vPage.substring(0,1);
			for(var i=0;i<oController._vArr.length;i++){
				scrData.push({Gubun:oController._vArr[i].Gubun,Total:oController._vArr[i].Total,Datas:[]});
				var idx1=0,idx2=0,idx3=0,idx4=0,idx5=0,idx6=0,idx7=0,idx8=0;
				for(var j=3;j<11;j++){
					var oId=$.app.byId(oController.PAGEID+"_Grid_"+oController.vPage+"_"+j+"_"+i);					
					if(oId){
						var oDatas=oId.getItems();
						for(var a=0;a<oDatas.length;a++){							
							var vData=oDatas[a].getCustomData()[1].getValue("Datas");
							if(j==3){
								eval("vData.Apgrd"+oSel+"='0001';");
								scrData[i].Datas.push(vData);
								idx1++;
							}else if(j==4){
								eval("vData.Apgrd"+oSel+"='0002';");
								scrData[i].Datas.push(vData);
								idx2++;
							}else if(j==5){
								eval("vData.Apgrd"+oSel+"='0003';");
								scrData[i].Datas.push(vData);
								idx3++;
							}else if(j==6){
								eval("vData.Apgrd"+oSel+"='0004';");
								scrData[i].Datas.push(vData);
								idx4++;
							}else if(j==7){
								eval("vData.Apgrd"+oSel+"='0005';");
								scrData[i].Datas.push(vData);
								idx5++;
							}else if(j==8){
								eval("vData.Apgrd"+oSel+"='0006';");
								scrData[i].Datas.push(vData);
								idx6++;
							}else if(j==9){
								eval("vData.Apgrd"+oSel+"='0007';");
								scrData[i].Datas.push(vData);
								idx7++;
							}else if(j==10){
								eval("vData.Apgrd"+oSel+"='0008';");
								scrData[i].Datas.push(vData);
								idx8++;
							}						
						}	
					}							
				}
				calData.push({idx1:idx1,idx2:idx2,idx3:idx3,idx4:idx4,idx5:idx5,idx6:idx6,idx7:idx7,idx8:idx8,
							  per1:parseFloat(parseInt(idx1)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per2:parseFloat(parseInt(idx2)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per3:parseFloat(parseInt(idx3)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per4:parseFloat(parseInt(idx4)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per5:parseFloat(parseInt(idx5)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per6:parseFloat(parseInt(idx6)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per7:parseFloat(parseInt(idx7)/parseInt(oController._vArr[i].Total)*100).toFixed(1),
							  per8:parseFloat(parseInt(idx8)/parseInt(oController._vArr[i].Total)*100).toFixed(1)			
							});		
			}
			for(var i=0;i<calData.length;i++){
				for(var j=1;j<9;j++){
					var oId=$.app.byId(oController.PAGEID+"_Cal_"+oController.vPage+"_"+(j+2)+"_"+i);
					if(oId){
						eval("oController.setTxt(oId,calData[i].idx"+j+",calData[i].per"+j+");");						
					}
				}
			}
			oController._realTimeData=scrData;
		},

		liveCal : function(preH,curH,curV){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var oTxt1=$.app.byId(oController.PAGEID+"_Cal_"+oController.vPage+"_"+preH+"_"+curV);
			var oTxt2=$.app.byId(oController.PAGEID+"_Cal_"+oController.vPage+"_"+curH+"_"+curV);
			var preGrid=$.app.byId(oController.PAGEID+"_Grid_"+oController.vPage+"_"+preH+"_"+curV);
			var curGrid=$.app.byId(oController.PAGEID+"_Grid_"+oController.vPage+"_"+curH+"_"+curV);

			var oPer1="";
			preGrid.getItems().length==0?oPer1=0:oPer1=parseFloat((preGrid.getItems().length/parseInt(oTxt1.getCustomData()[0].getValue("Total")))*100).toFixed(1);
			var oPer2=parseFloat((curGrid.getItems().length/parseInt(oTxt2.getCustomData()[0].getValue("Total")))*100).toFixed(1);
			oController.setTxt(oTxt1,preGrid.getItems().length,oPer1);
			oController.setTxt(oTxt2,curGrid.getItems().length,oPer2);
			oController.getGTableDatas();
		},

		setTxt : function(oEle,oNum,oPer){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			oEle.setText(oNum+"명 ( "+oPer+"% )");
		},

		addDragLogic : function(oGrid){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			oGrid.addDragDropConfig(new sap.ui.core.dnd.DragInfo({
				sourceAggregation: "items",
			}));
			oGrid.addDragDropConfig(new sap.f.dnd.GridDropInfo({
				targetAggregation: "items",
				dropIndicatorSize: function() {
					return {rows: 1, columns: 1};
				},
				dropPosition: sap.ui.core.dnd.DropPosition.Between,
				dropLayout: sap.ui.core.dnd.DropLayout.Horizontal,
				drop: function (oInfo) {
					var oDragged = oInfo.getParameter("draggedControl"),
						oDropped = oInfo.getParameter("droppedControl"),
						sInsertPosition = oInfo.getParameter("dropPosition"),
						iDragPosition = oGrid.indexOfItem(oDragged),
						iDropPosition = oGrid.indexOfItem(oDropped);

						if (iDragPosition < iDropPosition) {
							iDropPosition--;
						}
 
						if (sInsertPosition === "After") {
							iDropPosition++;
						}
						var tHLine=oDragged.getId().split("_")[4];
						var tVLine=oDragged.getId().split("_")[5];
						var gHLine=oGrid.getId().split("_")[3];
						var gVline=oGrid.getId().split("_")[4];
						if(oDragged.getCustomData()[0].getValue("Apstu")==oController._gvApstu){
							if((tHLine>=3&&tHLine<=7)&&(gHLine>=3&&gHLine<=7)){
								if(tVLine==gVline){
									oGrid.insertItem(oDragged, iDropPosition);
									oGrid.focusItem(iDropPosition);
								}
							}
							if((tHLine>=8&&tHLine<=10)&&(gHLine>=8&&gHLine<=10)){
								if(tVLine==gVline){
									oGrid.insertItem(oDragged, iDropPosition);
									oGrid.focusItem(iDropPosition);
								}
							}
							oController.getGTableDatas();						
						}
				}
			}));
		},

		mTableMapping : function(oController,mTable,mCol,oFields,xData){
			var c=sap.ui.commons;
			var oRow,oCell;
			mCol.removeAllRows();
			var oNo=new Array();			
			oController._tableLength=xData.length;
			for(var i=0;i<xData.length;i++){
				if(i<xData.length-1){
					if(xData[i].PgccdT!=xData[i+1].PgccdT){
						oNo.push(i+1);
					}
				}else{
					oNo.length!=0?oNo.push((i+1)-oNo[oNo.length-1]):oNo.push((i+1));
				}								
			}	
			var vNo=new Array();
			if(oNo.length>0){
				oNo.forEach(function(e,i){
					if(i==0){
						vNo.push(e);
					}else if(i<oNo.length-1){
						vNo.push(e-oNo[i-1]);
					}else{
						vNo.push(oNo[i]);
					}									
				});
			}
			var idx=0;
			if(vNo.length!=0){
				for(var i=0;i<vNo.length;i++){									
					for(var a=0;a<vNo[i];a++){
						oRow=new c.layout.MatrixLayoutRow();
						if(a==0){
							oFields.forEach(function(d,x){
								if(x==0){
									eval("oCell=new c.layout.MatrixLayoutCell({"+
										"hAlign : 'Center',"+
										"rowSpan : vNo[i],"+
										"content : new sap.m.Text({text:xData[idx]."+d+"})"+
										"}).addStyleClass('TableDataCell');");
									oRow.addCell(oCell);
								}else{
									if(x!=1){
										eval("oCell=new c.layout.MatrixLayoutCell({"+
										"hAlign : 'Right',"+
										"content : new sap.m.Text({text:xData[idx]."+d+"})"+
										"}).addStyleClass('TableDataCell');");
										oRow.addCell(oCell);
									}else{
										eval("oCell=new c.layout.MatrixLayoutCell({"+
										"hAlign : 'Center',"+
										"content : new sap.m.Text({text:xData[idx]."+d+"})"+
										"}).addStyleClass('TableDataCell');");
										oRow.addCell(oCell);
									}									
								}
							});	
							idx++;			
							mCol.addRow(oRow);
						}else{
							oRow=new c.layout.MatrixLayoutRow();
							oFields.forEach(function(d,x){												
								if(x!=0){
									if(x!=1){
										eval("oCell=new c.layout.MatrixLayoutCell({"+
										"hAlign : 'Right',"+
										"content : new sap.m.Text({text:xData[idx]."+d+"})"+
										"}).addStyleClass('TableDataCell');");
										oRow.addCell(oCell);
									}else{
										eval("oCell=new c.layout.MatrixLayoutCell({"+
										"hAlign : 'Center',"+
										"content : new sap.m.Text({text:xData[idx]."+d+"})"+
										"}).addStyleClass('TableDataCell');");
										oRow.addCell(oCell);
									}
								}											
							});
							idx++;			
							mCol.addRow(oRow);
						}																	
					}									
				}
			}else{
				xData.forEach(function(e,a){
					oRow=new c.layout.MatrixLayoutRow();							
						oFields.forEach(function(d,i){
							if(i<2){
								eval("oCell=new c.layout.MatrixLayoutCell({"+
								"hAlign : 'Center',"+
								"content : new sap.m.Text({text:e."+d+"})"+
								"}).addStyleClass('TableDataCell');");
								oRow.addCell(oCell);
							}else{
								eval("oCell=new c.layout.MatrixLayoutCell({"+
								"hAlign : 'Right',"+
								"content : new sap.m.Text({text:e."+d+"})"+
								"}).addStyleClass('TableDataCell');");
								oRow.addCell(oCell);
							}							
						});							
					mCol.addRow(oRow);
				});	
			}	
			oController.mTableSizing(oController,mTable,mCol);
		},

		setCurtxt : function(oController,xData){
			var oTxt=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_CurTxt");
			var oTotal=xData.length;
			var oNo=0;
			if(oController.vPage=="1"){
				xData.forEach(function(e){
					e.Apstu=="41"||e.Apstu=="50"?oNo++:null;
				});
			}else if(oController.vPage=="2"){
				xData.forEach(function(e){
					e.Apstu=="51"||e.Apstu=="60"?oNo++:null;
				});
			}else if(oController.vPage=="3"){
				xData.forEach(function(e){
					e.Apstu=="61"||e.Apstu=="70"?oNo++:null;
				});
			}
			oTxt.setContent(null);
			oTxt.setContent("<span style='font-weight:bold;font-size:16px;'>"+oBundleText.getText("LABEL_36025")+"</span>&nbsp;:&nbsp;"+
			"<span style='font-weight:bold;font-size:16px;color:green;'>"+oTotal+"&nbsp;</span><span style='font-weight:bold;font-size:16px;'>"+oBundleText.getText("LABEL_36044")+"&nbsp;/&nbsp;</span>"+
			"<span style='font-weight:bold;font-size:16px;'>"+oBundleText.getText("LABEL_36026")+"</span>&nbsp;:&nbsp;"+
			"<span style='font-weight:bold;font-size:16px;color:green;'>"+oNo+"&nbsp;</span><span style='font-weight:bold;font-size:16px;'>"+oBundleText.getText("LABEL_36044")+"</span>");
		},

		bindData1 : function(oController,vKey){
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}			
			setTimeout(function(){
				oController.getHeaderData(oController,vKey);
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}
			},100);			
		},

		onSearch1 : function(oController,vApprc){
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;
			var oSel1,oSel2,oRow,oCell,oSel3;
			var c=sap.ui.commons;
//INIT MTABLE////////////////////////////////////////////////////////////////////////////////
			var mTable=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mTable1");
			var mCol=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_mCol1");
			oController.mTableInit(oController,mTable,mCol);
/////////////////////////////////////////////////////////////////////////////////////////////
			var oFields=["PgccdT","Gubun"];
			for(var i=1;i<=20;i++){
				i<=9?oFields.push("Cnt0"+i):oFields.push("Cnt"+i);
			}			
			oSel1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1");
			oSel2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2");
			oSel3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3");
			oController.oTableInit(oController);
			var vData={
				IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IMolga:oSessionData.Molga,
				IEmpid:oSessionData.Pernr,
				IPernr:oSessionData.Pernr,
				IAppid:oPreData.Appid,
				IAporg:oSel1.getSelectedKey(),
				IAppgr:oSel2.getSelectedKey(),
				IApprc:vApprc,
				IDatum:oPreData.Apbdt,
				ILangu:oSessionData.Langu,
				TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[],TableIn5:[],TableIn6:[]};
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}

			setTimeout(function(){
//				oController.getHeaderData(oController,"4"+oController.vPage);
				oModel.create("/AppraisalHeaderSet", vData, {
					success: function(data,res){
						if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
							oController._BusyDialog.close();
						}
						if(vApprc=="41"||vApprc=="42"||vApprc=="43"){
							data&&data.TableIn1.results.length?oController.oTableMapping(oController,data.TableIn1.results):
							oController.oTableMapping(oController,[]);			
							
							if(data&&data.TableIn6.results.length){
								oController._tableLength=data.TableIn6.results.length;
								oController.mTableMapping(oController,mTable,mCol,oFields,data.TableIn6.results);																							
							}else{
								oController.mTableMapping(oController,mTable,mCol,oFields,[]);								
							}
						}
					},
					error: function (oError) {
						var Err = {};				
						if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
							oController._BusyDialog.close();
						}		
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
			},100);	
		},

		onSelectedRow: function(oEvent,vPage) {
			var	oController = $.app.getController();
			var sPath = oEvent.getParameters().rowBindingContext.sPath;		
			var oTable = sap.ui.getCore().byId(oController.PAGEID +"_"+vPage+ "_Table1");
			var oData = oTable.getModel().getProperty(sPath);
			oController._tData=oData;		
			if(oEvent.getParameters().columnIndex==oTable.getColumns().length-1){
				oController.nextPage1(oData);			
			}			
		},

		nextPage1 : function(oData){
			var	oController = $.app.getController();
			var oPage1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_1");
			var oPage2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_2");

			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}

			setTimeout(function(){			
				oPage1.setVisible(false);
				oPage2.setVisible(true);
				oController.bindHeader(oData,oController,oController.vPage);	
				oController.initAndLoadPage1(oData);
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}		
			},100);				
		},

		initAndLoadPage1 : function(tData){
			var	oController = $.app.getController();
			var vApprc="41";
			if(oController.vPage=="2"){
				vApprc="42";
			}else if(oController.vPage=="3"){
				vApprc="43";
			}
			oController.getHeaderData(oController,vApprc,oController._tData,"Next");
			oController._Docid=tData.Docid;
			var oTa1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_2");
			var oTa2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_22");
			var oTa3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_3");
			var oTa4=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_32");
			var oTa5=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_3");
			var oTa6=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_32");
			var oTa7=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_3");
			var oTa8=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_32");
			var oSel1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_2");
			var oSel2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_3");
			var oSel3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2_3");
			var oSel4=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3_3");
			var oSaveBtn=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Save1_2");
			var oFinishBtn=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Finish1_2");
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oPreData=oController._PreData;

			oTa1.setValue();
			oTa2.setValue();
			oTa3.setValue();
			oTa4.setValue();		
			oSel1.setSelectedKey();
			oSel2.setSelectedKey();			

			if(oController.vPage=="2"){
				oTa5.setValue();
				oTa6.setValue();
				oSel3.setSelectedKey();
			}
			if(oController.vPage=="3"){
				oTa5.setValue();
				oTa6.setValue();
				oTa7.setValue();
				oTa8.setValue();
				oSel3.setSelectedKey();
				oSel4.setSelectedKey();
			}
			
			var vData={IOdkey:"",
					IConType:"1",
					IBukrs:"1000",
					IAppid:tData.Appid,
					IDocid:tData.Docid,
					IPernr:tData.Appee,
					IApprc:"40",
					IGolst:"",
					ILangu:oSessionData.Langu,
					TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
			};

			//본인평가 데이터 로드
			oModel.create("/AppraisalMboSheetSet", vData, {
				success: function(data,res){
					if(data){
						oController._SheetData=data;
					}
					if(data&&data.TableIn2.results.length){
						var oData=data.TableIn2.results;
						oData.forEach(function(e){
							if(e.Apopt=="28"){
								oTa1.setValue(e.Apop);
							}else if(e.Apopt=="29"){
								oTa2.setValue(e.Apop);
							}							
						});
					}
					if(data&&data.TableIn4.results.length){
						var oData=data.TableIn4.results;
						oSel1.setSelectedKey(oData[0].Apgrd0);
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
		
			//1차평가 데이터 로드
			var vData1={
				IOdkey:"",
				IConType:"1",
				IBukrs:"1000",
				IAppid:tData.Appid,
				IDocid:tData.Docid,
				IPernr:tData.Appee,
				IApprc:"41",
				IGolst:"",
				ILangu:oSessionData.Langu,
				TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
			};
			
			oModel.create("/AppraisalMboSheetSet", vData1, {
				success: function(data,res){
					if(data){
						oController._SheetData=data;
					}
					if(data&&data.TableIn2.results.length){
						var oData=data.TableIn2.results;
						oData.forEach(function(e){
							if(e.Apopt=="51"){
								oTa3.setValue(e.Apop);
							}else if(e.Apopt=="61"){
								oTa4.setValue(e.Apop);
							}							
						});
					}
					if(data&&data.TableIn4.results.length){
						var oData=data.TableIn4.results;
						oSel2.setSelectedKey(oData[0].Apgrd1);
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

			switch (oController.vPage) {
				case "1":
					if(tData.Apstu=="41"||tData.Apstu=="50"){
						oTa3.setEditable(true);
						oTa4.setEditable(true);
						oSel2.setEnabled(true);
						oSaveBtn.setVisible(true);
						oFinishBtn.setVisible(true);
					}else{
						oTa3.setEditable(false);
						oTa4.setEditable(false);
						oSel2.setEnabled(false);
						oSaveBtn.setVisible(false);
						oFinishBtn.setVisible(false);
					}
					break;

				case "2":
				//2차평가 데이터 로드
					var vData1={
						IOdkey:"",
						IConType:"1",
						IBukrs:"1000",
						IAppid:tData.Appid,
						IDocid:tData.Docid,
						IPernr:tData.Appee,
						IApprc:"42",
						IGolst:"",
						ILangu:oSessionData.Langu,
						TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
					};

					oModel.create("/AppraisalMboSheetSet", vData1, {
						success: function(data,res){
							if(data){
								oController._SheetData=data;
							}
							if(data&&data.TableIn2.results.length){
								var oData=data.TableIn2.results;
								oData.forEach(function(e){
									if(e.Apopt=="52"){
										oTa5.setValue(e.Apop);
									}else if(e.Apopt=="62"){
										oTa6.setValue(e.Apop);
									}							
								});
							}
							if(data&&data.TableIn4.results.length){
								var oData=data.TableIn4.results;
								oSel3.setSelectedKey(oData[0].Apgrd2);
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
						
					if(tData.Apstu=="51"||tData.Apstu=="60"){
						oTa3.setEditable(false);
						oTa4.setEditable(false);
						oTa5.setEditable(true);
						oTa6.setEditable(true);
						oSel2.setEnabled(false);
						oSel3.setEnabled(true);
						oSaveBtn.setVisible(true);
						oFinishBtn.setVisible(true);
					}else{
						oTa3.setEditable(false);
						oTa4.setEditable(false);
						oTa5.setEditable(false);
						oTa6.setEditable(false);
						oSel2.setEnabled(false);
						oSel3.setEnabled(false);
						oSaveBtn.setVisible(false);
						oFinishBtn.setVisible(false);
					}
					break;

				case "3":
					//2차평가 데이터 로드
					var vData1={
						IOdkey:"",
						IConType:"1",
						IBukrs:"1000",
						IAppid:tData.Appid,
						IDocid:tData.Docid,
						IPernr:tData.Appee,
						IApprc:"42",
						IGolst:"",
						ILangu:oSessionData.Langu,
						TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
					};
				
					oModel.create("/AppraisalMboSheetSet", vData1, {
						success: function(data,res){
							if(data){
								oController._SheetData=data;
							}
							if(data&&data.TableIn2.results.length){
								var oData=data.TableIn2.results;
								oData.forEach(function(e){
									if(e.Apopt=="52"){
										oTa5.setValue(e.Apop);
									}else if(e.Apopt=="62"){
										oTa6.setValue(e.Apop);
									}							
								});
							}
							if(data&&data.TableIn4.results.length){
								var oData=data.TableIn4.results;
								oSel3.setSelectedKey(oData[0].Apgrd2);
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
					
					//3차평가 데이터 로드
					var vData1={
						IOdkey:"",
						IConType:"1",
						IBukrs:"1000",
						IAppid:tData.Appid,
						IDocid:tData.Docid,
						IPernr:tData.Appee,
						IApprc:"43",
						IGolst:"",
						ILangu:oSessionData.Langu,
						TableIn1:[],TableIn2:[],TableIn3:[],TableIn4:[]
					};
				
					oModel.create("/AppraisalMboSheetSet", vData1, {
						success: function(data,res){
							if(data){
								oController._SheetData=data;
							}
							if(data&&data.TableIn2.results.length){
								var oData=data.TableIn2.results;
								oData.forEach(function(e){
									if(e.Apopt=="53"){
										oTa7.setValue(e.Apop);
									}else if(e.Apopt=="63"){
										oTa8.setValue(e.Apop);
									}							
								});
							}
							if(data&&data.TableIn4.results.length){
								var oData=data.TableIn4.results;
								oSel4.setSelectedKey(oData[0].Apgrd3);
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
					
					if(tData.Apstu=="61"||tData.Apstu=="70"){
						oTa3.setEditable(false);
						oTa4.setEditable(false);
						oTa5.setEditable(false);
						oTa6.setEditable(false);
						oSel2.setEnabled(false);
						oSel3.setEnabled(false);
						oTa7.setEditable(true);
						oTa8.setEditable(true);
						oSel4.setEnabled(true);
						oSaveBtn.setVisible(true);
						oFinishBtn.setVisible(true);
					}else{
						oTa3.setEditable(false);
						oTa4.setEditable(false);
						oTa5.setEditable(false);
						oTa6.setEditable(false);
						oSel2.setEnabled(false);
						oSel3.setEnabled(false);
						oTa7.setEditable(false);
						oTa8.setEditable(false);
						oSel4.setEnabled(false);
						oSaveBtn.setVisible(false);
						oFinishBtn.setVisible(false);
					}
					break;
				default:
					break;
			}
			if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
				oController._BusyDialog.close();
			}
		},

		onBack : function(){
			var	oController = $.app.getController();
			var oPage1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_1");
			var oPage2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Mat1_2");

			oPage1.setVisible(true);
			oPage2.setVisible(false);
//			oController.getHeaderData(oController,"4"+oController.vPage);
			oController.onSearch1(oController,"4"+oController.vPage);		
		},

		bindData2 : function(oController){
			if (!oController._BusyDialog) {
				oController._BusyDialog = new sap.m.Dialog({showHeader:false}).addStyleClass("centerAlign");
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController._BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_44017}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController._BusyDialog.addContent(new sap.ui.core.HTML({content:"<div style='height:20px;'/>"}));
				oController.getView().addDependent(oController._BusyDialog);
			}
			if (!oController._BusyDialog.isOpen()) {
				oController._BusyDialog.open();
			}	
			setTimeout(function(){
				oController.getHeaderData2(oController,"4"+oController.vPage.substring(0,1));	
				if (oController._BusyDialog && oController._BusyDialog.isOpen()) {
					oController._BusyDialog.close();
				}	
			},100);	
		},

		onValid : function(oController){
			switch (oController.vPage) {
				case "1":
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_3").getValue().trim()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36001"));
						return false;
					}
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_32").getValue().trim()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36002"));
						return false;
					}
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_3").getSelectedKey()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36003"));
						return false;
					}
					break;
				case "2":
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_3").getValue().trim()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36001"));
						return false;
					}
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_32").getValue().trim()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36002"));
						return false;
					}
					if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2_3").getSelectedKey()==""){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_36003"));
						return false;
					}
					break;
				case "3":
						if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_3").getValue().trim()==""){
							sap.m.MessageBox.alert(oBundleText.getText("MSG_36001"));
							return false;
						}
						if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_32").getValue().trim()==""){
							sap.m.MessageBox.alert(oBundleText.getText("MSG_36002"));
							return false;
						}
						if($.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3_3").getSelectedKey()==""){
							sap.m.MessageBox.alert(oBundleText.getText("MSG_36003"));
							return false;
						}
						break;
				default:
					break;
			}
			return true;
		},

		onSaveProcess : function(oController,Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oPreData=oController._PreData;
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var oTa1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_2");
			var oTa2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_22");
			var oTa3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_3");
			var oTa4=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA1_32");
			var oTa5=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_3");
			var oTa6=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA2_32");
			var oTa7=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_3");
			var oTa8=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_TextA3_32");
			var oSel1=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_2");
			var oSel2=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel1_3");
			var oSel3=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel2_3");
			var oSel4=$.app.byId(oController.PAGEID+"_"+oController.vPage+"_Sel3_3");
			var oTableIn2=oController._SheetData.TableIn2.results;
			var oTableIn4=oController._SheetData.TableIn4.results;
			function dataChecknSave(){
				oTableIn2.push({
					ApoptT: "",
					Apopt: "28",
					Apop: oTa1.getValue(),
					Docid: oController._tData.Docid,
					IOdkey: ""
				});
				oTableIn2.push({
					ApoptT: "",
					Apopt: "29",
					Apop: oTa2.getValue(),
					Docid: oController._tData.Docid,
					IOdkey: ""
				});
				oTableIn2.push({
					ApoptT: "",
					Apopt: "51",
					Apop: oTa3.getValue(),
					Docid: oController._tData.Docid,
					IOdkey: ""
				});
				oTableIn2.push({
					ApoptT: "",
					Apopt: "61",
					Apop: oTa4.getValue(),
					Docid: oController._tData.Docid,
					IOdkey: ""
				});
				if(oController.vPage=="2"){
					oTableIn2.push({
						ApoptT: "",
						Apopt: "52",
						Apop: oTa5.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
					oTableIn2.push({
						ApoptT: "",
						Apopt: "62",
						Apop: oTa6.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
				}
				if(oController.vPage=="3"){
					oTableIn2.push({
						ApoptT: "",
						Apopt: "52",
						Apop: oTa5.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
					oTableIn2.push({
						ApoptT: "",
						Apopt: "62",
						Apop: oTa6.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
					oTableIn2.push({
						ApoptT: "",
						Apopt: "53",
						Apop: oTa7.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
					oTableIn2.push({
						ApoptT: "",
						Apopt: "63",
						Apop: oTa8.getValue(),
						Docid: oController._tData.Docid,
						IOdkey: ""
					});
				}

				if(oController._SheetData.TableIn4.results.length==0){
					oTableIn4.push({
						Docid:oController._tData.Docid,
						Apgrd0:oSel1.getSelectedKey(),
						Apgrd0T:oSel1.getSelectedItem().getText(),
					});
					oTableIn4.push({
						Docid:oController._tData.Docid,
						Apgrd1:oSel2.getSelectedKey(),
						Apgrd1T:oSel2.getSelectedItem().getText(),
					});
					if(oController.vPage=="2"){
						oTableIn4.push({
							Docid:oController._tData.Docid,
							Apgrd2:oSel3.getSelectedKey(),
							Apgrd2T:oSel3.getSelectedItem().getText(),
						});
					}
					if(oController.vPage=="3"){
						oTableIn4.push({
							Docid:oController._tData.Docid,
							Apgrd3:oSel4.getSelectedKey(),
							Apgrd3T:oSel4.getSelectedItem().getText(),
						});
					}
				}
				var vTmp=false;
				if(!vTmp){
					if(oController.vPage=="2"){
						oTableIn2.push({
							ApoptT: "",
							Apopt: "52",
							Apop: oTa5.getValue(),
							Docid: oController._tData.Docid,
							IOdkey: ""
						});
						oTableIn2.push({
							ApoptT: "",
							Apopt: "62",
							Apop: oTa6.getValue(),
							Docid: oController._tData.Docid,
							IOdkey: ""
						});
					}
					if(oController.vPage=="3"){
						oTableIn2.push({
							ApoptT: "",
							Apopt: "53",
							Apop: oTa7.getValue(),
							Docid: oController._tData.Docid,
							IOdkey: ""
						});
						oTableIn2.push({
							ApoptT: "",
							Apopt: "63",
							Apop: oTa8.getValue(),
							Docid: oController._tData.Docid,
							IOdkey: ""
						});
					}
				}
				oTableIn4.forEach(function(e){
					e.Apgrd0=oSel1.getSelectedKey();
					e.Apgrd1=oSel2.getSelectedKey();
					if(oController.vPage=="2"){
						e.Apgrd2=oSel3.getSelectedKey();
					}
					if(oController.vPage=="3"){
						e.Apgrd2=oSel3.getSelectedKey();
						e.Apgrd3=oSel4.getSelectedKey();
					}
				});
				var vData={IOdkey:"", 
					IBukrs:"1000",
					IAppid:oController._tData.Appid,
					IDocid:oController._tData.Docid,
					IPernr:oController._tData.Pernr,
					IApprc:"4"+oController.vPage,
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
								onClose:function(){
										if(oController.vPage=="2"||oController.vPage=="3"){
											oController.onBack();
										}else{
											oController.initAndLoadPage1(oController._tData);
										}
									}
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
									onClose:oController.onBack
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
				if(oController.vPage=="1"){
					if(e.Apopt=="51"){
						if(e.Apop==oTa3.getValue()){
							fVal1=true;
						}
					}
					if(e.Apopt=="61"){
						if(e.Apop==oTa4.getValue()){
							fVal2=true;
						}
					}
				}else if(oController.vPage=="2"){
					if(e.Apopt=="52"){
						if(e.Apop==oTa5.getValue()){
							fVal1=true;
						}
					}
					if(e.Apopt=="62"){
						if(e.Apop==oTa6.getValue()){
							fVal2=true;
						}
					}
				}else if(oController.vPage=="3"){
					if(e.Apopt=="53"){
						if(e.Apop==oTa7.getValue()){
							fVal1=true;
						}
					}
					if(e.Apopt=="63"){
						if(e.Apop==oTa8.getValue()){
							fVal2=true;
						}
					}
				}
			});
			oTableIn4.forEach(function(e){
				if(oController.vPage=="1"){
					if(e.Apgrd1==oSel2.getSelectedKey()){
						fVal3=true;
					}
				}else if(oController.vPage=="2"){
					if(e.Apgrd2==oSel3.getSelectedKey()){
						fVal3=true;
					}
				}else if(oController.vPage=="3"){
					if(e.Apgrd3==oSel4.getSelectedKey()){
						fVal3=true;
					}
				}
			});	
			if(Sig=="S"){
				if(fVal1&&fVal2&&fVal3){
					sap.m.MessageBox.alert(oBundleText.getText("MSG_35007"),{title:oBundleText.getText("LABEL_35023"),onClose:function(){return;}});
				}else{
					dataChecknSave();
				}
			}else{
				dataChecknSave();
			}
		},

		onSave : function(Sig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();			
			var oValid = oController.onValid(oController);
			if(Sig=="F"){				
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
				if(oController.vPage=="2"||oController.vPage=="3"){
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
			}
		},


		onFinishProcess : function(vSig){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();
			var oModel=$.app.getModel("ZHR_APPRAISAL2_SRV");
			var oPreData=oController._PreData;
			var oSessionData=oController._ListCondJSonModel.getProperty("/Data");
			var rData=oController._realTimeData;
			var oTableIn1=new Array();
			var oTableIn2=new Array();
			var oTableIn3=new Array();
			var oFinData=oController._FinSet;

			oFinData.TableIn1.results.forEach(function(e){
				oTableIn1.push(e);
			});
			oFinData.TableIn2.results.forEach(function(e){
				oTableIn2.push(e);
			});
			for(var i=0;i<rData.length;i++){
				for(var j=0;j<rData[i].Datas.length;j++){
					oTableIn3.push(rData[i].Datas[j]);
				}
			}
			var vData={IOdkey:"",
						IBukrs:"1000",
						IMolga:oSessionData.Molga,
						IEmpid:oSessionData.Pernr,
						IPernr:oSessionData.Pernr,
						IAppid:oPreData.Appid,
						IApprc:"4"+oController.vPage.substring(0,1),
						IDatum:oPreData.Apbdt,
						ILangu:oSessionData.Langu,
						IAporg:"",
						IAppgr:"",
						TableIn1:oTableIn1,TableIn2:oTableIn2,TableIn3:oTableIn3,
					};
					vSig=="S"?vData.IConType="2":vData.IConType="9";
			var vMsg="";
			vSig=="S"?vMsg=oBundleText.getText("MSG_35005"):vMsg=oBundleText.getText("MSG_36005");

			if(vSig=="F"){
				var vData2={IOdkey:"",
					IBukrs:"1000",
					IConType:"2",
					IMolga:oSessionData.Molga,
					IEmpid:oSessionData.Pernr,
					IPernr:oSessionData.Pernr,
					IAppid:oPreData.Appid,
					IApprc:"4"+oController.vPage.substring(0,1),
					IDatum:oPreData.Apbdt,
					ILangu:oSessionData.Langu,
					IAporg:"",
					IAppgr:"",
					TableIn1:oTableIn1,TableIn2:oTableIn2,TableIn3:oTableIn3,
				};
				oModel.create("/AppraisalMboFinSet", vData2, {
					success: function(data,res){},
					error: function (oError) {}
				});
			}

			oModel.create("/AppraisalMboFinSet", vData, {
				success: function(data,res){
					sap.m.MessageBox.alert(vMsg,{
						title:oBundleText.getText("LABEL_35023"),
						onClose:function(){oController.handleIconTabBarSelect();}
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
		},

		onSaveFin : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();		
			var oMsg=oBundleText.getText("MSG_35001");
			sap.m.MessageBox.show(
				oMsg, {				
					icon: sap.m.MessageBox.Icon.INFORMATION,				
					title: oBundleText.getText("LABEL_35023"),				
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
					onClose: function(fVal) {
						if(fVal=="YES"){
							oController.onFinishProcess("S");
						}
					}				
				}		
			);	
		},

		onFin : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MssMboEval.MssMboEval");
			var oController = oView.getController();		
			var oMsg=oBundleText.getText("MSG_36004");
			sap.m.MessageBox.show(
				oMsg, {				
					icon: sap.m.MessageBox.Icon.INFORMATION,				
					title: oBundleText.getText("LABEL_35023"),				
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],				
					onClose: function(fVal) {
						if(fVal=="YES"){
							oController.onFinishProcess("F");
						}
					}				
				}		
			);			
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
			return new JSONModelHelper({name: "991004"});
		} : null
		
	});

});