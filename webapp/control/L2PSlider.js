/**
 * L2PSlider
 *
 * @memberOf control.L2PSlider
 *
 * Create Date : 2015. 09. 20
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PSlider");

sap.ui.core.Control.extend("control.L2PSlider", {
	/*
	 * @memberOf control.L2PSlider
	 */

	metadata: {
		properties: {
			value: { type: "int" },
			values: { type: "int[]" },
			step: { type: "int", defaultValue: 1 },
			min: { type: "int", defaultValue: 0 },
			max: { type: "int", defaultValue: 100 },
			orientation: { type: "string", defaultValue: "horizontal" },
			range: { type: "boolean", defaultValue: false },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			sliding: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("sliding");
	},

	onAfterRendering: function () {
		var self = this,
			domNode = this.getDomRef();

		$(domNode).bind("sliding", function () {
			self.fireSelect({
				value: "",
				values: []
			});
		});

		var SlideProcess = function (any) {
			self.fireSliding({ value: any.value, values: any.values });
		};

		$("#" + this.getId() + "-inner_Slider").slider({
			range: this.getRange(),
			min: this.getMin(),
			max: this.getMax(),
			step: this.getStep(),
			orientation: this.getOrientation(),
			slide: function (event, ui) {
				SlideProcess(ui);
			}
		});

		if (this.getRange()) {
			var v = this.getValues();
			$("#" + this.getId() + "-inner_Slider").slider("values", 0, v[0]);
			$("#" + this.getId() + "-inner_Slider").slider("values", 0, v[1]);
		} else {
			$("#" + this.getId() + "-inner_Slider").slider("value", this.getValue());
		}
	},

	renderer: {
		render: function (oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div id='" + oControl.getId() + "-inner_Slider' ");
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("</div>");
		}
	}
});

control.L2PSlider.prototype.exit = function () {};

control.L2PInput.M_EVENTS = { sliding: "sliding" };
