sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox, JSONModel) {
	"use strict";

	return CommonController.extend($.app.APP_ID, { // 미취학

		PageModel: new JSONModelHelper(),
		TableModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		
		__selectedItem: null,

		onInit: function () {
			Common.log("onInit");

			this.setupView()
				.getView().addEventDelegate({
					onBeforeShow: this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
		},

		onBeforeShow: function() {
			this.initModels.call(this);
		},

		onAfterShow: function() {

			this.retrieveTable.call(this);
		},
		
		initModels: function() {
			this.PageModel.setData({});
			this.TableModel.setData({Data: []});
			this.DetailModel.setData({Data: {}});
		},

		retrieveTable: function() {
			var oPayload = {};
			
			this.initModels.call(this);
			
			// Header
			oPayload.IGubun = "L";
			oPayload.IPernr = this.getSessionInfoByKey("name");
			oPayload.IBukrs = this.getSessionInfoByKey("Bukrs2");
			
			// Navigation property
			oPayload.ChildExport = [];
			oPayload.ChildTableIn1 = [];
			oPayload.ChildTableIn2 = [];
			
			$.app.getModel("ZHR_BENEFIT_SRV").create("/ChildImportSet", oPayload, {
				success: function(data) {
					if(data.ChildExport) {
						this.PageModel.setData({ChildExport: data.ChildExport.results});
					}
					
					if(data.ChildTableIn2) {
						this.PageModel.setProperty("/ChildTableIn2", data.ChildTableIn2.results);
					}

					if(data.ChildTableIn1) {
						this.TableModel.setProperty("/Data", data.ChildTableIn1.results);

						Common.adjustVisibleRowCount($.app.byId("Table"), 10, data.ChildTableIn1.results.length);
					}
				}.bind(this),
				error: function(res) {
					var errData = Common.parseError(res);

					if(errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_00150")	// 확인
						});
						
						return;
					}
				}.bind(this)
			});
		},

		onPressDeleteBtn: function(oEvent) {
			var oRowObject = this.TableModel.getProperty(oEvent.getSource().getBindingContext().getPath());
			
			MessageBox.confirm(this.getBundleText("MSG_22009"), {	// 삭제하시겠습니까?
				title: this.getBundleText("LABEL_00150"),	// 확인
				actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				onClose: function(v) {
					if(v === sap.m.MessageBox.Action.OK) {
						this.DetailModel.setProperty("/Data", oRowObject);
			
						// 삭제
						this.callSaveProcess.call(this, "D");
					}
				}.bind(this)
			});
		},

		onPressReqBtn: function() {
			this.popupDetailDialog({}, true);
		},

		onPressRow: function(oEvent) {
			var oRowObject = this.TableModel.getProperty(oEvent.getSource().getBindingContext().getPath());
			
			this.popupDetailDialog(oRowObject, false);
		},

		onSelectedRow: function(oEvent) {
			var oRowObject = this.TableModel.getProperty(oEvent.getParameter("rowBindingContext").getPath());

			this.popupDetailDialog(oRowObject, false);
		},
		
		onDetailDialogAfter: function() {
			this.__selectedItem = $.app.byId("Zname").getSelectedItem();
		},

		redirect: function() {
			return parent._gateway.redirect("FamilyApply.html");
		},

		popupDetailDialog: function(detailData, isNew) {
			var oDetailData = { Data: $.extend(true, {}, detailData), ChildTableIn2: [] };

			if (!this._DetailDialog) {
				this._DetailDialog = sap.ui.jsfragment("ZUI5_HR_PreschoolersAllowance.fragment.PreschoolersAllowanceDetail", this);
				$.app.getView().addDependent(this._DetailDialog);
			}

			// Set dialog height
			this._DetailDialog.setContentHeight(isNew ? "410px" : "510px");

			// Set data
			if(isNew) oDetailData.Data.Begda = new Date();	// 신청일
			oDetailData.Data.Dtfmt = this.getSessionInfoByKey("Dtfmt");
			oDetailData.ChildTableIn2 = this.PageModel.getProperty("/ChildTableIn2");

			// Display control
			oDetailData.Data.isNew = isNew;

			this.DetailModel.setData(oDetailData);
			this._DetailDialog.open();
		},

		onChangeZname: function(oEvent) {
			var that = this,
				oSource = oEvent.getSource(),
				vSelectedItem = oSource.getSelectedItem(),
				oPayload = {},
				oDetailData = $.extend(true, {}, this.DetailModel.getProperty("/Data"));
			
			// Header
			oPayload.IGubun = "L";
			oPayload.IPernr = this.getSessionInfoByKey("name");
			oPayload.IBukrs = this.getSessionInfoByKey("Bukrs2");
			oPayload.IZname = oEvent.getSource().getSelectedKey();
			
			// Navigation property
			oPayload.ChildExport = [];
			oPayload.ChildTableIn1 = [];
			oPayload.ChildTableIn2 = [];
			
			$.app.getModel("ZHR_BENEFIT_SRV").create("/ChildImportSet", oPayload, {
				success: function(data) {
					if(data.ChildTableIn1) {
						if(oDetailData.isNew === true) {	// 신규
							oDetailData = $.extend(true, oDetailData, data.ChildTableIn1.results[0]);
						} else {	// 수정
							oDetailData.Fgbdt = data.ChildTableIn1.results[0].Fgbdt;
							oDetailData.Kdsvh = data.ChildTableIn1.results[0].Kdsvh;
							oDetailData.Objps = data.ChildTableIn1.results[0].Objps;
							oDetailData.Pernr = data.ChildTableIn1.results[0].Pernr;
							oDetailData.Waers = data.ChildTableIn1.results[0].Waers;
							oDetailData.Begda = data.ChildTableIn1.results[0].Begda;
							oDetailData.Endda = data.ChildTableIn1.results[0].Endda;
							oDetailData.Zbegym = data.ChildTableIn1.results[0].Zbegym;
							oDetailData.Zendym = data.ChildTableIn1.results[0].Zendym;
							oDetailData.Zpaymm = data.ChildTableIn1.results[0].Zpaymm;
							oDetailData.Zpaytt = data.ChildTableIn1.results[0].Zpaytt;
							oDetailData.Notes = data.ChildTableIn1.results[0].Notes;
						}

						this.DetailModel.setProperty("/Data", oDetailData);
					}
					
					this.__selectedItem = vSelectedItem;
				}.bind(this),
				error: function(res) {
					var errData = Common.parseError(res);

					if(errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_00150"),	// 확인
							onClose: function() {
								// 이전 값 유지
								oSource.setSelectedItem(that.__selectedItem);
							}
						});
						
						return;
					}
				}.bind(this)
			});
		},

		onPressRequestCompleteBtn: function() {
			MessageBox.confirm(this.getBundleText("MSG_22005"), {	// 신청하시겠습니까?
				title: this.getBundleText("LABEL_00150"),	// 확인
				actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				onClose: function(v) {
					if(v === sap.m.MessageBox.Action.OK) {
						// 저장
						this.callSaveProcess.call(this, "C");
					}
				}.bind(this)
			});
		},
		
		onPressModifyCompleteBtn: function() {
			MessageBox.confirm(this.getBundleText("MSG_22008"), {	// 저장하시겠습니까?
				title: this.getBundleText("LABEL_00150"),	// 확인
				actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				onClose: function(v) {
					if(v === sap.m.MessageBox.Action.OK) {
						// 저장
						this.callSaveProcess.call(this, "S");
					}
				}.bind(this)
			});
		},
		
		onPressModifyDeleteBtn: function() {
			MessageBox.confirm(this.getBundleText("MSG_22009"), {	// 삭제하시겠습니까?
				title: this.getBundleText("LABEL_00150"),	// 확인
				actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				onClose: function(v) {
					if(v === sap.m.MessageBox.Action.OK) {
						// 삭제
						this.callSaveProcess.call(this, "D");
					}
				}.bind(this)
			});
		},

		// vGubun C:신청, S:저장, D:삭제
		callSaveProcess: function(vGubun) {
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV"),
				oPayload = {},
				oDetailData = this.DetailModel.getProperty("/Data"),
				vCompleteMessage = (vGubun.toUpperCase() === "C") ? this.getBundleText("MSG_22004") 
									: (vGubun.toUpperCase() === "S") ? this.getBundleText("MSG_22006")
									: (vGubun.toUpperCase() === "D") ? this.getBundleText("MSG_22007") : "";

			if(!oDetailData.Fgbdt) {
				MessageBox.error(this.getBundleText("MSG_22003"), {title : this.getBundleText("LABEL_00149")});	// 자녀를 선택해주세요.
				return false;
			}

			BusyIndicator.show(0);

			// Header
			oPayload.IGubun = vGubun;
			oPayload.IPernr = this.getSessionInfoByKey("name");
			oPayload.IBukrs = this.getSessionInfoByKey("Bukrs2");
			oPayload.IZname = oDetailData.Zname;
			
			// Navigation property
			oPayload.ChildTableIn1 = [
				Common.copyByMetadata(oModel, "ChildTableIn1", oDetailData)
			];

			oModel.create("/ChildImportSet", oPayload, {
				async: true,
				success: function(data) {
					if(data) {
						MessageBox.success(vCompleteMessage, {
							title : this.getBundleText("LABEL_00150"),	// 확인
							onClose : function() {
								this.retrieveTable.call(this);
								if(this._DetailDialog.isOpen() === true) this._DetailDialog.close();
							}.bind(this)
						});

						BusyIndicator.hide();
					}
				}.bind(this),
				error: function(res) {
					var errData = Common.parseError(res);

					if(errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_00150")	// 확인
						});
					}

					BusyIndicator.hide();
				}.bind(this)
			});
		},

		getStatus: function(columnInfo, oController) {
			return new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.Center,
				alignItems: sap.m.FlexAlignItems.Center,
				items: [
					new sap.ui.commons.TextView({
						text: "{StatusT}",
						textAlign: "Center"
					}).addStyleClass("font-14px mt-3px"),
					new sap.m.Button({
						text: "{i18n>LABEL_00103}",	// 삭제
						press: oController.onPressDeleteBtn.bind(oController),
						visible: {
							path: "Status",
							formatter: function(v) { 
								if(v === "AA") return true;
								else return false;
							}
						}
					}).addStyleClass("ml-5px")
				]
			});
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModel({name: "20140013"});
		} : null

	});

});