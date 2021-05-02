jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController"], 
	function (Common, CommonController) {
	"use strict";

	return CommonController.extend("ZUI5_SF_EvalGoal.EvalGoalList", {

		PAGEID: "EvalGoalList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_UserJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
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

		onBeforeShow : function(oEvent){
			var oController = this;
			var oView = oController.getView();

			var oYear = sap.ui.getCore().byId(oController.PAGEID + "_Year");
				oYear.destroyItems();

			var year = new Date().getMonth() < 3 ? new Date().getFullYear() - 1 : new Date().getFullYear();	
				
			for(var i=year; i>=2020; i--){
				oYear.addItem(new sap.ui.core.Item({key : (i+""), text : (i+"")}));
			}
			
			var vData = {
				Data : {
					Year : new Date().getFullYear() + "",
					Count1 : 0, Count2 : 0, Count3 : 0, Count4 : 0, Count5 : 0
				}
			};
			
			oController._ListCondJSonModel.setData(vData);			
				
			if(!oController._StatusMessage){
				oController._StatusMessage = new sap.m.MessagePopover({
												 placement : "Bottom",
												 items : {
													 path : "/Data",
													 template : new sap.m.MessageItem({
																	type : "{Type}",
																	title : "{Text}"
															   })
												 }
											 }).addStyleClass("sapUiSizeCompact");
											 
				oView.addDependent(oController._StatusMessage);
				
				var oJSONModel = new sap.ui.model.json.JSONModel();
				
				oController._StatusMessage.setModel(oJSONModel);
				oController._StatusMessage.bindElement("/Data");
				
				var vData = {
					Data : [{Type : "Warning", Text : oController.getBundleText("MSG_05005")}, // 피평가자 목록 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05006")}, // 평가문서 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05007")}, // 평가문서 상태 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05008")}, // 목표 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05009")}, // 활동 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05010")}, // 실적 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05011")}, // Rating 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05012")}] // Summary 데이터 집계
				};
				
				oJSONModel.setData(vData);
			}
			
			setTimeout(function(){
				$(".spinner-container")["show"]();
				oController._ListCondJSonModel.setProperty("/Data/Edit", "X");
				oController._StatusMessage.openBy(sap.ui.getCore().byId(oController.PAGEID + "_Status"));
			}, 0);
		},
		
		onAfterShow : function(oEvent){
			var oController = this;
			var oView = oController.getView();
			
			// oController._BusyDialog.open();
			oController.onSearchUserList(oEvent);
			oController.onPressSearch();
		},
		
		SmartSizing : function(oEvent){
			
		},
		
		onSearchUserList : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
			oController._UserList = "";
			
			var vData = {Data : []};
			
			new JSONModelHelper().url("/odata/v2/User('" + $.app.getModel("session").getData().name + "')/directReports")
								 .select("userId")
								 .select("nickname")
								 .select("title")
								 .select("custom01")
								 .select("department")
								 .select("division")
								 .select("jobCode")
								 .select("custom04")
								 .setAsync(false)
								 .attachRequestCompleted(function(){
										var data = this.getData().d;
										
										if(data && data.results.length){
											for(var i=0; i<data.results.length; i++){
												if(data.results[i].custom04 != null) continue; // 평가 대상 제외
											
												if(i==0){
													oController._UserList = data.results[i].userId;
												} else {
													oController._UserList += "," + data.results[i].userId;
												}
												
												data.results[i].Ename = data.results[i].nickname;

												data.results[i].title = data.results[i].title.split(" (")[0];
												data.results[i].department = data.results[i].department.split(" (")[0];
												
												data.results[i].Count1 = 0;
												data.results[i].Count2 = 0;
												data.results[i].Count3 = 0;
												
												vData.Data.push(data.results[i]);
											}
										}
								 })
								 .attachRequestFailed(function() {
										sap.m.MessageBox.error(oController.getBundleText("MSG_05002")); // 직원 리스트 조회 시 오류가 발생하였습니다.
										return;
								 })
								 .load();
								 
			oController._UserJSonModel.setData(vData);
			
			// 조회된 부서리스트로 조회조건의 팀 리스트 생성
			var oDepartment = sap.ui.getCore().byId(oController.PAGEID + "_Department");
				oDepartment.destroyItems();
				
			var items = [];
			for(var i=0; i<vData.Data.length; i++){
				if(i==0){
					items.push(vData.Data[i].department);
				} else {
					var check = "";
					for(var j=0; j<items.length; j++){
						if(check == "X") continue;
						
						if(vData.Data[i].department == items[j]){
							check = "X";
						} else {
							check = "";
						}
					}
					if(check == ""){
						items.push(vData.Data[i].department);
					}
				}
			}
			
			for(var i=0; i<items.length; i++){
				oDepartment.addItem(new sap.ui.core.Item({key : items[i], text : items[i]}));
			}
			
			oController._StatusMessage.getModel().setProperty("/Data/0", {Type : "Success", Text : oController.getBundleText("MSG_05013")}); // 피평가자 목록 조회 완료
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			// oController._BusyDialog.open();
			if(oEvent){
				var vData = {
					Data : [{Type : "Success", Text : oController.getBundleText("MSG_05013")}, // 피평가자 목록 조회 완료
							{Type : "Warning", Text : oController.getBundleText("MSG_05006")}, // 평가문서 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05007")}, // 평가문서 상태 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05008")}, // 목표 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05009")}, // 활동 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05010")}, // 실적 개수 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05011")}, // Rating 조회
							{Type : "Warning", Text : oController.getBundleText("MSG_05012")}] // Summary 데이터 집계
				};
				
				oController._StatusMessage.getModel().setData(vData);
				
				setTimeout(function(){
					$(".spinner-container")["show"]();
					oController._ListCondJSonModel.setProperty("/Data/Edit", "X");
					oController._StatusMessage.openBy(sap.ui.getCore().byId(oController.PAGEID + "_Status"));
				}, 0);
			}
			
			// Summary 초기화
			for(var i=1; i<=5; i++){
				eval("oController._ListCondJSonModel.setProperty('/Data/Count" + i + "', 0);");
			}
			
			var oData = {Data : oController._ListCondJSonModel.getProperty("/Data")};
			
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
					 }),
					 new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Achievement?$filter=subjectUserId in " + oController._UserList)
											 .attachRequestCompleted(function(){
												 var data = this.getData().d;
												 
												 if(data && data.results.length){
													 for(var i=0; i<data.results.length; i++){
														 achievement.push(data.results[i]);
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
				
				Promise.all(promise)
				.catch(function(error){
					oController._BusyDialog.close();
					console.log("ERROR" + error);
				})
				.then(function(){
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
								}
								
								// 점수 조회
								if(id.length != 0){
									/** 목표 조회
										개발(g110bc197) : 2019년 데이터가 없으므로 2020년부터 1로 계산하여 Entity명 생성
										QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
									var Idx = "", year = oController._ListCondJSonModel.getProperty("/Data/Year") * 1;
									if(common.Common.getOperationMode() == "DEV"){
										Idx = (year == 2020 ? "1" : (year-2020) + 1);
									} else {
										Idx = (year == 2019 ? "1" : (year-2019) + 1);
									}
									
									oController._ListCondJSonModel.setProperty("/Data/Idx", Idx);
									
									var entity = "Goal_" + Idx;
									
									for(var i=0; i<id.length; i++){
										promise2.push(
											new Promise(function(resolve, reject){
												 new JSONModelHelper().url("/odata/v2/" + entity + "?$select=name,customScore,userId&$filter=userId eq '" + id[i].userId + "' and id in "+ id[i].id)
																	 .attachRequestCompleted(function(){
																		 var data = this.getData().d;
																		 
																		 if(data && data.results.length){
																			 for(var i=0; i<data.results.length; i++){
																				 rating.push(data.results[i]);
																			 }
																		 }
																		 resolve();
																	 })
																	 .attachRequestFailed(function(error){
																		 if(error.getParameters() && error.getParameters().message == "error"){
																			  var message = JSON.parse(error.getParameters().responseText).error.message.value;
																			//   sap.m.MessageBox.error(message);
																			  reject();
																		 } else {
																			//   sap.m.MessageBox.error(error);
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
							 
							 oController._StatusMessage.getModel().setProperty("/Data/1", {Type : "Success", Text : oController.getBundleText("MSG_05014")}); // 평가문서 조회 완료
							 
							 for(var i=0; i<oData2.Data.length; i++){
								 oData2.Data[i].Count1 = 0;
								 oData2.Data[i].Count2 = 0;
								 oData2.Data[i].Count3 = 0;
								 
								 for(var j=0; j<activity.length; j++){
									 if(oData2.Data[i].userId == activity[j].subjectUserId){
										 oData2.Data[i].Count2 = oData2.Data[i].Count2 + 1;
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/4", {Type : "Success", Text : oController.getBundleText("MSG_05017")}); // 활동 개수 조회 완료
								 
								 for(var j=0; j<achievement.length; j++){
									 if(oData2.Data[i].userId == achievement[j].subjectUserId){
										 oData2.Data[i].Count3 = oData2.Data[i].Count3 + 1;
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/5", {Type : "Success", Text : oController.getBundleText("MSG_05018")}); // 실적 개수 조회 완료
								 
								 for(var j=0; j<status.length; j++){
									 if(oData2.Data[i].userId == status[j].userId){
										 oData2.Data[i].currentStep = status[j].currentStep;
									 }
								 }
							 
								 oController._StatusMessage.getModel().setProperty("/Data/2", {Type : "Success", Text : oController.getBundleText("MSG_05015")}); // 평가문서 상태 조회 완료
								 
								 var length = 0, score = 0;
								 for(var j=0; j<rating.length; j++){
									 if(oData2.Data[i].userId == rating[j].userId){
										 length++;
										 score += (rating[j].customScore ? parseFloat(rating[j].customScore) : 0);
									 }
								 }
								 
								 oData2.Data[i].rating = (length == 0 ? 0 : (score / length).toFixed(2));
								 
								 oController._StatusMessage.getModel().setProperty("/Data/6", {Type : "Success", Text : oController.getBundleText("MSG_05015")}); // Rating 조회 완료
								 
								 for(var j=0; j<goal.length; j++){
									 if(goal[j].goals && goal[j].goals.results.length > 0){
										 if(oData2.Data[i].userId == goal[j].goals.results[0].userId){
											 oData2.Data[i].Count1 = goal[j].goals.results.length;
										 }
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/3", {Type : "Success", Text : oController.getBundleText("MSG_05016")}); // 목표 개수 조회 완료
								 
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
							 oController._ListCondJSonModel.setData(oData);
							 oController._StatusMessage.getModel().setProperty("/Data/7", {Type : "Success", Text : oController.getBundleText("MSG_05020")}); // Summary 데이터 집계 완료
							 
							 oJSONModel2.setData(oData2);
							 oTable.bindRows("/Data");
							 oTable.setVisibleRowCount((oData2.Data.length >= 10 ? 10 : oData2.Data.length));
							 // oController._BusyDialog.close();
							 
							 setTimeout(function(){
								$(".spinner-container")["hide"]();
								oController._ListCondJSonModel.setProperty("/Data/Edit", "");
							}, 300);
						 })
						 .catch(function(error){
							oController._BusyDialog.close();
							console.log("ERROR" + error);
							
							setTimeout(function(){
								$(".spinner-container")["hide"]();
								oController._ListCondJSonModel.setProperty("/Data/Edit", "");
							}, 0);
							return;
						});
						
						// 조회조건에 팀이 선택되어 있다면 테이블 filter를 설정해서 해당 팀의 정보만 보여준다.
						if(oController._ListCondJSonModel.getProperty("/Data/department") != ""){
							oController.onChangeDepartment();
						}
					 });
				});
			};
			
			setTimeout(search, 100);
		},
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			jQuery.sap.require("sap.ui.export.Spreadsheet");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_GoalTable");
			var oJSONModel = oTable.getModel();
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oController.getBundleText("LABEL_05126") + ".xlsx" // 목표관리
			};
	
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		onChangeDepartment : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			var department = oController._ListCondJSonModel.getProperty("/Data/department");
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_GoalTable");
			var oColumns = oTable.getColumns(), column = null;
			
			// 부서 column 조회
			for(var i=0; i<oColumns.length; i++){
				if(oColumns[i].mProperties.filterProperty == "department"){
					column = oColumns[i];
				}
			}
			
			// Filter 값 설정
			column.setFilterValue(department);
			
			if(department && department != ""){
				var filter = [new sap.ui.model.Filter("department", "EQ", department)];
				
				column.setFiltered(true);
				oTable.bindRows({path : "/Data", filters : filter});
			} else {
				column.setFiltered(false);
				oTable.bindRows("/Data");
			}
		}
	});

});