jQuery.sap.require("sap.m.MessageBox") ;
sap.ui.controller("ZUI5_HR_MyDashboard.DashboardList", {
	PAGEID : "ESSDashboardList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_UserJSonModel : new sap.ui.model.json.JSONModel(),
	_UserList : "",
	
	_BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function(){
		this.getView().addStyleClass("sapUiSizeCompact");
		
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
	
	onBeforeShow : function(oEvent){
		var oController = this;
		
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			var vData = {
				Data : {
					Ename : "테스트",
					department : "신인사프로젝트TFT",
					Year : (new Date().getFullYear() + "")
				}
			};
			
			oController._ListCondJSonModel.setData(vData);
		}
		
		oController._BusyDialog.open();
	},
	
	onAfterShow : function(oEvent){
		var oController = this;
		
		setTimeout(function(){
			// 대상자 리스트
			oController.onUserList(oEvent);
		}, 500);
	},
	
	SmartSizing : function(oEvent){
		console.log("AKSJFDKJFDKDJKFJKD")
	},
	
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
		
		// 진행단계
		oController.onSearch1();
		
		// Timeline
		// oController.makeContent2();
		oController.onSearch2();
		
		// 조직목표
		oController.makeContent3();
		oController.onSearch3();
		
		// 개인MBO
		oController.makeContent4();
		oController.onSearch4();
		
		// 평가현황(점수)
		// 평가현황(등급)
	},
	
	// 본인 정보 조회
	onUserList : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
		
		var oModel = new sap.ui.model.odata.ODataModel("/odata/v2");
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
		var path = "/User?$select=title,department,division,jobCode,userId,firstName,lastName,custom01";
			path += "&$filter=userId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
		
		oController._UserList = "";
		
		var vData = {Data : []}, vData2 = {Data : []};
		
		oModel.read(path, {
			async: false,
			success: function (data, response) {
				 if(data && data.results.length){
					for(var i=0; i<data.results.length; i++){
						data.results[i].Ename = data.results[i].lastName + data.results[i].firstName;
						
						vData.Data.push(data.results[i]);
					}
				 }
			},
			error: function (e) {
				sap.m.MessageBox.error("Error : " + e);
			}
		});
		
		var photo = [];
		
		var path = "/Photo?$filter=userId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "' and photoType eq '1'";
		oModel.read(path, {
			async: false,
			success: function (data, response) {
				 if(data && data.results.length){
				 	data.results[0].photo = "data:text/plain;base64," + data.results[0].photo;
				 	photo.push(data.results[0]);
				 }
			},
			error: function (e) {
				sap.m.MessageBox.error("Error : " + e);
			}
		});
		
		var tmp = {};
 		Object.assign(tmp, vData.Data[0], photo[0]);
 		
 		vData2.Data.push(tmp);
		oController._UserJSonModel.setData(vData2);
		
		oController.onPressSearch();
	},
	
	// 목표,평가 진행 단계
	onSearch1 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
		var oModel = new sap.ui.model.odata.ODataModel("/odata/v2");
		
		var path = "/FormHeader";
			path += "?$filter=formTemplateId in 703,684 and formDataStatus ne 4 and formSubjectId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
			path += "&$select=currentStep,formDataId,formDataStatus,formTemplateId";
		
		// formTemplateId == "703"인 경우(업적/역량 평가문서) 해당 데이터로 진행상태 세팅
		// formTemplateId == "684"인 경우(목표승인 문서) formDataId 가 큰 데이터로 진행상태 세팅 
		var status = [], currentStep = "", formTemplateId = "";
		oModel.read(path, {
			async: false,
			success: function (data, response) {
				 if(data && data.results.length){
				 	for(var i=0; i<data.results.length; i++){
				 		if(data.results[i].formTemplateId == "703"){
				 			formTemplateId = "703";
				 			currentStep = data.results[i].currentStep;
				 			break;
				 		} else if(data.results[i].formTemplateId == "684"){
				 			formTemplateId = data.results[i].formTemplateId;
				 			status.push(data.results[i]);
				 		}
				 	}
				 }
			},
			error: function (e) {
				sap.m.MessageBox.error("Error : " + e);
			}
		});
		
		if(formTemplateId == "684"){
			var formDataId = "";
			for(var i=0; i<status.length; i++){
				if(i==0){
					formTemplateId = status[0].formTemplateId;
					currentStep = status[0].currentStep;
					formDataId = parseFloat(status[0].formDataId);
				} else {
					if(formDataId < parseFloat(status[i].formDataId)){
						formTemplateId = status[i].formTemplateId;
						currentStep = status[i].currentStep;
						formDataId = parseFloat(status[i].formDataId);
					}
				}
			}
		}
		
		for(var i=0; i<=5; i++){
			eval("var processflow" + i + " = sap.ui.getCore().byId(oController.PAGEID + '_ProcessFlowLane" + i + "');");
		}
		
		switch(formTemplateId){
			case "684":
				switch(currentStep){
					case "목표승인 - 목표설정":
					case "목표승인 - 목표검토":
						processflow0.setState([{state: "Positive", value: 100}]);
					break;
					
					case "목표승인 - 완료":
					case "":
					case null:
						processflow1.setState([{state: "Positive", value: 100}]);
					break;
				}
			break;
			case "703":
				switch(currentStep){
					case "업적/역량 평가- 평가 준비":
						processflow1.setState([{state: "Positive", value: 100}]);
					break;
					
					case "업적/역량 평가- 본인 평가":
						processflow2.setState([{state: "Positive", value: 100}]);
					break;
					
					case "업적/역량 평가- 부서장 평가":
					case "업적/역량 평가- 업적평가 등급결정":
					case "업적/역량 평가- 종합평가":
					case "업적/역량 평가- HR 확인":
						processflow3.setState([{state: "Positive", value: 100}]);
					break;
					
					case "업적/역량 평가- 결과확인":
						processflow4.setState([{state: "Positive", value: 100}]);
					break;
					
					case "업적/역량 평가- 최종완료":
					case "":
					case null:
						processflow5.setState([{state: "Positive", value: 100}]);
					break;
				}
			break;
			default:
				for(var i=0; i<=5; i++){
					eval("processflow" + i + ".setState([{state: 'Neutral', value: 100}]);");
				}	
		}
	},
	
	// Timeline
	onSearch2  : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
		
		var search = function(){
			var oModel = new sap.ui.model.odata.ODataModel("/odata/v2");
				
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			var vData = oController._UserJSonModel.getProperty("/Data");
			
			var activity = [], activityComment = [], achievement = [], feedback = [];
		 	var activityId = "";
		 	
		 	var oTimeline = sap.ui.getCore().byId(oController.PAGEID + "_Timeline");
		 		oTimeline.getModel().setData(null);
		 	
			var promise = [
				new Promise(function(resolve, reject){
					var path = "/Activity?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
					oModel.read(path, {
						async: true,
						success: function (data, response) {
							 if(data && data.results.length){
							 	for(var i=0; i<data.results.length; i++){
							 		if(i==0){
							 			activityId = data.results[i].activityId;
							 		} else {
							 			activityId += "," + data.results[i].activityId;
							 		}
							 		activity.push(data.results[i]);
							 	}
							 }
							resolve();
						},
						error: function (e) {
							sap.m.MessageBox.error("Error : " + e);
						}
					});
			 	}),
			 	new Promise(function(resolve, reject){
					var path = "/Achievement?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
					oModel.read(path, {
						async: true,
						success: function (data, response) {
							 if(data && data.results.length){
							 	for(var i=0; i<data.results.length; i++){
							 		achievement.push(data.results[i]);
							 	}
							 }
					 		resolve();
						},
						error: function (e) {
							sap.m.MessageBox.error("Error : " + e);
						}
					});
				})
			];
			
			// 피드백
			var path2 = "/ContinuousFeedback?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
			promise.push(
				new Promise(function(resolve, reject){
					oModel.read(path2, {
						async: true,
						success: function (data, response) {
							 if(data && data.results.length){
							 	for(var i=0; i<data.results.length; i++){
							 		feedback.push(data.results[i]);
							 	}
							 }
					 		resolve();
						},
						error: function (e) {
							sap.m.MessageBox.error("Error : " + e);
						}
					});
				})
			);
			
			Promise.all(promise).then(function(){
		 		setTimeout(function(){
		 			if(activityId != ""){
		 				// 활동 comment
			 			oModel.read("/ActivityFeedback?$filter=Activity_activityId in " + activityId, {
							async: false,
							success: function (data, response) {
								 if(data && data.results.length){
								 	for(var i=0; i<data.results.length; i++){
								 		activityComment.push(data.results[i]);
								 	}
								 }
							},
							error: function (e) {
								sap.m.MessageBox.error("Error : " + e);
							}
						});
		 			}
					
		 			// timeline 데이터 생성
		 			var tmp = [], oData2 = [];
		 			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMddHHmmss"});
		 			var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
		 			var dateFormat3 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "HH:mm"});
		 			
		 			// 시간 조정: 1시간 빼준다. (호주랑 시차 계산 필요)
		 			var setTime = function(oDate){
		 				oDate = new Date(common.Common.setTime(oDate));
		 				
		 				oDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), (oDate.getHours() - 1), oDate.getMinutes(), oDate.getSeconds());
		 				
		 				return oDate;
		 			};
		 			
		 			for(var i=0; i<activity.length; i++){
		 				tmp.push({
		 					index : "1",
		 					content : "활동",
		 					userId : activity[i].subjectUserId,
		 					comment : "활동 \n\n" +  activity[i].activityName,
		 					// datetime : dateFormat.format(activity[i].createdDateTime),
		 					datetime : activity[i].createdDateTime,
		 					date : dateFormat2.format(activity[i].createdDateTime),
		 					time : dateFormat3.format(activity[i].createdDateTime)
		 				});
		 			}
		 			
		 			for(var i=0; i<activityComment.length; i++){
		 				tmp.push({
		 					index : "5",
		 					content : "활동 - Comment",
		 					userId : activityComment[i].commenter,
		 					comment : "활동 - Comment \n\n" + activityComment[i].commentContent,
		 					// datetime : dateFormat.format(activityComment[i].createdDateTime),
		 					datetime : activityComment[i].createdDateTime,
		 					date : dateFormat2.format(activityComment[i].createdDateTime),
		 					time : dateFormat3.format(activityComment[i].createdDateTime)
		 				});
		 			}
		 			
		 			for(var i=0; i<achievement.length; i++){
		 				tmp.push({
		 					index : "2",
		 					content : "실적",
		 					userId : achievement[i].subjectUserId,
		 					comment : "실적 \n\n" + achievement[i].achievementName,
		 					// datetime : dateFormat.format(achievement[i].createdDateTime),
		 					datetime : achievement[i].createdDateTime,
		 					date : dateFormat2.format(achievement[i].createdDateTime),
		 					time : dateFormat3.format(achievement[i].createdDateTime)
		 				});
		 			}
		 			
		 			for(var i=0; i<feedback.length; i++){
		 				feedback[i].dateReceived = setTime(feedback[i].dateReceived);
		 				
		 				// activityId 가 존재: 3 활동-피드백
		 				// achievementId 가 존재: 4 실적-피드백
		 				// 둘 다 없으면: 6 피드백
		 				tmp.push({
		 					index : (feedback[i].activityId ? "3" : (feedback[i].achievementId ? "4" : "6")),
		 					content : (feedback[i].activityId ? "활동 - 피드백" : (feedback[i].achievementId ? "실적 - 피드백" : "피드백")),
		 					userId : feedback[i].senderUserId,
		 					comment : (feedback[i].activityId ? "활동 - 피드백" : (feedback[i].achievementId ? "실적 - 피드백" : "피드백")) + "\n\n" + feedback[i].feedbackMessage,
		 					// datetime : dateFormat.format(feedback[i].dateReceived),
		 					datetime : feedback[i].dateReceived,
		 					date : dateFormat2.format(feedback[i].dateReceived),
		 					time : dateFormat3.format(feedback[i].dateReceived)
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
		 				var path = "/User?$filter=userId in " + userId + "&$select=userId,nickname,title";
	 					oModel.read(path, {
							async: false,
							success: function (data, response) {
								 if(data && data.results.length){
									 for(var i=0; i<data.results.length; i++){
									 	data.results[i].Ename = data.results[i].nickname;
									 	
									 	// 사진
										oModel.read("/Photo?$filter=userId eq '" + data.results[i].userId + "' and photoType eq '1'", {
											async: false,
											success: function (data2, response) {
												 if(data2 && data2.results.length){
												 	data.results[i].photo = "data:text/plain;base64," + data2.results[0].photo;
												 }
											},
											error: function (e) {
												sap.m.MessageBox.error("Error : " + e);
											}
										});
									 	
									 	user.push(data.results[i]);
									 }
								 }
							},
							error: function (e) {
								sap.m.MessageBox.error("Error : " + e);
							}
						});
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
		 			
		 			// 최신순으로 정렬
		 			// var tmp = [];
		 			// for(var i=0; i<oData2.length; i++){
		 			// 	tmp.push(parseInt(oData2[i].datetime));
		 			// }
		 			
		 			// tmp.sort(function(a, b){return b - a;});
		 			// var oData3 = [];
		 			// for(var i=0; i<tmp.length; i++){
		 			// 	for(var j=0; j<oData2.length; j++){
		 			// 		if(parseInt(oData2[j].datetime) == tmp[i]){
			 		// 			oData3.push(oData2[j]);
			 		// 		}
		 			// 	}
		 			// }
		 			
		 			// oController.makeContent2(oData3);
		 			oTimeline.getModel().setData({Data : oData2});
		 			
		 			oController._BusyDialog.close();
		 		});
			});
		}
		
		if(oEvent){
			oController._BusyDialog.open();
			setTimeout(search, 100);
		} else {
			search();
		}
	},
		
	// timeline
	makeContent2 : function(oData){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
		
		var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content2");
			oContent.destroyContent();
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			widths : [""]
		});
		
		if(!oData || oData.length == 0){
			oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Text({text : "데이터가 없습니다."}).addStyleClass("FontFamily")],
								 hAlign : "Center",
								 vAlign : "Middle"
 							 })]
				})
			);
		} else {
			for(var i=0; i<oData.length; i++){
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
					columns : (oData.length > 7 ? 6 : 5),
					width : "100%",
					widths : (oData.length > 7 ? ["5px", "10px", "", "100px", "60px", "5px"] : ["5px", "10px", "", "100px", "60px"]),
					rows : [new sap.ui.commons.layout.MatrixLayoutRow({
								height : "30px",
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 rowSpan : 4
										 }).addStyleClass("background_blue"),
										 new sap.ui.commons.layout.MatrixLayoutCell({rowSpan : 4}),
										 new sap.ui.commons.layout.MatrixLayoutCell({
										 	 content : [new sap.m.Text({text : oData[i].content}).addStyleClass("Font13")]
										 }),
										 new sap.ui.commons.layout.MatrixLayoutCell({
										 	 content : [new sap.ui.layout.HorizontalLayout({
													 	 	content : [new sap.ui.core.Icon({
																 	 	   src : "sap-icon://appointment-2",
																 	 	   color : "#8c8c8c",
																 	 	   size : "14px"
																 	   }),
																 	   new sap.m.Text({
																 	   	   text : oData[i].date
																 	   }).addStyleClass("FontFamily FontGray paddingLeft5")]
													 	})],
											 hAlign : "Center",
											 vAlign : "Middle"
										 }),
										 new sap.ui.commons.layout.MatrixLayoutCell({
										 	 content : [new sap.ui.layout.HorizontalLayout({
													 	 	content : [new sap.ui.core.Icon({
																 	 	   src : "sap-icon://away",
																 	 	   color : "#8c8c8c",
																 	 	   size : "14px"
																 	   }),
																 	   new sap.m.Text({
																 	   	   text : oData[i].time
																 	   }).addStyleClass("FontFamily FontGray paddingLeft5")]
													 	})],
											 hAlign : "End",
											 vAlign : "Middle"
										 }),
										 new sap.ui.commons.layout.MatrixLayoutCell({rowSpan : 4})]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								height : "30px",
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.ui.layout.HorizontalLayout({
														 	content : [new sap.m.Text({text : oData[i].Ename}).addStyleClass("Font15 FontBold"),
																	   new sap.m.Text({text : oData[i].title}).addStyleClass("FontFamily paddingTop2 paddingLeft5")]
														})],
											 hAlign : "Begin",
											 vAlign : "Middle",
											 colSpan : 3
										 })]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : oData[i].comment}).addStyleClass("FontFamily")],
											 hAlign : "Begin",
											 vAlign : "Middle",
											 colSpan : 3
										 })]
							})]
				});
				
				// if(oData[i].index == "3" || oData[i].index == "4"){
				// 	oMatrix2.addRow(
				// 		new sap.ui.commons.layout.MatrixLayoutRow({
				// 			height : "30px",
				// 			cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				// 						 content : [new sap.m.Link({
				// 									 	text : "Reply"
				// 									})]
				// 					 })]
				// 		})
				// 	);
				// } else {
					oMatrix2.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}));
				// }
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
					})
				);
			}
		}
		
		oContent.addContent(oMatrix);
	},
	
	// 조직목표
	onSearch3 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
			
		var oData = [{
						title : "신인사시스템 구축",
						content : "SuccessFactors Cloud 기반",
						date : "2020.08 ~ 2021.06",
						user : "문자영 책임"
					 },
					 {
					 	title : "급여프로세스 개선",
					 	content : "기초/첨단 급여프로세스 통합",
					 	date : "2020.01 ~ 2020.04",
					 	user : "문자영 책임"
					 },
					 {
					 	title : "인재 관리",
					 	content : "채용 프로세스 개선 및 입사 합격자에 대한 Onboarding 프로세스 추가",
				 		date : "2020.01 ~ 2020.04",
					 	user : "문자영 책임"
					 }];
		
		oController.makeContent3(oData);
	},
	
	makeContent3 : function(oData){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
			
		var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content3");	
			oContent.destroyContent();
			
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			widths : [""]
		});
		
		if(!oData || oData.length == 0){
			oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Text({text : "데이터가 없습니다."}).addStyleClass("FontFamily")],
								 hAlign : "Center",
								 vAlign : "Middle"
 							 })]
				})
			);
		} else {
			for(var i=0; i<oData.length; i++){
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					width : "100%",
					widths : ["5px", ""],
					rows : [new sap.ui.commons.layout.MatrixLayoutRow({
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 rowSpan : 5
										 }).addStyleClass("background_blue"),
										 new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : oData[i].title}).addStyleClass("FontFamily FontBold")],
											 hAlign : "Begin",
											 vAlign : "Middle"
										 }).addStyleClass("MatrixData")]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : oData[i].content}).addStyleClass("FontFamily")],
											 hAlign : "Begin",
											 vAlign : "Middle"
										 }).addStyleClass("MatrixData")]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								height : "25px",
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : ("기간: " + oData[i].date)}).addStyleClass("FontFamily paddingLeft10")],
											 hAlign : "Begin",
											 vAlign : "Middle"
										 })]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								height : "25px",
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : ("담당자: " + oData[i].user)}).addStyleClass("FontFamily paddingLeft10")],
											 hAlign : "Begin",
											 vAlign : "Middle"
										 })]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"})]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
					})
				);
			}
		}
		
		oContent.addContent(oMatrix);
	},
	
	// 개인MBO
	onSearch4 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
			
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
	
		var oModel = new sap.ui.model.odata.ODataModel("/odata/v2");
		
		// 목표 Template ID 조회 - startDate 가 기준연도와 동일한 데이터의 id를 찾는다.
		var id = "";
		oModel.read("/GoalPlanTemplate?$select=id,startDate", {
			async: false,
			success: function (data, response) {
				 if(data && data.results.length){
				 	for(var i=0; i<data.results.length; i++){
				 		if(oController._ListCondJSonModel.getProperty("/Data/Year") == (data.results[i].startDate.getFullYear() + "")){
				 			id = data.results[i].id;
				 		}
				 	}
				 }
		 		
			},
			error: function (e) {
				sap.m.MessageBox.error("Error : " + e);
			}
		});
		
		if(id == "") return;
		
		var goal = [], activity = [], achievement = [], feedback = [];
		var activityId = "";
		
		var promise = [new Promise(function(resolve, reject){ // 목표
							var path = "/Goal_" + id;
								path += "?$filter=userId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
							oModel.read(path, {
								async: true,
								success: function (data, response) {
									 if(data && data.results.length){
									 	for(var i=0; i<data.results.length; i++){
									 		goal.push(data.results[i]);
									 	}
									 }
									 resolve();
								},
								error: function (e) {
									sap.m.MessageBox.error("Error : " + e);
								}
							});
						}),
						new Promise(function(resolve, reject){
							var path = "/Activity?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
								path += "&$expand=goalDetailList";
								path += "&$select=activityId,goalDetailList/goalId,goalDetailList/Activity_activityId";
							oModel.read(path, {
								async: true,
								success: function (data, response) {
									 if(data && data.results.length){
									 	for(var i=0; i<data.results.length; i++){
									 			if(i==0){
										 			activityId = data.results[i].activityId;
										 		} else {
										 			activityId += "," + data.results[i].activityId;
										 		}
										 		activity.push(data.results[i]);
									 	}
									 }
								 	 resolve();
								},
								error: function (e) {
									sap.m.MessageBox.error("Error : " + e);
								}
							});
					 	}),
					 	new Promise(function(resolve, reject){
							var path = "/Achievement?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'";
								path += "&$expand=goalDetailList";
								path += "&$select=goalDetailList/goalId,achievementId";
							oModel.read(path, {
								async: true,
								success: function (data, response) {
									 if(data && data.results.length){
									 	for(var i=0; i<data.results.length; i++){
									 		achievement.push(data.results[i]);
									 	}
									 }
							 		resolve();
								},
								error: function (e) {
									sap.m.MessageBox.error("Error : " + e);
								}
							});
						})];
						
		Promise.all(promise).then(function(){
	 		setTimeout(function(){
				// 활동,실적 피드백
				oModel.read("/ContinuousFeedback?$filter=subjectUserId eq '" + (vEmpLoginInfo[0].name == "sfdev1" ? "35118818" : vEmpLoginInfo[0].name) + "'", {
					async: false,
					success: function (data, response) {
						 if(data && data.results.length){
						 	for(var i=0; i<data.results.length; i++){
						 		feedback.push({id : (data.results[i].achievementId ? data.results[i].achievementId : data.results[i].activityId)});
						 	}
						 }
					},
					error: function (e) {
						sap.m.MessageBox.error("Error : " + e);
					}
				});
	 			
	 			var oData = [];
	 			
	 			for(var i=0; i<goal.length; i++){
	 				var detail = {};
	 					detail.id = goal[i].id;
	 					detail.name = goal[i].name;
	 					detail.activity = 0;
	 					detail.achievement = 0;
	 					detail.feedback = 0;
	 					
	 				// 활동 개수
	 				for(var j=0; j<activity.length; j++){
	 					if(activity[j].goalDetailList){
	 						for(var k=0; k<activity[j].goalDetailList.results.length; k++){
	 							if(goal[i].id == activity[j].goalDetailList.results[k].goalId){
	 								detail.activity = detail.activity + 1;
	 								
	 								for(var l=0; l<feedback.length; l++){
				 						if(activity[j].goalDetailList.results[k].Activity_activityId == feedback[l].id){
				 							detail.feedback = detail.feedback + 1;
				 						}
				 					}
	 							}
	 						}
	 					}
	 				}
	 				
	 				// 실적 개수
	 				for(var j=0; j<achievement.length; j++){
	 					if(achievement[j].goalDetailList){
	 						for(var k=0; k<achievement[j].goalDetailList.results.length; k++){
	 							if(goal[i].id == achievement[j].goalDetailList.results[k].goalId){
	 								detail.achievement = detail.achievement + 1;
	 								
	 								for(var l=0; l<feedback.length; l++){
				 						if(achievement[j].achievementId == feedback[l].id){
				 							detail.feedback = detail.feedback + 1;
				 						}
				 					}
	 							}
	 						}
	 					}
	 				}
	 				
	 				oData.push(detail);
	 			}
	 			
		 		oController.makeContent4(oData);
				oController._BusyDialog.close();
	 		});
		});
	},
	
	makeContent4 : function(oData){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MyDashboard.DashboardList");
		var oController = oView.getController();
			
		var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content4");
			oContent.destroyContent();
			
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			widths : [""]
		});
		
		if(!oData || oData.length == 0){
			oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
			
			oMatrix.addRow(
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Text({text : "데이터가 없습니다."}).addStyleClass("FontFamily")],
								 hAlign : "Center",
								 vAlign : "Middle"
	 						 })]
				})
			);
		} else {
			for(var i=0; i<oData.length; i++){
				oMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}));
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
					columns : 6,
					width : "100%",
					widths : ["5px", "", "5px", "", "5px", ""],
					rows : [new sap.ui.commons.layout.MatrixLayoutRow({
								height : "5px",
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 rowSpan : 5                                                 
										 }).addStyleClass("background_blue")]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Text({text : oData[i].name}).addStyleClass("FontFamily FontBold paddingLeft10")],
											 hAlign : "Begin",
											 vAlign : "Middle",
											 colSpan : 5
										 })]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells : [new sap.ui.commons.layout.MatrixLayoutCell({
											 content : [new sap.m.Toolbar({
														 	content : [new sap.m.ToolbarSpacer(),
														 			   new sap.m.Text({text : "활동"}).addStyleClass("Font13"),
														 			   new sap.ui.layout.HorizontalLayout({
														 			   	   content : [new sap.m.Text({
														 			   	   				  text : oData[i].activity,
														 			   	   				  textAlign : "Center"
														 			   				  }).addStyleClass("FontFamily paddingtop7 FontWhite paddingLeft2 FontBold")]
														 			   }).addStyleClass("goal1"),
														 			   new sap.m.ToolbarSpacer()]
														}).addStyleClass("toolbarNoBottomLine")],
											 hAlign : "Begin",
											 vAlign : "Middle"
										 }),
										 new sap.ui.commons.layout.MatrixLayoutCell(),
										 new sap.ui.commons.layout.MatrixLayoutCell({
										 	 content : [new sap.m.Toolbar({
														 	content : [new sap.m.ToolbarSpacer(),
														 			   new sap.m.Text({text : "실적"}).addStyleClass("Font13"),
														 			   new sap.ui.layout.HorizontalLayout({
														 			   	   content : [new sap.m.Text({
														 			   	   				  text : oData[i].achievement,
														 			   	   				  textAlign : "Center"
														 			   				  }).addStyleClass("FontFamily paddingtop7 FontWhite paddingLeft2 FontBold")]
														 			   }).addStyleClass("goal2"),
														 			   new sap.m.ToolbarSpacer()]
														}).addStyleClass("toolbarNoBottomLine")],
										 	 hAlign : "Begin",
										 	 vAlign : "Middle"
										 }),
										 new sap.ui.commons.layout.MatrixLayoutCell(),
										 new sap.ui.commons.layout.MatrixLayoutCell({
										 	 content : [new sap.m.Toolbar({
														 	content : [new sap.m.ToolbarSpacer(),
														 			   new sap.m.Text({text : "피드백"}).addStyleClass("Font13 margin0"),
														 			   new sap.ui.layout.HorizontalLayout({
														 			   	   content : [new sap.m.Text({
														 			   	   				  text : oData[i].feedback,
														 			   	   				  textAlign : "Center"
														 			   				  }).addStyleClass("FontFamily paddingtop7 FontWhite paddingLeft2 FontBold")]
														 			   }).addStyleClass("goal3"),
														 			   new sap.m.ToolbarSpacer()]
														}).addStyleClass("toolbarNoBottomLine")],
										 	 hAlign : "Begin",
										 	 vAlign : "Middle"
										 })]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"})]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2]})]
					})
				);
			}
		}
		
		oContent.addContent(oMatrix);
	}
	
});