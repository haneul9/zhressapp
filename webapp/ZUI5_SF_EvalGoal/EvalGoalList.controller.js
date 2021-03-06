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
		_TargetList : [],
		
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
					Data : [{Type : "Warning", Text : oController.getBundleText("MSG_05005")}, // ???????????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05006")}, // ???????????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05007")}, // ???????????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05008")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05009")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05010")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05011")}, // Rating ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05012")}] // Summary ????????? ??????
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
			oController.getTargetReports(oEvent);
			oController.onSearchUserList(oEvent);
			oController.onPressSearch();
		},
		
		SmartSizing : function(oEvent){
			
		},

		getTargetReports: function() { // ???????????? ????????????
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vData = {Data : []},
				createData = {},
				oPath = "/CommonCodeListHeaderSet";
				createData.ICodeT =   "066"; 
				createData.NavCommonCodeList = [] ;
			
			oModel.create(oPath, createData, null,
				function(data, res){
					if(data){
						if(data.NavCommonCodeList && data.NavCommonCodeList.results.length > 0){
							vData.Data = data.NavCommonCodeList.results;
						}
					}
				},
				function (oError) {
					
				}
			);
			
			oController._TargetList = vData.Data;
		},
		
		onSearchUserList : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
			oController._UserList = "";
			
			var vData = {Data : []},
			empDataList = [];
			
			
			new JSONModelHelper().url("/odata/v2/User('" + $.app.getModel("session").getData().name + "')/directReports")
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
											data.results.forEach(function(e) {
												if(oController._TargetList.some(function(ele) {return ele.Code === e.custom07;})){
													empDataList.push(e);
												}
											}.bind(this));

											for(var i=0; i<empDataList.length; i++){
												if(empDataList[i].custom04 != null) continue; // ?????? ?????? ??????
											
												if(i==0){
													oController._UserList = empDataList[i].userId;
												} else {
													oController._UserList += "," + empDataList[i].userId;
												}
												
												empDataList[i].Ename = empDataList[i].nickname;

												empDataList[i].title = empDataList[i].title.split(" (")[0];
												empDataList[i].department = empDataList[i].department.split(" (")[0];
												
												empDataList[i].Count1 = 0;
												empDataList[i].Count2 = 0;
												empDataList[i].Count3 = 0;
												
												vData.Data.push(empDataList[i]);
											}
										}
								 })
								 .attachRequestFailed(function() {
										sap.m.MessageBox.error(oController.getBundleText("MSG_05002")); // ????????? ?????? ??? ????????? ?????????????????????.
										return;
								 })
								 .load();
			



			oController._UserJSonModel.setData(vData);
			
			// ????????? ?????????????????? ??????????????? ??? ????????? ??????
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
			
			oController._StatusMessage.getModel().setProperty("/Data/0", {Type : "Success", Text : oController.getBundleText("MSG_05013")}); // ???????????? ?????? ?????? ??????
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalGoal.EvalGoalList");
			var oController = oView.getController();
			
			// oController._BusyDialog.open();
			if(oEvent){
				var vData = {
					Data : [{Type : "Success", Text : oController.getBundleText("MSG_05013")}, // ???????????? ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05006")}, // ???????????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05007")}, // ???????????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05008")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05009")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05010")}, // ?????? ?????? ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05011")}, // Rating ??????
							{Type : "Warning", Text : oController.getBundleText("MSG_05012")}] // Summary ????????? ??????
				};
				
				oController._StatusMessage.getModel().setData(vData);
				
				setTimeout(function(){
					$(".spinner-container")["show"]();
					oController._ListCondJSonModel.setProperty("/Data/Edit", "X");
					oController._StatusMessage.openBy(sap.ui.getCore().byId(oController.PAGEID + "_Status"));
				}, 0);
			}
			
			// Summary ?????????
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
				var vYear = oController._ListCondJSonModel.getProperty("/Data/Year");
				for(var i=0; i<user.length; i++){
					var detail = {};
					Object.assign(detail, user[i]);
					oData2.Data.push(detail);
				}
				
				var goal = [], activity = [], achievement = [], status = [], rating = [];
				var activityId = "";
				var vCreateTime = "createdDateTime ge '" + vYear + "-01-01T00:00:00Z' and createdDateTime le '" +  vYear + "-12-31T00:00:00Z'";
				

				var promise = [
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Activity?$filter=subjectUserId in " + oController._UserList + " and " + vCreateTime)
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
													//   var message = JSON.parse(error.getParameters().responseText).error.message.value;
													//   sap.m.MessageBox.error(message);
													  reject();
												 } else {
													//   sap.m.MessageBox.error(error);
													  reject();
												 }
											 })
											 .load();
					 }),
					 new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/Achievement?$filter=subjectUserId in " + oController._UserList + " and " + vCreateTime)
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
													//   var message = JSON.parse(error.getParameters().responseText).error.message.value;
													//   sap.m.MessageBox.error(message);
													  reject();
												 } else {
													//   sap.m.MessageBox.error(error);
													  reject();
												 }
											 })
											 .load();
					})
				];
				
				for(var i=0; i<oData2.Data.length; i++){
					promise.push(
						new Promise(function(resolve, reject){
							new JSONModelHelper().url("/odata/v2/GoalPlanTemplate?$select=id,goals,planStates&$expand=goals,planStates&userId=" + oData2.Data[i].userId + "&$filter=name%20like%20%27"+ vYear + "%25%27" )
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
								// ?????? ?????? ????????? ?????? id ????????? ?????????
								for(var i=0; i<goal[a].planStates.results.length; i++){
									state.push({id : goal[a].planStates.results[i].planId, state : goal[a].planStates.results[i].stateId, userId : goal[a].goals.results[0].userId});
								}
								
								// ?????? ????????? ?????? template id ????????? ?????????
								var tmp = "";
								for(var i=0; i<goal[a].goals.results.length; i++){
									if(i==0)
										tmp = goal[a].goals.results[i].id;
									else
										tmp += "," + goal[a].goals.results[i].id;
								}
								
								id.push({userId : goal[a].goals.results[0].userId, id : tmp});
								
								// ?????? ?????? ??????
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
								
								// ?????? ??????
								if(id.length != 0){
									/** ?????? ??????
										??????(g110bc197) : 2019??? ???????????? ???????????? 2020????????? 1??? ???????????? Entity??? ??????
										QA, ?????? : 2019????????? 1??? ???????????? Entity??? ?????? **/
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
							 // summary ??????
							 //  ??????		??????		??????		??????
							 var count2 = 0, count3 = 0, count4 = 0, count5 = 0;
							 
							 oController._StatusMessage.getModel().setProperty("/Data/1", {Type : "Success", Text : oController.getBundleText("MSG_05014")}); // ???????????? ?????? ??????
							 
							 for(var i=0; i<oData2.Data.length; i++){
								 oData2.Data[i].Count1 = 0;
								 oData2.Data[i].Count2 = 0;
								 oData2.Data[i].Count3 = 0;
								 
								 for(var j=0; j<activity.length; j++){
									 if(oData2.Data[i].userId == activity[j].subjectUserId){
										 oData2.Data[i].Count2 = oData2.Data[i].Count2 + 1;
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/4", {Type : "Success", Text : oController.getBundleText("MSG_05017")}); // ?????? ?????? ?????? ??????
								 
								 for(var j=0; j<achievement.length; j++){
									 if(oData2.Data[i].userId == achievement[j].subjectUserId){
										 oData2.Data[i].Count3 = oData2.Data[i].Count3 + 1;
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/5", {Type : "Success", Text : oController.getBundleText("MSG_05018")}); // ?????? ?????? ?????? ??????
								 
								 for(var j=0; j<status.length; j++){
									 if(oData2.Data[i].userId == status[j].userId){
										 oData2.Data[i].currentStep = status[j].currentStep;
									 }
								 }
							 
								 oController._StatusMessage.getModel().setProperty("/Data/2", {Type : "Success", Text : oController.getBundleText("MSG_05015")}); // ???????????? ?????? ?????? ??????
								 
								 var length = 0, score = 0;
								 for(var j=0; j<rating.length; j++){
									 if(oData2.Data[i].userId == rating[j].userId){
										 length++;
										 score += (rating[j].customScore ? parseFloat(rating[j].customScore) : 0);
									 }
								 }
								 
								 oData2.Data[i].rating = (length == 0 ? 0 : (score / length).toFixed(2));
								 
								 oController._StatusMessage.getModel().setProperty("/Data/6", {Type : "Success", Text : oController.getBundleText("MSG_05015")}); // Rating ?????? ??????
								 
								 for(var j=0; j<goal.length; j++){
									 if(goal[j].goals && goal[j].goals.results.length > 0){
										 if(oData2.Data[i].userId == goal[j].goals.results[0].userId){
											 oData2.Data[i].Count1 = goal[j].goals.results.length;
										 }
									 }
								 }
								 
								 oController._StatusMessage.getModel().setProperty("/Data/3", {Type : "Success", Text : oController.getBundleText("MSG_05016")}); // ?????? ?????? ?????? ??????
								 
								 count2 += oData2.Data[i].Count1;
								 count3 += oData2.Data[i].Count2;
								 count4 += oData2.Data[i].Count3;
								 count5 += parseFloat(oData2.Data[i].rating);
							 }
							 
							 // summary ????????? ??????
							 oData.Data.Count1 = oData2.Data.length;
							 oData.Data.Count2 = (count2 == 0 ? 0 : (count2 / oData.Data.Count1).toFixed(2));
							 oData.Data.Count3 = (count3 == 0 ? 0 : (count3 / oData.Data.Count1).toFixed(2));
							 oData.Data.Count4 = (count4 == 0 ? 0 : (count4 / oData.Data.Count1).toFixed(2));
							 oData.Data.Count5 = (count5 == 0 ? 0 : (count5 / oData.Data.Count1).toFixed(2));
							 
							 // ????????? ?????????
							 oController._ListCondJSonModel.setData(oData);
							 oController._StatusMessage.getModel().setProperty("/Data/7", {Type : "Success", Text : oController.getBundleText("MSG_05020")}); // Summary ????????? ?????? ??????
							 
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
						
						// ??????????????? ?????? ???????????? ????????? ????????? filter??? ???????????? ?????? ?????? ????????? ????????????.
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
				fileName: oController.getBundleText("LABEL_05126") + ".xlsx" // ????????????
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
			
			// ?????? column ??????
			for(var i=0; i<oColumns.length; i++){
				if(oColumns[i].mProperties.filterProperty == "department"){
					column = oColumns[i];
				}
			}
			
			// Filter ??? ??????
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