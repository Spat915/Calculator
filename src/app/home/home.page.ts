import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
	lastOperation: string;
	currentOperation: string;
	operations: Array<string>;
	lastOperations: Array<string>;
	operandi: Array<number>;
	lastOperandi: Array<number>;
	currentNum: string;
	currentDec: boolean;
	negative: boolean;

	constructor() {
		this.lastOperation = '';
		this.currentOperation = '';
		this.operations = [];
		this.lastOperations = [];
		this.operandi = [];
		this.lastOperandi = [];
		this.currentNum = '';
		this.currentDec = false;
		this.negative = false;
	}
	buttonPush(event: any) {
		const buttonVal = event.target.innerHTML;
		if (isNaN(parseInt(buttonVal))) {
			switch (buttonVal) {
				case 'X':
				this.operations.push('multiply');
				this.operandi.push(parseFloat(this.currentNum));
				break;
				
				case '/':
				this.operations.push('divide');
				this.operandi.push(parseFloat(this.currentNum));
				break;
				
				case '+':
				this.operations.push('add');
				this.operandi.push(parseFloat(this.currentNum));
				break;
				
				case '-':
				if (this.currentNum === '-') {
					break;
				} else if (this.currentNum !== '') {
					this.operations.push('subtract');
					this.operandi.push(parseFloat(this.currentNum));
					this.negative = false;
				} else {
					this.currentNum += '-';
					this.negative = true;
				}
				break;
				
				case '.':
				if (! this.currentDec) {
					this.currentNum += '.';
					this.currentDec = true;
				}
				break;
				
				case 'C':
				this.operations = [];
				this.operandi = [];
				break;
				
				case '=':
				this.operandi.push(parseFloat(this.currentNum));
				this.lastOperations = [...this.operations];
				this.lastOperandi = [...this.operandi];
				this.operations = [];
				this.operandi = [];
				console.log(this.lastOperations);
				console.log(this.lastOperandi);
				this.printLast();
				break;
				
				default:
				console.error('Invalid operation');
				return;
			}
			if (buttonVal !== '.') {
				if (buttonVal !== '-' || !this.negative) {
					this.currentNum = '';
					this.currentDec = false;
					this.negative = false;
				}
			}
		} else {
			this.currentNum += buttonVal;
		}
		this.updateCalculation();
	}
	convertOperation(op: string) {
		switch (op) {
			case 'divide':
			return ' / ';
			case 'multiply':
			return ' X ';
			case 'add':
			return ' + ';
			case 'subtract':
			return ' - ';
			default:
			console.error('Calculation Update Error');
		}
	}
	updateCalculation() {
		let calc = '';
		for (let i = 0; i < this.operandi.length; i++) {
			calc += this.operandi[i].toString();
			if (this.operations[i]) {
				calc += this.convertOperation(this.operations[i]);
			}
		}
		calc += this.currentNum;
		this.currentOperation = calc;
		// let elem = document.getElementById('currentOp');
		// elem.setAttribute('value', calc);
		// elem.dispatchEvent(new Event('input'));
	}
	printLast() {
		let result = this.equals((err, result) => {
			if (err) {
				let elem = document.getElementById('lastOp');
				elem.setAttribute('value', err.message);
				elem.dispatchEvent(new Event('input'));
			} else {
				let lastCalc = '';
				for (let i = 0; i < this.lastOperandi.length; i++) {
					lastCalc += this.lastOperandi[i].toString();
					if (i !== this.lastOperandi.length - 1) {
						lastCalc += this.convertOperation(this.lastOperations[i]);
					}
				}
				lastCalc += ' = ' + result.result;
				this.lastOperation = lastCalc;
				// let elem = document.getElementById('lastOp');
				// elem.setAttribute('value', lastCalc);
				// elem.dispatchEvent(new Event('input'));
			}
		});
	}
	parseJSONResponse(request: XMLHttpRequest, callback: any) {
		if (request.readyState === 4 && request.status === 200) {
			let result;
			try {
				result = JSON.parse(request.responseText);
			} catch (e) {
				if (callback) {
					callback(e, null);
				} else {
					console.error(e.message);
				}
			} finally {
				if (callback) {
					callback(null, result);
				} else {
					console.log(result);
				}
			}
		}
	}
	async equals(callback: any) {
		let request = new XMLHttpRequest();
		const url = 'http://localhost:8080/';
		request.open('POST', url, true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onreadystatechange = () => {
			this.parseJSONResponse(request, callback);
		};
		let data = JSON.stringify({"operations": this.lastOperations, "operandi": this.lastOperandi});
		request.send(data);
	}
	async getSupported(callback: any) {
		let request = new XMLHttpRequest();
		const url = 'http://localhost:8080/';
		request.open('GET', url, true);
		request.onreadystatechange = () => {
			this.parseJSONResponse(request, callback);
		};
		request.send();
	}
	ngOnInit() {
		this.getSupported((err: SyntaxError, result) => {
			if (err) {
				console.log('Error', err.message);
			} else {
				for (let i = 0; i < result.length; i++) {
					let e = <HTMLInputElement> document.getElementById(result[i].operation)
					e.disabled = false;
				}
			}
		});
	}
}
