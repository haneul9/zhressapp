sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"common/SearchUserMobile"
	],
	function (Common, CommonController, JSONModelHelper, SearchUserMobile) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",
			
			_vCurrentTabKey: "",
			_BusyDialog : new sap.m.BusyDialog(),
			_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
			_LicenseJSonModel : new sap.ui.model.json.JSONModel(),
			_BasicJSonModel : new sap.ui.model.json.JSONModel(),
			_AddressJSonModel : new sap.ui.model.json.JSONModel(),
			_SchoolJSonModel : new sap.ui.model.json.JSONModel(),
			_CarJSonModel : new sap.ui.model.json.JSONModel(),
			_CareerJSonModel : new sap.ui.model.json.JSONModel(),
			_AnnouncementJSonModel : new sap.ui.model.json.JSONModel(),
			EmpSearchResult  : new sap.ui.model.json.JSONModel(),
			EmployeeModel: new common.EmployeeModel(),

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				if(!this._ListCondJSonModel.getProperty("/Data") || this._ListCondJSonModel.getProperty("/Data") == ""){
					var vData = {
						Data : Object.assign({Auth : gAuth}, this.getView().getModel("session").getData())
					};
					this._ListCondJSonModel.setData(vData);	
				}
				
				if(oEvent && oEvent.data && oEvent.data.Pernr){
					this._ListCondJSonModel.setProperty("/Data/Pernr", oEvent.data.Pernr);
					this._ListCondJSonModel.setProperty("/Data/Ename", oEvent.data.Ename);
					var oIconBar = sap.ui.getCore().byId(this.PAGEID + "_IconBar");
					oIconBar.setSelectedKey("Basic");
					// this.handleTabBarSelect(this, "X");
					oIconBar.fireSelect();
				}
				// else if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") return;
			},

			onAfterShow: function () {

			},

			handleTabBarSelect: function(oEvent) {
				var oController = $.app.getController();
				var sKey = oEvent.getParameter("selectedKey");
				if(!sKey || sKey == ""){
					sKey = "Basic";
				}else if(this._vCurrentTabKey === sKey) return;
				
				this._vCurrentTabKey = sKey;
								
				switch(this._vCurrentTabKey){
					case "Basic" :
						oController.onPressSearchBasic();
						break;
					case "Address" :
						oController.onPressSearchAddress();
						break;
					case "Car" :
						oController.onPressSearchCar();
						break;
					case "School" :
						oController.onPressSearchSchool();
						break;
					case "License" :
						oController.onPressSearchLicense();
						break;
					case "Career" :
						oController.onPressSearchCareer();
						break;
					case "Announcement" :
						oController.onPressSearchAnnouncement();
						break;		
						
						
				}
			},
			
			onPressSearchBasic : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.oView.getModel("session").getData().Dtfmt});
				var vData = {Data : {}}; 
				var search = function(){
					var oPath = "";
					var createData = {PinfoBasicNav : []};
					
					// Address
					oPath = "/PerinfoBasicSet";
					createData.IPernr =   oData.Pernr; 
					createData.IConType = "1";
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
	
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.PinfoBasicNav && data.PinfoBasicNav.results.length > 0){
									vData.Data = data.PinfoBasicNav.results[0];
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
					vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
					vData.Data.Zzbdate = vData.Data.Zzbdate ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Zzbdate))) : null;
					vData.Data.Dat01 = vData.Data.Dat01 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat01))) : null;
					vData.Data.Dat02 = vData.Data.Dat02 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat02))) : null;
					oController._BasicJSonModel.setProperty("/Data",vData.Data);
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
			
			onPressSearchAddress : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {PinfoAddressNav : []};
					
					// Address
					oPath = "/PerinfoAddressSet";
					createData.IPernr =  oData.Pernr; 
					createData.IConType = "1";
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2 ;
						
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.PinfoAddressNav && data.PinfoAddressNav.results){
									for(var i=0; i<data.PinfoAddressNav.results.length; i++){
										data.PinfoAddressNav.results[i].Idx = (i+1);
										vData.Data.push(data.PinfoAddressNav.results[i]);
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
					
					oController._AddressJSonModel.setData(vData);
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
			
			onPressSearchCar : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {TableIn : []};
					
					oPath = "/PerinfoCarmanagerSet";
					createData.IPernr =  oData.Pernr; 
					createData.IConType = "1";
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2 ;
						
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.TableIn && data.TableIn.results.length > 0){
									vData.Data = data.TableIn.results[0];
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
					vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
					oController._CarJSonModel.setProperty("/Data",vData.Data);
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
			
			onPressSearchLicense : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.oView.getModel("session").getData().Dtfmt});
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {TableIn : []};
					
					oPath = "/PerRecordLicenseSet";
					createData.IPernr =  oData.Pernr; 
					createData.IConType = "1";
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
					createData.ILangu = oController.getView().getModel("session").getData().Langu;
									
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.TableIn && data.TableIn.results){
									for(var i=0; i<data.TableIn.results.length; i++){
										data.TableIn.results[i].GetDate = data.TableIn.results[i].GetDate ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].GetDate))) : null ;
										vData.Data.push(data.TableIn.results[i]);
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
					
					oController._LicenseJSonModel.setData(vData);
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
			
			onPressSearchCareer : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.oView.getModel("session").getData().Dtfmt});
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {TableIn : []};
					
					oPath = "/PerRecordCareerSet";
					createData.IPernr =  oData.Pernr; 
					createData.IConType = "1";
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
					createData.ILangu = oController.getView().getModel("session").getData().Langu;
									
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.TableIn && data.TableIn.results){
									for(var i=0; i<data.TableIn.results.length; i++){
										data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null ;
										data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null ;
										data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
										vData.Data.push(data.TableIn.results[i]);
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
					
					oController._CareerJSonModel.setData(vData);
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
			
			onPressSearchAnnouncement : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.oView.getModel("session").getData().Dtfmt});
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {TableIn : []};
					
					oPath = "/PerRecordAnnouncementSet";
					createData.IPernr =  oData.Pernr; 
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
					createData.ILangu = oController.getView().getModel("session").getData().Langu;
									
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.TableIn && data.TableIn.results){
									for(var i=0; i<data.TableIn.results.length; i++){
										data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null ;
										vData.Data.push(data.TableIn.results[i]);
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
					
					oController._AnnouncementJSonModel.setData(vData);
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
			
			//학력사항
			onPressSearchSchool : function(){
				var oController = $.app.getController();
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.oView.getModel("session").getData().Dtfmt});
				var vData = {Data : []};
				
				var search = function(){
					var oPath = "";
					var createData = {TableIn : []};
					
					oPath = "/PerRecordScholarshipSet";
					createData.IPernr =  oData.Pernr; 
					createData.IConType = "1";
					createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
					createData.ILangu = oController.getView().getModel("session").getData().Langu;
									
					var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
					oModel.create(oPath, createData, null,
						function(data){
							if(data){
								if(data.TableIn && data.TableIn.results){
									for(var i=0; i<data.TableIn.results.length; i++){
										data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null ;
										data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? 
												dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null ;
										data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
										data.TableIn.results[i].Zzlmark = data.TableIn.results[i].Zzlmark == "X" ? true : false ;
										vData.Data.push(data.TableIn.results[i]);
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
					
					oController._SchoolJSonModel.setData(vData);
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
			
			moveSearch : function(){
				var oController = $.app.getController();
				var vData = Object.assign(oController.getView().getModel("session").getData());
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : "ZUI5_HR_Perinfo.m.FacilityDetail",
				      data : {
				    	  FromPageId : "ZUI5_HR_Perinfo.m.List",
				    	  Session : vData
				      }
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null
		});
	}
);