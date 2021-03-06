/* eslint-disable no-eval */

function SearchEvelResultForPrint(_gateway, vPernr, vZyear) {

	this.Pernr = vPernr;
	this.Zyear = vZyear;
	this.User = {};
	this._gateway = _gateway;
	this.spinner(true);
	this.onSearchUser(vPernr, vZyear);
	Promise.all([
		this.onSearchPhoto(vPernr, vZyear), 
		this.onSearchEval(vPernr, vZyear),
		this.onSearchPerformance(vPernr, vZyear),
		this.onSearchCompetency(vPernr, vZyear),
		this.onSearch360(vPernr, vZyear, this.User)
	]).then(function() {
		
	}.bind(this));


}

$.extend(SearchEvelResultForPrint.prototype, {

	init: function() {
		console.log(this.Pernr);
		console.log(this.Zyear);
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
	},
	
	spinner: function(on) {

		setTimeout(function() {
			$('.menu-spinner-wrapper').toggleClass('d-none', !on);
		}, 0);
	},
	
	
	onSearchUser : function(vPernr, vZyear){
		var url = "/odata/v2/User('" + parseFloat(vPernr) + "')";
	
		return $.getJSON({
			url: url,
			success: function(d) {
	
				if(d){ 

					$('#title_layout').text(vZyear + "년도 평가기록카드");
					$('#Name').text(d.d.nickname);
					$('#Title').text(d.d.title);
					$('#Title1').text(d.d.department + " / " + d.d.custom01);
					this.User.nickname = d.d.nickname;
					this.User.title = d.d.title;
				}
			
			}.bind(this),
			error: function(jqXHR) {
				// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url);
			}.bind(this),
			complete: function() {
				// this.spinner(false);
			}.bind(this)
		});
	},
	
	onSearchPhoto : function(vPernr, vZyear){
	
		var url = "/odata/v2/Photo?$filter=userId eq '" + vPernr + "' and photoType eq '1'";
	
		return new Promise(function(resolve, reject){
			$.getJSON({
				url: url,
				success: function(d) {
					var oData = {};
					var oPhotoLayout = $("#pic_1");
					console.log(oPhotoLayout);
					var data = d.d;
									
					if(data && data.results.length){
						oData.photo = "data:text/plain;base64," + data.results[0].photo;
					} else {
						oData.photo = "images/male.jpg";
					}
					oPhotoLayout.attr("src",oData.photo);
					resolve();
				}.bind(this),
				error: function(jqXHR) {
					// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
				}.bind(this),
				complete: function() {
					// this.spinner(false);
				}.bind(this)
			});
		});
	},
	
	onSearchEval : function(vPernr, vZyear){
		var url = 'ZHR_APPRAISAL_SRV/EvalResultsSet';
	
		return new Promise(function(resolve, reject){
			this._gateway.post({
				url: url,
				data: { 
					IEmpid: vPernr,
					IAppye: vZyear,
					IConType: '2',
					TableIn: []
				},
				success: function(data) {
					TableIn = this._gateway.odataResults(data).TableIn;
					list = $('#overivew_layout');
					var vTableBody = [];
					if (TableIn.length) {
						$.map(TableIn, function(o) { // 평가연도, 업적평가, 역량평가, 다면평가, 1차 평가, 2차 평가, 평가세션
							vTableBody = vTableBody +  [
		
								'<tr>',
									'<td style="text-align:center">', o.Appye || '', '</td>',
									'<td style="text-align:center">', o.Grade1 || '', '</td>',
									'<td style="text-align:center">', o.Grade2 || '', '</td>',
									'<td style="text-align:center">', o.Grade3 || '', '</td>',
									'<td style="text-align:center">', o.Grade4 || '', '</td>',
									'<td style="text-align:center">', o.Grade5 || '', '</td>',
									'<td style="text-align:center">', o.Grade6 || '', '</td>',
								'</tr>'
							].join('');
						}.bind(this)).join('');
					}
					var vBody = [
					'<table style="width:100%">',
						'<colgroup>',
							'<col style="width:14%" /><col style="width:14%" /><col style="width:14%" />'+
							'<col style="width:14%" /><col style="width:14%" /><col style="width:14%" />'+
							'<col style="width:16%" />',
						'</colgroup>',
						'<thead>',
							'<tr><th>평가연도</th><th>업적평가</th><th>역량평가</th><th>다면평가</th>'+
							'<th>1차 평가</th><th>2차 평가</th><th>종합등급</th></tr>',
						'</thead>',
						'<tbody>',
							vTableBody,
						'</tbody>',
					'</table>',
					].join('');
		
					list.html(vBody);
					resolve();
				}.bind(this),
				error: function(jqXHR) {
					// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HiTalkTalkPortlet.fill ' + url);
				}.bind(this),
				complete: function() {
					// this.spinner(false);
				}.bind(this)
			});
		});
	},
	
	onSearchPerformance : function(vPernr, vZyear){
		// Goal No 조회
		var goal = [],
			vGoalId = "",
			vGoalIds = "",
			vFormTemplateId = "",
			vformDataId = "",
			vformContentId = "";
		var url = "/odata/fix/GoalPlanTemplate?$select=id,name,goals&$expand=goals&userId="  + vPernr ;
	
		return new Promise(function(resolve, reject){
				$.getJSON({
				url: url,
				success: function(d) {
					var data = d.d;
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							// 연도와 동일한 목표만 테이블에 넣어준다.
							if(data.results[i].name.substring(0,4) == vZyear){
								vGoalId = data.results[i].id;
								for(var j=0; j<data.results[i].goals.results.length; j++){
									data.results[i].goals.results[j].name = data.results[i].goals.results[j].name.replace(/\\n/g, "\n");
									data.results[i].goals.results[j].idx = "" + (j+1);
									goal.push(data.results[i].goals.results[j]);
									if(vGoalIds == ""){
										vGoalIds = data.results[i].goals.results[j].id;
									} else {
										vGoalIds += "," + data.results[i].goals.results[j].id;
									}
								}
								break;
							}
						}
						// 목표상세 내용, 상시평가 점수, 진척율 조회
						var url1 = "/odata/fix/Goal_"+ vGoalId +"?$select=id,done,customScore&$filter=userId eq '" + vPernr + "' and id in "+ vGoalIds;
						$.getJSON({
							url: url1,
							success: function(d) {
								var data = d.d;
								if(data && data.results.length){
									for(var i=0; i<data.results.length; i++){
										for(var j=0; j<goal.length; j++){
											if(data.results[i].id == goal[j].id){
												goal[j].custom01 = data.results[i].custom01;
												goal[j].done = data.results[i].done;
												break;
											}
										}	
									}
								}
							}.bind(this),
							error: function(jqXHR) {
								// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
							}.bind(this),
							complete: function() {
								// this.spinner(false);
							}.bind(this)
						});
					
						// 업적평가 문서 ID 조회
						var url2 = "/odata/fix/FormTemplate?$filter=formTemplateType eq 'Review' and formTemplateName%20like%20%27"  + vZyear +"년 업적%25%27"  ;
						$.getJSON({
							url: url2,
							success: function(d) {
								var data = d.d;
								if(data && data.results.length){
									vFormTemplateId = data.results[0].formTemplateId;
								}
		
								// 업적평가 FormDataID , FormContentID 조회
								var url3 = "/odata/fix/FormHeader?$select=currentStep,formDataId,formDataStatus,formLastContent" +
								"&$expand=formLastContent&$filter=formTemplateId eq " + vFormTemplateId + " and formDataStatus ne 4 and formSubjectId in " + vPernr ;
								$.getJSON({
									url: url3,
									success: function(d) {
										var data = d.d;
													
										if(data && data.results.length){
											if(data.results[0].formLastContent){
												vformDataId = data.results[0].formLastContent.formDataId;
												vformContentId = data.results[0].formLastContent.formContentId;
											}
										}
		
										var url4 = "/odata/fix/FormContent?$filter=formDataId eq " + vformDataId + "L and formContentId eq " + vformContentId + "L" +
										"&$expand=pmReviewContentDetail/competencySections/competencies/selfRatingComment," + 
										"pmReviewContentDetail/objectiveSections/objectives/officialRating,"+
										"pmReviewContentDetail/customSections/othersRatingComment";
										
										$.getJSON({
											url: url4,
											success: function(d) {
												var data = d.d;
															
												if(data && data.results.length){
													// 1차평가 결과
													var result = data.results[0].pmReviewContentDetail.results[0].objectiveSections.results[0].objectives.results;
													if(result && result.length){
														for(var i=0; i<goal.length; i++){
															for(var j=0; j<result.length; j++){
																if(goal[i].id == result[j].itemId){
																	goal[i].rating = result[j].officialRating.rating;
																}
															}
														}
													}
		
													var list = $('#performance_layout');
													var vTableBody = [];
													if (result.length) {
														$.map(goal, function(o) { // No. ,  목표,  진척율, 수시평가,  1차 평가
															vTableBody = vTableBody +  [
		
																'<tr>',
																	'<td style="text-align:center">', o.idx || '', '</td>',
																	'<td style="text-align:center">', o.name || '', '</td>',
																	'<td style="text-align:center">', o.done || '', '</td>',
																	'<td style="text-align:center">', o.custom01 || '', '</td>',
																	'<td style="text-align:center">', o.rating || '', '</td>',
																'</tr>'
															].join('');
														}.bind(this)).join('');
													}
													var vBody = [
													'<table style="width:100%">',
														'<colgroup>',
															'<col style="width:50px" /><col style="width:40%" /><col style="width:25%" />'+
															'<col style="width:17.5%" /><col style="width:17.5%" />',
														'</colgroup>',
														'<thead>',
															'<tr><th>No.</th><th>목표</th><th>진척율</th>'+
															'<th>수시평가</th><th>1차평가</th></tr>',
														'</thead>',
														'<tbody>',
															vTableBody,
														'</tbody>',
													'</table>'
													].join('');
		
													list.html(vBody);
													
													if(data.results[0].pmReviewContentDetail.results[0].customSections && data.results[0].pmReviewContentDetail.results[0].customSections.results.length){
														for(var i=0; i<data.results[0].pmReviewContentDetail.results[0].customSections.results.length; i++){
															if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "역량평가 의견"){
																// 역량평가 1차 평가자 의견
																var comment2 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
																if(comment2[0].comment && comment2[0].comment != ""){
																	document.getElementById("comment2_layout").innerHTML = comment2[0].comment;
																}
															} else if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "업적평가 의견"){
																// 업적평가 1차 평가자 의견
																var comment1 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
																if(comment1[0].comment && comment1[0].comment != ""){
																	document.getElementById("comment1_layout").innerHTML = comment1[0].comment;
																}
															}
														}
													}
												}
											}.bind(this),
											error: function(jqXHR) {
												// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
											}.bind(this),
											complete: function() {
												// this.spinner(false);
											}.bind(this)
										});
		
									}.bind(this),
									error: function(jqXHR) {
										// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
									}.bind(this),
									complete: function() {
										// this.spinner(false);
									}.bind(this)
								});
		
							}.bind(this),
							error: function(jqXHR) {
								// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
							}.bind(this),
							complete: function() {
								// this.spinner(false);
							}.bind(this)
						});

						resolve();
					}
				}.bind(this),
				error: function(jqXHR) {
					// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
				}.bind(this),
				complete: function() {
					// this.spinner(false);
				}.bind(this)
			});
		});
	},
	
	onSearchCompetency : function(vPernr, vZyear){
		var url = 'ZHR_APPRAISAL_SRV/CompResultsSet';
	
		return this._gateway.post({
			url: url,
			data: { 
				Pernr: vPernr,
				Appye: vZyear,
				CompResultsNav: []
			},
			success: function(d) {
				var CompResultsNav = this._gateway.odataResults(d).CompResultsNav;
				var data = {labels:[], datasets : []};
				var dataset1 = {data:[]},
					dataset2 = {data:[]};
				console.log(CompResultsNav);
				for(var i=0; i<CompResultsNav.length; i++){
					data.labels.push(CompResultsNav[i].Compgrptx); //역량 Label
					dataset1.data.push(CompResultsNav[i].Comppnt1 * 1) ; //1차역량점수
					dataset2.data.push(CompResultsNav[i].Comppnt2 * 1); //동일 Grade 평균 점수
				}
	
				dataset1.label = "1차역량점수";
				dataset1.fill = true;
				dataset1.backgroundColor = 'rgba(255, 255, 255, 0)';
				dataset1.borderColor = 'rgba(255, 205, 86, 1)';
				dataset1.pointBackgroundColor =  'rgb(255, 205, 86)';
				dataset1.pointBorderColor = '#fff';
				dataset1.pointHoverBackgroundColor = '#fff';
				dataset1.pointHoverBorderColor = 'rgb(255, 205, 86)';
				data.datasets.push(dataset1);
	
				dataset2.label = "동일 Grade 평균 점수";
				dataset2.fill = true;
				dataset2.backgroundColor = 'rgba(255, 255, 255, 0)';
				dataset2.borderColor = 'rgba(75, 192, 192, 1)';
				dataset1.pointBackgroundColor =  'rgb(75, 192, 192)';
				dataset2.pointBorderColor = '#fff';
				dataset2.pointHoverBackgroundColor = '#fff';
				dataset2.pointHoverBorderColor = 'rgb(75, 192, 192)';
				data.datasets.push(dataset2);
				console.log(data);
				var ctx = document.getElementById('competency_layout'); 
				var myChart = new Chart(ctx, { 
								type: 'radar', 
								data: data,
								options:{
									elements: {
										line: {
											borderWidth: 3
										}
									},
									scales :{
										r: {
											angleLines: {
												display: false
											},
											suggestedMin: 0,
											suggestedMax: 100
										}
									}
								}
							});
	
	
	
			}.bind(this),
			error: function(jqXHR) {
				// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HiTalkTalkPortlet.fill ' + url);
			}.bind(this),
			complete: function() {
				// this.spinner(false);
			}.bind(this)
		});
	},
	
	onSearch360 : function(vPernr, vZyear, vEmployee){
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
	
		var that = this;
		var vFormTemplateId ="",
		formDataId ="", 
		formContentId = [];
	
		// 1. Template ID 조회 
		var url = "/odata/fix/FormTemplate?$filter=formTemplateType eq '360' and formTemplateName%20like%20%27"  + vZyear +"년 다면%25%27"  ;
	
		return $.getJSON({
			url: url,
			success: function(d) {
				var data = d.d;
				if(data && data.results.length){
					vFormTemplateId = data.results[0].formTemplateId;
				}
	
				// 2. 다면평가 FormDataID , FormContentID 조회
				var url2 = "/odata/fix/FormHeader?$select=currentStep,formDataId,formDataStatus,formContents/formContentId,formContents/status" +
				"&$expand=formContents&$filter=formTemplateId eq " + vFormTemplateId + " and formDataStatus ne 4 and formSubjectId in " + vPernr ;
				$.getJSON({
					url: url2,
					success: function(d) {
						var data = d.d;
									
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
	
						formContentId.sort();
	
						var url3 = "/odata/fix/Form360RaterSection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L)" +
						"?$expand=form360Raters";
						// 3. 다면평가 전체 평균점수 계산, 평가자 리스트 생성 - 가장 큰 formContentId로 조회
						var ratingScore = 0, rater = [];
	
						$.getJSON({
							url: url3,
							success: function(d) {
								var data = d.d;
								
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
												ratingScore += parseFloat(data.form360Raters.results[i].participantRating.split("/")[0]);
											}
										}
										
										// 2020-11-20 평균점수 계산 시 평가자 리스트로 계산하도록 수정
										// rating = rating / data.form360Raters.results.length;
										ratingScore = rater.length == 0 ? 0 : ratingScore / rater.length;
									}	
								}
								
								// comment 태그 수정
								var onChangeComment = function(comment){
									console.log(comment);
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
	
								// 4. 만족도
								var itemId = [];
								var url4 = "/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=3)/competencies";
								$.getJSON({
									url: url4,
									success: function(d) {
										var data = d.d;
										
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
	
										itemId.sort(function(a,b){
											if(a.itemIndex > b.itemIndex){
												return 1;
											} else if(a.itemIndex < b.itemIndex){
												return -1;
											} else {
												return 0;
											}
										});
	
												// 4-1. 만족도 항목 별 점수 및 응답내용 조회
										var promise = [], rating = [], comment = [];
										for(var i=0; i<itemId.length; i++){
											for(var j=0; j<rater.length; j++){
												var url4 = "/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[j].formContentId + "L,itemId=" + itemId[i].itemId + "L,sectionIndex=3)" +
															"?$expand=officialRating,othersRatingComment";
												
												promise.push(
													new Promise(function(resolve, reject){
														$.getJSON({
															url: url4,
															success: function(d) {
																var data = d.d;
																
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
																
															}.bind(this),
															error: function(jqXHR) {
																reject();
																// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
															}.bind(this),
															complete: function() {
																// this.spinner(false);
																resolve();
															}.bind(this)
														});
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
													eval("if(count" + a + " != 0){total2++};");
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
																if(text.indexOf("지시형") != -1){ // 지시형
																	score1++;
																} else if(text.indexOf("비전형") != -1){ // 비전형
																	score2++;
																} else if(text.indexOf("솔선형") != -1){ // 솔선형
																	score3++;
																} else if(text.indexOf("친화형") != -1){ // 친화형
																	score4++;
																} else if(text.indexOf("육성형") != -1){ // 육성형
																	score5++;
																} else if(text.indexOf("민주형") != -1){ // 민주형
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
											document.getElementById("Val1").innerHTML = ratingScore;
											document.getElementById("Val2").innerHTML = parseFloat(oData2[0].Total).toFixed(2) * 1;
											document.getElementById("Val3").innerHTML = parseFloat(oData2[1].Total).toFixed(2) * 1;
											var V4layout = document.getElementById("Val4_layout");
											if(oData2[0].section2 == "X"){
												document.getElementById("Val4").innerHTML = parseFloat(oData2[2].Total).toFixed(2) * 1;
												V4layout.style.visibility = "visible";
											}else{
												V4layout.style.visibility = "hidden";
											}
											
											// 2. 강점
	
											// 다면평가 Table 그리기
											var make360Table = function(layout, comment, idx){
												var layoutBody = [],
													commentBody = [];
												if (rating.length) {
													layoutBody = layoutBody +  [
														'<tr>',
															'<td style="text-align:center">', "상사", '</td>',
															'<td style="text-align:center">', oData2[idx].Score1|| '', '</td>',
														'</tr>',
														'<tr>',
															'<td style="text-align:center">', "동료(팀내)", '</td>',
															'<td style="text-align:center">', oData2[idx].Score2|| '', '</td>',
														'</tr>',
														'<tr>',
															'<td style="text-align:center">', "동료(팀외)", '</td>',
															'<td style="text-align:center">', oData2[idx].Score3|| '', '</td>',
														'</tr>',
														'<tr>',
															'<td style="text-align:center">', "부하", '</td>',
															'<td style="text-align:center">', oData2[idx].Score4|| '', '</td>',
														'</tr>'
													].join('');
	
													var body1 = [
														'<table style="width:100%;">',
															'<colgroup>',
																'<col style="width:50%"/><col style="width:50%" />',
															'</colgroup>',
															'<thead>',
																'<tr><th >평가자</th><th>점수</th>',
															'</thead>',
															'<tbody>',
															layoutBody,
															'</tbody>',
														'</table>'
														].join('');
		
													layout.html(body1);
	
													var vComment = "";
													if(idx == 0){
														vComment =  vEmployee.nickname +" " + vEmployee.title +"님의 일처리 능력은 (  )이다.";
													}else if(idx == 1){
														vComment =  vEmployee.nickname +" " + vEmployee.title +"님과 함께 일하는 것은 (  )이다.";
													}else if(idx == 2){
														vComment =  vEmployee.nickname +" " + vEmployee.title +"님의 리더십 스타일은 (  )이다.";
													}
													
													if(idx == 0 || idx == 1){
														commentBody = [
															'<tr>',
																'<td style="text-align:center;"  rowspan="4">', vComment , '</td>',
																'<td style="text-align:center">', "상사", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[idx].Description1 || '', '</td>',
																// '<td style="text-align:center">', onChangeComment(oData2[0].Description1).replace(/<p>- /g, "")|| '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀내)", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[idx].Description2 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀외)", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[idx].Description3 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "부하", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[idx].Description4 || '', '</td>',
															'</tr>'
														].join('');
		
														var body2 = [
															'<table style="width:100%;">',
																'<colgroup>',
																	'<col style="width:20%"/><col style="width:15%" /><col style="width:65%" />',
																'</colgroup>',
																'<thead>',
																	'<tr><th>설명</th><th>평가자</th><th>응답내용</th></tr>',
																'</thead>',
																'<tbody>',
																commentBody,
																'</tbody>',
															'</table>'
															].join('');
					
														comment.html(body2);	
													}else if(idx == 2){
														commentBody = [
															'<tr>',
																'<td style="text-align:center;"  rowspan="4">', vComment , '</td>',
																'<td style="text-align:center">', "상사", '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_1 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_2 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_3 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_4 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_5 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_6 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Description1 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀내)", '</td>',
																'<td style="text-align:center;">', oData2[idx].Score1_1 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score2_2 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score2_3 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score2_4 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score2_5 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score2_6 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Description2 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀외)", '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_1 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_2 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_3 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_4 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_5 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score3_6 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Description3 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "부하", '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_1 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_2 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_3 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_4 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_5 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Score4_6 || '', '</td>',
																'<td style="text-align:center;">', oData2[idx].Description4 || '', '</td>',
															'</tr>'
														].join('');
									
		
														var body2 = [
															'<table style="width:100%;">',
																'<colgroup>',
																	'<col style="width:18%"/><col style="width:12%" /><col style="width:7%" />'+
																	'<col style="width:7%"/><col style="width:7%" /><col style="width:7%" />'+
																	'<col style="width:7%"/><col style="width:7%" /><col style="width:28%" />'+
																'</colgroup>',
																'<thead>',
																	'<tr><th>설명</th><th>평가자</th><th>지시형</th><th>비전형</th><th>솔선형</th><th>친화형</th><th>육성형</th>'+
																	'<th>민주형</th><th>기타</th></tr>',
																'</thead>',
																'<tbody>',
																commentBody,
																'</tbody>',
															'</table>'
															].join('');
					
														comment.html(body2);
													}
													
												}
											}; 
	
											var id1 = "";
											var url5 = "/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=4)/competencies";
											$.getJSON({
												url: url5,
												async : false,
												success: function(d) {
													var data = d.d;
													
													if(data && data.results.length){
														id1 = data.results[0].itemId;
													}
													
												}.bind(this),
												error: function(jqXHR) {
													// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
												}.bind(this),
												complete: function() {
												
												}.bind(this)
											});
											
											if(id1 != ""){
												var promise2 = [], description1 = [];
												for(var i=0; i<rater.length; i++){
													var url6 = "/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id1 + "L,sectionIndex=4)/othersRatingComment";
													promise2.push(
														new Promise(function(resolve, reject){
															$.getJSON({
																url: url6,
																success: function(d) {
																	var data = d.d;
																	
																	if(data.results && data.results.length > 0){
																		description1.push({
																			formContentId : data.results[0].formContentId,
																			comment : onChangeComment(data.results[0].comment)
																		});
																	}
																	resolve();
																}.bind(this),
																error: function(jqXHR) {
																	// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
																}.bind(this),
																complete: function() {
																	// this.spinner(false);
																}.bind(this)
															});
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
													});
												});
											}
											
											// 3. 보완점
											var id2 = "";
											var url7 = "/odata/fix/FormCompetencySection(formDataId=" + formDataId + "L,formContentId=" + formContentId[formContentId.length-1] + "L,sectionIndex=5)/competencies";
											$.getJSON({
												url: url7,
												async : false,
												success: function(d) {
													var data = d.d;
													
													if(data && data.results.length){
														id2 = data.results[0].itemId;
													}
												}.bind(this),
												error: function(jqXHR) {
													// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
												}.bind(this),
												complete: function() {
													
												}.bind(this)
											});
											
											if(id2 != ""){
												var promise3 = [], description2 = [];
												for(var i=0; i<rater.length; i++){
													var url6 = "/odata/fix/FormCompetency(formDataId=" + formDataId + "L,formContentId=" + rater[i].formContentId + "L,itemId=" + id1 + "L,sectionIndex=4)/othersRatingComment";
													promise3.push(
														new Promise(function(resolve, reject){
															$.getJSON({
																url: url6,
																success: function(d) {
																	var data = d.d;
																	
																	if(data.results && data.results.length > 0){
																		description2.push({
																			formContentId : data.results[0].formContentId,
																			comment : onChangeComment(data.results[0].comment)
																		});
																	}
																	resolve();
																	
																}.bind(this),
																error: function(jqXHR) {
																	// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
																}.bind(this),
																complete: function() {
																	// this.spinner(false);
																}.bind(this)
															});
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
	
	
														console.log("rating");
														console.log(rating);
	
														make360Table($('#job_layout'), $('#job_comment'), 0 );
														make360Table($('#cooperation_layout'), $('#cooperation_comment'), 1 );
														if(oData2[0].section2 == "X"){
															make360Table($('#leadership_layout'), $('#leadership_comment'), 2 );
														}
														
														// 강점/보완점 Table
														var totallayout = $('#totalcomment_layout'); 
														var totalBody = [
															'<tr>',
																'<td style="text-align:center">', "상사", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description1_1 || '', '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description1_2 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀내)", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description2_1 || '', '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description2_2 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "동료(팀외)", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description3_1 || '', '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description3_2 || '', '</td>',
															'</tr>',
															'<tr>',
																'<td style="text-align:center">', "부하", '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description4_1 || '', '</td>',
																'<td style="text-align:left; padding-left:10px;">', oData2[3].Description4_2 || '', '</td>',
															'</tr>'
														].join('');
	
														var totalBody2 = [
															'<table style="width:100%;">',
																'<colgroup>',
																	'<col style="width:20%"/><col style="width:40%" /><col style="width:40%" />',
																'</colgroup>',
																'<thead>',
																	'<tr><th>평가자</th><th>강점</th><th>보완점</th></tr>',
																'</thead>',
																'<tbody>',
																totalBody,
																'</tbody>',
															'</table>'
															].join('');
					
														totallayout.html(totalBody2);
														that.spinner(false);
													});
												}).bind(this);
											}
										});
											
									});
										
									}.bind(this),
									error: function(jqXHR) {
										// this.spinner(false);
										// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
									}.bind(this),
									complete: function() {
										// this.spinner(false);
										// this.spinner(false);
									}.bind(this)
								});
		
							}.bind(this),
							error: function(jqXHR) {
								// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
							}.bind(this),
							complete: function() {
								// this.spinner(false);
							}.bind(this)
						});	
					}.bind(this),
					error: function(jqXHR) {
						// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
					}.bind(this),
					complete: function() {
		
					}.bind(this)
				});
			}.bind(this),
			error: function(jqXHR) {
				// this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
			}.bind(this),
			complete: function() {

			}.bind(this)
		});
	
	}
});