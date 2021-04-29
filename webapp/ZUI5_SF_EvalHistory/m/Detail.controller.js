sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "Detail",

			oModel: new JSONModelHelper(),

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow
					}, this);
			},

			onBeforeShow: function (oEvent) {
				console.log(oEvent.data);
				if (oEvent) {
					this.oModel.setProperty("/Appye", oEvent.data.Appye);
					this.oModel.setProperty("/Pernr", oEvent.data.Pernr);
					this.load(oEvent.data);
				}
			},

			navBack: function() {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
						});
					}
				).then(function () {
					BusyIndicator.hide();
				});
			},

			load: function(vdata) {
				BusyIndicator.show(0);
				Promise.all([
					Common.getPromise(
						function () {
							$.app.getModel("ZHR_APPRAISAL_SRV").create(
								"/EvaResultAgreeSet",
								{
									IConType: "3",
									IAppye: this.oModel.getProperty("/Appye"),
									IEmpid: this.getSessionInfoByKey("Pernr"),
									NoCheckPeriod:"X",
									TableIn2: []
								},
								{
									success: function (data) {
										if (data.TableIn2) {
											this.oModel.setProperty("/TableIn2", data.TableIn2.results);
										}
									}.bind(this),
									error: function (res) {
										Common.log(res);
									}
								}
							);
						}.bind(this)
					),
					Common.getPromise(
						function () {
							$.app.getModel("ZHR_APPRAISAL_SRV").create(
								"/EvaResultAgreeSet",
								{
									IConType: "2",
									IAppye: this.oModel.getProperty("/Appye"),
									IEmpid: this.getSessionInfoByKey("Pernr"),
									NoCheckPeriod:"X",
									TableIn: []
								},
								{
									success: function (data) {
										if (data.TableIn) {
											this.oModel.setProperty("/TableIn", data.TableIn.results);
											this.renderHeader.call(this);
										}
									}.bind(this),
									error: function (res) {
										Common.log(res);
										var errData = Common.parseError(res);
										if(errData.Error && errData.Error === "E") {
											MessageBox.error(errData.ErrorMessage, {
												title: this.getBundleText("LABEL_09029")
											});
										}
									}.bind(this)
								}
							);
						}.bind(this)
					)
				]).then(function () {
					this.getTemplateSCP.call(this,vdata);
					this.getCapaData.call(this);
					BusyIndicator.hide();
				}.bind(this));
			},

			getCapaData : function(){
				var oController=this;
				var oChart = sap.ui.getCore().byId(this.PAGEID + "_Chart");
				var oJSONModel2 = this.oModel;
				var vData2 = {Data2 : []};
				
				// 역량평가 점수 초기화
				oJSONModel2.setProperty("/Data2",null);
				
				// 역량평가 결과
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				var createData = {CompResultsNav : []};
					createData.Pernr = this.oModel.getProperty("/Data/Pernr");
					createData.Appye = this.oModel.getProperty("/Data/Appye");
				
				oModel.create("/CompResultsSet", createData, {
					success: function(data,res){
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
					error: function (oError) {
						var Err = {};
						this.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) this.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else this.ErrorMessage = Err.error.message.value;
						} else {
							this.ErrorMessage = oError.toString();
						}
					}
				});
				
				oJSONModel2.setProperty("/Data2",vData2.Data2);
				
				if(this.Error == "E"){
					this.Error = "";
					sap.m.MessageBox.error(this.ErrorMessage);
					return;
				}
			},

			getTemplateSCP : function(evData){
				var oController=this;
				var eData=evData;
				/** 목표 조회
					개발(g110bc197) : 2019년 데이터가 없으므로 2020년부터 1로 계산하여 Entity명 생성
					QA, 운영 : 2019년부터 1로 계산하여 Entity명 생성 **/
				var _sucHandler=function(data){
					oController.buildDetails.call(oController,data,eData);
				};
				new JSONModelHelper().url("/odata/fix/GoalPlanTemplate?$select=id,name&$format=json")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
								var data=this.getData().d;
								if(data&&data.results.length){								
									_sucHandler(data);// 연도와 동일한 목표만 테이블에 넣어준다.
								}
							 }).attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 	 return;
								 } else {
								 	 sap.m.MessageBox.error(error);
								 	 return;
								 }
							 }).load();
			},

			buildDetails : function(datas,data2){
				var Appye=data2.Appye;
				var sDatas=datas.results;
				var eArray=new Array();
				sDatas.forEach(function(e){
					if(e.name.split(" ")[0]==Appye){
						eArray.push(e.id);
					}
				});
				this.callOData.call(this,eArray,data2);
			},

			makeFormContent: function(datas,data2){
				var oController=this;
				// 1차평가 결과
				var _sucHandler=function(data){
					var vData = oController.oModel.getProperty("/Data");
					if(data && data.results.length){
						var result = data.results[0].pmReviewContentDetail.results[0].objectiveSections.results[0].objectives.results;
						if(result && result.length){
							for(var i=0; i<vData.length; i++){
								for(var j=0; j<result.length; j++){
									if(vData[i].id == result[j].itemId){
										oController.oModel.setProperty("/Data/" + i + "/rating", result[j].officialRating.rating);
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
											oController.oModel.setProperty("/Data/Comment2", comment2[j].comment);
										}
									}
								} else if(data.results[0].pmReviewContentDetail.results[0].customSections.results[i].sectionName == "업적평가 의견"){
									// 업적평가 1차 평가자 의견
									var comment1 = data.results[0].pmReviewContentDetail.results[0].customSections.results[i].othersRatingComment.results;
									for(var j=0; j<comment1.length; j++){
										if(comment1[j].commentLabel == "평가자 의견" || comment1[j].commentLabel == "Manager's Comments"){
											oController.oModel.setProperty("/Data/Comment1", comment1[j].comment);
										}
									}
								}
							}
						}
					}
					vData.forEach(function(e,i){
						oController.oModel.setProperty("/Data/"+i+"/Idx",parseInt(i)+1);
					});
				};
				new JSONModelHelper().url("/odata/fix/FormContent?$filter=formDataId eq " + datas[0].formLastContent.formDataId + "L and formContentId eq " + datas[0].formLastContent.formContentId + "L")
							 //.expand("pmReviewContentDetail/competencySections/competencies/officialRating") // 역량평가 점수
							 .expand("pmReviewContentDetail/competencySections/competencies/othersRatingComment") // 역량평가 본인평가 점수
							 .expand("pmReviewContentDetail/objectiveSections/objectives/officialRating") // 1차평가 결과
							 .expand("pmReviewContentDetail/customSections/othersRatingComment") // 종합의견
							 .attachRequestCompleted(function(){
								var data = this.getData().d;
								_sucHandler(data);
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

			makeMBOTable : function(datas,data2){
				var oController=this;
				var _sucHandler2=function(adata){
					oController.makeFormContent.call(oController,adata,data2);
				};

				var _sucHandler=function(data){
					new JSONModelHelper().url("/odata/fix/FormHeader")
							 .select("currentStep")
							 .select("formDataId")
							 .select("formDataStatus")
							 .select("formLastContent")
							 .expand("formLastContent")
							 .filter("formTemplateId eq '"+data.formTemplateId+"' and formDataStatus ne 4 and formSubjectId in "+data2.Pernr)
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var adata = this.getData().d;									
									if(adata && adata.results.length){
										_sucHandler2(adata.results);
									}
							 })
							 .attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 } else {
								 	 sap.m.MessageBox.error(error);
								 }
							 }).load();
				};
				
				new JSONModelHelper().url("/odata/fix/FormTemplate")
									.filter("formTemplateName like '"+data2.Appye+"년 업적%' and formTemplateType eq 'Review'")
									.setAsync(false)
									.attachRequestCompleted(function(){
											var data = this.getData().d;											
											if(data && data.results.length){
												_sucHandler(data.results[0]);
											}
									})
									.attachRequestFailed(function(error) {
										if(error.getParameters() && error.getParameters().message == "error"){
											var message = JSON.parse(error.getParameters().responseText).error.message.value;
											sap.m.MessageBox.error(message);
										} else {
											sap.m.MessageBox.error(error);
										}
									}).load();				
			},

			callOData : function(datas,data2){
				var oController=this;
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_MBOTable");
				var vData = {Data : []};
				var goal = [], id = "";
				var _sucHandler=function(data){
					oController.makeMBOTable.call(oController,data,data2);
				};
				new JSONModelHelper().url("/odata/fix/Goal_"+datas[0]+"?$filter=userId%20eq%20%27"+data2.Pernr+"%27")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
								var data=this.getData().d;
								if(data&&data.results.length){									
									_sucHandler(data);
								}
								data.results.forEach(function(e){
									goal.push(e);									
								});	
							 }).attachRequestFailed(function(error) {
								 if(error.getParameters() && error.getParameters().message == "error"){
								 	 var message = JSON.parse(error.getParameters().responseText).error.message.value;
								 	 sap.m.MessageBox.error(message);
								 	 return;
								 } else {
								 	 sap.m.MessageBox.error(error);
								 	 return;
								 }
							 }).load();							 

				if(oTable){
					this.oModel.setProperty("/Data",goal);
				}
			},

			renderHeader : function(){
				var oController=this;
				var l=sap.ui.commons.layout;
				var oRow,oCell,oMat=$.app.byId(this.PAGEID+"_Mat"),HBox;
				var oArr=new Array();
				var oData=this.oModel.getProperty("/TableIn")[0];
				var oData2=this.oModel.getProperty("/TableIn2")[0];		
				oMat.removeAllRows();
				
				oRow=new l.MatrixLayoutRow({height:"40px"});
				oCell=new l.MatrixLayoutCell({
					colSpan:2,
					content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+this.getBundleText("LABEL_07326")+"</span>"})
				});
				oRow.addCell(oCell);
				oMat.addRow(oRow);
				if(oData.Evstatustx!=""){
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07312")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Evstaustx}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData.Appye!=""){
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07313")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Appye}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn01=="X"){ //업적
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07314")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Pepnt}"
							})
						]
					});
					oArr.push(HBox);
					$.app.byId(oController.PAGEID+"_Panel1").setVisible(true);
				}else{
					$.app.byId(oController.PAGEID+"_Panel1").setVisible(false);
				}
				if(oData2.Btn02=="X"){ //역량
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07315")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Cepnt}"
							})
						]
					});
					oArr.push(HBox);
					$.app.byId(oController.PAGEID+"_Panel2").setVisible(true);
				}else{
					$.app.byId(oController.PAGEID+"_Panel2").setVisible(false);
				}
				if(oData2.Btn03=="X"){ //다면
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07316")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn04=="X"){ //1차
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07317")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn05=="X"){ //2차
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07318")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn06=="X"){ //종합
					HBox=new sap.m.HBox({
						width:"100%",
						items : [
							new sap.m.Label({
								textAlign:"Center",
								width:"80px",
								text:this.getBundleText("LABEL_07319")
							}),
							new sap.m.Label({
								textAlign:"Center",
								width:"90px",
								text:"{Cograde}"
							})
						]
					});
					oArr.push(HBox);
				}
				oData2.Btn07=="X"?$.app.byId(oController.PAGEID+"_Panel3").setVisible(true):$.app.byId(oController.PAGEID+"_Panel3").setVisible(false);
				oData2.Btn08=="X"?$.app.byId(oController.PAGEID+"_Panel4").setVisible(true):$.app.byId(oController.PAGEID+"_Panel4").setVisible(false);
				oArr.forEach(function(e,i){
					if(i%2==0){
						oRow=new l.MatrixLayoutRow();
						oCell=new l.MatrixLayoutCell({
							content:e,
							hAlign:"Center"
						});
						oRow.addCell(oCell);
						oMat.addRow(oRow);
					}else{
						oCell=new l.MatrixLayoutCell({
							content:e,
							hAlign:"Center"
						});
						oRow.addCell(oCell);
					}
				});
				oMat.bindElement("/TableIn/0");
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);