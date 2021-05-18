sap.ui.define([
	"common/Common",
	"common/PageHelper"
], function (Common, PageHelper) {
    "use strict";
    
    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

    sap.ui.jsview(SUB_APP_ID, {

        getControllerName: function () {
			return SUB_APP_ID;
        },

        getCapaBox : function(oController){
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions : [
                    {
                        axis : 1,
                        name : oBundleText.getText("LABEL_12116"), // 평가 항목
                        value : "{Compgrptx}"
                    }
                ],
                measures : [
                    {
                        name : oBundleText.getText("LABEL_12117"), // 1차평가점수
                        value : "{Comppnt1}"  
                    },
                    {
                        name : oBundleText.getText("LABEL_12118"), // 동일 Grade 평균 점수
                        value : "{Comppnt2}"
                    }
                ],
                data : {
                    path : "/Data2"
                }
            });
            
            var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart", {
                width: "100%",
                height: "350px",
                vizType : "radar",
                uiConfig : {
                    applicationSet : "fiori",
                    showErrorMessage : true
                },
                dataset : oDataset,
                feeds : [
                    new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid : "categoryAxis",
                        type : "Dimension",
                        values : [oBundleText.getText("LABEL_12116")]
                    }),
                    new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid : "valueAxis",
                        type : "Measure",
                        values : [oBundleText.getText("LABEL_12117"), oBundleText.getText("LABEL_12118")]
                    })
                ],
                vizProperties : {
                    plotArea: {
                        dataLabel: {
                            visible: false
                        },
                        colorPalette :  ["#ffcd56", "#4bc0c0"],
                        polarAxis : {
                            label : {
                                style : {
                                    color : "#333333",
                                    fontSize : "16px",
                                    fontWeight : "500"
                                }
                            }
                        },
                        gridline: {
                            color : "#e6e6e6"
                        }
                    },
                    legend: {
                        visible : true
                    },
                    legendGroup: {
                        layout : {
                            alignment: "center",
                            position: "bottom"
                        }
                    },
                    valueAxis: {
                        label: {
                            allowDecimals : false
                        },
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        text : "",
                        visible: false
                    },
                    interaction : { 
                        selectability : { 
                            mode : "single" 
                        } 
                    }
                }
            });
            
            var oPopOver = new sap.viz.ui5.controls.Popover();
                oPopOver.connect(oVizFrame.getVizUid());
                
            var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                columns : 1,
                width : "100%",
                rows : [
                        new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                         content : [oVizFrame],
                                         hAlign : "Begin",
                                         vAlign : "Top"
                                     })]
                        })]
            });            
            return oMatrix;
        },

        getMBOOpi : function(oController){
            return new sap.m.TextArea({value:"{Comment1}",width:"100%",rows:3,editable:false});
        },

        getCapaOpi : function(oController){
            return new sap.m.TextArea({value:"{Comment2}",width:"100%",rows:3,editable:false});
        },

        getInputBox : function(oController){
            return new sap.m.VBox({
				items: [
                    new sap.m.VBox({
                        items:[
                            new sap.ui.commons.layout.MatrixLayout(oController.PAGEID+"_Mat",{columns:2}),
                            new sap.m.VBox(oController.PAGEID+"_Panel1",{
                                items:[
                                    new sap.ui.core.HTML({
                                        content:"<div style='height:40px;'><span style='vertical-align:middle;font-size:14px;font-weight:bold;'>"+oController.getBundleText("LABEL_07320")+"</span></div>"
                                    }),
                                    new sap.m.Table(oController.PAGEID+"_MBOTable",{
                                        inset: false,
                                        rememberSelections: false,
                                        noDataText: "{i18n>LABEL_00901}",
                                        growing: true,
                                        growingThreshold: 10,
                                        columns: [
                                            new sap.m.Column({
                                                width: "20%",
                                                hAlign: sap.ui.core.TextAlign.Center,
                                                header: new sap.m.Text({text: "No."})
                                            }),
                                            new sap.m.Column({
                                                width: "20%",
                                                hAlign: sap.ui.core.TextAlign.Center,
                                                header: new sap.m.Text({text: "{i18n>LABEL_07321}"})
                                            }),
                                            new sap.m.Column({
                                                width: "20%",
                                                hAlign: sap.ui.core.TextAlign.Center,
                                                header: new sap.m.Text({text: "{i18n>LABEL_07322}"})
                                            }),
                                            new sap.m.Column({
                                                width: "20%",
                                                hAlign: sap.ui.core.TextAlign.Center,
                                                header: new sap.m.Text({text: "{i18n>LABEL_07323}"})
                                            })
                                        ],
                                        items: {
                                            path: "/Data",
                                            template: new sap.m.ColumnListItem({
                                                type: sap.m.ListType.Active,
                                                counter: 10,
                                                cells: [
                                                    new sap.m.Text({ text: "{Idx}" }),
                                                    new sap.m.Text({ text: "{name}" }),
                                                    new sap.m.Text({ text: "{done}" }),
                                                    new sap.m.Text({ text: "{rating}" })
                                                ]
                                            })
                                        }}).setModel(oController.oModel)
                                ]
                            }),
                            new sap.m.VBox(oController.PAGEID+"_Panel2",{
                                items:[
                                    new sap.ui.core.HTML({
                                        content:"<div style='height:40px;'><span style='vertical-align:middle;font-size:14px;font-weight:bold;'>"+oController.getBundleText("LABEL_07327")+"</span></div>"
                                    }),
                                    this.getCapaBox(oController)
                                ]
                            }),
                            new sap.m.VBox(oController.PAGEID+"_Panel3",{
                                items:[
                                    new sap.ui.core.HTML({
                                        content:"<div style='height:40px;'><span style='vertical-align:middle;font-size:14px;font-weight:bold;'>"+oController.getBundleText("LABEL_07328")+"</span></div>"
                                    }),
                                    this.getMBOOpi(oController)
                                ]
                            }).bindElement("/Data"),
                            new sap.m.VBox(oController.PAGEID+"_Panel4",{
                                items:[
                                    new sap.ui.core.HTML({
                                        content:"<div style='height:40px;'><span style='vertical-align:middle;font-size:14px;font-weight:bold;'>"+oController.getBundleText("LABEL_07329")+"</span></div>"
                                    }),
                                    this.getCapaOpi(oController)
                                ]
                            }).bindElement("/Data")
                        ]
                    })                
                ]
            }).addStyleClass("vbox-form-mobile");
        },
        
        createContent: function(oController) {

            return new PageHelper({
                idPrefix: "Detail-",
                // title: "{i18n>LABEL_07001}",    // 평가이력
                showNavButton: true,
                navBackFunc: oController.navBack.bind(oController),
                contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                contentItems: [
                     this.getInputBox(oController)
                ]
            })
            .setModel(oController.oModel);
        }

	});
});