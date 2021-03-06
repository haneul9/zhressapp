sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/EditorType"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates, RTE, EditorType) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Detail",
		
        TableModel: new JSONModelHelper(),
		RegistModel: new JSONModelHelper(),
		CommentModel: new JSONModelHelper(),
		PWordModel: new JSONModelHelper(),

		g_ReGubun: "", 			// 댓글/대댓글 상세 수정/삭제 구분
		g_Input: "",			// 댓글 내용 Input
		g_HiInputPword: "",		// 해당 댓글의 비밀번호 Input
		g_HiPword: "",			// 해당 댓글의 비밀번호 Text
		g_HiSeqnr2: "",			// 해당 댓글의 시퀀스번호 Text
		g_HiBox: "",			// 해당 댓글의 비밀번호 HBox
		g_SaveBtn: "",			// 해당 댓글의 저장 Btn 
		g_ReBtn: "",			// 해당 댓글의 수정 Btn
		g_CanBtn: "",			// 해당 댓글의 취소 Btn
		g_ReCommBtn: "",		// 해당 댓글의 대댓글 Btn
		g_CommGood: "",			// 해당 댓글의 좋아요 Btn
		g_CommBed: "",			// 해당 댓글의 싫어요 Btn 
		g_CommGoodText: "",		// 해당 댓글의 좋아요 Text
		g_CommBedText: "",		// 해당 댓글의 싫어요 Text
		g_ReHiSeqnr2: "",		// 해당 대댓글의 시퀀스번호 Text
		g_ReDetail: "",			// 해당 대댓글의 신규작성시 내용
		g_ReHiPword: "",		// 해당 대댓글의 비밀번호 Text
		g_RePwordInput: "",		// 해당 대댓글의 비밀번호 Input
		g_RePwordBox: "",		// 해당 대댓글의 비밀번호 Box
		g_ReSaveBtn: "",		// 해당 대댓글의 저장 Btn
		g_ReWritBtn: "",		// 해당 대댓글의 수정 Btn
		g_ReCanBtn: "",			// 해당 대댓글의 취소 Btn
		g_ReCommGood: "",		// 해당 대댓글의 좋아요 Btn
		g_ReCommBed: "",		// 해당 대댓글의 싫어요 Btn
		g_ReCommGoodText: "",	// 해당 대댓글의 좋아요 Text
		g_ReCommBedText: "",	// 해당 대댓글의 싫어요 Text

		getUserId: function() {

			return $.app.getController().getUserId();
		},
		
		getUserGubun  : function() {

			return $.app.getController().getUserGubun();
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
		
		onBeforeShow: function(oEvent) {
            BusyIndicator.show(0);
            this.CommentModel.setData({Data: {}});
            this.RegistModel.setData({FormData: []});
            this.PWordModel.setData({Data: {}});

            if(oEvent.data){
                this.getDetailData(oEvent.data.vSdate, oEvent.data.vSeqnr);
				// this.RegistModel.setProperty("/GubunCombo", oEvent.data.GubunCombo.slice(1));
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.onBeforeOpenDetailDialog();
            BusyIndicator.hide();
        },

		getParameterByName: function(name) {
			var regex = parent._gateway.parameter(name);
			
			return Common.checkNull(regex)? "" : regex;
		},

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix()),
				data: { 
                    New: "X"
                }
            });
        },

		setHideTokTok: function(oEvent) { // 톡톡 비공개
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var vSelected = oEvent.getSource().getSelected();

			if(vSelected) {
				oRowData.Hide = "X";
			}else {
				oRowData.Hide = "";
			}

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		getDetailData: function(Sdate, Seqnr) { // 상세정보
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			
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
			sendObject.TableIn6 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oCopiedRow.Detail = "";
						
						oData.TableIn6.results.forEach(function(e) {
							oCopiedRow.Detail += e.Detail;
						});

						var oCommentData = oData.TableIn3.results;
						var oSubCommentData = oData.TableIn4.results;
						// oController.RegistModel.setData({FormData: oCopiedRow});
						oController.RegistModel.setData({FormData: $.extend(true, oCopiedRow, {
							Detail: /^</i.test(oCopiedRow.Detail) ? oCopiedRow.Detail : "<p>${content}</p>".interpolate(oCopiedRow.Detail)
						})});

						oController.RegistModel.setProperty("/CommentData", oCommentData);
						oController.RegistModel.setProperty("/SubCommentData", oSubCommentData);

						if(localStorage && localStorage.getItem("ehr.suggestions." + oCopiedRow.Sdate + oCopiedRow.Seqnr + ".goodconfirmed") === "Y") {
							vThumUp.toggleStyleClass("button-HiTokTok-check", true);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(false);
						}else {
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.setEnabled(true);
						}
						
						if(localStorage && localStorage.getItem("ehr.suggestions." + oCopiedRow.Sdate + oCopiedRow.Seqnr + ".bedconfirmed") === "N") {
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", true);
							vThumUp.setEnabled(false);
							vThumDown.setEnabled(true);
						}else {
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
							vThumUp.setEnabled(true);
						}
						
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

		setComments: function() { // Comment Setting
			var oController = this.getView().getController();
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vCommData = oController.RegistModel.getProperty("/CommentData");
			var vIndex = 0;
			var vGood = false, vBed = false;

			oCommentBox.destroyItems();

			vCommData.forEach(function(e, i) {
				if(localStorage) {
					vGood = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + e.Seqnr2 + ".goodconfirmed") === "Y";
					vBed = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + e.Seqnr2 + ".bedconfirmed") === "N";
				}
				
				if((Common.checkNull(e.Zdel) && oController.RegistModel.getProperty("/SubCommentData").length === 0) || oController.RegistModel.getProperty("/SubCommentData").some(function(ele) { return ele.Seqnr2 === e.Seqnr2 || (ele.Seqnr2 !== e.Seqnr2 && Common.checkNull(e.Zdel)); })) {
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
													maxLength: 10,
													value: e.Pword,
													type: sap.m.InputType.Password
												}).addStyleClass("mr-10px")
											]
										}).addStyleClass("custom-HiTokTok-group mt-10px"),
										new sap.m.HBox({
											justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
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
													width: "100px",
													text: Common.DateFormatter(e.Adatl)
												}).addStyleClass("pt-6px"),
												new sap.m.HBox({
													justifyContent: sap.m.FlexJustifyContent.End,
													alignContent: sap.m.FlexAlignContent.End,
													alignItems: sap.m.FlexAlignItems.End,
													width: "100%",
													fitContainer: true,
													items: [
														new sap.ui.core.Icon({
															src: "sap-icon://thumb-up"
														})
														.addStyleClass("icon-HiTokTok ok"),
														new sap.m.Text({
															width: "auto",
															text: e.Zgood
														}).addStyleClass("mr-12px font-12px"),
														new sap.ui.core.Icon({
															src: "sap-icon://thumb-down"
														})
														.addStyleClass("icon-HiTokTok no"),
														new sap.m.Text({
															width: "auto",
															text: e.Zbed
														}).addStyleClass("font-12px"),
														new sap.m.Button({ 
															icon: "sap-icon://thumb-up",
															press: oController.OnCommThumbUp.bind(oController),
															enabled: (vGood === false && vBed === false) || vGood,
															text: "{i18n>LABEL_56020}" // 좋아요
														}).addStyleClass("button-light-sm")
														.toggleStyleClass("button-HiTokTok-check", vGood),
														new sap.m.Button({ 
															icon: "sap-icon://thumb-down",
															press: oController.OnCommThumbDown.bind(oController),
															enabled: (vGood === false && vBed === false) || vBed,
															text: "{i18n>LABEL_56021}" // 싫어요
														}).addStyleClass("button-light-sm")
														.toggleStyleClass("button-HiTokTok-check", vBed),
														new sap.m.Button({
															press: oController.onCommentSubBtn.bind(oController),
															icon: "sap-icon://comment",
															text: "{i18n>LABEL_56017}" // 대댓글
														}).addStyleClass("button-light-sm"),
														new sap.m.Button({
															press: oController.onCommentReBtn.bind(oController),
															text: "{i18n>LABEL_56013}" // 수정
														}).addStyleClass("button-light-sm"),
														new sap.m.Button({
															press: oController.onCommentSaBtn.bind(oController),
															visible: false,
															text: "{i18n>LABEL_56016}" // 저장
														}).addStyleClass("button-light-sm"),
														new sap.m.Button({
															press: oController.onCommentDeBtn.bind(oController),
															text: "{i18n>LABEL_56014}" // 삭제
														}).addStyleClass("button-light-sm"),
														new sap.m.Button({
															press: oController.onCommentCanBtn.bind(oController),
															visible: false,
															text: "{i18n>LABEL_56019}" // 취소
														}).addStyleClass("button-light-sm")
													]
												}).addStyleClass("custom-HiTokTok-content")
											]
										})
										.addStyleClass("button-group custom-HiTokTok-group mt-10px ml-0")
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
											width: "100%",
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),	
											value: e.Detail,
											growing: true,
											editable: false
										}).addStyleClass("mt-10px")
									]
								}),
								new sap.m.VBox({
									fitContainer: true,
									visible: false,
									items: []
								})
								.addStyleClass("ml-20px gcomment")
							]
						}).addStyleClass("custom-HiTokTok-comment")
					);
					
					oController.setSubComments(e, vIndex);
					vIndex = vIndex + 1;
				}
			});			
		},

		setSubComments: function(oEvent, index) { // SubComment Setting
			var oController = this.getView().getController();
			var vSubCommentData = oController.RegistModel.getProperty("/SubCommentData");
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vGood = false, vBed = false;

			if(Common.checkNull(!index) || index === 0){ // 저장된 대댓글 Setting
				vSubCommentData.forEach(function(e) {
					if(e.Seqnr2 === oEvent.Seqnr2) {
						if(localStorage) {
							vGood = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + oEvent.Seqnr2 + e.Seqnr3 + ".goodconfirmed") === "Y";
							vBed = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + oEvent.Seqnr2 + e.Seqnr3 + ".bedconfirmed") === "N";
						}

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
														maxLength: 10,
														value: e.Pword,
														type: sap.m.InputType.Password
													}).addStyleClass("mr-10px"),
													new sap.ui.core.Icon({
														src: "sap-icon://information"
													})
													.addStyleClass("color-icon-blue ml-20px mr-5px pt-14px"),
													new sap.m.Text({
														width: "auto",
														textAlign: "Begin",
														text: "{i18n>MSG_56006}"
													}).addStyleClass("pt-12px")
												]
											}).addStyleClass("custom-HiTokTok-group mt-10px"),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
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
														width: "100px",
														text: Common.DateFormatter(e.Adatl)
													}).addStyleClass("pt-6px"),
													new sap.m.HBox({
														justifyContent: sap.m.FlexJustifyContent.End,
														alignContent: sap.m.FlexAlignContent.End,
														alignItems: sap.m.FlexAlignItems.End,
														width: "100%",
														fitContainer: true,
														items: [
															new sap.ui.core.Icon({
																src: "sap-icon://thumb-up"
															})
															.addStyleClass("icon-HiTokTok ok"),
															new sap.m.Text({
																width: "auto",
																text: e.Zgood
															}).addStyleClass("mr-12px font-12px"),
															new sap.ui.core.Icon({
																src: "sap-icon://thumb-down"
															})
															.addStyleClass("icon-HiTokTok no"),
															new sap.m.Text({
																width: "auto",
																text: e.Zbed
															}).addStyleClass("font-12px"),
															new sap.m.Button({ 
																icon: "sap-icon://thumb-up",
																press: oController.OnReCommThumbUp.bind(oController),
																enabled: (vGood === false && vBed === false) || vGood,
																text: "{i18n>LABEL_56020}" 
															}).addStyleClass("button-light-sm")
															.toggleStyleClass("button-HiTokTok-check", vGood),
															new sap.m.Button({ // 싫어요
																icon: "sap-icon://thumb-down",
																press: oController.OnReCommThumbDown.bind(oController),
																enabled: (vGood === false && vBed === false) || vBed,
																text: "{i18n>LABEL_56021}" // 싫어요
															}).addStyleClass("button-light-sm")
															.toggleStyleClass("button-HiTokTok-check", vBed),
															new sap.m.Button({
																press: oController.onSubCommentReBtn.bind(oController),
																text: "{i18n>LABEL_56013}" // 수정
															}).addStyleClass("button-light-sm"),
															new sap.m.Button({
																press: oController.onSubCommentSaBtn.bind(oController),
																visible: false,
																text: "{i18n>LABEL_56016}" // 저장
															}).addStyleClass("button-light-sm"),
															new sap.m.Button({
																press: oController.onSubCommentDeBtn.bind(oController),
																text: "{i18n>LABEL_56014}" // 삭제
															}).addStyleClass("button-light-sm"),
															new sap.m.Button({
																press: oController.onSubCommentCanBtn.bind(oController),
																visible: false,
																text: "{i18n>LABEL_56019}" // 취소
															}).addStyleClass("button-light-sm")
														]
													}).addStyleClass("custom-HiTokTok-content")
												]
											})
											.addStyleClass("button-group custom-HiTokTok-group mt-10px ml-0")
										]
									}),
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.TextArea({ 
												width: "100%",
												layoutData: new sap.m.FlexItemData({ growFactor: 1 }),	
												value: e.Detail,
												growing: true,
												editable: false
											}).addStyleClass("mt-10px"),
											new sap.m.Text({ 
												text: e.Pword,
												visible: false
											}),
											new sap.m.Text({ 
												text: e.Seqnr3,
												visible: false
											})
										]
									})
								]
							}).addStyleClass("custom-HiTokTok-comment")
						);
					}
				});
			}else { // 신규 대댓글
				oController.g_ReCommBtn = oEvent.getSource().getParent().getItems()[6];
				oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[2].setVisible(true);
				oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[2].addItem(
					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.Start,
										fitContainer: true,
										width:"50%",
										items: [
											ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
											new sap.m.Input({
												width: "150px",
												maxLength: 10,
												type: sap.m.InputType.Password
											}).addStyleClass("mr-10px"),
											new sap.ui.core.Icon({
												src: "sap-icon://information"
											})
											.addStyleClass("color-icon-blue ml-20px mr-5px"),
											new sap.m.Text({
												width: "auto",
												textAlign: "Begin",
												text: "{i18n>MSG_56006}"
											})
										]
									}).addStyleClass("custom-HiTokTok-group mt-10px"),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "50%",
										items: [
											new sap.m.Text({
												text: ""
											}).addStyleClass("pt-6px"),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.End,
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.End,
												width: "100%",
												fitContainer: true,
												items: [
													new sap.ui.core.Icon({
														visible: false,
														src: "sap-icon://thumb-up"
													})
													.addStyleClass("color-blue mr-1px"),
													new sap.m.Text({
														visible: false,
														width: "auto",
														text: "{Zgood}"
													}),
													new sap.ui.core.Icon({
														visible: false,
														src: "sap-icon://thumb-down"
													})
													.addStyleClass("color-red mr-1px"),
													new sap.m.Text({
														visible: false,
														width: "auto",
														text: "{Zbed}"
													}),
													new sap.m.Button({
														visible: false,
														icon: "sap-icon://thumb-up",
														press: oController.OnReCommThumbUp.bind(oController),
														text: "{i18n>LABEL_56020}" 
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({ // 싫어요
														visible: false,
														icon: "sap-icon://thumb-down",
														press: oController.OnReCommThumbDown.bind(oController),
														text: "{i18n>LABEL_56021}" // 싫어요
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentReBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56013}" // 수정
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentSaBtn.bind(oController),
														text: "{i18n>LABEL_56016}" // 저장
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentDeBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56014}" // 삭제
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentCanBtn.bind(oController),
														visible: true,
														text: "{i18n>LABEL_56019}" // 취소   
													}).addStyleClass("button-light-sm")
												]
											}).addStyleClass("custom-HiTokTok-content")
										]
									})
									.addStyleClass("button-group custom-HiTokTok-group mt-10px ml-0")
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.TextArea({ 										
										width: "100%",
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),	
										growing: true
									}).addStyleClass("mt-10px"),
									new sap.m.Text({ 
										visible: false
									})
								]
							})
						]
					}).addStyleClass("custom-HiTokTok-comment") 
				);
			}
		},

		onSubCommentCanBtn: function(oEvent) { // 대댓글 취소
			this.setComments();
		},

		onCommentSubBtn: function(oEvent) { // 대댓글
			this.setSubComments(oEvent);
		},

		onSubCommentReBtn: function(oEvent) { // 대댓글 수정
			var oView = $.app.byId("ZUI5_HR_SuggestionsHass.Detail");
			this.g_ReHiPword = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReWritBtn = oEvent.getSource().getParent().getItems()[6];
			this.g_ReSaveBtn = oEvent.getSource().getParent().getItems()[7];
			this.g_ReCanBtn = oEvent.getSource().getParent().getItems()[9];
			this.g_RePwordBox = oEvent.getSource().getParent().getParent().getParent().getItems()[0];
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getParent().getItems()[0].getItems()[1];
			this.g_ReDetail = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[0];

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_SuggestionsHass.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}
			
			this.g_ReGubun = "RR";
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();
		},

		onSubCommentSaBtn: function(oEvent) { // 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			this.g_ReDetail = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[0];
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getParent().getItems()[0].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];

			// 비밀번호
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(this.g_RePwordInput.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
			oCommData.Seqnr3 = Common.checkNull(!this.g_ReHiSeqnr2) ? this.g_ReHiSeqnr2.getText() : "";

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
					oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
					if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
					if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_SuggestionsHass.Detail");
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getParent().getItems()[0].getItems()[1];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReHiPword = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReGubun = "RD";

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_SuggestionsHass.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.PWordModel.setData({Data: {}});
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56012"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
		},

		onSubCommentDelete : function() { // 대댓글 삭제
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");
			var oCommData = {};

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Seqnr2 = oController.g_HiSeqnr2.getText();
			oCommData.Seqnr3 = oController.g_ReHiSeqnr2.getText();
			oCommData.Zdel = "X";

			var sendObject = {};

			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn4 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn4", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						oController.CommentModel.setData({Data: {}});
						oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
		
		onCommentSaBtn: function() { // 댓글저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			// 비밀번호
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(this.g_HiInputPword.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
					oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
					if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
					if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			this.setComments();
		},

		onCommentReBtn: function(oEvent) { // 댓글 수정
			var oPWord = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[0];
			var oView = $.app.byId("ZUI5_HR_SuggestionsHass.Detail");
			this.g_Input = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReCommBtn = oEvent.getSource().getParent().getItems()[6];
			this.g_ReBtn = oEvent.getSource().getParent().getItems()[7];
			this.g_SaveBtn = oEvent.getSource().getParent().getItems()[8];
			this.g_CanBtn = oEvent.getSource().getParent().getItems()[10];
			this.g_HiBox = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[0].getItems()[0];
			this.g_HiInputPword = oEvent.getSource().getParent().getParent().getParent().getItems()[0].getItems()[1];
			this.g_HiPword = oPWord;
			this.g_ReGubun = "R";
			

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_SuggestionsHass.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}
			
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();

		},

		onCommentDeBtn: function(oEvent) {
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_SuggestionsHass.Detail");
			this.g_HiPword = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[0];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReGubun = "D";

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_SuggestionsHass.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.PWordModel.setData({Data: {}});
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
			var oController = this.getView().getController();
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
						oController.getDetailData(oRowData.Sdate, oRowData.Seqnr);
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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

		ReCommentCheck: function() { // 대댓글 수정/삭제 비밀번호 확인
			var oController = this.getView().getController();
			var vPword = oController.PWordModel.getProperty("/Data/PassWord");
			

			// PassWord Check
			if(oController.g_ReHiPword.getText() !== vPword){
				return MessageBox.error(oController.getBundleText("MSG_56011"), { title: oController.getBundleText("LABEL_00149")});
			}

			if(oController.g_ReGubun === "RR"){
				this.g_ReWritBtn.setVisible(false);
				this.g_ReSaveBtn.setVisible(true);
				this.g_ReCanBtn.setVisible(true);
				this.g_RePwordBox.setVisible(true);
				this.g_ReDetail.setEditable(true);
			}else {
				oController.onSubCommentDelete();
			}

			oController.g_ReGubun = "";
			oController._CommentModel.close();
		},

		CommentUserCheck: function() { // 댓글 수정/삭제 비밀번호 확인
			var oController = this.getView().getController();
			var vPword = oController.PWordModel.getProperty("/Data/PassWord");
			
			if(this.g_ReGubun === "RR" || this.g_ReGubun === "RD")
				return oController.ReCommentCheck();

			// PassWord Check
			if(vPword !== this.g_HiPword.getText()){
				return MessageBox.error(oController.getBundleText("MSG_56011"), { title: oController.getBundleText("LABEL_00149")});
			}

			if(this.g_ReGubun === "R"){
				this.g_Input.setEditable(true);
				this.g_ReBtn.setVisible(false);
				this.g_ReCommBtn.setVisible(false);
				this.g_SaveBtn.setVisible(true);
				this.g_CanBtn.setVisible(true);
				this.g_HiBox.setVisible(true);
			}else {
				this.onCommentDelete();
			}

			this.g_ReGubun = "";
			oController._CommentModel.close();
		},

		onDialogPwordBtn: function() { // PassWord Dialog 확인
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var oRowData = this.RegistModel.getProperty("/FormData");
			var vBukrs = this.getUserGubun();

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : Common.checkNull(this.g_HiSeqnr2) ? undefined : this.g_HiSeqnr2.getText(),
				Seqnr3 : Common.checkNull(this.g_ReHiSeqnr2) ? undefined : this.g_ReHiSeqnr2.getText(),
				Pword : oController.PWordModel.getProperty("/Data/PassWord")
			};

			var sendObject = {};
			// Header
			sendObject.IConType = "5";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(Common.checkNull(!this.g_ReGubun)){
							return this.CommentUserCheck();
						}
						
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";

						oController._CommentModel.close();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		OnThumbUp: function() { // 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			var oRowData = this.RegistModel.getProperty("/FormData");
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed") === "Y") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed", "Y");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(false);
							oController.RegistModel.setProperty("/FormData/Zgood", parseInt(oController.RegistModel.getProperty("/FormData/Zgood")) + 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", true);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed", "");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zgood", parseInt(oController.RegistModel.getProperty("/FormData/Zgood")) - 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
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

		OnThumbDown: function() { // 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			var oRowData = this.RegistModel.getProperty("/FormData");
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed", "N");
							vThumUp.setEnabled(false);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zbed", parseInt(oController.RegistModel.getProperty("/FormData/Zbed")) + 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed", "");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zbed", parseInt(oController.RegistModel.getProperty("/FormData/Zbed")) - 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
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

		OnCommThumbUp: function(oEvent) { // 댓글 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_CommGoodText = oEvent.getSource().getParent().getItems()[1];
			this.g_CommGood = oEvent.getSource();
			this.g_CommBed = oEvent.getSource().getParent().getItems()[5];

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + ".goodconfirmed") === "Y") 
				oSendData.Zcanc = "X";
			
			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed", "Y");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(false);
							oController.g_CommGoodText.setText(parseInt(oController.g_CommGoodText.getText()) + 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", true);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed", "");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommGoodText.setText(parseInt(oController.g_CommGoodText.getText()) - 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnCommThumbDown: function(oEvent) { // 댓글 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_CommBedText = oEvent.getSource().getParent().getItems()[3];
			this.g_CommGood = oEvent.getSource().getParent().getItems()[4];
			this.g_CommBed = oEvent.getSource();
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";
			
			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed", "N");
							oController.g_CommGood.setEnabled(false);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommBedText.setText(parseInt(oController.g_CommBedText.getText()) + 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed", "");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommBedText.setText(parseInt(oController.g_CommBedText.getText()) - 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnReCommThumbUp: function(oEvent) { // 대댓글 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReCommGoodText = oEvent.getSource().getParent().getItems()[1];
			this.g_ReCommGood = oEvent.getSource();
			this.g_ReCommBed = oEvent.getSource().getParent().getItems()[5];

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Seqnr3 : this.g_ReHiSeqnr2.getText(),
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + this.g_ReHiSeqnr2.getText() + ".goodconfirmed") === "Y") 
				oSendData.Zcanc = "X";
			
			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed", "Y");
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBed.setEnabled(false);
							oController.g_ReCommGoodText.setText(parseInt(oController.g_ReCommGoodText.getText()) + 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", true);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed", "");
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGoodText.setText(parseInt(oController.g_ReCommGoodText.getText()) - 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnReCommThumbDown: function(oEvent) { // 대댓글 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReCommBedText = oEvent.getSource().getParent().getItems()[3];
			this.g_ReCommGood = oEvent.getSource().getParent().getItems()[4];
			this.g_ReCommBed = oEvent.getSource();
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Seqnr3 : this.g_ReHiSeqnr2.getText(),
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + this.g_ReHiSeqnr2.getText() + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed", "N");
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGood.setEnabled(false);
							oController.g_ReCommBedText.setText(parseInt(oController.g_ReCommBedText.getText()) + 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed", "");
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBedText.setText(parseInt(oController.g_ReCommBedText.getText()) - 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		onDialogSaveBtn: function() { // 댓글 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = this.CommentModel.getProperty("/Data");

			// 비밀번호
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(oCommData.Pword)){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
			var oController = this.getView().getController();
			var	vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			// if(!$.app.byId("myRTE")) {
			// 	var that = this;
			// 		that.oRichTextEditor = new RTE("myRTE", {
			// 			editorType: EditorType.TinyMCE4,
			// 			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			// 			width: "100%",
			// 			height: "500px",
			// 			customToolbar: true,
			// 			showGroupFont: true,
			// 			showGroupLink: true,
			// 			showGroupInsert: true,
			// 			value: "{Detail}",
			// 			editable: false,
			// 			ready: function () {
			// 				this.addButtonGroup("styleselect").addButtonGroup("table");
			// 			}
			// 		});
	
			// 	$.app.byId("contentArea").addItem(that.oRichTextEditor);
			// }

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: this.getView().getController().getUserId()}); 
		} : null
	});
});