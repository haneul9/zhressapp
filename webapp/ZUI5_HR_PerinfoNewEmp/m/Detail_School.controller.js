/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend("ZUI5_HR_PerinfoNewEmp.m.Detail_School", {
            PAGEID: "PerinfoNewEmpDetail-School",

            _BusyDialog: new sap.m.BusyDialog(),
            _DetailJSonModel: new sap.ui.model.json.JSONModel(),
			
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },
            
            onBack : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_School");
				var oController = oView.getController();
			
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
				      data : {
				    	  FromPageId : "ZUI5_HR_PerinfoNewEmp.m.Detail_School",
				    	  Data : {}
				      }
				});
            },

            onBeforeShow: function (oEvent) {
                var oController = this;
                
                var oData = {Data : {FromPageId : "ZUI5_HR_PerinfoNewEmp.m.List", Zzlmark : false, Slart : ""}};
                
                if(oEvent.data){
                	oData.Data = $.extend(true, {}, oEvent.data);
                }
                
                // code list //
				var field = [{name : "Slart", code : "01"}, // 학교구분
							 {name : "Sland", codeT : "009"}] // 국가
							 
				for(var i=0; i<field.length; i++){
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "-" + field[i].name);
						oControl.destroyItems();
						
					oController.retrieveCommonCode({CodeT : (field[i].codeT ? field[i].codeT : "999"), CodeTy: (field[i].code ? field[i].code : "" ), Control : oControl});
				}
				
				// 학위 combobox list 삭제
				sap.ui.getCore().byId(oController.PAGEID + "-Slabs").destroyItems();
				
                oController._DetailJSonModel.setData(oData);
                
				if(oData.Data.Editable == false){
					oController.onChangeSlart();
				}
				
				// 최종학교 학력증명서 첨부파일 refresh
				var vAppnm = oData.Data.Appnm ? oData.Data.Appnm : "";
            	
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
                                                    Editable: oData.Data.Editable
                                                },
                                                "007"
                                            );
                                        }.bind(oController)
                                    )
                                ]).then(function () {
                            	   
                                });
                            }.bind(oController)
                        );
                    }.bind(oController),
                    100
                );	
            },

            onAfterShow: function () {
        
            },
            
            onChangeDate : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_School");
				var oController = oView.getController();
				
				if(oEvent && oEvent.getParameters().valid == false){
					sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식 입니다.
					oEvent.getSource().setValue("");
				}
            }, 
            
            // 학력사항-학교구분 변경 시 Event
            onChangeSlart : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_School");
				var oController = oView.getController();
				
				var oSlart = oController._DetailJSonModel.getProperty("/Data/Slart");
				
				// 교육기관구분, 학교, 전공, 학위, 최종학력여부 clear
				if(oEvent){
					oController._DetailJSonModel.setProperty("/Data/Ausbi", "");
					oController._DetailJSonModel.setProperty("/Data/Insti", "");
					oController._DetailJSonModel.setProperty("/Data/Sltp1", "");
					oController._DetailJSonModel.setProperty("/Data/Sltp1tx", "");
					oController._DetailJSonModel.setProperty("/Data/Slabs", "");
					oController._DetailJSonModel.setProperty("/Data/Zzlmark", false); 
				}
				
				var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "-Slabs");
					oSlabs.destroyItems();
					
				if(oSlart){
					// 학교구분이 존재하는 경우만 학위 리스트 생성
					oController.retrieveCommonCode({CodeT : "999", CodeTy: "04", Code : oSlart, Control : oSlabs});
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
            
            // 교육기관구분/전공 선택 팝업
            // field - Ausbi 교육기관구분, Sltp1 전공
            onSearchSchoolCode : function(oEvent, field){ 
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_School");
				var oController = oView.getController();
				
				if(!oController._SchoolCodeDialog){
					oController._SchoolCodeDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.School-code", oController);
					oView.addDependent(oController._SchoolCodeDialog);
				}
				
				oController._SchoolCodeDialog.getModel().setData({Data : {Flag : field}});
				
				// validation check
				var oSlart = oController._DetailJSonModel.getProperty("/Data/Slart");
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
																oController._SchoolCodeDialog.open();
															}
						
					});
				} else {
					oController.retrieveCommonCode({CodeT : "999", CodeTy : "05", Code : oSlart, Control : oList, Array : true, 
													After : function(){
																oController._SchoolCodeDialog.open();
															}
						
					});					
				}
				
				oController._BusyDialog.close();
            },
            
            onPressSave : function(oEvent, vIConType){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_School");
				var oController = oView.getController();
            	
        		var oData = oController._DetailJSonModel.getProperty("/Data");
				
            	var confirmMessage = "", successMessage = "";
            	if(vIConType == "S4"){
            		confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까? 
            		successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
            	} else {
            		confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
            		successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
            	}
            	
            	var process = function(){
            		var createData = {NewEmpinfoEduNav : []};
						createData.IConType = vIConType;
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
            	
					createData.NewEmpinfoEduNav.push({
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Begda : oData.Begda ? "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/" : null,
						Endda : oData.Endda ? "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/" : null,
						Slart : oData.Slart, Sland : oData.Sland, Ausbi : oData.Ausbi, Insti : oData.Insti,
						Slabs : oData.Slabs, Sltp1 : oData.Sltp1, Zzlmark : (oData.Zzlmark && oData.Zzlmark == true ? "X" : "")
					});
					
            		// 첨부파일 저장
            		var oAppnm = "", uFiles = ["007"];
            		
            		if(uFiles.length > 0 && (fragment.COMMON_ATTACH_FILES.getFileLength(oController, uFiles[0]) != 0)){
        				oAppnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
		                createData.NewEmpinfoEduNav[0].Appnm = oAppnm;
            		}
					
					var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
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
						onClose : oController.onBack
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
            	})
            },
            
        });
    }
);
