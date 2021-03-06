"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var auth_service_1 = require("./auth.service");
var api_service_1 = require("./api.service");
var geo_service_1 = require("./geo.service");
var io = require("socket.io-client");
var InGameComponent = (function () {
    function InGameComponent(authService, apiService, geoService) {
        this.authService = authService;
        this.apiService = apiService;
        this.geoService = geoService;
        this.attacking = false;
        this.error = false;
        this.targetOnline = false;
        this.gameId = this.authService.user.currentGame;
    }
    InGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
        this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
        this.locationInterval = setInterval(this.sendLocation.bind(this), 15000);
        this.socket = io();
        this.socket.on("target online", function (data) {
            console.log("target online: ", data);
            if (data) {
                _this.targetOnline = true;
                if (data.targetLat) {
                    _this.targetLat = data.targetLat;
                    _this.targetLong = data.targetLong;
                    _this.targetAcc = data.targetAcc;
                    _this.targetTime = data.targetTime;
                    _this.update();
                }
            }
            else {
                _this.targetOnline = false;
            }
        });
        this.socket.on("score", function (data) {
            _this.dataTest = data;
        });
        this.socket.on("being watched", function (data) {
            _this.rapidEmit(data);
            console.log("you are being watched: ", data);
        });
        this.socket.on("attack result", function (data) {
            if (data) {
                _this.attackMessage = "Target taken out. Awaiting info on next target...";
                _this.geoService.getLocation(_this.positionSuccess.bind(_this), _this.positionErr.bind(_this));
            }
            else {
                _this.attackMessage = "Target missed... ";
                setTimeout(function () {
                    this.attacking = false;
                    this.attackMessage = "";
                }.bind(_this), 15000);
            }
        });
        this.socket.on("killed", function (data) {
            clearInterval(_this.locationInterval);
            _this.error = true;
            _this.errorMessage = "You were killed by: " + data;
        });
        this.socket.on("end game", function (data) {
            _this.attackMessage = "";
            _this.error = true;
            _this.errorMessage = "Game Over. You were the last man standing!!!";
        });
    };
    ;
    // functions for styling text colors based on variables
    InGameComponent.prototype.online = function () {
        if (this.targetOnline) {
            return "green";
        }
        return "cornflowerblue";
    };
    InGameComponent.prototype.resolution = function () {
        if (this.accuracy > 100) {
            return "red";
        }
        else if (this.accuracy > 50) {
            return "yellow";
        }
        else {
            return "green";
        }
    };
    // functions for practical uses
    InGameComponent.prototype.takeAim = function () {
        var data = {
            targetName: this.targetName,
            trackerName: this.authService.user.name
        };
        this.takingAim = true;
        this.socket.emit("take aim", data);
        console.log("take aim data: ", data);
        setInterval(function () {
            if (this.takingAim) {
                this.takingAim = false;
                this.attacking = false;
                this.attackMessage = "";
            }
        }.bind(this), 20000);
    };
    InGameComponent.prototype.attack = function () {
        this.attacking = true;
        this.takingAim = false;
        this.attackMessage = "Confirming kill...";
        var data = {
            distance: this.distanceToTarget,
            accuracy: this.accuracy,
            targetName: this.targetName,
            gameId: this.authService.user.currentGame
        };
        this.socket.emit("attack", data);
    };
    InGameComponent.prototype.rapidEmit = function (hunterName) {
        console.log("rapidEmit()");
        this.rapid = setInterval(function () {
            console.log("inside rapidEmit interval function");
            var data = {
                trackerName: hunterName,
                latitude: this.myLat,
                longitude: this.myLong,
                accuracy: this.myAcc,
                time: this.myTime
            };
            console.log("data inside rapidEmit interval funciton: ", data);
            this.socket.emit("give aim", data); // todo finish function for handling someone taking aim at you
        }.bind(this), 1000);
        setTimeout(function () {
            clearInterval(this.rapid);
            this.takingAim = false;
            console.log("inside setTimeout function.");
        }.bind(this), 15000);
    };
    InGameComponent.prototype.sendLocation = function () {
        console.log("sendLocation()");
        var toSend = {
            gameId: this.gameId,
            latitude: this.myLat,
            longitude: this.myLong,
            accuracy: this.myAcc,
            time: this.myTime,
            currentTarget: this.targetName
        };
        this.socket.emit("update-location", toSend);
    };
    InGameComponent.prototype.positionSuccess = function (pos) {
        var _this = this;
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        this.apiService.getObs("/api/target").subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
                if (res.targetName) {
                    _this.targetName = res.targetName;
                }
            }
            else {
                _this.attacking = false;
                _this.attackMessage = "";
                _this.targetName = res.targetName;
                _this.targetLat = res.latitude;
                _this.targetLong = res.longitude;
                _this.targetAcc = res.accuracy;
                _this.targetTime = res.timestamp;
                _this.update();
                var joinData = {
                    name: _this.authService.user.name,
                    targetName: res.targetName,
                    lat: coor.latitude,
                    long: coor.longitude,
                    time: pos.timestamp,
                    acc: coor.accuracy,
                    score: _this.authService.user.score
                };
                _this.socket.emit("join", joinData);
            }
        });
    };
    InGameComponent.prototype.positionErr = function (err) {
        console.log(err);
        this.error = true;
        this.errorMessage = "Sorry, something went wrong. Please reload and try again.";
    };
    InGameComponent.prototype.iMovedSuccess = function (pos) {
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        this.update();
    };
    InGameComponent.prototype.update = function () {
        if (this.myLat && this.targetLat) {
            this.distanceToTarget = this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat);
            this.accuracy = this.myAcc + this.targetAcc;
            this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
        }
        // console.log("update() invoked");
        // console.log("target lat, long, acc", this.targetLat, this.targetLong, this.targetAcc);
        // console.log("my lat, long, acc", this.myLat, this.myLong, this.myAcc);
    };
    InGameComponent.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    ;
    InGameComponent.prototype.deg = function (x) {
        return x * (180 / Math.PI);
    };
    ;
    InGameComponent.prototype.getDistance = function (mLong, mLat, tLong, tLat) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(tLat - mLat);
        var dLong = this.rad(tLong - mLong);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(mLat)) * Math.cos(this.rad(tLat)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };
    ;
    InGameComponent.prototype.getBearing = function (startLong, startLat, endLong, endLat) {
        startLat = this.rad(startLat);
        startLong = this.rad(startLong);
        endLat = this.rad(endLat);
        endLong = this.rad(endLong);
        var dLong = endLong - startLong;
        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0) {
                dLong = -(2.0 * Math.PI - dLong);
            }
            else {
                dLong = (2.0 * Math.PI + dLong);
            }
        }
        return (this.deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    };
    return InGameComponent;
}());
InGameComponent = __decorate([
    core_1.Component({
        template: "\n\t\t<div>\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h2 [style.color]=\"online()\">Target: {{targetName}}{{dataTest}}</h2>\n\t\t\t<p *ngIf=\"targetOnline\">Target Aquired</p>\n\t\t\t<p *ngIf=\"!targetOnline\">Target Offline</p>\n\t\t</div>\n\t\t<div *ngIf=\"!error && !attacking\">\n\t\t\t<h3>Distance to Target: {{distanceToTarget}} meters</h3>\n\t\t\t<h3>Direction to Target: {{bearing}} degrees</h3>\n\t\t\t<h3 [style.color]=\"resolution()\">Accuracy: {{accuracy}} meters</h3>\n\t\t</div>\n\t\t<div *ngIf=\"error\">\n\t\t\t<h2 class=\"error\">{{errorMessage}}</h2>\n\t\t</div>\n\t\t<button *ngIf=\"!takingAim && !attacking && !error\" class=\"button bottom\" (click)=\"takeAim()\">Take Aim</button>\n\t\t<button *ngIf=\"takingAim && !attacking && !error\" class=\"button bottom\" (click)=\"attack()\">Attack</button>\n\t\t<div *ngIf=\"attacking\">\n\t\t\t<h2>{{attackMessage}}</h2>\n\t\t</div>\n\t",
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_service_1.ApiService,
        geo_service_1.GeoService])
], InGameComponent);
exports.InGameComponent = InGameComponent;
//# sourceMappingURL=in-game.component.js.map