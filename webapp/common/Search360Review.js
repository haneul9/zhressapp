jQuery.sap.declare("common.Search360Review");

common.Search360Review = {
	oController : null,
	userId : null,
	_JSONModel : new sap.ui.model.json.JSONModel(),
	_BusyDialog : new sap.m.BusyDialog(),
	
	// 번역
	oBundleText : jQuery.sap.resources({
		url : "i18n/i18n.properties?" + new Date().getTime(),
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
	onBeforeOpen : function(oEvent){
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
					  
		common.Search360Review._JSONModel.setData({user : {}, Data : oData, summary : []});
	},
	
	onAfterOpen : function(oEvent){
		var oController = common.Search360Review.oController;
		
		common.Search360Review._BusyDialog.open();
		
		setTimeout(function(){
			common.Search360Review.onPressSearch();
		}, 500);
	},
	
	onPressSearch : function(oEvent){
		var oController = common.Search360Review.oController;	
		
		// 화면 최초 접속 시 접속한 대상자의 유저 정보 호출
		// userId가 넘어온 경우 해당 아이디의 유저 정보 호출
		var userId = "";
		if(common.Search360Review.userId){
			userId = common.Search360Review.userId;
		} else {
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");

			userId = vEmpLoginInfo[0].name == "sfdev1" ? "20060040" : vEmpLoginInfo[0].name;
		}
		
		var oData = {};
	
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
				
		
		var oData2 = common.Search360Review._JSONModel.getProperty("/Data");
		for(var i=0; i<=3; i++){
			eval("oData2[" + i + "].nickname = oData.nickname");
			eval("oData2[" + i + "].title = oData.title");
		}
		
		common.Search360Review._JSONModel.setData({user : oData, Data : oData2});
		common.Search360Review._BusyDialog.close();

		// 평가결과 조회
		var formDataId = "", formContentId = [];
			
		var templateID = (common.Common.getOperationMode() == "DEV" ? "719" : "502");
		
		new JSONModelHelper().url("/odata/v2/FormHeader?$filter=formTemplateId eq " + templateID + " and formDataStatus ne 4 and formSubjectId eq '" + userId + "'")
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
							 	 common.Search360Review._BusyDialog.close();
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
			common.Search360Review._BusyDialog.close();
			sap.m.MessageBox.error(common.Search360Review.oBundleText.getText("MSG_06005")); // 평가문서가 존재하지 않습니다.
			return;
		}
	
		// 다면평가 전체 평균점수 계산 - 가장 큰 formContentId로 조회한다.
		var rating = 0, rater = [];
		
		new JSONModelHelper().url("/odata/v2/Form360RaterSection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L)")
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
							 	common.Search360Review._BusyDialog.close();
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
		
		common.Search360Review._JSONModel.setProperty("/user/rating", (rating == 0 ? "" : rating.toFixed(2)));

		// comment 태그 수정(응답내용/기타)
		var onChangeComment = function(comment){
			var tmp = (comment || "").split("<p>");
			var message = "";
			
			if(tmp.length == 1){
				message = "<p>- " + tmp + "</p>";
			} else {
				for(var i=1; i<tmp.length; i++){
					if(i==1){
						tmp[i] = "<p>- " + tmp[i];
					} else {
						tmp[i] = "<p><span style='padding-left:9px' />" + tmp[i];
					}
					
					message = message + tmp[i];
				}
			}
			
			return message;
		};
		
		// 1. 만족도
		var itemId = [];
		new JSONModelHelper().url("/odata/v2/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=3)/competencies")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										for(var i=0; i<data.results.length; i++){
											itemId.push({itemId : data.results[i].itemId, itemIndex : data.results[i].itemIndex, name : data.results[i].name});
											
											if(data.results[i].itemIndex == "2"){
												common.Search360Review._JSONModel.setProperty("/Data/0/section2", "X");
											}
										}	
									} else {
									 	common.Search360Review._JSONModel.setProperty("/Data/0/section2", "");
									 }
							 })
							 .attachRequestFailed(function(error){
							 	 common.Search360Review._BusyDialog.close();
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
		
		// 만족도 항목 별 점수 조회
		var promise = [], rating = [], comment = [];
		for(var i=0; i<itemId.length; i++){
			for(var j=0; j<rater.length; j++){
				promise.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)/officialRating")
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data){
										rating.push({
											formContentId : data.formContentId,
											itemId : data.itemId,
											rating : data.rating,
											textRating : data.textRating
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
				
				promise.push(
					new Promise(function(resolve, reject){
						new JSONModelHelper().url("/odata/v2/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)/selfRatingComment")
											 .attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data){
														comment.push({
															formContentId : data.formContentId,
															itemId : data.itemId,
															comment : onChangeComment(data.comment)
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
								
							for(var b=0; b<category.length; b++){
								if(category[b] == "") continue;
								// 태그를 삭제하고 3자 이상이면 무조건 기타, 아닌 경우 각 카테고리 별 비율 계산한다.
								// comment 기타인 경우에만 표기되도록 함
								var text = category[b].replace(/<p>- /g, "");
								
								// 2020-11-20 무조건 카테고리 항목과 동일한 경우만 비율 계산, 이외는 전부 기타처리
								if(text.length == 3 && category.length == 2){
									if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06110")) != -1){ // 지시형
										score1++;
									} else if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06111")) != -1){ // 비전형
										score2++;
									} else if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06112")) != -1){ // 솔선형
										score3++;
									} else if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06113")) != -1){ // 친화형
										score4++;
									} else if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06114")) != -1){ // 육성형
										score5++;
									} else if(text.indexOf(common.Search360Review.oBundleText.getText("LABEL_06115")) != -1){ // 민주형
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
			
				common.Search360Review._JSONModel.setProperty("/Data", oData2);
				
				// 점수 summary 데이터 생성
				var summary = [{
									key : "9",
									label : common.Search360Review.oBundleText.getText("LABEL_06125"), // 종합
									value : common.Search360Review._JSONModel.getProperty("/user/rating") * 1
							   },
							   {
						   			key : "0",
									label : common.Search360Review.oBundleText.getText("LABEL_06126"), // 직무
									value : parseFloat(oData2[0].Total).toFixed(2) * 1
							   },
							   {
								 	key : "1",
									label : common.Search360Review.oBundleText.getText("LABEL_06127"), // 협업
									value : parseFloat(oData2[1].Total).toFixed(2) * 1
							   }];
							   
				if(common.Search360Review._JSONModel.getProperty("/Data/0/section2") == "X"){
					summary.push({
						key : "2",
						label : common.Search360Review.oBundleText.getText("LABEL_06128"), // 리더십
						value : parseFloat(oData2[2].Total).toFixed(2) * 1
					});
				}
				
				common.Search360Review._JSONModel.setProperty("/summary", summary);
	 		});
		});
		
		// 2. 강점
		var id1 = "";
		new JSONModelHelper().url("/odata/v2/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=4)/competencies")
							 .setAsync(false)    
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										id1 = data.results[0].itemId;
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.Search360Review._BusyDialog.close();
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
						new JSONModelHelper().url("/odata/v2/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id1 + "L,sectionIndex=4)/selfRatingComment")
											 .attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data){
														description1.push({
													 		formContentId : data.formContentId,
													 		comment : onChangeComment(data.comment)
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
		 			
					common.Search360Review._JSONModel.setProperty("/Data", oData2);
		 		});
			});
		}
		
		// 3. 보완점
		var id2 = "";
		new JSONModelHelper().url("/odata/v2/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=5)/competencies")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										id2 = data.results[0].itemId;
									}
							 })
							 .attachRequestFailed(function(error){
							 	 common.Search360Review._BusyDialog.close();
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
						new JSONModelHelper().url("/odata/v2/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id2 + "L,sectionIndex=5)/selfRatingComment")
											 .attachRequestCompleted(function(){
													var data = this.getData().d;
													
													if(data){
														description2.push({
													 		formContentId : data.formContentId,
													 		comment : onChangeComment(data.comment)
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
		 			
					common.Search360Review._JSONModel.setProperty("/Data", oData2);
		 		});
			});
		}
		
		common.Search360Review._BusyDialog.close();
	},
	
	// 직무만족도, 협업만족도
	makeMatrix1 : function(Flag){
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90px", "220px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06104")}).addStyleClass("FontFamily")], // 점수
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
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
												    text : (Flag == "0" ? common.Search360Review.oBundleText.getText("MSG_06001") : common.Search360Review.oBundleText.getText("MSG_06002")),
												    textAlign : "Center"
											    }).addStyleClass("Font14 FontGray paddingTop38")],
									 hAlign : "Center",
									 vAlign : "Top",
									 rowSpan : 5
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06105")}).addStyleClass("FontFamily")], // 응답내용
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
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
	
	// 리더십 만족도    
	makeMatrix2 : function(oEvent){
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90px", "220px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06104")}).addStyleClass("FontFamily")], // 점수
								 	 hAlign : "Center", 
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 rowSpan : 5
								 }),
								 ]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("MSG_06003"), textAlign : "Center"}).addStyleClass("Font14 FontGray paddingTop38")],
								 	 hAlign : "Center",
								 	 vAlign : "Top",
								 	 rowSpan : 5
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06103")}).addStyleClass("FontFamily")], // 평가자
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06110")}).addStyleClass("FontFamily")], // 지시형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06111")}).addStyleClass("FontFamily")], // 비전형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06112")}).addStyleClass("FontFamily")], // 솔선형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06113")}).addStyleClass("FontFamily")], // 친화형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06114")}).addStyleClass("FontFamily")], // 육성형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06115")}).addStyleClass("FontFamily")], // 민주형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06123")}).addStyleClass("FontFamily")], // 기타
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
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
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
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
	
	// 강점/보완점
	makeMatrix3 : function(oEvent){
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["310px", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06103")}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06116")}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06117")}).addStyleClass("FontFamily")],
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06106")}).addStyleClass("FontFamily")], // 상사
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06107")}).addStyleClass("FontFamily")], // 동료(팀내)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06108")}).addStyleClass("FontFamily")], // 동료(팀외)
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
									 content : [new sap.m.Text({text : common.Search360Review.oBundleText.getText("LABEL_06109")}).addStyleClass("FontFamily")], // 부하
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
	}
};
