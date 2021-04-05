sap.ui.define([], function () {
    "use strict";

    var Signature = {
        pageHandler: null,
        canvas: null,
        context: null,
        pos: {
            drawable: false,
            X: -1,
            Y: -1
        },

        initialize: function (pageHandler, canvas, options) {
            this.pageHandler = pageHandler;

            this.canvas = canvas;
            this.canvas.width = options.width || 500;
            this.canvas.height = options.height || 200;

            this.context = this.canvas.getContext("2d");
            this.context.fillStyle = "#fff";
            this.context.strokeStyle = "#444";
            this.context.lineWidth = 1.5;
            this.context.lineCap = "round";

            this.canvas.addEventListener("mousedown", this.listener.bind(this), false);
            this.canvas.addEventListener("mousemove", this.listener.bind(this), false);
            this.canvas.addEventListener("mouseup", this.listener.bind(this), false);
            this.canvas.addEventListener("mouseout", this.listener.bind(this), false);
            this.canvas.addEventListener("touchstart", this.listener.bind(this), false);
            this.canvas.addEventListener("touchmove", this.listener.bind(this), false);
            this.canvas.addEventListener("touchend", this.listener.bind(this), false);

            this.pageHandler.oModel.setProperty("/WriteForm/isSigned", false);

            return this;
        },

        listener: function (e) {
            switch (e.type) {
            case "touchstart":
            case "mousedown":
                this.initDraw.call(this, e);
                break;
            case "touchmove":
            case "mousemove":
                if (this.pos.drawable) this.draw.call(this, e);
                break;
            case "touchend":
            case "mouseout":
            case "mouseup":
                this.finishDraw.call(this);
                break;
            }
        },

        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pageHandler.oModel.setProperty("/WriteForm/isSigned", false);
        },

        initDraw: function (e) {
            this.context.beginPath();
            this.pos.drawable = true;

            var coors = this.getPosition.call(this, e);
            this.pos.X = coors.X;
            this.pos.Y = coors.Y;

            this.context.moveTo(this.pos.X, this.pos.Y);
        },

        draw: function (e) {
            var coors = this.getPosition.call(this, e);
            this.context.lineTo(coors.X, coors.Y);
            this.pos.X = coors.X;
            this.pos.Y = coors.Y;

            this.context.stroke();
        },

        finishDraw: function () {
            if (this.pos.drawable) {
                this.pageHandler.oModel.setProperty("/WriteForm/isSigned", true);
            }

            this.pos.drawable = false;
            this.pos.X = -1;
            this.pos.Y = -1;
        },

        getPosition: function (e) {
            var x, y;

            if (e.changedTouches && e.changedTouches[0]) {
                var offsety = this.canvas.offsetTop || 0;
                var offsetx = this.canvas.offsetLeft || 0;

                x = e.changedTouches[0].pageX - offsetx;
                y = e.changedTouches[0].pageY - offsety;
            } else if (e.layerX || 0 == e.layerX) {
                x = e.layerX;
                y = e.layerY;
            } else if (e.offsetX || 0 == e.offsetX) {
                x = e.offsetX;
                y = e.offsetY;
            }

            /*
             * IE 인 경우 y 좌표 설정
             */
            var isIE = false || !!document.documentMode;
            if (isIE) {
                y = y - 70;
            }

            return {
                X: x,
                Y: y
            };
        },

        getDataUrl: function () {
            return this.canvas.toDataURL();
        },

        dataURItoBlob: function () {
            var dataURI = this.canvas.toDataURL();
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        }
    };

    return Signature;
});