// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Initialize the mode variable to 'normal' by default
let currentMode: 'normal' | 'insert' | 'visual' = 'normal';

// Create a status bar item to display the mode
let modeStatusBarItem: vscode.StatusBarItem;

// Function to map current mode to short form
function mapModeToShortForm(mode: 'normal' | 'insert' | 'visual') {
	const modeMap: { [key: string]: string } = {
		'normal': '--NOR--',
		'insert': '--INS--',
		'visual': '--VIS--',
	};

	// Return the corresponding short form for current mode
	return modeMap[mode];
}

// Function to set the mode and notify the user
function setMode(mode: 'normal' | 'insert' | 'visual') {
	currentMode = mode;

	const modeText = mapModeToShortForm(mode);

	if (modeStatusBarItem){
		// Update the status bar item with the current mode
		modeStatusBarItem.text = modeText;

		// Show the mode in the status bar
		modeStatusBarItem.show();
	}

	vscode.window.showInformationMessage(`Switched to ${mode} mode`);

	// Update the context key for the current mode
	vscode.commands.executeCommand('setContext', 'helixMode', currentMode);
}

// Block input unless we're in Insert mode
function preventTyping() {
	if (currentMode !== 'insert' && vscode.window.activeTextEditor) {
		// vscode.commands.executeCommand('type', {text: ''});
		vscode.window.activeTextEditor.selection = new vscode.Selection(0, 0, 0, 0);
		// vscode.window.activeTextEditor?.edit((editBuilder) => {
			// Clear the content that was typed if we're not in insert mode
			// editBuilder.delete(new vscode.Range(0, 0, 0, 0));
		// });
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Helix extension activated!');

	// Set initial mode to normal
	setMode('normal');

	// Create the status bar item (this will display the mode)
	modeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	modeStatusBarItem.text = mapModeToShortForm(currentMode);
	modeStatusBarItem.show();

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

	// Listen to text document changes and block typing when not in insert mode
	vscode.workspace.onDidChangeTextDocument((e) => {
		preventTyping(); // Block typing in normal and visual modes
	});

	// Add commands to context subscriptions
	// Register the commands in the extension context
	// context.subscriptions.push(switchToNormalMode);
	// context.subscriptions.push(switchToInsertMode);
	context.subscriptions.push(switchToNormalMode, switchToInsertMode, switchToVisualMode);

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

	// Move to next word (w)
	vscode.commands.registerCommand('helixMode.moveToNextWord', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'nextWord', by: 'character', value: 1});
		}
	});

	// Move forward by two word (2w)
	vscode.commands.registerCommand('helixMode.moveForwardTwoWords', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'nextWord', by: 'character', value: 2});
		}
	});

	// Move to previous word (b)
	vscode.commands.registerCommand('helixMode.moveToPreviousWord', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'previousWord', by: 'character', value: 1});
		}
	});

	// Move to the en of the current word (e)
	vscode.commands.registerCommand('helixMode.moveToEndOfWord', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'endOfWord', by: 'character', value: 1});
		}
	});

	// Move to the end of the current sentence ()
	// Move to the next sentence (')')
	vscode.commands.registerCommand('helixMode.moveToNextSentence', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'nextSentence', by: 'sentence', value: 1});
		}
	});

	// Move to the next paragraph (})
	vscode.commands.registerCommand('helixMode.moveToNextParagraph', () => {
		if (currentMode === 'normal') {
			vscode.commands.executeCommand('cursorMove', { to: 'nextParagraph', by: 'line', value: 1});
		}
	});

	// Forward search (/)
	vscode.commands.registerCommand('helixMode.searchForward', () => {
		if (currentMode === 'normal') {
			// vscode.commands.executeCommand('action.find');
			// vscode.window.showInputBox({ prompt: 'Search Forward' }).then(query => {
			// 	if (query) {
			// 		vscode.commands.executeCommand('editor.action.startFindInFiles', { query });
			// 	}
			// });
		}
	});

	// workbench.action.findInFiles - Open a workspace search
	// 	* A set of options for the search -

	// Backward search (?)
	vscode.commands.registerCommand('helixMode.searchBackward', () => {
		if (currentMode === 'normal') {
			// vscode.commands.executeCommand('action.findInFiles');
			// vscode.window.showInputBox({ prompt: 'Search Backward' }).then(query => {
			// 	if (query) {
			// 		vscode.commands.executeCommand('editor.action.startFindInFiles', { query, reverse: true });
			// 	}
			// });
		}
	});

	// Enter visual mode(v in normal mode)
	vscode.commands.registerCommand('helixMode.enterVisualMode', () => {
		if (currentMode === 'normal') {
			setMode('visual');
			// vscode.commands.executeCommand('cursorSelect');
			// vscode.commands.executeCommand('editor.action.selectAll'); //select all text to start visual mode (optional).
		}
	});

	// Exit visual mode(esc to normal mode)
	vscode.commands.registerCommand('helixMode.exitVisualMode', () => {
		if (currentMode === 'visual') {
			setMode('normal');
			// vscode.commands.executeCommand('editor.action.selectNone'); // Deselect any selection
		}
	});

	// Cut (delete) selected text
	vscode.commands.registerCommand('helixMode.cut', () => {
		if (currentMode === 'visual' || currentMode === 'normal') {
			vscode.commands.executeCommand('editor.action.clipboardCutAction');
			setMode('normal');
		}
	});

	// Copy selected text
	vscode.commands.registerCommand('helixMode.copy', () => {
		if (currentMode === 'visual' || currentMode === 'normal') {
			vscode.commands.executeCommand('editor.action.clipboardCopyAction');
			setMode('normal');
		}
	});

	// Paste text
	vscode.commands.registerCommand('helixMode.paste', () => {
		if (currentMode === 'visual' || currentMode === 'normal') {
			vscode.commands.executeCommand('editor.action.clipboardPasteAction');
			setMode('insert');
		}
	});

	// Display current mode in the status bar
	// const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	// statusBar.text = `Mode: ${currentMode}`;
	// statusBar.show();
	// context.subscriptions.push(statusBar);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helix-mode-vscode" is now active!');

}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Helix extension deactivated!');
}
