/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend("ZUI5_HR_PerinfoNewEmp.m.Detail_Career", {
            PAGEID: "PerinfoNewEmpDetail-Career",

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
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Career");
				var oController = oView.getController();
			
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
				      data : {
				    	  FromPageId : "ZUI5_HR_PerinfoNewEmp.m.Detail_Career",
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
                
                // code list - 국가 //
				var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "-Land1");
				oController.retrieveCommonCode({CodeT : "009", Control : oLand1});
				
                oController._DetailJSonModel.setData(oData);
                
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
                                                    Label: oController.getBundleText("LABEL_76077"), // 경력증명서
                                                    Appnm: vAppnm,
                                                    Mode: "S",
                                                    ReadAsync: true,
                                                    UseMultiCategories: true,
                                                    Editable: oData.Data.Editable
                                                },
                                                "006"
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
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Career");
				var oController = oView.getController();
				
				if(oEvent && oEvent.getParameters().valid == false){
					sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식 입니다.
					oEvent.getSource().setValue("");
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
            
            onPressSave : function(oEvent, vIConType){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Career");
				var oController = oView.getController();
            	
        		var oData = oController._DetailJSonModel.getProperty("/Data");
				
            	var confirmMessage = "", successMessage = "";
            	if(vIConType == "S5"){
            		confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까? 
            		successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
            	} else {
            		confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
            		successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
            	}
            	
            	var process = function(){
            		var createData = {NewEmpinfoCareerNav : []};
						createData.IConType = vIConType;
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
            	
					createData.NewEmpinfoCareerNav.push({
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Begda : oData.Begda ? "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/" : null,
						Endda : oData.Endda ? "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/" : null,
						Arbgb : oData.Arbgb, Ort01 : oData.Ort01, Land1 : oData.Land1,
						Zztitle : oData.Zztitle, Zzjob : oData.Zzjob
					});
					
            		// 첨부파일 저장
            		var oAppnm = "", uFiles = ["006"];
            		
            		if(uFiles.length > 0 && (fragment.COMMON_ATTACH_FILES.getFileLength(oController, uFiles[0]) != 0)){
        				oAppnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
		                createData.NewEmpinfoCareerNav[0].Appnm = oAppnm;
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
