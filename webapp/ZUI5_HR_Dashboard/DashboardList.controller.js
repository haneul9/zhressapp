jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Dashboard.DashboardList", {

		PAGEID : "DashboardList",
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_UserJSonModel : new sap.ui.model.json.JSONModel(),
		_UserList : "",
		_Columns : null, // 목표관리 excel download
		
		_BusyDialog : new sap.m.BusyDialog(),
		
		onInit : function(){
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);

	//		var bus = sap.ui.getCore().getEventBus();
	//		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

			var bus2 = sap.ui.getCore().getEventBus();
			bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
			
			var oController = this;
			oController.SmartSizing();
			$(window).resize(function(){
				oController.SmartSizing();
			});
		},
		
		onBeforeShow : function(oEvent){
			var oController = this;
			
			if(!oController._ListCondJSonModel.getProperty("/Data")){
				var oYear = sap.ui.getCore().byId(oController.PAGEID + "_Year");
					oYear.destroyItems();
				
				var year = new Date().getMonth() < 3 ? new Date().getFullYear() - 1 : new Date().getFullYear();	
					
				for(var i=year; i>=2020; i--){
					oYear.addItem(new sap.ui.core.Item({key : (i+""), text : (i+"")}));
				}
				
				var vData = {
					Data : {
						Year : (new Date().getFullYear() + ""),
						Sessty : "A" // 2020-12-18 종합평가 관련 로직 추가                       
					}
				};
				
				// scrollcontainer Busy State 설정
				for(var i=1; i<=6; i++){
					eval("sap.ui.getCore().byId(oController.PAGEID + '_Content" + i + "').setBusy(true);");
				} 
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow : function(oEvent){
			var oController = this;
			
			// setTimeout(function(){
				// 대상자 리스트
				oController.onSearchUserList(oEvent);
			// }, 500);
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			var width = window.innerWidth;
			var oGridContainer = sap.ui.getCore().byId(oController.PAGEID + "_GridContainer");
			var oScrollContainer = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer");
			
			var isIE = (navigator.userAgent.toLowerCase().indexOf("trident") != -1) ? true : false;
				// oScrollContainer.setHorizontal(isIE);
			
			if(width > 1505){
				oGridContainer.setWidth("1505px");
				
				if(isIE == true){
					oScrollContainer.setWidth("100%");
				}
			} else {
				if(isIE == true){
					oScrollContainer.setWidth((width + "px"));
					oGridContainer.setWidth("1505px");
				} else {
					oGridContainer.setWidth("");
				}
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			// 목표 데이터 조회
			oController.onSearchGoalData();
			
			// 업적&역량 평가, 업적평가등급, 평가현황
			oController.makeContent3(oEvent);
			
			// 종합평가
			oController.makeContent4(oEvent);
		},
		
		onSetTemplateId : function(oController){
			//  목표			  다면평가
			var oTemplateId1 = "", oTemplateId2 = "";
			
			var oYear = oController._ListCondJSonModel.getProperty("/Data/Year");
		
			// if(oYear == "2020"){
			// 	switch(common.Common.getOperationMode()){
			// 		case "DEV":
			// 			oTemplateId1 = "703";
			// 			oTemplateId2 = "719";
			// 			break;
			// 		case "QAS":
			// 			oTemplateId1 = "500";
			// 			oTemplateId2 = "502";
			// 			break;
			// 		case "PRD":
			// 			oTemplateId1 = "500";
			// 			oTemplateId2 = "502";
			// 			break;
			// 	}
			// } else if(oYear == "2021") {
			// 	switch(common.Common.getOperationMode()){
			// 		case "DEV":
			// 			oTemplateId1 = "779";
			// 			oTemplateId2 = "";
			// 			break;
			// 		case "QAS":
			// 			oTemplateId1 = "520";
			// 			oTemplateId2 = "";
			// 			break;
			// 		case "PRD":
			// 			oTemplateId1 = "520";
			// 			oTemplateId2 = "";
			// 			break;
			// 	}
			// }
			
			// 2021-05-24 평가문서 template id 조회로직 변경
			new JSONModelHelper().url("/odata/v2/FormTemplate?$filter=formTemplateType eq 'Review' and formTemplateName like '" + oYear + "년 업적%25'")
								.setAsync(false)
								.attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										oTemplateId1 = data.results[0].formTemplateId;
									}
								})
								.attachRequestFailed(function() {
									console.log("fail : 업적/역량평가 template id 조회");
									return;
								})
								.load();
			
			new JSONModelHelper().url("/odata/v2/FormTemplate?$filter=formTemplateType eq '360' and formTemplateName like '" + oYear + "년 다면%25'")
								.setAsync(false)
								.attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										oTemplateId2 = data.results[0].formTemplateId;
									}
								})
								.attachRequestFailed(function() {
									console.log("fail : 다면평가 template id 조회");
									return;
								})
								.load();
								
			// if(oTemplateId1 == "" || oTemplateId2 == ""){
			// 	sap.m.MessageBox.error(oBundleText.getText("MSG_05004")); // 목표/다면평가 template id 조회 시 오류가 발생하였습니다.
			// 	return;
			// }
			
			oController._ListCondJSonModel.setProperty("/Data/TemplateId1", oTemplateId1);
			oController._ListCondJSonModel.setProperty("/Data/TemplateId2", oTemplateId2);
		},
		
		// 대상자 리스트
		onSearchUserList : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();

			// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
			oController._UserList = ""; 
			
			var vData = {Data : []}, 
				vData2 = {Data : []},
				oCode = [];
			
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var createData = {NavCommonCodeList : [], ICodeT : "066"};
			oModel.create("/CommonCodeListHeaderSet", createData, {
				success: function(data, res){
					if(data){
						if(data.NavCommonCodeList && data.NavCommonCodeList .results){
							var data1 = data.NavCommonCodeList.results;
							
							for(var i=0; i<data1.length; i++){
								oCode.push(data1[i].Code);
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

			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			new JSONModelHelper().url("/odata/v2/User('" + (oController.getSessionInfoByKey("Pernr") * 1) + "')/directReports")
								.select("userId")
								.select("nickname")
								.select("title")
								.select("custom01")
								.select("department")
								.select("division")
								.select("jobCode")
								.select("custom04")
								.select("custom07")
								.setAsync(false)
								.attachRequestCompleted(function(){
										var data = this.getData().d;
										
										if(data && data.results.length){
											for(var i=0; i<data.results.length; i++){
												if(data.results[i].custom04 != null) continue; // 평가 대상 제외

												var check = "";
												for(var j=0; j<oCode.length; j++){
													if(data.results[i].custom07 == oCode[j]){
														check = "X";
													}
												}
												if(check == "") continue;
												
												if(i==0){
													oController._UserList = data.results[i].userId;
												} else {
													oController._UserList += "," + data.results[i].userId;
												}
												
												data.results[i].Ename = data.results[i].nickname;
												
												data.results[i].title = data.results[i].title.split(" (")[0];
												
												data.results[i].Count1 = 0;
												data.results[i].Count2 = 0;
												data.results[i].Count3 = 0;
												
												vData.Data.push(data.results[i]);
											}
										}
								})
								.attachRequestFailed(function() {
										sap.m.MessageBox.error(oBundleText.getText("MSG_05002")); // 부서원 조회 시 오류가 발생하였습니다.
										return;
								})
								.load();
			
			var photo = [], promise = [];
			
			for(var i=0; i<vData.Data.length; i++){
				promise.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + vData.Data[i].userId + "' and photoType eq '1'")
											.select("photo")
											.select("userId")
											.attachRequestCompleted(function(){
												var data = this.getData().d;
												
												if(data && data.results.length){
													for(var i=0; i<data.results.length; i++){
														data.results[i].photo = "data:text/plain;base64," + data.results[i].photo;
														photo.push(data.results[i]);
													}
												}
												resolve();
											})
											.attachRequestFailed(function() {
													reject(vData.Data[i].userId);
											})
											.load();
					})
				);
			}
			
			Promise.all(promise)
			.then(function(){
				setTimeout(function(){
					for(var i=0; i<vData.Data.length; i++){
						var check = "";
						for(var j=0; j<photo.length; j++){
							if(vData.Data[i].userId == photo[j].userId){
								check = "X";
								var tmp = {};
								$.extend(true, tmp, vData.Data[i], photo[j]);
								
								vData2.Data.push(tmp);
							}
						}
						// 사진이 없는 경우도 리스트 추가
						if(check == ""){
							vData2.Data.push(vData.Data[i]);
						}
					}
					
					oController._UserJSonModel.setData(vData2);
					
					if(oController._UserList == ""){
						sap.m.MessageBox.error(oBundleText.getText("MSG_05021")); // 부서원이 존재하지 않거나, 조회 시 오류가 발생하였습니다.
						return;
					} else {
						oController.onPressSearch();
					}
				});
			})
			.catch(function(error){
				sap.m.MessageBox.error(oBundleText.getText("MSG_05003")); // 사진 조회 시 오류가 발생하였습니다.
				return;
			});
		},
		
		// 목표관리
		onSearchGoalData  : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			// scrollcontainer busy state 설정
			sap.ui.getCore().byId(oController.PAGEID + "_Content1").setBusy(true);
			sap.ui.getCore().byId(oController.PAGEID + "_Content2").setBusy(true);
			
			var search = function(){
				var vData = oController._UserJSonModel.getProperty("/Data");
				
				var goal = [], activity = [], activityComment = [], achievement = [], feedback = [];
				var activityId = "";
				
				var oTimeline = sap.ui.getCore().byId(oController.PAGEID + "_Timeline");
					oTimeline.getModel().setData(null);
				
				var year = oController._ListCondJSonModel.getProperty("/Data/Year");
				
				var promise = [
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Activity?$filter=subjectUserId in " + oController._UserList
												+ " and createdDateTime ge '" + year + "-01-01'")
											.attachRequestCompleted(function(){
												var data = this.getData().d;
												
												if(data && data.results.length){
													for(var i=0; i<data.results.length; i++){
														if(i==0){
															activityId = data.results[i].activityId;
														} else {
															activityId += "," + data.results[i].activityId;
														}
														
														// date 변경
														data.results[i].createdDateTime = data.results[i].createdDateTime ? new Date(data.results[i].createdDateTime.substring(6,19) * 1) : null;
														
														activity.push(data.results[i]);
													}
												}
												resolve();
											})
											.attachRequestFailed(function(error) {
												if(error.getParameters() && error.getParameters().message == "error"){
													var message = JSON.parse(error.getParameters().responseText).error.message.value;
													// sap.m.MessageBox.error(message);
													reject();
												} else {
													// sap.m.MessageBox.error(error);
													reject();
												}
											})
											.load();
					}),
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Achievement?$filter=subjectUserId in " + oController._UserList
												+ " and createdDateTime ge '" + year + "-01-01'")
											.attachRequestCompleted(function(){
												var data = this.getData().d;
												
												if(data && data.results.length){
													for(var i=0; i<data.results.length; i++){
														// date 변경
														data.results[i].createdDateTime = data.results[i].createdDateTime ? new Date(data.results[i].createdDateTime.substring(6,19) * 1) : null;
														
														achievement.push(data.results[i]);
													}
												}
												resolve();
											})
											.attachRequestFailed(function(error) {
												if(error.getParameters() && error.getParameters().message == "error"){
													var message = JSON.parse(error.getParameters().responseText).error.message.value;
													// sap.m.MessageBox.error(message);
													reject();
												} else {
													// sap.m.MessageBox.error(error);
													reject();
												}
											})
											.load();
					})
				];
				
				/** 목표 조회
					개발(g110bc197) : 2019년 데이터가 없어서 2020년부터 1로 계산하여 Entity명 생성
					QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
				var Idx = "", tmp = oController._ListCondJSonModel.getProperty("/Data/Year") * 1;
				if(document.domain.indexOf("g110bc197") != -1){
					Idx = (tmp == 2020 ? "1" : (tmp-2020) + 1);
				} else {
					Idx = (tmp == 2019 ? "1" : (tmp-2019) + 1);
				}
				
				var entity = "Goal_" + Idx;
				
				for(var i=0; i<vData.length; i++){
					promise.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/v2/" + entity + "?$filter=userId eq '" + vData[i].userId + "'")
												.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data && data.results.length){
														for(var i=0; i<data.results.length; i++){
															goal.push(data.results[i]);
														}
													}
													resolve();
												})
												.attachRequestFailed(function(error) {
													if(error.getParameters() && error.getParameters().message == "error"){
														var message = JSON.parse(error.getParameters().responseText).error.message.value;
														//sap.m.MessageBox.error(message);
														reject();
													} else {
														//sap.m.MessageBox.error(error);
														reject();
													}
												})
												.load();
						})
					);
					
					// promise.push(
					// 	new Promise(function(resolve, reject){
					// 		new JSONModelHelper().url("/odata/v2/GoalPlanTemplate?$select=id,goals,planStates&$expand=goals,planStates&userId=" + vData[i].userId)
					// 							 .attachRequestCompleted(function(){
					// 								 var data = this.getData().d;
													
					// 								 if(data && data.results.length){
					// 								 	for(var i=0; i<data.results.length; i++){
					// 							 			goal.push(data.results[i]);
					// 								 	}
					// 								 }
					// 								 resolve();
					// 							 })
					// 							 .attachRequestFailed(function(error) {
					// 								 if(error.getParameters() && error.getParameters().message == "error"){
					// 								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
					// 								 	 sap.m.MessageBox.error(message);
					// 	 								 reject();
					// 								 } else {
					// 								 	 sap.m.MessageBox.error(error);
					// 	 								 reject();
					// 								 }
					// 							 })
					// 							 .load();
					// 	})
					// );
					
					promise.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/fix/ContinuousFeedback?$filter=subjectUserId eq '" + vData[i].userId + "'"
													+ " and visibleToManager eq 'true'")
												.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data && data.results.length){
														for(var i=0; i<data.results.length; i++){
															// date 변경
															data.results[i].dateReceived = data.results[i].dateReceived ? new Date(data.results[i].dateReceived.substring(6,19) * 1) : null;
															
															feedback.push(data.results[i]);
														}
													}
													resolve();
												})
												.attachRequestFailed(function(error) {
													if(error.getParameters() && error.getParameters().message == "error"){
														var message = JSON.parse(error.getParameters().responseText).error.message.value;
														// sap.m.MessageBox.error(message);
														reject();
													} else {
														// sap.m.MessageBox.error(error);
														reject();
													}
												})
												.load();
						})
					);
				}
				
				Promise.all(promise).then(function(){
					setTimeout(function(){
						if(activityId != ""){
							new JSONModelHelper().url("/odata/v2/ActivityFeedback?$filter=Activity_activityId in " + activityId
													+ " and createdDateTime ge '" + year + "-01-01'")
												.setAsync(false)
												.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data && data.results.length){
														for(var i=0; i<data.results.length; i++){
															// date 변경
															data.results[i].createdDateTime = data.results[i].createdDateTime ? new Date(data.results[i].createdDateTime.substring(6,19) * 1) : null;
															
															activityComment.push(data.results[i]);
														}
													}
												})
												.attachRequestFailed(function(error){
													if(error.getParameters() && error.getParameters().message == "error"){
														var message = JSON.parse(error.getParameters().responseText).error.message.value;
														sap.m.MessageBox.error(message);
													} else {
														sap.m.MessageBox.error(error);
													}
												})
												.load();
						}
						
						// 목표관리 데이터 생성
						for(var i=0; i<vData.length; i++){
							vData[i].Count1 = 0;
							vData[i].Count2 = 0;
							vData[i].Count3 = 0;
							
							for(var j=0; j<activity.length; j++){
								if(vData[i].userId == activity[j].subjectUserId){
									vData[i].Count2 = vData[i].Count2 + 1;
								}
							}
							
							for(var j=0; j<achievement.length; j++){
								if(vData[i].userId == achievement[j].subjectUserId){
									vData[i].Count3 = vData[i].Count3 + 1;
								}
							}
							
							for(var j=0; j<goal.length; j++){
								// if(goal[j].goals && goal[j].goals.results.length){
									if(vData[i].userId == goal[j].userId){
										vData[i].Count1 = vData[i].Count1 + 1;
									}
									// if(vData[i].userId == goal[j].goals.results[0].userId){
									// 	vData[i].Count1 = goal[j].goals.results.length;
									// }
								// }
							}
						}
						
						// timeline 데이터 생성
						var tmp = [], oData2 = [];
						
						// 시간 1시간 빼준다. (호주랑 시차 계산 필요)
						var setTime = function(oDate){
							oDate = new Date(common.Common.setTime(oDate));
							
							oDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), (oDate.getHours() - 1), oDate.getMinutes(), oDate.getSeconds());
							
							return oDate;
						}
						
						for(var i=0; i<activity.length; i++){
							tmp.push({
								index : "1",
								content : oBundleText.getText("LABEL_05104"), // 활동
								userId : activity[i].subjectUserId,
								comment : oBundleText.getText("LABEL_05104") + "\n\n" + activity[i].activityName, // 활동
								datetime : activity[i].createdDateTime
							});
						}
						
						for(var i=0; i<activityComment.length; i++){
							tmp.push({
								index : "5",
								content : oBundleText.getText("LABEL_05141"), // 활동 - Comment
								userId : activityComment[i].commenter,
								comment : oBundleText.getText("LABEL_05141") + "\n\n" + activityComment[i].commentContent, // 활동 - Comment
								datetime : activityComment[i].createdDateTime
							});
						}
						
						for(var i=0; i<achievement.length; i++){
							tmp.push({
								index : "2",
								content : oBundleText.getText("LABEL_05105"), // 실적
								userId : achievement[i].subjectUserId,
								comment : oBundleText.getText("LABEL_05105") + "\n\n" + achievement[i].achievementName, // 실적
								datetime : achievement[i].createdDateTime
							});
						}
						
						for(var i=0; i<feedback.length; i++){
							// 피드백 데이터는 dateReceived 필드 값으로 현재연도 이상만 구분하여 세팅
							feedback[i].dateReceived = setTime(feedback[i].dateReceived);
							
							if(feedback[i].dateReceived.getFullYear() < parseInt(year)){
								continue;
							}
							
							// activityId 가 존재: 3 활동-피드백
							// achievementId 가 존재: 4 실적-피드백
							// 둘 다 없으면: 6 피드백
							tmp.push({
								index : (feedback[i].activityId ? "3" : (feedback[i].achievementId ? "4" : "6")),
																	// 활동 - 피드백												  실적 - 피드백						   피드백
								content : (feedback[i].activityId ? oBundleText.getText("LABEL_05138") : (feedback[i].achievementId ? oBundleText.getText("LABEL_05139") : oBundleText.getText("LABEL_05140"))),
								userId : feedback[i].senderUserId,
																	// 활동 - 피드백												  실적 - 피드백						   피드백
								comment : (feedback[i].activityId ? oBundleText.getText("LABEL_05138") : (feedback[i].achievementId ? oBundleText.getText("LABEL_05138") : oBundleText.getText("LABEL_05140"))) + "\n\n" + feedback[i].feedbackMessage,
								datetime : feedback[i].dateReceived,
							});
						}
						
						for(var i=0; i<tmp.length; i++){
							var check = "";
							for(var j=0; j<vData.length; j++){
								if(tmp[i].userId == vData[j].userId){
									check = "X";
									var detail = {};
									Object.assign(detail, tmp[i], vData[j]);
									oData2.push(detail);
								}
							}
							
							if(check == ""){
								oData2.push(tmp[i]);
							}
						}
						
						// timeline 데이터에 이름이 없는 경우 odata를 호출해서 찾는다.
						var userId = "", user = [];
						for(var i=0; i<oData2.length; i++){
							if(!oData2[i].Ename){
								if(userId == ""){
									userId = oData2[i].userId;
								} else {
									userId += "," + oData2[i].userId;
								}
							}
						}
						
						if(userId != ""){
							new JSONModelHelper().url("/odata/v2/User?$filter=userId in " + userId)
												.select("userId")
												.select("nickname")
												.select("title")
												.setAsync(false)
												.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data && data.results.length){
														for(var i=0; i<data.results.length; i++){
															data.results[i].Ename = data.results[i].nickname;
															
															// 사진
															new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + data.results[i].userId + "' and photoType eq '1'")
																				.select("photo")
																				.setAsync(false)
																				.attachRequestCompleted(function(){
																					var data2 = this.getData().d;
																					
																					if(data2 && data2.results.length){
																						data.results[i].photo = "data:text/plain;base64," + data2.results[0].photo;
																					}
																				})
																				.attachRequestFailed(function() {
																						sap.m.MessageBox.error(arguments);
																				})
																				.load();
														
															user.push(data.results[i]);
														}
													}
												})
												.attachRequestFailed(function(error){
													if(error.getParameters() && error.getParameters().message == "error"){
														var message = JSON.parse(error.getParameters().responseText).error.message.value;
														sap.m.MessageBox.error(message);
													} else {
														sap.m.MessageBox.error(error);
													}
												})
												.load();
						}
						
						for(var i=0; i<oData2.length; i++){
							if(!oData2[i].Ename){
								for(var j=0; j<user.length; j++){
									if(oData2[i].userId == user[j].userId){
										oData2[i].Ename = user[j].Ename;
										oData2[i].title = user[j].title;
										oData2[i].photo = user[j].photo;
									}
								}
							}
						}
						
						// timeline, 목표관리 데이터 바인딩
						oTimeline.getModel().setData({Data : oData2});
						oController.makeContent2(vData);
						
						// scrollcontainer busy state 변경
						sap.ui.getCore().byId(oController.PAGEID + "_Content1").setBusy(false);
						
						oController._BusyDialog.close();
					});
				}).catch(function(error){
					console.log("ERROR" + error);
				});
			};
			
			if(oEvent){
				setTimeout(search, 500);
			} else {
				search();
			}
		},
		
		makeContent2 : function(vData){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			var year = oController._ListCondJSonModel.getProperty("/Data/Year");
			
			var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content2");
				oContent.destroyContent();
				
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 1,
				width : "99.9%",
				widths : [""]
			});
			
			var oRow;
			
			if(!vData || vData.length == 0){
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Text({text : oBundleText.getText("MSG_05001")}).addStyleClass("FontFamily paddingtop6 paddingBottom6")], // 데이터가 없습니다.
										hAlign : "Center",
										vAlign : "Middle"
									}).addStyleClass("overviewlayout2")]
					});
				oMatrix.addRow(oRow);
			} else {
				for(var i=0; i<vData.length; i++){
					var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
						columns : 5,
						width : "100%",
						widths : ["18px", "60px", "40%", "60%", "18px"],
						rows : [new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [new sap.ui.commons.layout.MatrixLayoutCell({
												rowSpan : 2
											}),
											new sap.ui.commons.layout.MatrixLayoutCell({
												content : [new sap.m.Image({
																src : vData[i].photo,
																// width : "50px",
																height : "50px"
															})],
												hAlign : "Center",
												vAlign : "Middle",
												rowSpan : 2
											}).addStyleClass("layout"),
											new sap.ui.commons.layout.MatrixLayoutCell({
												content : [new sap.m.Text({text : vData[i].Ename}).addStyleClass("FontFamily FontBold")],
												hAlign : "Begin",
												vAlign : "Middle"
											}).addStyleClass("layout"),
											new sap.ui.commons.layout.MatrixLayoutCell({
												content : [new sap.m.Toolbar({
																height : "35px",
																content : [new sap.m.ToolbarSpacer(),
																		new sap.ui.layout.HorizontalLayout({
																			content : [new sap.m.Text({
																							text : (vData[i].Count1 > 100 ? "+99" : vData[i].Count1), 
																							textAlign : "Center"
																						}).addStyleClass("FontFamily paddingtop7 FontWhite FontBold")]
																		}).addStyleClass("goal1"),
																		new sap.ui.layout.HorizontalLayout({
																			content : [new sap.m.Text({
																							text : (vData[i].Count2 > 100 ? "+99" : vData[i].Count2), 
																							textAlign : "Center"
																						}).addStyleClass("FontFamily paddingtop7 FontWhite FontBold")]
																		}).addStyleClass("goal2"),
																		new sap.ui.layout.HorizontalLayout({
																			content : [new sap.m.Text({
																							text : (vData[i].Count3 > 100 ? "+99" : vData[i].Count3), 
																							textAlign : "Center"
																						}).addStyleClass("FontFamily paddingtop7 FontWhite FontBold")]
																		}).addStyleClass("goal3"),
																		new sap.m.ToolbarSpacer()]
															}).addStyleClass("toolbarNoBottomLine")],
												hAlign : "Center",
												vAlign : "Middle",
												rowSpan : 2
											}),
											new sap.ui.commons.layout.MatrixLayoutCell({
												rowSpan : 2
											})]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [new sap.ui.commons.layout.MatrixLayoutCell({
												content : [new sap.m.Text({text : vData[i].title}).addStyleClass("FontFamily")],
												hAlign : "Begin",
												vAlign : "Middle"
											}).addStyleClass("layout")]
								})]
					});
					
					oMatrix.addRow(
						new sap.ui.commons.layout.MatrixLayoutRow({
							cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
						}).addStyleClass("overviewlayout2")
					);
					
					if(i != vData.length - 1){
						oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}));
					}
				}
			}
			
			oContent.addContent(oMatrix);
			
			// scrollcontainer busy status 변경
			oContent.setBusy(false);
		},

		// 목표관리 - List View
		onPressDetail2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			if(!oController._Detail2Dialog){
				oController._Detail2Dialog = sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.Detail02", oController);
				oView.addDependent(oController._Detail2Dialog);
			}
			
			oController._Detail2Dialog.open();
			
			// 데이터 조회
			oController.onPressSearch2(oEvent);
		},
		
		onPressSearch2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			oController._Detail2Dialog.setBusy(true);
			
			var oJSONModel = oController._Detail2Dialog.getModel();
			var oData = {
				Data : {
					Year : new Date().getFullYear() + "",
					Count1 : 0, Count2 : 0, Count3 : 0, Count4 : 0, Count5 : 0
				}
			};
			
			// 데이터 초기화
			oJSONModel.setData(oData);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_GoalTable");
			var oJSONModel2 = oTable.getModel();
			var oData2 = {Data : []};
			
			oJSONModel2.setData(oData2);
			oTable.bindRows("/Data");
			
			var columns = oTable.getColumns();
			for(var i=0; i<columns.length; i++){
				columns[i].setFiltered(false);
				columns[i].setSorted(false);
			}
			
			var search = function(){
				// var oModel = new sap.ui.model.odata.ODataModel("/odata/v2");
					
				var user = oController._UserJSonModel.getProperty("/Data");
				
				for(var i=0; i<user.length; i++){
					var detail = {};
					Object.assign(detail, user[i]);
					oData2.Data.push(detail);
				}
				
				var goal = [], activity = [], achievement = [], status = [], rating = [];
				var activityId = "";
				
				var promise = [
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Activity?$filter=subjectUserId in " + oController._UserList)
											.attachRequestCompleted(function(){
												var data = this.getData().d;
												
												if(data && data.results.length){
													for(var i=0; i<data.results.length; i++){
														if(i==0){
															activityId = data.results[0].activityId;
														} else {
															activityId += "," + data.results[i].activityId;
														}
														
														activity.push(data.results[i]);
													}
												}
												resolve();
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
					}),
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Achievement?$filter=subjectUserId in " + oController._UserList
													+ " and createdDateTime ge '" + year + "-01-01'")
											.attachRequestCompleted(function(){
												var data = this.getData().d;
												
												if(data && data.results.length){
													for(var i=0; i<data.results.length; i++){
														achievement.push(data.results[i]);
													}
												}
												resolve();
											})
											.attachRequestFailed(function(error) {
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
				];
				
				for(var i=0; i<oData2.Data.length; i++){
					promise.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/v2/GoalPlanTemplate?$select=id,goals,planStates&$expand=goals,planStates&userId=" + oData2.Data[i].userId)
												.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data && data.results.length){
														for(var i=0; i<data.results.length; i++){
															goal.push(data.results[i]);
														}
													}
													resolve();
												})
												.attachRequestFailed(function(error) {
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
				
				Promise.all(promise).then(function(){
					setTimeout(function(){
						var promise2 = [];
						
						for(var a=0; a<goal.length; a++){
							if(goal[a].goals && goal[a].goals.results.length > 0){
								var state = [], id = [];
								// 문서 상태 조회를 위한 id 리스트 만들기
								for(var i=0; i<goal[a].planStates.results.length; i++){
									state.push({id : goal[a].planStates.results[i].planId, state : goal[a].planStates.results[i].stateId, userId : goal[a].goals.results[0].userId});
								}
								
								// 점수 계산을 위한 template id 리스트 만들기
								var tmp = "";
								for(var i=0; i<goal[a].goals.results.length; i++){
									if(i==0)
										tmp = goal[a].goals.results[i].id;
									else
										tmp += "," + goal[a].goals.results[i].id;
								}
								
								id.push({userId : goal[a].goals.results[0].userId, id : tmp});
								
								// 목표 상태 조회
								if(state.length != 0){
									for(var i=0; i<state.length; i++){
										promise2.push(
											new Promise(function(resolve, reject){
												new JSONModelHelper().url("/odata/v2/GoalPlanState(planId=" + state[i].id + "L,stateId='" + state[i].state + "',userId='" + state[i].userId + "')")
																	.attachRequestCompleted(function(){
																		var data = this.getData().d;
																		
																		if(data && data.currentState == true){
																			status.push({userId : data.userId, currentStep : data.stateLabel});
																		}
																		resolve();
																	})
																	.attachRequestFailed(function(error) {
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
								}
								
								// 점수 조회
								if(id.length != 0){
									/** 목표 조회
										개발(g110bc197) : 2019년 데이터가 없어서 2020년부터 1로 계산하여 Entity명 생성
										QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
									var Idx = "", year = oController._ListCondJSonModel.getProperty("/Data/Year") * 1;
									if(document.domain.indexOf("g110bc197") != -1){
										Idx = (year == 2020 ? "1" : (year-2020) + 1);
									} else {
										Idx = (year == 2019 ? "1" : (year-2019) + 1);
									}
									
									oController._ListCondJSonModel.setProperty("/Data/Idx", Idx);
									
									var entity = "Goal_" + Idx;
									
									for(var i=0; i<id.length; i++){
										promise2.push(
											new Promise(function(resolve, reject){
												new JSONModelHelper().url("/odata/v2/" + entity + "?$select=name,customScore,userId&$filter=userId eq '" + id[i].userId + "' and id in " + id[i].id)
																	.attachRequestCompleted(function(){
																		var data = this.getData().d;
																		
																		if(data && data.results.length){
																			for(var i=0; i<data.results.length; i++){
																				rating.push(data.results[i]);
																			}
																		}
																		resolve();
																	})
																	.attachRequestFailed(function(error) {
																		if(error.getParameters() && error.getParameters().message == "error"){
																			var message = JSON.parse(error.getParameters().responseText).error.message.value;
																			//sap.m.MessageBox.error(message);
																			reject();
																		} else {
																			//sap.m.MessageBox.error(error);
																			reject();
																		}
																	})
																	.load();
											})
										);
									}
								}
							}
						}
						
						Promise.all(promise2).then(function(){
							// summary 계산
							//  목표		활동		실적		점수
							var count2 = 0, count3 = 0, count4 = 0, count5 = 0;
							
							for(var i=0; i<oData2.Data.length; i++){
								oData2.Data[i].Count1 = 0;
								oData2.Data[i].Count2 = 0;
								oData2.Data[i].Count3 = 0;
								
								for(var j=0; j<activity.length; j++){
									if(oData2.Data[i].userId == activity[j].subjectUserId){
										oData2.Data[i].Count2 = oData2.Data[i].Count2 + 1;
									}
								}
								
								for(var j=0; j<achievement.length; j++){
									if(oData2.Data[i].userId == achievement[j].subjectUserId){
										oData2.Data[i].Count3 = oData2.Data[i].Count3 + 1;
									}
								}
								
								for(var j=0; j<status.length; j++){
									if(oData2.Data[i].userId == status[j].userId){
										oData2.Data[i].currentStep = status[j].currentStep;
									}
								}
								
								var length = 0, score = 0;
								for(var j=0; j<rating.length; j++){
									if(oData2.Data[i].userId == rating[j].userId){
										length++;
										score += (rating[j].customScore ? parseFloat(rating[j].customScore) : 0);
									}
								}
								
								oData2.Data[i].rating = (length == 0 ? 0 : (score / length).toFixed(2));
								
								for(var j=0; j<goal.length; j++){
									if(goal[j].goals && goal[j].goals.results.length > 0){
										if(oData2.Data[i].userId == goal[j].goals.results[0].userId){
											oData2.Data[i].Count1 = goal[j].goals.results.length;
										}
									}
								}
								
								count2 += oData2.Data[i].Count1;
								count3 += oData2.Data[i].Count2;
								count4 += oData2.Data[i].Count3;
								count5 += parseFloat(oData2.Data[i].rating);
							}
							
							// summary 데이터 생성
							oData.Data.Count1 = oData2.Data.length;
							oData.Data.Count2 = (count2 == 0 ? 0 : (count2 / oData.Data.Count1).toFixed(2));
							oData.Data.Count3 = (count3 == 0 ? 0 : (count3 / oData.Data.Count1).toFixed(2));
							oData.Data.Count4 = (count4 == 0 ? 0 : (count4 / oData.Data.Count1).toFixed(2));
							oData.Data.Count5 = (count5 == 0 ? 0 : (count5 / oData.Data.Count1).toFixed(2));
							
							// 데이터 바인딩
							oJSONModel.setData(oData);
							
							oJSONModel2.setData(oData2);
							oTable.bindRows("/Data");
							oTable.setVisibleRowCount((oData2.Data.length >= 10 ? 10 : oData2.Data.length));
							
							oController._Detail2Dialog.setBusy(false);
						});
					});
				})
				.catch(function(error){
					console.log("ERROR " + error);
				});
			};
			
			setTimeout(search, 100);
		},
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			jQuery.sap.require("sap.ui.export.Spreadsheet");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_GoalTable");
			var oJSONModel = oTable.getModel();
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_05126") + ".xlsx" // 목표관리
			};

			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		// 업적&역량 평가, 업적평가등급, 평가현황
		makeContent3 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			// 목표, 다면평가 template id 설정
			oController.onSetTemplateId(oController);
			
			// scrollcontainer busy state 변경
			sap.ui.getCore().byId(oController.PAGEID + "_Content3").setBusy(true);
			sap.ui.getCore().byId(oController.PAGEID + "_Content5").setBusy(true);
			sap.ui.getCore().byId(oController.PAGEID + "_Content6").setBusy(true);
			
			var promise = [], promise2 = [];
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Avatargroup1").getModel();
			
			// 평가관리: 미평가 	 A			 B			 C
			var oData = {Data1 : [], Data2 : [], Data3 : [], Data4 : [], Data : []};
			
			// 업적평가
			var oVizFrame = sap.ui.getCore().byId(oController.PAGEID + "_Chart5");
			var oJSONModel2 = oVizFrame.getModel();
			var tmp = {Data : [{Grade : "A", Count : 0},
							{Grade : "B", Count : 0},
							{Grade : "C", Count : 0}]};
			oJSONModel2.setData(tmp);
			oVizFrame.bindElement("/Data");
			
			// 평가점수
			var oVizFrame3 = sap.ui.getCore().byId(oController.PAGEID + "_Chart6");
			var oJSONModel3 = oVizFrame3.getModel();
			//										  업적		  역량		  다면
			var tmp2 = {Data : [{Grade : "70 이하", Count1 : 0, Count2 : 0, Count3 : 0},
								{Grade : "71 ~ 80", Count1 : 0, Count2 : 0, Count3 : 0},
								{Grade : "81 ~ 90", Count1 : 0, Count2 : 0, Count3 : 0},
								{Grade : "91 ~ 100", Count1 : 0, Count2 : 0, Count3 : 0}]};
			oJSONModel3.setData(tmp2);
			oVizFrame3.bindElement("/Data");
			
			// 대상자 리스트
			var vData = oController._UserJSonModel.getProperty("/Data");
			
			// 업적, 역량평가 점수 조회
			var vData2 = [];
			if(oController._ListCondJSonModel.getProperty("/Data/TemplateId1") != ""){
				for(var i=0; i<vData.length; i++){
					promise2.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/v2/FormHeader")
												.select("currentStep")
												.select("formDataId")
												.select("formDataStatus")
												.select("formAuditTrails/formContentId")
												.select("formAuditTrails/auditTrailRecipient")
												.expand("formAuditTrails")
												.filter("formTemplateId eq " + oController._ListCondJSonModel.getProperty("/Data/TemplateId1") +
														" and formDataStatus ne 4 and formSubjectId eq '" + vData[i].userId + "'")
												.attachRequestCompleted(function(){
														var data = this.getData().d;
														
														if(data && data.results.length){
															for(var i=0; i<data.results.length; i++){
																vData2.push(data.results[i]);
															}
														}
														
														resolve();
												})
												.attachRequestFailed(function(error) {
													if(error.getParameters() && error.getParameters().message == "error"){
														var message = JSON.parse(error.getParameters().responseText).error.message.value;
														sap.m.MessageBox.error(message);
													} else {
														sap.m.MessageBox.error(error);
													}
													reject();
												})
												.load()
						})
					);
				}
			}
						
			// new JSONModelHelper().url("/odata/v2/FormHeader")
			// 					 .select("currentStep")
			// 					 .select("formDataId")
			// 					 .select("formDataStatus")
			// 					 .select("formAuditTrails/formContentId")
			// 					 .select("formAuditTrails/auditTrailRecipient")
			// 					 .expand("formAuditTrails")
			// 					 .filter("formTemplateId eq " + oController._ListCondJSonModel.getProperty("/Data/TemplateId1") + " and formDataStatus ne 4 and formSubjectId in " + oController._UserList)
			// 					 .setAsync(false)
			// 					 .attachRequestCompleted(function(){
			// 							var data = this.getData().d;
										
			// 							if(data && data.results.length){
			// 								for(var i=0; i<data.results.length; i++){
			// 									vData2.push(data.results[i]);
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
			
			// 다면평가 점수 조회
			var vData4 = [];
			// 2021-04-12 다면평가 template 이 존재하지 않는 경우 skip
			if(oController._ListCondJSonModel.getProperty("/Data/TemplateId2") != ""){
				new JSONModelHelper().url("/odata/v2/FormHeader")
								.filter("formTemplateId eq " + oController._ListCondJSonModel.getProperty("/Data/TemplateId2") + 
										" and formDataStatus ne 4 and formSubjectId in " + oController._UserList)
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
											var formDataId = "", formContentId = "";
											for(var i=0; i<data.results.length; i++){
												if(data.results[i].currentStep == null && data.results[i].formContents){
													formDataId = data.results[i].formDataId;
													for(var j=0; j<data.results[i].formContents.results.length; j++){
														if(data.results[i].formContents.results[j].status == "3" || data.results[i].formContents.results[j].status == "10"){
															formContentId = data.results[i].formContents.results[j].formContentId;
														}
													}
													
													if(formDataId != "" && formContentId != ""){
														vData4.push({formDataId : formDataId, formContentId : formContentId});
													}
												}
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
			
			var vData5 = [];
			for(var i=0; i<vData4.length; i++){
				promise.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Form360RaterSection(formDataId=" + vData4[i].formDataId + "L,formContentId=" + vData4[i].formContentId + "L)?$expand=form360Raters")
											.attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data){
														vData5.push(data);
													}
													
													resolve();
											})
											.attachRequestFailed(function(error) {
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
			
			// 업적평가 등급 조회
			var vData3 = [];
			Promise.all(promise2).then(function(){
				var oFormId = [];
				
				// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
				// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
				for(var i=0; i<vData2.length; i++){
					var formContentId = "", formDataId = "";
					if(vData2[i].formAuditTrails){
						for(var j=0; j<vData2[i].formAuditTrails.results.length; j++){
							// formAuditTrails 내 formContentId가 제일 큰걸 찾는다.
							// if(vData2[i].formAuditTrails.results[j].auditTrailRecipient == (vEmpLoginInfo[0].name == "sfdev1" ? "20001003" : vEmpLoginInfo[0].name)){
								if(formContentId == ""){
									formContentId = vData2[i].formAuditTrails.results[j].formContentId;
									formDataId = vData2[i].formDataId;
								} else {
									if(parseInt(formContentId) < parseInt(vData2[i].formAuditTrails.results[j].formContentId)){
										formContentId = vData2[i].formAuditTrails.results[j].formContentId;
										formDataId = vData2[i].formDataId;
									}
								}
							// }
						}
						
						oFormId.push({formContentId : formContentId, formDataId : formDataId});
					}
				}
				
				for(var i=0; i<oFormId.length; i++){
					promise.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/v2/TalentRatings?$filter=formDataId eq " + oFormId[i].formDataId + 
													  "L and formContentId eq " + oFormId[i].formContentId + "L")
												.attachRequestCompleted(function(){
														var data = this.getData().d;
														
														if(data && data.results.length){
															for(var i=0; i<data.results.length; i++){
																if(data.results[i].feedbackType == 8 || data.results[i].feedbackType == 10 || data.results[i].feedbackType == 11){
																	vData3.push(data.results[i]);
																}
															}
														}
														resolve();
												})
												.attachRequestFailed(function(error) {
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
				
				Promise.all(promise).then(function(){
					setTimeout(function(){
						var oData2 = {Data : [{Grade : "A", Count : 0},
											{Grade : "B", Count : 0},
											{Grade : "C", Count : 0}]};
						
						//										  업적		  역량		  다면
						var oData3 = {Data : [{Grade : "70 이하", Count1 : 0, Count2 : 0, Count3 : 0},
											{Grade : "71 ~ 80", Count1 : 0, Count2 : 0, Count3 : 0},
											{Grade : "81 ~ 90", Count1 : 0, Count2 : 0, Count3 : 0},
											{Grade : "91 ~ 100", Count1 : 0, Count2 : 0, Count3 : 0}]};	 
								
						for(var i=0; i<vData3.length; i++){
							switch(vData3[i].feedbackType){
								case 8: // 등급
									switch(vData3[i].feedbackRatingLabel){
										case "A":
											oData.Data.push({userId : vData3[i].employeeId, Grade : "A"});
											oData2.Data[0].Count = oData2.Data[0].Count + 1;
										break;
										case "B":
											oData.Data.push({userId : vData3[i].employeeId, Grade : "B"});
											oData2.Data[1].Count = oData2.Data[1].Count + 1;
										break;
										case "C":
											oData.Data.push({userId : vData3[i].employeeId, Grade : "C"});
											oData2.Data[2].Count = oData2.Data[2].Count + 1;
										break;
									}
									
								break;
								
								case 10: // 평가점수 - 역량평가 점수
									if(vData3[i].feedbackRating <= 70){
										oData3.Data[0].Count2 = oData3.Data[0].Count2 + 1;
									} else if(vData3[i].feedbackRating <= 80){
										oData3.Data[1].Count2 = oData3.Data[1].Count2 + 1;
									} else if(vData3[i].feedbackRating <= 90){
										oData3.Data[2].Count2 = oData3.Data[2].Count2 + 1;
									} else {
										oData3.Data[3].Count2 = oData3.Data[3].Count2 + 1;
									}
								break;
								
								case 11: // 평가점수 - 업적평가 점수
									if(vData3[i].feedbackRating <= 70){
										oData3.Data[0].Count1 = oData3.Data[0].Count1 + 1;
									} else if(vData3[i].feedbackRating <= 80){
										oData3.Data[1].Count1 = oData3.Data[1].Count1 + 1;
									} else if(vData3[i].feedbackRating <= 90){
										oData3.Data[2].Count1 = oData3.Data[2].Count1 + 1;
									} else {
										oData3.Data[3].Count1 = oData3.Data[3].Count1 + 1;
									}
								break;
							}
						}
						
						// 다면평가 : 개별 평가점수를 계산해서 평균점수를 구함
						// 2020-11-20 평가 미완료 된 경우 계산 로직 제외
						for(var i=0; i<vData5.length; i++){
							var rating = 0, rater = 0;
							for(var j=0; j<vData5[i].form360Raters.results.length; j++){
								if(vData5[i].form360Raters.results[j].participantRating == "") continue;
								rater++;
								rating += parseFloat(vData5[i].form360Raters.results[j].participantRating.split("/")[0]);
							}
							
							// rating = rating / vData5[i].form360Raters.results.length;
							rating = rater == 0 ? 0 : rating / rater;
							
							if(parseFloat(rating) <= 70){
								oData3.Data[0].Count3 = oData3.Data[0].Count3 + 1;
							} else if(parseFloat(rating) <= 80){
								oData3.Data[1].Count3 = oData3.Data[1].Count3 + 1;
							} else if(parseFloat(rating) <= 90){
								oData3.Data[2].Count3 = oData3.Data[2].Count3 + 1;
							} else {
								oData3.Data[3].Count3 = oData3.Data[3].Count3 + 1;
							}
						}
						
						// 대상자 리스트랑 비교해서 성명,사진 넣어준다.
						for(var i=0; i<vData.length; i++){
							var check = "";
							for(var j=0; j<oData.Data.length; j++){
								if(vData[i].userId == oData.Data[j].userId){
									check = "X";
									if(oData.Data[j].Grade == "A"){
										oData.Data2.push({userId : vData[i].userId, initials : vData[i].Ename, photo : vData[i].photo});
									} else if(oData.Data[j].Grade == "B"){
										oData.Data3.push({userId : vData[i].userId, initials : vData[i].Ename, photo : vData[i].photo});
									} else if(oData.Data[j].Grade == "C"){
										oData.Data4.push({userId : vData[i].userId, initials : vData[i].Ename, photo : vData[i].photo});
									}
								}
							}
							
							// 미평가
							if(check == ""){
								oData.Data1.push({userId : vData[i].userId, initials : vData[i].Ename, photo : vData[i].photo});
							}
						}
						
						oJSONModel.setData(oData);
						oJSONModel2.setData(oData2);
						oJSONModel3.setData(oData3);
						
						setTimeout(function(){
							for(var i=1; i<=4; i++){
								eval("sap.ui.getCore().byId(oController.PAGEID + '_Row" + i + "').setHeight('');");
								eval("sap.ui.getCore().byId(oController.PAGEID + '_Row" + i + "').setHeight('55px');");
							}
							
							// scrollcontainer busy state 변경
							sap.ui.getCore().byId(oController.PAGEID + "_Content3").setBusy(false);
							sap.ui.getCore().byId(oController.PAGEID + "_Content5").setBusy(false);
							sap.ui.getCore().byId(oController.PAGEID + "_Content6").setBusy(false);
							
						}, 100);
					});
				})
				.catch(function(error){
					if(error.getParameters() && error.getParameters().message == "error"){
						var message = JSON.parse(error.getParameters().responseText).error.message.value;
						sap.m.MessageBox.error(message);
					} else {
						sap.m.MessageBox.error(error);
					}
					return;
				});
			})
			.catch(function(error){
				if(error.getParameters() && error.getParameters().message == "error"){
					var message = JSON.parse(error.getParameters().responseText).error.message.value;
					sap.m.MessageBox.error(message);
				} else {
					sap.m.MessageBox.error(error);
				}
				return;
			});
		},
		
		// 종합평가
		makeContent4 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Dashboard.DashboardList");
			var oController = oView.getController();
			
			var oVizFrame4 = sap.ui.getCore().byId(oController.PAGEID + "_Chart4");
			var oJSONModel4 = oVizFrame4.getModel();
			var vData4 = {
				Data : [
					// {
					// 	Grade : "S",
					// 	Count : 3
					// },
					// {
					// 	Grade : "A",
					// 	Count : 5
					// },
					// {
					// 	Grade : "B",
					// 	Count : 7
					// },
					// {
					// 	Grade : "C",
					// 	Count : 2
					// },
					// {
					// 	Grade : "D",
					// 	Count : 4
					// }
				]
			};
			
			// oJSONModel4.setData(vData4);
			// oVizFrame4.bindElement("/Data");
			
			// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
			var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
			var createData = {TableIn : []};
				createData.IAppye = oController._ListCondJSonModel.getProperty("/Data/Year");
				createData.IPernr = oController.getSessionInfoByKey("Pernr");
				createData.ISessty = oController._ListCondJSonModel.getProperty("/Data/Sessty");
				
			oModel.create("/FinalEvalResultSet", createData, {
				success: function(data,res){
					if(data && data.TableIn) {
						if(data.TableIn.results && data.TableIn.results.length){
							for(var i=0; i<data.TableIn.results.length; i++){
								data.TableIn.results[i].Evapnt = parseFloat(data.TableIn.results[i].Evapnt);
								vData4.Data.push(data.TableIn.results[i]);
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
			
			oJSONModel4.setData(vData4);
			oVizFrame4.bindElement("/Data");
			
			// scrollcontainer busy state 변경
			sap.ui.getCore().byId(oController.PAGEID + "_Content4").setBusy(false);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
		}
		

	});

});