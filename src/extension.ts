import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "qrun" is now active!');

const disposable = vscode.commands.registerCommand('qrun.run', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('ошибка открытия файла');
            return;
        }

        const document = editor.document;

        if (document.languageId !== 'cpp') {
            vscode.window.showWarningMessage('ошибка типа файла');
            return;
        }

        await document.save();

        const cppPath = document.fileName;
        const parsed = path.parse(cppPath);
        const exePath = path.join(parsed.dir, parsed.name + '.exe');

        let terminal = vscode.window.terminals.find(t => t.name === 'QRun');
        if (!terminal) {
            terminal = vscode.window.createTerminal({ name: 'QRun', shellPath: 'cmd.exe' });
            terminal.sendText('chcp 65001 > nul');
        }

        terminal.show();
        terminal.sendText(`g++ "${cppPath}" -o "${exePath}" && "${exePath}"`);
    });
	

	context.subscriptions.push(disposable);
}
export function deactivate() {}
