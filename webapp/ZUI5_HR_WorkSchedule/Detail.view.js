sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/WorkSchedule",
        "common/ZHR_TABLES"
    ],
    function (PageHelper, WorkSchedule, ZHR_TABLES) {
        "use strict";

        sap.ui.jsview($.app.CONTEXT_PATH + ".Detail", {
            getControllerName: function () {
                return $.app.CONTEXT_PATH + ".Detail";
            },

            createContent: function (oController) {
                var oTable1 = new sap.ui.table.Table(oController.PAGEID + "_Table1", {
                    width: "100%",
                    selectionMode: "MultiToggle",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    fixedColumnCount : 5,
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" }),
                    extension : [new sap.m.FlexBox({
                    				 justifyContent : "SpaceBetween",
									 alignContent : "Start",
									 alignItems : "Center",
									 fitContainer: true,
                                     items : [new sap.m.HBox({
	                                              items : [new sap.m.Text({text : "{i18n>LABEL_55003}"}).addStyleClass("bold pr-10px pt-8px"), // 근무일
                                                           new sap.m.DateRangeSelection(oController.PAGEID + "_Period", {
                                                               displayFormat: "{Dtfmt}",
                                                               dateValue: "{Begda}",
                                                               secondDateValue: "{Endda}",
                                                               delimiter: "~",
                                                               width: "250px",
                                                               change : oController.changeDate.bind(oController)
                                                           }),
                                                           new sap.m.Button({
                                                               text : "{i18n>LABEL_55053}", // 복사(1건)
                                                               press : oController.copyData.bind(oController)
                                                           }).addStyleClass("button-light"),
                                                           new sap.m.Button({
                                                               text : "{i18n>LABEL_55054}", // 붙여넣기
                                                               press : oController.pasteData.bind(oController)
                                                           }).addStyleClass("button-light")]
	                                              }).addStyleClass("button-group search-field-group border-bt-none"),
	                                              new sap.m.HBox({
	                                                  items : [new sap.m.Button({
                                                                   text: "{i18n>LABEL_55055}", // 대상자 추가
                                                                   press : oController.searchOrgehPernr.bind(oController)
                                                               }).addStyleClass("button-light"),
                                                               new sap.m.Button({
	                                                               text: "{i18n>LABEL_00101}", // 저장
                                                                   press : function(oEvent){
                                                                       oController.onPressSave(oEvent, WorkSchedule.ProcessType.SAVE);
                                                                   }
	                                                           }).addStyleClass("button-light"),
	                                                           new sap.m.Button({
	                                                               text: "{i18n>LABEL_00152}", // 신청
                                                                   press : function(oEvent){
                                                                       oController.onPressSave(oEvent, WorkSchedule.ProcessType.APPROVE);
                                                                   }
	                                                           }).addStyleClass("button-light"),
	                                                           new sap.m.Button({
	                                                               text: "{i18n>LABEL_00103}", // 삭제
                                                                   press : function(oEvent){
                                                                       oController.onPressSave(oEvent, WorkSchedule.ProcessType.DELETE);
                                                                   }
	                                                           }).addStyleClass("button-light"),
	                                                           new sap.m.Button({
	                                                               text: "{i18n>LABEL_55037}", // 결재취소
                                                                   press : function(oEvent){
                                                                       oController.onPressSave(oEvent, WorkSchedule.ProcessType.APPROVE_CANCEL);
                                                                   },
                                                                   visible : false
	                                                           }).addStyleClass("button-light")]
	                                              }).addStyleClass("button-group")]
                                 }).addStyleClass("border-bt-none pb-10px")
                                   .setModel(oController.oModel)
                                   .bindElement("/Data")]
                })
                .addStyleClass("mt-25px thead-cell-border tbody-cell-border")
                .setModel(oController.oModel)
                .bindRows("/Data1");

                ZHR_TABLES.makeColumn(oController, oTable1, [
                    { id: "TmstaT", label: "{i18n>LABEL_55002}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "80px", templateGetter: "setTmstaT", templateGetterOwner: this },
                    { id: "Schda", label: "{i18n>LABEL_55003}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "110px" },
                    { id: "Rtext", label: "{i18n>LABEL_55004}" /* 근무조 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "110px" },
                    { id: "Atext", label: "{i18n>LABEL_55005}" /* 근태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px" },
                    { id: "TprogT", label: "{i18n>LABEL_55006}" /* 일근유형 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "200px", templateGetter: "setTprogs", templateGetterOwner: this, required: true },
                    { id: "PlanTime", label: "{i18n>LABEL_55007}" /* 계획근무 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px" },
                    { id: "InoutTime", label: "{i18n>LABEL_55008}" /* 입/출문 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px" },
                    { id: "WorkTime", label: "{i18n>LABEL_55009}" /* 근무시간 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "315px", templateGetter: "setWorkTime", templateGetterOwner: this, required: true },
                    { id: "AddTime1", label: "{i18n>LABEL_55059}" /* 추가근무시간1 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "315px", templateGetter: "setAddTime1", templateGetterOwner: this },
                    { id: "AddTime2", label: "{i18n>LABEL_55060}" /* 추가근무시간2 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "315px", templateGetter: "setAddTime2", templateGetterOwner: this },
                    { id: "FaprsT", label: "{i18n>LABEL_55057}" /* 근무사유구분 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "200px", templateGetter: "setFaprss", templateGetterOwner: this, required: true },
                    { id: "Ovres", label: "{i18n>LABEL_55058}" /* 근무사유 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "200px", templateGetter: "setOvres", templateGetterOwner: this, required: true },
                    { id: "Tim00", label: "{i18n>LABEL_55013}" /* 정상 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Tim01", label: "{i18n>LABEL_55014}" /* 연장 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Tim07", label: "{i18n>LABEL_55015}" /* 심야 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Tim05", label: "{i18n>LABEL_55016}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Tim02", label: "{i18n>LABEL_55017}" /* 주휴 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Wt40", label: "{i18n>LABEL_55023}" /* 소정근로(계획근무) */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "100px" },
                    { id: "Wt12", label: "{i18n>LABEL_55024}" /* 연장근로(한도체크) */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "100px" },
                    { id: "Wtsum", label: "{i18n>LABEL_55025}" /* 계 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "100px" },
                    { id: "LigbnTx", label: "{i18n>LABEL_55026}" /* 한도체크 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "100px", templateGetter: "getLigbnText", templateGetterOwner: this }
                ]);

                // 결재정보
                var oPanel = new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "{i18n>LABEL_55019}",   // 결재정보
                    visible : "{/Data/VisibleApprs}",
                    content: new sap.m.VBox({
                        width: "100%",
                        items: [
                            this.buildTable(oController)
                        ]
                    })
                }).addStyleClass("custom-panel mt-6px");
                
        		var titleitem = [
					new sap.m.FlexBox({
					  	 justifyContent : "Start",
						 alignItems: "End",
						 fitContainer: true,
					  	 items : [
					  		  new sap.m.Button({
							  	  icon : "sap-icon://nav-back",
							  	  type : "Default",
							  	  press : oController.onBack
							  }),
							  new sap.ui.core.HTML({
							  	  content : "<div style='width:10px' />"
							  }),
							  new sap.m.Text({
							  		text : {
							  			path : "Key",
							  			formatter : function(fVal){                 // 근무 일괄신청(사전)                      // 근무 일괄신청(사후)
							  				return fVal == WorkSchedule.Tab.PRIOR ? oController.getBundleText("LABEL_55052") : oController.getBundleText("LABEL_55056");
							  			}
							  		}
							  }).addStyleClass("app-title")
					  	  ]
					  })
				];
					  
				if((!sap.ui.Device.system.phone && !sap.ui.Device.system.tablet) && parent && window._use_emp_info_box === true) {
					window._CommonEmployeeModel = new common.EmployeeModel();
					window._CommonEmployeeModel.retrieve(parent._gateway.pernr());
		
					titleitem.push(new common.EmpBasicInfoBox(window._CommonEmployeeModel));
				}
				
				var title = new sap.m.FlexBox({
					justifyContent : "SpaceBetween",
					alignContent : "Start",
					alignItems : "Center",
					fitContainer: true,
					items : titleitem
				}).addStyleClass("app-title-container");
					
				/////////////////////////////////////////////////////////
		
				var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
					showHeader : false,
					content: [new sap.m.FlexBox({
								  justifyContent: "Center",
								  fitContainer: true,
								  items: [new sap.m.FlexBox(oController.PAGEID + "app-content-container", {
											  direction: "Column",
											  items: [title, oTable1, oPanel]
										 }).addStyleClass("app-content-container-wide")]
							 }).addStyleClass("app-content-body")]
				}).addStyleClass("app-content");
				
				oPage.setModel(oController.oModel);
				oPage.bindElement("/Data");
				
				return oPage;
            },

            // 진행상태
            setTmstaT : function(){
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");

                return new sap.m.ObjectStatus({
                    layoutData: new sap.m.FlexItemData({ styleClass: "lh-1px" }),
                    text: {
                        path: "TmstaT",
                        formatter: function(v) {
                            return v == "" ? oController.getBundleText("LABEL_55036") : v;  // 신규작성
                        }
                    },
                    state: {
                        path: "Status",
                        formatter: function(v) {
                            return v === "" ? sap.ui.core.ValueState.Warning 
                                : v === "AA" ? sap.ui.core.ValueState.Information
                                    : v === "00" ? sap.ui.core.ValueState.Information
                                        : v === "88" ? sap.ui.core.ValueState.Error
                                            : v === "99" ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.None;
                        }
                    }
                }).addStyleClass("font-medium");
            },

            // 일근유형
            setTprogs : function(){
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");
                return new sap.m.Select({
                           width: "185px",
                           selectedKey: "{Tprog}",
                           editable: "{EditMode}",
                           items: {
                                path: "/Tprogs",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                           },
                           customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
                           change: oController.changeTprog.bind(oController) 
                       });
            },

            // 근무사유구분
            setFaprss : function(){
                return new sap.m.Select({
                           width: "185px",
                           selectedKey: "{Faprs}",
                           editable: "{EditMode}",
                           items: {
                                path: "/Faprss",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                           }
                       });
            },

            // 근무사유    
            setOvres : function(){
                return new sap.m.Input({
                    required: true,
                    width: "100%",
                    value: "{Ovres}",
                    editable: "{EditMode}",
                    maxLength : common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "WorktimeApplyTab1", "Ovres")
                });
            },

            // 근무시간
            setWorkTime : function(){
                return new sap.m.HBox({
                           items : [
                            new sap.m.Select({
                                required: true,
                                width: "65px",
                                selectedKey: "{WkbuzT}",
                                items: {
                                    path: "/Hours",
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                    templateShareable: true
                                },
                                editable: "{EditMode}"
                                // change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                            }).addStyleClass("custom-select-time"),
                            new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                            new sap.m.Select({
                                required: true,
                                width: "65px",
                                selectedKey: "{WkbuzM}",
                                items: {
                                    path: "/Minutes",
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                    templateShareable: true
                                },
                                editable: "{EditMode}"
                                // change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                            }).addStyleClass("custom-select-time"),
                            new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                            new sap.m.Select({
                                required: true,
                                width: "65px",
                                selectedKey: "{WkeuzT}",
                                items: {
                                    path: "/Hours",
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                    templateShareable: true
                                },
                                editable: "{EditMode}"
                                // change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                            }).addStyleClass("custom-select-time"),
                            new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                            new sap.m.Select({
                                required: true,
                                width: "65px",
                                selectedKey: "{WkeuzM}",
                                items: {
                                    path: "/Minutes",
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                    templateShareable: true
                                },
                                editable: "{EditMode}"
                                // change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                            }).addStyleClass("custom-select-time")
                           ]
                       });
            },

            // 추가근무시간1
            setAddTime1 : function(){
                return new sap.m.HBox({
                           items : [
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{TrbuzT}",
                                    items: {
                                        path: "/Hours",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{TrbuzM}",
                                    items: {
                                        path: "/Minutes",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{TreuzT}",
                                    items: {
                                        path: "/Hours",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{TreuzM}",
                                    items: {
                                        path: "/Minutes",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time")
                           ]
                       });
            },

            // 추가근무시간2
            setAddTime2 : function(){
                return new sap.m.HBox({
                           items : [
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{Trbu1T}",
                                    items: {
                                        path: "/Hours",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{Trbu1M}",
                                    items: {
                                        path: "/Minutes",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{Treu1T}",
                                    items: {
                                        path: "/Hours",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time"),
                                new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                new sap.m.Select({
                                    width: "65px",
                                    selectedKey: "{Treu1M}",
                                    items: {
                                        path: "/Minutes",
                                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                        templateShareable: true
                                    },
                                    editable: "{EditMode}"
                                }).addStyleClass("custom-select-time")
                           ]
                       });
            },

            buildTableButtons: function(oController) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    visible: "{/Header/Edtfg}",
                    items: [
                        new sap.m.HBox({
                            height : "35px",
                            items: [
                                new sap.m.Button({
                                    press: oController.pressAddApprovalLine.bind(oController),
                                    icon: "sap-icon://add",
                                    visible: {
                                        path : "/Data/Bukrs",
                                        formatter : function(fVal){
                                            return fVal != "A100" ? true : false;
                                        }
                                    },
                                    text: "{i18n>LABEL_00153}" // 추가
                                })
                                .addStyleClass("button-light-sm")
                            ]
                        })
                        .addStyleClass("button-group")
                    ]
                });
            },

            buildTable: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_ApprovalLineTable", {
                    width: "100%",
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 2,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    extension : [this.buildTableButtons(oController)],
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
                })
                .addStyleClass("mt-8px")
                .setModel(oController.oModel)
                .bindRows("/Data2");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "AprsqTx", label: "{i18n>LABEL_32032}" /* 결재단계 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "18%", templateGetter: "getApprovalLineFunc", templateGetterOwner: this },
                    { id: "ApstaT", label: "{i18n>LABEL_32024}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "18%" },
                    { id: "Apper", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "Apnam", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "Aporx", label: "{i18n>LABEL_00156}" /* 부서명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "ApgrdT", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" }
                ]);

                return oTable;
            },

            getApprovalLineFunc: function(columnInfo, oController) {
                return new sap.m.FlexBox({
					justifyContent: "Center",
                    alignItems: sap.m.FlexAlignItems.Center,
					items: [
                        new sap.ui.commons.TextView({
                            text : "{" + columnInfo.id + "}",
                            textAlign : "Center"
                        }).addStyleClass("table-font"),
						new sap.m.Button({
							press: oController.pressApprovalLineModify,
                            text: "{i18n>LABEL_00202}", // 변경
                            visible : "{EditMode}"
                            // visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }"
						}).addStyleClass("ml-10px"),
						new sap.m.Button({
							press: oController.pressApprovalLineDelete,
                            text: "{i18n>LABEL_00103}", // 삭제
                            visible : "{EditMode}"
                            // visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }"
						}).addStyleClass("ml-10px")
					]
				});
            },

            getLigbnText: function() {
                return new sap.m.ObjectStatus({
                    text: "{LigbnTx}",
                    state: {
                        path: "Ligbn",
                        formatter: function(v) {
                            return v === "2" || v === "3" ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None;
                        }
                    }
                }).addStyleClass("color-black");
            },

            loadModel: function () {
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
