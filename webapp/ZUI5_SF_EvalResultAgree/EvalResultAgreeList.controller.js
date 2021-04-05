jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("ZUI5_SF_EvalResultAgree.EvalResultAgreeList", {
	
	PAGEID : "EvalResultAgreeList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	
	userId : "",
	
	onInit : function(){
		// this.getView().addStyleClass("sapUiSizeCompact");
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

//		var bus = sap.ui.getCore().getEventBus();
//		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
	},
	
	/** 2020-12-09 공통 로직 가져와서 사용하므로 aftershow 이하 로직 사용하지 않음 **/
	onBeforeShow : function(oEvent){
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		common.SearchEvalResultAgree.userId = (vEmpLoginInfo[0].name == "sfdev1" ? "20160183" : vEmpLoginInfo[0].name);
		common.SearchEvalResultAgree.Appye = "2020";       
		
		common.SearchEvalResultAgree.onBeforeOpen();
		
		// var oController = this;
		// setTimeout(function(){
		// 	oController.onSearchUser();
		// 	sap.ui.getCore().byId(oController.PAGEID + "_PAGE").scrollTo(0);
		// }, 300);
	},
	
	onAfterShow : function(oEvent){
		var oController = this;
		
		common.SearchEvalResultAgree.onAfterOpen();
		
		setTimeout(function(){
			sap.ui.getCore().byId(oController.PAGEID + "_PAGE").scrollTo(0);
		}, 300);
		
		// var oController = this;
		
		// setTimeout(function(){
		// 	$(".spinner-evalresult")["show"]();
		// }, 100);
		
		// setTimeout(function(){
		// 	oController.onSearchUser();
		// 	sap.ui.getCore().byId(oController.PAGEID + "_PAGE").scrollTo(0);
		// }, 300);
	},
	
	SmartSizing : function(oEvent){
		
	},
	
	onSearchUser : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");

		var userId = vEmpLoginInfo[0].name == "sfdev1" ? "20160183" : vEmpLoginInfo[0].name; // 20140120
		
		var oData = {Appye : (new Date().getFullYear() + "")};
		
		new JSONModelHelper().url("/odata/v2/User('" + userId + "')")
							 .select("userId")
							 .select("nickname")
							 .select("title")
							 .select("custom01")
							 .select("department")
							 .select("division")
							 .select("jobCode")
							 .select("custom01")
							 .select("custom02")
							 .select("custom04")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data){
										data.Appye = oData.Appye;
										data.Comment1 = "";
										data.Comment2 = "";
										oData = data;
									}
							 })
							 .attachRequestFailed(function() {
									sap.m.MessageBox.error(arguments);
									return;
							 })
							 .load();
		
		new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + userId + "' and photoType eq '1'")
							 .select("photo")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										oData.photo = "data:text/plain;base64," + data.results[0].photo;
									}
							 })
							 .attachRequestFailed(function() {
									sap.m.MessageBox.error(arguments);
									return;
							 })
							 .load();
		 
		oController._ListCondJSonModel.setProperty("/Data", oData);
		
		// 데이터 조회 전 화면에 표시될 내용 세팅
		if(oController.onSetContent() == false){
			return;
		}
		
		// 평가결과 조회
		var check = oController.onSearchEvalResult();
					
		if(check == false){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
		
		// 평가상태 및 평가연도 설정 - 조회된 데이터의 1번째 평가상태값
		var vData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data/0");
		if(!vData){
			sap.m.MessageBox.error(oBundleText.getText("MSG_15018")); // 데이터가 존재하지 않습니다.
			return;
		}
		
		oController._ListCondJSonModel.setProperty("/Data/Evstaus", vData.Evstaus);
		oController._ListCondJSonModel.setProperty("/Data/Appye", vData.Appye);
	},
	
	onSetContent : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.destroyColumns();
			
						// 상태, 평가연도
		var col_info = [{id: "Evstaustx", label : oBundleText.getText("LABEL_15005"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Appye", label : oBundleText.getText("LABEL_15006"), plabel : "", span : 0, type : "string", sort : false, filter : false}];
			
		for(var i=1; i<=4; i++){
			eval("var oLayout" + i + " = sap.ui.getCore().byId(oController.PAGEID + '_Content" + i + "');");
			eval("oLayout" + i + ".destroyContent();");
		}
		
		var addContent = function(oContent, Flag){
			if(!oContent) return;
			
			if(Flag){ // 평가자 의견을 모두 표기하는 경우 아래쪽 레이아웃에 나오게 한다.                                                                                                                     
				if(oController._ListCondJSonModel.getProperty("/Data/Btn07") == "X" && oController._ListCondJSonModel.getProperty("/Data/Btn08") == "X"){
					sap.ui.getCore().byId(oController.PAGEID + "_Content" + Flag).addContent(oContent);
					return;
				}
			}
			
			for(var i=1; i<=4; i++){
				var oLayout = eval("sap.ui.getCore().byId(oController.PAGEID + '_Content" + i + "');");
				if(oLayout.getContent().length == 0){
					oLayout.addContent(oContent);
					break;
				}
			}
		};
			
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		var createData = {TableIn2 : []};
			createData.IConType = "3";
			createData.IAppye = oController._ListCondJSonModel.getProperty("/Data/Appye");
			createData.IEmpid = oController._ListCondJSonModel.getProperty("/Data/userId");
			
		oModel.create("/EvaResultAgreeSet", createData, null,
				function(data,res){
					if(data && data.TableIn2) {
						if(data.TableIn2.results && data.TableIn2.results.length){
							oController._ListCondJSonModel.setProperty("/Data/Btn01", data.TableIn2.results[0].Btn01);
							oController._ListCondJSonModel.setProperty("/Data/Btn02", data.TableIn2.results[0].Btn02);
							oController._ListCondJSonModel.setProperty("/Data/Btn07", data.TableIn2.results[0].Btn07);
							oController._ListCondJSonModel.setProperty("/Data/Btn08", data.TableIn2.results[0].Btn08);
							
							if(data.TableIn2.results[0].Btn01 == "X"){ // 업적평가
								col_info.push({id: "Pepnt", label : oBundleText.getText("LABEL_15007"), plabel : "", span : 0, type : "string", sort : false, filter : false});
								addContent(sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail01", oController));
							}
							
							if(data.TableIn2.results[0].Btn02 == "X"){ // 역량평가
								col_info.push({id: "Cepnt", label : oBundleText.getText("LABEL_15008"), plabel : "", span : 0, type : "string", sort : false, filter : false});
								addContent(sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail02", oController));
							}
							
							if(data.TableIn2.results[0].Btn03 == "X"){ // 다면평가
								col_info.push({id: "Mepnt", label : oBundleText.getText("LABEL_15009"), plabel : "", span : 0, type : "string", sort : false, filter : false});
							}
							
							if(data.TableIn2.results[0].Btn04 == "X"){ // 1차평가
								col_info.push({id: "Pegrade", label : oBundleText.getText("LABEL_15010"), plabel : "", span : 0, type : "string", sort : false, filter : false});
							}
							
							if(data.TableIn2.results[0].Btn05 == "X"){ // 2차평가
								col_info.push({id: "Pegrade2", label : oBundleText.getText("LABEL_15011"), plabel : "", span : 0, type : "string", sort : false, filter : false});
							}
							
							if(data.TableIn2.results[0].Btn06 == "X"){ // 종합등급
								col_info.push({id: "Cograde", label : oBundleText.getText("LABEL_15012"), plabel : "", span : 0, type : "string", sort : false, filter : false});
							}
							
							if(data.TableIn2.results[0].Btn07 == "X"){ // 업적평가 1차평가자 의견
								addContent(sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail03", oController), "3");
							}
							
							if(data.TableIn2.results[0].Btn08 == "X"){ // 역량평가 1차평가자 의견
								addContent(sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail04", oController), "4");
							}
						}
					} 
				},
				function (oError) {
			    	var Err = {};
			    	oController.Error = "E";
			    	
			    	oController._ListCondJSonModel.setProperty("/Data/Btn01", "");
					oController._ListCondJSonModel.setProperty("/Data/Btn02", "");
					oController._ListCondJSonModel.setProperty("/Data/Btn07", "");
					oController._ListCondJSonModel.setProperty("/Data/Btn08", "");                                                         
							
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
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		if(oController.Error == "E"){
			$(".spinner-evalresult")["hide"]();
			
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return false;
		}
	},
	
	// 평가결과
	onSearchEvalResult : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		var createData = {TableIn : []};
			createData.IConType = "2";
			createData.IAppye = oController._ListCondJSonModel.getProperty("/Data/Appye");
			createData.IEmpid = oController._ListCondJSonModel.getProperty("/Data/userId");
			
		oModel.create("/EvaResultAgreeSet", createData, null,
				function(data,res){
					if(data && data.TableIn) {
						if(data.TableIn.results && data.TableIn.results.length){
							for(var i=0; i<data.TableIn.results.length; i++){
								data.TableIn.results[i].Pepnt = parseFloat(data.TableIn.results[i].Pepnt) == 0 ? "-" : parseFloat(data.TableIn.results[i].Pepnt); 
								data.TableIn.results[i].Cepnt = parseFloat(data.TableIn.results[i].Cepnt) == 0 ? "-" : parseFloat(data.TableIn.results[i].Cepnt); 
								data.TableIn.results[i].Mepnt = parseFloat(data.TableIn.results[i].Mepnt) == 0 ? "-" : parseFloat(data.TableIn.results[i].Mepnt); 
								data.TableIn.results[i].Pegrade = data.TableIn.results[i].Pegrade == "" ? "-" : data.TableIn.results[i].Pegrade;
								data.TableIn.results[i].Cograde = data.TableIn.results[i].Cograde == "" ? "-" : data.TableIn.results[i].Cograde;
								
								vData.Data.push(data.TableIn.results[i]);
							}
							
							oController._ListCondJSonModel.setProperty("/Data/Evstaus", vData.Data[0].Evstaus);
							oController._ListCondJSonModel.setProperty("/Data/Isstxt", vData.Data[0].Isstxt);
						}
					} 
				},
				function (oError) {
			    	var Err = {};
			    	oController.Error = "E";
			    	
			    	oController._ListCondJSonModel.setProperty("/Data/Evstaus", "");
					oController._ListCondJSonModel.setProperty("/Data/Isstxt", "");
							
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
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount((vData.Data.length >= 5 ? 5 : vData.Data.length));
		
		if(oController.Error == "E"){
			$(".spinner-evalresult")["hide"]();
			
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return false;
		}
		
		// 평가상태 별 처리
		if(vData.Data[0].Evstaus == ""){
			$(".spinner-evalresult")["hide"]();
		} else if(vData.Data[0].Evstaus == "20"){ // 평가상태가 20(평가완료) 인 경우, 설문 dialog를 먼저 열어준다.
			if(!oController._SurveyDialog){
				oController._SurveyDialog = sap.ui.jsfragment("fragment.EvalSurvey", oController);
				oController.getView().addDependent(oController._SurveyDialog);
			}
			
			common.SearchEvalSurvey.oController = oController;
			common.SearchEvalSurvey.userId = oController._ListCondJSonModel.getProperty("/Data/userId");
			common.SearchEvalSurvey.Appye = vData.Data[0].Appye;
			
			oController._SurveyDialog.open();
			
			$(".spinner-evalresult")["hide"]();
		} else if(parseFloat(vData.Data[0].Evstaus) >= 30) {
			// 상태값 30 이상인 경우(설문완료 이후)만 업적/역량평가 데이터 조회
			setTimeout(function(){
				$(".spinner-evalresult")["show"]();
				
				setTimeout(function(){
					oController.onPressSearch();
					
					// 역량평가 
					if(oController._ListCondJSonModel.getProperty("/Data/Btn02") == "X"){
						oController.onPressSearch2();
					}
				}, 100);
			}, 50);
		}
	},
	
	// 업적평가 데이터 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		var userId = oController._ListCondJSonModel.getProperty("/Data/userId");

		/** 목표 조회
			개발(g110bc197) : 2019년 데이터가 없으므로 2020년부터 1로 계산하여 Entity명 생성
			QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
		var Idx = "", year = oController._ListCondJSonModel.getProperty("/Data/Appye");
		if(common.Common.getOperationMode() == "DEV"){
			Idx = (year == 2020 ? "1" : (year-2020) + 1);
		} else {
			Idx = (year == 2019 ? "1" : (year-2019) + 1);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
		var vData = {Data : []};
		
		if(oTable){
			var oJSONModel = oTable.getModel();
			
			// filter, sort 제거
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++){
				oColumns[i].setFiltered(false);
				oColumns[i].setSorted(false);
			}
		}
		
		var goal = [], id = "";
		new JSONModelHelper().url("/odata/fix/GoalPlanTemplate?$select=id,goals,planStates&$expand=goals,planStates&userId=" + userId)
							 .setAsync(false)
							 .attachRequestCompleted(function(){
								 var data = this.getData().d;
								 
								 if(data && data.results.length){
								 	for(var i=0; i<data.results.length; i++){
							 			// 연도와 동일한 목표만 테이블에 넣어준다.
								 		if(data.results[i].id == Idx){
								 			goal.push(data.results[i]);
								 		}
								 	}
								 }
							 })
							 .attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 	 return;
								 } else {
								 	 sap.m.MessageBox.error(error);
								 	 return;
								 }
							 })
							 .load();

		for(var i=0; i<goal.length; i++){
			if(goal[i].goals && goal[i].goals.results.length){
				for(var j=0; j<goal[i].goals.results.length; j++){
					goal[i].goals.results[j].Idx = (j+1);
					
					if(id == ""){
						id = goal[i].goals.results[j].id;
					} else {
						id += "," + goal[i].goals.results[j].id;
					}
					
					goal[i].goals.results[j].name = goal[i].goals.results[j].name.replace(/\\n/g, "\n");
					vData.Data.push(goal[i].goals.results[j]);
				}
			}
		}
		
		if(oTable){
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
			oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));	
		}
	
		if(id == ""){
			// oController._StatusMessage.close();
			$(".spinner-evalresult")["hide"]();
			sap.m.MessageBox.error(oController.oBundleText.getText("MSG_12001")); // 평가문서가 존재하지 않습니다.
			return;	
		}
		
		var detail = [];
		new JSONModelHelper().url("/odata/fix/Goal_" + Idx + "?$select=id,done,customScore&$filter=userId eq '" + userId + "' and id in "+ id)
							 .attachRequestCompleted(function(){
								 var data = this.getData().d;
								 
								 if(data && data.results.length){
								 	for(var i=0; i<data.results.length; i++){
									 	detail.push(data.results[i]);
								 	}
								 }
								 
								 if(oTable && detail.length > 0){
								 	for(var i=0; i<vData.Data.length; i++){
										for(var j=0; j<detail.length; j++){
											if(vData.Data[i].id == detail[j].id){
												oJSONModel.setProperty("/Data/" + i + "/done", detail[j].done);
												oJSONModel.setProperty("/Data/" + i + "/customScore", detail[j].customScore);
											}
										}
									 }
								 }
							 })
							 .attachRequestFailed(function(error){
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 	 return;
								 } else {
								 	 sap.m.MessageBox.error(error);
	 								 return;
								 }
							 })
							 .load();
							 
		var formDataId = "", formContentId = "";
		new JSONModelHelper().url("/odata/fix/FormHeader")
							 .select("currentStep")
							 .select("formDataId")
							 .select("formDataStatus")
							 .select("formLastContent")
							 .expand("formLastContent")
							 .filter("formTemplateId eq " + (common.Common.getOperationMode() == "DEV" ? "703" : "500") + " and formDataStatus ne 4 and formSubjectId in " + userId)
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										if(data.results[0].formLastContent){
											formDataId = data.results[0].formLastContent.formDataId;
											formContentId = data.results[0].formLastContent.formContentId;
										}
									}
							 })
							 .attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 } else {
								 	 sap.m.MessageBox.error(error);
								 }
							 })
							 .load();
		
		if(formDataId == "" || formContentId == ""){
			$(".spinner-evalresult")["hide"]();
			sap.m.MessageBox.error(oController.oBundleText.getText("MSG_12001")); // 평가문서가 존재하지 않습니다.
			return;
		}
		
		// 1차평가 결과
		new JSONModelHelper().url("/odata/fix/FormContent?$filter=formDataId eq " + formDataId + "L and formContentId eq " + formContentId + "L")
							 //.expand("pmReviewContentDetail/competencySections/competencies/officialRating") // 역량평가 점수
							 .expand("pmReviewContentDetail/competencySections/competencies/othersRatingComment") // 역량평가 본인평가 점수
							 .expand("pmReviewContentDetail/objectiveSections/objectives/officialRating") // 1차평가 결과
							 .expand("pmReviewContentDetail/customSections/othersRatingComment") // 종합의견
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										if(oTable){
											// 1차평가 결과
											var result = data.results[0].pmReviewContentDetail.results[0].objectiveSections.results[0].objectives.results;
											if(result && result.length){
												for(var i=0; i<vData.Data.length; i++){
													for(var j=0; j<result.length; j++){
														if(vData.Data[i].id == result[j].itemId){
															oJSONModel.setProperty("/Data/" + i + "/rating", result[j].officialRating.rating);
														}
													}
												}
											}
										}
										
										if(data.results[0].pmReviewContentDetail.results[0].customSections && data.results[0].pmReviewContentDetail.results[0].customSections.results.length){
											for(var i=0; i<data.results[0].pmReviewContentDetail.results[0].customSections.results.length; i++){
												if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "역량평가 의견"){
													// 역량평가 1차 평가자 의견
													var comment2 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
													for(var j=0; j<comment2.length; j++){
														if(comment2[j].commentLabel == "평가자 의견" || comment2[j].commentLabel == "Manager's Comments"){
															oController._ListCondJSonModel.setProperty("/Data/Comment2", comment2[j].comment);
														}
													}
												} else if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "업적평가 의견"){
													// 업적평가 1차 평가자 의견
													var comment1 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
													for(var j=0; j<comment1.length; j++){
														if(comment1[j].commentLabel == "평가자 의견" || comment1[j].commentLabel == "Manager's Comments"){
															oController._ListCondJSonModel.setProperty("/Data/Comment1", comment1[j].comment);
														}
													}
												}
											}
										}
										
										setTimeout(function(){
											$(".spinner-evalresult")["hide"]();
										}, 500);
									}
							 })
							 .attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 	 return;
								 } else {
								 	 sap.m.MessageBox.error(error);
								 	 return;
								 }
								
								setTimeout(function(){
									$(".spinner-evalresult")["hide"]();
								}, 500);
							 })
							 .load();
	},
	
	// 역량평가 vizframe data 조회
	onPressSearch2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		// 역량평가
		var oChart = sap.ui.getCore().byId(oController.PAGEID + "_Chart");
		var oJSONModel2 = oChart.getModel();
		var vData2 = {Data : []};
	
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		var createData = {CompResultsNav : []};
			createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/userId");
			createData.Appye = oController._ListCondJSonModel.getProperty("/Data/Appye");
		
		oModel.create("/CompResultsSet", createData, null,
			function(data,res){
				if(data && data.CompResultsNav) {
					if(data.CompResultsNav.results && data.CompResultsNav.results.length){
						for(var i=0; i<data.CompResultsNav.results.length; i++){
							data.CompResultsNav.results[i].Comppnt1 = data.CompResultsNav.results[i].Comppnt1 ? parseFloat(data.CompResultsNav.results[i].Comppnt1) : 0;
							data.CompResultsNav.results[i].Comppnt2 = data.CompResultsNav.results[i].Comppnt2 ? parseFloat(data.CompResultsNav.results[i].Comppnt2) : 0;
							
							vData2.Data.push(data.CompResultsNav.results[i]);
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
		
		oJSONModel2.setData(vData2);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
	},
	
	// 결과합의, 이의제기
	onPressSave : function(oEvent, vEvstaus){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		var oIsstxt = oController._ListCondJSonModel.getProperty("/Data/Isstxt");
		
		// validation check
		if(vEvstaus == "40" && (!oIsstxt || oIsstxt.trim() == "")){
			sap.m.MessageBox.error(oBundleText.getText("MSG_15013")); // 이의제기 사유는 필수입력입니다.
			return;
		}
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
			var createData = {TableIn : []};
				createData.IConType = "1";
				createData.IAppye = oController._ListCondJSonModel.getProperty("/Data/Appye");
				createData.IEmpid = oController._ListCondJSonModel.getProperty("/Data/userId");
				createData.IEvstaus = vEvstaus;
				
			if(vEvstaus == "40"){
				createData.TableIn.push({Isstxt : oIsstxt});
			}
			
			oModel.create("/EvaResultAgreeSet", createData, null,
					function(data,res){
						if(data) {
							
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
			
			oController._BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			sap.m.MessageBox.success(successMessage, {
				onClose : function(){
					var check = oController.onSearchEvalResult();
					
					if(check == false){
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage);
						return;
					}
				}
			});
		};
		
		var onBeforeSave = function(fVal){
			if(fVal && fVal == "YES"){
				oController._BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var confirmMessage = "", successMessage = "";
		if(vEvstaus == "40"){
			confirmMessage = oBundleText.getText("MSG_15014"); // 이의제기 하시겠습니까?
			successMessage = oBundleText.getText("MSG_15015"); // 이의제기 완료되었습니다.
		} else {
			confirmMessage = oBundleText.getText("MSG_15016"); // 결과합의 하시겠습니까?
			successMessage = oBundleText.getText("MSG_15017"); // 결과합의 완료되었습니다.
		}
		
		sap.m.MessageBox.confirm(confirmMessage, {
			actions : ["YES", "NO"],
			onClose : onBeforeSave
		});
	},
	
	// 평가설문 dialog open
	onPressSurvey : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResultAgree.EvalResultAgreeList");
		var oController = oView.getController();
		
		oController._SurveyDialog.open();
	}
});