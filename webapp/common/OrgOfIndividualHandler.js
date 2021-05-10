/* eslint-disable no-undef */
sap.ui.define(
    [
        "./Common", //
        "./SearchUser1",
        "./SearchOrg",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, SearchUser1, SearchOrg, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
			oController: null,
			oDialog: null,
			oEmployeeSearchDialog: null,
			oOrgSearchDialog: null,
            oModel: new JSONModel(),
			
			callback: null,
			autoClose: true,
			zFlag: false,	// 전문직 사원만 보여주는 flag
			Zshft: false,	// 교대근무자 보여주는 flag
            
            // DialogHandler 호출 function
			get: function(oController, initData, callback) {

				this.oController = oController;
				this.callback = callback;
				this.autoClose = Common.isNull(initData.autoClose) ? true : initData.autoClose; 
				this.zFlag = Common.isNull(initData.Zflag) ? false : initData.Zflag; 
				this.Zshft = Common.isNull(initData.Zshft) ? false : initData.Zshft; 

				this.oModel.setProperty("/Percod", initData.Percod || "");
				this.oModel.setProperty("/Bukrs", initData.Bukrs || "");
				this.oModel.setProperty("/Langu", initData.Langu || "");
				this.oModel.setProperty("/Molga", initData.Molga || "");
				this.oModel.setProperty("/Datum", initData.Datum || "");
				this.oModel.setProperty("/Mssty", initData.Mssty || "");

				return this;
			},

			// DialogHandler 호출 function
			getLoadingProperties: function() {

				return {
					id: "OrgOfIndividualDialog",
					name: "fragment.OrgOfIndividual",
					type: "JS",
					controller: this.oController
				};
			},

			// DialogHandler 호출 function
			getParentView: function() {

				return this.oController.getView();
			},

			// DialogHandler 호출 function
			getModel: function() {

				return this.oModel;
			},

			// DialogHandler 호출 function
			getDialog: function() {

				return this.oDialog;
			},

			// DialogHandler 호출 function
			setDialog: function(oDialog) {

				this.oDialog = oDialog;

				return this;
			},

			getTree: function() {
				return $.app.byId("OrganizationTree");
			},

			onBeforeOpen: function() {
				var oTree = this.getTree();

				oTree.setBusyIndicatorDelay(0);
				oTree.setBusy(true);

				return Common.getPromise(function() {
					var oModel = this.getModel(),
						Percod = oModel.getProperty("/Percod"),
						Bukrs = oModel.getProperty("/Bukrs"),
						Langu = oModel.getProperty("/Langu"),
						Molga = oModel.getProperty("/Molga"),
						Datum = oModel.getProperty("/Datum"),
						Mssty = oModel.getProperty("/Mssty");

					if(oModel.getProperty("/MyOrgeh")) return;
			
					$.app.getModel("ZHR_COMMON_SRV").read("/OrgehTreeAuthSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("IPercod", sap.ui.model.FilterOperator.EQ, Percod),	//
							new sap.ui.model.Filter("IBukrs", sap.ui.model.FilterOperator.EQ, Bukrs),	//
							new sap.ui.model.Filter("ILangu", sap.ui.model.FilterOperator.EQ, Langu),	//
							new sap.ui.model.Filter("IMolga", sap.ui.model.FilterOperator.EQ, Molga),	//
							new sap.ui.model.Filter("IDatum", sap.ui.model.FilterOperator.EQ, Datum),	//
							new sap.ui.model.Filter("IMssty", sap.ui.model.FilterOperator.EQ, Mssty),	//
							new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
							new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
							new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
							new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
						],
						success: function(data) {
							if(data.results.length) {
								oModel.setProperty("/MyOrgeh", data.results);
								oModel.setProperty("/Orgeh", data.results[0].Orgeh);
							}
						},
						error: function(error) {
							Common.log(error);
						}
					});

					if(Common.checkNull(oModel.getProperty("/Orgeh"))) return;

					this.loadTreeData(null, oModel.getProperty("/Orgeh"), "00000000");
				}.bind(this))
				.then(function() {
					oTree.removeSelections().expandToLevel(1).setBusy(false);
				});
			},

			/**
			 * 조직도 데이터를 조회한다.
			 * 
			 * @param {string} sPath - 가져온 조직데이터가 들어갈 위치(null이면 최상위)
			 * @param {string} vOrgeh - 검색할 조직코드
			 * @param {string?} rootId - 최상위 Objid(null이면 vOrgeh가 대신한다.)
			 */
			loadTreeData: function(sPath, vOrgeh, rootId) {
				if(Common.checkNull(vOrgeh)) return;

				var oModel = this.getModel(),
					Percod = oModel.getProperty("/Percod"),
					Bukrs = oModel.getProperty("/Bukrs"),
					Langu = oModel.getProperty("/Langu"),
					Molga = oModel.getProperty("/Molga"),
					Datum = oModel.getProperty("/Datum");

				$.app.getModel("ZHR_COMMON_SRV").read("/OrgehTreeTotSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("IPercod", sap.ui.model.FilterOperator.EQ, Percod),	//
						new sap.ui.model.Filter("IOrgeh", sap.ui.model.FilterOperator.EQ, vOrgeh),	//
						new sap.ui.model.Filter("IBukrs", sap.ui.model.FilterOperator.EQ, Bukrs),	//
						new sap.ui.model.Filter("ILangu", sap.ui.model.FilterOperator.EQ, Langu),	//
						new sap.ui.model.Filter("IMolga", sap.ui.model.FilterOperator.EQ, Molga),	//
						new sap.ui.model.Filter("IDatum", sap.ui.model.FilterOperator.EQ, Datum),	//
						new sap.ui.model.Filter("IOrgAll", sap.ui.model.FilterOperator.EQ, ""),		//
						new sap.ui.model.Filter("INoP", sap.ui.model.FilterOperator.EQ, ""),		//
						new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
					success: function(data) {
						if(data.results) {
							// 전문직만 보여준다.
							if(this.zFlag) {
								data.results = data.results.filter(function(elem) {
									if(this.Zshft) {	// 교대조 포함
										return elem.Otype === "O" || elem.Zflag === "X" || elem.Zshft === "X";
									} else {
										return elem.Otype === "O" || elem.Zflag === "X";
									}
								}.bind(this));
							} else {
								if(this.Zshft) { // 전문직 프래그가 false이고 교대조 플래그가 true이면 리스트에서 교대조를 제외한다.
									data.results = data.results.filter(function(elem) {
										return elem.Otype === "O" || elem.Zshft !== "X";
									});
								}
							}

							oModel.setProperty(
								sPath ? sPath + "/nodes" : "/TreeData", 
								this.getTransformTreeData(data.results, rootId ? rootId : vOrgeh)
							);
						}
					}.bind(this),
					error: function(error) {
						Common.log(error);
					}
				});
			},

			/**
			 * 조직도 collapse expand event
			 * expand 이벤트일 경우 child nodes 조회
			 * 
			 * @param {Object} oEvent - Tree toggle event object
			 */
			onToggleOpenState: function(oEvent) {
				var oItemContext = oEvent.getParameter("itemContext"),
					bExpanded = oEvent.getParameter("expanded"),
					sPath = oItemContext.getPath(),
					oModel = this.getModel(),
					bChildIsDummyNode = oModel.getProperty(sPath + "/nodes/0").dummy === true;
				
				if (bExpanded && bChildIsDummyNode) {
					var oTree = this.getTree();

					oTree.setBusyIndicatorDelay(0);
					oTree.setBusy(true);

					Common.getPromise(function() {
						this.loadTreeData(sPath, oModel.getProperty(sPath + "/Objid"));
					}.bind(this)).then(function() {
						oTree.setBusy(false);
					});
				}
			},

			/**
			 * 조직도 아이템 선택 event
			 * 선택된 아이템(사원/조직)을 callback함수로 전송한다.
			 * 
			 * @param {Object} oEvent - Tree item select event object
			 */
			selectTreeItem: function(oEvent) {

				if (this.callback) {
					var oTree = this.getTree(),
						selectContext = oEvent.getParameter("listItem").getBindingContext(),
						sPath = selectContext.getPath(),
						oSelectedItem = selectContext.getProperty(),
						bChildIsDummyNode = oSelectedItem.nodes && oSelectedItem.nodes[0].dummy === true;
					
					if(bChildIsDummyNode) {
						oTree.setBusyIndicatorDelay(0);
						oTree.setBusy(true);
					}

					Common.getPromise(function() {
						if(bChildIsDummyNode) {
							// Tree 하위 아이템 조회
							this.loadTreeData(sPath, oSelectedItem.Objid);
						}
					}.bind(this))
					.then(function() {
						this.callback(!oSelectedItem ? null : oSelectedItem);
						oTree.removeSelections();
						
						if(bChildIsDummyNode) oTree.setBusy(false);
						if(this.autoClose) this.oDialog.close();
					}.bind(this));
				}
			},

			/**
			 * 소속 ComboBox 변경시 호출되는 event
			 * 선택된 소속으로 조직도 트리를 재구성한다.
			 * 
			 * @param {Object} oEvent - ComboBox change event object
			 */
			selectOrgeh: function(oEvent) {
				var oTree = this.getTree(),
					selectedKey = oEvent.getParameter("selectedItem").getKey();

				oTree.setBusyIndicatorDelay(0);
				oTree.setBusy(true);

				Common.getPromise(function() {
					oTree.collapseAll().removeSelections();

					this.loadTreeData(null, selectedKey, "00000000");
				}.bind(this)).then(function() {
					oTree.setBusy(false);
				});
			},

			/**
			 * OData에서 받은 데이터를 Tree구조 데이터로 변환한다.
			 * 최상위 키는 "00000000"
			 * 현재 키(Objid)와 부모 키(PupObjid)를 비교하여 같으면 부모의 nodes에 추가한다.
			 * Otype이 "O"(부서)인 경우 nodes를 초기화하고 dummy 아이템을 추가한다.(expand event 발생시 해당 부서의 child nodes를 조회)
			 * 
			 * @param {Array} arrayList - OData return list
			 * @param {number} rootId - "00000000" 또는 부서코드
			 * 							"00000000"인 경우 rootNodes를 반환(Model-/TreeData setData)
			 * 							부서코드인 경우 rootNodes[0].nodes를 반환(이미 생성된 부모.nodes에 append)
			 * 
			 * @returns {Array<Object>} - Tree data object
			 */
			getTransformTreeData: function(arrayList, rootId) {
				var rootNodes = [];
				var traverse = function (nodes, item, index) {
					if (nodes instanceof Array) {
						return nodes.some(function (node) {
							if (node.Objid === item.PupObjid) {
								node.nodes = node.nodes || [];
								
								Common.removeProperties(item, "__metadata", "IBukrs", "IDatum", "IEmpid", "ILangu", "IMolga", "INoP", "IOrgAll", "IOrgeh", "IPernr");
								arrayList.splice(index, 1)[0];

								if(item.Otype === "O") {
									return node.nodes.push($.extend(true, item, {
										ref: "sap-icon://org-chart",
										nodes: [{ text: "-", dummy: true }]
									}));
								} else {
									return node.nodes.push($.extend(true, item, {
										ref: item.Chief === "X"
												? "sap-icon://manager"
												: "sap-icon://employee"
									}));
								}
							}
			
							return traverse(node.nodes, item, index);
						});
					}
				};
			
				while (arrayList.length > 0) {
					arrayList.some(function (item, index) {
						if (item.PupObjid === "00000000") {
							Common.removeProperties(item, "__metadata", "IBukrs", "IDatum", "IEmpid", "ILangu", "IMolga", "INoP", "IOrgAll", "IOrgeh", "IPernr");
							arrayList.splice(index, 1)[0];

							return rootNodes.push($.extend(true, item, {
								ref: item.Otype === "O" 
										? "sap-icon://org-chart" 
										: item.Chief === "X"
											? "sap-icon://manager"
											: "sap-icon://employee"
							}));
						}
			
						return traverse(rootNodes, item, index);
					});
				}
			
				return rootId !== "00000000" ? rootNodes[0].nodes : rootNodes;
			},

			/**
			 * 공통 사원검색 Dialog 호출
			 */
			pressEmployeeSearch: function() {
				SearchUser1.oController = this.oController;
				SearchUser1.fPersaEnabled = false;
				SearchUser1._vPersa = this.oController.getSessionInfoByKey("Persa");
				SearchUser1.dialogContentHeight = 480;
				
				if (!this.oEmployeeSearchDialog) {
                    this.oEmployeeSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    $.app.getView().addDependent(this.oEmployeeSearchDialog);
                }

                this.oEmployeeSearchDialog.open();
			},

			/**
			 * 공통 사원검색에서 호출한다.
			 *   선택된 사원 정보를 받아 callback함수로 넘겨준다.
			 * 
			 * @param {Object} data - 선택된 사원 정보
			 */
			setSelectionTagets: function(data) {
				
				SearchUser1.onClose();

				if (this.callback) {
					this.callback(!data ? {
						Otype: "P",
						Objid: "",
						Stext: "",
						PupStext: "",
						ZpGradeTxt: ""
					} : {
						Otype: "P",
						Objid: data.Pernr,
						Stext: data.Ename,
						PupStext: data.Fulln,
						ZpGradeTxt: data.ZpGradetx
					});

					if(this.autoClose) this.oDialog.close();
				}
			},

			/**
			 * 공통 사원검색에서 사용되는 조직검색 호출 function
			 * 
			 * @param {Object} oEvent 
			 */
			openOrgSearchDialog: function (oEvent) {
                SearchOrg.oController = this.oController;
                SearchOrg.vActionType = "Multi";
                SearchOrg.vCallControlId = oEvent.getSource().getId();
                SearchOrg.vCallControlType = "MultiInput";

                if (!this.oOrgSearchDialog) {
                    this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                    $.app.getView().addDependent(this.oOrgSearchDialog);
                }

                this.oOrgSearchDialog.open();
            }
        };

        return Handler;
    }
);
