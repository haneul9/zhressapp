sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		CostModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),

		g_IsNew: "",
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs3;
        },
		
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
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.DetailModel.setData({FormData: []});
			this.onTableSearch();
			this.onInitData(this);
        },

		onInitData: function(oController) {
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData) {
					var LogData = oData.NewPostExport.results[0];
					oController.LogModel.setData({LogData: LogData});

					if(LogData.EClose === "X"){
						sap.m.MessageBox.alert(oController.getBundleText("MSG_00072"), { title: oController.getBundleText("MSG_08107")});
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onPressSer: function() {
			this.onTableSearch();
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "1";
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
			// Navigation property
			sendObject.NewPostTableIn1 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rDatas1 = oData.NewPostTableIn1.results;
						oController.TableModel.setData({Data: rDatas1}); 
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
        },

		getLocationCost: function() {
			return new sap.ui.commons.TextView({
				textAlign: "Center",
				text: {
					path: "Ztstot",
					formatter: function(v) {
						if (v == null || v == "") return "";
						return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}
				}
			});
		},
        
        getRelocation: function() {

            return new sap.m.Text({
                text: {
                    parts: [{ path: "ZfwkpsT" }, { path: "ZtwkpsT" }],
                    formatter: function(v1, v2) {
                        if(v1) return v1 + " ??? " + v2;
                        else return "";
                    }
                }
            });
        },

        getStatus: function() {
            var oController = $.app.getController();

            return 	new sap.m.FlexBox({
                justifyContent: "Center",
                items: [
                    new sap.ui.commons.TextView({
                        text : "{StatusT}", 
                        textAlign : "Center",
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal !== "AA") return true;
                                else return false;
                            }
                        }
                    })
                    .addStyleClass("font-14px font-regular mt-4px"),
                    new sap.m.FlexBox({
                        justifyContent: "Center",
                        items: [
                            new sap.ui.commons.TextView({ //??????????????? Text
                                text : "{StatusT}", 
                                textAlign : "Center"
                            })
                            .addStyleClass("font-14px font-regular mt-7px"),
                            new sap.m.Button({ //??????????????? ?????? ??????
                                text: "{i18n>LABEL_29027}",
                                press : oController.onPressCancel
                            })
                            .addStyleClass("button-light-sm ml-10px")
                        ],
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal === "AA") return true;
                                else return false;
                            }
                        }
                    })
                ]
            });
        },
		
		onPressReq: function() { //??????
			var oView = $.app.byId("ZUI5_HR_RelocationFee.Page");
			this.g_IsNew = "N";

			if (!this._DetailModel) {
				this._DetailModel = sap.ui.jsfragment("ZUI5_HR_RelocationFee.fragment.Apply", this);
				oView.addDependent(this._DetailModel);
			}
			
			this._DetailModel.open();
			this._DetailModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileBox").setBusyIndicatorDelay(0).setBusy(true);
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_RelocationFee.Page");
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = this.TableModel.getProperty(vPath);
            oRowData = $.extend(true, {}, oRowData);
			this.DetailModel.setProperty("/FormData", oRowData);
			this.g_IsNew = "D";

			if (!this._DetailModel) {
				this._DetailModel = sap.ui.jsfragment("ZUI5_HR_RelocationFee.fragment.Apply", this);
				oView.addDependent(this._DetailModel);
			}

			this._DetailModel.open();
			this._DetailModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileBox").setBusyIndicatorDelay(0).setBusy(true);
		},

		onBeforeDialog: function() {
			this.CostModel.setData({Data: []});
			if(this.g_IsNew === "N") {

				this.DetailModel.setProperty("/FormData", {});
				this.DetailModel.setProperty("/Bukrs", this.getUserGubun());
			}else {
				var oRowData = this.DetailModel.getProperty("/FormData");

				this.DetailModel.setProperty("/Bukrs", oRowData.Bukrs); 
				this.CostModel.setData({Data: [oRowData]});
			}
		},

		onAfterDialog: function() {
			var IsNew = this.g_IsNew;

			Common.getPromise(
				function () {
					this.getTableMakeColums();

					if(IsNew === "N") {
						this.getLocationList();
						this.DetailModel.setProperty("/FormData/Zfwkps","CheckNull");
						this.DetailModel.setProperty("/FormData/Ztwkps","CheckNull");
					}else if(IsNew === "D") {
						var oRowData = this.DetailModel.getProperty("/FormData");

						this.getLocationList(oRowData);
						this.getCriteria();
					}
				}.bind(this)
			).then(
				function () {
					this._DetailModel.setBusy(false);
				}.bind(this)
			);

			Common.getPromise(
				function () {
					this.onBeforeOpenDetailDialog();
				}.bind(this)
			).then(
				function () {
					$.app.byId(this.PAGEID + "_FileBox").setBusyIndicatorDelay(0).setBusy(false);
				}.bind(this)
			);
		},

		getTableMakeColums: function() {
			var oController = $.app.getController();
			var oMidTable = $.app.byId(oController.PAGEID + "_MidTable");
			var oMidTable2 = $.app.byId(oController.PAGEID + "_MidTable2");

			if(oController.DetailModel.getProperty("/Bukrs") !== "A100") {
				oMidTable.setVisible(true);
				oMidTable2.setVisible(false);
			}else {
				oMidTable.setVisible(false);
				oMidTable2.setVisible(true);
			}
		},
		
		getLocationList: function(oRowData) {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRadioHBox = $.app.byId(oController.PAGEID + "_CheckHBox");
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			
			if(oRowData && oRowData.ZwtfmlT === oController.getBundleText("LABEL_34009")) 
				oRadioHBox.setVisible(true);
			else
				oRadioHBox.setVisible(false);
			
			if(oRowData)
				oRadioGroup.setSelectedIndex(parseInt(oRowData.Zwtfml) - 1);
			else
				oRadioGroup.setSelectedIndex(0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			sendObject.NewPostTableIn3 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData) {
					if (oData && oData.NewPostTableIn3) {
						Common.log(oData);
						oData.NewPostTableIn3.results.unshift({ Subtx1: oController.getBundleText("LABEL_00181"), Subcd: "CheckNull"});

						oController.DetailModel.setProperty("/LocationCombo1",oData.NewPostTableIn3.results);
						oController.DetailModel.setProperty("/LocationCombo2",oData.NewPostTableIn3.results);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		checkLocation1: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation2: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation: function(oEvent) { // ????????? Check
			var oController = $.app.getController();
			var oLocation1 = $.app.byId(oController.PAGEID + "_LocationCombo1");
			var oLocation2 = $.app.byId(oController.PAGEID + "_LocationCombo2");

			if(oLocation2.getSelectedKey() === "CheckNull" || oLocation1.getSelectedKey() === "CheckNull") return;

			if(oLocation1.getSelectedKey() === oLocation2.getSelectedKey()) {
				sap.m.MessageBox.alert(oController.getBundleText("MSG_34002"), {
					title: oController.getBundleText("LABEL_00149")
				});
				oEvent.getSource().setSelectedKey("CheckNull");
				return;
			}

			oController.getCost();
		},
		
		getCriteria: function(oEvent) { //???????????? ??????
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var sendObject = {};
			
			if(oEvent) {
				// Header
				sendObject.Pernr = vPernr;
				sendObject.Datum = moment(oController.DetailModel.getProperty("/FormData/Zactdt")).hours(10).toDate();
				// Navigation property
				sendObject.BukrsExport = [];
				
				oModel.create("/BukrsImportSet", sendObject, { // ??????????????? ?????? Bukrs
					success: function(oData) {
						if (oData && oData.BukrsExport) {
							Common.log(oData);
							oController.DetailModel.setProperty("/Bukrs", oData.BukrsExport.results[0].Bukrs); 
							oController.getTableMakeColums();
							oController.getCost();
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
            sendObject.IZactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData) {
					if (oData && oData.NewPostExport) {
						Common.log(oData);
						oController.DetailModel.setProperty("/CriAge",oData.NewPostExport.results[0].EDate); 
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});

		},

		onChangeRadio: function(oEvent) {
			var oController = this;
			var oRadioHBox = $.app.byId(oController.PAGEID + "_CheckHBox");
			var vPath = oEvent.getSource().getBindingContext().getPath();

			if(oEvent.mParameters.selectedIndex === 0)
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "1");
			else
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "2");

			if(oEvent.getSource().getSelectedButton().getText() === oController.getBundleText("LABEL_34009")){
				oRadioHBox.setVisible(true);
			}else{
				oRadioHBox.setVisible(false);
			}

			oController.getCost();
		},

		getCostSum1: function(oEvent) { // 6????????? input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zolda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		getCostSum2: function(oEvent) { // 6????????? input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zunda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		inputCost: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				value: {
					path: "Zmvcst",
					formatter: function(v) {
						if(v) return Common.numberWithCommas(v);
						else return ;
					}
				},
				maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zmvcst", false),
				liveChange: oController.InputTransCost.bind(oController),
				textAlign: "End",
				editable: {
					path: "Status",
					formatter: function(v) {
						if(v === "AA" || !v) return true;
						else return false; 
					}
				}
			});
		},

		inputCost2: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				value: {
					path: "Ztexme",
					formatter: function(v) {
						if(v) return Common.numberWithCommas(v);
						else return ;
					}
				},
				maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Ztexme", false),
				liveChange: oController.InputTransCost2.bind(oController),
				textAlign: "End",
				editable: {
					path: "Status",
					formatter: function(v) {
						if(v === "AA" || !v) return true;
						else return false; 
					}
				}
			});
		},

		InputTransCost: function(oEvent) { // ??????????????? input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');
	
			if(parseInt(convertValue) > parseInt(oController.LogModel.getProperty("/LogData/EAmt"))) {
				var vMsg = oController.getBundleText("MSG_34015");
				vMsg = vMsg.replace("{Money}", Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).split(Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).slice(-4))[0]);

				oController.CostModel.setProperty("/Data/0/Zmvcst", oController.CostModel.getProperty("/Data/0/Zmvcst"));
				oEvent.getSource().setValue(Common.numberWithCommas(oController.CostModel.getProperty("/Data/0/Zmvcst")));
				
				return MessageBox.error(vMsg, { title: oController.getBundleText("LABEL_00149")});
			}

			oController.CostModel.setProperty("/Data/0/Zmvcst", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		InputTransCost2: function(oEvent) { // ?????? input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');
	
			oController.CostModel.setProperty("/Data/0/Ztexme", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		getCostSum: function() { // ??????
			var oController = $.app.getController();
			var vZtexme = oController.CostModel.getProperty("/Data/0/Ztexme") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexme")) : 0, // ?????? ??????
				vZtexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexo6")) : 0, // 6????????? ??????
				vZtexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexu6")) : 0, // 6????????? ??????
				vZdexme = oController.CostModel.getProperty("/Data/0/Zdexme") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexme")) : 0, // ?????? ??????
				vZdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexo6")) : 0, // 6????????? ??????
				vZdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexu6")) : 0, // 6????????? ??????
				vZtsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztsrsv")) : 0, // ???????????????
				vZmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? parseInt(oController.CostModel.getProperty("/Data/0/Zmvcst")) : 0, // ???????????????
				vZbkfee = oController.CostModel.getProperty("/Data/0/Zbkfee") ? parseInt(oController.CostModel.getProperty("/Data/0/Zbkfee")) : 0, // ?????? ?????????
				vZtstot = ""; // ??????

			vZtstot = vZtexme + vZtexo6 + vZtexu6 + vZdexme + vZdexo6 + vZdexu6 + vZtsrsv + vZmvcst + vZbkfee;
			oController.CostModel.setProperty("/Data/0/Ztstot", String(vZtstot));
		},

		getCost: function() { // ????????????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.DetailModel.getProperty("/Bukrs");
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			var oSendData = {};

			if(
				oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" ||
				oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull" ||
				Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))
			) 	return;

			if(oController.DetailModel.getProperty("/FormData/Zwtfml") === "2"){
				oSendData.Zolda6 = oController.DetailModel.getProperty("/FormData/Zolda6") ? oController.DetailModel.getProperty("/FormData/Zolda6") : "0"; // 6????????? ??????
				oSendData.Zunda6 = oController.DetailModel.getProperty("/FormData/Zunda6") ? oController.DetailModel.getProperty("/FormData/Zunda6") : "0"; // 6????????? ??????
			}

			oSendData.Zfwkps = oController.DetailModel.getProperty("/FormData/Zfwkps"); // ????????????
			oSendData.Ztwkps = oController.DetailModel.getProperty("/FormData/Ztwkps"); // ?????????
			oSendData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt")); // ????????????
			oSendData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0"; // ???????????????
			oSendData.Zwtfml = String(oRadioGroup.getSelectedIndex() + 1); // ??????????????????
			

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IGubun = "5";
			// Navigation property
			sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oSendData)];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rData = oData.NewPostTableIn1.results;
						rData[0].Zmvcst = oSendData.Zmvcst;
						
						if(vBukrs === "A100")
							rData[0].Ztexme = Common.checkNull(oController.CostModel.getProperty("/Data/0/Ztexme")) ? "0" : oController.CostModel.getProperty("/Data/0/Ztexme");

						oController.CostModel.setData({Data: rData});
						oController.getCostSum();
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		ApplyCheck: function() { // ????????? ??????
			var oController = $.app.getController();

			// ????????? Check
			if(oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" || oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull"){
				MessageBox.error(oController.getBundleText("MSG_34004"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// ???????????? Check
			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))){
				MessageBox.error(oController.getBundleText("MSG_34005"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// ???????????? ????????? ????????? Check
			if((oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")) &&
			  Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")))) ||
			  (oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (parseInt(oController.DetailModel.getProperty("/FormData/Zolda6")) === 0 &&
			  parseInt(oController.DetailModel.getProperty("/FormData/Zunda6")) === 0)))
			{
				MessageBox.error(oController.getBundleText("MSG_34006"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_34013"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

        onPressCancel: function(oEvent) { // Status??? ?????? ??????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oPath = oEvent.getSource().oParent.oParent.oParent.oBindingContexts.undefined.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34025")) { // ??????

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "4";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34012"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34011"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34025"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},
		
		onDialogApplyBtn: function() { // Dialog ??????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			oRowData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0"; // ???????????????
			oRowData.Ztexme = oController.CostModel.getProperty("/Data/0/Ztexme"); // ?????? (??????)
			oRowData.Ztexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6"); // ?????? (6??? ??????)
			oRowData.Ztexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6"); // ?????? (6??? ??????)
			oRowData.Zdexme = oController.CostModel.getProperty("/Data/0/Zdexme"); // ?????? (??????)
			oRowData.Zdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6"); // ?????? (6??? ??????)
			oRowData.Zdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6"); // ?????? (6??? ??????)
			oRowData.Ztsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv"); // ?????? ?????????
			oRowData.Ztstot = oController.CostModel.getProperty("/Data/0/Ztstot"); // ??????
			oRowData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0"; // 6????????? ??????
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0"; // 6????????? ??????
			}

			oRowData.Zwtfml = oRowData.Zwtfml ? oRowData.Zwtfml : "1"; // ???????????? Radio
			oRowData.Waers = "KRW";

			if(oController.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//?????? ????????? ???????????? ?????????
				if (fVal && fVal == oController.getBundleText("LABEL_34022")) { //??????

					// ???????????? ??????
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "3";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34008"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34007"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},

		onDialogSaveBtn: function() { // Dialog ??????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0"; // 6????????? ??????
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0"; // 6????????? ??????
			}
		
			oRowData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0"; // ???????????????
			oRowData.Ztexme = oController.CostModel.getProperty("/Data/0/Ztexme"); // ?????? (??????)
			oRowData.Ztexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6"); // ?????? (6??? ??????)
			oRowData.Ztexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6"); // ?????? (6??? ??????)
			oRowData.Zdexme = oController.CostModel.getProperty("/Data/0/Zdexme"); // ?????? (??????)
			oRowData.Zdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6"); // ?????? (6??? ??????)
			oRowData.Zdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6"); // ?????? (6??? ??????)
			oRowData.Ztsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv"); // ?????? ?????????
			oRowData.Ztstot = oController.CostModel.getProperty("/Data/0/Ztstot"); // ??????
			oRowData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));
			
			if(oController.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34026")) { //??????

					// ???????????? ??????
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "2";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34010"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34009"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34026"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // Dialog ??????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0"; // 6????????? ??????
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0"; // 6????????? ??????
			}

			oRowData.Zmvcst = oRowData.Zmvcst ? oRowData.Zmvcst : "0"; // ???????????????

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34025")) { // ??????

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "4";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34012"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34011"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34025"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
				vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";
			
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "10",
				Editable: (!vStatus || vStatus === "AA") ? true : false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20190204"}); // 20001008 20190204
		} : null
	});
});