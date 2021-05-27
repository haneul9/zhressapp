/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* global common:true moment:true Promise:true */
jQuery.sap.declare("common.Common");
jQuery.sap.require("common.JSONModelHelper");
jQuery.sap.require("sap.m.MessageBox");

if ((1.005).toFixed(2) !== "1.01") {
    (function (prototype) {
        var toFixed = prototype.toFixed;
        prototype.toFixed = function (fractionDigits) {
            var split = this.toString().split(".");
            var number = +(!split[1] ? split[0] : split.join(".") + "1");
            return toFixed.call(number, fractionDigits);
        };
    })(Number.prototype);
}

common.Common = {
    getController: function (oEvent) {
        var oView = oEvent.getSource();
        var oController = null;
        for (;;) {
            oView = oView.getParent();
            var _id = oView.getId();
            var _n = _id.search("ZUI5_HR_YEARTAX");
            if (_n === 0) {
                oController = oView.getController();
                break;
            }
        }
        return oController;
    },
    isNull: function (v) {
        return v === undefined || v === null ? true : false;
    },
    checkNull: function (v) {
        return v === undefined || v === null || v == "" ? true : false;
    },
    nvl: function (v1, v2) {
        return common.Common.checkNull(v1) ? v2 : v1;
    },
    isEmptyArray: function (v) {
        return Array.isArray(v) && v.length ? false : true;
    },
    getUTCDateTime: function (d) {
        if (d instanceof Date) {
            return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
        }
        return d;
    },

    setUTCDateTime: function (d) {
        if (d instanceof Date) {
            return new Date(d.getTime() + (d.getTimezoneOffset() * -60000));
        }
        return d;
    },
    
    getTime: function (d) {
        if (d == null || d == "") return 0;

        if (d.length > 8 && d.indexOf("-") < 0) {
            d = d.replace(/[^\d]/g, "-");
        } else if (d.length == 8) {
            d = d.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
        } else if (d.length < 8) {
            return 0;
        }
        var vTmp1 = new Date(d);
        if (vTmp1.getTimezoneOffset() < 0) {
            vTmp1.setTime(vTmp1.getTime() - vTmp1.getTimezoneOffset() * 60000);
        } else {
            vTmp1.setTime(vTmp1.getTime() + vTmp1.getTimezoneOffset() * 60000);
        }
        return vTmp1.getTime();
    },
    setTime: function (d) {
        if (d === null || d === "") {
            common.Common.log("Date Null !!!");
            return "";
        }
        var vTmp1 = new Date(d.getTime());
        if (vTmp1.getTimezoneOffset() < 0) {
            vTmp1.setTime(vTmp1.getTime() - vTmp1.getTimezoneOffset() * 60000);
        } else {
            vTmp1.setTime(vTmp1.getTime() + vTmp1.getTimezoneOffset() * 60000);
        }
        return vTmp1.getTime();
    },
    numberWithCommas: function (x) {
        if (x === undefined) {
            return "";
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    setRowspan: function () {
        var oColspan = 1,
            oCount = 1;
        $("td[data-sap-ui-colindex]").each(function (index, item) {
            if (item.id.match(/_1/g)) return true;
            if (item.colSpan === 1) {
                if (oColspan === 1) {
                    $("#" + item.id).attr("rowspan", "2");
                    $("#" + item.id + "_1").css("display", "none");
                } else {
                    oCount++;
                    if (oColspan !== oCount) {
                        return true;
                    } else {
                        oColspan = 1;
                        oCount = 1;
                    }
                }
            } else {
                oColspan = item.colSpan;
                $("#" + item.id).css("border-bottom", "1px solid #dddddd");
            }
        });
    },
    log: function() {
        if ($ && $.app && $.app.log) {
            $.app.log.apply(null, [].slice.call(arguments));
        }
    },
    lpad: function (d, width) {
        d = d + '';
        return d.length >= width ? d : new Array(width - d.length + 1).join('0') + d;
    },
    formatTellNumber: function (input) {
        if (!input) return "";

        input = input.replace(/[^0-9]*/g, "");
        input = input.length > 11 ? input.substring(0, 11) : input;

        return input.length < 3 ? input : input.length < 7 ? input.replace(/(\d{3})(\d)/g, "$1-$2") : input.replace(/(\d{3})(\d{3,4})(\d)/, "$1-$2-$3");
    },
    // TODO: displayHelp implement
    displayHelp: function () {},
    /*
     * {i18n>property} -> property
     */
    stripI18nExpression: function (expression) {
        return (expression || "").replace(/\{\s*i18n>(.*)\s*\}/, "$1");
    },
    /**
     * Spreadsheet에서 edm.time format을 표현하기 위해 string으로 변환.
     */
    convertListTimeToString: function () {
        var args = [].slice.call(arguments),
            list = args.shift();
        if (!args.length || !list) {
            return;
        }
        return list.map(function (o) {
            var copied = {};
            Object.keys(o).forEach(function (key) {
                if (args.indexOf(key) > -1 && o[key]) {
                    if (typeof o[key] === "object" && "ms" in o[key]) {
                        // edm.Time
                        copied[key] = moment(o[key].ms).subtract(9, "hours").format("HH:mm");
                    } else if (o[key].length === 4) {
                        // ex) 1830 => 18:30
                        copied[key] = common.Common.timeFormatter(o[key]);
                    } else {
                        copied[key] = o[key];
                    }
                } else {
                    copied[key] = o[key];
                }
            });
            return copied;
        });
    },
    /*
     * Excel에서 사용 할 컬럼정보로 변환
     *
     * @param {Array} colModels
     * @returns {Array<{label: string, property: string, type: string, template: {content: {parts: string, formatter: function()}}}>}
     */
    convertColumnArrayForExcel: function (oController, colModels) {
        var preText = "";

        return $.map(colModels, function (rowData) {
            var label = common.Common.stripI18nExpression(rowData.label),
                labelTxt = label.indexOf("LABEL") > -1 ? oController.getBundleText(label) : label,
                plabel = common.Common.stripI18nExpression(rowData.plabel),
                plabelTxt = plabel.indexOf("LABEL") > -1 ? oController.getBundleText(plabel) : plabel;
            if (label && plabel) {
                if (label != plabel) {
                    preText = labelTxt + "-";
                } else {
                    preText = "";
                }
            } else if (label && !plabel) {
                preText = "";
            }

            return {
                label: label && plabel ? preText + plabelTxt : !label ? preText + plabelTxt : labelTxt,
                property: rowData.id,
                type: rowData.type == "date" ? sap.ui.export.EdmType.Date : rowData.type == "time" ? sap.ui.export.EdmType.String : rowData.type == "string" ? sap.ui.export.EdmType.String : rowData.type.indexOf("Checkbox") > -1 ? sap.ui.export.EdmType.Boolean : rowData.type.indexOf("money") > -1 || rowData.type.toLowerCase().indexOf("number") > -1 ? sap.ui.export.EdmType.Number : rowData.type,
                template: rowData.type == "date" ? {
                    content: {
                        parts: [rowData.id],
                        formatter: function (fVal) {
                            return !fVal || typeof fVal === "string" ? fVal : moment(fVal).format("YYYY-MM-DD");
                        }
                    }
                } : undefined
            };
        });
    },
    /**
     * Table에서 지정한 컬럼의 rowspan효과를 준다.(해당 인덱스에 동일한 값이 있으면 실행)
     * 
     * @param {Object} opt - 옵션
     * @param {String} opt.selector - 대상 테이블 selector
     * @param {Array} opt.colIndexes - 컬럼 인덱스 배열
     */
    generateRowspan: function (opt) {
        opt = opt || {
            selector: "",
            colIndexes: []
        };
        var $target = typeof opt.selector === "string" ? $(opt.selector) : $('[id^="' + opt.selector.getId() + '-header"] > tbody'),
            that,
            thisval,
            thatval,
            rowspan,
            regxp = /\<span[^>]*\>(.*)\<\/span\>/;
        // regxp = /(\<[span]+[^>]+[\>])([^<]*)(\<\/[span]+\>)/;
        if (!$target || !opt.colIndexes.length) return;
        opt.colIndexes.forEach(function (colidx) {
            that = null;
            $target.each(function () {
                $("tr", this).each(function () {
                    $("td:eq(" + colidx + ")", this)
                        .filter(":visible")
                        .each(function () {
                            thisval = $(this).html().match(regxp)[1];
                            thatval = $(that).html() ? $(that).html().match(regxp)[1] : "";

                            if (thisval == thatval) {
                                rowspan = $(that).attr("rowspan") || 1;
                                rowspan = Number(rowspan) + 1;
                                $(that).attr("rowspan", rowspan);
                                $(this).hide();
                            } else {
                                that = this;
                            }
                            that = that || this;
                        });
                });
            });
        });
    },
    /**
     * sap.ui.table.Table의 visibleRowCount를 visibleRowCountLimit에 맞춰 변경
     * 
     * @param {Object} oTable - 대상 테이블 sap.ui.table.Table Control
     * @param {Number} visibleRowCountLimit - 최대 행 개수
     * @param {Number} dataCount - 목록 카운트
     */
    adjustVisibleRowCount: function (oTable, visibleRowCountLimit, dataCount) {
        oTable.setVisibleRowCount(!dataCount ? 1 : dataCount > visibleRowCountLimit ? visibleRowCountLimit : dataCount);
    },
    /**
     * Dialog, Panel과 같이 container 내의 table에는 사용금지
     * 신청내역 조회와 같이 검색조건 영역과 Table로만 구성된 화면에서만 사용할 것
     */
    adjustAutoVisibleRowCount: function () {
        var vRowHeight = this.getRowHeight() === 0 ? 37 : this.getRowHeight();
            vBottomMargin = 50;

        setTimeout(function () {
            var oBinding = this.getBinding(),
                rows = oBinding.getModel().getProperty(oBinding.getPath()).length;
            if (rows) {
                var visibleRowCountLimit = Math.floor(($(document).height() - this.$().find('.sapUiTableCCnt').offset().top - vBottomMargin) / vRowHeight);
                common.Common.adjustVisibleRowCount(this, visibleRowCountLimit, rows);
            } else {
                common.Common.adjustVisibleRowCount(this, 1, 1);
            }
        }.bind(this), 300);
    },
    /**
     * 최대 Height로 최대 행의 개수를 구하여 adjustVisibleRowCount를 호출한다.
     * 
     * @param {Object} arguments - 옵션
     * @param {Object} arguments.tableControl - 대상 테이블 sap.ui.table.Table Control
     * @param {Number} arguments.rowHeight - 테이블 행의 높이
     * @param {Number} arguments.viewHeight - 테이블의 vh
     * @param {Number} arguments.dataCount - 목록 카운트
     */
    adjustViewHeightRowCount: function (arguments) {
        arguments = $.extend(true, {
            tableControl: null,
            rowHeight: 38,
            viewHeight: 50,
            dataCount: 1
        }, arguments);

        if (!arguments.tableControl) return;

        var screenH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var calcViewH = (arguments.viewHeight * screenH) / 100;
        var visibleRowCount = Math.floor(calcViewH / arguments.rowHeight);

        common.Common.adjustVisibleRowCount(arguments.tableControl, visibleRowCount, arguments.dataCount);
    },
    clearRowspan: function (tableControl) {
        tableControl.getRows().forEach(function (row) {
            row.getCells().forEach(function (cell) {
                cell.$().parent().parent().attr("rowspan", "1").show();
            });
        });
    },
    /**
     * @param {Object} o = {
    						table: sap.ui.table.Table instance
    						byColIndex: 병합 기준이 되는 column index
    						theColIndices: rowspan을 적용할 column index array
    					}
    */
    adjustRowspanTableBody: function (o) {
        var aRows = o.table.getRows();

        // Aggregate columns (by cols) for similar values
        if (aRows && aRows.length > 0) {
            var pRow;
            aRows.forEach(function (aRow, idx) {
                if (idx > 0) {
                    var cCells = aRow.getCells();
                    var pCells = pRow.getCells();

                    if (pCells[o.byColIndex].getText() == cCells[o.byColIndex].getText()) {
                        o.theColIndices.forEach(function (i) {
                            var pCellParentNode = pCells[i].$().parent().parent();
                            var rowspan = pCellParentNode.attr("rowspan") || 1;
                            rowspan = Number(rowspan) + 1;

                            pCellParentNode.attr("rowspan", rowspan);
                            if (pCellParentNode.is(":visible"))
                                cCells[i].$().parent().parent().hide();
                            if (aRows.length === idx + 1)
                                $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
                        });
                    } else {
                        pRow = aRow;
                    }
                }
                pRow = (pRow == null) ? aRow : pRow;
            });
        }

    },
    /*
    @param o = {
    	table: sap.ui.table.Table instance
    	colIndices: rowspan을 적용할 column index array
    	theadOrTbody: "thead" or "tbody"
    }
    */
    adjustRowSpan: function (o) {
        var selector = "#${o.table.getId()}-${o.theadOrTbody} tbody>tr td:nth-child(${index + 1}):visible".interpolate(
            o.table.getId(),
            /^thead$/i.test(o.theadOrTbody) ? "header" : "table"
        );
        $.each(o.colIndices || [], function (j, colIndex) {
            var tds = $(selector.interpolate(colIndex + 1)).get(),
                prevTD = tds.shift();

            $.each(tds, function (i, td) {
                var p = $(prevTD),
                    c = $(td);
                if (c.text() === p.text()) {
                    p.attr("rowspan", Number(p.attr("rowspan") || 1) + 1);
                    c.hide();
                } else {
                    prevTD = td;
                }
            });
        });
    },
    getUnselectedRowsModelProperties: function (oTable) {
        var aIndicesInTable = oTable.getSelectedIndices();
        if (!aIndicesInTable || !aIndicesInTable.length) { // 선택된 행이 없으면 빈 배열 반환
            return [];
        }

        // Table에서 보여지는 index와 Model에서의 index가 다르므로 Model에서의 index를 배열로 구함
        var bindingRows = oTable.getBinding(),
            aIndicesInModel = $.map(bindingRows.aIndices, function (v, i) {
                return $.inArray(v, aIndicesInTable) > -1 ? i : null;
            });

        // 위에서 구한 Model에서의 index는 선택된 index이므로 제외한 다른 index의 Model property를 배열로 반환
        return $.map(bindingRows.oList, function (o, i) {
            if ($.inArray(i, aIndicesInModel) === -1) {
                return o;
            }
        });
    },
    getSubaccountTechnicalName: function () {
        return /^webide/i.test(location.host) ? "webide" : ((location.host.split(".").shift() || "").split("-").pop() || "");
    },
    getOperationMode: function () {
        return common.Common.isPRD() ? "PRD" : (common.Common.isQAS() ? "QAS" : "DEV");
    },
    isLOCAL: function () {
        return common.Common.getSubaccountTechnicalName() === "webide";
    },
    isDEV: function () {
        return common.Common.getSubaccountTechnicalName() === "g110bc197";
    },
    isQAS: function () {
        return common.Common.getSubaccountTechnicalName() === "ziwz5jxar7";
    },
    isPRD: function () {
        return common.Common.getSubaccountTechnicalName() === "yzdueo754l";
    },
    getSFOrigin: function (oController) {
        return oController.getBundleText("SF_ORIGIN_" + common.Common.getOperationMode());
    },
    getJavaOrigin: function (oController, additionalPath) {
        return oController.getBundleText("JAVA_ORIGIN_" + common.Common.getOperationMode()) + additionalPath;
    },
    adjustGMT: function (dDate) {
        if (!dDate) return null;

        var copiedDate = new Date(dDate.getTime()),
            sw = copiedDate.getTimezoneOffset() < 0 ? -1 : 1;

        return copiedDate.setHours(copiedDate.getHours() + (copiedDate.getTimezoneOffset() / 60) * sw);
    },
    adjustGMTOdataFormat: function (dDate) {
        return (dDate) ? "/Date(" + common.Common.adjustGMT(dDate) + ")/" : undefined;
    },
    adjustTimeOdataFormat: function (tTime) {
        return sap.ui.core.format.DateFormat.getTimeInstance({
            pattern: "PTHH'H'mm'M'ss'S'"
        }).format(tTime instanceof Date ? tTime : new Date(tTime.ms));
    },
    getCurrentTimeOdataFormat: function () {
        return sap.ui.core.format.DateFormat.getTimeInstance({
            pattern: "PTHH'H'mm'M'ss'S'"
        }).format(new Date());
    },
    getODataPropertyLength: function (model_name, entity_name, property_name, isOnlyPrecision) {
        var oModel = sap.ui.getCore().getModel(model_name);
        if (!oModel) return 0;

        var oMetaModel = oModel.getMetaModel();

        var vSRVName = model_name;
        if (model_name.indexOf("_SRV") < 0) vSRVName = vSRVName + "_SRV";
        var oEntityType = oMetaModel.getODataEntityType(vSRVName + "." + entity_name);

        if (!oEntityType) return 0;

        if (isOnlyPrecision === undefined || isOnlyPrecision === null) isOnlyPrecision = false;

        var oProperty = oMetaModel.getODataProperty(oEntityType, property_name);
        var maxLength = 0;
        if (oProperty) {
            if (oProperty.type == "Edm.Decimal") {
                maxLength = parseInt(oProperty.precision);
                if (isOnlyPrecision === false && parseInt(oProperty.scale) > 0) maxLength += parseInt(oProperty.scale) + 1;
            } else if (oProperty.type == "Edm.String") {
                maxLength = parseInt(oProperty.maxLength);
            }
        }
        return maxLength;
    },
    /**
     * 통신시 발생하는 error response를 파싱한다.
     *
     * @param {Res} response object
     * @returns {errData} object{Error:"", ErrorMessage:""}
     */
    parseError: function (Res) {
        if (!Res || !Res.response || !Res.response.body) return null;

        var errData = {},
            errorJSON = null;

        errData.Error = "E";

        try {
            if(Res.response.statusCode && Res.response.statusCode === 503) {
                return {
                    Error: "E",
                    ErrorMessage: "Session expired\nplease refresh and try again."
                };
            }

            errorJSON = JSON.parse(Res.response.body);

            if (errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
                errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
            } else if (errorJSON.error.message) {
                errData.ErrorMessage = errorJSON.error.message.value;
            } else {
                errData.ErrorMessage = "Error";
            }
        } catch (ex) {
            errData.ErrorMessage = Res.message;
        }

        return errData;
    },
    /*
     * AppBasis.js setModel function 에서 호출
     */
    setMetadataModel: function (oModel, modelName) {
        var schema = oModel.getServiceMetadata().dataServices.schema[0],
            complexType = {},
            entityType = {};
        $.map(schema.complexType || [], function (o) {
            var map = complexType[o.name] = {};
            $.map(o.property, function (p) {
                p.label = $.map(p.extensions || [], function (a) {
                    if (a.name === "label") {
                        return a.value;
                    }
                }).join("");
                map[p.name] = p;
            });
        });
        $.map(schema.entityType || [], function (o) {
            var map = entityType[o.name] = {};
            $.map(o.property, function (p) {
                p.label = $.map(p.extensions || [], function (a) {
                    if (a.name === "label") {
                        return a.value;
                    }
                }).join("");
                map[p.name] = p;
            });
            $.map(o.navigationProperty, function (p) {
                map[p.name] = p;
            });
        });

        var core = sap.ui.getCore();
        if (!core.getModel("_MetadataModel_")) {
            core.setModel(new sap.ui.model.json.JSONModel(), "_MetadataModel_");
        }
        core.getModel("_MetadataModel_").setProperty("/" + modelName, {
            complexType: complexType,
            entityType: entityType
        });
    },
    /**
     * 서비스 모델의 메타데이터를 이용해 오브젝트를 복사한다.
     * 1. Edm.DateTime => Adjust GMT 
     * 2. Edm.Decimal => Convert String
     *
     * @param {oModel} service model
     * @param {entityName} entity name
     * @param {originalObj} original object
     * @returns {copyData} new object
     */
    copyByMetadata: function (oModel, entityName, originalObj) {
        var copyData = {};
        if (typeof oModel === 'string' || oModel instanceof String) {
            var args = [].slice.call(arguments),
                modelName = args[0],
                type = args[1];
            entityName = args[2];
            originalObj = args[3];
            $.map(sap.ui.getCore().getModel("_MetadataModel_").getProperty("/" + modelName)[type][entityName], function (prop, name) {
                var v = originalObj[name];
                if (prop.type === "Edm.DateTime") {
                    var m = moment(v);
                    copyData[name] = m.isValid() ? common.Common.adjustGMTOdataFormat(m.startOf("date").toDate()) : v;
                } else if (prop.type === "Edm.Time") {
                    if (typeof v === "string") {
                        v = moment(v.replace(/\D/g, ""), "HHmmss").toDate();
                    } else if ($.isPlainObject(v) && v.ms) {
                        v = moment(v.ms).subtract(9, "hours").toDate();
                    }
                    copyData[name] = v ? common.Common.adjustTimeOdataFormat(v) : "PT00H00M00S";
                } else if (prop.type === "Edm.Byte") {
                    copyData[name] = Number(v || 0);
                } else if (prop.type === "Edm.Decimal") {
                    copyData[name] = String(v || 0);
                } else if (prop.type === "Edm.Boolean") {
                    copyData[name] = typeof v === "boolean" ? v : !!v;
                } else {
                    copyData[name] = typeof v === "number" ? String(v) : (v || "");
                }
            });
        } else {
            if (oModel instanceof sap.ui.model.Model || $.isPlainObject(oModel)) {
                $.each(oModel.getServiceMetadata().dataServices.schema[0].entityType, function (i, entity) {
                    if (entity.name == entityName) {
                        entity.property.forEach(function (prop) {
                            if (prop.type === "Edm.DateTime") {
                                copyData[prop.name] = originalObj[prop.name] ? common.Common.adjustGMTOdataFormat(originalObj[prop.name]) : originalObj[prop.name];
                            } else if (prop.type === "Edm.Time") {
                                copyData[prop.name] = originalObj[prop.name] ? originalObj[prop.name] : "P00DT00H00M00S";
                            } else if (prop.type === "Edm.Byte") {
                                copyData[prop.name] = originalObj[prop.name] ? Number(originalObj[prop.name]) : 0;
                            } else if (prop.type === "Edm.Decimal") {
                                copyData[prop.name] = originalObj[prop.name] || originalObj[prop.name] === 0 ? String(originalObj[prop.name]) : originalObj[prop.name];
                            } else if (prop.type === "Edm.Boolean") {
                                copyData[prop.name] = typeof originalObj[prop.name] === "boolean" ? originalObj[prop.name] : undefined;
                            } else {
                                copyData[prop.name] = originalObj[prop.name];
                            }
                        });
                        return false;
                    }
                });
            }
        }
        return copyData;
    },
    encryptByJava: function (p) {

        var encrypted,
            async = typeof p.async === "boolean" ? p.async : true,
            success = typeof p.success === "function" ? function (data) {
                p.success(JSON.parse(data).encData);
            } : function (data) {
                common.Common.log([].slice.call(arguments));

                encrypted = JSON.parse(data).encData;
            },
            error = typeof p.error === "function" ? p.error : function () {
                common.Common.log([].slice.call(arguments));
            };

        var promise = $.post({
            url: common.Common.getJavaOrigin($.app.getController(), "/encrypt"),
            data: {
                input: p.input
            },
            async: async,
            success: success,
            error: error
        }).promise();

        return p.async ? promise : encrypted;
    },
    activeClientTrace: function (p) {
        if (window._init_sequence_logging) {
            $.app.log("common.Common.activeClientTrace called.");
        }

        var traceInfo,
            async = typeof p.async === "boolean" ? p.async : true,
            success = typeof p.success === "function" ? function (data) {
                p.success(JSON.parse(data));
            } : function (data) {
                traceInfo = JSON.parse(data);
            },
            error = typeof p.error === "function" ? p.error : function () {
                common.Common.log([].slice.call(arguments));
            };

        var promise = $.post({
            url: common.Common.getJavaOrigin($.app.getController(), "/trace"),
            data: {},
            async: async,
            success: success,
            error: error
        }).promise();

        return p.async ? promise : traceInfo;
    },
    isExternalIP: function () {
        if (window._init_sequence_logging) {
            $.app.log("common.Common.checkProxyIP called.");
        }

        var result = sessionStorage.getItem('ehr.client.network');

        if(!result || result === "") {
            $.post({
                url: common.Common.getJavaOrigin($.app.getController(), "/check2FA"),
                data: {},
                async: false,
                success: function (data) {
                    result = JSON.parse(data).result;
    
                    sessionStorage.setItem('ehr.client.network', result);
                },
                error: function () {
                    common.Common.log([].slice.call(arguments));
                }
            });
        }

        return result === "E" ? true : false;
    },
    sendPush: function (p) {
        if (window._init_sequence_logging) {
            $.app.log("common.Common.sendPush called.");
        }

        if(!((p || {}).title && (p || {}).body && (p || {}).token)) {
            return false;
        }

        $.post({
            url: common.Common.getJavaOrigin($.app.getController(), "/push"),
            data: p,
            async: false,
            success: function (data) {
                common.Common.log([].slice.call(data));
            },
            error: function () {
                common.Common.log([].slice.call(arguments));
            }
        });
    },
    usePrivateLog: function (p) {

        setTimeout(function() {
            if (window._init_sequence_logging) {
                $.app.log("common.Common.usePrivateLog called.");
            }

            $.app.getModel("ZHR_COMMON_SRV").create(
                "/SaveConnEhrLogSet",
                {
                    ILangu: this.getSessionInfoByKey("Langu"),
                    TableIn: [{
                        Usrid: this.getSessionInfoByKey("Pernr"),
                        Menid: $.app.getMenuId(),
                        Pernr: p.pernr ? p.pernr : "",
                        Func: p.func ? p.func : "",
                        Mobile: p.mobile ? p.mobile : "",
                        Pcip : this.getSessionInfoByKey("Ipadd"),
                        Action : p.action
                    }]
                },
                {
                    success: function (data) {
                        common.Common.log(data);
                    },
                    error: function (res) {
                        common.Common.log(res);
                    }
                }
            );
        }.bind($.app.getController()), 0);
    },
    encryptPernr: function (vPernr) {
        if (!vPernr) return "";

        var oCommonModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
            oPayload = {},
            vReturnPercod = "";

        oPayload.Pernr = vPernr;

        oPayload.PernrEncodeNav = [];
        oPayload.PernrEncodeNav.push({
            Pernr: vPernr
        });

        oCommonModel.create("/PernrEncodingSet", oPayload, {
            success: function (data) {
                if (data) {
                    vReturnPercod = data.Percod;
                }
            },
            error: function (Res) {
                common.Common.log(Res);
            }
        });

        return vReturnPercod;
    },
    retrieveLoginInfo: function () {
        if (window._init_sequence_logging) {
            $.app.log("common.Common.retrieveLoginInfo called.");
        }

        var oRetrunLoginData = {};

        try {
            oRetrunLoginData = $.extend(true, JSON.parse(sessionStorage.getItem("ehr.odata.user")), {Percod: sessionStorage.getItem("ehr.odata.user.percod")});
            oRetrunLoginData.nickname = oRetrunLoginData.Ename;
    
            return oRetrunLoginData;
        } catch(e) {
            return {};
        }

        // if (!vPernr) return {};

        // try {
        //     var oCommonModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
        //         oRetrunLoginData = {},
        //         vPercod = "";

        //     vPercod = common.Common.encryptPernr(vPernr);

        //     oCommonModel.read("/EmpLoginInfoSet", {
        //         async: false,
        //         filters: [
		// 			new sap.ui.model.Filter("Lpmid", sap.ui.model.FilterOperator.EQ, "HACTA"),
		// 			new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, vPercod)
		// 		],
        //         success: function (data) {
        //             if (data && data.results && data.results.length) {
        //                 oRetrunLoginData = data.results[0];
        //                 oRetrunLoginData.Dtfmt = oRetrunLoginData.Dtfmt || "yyyy-MM-dd";
        //                 oRetrunLoginData.Pernr = (oRetrunLoginData.Pernr || "").replace(/^0+/g, "");
        //                 oRetrunLoginData.Percod = vPercod;
        //             }
        //         },
        //         error: function (res) {
        //             common.Common.log(res);
        //         }
        //     });

        //     return oRetrunLoginData;

        // } catch (e) {
        //     return {};

        // }
    },
    retrieveSFUserLocale: function () {
        if (window._init_sequence_logging) {
            $.app.log("common.Common.activeClientTrace called.");
        }

        var Langu = sessionStorage.getItem("ehr.sf-user.locale");
        Langu = Langu ? Langu.replace(/^([a-zA-Z]{2}).*$/, "$1").toUpperCase() : "KO";
        // new JSONModelHelper()
        //     .select("defaultLocale")
        //     .url("/odata/v2/User('${pernr}')".interpolate(pernr))
        //     .setAsync(false)
        //     .attachRequestCompleted(function () {
        //         common.Common.log("common.Common.retrieveSFUserLocale complete.", arguments);

        //         if(this.getData() && this.getData().d && this.getData().d.defaultLocale) {
        //             Langu = (this.getData().d.defaultLocale || "").replace(/^([a-zA-Z]{2}).*$/, "$1").toUpperCase();
        //         } else {
        //             Langu = "KO";
        //         }
        //     })
        //     .attachRequestFailed(function () {
        //         common.Common.log("common.Common.retrieveSFUserLocale fail.", arguments);

        //         Langu = "KO";
        //     })
        //     .load();
        return Langu;
    },
    DateFormatter: function (fVal, mask) {
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: mask ? mask : "yyyy-MM-dd"
        });

        return fVal != null ? dateFormat.format(new Date(common.Common.setTime(new Date(fVal)))) : "";
    },
    showErrorMessage: function (msg) {
        sap.m.MessageBox.show(msg, {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
            actions: [sap.m.MessageBox.Action.OK],
            styleClass: "sapUiSizeCompact"
        });
    },
    disableKeyInput: function (oControl) {
        if (oControl === null) return;
        oControl.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
    },
    changeCellphoneFormat: function (oEvent) {
        var oSource = oEvent.getSource();

        oSource.setValue(common.Common.formatTellNumber(oSource.getValue()));
    },
    RuleCellphone: function (input) {
        if (!input) return false;
        var regExp = /^\d{3}-\d{3,4}-\d{4}$/;

        return regExp.test(input.trim());
    },
    timeFormatter: function (v) {
        if (!v) return "";
        return v.replace(/\B(?=(\d{2})+(?!\d))/g, ":");
    },
    RuleEmail: function (input) {
        if (!input) return false;
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        return regExp.test(input.trim());
    },
    underscoreToCamelCase: function (input) {
        return input.toLowerCase().replace(/_+(\w|$)/g, function ($$, $1) {
            return $1.toUpperCase();
        }).capitalize();
    },
    toCurrency: function (v) {
        if (!v) {
            return "0";
        }
        var s = String(v).replace(/[^+-\d.eE]/g, "");
        if (isNaN(s)) {
            return "0";
        }
        return String(Number(s)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toNumber: function (v) {
        if (!v) {
            return 0;
        }
        var s = String(v).replace(/[^+-\d.eE]/g, "");
        if (isNaN(s)) {
            return "0";
        }
        return Number(s);
    },
    /*
    @param opts = {
    	length: Array length
    	isZeroStart: true-0부터 시작, false-1부터 시작
    }
    */
    makeNumbersArray: function (opts) {
        var options = $.extend({}, {
            length: 10,
            isZeroStart: true
        }, opts || {});

        return new Array(options.length)
            .join()
            .split(",")
            .map(function (item, index) {
                return options.isZeroStart ? index : ++index;
            });
    },
    FileTypeIcon: function (sType) {
        if (common.Common.checkNull(sType)) {
            return "sap-icon://document";
        } else {
            sType = sType.toUpperCase();

            if (sType.indexOf("JPG") != -1 || sType.indexOf("JPEG") != -1) {
                return "sap-icon://card";
            } else if (
                sType.indexOf("PRESENTATION") != -1 ||
                sType.indexOf("PPT") != -1 ||
                sType.indexOf("PPTX") != -1
            ) {
                return "sap-icon://ppt-attachment";
            } else if (
                sType.indexOf("EXCEL") != -1 ||
                sType.indexOf("SPREADSHEET") != -1 ||
                sType.indexOf("XLS") != -1 ||
                sType.indexOf("XLSX") != -1
            ) {
                return "sap-icon://excel-attachment";
            } else if (sType.indexOf("DOC") != -1 || sType.indexOf("WORDPROCESSINGML") != -1) {
                return "sap-icon://doc-attachment";
            } else if (sType.indexOf("PDF") != -1) {
                return "sap-icon://pdf-attachment";
            } else {
                return "sap-icon://document";
            }
        }
    },
    removeProperties: function () {
        var args = [].slice.call(arguments),
            o = args.shift();
        if (!args.length || !o) {
            return;
        }
        $.each(args, function (i, p) {
            if ((p instanceof Array) && p.length) {
                $.each(p, function (j, v) {
                    delete o[v];
                });
            } else {
                delete o[p];
            }
        });
        return o;
    },
    getPromise: function () {

        var args = [].slice.call(arguments),
            handleCallback = typeof args[0] === "boolean" ? args[0] : false,
            fn = handleCallback ? args[1] : args[0];

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    if (typeof fn === "function") {
                        if (handleCallback) {
                            fn(resolve, reject);
                        } else {
                            fn();
                        }
                    }
                    if (!handleCallback) {
                        resolve();
                    }
                } catch (e) {
                    if (!handleCallback) {
                        reject(e);
                    }
                }
            }, 0);
        });
    },
    getPCLogStructure: function () {
        var oLoginModel = $.app.getModel("session");
        if (!oLoginModel) {
            return null;
        }

        return {
            Datlo: common.Common.adjustGMTOdataFormat(new Date()),
            Timlo: common.Common.getCurrentTimeOdataFormat(),
            Zonlo: oLoginModel.getProperty("/Zonlo"),
            Ip: oLoginModel.getProperty("/Ipadd")
        };
    },
    onPressTableHeaderInformation: function (oEvent, aMessages) {
        if (oEvent.getId() === "hover") {
            var oEventSource = oEvent.getSource();
            setTimeout(function () {
                // create popover
                if (!this._oPopover) {
                    this._oPopover = sap.ui.jsfragment("fragment.informationPopover", this);
                    this._oPopover
                        .toggleStyleClass("custom-tooltip", true)
                        .setModel(new sap.ui.model.json.JSONModel());
                    this.getView().addDependent(this._oPopover);
                }

                if (!(aMessages instanceof Array)) {
                    aMessages = [aMessages];
                }
                //<br/>태그 줄바꿈 추가
                var vTmp = null;
                var vArr = [];
                
                aMessages.forEach(function(el){
                    if(el.search("<br/>") != -1) vTmp = el.split("<br/>");
                });
                
                if(vTmp!=null){
                    vTmp.forEach(function(e){
                        vArr.push(e);
                    });
                    if(vArr.length != 0) aMessages = vArr;
                }
                
                this._oPopover.getModel().setData({
                    messages: aMessages.map(function (elem) {
                        return {
                            message: elem
                        };
                    })
                });
                this._oPopover.openBy(oEventSource);
            }.bind(this), 0);
        } else {
            if (this._oPopover) {
                this._oPopover.close();
            }
        }
    },
    setOnlyDigit: function (oEvent) {
        var inputValue = oEvent.getParameter('value').trim(),
            convertValue = inputValue.replace(/[^\d]/g, '');

        oEvent.getSource().setValue(convertValue);
    },
    getTableInResults: function (oData, sTableName) {
        if (!oData) {
            return [];
        }
        var TableIn = oData[sTableName];
        if (!TableIn) {
            return [];
        }
        var results = TableIn.results;
        if (!results || !results.length) {
            return [];
        }
        return results;
    },

    onChangeMoneyInput : function(oEvent){
		inputValue = oEvent.getSource().getValue();
		oEvent.getSource().setValue(common.Common.numberWithCommas(inputValue.replace(/[^\d]/g, '')));
    },
    
    openPopup: function(url) {

        if (!url) return true;

        var width = 1000, height = screen.availHeight * 0.9,
        left = (screen.availWidth - width) / 2,
        top = (screen.availHeight - height) / 2,
        popup = window.open(url, "smoin-approval-popup", [
            "width=" + width,
            "height=" + height,
            "left=" + left,
            "top=" + top,
            "status=yes,resizable=yes,scrollbars=yes"
        ].join(","));

        if (!popup) {
            sap.m.MessageBox.alert(this.getBundleText("MSG_00073"), { // 원활한 진행을 위해 브라우저의 설정 메뉴에서 팝업차단을 해제하시기 바랍니다.
                title: this.getBundleText("LABEL_00149") // 안내
            });

            return false;
        } else {
            setTimeout(function() {
                popup.focus();
            }, 500);
        }

        return true;
    },

    base64ToArrayBuffer: function(base64) {
		var binaryString = window.atob(base64);
		var binaryLen = binaryString.length;
		var bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) {
		   var ascii = binaryString.charCodeAt(i);
		   bytes[i] = ascii;
		}
		return bytes;
	},

	saveByteArray: function(reportName, mimeType, byte) {
		var blob = new Blob([byte], {type: mimeType});
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		var fileName = reportName;
		link.download = fileName;
		link.click();
	}
 
};