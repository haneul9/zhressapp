/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "PerinfoNewEmp",

            _vCurrentTabKey: "",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _LicenseJSonModel: new sap.ui.model.json.JSONModel(),
            _BasicJSonModel: new sap.ui.model.json.JSONModel(),
            _AddressJSonModel: new sap.ui.model.json.JSONModel(),
            _SchoolJSonModel: new sap.ui.model.json.JSONModel(),
            _CarJSonModel: new sap.ui.model.json.JSONModel(),
            _CareerJSonModel: new sap.ui.model.json.JSONModel(),
            _AnnouncementJSonModel: new sap.ui.model.json.JSONModel(),
            _EvalJSonModel: new sap.ui.model.json.JSONModel(),
            EmpSearchResult: new sap.ui.model.json.JSONModel(),
            EmployeeModel: new common.EmployeeModel(),
			doubleRendering : "",	
			
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            onBeforeShow: function (oEvent) {
                var oController = this;
                
                if(oEvent.data && oEvent.data.FromPageId){
        			sap.ui.getCore().byId(oController.PAGEID + "_IconBar").setSelectedKey(oController._ListCondJSonModel.getProperty("/Data/Key"));
        			oController.onPressSearch(oController);
        		} else {
        			// code list //
					var field = [{name : "Gesch", code : "GESCH", code2 : "004"}, // 인적사항-성별
								 {name : "Zzclass", code : "ZCLASS", code2 : "004"}, // 인적사항-생일 양/음력
								 {name : "Famst", code : "", code2 : "007"}, // 인적사항-결혼여부
								 {name : "Natio", code : "", code2 : "009"}, // 인적사항-국적
								 {name : "Mrank", code : "17", code2 : "999"}, // 병역사항-계급
								 {name : "Serty", code : "18", code2 : "999"}, // 병역사항-병역유형
								 {name : "Jobcl", code : "19", code2 : "999"}, // 병역사항-보직분류
								 {name : "Zzarmy", code : "20", code2 : "999"}, // 병역사항-역종
								 {name : "Recmd", code : "11", code2 : "999"}, // 보훈사항-채용방법
								 {name : "Conty", code : "12", code2 : "999"}, // 보훈사항-유형
								 {name : "Relat", code : "13", code2 : "999"}, // 보훈사항-관계
								 {name : "Zzorg", code : "14", code2 : "999"}, // 보훈사항-관할보훈청
								 {name : "Chaty", code : "15", code2 : "999"}, // 장애사항-장애유형
								 {name : "Discc", code : "16", code2 : "999"}] // 장애사항-장애등급
					var list = [];			 
					for(var i=0; i<field.length; i++){
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + field[i].name);
							oControl.destroyItems();
							
						oController.retrieveCommonCode({CodeT : field[i].code2, CodeTy: field[i].code, Control : oControl});
					}
					
					Promise.all(list)
					.then(function () {
						oController._ListCondJSonModel.setData({Data : {}});
	                	oController.onPressSearch(oController);
	                });
        		}
            },

            onAfterShow: function(oEvent){
        		
            },
            
            onChangeDate : function(oEvent){
				var oController = $.app.getController();
				
				if(oEvent && oEvent.getParameters().valid == false){
					sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식 입니다.
					oEvent.getSource().setValue("");
				}	
            },

            handleTabBarSelect: function (oEvent) {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                
                var sKey = sap.ui.getCore().byId(oController.PAGEID + "_IconBar").getSelectedKey();
                switch(sKey){
                	// 첨부파일 refresh
                	case "02":
                	case "07":
                	case "08":
                		oController.onPressSearch2();
                		break;
                }
                
                oController._ListCondJSonModel.setProperty("/Data/Key", sKey);
            },

            onPressSearch : function(oEvent){
            	var oController = $.app.getController();
            	
            	var sKey = sap.ui.getCore().byId(oController.PAGEID + "_IconBar").getSelectedKey();
            	
            	var search = function(){
            		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
            			vData = {Key : sKey};
            			
            		var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3"),
            			oJSONModel3 = oTable3.getModel(),
            			vData3 = {Data : []};
            			
            		var oTable4 = sap.ui.getCore().byId(oController.PAGEID + "_Table4"),
            			oJSONModel4 = oTable4.getModel(),
            			vData4 = {Data : []};
            			
            		var oTable5 = sap.ui.getCore().byId(oController.PAGEID + "_Table5"),
            			oJSONModel5 = oTable5.getModel(),
            			vData5 = {Data : []};
            			
            		var oModel = $.app.getModel("ZHR_PERS_INFO_SRV"); 
            		
            		var createData = {NewEmpinfoBasicNav : [], NewEmpinfoFileNav : [], NewEmpinfoAddrNav : [],
									  NewEmpinfoEduNav : [], NewEmpinfoCareerNav : [], NewEmpinfoArmyNav : [],
									  NewEmpinfoVeteranNav : [], NewEmpinfoDisableNav : []};
						createData.IConType = "2";
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
					
					oModel.create("/NewEmpinfoSet", createData, {
						success: function(data){
							if(data){
								// 인적사항
								if(data.NewEmpinfoBasicNav && data.NewEmpinfoBasicNav.results.length){
									var data1 = data.NewEmpinfoBasicNav.results[0];          
										data1.Regno = data1.Regno.replace(/[^0-9\.]/g, "");
										data1.Regno1 = data1.Regno.substring(0,6);
										data1.Regno2 = data1.Regno.substring(6);
										data1.Zzbdate = data1.Zzbdate ? dateFormat.format(new Date(common.Common.setTime(data1.Zzbdate))) : "";
										data1.Famdt = data1.Famdt ? dateFormat.format(new Date(common.Common.setTime(data1.Famdt))) : null;
									
									$.extend(true, vData, data1);
								}
								
								// 입사서류
								if(data.NewEmpinfoFileNav && data.NewEmpinfoFileNav.results.length){
									$.extend(true, vData, data.NewEmpinfoFileNav.results[0]);
								} 
								
								// 주소정보
								if(data.NewEmpinfoAddrNav && data.NewEmpinfoAddrNav.results.length){
									var data3 = data.NewEmpinfoAddrNav.results;
									for(var i=0; i<data3.length; i++){
										vData3.Data.push(data3[i]);
									}
								}
								
								// 학력정보
								if(data.NewEmpinfoEduNav && data.NewEmpinfoEduNav.results.length){
									var data4 = data.NewEmpinfoEduNav.results;
									for(var i=0; i<data4.length; i++){
										data4[i].Begda = data4[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data4[i].Begda))) : null;
										data4[i].Endda = data4[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data4[i].Endda))) : null;
										data4[i].Zzlmark = data4[i].Zzlmark == "X" ? true : false;
										
										vData4.Data.push(data4[i]);
									}
								}
								
								// 경력
								if(data.NewEmpinfoCareerNav && data.NewEmpinfoCareerNav.results.length){
									var data5 = data.NewEmpinfoCareerNav.results;
									for(var i=0; i<data5.length; i++){
										data5[i].Begda = data5[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data5[i].Begda))) : null;
										data5[i].Endda = data5[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data5[i].Endda))) : null;
										
										vData5.Data.push(data5[i]);
									}
								}
								
								// 병역
								if(data.NewEmpinfoArmyNav && data.NewEmpinfoArmyNav.results.length){
									var data6 = data.NewEmpinfoArmyNav.results[0];
										data6.Begda = data6.Begda ? dateFormat.format(new Date(common.Common.setTime(data6.Begda))) : null;
										data6.Endda = data6.Endda ? dateFormat.format(new Date(common.Common.setTime(data6.Endda))) : null;
										data6.Zrotc = data6.Zrotc == "X" ? true : false;
										
									$.extend(true, vData, data6);
								}
								
								// 보훈
								if(data.NewEmpinfoVeteranNav && data.NewEmpinfoVeteranNav.results.length){
									var data7 = data.NewEmpinfoVeteranNav.results[0];
										data7.Appnm2 = data7.Appnm;
									
									delete data7.Appnm;
									
									$.extend(true, vData, data7);
								}
								
								// 장애
								if(data.NewEmpinfoDisableNav && data.NewEmpinfoDisableNav.results.length){
									var data8 = data.NewEmpinfoDisableNav.results[0];
										data8.Idate = data8.Idate ? dateFormat.format(new Date(common.Common.setTime(data8.Idate))) : null;
										data8.Appnm2 = data8.Appnm;
										
									delete data8.Appnm;
									
									$.extend(true, vData, data8);
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
					oController._ListCondJSonModel.setData({Data : vData});
					
					// table binding
					oJSONModel3.setData(vData3);
					oJSONModel4.setData(vData4);
					oJSONModel5.setData(vData5);
					
					if(oController.Error == "E"){
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage);
						return;
					}
            	}
            	
            	oController._BusyDialog.open();
            	setTimeout(search, 100);
            },
            
            onPressSearch2 : function(oEvent){
            	var oController = $.app.getController();
            	
            	var sKey = sap.ui.getCore().byId(oController.PAGEID + "_IconBar").getSelectedKey(),
            		vAppnm = "", oPromise = [];
            		
            	if(sKey == "02"){
            		vAppnm = oController._ListCondJSonModel.getProperty("/Data/Appnm");
            		
            		oPromise = [
            			Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76018"), // 주민등록등본
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "001"
                                );
                            }.bind(oController)
                        ),
                        Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76091"), // 주민등록초본
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "002"
                                );
                            }.bind(oController)
                        ),
                        Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76020"), // 가족관계증명서
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "003"
                                );
                            }.bind(oController)
                        ),
                        Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76021"), // 사진
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "004"
                                );
                            }.bind(oController)
                        )
            		];
            	} else if(sKey == "07"){
            		vAppnm = oController._ListCondJSonModel.getProperty("/Data/Appnm2");
            		oPromise = [
            			Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76089"), // 보훈증 사본
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "008"
                                );
                            }.bind(oController)
                        )
            		];
            	} else if(sKey == "08"){
            		vAppnm = oController._ListCondJSonModel.getProperty("/Data/Appnm2");
            		oPromise = [
						Common.getPromise(
                            function () {
                                fragment.COMMON_ATTACH_FILES.setAttachFile(
                                    oController,
                                    {
                                        Label: oController.getBundleText("LABEL_76090"), // 장애인증 사본
                                        Appnm: vAppnm,
                                        Mode: "S",
                                        ReadAsync: true,
                                        UseMultiCategories: true,
                                        Editable: true
                                    },
                                    "009"
                                );
                            }.bind(oController)
                        )	
            		];
            	} else {
            		return;
            	}
            	
            	setTimeout(
                    function () {
                        fragment.COMMON_ATTACH_FILES.once.call(oController, vAppnm).then(
                            function () {
                                Promise.all(oPromise).then(function () {
                                    // $.app.byId(oController.PAGEID + "_FilesBox").setBusy(false);
                                });
                            }.bind(oController)
                        );
                    }.bind(oController),
                    100
                );	
            },
            
            retrieveCommonCode: function (opt) {
            	return Common.getPromise(function () {
                    $.app.getModel("ZHR_COMMON_SRV").create(
                        "/CommonCodeListHeaderSet",
                        {
                            IBukrs: this.getSessionInfoByKey("Bukrs2"),
                            IMolga: this.getSessionInfoByKey("Molga"),
                            ILangu: this.getSessionInfoByKey("Langu"),
                            ICodeT: opt.CodeT,
							ICodty: Common.checkNull(opt.CodeTy) ? "" : opt.CodeTy,
							ICode: Common.checkNull(opt.Code) ? "" : opt.Code,
                            NavCommonCodeList: []
                        },
                        {
                            async: true,
                            success: function (data) {
                                if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                    var data1 = data.NavCommonCodeList.results;
                                    
                                    if(opt.Control && opt.Array == true){
                                    	var oList = opt.Control;
                                    	var oJSONModel = oList.getModel();
                                    	var vData = {Data : data1};
                                    	
                                    	oJSONModel.setData(vData);
                                    	
                                    	if(opt.After && typeof opt.After === "function") opt.After();
                                    	
                                    } else if(opt.Control){
                                    	if(opt.CodeT == "009"){
	                                    	var Land1 = [];
	                                    	
	                                    	for(var i=0; i<data1.length; i++){
												if(data1[i].Code == "KR"){
													Land1.unshift({key : data1[i].Code, text : data1[i].Text});
												} else {
													Land1.push({key : data1[i].Code, text : data1[i].Text});
												}
											}
											
											for(var i=0; i<Land1.length; i++){
												opt.Control.addItem(
													new sap.ui.core.Item({
														key : Land1[i].key,
														text : Land1[i].text
													})
												);
											}
	                                    } else {
	                                    	for(var i=0; i<data1.length; i++){
		                                    	opt.Control.addItem(
		                                    		new sap.ui.core.Item({key : data1[i].Code, text : data1[i].Text})
		                                    	);
		                                    }
	                                    }
                                    }
                                }
                            },
                            error: function (oError) {
                            	var Err = {}, ErrorMessage = "";
                                if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									var msg1 = Err.error.innererror.errordetails;
									if(msg1 && msg1.length) ErrorMessage = Err.error.innererror.errordetails[0].message;
									else ErrorMessage = Err.error.message.value;
								} else {
									ErrorMessage = oError.toString();
								}
								
								sap.m.MessageBox.error(ErrorMessage);
								
								if(opt.After && typeof opt.After === "function"){
									$.app.getController()._BusyDialog.close();
								};
                            }
                        }
                    );
				}.bind(this))
				// .then(typeof opt.After === "function" ? opt.After() : undefined);
            },
            
            onSelectTable : function(oEvent){
            	var oController = $.app.getController();
            	var oView = oController.getView();
            	
            	var sKey = sap.ui.getCore().byId(oController.PAGEID + "_IconBar").getSelectedKey(),
            		oDetail = "";
            		
            	switch(sKey){
            		case "03": // 주소정보
            			oDetail = "ZUI5_HR_PerinfoNewEmp.m.Detail_Address";
            			break;
        			case "04": // 학력사항
        				oDetail = "ZUI5_HR_PerinfoNewEmp.m.Detail_School";
        				break;
        			case "05": // 경력사항
        				oDetail = "ZUI5_HR_PerinfoNewEmp.m.Detail_Career";
        				break;
            	}
            	
            	if(oDetail == "") return;
            	
            	var oData = oEvent ? oEvent.getSource().getCustomData()[0].getValue() : {};
            	
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				    id : oDetail,
				    data : $.extend(true, {FromPageId : "ZUI5_HR_PerinfoNewEmp.m.List", Editable : (oEvent ? false : true)}, oData)
				});
            },
            
            // 저장 전 validation check 로직 + detail 데이터 return
            getSaveData : function(vIConType){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.List");
				var oController = oView.getController();
				
				var oData = oController._ListCondJSonModel.getProperty("/Data"),
					detail = [];
					
				switch(vIConType){
					case "S1": // 인적사항 저장
						if((oData.Regno1 != "" && oData.Regno1.length != 6) || (oData.Regno2 != "" && oData.Regno2.length != 7)){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76003")); // 주민등록번호를 입력하여 주십시오.
							return false;
						}
					
						detail.push({
							Pernr : oData.Pernr,
							Lnmhg : oData.Lnmhg, Fnmhg : oData.Fnmhg,
							Lnmch : oData.Lnmch, Fnmch : oData.Fnmch,
							Nachn : oData.Nachn, Vorna : oData.Vorna,
							Regno : (oData.Regno1 + oData.Regno2),
							Gesch : oData.Gesch,
							Zzbdate : oData.Zzbdate ? "\/Date(" + common.Common.getTime(new Date(oData.Zzbdate)) + ")\/" : null,
							Zzclass : oData.Zzclass,
							Famst : oData.Famst,
							Famdt : oData.Famdt && oData.Famdt != "" ? "\/Date(" + common.Common.getTime(new Date(oData.Famdt)) + ")\/" : null,
							Natio : oData.Natio
						});
						break;
					case "S3": // 주소정보 저장
						var oData2 = oController._AddressDialog.getModel().getProperty("/Data");
						
						if(!oData2.Pstlz || oData2.Pstlz.trim() == ""){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76004")); // 우편번호를 입력하여 주십시오.
							return false;
						} else if((!oData2.State) || (!oData2.Ort1k || oData2.Ort1k.trim() == "") || (!oData2.Ort2k || oData2.Ort2k.trim() == "")){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76005")); // 주소를 입력하여 주십시오.
							return false;
						} else if(!oData2.Stras || oData2.Stras.trim() == ""){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76006")); // 상세주소를 입력하여 주십시오.
							return false;
						} else if(!oData2.Telnr || oData2.Telnr.trim() == ""){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76007")); // 전화번호를 입력하여 주십시오.
							return false;
						}
						
						detail.push({
							Pernr : oData.Pernr,
							Anssa : oData2.Anssa,
							Land1 : oData2.Land1,
							Pstlz : oData2.Pstlz, State : oData2.State, Ort1k : oData2.Ort1k, Ort2k : oData2.Ort2k,
							Stras : oData2.Stras, Telnr : oData2.Telnr
						});
						break;
					case "S4": // 학력사항 저장
						var oData2 = oController._SchoolDialog.getModel().getProperty("/Data");
						
						detail.push({
							Pernr : oData.Pernr,
							Begda : oData2.Begda ? "\/Date(" + common.Common.getTime(new Date(oData2.Begda)) + ")\/" : null,
							Endda : oData2.Endda ? "\/Date(" + common.Common.getTime(new Date(oData2.Endda)) + ")\/" : null,
							Slart : oData2.Slart, Sland : oData2.Sland, Ausbi : oData2.Ausbi, Insti : oData2.Insti,
							Slabs : oData2.Slabs, Sltp1 : oData2.Sltp1, Zzlmark : (oData2.Zzlmark && oData2.Zzlmark == true ? "X" : "")
						});
						break;
					case "S5": // 경력사항 저장
						var oData2 = oController._CareerDialog.getModel().getProperty("/Data");
						
						detail.push({
							Pernr : oData.Pernr,
							Begda : oData2.Begda ? "\/Date(" + common.Common.getTime(new Date(oData2.Begda)) + ")\/" : null,
							Endda : oData2.Endda ? "\/Date(" + common.Common.getTime(new Date(oData2.Endda)) + ")\/" : null,
							Arbgb : oData2.Arbgb, Ort01 : oData2.Ort01, Land1 : oData2.Land1,
							Zztitle : oData2.Zztitle, Zzjob : oData2.Zzjob
						});
						break;
					case "S6": // 병역사항 저장
						detail.push({
							Pernr : oData.Pernr,
							Begda : oData.Begda ? "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/" : null,
							Endda : oData.Endda ? "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/" : null,
							Mrank : oData.Mrank, Serty : oData.Serty, Jobcl : oData.Jobcl, Earrt : oData.Earrt,
							Zzarmy : oData.Zzarmy, Serut : oData.Serut, Rsexp : oData.Rsexp, Idnum : oData.Idnum,
							Zrotc : (oData.Zrotc && oData.Zrotc == true ? "X" : "")
						});
						break;
					case "S7": // 보훈사항 저장
						detail.push({
							Pernr : oData.Pernr,
							Recmd : oData.Recmd, Conty : oData.Conty, Relat : oData.Relat,
							Conid : oData.Conid, Zzorg : oData.Zzorg
						});
						break;
					case "S8": // 장애사항 저장
						detail.push({
							Pernr : oData.Pernr,
							Chaty : oData.Chaty,
							Idate : oData.Idate ? "\/Date(" + common.Common.getTime(new Date(oData.Idate)) + ")\/" : null,
							Discc : oData.Discc,
							Chaid : oData.Chaid
						});
						break;
					case "D3": // 주소정보 삭제
						var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table3"),
							oIndices = oTable.getSelectedIndices();
							
						if(oIndices.length == 0){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76008")); // 삭제할 데이터를 선택하여 주십시오.
							return false;
						}
						
						for(var i=0; i<oIndices.length; i++){
							var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
							var oData2 = oTable.getModel().getProperty(sPath);
							
							detail.push({
								Pernr : oData.Pernr,
								Begda : oData2.Begda ? "\/Date(" + common.Common.getTime(new Date(oData2.Begda)) + ")\/" : null,
								Endda : oData2.Endda ? "\/Date(" + common.Common.getTime(new Date(oData2.Endda)) + ")\/" : null,
								Anssa : oData2.Anssa,
								Land1 : oData2.Land1,
								Pstlz : oData2.Pstlz, State : oData2.State, Ort1k : oData2.Ort1k, Ort2k : oData2.Ort2k,
								Stras : oData2.Stras, Telnr : oData2.Telnr
							});
						}
						break;
					case "D4": // 학력사항 삭제
						var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table4"),
							oIndices = oTable.getSelectedIndices();
							
						if(oIndices.length == 0){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76008")); // 삭제할 데이터를 선택하여 주십시오.
							return false;
						}
						
						for(var i=0; i<oIndices.length; i++){
							var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
							var oData2 = oTable.getModel().getProperty(sPath);
							
							detail.push({
								Pernr : oData.Pernr,
								Begda : oData2.Begda ? "\/Date(" + common.Common.getTime(new Date(oData2.Begda)) + ")\/" : null,
								Endda : oData2.Endda ? "\/Date(" + common.Common.getTime(new Date(oData2.Endda)) + ")\/" : null,
								Slart : oData2.Slart, Sland : oData2.Sland, Ausbi : oData2.Ausbi, Insti : oData2.Insti,
								Slabs : oData2.Slabs, Sltp1 : oData2.Sltp1, Zzlmark : (oData2.Zzlmark && oData2.Zzlmark == true ? "X" : "")
							});
						}
						break;
					case "D5": // 경력사항 삭제
						var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table5"),
							oIndices = oTable.getSelectedIndices();
							
						if(oIndices.length == 0){
							sap.m.MessageBox.error(oController.getBundleText("MSG_76008")); // 삭제할 데이터를 선택하여 주십시오.
							return false;
						}
						
						for(var i=0; i<oIndices.length; i++){
							var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
							var oData2 = oTable.getModel().getProperty(sPath);
							
							detail.push({
								Pernr : oData.Pernr,
								Begda : oData2.Begda ? "\/Date(" + common.Common.getTime(new Date(oData2.Begda)) + ")\/" : null,
								Endda : oData2.Endda ? "\/Date(" + common.Common.getTime(new Date(oData2.Endda)) + ")\/" : null,
								Arbgb : oData2.Arbgb, Ort01 : oData2.Ort01, Land1 : oData2.Land1,
								Zztitle : oData2.Zztitle, Zzjob : oData2.Zzjob
							});
						}
						break;
					default:
						return false;
						break;
				}
				
				return detail;
            },
            
            onPressSave : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.List");
				var oController = oView.getController();
				
				var sKey = sap.ui.getCore().byId(oController.PAGEID + "_IconBar").getSelectedKey(),
					vIConType = "S" + (sKey * 1);
					
        		var data = oController.getSaveData(vIConType);
        		if(data == false) return;
        		
        		var confirmMessage = "", successMessage = "";
        		if(vIConType.substring(0,1) == "S"){
        			confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까? 
        			successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
        		} else {
        			confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
        			successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
        		}
        		
            	var process = function(){
            		// 첨부파일 저장
            		var oAppnm = "", uFiles = [];
            		switch(vIConType){
            			case "S4":
							uFiles = ["007"];
            				break;
            			case "S5":
            				uFiles = ["006"];
            				break;
            			case "S7":
            				uFiles = ["008"];
            				break;
        				case "S8":
        					uFiles = ["009"];
        					break;
            		}
            		
            		if(uFiles.length > 0 && (fragment.COMMON_ATTACH_FILES.getFileLength(oController, uFiles[0]) != 0)){
        				oAppnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
		                data[0].Appnm = oAppnm;
            		}
            		
	            	var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
	            	var createData = {NewEmpinfoBasicNav : vIConType == "S1" ? data : [], 
	            					  NewEmpinfoFileNav : vIConType == "S2" ? data : [], 
	            					  NewEmpinfoAddrNav : (vIConType == "S3" || vIConType == "D3") ? data : [],
									  NewEmpinfoEduNav : (vIConType == "S4" || vIConType == "D4") ? data : [], 
									  NewEmpinfoCareerNav : (vIConType == "S5" || vIConType == "D5") ? data : [], 
									  NewEmpinfoArmyNav : vIConType == "S6" ? data : [],
									  NewEmpinfoVeteranNav : vIConType == "S7" ? data : [], 
									  NewEmpinfoDisableNav : vIConType == "S8" ? data : []};
						createData.IConType = vIConType;
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
						
					oModel.create("/NewEmpinfoSet", createData, {
						success: function(data){
							if(data){
								
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
					
					sap.m.MessageBox.success(successMessage, {
						onClose : oController.onPressSearch
					});
            	}
            	
            	sap.m.MessageBox.confirm(confirmMessage, {
            		actions : ["YES", "NO"],
            		onClose : function(fVal){
            			if(fVal && fVal == "YES"){
            				oController._BusyDialog.open();
            				setTimeout(process, 100);
            			}
            		}
            	});
            }, 
            
        	// 입사서류 저장
            onPressSave2 : function(oController, vPage){
            	if(!(vPage == "001" || vPage == "002" || vPage == "003" || vPage == "004")) return;
            	
				var process = function(){
					var oAppnm = oController._ListCondJSonModel.getProperty("/Data/Appnm");
					
					var uFiles = [];
	                for (var i=1; i<=4; i++) uFiles.push("00" + i);
	                
	                var oAppnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
	                
	                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
	            	var createData = {NewEmpinfoFileNav : [{Pernr : oController._ListCondJSonModel.getProperty("/Data/Pernr"), Appnm : oAppnm}]};
						createData.IConType = "S2";
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
						
					oModel.create("/NewEmpinfoSet", createData, {
						success: function(data){
							if(data){
								
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
					
					oController.onPressSearch();
				}

                oController._BusyDialog.open();
                setTimeout(process, 100);
            },
            
        });
    }
);
