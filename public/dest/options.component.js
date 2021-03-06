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
var api_service_1 = require("./api.service");
var router_1 = require("@angular/router");
var auth_service_1 = require("./auth.service");
var OptionsComponent = (function () {
    function OptionsComponent(apiService, authService, router) {
        this.apiService = apiService;
        this.authService = authService;
        this.router = router;
        // display variables and functions
        this.selectionMade = false;
        this.result = false;
        this.resultMessage = "";
        this.displayChangePassword = false;
        this.displayLeaveGame = false;
        // change password variables and functions
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    OptionsComponent.prototype.displayOptions = function () {
        this.selectionMade = false;
        this.result = false;
        this.resultMessage = "";
        this.displayChangePassword = false;
        this.displayLeaveGame = false;
    };
    OptionsComponent.prototype.changePassword = function () {
        this.selectionMade = true;
        this.displayChangePassword = true;
    };
    OptionsComponent.prototype.leaveGame = function () {
        this.selectionMade = true;
        this.displayLeaveGame = true;
    };
    OptionsComponent.prototype.passwordVerify = function () {
        if (this.newPassword === this.confirmPassword && this.newPassword.length >= 8) {
            return true;
        }
        return false;
    };
    OptionsComponent.prototype.sendPassword = function () {
        var _this = this;
        if (this.passwordVerify()) {
            var toSend = {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword
            };
            this.apiService.postObs("/api/change-password", toSend).subscribe(function (res) {
                _this.result = true;
                _this.resultMessage = res.message;
            });
        }
    };
    ;
    // leave game variables and functions
    OptionsComponent.prototype.confirmLeaveGame = function () {
        var _this = this;
        this.apiService.postObs("/api/leave-game", this.authService.user.currentGame).subscribe(function (res) {
            _this.result = true;
            _this.resultMessage = res.message;
            if (res.message === "Game Abandoned") {
                _this.authService.user.currentGame = "";
                _this.authService.user.inGame = false;
                _this.authService.user.gameAdmin = false;
                _this.authService.user.currentTarget = "";
            }
        });
    };
    OptionsComponent.prototype.about = function () {
        this.router.navigate(["/about"]);
    };
    OptionsComponent.prototype.admin = function () {
        // stub
        this.router.navigate(["/admin"]);
    };
    OptionsComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<h2>Welcome: {{this.authService.user.name}}</h2>\n\t\t<div *ngIf=\"!selectionMade && !result\">\n\t\t\t<div class=\"button\" (click)=\"changePassword()\" *ngIf=\"!selectionMade\">\n\t\t\t\t<p class=\"inside-button\">Change Password</p>\n\t\t\t</div>\n\t\t\t<div class=\"button\" *ngIf=\"this.authService.user.currentGame\" (click)=\"leaveGame()\">\n\t\t\t\t<p class=\"inside-button\">Leave Current Game</p>\n\t\t\t</div>\n\t\t\t<div class=\"button\" *ngIf=\"this.authService.user.gameAdmin\" (click)=\"admin()\">\n\t\t\t\t<p class=\"inside-button\">Admin Options</p>\n\t\t\t</div>\n\t\t\t<div class=\"button\" (click)=\"about()\" *ngIf=\"!selectionMade\">\n\t\t\t\t<p class=\"inside-button\">About</p>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div *ngIf=\"selectionMade && !result\">\n\t\t\t<div *ngIf=\"displayChangePassword\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"oldPassword\" placeholder=\"Old Password\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"newPassword\" placeholder=\"New Password\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"confirmPassword\" placeholder=\"Confirm New Password\">\n\t\t\t\t<h3 class=\"error\" *ngIf=\"!passwordVerify()\">Passwords must match and contain at least 8 characters</h3>\n\t\t\t\t<div class=\"button\" (click)=\"sendPassword()\">\n\t\t\t\t\t<p class=\"inside-button\">Change Password</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div *ngIf=\"displayLeaveGame\">\n\t\t\t\t<h3>Are you sure you want to leave your current game?</h3>\n\t\t\t\t<div class=\"button\" (click)=\"confirmLeaveGame()\">\n\t\t\t\t\t<p class=\"inside-button\">Yes</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"button\" (click)=\"displayOptions()\">\n\t\t\t\t\t<p class=\"inside-button\">No</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t\t<div *ngIf=\"result\">\n\t\t\t<h3>{{resultMessage}}</h3>\n\t\t\t<div class=\"button\" (click)=\"displayOptions()\">\n\t\t\t\t<p class=\"inside-button\">Back to Options</p>\n\t\t\t</div>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, auth_service_1.AuthService, router_1.Router])
    ], OptionsComponent);
    return OptionsComponent;
}());
exports.OptionsComponent = OptionsComponent;
//# sourceMappingURL=options.component.js.map