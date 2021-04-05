/**
 * L2PFeedContainer
 *
 * Create Date : 2015. 04. 14
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PFeedContainer");

sap.ui.core.Control.extend("control.L2PFeedContainer", {
	_vIdx: 1,

	metadata: {
		properties: {
			news: { type: "string[]" },
			dates: { type: "string[]" },
			writers: { type: "string[]" },
			images: { type: "string[]" },
			cssPath: { type: "string" },
			duration: { type: "int", defaultValue: 5 },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "210px" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "480px" }
		},
		aggregations: {},

		associations: {},

		events: {}
	},

	init: function () {},

	onAfterRendering: function () {
		var vBackgroundImages = this.getImages();
		var vNews = this.getNews();
		var vWriters = this.getWriters();
		var vDates = this.getDates();
		var vDuration = this.getDuration();

		var oController = this;

		var changeNew = function () {
			$(".L2PFeedContainer").css(
				"background-image",
				"url('" + vBackgroundImages[oController._vIdx % vBackgroundImages.length] + "')"
			);

			$(".L2PFeedNews").html(vNews[oController._vIdx % vNews.length]);
			$(".L2PFeedWriter").html(vWriters[oController._vIdx % vWriters.length]);
			$(".L2PFeedDate").html(vDates[oController._vIdx % vDates.length]);

			$(".L2PFeedNewsLayout").css("left", "500px");
			$(".L2PFeedNewsLayout").animate(
				{
					left: 0
				},
				1000,
				function () {}
			);

			oController._vIdx++;
			setTimeout(changeNew, vDuration * 1000);
		};

		setTimeout(changeNew, vDuration * 1000);
	},

	renderer: {
		render: function (oRm, oControl) {
			var cssPath = oControl.getCssPath();
			jQuery.sap.includeStyleSheet(cssPath + "L2PFeed.css");

			var vBackgroundImages = oControl.getImages();
			var vNews = oControl.getNews();
			var vWriters = oControl.getWriters();
			var vDates = oControl.getDates();

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PFeedContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.addStyle("background-image", "url('" + vBackgroundImages[0] + "')");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div class='L2PFeedNewsLayout'>");

			oRm.write("<div class='L2PFeedNews'>");
			oRm.write(vNews[0]);
			oRm.write("</div>");

			oRm.write("<div class='L2PFeedFooter'>");
			oRm.write("<span class='L2PFeedWriter'>" + vWriters[0] + "</span>");
			oRm.write("<span class='L2PFeedDate'>" + vDates[0] + "</span>");
			oRm.write("</div>");

			oRm.write("</div>");

			oRm.write("</div>");
		}
	}
});

control.L2PFeedContainer.prototype.exit = function () {};
