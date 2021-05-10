sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageToast, JSONModel) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",

			oModel: new JSONModel(),

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function () {
				this.oModel.setData({
					List: []
				});
			},

			onAfterShow: function () {
				this.search();
			},

			afterTable: function(datas){
				var oTable=$.app.byId("historyTable");
				if(datas.length){
					for(var i=0;i<datas.length;i++){
						var oItems=oTable.getItems();
						for(var j=0;j<oItems.length;j++){
							var oCells=oItems[j].getCells();
							if(oCells[0].getText()==datas[i].IAppye){
								if(datas[i].TableIn2.length==0){
									oCells[2].setText();
									oCells[3].setText();
									oCells[4].setText();
								}else{
									if(datas[i].TableIn2.results[0].Btn01==""){
										oCells[3].setText();
									}
									if(datas[i].TableIn2.results[0].Btn02==""){
										oCells[2].setText();
									}
									if(datas[i].TableIn2.results[0].Btn06==""){
										oCells[4].setText();
									}
								}
							}
						}
					}
				}
			},

			search: function() {
				BusyIndicator.show(0);
				var PromiseData=new Array();
				var Btns=new Array();
				var curr = new Date().getFullYear(); 
				var aAppye = [];
				for(var i=curr; i>=2020; i--){
					aAppye.push(String(i));
				}
				var _sucFunc = function(data){
					Btns.push(data);
				};
				aAppye.forEach(function(year) {
					PromiseData.push(
					Common.getPromise(
						function () {
							$.app.getModel("ZHR_APPRAISAL_SRV").create(
								"/EvaResultAgreeSet",
								{
									IConType: "3",
									IAppye: year,
									IEmpid: this.getSessionInfoByKey("Pernr"),
									TableIn2: []
								},
								{
									success: _sucFunc.bind(this),
									error: function (res) {
										Common.log(res);
									}
								}
							);
						}.bind(this)
					));
				}.bind(this));
				PromiseData.push(Common.getPromise(
					function () {
						$.app.getModel("ZHR_APPRAISAL_SRV").create(
							"/EvalResultsSet",
							{
								IEmpid: this.getSessionInfoByKey("Pernr"),
								IAppye: String(new Date().getFullYear()),
								IConType: "3",
								TableIn: []
							},
							{
								success: function (data) {
									if (data.TableIn) {
										this.oModel.setProperty("/List", data.TableIn.results);
										$.app.byId("historyTable").removeSelections();
									}
								}.bind(this),
								error: function (res) {
									Common.log(res);
								}
							}
						);
					}.bind(this)
				));
				Promise.all(PromiseData).then(function () {
					BusyIndicator.hide();
					this.afterTable.call(this,Btns);
				}.bind(this));
			},

			onPressResvRow: function(oEvent) {
				var oRowData = $.extend(true, {}, oEvent.getParameter("listItem").getBindingContext().getProperty());
				Common.log(oRowData);

				if(parseInt(oRowData.Appye) < 2020) {
					MessageToast.show(this.getBundleText("MSG_07010"));	// 2020년 이후만 조회할 수 있습니다.
					return;
				}

				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
							data : {
								Appye : oRowData.Appye,
								Pernr : oRowData.Pernr
							}
						});
					}
				).then(function () {
					BusyIndicator.hide();
				});
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null
		});
	}
);