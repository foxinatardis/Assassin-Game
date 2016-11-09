import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { GeoService } from "./geo.service";
import * as io from "socket.io-client";

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<div *ngIf="!error">
			<h2 [style.color]="online()">Target: {{targetName}}{{dataTest}}</h2>
			<p *ngIf="targetOnline">Target Aquired</p>
			<p *ngIf="!targetOnline">Target Offline</p>
		</div>
		<div *ngIf="!error && !attacking">
			<h3>Distance to Target: {{distanceToTarget}} meters</h3>
			<h3>Direction to Target: {{bearing}} degrees</h3>
			<h3 [style.color]="resolution()">Accuracy: {{accuracy}} meters</h3>
		</div>
		<div *ngIf="error">
			<h2 class="error">{{errorMessage}}</h2>
		</div>
		<button *ngIf="!takingAim && !attacking && !error" class="button bottom" (click)="takeAim()">Take Aim</button>
		<button *ngIf="takingAim && !attacking && !error" class="button bottom" (click)="attack()">Attack</button>
		<div *ngIf="attacking">
			<h2>{{attackMessage}}</h2>
		</div>
	`,
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private geoService: GeoService
	) {	}

	takingAim: boolean;
	attacking: boolean = false;
	attackMessage: string;
	error: boolean = false;
	errorMessage: string;

	myLong: number;
	myLat: number;
	myTime: number;
	myAcc: number;

	targetName: string;
	targetLong: number;
	targetLat: number;
	targetTime: number;
	targetAcc: number;
	targetLocation: any;
	targetOnline: boolean = false;

	distanceToTarget: number;
	directionToTarget: number;
	accuracy: number;
	bearing: number;

	locationWatch: any;
	locationInterval: any;
	rapid: any;
	gameId: string = this.authService.user.currentGame;
	socket: any;

	dataTest: any;


	ngOnInit() {
		this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
		this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
		this.locationInterval = setInterval(this.sendLocation.bind(this), 15000);
		this.socket = io();
		this.socket.on("target online", (data) => {
			console.log("target online: ", data);
			if (data) {
				this.targetOnline = true;
				if (data.targetLat) {
					this.targetLat = data.targetLat;
					this.targetLong = data.targetLong;
					this.targetAcc = data.targetAcc;
					this.targetTime = data.targetTime;
					this.update();
				}
			} else {
				this.targetOnline = false;
			}
		});

		this.socket.on("score", (data) => {
			this.dataTest = data;
		});

		this.socket.on("being watched", (data) => {
			this.rapidEmit(data);
			console.log("you are being watched: ", data);
		});

		this.socket.on("attack result", (data) => {
			if (data) {
				this.attackMessage = "Target taken out. Awaiting info on next target...";
				this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
			} else {
				this.attackMessage = "Target missed... ";
				setTimeout(function() {
					this.attacking = false;
					this.attackMessage = "";
				}.bind(this), 15000);
			}
		});

		this.socket.on("killed", (data) => {
			clearInterval(this.locationInterval);
			this.error = true;
			this.errorMessage = "You were killed by: " + data;
		});

		this.socket.on("end game", (data) => {
			this.attackMessage = "";
			this.error = true;
			this.errorMessage = "Game Over. You were the last man standing!!!";
		});

	};



// functions for styling text colors based on variables
	online() {
		if (this.targetOnline) {
			return "green";
		} return "cornflowerblue";
	}
	resolution() {
		if (this.accuracy > 100) {
			return "red";
		} else if (this.accuracy > 50) {
			return "yellow";
		} else {
			return "green";
		}
	}

// functions for practical uses

	takeAim() {
		let data = {
			targetName: this.targetName,
			trackerName: this.authService.user.name
		};
		this.takingAim = true;
		this.socket.emit("take aim", data);
		console.log("take aim data: ", data);
		setInterval(function() {
			if (this.takingAim) {
				this.takingAim = false;
				this.attacking = false;
				this.attackMessage = "";
			}
		}.bind(this), 20000);
	}

	attack() {
		this.attacking = true;
		this.takingAim = false;
		this.attackMessage = "Confirming kill...";
		let data = {
			distance: this.distanceToTarget,
			accuracy: this.accuracy,
			targetName: this.targetName,
			gameId: this.authService.user.currentGame
		};
		this.socket.emit("attack", data);
	}

	rapidEmit(hunterName: string) {
		console.log("rapidEmit()");
		this.rapid = setInterval(function() {
			console.log("inside rapidEmit interval function");
			let data = {
				trackerName: hunterName,
				latitude: this.myLat,
				longitude: this.myLong,
				accuracy: this.myAcc,
				time: this.myTime
			};
			console.log("data inside rapidEmit interval funciton: ", data);
			this.socket.emit("give aim", data); // todo finish function for handling someone taking aim at you
		}.bind(this), 1000);
		setTimeout(function() {
			clearInterval(this.rapid);
			this.takingAim = false;
			console.log("inside setTimeout function.");
		}.bind(this), 15000);
	}

	sendLocation() {
		console.log("sendLocation()");
		let toSend = {
			gameId: this.gameId,
			latitude: this.myLat,
			longitude: this.myLong,
			accuracy: this.myAcc,
			time: this.myTime,
			currentTarget: this.targetName
		};
		this.socket.emit("update-location", toSend);
	}

	positionSuccess(pos) {
		let coor = pos.coords;
		this.myLong = coor.longitude;
		this.myLat = coor.latitude;
		this.myTime = pos.timestamp;
		this.myAcc = coor.accuracy;

		this.apiService.getObs("/api/target").subscribe((res) => {
			if (res.error) {
				this.error = true;
				this.errorMessage = res.message;
				if (res.targetName) {
					this.targetName = res.targetName;
				}
			} else {
				this.attacking = false;
				this.attackMessage = "";
				this.targetName = res.targetName;
				this.targetLat = res.latitude;
				this.targetLong = res.longitude;
				this.targetAcc = res.accuracy;
				this.targetTime = res.timestamp;
				this.update();
				let joinData: any = {
					name: this.authService.user.name,
					targetName: res.targetName,
					lat: coor.latitude,
					long: coor.longitude,
					time: pos.timestamp,
					acc: coor.accuracy,
					score: this.authService.user.score
				};
				this.socket.emit("join", joinData);
			}
		});

	}

	positionErr(err) {
		console.log(err);
		this.error = true;
		this.errorMessage = "Sorry, something went wrong. Please reload and try again.";
	}

	iMovedSuccess(pos) {
		let coor = pos.coords;
		this.myLong = coor.longitude;
		this.myLat = coor.latitude;
		this.myTime = pos.timestamp;
		this.myAcc = coor.accuracy;
		this.update();
	}

	update() {
		if (this.myLat && this.targetLat) {
			this.distanceToTarget = this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat);
			this.accuracy = this.myAcc + this.targetAcc;
			this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
			// console.log("requirements met");
		}
		// console.log("update() invoked");
		// console.log("target lat, long, acc", this.targetLat, this.targetLong, this.targetAcc);
		// console.log("my lat, long, acc", this.myLat, this.myLong, this.myAcc);
	}

	rad(x) {
		return x * Math.PI / 180;
	};
	deg(x) {
		return x * (180 / Math.PI);
	};

	getDistance(mLong, mLat, tLong, tLat) {
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

	getBearing(startLong, startLat, endLong, endLat) {
		startLat = this.rad(startLat);
		startLong = this.rad(startLong);
		endLat = this.rad(endLat);
		endLong = this.rad(endLong);

		var dLong = endLong - startLong;

		var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
		if (Math.abs(dLong) > Math.PI) {
			if (dLong > 0.0) {
				dLong = -(2.0 * Math.PI - dLong);
			} else {
				dLong = (2.0 * Math.PI + dLong);
			}
		}

		return (this.deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
	}

}
