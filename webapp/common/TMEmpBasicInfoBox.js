sap.ui.define([
	"sap/m/FlexBox"
], function(FlexBox) {
	"use strict";

	return FlexBox.extend("common.TMEmpBasicInfoBox", {

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
						width: "55px",
						height: "55px"
					})
					.addStyleClass("tm-employee-basic-info-photo"),
					new sap.m.VBox({
						items: [
							new sap.m.HBox({
								alignItems: sap.m.FlexAlignItems.End,
								items: [
									new sap.m.Text({text: "{nickname}"}).addStyleClass("tm-employee-basic-info-nickname"),
									new sap.m.Text({text: "({Pernr})"}).addStyleClass("tm-employee-basic-info-title ml-5px")
								]
							}),
							new sap.m.HBox({
								items: [
									new sap.m.Text({text: "{Btrtx} / {Stext} / {PGradeTxt} / {ZtitleT}"}).addStyleClass("tm-employee-basic-info-department")
								]
							})
						]
					})
					.addStyleClass("ml-10px")
				]
			}]);

			this.setModel(model)
				.bindElement("/User")
				.addStyleClass("tm-employee-basic-info-box");
		}
	});

});