/* eslint-disable no-undef */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"common/SearchEmpProfile",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/export/Spreadsheet",
        "common/moment-with-locales"
	],
	function (Common, CommonController, JSONModelHelper, SearchEmpProfile, BusyIndicator, MessageBox, Spreadsheet) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",
			
			_PromotionModel: new JSONModelHelper(),

			_curNavi: "ALL",

			getUserId: function() {

				return this.getView().getModel("session").getData().name;
			},

            onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow
					}, this);
			},

            onBeforeShow: function () {
				this.initPromtionModel.call(this);

				// Set PromoF4
				this.onLoadPromoF4.call(this);
				
				// Set PromoList
				this.onLoadPromoList.call(this);
			},

			initPromtionModel: function() {
				var oPromotionModel = {};

				oPromotionModel.PromoF4 = {};
				oPromotionModel.PromoF4.OrgehCodes = [];

				oPromotionModel.PromoList = {};
				oPromotionModel.PromoList.TotalListCnt = 0;
				oPromotionModel.PromoList.RecommandOnly = false;
				oPromotionModel.PromoList.isShowProcessButtons = false;
				oPromotionModel.PromoList.GradeByPernr = {};
				oPromotionModel.PromoList.PromoListExport = {};
				oPromotionModel.PromoList.Grades = [];
				oPromotionModel.PromoList.PromoListTable1 = [];
				oPromotionModel.PromoList.PromoListTable1_original = [];
				
				this._PromotionModel.setData(oPromotionModel);
			},

			onLoadPromoF4: function() {
				var oModel = $.app.getModel("ZHR_PROMOTION_SRV"),
					vPernr = this.getUserId(),
					vCurDateDT = moment().hours(10).toDate(),
					oPayload = {},
					errData = {};

				// Header
				oPayload.IOdkey = "";
				oPayload.IPernr = vPernr;
				oPayload.IDatum = vCurDateDT;

				// Navigaion property
				oPayload.Promonav = [];			// 안내문구
				oPayload.PromoTablenav = [];	// 평가년도/조직

				oModel.create("/PromoF4ImportSet", oPayload, {
					success: function(data) {
						if(data.Promonav) {
							this._PromotionModel.setProperty("/PromoF4/Zcomment", data.Promonav.results[0].Zcomment);
						}

						if(data.PromoTablenav) {
							this._PromotionModel.setProperty("/PromoF4/Orgeh", data.PromoTablenav.results[0].Orgeh);
							this._PromotionModel.setProperty("/PromoF4/Zyear", data.PromoTablenav.results[0].Zyear);
							this._PromotionModel.setProperty("/PromoF4/OrgehCodes", data.PromoTablenav.results);
						}
					}.bind(this),
					error: function(res) {
						errData = Common.parseError(res);
					}
				});

				if(errData.Error && errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: this.getBundleText("LABEL_00150")	// 확인
					});
					
					return;
				}
			},

			onChangeOrgeh: function(oEvent) {
				var oSelectedOrgeh = oEvent.getSource().getSelectedItem(),
					vZyear = oSelectedOrgeh.getCustomData()[0].getValue();

				if(!vZyear) {
					return;
				}

				// 선택된 값의 Zyear를 Model에 update
				this._PromotionModel.setProperty("/PromoF4/Zyear", vZyear);

				// PromoListImport(전체승진) 조회
				this.onLoadPromoList.call(this);
			},

			callPromoListImport: function(fnOnSuccess, fnOnError) {
				var oModel = $.app.getModel("ZHR_PROMOTION_SRV"),
					vPernr = this.getUserId(),
					vCurDateDT = moment().hours(10).toDate(),
					vOrgeh = this._PromotionModel.getProperty("/PromoF4/Orgeh"),
					vZyear = this._PromotionModel.getProperty("/PromoF4/Zyear"),
					oPayload = {};

				if(!vOrgeh || !vZyear) {
					return null;
				}

				BusyIndicator.show(0);

				// Set Header
				oPayload.IOdkey = "";
				oPayload.IPernr = vPernr;
				oPayload.IDatum = vCurDateDT;
				oPayload.IYear = vZyear;
				oPayload.IOrgeh = vOrgeh;

				// Set Navigation property
				oPayload.PromoListExportSet = [];	// 인원count
				oPayload.PromoListTable1Set = [];	// 승진 전체 목록
				oPayload.PromoListTable2Set = [];	// 직급 목록

				// Call service
				oModel.create("/PromoListImportSet", oPayload, {
					async: true,
					success: function(data) {
						if(fnOnSuccess && typeof fnOnSuccess === "function") {
							fnOnSuccess.call(this, data);
						}

						BusyIndicator.hide();
					}.bind(this),
					error: function(res) {
						if(fnOnError && typeof fnOnError === "function") {
							fnOnError.call(this, res);
						}

						BusyIndicator.hide();
					}.bind(this)
				});
			},

			reloadCount: function() {
				var fnOnSuccess = function(data) {
					if(data && data.PromoListExportSet) {
						var vExportData = data.PromoListExportSet.results[0];
	
						vExportData.EIng = vExportData.EIng || "0";
						vExportData.EFinish = vExportData.EFinish || "0";
	
						this._PromotionModel.setProperty("/PromoList/PromoListExport/EIng", vExportData.EIng);
						this._PromotionModel.setProperty("/PromoList/PromoListExport/EFinish", vExportData.EFinish);
					}
				}.bind(this);

				this.callPromoListImport.apply(this, [fnOnSuccess, null]);
			},

			toggleTableHeaderColumns: function() {
				var vExportData = this._PromotionModel.getProperty("/PromoList/PromoListExport");

				if(vExportData.ELicense) {
					$.app.byId("List_TableLicensePnt").setVisible(true);
				} else {
					$.app.byId("List_TableLicensePnt").setVisible(false);
				}
				if(vExportData.EEdu) {
					$.app.byId("List_TableEduPnt").setVisible(true);
				} else {
					$.app.byId("List_TableEduPnt").setVisible(false);
				}
				if(vExportData.EIdea) {
					$.app.byId("List_TableIdeaPnt").setVisible(true);
				} else {
					$.app.byId("List_TableIdeaPnt").setVisible(false);
				}
			},

			onLoadPromoList: function() {
				var oTable = $.app.byId(this.PAGEID + "_Table"),
					oSideNavigation = $.app.byId("sideNavigation"),
					oGradeByPernr = {},
					_curScrollIndex = 0;

				// Get current scroll index
				if(oTable.getRows().length > 1) {
					_curScrollIndex = oTable.getRows()[0].getIndex();
				}

				// PromoList data clear
				this._PromotionModel.setProperty("/PromoList", {TotalListCnt: 0, RecommandOnly: false, PromoListTable1: [], PromoListTable1_original: [], Grades: []});

				// Only recommand filter remove
				oTable.getBinding("rows").filter(null);

				// Side navigation select ALL
				this._curNavi = "ALL";
				oSideNavigation.setSelectedKey("ALL");

				var fnOnSuccess = function(data) {
					if(!data) return;

					if(data.PromoListExportSet) {
						var vExportData = data.PromoListExportSet.results[0];

						vExportData.ETotal = vExportData.ETotal || "0";
						vExportData.EIng = vExportData.EIng || "0";
						vExportData.EFinish = vExportData.EFinish || "0";
						vExportData.EChu = vExportData.EChu || "0";
						vExportData.ELicense = vExportData.ELicense || "";
						vExportData.EEdu = vExportData.EEdu || "";
						vExportData.EIdea = vExportData.EIdea || "";
						vExportData.EHrAdm = vExportData.EHrAdm || "";
						
						this._PromotionModel.setProperty("/PromoList/PromoListExport", vExportData);

						this.toggleTableHeaderColumns();
					}

					if(data.PromoListTable1Set) {
						// 비교용 원본 데이터 생성, 추천진행중(B2)인 건이 있는지 확인
						var aRecvDatas = data.PromoListTable1Set.results,
							vEHrAdm = this._PromotionModel.getProperty("/PromoList/PromoListExport/EHrAdm"),
							vShowProcBtn = false;

						var aOriginalInputDatas = aRecvDatas.map(function(elem) {
							if(vEHrAdm !== "X" && elem.PrStatus === "B2") {
								vShowProcBtn = true;
							}

							// 사번별 RecGrade 관리
							oGradeByPernr[elem.Pernr] = parseInt(elem.RecSeqGrade) || 0;

							return { RecSeqGrade: elem.RecSeqGrade };
						});
						
						this._PromotionModel.setProperty("/PromoList/GradeByPernr", oGradeByPernr);
						this._PromotionModel.setProperty("/PromoList/PromoListTable1", aRecvDatas);
						this._PromotionModel.setProperty("/PromoList/PromoListTable1_original", aOriginalInputDatas);
						this._PromotionModel.setProperty("/PromoList/TotalListCnt", oTable.getBinding("rows").getLength());
						this._PromotionModel.setProperty("/PromoList/isShowProcessButtons", vShowProcBtn);
						this._PromotionModel.refresh();
					}
	
					if(data.PromoListTable2Set) {
						this._PromotionModel.setProperty("/PromoList/Grades", data.PromoListTable2Set.results);
					}

					if(_curScrollIndex) {
						oTable.setFirstVisibleRow(_curScrollIndex);
					}
				}.bind(this);

				var fnOnError = function(res) {
					var errData = Common.parseError(res);

					if(errData.Error && errData.Error === "E") {
						MessageBox.error(errData.ErrorMessage, {
							title: this.getBundleText("LABEL_00150")	// 확인
						});
						
						return;
					}
				}.bind(this);

				// caal odata
				this.callPromoListImport.apply(this, [fnOnSuccess, fnOnError]);
			},

			onLoadPromoGList: function(vGrade) {
				var oModel = $.app.getModel("ZHR_PROMOTION_SRV"),
					oTable = $.app.byId(this.PAGEID + "_Table"),
					vPernr = this.getUserId(),
					vCurDateDT = moment().hours(10).toDate(),
					vOrgeh = this._PromotionModel.getProperty("/PromoF4/Orgeh"),
					vZyear = this._PromotionModel.getProperty("/PromoF4/Zyear"),
					oGradeByPernr = this._PromotionModel.getProperty("/PromoList/GradeByPernr") || {},
					_curScrollIndex = 0,
					oPayload = {},
					errData = {};

				// Get current scroll index
				if(oTable.getRows().length > 1) {
					_curScrollIndex = oTable.getRows()[0].getIndex();
				}

				// PromoList data clear
				this._PromotionModel.setProperty("/PromoList/PromoListTable1", []);
				this._PromotionModel.setProperty("/PromoList/PromoListTable1_original", []);
				this._PromotionModel.setProperty("/PromoList/PromoListExport/EChu", "0");

				if(!vOrgeh || !vZyear || !vGrade) {
					return;
				}

				BusyIndicator.show(0);

				// Set Header
				oPayload.IOdkey = "";
				oPayload.IGubun = "D";
				oPayload.IPernr = vPernr;
				oPayload.IDatum = vCurDateDT;
				oPayload.IYear = vZyear;
				oPayload.IOrgeh = vOrgeh;
				oPayload.IGrade = vGrade;

				// Set Navigation property
				oPayload.PromoGListnav = [];	// 인원count
				oPayload.PromoGListTabnav = [];	// 승진 목록

				// Call service
				oModel.create("/PromoGListImportSet", oPayload, {
					async: true,
					success: function(data) {
						if(data.PromoGListTabnav) {
							var aRecvDatas = data.PromoGListTabnav.results,
								vEHrAdm = this._PromotionModel.getProperty("/PromoList/PromoListExport/EHrAdm"),
								vShowProcBtn = false;
							
							// 비교용 원본 데이터 생성
							var aOriginalInputDatas = aRecvDatas.map(function(elem) {
								if(vEHrAdm !== "X" && elem.PrStatus === "B2") {
									vShowProcBtn = true;
								}

								// 사번별 RecGrade 관리
								oGradeByPernr[elem.Pernr] = parseInt(elem.RecSeqGrade) || 0;

								return { RecSeqGrade: elem.RecSeqGrade };
							});
							
							this._PromotionModel.setProperty("/PromoList/GradeByPernr", oGradeByPernr);
							this._PromotionModel.setProperty("/PromoList/PromoListTable1", aRecvDatas);
							this._PromotionModel.setProperty("/PromoList/PromoListTable1_original", aOriginalInputDatas);
							this._PromotionModel.setProperty("/PromoList/TotalListCnt", oTable.getBinding("rows").getLength());
							this._PromotionModel.setProperty("/PromoList/isShowProcessButtons", vShowProcBtn);
							this._PromotionModel.refresh();

							if(_curScrollIndex) {
								oTable.setFirstVisibleRow(_curScrollIndex);
							}
						}

						if(data.PromoGListnav) {
							var vExportData = data.PromoGListnav.results[0];

							this._PromotionModel.setProperty("/PromoList/PromoListExport/ELicense", vExportData.ELicense || "");
							this._PromotionModel.setProperty("/PromoList/PromoListExport/EEdu", vExportData.EEdu || "");
							this._PromotionModel.setProperty("/PromoList/PromoListExport/EIdea", vExportData.EIdea || "");

							this.toggleTableHeaderColumns();
						}

						this.setRecommandInfoCounts.call(this);

						BusyIndicator.hide();
					}.bind(this),
					error: function(res) {
						errData = Common.parseError(res);

						BusyIndicator.hide();
					}
				});

				if(errData.Error && errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: this.getBundleText("LABEL_00150")	// 확인
					});
					
					return;
				}
			},

			reloadList: function() {
				if(this._curNavi === "ALL") {
					this.onLoadPromoList.call(this);
				} else {
					this.onLoadPromoGList.call(this, this._curNavi);
				}
			},

			onSelectNaviAll: function() {
				if(this._curNavi === "ALL") {
					return false;
				}
				
				this._curNavi = "ALL";

				// 변경 내용 확인 후 조회
				this.compareOriginalData.call(this);
			},
			
			onSelectNavi: function(oEvent) {
				var vKey = oEvent.getParameter("item").getKey();

				if(this._curNavi === vKey) {
					return false;
				}

				this._curNavi = vKey;
				
				// 변경 내용 확인 후 조회
				this.compareOriginalData.call(this);
			},

			compareOriginalData: function() {
				var aOriginalInputDatas = this._PromotionModel.getProperty("/PromoList/PromoListTable1_original"),
					aTableDatas = this._PromotionModel.getProperty("/PromoList/PromoListTable1"),
					bChanges = false;

				aOriginalInputDatas.some(function(elem, idx) {
					var vTableData = aTableDatas[idx];

					if(parseInt(elem.RecSeqGrade) !== parseInt(vTableData.RecSeqGrade)) {
						bChanges = true;

						return true;
					}
				});

				if(bChanges) {
					MessageBox.confirm(this.getBundleText("MSG_13002"), {	// 변경된 값이 있습니다.\n저장하시겠습니까?
						title: this.getBundleText("LABEL_00150"),	// 확인
						actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
						onClose: function(v) {
							if(v === sap.m.MessageBox.Action.OK) {
								// 저장
								this.callSaveProcess.call(this, "S");
							} else {
								// 조회
								this.reloadList.call(this);
							}
						}.bind(this)
					});
				} else {
					// 조회
					this.reloadList.call(this);
				}
			},
			
			onCollapseExpandPress: function() {
				var oSideNavigationWrap = $.app.byId("sideNavigation"),
					oNavigationBox = $.app.byId("sideNavigationBox"),
					oListBox = $.app.byId("listBox"),
					bExpanded = oSideNavigationWrap.getExpanded();

				oSideNavigationWrap.setExpanded(!bExpanded);
				oNavigationBox.toggleStyleClass("collapse", bExpanded);
				oListBox.toggleStyleClass("expanded", bExpanded);
			},

			onSelectRecommandOnly: function(oEvent) {
				var oTable = $.app.byId(this.PAGEID + "_Table"),
					vSelected = oEvent.getParameter("selected"),
					oFilter = null;

				if(vSelected) {
					oFilter = new sap.ui.model.Filter("RecSeqGrade", sap.ui.model.FilterOperator.GT, 0);
				}

				oTable.getBinding("rows").filter(oFilter);
				this._PromotionModel.setProperty("/PromoList/TotalListCnt", oTable.getBinding("rows").getLength());

				this.setProcessButtons.call(this);
			},

			setProcessButtons: function() {
				var oTable = $.app.byId(this.PAGEID + "_Table"),
					aContexts = oTable.getBinding("rows").getContexts(),
					vEHrAdm = this._PromotionModel.getProperty("/PromoList/PromoListExport/EHrAdm"),
					vShowProcBtn = false;
				
				if(vEHrAdm !== "X") {
					aContexts.some(function(oContext) {
						if(this._PromotionModel.getProperty(oContext.getPath() + "/PrStatus") === "B2") {
							vShowProcBtn = true;
	
							return true;
						}
					}.bind(this));
				}
				
				this._PromotionModel.setProperty("/PromoList/isShowProcessButtons", vShowProcBtn);
			},
			
			onPressExcelDownload: function() {
				var oView = $.app.getView(),
					oTable = $.app.byId(this.PAGEID + "_Table"),
					oTableModel = oTable.getModel(),
					aVisibleContexts = oTable.getBinding("rows").getContexts(),
					aTableDatas = [];

				aTableDatas = aVisibleContexts.map(function(oContext) {
					return oTableModel.getProperty(oContext.getPath());
				});

				if (!aTableDatas || !aTableDatas.length) {
					MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: aTableDatas,
					workbook: {columns: Common.convertColumnArrayForExcel(this, oView._colModel)},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_13001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
			},
			
			onPressSave: function() {

				MessageBox.confirm(this.getBundleText("MSG_13005"), {	// 저장하시겠습니까?
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

			findColumnIndexById: function(vColumnId) {
				var oView = $.app.getView(),
					vColumnIndex = 0;

				oView._colModel.some(function(oColInfo, index) {
					if(oColInfo.id === vColumnId) {
						vColumnIndex = index;

						return true;
					}
				});

				return vColumnIndex;
			},

			// vPernr과 사번이 일치하는 Row를 찾아서 Input에 focus
			setTableInputFocus: function(oTable, columnId, vPernr) {
				var columnIndex = this.findColumnIndexById(columnId),
					oInput = null,
					vInputSPath = "";

				oTable.getRows().some(function(oRow) {
					oInput = oRow.getCells()[columnIndex];
					vInputSPath = oRow.getBindingContext().getPath() + "/State" + columnId;

					if(vPernr === oInput.getCustomData()[1].getKey()) {
						// Set valueState Error
						this._PromotionModel.setProperty(vInputSPath, sap.ui.core.ValueState.Error);
						// Set focus
						oInput.focus();

						return true;
					}
				}.bind(this));
			},
			
			onPressRcmComplete: function() {
				var oTable = $.app.byId(this.PAGEID + "_Table"),
					aTableDatas = this._PromotionModel.getProperty("/PromoList/PromoListTable1"),
					sIdx = 0,
					vPernr = "",
					vFocusFieldId = "",
					vWarningMsg = "",
					vGradeDatas = {},
					vGradeCountDatas = {},
					vRecSeqGrade = 0,
					isValid = true,
					confirmMessage = "";

				aTableDatas.some(function(elem, index) {
					sIdx = index;
					vPernr = elem.Pernr || "";
					vRecSeqGrade = parseInt(elem.RecSeqGrade || 0);

					// 직급별 추천인원 수
					if(!vGradeCountDatas[elem.ZpGradeTo]) {
						vGradeCountDatas[elem.ZpGradeTo] = 0;
					}

					if(vRecSeqGrade > 0) {
						// 추천된 인원수
						vGradeCountDatas[elem.ZpGradeTo]++;

						// C.동일직급내 추천서열(동일직급내)값이 중복된 경우
						if(!Array.isArray(vGradeDatas[elem.ZpGradeTo])) {
							vGradeDatas[elem.ZpGradeTo] = [];
						}
						
						if(vGradeDatas[elem.ZpGradeTo].indexOf(vRecSeqGrade) > -1) {
							vFocusFieldId = "RecSeqGrade";
							vWarningMsg = this.getBundleText("MSG_13009").interpolate(elem.PGradeTxt, vRecSeqGrade);	// <현직급> 직급의 추천서열(동일직급내) 값 <중복된 추천서열 값>번이 중복되었습니다.
							isValid = false;

							return true;
						} else {
							vGradeDatas[elem.ZpGradeTo].push(vRecSeqGrade);
						}
					}
				}.bind(this));

				if(!isValid) {
					// 해당 index로 scroll
					oTable.setFirstVisibleRow(sIdx === 0 ? 0 : sIdx - 1);

					MessageBox.error(vWarningMsg, {
						title : this.getBundleText("LABEL_00149"),
						onClose: function() {
							// 해당 Input에 포커스
							this.setTableInputFocus.apply(this, [oTable, vFocusFieldId, vPernr]);
						}.bind(this)
					});

					return false;
				}

				confirmMessage = (Object.keys(vGradeCountDatas).some(function(key) { return vGradeCountDatas[key] === 0; })) 
								? this.getBundleText("MSG_13012") 	// 추천서열이 입력되지 않았습니다.\n미추천으로 완료하시겠습니까?
								: this.getBundleText("MSG_13006");	// 추천완료하시겠습니까?

				MessageBox.confirm(confirmMessage, {
					title: this.getBundleText("LABEL_00150"),	// 확인
					actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
					onClose: function(v) {
						if(v === sap.m.MessageBox.Action.OK) {
							// 완료
							this.callSaveProcess.call(this, "C");
						}
					}.bind(this)
				});
			},

			callSaveProcess: function(vGubun) {
				var oModel = $.app.getModel("ZHR_PROMOTION_SRV"),
					vPernr = this.getUserId(),
					vCurDateDT = moment().hours(10).toDate(),
					vOrgeh = this._PromotionModel.getProperty("/PromoF4/Orgeh"),
					vZyear = this._PromotionModel.getProperty("/PromoF4/Zyear"),
					aTableDatas = [],
					oPayload = {},
					vSuccessMsg = "",
					errData = {};

				BusyIndicator.show(0);

				// Set Header
				oPayload.IOdkey = "";
				oPayload.IGubun = vGubun;	// S-저장, C-완료
				oPayload.IPernr = vPernr;
				oPayload.IDatum = vCurDateDT;
				oPayload.IYear = vZyear;
				oPayload.IOrgeh = vOrgeh;
				oPayload.IGrade = this._curNavi === "ALL" ? undefined : this._curNavi;

				aTableDatas = this._PromotionModel.getProperty("/PromoList/PromoListTable1").map(function(vRowData) {
					return Common.copyByMetadata(oModel, "PromoGListTab", vRowData);
				});

				// Set Navigation property
				oPayload.PromoGListnav = [];	// 인원count
				oPayload.PromoGListTabnav = aTableDatas;	// 승진 목록

				// Call service
				oModel.create("/PromoGListImportSet", oPayload, {
					async: true,
					success: function() {
						vSuccessMsg = (vGubun === "S") ? this.getBundleText("MSG_13003") : this.getBundleText("MSG_13004");

						MessageBox.success(vSuccessMsg, {
							title : this.getBundleText("LABEL_00150"),	// 확인
							onClose : function() {
								// 목록 재조회
								this.reloadList.call(this);
								// 추천 완료시 PromoList-PromoListExport 재조회
								if(vGubun === "C") {
									this.reloadCount.call(this);
								}
							}.bind(this)
						});

						BusyIndicator.hide();
					}.bind(this),
					error: function(res) {
						errData = Common.parseError(res);

						BusyIndicator.hide();
					}
				});

				if(errData.Error && errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: this.getBundleText("LABEL_00150")	// 확인
					});
					
					return;
				}
			},

			onLiveChangeRecSeqGrade: function(oEvent) {
				var oInput = oEvent.getSource(),
					vNotes = oEvent.getSource().getBindingContext().getProperty().Notes;

				var ConfirmNoteCheck = function(v) {
					if(v === sap.m.MessageBox.Action.CANCEL) {
						oInput.setValue("");
					}

					this.changeModelValueEvent.call(this, oInput);
				};

				if(vNotes && vNotes.length && oInput.getValue()) {
					MessageBox.confirm(this.getBundleText("MSG_13013"), {	// 결격사유가 있는 대상자 입니다.\n추천하시겠습니까?
						title: this.getBundleText("LABEL_00150"),	// 확인
						actions: [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
						onClose: ConfirmNoteCheck.bind(this)
					});
				} else {
					this.changeModelValueEvent.call(this, oInput);
				}
			},

			changeModelValueEvent: function(oInput) {
				// Model data update
				this.updateModelTableValue.call(this, oInput);
	
				// Set display count
				this.setRecommandInfoCounts.call(this);
			},

			setRecommandInfoCounts: function() {
				var vTableDatas = this._PromotionModel.getProperty("/PromoList/PromoListTable1"),
					vRecommandCount = 0;

				vTableDatas.forEach(function(elem) {
					if(!isNaN(elem.RecSeqGrade) && parseInt(elem.RecSeqGrade) > 0) {
						vRecommandCount++;
					}
				});

				this._PromotionModel.setProperty("/PromoList/PromoListExport/EChu", String(vRecommandCount));
			},

			updateModelTableValue: function(oSource) {
				var sPath = oSource.getBindingContext().getPath(),
					pathId = oSource.getCustomData()[0].getKey(),
					vPernr = oSource.getCustomData()[1].getKey(),
					vNewValue = oSource.getValue(),
					aGradeByPernr = [],
					vEIng = 0;

				oSource.setValueState(sap.ui.core.ValueState.None);
				this._PromotionModel.setProperty(sPath + "/" + pathId, vNewValue);

				// 추천 진행중 Count
				aGradeByPernr = this._PromotionModel.getProperty("/PromoList/GradeByPernr");
				vEIng = parseInt(this._PromotionModel.getProperty("/PromoList/PromoListExport/EIng"));

				// 유효하지 않은 값
				if(!vNewValue || isNaN(vNewValue) || parseInt(vNewValue) === 0) {
					// 이전 값이 0보다 클 경우 진행중 카운트 down
					if(aGradeByPernr[vPernr] && aGradeByPernr[vPernr] > 0) vEIng--;
				// 유효한 값
				} else {
					// 이전 값이 0일 경우 진행준 카운트 up
					if(!aGradeByPernr[vPernr] || aGradeByPernr[vPernr] === 0) vEIng++;
				}

				aGradeByPernr[vPernr] = parseInt(vNewValue) || 0;
				this._PromotionModel.setProperty("/PromoList/PromoListExport/EIng", String(vEIng));

				// 사번별 RecSeqGrade update
				this._PromotionModel.setProperty("/PromoList/GradeByPernr", aGradeByPernr);
			},

			onPressEmpProfileDialog: function(oEvent) {
				Common.log("onPressEmpProfileDialog", oEvent.getSource().getBindingContext().getProperty());

				if (!this.EmpProfileDialog) {
					this.EmpProfileDialog = sap.ui.jsfragment("fragment.EmpProfile", this);
					this.getView().addDependent(this.EmpProfileDialog);
				}
		
				SearchEmpProfile.oController = this;
				SearchEmpProfile.Disty = "1";
				SearchEmpProfile.userId = oEvent.getSource().getBindingContext().getProperty().Pernr;
		
				this.EmpProfileDialog.open();
			},

			/**
			 * @TAbleCustomTemplates 
			 * 
			 */
			getPtypeText: function(columnInfo) {
				return new sap.ui.commons.TextView({
					text: {
						parts: [
							{ path: "Ptype" }, 
							{ path: columnInfo.id }
						],
						formatter: function (v1, v2) {
							if(v1 === "N") {	// 정기
								this.toggleStyleClass("color-signature-blue", true);
							} else {
								this.toggleStyleClass("color-signature-blue", false);
							}
							
							return v2;
						}
					},
					textAlign: "Center"
				}).addStyleClass("FontFamily");
			},

			getEnameLink: function(columnInfo, oController) {
				return new sap.m.Link({
					text: "{Ename}",
					textAlign: "Center",
					press: oController.onPressEmpProfileDialog.bind(oController)
				}).addStyleClass("FontFamily");
			},

			getYearText: function(columnInfo) {
				return new sap.ui.commons.TextView({
					text: {
						path: columnInfo.id,
						formatter: function (v) {
							if(v && v !== "0000") {
								return v;
							} else {
								return "";
							}
						}
					},
					textAlign: "Center"
				}).addStyleClass("FontFamily");
			},

			getRecSeqGradeInput: function(columnInfo, oController) {
				return new sap.m.Input({
					value: {
						path: columnInfo.id,
						formatter: function(v) {
							return (v && !isNaN(v) && v !== "000") ? String(parseInt(v)) : "";
						}
					},
					placeholder: oController.getBundleText("LABEL_13065"),	// 미추천
					liveChange: oController.onLiveChangeRecSeqGrade.bind(oController),
					type: sap.m.InputType.Number,
					textAlign: sap.ui.core.TextAlign.Center,
					valueState: "{StateRecSeqGrade}",
					showValueStateMessage: false,
					editable: {
						parts: [
							{path: "PrStatus"},
							{path: "/PromoList/PromoListExport/EHrAdm"}
						],
						formatter: function(v1, v2) {
							if(v1 === "B2" && v2 !== "X") {
								return true;
							} else {
								return false;
							}
						}
					},
					customData: [ 
						new sap.ui.core.CustomData({key: columnInfo.id}),
						new sap.ui.core.CustomData({key: "{Pernr}"}) 
					]
				}).addStyleClass("FontFamily");
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				// return new JSONModelHelper({name: "00917034"});
				return new JSONModelHelper({name: "00926020"});
			} : null
        });
    }
);