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
					this.load();
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

			load: function() {
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
					BusyIndicator.hide();
				});
			},

			renderHeader : function(){
				var l=sap.ui.commons.layout;
				var oRow,oCell,oMat=$.app.byId(this.PAGEID+"_Mat"),HBox;
				var oArr=new Array();
				console.log(this.oModel.getProperty("/TableIn"));
				var oData=this.oModel.getProperty("/TableIn")[0];
				var oData2=this.oModel.getProperty("/TableIn2")[0];		
				oMat.removeAllRows();
				
				if(oData.Evstatustx!=""){
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07312")
							}),
							new sap.m.Text({
								text:"{Evstaustx}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData.Appye!=""){
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07313")
							}),
							new sap.m.Text({
								text:"{Appye}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn01=="X"){ //업적
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07314")
							}),
							new sap.m.Text({
								text:"{Pepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn02=="X"){ //역량
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07315")
							}),
							new sap.m.Text({
								text:"{Cepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn03=="X"){ //다면
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07316")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn04=="X"){ //1차
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07317")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn05=="X"){ //2차
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07318")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn06=="X"){ //종합
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07319")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn07=="X"){ //업적1차
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07324")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				if(oData2.Btn08=="X"){ //역량1차
					HBox=new sap.m.HBox({
						items : [
							new sap.m.Label({
								text:this.getBundleText("LABEL_07325")
							}),
							new sap.m.Text({
								text:"{Mepnt}"
							})
						]
					});
					oArr.push(HBox);
				}
				oArr.forEach(function(e,i){
					if(i%2==0){
						
					}
				});
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);