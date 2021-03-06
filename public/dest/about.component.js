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
var router_1 = require("@angular/router");
var auth_service_1 = require("./auth.service");
var AboutComponent = (function () {
    function AboutComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        // display booleans
        this.displayJoin = true;
        this.displayCreate = true;
        this.displayWaiting = true;
        this.displayPlaying = true;
        this.displayEnd = true;
        this.displayFeedback = true;
    }
    AboutComponent.prototype.toLogin = function () {
        this.router.navigate(["/login"]);
    };
    AboutComponent.prototype.toJoin = function () {
        this.router.navigate(["/game-selection"]);
    };
    AboutComponent.prototype.toGame = function () {
        this.router.navigate(["/in-game"]);
    };
    AboutComponent.prototype.toHistory = function () {
        this.router.navigate(["/game-history"]);
    };
    AboutComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<h2 class=\"about\">About The MDG</h2>\n\t\t<div class=\"button\" id=\"aboutButton\" *ngIf=\"!this.authService.user\">\n\t\t\t<p class=\"about-button\" (click)=\"toLogin()\">Login/Register</p>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayJoin = !displayJoin\">Joining a Game</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayJoin\">\n\t\t\t<h3 class=\"about\">Joining a Game</h3>\n\t\t\t<ol>\n\t\t\t\t<li>Navigate to the Join/Create Game page.</li>\n\t\t\t\t<li>Enter the username of the game creator into the input field.</li>\n\t\t\t\t<li>Press the \"Join Game\" button.</li>\n\t\t\t\t<li>You are now a part of the game and can navigate to the Waiting Room to see who else is in the game.</li>\n\t\t\t\t<li>Remember, you can only be part of one game at a time.</li>\n\t\t\t</ol>\n\t\t\t<div [hidden]=\"!this.authService.user || this.authService.user.currentGame\">\n\t\t\t\t<p class=\"about\">You can press the button below to navigate to the Join/Create Game page.</p>\n\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<p class=\"inside-button\" (click)=\"toJoin()\">Join a Game</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayCreate = !displayCreate\">Creating a Game</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayCreate\">\n\t\t\t<h3 class=\"about\">Creating a Game</h3>\n\t\t\t<ol>\n\t\t\t\t<li>Navigate to the Join/Create Game page.</li>\n\t\t\t\t<li>Press the \"Create Game\" button.</li>\n\t\t\t\t<li>You have now created a game.</li>\n\t\t\t\t<li>Invite your friends to join your game, all they need is a profile and your username.</li>\n\t\t\t\t<li>Now you can navigate to the Waiting Room where you can see who else has joined, and launch the game when ready.</li>\n\t\t\t\t<li>Remember, you can only be part of one game at a time.</li>\n\t\t\t</ol>\n\t\t\t<div [hidden]=\"!this.authService.user || this.authService.user.currentGame\">\n\t\t\t\t<p class=\"about\">You can press the button below to navigate to the Join/Create Game page.</p>\n\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<p class=\"inside-button\" (click)=\"toJoin()\">Create a Game</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayWaiting = !displayWaiting\">The Waiting Room</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayWaiting\">\n\t\t\t<h3 class=\"about\">Inside the Waiting Room</h3>\n\t\t\t<ul>\n\t\t\t\t<li>This is where you can see who else is in the game you have joined or created.</li>\n\t\t\t\t<li>If you are the game admin, this is the screen you will launch the game from.</li>\n\t\t\t\t<li>It is recommended that you visit the Waiting Room after joining a game.</li>\n\t\t\t\t<li>You do NOT need to be in the waiting room when the game is launched in order to play.</li>\n\t\t\t\t<li>When the game admin launches the game you will automatically be redirected to the active gameplay screen.</li>\n\t\t\t\t<li>We are working on a waiting room chat feature which will be included in future updates.</li>\n\t\t\t</ul>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayPlaying = !displayPlaying\">Playing The Game</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayPlaying\">\n\t\t\t<h3 class=\"about\">Inside the Game</h3>\n\t\t\t<ul>\n\t\t\t\t<li>The name of your target is displayed in the upper left corner below your current score.</li>\n\t\t\t\t<li>If your target is currently online, below their name it will display \"Target Aquired\" and their distance from you.</li>\n\t\t\t\t<li>If they are not online it will indicate how far from your location they were last seen.</li>\n\t\t\t\t<li>You are visible to whoever is tracking you whenever you are tracking your target.</li>\n\t\t\t\t<li>Use the compass and distance provided to find your target in the real world.</li>\n\t\t\t\t<li>Pressing the \"Take Aim\" button will trigger 15 seconds of increased accuracy.</li>\n\t\t\t\t<li>Once within 100 meters of your target you can attempt an attack.</li>\n\t\t\t\t<li>The closer you are to your target the better the chance of success.</li>\n\t\t\t\t<li>Indoors your GPS signal may be inadequate to verify a kill shot, it is recommended that you attack your target while outside.</li>\n\t\t\t\t<li>Current GPS accuracy is displayed below the compass display.</li>\n\t\t\t</ul>\n\t\t\t<div [hidden]=\"!this.authService.user || !this.authService.user.inGame\">\n\t\t\t\t<p class=\"about\">You can press the button below to enter your current game.</p>\n\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<p class=\"inside-button\" (click)=\"toGame()\">Enter Game</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayEnd = !displayEnd\">The End Game</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayEnd\">\n\t\t\t<h3 class=\"about\">Ending a Game</h3>\n\t\t\t<ul>\n\t\t\t\t<li>Upon a successful kill, you will be assigned a new target.</li>\n\t\t\t\t<li>Once there is only one player left alive the game ends.</li>\n\t\t\t\t<li>Check the Game History from your Profile Page to see the game results.</li>\n\t\t\t</ul>\n\t\t\t<div [hidden]=\"!this.authService.user\">\n\t\t\t\t<p class=\"about\">You can press the button below see your game history.</p>\n\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<p class=\"inside-button\" (click)=\"toHistory()\">Game History</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"button\">\n\t\t\t<p class=\"inside-button\" (click)=\"displayFeedback = !displayFeedback\">Feedback</p>\n\t\t</div>\n\t\t<div [hidden]=\"displayFeedback\">\n\t\t\t<h3 class=\"about\">Send some Feedback</h3>\n\t\t\t<p class=\"about\">We are always working to improve \"The Most Dangerous Game\"</p>\n\t\t\t<p class=\"about\">This is currenlty an alpha-test version.\n\t\t\tIf you have a suggestion on how we can make the game better, please press the button below to contact us by email.</p>\n\t\t\t<div class=\"button\">\n\t\t\t\t<a href=\"mailto:foxinatardis@gmail.com?Subject=TheMDG%20Feedback\">\n\t\t\t\t\t<p class=\"inside-button\">Send Feedback</p>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t</div>\n\t",
            styles: ["\n\t\t#aboutButton {\n\t\t\theight: 30px;\n\t\t}\n\t\tp.about-button {\n\t\t\tcolor: black;\n\t\t\ttext-align: center;\n\t\t\tvertical-align: middle;\n\t\t\tline-height: 30px;\n\t\t\tfont-size: 20px;\n\t\t\tfont-family: sans-serif;\n\t\t}\n\t\tli {\n\t\t\tmargin-top: 10px;\n\t\t\tmargin-right: 25px;\n\t\t\ttext-align: justify;\n\t\t}\n\t\th2.about {\n\t\t\ttext-align: center;\n\t\t}\n\t\th3.about {\n\t\t\tmargin-left: 20px;\n\t\t}\n\t\tp.about {\n\t\t\tmargin-right: 25px;\n\t\t\tmargin-left: 25px;\n\t\t\ttext-align: justify;\n\t\t}\n\t\ta {\n\t\t\tcolor: #111;\n\t\t\ttext-decoration: none;\n\t\t}\n\t"]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, router_1.Router])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map