// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let currentMode: 'normal' | 'insert' | 'visual' = 'normal';

function setMode(mode: 'normal' | 'insert' | 'visual') {
	currentMode = mode;
	vscode.window.showInformationMessage('Switched to ${mode} mode');
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Set initial mode to normal
	setMode('normal');

	// Register commands for mode switching
	let switchToNormalMode = vscode.commands.registerCommand('helixMode.switchToNormal', () => {
		setMode('normal');
	});

	let switchToInsertMode = vscode.commands.registerCommand('helixMode.switchToInsert', () => {
		setMode('insert');
	});

	let switchToVisualMode = vscode.commands.registerCommand('helixMode.switchToVisual', () => {
		setMode('visual');
	});

	// Add commands to context subscriptions
	context.subscriptions.push(switchToNormalMode);
	context.subscriptions.push(switchToInsertMode);
	context.subscriptions.push(switchToVisualMode);

	// Add keybindings and logic for modes
	vscode.commands.registerCommand('helixMode.moveLeft', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'left', by: 'character', value: 1});
		}
	});

	vscode.commands.registerCommand('helixMode.moveRight', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'right', by: 'character', value: 1});
		}
	});

	vscode.commands.registerCommand('helixMode.moveUp', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'up', by: 'line', value: 1});
		}
	});

	vscode.commands.registerCommand('helixMode.moveDown', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'down', by: 'line', value: 1});
		}
	});

	// Display current mode in the status bar
	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBar.text = `Mode: ${currentMode}`;
	statusBar.show();
	context.subscriptions.push(statusBar);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helix-mode-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('helix-mode-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from Helix Mode for VS Code!');
	// });

	// context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
