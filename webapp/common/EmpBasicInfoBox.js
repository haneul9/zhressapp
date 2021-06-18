sap.ui.define([
	"sap/m/FlexBox"
], function(FlexBox) {
	"use strict";

	return FlexBox.extend("common.EmpBasicInfoBox", {

		/*
		@param userId
		@example new common.EmpBasicInfoBox(model);
		*/
		constructor: function(model) {

			FlexBox.apply(this, [{
				alignItems: sap.m.FlexAlignItems.Center,
				items: [
					new sap.m.Image({
						src: {
							path: "photo",
							formatter: function(pV) {
								return pV || "images/photoNotAvailable.gif";
							}
						},
						width: "34px",
						height: "34px"
					})
					.addStyleClass("employee-basic-info-photo"),
					new sap.m.VBox({
						items: [
							new sap.m.HBox({
								alignItems: sap.m.FlexAlignItems.End,
								items: [
									new sap.m.Text({text: "{Ename}"}).addStyleClass("employee-basic-info-ename"),
									new sap.m.Text({text: "({Pernr})"}).addStyleClass("employee-basic-info-title ml-5px"),
									new sap.m.Text({text: "{Pbtxt} / {Stext} / {PGradeTxt} / {ZtitleT}"}).addStyleClass("employee-basic-info-department")
								]
							})
						]
					})
					.addStyleClass("ml-10px")
				]
			}]);

			this.setModel(model)
				.bindElement("/User")
				.addStyleClass("employee-basic-info-box");
		}
	});

});