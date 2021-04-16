sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates",
	"../common/HoverIcon",
	"sap/m/InputBase"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates, HoverIcon, InputBase) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		RegistModel: new JSONModelHelper(),
		CommentModel: new JSONModelHelper(),
		PWordModel: new JSONModelHelper(),

		g_CGubun: "", 			// 댓글상세 수정/삭제 구분
		g_Pword: "",			// 톡톡 글의 수정/삭제 구분
		g_Input: "",			// 댓글 내용Input
		g_HiInputPword: "",		// 댓글 수정시 비밀번호 입력 Input
		g_HiPword: "",			// 해당 댓글의 비밀번호 Text
		g_HiSeqnr2: "",			// 해당 댓글의 시퀀스번호 Text
		g_HiBox: "",			// 해당 댓글의 비밀번호 HBox
		g_SaveBtn: "",			// 해당 댓글의 저장 Btn 
		g_ReBtn: "",			// 해당 댓글의 수정 Btn
		g_CanBtn: "",			// 해당 댓글의 취소 Btn
		g_ReCommBtn: "",		// 해당 댓글의 대댓글 Btn
		g_ReDetail: "",			// 해당 대댓글의 신규작성시 내용
		g_RePwordInput: "",		// 해당 대댓글의 비밀번호 Input
		g_ReSaveBtn: "",		// 해당 대댓글의 저장 Btn
		g_ReWritBtn: "",		// 해당 대댓글의 수정 Btn
		g_ReCanBtn: "",			// 해당 대댓글의 취소 Btn


		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs2");
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
			this.onTableSearch();

			if(Common.checkNull(!this.getParameterByName("Sdate")) && Common.checkNull(!this.getParameterByName("Skey")))
				this.onSelectDetail(false);
        },

		getParameterByName: function(name) {
			var regex = parent._gateway.parameter(name);
			
			return Common.checkNull(regex)? "" : regex;
		},

        getChangeDate: function() {
			return new sap.ui.commons.TextView({
                text : {
                    parts: [{path: "Aedtm"}, {path: "Aetim"}],
                    formatter: function(v1, v2) {
						if(v1 && v2){
							v1 = Common.DateFormatter(v1);
							v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
						}
						return v1 + " " + v2; 
                    }
                }, 
                textAlign : "Center"
            });
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
            var oSearchInput = $.app.byId(oController.PAGEID + "_SearchInput");
            var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

            oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IApern = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IGubun = "E";
            sendObject.IConType = "0";
			sendObject.IBegda = Common.adjustGMTOdataFormat(oSearchDate.getDateValue());
			sendObject.IEndda = oSearchDate.getSecondDateValue();
            sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
						dataLength = rDatas.length;
						oController.TableModel.setData({Data: rDatas}); 
					}

					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },

        onPressSer: function() { // 조회
            this.onTableSearch();
        },

		onPressRegi: function() { // 등록
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");
			
			if (!this._RegistModel) {
				this._RegistModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.Regist", this);
				oView.addDependent(this._RegistModel);
			}

			var oCommentBox = $.app.byId(this.PAGEID + "_CommentBox");
			
			this.RegistModel.setData({FormData: []});
			this.CommentModel.setData({Data: {}});
			oCommentBox.destroyItems();

			var oDateBox = $.app.byId(this.PAGEID + "_RegistDateBox");
			var oIsHideBox = $.app.byId(this.PAGEID + "_IsHideBox");
			oDateBox.setVisible(false);
			oIsHideBox.setVisible(true);
			
            this.onBeforeOpenDetailDialog();
		    this._RegistModel.open();
		},
		
		onSelectedRow: function(oEvent) {
            var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			
			oController.onSelectDetail(true, vPath);
		},

		onSelectDetail: function(Gubun, Path){
			var oController = $.app.getController();
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");
			var vSdate = Gubun ? oController.TableModel.getProperty(Path).Sdate : oController.getParameterByName("Sdate");
			var vSeqnr = Gubun ? oController.TableModel.getProperty(Path).Seqnr : oController.getParameterByName("Skey");
			
			if (!oController._RegistModel) {
				oController._RegistModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.Regist", oController);
				oView.addDependent(oController._RegistModel);
			}

			var oDateBox = $.app.byId(oController.PAGEID + "_RegistDateBox");
			var oIsHideBox = $.app.byId(oController.PAGEID + "_IsHideBox");
			oDateBox.setVisible(true);
			oIsHideBox.setVisible(false);
			
			oController.CommentModel.setData({Data: {}});
			oController.getDetailData(vSdate, vSeqnr);
            oController.onBeforeOpenDetailDialog();
			oController._RegistModel.open();
		},

		getDetailData: function(Sdate, Seqnr) { // 상세정보
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = Sdate;
			sendObject.ISeqnr = Seqnr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [];
			sendObject.TableIn4 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						var oCommentData = oData.TableIn3.results;
						var oSubCommentData = oData.TableIn4.results;
						oController.RegistModel.setData({FormData: oCopiedRow});
						oController.RegistModel.setProperty("/CommentData", oCommentData);
						oController.RegistModel.setProperty("/SubCommentData", oSubCommentData);
						oController.setComments();
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

		onChangeData: function(oEvent) { // 비공개 CheckBox
			var IsSelected = oEvent.getSource().getSelected();

			if(IsSelected)	this.RegistModel.setProperty("/FormData/Hide", "X");
			else this.RegistModel.setProperty("/FormData/Hide", "");
		},

		setComments: function() { // Comment Setting
			var oController = $.app.getController();
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vCommData = oController.RegistModel.getProperty("/CommentData");

			oCommentBox.destroyItems();

			vCommData.forEach(function(e, i) {
				oCommentBox.addItem(
					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.Start,
										fitContainer: true,
										visible: false,
										items: [
											ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
											new sap.m.Input({
												width: "150px",
												type: sap.m.InputType.Password
											})
										]
									}),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.End,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "100%",
										visible: {
											path: e.Zdel,
											formatter: function() {
												return e.Zdel !== "X";
											}
										},
										items: [
											new sap.m.Text({ 
												text: Common.DateFormatter(e.Adatl)
											}),
											new sap.m.Button({
												press: oController.onCommentSubBtn.bind(oController),
												text: "{i18n>LABEL_56017}" // 대댓글
											}),
											new sap.m.Button({
												press: oController.onCommentReBtn.bind(oController),
												text: "{i18n>LABEL_56013}" // 수정
											}),
											new sap.m.Button({
												press: oController.onCommentSaBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56016}" // 저장
											}),
											new sap.m.Button({
												press: oController.onCommentDeBtn.bind(oController),
												text: "{i18n>LABEL_56014}" // 삭제
											}),
											new sap.m.Button({
												press: oController.onCommentCanBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56019}" // 취소
											})
										]
									})
									.addStyleClass("button-group")
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.Text({ 
										text: e.Pword,
										visible: false
									}),
									new sap.m.Text({ 
										text: e.Seqnr2,
										visible: false
									}),
									new sap.m.TextArea({ 
										width: "775px",
										value: e.Detail,
										rows: 1,
										editable: false
									})
								]
							}),
							new sap.m.VBox({
								fitContainer: true,
								visible: false,
								items: []
							})
							.addStyleClass("ml-20px")
						]
					})
				);
				oController.setSubComments(e, i);
			});
		},

		setSubComments: function(oEvent, index) { // SubComment Setting
			var oController = $.app.getController();
			var vSubCommentData = oController.RegistModel.getProperty("/SubCommentData");
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");

			if(Common.checkNull(!index) || index === 0){ // 저장된 대댓글 Setting
				vSubCommentData.forEach(function(e) {
					if(e.Seqnr2 === oEvent.Seqnr2) {
						oCommentBox.getItems()[index].getItems()[2].setVisible(true);
						oCommentBox.getItems()[index].getItems()[2].addItem(
							new sap.m.VBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.Start,
												fitContainer: true,
												visible: false,
												items: [
													ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
													new sap.m.Input({
														width: "150px",
														value: e.Pword,
														type: sap.m.InputType.Password
													})
												]
											}),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.End,
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.End,
												fitContainer: true,
												width: "100%",
												items: [
													new sap.m.Text({ 
														text: Common.DateFormatter(e.Adatl)
													}),
													new sap.m.Button({
														press: oController.onSubCommentReBtn.bind(oController),
														text: "{i18n>LABEL_56013}" // 수정
													}),
													new sap.m.Button({
														press: oController.onSubCommentSaBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56016}" // 저장
													}),
													new sap.m.Button({
														press: oController.onSubCommentDeBtn.bind(oController),
														text: "{i18n>LABEL_56014}" // 삭제
													}),
													new sap.m.Button({
														press: oController.onSubCommentCanBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56019}" // 취소
													})
												]
											})
											.addStyleClass("button-group")
										]
									}),
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.TextArea({ 
												width: "755px",
												value: e.Detail,
												rows: 1,
												editable: false
											})
										]
									})
								]
							})
						);
					}
				});
			}else { // 신규 대댓글
				oController.g_ReCommBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[1];
				oEvent.getSource().oParent.oParent.oParent.getItems()[2].setVisible(true);
				oEvent.getSource().oParent.oParent.oParent.getItems()[2].addItem(
					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.Start,
										fitContainer: true,
										items: [
											ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
											new sap.m.Input({
												width: "150px",
												type: sap.m.InputType.Password
											})
										]
									}),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.End,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "100%",
										items: [
											new sap.m.Text({
												text: ""
											}),
											new sap.m.Button({
												press: oController.onSubCommentReBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56013}" // 수정
											}),
											new sap.m.Button({
												press: oController.onSubCommentSaBtn.bind(oController),
												text: "{i18n>LABEL_56016}" // 저장
											}),
											new sap.m.Button({
												press: oController.onSubCommentDeBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56014}" // 삭제
											}),
											new sap.m.Button({
												press: oController.onSubCommentCanBtn.bind(oController),
												visible: true,
												text: "{i18n>LABEL_56019}" // 취소
											})
										]
									})
									.addStyleClass("button-group")
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.TextArea({ 
										width: "755px",
										rows: 1
									})
								]
							})
						]
					})
				);
			}
		},

		onSubCommentCanBtn: function(oEvent) { // 대댓글 취소
			oEvent.getSource().oParent.oParent.oParent.destroyItems();
		},

		onCommentSubBtn: function(oEvent) { // 대댓글
			this.setSubComments(oEvent);
		},

		onSubCommentReBtn: function(oEvent) { // 수정
			// oEvent.getSource().oParent.oParent.oParent.getItems()[0].
		},

		onSubCommentSaBtn: function(oEvent) { // 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			this.g_ReDetail = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			this.g_RePwordInput = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[0].getItems()[1];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.oParent.oParent.getItems()[1].getItems()[1];

			// 비밀번호
			if(Common.checkNull(this.g_RePwordInput.getValue()) || 6 > this.g_RePwordInput.getValue().length || this.g_RePwordInput.getValue().length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			// 대댓글
			if(Common.checkNull(this.g_ReDetail.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56010"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Detail = this.g_ReDetail.getValue();
			oCommData.Pword = this.g_RePwordInput.getValue();
			oCommData.Seqnr2 = this.g_HiSeqnr2.getText();

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn4 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn4", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.onTableSearch();
					oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
					BusyIndicator.hide();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
		},

		onSubCommentDeBtn: function(oEvent) { // 삭제

		},
		
		onCommentSaBtn: function() { // 댓글저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			// 비밀번호
			if(Common.checkNull(this.g_HiInputPword.getValue()) || 6 > this.g_HiInputPword.getValue().length || this.g_HiInputPword.getValue().length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Detail = this.g_Input.getValue();
			oCommData.Pword = this.g_HiInputPword.getValue();
			oCommData.Seqnr2 = this.g_HiSeqnr2.getText();

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.onTableSearch();
					oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
					BusyIndicator.hide();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
		},
		
		onCommentCanBtn: function(oEvent) { // 댓글 취소
			oEvent.getSource().oParent.oParent.oParent.destroyItems();
		},

		onCommentReBtn: function(oEvent) { // 댓글 수정
			var oPWord = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");
			this.g_Input = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReCommBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[1];
			this.g_ReBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[2];
			this.g_SaveBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[3];
			this.g_CanBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[5];
			this.g_HiBox = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[0];
			this.g_HiInputPword = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[0].getItems()[1];
			this.g_HiPword = oPWord;
			this.g_CGubun = "R";
			

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}
			
			this.PWordModel.setData({Data: {}});
			this.PWordModel.setProperty("/Data/PWord", oPWord.getText());
			this._CommentModel.open();

		},

		onCommentDeBtn: function(oEvent) {
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");
			this.g_HiPword = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_CGubun = "D";

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.PWordModel.setData({Data: {}});
					oController.PWordModel.setProperty("/Data/PWord", oController.g_HiPword.getText());
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56012"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
		},

		onCommentDelete: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");
			var oCommData = {};

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Seqnr2 = oController.g_HiSeqnr2.getText();
			oCommData.Zdel = "X";

			var sendObject = {};

			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						oController.CommentModel.setData({Data: {}});
						oController.onTableSearch();
						oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
						BusyIndicator.hide();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
			oController.PWordModel.setData({Data: {}});
		},

		checkError :function() { // Error Check
			var oController = $.app.getController();
			var oFormData = oController.RegistModel.getProperty("/FormData");
			
			// 제목
			if(Common.checkNull(oFormData.Title)){
				MessageBox.error(oController.getBundleText("MSG_56001"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}
			// 내용
			if(Common.checkNull(oFormData.Detail)){
				MessageBox.error(oController.getBundleText("MSG_56002"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 비밀번호
			if(Common.checkNull(oFormData.Pword) || 6 > oFormData.Pword.length || oFormData.Pword.length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		UserCheck: function() { // 비밀번호 확인
			var oController = $.app.getController();
			var vPword = oController.PWordModel.getProperty("/Data/PassWord");
			var vPword2 = oController.PWordModel.getProperty("/Data/PWord");
			
			// PassWord Check
			if(vPword !== vPword2){
				return MessageBox.error(oController.getBundleText("MSG_56011"), { title: oController.getBundleText("LABEL_00149")});
			}

			if(this.g_CGubun === "R"){
				this.g_Input.setEditable(true);
				this.g_ReBtn.setVisible(false);
				this.g_ReCommBtn.setVisible(false);
				this.g_SaveBtn.setVisible(true);
				this.g_CanBtn.setVisible(true);
				this.g_HiBox.setVisible(true);
			}else {
				this.onCommentDelete();
			}

			oController._CommentModel.close();
		},

		onDialogPwordBtn: function() { // PassWord Dialog 확인
			var vPassWord = this.RegistModel.getProperty("/FormData/Pword");
			var vPword = this.PWordModel.getProperty("/Data/PassWord");

			if(Common.checkNull(!this.PWordModel.getProperty("/Data/PWord"))){
				return this.UserCheck();
			}
			// PassWord Check
			if(vPword !== vPassWord){
				return MessageBox.error(this.getBundleText("MSG_56011"), { title: this.getBundleText("LABEL_00149")});
			}

			if(this.g_Pword === "R")
				this.RegistModel.setProperty("/Gubun", "X");
			else
				this.onDeleteData();

			this._CommentModel.close();
		},

        onDialogRegistBtn: function() { // 등록
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");

			if(this.checkError()) return;

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56005")) { // 등록

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = new Date();

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
					
					oModel.create("/SuggestionBoxSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_56004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._RegistModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56003"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56005"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
        },

		onDialogReBtn: function() { // 수정
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			this.g_Pword = "R";
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();
		},

		onDeleteData: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");

			var sendObject = {};
			// Header
			sendObject.IConType = "3";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						oController.onTableSearch();
						BusyIndicator.hide();
						oController._RegistModel.close();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
		},

		onDialogDeleteBtn: function() { // 삭제
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.g_Pword = "D";
					oController.PWordModel.setData({Data: {}});
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56008"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
		},

		onDialogSaveBtn: function() { // 댓글 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = this.CommentModel.getProperty("/Data");

			// 비밀번호
			if(Common.checkNull(oCommData.Pword) || 6 > oCommData.Pword.length || oCommData.Pword.length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			// 내용
			if(Common.checkNull(oCommData.Detail)){
				MessageBox.error(oController.getBundleText("MSG_56010"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.onTableSearch();
					oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
					BusyIndicator.hide();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
		},

        onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var	vSdate = oController.RegistModel.getProperty("/FormData/Sdate"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: !vSdate ? true : false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});