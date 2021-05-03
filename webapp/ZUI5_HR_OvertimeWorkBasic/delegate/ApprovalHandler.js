/* eslint-disable no-empty */
/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./OvertimeWork",
        "./ODataService",
        "common/PickOnlyDatePicker",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel",
        "common/moment-with-locales"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, OvertimeWork, ODataService, PickOnlyDatePicker, MessageBox, MessageToast, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),
            
            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @param {sap.ui.core.mvc.Controller} oController - Tab.controller
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsPossibleTemplateApplyBtn: false,  // 적용 버튼 활성화 여부
                    IsPossibleRowDelete: false,         // 삭제 버튼 활성화 여부
                    TemplateData: {
                        Begda: null,    // 근무일
                        Beguz: null,    // 근무시작시간
                        BeguzT: null,   // 근무시작시간
                        BeguzM: null,   // 근무시작시간
                        Enduz: null,    // 근무종료시간
                        EnduzT: null,   // 근무종료시간
                        EnduzM: null,   // 근무종료시간
                        Awart: null,    // OT종류
                        Repla: null,    // 대상자(부서)
                        Jobco: null     // 작업내용
                    },
                    Hours: [{ Code: "", Text: "HH"}].concat(Common.makeNumbersArray({ length: 24 }).map(function(h) { return { Code: Common.lpad(h, 2), Text: Common.lpad(h, 2) }; })),
                    Minutes: [{ Code: "", Text: "mm"}].concat(Common.makeNumbersArray({ length: 60 }).map(function(m) { return { Code: Common.lpad(m, 2), Text: Common.lpad(m, 2) }; })),
                    Awarts: [],         // OT종류 Combobox items
                    Replas: [],         // 대상자(부서) Combobox items
                    List: []
                });

                return this;
            },

            load: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        $.app.byViewId("TargetBasicTable").clearSelection();

                        this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                        this.oModel.setProperty("/TemplateData/Begda", new Date());
                        this.oModel.setProperty("/TemplateData/Beguz", "");
                        this.oModel.setProperty("/TemplateData/BeguzT", "");
                        this.oModel.setProperty("/TemplateData/BeguzM", "00");
                        this.oModel.setProperty("/TemplateData/Enduz", "");
                        this.oModel.setProperty("/TemplateData/EnduzT", "");
                        this.oModel.setProperty("/TemplateData/EnduzM", "00");
                        this.oModel.setProperty("/TemplateData/Awart", "");
                        this.oModel.setProperty("/TemplateData/Repla", "");
                        this.oModel.setProperty("/TemplateData/Jobco", "");
                        this.oModel.setProperty("/List", []);

                        if(!this.oModel.getProperty("/Awarts").length) {
                            this.oModel.setProperty(
                                "/Awarts", 
                                ODataService.CommonCodeListHeaderSet.call(this.oController, {
                                    Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                    Bukrs: this.oController.getSessionInfoByKey("Bukrs2"), 
                                    CodeT: OvertimeWork.Awart.CodeT,
                                    Codty: OvertimeWork.Awart.Codty
                                })
                            );
                        }
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            changeAwart: function(oEvent) {
                var oControlItem = oEvent.getSource().getSelectedItem();

                BusyIndicator.show(0);
                
                Common.getPromise(
                    function () {
                        this.oModel.setProperty("/TemplateData/Atext", oControlItem.getText());
                        this.oModel.setProperty("/TemplateData/Repla", "");
                        this.oModel.setProperty("/TemplateData/ReplaTx", "");
                        this.oModel.setProperty("/Replas", ODataService.OvertimePersonSet.call(this.oController, {
                            Awart: oControlItem.getKey()
                        }));

                        this.toggleIsPossibleTemplateApply();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            changeRepla: function(oEvent) {
                this.oModel.setProperty("/TemplateData/ReplaTx", oEvent.getSource().getSelectedItem().getText());

                this.toggleIsPossibleTemplateApply();
            },

            checkTemplateMinute: function() {
                // 30분 단위 체크
                // this.checkTimeRange(oEvent);

                this.toggleIsPossibleTemplateApply();
            },

            checkTimeRange: function(oEvent) {
                var oSource = oEvent.getSource(),
                    vSourcePath = oSource.getBinding("selectedKey").getPath(),
                    vSourceValue = parseInt(oSource.getSelectedKey()),
                    vPossibleValue = [vSourceValue, (vSourceValue + 30) % 60],
                    vPathName = "",
                    vComparePathName = [];

                if(vSourcePath.indexOf("/") > -1) { // 템플릿
                    var pathArray = vSourcePath.split("/");
                    
                    vPathName = pathArray[pathArray.length - 1];
                    pathArray.pop();
                    vComparePathName = pathArray;
                } else {    // Table
                    vPathName = vSourcePath;
                    vComparePathName = oSource.getBinding("selectedKey").getContext().getPath().split("/");
                }

                vComparePathName.push(vPathName === "BeguzM" ? "EnduzM" : "BeguzM");
                var vCompareValue = oSource.getModel().getProperty(vComparePathName.join("/"));

                if(vCompareValue && vPossibleValue.indexOf(parseInt(vCompareValue)) < 0) {
                    oEvent.getSource().setSelectedKey();
                    MessageBox.alert(this.oController.getBundleText("MSG_32024"), {  // 30분 단위로 입력가능합니다.
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                }
            },

            checkTemplateControl: function() {
                this.toggleIsPossibleTemplateApply();
            },

            /**
             * @brief 템플릿 적용버튼 활성화 여부
             *        - 템플릿 항목이 모두 작성된 경우
             *        - 대상자가 한 명이상 등록된 경우
             */
            toggleIsPossibleTemplateApply: function() {
                this.NOT_VALID_TEMPLATE_CONTROL_COUNT = 0;
                this.validTemplate($.app.byId("TemplateArea")); // recursive call

                this.oModel.setProperty(
                    "/IsPossibleTemplateApplyBtn",
                    (this.NOT_VALID_TEMPLATE_CONTROL_COUNT === 0 && this.oModel.getProperty("/List").length) ? true : false
                );
            },

            validTemplate: function (oControl) {
                // base case
                var childItems = oControl.getAggregation("items");
                if (oControl === null || childItems === null) return;

                // Recursion
                childItems.forEach(function (control) {
                    try {
                        var constructorName = control.constructor.getMetadata().getName();
                        if(Object.keys(OvertimeWork.ValidateProperties).indexOf(constructorName) > -1
                            && control.getProperty(OvertimeWork.ValidateProperties[constructorName]) === "") {
                                this.NOT_VALID_TEMPLATE_CONTROL_COUNT++;
                            }
                    } catch(ex) {
                        Common.log(ex);
                    }  // Not valid control
                    this.validTemplate(control);
                }, this);

                return;
            },

            setIsPossibleRowDelete: function() {
                this.oModel.setProperty(
                    "/IsPossibleRowDelete",
                    this.oModel.getProperty("/List").length ? true : false
                );
            },

            openSmoinUrl: function(smoinUrl) {
                if(!smoinUrl) return;

                setTimeout(function() {
                    var width = 1000, height = screen.availHeight * 0.9,
                    left = (screen.availWidth - width) / 2,
                    top = (screen.availHeight - height) / 2,
                    popup = window.open(smoinUrl, "smoin-approval-popup", [
                        "width=" + width,
                        "height=" + height,
                        "left=" + left,
                        "top=" + top,
                        "status=yes,resizable=yes,scrollbars=yes"
                    ].join(","));

                    setTimeout(function() {
                        popup.focus();
                    }, 500);
                }, 0);
            },

            ProcessOnSuccess: function (data, conType) {
                
                switch (conType) {
                    case OvertimeWork.ProcessType.CREATE:
                        if(data.ERetcode === "E") {
                            MessageBox.error(data.ERettext, {
                                title: this.oController.getBundleText("LABEL_00149")
                            });

                            // 처리결과 Binding
                            this.oModel.setProperty(
                                "/List",
                                this.oModel.getProperty("/List").map(function(elem, idx) {
                                    return $.extend(true, elem, { Comment: data.NavOtApply1.results[idx].Comment });
                                })
                            );
                        } else {
                            // s모인 결재창을 띄운다.
                            this.openSmoinUrl(data.EAppurl);

                            // 목록 조회
                            this.oController.getPageHandler().search();

                            this.oController.getPageHandler().getApprovalDialog().close();
                        }

                        break;
                    default:
                        break;
                }

                BusyIndicator.hide();
            },

            ProcessOnFail: function (res) {
                var errData = Common.parseError(res);
                if (errData.Error && errData.Error === "E") {
                    MessageBox.error(errData.ErrorMessage, {
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                }

                BusyIndicator.hide();
            },

            DetailProcessValidation: function (detailData) {
                var validControls = {
                        Begda: { colIdx: 2, context: "/stateBegda", message: this.oController.getBundleText("MSG_32012") },    // 근무일을 입력하세요.
                        BeguzT: { colIdx: 3, context: "/stateBeguz", message: this.oController.getBundleText("MSG_32013") },   // 근무시간을 선택하세요.
                        BeguzM: { colIdx: 3, context: "/stateBeguz", message: this.oController.getBundleText("MSG_32013") },   // 근무시간을 선택하세요.
                        EnduzT: { colIdx: 3, context: "/stateBeguz", message: this.oController.getBundleText("MSG_32013") },   // 근무시간을 선택하세요.
                        EnduzM: { colIdx: 3, context: "/stateBeguz", message: this.oController.getBundleText("MSG_32013") },   // 근무시간을 선택하세요.
                        Jobco: { colIdx: 6, context: "/stateJobco", message: this.oController.getBundleText("MSG_32014") },    // 작업내용을 입력하세요.
                        Awart: { colIdx: 4, context: "/stateAwart", message: this.oController.getBundleText("MSG_32015") },    // OT종류를 선택하세요.
                        Repla: { colIdx: 5, context: "/stateRepla", message: this.oController.getBundleText("MSG_32016") }     // 대상자(부서)를 선택하세요.
                    },
                    errInfo = {
                        colIdx: null,
                        rowIdx: null,
                        pernr: null,
                        message: null,
                        context: null
                    };

                if(Common.isEmptyArray(detailData)) {
                    MessageBox.error(this.oController.getBundleText("MSG_31006"), { // 대상자를 등록하세요.
                        title: this.oController.getBundleText("LABEL_00149")
                    });

                    return false;
                }

                detailData.some(function(elem, idx) {
                    return Object.keys(validControls).some(function(control) {
                        if(!elem[control]) {
                            errInfo = $.extend(true, validControls[control], {
                                rowIdx: idx,
                                pernr: elem.Pernr
                            });
                            
                            return true;
                        }
                    });
                });

                if(errInfo.pernr) {
                    // 해당 index로 scroll
                    $.app.byViewId("TargetBasicTable").setFirstVisibleRow(errInfo.rowIdx === 0 ? 0 : errInfo.rowIdx - 1);

                    MessageBox.error(errInfo.message, {
                        title: this.oController.getBundleText("LABEL_00149"),
						onClose: function() {
                            // 해당 Input에 포커스
                            this.setTableInputFocus.call(this, errInfo);
						}.bind(this)
                    });

                    return false;
                }

                return true;
            },
            
            /**
             * 
             * vPernr과 사번이 일치하는 Row를 찾아서 Input에 focus
             * 
             * @param {Object} errInfo - 에러를 표시할 컬럼 정보
             * @param {number} errInfo.colIdx - 컬럼 인덱스
             * @param {string} errInfo.pernr - 사번
             * @param {string} errInfo.context - 컬럼 valueState context
             */
			setTableInputFocus: function(errInfo) {
				var oInput = null;

                $.app.byViewId("TargetBasicTable").getRows().some(function(oRow) {
					oInput = oRow.getCells()[errInfo.colIdx];

					if(errInfo.pernr === oInput.data("Pernr")) {
						// Set valueState Error
						this.oModel.setProperty(
                            oRow.getBindingContext().getPath() + errInfo.context,
                            sap.ui.core.ValueState.Error
                        );
						// Set focus
                        oInput.focus();

						return true;
					}
				}.bind(this));
            },
            
            /**
             * 신청 버튼 event
             */
            pressApprovalBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/List");
				var vExtryn = Common.isExternalIP() === true ? "X" : "";

                if (!this.DetailProcessValidation.call(this, oInputData)) return;

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Extryn = vExtryn;
                    payload.OvertimeApply = oInputData.map(function (elem) {
                        return Common.copyByMetadata(oModel, "OvertimeApply", $.extend(true, elem, {
                            Subty: elem.Awart,
                            Beguz: elem.BeguzT + elem.BeguzM,
                            Enduz: elem.EnduzT + elem.EnduzM,
                            Comment: null
                        }));
                    });

                    ODataService.OvertimeApplySetByProcess.call(
                        this.oController, 
                        OvertimeWork.ProcessType.CREATE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                var confirmMessage = vExtryn === "X" ? this.oController.getBundleText("MSG_00060") : this.oController.getBundleText("MSG_31010");

                MessageBox.show(confirmMessage, {
                    // S모인 결재창으로 이동해 결재를 진행하셔야 합니다.\n진행하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * 적용 버튼 event
             */
            pressApplyTemplateBtn: function() {
                var templateData = this.oModel.getProperty("/TemplateData"),
                    vListData = this.oModel.getProperty("/List"),
                    oTable = $.app.byViewId("TargetBasicTable"),
                    sIndexes = oTable.getSelectedIndices();

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                oTable.setBusyIndicatorDelay(0).setBusy(true);

                Common.getPromise(
                    function () {
                        this.oModel.setProperty(
                            "/List",
                            vListData.map(function(elem, idx) {
                                return $.extend(true, elem, 
                                    sIndexes.some(function(sIdx) { return sIdx === idx; }) 
                                        ? {
                                            Begda: templateData.Begda,
                                            BeguzT: templateData.BeguzT,
                                            BeguzM: templateData.BeguzM,
                                            EnduzT: templateData.EnduzT,
                                            EnduzM: templateData.EnduzM,
                                            Awart: templateData.Awart,
                                            Atext: templateData.Atext,
                                            Repla: templateData.ReplaTx,
                                            Jobco: templateData.Jobco,
                                            Comment: null
                                        }
                                        : {}
                                );
                            })
                        );
                    }.bind(this)
                ).then(function () {
                    oTable.clearSelection().setBusy(false);
                });
            },
            
            /**
             * 등록 버튼 event
             *   [공통]부서/사원 조직도 Dialog 호출
             */
            pressAddBtn: function() {
                setTimeout(function() {
                    var ApprovalHandler = this.getApprovalHandler(),
                        initData = {
                            autoClose: false,
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                            Zflag: true
                        },
                        callback = function(o) {
                            switch(o.Otype) {
                                case "P":
                                    // 전문직
                                    ApprovalHandler.addTargetTableByOne(o);
                                    break;
                                case "O":
                                    ApprovalHandler.addTargetTableByMulti(o.nodes.filter(function(node) {
                                        return node.Otype === "P";
                                    }));
                                    break;
                            }
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);

                    setTimeout(function() {
                        this.OrgOfIndividualHandler.oDialog.$().position({
                            my: "right",
                            at: "right",
                            of: window
                        });
                    }.bind(this), 300);
                }.bind(this), 0);
            },
            
            /**
             * 삭제 버튼 event
             */
            pressDeleteBtn: function() {
                var oTable = $.app.byViewId("TargetBasicTable"),
                    sIndexes = oTable.getSelectedIndices(),
                    vDetailList = this.oModel.getProperty("/List") || [];

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                this.oModel.setProperty(
                    "/List",
                    vDetailList.filter(function(elem, idx) {
                        return !sIndexes.some(function(sIndex) {
                            return sIndex === idx;
                        });
                    })
                );
                    
                oTable.clearSelection();
                this.setIsPossibleRowDelete();
                Common.adjustAutoVisibleRowCount.call(oTable);
            },

            /**
             * 사원 단수 선택시 호출
             * 
             * @param {Object} data - 선택된 조직도 아이템(사원)
             */
            addTargetTableByOne: function(data) {
                var vListData = this.oModel.getProperty("/List");

                // 중복 체크
                if(vListData.some(function(elem) { return elem.Pernr === data.Objid; })) {
                    MessageToast.show(this.oController.getBundleText("MSG_31007"), {
                        // 중복된 대상입니다.
                        duration: 2000,
                        my: sap.ui.core.Popup.Dock.CenterCenter,
                        at: sap.ui.core.Popup.Dock.CenterCenter
                    });

                    return;
                }

                vListData.push({
                    Pernr: data.Objid,
                    Ename: data.Stext,
                    Begda: null,
                    Beguz: null,
                    BeguzT: "",
                    BeguzM: "00",
                    Enduz: null,
                    EnduzT: "",
                    EnduzM: "00",
                    Jobco: null,
                    stateBegda: sap.ui.core.ValueState.None,
                    stateBeguz: sap.ui.core.ValueState.None,
                    stateJobco: sap.ui.core.ValueState.None
                });

                this.oModel.refresh();
                this.toggleIsPossibleTemplateApply();
                this.setIsPossibleRowDelete();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("TargetBasicTable"));
            },
            
            /**
             * 조직 선택시 호출
             * 
             * @param {Array} data - 선택된 조직도 아이템(Array<사원>)
             */
            addTargetTableByMulti: function(data) {
                var vListData = this.oModel.getProperty("/List"),
                    vSelectedDataLength = data.length;

                if(vListData.length) {
                    // 중복데이터 제거
                    data = data.filter(function(elem1) {
                        return !vListData.some(function(item) {
                            return elem1.Objid === item.Pernr;
                        });
                    });
                }

                if(!data.length) return;
                if(vSelectedDataLength != data.length) {
                    MessageToast.show(this.oController.getBundleText("MSG_31008"), {
                        // 중복된 대상은 제외하고\n추가합니다.
                        duration: 2000,
                        my: sap.ui.core.Popup.Dock.CenterCenter,
                        at: sap.ui.core.Popup.Dock.CenterCenter
                    });
                }
                
                this.oModel.setProperty(
                    "/List",
                    vListData.concat(data.map(function(elem2) {
                        return {
                            Pernr: elem2.Objid,
                            Ename: elem2.Stext,
                            Begda: null,
                            Beguz: null,
                            BeguzT: "",
                            BeguzM: "00",
                            Enduz: null,
                            EnduzT: "",
                            EnduzM: "00",
                            Jobco: null,
                            stateBegda: sap.ui.core.ValueState.None,
                            stateBeguz: sap.ui.core.ValueState.None,
                            stateJobco: sap.ui.core.ValueState.None
                        };
                    }))
                );

                this.oModel.refresh();
                this.toggleIsPossibleTemplateApply();
                this.setIsPossibleRowDelete();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("TargetBasicTable"));
            },

            checkTableTimeRange: function(oEvent) {
                // this.checkTimeRange(oEvent);
                this.toggleValueState(oEvent);
            },
            
            toggleValueState: function(oEvent) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            },

            /**
             * 근무일 Column template
             */
            getWorkdate: function(columnInfo, oController) {
                return new PickOnlyDatePicker({ 
                    dateValue: "{Begda}",
                    valueFormat: "yyyy-MM-dd",
                    displayFormat: "{/Dtfmt}",
                    width: "100%",
                    valueState: "{stateBegda}",
                    valueStateText: "{i18n>MSG_32012}",  // 근무일을 입력하세요.
                    change: oController.getApprovalHandler().toggleValueState,
                    editable: {
                        parts: [
                            {path: "Atext"},
                            {path: "Repla"}
                        ],
                        formatter: function(v1, v2) {
                            return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                        }
                    },
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                });
            },
            
            /**
             * 근무시간 Column template
             */
            getWorktime: function(columnInfo, oController) {
                var approvalHandler = oController.getApprovalHandler();
                return new sap.m.HBox({
                    items: [
                        new sap.m.Select({
                            width: "65px",
                            selectedKey: "{BeguzT}",
                            items: {
                                path: "/Hours",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                            },
                            valueState: "{stateBeguz}",
                            valueStateText: "{i18n>MSG_32013}",  // 근무시간을 선택하세요.
                            editable: {
                                parts: [
                                    {path: "Atext"},
                                    {path: "Repla"}
                                ],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                                }
                            },
                            change: approvalHandler.toggleValueState
                        }).addStyleClass("custom-select-time"),
                        new sap.m.Text({ text: ":" }).addStyleClass("mx-px"),
                        new sap.m.Select({
                            width: "65px",
                            selectedKey: "{BeguzM}",
                            items: {
                                path: "/Minutes",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                            },
                            valueState: "{stateBeguz}",
                            valueStateText: "{i18n>MSG_32013}",  // 근무시간을 선택하세요.
                            editable: {
                                parts: [
                                    {path: "Atext"},
                                    {path: "Repla"}
                                ],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                                }
                            },
                            change: approvalHandler.checkTableTimeRange.bind(approvalHandler)
                        }).addStyleClass("custom-select-time"),
                        new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                        new sap.m.Select({
                            width: "65px",
                            selectedKey: "{EnduzT}",
                            items: {
                                path: "/Hours",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                            },
                            valueState: "{stateBeguz}",
                            valueStateText: "{i18n>MSG_32013}",  // 근무시간을 선택하세요.
                            editable: {
                                parts: [
                                    {path: "Atext"},
                                    {path: "Repla"}
                                ],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                                }
                            },
                            change: approvalHandler.toggleValueState
                        }).addStyleClass("custom-select-time"),
                        new sap.m.Text({ text: ":" }).addStyleClass("mx-px"),
                        new sap.m.Select({
                            width: "65px",
                            selectedKey: "{EnduzM}",
                            items: {
                                path: "/Minutes",
                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                templateShareable: true
                            },
                            valueState: "{stateBeguz}",
                            valueStateText: "{i18n>MSG_32013}",  // 근무시간을 선택하세요.
                            editable: {
                                parts: [
                                    {path: "Atext"},
                                    {path: "Repla"}
                                ],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                                }
                            },
                            change: approvalHandler.checkTableTimeRange.bind(approvalHandler)
                        }).addStyleClass("custom-select-time")
                    ],
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                });
            },

            /**
             * 작업내용 Column template
             */
            getWorkComment: function(columnInfo, oController) {
                return new sap.m.Input({
                    width: "100%",
                    value: "{Jobco}",
                    maxLength: 30,
                    valueState: "{stateJobco}",
                    valueStateText: "{i18n>MSG_32014}",  // 작업내용을 입력하세요.
                    change: oController.getApprovalHandler().toggleValueState,
                    editable: {
                        parts: [
                            {path: "Atext"},
                            {path: "Repla"}
                        ],
                        formatter: function(v1, v2) {
                            return Common.checkNull(v1) || Common.checkNull(v2) ? false : true;
                        }
                    },
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                });
            },

            /**
             * 처리결과 Column template
             */
            getProcessResult: function() {
                return new sap.m.ObjectStatus({
                    text: "{Comment}",
                    state: sap.ui.core.ValueState.Error
                });
            }

        };

        return Handler;
    }
);
