/* eslint-disable no-eval */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/EmployeeModel",
        "common/OrgOfIndividualHandler",
		"common/AttachFileAction",
		"sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModelHelper, EmployeeModel, OrgOfIndividualHandler, AttachFileAction, MessageBox) {
        "use strict";

        return CommonController.extend("ZUI5_HR_PerinfoNewEmp.List", {
            PAGEID: "PerinfoNewEmp",
            _BusyDialog: new sap.m.BusyDialog(),
            
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                this.getView().addStyleClass("sapUiSizeCompact");
            },

            onBeforeShow: function () {
                var oController = this;
				
				// code list //
				var field = [{name : "Gesch", code : "GESCH", code2 : "004"}, // 인적사항-성별
							 {name : "Zzclass", code : "ZCLASS", code2 : "004"}, // 인적사항-생일 양/음력
							 {name : "Famst", code : "", code2 : "007"}, // 인적사항-결혼여부
							 {name : "Mrank", code : "17", code2 : "999"}, // 병역사항-계급
							 {name : "Serty", code : "18", code2 : "999"}, // 병역사항-병역유형
							 {name : "Jobcl", code : "19", code2 : "999"}, // 병역사항-보직분류
							 {name : "Earrt", code : "21", code2 : "999"}, // 병역사항-전역사유
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
				///////////////
				
				
            },

            onAfterShow: function () {
                
            },
            
            onChangeDate : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				if(oEvent && oEvent.getParameters().valid == false){
					sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식 입니다.
					oEvent.getSource().setValue("");
				}
            }, 
            
            onPressSearch : function(oController){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				var search = function(){
					var vData = {Appnm2 : ""},
						dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
						
					var resetTable = function(oTable){
						var oColumns = oTable.getColumns();
						for(var i=0; i<oColumns.length; i++){
							oColumns[i].setSorted(false);
							oColumns[i].setFiltered(false);
						}
					}
						
					var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3"),
						oJSONModel3 = oTable3.getModel(),
						vData3 = {Data : []};
						resetTable(oTable3);
						
					var oTable4 = sap.ui.getCore().byId(oController.PAGEID + "_Table4"),
						oJSONModel4 = oTable4.getModel(),
						vData4 = {Data : []};
						resetTable(oTable4);
					
					var oTable5 = sap.ui.getCore().byId(oController.PAGEID + "_Table5"),
						oJSONModel5 = oTable5.getModel(),
						vData5 = {Data : []};
						resetTable(oTable5);
					
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
										data3[i].Address = data3[i].Bezei + " " + data3[i].Ort1k + " " + data3[i].Ort2k + " " + data3[i].Stras;
										
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
					
					for(var i=3; i<=5; i++){
						eval("oJSONModel" + i + ".setData(vData" + i + ");");
						eval("oTable" + i + ".bindRows('/Data');");
						eval("oTable" + i + ".setVisibleRowCount(vData" + i + ".Data.length > 10 ? 10 : vData" + i + ".Data.length);");
					}
					
					oController.onPressSearch2(oController, vData.Appnm, vData.Appnm2);
					
					if(oController.Error == "E"){
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage);
						return;
					}	
				};
				
				oController._BusyDialog.open();
				setTimeout(search, 100);
				
            },
            
            onPressSearch2 : function(oController, vAppnm, vAppnm2){
            	$.app.byId(oController.PAGEID + "_FilesBox").setBusy(true);
            	
            	if(!vAppnm){
            		vAppnm = "";	
            	}
            	
            	if(!vAppnm2){
            		vAppnm2 = "";
            	}
            	
            	setTimeout(
                    function () {
                        fragment.COMMON_ATTACH_FILES.once.call(oController, vAppnm).then(
                            function () {
                                Promise.all([
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
                                                    Label: oController.getBundleText("LABEL_76019"), // 주민등록초본(주소, 병역 포함)
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
                                    ),
                                    Common.getPromise(
                                        function () {
                                            fragment.COMMON_ATTACH_FILES.setAttachFile(
                                                oController,
                                                {
                                                    Label: oController.getBundleText("LABEL_76089"), // 보훈증 사본
                                                    Appnm: vAppnm2,
                                                    Mode: "S",
                                                    ReadAsync: true,
                                                    UseMultiCategories: true,
                                                    Editable: true
                                                },
                                                "008"
                                            );
                                        }.bind(oController)
                                    ),
                                    Common.getPromise(
                                        function () {
                                            fragment.COMMON_ATTACH_FILES.setAttachFile(
                                                oController,
                                                {
                                                    Label: oController.getBundleText("LABEL_76090"), // 장애인증 사본
                                                    Appnm: vAppnm2,
                                                    Mode: "S",
                                                    ReadAsync: true,
                                                    UseMultiCategories: true,
                                                    Editable: true
                                                },
                                                "009"
                                            );
                                        }.bind(oController)
                                    )
                                ]).then(function () {
                                    $.app.byId(oController.PAGEID + "_FilesBox").setBusy(false);
                                });
                            }.bind(oController)
                        );
                    }.bind(oController),
                    100
                );	
            },
            
            // 주소정보 추가
            onAddAddress : function(oEvent, Readonly){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				if(!oController._AddressDialog){
					oController._AddressDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Address", oController);
					oView.addDependent(oController._AddressDialog);
					
					// 주소유형
					var oAnssa = sap.ui.getCore().byId(oController.PAGEID + "_Adress-Anssa");
					oController.retrieveCommonCode({CodeT : "003", CodeTy : "0006", Control : oAnssa});
					
					// 국가
					var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Address-Land1");
					oController.retrieveCommonCode({CodeT : "009", Control : oLand1});
				}
				
				var oData = {};
				if(Readonly && Readonly == "X"){
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
					var sPath = oEvent.getParameters().rowBindingContext.sPath;
					
					oData = $.extend(true, {}, oTable.getModel().getProperty(sPath));
					oData.Editable = false;
				} else {
					oData.Editable = true;
				}
				
				oController._AddressDialog.getModel().setData({Data : oData});
				
				if(oData.Editable == false){
					oController.onChangeLand1();
				}
				
				oController._AddressDialog.open();
            },
            
            // 국가 변경 시 지역 리스트 생성
            onChangeLand1 : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				var oLand1 = oController._AddressDialog.getModel().getProperty("/Data/Land1");
				var oState = sap.ui.getCore().byId(oController.PAGEID + "_Address-State");
					oState.destroyItems();
					
				if(!oLand1 || oLand1 == ""){
					
				} else {
					oController.retrieveCommonCode({CodeT : "010", CodeTy : oLand1, Control : oState});
				}
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
                                    // opt.Model.setProperty(opt.Path, data.NavCommonCodeList.results);
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
            
            // 경력정보 추가
            onAddCareer : function(oEvent, Readonly){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				if(!oController._CareerDialog){
					oController._CareerDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Career", oController);
					oView.addDependent(oController._CareerDialog);
					
					// 국가
					var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Career-Land1");
					oController.retrieveCommonCode({CodeT : "009", Control : oLand1});
				}
				
				oController._BusyDialog.open();
				
				var oData = {};
				if(Readonly && Readonly == "X"){
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table5");
					var sPath = oEvent.getParameters().rowBindingContext.sPath;
					
					oData = $.extend(true, {}, oTable.getModel().getProperty(sPath));
					oData.Editable = false;
				} else {
					oData.Editable = true;
				}
				
				oController._CareerDialog.getModel().setData({Data : oData});
				
				// 경력증명서 첨부파일 refresh
				var vAppnm = oData.Appnm ? oData.Appnm : "";
            	
            	setTimeout(
                    function () {
                        fragment.COMMON_ATTACH_FILES.once.call(oController, vAppnm).then(
                            function () {
                                Promise.all([
                                    Common.getPromise(
                                        function () {
                                            fragment.COMMON_ATTACH_FILES.setAttachFile(
                                                oController,
                                                {
                                                    Label: oController.getBundleText("LABEL_76077"), // 경력증명서
                                                    Appnm: vAppnm,
                                                    Mode: "S",
                                                    ReadAsync: true,
                                                    UseMultiCategories: true,
                                                    Editable: oData.Editable
                                                },
                                                "006"
                                            );
                                        }.bind(oController)
                                    )
                                ]).then(function () {
                            	   oController._BusyDialog.close();
                                   oController._CareerDialog.open();
                                });
                            }.bind(oController)
                        );
                    }.bind(oController),
                    100
                );	
            },
            
            //  학력사항 추가
            onAddSchool : function(oEvent, Readonly){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				if(!oController._SchoolDialog){
					oController._SchoolDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.School", oController);
					oView.addDependent(oController._SchoolDialog);
					
					// code list //
					var field = [{name : "Slart", code : "01"}, // 학교구분
								 {name : "Sland", codeT : "009"}] // 국가
								 
					for(var i=0; i<field.length; i++){
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_School-" + field[i].name);
							oControl.destroyItems();
							
						oController.retrieveCommonCode({CodeT : (field[i].codeT ? field[i].codeT : "999"), CodeTy: (field[i].code ? field[i].code : "" ), Control : oControl});
					}
				}
				
				oController._BusyDialog.open();
				
				// 학위 combobox list 삭제
				sap.ui.getCore().byId(oController.PAGEID + "_School-Slabs").destroyItems();
				
				var oData = {};
				if(Readonly && Readonly == "X"){
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table4");
					var sPath = oEvent.getParameters().rowBindingContext.sPath;
					
					oData = $.extend(true, {}, oTable.getModel().getProperty(sPath));
					oData.Editable = false;
				} else {
					oData.Editable = true;
					oData.Zzlmark = false;
				}
				
				oController._SchoolDialog.getModel().setData({Data : oData});
				if(oData.Editable == false){
					oController.onChangeSlart();
				}
				
				// 최종학교 학력증명서 첨부파일 refresh
				var vAppnm = oData.Appnm ? oData.Appnm : "";
            	
            	setTimeout(
                    function () {
                        fragment.COMMON_ATTACH_FILES.once.call(oController, vAppnm).then(
                            function () {
                                Promise.all([
                                    Common.getPromise(
                                        function () {
                                            fragment.COMMON_ATTACH_FILES.setAttachFile(
                                                oController,
                                                {
                                                    Label: oController.getBundleText("LABEL_76068"), // 최종학교 학력증명서
                                                    Appnm: vAppnm,
                                                    Mode: "S",
                                                    ReadAsync: true,
                                                    UseMultiCategories: true,
                                                    Editable: oData.Editable
                                                },
                                                "007"
                                            );
                                        }.bind(oController)
                                    )
                                ]).then(function () {
                            	   oController._BusyDialog.close();
                                   oController._SchoolDialog.open();
                                });
                            }.bind(oController)
                        );
                    }.bind(oController),
                    100
                );	
            },
            
            // 학력사항-학교구분 변경 시 Event
            onChangeSlart : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				var oJSONModel = oController._SchoolDialog.getModel();
				
				var oSlart = oJSONModel.getProperty("/Data/Slart");
				
				// 교육기관구분, 학교, 전공, 학위, 최종학력여부 clear
				if(oEvent){
					oJSONModel.setProperty("/Data/Ausbi", "");
					oJSONModel.setProperty("/Data/Insti", "");
					oJSONModel.setProperty("/Data/Sltp1", "");
					oJSONModel.setProperty("/Data/Sltp1tx", "");
					oJSONModel.setProperty("/Data/Slabs", "");
					oJSONModel.setProperty("/Data/Zzlmark", false); 
				}
				
				var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_School-Slabs");
					oSlabs.destroyItems();
					
				if(oSlart){
					// 학교구분이 존재하는 경우만 학위 리스트 생성
					oController.retrieveCommonCode({CodeT : "999", CodeTy: "04", Code : oSlart, Control : oSlabs});
				}
            },
            
            // 교육기관구분/전공 선택 팝업
            // field - Ausbi 교육기관구분, Sltp1 전공
            onSearchSchoolCode : function(oEvent, field){ 
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
				if(!oController._SchoolCodeDialog){
					oController._SchoolCodeDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.School-code", oController);
					oView.addDependent(oController._SchoolCodeDialog);
				}
				
				oController._SchoolCodeDialog.getModel().setData({Data : {Flag : field}});
				
				// validation check
				var oSlart = oController._SchoolDialog.getModel().getProperty("/Data/Slart");
				if(!oSlart || oSlart == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_76001")); // 학교구분을 선택하십시오.
					return;
				}
				
				// code list 생성
				oController._BusyDialog.open();
				
				var oList = sap.ui.getCore().byId(oController.PAGEID + "_SchoolCodeList");
					oList.getModel().setData({Data : []});
					
				if(field == "Ausbi"){
					oController.retrieveCommonCode({CodeT : "999", CodeTy : "03", Code : oSlart, Control : oList, Array : true, 
													After : function(){
																oController._BusyDialog.close();
																oController._SchoolCodeDialog.open();
															}
						
					});
				} else {
					oController.retrieveCommonCode({CodeT : "999", CodeTy : "05", Code : oSlart, Control : oList, Array : true, 
													After : function(){
																oController._BusyDialog.close();
																oController._SchoolCodeDialog.open();
															}
						
					});					
				}
            },
            
            onPressTable : function(oEvent){
            	
            },
            
            // 저장 전 validation check 로직 + detail 데이터 return
            getSaveData : function(vIConType){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
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
							Famdt : oData.Famdt && oData.Famdt != "" ? "\/Date(" + common.Common.getTime(new Date(oData.Famdt)) + ")\/" : null
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
            
            onPressSave : function(vIConType){
            	if(!vIConType) return;
            	
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List");
				var oController = oView.getController();
				
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
					
					switch(vIConType){
						case "S3":
							oController._AddressDialog.close();
							break;
						case "S5":
							oController._CareerDialog.close();
							break;
						case "S4":
							oController._SchoolDialog.close();
							break;
						default:
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
            	console.log(vPage);
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
            
			/**
             * @brief [공통]부서/사원 조직도호출
             */
            searchOrgehPernr: function (oController) {
                //var oModel = this.Model(),
                var initData = {
                        Percod: this.getSessionInfoByKey("Percod"),
                        Bukrs: this.getSessionInfoByKey("Bukrs2"),
                        Langu: this.getSessionInfoByKey("Langu"),
                        Molga: this.getSessionInfoByKey("Molga"),
                        Datum: new Date(),
                        Mssty: $.app.getAuth()
                    },
                    callback = function (o) {
                        //전체 조회 OData 호출
                        if (o.Otype === "P") {
                            oController.onPressSearchAll(o.Objid, oController.getView().getModel("session").getData().Bukrs2);
                        }
                    };

                this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
            },

            getOrgOfIndividualHandler: function () {
                return this.OrgOfIndividualHandler;
            },

            onESSelectPerson: function (data) {
                return !this.EmployeeSearchCallOwner ? this.OrgOfIndividualHandler.setSelectionTagets(data) : this.EmployeeSearchCallOwner.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function (oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent) : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },

            /////////////////////////////////////////////////////////////////////////////////////////////
            // 주소 검색을 위한 Functions
            /////////////////////////////////////////////////////////////////////////////////////////////
            _ODialogSearchZipcodeEvent: null,

            onDisplaySearchZipcodeDialog: function () {
                window.open("zip_search2.html?CBF=fn_SetAddr", "pop", "width=550,height=550, scrollbars=yes, resizable=yes");
            },

            beforeOpenZSDialog: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.List"),
                    oController = oView.getController();
                var oZipcodeSearchField = sap.ui.getCore().byId(oController.PAGEID + "_ZipcodeSearchField");

                if (oZipcodeSearchField) oZipcodeSearchField.setValue("");
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20001003"});
                      // return new JSONModelHelper({name: "20200317"});
                      return new JSONModelHelper({ name: "20200317" });
                      // return new JSONModelHelper({name: "35132261"});
                  }
                : null
        });
    }
);

// eslint-disable-next-line no-unused-vars
function fn_SetAddr(Zip, fullAddr, sido, sigungu) {
    var oController = $.app.getController("ZUI5_HR_PerinfoNewEmp.List");
    var vData = oController._AddressDialog.getModel().getProperty("/Data");
    
    // var oLand1 = $.app.byId(oController.PAGEID + "_Sub01_Land1"); // 국가
    // var oState = $.app.byId(oController.PAGEID + "_Sub01_State"); // 지역
    // var oPstlz = $.app.byId(oController.PAGEID + "_Sub01_Pstlz"); // 우편번호
    // var oOrt01 = $.app.byId(oController.PAGEID + "_Sub01_Ort1k"); // 시/구/군
    // var oOrt02 = $.app.byId(oController.PAGEID + "_Sub01_Ort2k"); // 동/읍/면
    
    var statesArr = {
        제주특별자치도: { key: "01", text: "제주도" }, // 제주도
        전북: { key: "02", text: "전라북도" }, // 전라북도
        전남: { key: "03", text: "전라남도" }, // 전라남도
        충북: { key: "04", text: "충청북도" }, // 충청북도
        충남: { key: "05", text: "충청남도" }, // 충청남도
        인천: { key: "06", text: "인천광역시" }, // 인천광역시
        강원: { key: "07", text: "강원도" }, // 강원도
        광주: { key: "08", text: "광주광역시" }, // 광주광역시
        경기: { key: "09", text: "경기도" }, // 경기도
        경북: { key: "10", text: "경상북도" }, // 경상북도
        경남: { key: "11", text: "경상남도" }, // 경상남도
        부산: { key: "12", text: "부산광역시" }, // 부산광역시
        서울: { key: "13", text: "서울특별시" }, // 서울특별시
        대구: { key: "14", text: "대구광역시" }, // 대구광역시
        대전: { key: "15", text: "대전광역시" }, // 대전광역시
        울산: { key: "16", text: "울산광역시" }, // 울산광역시
        세종특별자치시: { key: "22", text: "세종특별자치시" } // 세종특별자치시
    };

    // {세종특별자치시}는 sigungu가 없음. sido로 대체
    sigungu = sigungu || sido.substr(0, 2);

    if (statesArr[sido]) vData.State = statesArr[sido].key;
    vData.Land1 = "KR";
    vData.Pstlz = Zip;
    vData.Ort1k = sigungu;
    var Ort2k = "",
        vIdx = fullAddr.indexOf(sigungu);
    if (vIdx > -1) {
        Ort2k = fullAddr.substring(vIdx + sigungu.length + 1);
    }
    vData.Ort2k = Ort2k;
    oController._AddressDialog.getModel().setProperty("/Data", vData);
}
