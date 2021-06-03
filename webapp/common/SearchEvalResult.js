jQuery.sap.declare("common.SearchEvalResult");

common.SearchEvalResult = {
	PAGEID : "EvalResult",
	oController : null,
	userId : null,
	Grade5 : "",
	Year : "", // 평가연도
	_Year : "", // section 변경할 때 사용
	
	_JSONModel : new sap.ui.model.json.JSONModel(), 
	_MessageJSONModel : new sap.ui.model.json.JSONModel(), 
	_BusyDialog : new sap.m.BusyDialog(),
	
	// 번역  
	// oBundleText : jQuery.sap.resources({
	// 	url : "i18n/i18n.properties?" + new Date().getTime(),
	// 	locale : sap.ui.getCore().getConfiguration().getLanguage()
	// }),
	
	onBeforeOpen : function(oEvent){
		// if(sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV") == undefined){
		// 	var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
		// 			var pair = p.split(/=/);
		// 			if (pair[0] === "s4hana") { return pair[1]; }
		// 		})[0],
		// 		destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
				
		// 	var oModel = new sap.ui.model.odata.ODataModel(destination + "/sap/opu/odata/sap/ZHR_APPRAISAL_SRV/", true, undefined, undefined, undefined, undefined, undefined, false);
		// 		oModel.setCountSupported(false);
		// 		oModel.setRefreshAfterChange(false);
		// 	sap.ui.getCore().setModel(oModel, "ZHR_APPRAISAL_SRV");
		// }
		
		var oData = [{ // 직무만족도
						Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
						Description1 : "", Description2 : "", Description3 : "", Description4 : "",
						nickname : "-"
					  },
					  { // 협업만족도
					  	Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
					  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
					  	nickname : "-"
					  },
					  { // 리더십만족도
					  	Score1 : 0, Score2 : 0, Score3 : 0, Scorseare4 : 0,
					  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
					  	nickname : "-"
					  },
					  { // 강점,보완점
					  	Description1_1 : "", Description2_1 : "", Description3_1 : "", Description4_1 : "",
					  	Description1_2 : "", Description2_2 : "", Description3_2 : "", Description4_2 : "",
					  }];
					  
		common.SearchEvalResult._JSONModel.setData({
			user : {}, 
			Data : oData, summary : [], // 다면평가
			Data2 : {Comment1 : "", Comment2 : ""} // 업적&역량평가
		});
		
		sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table").getModel().setData(null);
		sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table").setVisibleRowCount(1);
		sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Chart").getModel().setData(null);
		sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table2").getModel().setData(null);
		sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table2").setVisibleRowCount(1);
		
		var oObjectLayout = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "ObjectPageLayout");
			oObjectLayout.setSelectedSection(oObjectLayout.getSections()[0].sId);  
			
		common.SearchEvalResult._Year = "";
	},
	
	onAfterOpen : function(oEvent){
		setTimeout(function(){
			$(".spinner-evalresult")["show"]();
			common.SearchEvalResult.onSearchUser();
		}, 50);
	},
	
	onChangeSection : function(oEvent){
		var oYear = common.SearchEvalResult._JSONModel.getProperty("/user/Year"), oKey = "";
		
		var oSectionLayout = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "ObjectPageLayout");
		
		if(oSectionLayout.getSelectedSection() == common.SearchEvalResult.PAGEID + "ObjectPageLayoutSection1"){
			if(oEvent && common.SearchEvalResult._JSONModel.getProperty("/user/Key") == "1") return;
			
			oKey = "1";
		} else {
			if(oEvent && common.SearchEvalResult._JSONModel.getProperty("/user/Key") == "2") return;
		
			oKey = "2";	
		}
		
		common.SearchEvalResult._JSONModel.setProperty("/user/Key", oKey);
		
		if(!oYear || oYear == "") return;
		
		// object section 을 변경했을 때 return
		if(oEvent){
			return;
		}
		
		// 이전에 선택된 연도와 비교
		if(common.SearchEvalResult._Year ==  ""){
			common.SearchEvalResult._Year = oYear;
		} else {
			if(common.SearchEvalResult._Year == oYear){
				if(oKey == "1"){
					if(sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table2").getModel().getProperty("/Data")){
						return;
					}
				} else {
					if(common.SearchEvalResult._JSONModel.getProperty("/summary").length != 0){
						return;
					} else {
						return;
					}
				}
			}
		}
		
		if(oYear >= (common.Common.getOperationMode() == "DEV" ? 2020 : 2019)){
			var data;
			if(oKey == "1"){
				// 업적,역량평가는 메세지 처리 없이 조회함
				setTimeout(function(){
					$(".spinner-evalresult")["show"]();
				}, 0);
			} else {
				data = [{
							Type : "Warning",
							Text : common.SearchEvalResult.oController.getBundleText("MSG_12010") // 평가문서 조회 대기중
						},
						{
							Type : "Warning",
							Text : common.SearchEvalResult.oController.getBundleText("MSG_12018") // 평가항목 조회 대기중
						},
						{
							Type : "Warning",
							Text : common.SearchEvalResult.oController.getBundleText("MSG_12019") // 평가점수 조회 대기중
						}];
						
				setTimeout(function(){
					var vData = {Data : data};
					common.SearchEvalResult._MessageJSONModel.setData(vData);
					$(".spinner-evalresult")["show"]();
					common.SearchEvalResult._StatusMessage.openBy(sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Status"));
				}, 0);
			}
			
			setTimeout(function(){
				// eval("common.SearchEvalResult.onPressSearch" + oKey + "();");
				common.SearchEvalResult.onPressSearch1();
			}, 100);
		} else {
			// 개발 2019년 이전, 운영 2019년 이전 데이터 선택 시 화면 초기화
				var oTable2 = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table2");
				var oJSONModel = oTable2.getModel();
					oJSONModel.setData(null);
					oTable2.setVisibleRowCount(1);
					
				sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Chart").getModel().setData(null);
					
				common.SearchEvalResult._JSONModel.setProperty("/Data2", {Comment1 : "", Comment2 : ""});
				
				var oData = [{ // 직무만족도
								Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
								Description1 : "", Description2 : "", Description3 : "", Description4 : "",
								nickname : "-"
							  },
							  { // 협업만족도
							  	Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
							  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
							  	nickname : "-"
							  },
							  { // 리더십만족도
							  	Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
							  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
							  	nickname : "-"
							  },
							  { // 강점,보완점
							  	Description1_1 : "", Description2_1 : "", Description3_1 : "", Description4_1 : "",
							  	Description1_2 : "", Description2_2 : "", Description3_2 : "", Description4_2 : "",
							  }];
							  
				common.SearchEvalResult._JSONModel.setProperty("/Data", oData);
				common.SearchEvalResult._JSONModel.setProperty("/summary", []);
		}
	},
	
	onSearchUser : function(oEvent){
		// 화면 최초 접속 시 접속한 대상자의 유저 정보 호출
		// userId가 넘어온 경우 해당 아이디의 유저 정보 호출
		var userId = "";
		if(common.SearchEvalResult.userId){
			userId = common.SearchEvalResult.userId;
		} else {
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");

			userId = vEmpLoginInfo[0].name == "sfdev1" ? "20060040" : vEmpLoginInfo[0].name;
		}
		
		var oData = {};
		
		new JSONModelHelper().url("/odata/v2/User('" + parseFloat(userId) + "')")
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
										data.Key = "1"
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
									} else {
										oData.photo = "images/male.jpg";
									}
							 })
							 .attachRequestFailed(function() {
									oData.photo = "images/male.jpg";
							 })
							 .load();
		
		common.SearchEvalResult._JSONModel.setProperty("/user", oData);
		
		// summary 데이터 생성
		var oTable = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		// 2020년 데이터 조회 - 종합평가(Grade5) 데이터의 경우 앞에서 넘어온 데이터로 세팅함 common.SearchEvalResult.Grade5
		// vData.Data.push({Select : false, Appye : 2020, Grade1 : 0, Grade2 : 0, Grade3 : 0, Grade4 : 0, Grade5 : "", Grade6 : ""});
		
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		var createData = {TableIn : []};
			createData.IEmpid = userId;
			createData.IAppye = common.SearchEvalResult.Year;
			createData.IConType = "2";
			
		oModel.create("/EvalResultsSet", createData, null,
			function(data,res){
				if(data && data.TableIn) {
					if(data.TableIn.results && data.TableIn.results.length){
						for(var i=0; i<data.TableIn.results.length; i++){
							data.TableIn.results[i].Select = (i == 0 ? true : false);
							
							vData.Data.push(data.TableIn.results[i]);
						}
					}
				} 
			},
			function (oError) {
		    	var Err = {};
		    	common.SearchEvalResult.Error = "E";
						
				if (oError.response) {
					Err = window.JSON.parse(oError.response.body);
					var msg1 = Err.error.innererror.errordetails;
					if(msg1 && msg1.length) common.SearchEvalResult.ErrorMessage = Err.error.innererror.errordetails[0].message;
					else common.SearchEvalResult.ErrorMessage = Err.error.message.value;
				} else {
					common.SearchEvalResult.ErrorMessage = oError.toString();
				}
			}
		);	
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(vData.Data.length);
		
		if(common.SearchEvalResult.Error == "E"){
			common.SearchEvalResult.Error = "";
			sap.m.MessageBox.error(common.SearchEvalResult.ErrorMessage);
			return;
		}
		
		// 가장 첫번째 데이터 먼저 선택 + 데이터 우선 조회
		common.SearchEvalResult._JSONModel.setProperty("/user/Year", vData.Data[0].Appye);
		oTable.setSelectedIndex(0);
		common.SearchEvalResult.onChangeSection();
		
		// var oTemplateId1 = "", oTemplateId2 = "";
		// if(common.Common.getOperationMode() == "DEV"){ // 개발
		// 	oTemplateId1 = "703";
		// 	oTemplateId2 = "719";
		// } else if(common.Common.getOperationMode() == "QAS"){ // QA
		// 	oTemplateId1 = "500";
		// 	oTemplateId2 = "502";
		// } else if(common.Common.getOperationMode() == "PRD"){ // 운영
		// 	oTemplateId1 = "500";
		// 	oTemplateId2 = "502";
		// }
		
		/** 업적/역량평가 점수, 업적등급 조회 **/
		// new JSONModelHelper().url("/odata/fix/FormHeader")
		// 					 .select("currentStep")
		// 					 .select("formDataId")
		// 					 .select("formDataStatus")
		// 					 .select("formAuditTrails/formContentId")
		// 					 .select("formAuditTrails/auditTrailRecipient")
		// 					 .expand("formAuditTrails")
		// 					 .filter("formTemplateId eq " + oTemplateId1 + " and formDataStatus ne 4 and formSubjectId eq '" + userId + "'")
		// 					 .attachRequestCompleted(function(){
		// 							var data = this.getData().d;
									
		// 							var formContentId = "", formDataId = "";
									
		// 							if(data && data.results.length){
		// 								for(var i=0; i<data.results.length; i++){
		// 									if(data.results[i].formAuditTrails){
		// 										for(var j=0; j<data.results[i].formAuditTrails.results.length; j++){
		// 											// formAuditTrails 내 formContentId가 제일 큰걸 찾는다.
		// 											if(formContentId == ""){
		// 												formContentId = data.results[i].formAuditTrails.results[j].formContentId;
		// 												formDataId = data.results[i].formDataId;
		// 											} else {
		// 												if(parseInt(formContentId) < parseInt(data.results[i].formAuditTrails.results[j].formContentId)){
		// 													formContentId = data.results[i].formAuditTrails.results[j].formContentId;
		// 													formDataId = data.results[i].formDataId;
		// 												}
		// 											}
		// 										}
		// 									}
		// 								}
		// 							}
									
		// 							if(formContentId == "" || formDataId == ""){
		// 								sap.m.MessageBox.error(common.SearchEvalResult.oController.getBundleText("MSG_12001"), { // 평가문서가 존재하지 않습니다.
		// 									onClose : function(){
		// 										common.SearchEvalResult._StatusMessage.close();
		// 										$(".spinner-evalresult")["hide"]();
		// 									}
		// 								});
		// 								return;
		// 							}
									
		// 							// 평가결과 첫번째 데이터가 선택된 상태로 조회되게함
		// 							oTable.setSelectedIndex(0);
		// 							oJSONModel.setProperty("/Data/0/Select", true);
									
		// 							new JSONModelHelper().url("/odata/fix/TalentRatings?$filter=formDataId eq " + formDataId + "L and formContentId eq " + formContentId + "L")
		// 												 .attachRequestCompleted(function(){
		// 														var data2 = this.getData().d;
																
		// 														if(data2 && data2.results.length){
		// 															for(var i=0; i<data2.results.length; i++){
		// 																switch(data2.results[i].feedbackType){
		// 																	case 8: // 업적등급
		// 																		oJSONModel.setProperty("/Data/0/Grade4", data2.results[i].feedbackRatingLabel);
		// 																		break;
		// 																	case 10: // 역량평가 점수
		// 																		oJSONModel.setProperty("/Data/0/Grade2", data2.results[i].feedbackRating);
		// 																		break;
		// 																	case 11: // 업적평가 점수
		// 																		oJSONModel.setProperty("/Data/0/Grade1", data2.results[i].feedbackRating);
		// 																		break;
		// 																}
		// 															}
		// 														}
		// 												 })
		// 												 .attachRequestFailed(function(error) {
		// 													 if(error.getParameters() && error.getParameters().message == "error"){
		// 													 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
		// 													 	 sap.m.MessageBox.error(message);
		// 													 } else {
		// 													 	 sap.m.MessageBox.error(error);
		// 													 }
		// 												 })
		// 												 .load();
									
		// 					 })
		// 					 .attachRequestFailed(function(error) {
		// 						 if(error.getParameters() && error.getParameters().message == "error"){
		// 						 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
		// 						 	 sap.m.MessageBox.error(message);
		// 						 	 return;
		// 						 } else {
		// 						 	 sap.m.MessageBox.error(error);
		// 						 	 return;
		// 						 }
		// 					 })
		// 					 .load();
		
		// /** 다면평가 점수 조회 **/
		// new JSONModelHelper().url("/odata/fix/FormHeader")
		// 					 .filter("formTemplateId eq " + oTemplateId2 + " and formDataStatus ne 4 and formSubjectId eq '" + userId + "'")
		// 					 .select("currentStep")
		// 					 .select("formDataId")
		// 					 .select("formDataStatus")
		// 					 .select("formContents/formContentId")
		// 					 .select("formContents/status")
		// 					 .expand("formContents")
		// 					 .attachRequestCompleted(function(){
		// 							var data = this.getData().d;
									
		// 							if(data && data.results.length){
		// 								var formDataId = "", formContentId = "";
										
		// 								for(var i=0; i<data.results.length; i++){
		// 									if(data.results[i].currentStep == null && data.results[i].formContents){
		// 										formDataId = data.results[i].formDataId;
												
		// 										for(var j=0; j<data.results[i].formContents.results.length; j++){
		// 											if(data.results[i].formContents.results[j].status == "3" || data.results[i].formContents.results[j].status == "10"){
		// 												formContentId = data.results[i].formContents.results[j].formContentId;
		// 											}
		// 										}
												
		// 										if(formDataId != "" && formContentId != ""){
		// 											new JSONModelHelper().url("/odata/fix/Form360RaterSection(formDataId=" + formDataId + "L,formContentId=" + formContentId + "L)?$expand=form360Raters")
		// 																 .attachRequestCompleted(function(){
		// 																		var data2 = this.getData().d;
		// 																		var rating = 0;
																				
		// 																		if(data2){
		// 																			if(data2.form360Raters && data2.form360Raters.results.length){
		// 																				for(var j=0; j<data2.form360Raters.results.length; j++){
		// 																					rating += (data2.form360Raters.results[j].participantRating.split("/")[0] * 1);
		// 																				}
																						
		// 																				rating = rating / data2.form360Raters.results.length;
		// 																			}
		// 																		}
																				
		// 																		oJSONModel.setProperty("/Data/0/Grade3", (rating.toFixed(2) * 1));
																				
		// 																		setTimeout(function(){
		// 																			common.SearchEvalResult._StatusMessage.close();
		// 																			$(".spinner-evalresult")["hide"]();
		// 																			// 평가결과 첫번째 데이터 우선 선택
		// 																			oTable.setSelectedIndex(0);
		// 																			oJSONModel.setProperty("/Data/0/Select", true);
		// 																		}, 100);
		// 																 })
		// 																 .attachRequestFailed(function(error) {
		// 																	 if(error.getParameters() && error.getParameters().message == "error"){
		// 																	 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
		// 																	 	 sap.m.MessageBox.error(message);
		// 																	 } else {
		// 																	 	 sap.m.MessageBox.error(error);
		// 																	 }
																			 
		// 																	 setTimeout(function(){
		// 																		common.SearchEvalResult._StatusMessage.close();
		// 																		$(".spinner-evalresult")["hide"]();
		// 																	 }, 500);
		// 																 })
		// 																 .load();
		// 										}
		// 									}
		// 								}
		// 							}
		// 					 })
		// 					 .attachRequestFailed(function(error) {
		// 						 if(error.getParameters() && error.getParameters().message == "error"){
		// 						 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
		// 						 	 sap.m.MessageBox.error(message);
		// 						 } else {
		// 						 	 sap.m.MessageBox.error(error);
		// 						 }
		// 					 })
		// 					 .load();                                                                                                                                                                
		
		// // 과거 데이터 조회
		// new JSONModelHelper().url("/odata/fix/Background_EvalResult?$filter=userId eq '" + userId + "'")
		// 					 .setAsync(false)
		// 					 .attachRequestCompleted(function(){
		// 							var data = this.getData().d;
									
		// 							if(data && data.results.length){
		// 								for(var i=0; i<data.results.length; i++){
		// 									data.results[i].Select = false;
		// 									data.results[i].Year = data.results[i].year * 1;
		// 									data.results[i].Grade1 = data.results[i].grade1;
		// 									data.results[i].Grade2 = data.results[i].grade2;
		// 									data.results[i].Grade5 = data.results[i].grade3;
		// 									data.results[i].Grade6 = data.results[i].grade4;
											
		// 									vData.Data.push(data.results[i]);
		// 								}
		// 							}
		// 					 })
		// 					 .attachRequestFailed(function() {
		// 							sap.m.MessageBox.error(arguments);
		// 							return;
		// 					 })
		// 					 .load();
		
	},
	
	onCellClick : function(oEvent){
		var sPath = oEvent.getParameters().rowBindingContext.sPath;
		var oTable = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table");
		
		var oData = oTable.getModel().getProperty(sPath);
		
		// 선택여부 표시
		var oTableData = oTable.getModel().getProperty("/Data");
		for(var i=0; i<oTableData.length; i++){
			if(oTableData[i].Appye == oData.Appye){
				oTable.getModel().setProperty("/Data/" + i + "/Select", true);
			} else {
				oTable.getModel().setProperty("/Data/" + i + "/Select", false);	
			}
		}
		
		common.SearchEvalResult._Year = common.SearchEvalResult._JSONModel.getProperty("/user/Year"); // 변경 전 평가연도
		common.SearchEvalResult._JSONModel.setProperty("/user/Year", oData.Appye); // 변경 후 평가연도
		
		common.SearchEvalResult.onChangeSection();
	},
	
	onPressSearch1 : function(oEvent){
		var userId = common.SearchEvalResult._JSONModel.getProperty("/user/userId");
		
		// 업적평가
		var oTable = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Table2");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		// filter, sort 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setFiltered(false);
			oColumns[i].setSorted(false);
		}
		
		/** 목표 조회
			개발(g110bc197) : 2019년 데이터가 없으므로 2020년부터 1로 계산하여 Entity명 생성
			QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
		var Idx = "", year = common.SearchEvalResult._JSONModel.getProperty("/user/Year");
		if(common.Common.getOperationMode() == "DEV"){
			Idx = (year == 2020 ? "1" : (year-2020) + 1);
		} else {
			Idx = (year == 2019 ? "1" : (year-2019) + 1);
		}
		
		// 역량평가
		var oChart = sap.ui.getCore().byId(common.SearchEvalResult.PAGEID + "_Chart");
		var oJSONModel2 = oChart.getModel();
		var vData2 = {Data : []};
		
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
					// goal[i].goals.results[j].Idx = (j+1);
					goal[i].goals.results[j].Idx = (vData.Data.length + 1);
					
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
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
		
		// 평가자 의견 초기화
		common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment1", "");
		common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment2", "");
		
		// 역량평가 점수 초기화
		oJSONModel2.setData(vData2);
		
		if(id == ""){
			sap.m.MessageBox.error(common.SearchEvalResult.oController.getBundleText("MSG_12001"), { // 평가문서가 존재하지 않습니다.
				onClose : function(){
					common.SearchEvalResult._StatusMessage.close();
					$(".spinner-evalresult")["hide"]();
				}
			});
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
								 
								 if(detail.length > 0){
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
		
		// 2020-11-18 2020년 이전 선택 시 데이터 호출 안함
		if(year < 2020){
			$(".spinner-evalresult")["hide"]();
			return;
		}
							 
		// template ID 조회
		var oTemplateId = "";
		var formDataId = "", formContentId = "";
		new JSONModelHelper().url("/odata/v2/FormTemplate?$filter=formTemplateType eq 'Review' and formTemplateName like '" + common.SearchEvalResultAgree.Appye + "년 업적%25'")
								.setAsync(false)
								.attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										oTemplateId = data.results[0].formTemplateId;
									}
								})
								.attachRequestFailed(function() {
									console.log("fail : 업적/역량평가 template id 조회");
									return;
								})
								.load();
								
		if(oTemplateId != ""){
			new JSONModelHelper().url("/odata/fix/FormHeader")
								.select("currentStep")
								.select("formDataId")
								.select("formDataStatus")
								.select("formLastContent")
								.expand("formLastContent")
								.filter("formTemplateId eq " + oTemplateId //(common.Common.getOperationMode() == "DEV" ? "703" : "500") 
										+ " and formDataStatus ne 4 and formSubjectId in " + userId)
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
		}
		
		if(formDataId == "" || formContentId == ""){
			sap.m.MessageBox.error(common.SearchEvalResult.oController.getBundleText("MSG_12001"), { // 평가문서가 존재하지 않습니다.
				onClose : function(){
					common.SearchEvalResult._StatusMessage.close();
					$(".spinner-evalresult")["hide"]();
				}
			});
			return;
		}
		
		// 1차평가 결과
		new JSONModelHelper().url("/odata/fix/FormContent?$filter=formDataId eq " + formDataId + "L and formContentId eq " + formContentId + "L")
							 //.expand("pmReviewContentDetail/competencySections/competencies/officialRating") // 역량평가 점수
							 .expand("pmReviewContentDetail/competencySections/competencies/selfRatingComment") // 역량평가 본인평가 점수
							 .expand("pmReviewContentDetail/objectiveSections/objectives/officialRating") // 1차평가 결과
							 .expand("pmReviewContentDetail/customSections/othersRatingComment") // 종합의견
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
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
										
										if(data.results[0].pmReviewContentDetail.results[0].customSections && data.results[0].pmReviewContentDetail.results[0].customSections.results.length){
											for(var i=0; i<data.results[0].pmReviewContentDetail.results[0].customSections.results.length; i++){
												if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "역량평가 의견"){
													// 역량평가 1차 평가자 의견
													var comment2 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
													for(var j=0; j<comment2.length; j++){
														if(comment2[j].commentLabel == "평가자 의견" || comment2[j].commentLabel == "Manager's Comments"){
															common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment2", comment2[j].comment);
														}
													}
												} else if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "업적평가 의견"){
													// 업적평가 1차 평가자 의견
													var comment1 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
													for(var j=0; j<comment1.length; j++){
														if(comment1[j].commentLabel == "평가자 의견" || comment1[j].commentLabel == "Manager's Comments"){
															common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment1", comment1[j].comment);
														}
													}
												}
											}
										}
										
										// 역량평가
										// var rating = data.results[0].pmReviewContentDetail.results[0].competencySections.results[0].competencies.results;
										// if(rating && rating.length){
										// 	var oCommon = [];
										// 	// 공통 역량 ID
										// 	switch(common.Common.getOperationMode()){
										// 		case "DEV":
										// 			oCommon = ["1263", "1271", "1273"];
										// 			break;
										// 		case "QAS":
										// 			oCommon = ["982", "984", "983"];
										// 			break;
										// 		case "PRD":
										// 			oCommon = ["1053", "1054", "1057"];
										// 			break;
										// 	}
											
										// 	vData2 = {Data : [{Name : common.SearchEvalResult.oController.getBundleText("LABEL_12115"), Rating1 : 0, Rating2 : 0}]};
											
										// 	for(var i=0; i<rating.length; i++){
										// 		var check = "";
										// 		for(var j=0; j<oCommon.length; j++){
										// 			if(rating[i].itemId == oCommon[j]){
										// 				check = "X";
														
										// 				// 부서장 평가 점수
										// 				vData2.Data[0].Rating2 = vData2.Data[0].Rating2 + parseFloat(rating[i].officialRating.rating);
														
										// 				// 본인평가 점수
										// 				if(rating[i].othersRatingComment && rating[i].othersRatingComment.results.length){
										// 					for(var k=0; k<rating[i].othersRatingComment.results.length; k++){
										// 						if(rating[i].othersRatingComment.results[k].userId == userId){
										// 							vData2.Data[0].Rating1 = vData2.Data[0].Rating1 + parseFloat(rating[i].othersRatingComment.results[k].rating);
										// 						}
										// 					}
										// 				}
										// 			}
										// 		}
												
										// 		if(check == ""){
										// 			var detail = {Name : rating[i].name.split("(")[0], Rating1 : 0, Rating2 : 0};
													
										// 			// 부서장 평가 점수
										// 			detail.Rating2 = parseFloat(rating[i].officialRating.rating);
													
										// 			// 본인평가점수
										// 			if(rating[i].othersRatingComment && rating[i].othersRatingComment.results.length){
										// 				for(var j=0; j<rating[i].othersRatingComment.results.length; j++){
										// 					if(rating[i].othersRatingComment.results[j].userId == userId){
										// 						detail.Rating1 = parseFloat(rating[i].othersRatingComment.results[j].rating);
										// 					}
										// 				}
										// 			}
													
										// 			vData2.Data.push(detail);
										// 		}
												
										// 	}
										// }
										
										// // 공통역량 평가점수 평균점수로 변경
										// vData2.Data[0].Rating1 = (vData2.Data[0].Rating1 / 3).toFixed(2) * 1;
										// vData2.Data[0].Rating2 = (vData2.Data[0].Rating2 / 3).toFixed(2) * 1;
										
										// oJSONModel2.setData(vData2);
										
										setTimeout(function(){
											common.SearchEvalResult._StatusMessage.close();
											$(".spinner-evalresult")["hide"]();
											
											common.SearchEvalResult.onPressSearch2();
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
								
								// 에러 시 평가자 의견 초기화
								common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment1", "");
								common.SearchEvalResult._JSONModel.setProperty("/Data2/Comment2", "");
								
								setTimeout(function(){
									common.SearchEvalResult._StatusMessage.close();
									$(".spinner-evalresult")["hide"]();
								}, 500);
							 })
							 .load();
							 
		// 역량평가 점수 조회
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV");
		var createData = {CompResultsNav : []};
			createData.Pernr = userId;
			createData.Appye = common.SearchEvalResult._JSONModel.getProperty("/user/Year") + "";
			
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
		    	common.SearchEvalResult.Error = "E";
						
				if (oError.response) {
					Err = window.JSON.parse(oError.response.body);
					var msg1 = Err.error.innererror.errordetails;
					if(msg1 && msg1.length) common.SearchEvalResult.ErrorMessage = Err.error.innererror.errordetails[0].message;
					else common.SearchEvalResult.ErrorMessage = Err.error.message.value;
				} else {
					common.SearchEvalResult.ErrorMessage = oError.toString();
				}
			}
		);	
		
		oJSONModel2.setData(vData2);
		
		if(common.SearchEvalResult.Error == "E"){
			common.SearchEvalResult.Error = "";
			sap.m.MessageBox.error(common.SearchEvalResult.ErrorMessage);
			return;
		}
		
	},
	
	onPressSearch2 : function(oEvent){
		var oData2 = [{ // 직무만족도
						Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
						Description1 : "", Description2 : "", Description3 : "", Description4 : "",
						nickname : "-"
					  },
					  { // 협업만족도
					  	Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
					  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
					  	nickname : "-"
					  },
					  { // 리더십만족도
					  	Score1 : 0, Score2 : 0, Score3 : 0, Score4 : 0,
					  	Description1 : "", Description2 : "", Description3 : "", Description4 : "",
					  	nickname : "-"
					  },
					  { // 강점,보완점
					  	Description1_1 : "", Description2_1 : "", Description3_1 : "", Description4_1 : "",
					  	Description1_2 : "", Description2_2 : "", Description3_2 : "", Description4_2 : "",
					  }];
					  
		for(var i=0; i<=3; i++){
			eval("oData2[" + i + "].nickname = common.SearchEvalResult._JSONModel.getProperty('/user/nickname');");
			eval("oData2[" + i + "].title = common.SearchEvalResult._JSONModel.getProperty('/user/title');");
		}
		
		common.SearchEvalResult._JSONModel.setProperty("/Data", oData2);
		
		// 1. 평가문서 조회
		var formDataId = "", formContentId = [];
			
		var templateID = ""; //(common.Common.getOperationMode() == "DEV" ? "719" : "502");
		new JSONModelHelper().url("/odata/v2/FormTemplate?$filter=formTemplateType eq '360' and formTemplateName like '" + common.SearchEvalResult.Year + "년 다면%25'")
								.setAsync(false)
								.attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										templateID = data.results[0].formTemplateId;
									}
								})
								.attachRequestFailed(function() {
									console.log("fail : 다면평가 template id 조회");
									return;
								})
								.load();
		if(templateID == "") return;

		var userId = common.SearchEvalResult._JSONModel.getProperty("/user/userId");
		
		new JSONModelHelper().url("/odata/fix/FormHeader?$filter=formTemplateId eq " + templateID + " and formDataStatus ne 4 and formSubjectId eq '" + userId + "'")
							 .select("currentStep")
							 .select("formDataId")
							 .select("formDataStatus")
							 .select("formContents/formContentId")
							 .select("formContents/status")
							 .expand("formContents")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										for(var i=0; i<data.results.length; i++){
											if(data.results[i].currentStep == null && data.results[i].formContents){
												formDataId = data.results[i].formDataId;
												for(var j=0; j<data.results[i].formContents.results.length; j++){
													if(data.results[i].formContents.results[j].status == "3" || data.results[i].formContents.results[j].status == "10"){
														formContentId.push(data.results[i].formContents.results[j].formContentId);
													}
												}
											}
										}
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.SearchEvalResult._BusyDialog.close();
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
		
		formContentId.sort();
		
		if(formDataId == "" || formContentId.length == 0){
			// sap.m.MessageBox.error(common.SearchEvalResult.oController.getBundleText("MSG_12001"), { // 평가문서가 존재하지 않습니다.
			// 	onClose : function(){
					common.SearchEvalResult._StatusMessage.close();
					$(".spinner-evalresult")["hide"]();
			// 	}
			// });
			return;
		}
	
		// 2. 다면평가 전체 평균점수 계산, 평가자 리스트 생성 - 가장 큰 formContentId로 조회
		var rating = 0, rater = [];
		
		new JSONModelHelper().url("/odata/fix/Form360RaterSection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L)")
							 .expand("form360Raters")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data){
										if(data.form360Raters && data.form360Raters.results.length){
											for(var i=0; i<data.form360Raters.results.length; i++){
												// 2020-11-20 평가 점수가 없는 경우 평가자 리스트 제외
												if(data.form360Raters.results[i].participantRating == "") continue;
												
												rater.push({
													category : data.form360Raters.results[i].category,
													formContentId : data.form360Raters.results[i].formContentId,
													userId : data.form360Raters.results[i].participantID
												});
												
												if(data.form360Raters.results[i].participantRating){
													rating += parseFloat(data.form360Raters.results[i].participantRating.split("/")[0]);
												}
											}
											
											// 2020-11-20 평균점수 계산 시 평가자 리스트로 계산하도록 수정
											// rating = rating / data.form360Raters.results.length;
											rating = rater.length == 0 ? 0 : rating / rater.length;
										}	
									}
							 })
							 .attachRequestFailed(function(error){
							 	common.SearchEvalResult._BusyDialog.close();
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
		
		common.SearchEvalResult._JSONModel.setProperty("/user/rating", (rating == 0 ? "" : rating.toFixed(2)));
		
		// 평가문서 조회 완료
		common.SearchEvalResult._MessageJSONModel.setProperty("/Data/0", {Type : "Success", Text : common.SearchEvalResult.oController.getBundleText("MSG_12014")});

		// comment 태그 수정
		var onChangeComment = function(comment){
			var tmp = (comment || "").split("<p>");
			var message = "";
			for(var i=1; i<tmp.length; i++){
				if(i==1){
					tmp[i] = "<p>- " + tmp[i];
				} else {
					tmp[i] = "<p><span style='padding-left:9px' />" + tmp[i];
				}
				
				message = message + tmp[i];
			}
			
			return message;
		};
		
		// 3. 만족도
		var itemId = [];

		new JSONModelHelper().url("/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=3)/competencies")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										for(var i=0; i<data.results.length; i++){
											itemId.push({itemId : data.results[i].itemId, itemIndex : data.results[i].itemIndex, name : data.results[i].name});
											
											if(data.results[i].itemIndex == "2"){
												oData2[0].section2 = "X";
											}
										}	
									} else {
									 	oData2[0].section2 = "";
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.SearchEvalResult._BusyDialog.close();
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
		
		itemId.sort(function(a,b){
			if(a.itemIndex > b.itemIndex){
				return 1;
			} else if(a.itemIndex < b.itemIndex){
				return -1;
			} else {
				return 0;
			}
		});
		
		// 3-1. 만족도 항목 별 점수 및 응답내용 조회
		var promise = [], rating = [], comment = [];
		for(var i=0; i<itemId.length; i++){
			for(var j=0; j<rater.length; j++){
				promise.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)")
						                     .expand("officialRating,othersRatingComment")
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data){
										// 만족도 점수
										if(data.officialRating){
											rating.push({
												formContentId : data.officialRating.formContentId,
												itemId : data.officialRating.itemId,
												rating : data.officialRating.rating,
												textRating : data.officialRating.textRating
											});
										}
										
										// 항목 별 응답내용
										if(data.othersRatingComment && data.othersRatingComment.results.length > 0){
											comment.push({
												formContentId : data.othersRatingComment.results[0].formContentId,
												itemId : data.othersRatingComment.results[0].itemId,
												comment : onChangeComment(data.othersRatingComment.results[0].comment)
											});
										}
									}
									resolve();
							 })
							.attachRequestFailed(function(error){
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
									 reject();
								 } else {
								 	 sap.m.MessageBox.error(error);
	 								 reject();
								 }
							 })
							 .load();
					})
				);
				// promise.push(
				// 	new Promise(function(resolve, reject){
				// 		new JSONModelHelper().url("/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)/officialRating")
				// 			 .attachRequestCompleted(function(){
				// 					var data = this.getData().d;
									
				// 					if(data){
				// 						rating.push({
				// 							formContentId : data.formContentId,
				// 							itemId : data.itemId,
				// 							rating : data.rating,
				// 							textRating : data.textRating
				// 						});
				// 					}
				// 					resolve();
				// 			 })
				// 			.attachRequestFailed(function(error){
				// 				 if(error.getParameters() && error.getParameters().message == "error"){
				// 				 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
				// 				 	 sap.m.MessageBox.error(message);
				// 					 reject();
				// 				 } else {
				// 				 	 sap.m.MessageBox.error(error);
	 		// 						 reject();
				// 				 }
				// 			 })
				// 			 .load();
				// 	})
				// );
				
				// promise.push(
				// 	new Promise(function(resolve, reject){
				// 		new JSONModelHelper().url("/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)/selfRatingComment")
				// 							 .attachRequestCompleted(function(){
				// 									var data = this.getData().d;
													
				// 									if(data){
				// 										comment.push({
				// 											formContentId : data.formContentId,
				// 											itemId : data.itemId,
				// 											comment : onChangeComment(data.comment)
				// 										});
				// 									}
				// 									resolve();
				// 							 })
				// 							 .attachRequestFailed(function(error){
				// 								 if(error.getParameters() && error.getParameters().message == "error"){
				// 								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
				// 								 	 sap.m.MessageBox.error(message);
				// 									 reject();
				// 								 } else {
				// 								 	 sap.m.MessageBox.error(error);
				// 	 								 reject();
				// 								 }
				// 							 })
				// 							 .load();
				// 	})
				// );
			}
		}
		
		Promise.all(promise).then(function(){
	 		setTimeout(function(){
				var result = [];
				for(var i=0; i<rating.length; i++){
					for(var j=0; j<comment.length; j++){
						if(rating[i].formContentId == comment[j].formContentId && rating[i].itemId == comment[j].itemId){
							var tmp = {};
 								Object.assign(tmp, rating[i], comment[j]);
 							result.push(tmp);
						}
					}
				}
					
				for(var i=0; i<itemId.length; i++){
					//  상사		팀내		팀외		부하		
					var score1 = 0, score2 = 0, score3 = 0, score4 = 0; // 점수
					var comment1 = "", comment2 = "", comment3 = "", comment4 = ""; // 응답내용
					var count1 = 0, count2 = 0, count3 = 0, count4 = 0; // 인원수
					var total = 0, total2 = 0; // 총점, 평가자 수
					
					for(var j=0; j<result.length; j++){
						if(itemId[i].itemId == result[j].itemId){
							for(var k=0; k<rater.length; k++){
								if(rater[k].formContentId == result[j].formContentId){
									switch(rater[k].category){
										case "상사":
											score1 = score1 + parseFloat(result[j].rating);
											comment1 = comment1 + result[j].comment;
											count1++;
											break;
										case "동료(팀내)":
											score2 = score2 + parseFloat(result[j].rating);
											comment2 = comment2 + result[j].comment;
											count2++;
											break;
										case "동료(팀외)":
											score3 = score3 + parseFloat(result[j].rating);
											comment3 = comment3 + result[j].comment;
											count3++;
											break;
										case "부하":
											score4 = score4 + parseFloat(result[j].rating);
											comment4 = comment4 + result[j].comment;
											count4++;
											break;
									}
								}
							}
						}
					}
					
					for(var a=1; a<=4; a++){
						eval("oData2[(itemId[i].itemIndex)].Score" + a + " = count" + a + " == 0 ? 0 : parseFloat((score" + a + " / count" + a + ").toFixed(2));");
						eval("oData2[(itemId[i].itemIndex)].Count" + a + " = count" + a + ";");
						eval("oData2[(itemId[i].itemIndex)].Description" + a + " = comment" + a);
						eval("if(count" + a + " != 0){total2++};")
						total += eval("oData2[(itemId[i].itemIndex)].Score" + a);
					}
					
					oData2[(itemId[i].itemIndex)].Total = total2 == 0 ? 0 : (total / total2);
					
					// 리더십 만족도의 경우 각 카테고리 별 비율을 계산함
					if(itemId[i].itemIndex == "2"){
						var percentage = function(score, count){
							if(score == 0 || count == 0) return "";
							
							return parseFloat(((score / count) * 100).toFixed(2)) + "%";
						};
						
						for(var a=1; a<=4; a++){
							var etc = eval("comment" + a);
							var	category = etc.split("</p>");
							
							var count = eval("count" + a);
							var score1 = 0, score2 = 0, score3 = 0, score4 = 0, score5 = 0, score6 = 0; 
							
							eval("oData2[(itemId[i].itemIndex)].Description" + a + " = ''");
								
							for(var b=0; b<category.length-1; b++){
								// 태그를 삭제하고 3자 이상이면 무조건 기타, 아닌 경우 각 카테고리 별 비율 계산한다.
								// comment 기타인 경우에만 표기되도록 함
								var text = category[b].replace(/<p>- /g, "");
								
								// 2020-11-20 무조건 카테고리 항목과 동일한 경우만 비율 계산, 이외는 전부 기타처리
								// 2021-05-17 Category.length == 2 삭제 
								// if(text.length == 3 && category.length == 2){
								if(text.length == 3 ){
									if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06110")) != -1){ // 지시형
										score1++;
									} else if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06111")) != -1){ // 비전형
										score2++;
									} else if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06112")) != -1){ // 솔선형
										score3++;
									} else if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06113")) != -1){ // 친화형
										score4++;
									} else if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06114")) != -1){ // 육성형
										score5++;
									} else if(text.indexOf(common.SearchEvalResult.oController.getBundleText("LABEL_06115")) != -1){ // 민주형
										score6++;
									} else {
										eval("oData2[(itemId[i].itemIndex)].Description" + a + " = category[b] + '</p>'");
									}	
								} else {
									eval("oData2[(itemId[i].itemIndex)].Description" + a + " = oData2[(itemId[i].itemIndex)].Description" + a + " + category[b] + '</p>'");
								}
							}
							
							for(var b=1; b<=6; b++){
								var tmp = eval("percentage(score" + b + ", count);");
								eval("oData2[2].Score" + a + "_" + b + " = tmp;");
							}
						}
					}
				}
			
				common.SearchEvalResult._JSONModel.setProperty("/Data", oData2);
				
				// 점수 summary 데이터 생성
				var summary = [{
									key : "9",
									label : common.SearchEvalResult.oController.getBundleText("LABEL_06125"), // 종합
									value : common.SearchEvalResult._JSONModel.getProperty("/user/rating") * 1
							   },
							   {
						   			key : "0",
									label : common.SearchEvalResult.oController.getBundleText("LABEL_06126"), // 직무
									value : parseFloat(oData2[0].Total).toFixed(2) * 1
							   },
							   {
								 	key : "1",
									label : common.SearchEvalResult.oController.getBundleText("LABEL_06127"), // 협업
									value : parseFloat(oData2[1].Total).toFixed(2) * 1
							   }];
							   
				if(common.SearchEvalResult._JSONModel.getProperty("/Data/0/section2") == "X"){
					summary.push({
						key : "2",
						label : common.SearchEvalResult.oController.getBundleText("LABEL_06128"), // 리더십
						value : parseFloat(oData2[2].Total).toFixed(2) * 1
					});
				}
				
				common.SearchEvalResult._JSONModel.setProperty("/summary", summary);
				
				// 평가 점수 조회 완료
				common.SearchEvalResult._MessageJSONModel.setProperty("/Data/2", {Type : "Success", Text : common.SearchEvalResult.oController.getBundleText("MSG_12021")});
	 		});
		});
		
		// 2. 강점
		var id1 = "";
		new JSONModelHelper().url("/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=4)/competencies")
							 .setAsync(false)    
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										id1 = data.results[0].itemId;
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.SearchEvalResult._BusyDialog.close();
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
		
		if(id1 != ""){
			var promise2 = [], description1 = [];
			for(var i=0; i<rater.length; i++){
				promise2.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id1 + "L,sectionIndex=4)/othersRatingComment")
											 .attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data.results && data.results.length > 0){
														description1.push({
													 		formContentId : data.results[0].formContentId,
													 		comment : onChangeComment(data.results[0].comment)
													 	});
													}
													resolve();
											 })
											 .attachRequestFailed(function(error){
												 if(error.getParameters() && error.getParameters().message == "error"){
												 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
												 	 sap.m.MessageBox.error(message);
													 reject();
												 } else {
												 	 sap.m.MessageBox.error(error);
					 								 reject();
												 }
											 })
											 .load();
					})
				);
			}
			
			Promise.all(promise2).then(function(){
		 		setTimeout(function(){
		 			var comnt1 = "", comnt2 = "", comnt3 = "", comnt4 = "";
		 			for(var i=0; i<description1.length; i++){
		 				for(var j=0; j<rater.length; j++){
		 					if(description1[i].formContentId == rater[j].formContentId){
		 						switch(rater[j].category){
		 							case "상사":
										comnt1 = comnt1 + description1[i].comment;
										break;
									case "동료(팀내)":
										comnt2 = comnt2 + description1[i].comment;
										break;
									case "동료(팀외)":
										comnt3 = comnt3 + description1[i].comment;
										break;
									case "부하":
										comnt4 = comnt4 + description1[i].comment;
										break;
		 						}
		 					}
		 				}
		 			}
		 			
		 			for(var i=1; i<=4; i++){
		 				eval("oData2[3].Description" + i + "_1 = comnt" + i);
		 			}
		 			
					common.SearchEvalResult._JSONModel.setProperty("/Data", oData2);
		 		});
			});
		}
		
		// 3. 보완점
		var id2 = "";
		new JSONModelHelper().url("/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=5)/competencies")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										id2 = data.results[0].itemId;
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.SearchEvalResult._BusyDialog.close();
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
		
		if(id2 != ""){
			var promise3 = [], description2 = [];
			for(var i=0; i<rater.length; i++){
				promise3.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id2 + "L,sectionIndex=5)/othersRatingComment")
											 .attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data.results && data.results.length > 0){
														description2.push({
													 		formContentId : data.results[0].formContentId,
													 		comment : onChangeComment(data.results[0].comment)
													 	});
													}
													resolve();
											 })
											 .attachRequestFailed(function(error){
												 if(error.getParameters() && error.getParameters().message == "error"){
												 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
												 	 sap.m.MessageBox.error(message);
													 reject();
												 } else {
												 	 sap.m.MessageBox.error(error);
					 								 reject();
												 }
											 })
											 .load();
					})
				);
			}
			
			Promise.all(promise3).then(function(){
		 		setTimeout(function(){
		 			var comnt1 = "", comnt2 = "", comnt3 = "", comnt4 = "";
		 			for(var i=0; i<description2.length; i++){
		 				for(var j=0; j<rater.length; j++){
		 					if(description2[i].formContentId == rater[j].formContentId){
		 						switch(rater[j].category){
		 							case "상사":
										comnt1 = comnt1 + description2[i].comment;
										break;
									case "동료(팀내)":
										comnt2 = comnt2 + description2[i].comment;
										break;
									case "동료(팀외)":
										comnt3 = comnt3 + description2[i].comment;
										break;
									case "부하":
										comnt4 = comnt4 + description2[i].comment;
										break;
		 						}
		 					}
		 				}
		 			}
		 			
		 			for(var i=1; i<=4; i++){
		 				eval("oData2[3].Description" + i + "_2 = comnt" + i);
		 			}
		 			
		 			// 평가 항목 조회 완료
		 			common.SearchEvalResult._MessageJSONModel.setProperty("/Data/1", {Type : "Success", Text : common.SearchEvalResult.oController.getBundleText("MSG_12020")});
					common.SearchEvalResult._JSONModel.setProperty("/Data", oData2);
					
					setTimeout(function(){
						common.SearchEvalResult._StatusMessage.close()
						$(".spinner-evalresult")["hide"]();
					}, 500);
		 		});
			});
		}
	},
	
	// 다면평가 - 직무만족도, 협업만족도
	makeMatrix1 : function(Flag){
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90px", "220px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06104")}).addStyleClass("FontFamily")], // 점수
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score1}",
											 	 	percentValue : "{Score1}",
											 	 	state : {
											 	 		path : "Score1",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
											 	})],
									hAlign : "Begin",
									vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score2}",
											 	 	percentValue : "{Score2}",
											 	 	state : {
											 	 		path : "Score2",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
											 	})],
									hAlign : "Begin",
									vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score3}",
											 	 	percentValue : "{Score3}",
											 	 	state : {
											 	 		path : "Score3",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
											 	})],
									hAlign : "Begin",
									vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score4}",
											 	 	percentValue : "{Score4}",
											 	 	state : {
											 	 		path : "Score4",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
											 	})],
									hAlign : "Begin",
									vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["170px", "90px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
												    text : (Flag == "0" ? common.SearchEvalResult.oController.getBundleText("MSG_06001") : common.SearchEvalResult.oController.getBundleText("MSG_06002")),
												    textAlign : "Center"
											    }).addStyleClass("Font14 FontGray paddingTop38")],
									 hAlign : "Center",
									 vAlign : "Top",
									 rowSpan : 5
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06105")}).addStyleClass("FontFamily")], // 응답내용
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description1",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description2",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description3",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description4",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["311px", "6px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({		  // 직무만족도													협업만족도
												 	text : (Flag == "0" ? common.SearchEvalResult.oController.getBundleText("LABEL_06118") : common.SearchEvalResult.oController.getBundleText("LABEL_06119"))
												}).addStyleClass("Font18 Font700")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oMatrix1],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [oMatrix2],
								 	 hAlign : "Begin", 
								 	 vAlign : "Top"
								 })]
					})]
		});
		
		return oMatrix;
	},
	
	// 다면평가 - 리더십 만족도    
	makeMatrix2 : function(oEvent){
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90px", "220px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06104")}).addStyleClass("FontFamily")], // 점수
								 	 hAlign : "Center", 
								 	 vAlign : "Middle"
								 }).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score1}",
											 	 	percentValue : "{Score1}",
											 	 	state : {
											 	 		path : "Score1",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score2}",
											 	 	percentValue : "{Score2}",
											 	 	state : {
											 	 		path : "Score2",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score3}",
											 	 	percentValue : "{Score3}",
											 	 	state : {
											 	 		path : "Score3",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ProgressIndicator({
											 	 	displayValue : "{Score4}",
											 	 	percentValue : "{Score4}",
											 	 	state : {
											 	 		path : "Score4",
											 	 		formatter : function(fVal){
											 	 			return fVal <= 30 ? "Error" : "Information";
											 	 		}
											 	 	},
											 	 	width : "100%"
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 9,
			width : "100%",
			widths : ["170px", "90px", "62px", "62px", "62px", "62px", "62px", "62px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({ // ~의 리더십 스타일은 ( )이다.
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("MSG_06003"), textAlign : "Center"}).addStyleClass("Font14 FontGray paddingTop38")],
								 	 hAlign : "Center",
								 	 vAlign : "Top",
								 	 rowSpan : 5
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06110")}).addStyleClass("FontFamily")], // 지시형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06111")}).addStyleClass("FontFamily")], // 비전형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06112")}).addStyleClass("FontFamily")], // 솔선형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06113")}).addStyleClass("FontFamily")], // 친화형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06114")}).addStyleClass("FontFamily")], // 육성형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06115")}).addStyleClass("FontFamily")], // 민주형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06123")}).addStyleClass("FontFamily")], // 기타
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description1",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_5}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score1_6}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description2",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_5}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score2_6}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description3",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_5}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score3_6}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							path : "Description4",
							formatter : function(fVal){
								return fVal == "" ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_3}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_5}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Score4_6}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["311px", "6px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06120")}).addStyleClass("Font18 Font700")], // 리더십 만족도
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oMatrix1],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [oMatrix2],
								 	 hAlign : "Begin", 
								 	 vAlign : "Top"
								 })]
					})]
		});
		
		return oMatrix;
	},
	
	// 다면평가 - 강점/보완점
	makeMatrix3 : function(oEvent){
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["310px", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06121")}).addStyleClass("Font18 Font700")], // 강점/보완점
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06103")}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06116")}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06117")}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description1_1"}, {path : "Description1_2"}],
							formatter : function(fVal1, fVal2){
								return (fVal1 == "" && fVal2 == "") ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description2_1"}, {path : "Description2_2"}],
							formatter : function(fVal1, fVal2){
								return (fVal1 == "" && fVal2 == "") ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description3_1"}, {path : "Description3_2"}],
							formatter : function(fVal1, fVal2){
								return (fVal1 == "" && fVal2 == "") ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description4_1"}, {path : "Description4_2"}],
							formatter : function(fVal1, fVal2){
								return (fVal1 == "" && fVal2 == "") ? "35px" : "";
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4_1}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		return oMatrix;
	},
	
	// 업적&역량평가
	makeMatrix4 : function(oEvent){
		var oTable = new sap.ui.table.Table(common.SearchEvalResult.PAGEID + "_Table2", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "None",
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// No., 목표, 진척률, 수시평가, 1차평가
		var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "name", label : common.SearchEvalResult.oController.getBundleText("LABEL_12109"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin"},
						{id: "done", label : common.SearchEvalResult.oController.getBundleText("LABEL_12110"), plabel : "", span : 0, type : "progress", sort : true, filter : true, width : "180px"},
						{id: "customScore", label : common.SearchEvalResult.oController.getBundleText("LABEL_12111"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "rating", label : common.SearchEvalResult.oController.getBundleText("LABEL_12112"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"}];

		common.makeTable.makeColumn(common.SearchEvalResult.oController, oTable, col_info);
		common.make
		//////////////////////////////////////////////////////
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : common.SearchEvalResult.oController.getBundleText("LABEL_12116"), // 평가 항목
					value : "{Compgrptx}"
				}
			],
			measures : [
				{
					name : common.SearchEvalResult.oController.getBundleText("LABEL_12117"), // 본인평가점수
					value : "{Comppnt1}"  
				},
				{
					name : common.SearchEvalResult.oController.getBundleText("LABEL_12118"), // 평가점수
					value : "{Comppnt2}"  
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(common.SearchEvalResult.PAGEID + "_Chart", {
			width: "100%",
			height: "400px",
			vizType : "radar",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [common.SearchEvalResult.oController.getBundleText("LABEL_12116")]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [common.SearchEvalResult.oController.getBundleText("LABEL_12117"), common.SearchEvalResult.oController.getBundleText("LABEL_12118")]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
	                    visible: false
	                },
	                colorPalette :  ["#ffcd56", "#4bc0c0"],
	                polarAxis : {
	                	label : {
	                		style : {
	                			color : "#333333",
	                			fontSize : "16px",
	                			fontWeight : "500"
	                		}
	                	}
	                },
	                gridline: {
	                	color : "#e6e6e6"
	                }
				},
				legend: {
					visible : true
				},
				legendGroup: {
					layout : {
						alignment: "center",
						position: "bottom"
					}
				},
	            valueAxis: {
	                label: {
						allowDecimals : false
	                },
	                title: {
	                    visible: false
	                }
	            },
	            categoryAxis: {
	                title: {
	                    visible: false
	                }
	            },
	            title: {
	            	text : "",
	                visible: false
	            },
	            interaction : { 
	            	selectability : { 
	            		mode : "single" 
	            	} 
	            }
			}
		});
		
		oVizFrame.setModel(new sap.ui.model.json.JSONModel());
		
		var oPopOver = new sap.viz.ui5.controls.Popover();
			oPopOver.connect(oVizFrame.getVizUid());
		
		//////////////////////////////////////////////////////
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["", "24px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_12102")}).addStyleClass("Font18 Font700")], // 업적평가
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_12103")}).addStyleClass("Font18 Font700")], // 역량평가
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oTable],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [oVizFrame],
								 	 hAlign : "Center",
								 	 vAlign : "Top"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_12113")}).addStyleClass("Font18 Font700")], // 업적평가 1차 평가자 의견
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.SearchEvalResult.oController.getBundleText("LABEL_12114")}).addStyleClass("Font18 Font700")], // 역량평가 1차 평가자 의견
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.FormattedText({htmlText : "{Comment1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }).addStyleClass("Data paddingTop10 paddingBottom10"),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Comment2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Top"
								 }).addStyleClass("Data paddingTop10 paddingBottom10")]
					})]
		});
		
		return oMatrix;
	}
};
