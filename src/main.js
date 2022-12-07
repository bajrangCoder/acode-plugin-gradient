import plugin from '../plugin.json';

const multiPrompt = acode.require('multiPrompt');
const select = acode.require('select');

class GradientGenerator {

    async init() {
        let command = {
            name: "Gradient Generator",
            description: "Gradient Color Generator",
            exec: this.run.bind(this),
        }
        editorManager.editor.commands.addCommand(command);
    }
    
    async run() {
        const colorPrompt = await multiPrompt('Gradient Generator',[
            {
                id: "color1",
                type: "color",
                required: true
            },
            {
                id: "color2",
                type: "color",
                required: true
            },
            ]);
        const toDirection = await select('Linear Direction', [
            'to right',
            'to right bottom',
            'to right top',
            'to left',
            'to left bottom',
            'to left top',
            'to bottom',
            'to top',
        ], {
            default: 'to right',
        });
        editorManager.editor.insert(`linear-gradient(${toDirection}, ${colorPrompt["color1"]}, ${colorPrompt["color2"]})`);
    }
    
    async destroy() {
        let command = {
            name: "Gradient Generator",
            description: "Gradient Color Generator",
            exec: this.run.bind(this),
        }
        editorManager.editor.commands.removeCommand(command)
    }
}

if (window.acode) {
    const acodePlugin = new GradientGenerator();
    acode.setPluginInit(plugin.id, (baseUrl, $page, {
        cacheFileUrl, cacheFile
    }) => {
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        acodePlugin.baseUrl = baseUrl;
        acodePlugin.init($page, cacheFile, cacheFileUrl);
    });
    acode.setPluginUnmount(plugin.id, () => {
        acodePlugin.destroy();
    });
}