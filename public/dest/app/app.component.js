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
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'assassin',
        template: "\n\t\t<nav>\n\t\t\t<a href=\"/\">\n\t\t\t\t<div class=\"for-nav\">\n\t\t\t\t\t<p class=\"p-nav\">Home</p>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t\t<a href=\"/game-selection\">\n\t\t\t\t<div class=\"for-nav\">\n\t\t\t\t\t<p class=\"p-nav\">Create or Join</p>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t\t<a href=\"/game-history\">\n\t\t\t\t<div class=\"for-nav\">\n\t\t\t\t\t<p class=\"p-nav\">Game History</p>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t</nav>\n\t\t<router-outlet></router-outlet>\n\t",
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map