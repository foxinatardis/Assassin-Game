import { Component } from "@angular/core";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<h2>Welcome: {{this.authService.user.name}}</h2>
		<div *ngIf="!selectionMade && !result">
			<div class="button" (click)="changePassword()" *ngIf="!selectionMade">
				<p class="inside-button">Change Password</p>
			</div>
			<div class="button" *ngIf="this.authService.user.currentGame" (click)="leaveGame()">
				<p class="inside-button">Leave Current Game</p>
			</div>
			<div class="button" *ngIf="this.authService.user.gameAdmin" (click)="admin()">
				<p class="inside-button">Admin Options</p>
			</div>
			<div class="button" (click)="about()" *ngIf="!selectionMade">
				<p class="inside-button">About</p>
			</div>
		</div>

		<div *ngIf="selectionMade && !result">
			<div *ngIf="displayChangePassword">
				<input type="password" [(ngModel)]="oldPassword" placeholder="Old Password">
				<input type="password" [(ngModel)]="newPassword" placeholder="New Password">
				<input type="password" [(ngModel)]="confirmPassword" placeholder="Confirm New Password">
				<h3 class="error" *ngIf="!passwordVerify()">Passwords must match and contain at least 8 characters</h3>
				<div class="button" (click)="sendPassword()">
					<p class="inside-button">Change Password</p>
				</div>
			</div>

			<div *ngIf="displayLeaveGame">
				<h3>Are you sure you want to leave your current game?</h3>
				<div class="button" (click)="confirmLeaveGame()">
					<p class="inside-button">Yes</p>
				</div>
				<div class="button" (click)="displayOptions()">
					<p class="inside-button">No</p>
				</div>
			</div>

		</div>

		<div *ngIf="result">
			<h3>{{resultMessage}}</h3>
			<div class="button" (click)="displayOptions()">
				<p class="inside-button">Back to Options</p>
			</div>
		</div>
	`,
})
export class OptionsComponent {
	constructor(
		private apiService: ApiService,
		private authService: AuthService,
		private router: Router
	) { }
	// display variables and functions
	private selectionMade: boolean = false;
	private result: boolean = false;
	private resultMessage: string = "";
	private displayChangePassword: boolean = false;
	private displayLeaveGame: boolean = false;
	private displayOptions() {
		this.selectionMade = false;
		this.result = false;
		this.resultMessage = "";
		this.displayChangePassword = false;
		this.displayLeaveGame = false;
	}
	private changePassword() {
		this.selectionMade = true;
		this.displayChangePassword = true;
	}
	private leaveGame() {
		this.selectionMade = true;
		this.displayLeaveGame = true;
	}


	// change password variables and functions
	private oldPassword: string = "";
	private newPassword: string = "";
	private confirmPassword: string = "";
	private passwordVerify() {
		if (this.newPassword === this.confirmPassword && this.newPassword.length >= 8) {
			return true;
		} return false;
	}
	private sendPassword() {
		if (this.passwordVerify()) {
			let toSend = {
				oldPassword: this.oldPassword,
				newPassword: this.newPassword
			};
			this.apiService.postObs("/api/change-password", toSend).subscribe((res) => {
				this.result = true;
				this.resultMessage = res.message;
			});
		}
	};

	// leave game variables and functions
	confirmLeaveGame() {
		this.apiService.postObs("/api/leave-game", this.authService.user.currentGame).subscribe((res) => {
			this.result = true;
			this.resultMessage = res.message;
			if (res.message === "Game Abandoned") {
				this.authService.user.currentGame = "";
				this.authService.user.inGame = false;
				this.authService.user.gameAdmin = false;
				this.authService.user.currentTarget = "";
			}
		});
	}

	about() {
		this.router.navigate(["/about"]);
	}

	admin() {
		// stub
		this.router.navigate(["/admin"]);
	}

}
