sap.ui.define(
	[
		"common/Common", 
		"common/CommonController", 
		"ZUI5_HR_ActApp/common/Common",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"common/SearchCode"
	], 
	function (Common, CommonController, AcpAppCommon, JSONModel, BusyIndicator, MessageBox, SearchCode) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRecPInfo"].join(".");

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "ActRecPInfo",
		
			_vActionType : "",
			_vStatu : "",
			_vPersa : "",
			_vDocno : "",
			_vDocty : "",
			_vReqno : "",
			_vActda : "",
			_vPernr : "",
			_vRecno : "",
			_vMolga : "41",
			_vIntca : "",
			_vVoltId : "",
			_oContext : null,
			
			_vCntSub01 : 0,
			_vCntSub02 : 0,
			_vCntSub03 : 0,
			_vCntSub04 : 0,
			_vCntSub05 : 0,
			_vCntSub06 : 0,
			_vCntSub07 : 0,
			
			_vCntSub21 : 0,
			_vCntSub22 : 0,
			_vCntSub23 : 0,
			_vCntSub24 : 0,
			
			_vActiveTabNames : null,
			
			_vTabIds : ["01","02","03","04","06","07","21","22","23","24"],
			
			_vModifyContent : false,
			
			_vFromPageId : "",
			
			_DISABLED : false,
			_JobPage : "",
			
			
			subAction : "",
			_vJapanIdnum : "",
			
			_vHndno : "",
			_vTelno : "",
			_vNatio : "",
			
			_ODialogPopup_Sub02 : null,
			_ODialogPopup_Sub02_P : null,
			_ODialogPopup_Sub03 : null,
			_ODialogPopup_Sub04 : null,
			_ODialogPopup_Sub05 : null,
			_ODialogPopup_Sub06 : null,
			
			_ODialogPopup_Sub21 : null,
			_ODialogPopup_Sub22 : null,
			_ODialogPopup_Sub23 : null,
			_ODialogPopup_Sub24 : null,
			
			_vSelectedContext : null,
			
			oZipcodeList : null,
			
			vZipcodeColumns : [],
			
			vTelControls : [],
			
			_vBankDefaultValue : null,
			
			_oIconTabbarItems : null,
			
			_vAnssaList : [],
			_vAddressLayout : [],
			_vSavedAddressList : [],
			_vEmecAddressList : [],
			_vAddressList : [],
			_vEmecAddressListCount : 0,
			
			_vDeafultContry : null,
			_vCheckContryIdNum : null,
			_pDataSub08 : "", // 재입사 여부 ( 이전 Document 에서 data 조회 ) 
			_fRehireStatus : false,
			_vCreateRehireData : null,
			
			_vHiringPersonalInfomationLayout : [],
			_vTitleGenderKeyList : [],
			
			_Sub02TableJson : new JSONModel(), 

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModel({name: "951009"});
			} : null,
			
			/**
			* Called when a controller is instantiated and its View controls (if available) are already created.
			* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			* @memberOf ZUI5_HR_ActApp.ActRecPInfo
			*/
			onInit: function() {
				var oTabbar = $.app.byId(this.PAGEID + "_TABBAR");
				this._oIconTabbarItems = oTabbar.getItems();
                
                this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow
                    }, this);

				this.vZipcodeColumns = [
					{id : "Ichek", label : this.getBundleText("LABEL_02184"), control : "Radio", width : 50, align : "Center", filter : "#rspan"},
					{id : "Pstlz", label : this.getBundleText("LABEL_02132"), control : "Text", width : 80, align : "Center", filter : "#rspan"},
					{id : "Statetx", label : this.getBundleText("LABEL_02174"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
					{id : "Ort01", label : this.getBundleText("LABEL_02245"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
					{id : "Ort02", label : this.getBundleText("LABEL_02246"), control : "Hidden", width : 10, align : "Left", filter : "#combo_filter"},
					{id : "State", label : this.getBundleText("LABEL_02251"), control : "Hidden", width : 10, align : "Left", filter : "#text_filter"},
					{id : "Ltext1", label : this.getBundleText("LABEL_02285"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
					{id : "Ltext2", label : this.getBundleText("LABEL_02286"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
					{id : "Ltext3", label : this.getBundleText("LABEL_02287"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
				];
			},
			
			onBeforeShow : function(oEvent) {

				var Process = function() {
					if(oEvent) {
						this._vActionType = oEvent.data.actiontype;
						this._vStatu = oEvent.data.Statu;
						this._vReqno = oEvent.data.Reqno;
						this._vDocno = oEvent.data.Docno;
						this._vDocty = oEvent.data.Docty;
						this._vPersa = oEvent.data.Persa;
						this._vActda = oEvent.data.Actda;
						if(typeof(this._vActda) === "object") {
							this._vActda = Common.DateFormatter(this._vActda);
						}
						this._vIntca = oEvent.data.Intca,
						this._oContext = oEvent.data.context;
						this._vFromPageId = oEvent.data.FromPageId;
						this._vVoltId = oEvent.data.VoltId;
					
						if(oEvent.data.Pdata) {
							this._vCntSub01 = oEvent.data.Pdata.Sub01;
							this._vCntSub02 = oEvent.data.Pdata.Sub02;
							this._vCntSub03 = oEvent.data.Pdata.Sub03;
							this._vCntSub04 = oEvent.data.Pdata.Sub04;
							this._vCntSub05 = 0;
							this._vCntSub06 = oEvent.data.Pdata.Sub06;
							this._vCntSub07 = oEvent.data.Pdata.Sub07;
							this._pDataSub08 = oEvent.data.Pdata.Sub08;
							this._vCntSub21 = oEvent.data.Pdata.Sub21;
							this._vCntSub22 = oEvent.data.Pdata.Sub22;
							this._vCntSub23 = oEvent.data.Pdata.Sub23;
							this._vCntSub24 = oEvent.data.Pdata.Sub24;
							
						} else {
							this._vCntSub01 = 0;
							this._vCntSub02 = 0;
							this._vCntSub03 = 0;
							this._vCntSub04 = 0;
							this._vCntSub05 = 0;
							this._vCntSub06 = 0;
							this._vCntSub07 = 0;
							
							this._vCntSub21 = 0;
							this._vCntSub22 = 0;
							this._vCntSub23 = 0;
							this._vCntSub24 = 0;
						}
						this._vNatio = "";
					}
					
					this._vMolga = "41";
					
					var oTitle = $.app.byId(this.PAGEID + "_PAGETITLE");
					if(this._vActionType == "V") oTitle.setText(this.getBundleText("LABEL_02211"));
					else if(this._vActionType == "M")  oTitle.setText(this.getBundleText("LABEL_02243"));
					else oTitle.setText(this.getBundleText("LABEL_02027"));
					
					if(this._vStatu == "" || this._vStatu == "10") {
						if(this._vActionType == "V") this._DISABLED = true;
						else this._DISABLED = false;
					} else {
						this._DISABLED = true;
					}
					
					this.setTabbar(this._vMolga);
					
					var oController = this;
					
					oController._fRehireStatus = false;
			
					if(this._vActiveTabNames == null || this._vActiveTabNames.length < 1) {
						MessageBox.alert("Nothing Tab Information this Molga (" + this._vMolga + ")", {
							onClose : function() {
								oController.navToBack();
							}
						});
						
						return;
					}
					
					oController._vHiringPersonalInfomationLayout = oController.getHiringPersonalInfomationLayout(oController);
					if(oController._vHiringPersonalInfomationLayout == null || oController._vHiringPersonalInfomationLayout.length < 1) {
						MessageBox.alert("Nothing Personal Information Layout this Molga (" + oController._vMolga + ")", {
							onClose : function() {
								oController.navToBack();
							}
						});	    	
						return;
					}
					
					AcpAppCommon.loadCodeData(oController, oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));
					
					this._vCheckContryIdNum = null;
					switch(this._vMolga) {
						case "08" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Actda"]; break;
						case "32" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Gblnd"]; break;
						case "18" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Nachn"]; break;
						case "06" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Gbdep", "Gblnd"]; break;
						case "46" : oController._vCheckContryIdNum = ["Gbdat"]; break;
						default : oController._vCheckContryIdNum = []; break;
					}
				
					var oRequestPanel = $.app.byId(this.PAGEID + "_Sub01_RequestPanel");
					if(oRequestPanel) {
						oRequestPanel.destroyContent();
					}
					
					var oRequestPanel23 = $.app.byId(this.PAGEID + "_Sub23_RequestPanel");
					if(oRequestPanel23) {
						oRequestPanel23.destroyContent();
						var vMolga23 = "";
						if(this._vMolga == "10") vMolga23 = "10";
						else vMolga23 = "08";
	
						oRequestPanel23.addContent(sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub23_" + vMolga23, this));
					}
					
					var oRequestPanel24 = $.app.byId(this.PAGEID + "_Sub24_RequestPanel");
					var oTable24 = $.app.byId(this.PAGEID + "_Sub24_TABLE");
					var oColumnList24 = $.app.byId(this.PAGEID + "_Sub24_COLUMNLIST");
					if(oColumnList24) {
						oColumnList24.destroy();
					}
					if(oTable24) {
						oTable24.destroy();
					}
					if(oRequestPanel24) {
						oRequestPanel24.destroyContent();
						var vMolga24 = "";
						if(this._vMolga == "08" || this._vMolga == "AE" ) vMolga24 = "08";
						else vMolga24 = "10";
	
						oRequestPanel24.addContent(sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub24_" + vMolga24, this));
					}
				
					var oIconTabBar = $.app.byId(this.PAGEID + "_TABBAR");
					if(oIconTabBar.getSelectedKey() != "Sub01") oIconTabBar.setSelectedKey("Sub01");
					this._JobPage = "Sub01";
					
					this.setActionButton();
					this.setSub01();

					this.setCountTabBar(this, "");
					
					oController._vModifyContent = false;
					
					//인사영역별 주소의 Subtype정보를 가져온다.
					oController._vAnssaList = [];
					
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Anssa"),
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, this._vPersa)
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									if(oData.results[i].Ecode != "1") {
										oController._vAnssaList.push(oData.results[i]);
									}
								}
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});
					
					oController._vJapanIdnum = "";

					BusyIndicator.hide();
				}.bind(this);
				
				BusyIndicator.show(0);

				setTimeout(Process, 300);
			},

			setIconTabCountColor : function(oController) {
				var oTabbar = sap.ui.getCore().byId(oController.PAGEID + "_TABBAR");
				var oCurIconTabbarItems = oTabbar.getItems();
				
				var setColor = function() {
					for(var i=0; i<oCurIconTabbarItems.length; i++) {
						if(oCurIconTabbarItems[i].getCount() != "") {
							if(parseInt(oCurIconTabbarItems[i].getCount()) == 0) {
								$("#" + oCurIconTabbarItems[i].getId() + "-count").css("color", "red");
								$("#" + oCurIconTabbarItems[i].getId() + "-count").css("font-weight", "bold");
							} else {
								$("#" + oCurIconTabbarItems[i].getId() + "-count").css("color", "white");
								$("#" + oCurIconTabbarItems[i].getId() + "-count").css("font-weight", "normal");
							}
						}			 
					}
				};
				setTimeout(setColor, 150);
			},

			setCountTabBar : function(oController, vTab) {
				var oControl = null;
				// var vCount = 0;
				
				if(vTab == "") {
					for(var i=0; i<oController._vActiveTabNames.length; i++) {
						oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vActiveTabNames[i].Tabid);
						if(oControl) {
							// eval("vCount = oController._vCntSub" + oController._vActiveTabNames[i].Tabid);
							// oControl.setCount(vCount);
						}
					}
				} else {
					oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_" + vTab);
					// eval("vCount = oController._vCnt" + vTab);
					// oControl.setCount(vCount);
				}
				
				oController.setIconTabCountColor(oController);
				
				var vVisible = true;
				if(oController._vCntSub01 == 0) vVisible = false;
				
				for(var j=0; j<oController._vActiveTabNames.length; j++) {
					if(oController._vActiveTabNames[j].Tabid != "01") {
						oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vActiveTabNames[i].Tabid);
						if(oControl) {
							oControl.setVisible(vVisible);
						}
					}
				}
				
				oController._vModifyContent = false;
			},
			
			changeModifyContent : function() {
				$.app.getController(SUB_APP_ID)._vModifyContent = true;
			},
			
			changeModifyDate : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = oEvent.getSource();
				
				oController._vModifyContent = true;
				
				if(oEvent.getParameter("valid") == false) {
					MessageBox.alert(oController.getBundleText("MSG_02047"), {
						onClose : function() {
							oControl.setValue("");
						}
					});
				}
			},
			
			changeDate : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = oEvent.getSource();

				if(oEvent.getParameter("valid") == false) {
					MessageBox.alert(oController.getBundleText("MSG_02047"), {
						onClose : function() {
							oControl.setValue("");
						}
					});
				}
			},
		
			navToBack : function(){
				var oController = $.app.getController(SUB_APP_ID);
				
				var backFunction = function() {
					sap.ui.getCore().getEventBus().publish("nav", "to", {
						id : oController._vFromPageId, 
						data : {
							context : oController._oContext,
							Statu : oController._vStatu,
							Reqno : oController._vReqno,
							Docno : oController._vDocno,
							Docty : oController._vDocty,
							Persa : oController._vPersa
						}
					});
				};
				
				if(oController._JobPage == "Sub01" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
					if(oController._vModifyContent) {
						var saveFunction = function(fVal) {
							if(fVal && fVal == "YES") {
								var fSaveResult = oController["save" + oController._JobPage]('BACK');
								if(fSaveResult) backFunction();
							} else {
								backFunction();
							}
							oController._vModifyContent = false;
						};
						
						MessageBox.show(oController.getBundleText("MSG_02071"), {
							icon: MessageBox.Icon.QUESTION,
							title: oController.getBundleText("LABEL_02244"),
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: saveFunction
						});
					} else {
						backFunction();
					}
				} else {
					backFunction();
				}
			},
			
			onTabSelected : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = oEvent.getSource();
				var vSKey = oEvent.getParameter("selectedKey");
				var fPrevTab = false;
				
				var readFunction = function() {
					if(fPrevTab) oControl.setSelectedKey(vSKey);
					oController._JobPage = vSKey;
					oController.setActionButton();
					
					if(oController._JobPage == "Sub01") {
						oController.setSub01();
					}else if(oController._JobPage == "Sub02"){
						oController["reload" + oController._JobPage]();
					}else if(oController._JobPage == "Sub07" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
						oController["read" + oController._JobPage]();
					} else {
						oController["reload" + oController._JobPage]();
					}
				};
				
				var saveFunction = function(fVal) {
					if(fVal && fVal == "YES") {
						fPrevTab = true;
						oControl.setSelectedKey(oController._JobPage);
						var fSaveResult = oController["save" + oController._JobPage]('BACK');
						if(!fSaveResult){
							return;
						}
					}
					oController._vModifyContent = false;
					readFunction();
				};
				
				if(oController._JobPage == "Sub01" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
					if(oController._vModifyContent) {
						MessageBox.show(oController.getBundleText("MSG_02071"), {
							icon: MessageBox.Icon.QUESTION,
							title: oController.getBundleText("LABEL_02244"),
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: saveFunction
						});
					} else {
						readFunction();
					}
				} else {
					readFunction();
				}
			},
			
			//  Tabbar Item 설정
			setTabbar : function(vMolga) {
				var oController = $.app.getController(SUB_APP_ID);
				
				for(var i=0; i<oController._vTabIds.length; i++) {
					var oControl = $.app.byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vTabIds[i]);
					if(oControl) oControl.setVisible(false);
				}
				
				oController._vActiveTabNames = [];
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/HiringFormTabInfoSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, vMolga)
					],
					success: function(oData) {	
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								var vTabid = oData.results[i].Tabid; //Tabtl
								
								var oControl = $.app.byId(oController.PAGEID + "_TABFILTER_Sub" + vTabid);
								if(oControl) {
									oControl.setText(oData.results[i].Tabtl);
									oControl.setVisible(true);
								}
								
								oController._vActiveTabNames.push(oData.results[i]);
							}
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				var oTabbar = $.app.byId(oController.PAGEID + "_TABBAR");
				if(oController._oIconTabbarItems && oController._oIconTabbarItems.length && oController._vActiveTabNames.length > 0) {
					oTabbar.removeAllItems();
					
					for(var k=0; k<oController._vActiveTabNames.length; k++) {
						var vKey = "Sub" + oController._vActiveTabNames[k].Tabid;
						for(var j=0; j<oController._oIconTabbarItems.length; j++) {
							if(vKey == oController._oIconTabbarItems[j].getKey()) {
								oTabbar.addItem(oController._oIconTabbarItems[j]);
								break;
							}					
						}
					}
				}
				
				
			},
			
			//  버튼 Setting
			setActionButton : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVE_BTN");
				var oAddBtn = $.app.byId(oController.PAGEID + "_ADD_BTN");
				var oModBtn = $.app.byId(oController.PAGEID + "_MODIFY_BTN");
				var oDelBtn = $.app.byId(oController.PAGEID + "_DELETE_BTN");
				var oDelSingleBtn = $.app.byId(oController.PAGEID + "_SINGLE_DELETE_BTN");
				var oRehireBtn = $.app.byId(oController.PAGEID + "_REHIRE_BTN");
				
				oSaveBtn.setVisible(false);
				oAddBtn.setVisible(false);
				oModBtn.setVisible(false);
				oDelBtn.setVisible(false);
				oDelSingleBtn.setVisible(false);
				oRehireBtn.setVisible(false);
				
				if(!oController._DISABLED) {
					switch(oController._JobPage) {
						case "Sub01" :
							oSaveBtn.setVisible(true);
							break;
						case "Sub07" :
							oSaveBtn.setVisible(true);
							if(oController._vCntSub07 != 0) oDelSingleBtn.setVisible(true);
							break;
						case "Sub21" :
							oSaveBtn.setVisible(true);		
							if(oController._vCntSub21 != 0) oDelSingleBtn.setVisible(true);
							break;
						case "Sub23" :
							oSaveBtn.setVisible(true);
							if(oController._vCntSub23 != 0) oDelSingleBtn.setVisible(true);
							break;
						case "Sub02" :
						case "Sub03" :
						case "Sub04" :
						case "Sub05" :
						case "Sub06" :
						case "Sub22" :
						case "Sub24" :
							oAddBtn.setVisible(true);
							oModBtn.setVisible(true);
							oDelBtn.setVisible(true);
					}
				}
				
				// 등록 / 수정 & 조회 에 따른 재입사 정보조회 버튼 활성화
				if(oController._vActionType != "C"){
					oRehireBtn.setVisible(false);
				}
			},
			
			//  저장버튼 클릭시....	
			onPressSave : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController["save" + oController._JobPage]();
			},
			
			onPressSingleDelete : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController["delete" + oController._JobPage]();
			},
		
			onPressAdd : function() {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);
				
				oController.subAction = 'C';
				var oPopupName = "";
				var vMolga = "";
				if(oController._JobPage == "Sub24"){
					if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
					else vMolga = "10";
				}else{
					if(oController._vMolga == "08") vMolga = "08";
					else vMolga = "10";
				}
		
				
				//영국의 경우 은행은 2개만 입력 가능하다.
				if(vMolga == "08" && oController._JobPage == "Sub24") {
					if(oController._vCntSub24 == 2) {
						MessageBox.alert(oController.getBundleText("MSG_02111"));
						return;
					}
				}
				
				if(vMolga == "10" && oController._JobPage == "Sub24") {
					if(oController._vCntSub24 == 7) {
						MessageBox.alert(oController.getBundleText("MSG_02112"));
						return;
					}
				}
				
				if(oController._JobPage == "Sub24") {
					oPopupName = "ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_" + oController._JobPage + "_" + vMolga;
				} else {
					oPopupName = "ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_" + oController._JobPage;
				}		
				
				oController._vSelectedContext = null;
				
				if(oController._JobPage == "Sub24") {
					if(!oController["_ODialogPopup_" + oController._JobPage + "_" + vMolga]) {
						
						oController["_ODialogPopup_" + oController._JobPage + "_" + vMolga] = sap.ui.jsfragment(oPopupName, oController);
						oView.addDependent(oController["_ODialogPopup_" + vMolga + "_" + oController._vMolga]);
					}
					oController["_ODialogPopup_" + oController._JobPage + "_" + vMolga].open();
				} else {
					if(!oController["_ODialogPopup_" + oController._JobPage]) {
						
						oController["_ODialogPopup_" + oController._JobPage] = sap.ui.jsfragment(oPopupName, oController);
						oView.addDependent(oController["_ODialogPopup_" + oController._JobPage]);
					}
					oController["_ODialogPopup_" + oController._JobPage].open();
				}
			},
		
			onPressModify : function() {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);
				
				var oTable = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
				var vIDXs = oTable.getSelectedIndices();
				if(oController._Sub02TableJson.getProperty("/Data") && oController._Sub02TableJson.getProperty("/Data").length > 0){
					if(vIDXs.length > 1){
						MessageBox.alert(oController.getBundleText("MSG_02114"));
						return;
					}else if(vIDXs.length < 1){
						MessageBox.alert(oController.getBundleText("MSG_00066"));	// 대상 항목을 선택하세요.
						return;
					}
		
					var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
					oController._vSelectedContext = oController._Sub02TableJson.getProperty(_selPath);
				
				}else {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				}
		
				oController.subAction = 'M';
				
				var oPopupName = "";
				var vMolga = "";
				
				if(oController._JobPage == "Sub24"){
					if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
					else vMolga = "10";
				}else{
					if(oController._vMolga == "08") vMolga = "08";
					else vMolga = "10";
				}
				
				if(oController._JobPage == "Sub24") {
					oPopupName = "ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_" + oController._JobPage + "_" + vMolga;
				} else {
					oPopupName = "ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_" + oController._JobPage;
				}
				
				var oDialogPopup = null;
				if(oController._JobPage == "Sub24") {
					oDialogPopup = oController["_ODialogPopup_" + oController._JobPage + "_" + vMolga];

					if(!oDialogPopup) {
						oDialogPopup = sap.ui.jsfragment(oPopupName, oController);
						oView.addDependent(oDialogPopup);
					}
					oDialogPopup.open();
				} else {
					oDialogPopup = oController["_ODialogPopup_" + oController._JobPage];
					if(!oDialogPopup) {
						oDialogPopup = sap.ui.jsfragment(oPopupName, oController);
						oView.addDependent(oDialogPopup);
					}
					oDialogPopup.open();
				}
			},
			
			onBeforeOpenDialog : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController["set" + oController._JobPage](oController._vSelectedContext);
				
				if(oController._vSelectedContext == null) {
					if(oController._JobPage == "Sub02") {
						oController.setSLABS("00");
		
						oController.onClearFaartFields(oController);
						
						
						var oSland = $.app.byId(oController.PAGEID + "_Sub02_Sland");
						oSland.removeAllCustomData();
						oSland.setValue(oController.getBundleText("LABEL_02288"));
						oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : "KR"}));
						
					} else if(oController._JobPage == "Sub04") {
						oController.setEXMTY("");
					}
				}
			},
		
			onPressDelete : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
				var vIDXs = oTable.getSelectedIndices();

				if(oController._Sub02TableJson.getProperty("/Data") && oController._Sub02TableJson.getProperty("/Data").length > 0){
					if(vIDXs.length < 1){
						MessageBox.alert(oController.getBundleText("MSG_00066"));	// 대상 항목을 선택하세요.
						return;
					}
				}else {
					MessageBox.alert(oController.getBundleText("MSG_02035"));
					return;
				}
				
				var onProcessDelete = function(fVal) {
					if(fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var sPath = "";
						var process_result = false;

						for(var i = 0; i < vIDXs.length ; i ++){
							var _selPath = oTable.getContextByIndex(vIDXs[i]).sPath;
							var vContexts = oController._Sub02TableJson.getProperty(_selPath);

							sPath = oModel.createKey("/RecruitingSubjectsEducationSet", {
								Docno: vContexts.Docno,
								VoltId: vContexts.VoltId,
								Seqnr: vContexts.Seqnr
							});
							
							oModel.remove(sPath, {
								success: function () {
									process_result = true;
								},
								error: function (oError) {
									var Err = {};					    	
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
											Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
										} else {
											Common.showErrorMessage(Err.error.message.value);
										}
										
									} else {
										Common.showErrorMessage(oError);
									}
									process_result = false;
								}
							});

							if(process_result == false) break;
						}
						
						if(process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController["reload" + oController._JobPage]();
									oController.onClose();
								}
							});
						}
					}
				};
				
				
				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title : oController.getBundleText("LABEL_02093"),
					onClose : onProcessDelete
				});
			
			},
		
			onClose : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oDialogName = "";
				var vMolga = "";
				
				if(oController._JobPage == "Sub24"){
					if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
					else vMolga = "10";
				}else{
					if(oController._vMolga == "08") vMolga = "08";
					else vMolga = "10";
				}
				
				if(oController._JobPage == "Sub24") {
					oDialogName = oController.PAGEID + "_POP_" + oController._JobPage  + "_" + vMolga + "_Dialog";
				} else {
					oDialogName = oController.PAGEID + "_POP_" + oController._JobPage + "_Dialog";
				}
				
				var oDialog = $.app.byId(oDialogName);
				if(oDialog) oDialog.close();
			},
		
			onChangeSlart : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController.setSLABS("00");
				oController.onClearFaartFields(oController);
			},
			
			onChangeQuali : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController.setEXMTY("");
				oController.setEAMGR("");
			},
			
			onChangeExmty : function() {
				$.app.getController(SUB_APP_ID).setEAMGR("");
			},
			
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 학위 DDLB
			/////////////////////////////////////////////////////////////////////////////////////////////
			setSLABS : function(vSelectedKey) {
				var oController = $.app.getController(SUB_APP_ID);
				var oSlart = $.app.byId(oController.PAGEID + "_Sub02_Slart");
				var oSlabs = $.app.byId(oController.PAGEID + "_Sub02_Slabs");
				
				oSlabs.removeAllItems();
				oSlabs.addItem(
					new sap.ui.core.Item({
						key : "00",
						text : oController.getBundleText("LABEL_02035")
					})
				);
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Slabs"),
						new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, oSlart.getSelectedKey()),
						new sap.ui.model.Filter("PersaNc", sap.ui.model.FilterOperator.EQ, "X")
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oSlabs.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oSlabs.setSelectedKey(vSelectedKey);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
		
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 시험구분 DDLB
			/////////////////////////////////////////////////////////////////////////////////////////////
			setEXMTY : function(vSelectedKey) {
				var oController = $.app.getController(SUB_APP_ID);
				var oQuali = $.app.byId(oController.PAGEID + "_Sub04_Quali");
				var oExmty = $.app.byId(oController.PAGEID + "_Sub04_Exmty");
				
				if(typeof oExmty != "object") return;
				
				oExmty.removeAllItems();
				oExmty.addItem(
					new sap.ui.core.Item({
						key : "",
						text : oController.getBundleText("LABEL_02035")
					})
				);
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Exmty"),
						new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, oQuali.getSelectedKey()),
						new sap.ui.model.Filter("PersaNc", sap.ui.model.FilterOperator.EQ, "X")
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oExmty.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oExmty.setSelectedKey(vSelectedKey);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 지급방법
			/////////////////////////////////////////////////////////////////////////////////////////////
			setBkont : function(vSelectedKey, oBkont) {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(typeof oBkont != "object") return;
				
				oBkont.removeAllItems();
				oBkont.addItem(new sap.ui.core.Item({key : "0000", text : oController.getBundleText("LABEL_02035")}));
				oBkont.addItem(new sap.ui.core.Item({key : "01", text : "Checking Account"}));
				oBkont.addItem(new sap.ui.core.Item({key : "02", text : "Savings Account"}));
				
				if(vSelectedKey != "0000" && vSelectedKey != "") oBkont.setSelectedKey(vSelectedKey);
			},
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 지급방법
			/////////////////////////////////////////////////////////////////////////////////////////////
			setZlsch : function(vLand, vSelectedKey) {
				var oController = $.app.getController(SUB_APP_ID);
				var vMolga = "";

				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var oZlsch = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
				
				if(typeof oZlsch != "object") return;
				
				oZlsch.removeAllItems();
				oZlsch.addItem(
					new sap.ui.core.Item({
						key : "",
						text : oController.getBundleText("LABEL_02035")
					})
				);
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Zlsch"),
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, oController._vActda),
						new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, vLand)
					],
					success: function(data) {
						if(data && data.results) {
							for(var i=0; i<data.results.length; i++) {
								oZlsch.addItem(
									new sap.ui.core.Item({
										key : data.results[i].Ecode,
										text : data.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "0000" && vSelectedKey != "") oZlsch.setSelectedKey(vSelectedKey);
						}
					},
					error: function(res) {
						Common.log(res);
					}
				});
			},
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 시험등급 DDLB
			/////////////////////////////////////////////////////////////////////////////////////////////
			setEAMGR : function(vSelectedKey) {
				var oController = $.app.getController(SUB_APP_ID);
				var oExmty = $.app.byId(oController.PAGEID + "_Sub04_Exmty");
				var oEamgr = $.app.byId(oController.PAGEID + "_Sub04_Eamgr");
				
				if(typeof oEamgr != "object") return;
				
				oEamgr.removeAllItems();
				oEamgr.addItem(
					new sap.ui.core.Item({
						key : "",
						text : oController.getBundleText("LABEL_02035")
					})
				);
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Eamgr"),
						new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, oExmty.getSelectedKey()),
						new sap.ui.model.Filter("PersaNc", sap.ui.model.FilterOperator.EQ, "X")
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oEamgr.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oEamgr.setSelectedKey(vSelectedKey);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
			
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 학교 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchEvent : null,
			
			onDisplaySearchDialog : function() {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				var oSlart = $.app.byId(oController.PAGEID + "_Sub02_Slart");
				var oSland = $.app.byId(oController.PAGEID + "_Sub02_Sland");
				oSlart.removeStyleClass("L2PSelectInvalidBorder");
				oSland.setValueState(sap.ui.core.ValueState.None);
				
				if(oSlart.getSelectedKey() == "0000") {
					oSlart.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02072"));
					return;
				}
				
				oController._SelectedContext = null;
				
				if(!oController._ODialogSearchEvent) {
					oController._ODialogSearchEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Schcd", oController);
					oView.addDependent(oController._ODialogSearchEvent);
				}
				
				var oSchcd = $.app.byId(oController.PAGEID + "_POP_Schcd");
				oSchcd.setValue("");
				
				oController._ODialogSearchEvent.open();
			},
			
			onSearchSchcd : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oSlart = $.app.byId(oController.PAGEID + "_Sub02_Slart");
				var sValue = $.app.byId(oController.PAGEID + "_POP_Schcd").getValue();

				if(sValue.length < 2){
					Common.showErrorMessage(oController.getBundleText("MSG_02117"));
					return ;
				}
				
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Slart", sap.ui.model.FilterOperator.EQ, oSlart.getSelectedKey()));
				oFilters.push(new sap.ui.model.Filter("Insti", sap.ui.model.FilterOperator.EQ, sValue));
			
				var oSchcdList = $.app.byId(oController.PAGEID + "_POP_Schcd_StandardList");
				var oSchcdListItem = $.app.byId(oController.PAGEID + "_POP_Schcd_StandardListItem");
				oSchcdList.bindItems("/SchoolCodeSet", oSchcdListItem, null, oFilters);
			},
			
			onConfirmSchcd : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oSchcd = $.app.byId(oController.PAGEID + "_Sub02_Schcd");
				var oList = $.app.byId(oController.PAGEID + "_POP_Schcd_StandardList");
				var aContexts = oList.getSelectedContexts(true);
				
				if (aContexts.length == 1){
					var vSchcd = aContexts[0].getProperty("Schcd");
					var vInsti = aContexts[0].getProperty("Insti");
					oSchcd.removeAllCustomData();
					oSchcd.setValue(vInsti);
					oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : vSchcd}));
				}
				
				oController.onCancelSchcd(oEvent);
			},
				
			onClearSelectedSchcd : function(oEvent){
				var oController = $.app.getController(SUB_APP_ID);
				var oSchcd = $.app.byId(oController.PAGEID + "_Sub02_Schcd");

				oSchcd.removeAllCustomData();
				oSchcd.setValue("");
				oController.onCancelSchcd(oEvent);
			},
			
			onCancelSchcd : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oSchcdList = $.app.byId(oController.PAGEID + "_POP_Schcd_StandardList");

				oSchcdList.unbindItems();
				if(oController._ODialogSearchEvent.isOpen()){
					oController._ODialogSearchEvent.close();
				}
			},
			
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 회사 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchCompanyEvent : null,
			
			onDisplaySearchCompanyDialog : function() {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._SelectedContext = null;
				
				if(!oController._ODialogSearchCompanyEvent) {
					oController._ODialogSearchCompanyEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Arbgb", oController);
					oView.addDependent(oController._ODialogSearchCompanyEvent);
				}
				
				var oArbgb = $.app.byId(oController.PAGEID + "_POP_Arbgb");
				oArbgb.setValue("");
				
				oController._ODialogSearchCompanyEvent.open();
			},
			
			beforeOpenArbgb : function(){
				var oController = $.app.getController(SUB_APP_ID);
				var oList = $.app.byId(oController.PAGEID + "_POP_Arbgb_StandardList");

				oList.unbindItems();
			},
			
			onSearchArbgb : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oArbgb = $.app.byId(oController.PAGEID + "_POP_Arbgb");
				var sValue = oArbgb.getValue();

				if(sValue.length < 2){
					Common.showErrorMessage(oController.getBundleText("MSG_02117"));
					return ;
				}
				
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Arbgb", sap.ui.model.FilterOperator.EQ, sValue));
				
				var oArbgbList = $.app.byId(oController.PAGEID + "_POP_Arbgb_StandardList");
				var oArbgbListItem = $.app.byId(oController.PAGEID + "_POP_Arbgb_StandardListItem");
				oArbgbList.bindItems("/PrevEmployersCodeListSet", oArbgbListItem, null, oFilters);
			},
			
			onConfirmArbgb : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oArbgb = $.app.byId(oController.PAGEID + "_Sub03_Arbgb");
				var oList = $.app.byId(oController.PAGEID + "_POP_Arbgb_StandardList");
				var aContexts = oList.getSelectedContexts(true);
				
				if (aContexts.length == 1){
					var vArbgb = aContexts[0].getProperty("Arbgb");
					var vZzarbgb = aContexts[0].getProperty("Zzarbgb");
			
					oArbgb.removeAllCustomData();
					oArbgb.setValue(vArbgb);
					oArbgb.addCustomData(new sap.ui.core.CustomData({key : "Arbgb", value : vZzarbgb}));
				}
				
				oController.onCancelArbgb(oEvent);
			},
				
			onCancelArbgb : function() {
				var oController = $.app.getController(SUB_APP_ID);
		
				if(oController._ODialogSearchCompanyEvent.isOpen()){
					oController._ODialogSearchCompanyEvent.close();
				}
			},
			/////////////////////////////////////////////////////////////////////////////////////////////	
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 직무 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_SerachStellDialog : null,
			
			displayStellSearchDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);
				
				jQuery.sap.require("common.SearchStell");
				
				common.SearchStell.oController = oController;
				common.SearchStell.vActionType = "Single";
				common.SearchStell.vCallControlId = oEvent.getSource().getId();
				common.SearchStell.vCallControlType = "Input";
				
				if(!oController._SerachStellDialog) {
					oController._SerachStellDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", oController);
					oView.addDependent(oController._SerachStellDialog);
				}
				oController._SerachStellDialog.open();
			},
			
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 국가 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchNatioEvent : null,
			_ONatioControl : null,
			
			onDisplaySearchNatioDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._ONatioControl = oEvent.getSource();
		
				if(!oController._ODialogSearchNatioEvent) {
					oController._ODialogSearchNatioEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Natio", oController);
					oView.addDependent(oController._ODialogSearchNatioEvent);
				}
				oController._ODialogSearchNatioEvent.open();
			},
			
			onSearchNatio : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Natio"));
				oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
			
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oFilters);
			},
			
			onConfirmNatio : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var aContexts = oEvent.getParameter("selectedContexts");
				var vIds = oController._ONatioControl.sId.split("_");
				var vKey = vIds[vIds.length - 1];
			
				if (aContexts.length) {
					var vNatio = aContexts[0].getProperty("Ecode");
					var vNatiotx = aContexts[0].getProperty("Etext");

					if(vNatio == "") vNatiotx = "";

					oController._ONatioControl.removeAllCustomData();
					oController._ONatioControl.setValue(vNatiotx);
					oController._ONatioControl.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vNatio}));
					
					oController._vModifyContent = true;
					
					if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Land1") > 0) {
						oController._vNatio = vNatio;
						oController.setDDLBState("", oController._vMolga, "Land1", "State");
					} else if(oController._ONatioControl.sId.indexOf("_Sub24_Banks") > 0) {
						oController.setZlsch(vNatio, "");
					} else if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Emecland1") > 0) {
						oController.setDDLBState("", oController._vMolga, "Emecland1", "Emecstate");
					} else if(oController._ONatioControl.sId.indexOf("_Sub21_") > 0) {
						var vTmp1 = oController._ONatioControl.sId.substring(oController._ONatioControl.sId.indexOf("_Form_") + 6);
						var vTmp2 = vTmp1.split("_");
						var vPrefix1 = "";
						for(var i=0; i<vTmp2.length - 1; i++) {
							vPrefix1 += vTmp2[i] + "_";
						}
						
						oController.setDDLBState2("", vNatio, oController.PAGEID + "_Sub21_Form_" + vPrefix1 + "State");
					} else if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Gblnd") > 0) {
						oController.setDDLBState("", oController._vMolga, "Gblnd", "Gbdep");
					} 
					
					var oPstlz = $.app.byId(oController.PAGEID + "_Sub01_Pstlz");
					if(typeof oPstlz == "object") {
						if(vNatio == "KR") {
							oPstlz.setShowValueHelp(true);
						} else {
							oPstlz.setShowValueHelp(false);
						}
						
						if(oController._ONatioControl.sId.indexOf("Gblnd") < 0) oPstlz.setValue("");
					}
				}
				
				oController.onCancelNatio(oEvent);
			},
				
			onCancelNatio : function(oEvent) {
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter([]);
			},
			/////////////////////////////////////////////////////////////////////////////////////////////
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 은행 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchBanklEvent : null,
			_OBanklControl : null,
			
			onDisplaySearchBanklDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				var vMolga = "";		
				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var oBanks = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
				var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
				
				if(vBanks == "") {
					MessageBox.alert("Please select a country.");
					return;
				}
				
				oController._OBanklControl = oEvent.getSource();
		
				if(!oController._ODialogSearchBanklEvent) {
					oController._ODialogSearchBanklEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Bankl", oController);
					oView.addDependent(oController._ODialogSearchBanklEvent);
				}
				oController._ODialogSearchBanklEvent.open();
				
				oController.onSetBankFragment();
			},
			
			onSetBankFragment : function() {
				var mBankCodeList = sap.ui.getCore().getModel("BankCodeList");
				var vBankCodeList = {BankCodeSet : []};
				mBankCodeList.setData(vBankCodeList);
			},
			
			onSearchBankl : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vMolga = "";		

				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var sValue = oEvent.getParameter("value");
				if(sValue == "") {
					var vMsg = oController.getBundleText("MSG_02064");				
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02289"));
					MessageBox.alert(vMsg);
					return false;
				}
				
				var oBanks = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
				var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
				var mBankCodeList = sap.ui.getCore().getModel("BankCodeList");
				var vBankCodeList = {BankCodeSet : []};
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/BankCodeSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, vBanks),
						new sap.ui.model.Filter("Banka", sap.ui.model.FilterOperator.EQ, sValue)
					],
					success: function(oData) {
						if(oData && oData.results) {		
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								oneData.SearchText = oData.results[i].Banka + " " + oData.results[i].Bankl;
								vBankCodeList.BankCodeSet.push(oneData);
							}	
							mBankCodeList.setData(vBankCodeList);
						}
					},
					error: function(oError) {
						Common.log(oError);
					}
				});
			},
			
			onConfirmBankl : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var aContexts = oEvent.getParameter("selectedContexts");
			
				if (aContexts.length) {
					var vBankl = aContexts[0].getProperty("Bankl");
					var vBanka = aContexts[0].getProperty("Banka");
					oController._OBanklControl.removeAllCustomData();
					oController._OBanklControl.setValue(vBanka);
					oController._OBanklControl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : vBankl}));
					
					oController._vModifyContent = true;
				}
				
				oController.onCancelBankl(oEvent);
			},
				
			onCancelBankl : function(oEvent) {
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter([]);
			},
			/////////////////////////////////////////////////////////////////////////////////////////////	
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 자격증 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchCttypEvent : null,
			_OCttypControl : null,
			
			onDisplaySearchCttypDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._OCttypControl = oEvent.getSource();
		
				if(!oController._ODialogSearchCttypEvent) {
					oController._ODialogSearchCttypEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Cttyp", oController);
					oView.addDependent(oController._ODialogSearchCttypEvent);
				}
				
				var oCttyp = $.app.byId(oController.PAGEID + "_POP_Cttyp");
				var CttypText_Btn = $.app.byId(oController.PAGEID + "_CttypText_Btn");
				oCttyp.setValue("");
				CttypText_Btn.setVisible(true);
				
				oController._ODialogSearchCttypEvent.open();
			},
			
			onSearchCttyp : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var sValue = $.app.byId(oController.PAGEID + "_POP_Cttyp").getValue();

				if(sValue.length < 2){
					Common.showErrorMessage(oController.getBundleText("MSG_02117"));
					return ;
				}

				var dataProcess = function(){
					var mCertiTypeSearchList = sap.ui.getCore().getModel("CttypList");
					var vCertiTypeSearchList = {CertiTypeSearchSet : []};
					var oCttypModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_CERTI_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"});
					
					oCttypModel.read("/CertiTypeSearchSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Cttyp"),
							new sap.ui.model.Filter("Cttyptx", sap.ui.model.FilterOperator.EQ, sValue)
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vCertiTypeSearchList.CertiTypeSearchSet.push(oData.results[i]);
								}
							}
							mCertiTypeSearchList.setData(vCertiTypeSearchList);
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});	
						
					
					var oCttypList = $.app.byId(oController.PAGEID + "_POP_Cttyp_StandardList");
					var oCttypListItem = $.app.byId(oController.PAGEID + "_POP_Cttyp_StandardListItem");
					
					oCttypList.bindItems("/CertiTypeSearchSet", oCttypListItem, null, []);	
					
					BusyIndicator.hide();
				};
				
				BusyIndicator.show(0);

				setTimeout(dataProcess, 300);
			},
			
			onConfirmCttyp : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oCttyp = $.app.byId(oController.PAGEID + "_Sub06_Cttyp");
				var oIsaut = $.app.byId(oController.PAGEID + "_Sub06_Isaut");
				var oCttypList = $.app.byId(oController.PAGEID + "_POP_Cttyp_StandardList");
				var aContexts = oCttypList.getSelectedContexts(true);
			
				if (aContexts.length == 1){
					var vCttyp = aContexts[0].getProperty("Cttyp");
					var vCttyptx = aContexts[0].getProperty("Cttyptx");
					var vIsaut = aContexts[0].getProperty("Isaut");
					oCttyp.removeAllCustomData();
					oCttyp.setValue(vCttyptx);
					oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : vCttyp}));
					oIsaut.setValue(vIsaut);
				}
				
				oController.onCancelCttyp(oEvent);
			},
				
			onCancelCttyp : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oCertiTypeSearchModel = sap.ui.getCore().getModel("CttypList");
				var vCode = {CertiTypeSearchSet : []};
				oCertiTypeSearchModel.setData(vCode);
			
				var oCttypList = $.app.byId(oController.PAGEID + "_POP_Cttyp_StandardList");
				var oCttypListItem = $.app.byId(oController.PAGEID + "_POP_Cttyp_StandardListItem");
				oCttypList.bindItems("/CertiTypeSearchSet", oCttypListItem, null, []);
			
				if(oController._ODialogSearchCttypEvent.isOpen()){
					oController._ODialogSearchCttypEvent.close();
				}
			},
			/////////////////////////////////////////////////////////////////////////////////////////////
					
			/////////////////////////////////////////////////////////////////////////////////////////////
			// 주소 검색을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchZipcodeEvent : null,
			
			onDisplaySearchZipcodeDialog : function() {
				window.open("zip_search2.html?CBF=fn_SetAddr", "pop", "width=550,height=550, scrollbars=yes, resizable=yes");
			},
			
			beforeOpenZSDialog : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oZipcodeSearchField = $.app.byId(oController.PAGEID + "_ZipcodeSearchField");

				if(oZipcodeSearchField) oZipcodeSearchField.setValue("");
			},
					
			/////////////////////////////////////////////////////////////////////////////////////////////
			// Sub01 인적사항을 위한 Functions
			/////////////////////////////////////////////////////////////////////////////////////////////
			//  인적사항 화면 Setting.
			setSub01 : function(RehireData) {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var oNameLayout = $.app.byId(oController.PAGEID + "_NameLayout");
				var oNameLayoutText = $.app.byId(oController.PAGEID + "_NameLayoutText");
				
				oNameLayoutText.setText("");
				oNameLayout.setVisible(false);
				
				var oRequestPanel = $.app.byId(oController.PAGEID + "_Sub01_RequestPanel");
				oRequestPanel.destroyContent();
				
				var vGroupInfo = [];
				if(oController._vHiringPersonalInfomationLayout && oController._vHiringPersonalInfomationLayout.length) {
					for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
						var isExists = false;
						for(var j=0; j<vGroupInfo.length; j++) {
							if(vGroupInfo[j].Itgrp == oController._vHiringPersonalInfomationLayout[i].Itgrp) {
								isExists = true;
								break;
							}
						}
						if(isExists == false) {
							vGroupInfo.push({Itgrp : oController._vHiringPersonalInfomationLayout[i].Itgrp, Itgrptx : oController._vHiringPersonalInfomationLayout[i].Itgrptx});
						}
					}
				}
		
				var vCernoI = "";
				var vChangeData = null;
				
				if(RehireData) {
					//재입사 일본의 경우
					if(oController._vMolga == "22") {
						oController._vJapanIdnum = RehireData.Idnum;
					}
					vChangeData = RehireData;
					vCernoI = RehireData.Idnum;
				}
				
				if(RehireData == null && oController._vActionType != "C") {
					var sPath = oModel.createKey("RecruitingSubjectsSet", {
						Docno: oController._vDocno,
						VoltId: oController._vVoltId
					});
					
					oModel.read(sPath, {
						async: false,
						success: function(oData) {	
							if(oData) {
								vChangeData = oData;
								if(vChangeData.Anzkd == "0") vChangeData.Anzkd = "";
								oController._vRecno = oData.Recno;
								oController._vVoltId = oData.VoltId;
								oNameLayout.setVisible(true);
								
								var vNameStr = oData.Ename;
								
								oController._vNatio = oData.Natio;
								
								oNameLayoutText.setText(vNameStr);
								
								oController._vCntSub01 = 1;
								oController.setCountTabBar(oController, "Sub01");
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});
				}
				
				var oTempLayout = new sap.ui.commons.layout.VerticalLayout({
					width : "100%",
					content : []
				}).addStyleClass("L2PPadding05remLR mt-20");
				
				var oCell = null, oRow = null;
				var Fieldname = "",
					TextFieldname = "",
					Fieldtype = "";
				
				for(var g=0; g<vGroupInfo.length; g++) {
					var oToolbar = new sap.m.Toolbar({
					//	height : "36px",						
						design : sap.m.ToolbarDesign.Auto,
						content : [ 
						//	new sap.ui.core.Icon({
						//		src: "sap-icon://open-command-field", 
						//		size : "1.0rem"
						//	}),
						//	new sap.m.ToolbarSpacer({width: "5px"}),
							new sap.m.Label({text : vGroupInfo[g].Itgrptx }).addStyleClass("L2PFontFamilyBold act-sub-title mt20")
						]
					}).addStyleClass("L2PToolbarNoBottomLine L2PPadding05remLR");
					
					var oControlMatrix = new sap.ui.commons.layout.MatrixLayout({
						width : "99%",
						layoutFixed : false,
						columns : 4,
						widths: ["15%","35%","15%","35%"],
					}).addStyleClass("act-tbl-write mt10");
					
					var c_idx = 0;
					var vDefaultValues = [];
					for(var k=0; k<oController._vHiringPersonalInfomationLayout.length; k++) {
						Fieldname = Common.underscoreToCamelCase(oController._vHiringPersonalInfomationLayout[k].Fieldname);
						
						if(oController._vHiringPersonalInfomationLayout[k].Dcode != "") {
							var vOneDefaultValue = {};
							vOneDefaultValue.Fieldname = Fieldname;
							vOneDefaultValue.Code = oController._vHiringPersonalInfomationLayout[k].Dcode;
							vOneDefaultValue.Text = oController._vHiringPersonalInfomationLayout[k].Dvalu;
							
							vDefaultValues.push(vOneDefaultValue);
						}
					}
					
					for(var m=0; m<oController._vHiringPersonalInfomationLayout.length; m++) {
						if(oController._vHiringPersonalInfomationLayout[m].Itgrp == vGroupInfo[g].Itgrp) {
							Fieldname = Common.underscoreToCamelCase(oController._vHiringPersonalInfomationLayout[m].Fieldname);
							TextFieldname = Fieldname + "_Tx";
							Fieldtype = oController._vHiringPersonalInfomationLayout[m].Incat;
							
							if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
								continue;
							}
							if((Fieldname == "Famdt")) {
								continue;
							}
							
							if((c_idx % 2) == 0) {
								if(c_idx != 0) {
									oControlMatrix.addRow(oRow);
								}
								oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"});
							}
							
							var vUpdateValue = oController._vHiringPersonalInfomationLayout[m].Dcode;
							var vUpdateTextValue = oController._vHiringPersonalInfomationLayout[m].Dvalu;
							
							if(vChangeData != null) {
								vUpdateValue = vChangeData[Fieldname];
								vUpdateTextValue = vChangeData[TextFieldname];
							} 
							
							var vLabel = oController._vHiringPersonalInfomationLayout[m].Label;
							var vMaxLength = parseInt(oController._vHiringPersonalInfomationLayout[m].Maxlen);
							if(vMaxLength == 0) {
								vMaxLength = Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", Fieldname);
							}
							
							var oLabel = new sap.m.Label({text : vLabel});
							if(Fieldtype.substring(0, 1) == "M") {
								oLabel.setRequired(true);
							} else {
								oLabel.setRequired(false);
							}
							oLabel.addStyleClass("L2PFontFamily");
							oLabel.setTooltip(vLabel);
							
							if(Fieldtype == "D2") {
								oLabel.setText("");
							}
							
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								hAlign : sap.ui.commons.layout.HAlign.Begin,
								vAlign : sap.ui.commons.layout.VAlign.Middle,
								content : [oLabel]
							}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
							oRow.addCell(oCell);				
							
							var oControl = oController.makeControl(oController, Fieldtype, Fieldname, vMaxLength, vLabel, vUpdateValue, vUpdateTextValue, vChangeData, vDefaultValues);
							
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								hAlign : sap.ui.commons.layout.HAlign.Begin,
								vAlign : sap.ui.commons.layout.VAlign.Middle,
								content : oControl
							}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
							oRow.addCell(oCell);
							
							c_idx++;
						}
					}
					if(c_idx > 0) {
						if(oRow.getCells().length == 2) {
							oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixLabel L2PPaddingLeft10"));
							oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixData L2PPaddingLeft10"));
						}
						oControlMatrix.addRow(oRow);
					}
				
					oTempLayout.addContent(oToolbar);		
					oTempLayout.addContent(oControlMatrix);			
				}
				oRequestPanel.addContent(oTempLayout);			
				
				var oTable = $.app.byId(oController.PAGEID + "_Sub01_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub01_COLUMNLIST");
				if(vCernoI == ""){
					// 재입사 이며 , 수정 화면일 경우
					if(oController._pDataSub08 != "0" && oController._pDataSub08 != ""  && vChangeData != null){
						vCernoI = vChangeData.Idnum;
					}
				}
				if(vCernoI != "") {
					oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno) ,
																									new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vCernoI)]);
				} else {
					oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, null);
				}
				
			},
			
		//  전화번호 가지고오기...	
			getTelNum : function(vControlName){
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = $.app.byId(vControlName);
				var oTelControl = $("#" + vControlName + "-inner");
				var vVal = "";
				
				if ($.trim(oTelControl.val())) {
					if(oTelControl.intlTelInput("isValidNumber")) {
						oControl.setValueState(sap.ui.core.ValueState.None);
						oControl.setValueStateText("");
						if(oTelControl.val().indexOf("+") == -1) {
							if(oTelControl.intlTelInput("getSelectedCountryData").dialCode) {
								vVal = "+" + oTelControl.intlTelInput("getSelectedCountryData").dialCode + " " + oTelControl.val();
							} else {
								vVal = oTelControl.val();
							}
						} else {
							vVal = oTelControl.val();
						}
					} else {
						oControl.setValueState(sap.ui.core.ValueState.Error);
						oControl.setValueStateText("Wrong Telephone Number !!!");
						MessageBox.alert(oController.getBundleText("MSG_02073"), {});
						vVal = "WrongNum";
					}
				} else {
					vVal = "";
				}
				
				return vVal;
			},
			
			//  인적사항을 저장 한다.	
			saveSub01 : function(fVal) {
				var oController = $.app.getController(SUB_APP_ID);
				
				var vOneData = {
					Docno : oController._vDocno,
					Recno : oController._vRecno,
					VoltId : oController._vVoltId,
					Persa : oController._vPersa,
					Reqno : oController._vReqno,
					Actda : oController._vActda == "" || oController._vActda == "0NaN-NaN-NaN" ? null : "/Date(" + Common.getTime(oController._vActda) + ")/"
				};
				
				for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
					var Fieldname = Common.underscoreToCamelCase(oController._vHiringPersonalInfomationLayout[i].Fieldname),
						TextFieldname = Fieldname + "_Tx",
						Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat,
						vLabel = oController._vHiringPersonalInfomationLayout[i].Label;
					
					var oControl = $.app.byId(oController.PAGEID + "_Sub01_" + Fieldname);
					if(typeof oControl != "object") {
						continue;
					}
					
					var vValue = "", vMsg = "";
					var oCustomData = null;
					var oRadio = null;
					
					if(Fieldtype == "M1") {				
						vValue = oControl.getSelectedKey();					
						if(vValue == "" || vValue == "0000") {
							oControl.addStyleClass("L2PSelectInvalidBorder");
							vMsg = oController.getBundleText("MSG_02063");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oControl.removeStyleClass("L2PSelectInvalidBorder");
							vOneData[Fieldname] = vValue;
						}
					} else if(Fieldtype == "M2" || Fieldtype == "M5") {
						oCustomData = oControl.getCustomData();
						if(oCustomData && oCustomData.length) {
							for(var c=0; c<oCustomData.length; c++) {
								if(oCustomData[c].getKey() == Fieldname) {
									vValue = oCustomData[c].getValue();
								}
							}
						}
						
						if(vValue == "" || vValue == "0000") {
							oControl.setValueState(sap.ui.core.ValueState.Error);
							vMsg = oController.getBundleText("MSG_02063");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vOneData[Fieldname] = vValue;
							vOneData[TextFieldname] = oControl.getValue();
						}
					} else if(Fieldtype == "M3") {
						vValue = oControl.getValue();
						if(vValue == "") {
							oControl.setValueState(sap.ui.core.ValueState.Error);
							vMsg = oController.getBundleText("MSG_02064");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							if(oController._vMolga == "08" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
								vValue = vValue.toUpperCase();
							}
							
							oControl.setValueState(sap.ui.core.ValueState.None);
							vOneData[Fieldname] = vValue;
							
							if(Fieldname == "Idnum" || Fieldname == "Perid" || Fieldname == "Numss") {
								vOneData.Idnum = vValue;
							}
						}
					} else if(Fieldtype == "M4") {
						vValue = oControl.getValue();					
						if(vValue == "") {
							oControl.setValueState(sap.ui.core.ValueState.Error);
							vMsg = oController.getBundleText("MSG_02064");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vOneData[Fieldname] = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '/Date(' + Common.getTime(vValue) + ')/';
						}
					} else if(Fieldtype == "M6") {
						if(oControl.getSelected() == false) {
							oControl.setValueState(sap.ui.core.ValueState.Error);
							vMsg = oController.getBundleText("MSG_02063");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vOneData[Fieldname] = 'X';
						}
					} else if(Fieldtype == "M7") {	
						vValue = oController.getTelNum(oControl.getId());
						
						if(vValue == "WrongNum") return false;
						if( vValue == "") {
							oControl.setValueState(sap.ui.core.ValueState.Error);
							vMsg = oController.getBundleText("MSG_02064");
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oControl.setValueState(sap.ui.core.ValueState.None);	
							vOneData[Fieldname] = vValue;
						}
					} else if(Fieldtype == "M8") {
						if(oControl.getSelectedIndex() == -1) {
							vMsg = oController.getBundleText("MSG_02063");							
							vMsg = vMsg.replace("&Cntl", vLabel);
							MessageBox.alert(vMsg);
							return false;
						} else {
							oRadio = oControl.getSelectedButton();
							if(oRadio) {
								vValue = oRadio.getCustomData()[0].getValue();
								vOneData[Fieldname] = vValue;
							}
						}
					} else if(Fieldtype == "O1") {			
						vValue = oControl.getSelectedKey();		
						if(vValue == "0000") vValue = "";
						vOneData[Fieldname] = vValue;
					} else if(Fieldtype == "O2" || Fieldtype == "O5") {
						oCustomData = oControl.getCustomData();
						if(oCustomData && oCustomData.length) {
							for(var k=0; k<oCustomData.length; k++) {
								if(oCustomData[k].getKey() == Fieldname) {
									vValue = oCustomData[k].getValue();
								}
							}
						}
						
						vOneData[Fieldname] = vValue;
						vOneData[TextFieldname] = oControl.getValue();
					} else if(Fieldtype == "O3") {
						vValue = oControl.getValue();	
						if(Fieldname == "Nip00"){
							if(vValue != "") {
								var vTempValue = vValue;
								while(vTempValue.indexOf("-") != -1){
									vTempValue = vTempValue.replace("-","");
								} 
								vOneData.Nip00 = vTempValue;
							}else
								vOneData.Nip00 = "";
						}else{
							if(vValue != "") {
								vOneData[Fieldname] = vValue;
							}
						}
					} else if(Fieldtype == "O4") {
						vValue = oControl.getValue();	
						vOneData[Fieldname] = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '/Date(' + Common.getTime(vValue) + ')/';
					} else if(Fieldtype == "O6") {
						if(oControl.getSelected() == true) {
							vOneData[Fieldname] = 'X';
						} else {
							vOneData[Fieldname] = '';
						}
					} else if(Fieldtype == "O7") {
						vValue = oController.getTelNum(oControl.getId());
						if(vValue == "WrongNum") return false;
						oControl.setValueState(sap.ui.core.ValueState.None);	
						vOneData[Fieldname] = vValue;
					} else if(Fieldtype == "O8") {
						oRadio = oControl.getSelectedButton();
						if(oRadio) {
							vValue = oRadio.getCustomData()[0].getValue();
							vOneData[Fieldname] = vValue;
						}
					} else if(Fieldtype == "D0" || Fieldtype == "D1") {
						vValue = oControl.getValue();					
						vOneData[Fieldname] = vValue;
					} 
                }
                
				// 자녀 수 특수문자 체크
				if(oController.checkNum("Anzkd" , vOneData.Anzkd, oController) == false) {
					return;
				}
				
				//재입사 일본의 경우
				if(oController._vMolga == "22" && oController._vJapanIdnum != "") {
					vOneData.Idnum = oController._vJapanIdnum;
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController._vActionType) {
					case "C" :
						
						if(oController._fRehireStatus == true) {
							oController.onOpenRehireDataSelect(vOneData);
						} else {
							oModel.create(sPath, vOneData, {
								success: function (oData) {
									if(oData) {
										oController._vVoltId = oData.VoltId;
									}
									process_result = true;
									oController._vActionType = "M";
								},
								error: function (oError) {
									var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
											Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
										} else {
											Common.showErrorMessage(Err.error.message.value);
										}
										
									} else {
										Common.showErrorMessage(oError);
									}
									process_result = false;
								}
							});
						}
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId
						});

						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						break;
					default:
						break;
				}

				if(process_result) {
					if(fVal != "BACK") {
						MessageBox.alert(oController.getBundleText("MSG_02020"), {
							title: oController.getBundleText("LABEL_02093"),
							onClose : function() {
								oController._fRehireStatus = false;
								oController.setSub01();
								oController.setActionButton();
							}
						});
					}
					return true;
				} else {
					return false;
				}
			},
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub02 학력사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
		//  학력사항을 가지고 온다.
			reloadSub02 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oSub02Table = $.app.byId(oController.PAGEID + "_Sub02_TABLE");
				var oDatas = { Data : []};
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/RecruitingSubjectsEducationSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId)
					],
					success: function(oData) {	
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oDatas.Data.push(oData.results[i]);
							}
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				oController._Sub02TableJson.setData(oDatas);
				oSub02Table.setVisibleRowCount(oDatas.Data.length);
				oSub02Table.clearSelection();
				oController._vCntSub02 = oDatas.Data.length;
				
			},
			
		//  학력사항 입력화면 Setting.
			setSub02 : function(oContext) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oController = $.app.getController(SUB_APP_ID);
				var oBegda = $.app.byId(oController.PAGEID + "_Sub02_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub02_Endda");
				var oSlart = $.app.byId(oController.PAGEID + "_Sub02_Slart");
				var oSlabs = $.app.byId(oController.PAGEID + "_Sub02_Slabs");
				var oSland = $.app.byId(oController.PAGEID + "_Sub02_Sland");
				var oSchcd = $.app.byId(oController.PAGEID + "_Sub02_Schcd");
				var oZzcolnm = $.app.byId(oController.PAGEID + "_Sub02_Zzcolnm");
				var oZzfinyn = $.app.byId(oController.PAGEID + "_Sub02_Zzfinyn");
				
				// 값 초기화
				oBegda.setValue("");
				oBegda.removeAllCustomData();
				oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
				oEndda.setValue("");
				oSlart.setSelectedKey("0000");
				oSlabs.setSelectedKey("0000");
				oSland.setValue("");
				oSland.removeAllCustomData();
				oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : ""}));
				oSchcd.setValue("");
				oSchcd.removeAllCustomData();
				oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : ""}));
				oZzcolnm.setValue("");
				oZzfinyn.setSelected(false);
				oController.onClearFaartFields(oController);
				
				// 쓰기 초기화
				oBegda.setEnabled(!oController._DISABLED);
				oEndda.setEnabled(!oController._DISABLED);
				oSlart.setEnabled(!oController._DISABLED);
				oSlabs.setEnabled(!oController._DISABLED);
				oSland.setEnabled(!oController._DISABLED);
				oSchcd.setEnabled(!oController._DISABLED);
				oZzcolnm.setEnabled(!oController._DISABLED);
				oZzfinyn.setEnabled(!oController._DISABLED);
				
				if(oContext != null) {
					//Global 일자 관련하여 소스 수정함. 2015.10.19
					oBegda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext.Begda)))));
					//수정완료
					oBegda.removeAllCustomData();
					oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext.Seqnr}));
					
					//Global 일자 관련하여 소스 수정함. 2015.10.19
					oEndda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext.Endda)))));
					//수정완료
					oSlart.setSelectedKey(oContext.Slart);
					oController.setSLABS(oContext.Slabs);
					oSland.setValue(oContext.Landx);
					oSland.removeAllCustomData();
					oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : oContext.Sland}));
					oSchcd.setValue(oContext.Insti);
					oZzcolnm.setValue(oContext.Zzmajor);
					oZzfinyn.setSelected(oContext.Zzlmark == "X" ? true : false );
				}
			},
		
		//	학력사항 저장
			saveSub02 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oBegda = $.app.byId(oController.PAGEID + "_Sub02_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub02_Endda");
				var oSlart = $.app.byId(oController.PAGEID + "_Sub02_Slart");
				var oSlabs = $.app.byId(oController.PAGEID + "_Sub02_Slabs");
				var oSland = $.app.byId(oController.PAGEID + "_Sub02_Sland");
				var oSchcd = $.app.byId(oController.PAGEID + "_Sub02_Schcd");
				var oZzcolnm = $.app.byId(oController.PAGEID + "_Sub02_Zzcolnm");
				var oZzfinyn = $.app.byId(oController.PAGEID + "_Sub02_Zzfinyn");
		
				var vOneData = {
					Docno : oController._vDocno,
					Recno : oController._vRecno,
					VoltId : oController._vVoltId,
					Seqnr : oBegda.getCustomData()[0].getValue("Seqnr"),
					Begda : oBegda.getValue() == "" ? null : "/Date(" + Common.getTime(oBegda.getValue()) + ")/",
					Endda : oEndda.getValue() == "" ? null : "/Date(" + Common.getTime(oEndda.getValue()) + ")/",
					Slart : oSlart.getSelectedKey() == "0000" ? "" : oSlart.getSelectedKey(),
					Slabs : oSlabs.getSelectedKey() == "00" ? "" : oSlabs.getSelectedKey(),
					Sland : oSland.getCustomData()[0].getValue(),
					Insti : oSchcd.getValue() == "" ? null : oSchcd.getValue(),
					Zzlmark : oZzfinyn.getSelected() == true ? "X" : "" ,
					Zzmajor : oZzcolnm.getValue()		
				};
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsEducationSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsEducationSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub02();
							oController.onClose();
						}
					});
				}
			},
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub03 경력사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
		//  경력사항을 가지고 온다.
			reloadSub03 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_Sub03_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub03_COLUMNLIST");
				var oFilters = [];

				oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
				oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
			
				oTable.bindItems("/RecruitingSubjectsCareerSet", oColumnList, null, oFilters);
				
				oTable.attachUpdateFinished(function() {
					oController._vCntSub03 = oTable.getItems().length;
				});
			},
			
		//  경력사항 입력화면 Setting.
			setSub03 : function(oContext) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oController = $.app.getController(SUB_APP_ID);
				var oBegda = $.app.byId(oController.PAGEID + "_Sub03_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub03_Endda");
				var oLand1 = $.app.byId(oController.PAGEID + "_Sub03_Land1");
				var oArbgb = $.app.byId(oController.PAGEID + "_Sub03_Arbgb");
				var oZzjbttx = $.app.byId(oController.PAGEID + "_Sub03_Zzjbttx");
				var oZzstell = $.app.byId(oController.PAGEID + "_Sub03_Zzstell");
				
				// 값 초기화
				oBegda.setValue("");
				oBegda.removeAllCustomData();
				oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
				oEndda.setValue("");
				oLand1.setValue(oController._vDeafultContry.Land1tx);
				oLand1.removeAllCustomData();
				oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : oController._vDeafultContry.Land1}));
		//		oZzlndep.setValue("");
				oArbgb.setValue("");
				oZzjbttx.setValue("");
				oZzstell.setValue("");
				oZzstell.removeAllCustomData();
				oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : ""}));
		
				// 쓰기 초기화
				oBegda.setEnabled(!oController._DISABLED);
				oEndda.setEnabled(!oController._DISABLED);
				oLand1.setEnabled(!oController._DISABLED);
		//		oZzlndep.setEnabled(!oController._DISABLED);
				oArbgb.setEnabled(!oController._DISABLED);
				oZzjbttx.setEnabled(!oController._DISABLED);
				oZzstell.setEnabled(!oController._DISABLED);
				
				if(oContext != null) {
					//Global 일자 관련하여 소스 수정함. 2015.10.19
					oBegda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Begda"))))));
					oEndda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Endda"))))));
					//수정완료
					//oBegda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Begda"))));
					oBegda.removeAllCustomData();
					oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
					//oEndda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Endda"))));
					oLand1.setValue(oContext[0].getProperty("Landx"));
					oLand1.removeAllCustomData();
					oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : oContext[0].getProperty("Land1")}));
		//			oZzlndep.setValue(oContext[0].getProperty("Zzlndep"));
					oArbgb.setValue(oContext[0].getProperty("Arbgb"));
					oZzjbttx.setValue(oContext[0].getProperty("Zzjbttx"));
					oZzstell.setValue(oContext[0].getProperty("Stltx"));
					oZzstell.removeAllCustomData();
					var vStell = oContext[0].getProperty("Zzstell");
					if(vStell == "00000000") vStell = "";
					oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : vStell}));
				}
			},
		
		//	경력사항 저장
			saveSub03 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oBegda = $.app.byId(oController.PAGEID + "_Sub03_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub03_Endda");
				var oLand1 = $.app.byId(oController.PAGEID + "_Sub03_Land1");
				var oArbgb = $.app.byId(oController.PAGEID + "_Sub03_Arbgb");
				var oZzjbttx = $.app.byId(oController.PAGEID + "_Sub03_Zzjbttx");
				var oZzstell = $.app.byId(oController.PAGEID + "_Sub03_Zzstell");
				
				oBegda.setValueState(sap.ui.core.ValueState.None);
				oEndda.setValueState(sap.ui.core.ValueState.None);
				oLand1.setValueState(sap.ui.core.ValueState.None);
				oArbgb.setValueState(sap.ui.core.ValueState.None);
				oZzjbttx.setValueState(sap.ui.core.ValueState.None);
				oZzstell.setValueState(sap.ui.core.ValueState.None);
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Seqnr : oBegda.getCustomData()[0].getValue("Seqnr"),
						Begda : oBegda.getValue() == "" ? null : "/Date(" + Common.getTime(oBegda.getValue()) + ")/",
						Endda : oEndda.getValue() == "" ? null : "/Date(" + Common.getTime(oEndda.getValue()) + ")/",
						Land1 : oLand1.getCustomData()[0].getValue(),
		//				Zzlndep	: oZzlndep.getValue(),	
						Arbgb : oArbgb.getValue(),
						Zzjbttx	: oZzjbttx.getValue(),
				};
				
				var oArbgbCustomData = oArbgb.getCustomData();
				if(oArbgbCustomData && oArbgbCustomData.length) {
					vOneData.Zzarbgb = oArbgbCustomData[0].getValue();
				} else {
					vOneData.Zzarbgb = "";
				}
				
				var oStellCustomData = oZzstell.getCustomData();
				if(oStellCustomData && oStellCustomData.length) {
					vOneData.Zzstell = oStellCustomData[0].getValue();
				} else {
					vOneData.Zzstell = "";
				}
				
				var vMsg = "";
				//  입사일자(Begda)
				if(vOneData.Begda == null) {
					oBegda.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");							
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02072"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// 퇴사일자(Endda)
				if(vOneData.Endda == null) {
					oEndda.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");							
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02146"));
					MessageBox.alert(vMsg);
					return;
				}
				
				if(new Date(oBegda.getValue()) > new Date(oController._vActda)) {
					oBegda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02119"));
					return;
				}
				
				if(new Date(oEndda.getValue()) > new Date(oController._vActda)) {
					oEndda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02120"));
					return;
				}
				
				if(new Date(oBegda.getValue()) > new Date(oEndda.getValue())) {
					oBegda.setValueState(sap.ui.core.ValueState.Error);
					oEndda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02083"));
					return;
				}
				
				// 회사(Arbgb)
				if(vOneData.Arbgb == "") {
					oArbgb.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02118"));
					return;
				}
				
				// 국가(Land1)
				if(vOneData.Land1 == "") {
					oLand1.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02079"));
					return;
				}
				
				if(vOneData.Zzstell == "") {
					oZzstell.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02063");							
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02172"));
					MessageBox.alert(vMsg);
					return;
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsCareerSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsCareerSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub03();
							oController.onClose();
						}
					});
				}
			},
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub04 어학사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
		//  어학사항을 가지고 온다.
			reloadSub04 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_Sub04_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub04_COLUMNLIST");
				var oFilters = [];

				oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
				oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
			
				oTable.bindItems("/RecruitingSubjectsLanguageSet", oColumnList, null, oFilters);
				
				oTable.attachUpdateFinished(function() {
					oController._vCntSub04 = oTable.getItems().length;
				});
			},
			
		//  어학사항 입력화면 Setting.
			setSub04 : function(oContext) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oController = $.app.getController(SUB_APP_ID);
				var oQuali = $.app.byId(oController.PAGEID + "_Sub04_Quali");
				var oExmty = $.app.byId(oController.PAGEID + "_Sub04_Exmty");
				var oEamdt = $.app.byId(oController.PAGEID + "_Sub04_Eamdt");
				var oExmsc = $.app.byId(oController.PAGEID + "_Sub04_Exmsc");
				var oEamgr = $.app.byId(oController.PAGEID + "_Sub04_Eamgr");
				var oExmto = $.app.byId(oController.PAGEID + "_Sub04_Exmto");
				
				// 값 초기화
				oQuali.setSelectedKey("0000");
				oQuali.removeAllCustomData();
				oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
				oExmty.setSelectedKey("");
				oEamdt.setValue("");
				oExmsc.setValue("");
				oEamgr.setSelectedKey("0000");
				oExmto.setValue("");
				
				// 쓰기 초기화
				oQuali.setEnabled(!oController._DISABLED);
				oExmty.setEnabled(!oController._DISABLED);
				oEamdt.setEnabled(!oController._DISABLED);
				oExmsc.setEnabled(!oController._DISABLED);
				oEamgr.setEnabled(!oController._DISABLED);
				oExmto.setEnabled(!oController._DISABLED);
				
				if(oContext != null) {
					oQuali.setSelectedKey(oContext[0].getProperty("Quali"));
					oQuali.removeAllCustomData();
					oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
					oController.setEXMTY(oContext[0].getProperty("Exmty"));
					//Global 일자 관련하여 소스 수정함. 2015.10.19
					oEamdt.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Eamdt"))))));
					//수정완료
					oExmsc.setValue(oContext[0].getProperty("Exmsc").trim() == "0" ? "" : oContext[0].getProperty("Exmsc").trim());
					oController.setEAMGR(oContext[0].getProperty("Eamgr"));
		
					if(oContext[0].getProperty("Exmto") != null)
						//Global 일자 관련하여 소스 수정함. 2015.10.19
						oExmto.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Exmto"))))));
						//수정완료
				}
			},
		
		//	어학사항 저장
			saveSub04 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oQuali = $.app.byId(oController.PAGEID + "_Sub04_Quali");
				var oExmty = $.app.byId(oController.PAGEID + "_Sub04_Exmty");
				var oEamdt = $.app.byId(oController.PAGEID + "_Sub04_Eamdt");
				var oExmsc = $.app.byId(oController.PAGEID + "_Sub04_Exmsc");
				var oEamgr = $.app.byId(oController.PAGEID + "_Sub04_Eamgr");
				var oExmto = $.app.byId(oController.PAGEID + "_Sub04_Exmto");
				
				oQuali.removeStyleClass("L2PSelectInvalidBorder");
				oExmty.removeStyleClass("L2PSelectInvalidBorder");
				oEamdt.setValueState(sap.ui.core.ValueState.None);
				oExmsc.setValueState(sap.ui.core.ValueState.None);
				oEamgr.removeStyleClass("L2PSelectInvalidBorder");
				oExmto.setValueState(sap.ui.core.ValueState.None);
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Seqnr : oQuali.getCustomData()[0].getValue("Seqnr"),
						Quali : oQuali.getSelectedKey(),
						Exmty : oExmty.getSelectedKey() == "0000" ? "" : oExmty.getSelectedKey(),	
						Eamdt : oEamdt.getValue() == "" ? null : "/Date(" + Common.getTime(oEamdt.getValue()) + ")/",
						Exmsc : oExmsc.getValue() == "" || oExmsc.getValue() == "0" ? null : oExmsc.getValue(),
						Eamgr : oEamgr.getSelectedKey() == "0000" ? "" : oEamgr.getSelectedKey(),		
						Exmto : oExmto.getValue() == "" ? null : "/Date(" + Common.getTime(oExmto.getValue()) + ")/",
				};
				
				// 언어구분(Quali)
				if(vOneData.Quali == "") {
					oQuali.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02085"));
					return;
				}
				
				// 시험구분(Exmty)
				if(vOneData.Exmty == "") {
					oExmty.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02086"));
					return;
				}
				
				// 시험일(Eamdt)
				if(vOneData.Eamdt == null) {
					oEamdt.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02087"));
					return;
				}
				
				// 유효일자(oExmto)
				if(vOneData.Exmto == null) {
					oExmto.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02088"));
					return;
				}
				
				if(new Date(oEamdt.getValue()) > new Date(oExmto.getValue())) {
					oEamdt.setValueState(sap.ui.core.ValueState.Error);
					oExmto.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02121"));
					return;
				}
				
				// 점수(Exmsc)
				if(vOneData.Exmsc == null && vOneData.Eamgr == "") {
					oExmsc.setValueState(sap.ui.core.ValueState.Error);
					oEamgr.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02090"));
					return;
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsLanguageSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success:function () {
								process_result = true;
							},
							error:function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsLanguageSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub04();
							oController.onClose();
						}
					});
				}
			},
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub06 자격면허를 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
		//  자격면허를 가지고 온다.
			reloadSub06 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_Sub06_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub06_COLUMNLIST");
				var oFilters = [];

				oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
				oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
			
				oTable.bindItems("/RecruitingSubjectsCertificationSet", oColumnList, null, oFilters);
				
				oTable.attachUpdateFinished(function() {
					oController._vCntSub06 = oTable.getItems().length;
				});
			},
			
		//  자격면허 입력화면 Setting.
			setSub06 : function(oContext) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oController = $.app.getController(SUB_APP_ID);
				var oCttyp = $.app.byId(oController.PAGEID + "_Sub06_Cttyp");
				var oCerda = $.app.byId(oController.PAGEID + "_Sub06_Cerda");
				var oCtend = $.app.byId(oController.PAGEID + "_Sub06_Ctend");
				var oCtnum = $.app.byId(oController.PAGEID + "_Sub06_Ctnum");
				var oIsaut = $.app.byId(oController.PAGEID + "_Sub06_Isaut");
				
				// 값 초기화
				oCttyp.setValue("");
				oCttyp.removeAllCustomData();
				oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : ""}));
				oCerda.setValue("");
				oCerda.removeAllCustomData();
				oCerda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
				oCtend.setValue("");
				oCtnum.setValue("");
				oIsaut.setValue("");
				
				// 쓰기 초기화
				oCttyp.setEnabled(!oController._DISABLED);
				oCerda.setEnabled(!oController._DISABLED);
				oCtend.setEnabled(!oController._DISABLED);
				oCtnum.setEnabled(!oController._DISABLED);
				oIsaut.setEnabled(!oController._DISABLED);
				
				if(oContext != null) {
					oCttyp.setValue(oContext[0].getProperty("Cttyptx"));
					oCttyp.removeAllCustomData();
					oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : oContext[0].getProperty("Cttyp")}));
					//Global 일자 관련하여 소스 수정함. 2015.10.19
					oCerda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Ctbeg"))))));
					//수정완료
					//oCerda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Ctbeg"))));
					oCerda.removeAllCustomData();
					oCerda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
					if(oContext[0].getProperty("Ctend") != null)
						//Global 일자 관련하여 소스 수정함. 2015.10.19
						oCtend.setValue(dateFormat.format(new Date(Common.setTime(new Date(oContext[0].getProperty("Ctend"))))));
						//수정완료
						//oCtend.setValue(dateFormat.format(new Date(oContext[0].getProperty("Ctend"))));
					oCtnum.setValue(oContext[0].getProperty("Ctnum"));
					oIsaut.setValue(oContext[0].getProperty("Isaut"));
				}
			},
		
		//	자격면허 저장
			saveSub06 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oCttyp = $.app.byId(oController.PAGEID + "_Sub06_Cttyp");
				var oCerda = $.app.byId(oController.PAGEID + "_Sub06_Cerda");
				var oCtend = $.app.byId(oController.PAGEID + "_Sub06_Ctend");
				var oCtnum = $.app.byId(oController.PAGEID + "_Sub06_Ctnum");
				var oIsaut = $.app.byId(oController.PAGEID + "_Sub06_Isaut");
				
				oCttyp.setValueState(sap.ui.core.ValueState.None);
				oCerda.setValueState(sap.ui.core.ValueState.None);
				oCtend.setValueState(sap.ui.core.ValueState.None);
				oCtnum.setValueState(sap.ui.core.ValueState.None);
				oIsaut.setValueState(sap.ui.core.ValueState.None);
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Seqnr : oCerda.getCustomData()[0].getValue("Seqnr"),
						Cttyp : oCttyp.getCustomData().length ? oCttyp.getCustomData()[0].getValue("Cttyp") : "",
						Cttyptx : oCttyp.getValue(),
						Ctbeg : oCerda.getValue() == "" ? null : "/Date(" + Common.getTime(oCerda.getValue()) + ")/",
						Ctend : oCtend.getValue() == "" ? null : "/Date(" + Common.getTime(oCtend.getValue()) + ")/",
						Ctnum : oCtnum.getValue(),
						Isaut : oIsaut.getValue()
				};
				
				// 자격증유형(Cttyp)
				if(vOneData.Cttyp == "" && vOneData.Cttyptx == "") {
					oCttyp.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02122"));
					return;
				}
				
				// 취득일(Cerda)
				if(vOneData.Ctbeg == null) {
					oCerda.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oController.getBundleText("MSG_02064");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02049"));
					MessageBox.alert(vMsg);
					return;
				}
				
				if(vOneData.Ctend != null && new Date(oCerda.getValue()) > new Date(oCtend.getValue())){
					oCerda.setValueState(sap.ui.core.ValueState.Error);
					oCtend.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02094"));
					return;
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsCertificationSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsCertificationSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub06();
							oController.onClose();
						}
					});
				}
			},
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub07 병역사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////
		//  병역사항을 가지고 온다.
			readSub07 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oBegda = $.app.byId(oController.PAGEID + "_Sub07_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub07_Endda");
				var oSerty = $.app.byId(oController.PAGEID + "_Sub07_Serty");
				var oPreas = $.app.byId(oController.PAGEID + "_Sub07_Preas");
				var oJobcl = $.app.byId(oController.PAGEID + "_Sub07_Jobcl");
				var oMrank = $.app.byId(oController.PAGEID + "_Sub07_Mrank");
				
				// 화면 초기화
				oBegda.setValue("");
				oEndda.setValue("");
				oSerty.setSelectedKey("0000");
				oPreas.setSelectedKey("0000");
				oJobcl.setSelectedKey("0000");
				oMrank.setSelectedKey("0000");
				
				oBegda.setEnabled(!oController._DISABLED);
				oEndda.setEnabled(!oController._DISABLED);
				oSerty.setEnabled(!oController._DISABLED);
				oPreas.setEnabled(!oController._DISABLED);
				oJobcl.setEnabled(!oController._DISABLED);
				oMrank.setEnabled(!oController._DISABLED);

				var sPath = oModel.createKey("RecruitingSubjectsMilitaryServiceSet", {
					Docno: oController._vDocno,
					VoltId: oController._vVoltId
				});
				
				oModel.read(sPath, {
					async: false,
					success: function(oData) {	
						if(oData) {
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							if(oData.Begda != null)	oBegda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oData.Begda)))));
							if(oData.Endda != null) oEndda.setValue(dateFormat.format(new Date(Common.setTime(new Date(oData.Endda)))));
							//수정완료
							oSerty.setSelectedKey(oData.Serty);
							oPreas.setSelectedKey(oData.Preas);
							oJobcl.setSelectedKey(oData.Jobcl);
							oMrank.setSelectedKey(oData.Mrank);
							
							if(oData.Begda == null) oController._vCntSub07 = 0;
							else oController._vCntSub07 = 1;
							oController.setActionButton();
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
		
		//  병역사항을 저장 한다.	
			saveSub07 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oBegda = $.app.byId(oController.PAGEID + "_Sub07_Begda");
				var oEndda = $.app.byId(oController.PAGEID + "_Sub07_Endda");
				var oSerty = $.app.byId(oController.PAGEID + "_Sub07_Serty");
				var oPreas = $.app.byId(oController.PAGEID + "_Sub07_Preas");
				var oJobcl = $.app.byId(oController.PAGEID + "_Sub07_Jobcl");
				var oMrank = $.app.byId(oController.PAGEID + "_Sub07_Mrank");
				
				oBegda.setValueState(sap.ui.core.ValueState.None);
				oEndda.setValueState(sap.ui.core.ValueState.None);
				oSerty.removeStyleClass("L2PSelectInvalidBorder");
				oPreas.removeStyleClass("L2PSelectInvalidBorder");
				oJobcl.removeStyleClass("L2PSelectInvalidBorder");
				oMrank.removeStyleClass("L2PSelectInvalidBorder");
		
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Begda : oBegda.getValue() == "" ? null : "/Date(" + Common.getTime(oBegda.getValue()) + ")/",
						Endda : oEndda.getValue() == "" ? null : "/Date(" + Common.getTime(oEndda.getValue()) + ")/",
						Serty : oSerty.getSelectedKey() == "0000" ? "" : oSerty.getSelectedKey(),
						Preas : oPreas.getSelectedKey() == "0000" ? "" : oPreas.getSelectedKey(),	
						Jobcl : oJobcl.getSelectedKey() == "0000" ? "" : oJobcl.getSelectedKey(),
						Mrank : oMrank.getSelectedKey() == "0000" ? "" : oMrank.getSelectedKey()
				};
				
				// 입대일자(Begda)
				if(vOneData.Begda == null) {
					oBegda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02095"));
					return;
				}
		
				// 전역일자(Endda)
				if(vOneData.Endda == null) {
					oEndda.setValueState(sap.ui.core.ValueState.Error);
					MessageBox.alert(oController.getBundleText("MSG_02096"));
					return;
				}
				
				// 병역유형(Serty)
				if(vOneData.Serty == "") {
					oSerty.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02097"));
					return;
				}
				
				// 전역사유(Preas)
				if(vOneData.Preas == "") {
					oPreas.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02098"));
					return;
				}
				
				// 보직분류(Jobcl)
				if(vOneData.Jobcl == "") {
					oJobcl.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02099"));
					return;
				}
				
				// 계급(Mrank)
				if(vOneData.Mrank == "") {
					oMrank.addStyleClass("L2PSelectInvalidBorder");
					MessageBox.alert(oController.getBundleText("MSG_02100"));
					return;
				}
				
				var process_result = false;
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").create("/RecruitingSubjectsMilitaryServiceSet", vOneData, {
					success: function () {
						process_result = true;
					},
					error: function (oError) {
						var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								Common.showErrorMessage(Err.error.message.value);
							}
							
						} else {
							Common.showErrorMessage(oError);
						}
						process_result = false;
					}
				});
		
				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.readSub07();
						}
					});
				}
			},
			
			deleteSub07 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._vCntSub07 == 0) {
					MessageBox.alert(oController.getBundleText("MSG_02101"));
					return;
				}
				
				var onProcessDelete = function(fVal) {
					if(fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = oModel.createKey("/RecruitingSubjectsMilitaryServiceSet", {
							Docno: oController._vDocno,
							VoltId: oController._vVoltId
						});

						oModel.remove(sPath, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						if(process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController.readSub07();
									oController.onClose();
								}
							});
						}
					}
				};
				
				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title : oController.getBundleText("LABEL_02093"),
					onClose : onProcessDelete
				});
			
			},
		/////////////////////////////////////////////////////////////////////////////////////////////	
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub24 은행사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
			//  은행사항을 가지고 온다.
			reloadSub24 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_Sub24_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub24_COLUMNLIST");
				
				var oFilters = [];	
				oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
				oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
			
				oTable.bindItems("/RecruitingSubjectsBankSet", oColumnList, null, oFilters);
				
				oTable.attachUpdateFinished(function() {
					oController._vCntSub24 = oTable.getItems().length;
				});
			},
			
		//  Banking 사항 입력화면 Setting.
			setSub24 : function(oContext) {
				var oController = $.app.getController(SUB_APP_ID);
				var vMolga = "";

				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var oEmftx = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Emftx");
				var oBkplz = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkplz");
				var oBkort = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkort");
				var oBanks = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
				var oBankl = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankl");
				var oBankn = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankn");
				var oBkont = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkont");
				var oZlsch = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
				var oWaers = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Waers");
				var oPskto = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Pskto");		
				var oBetrg = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Betrg");
				var oAnzhl = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Anzhl");
				
				var vInitBanks = "";
				var vInitBankstx = "";
				var vInitWaers = "";
				var vInitZlsch = "0000";
				
				if(oController._vBankDefaultValue) {
					vInitBanks = oController._vBankDefaultValue.Banks;
					vInitBankstx = oController._vBankDefaultValue.Bankstx;
					vInitWaers = oController._vBankDefaultValue.Waers;
					vInitZlsch = oController._vBankDefaultValue.Zlsch;
				}
				
				var oNameLayoutText = $.app.byId(oController.PAGEID + "_NameLayoutText");
				
				// 값 초기화
				oEmftx.setValue(oNameLayoutText.getText());
				oEmftx.removeAllCustomData();
				oEmftx.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
				
				if(oBkplz) oBkplz.setValue("");
				if(oBkort) oBkort.setValue("");
				if(oPskto) oPskto.setValue("");
				
				oBanks.setValue(vInitBankstx);
				oBanks.removeAllCustomData();
				oBanks.addCustomData(new sap.ui.core.CustomData({key : "Banks", value : vInitBanks}));
				oBankl.setValue("");
				oBankl.removeAllCustomData();
				oBankl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : ""}));
				
				oBankn.setValue("");
				
				if(oBkont) oController.setBkont("0000", oBkont);
				
				oController.setZlsch(vInitBanks, vInitZlsch);
				
				oWaers.setValue(vInitWaers);
				oWaers.removeAllCustomData();
				oWaers.addCustomData(new sap.ui.core.CustomData({key : "Waers", value : vInitWaers}));
				
				if(oBetrg) oBetrg.setValue("");		
				if(oAnzhl) oAnzhl.setValue("");
				
				// 쓰기 초기화
				oEmftx.setEnabled(!oController._DISABLED);
				if(oBkplz) oBkplz.setEnabled(!oController._DISABLED);
				if(oBkort) oBkort.setEnabled(!oController._DISABLED);
				oBanks.setEnabled(!oController._DISABLED);
				oBankl.setEnabled(!oController._DISABLED);
				oBankn.setEnabled(!oController._DISABLED);
				if(oBkont) oBkont.setEnabled(!oController._DISABLED);
				oZlsch.setEnabled(!oController._DISABLED);
				if(oPskto) oPskto.setEnabled(!oController._DISABLED);
				if(oBetrg) oBetrg.setEnabled(!oController._DISABLED);
				if(oAnzhl) oAnzhl.setEnabled(!oController._DISABLED);
				
				var oAddInfo = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_AddInfo");
				
				var vOtherBankLabel = "Other Bank Information";
				if(oController._vMolga == "08" || oController._vMolga == "AE") {
					vOtherBankLabel = "Travel Expenses Information";
				} 
				
				var oPanelLabel = $.app.byId(oController.PAGEID + "_POP_Sub24_" + vMolga + "_PanelLabel");
				
				if(oContext != null) {
					oEmftx.setValue(oContext[0].getProperty("Emftx"));
					oEmftx.removeAllCustomData();
					oEmftx.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
					
					if(oBkplz) oBkplz.setValue(oContext[0].getProperty("Bkplz"));
					if(oBkort) oBkort.setValue(oContext[0].getProperty("Bkort"));
					
					if(oPskto) oPskto.setValue(oContext[0].getProperty("Pskto"));
					
					oBanks.setValue(oContext[0].getProperty("Bankstx"));
					oBanks.removeAllCustomData();
					oBanks.addCustomData(new sap.ui.core.CustomData({key : "Banks", value : oContext[0].getProperty("Banks")}));
					oBankl.setValue(oContext[0].getProperty("Bankltx"));
					oBankl.removeAllCustomData();
					oBankl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : oContext[0].getProperty("Bankl")}));
					
					oBankn.setValue(oContext[0].getProperty("Bankn"));
					
					if(oBkont) oController.setBkont(oContext[0].getProperty("Bkont"), oBkont);
					
					oController.setZlsch(oContext[0].getProperty("Banks"), oContext[0].getProperty("Zlsch"));
					
					oWaers.setValue(oContext[0].getProperty("Waers"));
					oWaers.removeAllCustomData();
					oWaers.addCustomData(new sap.ui.core.CustomData({key : "Waers", value : oContext[0].getProperty("Waers")}));
					
					if(oBetrg) oBetrg.setValue(oContext[0].getProperty("Betrg"));
					if(oAnzhl) oAnzhl.setValue(oContext[0].getProperty("Anzhl"));
					
					if(oContext[0].getProperty("Bnksa") == "1") {
						if(oAddInfo) oAddInfo.removeStyleClass("L2PDisplayNone");
						oPanelLabel.setText(vOtherBankLabel);
					} else {
						if(oAddInfo) oAddInfo.addStyleClass("L2PDisplayNone");
						oPanelLabel.setText("Main Bank Information");
					}
				} else {
					if(oController._vCntSub24 == 0) {
						if(oAddInfo) oAddInfo.addStyleClass("L2PDisplayNone");
						oPanelLabel.setText("Main Bank Information");
					} else {
						if(oAddInfo) oAddInfo.removeStyleClass("L2PDisplayNone");
						oPanelLabel.setText(vOtherBankLabel);
					}
				}	
			},
			
		//	Banking 사항 저장
			saveSub24 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var vMolga = "";

				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var oEmftx = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Emftx");
				var oBkplz = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkplz");
				var oBkort = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkort");
				var oBanks = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
				var oBankl = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankl");
				var oBankn = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankn");
				var oBkont = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkont");
				var oZlsch = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
				var oWaers = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Waers");
				var oPskto = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Pskto");	
				var oBetrg = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Betrg");
				var oAnzhl = $.app.byId(oController.PAGEID + "_Sub24_" + vMolga + "_Anzhl");
				
				var lBankl = $.app.byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankl");
				var lBankn = $.app.byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankn");
				
				// var oAddInfo = $.app.byId(oController.PAGEID + "_Sub24_AddInfo");
				
				oEmftx.setValueState(sap.ui.core.ValueState.None);
				if(oBkplz) oBkplz.setValueState(sap.ui.core.ValueState.None);
				if(oBkort) oBkort.setValueState(sap.ui.core.ValueState.None);
				oBanks.setValueState(sap.ui.core.ValueState.None);
				oBankl.setValueState(sap.ui.core.ValueState.None);
				oBankn.setValueState(sap.ui.core.ValueState.None);
				if(oBkont) oBkont.removeStyleClass("L2PSelectInvalidBorder");
				oZlsch.removeStyleClass("L2PSelectInvalidBorder");
				oWaers.setValueState(sap.ui.core.ValueState.None);
				if(oPskto) oPskto.setValueState(sap.ui.core.ValueState.None);
				if(oBetrg) oBetrg.setValueState(sap.ui.core.ValueState.None);
				if(oAnzhl) oAnzhl.setValueState(sap.ui.core.ValueState.None);
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Seqnr : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Seqnr") : "",
						Bnksa : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Bnksa") : "",
						Emftx : oEmftx.getValue(),
						Banks : oBanks.getCustomData().length ? oBanks.getCustomData()[0].getValue() : "",
						Bankl : oBankl.getCustomData().length ? oBankl.getCustomData()[0].getValue() : "",
						Bankn : oBankn.getValue(),
						Zlsch : oZlsch.getSelectedKey() == "0000" ? "" : oZlsch.getSelectedKey(),
						Waers : oWaers.getValue(),		
				};
				
				if(oBkplz) vOneData.Bkplz = oBkplz.getValue();
				if(oBkort) vOneData.Bkort = oBkort.getValue();
				if(oPskto) vOneData.Pskto = oPskto.getValue();
				if(oBkont) vOneData.Bkont = oBkont.getSelectedKey() == "0000" ? "" : oBkont.getSelectedKey();
				
				if(oBetrg) vOneData.Betrg = oBetrg.getValue() == "" ? "0" : oBetrg.getValue();
				if(oAnzhl) vOneData.Anzhl = oAnzhl.getValue() == "" ? "0" : oAnzhl.getValue();
				
				var vMsg = "";
				// 예금주
				if(vOneData.Emftx == "") {
					oEmftx.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02290"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// Bnak Key
				if(lBankl.getRequired() == true && vOneData.Bankl == "") {
					oBankl.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02291"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// 계좌번호
				if(lBankn.getRequired() == true && vOneData.Bankn == "") {
					oBankn.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02292"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// Bank Control Key
				if(oController._vMolga != "08" && oController._vMolga != "AE") {
					if(vOneData.Bkont == "") {
						oBkont.addStyleClass("L2PSelectInvalidBorder");
						vMsg = oController.getBundleText("MSG_02063");
						vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02293"));
						MessageBox.alert(vMsg);
						return;
					}
				}
				
				// 지급 통화
				if(vOneData.Waers == "") {
					oWaers.setValueState(sap.ui.core.ValueState.Error);
					vMsg = oController.getBundleText("MSG_02064");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02294"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// 표준값
				if(oController._vCntSub24 > 0) {
					if(vOneData.Bnksa != "0") {
						if(oController._vMolga != "08" && oController._vMolga != "AE") {
							if((parseFloat(vOneData.Betrg) != 0.0 && parseFloat(vOneData.Anzhl) != 0.0) || (parseFloat(vOneData.Betrg) == 0.0 && parseFloat(vOneData.Anzhl) == 0.0)) {
								oBetrg.setValueState(sap.ui.core.ValueState.Error);
								MessageBox.alert(oController.getBundleText("MSG_02123"));
								return;
							}
						}
					}
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsBankSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsBankSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub24();
							oController.onClose();
						}
					});
				}
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub22 어학능력 사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////		
		//  어학능력사항을 가지고 온다.
			reloadSub22 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oTable = $.app.byId(oController.PAGEID + "_Sub22_TABLE");
				var oColumnList = $.app.byId(oController.PAGEID + "_Sub22_COLUMNLIST");
				var oFilters = [];

				oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
				oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
			
				oTable.bindItems("/RecruitingSubjectsLangSkillSet", oColumnList, null, oFilters);
				
				oTable.attachUpdateFinished(function() {
					oController._vCntSub22 = oTable.getItems().length;
				});
			},	
			
		//  어학능력 사항 입력화면 Setting.
			setSub22 : function(oContext) {
				var oController = $.app.getController(SUB_APP_ID);
				var oQuali = $.app.byId(oController.PAGEID + "_Sub22_Quali");
				var oAuspr = $.app.byId(oController.PAGEID + "_Sub22_Auspr");
				
				// 값 초기화
				oQuali.setSelectedKey("0000");
				oAuspr.setSelectedKey("0000");
		
				// 쓰기 초기화
				oQuali.setEnabled(!oController._DISABLED);
				oAuspr.setEnabled(!oController._DISABLED);
				
				if(oContext != null) {
					oQuali.setSelectedKey(oContext[0].getProperty("Quali"));
					
					oAuspr.setSelectedKey(oContext[0].getProperty("Auspr"));
				}
			},
			
		//	어학능력 사항 저장
			saveSub22 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oQuali = $.app.byId(oController.PAGEID + "_Sub22_Quali");
				var oAuspr = $.app.byId(oController.PAGEID + "_Sub22_Auspr");
				
				oQuali.removeStyleClass("L2PSelectInvalidBorder");
				oAuspr.removeStyleClass("L2PSelectInvalidBorder");
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Seqnr : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Seqnr") : "",
						Quali : oQuali.getSelectedKey() == "0000" ? "" : oQuali.getSelectedKey(),
						Auspr : oAuspr.getSelectedKey() == "0000" ? "" : oAuspr.getSelectedKey(),
				};

				var vMsg = "";
				
				// 언어
				if(vOneData.Quali == "") {
					oQuali.addStyleClass("L2PSelectInvalidBorder");
					vMsg = oController.getBundleText("MSG_02063");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02262"));
					MessageBox.alert(vMsg);
					return;
				}
				
				// 숙련도
				if(vOneData.Auspr == "") {
					oAuspr.addStyleClass("L2PSelectInvalidBorder");
					vMsg = oController.getBundleText("MSG_02063");
					vMsg = vMsg.replace("&Cntl", oController.getBundleText("LABEL_02295"));
					MessageBox.alert(vMsg);
					return;
				}
				
				var process_result = false;
				var sPath = "/RecruitingSubjectsLangSkillSet";
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				switch(oController.subAction) {
					case "C" :
						oModel.create(sPath, vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					case "M" :
						sPath = oModel.createKey("/RecruitingSubjectsLangSkillSet", {
							Docno: vOneData.Docno,
							VoltId: vOneData.VoltId,
							Seqnr: vOneData.Seqnr
						});
		
						oModel.update(sPath, vOneData, {
							success:function () {
								process_result = true;
							},
							error:function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						break;
					default:
						break;
				}

				if(process_result) {
					MessageBox.alert(oController.getBundleText("MSG_02020"), {
						title: oController.getBundleText("LABEL_02093"),
						onClose : function() {
							oController.reloadSub24();
							oController.onClose();
						}
					});
				}
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub21 주소 정보 사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////
		//  주소정보사항을 가지고 온다.
			readSub21 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oAddressLayout = $.app.byId(oController.PAGEID + "_Sub21_LAYOUT");
				
				oAddressLayout.destroyContent();
				
				if(oController._vAnssaList.length < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02124"));
					return;
				}
				
				if(oController._vAddressLayout.length < 1) {
					MessageBox.alert(oController.getBundleText("MSG_02125"));
					return;
				}
				
				oController._vSavedAddressList = [];
				oController._vEmecAddressList = [];
				oController._vAddressList = [];

				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/RecruitingSubjectsAddressSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId)
					],
					success: function(oData) {	
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								if(oData.results[i].Anssa == "4") {
									oController._vEmecAddressList.push(oData.results[i]);
								} else {
									oController._vSavedAddressList.push(oData.results[i]);
								}
								oController._vAddressList.push(oData.results[i]);
							}
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				oController._vCntSub21 = oController._vAddressList.length;
				
				if(oController._vEmecAddressList.length < 1) {
					oController._vEmecAddressListCount = 1;
				} else {
					oController._vEmecAddressListCount = oController._vEmecAddressList.length;
				}
				
				for(var i=0; i<oController._vAnssaList.length; i++) {
					if(oController._vAnssaList[i].Ecode != "1") {
						oController.makeAddressPanel(oController, oController._vAnssaList[i], oAddressLayout);
					}
				}
			},
			
			makeAddressPanel : function(oController, AnssaInfo, oAddressLayout) {
				// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				
				var oCell = null, oRow = null;
				
				var vSubty = AnssaInfo.Ecode;
				
				var vPrefix = vSubty;
				
				if(vSubty == "4") {
					vPrefix = vSubty + "_1";
				}
				
				var vSavedData = null;
				if(vSubty != 4) {
					for(var i=0; i<oController._vSavedAddressList.length; i++) {
						if(vSubty == oController._vSavedAddressList[i].Anssa) {
							vSavedData = oController._vSavedAddressList[i];
							break;
						}
					}
				} else {
					if(oController._vEmecAddressList.length > 0) {
						vSavedData = oController._vEmecAddressList[0];
					}
				}		
				
				var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout({
					width : "100%",
					layoutFixed : false,
					columns : 4,
					widths: ["15%","35%","15%","35%"],
				});
				
				var idx = 0;
				
				for(var j=0; j<oController._vAddressLayout.length; j++) {
					
					if((idx % 2) == 0) {
						if(idx != 0) {
							oOneAddressLayout.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"});
					}
					
					if(vSubty == oController._vAddressLayout[j].Subty) {
						var Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[j].Fieldname),
							TextFieldname = Fieldname + "_Tx",
							Fieldtype = oController._vAddressLayout[j].Inpty;
						
						if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
							continue;
						}
						
						var vUpdateValue = "";
						var vUpdateTextValue = "";
						var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
						
						if(vSavedData != null) {
							vUpdateValue = vSavedData[Fieldname];
							vUpdateTextValue = vSavedData[TextFieldname];
							
							if(vSavedData.Land1 == "") {
								vSavedData.Land1 = oController._vDeafultContry.Land1;
								vSavedData.Land1tx = oController._vDeafultContry.Land1tx;
							}
						}
						
						if(vUpdateValue == "") {
							if(Fieldname == "Land1") {
								vUpdateValue = oController._vDeafultContry.Land1;
								vUpdateTextValue = oController._vDeafultContry.Land1tx;
							}
							if(Fieldname == "Natio") {
								vUpdateValue = oController._vDeafultContry.Land1;
								vUpdateTextValue = oController._vDeafultContry.Natiotx;
							}
						}
						
						var vLabelText = oController._vAddressLayout[j].Label;
						
						var oLabel = new sap.m.Label({text : vLabelText});
						if(Fieldtype.substring(0, 1) == "M") {
							oLabel.setRequired(true);
						} else {
							oLabel.setRequired(false);
						}
						oLabel.addStyleClass("L2PFontFamily");
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : [oLabel]
						}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
						oRow.addCell(oCell);
						
						var oControl = null;
						if((oController._vMolga == "10" || oController._vMolga == "07" ) && Fieldname == "Telnr") {
							oControl= oController.makeAddressTelnr10(oController, vPrefix, vSavedData);
						} else {
							oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vSavedData, vPrefix);
						}
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : oControl
						}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
						oRow.addCell(oCell);
						
						idx++;
					}
					oOneAddressLayout.addRow(oRow);
				}
				
				if(idx > 0) {
					var oPanel = null;
					if(vSubty != "4") {
						oPanel = new sap.m.Panel(oController.PAGEID + "_Sub21_" + vSubty + "_Panel", {
							expandable : false,
							expanded : false,
							headerToolbar : new sap.m.Toolbar({
								design : sap.m.ToolbarDesign.Auto,
								content : [new sap.m.Label({text : AnssaInfo.Etext, design : "Bold"}).addStyleClass("L2PFontFamily"),
										new sap.m.ToolbarSpacer({width:"20px"}),
										new sap.m.Button({
											icon : "sap-icon://delete", 
											type:"Default", 
											customData : {key : "Subty", value: vSubty},
											press : oController.onEmptyAddressData})
								]
							}).addStyleClass("L2PToolbarNoBottomLine"),
						});
					} else {
						oPanel = new sap.m.Panel(oController.PAGEID + "_Sub21_" + vSubty + "_Panel", {
							expandable : false,
							expanded : false,
							headerToolbar : new sap.m.Toolbar({
								design : sap.m.ToolbarDesign.Auto,
								content : [new sap.m.Label({text : AnssaInfo.Etext, design : "Bold"}).addStyleClass("L2PFontFamily"),
										new sap.m.ToolbarSpacer({width:"20px"}),
										new sap.m.Button({icon : "sap-icon://add", type:"Default", press : oController.onAddEmecAddress}),
										new sap.m.Button({icon : "sap-icon://less", type:"Default", press : oController.onDeleteEmecAddress}),
										new sap.m.Button({
											icon : "sap-icon://delete", 
											type:"Default", 
											customData : {key : "Subty", value: vSubty},
											press : oController.onEmptyAddressData})
								]
							}).addStyleClass("L2PToolbarNoBottomLine"),
						});
					}			
					
					oPanel.addContent(oOneAddressLayout);
					
					if(vSubty == "4" && oController._vEmecAddressList.length > 1) {
						for(var e=1; e<oController._vEmecAddressList.length; e++) {
							var oOneEmecAddressLayout = oController.makeEmecAddressLayout(oController, (e+1), oController._vEmecAddressList[e]);
							if(oOneEmecAddressLayout) {
								oPanel.addContent(oOneEmecAddressLayout);
							}
						}				
					}
					
					oAddressLayout.addContent(oPanel);
				}
			},
			
			makeEmecAddressLayout : function(oController, e_idx, vEmecAddressList) {
				var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Sub21_4_" + e_idx + "_AddressLayout", {
					width : "100%",
					layoutFixed : false,
					columns : 4,
					widths: ["15%","35%","15%","35%"],
				}).addStyleClass("L2PMarginTop10");
				
				var idx = 0;
				
				var vSubty = "4";
				
				var oRow = null, oCell = null;
				
				for(var i=0; i<oController._vAddressLayout.length; i++) {
					
					if((idx % 2) == 0) {
						if(idx != 0) {
							oOneAddressLayout.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"});
					}
					
					if(vSubty == oController._vAddressLayout[i].Subty) {
						var Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[i].Fieldname),
							TextFieldname = Fieldname + "_Tx",
							Fieldtype = oController._vAddressLayout[i].Inpty;
						
						if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
							continue;
						}
						
						var vUpdateValue = "";
						var vUpdateTextValue = "";
						var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
						
						if(vEmecAddressList != null) {
							vUpdateValue = vEmecAddressList[Fieldname];
							vUpdateTextValue = vEmecAddressList[TextFieldname];
							
							if(vEmecAddressList.Land1 == "") vEmecAddressList.Land1 = oController._vDeafultContry.Land1;
						}
						
						if(vUpdateValue == "" && vUpdateTextValue == "") {
							if(Fieldname == "Natio" || Fieldname == "Land1") {
								vUpdateValue = oController._vDeafultContry.Land1;
								vUpdateTextValue = oController._vDeafultContry.Land1tx;
							}
						}
						
						var vLabelText = oController._vAddressLayout[i].Label;
						
						var oLabel = new sap.m.Label({text : oController._vAddressLayout[i].Label});
						if(Fieldtype.substring(0, 1) == "M") {
							oLabel.setRequired(true);
						} else {
							oLabel.setRequired(false);
						}
						oLabel.addStyleClass("L2PFontFamily");
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : [oLabel]
						}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
						oRow.addCell(oCell);
						
						var oControl = null;
						if(oController._vMolga == "10" && Fieldname == "Telnr") {
							oControl = oController.makeAddressTelnr10(oController, vSubty + "_" + e_idx, vEmecAddressList);
						} else {
							oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vEmecAddressList, vSubty + "_" + e_idx);
						}
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : oControl
						}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
						oRow.addCell(oCell);
						
						idx++;
					}
					oOneAddressLayout.addRow(oRow);
				}
				
				return oOneAddressLayout;
			},
			
			onAddEmecAddress : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oEmecAddressPanel = $.app.byId(oController.PAGEID + "_Sub21_4_Panel");
				
				oController._vEmecAddressListCount++;
				
				var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Sub21_4_" + oController._vEmecAddressListCount + "_AddressLayout", {
					width : "100%",
					layoutFixed : false,
					columns : 4,
					widths: ["15%","35%","15%","35%"],
				}).addStyleClass("L2PMarginTop10");
				
				var idx = 0;
				
				var vSubty = "4";
				
				var oRow = null, oCell = null;
				
				for(var i=0; i<oController._vAddressLayout.length; i++) {
					
					if((idx % 2) == 0) {
						if(idx != 0) {
							oOneAddressLayout.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"});
					}
					
					if(vSubty == oController._vAddressLayout[i].Subty) {
						var Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[i].Fieldname);
						
						if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
							continue;
						}
						
						var Fieldtype = oController._vAddressLayout[i].Inpty;
						
						var vUpdateValue = "";
						var vUpdateTextValue = "";
						var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
						
						if(vUpdateValue == "" && vUpdateTextValue == "") {
							if(Fieldname == "Natio" || Fieldname == "Land1") {
								vUpdateValue = oController._vDeafultContry.Land1;
								vUpdateTextValue = oController._vDeafultContry.Land1tx;
							}
						}
						
						var vLabelText = oController._vAddressLayout[i].Label;
						
						var oLabel = new sap.m.Label({text : vLabelText});
						if(Fieldtype.substring(0, 1) == "M") {
							oLabel.setRequired(true);
						} else {
							oLabel.setRequired(false);
						}
						oLabel.addStyleClass("L2PFontFamily");
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : [oLabel]
						}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
						oRow.addCell(oCell);
						
						var oControl = null;
						if((oController._vMolga == "10" || oController._vMolga == "07" ) && Fieldname == "Telnr") {
							oControl = oController.makeAddressTelnr10(oController, vSubty + "_" + oController._vEmecAddressListCount, null);
						} else {
							oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, null, vSubty + "_" + oController._vEmecAddressListCount);
						}
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : oControl
						}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
						oRow.addCell(oCell);
						
						idx++;
					}
					oOneAddressLayout.addRow(oRow);
				}
		
				oEmecAddressPanel.addContent(oOneAddressLayout);
			},
			
			onDeleteEmecAddress : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._vEmecAddressListCount < 2) {
					MessageBox.alert(oController.getBundleText("MSG_02126"));
					return;
				}
				
				var oEmecAddressLayout = $.app.byId(oController.PAGEID + "_Sub21_4_" + oController._vEmecAddressListCount + "_AddressLayout");
				oEmecAddressLayout.destroyRows();
				oEmecAddressLayout.destroy();
				
				oController._vEmecAddressListCount--;
			},
			
			saveSub21 : function(fVal) {
				var oController = $.app.getController(SUB_APP_ID);
				var createDatas = [];
				
				for(var i=0; i<oController._vAnssaList.length; i++) {
					var vCheckCount = 0;
					for(var j=0; j<oController._vAddressLayout.length; j++) {
						if(oController._vAnssaList[i].Ecode == oController._vAddressLayout[j].Subty) {
							vCheckCount++;
						}
					}
					if(vCheckCount > 0) {
						var vOneCreateData = oController.validAddressData(oController, oController._vAnssaList[i]);
						if(vOneCreateData == null) {
							return false;
						} else {
							for(var d=0; d<vOneCreateData.length; d++) {
								createDatas.push(vOneCreateData[d]);
							}
						}
					}						
				}
				
				var dataSaveProcess = function() {
					var process_result = false;
					
					for(var d=0; d<createDatas.length; d++) {
						var vOneData = createDatas[d];
						vOneData.Seqnr = (d+1) + "";
						
						$.app.getModel("ZHR_ACTIONAPP_SRV").create("/RecruitingSubjectsAddressSet", vOneData, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});
						
						if(process_result == false) {
							break;
						}
					}
					
					BusyIndicator.hide();
					
					if(process_result) {
						if(fVal != "BACK") {
							MessageBox.alert(oController.getBundleText("MSG_02020"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController.readSub21();
									oController._vCntSub21 = createDatas.length;
									oController.setActionButton();
								}
							});
						}
						return true;
					} else {
						return false;
					}
					
				};
				
				BusyIndicator.show(0);

				setTimeout(dataSaveProcess, 300); 
			},
			
			validAddressData : function(oController, AnssaInfo) {
				var vSubty = AnssaInfo.Ecode;
				
				var vResultDatas = [];		
				var vResultOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Anssa : vSubty
				};
				
				var fInputData = false;
				var Fieldname = "";
				var Fieldtype = "";
				var vVal = "";
				var vVal1 = "";
				var vCVal = "";
				var vMsg = "";
				var oControl = null;
				var oCustomData = null;
				
				if(vSubty != "4") {
					for(var i=0; i<oController._vAddressLayout.length; i++) { 
						if(vSubty == oController._vAddressLayout[i].Subty) {
							Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[i].Fieldname);
							Fieldtype = oController._vAddressLayout[i].Inpty;
							
							oControl = $.app.byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
							if(!oControl) continue;
							
							vVal = "";
							
							if(Fieldtype == "M1" || Fieldtype == "O1") {
								oControl.removeStyleClass("L2PSelectInvalidBorder");
								vVal = oControl.getSelectedKey();
								if(vVal != "" && vVal != "0000") {
									fInputData = true;
								} else {
									vVal = "";
								}
								vResultOneData[Fieldname] = vVal;
							} else if(Fieldtype == "M3"|| Fieldtype == "O3") {						
								oControl.setValueState(sap.ui.core.ValueState.None);
								vVal = oControl.getValue();
								if(vVal != "") {
									fInputData = true;
								}
								vResultOneData[Fieldname] = vVal;
							} else if(Fieldtype == "M4" || Fieldtype == "O4") {
								oControl.setValueState(sap.ui.core.ValueState.None);
								vVal = oControl.getValue();
								if(vVal != "") {
									fInputData = true;
									vVal1 = "/Date(" + Common.getTime(vVal) + ")/";
									vResultOneData[Fieldname] = vVal1;
								} else {
									vResultOneData[Fieldname] = null;
								}
							} else if(Fieldtype == "M5" || Fieldtype == "O5") {
								oControl.setValueState(sap.ui.core.ValueState.None);
								vVal = oControl.getValue();
								oCustomData = oControl.getCustomData();
								vCVal = "";
								if(oCustomData && oCustomData.length) {
									for(var c=0; c<oCustomData.length; c++) {
										if(oCustomData[c].getKey() == Fieldname) {
											vCVal = oCustomData[c].getValue();
										}
									}
								}
								vResultOneData[Fieldname] = vCVal;
								vResultOneData[Fieldname + "tx"] = vVal;
							} 
						}
					}
					
					if(oController._vSavedAddressList.length > 0) {
						var isExits = false;
						for(var j=0; j<oController._vSavedAddressList.length; j++) {
							if(vSubty == oController._vSavedAddressList[j].Anssa) {
								if(fInputData) {
									vResultDatas.push(vResultOneData);
								}
								else fInputData = true;
								isExits = true;
								break;
							}
						}
						if(isExits == false) {
							if(fInputData) vResultDatas.push(vResultOneData);
						}
					} else {
						if(fInputData) vResultDatas.push(vResultOneData);
					}
					
					if(fInputData) {
						for(var k=0; k<oController._vAddressLayout.length; k++) {
							if(vSubty == oController._vAddressLayout[k].Subty) {
								Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[k].Fieldname);
								Fieldtype = oController._vAddressLayout[k].Inpty;
								
								oControl = $.app.byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
								if(!oControl) continue;
								
								vVal = "";
								
								if(Fieldtype == "M1") {
									vVal = oControl.getSelectedKey();
									if(vVal == "" || vVal == "0000") {
										oControl.addStyleClass("L2PSelectInvalidBorder");
										
										vMsg = oController.getBundleText("MSG_02063");
										vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[k].Label);
										MessageBox.alert(vMsg);
										return null;
									}
								} else if(Fieldtype == "M3") {
									vVal = oControl.getValue();
									if(vVal == "") {
										oControl.setValueState(sap.ui.core.ValueState.Error);
										vMsg = oController.getBundleText("MSG_02064");
										vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[k].Label);
										MessageBox.alert(vMsg);
										return null;
									}
								} else if(Fieldtype == "M4") {
									vVal = oControl.getValue();
									if(vVal == "") {
										oControl.setValueState(sap.ui.core.ValueState.Error);
										vMsg = oController.getBundleText("MSG_02064");
										vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[k].Label);
										MessageBox.alert(vMsg);
										return null;
									}
								} else if(Fieldtype == "M5") {
									vVal = oControl.getValue();
									if(vVal == "") {
										oControl.setValueState(sap.ui.core.ValueState.Error);
										vMsg = oController.getBundleText("MSG_02064");
										vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[k].Label);
										MessageBox.alert(vMsg);
										return null;
									}
								}
							}
						}
					}
				} else {
					for(var e=1; e<=oController._vEmecAddressListCount; e++) {
						vResultOneData = {
								Docno : oController._vDocno,
								Recno : oController._vRecno,
								VoltId : oController._vVoltId,
								Anssa : vSubty
						};
						
						fInputData = false;
						
						for(var m=0; m<oController._vAddressLayout.length; m++) {
							if(vSubty == oController._vAddressLayout[m].Subty) {
								Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[m].Fieldname);
								Fieldtype = oController._vAddressLayout[m].Inpty;
								
								oControl = $.app.byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + e + "_" + Fieldname);
								if(!oControl) continue;
								
								vVal = "";
								
								if(Fieldtype == "M1" || Fieldtype == "O1") {
									oControl.removeStyleClass("L2PSelectInvalidBorder");
									vVal = oControl.getSelectedKey();
									if(vVal != "" && vVal != "0000") {
										fInputData = true;
									} else {
										vVal = "";
									}
									vResultOneData[Fieldname] = vVal;
								} else if(Fieldtype == "M3"|| Fieldtype == "O3") {
									oControl.setValueState(sap.ui.core.ValueState.None);
									vVal = oControl.getValue();
									if(vVal != "") {
										fInputData = true;
									}
									vResultOneData[Fieldname] = vVal;
								} else if(Fieldtype == "M4" || Fieldtype == "O4") {
									oControl.setValueState(sap.ui.core.ValueState.None);
									vVal = oControl.getValue();
									if(vVal != "") {
										fInputData = true;
										vVal1 = "/Date(" + Common.getTime(vVal) + ")/";
										vResultOneData[Fieldname] = vVal1;
									} else {
										vResultOneData[Fieldname] = null;
									}
								} else if(Fieldtype == "M5" || Fieldtype == "O5") {
									oControl.setValueState(sap.ui.core.ValueState.None);
									vVal = oControl.getValue();
									oCustomData = oControl.getCustomData();
									vCVal = "";
									if(oCustomData && oCustomData.length) {
										for(var n=0; n<oCustomData.length; n++) {
											if(oCustomData[n].getKey() == Fieldname) {
												vCVal = oCustomData[n].getValue();
											}
										}
									}
									vResultOneData[Fieldname] = vCVal;
									vResultOneData[Fieldname + "tx"] = vVal;
								} 
							}
						}
						
						if(oController._vEmecAddressList.length > 0) {
							vResultDatas.push(vResultOneData);
						} else {
							if(fInputData) vResultDatas.push(vResultOneData);
						}
						
						if(fInputData) {
							for(var o=0; o<oController._vAddressLayout.length; o++) {
								if(vSubty == oController._vAddressLayout[o].Subty) {
									Fieldname = Common.underscoreToCamelCase(oController._vAddressLayout[o].Fieldname);
									Fieldtype = oController._vAddressLayout[o].Inpty;
									
									oControl = $.app.byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + e + "_" + Fieldname);
									if(!oControl) continue;
									
									vVal = "";
									
									if(Fieldtype == "M1") {
										vVal = oControl.getSelectedKey();
										if(vVal == "" || vVal == "0000") {
											oControl.addStyleClass("L2PSelectInvalidBorder");
											
											vMsg = oController.getBundleText("MSG_02063");
											vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[o].Label);
											MessageBox.alert(vMsg);
											return null;
										}
									} else if(Fieldtype == "M3") {
										vVal = oControl.getValue();
										if(vVal == "") {
											oControl.setValueState(sap.ui.core.ValueState.Error);
											vMsg = oController.getBundleText("MSG_02064");
											vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[o].Label);
											MessageBox.alert(vMsg);
											return null;
										}
									} else if(Fieldtype == "M4") {
										vVal = oControl.getValue();
										if(vVal == "") {
											oControl.setValueState(sap.ui.core.ValueState.Error);
											vMsg = oController.getBundleText("MSG_02064");
											vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[o].Label);
											MessageBox.alert(vMsg);
											return null;
										}
									} else if(Fieldtype == "M5") {
										vVal = oControl.getValue();
										if(vVal == "") {
											oControl.setValueState(sap.ui.core.ValueState.Error);
											vMsg = oController.getBundleText("MSG_02064");
											vMsg = vMsg.replace("&Cntl", oController._vAddressLayout[o].Label);
											MessageBox.alert(vMsg);
											return null;
										}
									} 
								}
							}
						}
					}
				}
				
				return vResultDatas;
			},
			
			deleteSub21 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._vCntSub21 == 0) {
					MessageBox.alert(oController.getBundleText("MSG_02101"));
					return;
				}
				
				var onProcessDelete = function(fVal) {
					if(fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = "";
						
						for(var i=0; i<oController._vAddressList.length; i++) {
							if(oController._vAddressList[i].Anssa != "1") {
								sPath = oModel.createKey("/RecruitingSubjectsAddressSet", {
									Docno: oController._vDocno,
									VoltId: oController._vVoltId,
									Seqnr: oController._vAddressList[i].Seqnr
								});

								oModel.remove(sPath, {
									success: function () {
										process_result = true;
									},
									error: function (oError) {
										var Err = {};					    	
										if (oError.response) {
											Err = window.JSON.parse(oError.response.body);
											if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
												Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
											} else {
												Common.showErrorMessage(Err.error.message.value);
											}
											
										} else {
											Common.showErrorMessage(oError);
										}
										process_result = false;
									}
								});
							}
							
							if(process_result == false) {
								break;
							}
						}				
						
						if(process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController.readSub21();
									oController.setActionButton();
								}
							});
						}
					}
				};
				
				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title : oController.getBundleText("LABEL_02093"),
					onClose : onProcessDelete
				});	
			},
			
			onEmptyAddressData : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oCustomData = oEvent.getSource().getCustomData();
				var vSubty = oCustomData[0].getValue();
				
				var onProcessDelete = function(fVal) {
					if(fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = "";
						
						for(var i=0; i<oController._vAddressList.length; i++) {
							if(oController._vAddressList[i].Anssa != vSubty) continue;

							sPath = oModel.createKey("/RecruitingSubjectsAddressSet", {
								Docno: oController._vDocno,
								VoltId: oController._vVoltId,
								Seqnr: oController._vAddressList[i].Seqnr
							});
							
							oModel.remove(sPath, {
								success: function () {
									process_result = true;
								},
								error: function (oError) {
									var Err = {};					    	
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
											Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
										} else {
											Common.showErrorMessage(Err.error.message.value);
										}
										
									} else {
										Common.showErrorMessage(oError);
									}
									process_result = false;
								}
							});					 
							
							if(process_result == false) {
								break;
							}
						}
						
						if(process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController.readSub21();
									oController.setActionButton();
								}
							});
						}
					}
				}
				
				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title : oController.getBundleText("LABEL_02093"),
					onClose : onProcessDelete
				});
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Sub23 개인추가정보 사항을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////
		//  개인추가정보사항을 가지고 온다.
			readSub23 : function() {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				var oController = $.app.getController(SUB_APP_ID);
				
				for(var v=1; v<=10; v++) {
					var oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets" + v);
					if(oVets) {
						oVets.setSelected(false);
					}
				}
				
				var oRacky = $.app.byId(oController.PAGEID + "_Sub23_Racky");
				var oMilsa = $.app.byId(oController.PAGEID + "_Sub23_Milsa");
				var oDisab = $.app.byId(oController.PAGEID + "_Sub23_Disab");
				var oP08disty = $.app.byId(oController.PAGEID + "_Sub23_P08disty");
				var oDisle = $.app.byId(oController.PAGEID + "_Sub23_Disle");
				var oDisdt = $.app.byId(oController.PAGEID + "_Sub23_Disdt");
				var oDcrdtLabel = $.app.byId(oController.PAGEID + "_Sub23_Dcrdt_Label");
				var oDcrdt = $.app.byId(oController.PAGEID + "_Sub23_Dcrdt");
				
				// 화면 초기화
				oRacky.setSelectedKey("80");
				oMilsa.setSelectedKey("0000");
				if(oDisab) oDisab.setSelectedKey("0000");
				if(oP08disty) oP08disty.setSelectedKey("002");
				if(oDisle) oDisle.setValue("");
				if(oDisdt) oDisdt.setValue("");
				
				if(oDcrdtLabel) oDcrdtLabel.setVisible(false);
				if(oDcrdt) oDcrdt.setVisible(false);
				
				oRacky.setEnabled(!oController._DISABLED);
				oMilsa.setEnabled(!oController._DISABLED);
				if(oDisab) oDisab.setEnabled(!oController._DISABLED);
				if(oP08disty) oP08disty.setEnabled(!oController._DISABLED);
				if(oDisle) oDisle.setEnabled(!oController._DISABLED);
				if(oDisdt) oDisdt.setEnabled(!oController._DISABLED);
				
				var setCheckbox = function(vEnabled) {
					for(var v=2; v<=7; v++) {
						var oCheckbox = $.app.byId(oController.PAGEID + "_Sub23_Vets" + v);
						if(oCheckbox) {
							oCheckbox.setSelected(false);
							oCheckbox.setEnabled(vEnabled);
						}
					}
				}
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/RecruitingSubjects0077Set", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId)
					],
					success: function(oData) {	
						if(oData && oData.results.length) {
							var vOneData = oData.results[0];
							var oVets = null;
							
							if(vOneData.Disle != null && oDisle) oDisle.setValue(dateFormat.format(new Date(Common.setTime(new Date(vOneData.Disle)))));
							if(vOneData.Disdt != null && oDisdt) oDisdt.setValue(dateFormat.format(new Date(Common.setTime(new Date(vOneData.Disdt)))));

							oRacky.setSelectedKey(vOneData.Racky);
							oMilsa.setSelectedKey(vOneData.Milsa);
	
							if(oDisab) oDisab.setSelectedKey(vOneData.Disab);
							if(oP08disty) oP08disty.setSelectedKey(vOneData.P08disty);
							
							if(vOneData.Dcrdt != null && oDcrdt) oDcrdt.setValue(dateFormat.format(new Date(Common.setTime(new Date(vOneData.Dcrdt)))));
							
							if(vOneData.Vetst1 == "V1") {
								oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets10");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "V8") {
								oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets8");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "V9") {
								oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets9");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "VA") {
								oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets1");
								if(oVets) oVets.setSelected(true);
								setCheckbox(true);
							}
							
							if(vOneData.Vetst2 && vOneData.Vetst2 != "") {
								var vCheckInfos = vOneData.Vetst2.split(",");
								for(var c=0; c<vCheckInfos.length; c++) {									
									oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets" + vCheckInfos[c].substring(1));
									if(oVets) oVets.setSelected(true);
								}
								
								if(vOneData.Vetst2.indexOf("V5") != -1) {
									if(oDcrdtLabel) oDcrdtLabel.setVisible(true);
									if(oDcrdt) oDcrdt.setVisible(true);
								}
							}
							
							oController._vCntSub23 = 1;
							oController.setActionButton();
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			},
			
		//  개인추가정보사항을 저장 한다.	
			saveSub23 : function(fVal) {
				var oController = $.app.getController(SUB_APP_ID);
				var oRacky = $.app.byId(oController.PAGEID + "_Sub23_Racky");
				var oMilsa = $.app.byId(oController.PAGEID + "_Sub23_Milsa");
				var oDisab = $.app.byId(oController.PAGEID + "_Sub23_Disab");
				var oP08disty = $.app.byId(oController.PAGEID + "_Sub23_P08disty");
				var oDisle = $.app.byId(oController.PAGEID + "_Sub23_Disle");
				var oDisdt = $.app.byId(oController.PAGEID + "_Sub23_Disdt");
				var oDcrdt = $.app.byId(oController.PAGEID + "_Sub23_Dcrdt");
				
				if(oDisle) oDisle.setValueState(sap.ui.core.ValueState.None);
				if(oDisdt) oDisdt.setValueState(sap.ui.core.ValueState.None);
				oRacky.removeStyleClass("L2PSelectInvalidBorder");
				oMilsa.removeStyleClass("L2PSelectInvalidBorder");
				if(oDisab) oDisab.removeStyleClass("L2PSelectInvalidBorder");
				if(oP08disty) oP08disty.removeStyleClass("L2PSelectInvalidBorder");
				if(oDcrdt) oDcrdt.setValueState(sap.ui.core.ValueState.None);
				
				var oRadios = [
					{no : "1", value : "VA"},
					{no : "8", value : "V8"},
					{no : "9", value : "V9"},
					{no : "10", value : "V1"}
				];
				
				var vVetst1 = "";
				var vVetst2 = "";
				
				for(var v=0; v<oRadios.length; v++) {
					var oVets = $.app.byId(oController.PAGEID + "_Sub23_Vets" + oRadios[v].no);
					if(oVets && oVets.getSelected()) {
						vVetst1 = oRadios[v].value;
						break;
					}
				}
				
				for(var p=2; p<=7; p++) {
					var oCheckbox = $.app.byId(oController.PAGEID + "_Sub23_Vets" + p);
					if(oCheckbox && oCheckbox.getSelected()) {
						vVetst2 += "V" + p + ",";
					}
				}
				if(vVetst2 != "") vVetst2 = vVetst2.substring(0, vVetst2.length - 1);
				
				var vOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Disle : oDisle && oDisle.getValue() != "" ? "/Date(" + Common.getTime(oDisle.getValue()) + ")/" : null,
						Disdt : oDisdt && oDisdt.getValue() != "" ? "/Date(" + Common.getTime(oDisdt.getValue()) + ")/" : null,
						Racky : oRacky.getSelectedKey() == "0000" ? "" : oRacky.getSelectedKey(),
						Milsa : oMilsa.getSelectedKey() == "0000" ? "" : oMilsa.getSelectedKey(),	
						Vetst1 : vVetst1,
						Vetst2 : vVetst2,
				};
				
				if(oDisab) {
					vOneData.Disab = oDisab.getSelectedKey() == "0000" ? "" : oDisab.getSelectedKey();
				}
				
				if(oP08disty) {
					vOneData.P08disty = oP08disty.getSelectedKey() == "0000" ? "" : oP08disty.getSelectedKey();
				}
				
				if(oDcrdt) {
					if(oDcrdt.getValue() == "") vOneData.Dcrdt = null;
					else vOneData.Dcrdt = "/Date(" + Common.getTime(oDcrdt.getValue()) + ")/";
				}
				
				if(vOneData.Vetst2.indexOf("V5") != -1) {
					if(vOneData.Dcrdt == null || vOneData.Dcrdt == "") {
						if(oDcrdt) oDcrdt.setValueState(sap.ui.core.ValueState.Error);
						var vMsg = oController.getBundleText("MSG_02064");
						vMsg = vMsg.replace("&Cntl", "Discharge Date");
						MessageBox.alert(vMsg);
						return false;
					}
				}
				
				var process_result = false;
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").create("/RecruitingSubjects0077Set", vOneData, {
					success: function () {
						process_result = true;
					},
					error: function (oError) {
						var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								Common.showErrorMessage(Err.error.message.value);
							}
							
						} else {
							Common.showErrorMessage(oError);
						}
						process_result = false;
					}
				});
		
				if(process_result) {
					if(fVal != "BACK") {
						MessageBox.alert(oController.getBundleText("MSG_02020"), {
							title: oController.getBundleText("LABEL_02093"),
							onClose : function() {
								oController.readSub23();
								oController._vCntSub23 = 1;
							}
						});
					}
					return true;
				} else {
					return false;
				}
			},
			
			deleteSub23 : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._vCntSub23 == 0) {
					MessageBox.alert(oController.getBundleText("MSG_02101"));
					return;
				}
				
				var onProcessDelete = function(fVal) {
					if(fVal && fVal == "OK") {
						var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
						var process_result = false;
						var sPath = oModel.createKey("/RecruitingSubjects0077Set", {
							Docno: oController._vDocno,
							VoltId: oController._vVoltId
						});

						oModel.remove(sPath, {
							success: function () {
								process_result = true;
							},
							error: function (oError) {
								var Err = {};					    	
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								process_result = false;
							}
						});

						if(process_result) {
							MessageBox.alert(oController.getBundleText("MSG_02039"), {
								title: oController.getBundleText("LABEL_02093"),
								onClose : function() {
									oController.readSub23();
									oController._vCntSub23 = 0;
									oController.setActionButton();
								}
							});
						}
					}
				};
				
				MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					title : oController.getBundleText("LABEL_02093"),
					onClose : onProcessDelete
				});
			
			},
			
			setFromRegno : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vInputValue = oEvent.getSource().getValue();

				oController._vModifyContent = true;
				
				if (isNaN(vInputValue) || vInputValue.indexOf('.') != -1 || vInputValue.indexOf(' ') != -1) {
					vInputValue = vInputValue.substr(0, vInputValue.length-1 );
					oEvent.getSource().setValue(vInputValue);
				}
			},
			
			/*
			* 날짜포맷에 맞는지 검사
			*/
			isDateFormat : function(d)  {
				var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
				return d.match(df);
			},
		
			/*
			* 윤년여부 검사
			*/
			isLeaf : function(year)  {
				var leaf = false;
		
				if(year % 4 == 0) {
					leaf = true;
		
					if(year % 100 == 0) {
						leaf = false;
					}
		
					if(year % 400 == 0) {
						leaf = true;
					}
				}
		
				return leaf;
			},
		
			/*
			* 날짜가 유효한지 검사
			*/
			isValidDate : function(d)  {
				var oController = $.app.getController(SUB_APP_ID);

				// 포맷에 안맞으면 false리턴
				if(!oController.isDateFormat(d)) {
					return false;
				}
		
				var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				var dateToken = d.split('-');
				var year = Number(dateToken[0]);
				var month = Number(dateToken[1]);
				var day = Number(dateToken[2]);
			
				// 날짜가 0이면 false
				if(day == 0) {
					return false;
				}
		
				var isValid = false;
		
				// 윤년일때
				if(oController.isLeaf(year)) {
					if(month == 2) {
						if(day <= month_day[month-1] + 1) {
							isValid = true;
						}
					} else {
						if(day <= month_day[month-1]) {
							isValid = true;
						}
					}
				} else {
					if(day <= month_day[month-1]) {
						isValid = true;
					}
				}
		
				return isValid;
			},
			
			setFromPerid : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oPerid = $.app.byId(oController.PAGEID + "_Sub01_Form_28_Perid");
				var vPerid = oPerid.getValue().trim();
				var oGesch1 = $.app.byId(oController.PAGEID + "_Sub01_Form_28_Gesch1");
				var oGesch2 = $.app.byId(oController.PAGEID + "_Sub01_Form_28_Gesch2");
				var oGbdat = $.app.byId(oController.PAGEID + "_Sub01_Form_28_Gbdat");

				switch(vPerid.length) {
					case 15 :
						oGbdat.setValue("19"  + vPerid.substr(6, 2)
										+ "-" + vPerid.substr(8, 2)
										+ "-" + vPerid.substr(10, 2));
						
						if(parseInt(vPerid.substr(14, 1)) % 2 == 1) oGesch1.setSelected(true);
						else oGesch2.setSelected(true);
						
						break;
					case 18 :
						oGbdat.setValue(vPerid.substr(6, 4)
								+ "-" + vPerid.substr(10, 2)
								+ "-" + vPerid.substr(12, 2));
				
						if(parseInt(vPerid.substr(16, 1)) % 2 == 1) oGesch1.setSelected(true);
						else oGesch2.setSelected(true);
				}
			},
			
			onChangeFamst : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vFamst = $.app.byId(oController.PAGEID + "_Sub01_Famst").getSelectedKey();
				var oFamdt = $.app.byId(oController.PAGEID + "_Sub01_Famdt");
				
				if(oEvent) oController._vModifyContent = true;
				
				if(oFamdt) {
					if(vFamst == "0" || vFamst == "0000") {
						oFamdt.setValue("");
						oFamdt.setEnabled(false);
					} else {
						oFamdt.setEnabled(true);
					}
				}
			},
			
			onChangeState : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oControl = oEvent.getSource();
				var vUpdateValue = "";
				var vSid = oControl.sId;
				var vTmp1 = vSid.split("_");
				var vTmp2 = "";
				
				oController._vModifyContent = true;

				for(var i=0; i<vTmp1.length - 1; i++) {
					vTmp2 += vTmp1[i] + "_";
				}
				var vTmp3 = vTmp2 + "Rctvc";
				
				var oTmp = $.app.byId(vTmp3);
				if(typeof oTmp != "object") return;
				
				oController.setCity(vUpdateValue, vSid, vTmp3);
			},
			
			onSelectVetsRadio : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var oControl = oEvent.getSource();
				var vIds = oControl.getId().split("_");
				var vId = vIds[vIds.length - 1];
				var oCheckbox = null;
				
				if(vId == "Vets1") {
					for(var v=2; v<=7; v++) {
						oCheckbox = $.app.byId(oController.PAGEID + "_Sub23_Vets" + v);
						if(oCheckbox) {
							oCheckbox.setEnabled(true);
						}
					}
				} else {
					for(var p=2; p<=7; p++) {
						oCheckbox = $.app.byId(oController.PAGEID + "_Sub23_Vets" + p);
						if(oCheckbox) {
							oCheckbox.setSelected(false);
							oCheckbox.setEnabled(false);
						}
					}
				}
			},
			
			onSelectVetsCheckbox : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var oControl = $.app.byId(oController.PAGEID + "_Sub23_Vets1");
				if(oControl) {
					oControl.setSelected(true);
				}
				
				var oDcrdtLabel = $.app.byId(oController.PAGEID + "_Sub23_Dcrdt_Label");
				var oDcrdt = $.app.byId(oController.PAGEID + "_Sub23_Dcrdt");
				
				var oV5 = $.app.byId(oController.PAGEID + "_Sub23_Vets5");
				if(oV5) {
					if(oV5.getSelected()) {
						oDcrdtLabel.setVisible(true);
						oDcrdt.setVisible(true);
					} else {
						oDcrdtLabel.setVisible(false);
						oDcrdt.setVisible(false);
					}
				}
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// 지역 DDLB (State)
		/////////////////////////////////////////////////////////////////////////////////////////////
			setDDLBState : function(vSelectedKey, Molga, Land, State) {
				var oController = $.app.getController(SUB_APP_ID);
				var oState = null;
				var oLand1 = null;

				if(Molga && Molga != "") {
					oState = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_" + State);
					oLand1 = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_" + Land);
				} else {
					oState = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_Form_" + State);
					oLand1 = $.app.byId(oController.PAGEID + "_" + oController._JobPage + "_Form_" + Land);
				}
				if(typeof oState != "object") return;
				if(typeof oLand1 != "object") return;
				
				var vLand1 = oLand1.getCustomData()[0].getValue();
				
				try {
					if(oState instanceof sap.m.ComboBox) oState.removeAllItems();
					else if(oState instanceof sap.m.Input){
						oState.setValue("");
						oState.removeAllCustomData();
						oState.addCustomData(new sap.ui.core.CustomData({key : State , value : ""}));
						return;
					}
				} catch(ex) {
					return;
				}			
		
				if(oController._vPersa != "" && oController._vActda != "" && vLand1 != "") {
					oState.addItem(
						new sap.ui.core.Item({
							key : "",
							text : oController.getBundleText("LABEL_02035")
						})
					);
						
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "State"),
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, vLand1),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oState.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode,
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oState.setSelectedKey(vSelectedKey);
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});
				}
			},	
			
			setDDLBState2 : function(vSelectedKey, vLand1, StateId) {
				var oController = $.app.getController(SUB_APP_ID);
				var oState = $.app.byId(StateId);
				
				if(typeof oState != "object") return;
				
				try {
					if(oState instanceof sap.m.ComboBox) oState.removeAllItems();
					else if(oState instanceof sap.m.Input){
						oState.setValue("");
						oState.removeAllCustomData();
						oState.addCustomData(new sap.ui.core.CustomData({key : StateId , value : ""}));
						return;
					}
				} catch(ex) {
					return;
				}		
				
				if(oController._vPersa != "" && oController._vActda != "" && vLand1 != "") {
					oState.addItem(new sap.ui.core.Item({key : "", text : oController.getBundleText("LABEL_02035")}));
						
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "State"),
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, vLand1),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oState.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode,
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oState.setSelectedKey(vSelectedKey);
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});
				}
			},	
			
			setCity : function(vSelectedKey, State, City, vSaved_State) {
				var oController = $.app.getController(SUB_APP_ID);
				var oState = null;
				var oCity = null;
				
				oState = $.app.byId(State);
				oCity = $.app.byId(City);
				
				if(typeof oCity != "object") return;
				
				if(!vSaved_State || vSaved_State == "") {
					if(typeof oState != "object") return;
				}
				
				var vState = "";
				
				try {
					if(vSaved_State && vSaved_State != "") {
						vState = vSaved_State;
					} else {
						if(oState.getMetadata().getName().toUpperCase() == "SAP.M.COMBOBOX") vState = oState.getSelectedKey();
						else  vState = oState.getCustomData()[0].getValue();
					}
					
					oCity.removeAllItems();
				} catch(ex) {
					return;
				}
		
				if(oController._vPersa != "" && oController._vActda != "" && vState != "") {
					oCity.addItem(new sap.ui.core.Item({key : "", text : oController.getBundleText("LABEL_02035")}));
						
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Rctvc"),
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Excod", sap.ui.model.FilterOperator.EQ, vState),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oCity.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode,
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oCity.setSelectedKey(vSelectedKey);
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});
				}
			},	
		/////////////////////////////////////////////////////////////////////////////////////////////
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// 전공(FaartCode) 검색을 위한 Functions
		/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogSearchFaartCodeEvent : null,
			_OFaartCodeControl : null,
			
			onDisplaySearchFaartCodeDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._OFaartCodeControl = oEvent.getSource();
		
				if(!oController._ODialogSearchFaartCodeEvent) {
					oController._ODialogSearchFaartCodeEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SearchFaartCode", oController);
					oView.addDependent(oController._ODialogSearchFaartCodeEvent);
				}
				
				var oFaart = $.app.byId(oController.PAGEID + "_POP_Faart");
				oFaart.setValue("");
				oController._ODialogSearchFaartCodeEvent.open();
				oController.onSetFaartCodeFragment();
			},
			
			onSetFaartCodeFragment : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oDialog = $.app.byId(oController.PAGEID + "_POP_FaartCode_Dialog");
				var oStandardList = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardList");

				if(oController._OFaartCodeControl.sId.indexOf("Zzmajo1") > 0){
					oDialog.setTitle(oController.getBundleText("LABEL_02170"));
				}else if(oController._OFaartCodeControl.sId.indexOf("Zzmajo2") > 0){
					oDialog.setTitle(oController.getBundleText("LABEL_02296"));
				}else{
					oDialog.setTitle(oController.getBundleText("LABEL_02171"));
				}			
		
				var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
				if(!oFaartCodeModel.getProperty("/FaartCodeListSet") || oFaartCodeModel.getProperty("/FaartCodeListSet").length < 1){
					var vCode = { FaartCodeListSet : [] };
					
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Zzmajo1"),
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)
						],
						success: function(oData) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vCode.FaartCodeListSet.push(oData.results[i]);
								}
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
						}
					});

					oFaartCodeModel.setData(vCode);
				}	
				oStandardList.unbindItems();
			},
			
			onSearchFaartCode : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var sValue = $.app.byId(oController.PAGEID + "_POP_Faart").getValue();

				if(sValue.length < 2){
					Common.showErrorMessage(oController.getBundleText("MSG_02117"));
					return ;
				}
				
				var dataProcess = function(){
					
					var oFilters = [];
					oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
				
					var oFaartCodeList = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardList");
					var oFaartCodeListItem = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardListItem");
					
					oFaartCodeList.bindItems("/FaartCodeListSet", oFaartCodeListItem, null, oFilters);	
					
					BusyIndicator.hide();
				};
				
				BusyIndicator.show(0);

				setTimeout(dataProcess, 300);
			},
			
			onConfirmFaartCode : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var oStandardList = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardList");
				var aContexts = oStandardList.getSelectedContexts(true);
				
				if (aContexts.length == 1){
					var vFaartCode = aContexts[0].getProperty("Ecode");
					var vFaartCodetx = aContexts[0].getProperty("Etext");
					
					oController._OFaartCodeControl.setValue(vFaartCodetx);
					oController._OFaartCodeControl.removeAllCustomData();
					oController._OFaartCodeControl.addCustomData(new sap.ui.core.CustomData({key : "Key", value : vFaartCode}));
				}
				
				oController.onCancelFaartCode(oEvent);
			},
				
			onCancelFaartCode : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oFaartCodeList = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardList");
				var oFaartCodeListItem = $.app.byId(oController.PAGEID + "_POP_FaartCode_StandardListItem");

				oFaartCodeList.bindItems("/FaartCodeListSet", oFaartCodeListItem, null, []);
			
				var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
				var vCode = { FaartCodeListSet : [] };
				oFaartCodeModel.setData(vCode);
		
				if(oController._ODialogSearchFaartCodeEvent.isOpen()){
					oController._ODialogSearchFaartCodeEvent.close();
				}
			},
			
			onClearSelectedFaartCode : function(oEvent){
				var oController = $.app.getController(SUB_APP_ID);
				
				// 전공 Clear
				oController._OFaartCodeControl.setValue("");
				oController._OFaartCodeControl.removeAllCustomData();
				
				oController.onCancelFaartCode(oEvent);
			},
			
			onClearFaartFields : function(oController) {
				var oSltp1 = $.app.byId(oController.PAGEID + "_Sub02_Sltp1");
				var oSltp2 = $.app.byId(oController.PAGEID + "_Sub02_Sltp2");
				
				if(typeof oSltp1 == "object") {
					oSltp1.setValue("");
					oSltp1.removeAllCustomData();
					oSltp1.addCustomData(new sap.ui.core.CustomData({key : "Key", value : ""}));
				}
				
				if(typeof oSltp2 == "object") {
					oSltp2.setValue("");
					oSltp2.removeAllCustomData();
					oSltp2.addCustomData(new sap.ui.core.CustomData({key : "Key", value : ""}));
				}
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// 재입사 정보조회 function
		/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogPopup_Rehire : null ,
			
			onPressRehireSearch : function(){
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);
				
				if(!oController._ODialogPopup_Rehire) {
					oController._ODialogPopup_Rehire = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Rehire_Search", oController);
					oView.addDependent(oController._ODialogPopup_Rehire);
				}
				
				var oRPerid = $.app.byId(oController.PAGEID + "_Rehire_Perid");
				oRPerid.setValue("");
				var oRPerid2 = $.app.byId(oController.PAGEID + "_Rehire_Perid2");
				if(typeof oRPerid2 != "undefined" && oRPerid2){
					oRPerid2.setValue("");
				}
				oController._ODialogPopup_Rehire.open();
				
				
			},
			
			onConfirmRehire : function(){
				var oController = $.app.getController(SUB_APP_ID);
				var oRPerid = $.app.byId(oController.PAGEID + "_Rehire_Perid");
				var oRPerid2 = $.app.byId(oController.PAGEID + "_Rehire_Perid2");
				var oProcessResult = false ;
				var oNameLayoutText = $.app.byId(oController.PAGEID + "_NameLayoutText");

				oNameLayoutText.setText("");
				
				if(oRPerid.getValue() == ""){
					MessageBox.alert("Waring");
					return ;
				}
				
				var vRehireData = null;
				var vRIdNum = "";
				if(typeof oRPerid2 != "undefined" && oRPerid2 && oController._vMolga == "06"){
					var vTempPerid2 = oRPerid2.getValue();
					if(vTempPerid2 == "") vTempPerid2 = "00";
					vRIdNum =  oRPerid.getValue() + "/" + vTempPerid2;
				}else{
					vRIdNum = oRPerid.getValue();
				}
				
				$.app.getModel("ZHR_ACTIONAPP_SRV").read("/RecruitingSubjectsSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Accty", sap.ui.model.FilterOperator.EQ, "R"),
						new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vRIdNum),
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)
					],
					success: function(oData) {	
						if(oData && oData.results.length > 0) {
							oProcessResult = true;
							
							vRehireData = oData.results[0];
							
							if(oData.results[0].Perid == "") {
								vRehireData.Perid = oData.results[0].Idnum;	
							}						
							
							oController._vRecno = oData.results[0].Recno;
							oController._vVoltId = oData.results[0].VoltId;
							
							oController._fRehireStatus = true;
							
							var vNameStr = "";
							if(oData.Anredtx != "") vNameStr = oData.Anredtx + " " + oData.Ename;
							else vNameStr = oData.Ename;
							
							oNameLayoutText.setText(vNameStr);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				if(!oProcessResult){
					MessageBox.alert(oController.getBundleText("MSG_02107"));
					return ;
				}
				
				oController.setSub01(vRehireData);		
		
				if(oController._ODialogPopup_Rehire.isOpen()){
					oController._ODialogPopup_Rehire.close();
				}
			},
			
			onCancelRehire : function(){
				var oController = $.app.getController(SUB_APP_ID);

				if(oController._ODialogPopup_Rehire.isOpen()){
					oController._ODialogPopup_Rehire.close();
				}
			},
			
			onBeforeOpenRehireSearch : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oRehireIdnumLabel = $.app.byId(oController.PAGEID + "_Rehire_Idnum_Label");
				var vCless , vNumss ;

				for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
					var Fieldname = Common.underscoreToCamelCase(oController._vHiringPersonalInfomationLayout[i].Fieldname);
					
					if(oController._vMolga != "01" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
						oRehireIdnumLabel.setText(oController._vHiringPersonalInfomationLayout[i].Label);
						break;
					//독일 재입사 기준은 사번임으로 라벨도 사번으로 수정
					}else if(oController._vMolga == "01" && Fieldname == "Idnum"){ 
						oRehireIdnumLabel.setText(oController._vHiringPersonalInfomationLayout[i].Label);
						break;
					}else if(Fieldname == "Numss"){
						vNumss = oController._vHiringPersonalInfomationLayout[i].Label ;
					}else if(Fieldname == "Cless"){
						vCless = oController._vHiringPersonalInfomationLayout[i].Label ;
					}
				}
				
				if(oController._vMolga == "06" ){ //프랑스 재입사 기준은 Numss, Cless 두 필드로 나뉨. 필드라벨은 하나로 표시함.
					oRehireIdnumLabel.setText(vNumss + "/" +vCless);
				}
				var oRehire_Perid = $.app.byId(oController.PAGEID + "_Rehire_Perid");
				var oRehire_Perid2 = $.app.byId(oController.PAGEID + "_Rehire_Perid2");
				
				if(oController._vMolga == "06"){
					oRehire_Perid.setWidth("70%");
					oRehire_Perid2.setVisible(true);
				}else{
					oRehire_Perid.setWidth("95%");
					oRehire_Perid2.setVisible(false);
				}
				
			},
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// 재입사 정보 복사 선택 function
		/////////////////////////////////////////////////////////////////////////////////////////////	
			_ODialogPopup_RehireDataSelect : null ,
			
			onOpenRehireDataSelect : function(vOneData){
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);
				
				if(!oController._ODialogPopup_RehireDataSelect) {
					oController._ODialogPopup_RehireDataSelect = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Rehire_DataSelect", oController);
					oView.addDependent(oController._ODialogPopup_RehireDataSelect);
				}
				
				oController._vCreateRehireData = vOneData;
				oController._ODialogPopup_RehireDataSelect.open();
			},
			
			onConfirmRehireDataSelect : function(){
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._ODialogPopup_RehireDataSelect.isOpen()){
					oController._ODialogPopup_RehireDataSelect.close();
				}
				
				if(oController._vCreateRehireData) {
					for(var i=0; i<oController._vActiveTabNames.length; i++) {
						if(oController._vActiveTabNames[i].Tabid == "01") {
							continue;
						}
						
						var oControl = $.app.byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid);
						if(oControl && oControl.getSelected() == true) {
							oController["_vCreateRehireData.Cnt" + oController._vActiveTabNames[i].Tabid] = 'X';
						}
					}
					
					var process_result = false;
					
					$.app.getModel("ZHR_ACTIONAPP_SRV").create("/RecruitingSubjectsSet", oController._vCreateRehireData, {
						success: function (oData) {
							if(oData) {
								oController._vVoltId = oData.VoltId;
							}
							process_result = true;
							oController._vActionType = "M";
						},
						error: function (oError) {
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									Common.showErrorMessage(Err.error.message.value);
								}
								
							} else {
								Common.showErrorMessage(oError);
							}
							process_result = false;
						}
					});
					
					if(process_result) {
						MessageBox.alert(oController.getBundleText("MSG_02020"), {
							title: oController.getBundleText("LABEL_02093"),
							onClose : function() {
								oController._fRehireStatus = false;
								oController.setSub01();
								oController.setActionButton();
							}
						});
					}			
				}		
			},
			
			onBeforeOpenRehireDataSelect : function() {
				var oController = $.app.getController(SUB_APP_ID);
				var oMatrixLayout = $.app.byId(oController.PAGEID + "_Rehire_DataSelect_Layout");
				var oCell = null, oRow = null;
				
				if(oMatrixLayout) {
					for(var i=0; i<oController._vActiveTabNames.length; i++) {
						if(oController._vActiveTabNames[i].Tabid == "01") {
							continue;
						}
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : [new sap.m.Label({text: oController._vActiveTabNames[i].Tabtl}).addStyleClass("L2PFontFamily")]
						}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
						oRow.addCell(oCell);
						
						var oControl = new sap.m.CheckBox(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid, {
							width : "95%",
							selected : false
						});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : oControl
						}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
						oRow.addCell(oCell);
		
						oMatrixLayout.addRow(oRow);
					}
				}
			},
			
			onAfterCloseRehireDataSelect : function() {
				var oController = $.app.getController(SUB_APP_ID);
				
				for(var i=0; i<oController._vActiveTabNames.length; i++) {
					if(oController._vActiveTabNames[i].Tabid == "01") {
						continue;
					}
					
					var oControl = $.app.byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid);
					if(oControl) {
						oControl.destroy();
					}
				}
				
				var oMatrixLayout = $.app.byId(oController.PAGEID + "_Rehire_DataSelect_Layout");
				
				if(oMatrixLayout) {
					oMatrixLayout.removeAllRows();
					oMatrixLayout.destroyRows();
					
				}
			},
			
			onCancelRehireDataSelect : function(){
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._ODialogPopup_RehireDataSelect.isOpen()){
					oController._ODialogPopup_RehireDataSelect.close();
				}
			},	
			
		/////////////////////////////////////////////////////////////////////////////////////////////
		// Text 입력 Functions ( 학교 , 전공, 부전공 )
		/////////////////////////////////////////////////////////////////////////////////////////////	
				
			_ODialogSearchInputEvent : null,
			
			onDisplaySearchInputDialog : function() {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				if(!oController._ODialogSearchInputEvent) {
					oController._ODialogSearchInputEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.EducationInputField", oController);
					oView.addDependent(oController._ODialogSearchInputEvent);
				}
				
				var oControl = this;
				var oCustomData = oControl.getCustomData();
				
				var vSearchInputType = oCustomData[0].getValue();
				if(oCustomData[0]){
					var oInputDialog = $.app.byId(oController.PAGEID + "_Input_Dialog");
					var oInput = $.app.byId(oController.PAGEID + "_POP_Input");
					var oInputNotice = $.app.byId(oController.PAGEID + "_POP_Input_Notice");
					oInput.setValue("");
					oInput.removeAllCustomData();
					oInput.addCustomData(new sap.ui.core.CustomData({key : "SearchInputType", value : vSearchInputType}));
					// 학교
					if(vSearchInputType == "Schcd"){
						oInputDialog.setTitle(oController.getBundleText("LABEL_02166"));
						oInputNotice.setText(oController.getBundleText("MSG_02127"));
						var oSchcd_Pop = $.app.byId(oController.PAGEID + "_POP_Schcd");
						oInput.setValue(oSchcd_Pop.getValue());
					} else if(vSearchInputType == "Sltp1"){
						oInputDialog.setTitle(oController.getBundleText("LABEL_02170"));
						oInputNotice.setText(oController.getBundleText("MSG_02128"));
						var oSltp1_Pop = $.app.byId(oController.PAGEID + "_POP_Faart");
						oInput.setValue(oSltp1_Pop.getValue());
					} else if(vSearchInputType == "Sltp2"){
						oInputDialog.setTitle(oController.getBundleText("LABEL_02171"));
						oInputNotice.setText(oController.getBundleText("MSG_02129"));
						var oSltp2_Pop = $.app.byId(oController.PAGEID + "_POP_Faart");
						oInput.setValue(oSltp2_Pop.getValue());
					} else if(vSearchInputType == "Cttyp"){
						oInputDialog.setTitle(oController.getBundleText("LABEL_02055")); //
						oInputNotice.setText(oController.getBundleText("MSG_02130"));
						var oCttyp_Pop = $.app.byId(oController.PAGEID + "_POP_Cttyp");   
						oInput.setValue(oCttyp_Pop.getValue());
					} else if(vSearchInputType == "Arbgb"){
						oInputDialog.setTitle(oController.getBundleText("LABEL_02297")); //
						oInputNotice.setText(oController.getBundleText("MSG_02118"));
						var oArbgb_Pop = $.app.byId(oController.PAGEID + "_POP_Arbgb");   
						oInput.setValue(oArbgb_Pop.getValue());
					}
				}
				oController._ODialogSearchInputEvent.open();
			},
			
			onKeyUp : function(oEvent){
				if(oEvent.which == 13) {
					$.app.getController(SUB_APP_ID).onPressConfirmInput();
				}
			},
			
			onPressConfirmInput : function(){
				var oController = $.app.getController(SUB_APP_ID);	
				var oInput = $.app.byId(oController.PAGEID + "_POP_Input");
				var vInputText = oInput.getValue();
				var vSearchInputType = oInput.getCustomData()[0].getValue();
				var oSchcd = $.app.byId(oController.PAGEID + "_Sub02_Schcd");
				var oSltp1 = $.app.byId(oController.PAGEID + "_Sub02_Sltp1");
				var oSltp2 = $.app.byId(oController.PAGEID + "_Sub02_Sltp2");
				var oCttyp = $.app.byId(oController.PAGEID + "_Sub06_Cttyp");
				var oArbgb = $.app.byId(oController.PAGEID + "_Sub03_Arbgb");
				
				if(vSearchInputType == "Schcd"){
					if(oSchcd) {
						oSchcd.removeAllCustomData();
						oSchcd.setValue(vInputText);
						oController.onCancelSchcd();
					}			
				} else if(vSearchInputType == "Sltp1"){
					if(oSltp1) {
						oSltp1.removeAllCustomData();
						oSltp1.setValue(vInputText);
						oController.onCancelFaartCode();
					}			
				} else if(vSearchInputType == "Sltp2"){
					if(oSltp2) {
						oSltp2.removeAllCustomData();
						oSltp2.setValue(vInputText);
						oController.onCancelFaartCode();
					}			
				} else if(vSearchInputType == "Cttyp"){
					if(oCttyp) {
						oCttyp.removeAllCustomData();
						oCttyp.setValue(vInputText);
						oController.onCancelCttyp();
					}			
				} else if(vSearchInputType == "Arbgb"){
					if(oArbgb) {
						oArbgb.removeAllCustomData();
						oArbgb.setValue(vInputText);
						oController.onCancelArbgb();
					}			
				}
				oController.onCOCloseInput();
			},
			
			onCOCloseInput : function(){
				var oController = $.app.getController(SUB_APP_ID);

				if(oController._ODialogSearchInputEvent && oController._ODialogSearchInputEvent.isOpen()){
					oController._ODialogSearchInputEvent.close();
				}
			},
			
			_ODialogSearchWaersEvent : null,
			_OWaersControl : null,
			
			onDisplaySearchWaersDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._OWaersControl = oEvent.getSource();
		
				if(!oController._ODialogSearchWaersEvent) {
					oController._ODialogSearchWaersEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SearchWaersDialog", oController);
					oView.addDependent(oController._ODialogSearchWaersEvent);
				}
				oController._ODialogSearchWaersEvent.open();
			},
			
			onSearchWaers : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Waers"));
				oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
			
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oFilters);
			},
			
			onConfirmWaers : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var aContexts = oEvent.getParameter("selectedContexts");
			
				if (aContexts.length) {
					var vEmpCode = aContexts[0].getProperty("Ecode");
					oController._OWaersControl.setValue(vEmpCode);
				}
				
				oController.onCancelWaers(oEvent);
			},
				
			onCancelWaers : function(oEvent) {
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Waers"));
				oFilters.push(new sap.ui.model.Filter("Ecode", sap.ui.model.FilterOperator.NE, "0000"));
				
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oFilters);
			},
			
			getCustomdata : function(oCustomData, key) {
				var val = "";
				
				if(oCustomData && oCustomData.length) {
					for(var i=0; i<oCustomData.length; i++) {
						if(oCustomData[i].getKey() == key) {
							val = oCustomData[i].getValue();
							break;
						}
					}
				}
				
				return val;
			},
			
			setSpecialCodeData : function(Fieldname, vAddFilter) {
				var oController = $.app.getController(SUB_APP_ID);	
				var mCodeModel = new JSONModel();
				var vCodeModel = {EmpCodeListSet : []};
				
				vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : oController.getBundleText("LABEL_02035")});

				var subFilters = [];
				vAddFilter.forEach(function(elem) {
					subFilters.push(
						new sap.ui.model.Filter(
							elem.key, 
							sap.ui.model.FilterOperator.EQ, 
							(elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
						)
					);
				});
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, Fieldname),
						new sap.ui.model.Filter({ filters: subFilters, and: true })
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCodeModel.EmpCodeListSet.push(oData.results[i]);
							}
							mCodeModel.setData(vCodeModel);	
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				return mCodeModel;
			},
			
			displayCodeSearchDialog : function(oEvent) {
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
				mOneCodeModel.setData(null);
				var vOneCodeList = {EmpCodeListSet : []};
				
				var oCustomData = oEvent.getSource().getCustomData();
				var Fieldname = oCustomData[0].getKey();
				
				if(Fieldname == "Natio" || Fieldname == "Nati2") {
					Fieldname = "Natio2";
				}
				
				var vTitle = "";
				if(oCustomData.length > 1) {
					vTitle = oCustomData[1].getValue();
				} else {
					vTitle = oController.getBundleText("LABEL_02155");
				}
				
				var mEmpCodeList = null;
				var vEmpCodeList = null;
				var vAddFilter = null;
				var vState = "";
				var vLand1 = "";
				var vCounc = "";
				var vExcod = "";
				var vFieldName = "";
				var oLand1 = null;
				var oState = null;
				var oCounc = null;
				
				if(Fieldname == "State") {	
					vExcod = "";
					var vTmp1 = oEvent.getSource().sId;
					var vTmp2 = vTmp1.replace(Fieldname, "Land1");
					oLand1 = $.app.byId(vTmp2);
					if(oLand1) {
						vExcod = oLand1.getCustomData()[0].getValue();
					}
					
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda},
						{key : "Excod", value : vExcod}
					];
					
					mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
				}else if(Fieldname == "Vorsw"){
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda},
						{key : "Excod", value : "V"}
					];
			
					mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
				}else if(oController._vMolga == "46" && Fieldname == "Counc"){
					vState = "";
					vLand1 = "";
					oLand1 = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "Land1"));
					if(oLand1) {
						vLand1 = oLand1.getCustomData()[0].getValue();
					}
					oState = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "State"));
					if(oState) {
						if(oState.getMetadata().getName().toUpperCase() == "SAP.M.COMBOBOX") vState = oState.getSelectedKey();
						else  vState = oState.getCustomData()[0].getValue();
					}
					
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda},
						{key : "Excod", value : vLand1 + "|" + vState}
					];
					
					mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
				}
				else if(oController._vMolga == "46" && Fieldname == "Tery2" || Fieldname == "Rctvc"){
					vState = "";
					vLand1 = "";
					vCounc = "";
					vFieldName = Fieldname ;
					if(vFieldName == "Rctvc") vFieldName = "Tery2";
						oLand1 = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "Land1"));
					if(oLand1) {
						vLand1 = oLand1.getCustomData()[0].getValue();
					}
					oState = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "State"));
					if(oState) {
						if(oState.getMetadata().getName().toUpperCase() == "SAP.M.COMBOBOX") vState = oState.getSelectedKey();
						else  vState = oState.getCustomData()[0].getValue();
					}
					oCounc = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "Counc"));
					if(oCounc) {
						vCounc = oCounc.getCustomData()[0].getValue();
					}
					
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda},
						{key : "Excod", value : vLand1 + "|" + vState + "|" + vCounc}
					];
					
					mEmpCodeList = oController.setSpecialCodeData(vFieldName, vAddFilter);
					vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
					if(vEmpCodeList && vEmpCodeList.length) {
						for(var i=0; i<vEmpCodeList.length; i++) {
							if(vEmpCodeList[i].Field == vFieldName && vEmpCodeList[i].Ecode != "0000") {
								vEmpCodeList[i].Field = Fieldname;
							}
						}
					}
					
				}else if(Fieldname == "Gbdep"){
					vExcod = "";
					var oGbdep = $.app.byId(oEvent.getSource().sId.replace(Fieldname, "Gblnd"));
					if( typeof oGbdep == "object"){
						vExcod = oGbdep.getCustomData()[0].getValue();
					}
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda},
						{key : "Excod", value : vExcod}
					];
					Fieldname = "State";
					mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
				}else {
					vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda}
					];
					
					mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);	
				}
				
				vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
				if(vEmpCodeList && vEmpCodeList.length) {
					vOneCodeList.EmpCodeListSet.push({Field : Fieldname, Ecode : "", Etext : oController.getBundleText("LABEL_02279")});
					for(var k=0; k<vEmpCodeList.length; k++) {
						if(vEmpCodeList[k].Field == Fieldname && vEmpCodeList[k].Ecode != "0000") {
							vOneCodeList.EmpCodeListSet.push(vEmpCodeList[k]);
						}
					}
				}
				mOneCodeModel.setData(vOneCodeList);
				
				SearchCode.oController = oController;
				SearchCode.vCallControlId = oEvent.getSource().getId();
				
				if(!oController._CodeSearchDialog) {
					oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
					oView.addDependent(oController._CodeSearchDialog);
				}
				oController._CodeSearchDialog.open();
				
				var oDialog = $.app.byId(oController.PAGEID + "_FCS_Dialog");
				oDialog.setTitle(vTitle);
			},
			
			onLiveChange : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var s = oEvent.getParameter("value");
				if(s == "") {
					oEvent.getSource().removeAllCustomData();
				}
			},
			
			onLiveChangeAnzkd : function(oEvent) {
				$.app.getController(SUB_APP_ID)._vModifyContent = true;
				
				var s = oEvent.getParameter("value");
				var oAnzkd = oEvent.getSource();
				
				if(parseInt(s) == 0) {
					oAnzkd.setValue("");
				}
				
			},
		
			_oldSSNLength : 0,
			onChangeSSN : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var oControl = oEvent.getSource();
				var s = oEvent.getParameter("value");
				var t1 = s.replace(/-/g, ""); 
				
				var t2 = s;
				if(isNaN(t1)) {
					MessageBox.alert(oController.getBundleText("MSG_02131"));
					return;
				}
				
				if(oController._oldSSNLength < s.length) {
					if(s.length == 3) {
						t2 += "-";
					} else if(s.length == 6) {
						t2 += "-";
					}
				}
				
				oControl.setValue(t2);
				
				oController._oldSSNLength = t2.length;
				
			},
			
			onChangeZlsch : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				var vMolga = "";

				if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
				else vMolga = "10";
				
				var vSelectedKey = oEvent.getSource().getSelectedKey();
				
				var lBankl = $.app.byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankl");
				var lBankn = $.app.byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankn");
				
				if(vMolga == "08" && vSelectedKey == "C") {
					lBankl.setRequired(false);
					lBankn.setRequired(false);
				} else {
					lBankl.setRequired(true);
					lBankn.setRequired(true);
				}
			},
			
			checkNumber : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var s = oEvent.getParameter("value");
				
				if(isNaN(s)) {
					MessageBox.alert(oController.getBundleText("MSG_02131"));
					return;
				}
			},
			
			changeFirstName : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				if(oController._vMolga == "08" || oController._vMolga == "AE" ){
					var oRufnm = $.app.byId(oController.PAGEID + "_Sub01_Rufnm");
					if(oRufnm && oRufnm.getValue() == "") {
						oRufnm.setValue(oEvent.getParameter("value"));
					} 
				}
			},
			
			checkPostalCode : function(iLand1, iState, iPstlz) {
				var oController = $.app.getController(SUB_APP_ID);
				var oLand1 = $.app.byId(oController.PAGEID + iLand1);
				var oState = $.app.byId(oController.PAGEID + iState);
				var oPstlz = $.app.byId(oController.PAGEID + iPstlz);
				var fResult = true;
				
				if(oLand1 && oState && oPstlz) {
					if(oLand1.getValue() != "" && oPstlz.getValue() != "") {
						var vLand1 = oLand1.getCustomData()[0].getValue();
						var vState = "";
						if(oState.getMetadata().getName().toUpperCase() == "SAP.M.COMBOBOX") vState = oState.getSelectedKey();
						else  vState = oState.getCustomData()[0].getValue();
						var vPstlz = oPstlz.getValue();
						
						if(vState == "0000") vState = "";
						
						$.app.getModel("ZHR_COMMON_SRV").read("/PostalCodeCheckSet", {
							async: false,
							filters: [
								new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, vLand1),
								new sap.ui.model.Filter("State", sap.ui.model.FilterOperator.EQ, vState),
								new sap.ui.model.Filter("Pstlz", sap.ui.model.FilterOperator.EQ, vPstlz)
							],
							success: function() {
								fResult = true;
							},
							error: function (oError) {
								var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										Common.showErrorMessage(Err.error.message.value);
									}
									
								} else {
									Common.showErrorMessage(oError);
								}
								
								oPstlz.setValueState(sap.ui.core.ValueState.Error);
								fResult = false;
							}
						});
					}
				}
				
				return fResult;
			},
			
			checkCountryIdNum : function(vOneData, oIdNumControl) {
				var oController = $.app.getController(SUB_APP_ID);
				var fResult = true;
				var aFilters = [];
				
				if(vOneData && oIdNumControl) {
					var vIdnum = "";
					if(oIdNumControl.sId.indexOf("Numss") != -1){
						if(oController._vMolga == "46") {
							vIdnum = [vOneData.Idnum, vOneData.Nip00].join("/");
						} else {
							vIdnum = [vOneData.Idnum, vOneData.Cless].join("/");
						}
					} else {
						vIdnum = vOneData.Idnum;
					}

					aFilters = [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Idnum", sap.ui.model.FilterOperator.EQ, vIdnum)
					];

					oController._vCheckContryIdNum.forEach(function(elem) {
						aFilters.push(
							new sap.ui.model.Filter(elem, sap.ui.model.FilterOperator.EQ, 
								(elem === "Actda") ? new Date(oController._vActda) 
								: (elem === "Gbdat") ? new Date($.app.byId(oController.PAGEID + "_Sub01_Gbdat").getValue())
								: vOneData[elem])
						);
					});
					
					$.app.getModel("ZHR_COMMON_SRV").read("/CountryIdnumCheckSet", {
						async: false,
						filters: aFilters,
						success: function () {
							fResult = true;
						},
						error: function (oError) {
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									Common.log(Err.error.innererror.errordetails[0].severity); //warning
									Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									Common.showErrorMessage(Err.error.message.value);
								}
								
							} else {
								Common.showErrorMessage(oError);
							}
							
							oIdNumControl.setValueState(sap.ui.core.ValueState.Error);
							fResult = false;
						}
					});
				}
				
				return fResult;
			},
			// 특수 문자 체크
			checkNum : function(vFieldname, vData, oController){
				// eslint-disable-next-line no-useless-escape
				var re = /[~!@\#$%^&*\()\-=+_']/gi;
				if(typeof vData != "undefined" && vData != null && vData != ""){
					if(re.test(vData))
					{
						MessageBox.alert("Specify positive values only");
						var oControl = $.app.byId(oController.PAGEID + "_Sub01_"+vFieldname);
						oControl.setValueState(sap.ui.core.ValueState.Error);
						return false;
					}
				}
				return true;
			},
			
			getHiringPersonalInfomationLayout : function(oController) {
				var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
				
				var vHiringPersonalInfomationLayout = [];
				oController._vDeafultContry = {Land1 : "", Land1tx : "", Natiotx : ""};

				oModel.read("/HiringPersonalInfomationLayoutSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, oController._vMolga),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, oController._vActda)
					],
					success: function(data) {
						if(data && data.results) {
							for(var i=0; i<data.results.length; i++) {
								vHiringPersonalInfomationLayout.push(data.results[i]);
								if(data.results[i].Fieldname.toUpperCase() == "NATIO") oController._vDeafultContry.Natiotx = data.results[i].Dvalu;
								else if(data.results[i].Fieldname.toUpperCase() == "LAND1"){
									oController._vDeafultContry.Land1 = data.results[i].Dcode;
									oController._vDeafultContry.Land1tx = data.results[i].Dvalu;
								}
							}
						}
					},
					error: function(res) {
						Common.log(res);
					}
				});
				
				return vHiringPersonalInfomationLayout;
			},
			
			isExitsField : function(oController, Fieldname) {
				var vFiledInfo = null;
				for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
					var vFieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
					if(vFieldname.toUpperCase() == Fieldname.toUpperCase()) {
						vFiledInfo = oController._vHiringPersonalInfomationLayout[i];
						break;
					}
				}
				return vFiledInfo;
			},
			
			isExitsAddressField : function(oController, Fieldname, Subty) {
				var vFiledInfo = null;
				for(var i=0; i<oController._vAddressLayout.length; i++) {
					if(Subty == oController._vAddressLayout[i].Subty) {
						var vFieldname = oController._vAddressLayout[i].Fieldname;
						if(vFieldname.toUpperCase() == Fieldname.toUpperCase()) {
							vFiledInfo = oController._vAddressLayout[i];
							break;
						}
					}
				}
				return vFiledInfo;
			},
			
			makeControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vChangeData, vDefaultValues) {
				var oControl = null;
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				
				var vControlId = oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname;

				var oToolbar = null;
				
				if(Fieldtype == "M1" || Fieldtype == "O1") {
					if(Fieldname == "Famst") {
						oControl = new sap.m.ComboBox(vControlId, {
							width : "95%",
							change : oController.onChangeFamst ,
							enabled : !oController._DISABLED
						}).addStyleClass("L2PFontFamily");
					}else{
						oControl = new sap.m.ComboBox(vControlId, {
							width : "95%",
							change : oController.changeModifyContent,
							enabled : !oController._DISABLED
						}).addStyleClass("L2PFontFamily");
					}
					var vAddFilter = [
						{key : "Persa", value : oController._vPersa},
						{key : "Actda", value : oController._vActda}
					];
					
					var mDataModel = null;
					var vExcod = "";
					
					if(Fieldname.toLowerCase() == "state") {
						vExcod = "";
						if(vChangeData) vExcod = vChangeData.Land1;
						else {
							vExcod = oController.getDefaultValue(vDefaultValues, "Land1");
						}
						vAddFilter.push({key : "Excod", value : vExcod});
						mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);
						mDataModel.setSizeLimit(1000);
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname.toLowerCase() == "emecstate") {
						vExcod = "";
						if(vChangeData) vExcod = vChangeData.Emecland1;
						else vExcod = oController.getDefaultValue(vDefaultValues, "Emecland1");
						vAddFilter.push({key : "Excod", value : vExcod});
						mDataModel = oController.setSpecialCodeData("State", vAddFilter, true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname.toLowerCase() == "gbdep") {
						vExcod = "";
						if(vChangeData) vExcod = vChangeData.Gblnd;
						else vExcod = oController.getDefaultValue(vDefaultValues, "Gblnd");
						vAddFilter.push({key : "Excod", value : vExcod});
						mDataModel = oController.setSpecialCodeData("State", vAddFilter, true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname.toUpperCase() == "SEXORIENT") {
						mDataModel = oController.getDomainValueData("P08_SEXORIENT", [{key : "DomvalueL", value : oController._vMolga}], true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/DomainCodeListSet", new sap.ui.core.Item({key : "{DomvalueL}", text : "{Ddtext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname == "Titl2") {
						vAddFilter.push({key : "Excod", value : "S"});				
						mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname == "Titel") {
						vAddFilter.push({key : "Excod", value : "T"});				
						mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname == "Anred") {
						oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
						
						oControl.attachChange(oController.onChangeAnred);
						
						oControl.setSelectedKey(vUpdateValue);
					} else if(Fieldname == "Famst") {
						if(oController.isExitsField(oController, "Famdt") == null) {
							oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
							
							oControl.setSelectedKey(vUpdateValue);
						} else {
							oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
							
							oControl.setWidth("50%");
							oControl.setSelectedKey(vUpdateValue);
							
							var oFamdt = new sap.m.DatePicker(oController.PAGEID + "_" + oController._JobPage + "_Famdt", {
								width : "50%",
								valueFormat : "yyyy-MM-dd",
								displayFormat : gDtfmt,
								change : oController.changeDate, 
								enabled : !oController._DISABLED
							}).addStyleClass("L2PFontFamily");					
							
							if(vChangeData != null) {
								if(vChangeData.Famdt != null && vChangeData.Famdt != "") {
									var tDate = Common.setTime(new Date(vChangeData.Famdt));
									oFamdt.setValue(dateFormat.format(new Date(tDate)));
								}
							}
							
							oToolbar = new sap.m.Toolbar({
								width : "95%",
								content : [
										oControl,
										new sap.m.ToolbarSpacer(),
										oFamdt]
							}).addStyleClass("L2PToolbarNoBottomLine");
							
							if(!oController._DISABLED) oController.onChangeFamst();
							return oToolbar;
						}
						
					} else if(Fieldname == "Namzu") {
						vAddFilter.push({key : "Excod", value : "Z"});				
						mDataModel = oController.setSpecialCodeData("Namzu", vAddFilter, true);
						
						oControl.setModel(mDataModel);
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
						
						oControl.setSelectedKey(vUpdateValue);
						
					} else {
						oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
						
						oControl.setSelectedKey(vUpdateValue);
					}	
				} else if(Fieldtype == "M2" || Fieldtype == "O2") {
					if(Fieldname == "Orgeh") {
						oControl = new sap.m.Input(vControlId, {
							width : "95%", 
							showValueHelp: true,
							valueHelpOnly: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayOrgSearchDialog
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
					} else if(Fieldname == "Stell") {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: true,
							valueHelpOnly: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayStellSearchDialog
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
					} else {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
					}
				} else if(Fieldtype == "M3" || Fieldtype == "O3") {
					if(Fieldname == "Vorna") {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							liveChange : oController.onLiveChange,
							change : oController.changeFirstName,
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
					} else if(Fieldname == "Pstlz") {
						var fShowValueHelp = false; 
						if(vChangeData != null && vChangeData.Land1) {
							if(vChangeData.Land1 == "KR") {
								fShowValueHelp = true;
							}
						} else {
							if(oController.getDefaultValue(vDefaultValues, "Land1") == "KR") {
								fShowValueHelp = true;
							}
						}
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: fShowValueHelp,
							valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
							liveChange : oController.changeModifyContent,
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
					} else if(Fieldname == "Perid" || Fieldname == "Idnum") {				
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.attachLiveChange(oController.onLiveChange);
						oControl.setValue(vUpdateValue);
						
						if(oController._vMolga == "10") {
							oControl.addEventDelegate({
								onAfterRendering:function(){	
									$("#" + vControlId + "-inner").mask("999-99-9999",{placeholder:"XXX-XX-XXXX"});
								}
							});
						} else if(oController._vMolga == "41") {
							oControl.addEventDelegate({
								onAfterRendering:function(){	
									$("#" + vControlId + "-inner").mask("999999-9999999",{placeholder:"XXXXXX-XXXXXXX"});
								}
							});
						} else if(oController._vMolga == "08") {
							oControl.attachChange(oController.onToUpperCaseChange);
							oControl.addEventDelegate({
								onAfterRendering:function(){	
									$("#" + vControlId + "-inner").mask("aa999999a",{placeholder:"XX999999X"});
								}
							});
						}
					} else if(Fieldname == "Stras") {
						if(oController._vMolga == "18") {
							oToolbar = new sap.m.Toolbar({
								width : "95%",
								content : []
							}).addStyleClass("L2PToolbarNoBottomLine");
							
							var oStras = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Stras", {
								type : "Text",
								width : "45%",
								maxLength : vMaxLength,
								liveChange : oController.changeModifyContent,
								enabled : !oController._DISABLED
							});
							oStras.setTooltip(vLabelText);
							if(vChangeData != null) {
								oStras.setValue(vChangeData.Stras);
							}
							oToolbar.addContent(oStras);
							
							var vHsnmrInfo = oController.isExitsField(oController, "Hsnmr");
							if(vHsnmrInfo != null) {
								var oHsnmr = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Hsnmr", {
									type : "Text",
									width : "25%",
									maxLength : Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Hsnmr"),
									liveChange : oController.changeModifyContent,
									enabled : !oController._DISABLED
								});	
								oHsnmr.setTooltip(vHsnmrInfo.Label);
								if(vChangeData != null) {
									oHsnmr.setValue(vChangeData.Hsnmr);
								}
								oToolbar.addContent(new sap.m.Label({text : " / "}));
								oToolbar.addContent(oHsnmr);
							}		
							
							var vPostaInfo = oController.isExitsField(oController, "Posta");
							if(vPostaInfo != null) {
								var oPosta = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Posta", {
									type : "Text",
									width : "25%",
									maxLength : Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Posta"),
									liveChange : oController.changeModifyContent,
									enabled : !oController._DISABLED
								});
								oPosta.setTooltip(vPostaInfo.Label);
								if(vChangeData != null) {
									oPosta.setValue(vChangeData.Posta);
								}
								oToolbar.addContent(new sap.m.Label({text : " / "}));
								oToolbar.addContent(oPosta);
							}	
							
							return oToolbar;
						} else {
							oControl = new sap.m.Input(vControlId, {
								width : "95%",
								liveChange : oController.onLiveChange,
								maxLength : vMaxLength,
								enabled : !oController._DISABLED
							}).addStyleClass("L2PFontFamily");
							oControl.setValue(vUpdateValue);
						}
					}else if(Fieldname == "Anzkd") {
						oControl = new sap.m.Input(vControlId, {
							type : "Number",
							width : "95%",
							liveChange : oController.onLiveChangeAnzkd,
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
					}else if(Fieldname == "Nip00") {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
						oControl.addEventDelegate({
							onAfterRendering:function(){	
								$("#" + vControlId + "-inner").mask("999-999-99-99",{placeholder:"XXX-XXX-XX-XX"});
							}
						
						});
					}else {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							liveChange : oController.onLiveChange,
							maxLength : vMaxLength
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
					}
				} else if(Fieldtype == "M4" || Fieldtype == "O4") {
					oControl = new sap.m.DatePicker(vControlId, {
						width : "95%",
						valueFormat : "yyyy-MM-dd",
						displayFormat : gDtfmt,
						change : oController.changeDate, 
					}).addStyleClass("L2PFontFamily");
					if(vUpdateValue != null && vUpdateValue != "") {
						var tDate2 = Common.setTime(new Date(vUpdateValue));
						oControl.setValue(dateFormat.format(new Date(tDate2)));
					}
				}  else if(Fieldtype == "M5" || Fieldtype == "O5") {
					if(Fieldname.toUpperCase().indexOf("LAND1") != -1 || Fieldname.toUpperCase().indexOf("GBLND") != -1) {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: true,
							valueHelpOnly : true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.onDisplaySearchNatioDialog
						}).addStyleClass("L2PFontFamily");
						
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
					} 
					else {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: true,
							valueHelpOnly : true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayCodeSearchDialog
						}).addStyleClass("L2PFontFamily");
						
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : "Title",
							value : vLabelText
						}));
					}
				} else if(Fieldtype == "M6" || Fieldtype == "O6") {
					oControl = new sap.m.CheckBox(vControlId, {
						select : oController.onLiveChange
					}).addStyleClass("L2PFontFamily");
					if(vUpdateValue == "X") oControl.setSelected(true);
					if(vUpdateTextValue == "X") oControl.setSelected(true);
					else  oControl.setSelected(false);
				} else if(Fieldtype == "M7" || Fieldtype == "O7") {
					var vLand1 = ""; 
					if(vChangeData != null && vChangeData.Land1) {
						vLand1 = vChangeData.Land1;
					} else {
						vLand1 = oController.getDefaultValue(vDefaultValues, "Land1");
					}
					oControl = new sap.m.Input(vControlId, {
						width : "95%",
						change : oController.changeModifyContent,
						maxLength : vMaxLength
					}).addStyleClass("L2PFontFamily");
					oControl.addEventDelegate({
						onAfterRendering:function(){	
							oController.setTelInit(oController, oController._JobPage + "_" + Fieldname, vUpdateValue, vLand1);
						}
					});
				} else if(Fieldtype == "M8" || Fieldtype == "O8") {
					var mDomainModel = oController.getDomainValueData(Fieldname, [{key : "DomvalueL", value : oController._vMolga}], false);
					var vDomainValueList = mDomainModel.getProperty("/DomainCodeListSet");
					
					oControl = new sap.m.RadioButtonGroup(vControlId, {
						width : "95%"
					});			
					
					var vSelIdx ;
					if(vDomainValueList && vDomainValueList.length) {
						oControl.setColumns(vDomainValueList.length + 1);
						
						for(var i=0; i<vDomainValueList.length; i++) {
							var oRadio = new sap.m.RadioButton({
								text : vDomainValueList[i].Ddtext,
								width : "100px",
								groupName : Fieldname,
								customData : {key : "value", value : vDomainValueList[i].DomvalueL}
							});
							if(vUpdateValue == vDomainValueList[i].DomvalueL) {
								vSelIdx = i;
							}
							
							oControl.addButton(oRadio);
						}				
					}
					oControl.setSelectedIndex(vSelIdx);
				} else if(Fieldtype == "D0" || Fieldtype == "D1") {
					oControl = new sap.m.Input(vControlId, {
						width : "95%",
						editable : false,
					}).addStyleClass("L2PFontFamily");
					oControl.setValue(vUpdateValue);
				} 
				
				if(Fieldname != "Stras" && oControl) {
					oControl.setEnabled(!oController._DISABLED);
					oControl.setTooltip(vLabelText);
				}
				
				return oControl;
			},
			
			getEmpCodeField : function(oController) {
				var vExceptionFields = ["State","Emecstate","Sexorient","Titl2","Titel", "Gbdep","Namzu"];
				var vEmpCodeListFields = [];
				
				var oEmpCodeControlls = [
					{"Fieldname" : "Quali"}, //언어
					{"Fieldname" : "Slart"}, //학력
					{"Fieldname" : "Faccd"}, //전공
					{"Fieldname" : "Ansvx"}, //고용상태
					{"Fieldname" : "Serty"}, //병역상태구분
					{"Fieldname" : "Preas"}, //전역구분
					{"Fieldname" : "Jobcl"}, //병역종류
					{"Fieldname" : "Mrank"}, //병역계급
					{"Fieldname" : "Waers"}, //통화
					{"Fieldname" : "Racky"}, //민족
					{"Fieldname" : "Milsa"}, //병역상태
					{"Fieldname" : "Disab"}, //장애유형
					{"Fieldname" : "Auspr"}, //언어 숙련도
					{"Fieldname" : "Rctvc"},  //Municipal city code,
					{"Fieldname" : "P08disty"},  //장애유형
				];
				
				for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
					var Fieldname = Common.underscoreToCamelCase(oController._vHiringPersonalInfomationLayout[i].Fieldname),
						Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
					
					if(Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
						var fExcep = false;
						for(var j=0; j<vExceptionFields.length; j++) {
							if(Fieldname == vExceptionFields[j]) {
								fExcep = true;
								break;
							}
						}
						if(fExcep == false) {
							vEmpCodeListFields.push(oController._vHiringPersonalInfomationLayout[i]);
						}
					}
				}
				
				for(var k=0; k<oEmpCodeControlls.length; k++) {
					vEmpCodeListFields.push(oEmpCodeControlls[k]);
				}
				
				return vEmpCodeListFields;
			},
			
			getDomainValueData : function(Fieldname, vAddFilter, select) {
				var oController = $.app.getController(SUB_APP_ID);
				var mCodeModel = new JSONModel();
				var vCodeModel = {DomainCodeListSet : []};
				
				if(select) vCodeModel.DomainCodeListSet.push({Field : Fieldname, DomvalueL : "0000", Ddtext : oController.getBundleText("LABEL_02035")});

				var subFilters = [];
				vAddFilter.forEach(function(elem) {
					subFilters.push(
						new sap.ui.model.Filter(
							elem.key, 
							sap.ui.model.FilterOperator.EQ, 
							(elem.key === "Actda") ? new Date(elem.value) : elem.value
						)
					);
				});
				
				$.app.getModel("ZHR_COMMON_SRV").read("/DomainValueListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, Fieldname.toUpperCase()),
						new sap.ui.model.Filter({ filters: subFilters, and: true })
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCodeModel.DomainCodeListSet.push(oData.results[i]);
							}
							mCodeModel.setData(vCodeModel);	
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
				
				return mCodeModel;
			},
			
			getDefaultValue : function(vDefaultValues, vFieldname) {
				var vDefaultValue = "";
				if(vDefaultValues && vDefaultValues.length) {
					for(var d=0; d<vDefaultValues.length; d++) {
						if(vDefaultValues[d].Fieldname == vFieldname) {
							vDefaultValue = vDefaultValues[d].Code
							break;
						}
					}
				}
				return vDefaultValue;
			},
			
			setTelInit : function(oController, vTelId, vUpdateValue, vLand1) {
				var vPContry = vLand1.toLowerCase();
				
				var oTelControl = $("#" + oController.PAGEID + "_" + vTelId + "-inner");
				if(oTelControl) {
					oTelControl.intlTelInput({
						autoFormat: true,
						autoPlaceholder: false,
						defaultCountry: vPContry,
						utilsScript: "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/plugin/InitTel/utils.js"
					});
					
					var vTelno = vUpdateValue;
					oTelControl.intlTelInput("setNumber", vTelno);
					if(vTelno == "") {
						oTelControl.intlTelInput("selectCountry", vPContry);
					}				
				}
			},
			
			makeAddressControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vSavedData, vSubty) {
				var oControl = null;
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				
				var vControlId = oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname;
				
				if(Fieldtype == "M1" || Fieldtype == "O1") {
					oControl = new sap.m.ComboBox(vControlId, {
						width : "95%",
						change : oController.changeModifyContent,
					}).addStyleClass("L2PFontFamily");
					
					if(Fieldname == "State") {
						if(vSavedData == null) {
							oController.setDDLBState2(vUpdateValue, oController._vDeafultContry.Land1, vControlId);
						} else {
							oController.setDDLBState2(vUpdateValue, vSavedData.Land1, vControlId);
						}
						oControl.attachChange(oController.onChangeState);
					} else if(Fieldname == "Rctvc") {
						if(vSavedData == null) {
							oController.setCity(vUpdateValue, oController.PAGEID + "_Sub21_Form_" + vSubty + "_State", oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
						} else {
							oController.setCity(vUpdateValue, oController.PAGEID + "_Sub21_Form_" + vSubty + "_State", oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname, vSavedData.State);
						}
					} else {
						oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
						oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
						oControl.setSelectedKey(vUpdateValue);
					}
					
				} else if(Fieldtype == "M3" || Fieldtype == "O3") {
					if(Fieldname == "Stras") {
						if(oController._vMolga == "18") {
							var oToolbar = new sap.m.Toolbar({
								width : "95%",
								content : []
							}).addStyleClass("L2PToolbarNoBottomLine");
							
							var vTmpSubty = "";
							if(vSubty.indexOf("_") != -1) {
								vTmpSubty = vSubty.substring(0, vSubty.indexOf("_"));
							} else {
								vTmpSubty = vSubty;
							}
							
							var oStras = new sap.m.Input(vControlId, {
								type : "Text",
								width : "45%",
								maxLength : vMaxLength,
								liveChange : oController.changeModifyContent,
								enabled : !oController._DISABLED
							});
							oStras.setTooltip(vLabelText);
							if(vSavedData != null) {
								oStras.setValue(vSavedData.Stras);
							}
							oToolbar.addContent(oStras);
							
							var vHsnmrInfo = oController.isExitsAddressField(oController, "Hsnmr", vTmpSubty);
							if(vHsnmrInfo != null) {
								var oHsnmr = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + vSubty + "_Hsnmr", {
									type : "Text",
									width : "25%",
									maxLength : Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjectsAddress", "Hsnmr"),
									liveChange : oController.changeModifyContent,
									enabled : !oController._DISABLED
								});	
								oHsnmr.setTooltip(vHsnmrInfo.Label);
								if(vSavedData != null) {
									oHsnmr.setValue(vSavedData.Hsnmr);
								}
								oToolbar.addContent(new sap.m.Label({text : " / "}));
								oToolbar.addContent(oHsnmr);
							}		
							
							var vPostaInfo = oController.isExitsAddressField(oController, "Posta", vTmpSubty);
							if(vPostaInfo != null) {
								var oPosta = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + vSubty + "_Posta", {
									type : "Text",
									width : "25%",
									maxLength : Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjectsAddress", "Posta"),
									liveChange : oController.changeModifyContent,
									enabled : !oController._DISABLED
								});
								oPosta.setTooltip(vPostaInfo.Label);
								if(vSavedData != null) {
									oPosta.setValue(vSavedData.Posta);
								}
								oToolbar.addContent(new sap.m.Label({text : " / "}));
								oToolbar.addContent(oPosta);
							}	
							
							return oToolbar;
						} else {
							oControl = new sap.m.Input(vControlId, {
								width : "95%",
								liveChange : oController.changeModifyContent,
								maxLength : vMaxLength,
								enabled : !oController._DISABLED
							}).addStyleClass("L2PFontFamily");
							oControl.setValue(vUpdateValue);
						}
					} else {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							liveChange : oController.changeModifyContent,
							maxLength : vMaxLength,
							enabled : !oController._DISABLED
						}).addStyleClass("L2PFontFamily");
						oControl.setValue(vUpdateValue);
					}
				} else if(Fieldtype == "M4" || Fieldtype == "O4") {
					oControl = new sap.m.DatePicker(vControlId, {
						width : "95%",
						valueFormat : "yyyy-MM-dd",
						displayFormat : gDtfmt,
						change : oController.changeModifyDate,
					}).addStyleClass("L2PFontFamily");
					if(vUpdateValue != null && vUpdateValue != "") {
						var tDate = Common.setTime(new Date(vUpdateValue));
						oControl.setValue(dateFormat.format(new Date(tDate)));
					}
				} else if(Fieldtype == "M5" || Fieldtype == "O5") {
					if(Fieldname == "Land1") {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: true,
							valueHelpOnly: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.onDisplaySearchNatioDialog
						}).addStyleClass("L2PFontFamily");
					} else {
						oControl = new sap.m.Input(vControlId, {
							width : "95%",
							showValueHelp: true,
							valueHelpOnly: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayCodeSearchDialog
						}).addStyleClass("L2PFontFamily");
					}
					
					oControl.setValue(vUpdateTextValue);
					oControl.addCustomData(new sap.ui.core.CustomData({
						key : Fieldname,
						value : vUpdateValue
					}));
					oControl.addCustomData(new sap.ui.core.CustomData({
						key : "Title",
						value : vLabelText
					}));
				}
				
				if(oControl) {
					oControl.setEnabled(!oController._DISABLED);
					oControl.setTooltip(vLabelText);
				}
				
				return oControl;
			},
			
			makeAddressTelnr10 : function(oController, Subty, vAddressContext) {
				
				var oTelnr1 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr1", {
					type : "Number",
					width : "50px",
					maxLength : 3,
					liveChange : oController.changeTelnr,
					enabled : !oController._DISABLED
				});
				
				var oTelnr2 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr2", {
					type : "Number",
					width : "50px",
					maxLength : 3,
					liveChange : oController.changeTelnr,
					enabled : !oController._DISABLED
				});
				
				var oTelnr3 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr3", {
					type : "Number",
					width : "80px",
					maxLength : 4, 
					liveChange : oController.changeTelnr,
					enabled : !oController._DISABLED
				});
				
				var oTelnr = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr", {
					type : "Number",
					visible : true,
					enabled : !oController._DISABLED
				}).addStyleClass("L2PDisplayNone");
				
				if(vAddressContext != null && vAddressContext.Telnr) {
					oTelnr1.setValue(vAddressContext.Telnr.substring(0,3));
					oTelnr2.setValue(vAddressContext.Telnr.substring(3,6));
					oTelnr3.setValue(vAddressContext.Telnr.substring(6));
					oTelnr.setValue(vAddressContext.Telnr);
				}
				
				var oControl = new sap.m.Toolbar({
					width : "95%",
					content : [
						oTelnr1,
						new sap.m.Label({text : "", width: "10px"}),
						oTelnr2,
						new sap.m.Label({text : "-", width: "10px"}),
						oTelnr3, 
						oTelnr
					]
				}).addStyleClass("L2PToolbarNoBottomLine");
				
				return oControl;
			},
			
			changeTelnr : function(oEvent) {
				var vControlId = oEvent.getSource().getId();
				var vOrgin_ControlId = vControlId.substring(0, vControlId.length - 1);
				
				var oTelnr = $.app.byId(vOrgin_ControlId);
				var oTelnr1 = $.app.byId(vOrgin_ControlId + "1");
				var oTelnr2 = $.app.byId(vOrgin_ControlId + "2");
				var oTelnr3 = $.app.byId(vOrgin_ControlId + "3");
				
				oTelnr.setValue(oTelnr1.getValue() + oTelnr2.getValue() + oTelnr3.getValue());
			},
			
			onChangeAnred : function(oEvent) {
				var oController = $.app.getController(SUB_APP_ID);
				
				oController._vModifyContent = true;
				
				var sKey = oEvent.getSource().getSelectedKey();
				var oGesch = $.app.byId(oController.PAGEID + "_Sub01_Gesch");

				if(oController._vMolga == "08") {
					if(oGesch) {
						if(sKey == "1") oGesch.setSelectedIndex(2);
						else if(sKey == "2") oGesch.setSelectedIndex(0);
						else oGesch.setSelectedIndex(1);
					}
				}else{
					if(oGesch){
						for(var i=0; i< oController._vTitleGenderKeyList.length; i++){
							if(sKey == oController._vTitleGenderKeyList[i].Anred){
								if(oGesch instanceof sap.m.ComboBox){
									if(oController._vTitleGenderKeyList[i].Gesch != 0)
									oGesch.setSelecetdKey(parseInt(oController._vTitleGenderKeyList[i].Gesch)-1);
								}else if(oGesch instanceof sap.m.RadioButtonGroup){
									if(oController._vTitleGenderKeyList[i].Gesch != 0)
									oGesch.setSelectedIndex(parseInt(oController._vTitleGenderKeyList[i].Gesch)-1);
								}
								break;
							}
						}
					}
				}
			},
			
			onToUpperCaseChange : function(oEvent) {
				var oControl = oEvent.getSource();
				var vValue = oEvent.getParameter("value");
				if(vValue != "") {
					oControl.setValue(vValue.toUpperCase());
				}
			},
			
			_OSearchZzqualiEvent : null,
			
			SearchQualiDialog : function(){
				var oView = $.app.getView(SUB_APP_ID);
				var oController = $.app.getController(SUB_APP_ID);	
				
				oController._SelectedContext = null;
				
				if(!oController._OSearchZzqualiEvent) {
					oController._OSearchZzqualiEvent = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Zzquali", oController);
					oView.addDependent(oController._OSearchZzqualiEvent);
				}
				
				oController._OSearchZzqualiEvent.open();
				
				var oZzqualiCodeModel = sap.ui.getCore().getModel("ZzqualiCodeList");
				var vCode = { ZzqualiCodeListSet : [] };
				vCode.ZzqualiCodeListSet.push({Ecode : "", Etext : oController.getBundleText("LABEL_02279")});
				
				$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Zzquali"),
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)
					],
					success: function(oData) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCode.ZzqualiCodeListSet.push(oData.results[i]);
							}
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});

				oZzqualiCodeModel.setData(vCode);
			},
			
			onSearchQuali : function(oEvent){
				var sValue = oEvent.getParameter("value");
				
				var oFilters = [];
				oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
				
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oFilters);
			},
			
			onConfirmQuali : function(oEvent){
				var oController = $.app.getController(SUB_APP_ID);	
				var aContexts = oEvent.getParameter("selectedContexts");
				var oZzquali = $.app.byId(oController.PAGEID + "_Sub02_Zzquali");

				if (aContexts.length) {
					var vQuali = aContexts[0].getProperty("Ecode");
					var vQualitx = aContexts[0].getProperty("Etext");
					oZzquali.removeAllCustomData();
					if(vQualitx == oController.getBundleText("LABEL_02279")) oZzquali.setValue("");
					else oZzquali.setValue(vQualitx);
					
					oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : vQuali}));
				}
				
				oController.onCancelQuali(oEvent);
				
			},
			
			onCancelQuali : function(oEvent) {
				var oBinding = oEvent.getSource().getBinding("items");
				var oFilters = [];
				oBinding.filter(oFilters);
			},
		});
	}
);

// eslint-disable-next-line no-unused-vars
function fn_SetAddr(Zip, fullAddr, sido, sigungu) {
	var oController = $.app.getController("ZUI5_HR_ActApp.ActRecPInfo");
	var oLand1 = $.app.byId(oController.PAGEID + "_Sub01_Land1");	// 국가
	var oState = $.app.byId(oController.PAGEID + "_Sub01_State");	// 지역
	var oPstlz = $.app.byId(oController.PAGEID + "_Sub01_Pstlz");	// 우편번호
	var oOrt01 = $.app.byId(oController.PAGEID + "_Sub01_Ort1k");	// 시/구/군
	var oOrt02 = $.app.byId(oController.PAGEID + "_Sub01_Ort2k");	// 동/읍/면
	var statesArr = {
		"제주특별자치도": {key: "01", text: "제주도"},	// 제주도
		"전북": {key: "02", text: "전라북도"},	// 전라북도
		"전남": {key: "03", text: "전라남도"},	// 전라남도
		"충북": {key: "04", text: "충청북도"},	// 충청북도
		"충남": {key: "05", text: "충청남도"},	// 충청남도
		"인천": {key: "06", text: "인천광역시"},	// 인천광역시
		"강원": {key: "07", text: "강원도"},	// 강원도
		"광주": {key: "08", text: "광주광역시"},	// 광주광역시
		"경기": {key: "09", text: "경기도"},	// 경기도
		"경북": {key: "10", text: "경상북도"},	// 경상북도
		"경남": {key: "11", text: "경상남도"},	// 경상남도
		"부산": {key: "12", text: "부산광역시"},	// 부산광역시
		"서울": {key: "13", text: "서울특별시"},	// 서울특별시
		"대구": {key: "14", text: "대구광역시"},	// 대구광역시
		"대전": {key: "15", text: "대전광역시"},	// 대전광역시
		"울산": {key: "16", text: "울산광역시"},	// 울산광역시
		"세종특별자치시": {key: "22", text: "세종특별자치시"}	// 세종특별자치시
	};
	
	// {세종특별자치시}는 sigungu가 없음. sido로 대체
	sigungu = sigungu || sido.substr(0, 2);

	if(oLand1) {
		oLand1.setValue("대한민국");
		oLand1.removeAllCustomData();
		oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : "KR"}));
	}
	if(oState && statesArr[sido]) oState.setSelectedKey(statesArr[sido].key);
	if(oPstlz) oPstlz.setValue(Zip);
	if(oOrt01) oOrt01.setValue(sigungu);
	if(oOrt02) {
		var Ort02 = "",
			vIdx = fullAddr.indexOf(sigungu);
		if(vIdx > -1) {
			Ort02 = fullAddr.substring(vIdx + sigungu.length + 1);
		}

		oOrt02.setValue(Ort02);
	}
}