/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend("ZUI5_HR_PerinfoNewEmp.m.Detail_Address", {
            PAGEID: "PerinfoNewEmpDetail-Address",

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
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Address");
				var oController = oView.getController();
			
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
				      data : {
				    	  FromPageId : "ZUI5_HR_PerinfoNewEmp.m.Detail_Address",
				    	  Data : {}
				      }
				});
            },

            onBeforeShow: function (oEvent) {
                var oController = this;
                
                var oData = {Data : {FromPageId : "ZUI5_HR_PerinfoNewEmp.m.List"}};
                
                if(oEvent.data){
                	oData.Data = $.extend(true, {}, oEvent.data);
                }
                
                // 주소유형
				var oAnssa = sap.ui.getCore().byId(oController.PAGEID + "-Anssa");
					oAnssa.destroyItems();
				
				// 국가
				var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "-Land1");
					oLand1.destroyItems();
                
                Promise.all([
                	oController.retrieveCommonCode({CodeT : "003", CodeTy : "0006", Control : oAnssa}),
					oController.retrieveCommonCode({CodeT : "009", Control : oLand1})
                ])
				.then(function () {
            		oController._DetailJSonModel.setData(oData);
            		
					if(oData.Data.Editable == false){
						oController.onChangeLand1();
					}
                });
            },

            onAfterShow: function () {
        
            },
            
            // 국가 변경 시 지역 리스트 생성
            onChangeLand1 : function(oEvent){
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Address");
				var oController = oView.getController();
            	
        		var oLand1 = oController._DetailJSonModel.getProperty("/Data/Land1");
				var oState = sap.ui.getCore().byId(oController.PAGEID + "-State");
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
            	var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoNewEmp.m.Detail_Address");
				var oController = oView.getController();
            	
            	// validation check
        		var oData = oController._DetailJSonModel.getProperty("/Data");
					
				if(!oData.Pstlz || oData.Pstlz.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_76004")); // 우편번호를 입력하여 주십시오.
					return false;
				} else if((!oData.State) || (!oData.Ort1k || oData.Ort1k.trim() == "") || (!oData.Ort2k || oData.Ort2k.trim() == "")){
					sap.m.MessageBox.error(oController.getBundleText("MSG_76005")); // 주소를 입력하여 주십시오.
					return false;
				} else if(!oData.Stras || oData.Stras.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_76006")); // 상세주소를 입력하여 주십시오.
					return false;
				} else if(!oData.Telnr || oData.Telnr.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_76007")); // 전화번호를 입력하여 주십시오.
					return false;
				}
				
            	var confirmMessage = "", successMessage = "";
            	if(vIConType == "S3"){
            		confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까? 
            		successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
            	} else {
            		confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
            		successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
            	}
            	
            	var process = function(){
            		var createData = {NewEmpinfoAddrNav : []};
						createData.IConType = vIConType;
						createData.IBukrs = oController.getSessionInfoByKey("Bukrs2");
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IPernr = oController.getSessionInfoByKey("Pernr");
            	
					createData.NewEmpinfoAddrNav.push({
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Anssa : oData.Anssa,
						Land1 : oData.Land1,
						Pstlz : oData.Pstlz, State : oData.State, Ort1k : oData.Ort1k, Ort2k : oData.Ort2k,
						Stras : oData.Stras, Telnr : oData.Telnr
					});
					
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
