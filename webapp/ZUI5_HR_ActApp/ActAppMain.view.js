sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/ZHR_TABLES"
], function (Common, Formatter, ZHR_TABLES) {
	"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{ id: "Numbr", label: "{i18n>LABEL_02270}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "4%" },
			{ id: "Statu", label: "{i18n>LABEL_02156}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
			{ id: "Reqno", label: "{i18n>LABEL_02140}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "11%" },
			{ id: "Title", label: "{i18n>LABEL_02187}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "13%", align: sap.ui.core.TextAlign.Begin },
			{ id: "Pbtxt", label: "{i18n>LABEL_02128}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
			{ id: "Reqdp", label: "{i18n>LABEL_02139}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
			{ id: "Reqnm", label: "{i18n>LABEL_02144}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
			{ id: "Eecnt", label: "{i18n>LABEL_02068}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
			{ id: "Actda", label: "{i18n>LABEL_02014}", plabel: "", span: 0, type: "date", sort: true, filter: true, width: "9%" },
			{ id: "Reqda", label: "{i18n>LABEL_02141}", plabel: "", span: 0, type: "date", sort: true, filter: true, width: "9%" },
			{ id: "Datlo", label: "{i18n>LABEL_02057}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "9%" },
		],

		/** Specifies the Controller belonging to this View.
		 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
		 * @memberOf epmproductapp.EPMProductApp
		 */
		getControllerName: function () {
			return $.app.APP_ID;
		},

		/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
		 * Since the Controller is given to this method, its event handlers can be attached right away.
		 * @memberOf epmproductapp.EPMProductApp
		 */
		createContent: function (oController) {
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_ACTIONAPP_SRV");
			this.setActionModel();

			// Excel column info
			oController._Columns = common.Common.convertColumnArrayForExcel(oController, this._colModel);
	
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			// var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
			var curDate = new Date();
			var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
			var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
	
			var oFilterLayout = new sap.ui.layout.HorizontalLayout({
				allowWrapping: true
			}).addStyleClass("L2PFilterLayout act-search-area");
		
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02128}" }).addStyleClass("act-search-label"), // actDesign class추가
						new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
							width: "250px", // actDesign width size 변경 (*하단 동일 적용)
							selectionFinish: oController.onChnageComboBox
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem act-search-field-group") // actDesign class추가
			);
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02140}" }).addStyleClass("act-search-label"), 
						new sap.m.Input(oController.PAGEID + "_Reqno", {
							width: "200px"
						}).addStyleClass("L2PFontFamily L2PImeActive")
					]
				}).addStyleClass("L2PFilterItem act-search-field-group") 
			);
	
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02101}" }).addStyleClass("act-search-label"),
						new sap.m.MultiComboBox(oController.PAGEID + "_Massn", {
							width: "200px",
							selectionFinish: oController.onChnageComboBox
						})
							.addStyleClass("L2PFontFamily")
							.setModel(sap.ui.getCore().getModel("ZHR_COMMON_SRV"))
					]
				}).addStyleClass("L2PFilterItem act-search-field-group")
			);
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02023}" }).addStyleClass("act-search-label"),
						new sap.m.DatePicker(oController.PAGEID + "_Actda_From", {
							value: dateFormat.format(prevDate),
							valueFormat: "yyyy-MM-dd",
							displayFormat: gDtfmt,
							width: "150px",
							change: oController.onChangeDate
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem act-search-field-group")
			);
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02015}" }).addStyleClass("act-search-label"),
						new sap.m.DatePicker(oController.PAGEID + "_Actda_To", {
							value: dateFormat.format(nextDate),
							valueFormat: "yyyy-MM-dd",
							displayFormat: gDtfmt,
							width: "150px",
							change: oController.onChangeDate
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem act-search-field-group")
			);
			oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content: [
						new sap.m.Button({
							text: "{i18n>LABEL_00100}",
							// icon : "sap-icon://search", //actDesign 아이콘 삭제
							type: sap.m.ButtonType.Emphasized,
							press: oController.onPressSearch
						}).addStyleClass("L2PFontFamily act-search-btn")
					]
				}).addStyleClass("L2PFilterItem act-search-field-group")
			);
	
			var oFilterInfoBar = new sap.m.Toolbar({
				height: "2rem", //actDesign height 수정
				content: [
					new sap.m.Label({
						text: "{i18n>LABEL_02083}" + " : "
					}).addStyleClass("L2PFontFamily"), 
					new sap.m.Text(oController.PAGEID + "_Pbtxt", {}).addStyleClass("act-secondary-color") //actDesign class추가
				]
			}).addStyleClass("L2PPaddingLeft1Rem act-search-req"); //actDesign class추가
	
			var oFilterVLayout = new sap.ui.layout.VerticalLayout({
				width: "100%",
				content: [
					oFilterLayout, 
					oFilterInfoBar
				]
			}).addStyleClass("");
	
			var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL", {
				showAll: true,
				key: "All",
				icon: "",
				design: sap.m.IconTabFilterDesign.Vertical, //actDesign 수정
				text: "{i18n>LABEL_02060}"
			});
	
			var iConSeperator = new sap.m.IconTabSeparator();
	
			var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CRETAE", {
				icon: "",
				text: "{i18n>LABEL_02157}",
				design: sap.m.IconTabFilterDesign.Vertical,
				key: "creation",
			});
	
			// var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_APPROVAL", {
			// 	icon: "sap-icon://approvals",
			// 	iconColor: "Positive",
			// 	text: "{i18n>LABEL_02158}",
			// 	design: sap.m.IconTabFilterDesign.Horizontal,
			// 	key: "approval",
			// });
	
			var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CONFIRM", {
				icon: "",
				text: "{i18n>LABEL_02159}",
				design: sap.m.IconTabFilterDesign.Vertical,
				key: "confirmation",
			});
	
			var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_REJECT", {
				icon: "",
				text: "{i18n>LABEL_02160}",
				design: sap.m.IconTabFilterDesign.Vertical,
				key: "reject",
			});
	
			var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE", {
				icon: "",
				text: "{i18n>LABEL_02161}",
				design: sap.m.IconTabFilterDesign.Vertical,
				key: "complete",
			});

			var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR", {
				content: [
					this.getListTableRender(oController)
				],
				items: [oIConFilter1, iConSeperator, oIConFilter2, oIConFilter4, oIConFilter5, oIConFilter6],
				select: oController.handleIconTabBarSelect,
				selectedKey: "All"
			});
	
			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [
					new sap.ui.core.HTML({ content: "<div style='height:5px;'> </div>", preferDOM: false }),
					oFilterVLayout,
					oIConBar
				]			
			});
	
			var oFooterBar = new sap.m.Bar({
				contentLeft: [
					new sap.m.Button({
						text: "{i18n>LABEL_02074}",
						icon : "sap-icon://excel-attachment",
						press : oController.downloadExcel
					}).addStyleClass("act-basic-btn") //actDesign Button Style 적용
				],
				contentRight: [
					new sap.m.Button({
						text: "{i18n>LABEL_02277}",
						icon :"sap-icon://write-new",
						press : oController.createAction
					}).addStyleClass("act-basic-btn") //actDesign Button Style 적용
				]
			});
	
			var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
				content: [oLayout],
				customHeader: new sap.m.Bar({
					contentMiddle: new sap.m.Text({
						text: "{i18n>LABEL_02002}"
					}).addStyleClass("TitleFont"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: common.Common.displayHelp
					})
				}).addStyleClass("L2PHeader"),
				footer: oFooterBar
			}).addStyleClass("WhiteBackground");
	
			return oPage;
		},
	
		/**
		 * Table rendering
		 * 
		 * @param oController
		 * @return sap.m.IconTabBar
		 */
		getListTableRender : function(oController) {
			
			var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				showNoData : true,
				selectionMode: sap.ui.table.SelectionMode.None,
				showOverlay : false,
				enableBusyIndicator : true,
				rowHeight : 38,
				visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
				noData : "{i18n>MSG_02004}",
				rowActionCount : 1,
				rowActionTemplate : new sap.ui.table.RowAction({
					items : [
						new sap.ui.table.RowActionItem({
							icon : "sap-icon://navigation-right-arrow",
							press : oController.onPressRow
						})
					]
				})
			})
			.setModel(mActionReqList)
			.bindRows("/ActionReqListSet")	
			.attachCellClick(oController.onSelectRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			// Column id: Statu, index: 1
			oTable.getColumns()[1].setTemplate(
				new sap.ui.core.Icon({
					src: "sap-icon://accept",
					color: { path: "Statu", formatter: common.Formatter.StatusColor }
				})
			);
	
			// Column id: Eecnt, index: 7
			oTable.getColumns()[7].setTemplate(
				new sap.m.Link({
					text: "{Eecnt}",
					customData: [
						{ key: "Reqno", value: "{Reqno}" },
						{ key: "Docno", value: "{Docno}" }
					]
				})
				.addStyleClass("L2PFontFamily L2PFontColorBlue")
				.attachBrowserEvent("click", oController.displayPopoverActPerson)
			);
			
			// Column id: Datlo, index: 10
			oTable.getColumns()[10].setTemplate(
				new sap.m.Link({
					text: { path: "Datlo", formatter: common.Common.DateFormatter },
					customData: [
						{ key: "Reqno", value: "{Reqno}" },
						{ key: "Docno", value: "{Docno}" }
					]
				})
				.addStyleClass("L2PFontFamily L2PFontColorBlue")
				.attachBrowserEvent("click", oController.displayPopoverActTimeline)
			);
			
			return oTable;
		},

		setActionModel: function() {
			//인사영역 리스트
			var PersaJSONModel = new sap.ui.model.json.JSONModel(),
				vPersaDatas = { PersAreaListSet: [] };

			$.app.getModel("ZHR_ACTIONAPP_SRV").read("/PersAreaListSet", {
				async: false,
				filters: [new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "1")],
				success: function(oData) {
					if (oData && oData.results.length) {
						oData.results.forEach(function(elem) {
							vPersaDatas.PersAreaListSet.push(elem);
						});
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			PersaJSONModel.setData(vPersaDatas);
			sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");

			//정렬대상 리스트
			var mActionAppReqSort = new sap.ui.model.json.JSONModel(),
				vActionAppReqSort = { ActionAppReqSortSet: [] };

			$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionAppReqSortSet", {
				async: false,
				filters: [],
				success: function(oData) {
					if (oData && oData.results.length) {
						vActionAppReqSort.ActionAppReqSortSet.push({ Srtfc: "0000", Srtft: "{i18n>LABEL_02035}" });
						oData.results.forEach(function(elem) {
							vActionAppReqSort.ActionAppReqSortSet.push(elem);
						});
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			mActionAppReqSort.setData(vActionAppReqSort);
			sap.ui.getCore().setModel(mActionAppReqSort, "ActionAppReqSort");

			//정렬방법 리스트
			var mActionAppReqSortType = new sap.ui.model.json.JSONModel(),
				vActionAppReqSortType = { ActionAppReqSortTypeSet: [] };

			$.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionAppReqSortTypeSet", {
				async: false,
				filters: [],
				success: function(oData) {
					if (oData && oData.results.length) {
						vActionAppReqSortType.ActionAppReqSortTypeSet.push({ Srttc: "0000", Srttt: "{i18n>LABEL_02035}" });
						oData.results.forEach(function(elem) {
							vActionAppReqSortType.ActionAppReqSortTypeSet.push(elem);
						});
						
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			mActionAppReqSortType.setData(vActionAppReqSortType);
			sap.ui.getCore().setModel(mActionAppReqSortType, "ActionAppReqSortType");

			//발령품의서 리스트
			var oActionReqList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oActionReqList, "ActionReqList");
			oActionReqList.setSizeLimit(1000);

			//발령대상자 리스트
			var oActionSubjectList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oActionSubjectList, "ActionSubjectList");

			var oActionSubjectListTemp = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oActionSubjectListTemp, "ActionSubjectList_Temp");

			//코드 리스트
			var oEmpCodeList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
			oEmpCodeList.setSizeLimit(5000);

			//사원검색 용 코드 리스트
			var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");

			//발령유형 및 사유 그룹핑
			var mActionAppGrouping = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mActionAppGrouping, "ActionAppGrouping");

			//메일수신자 리스트
			var oActionMailingList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oActionMailingList, "ActionMailingList");

			//확정에 따른 기본 메일발송 리스트
			var mActionMailRecipientList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mActionMailRecipientList, "ActionMailRecipientList");

			//사원검색결과
			var mEmpSearchResult = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");

			//사원검색결과
			var mActionEmpSearchResult = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mActionEmpSearchResult, "ActionEmpSearchResult");

			//문서유형 리스트
			var vDocTypeList = {
				DocTypeListSet: [
					{ Docty: "10", Doctx: "{i18n>LABEL_02061}", PageId: "ZUI5_HR_ActApp.ActAppDocument" },
					{ Docty: "20", Doctx: "{i18n>LABEL_02062}", PageId: "ZUI5_HR_ActApp.ActRecDocument" },
					{ Docty: "30", Doctx: "{i18n>LABEL_02063}", PageId: "ZUI5_HR_ActApp.ActOrgDocument" }
				]
			};

			var mDocTypeList = new sap.ui.model.json.JSONModel();
			mDocTypeList.setData(vDocTypeList);
			sap.ui.getCore().setModel(mDocTypeList, "DocTypeList");

			// 국가 코드 리스트
			var oNatioList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oNatioList, "NatioList");
			var vCode = {
				natioCode: [] // 국가
			};

			// 국가코드
			$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
				async: false,
				filters: [
					new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Natio"),
					new sap.ui.model.Filter("PersaNc", sap.ui.model.FilterOperator.EQ, "X")
				],
				success: function(oData) {
					if (oData && oData.results.length) {
						oData.results.forEach(function(elem) {
							vCode.natioCode.push(elem);
						});
						oNatioList.setData(vCode);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			// 자격증유형 코드 리스트
			var oCttypList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oCttypList, "CttypList");

			//전공코드 리스트
			var oFaartCodeList = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oFaartCodeList, "FaartCodeList");
			oEmpCodeList.setSizeLimit(3000);

			var mOneCodeModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(mOneCodeModel, "CodeListModel");
		}
	});
});