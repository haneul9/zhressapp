jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.EmpBasicInfoBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"common/ApprovalLinesHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler, ApprovalLinesHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.Detail", {

		PAGEID: "ZUI5_HR_WorkhomeDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		oData : null,
		oExtryn : "",

		EmployeeSearchCallOwner: null,

		getApprovalLinesHandler: function() {
			return this.ApprovalLinesHandler;
		},

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
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			this.oExtryn = Common.isExternalIP() === true ? "X" : "";
		
			var oData = {
				Data : {
					FromPageId : oEvent.data.FromPageId,
					Status : oEvent.data.Status,
					Werks : oController.getSessionInfoByKey("Persa")
				}
			};
			
			if(oEvent.data.Status != ""){
				oData.Data.Zdate1 = oEvent.data.Begda;
				
				oData.Data = $.extend(true, oData.Data, oEvent.data);
			}
			
			oController._DetailJSonModel.setData(oData);
			oController.onPressSearch(oEvent);
		},
		
		onAfterShow: function(){
			
		},
		
		onBack : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.Detail",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(){
			// var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			// var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
			
			// ????????? ?????? ?????? ?????? ??? ?????? ??????
            var value = oEvent.getParameters().value, today = new Date();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});

            if(parseFloat(dateFormat.format(new Date(value))) < parseFloat(dateFormat.format(today))){
            	sap.m.MessageBox.error(oController.getBundleText("MSG_53011")); // ????????? ?????? ????????? ????????? ??? ????????????.
            	oEvent.getSource().setValue("");
            	return;
            }
		},
		
		onSetInfo : function(Pernr){
			if(!Pernr) return;
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
		
			var oPhoto = "";
			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + (Pernr * 1) + "' and photoType eq '1'")
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
				 
			var vData = {};
				vData.photo = oPhoto;
				 
			// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			// var oModel = $.app.getModel("ZHR_COMMON_SRV");
			// var oPath = "/EmpSearchResultSet?$filter=Percod eq '" + encodeURIComponent(common.Common.encryptPernr($.app.getModel("session").getData().Pernr)) + "'";
			// 	oPath += " and Actty eq '" + gAuth + "'";
			// 	oPath += " and Actda eq datetime'" + dateFormat.format(new Date()) + "T00:00:00'";
			// 	oPath += " and Ename eq '" + Pernr + "'";
			// 	oPath += " and Persa eq '0AL1' and Stat2 eq '3'";
			// 	oPath += " and Bukrs eq '" + $.app.getModel("session").getData().Bukrs + "'";
			// 	oPath += " and ICusrid eq '" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "'";
			// 	oPath += " and ICusrse eq '" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "'";
			// 	oPath += " and ICusrpn eq '" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "'";
			// 	oPath += " and ICmenuid eq '" + $.app.getMenuId() + "'";
				
			// oModel.read(oPath, null, null, false,
			// 			function(data, oResponse) {
			// 				if(data && data.results.length) {
			// 					data.results[0].nickname = data.results[0].Ename;
			// 					data.results[0].Stext = data.results[0].Fulln;
	  //                      	data.results[0].PGradeTxt = data.results[0].ZpGradetx;
	  //                      	data.results[0].ZtitleT = data.results[0].Ztitletx;
	  //                      	data.results[0].Werks = data.results[0].Persa;
	                        	
			// 					Object.assign(vData, data.results[0]);
			// 				}
			// 			},
			// 			function(Res) {
			// 				oController.Error = "E";
			// 				if(Res.response.body){
			// 					ErrorMessage = Res.response.body;
			// 					var ErrorJSON = JSON.parse(ErrorMessage);
			// 					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
			// 						oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
			// 					} else {
			// 						oController.ErrorMessage = ErrorMessage;
			// 					}
			// 				}
			// 			}
			// );
			
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var createData = {TableIn : []};
				createData.IPernr = Pernr;
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				
			oModel.create("/HeaderSet", createData, {
				success: function(data){
					if(data){
						if(data.TableIn && data.TableIn.results){
								var data1 = data.TableIn.results[0];
								
								if(data1){
									$.extend(true, vData, data1);
								} else {
									sap.m.MessageBox.error(oController.getBundleText("MSG_48015"), { // ????????? ?????? ??? ????????? ?????????????????????.
										onClose : oController.onBack
									});
									return;
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
			
			oController._DetailJSonModel.setProperty("/User", vData);
			// oController._DetailJSonModel.setProperty("/Data/photo", vData.photo);
			// oController._DetailJSonModel.setProperty("/Data/nickname", vData.nickname);
			// oController._DetailJSonModel.setProperty("/Data/Stext", vData.Stext);
			// oController._DetailJSonModel.setProperty("/Data/PGradeTxt", vData.PGradeTxt);
			// oController._DetailJSonModel.setProperty("/Data/ZtitleT", vData.ZtitleT);
			oController._DetailJSonModel.setProperty("/Data/Bukrs", vData.Bukrs2);
			oController._DetailJSonModel.setProperty("/Data/Molga", vData.Molga);
			// oController._DetailJSonModel.setProperty("/Data/Werks", vData.Persa);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
			}

			// 2021-05-13 ????????? ????????? ?????? : Defyn == "X"??? ?????? default ???????????? ????????????. 
			// 2021-06-16 ?????? ????????? ?????? ??????
			// var oRow = sap.ui.getCore().byId(oController.PAGEID + "_AppNameRow");
			// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// 	oAppName.destroyItems();
			// 	oAppName.setValue("");
			
			// var oModel2 = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
			// var createData2 = {ApprlistNav : []};
			// 	createData2.IPernr = Pernr;
			// 	createData2.IExtryn = oController.oExtryn;
			// 	createData2.IZappSeq = "39";
			// 	createData2.IBukrs = vData.Bukrs2;
			// 	createData2.IMobyn = "";
			// 	createData2.IAppkey = "";
			// 	createData2.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
			// 	createData2.IPrcty = "1";

			// oModel2.create("/ApprListSet", createData2, {
			// 	success: function(data, res){
			// 		if(data){
			// 			if(data.ApprlistNav && data.ApprlistNav.results){
			// 					var data1 = data.ApprlistNav.results;
								
			// 					if(data1){
			// 						for(var i=0; i<data1.length; i++){
			// 							oAppName.addItem(
			// 								new sap.ui.core.Item({
			// 									key : data1[i].AppName,
			// 									text : data1[i].AppText
			// 								})
			// 							);

			// 							if(data1[i].Defyn == "X"){
			// 								oController._DetailJSonModel.setProperty("/Data/AppName", data1[i].AppName);
			// 							}
			// 						}
			// 					}
			// 				}
			// 		}
			// 	},
			// 	error: function (oError) {
			//     	var Err = {};
			//     	oController.Error = "E";
							
			// 		if (oError.response) {
			// 			Err = window.JSON.parse(oError.response.body);
			// 			var msg1 = Err.error.innererror.errordetails;
			// 			if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
			// 			else oController.ErrorMessage = Err.error.message.value;
			// 		} else {
			// 			oController.ErrorMessage = oError.toString();
			// 		}
			// 	}
			// });

			// if(oController.Error == "E"){
			// 	oController.Error = "";
			// 	sap.m.MessageBox.error(oController.ErrorMessage);
			// }

			// // ???????????? ???????????? ????????? ????????? row??? invisible ????????????.
			// if(oAppName.getItems().length == 0){
			// 	oController._DetailJSonModel.setProperty("/Data/AppName", "");
			// 	oRow.addStyleClass("displayNone");
			// } else {
			// 	oRow.removeStyleClass("displayNone");
			// }	
		},
		
		// ????????? ?????? ??? pernr
		onPressSearch : function(oEvent, pernr){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var search = function(){
				
				if(oData.Status == "" || (pernr && pernr != "")){
					// ?????????
					oController.onSetInfo((pernr && pernr != "" ? pernr : oController.getSessionInfoByKey("Pernr")));
					
					var vData = {
						FromPageId : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
						Status : oController._DetailJSonModel.getProperty("/Data/Status"),
						Bukrs : oController._DetailJSonModel.getProperty("/Data/Bukrs"),
						Molga : oController._DetailJSonModel.getProperty("/Data/Molga"),
						Pernr : (pernr && pernr != "" ? pernr : oController.getSessionInfoByKey("Pernr")),
						Werks : oController._DetailJSonModel.getProperty("/Data/Werks"),
						AppName : oController._DetailJSonModel.getProperty("/Data/AppName")
					};
					
					oController._DetailJSonModel.setProperty("/Data", vData);
				} else {
					// ?????????
					oController.onSetInfo(oData.Pernr);
				}
				
				oController._BusyDialog.close();
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// ?????? ??????
		onDeleteDate : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
			
			oController._DetailJSonModel.setProperty("/Data/Zdate" + Flag, "");
		},

		onRequest : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data"),
				validationData = [];
			
			// validation check
			for(var i=1; i<=5; i++){
				var date = oData["Zdate" + i];
				if(date && date != ""){
					var detail = {};
						detail.Begda = "\/Date(" + common.Common.getTime(new Date(date)) + ")\/";

					if(validationData.length > 0){
						for(var j=0; j<validationData.length; j++){
							if(validationData[j].Begda == detail.Begda){
								sap.m.MessageBox.error(oController.getBundleText("MSG_53012")); // ???????????? ????????? ???????????????.
								return;
							}
						}
					}
					
					validationData.push(detail);
				}
			}
			
			if(validationData.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53006")); // ?????????????????? ?????? ?????? ???????????? ????????????.
				return;
			} else if(!oData.Telnum || oData.Telnum.trim() == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53007")); // ???????????? ???????????? ????????????.
				return;
			}

			if(Common.isExternalIP()) {   // ????????? ?????? ???????????? ??????
				setTimeout(function() {
					var initData = {
						Mode: "P", // PC ??? P, Mobile - M
						Pernr: oData.Pernr,
						Empid: oController.getSessionInfoByKey("Pernr"),
						Bukrs: oData.Bukrs,
						ZappSeq: "39"
					},
					callback = function(o) {
						oController.onPressSave.call(oController, Flag, o);   // ????????? Dialog?????? ?????? ?????? ????????? ?????? ?????? Function
					};
		
					oController.ApprovalLinesHandler = ApprovalLinesHandler.get(oController, initData, callback);
					DialogHandler.open(oController.ApprovalLinesHandler);
				}, 0);
			} else {
				oController.onPressSave.call(oController, Flag, []); // ???????????? ?????? ?????? ?????? Function ??????
			}
		},
		
		// ?????? (Flag : C ??????, D ??????)
		onPressSave : function(Flag, vAprdatas){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var createData = {WorkhomeNav : [], WorkhomeTabNav : (vAprdatas ? vAprdatas : [])};
			
			// validation check
			for(var i=1; i<=5; i++){
				var date = oData["Zdate" + i];
				if(date && date != ""){
					var detail = {};
						detail.Pernr = oData.Pernr;
						detail.Bukrs = oData.Bukrs;
						detail.Begda = "\/Date(" + common.Common.getTime(new Date(date)) + ")\/"; 
						detail.Endda = "\/Date(" + common.Common.getTime(new Date(date)) + ")\/"; 
						detail.Telnum = oData.Telnum;
						detail.Bigo = oData.Bigo;
						detail.Appkey = oData.Appkey ? oData.Appkey : "";
						detail.Appkey1 = oData.Appkey1 ? oData.Appkey1 : "";
						detail.AppName = oData.AppName ? oData.AppName : "";

					if(createData.WorkhomeNav.length > 0){
						for(var j=0; j<createData.WorkhomeNav.length; j++){
							if(createData.WorkhomeNav[j].Begda == detail.Begda){
								sap.m.MessageBox.error(oController.getBundleText("MSG_53012")); // ???????????? ????????? ???????????????.
								return;
							}
						}
					}
					
					createData.WorkhomeNav.push(detail);
				}
			}
			
			if(createData.WorkhomeNav.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53006")); // ?????????????????? ?????? ?????? ???????????? ????????????.
				return;
			} else if(!oData.Telnum || oData.Telnum.trim() == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53007")); // ???????????? ???????????? ????????????.
				return;
			}

			// 2021-05-11 ????????? ???????????? ?????? ?????? ????????? ?????? ?????? ??????
			// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// if(oAppName.getItems().length != 0){
			// 	if(!oData.AppName){
			// 		sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // ???????????? ???????????? ????????????.
			// 		return;
			// 	}
			// }
			
			var confirmMessage = "", successMessage = "";
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

					createData.IPernr = oData.Pernr;
					createData.IEmpid = oController.getSessionInfoByKey("Pernr");
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = Flag == "C" ? "3" : "4";
					createData.IExtryn = oController.oExtryn;
					
				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							// 2021-05-04 ????????? ????????? ??????
							if(data.WorkhomeNav.results && data.WorkhomeNav.results.length){
								oController._DetailJSonModel.setProperty("/Data/Appkey", data.WorkhomeNav.results[0].Appkey);
								oController._DetailJSonModel.setProperty("/Data/Appkey1", data.WorkhomeNav.results[0].Appkey1);
							}

							if(Flag == "C"){
								if(!oController._ImageDialog){
									oController._ImageDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Image", oController);
									oView.addDependent(oController._ImageDialog);
								}
								
								oController._ImageDialog.getModel().setData({Data : {Url : data.EUrl}});
								
								oController._ImageDialog.open();
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				if(Flag != "C"){
					sap.m.MessageBox.success(successMessage, {
						onClose : oController.onBack
					});
				}
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			if(Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_00060"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_00061"); // ?????????????????????.
			} else {
				confirmMessage = oController.getBundleText("MSG_00059"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_00021"); // ?????????????????????.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		openSMOIN : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
			
			var oUrl = oController._ImageDialog.getModel().getProperty("/Data/Url");
			
			oController._ImageDialog.close();
		
			// 2021-05-07 ?????????url??? ?????? ?????? ????????? ??????
			// if(oExtryn == ""){
			if(oUrl != ""){
				if(common.Common.openPopup.call(oController, oUrl) == false){
					return;
				}
			}
				
			sap.m.MessageBox.success(oController.getBundleText("MSG_00061"), { // ?????????????????????.
				onClose : oController.onBack
			});
		},
		
		searchOrgehPernr : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();
			
			if(Flag && Flag == "X"){
				oController.oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				oController.oData = null;
			}
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: "",
                autoClose : false
            },
            callback = function(o) {
				var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
				var oController = oView.getController();
				
				if(o.Otype == "O"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48016")); // ???????????? ???????????? ????????????.
					return;
				}
			
				oController.onPressSearch(null, o.Objid);
    			
    			oController.OrgOfIndividualHandler.getDialog().close();
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
		/**
         * @brief ??????-???????????? > ???????????? ?????? ?????? event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();

			return !$.app.getController().EmployeeSearchCallOwner 
					? oController.openOrgSearchDialog(oEvent)
					: $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);			
		},

		openOrgSearchDialog : function(oEvent){
			var oController = $.app.getController();

			SearchOrg.oController = oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				$.app.getView().addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

		onESSelectPerson : function(data){
			return this.EmployeeSearchCallOwner 
					? this.EmployeeSearchCallOwner.setSelectionTagets(data)
					: this.onSelectPerson(data);
		},

		onSelectPerson : function(data){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.Detail");
			var oController = oView.getController();

			oController.onPressSearch(null, data.Pernr);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});