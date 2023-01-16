import plugin from '../plugin.json';
import style from './style.scss';

const multiPrompt = acode.require('multiPrompt');
const select = acode.require('select');
const colorPicker = acode.require('colorPicker');

class GradientGenerator {
    $defaultGradient = "to top,hsl(198, 93.2%, 59.6%),hsl(217, 91.2%, 59.8%),hsl(224, 76.3%, 48%)";
    $cssGradientCode = "linear-gradient(to top, hsl(199, 88.7%, 48.4%), hsl(217, 91.2%, 59.8%), hsl(224, 76.3%, 48%))";
    $tailwindGradientCode = "bg-gradient-to-t from-sky-500 via-blue-500 to-blue-700";
    
    async init($page) {
        $page.id = "tailwind-gradient-generator";
        $page.settitle("Tailwind Gradient Generator");
        this.$page = $page;
        let command = {
            name: "Gradient Generator",
            description: "Gradient Color Generator",
            exec: this.run.bind(this),
        }
        editorManager.editor.commands.addCommand(command);
        this.$style = tag('style',{
            textContent: style,
        });
        document.head.append(this.$style);
        this.selectMenuDiv = tag('div',{
            className: "selectMenuDiv"
        });
        this.gradientDirecSel = tag('select',{
            className: "gradientDirecSel",
        });
        this.fromColorSel = tag('select',{
            className: "fromColorSel",
        });
        this.viaColorSel = tag('select',{
            className: "viaColorSel",
        });
        this.toColorSel = tag('select',{
            className: "toColorSel",
        });
        
        this.selectMenuDiv.append(...[this.gradientDirecSel,this.fromColorSel,this.viaColorSel,this.toColorSel]);
        this.previewDiv = tag('div',{
            className: "previewDiv",
        });
        this.footerDiv = tag('div',{
            className: "footerDiv",
        });
        this.$insertCssCode = tag("button",{
            textContent: "Insert Css Code",
            className: "insertCssCode"
        });
        this.$insertTailwindCode = tag("button",{
            textContent: "Insert Tailwind Class",
            className: "insertTailwindCode"
        });
        this.footerDiv.append(...[this.$insertCssCode,this.$insertTailwindCode]);
        this.$page.append(...[this.selectMenuDiv,this.previewDiv,this.footerDiv]);
        this.$insertCssCode.onclick = this.insertCodeInEditor.bind(this,"cssCode");
        this.$insertTailwindCode.onclick = this.insertCodeInEditor.bind(this,"tailwindCode");
        this.previewDiv.style.background = this.$cssGradientCode;
        this.$page.onhide = () => {
            this.previewDiv.style.background = this.$cssGradientCode;
            this.$page.innerHTML = "";
        }
    }
    
    async run() {
        const cssType = await select("Select Type",[
                "Vanilla CSS",
                "Tailwindcss",
            ]);
        if(!cssType) return;
        switch (cssType) {
            case 'Vanilla CSS':
                this.vanillaCssGradient();
                break;
            case 'Tailwindcss':
                this.tailwindcssGradient();
                break;
        }
    }
    
    async vanillaCssGradient(){
        const color1 = await colorPicker("#23b4d9");
        const color2 = await colorPicker("#1666d4");
        if(!color1) return;
        if(!color2) return;
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
        if(!toDirection) return;
        editorManager.editor.insert(`linear-gradient(${toDirection}, ${color1}, ${color2})`);
    }
    
    async tailwindcssGradient(){
        this.loadAllSelectData();
        this.gradientDirecSel.onchange = this.changedDirection.bind(this);
        this.fromColorSel.onchange = this.changedFormColor.bind(this);
        this.viaColorSel.onchange = this.changedViaColor.bind(this);
        this.toColorSel.onchange = this.changedToColor.bind(this);
        this.$page.show();
    }
    
    async loadTailwindColors(){
        try {
            const response = await fetch(this.baseUrl+'tailwindColors.json');
            return await response.json();
        } catch (e) {
            window.toast(e,4000);
        }
    }
    
    async loadAllSelectData(){
        const tailwindColors = await this.loadTailwindColors();
        const colorWithFrom = tailwindColors.map(item => {
            return {
                className: "from-"+item.className,
                colorCode: item.colorCode,
            };
        });
        const colorWithVia = tailwindColors.map(item => {
            return {
                className: "via-"+item.className,
                colorCode: item.colorCode,
            };
        });
        const colorWithTo = tailwindColors.map(item => {
            return {
                className: "to-"+item.className,
                colorCode: item.colorCode,
            };
        });
        const gradientDirection = [
            {
                name: "To Top",
                css: "to top",
                tailwind: "bg-gradient-to-t"
            },
            {
                name: "To Top Right",
                css: "to right top",
                tailwind: "bg-gradient-to-tr"
            },
            {
                name: "To Right",
                css: "to right",
                tailwind: "bg-gradient-to-r"
            },
            {
                name: "To Bottom Top",
                css: "to right bottom",
                tailwind: "bg-gradient-to-bt"
            },
            {
                name: "To Bottom",
                css: "to bottom",
                tailwind: "bg-gradient-to-b"
            },
            {
                name: "To Bottom Left",
                css: "to left bottom",
                tailwind: "bg-gradient-to-bl"
            },
            {
                name: "To Left",
                css: "to left",
                tailwind: "bg-gradient-to-l"
            },
            {
                name: "To Top Left",
                css: "to left top",
                tailwind: "bg-gradient-to-tl"
            },
            {
                name: "Conic Center",
                css: "",
                tailwind: "bg-[conic-gradient(var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Top",
                css: "at center top",
                tailwind: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Top Right",
                css: "at right top",
                tailwind: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Right",
                css: "at right center",
                tailwind: "bg-[conic-gradient(at_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Bottom Right",
                css: "at right bottom",
                tailwind: "bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Bottom",
                css: "at center bottom",
                tailwind: "bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Bottom Left",
                css: "at left bottom",
                tailwind: "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Left",
                css: "at left center",
                tailwind: "bg-[conic-gradient(at_left,_var(--tw-gradient-stops))]"
            },
            {
                name: "Conic Top Left",
                css: "at left top",
                tailwind: "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Center",
                css: "at center center",
                tailwind: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Top",
                css: "at center top",
                tailwind: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Top Right",
                css: "at right top",
                tailwind: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Right",
                css: "at right center",
                tailwind: "bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Bottom Right",
                css: "at right bottom",
                tailwind: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Bottom",
                css: "at center bottom",
                tailwind: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Bottom Left",
                css: "at left bottom",
                tailwind: "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Left",
                css: "at left center",
                tailwind: "bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]"
            },
            {
                name: "Radial Top Left",
                css: "at left top",
                tailwind: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]"
            }
        ];
        const defaultGrad = this.$defaultGradient.split(/,(?![^(]*\))/);
        gradientDirection.forEach(obj => {
            if (obj.css == defaultGrad[0]) {
                const option = tag("option",{
                    value: `${obj.name},${obj.css},${obj.tailwind}`,
                    textContent: obj.name,
                    selected: true
                });
                this.gradientDirecSel.append(option);
            } else {
                const option = tag("option",{
                    value: `${obj.name},${obj.css},${obj.tailwind}`,
                    textContent: obj.name,
                });
                this.gradientDirecSel.append(option);
            }
        });
        colorWithFrom.forEach(item => {
            if (item.colorCode == defaultGrad[1]) {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className,
                    selected: true
                });
                this.fromColorSel.append(option);
            } else {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className
                });
                this.fromColorSel.append(option);
            }
        });
        colorWithVia.forEach(item => {
            if (item.colorCode == defaultGrad[2]) {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className,
                    selected: true
                });
                this.viaColorSel.append(option);
            } else {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className
                });
                this.viaColorSel.append(option);
            }
        });
        colorWithTo.forEach(item => {
            if (item.colorCode == defaultGrad[3]) {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className,
                    selected: true
                });
                this.toColorSel.append(option);
            } else {
                const option = tag("option",{
                    value: `${item.className},${item.colorCode}`,
                    textContent: item.className
                });
                this.toColorSel.append(option);
            }
        });
    }
    
    checkGradientType(gradientDirecVal){
        if (gradientDirecVal.startsWith("Radial")) {
            return "radial"
        } else if(gradientDirecVal.startsWith("Conic")) {
            return "conic"
        } else{
            return "linear"
        }
    }
    
    createGradient(){
        const gradientDirection = this.gradientDirecSel.value.split(",");
        const fromColor = this.fromColorSel.value.split(/(?<=\w+-\d+)\s*,\s*(?=\w+\()/);
        const viaColor = this.viaColorSel.value.split(/(?<=\w+-\d+)\s*,\s*(?=\w+\()/);
        const toColor = this.toColorSel.value.split(/(?<=\w+-\d+)\s*,\s*(?=\w+\()/);
        let cssGradient = '';
        let tailwindGradient = '';
        switch (this.checkGradientType(gradientDirection[0])) {
            case 'radial':
                cssGradient = `radial-gradient(${gradientDirection[1]}, ${fromColor[1]}, ${viaColor[1]}, ${toColor[1]})`;
                tailwindGradient = `${gradientDirection[2]} ${fromColor[0]} ${viaColor[0]} ${toColor[0]}`
                this.$tailwindGradientCode = tailwindGradient;
                this.$cssGradientCode = cssGradient;
                this.previewGradient(cssGradient);
                break;
            case 'conic':
                if (gradientDirection[0] == "Conic Center") {
                    cssGradient = `conic-gradient(${fromColor[1]}, ${viaColor[1]}, ${toColor[1]})`;
                    tailwindGradient = `${gradientDirection[2]} ${fromColor[0]} ${viaColor[0]} ${toColor[0]}`
                    this.$tailwindGradientCode = tailwindGradient;
                    this.$cssGradientCode = cssGradient;
                    this.previewGradient(cssGradient);
                } else {
                    cssGradient = `conic-gradient(${gradientDirection[1]}, ${fromColor[1]}, ${viaColor[1]}, ${toColor[1]})`;
                    tailwindGradient = `${gradientDirection[2]} ${fromColor[0]} ${viaColor[0]} ${toColor[0]}`
                    this.$tailwindGradientCode = tailwindGradient;
                    this.$cssGradientCode = cssGradient;
                    this.previewGradient(cssGradient);
                }
                break;
            case 'linear':
                cssGradient = `linear-gradient(${gradientDirection[1]}, ${fromColor[1]}, ${viaColor[1]}, ${toColor[1]})`;
                tailwindGradient = `${gradientDirection[2]} ${fromColor[0]} ${viaColor[0]} ${toColor[0]}`
                this.$tailwindGradientCode = tailwindGradient;
                this.$cssGradientCode = cssGradient;
                this.previewGradient(cssGradient);
                break;
        }
    }
    
    changedDirection(){
       this.createGradient();
    }
    
    changedFormColor(){
        this.createGradient();
    }
    
    changedViaColor(){
        this.createGradient();
    }
    
    changedToColor(){
        this.createGradient();
    }
    
    previewGradient(cssGradient){
        this.previewDiv.style.background = cssGradient;
    }
    
    insertCodeInEditor(csstype){
        switch (csstype) {
            case 'cssCode':
                editorManager.editor.insert(this.$cssGradientCode);
                this.$page.hide();
                break;
            case 'tailwindCode':
                editorManager.editor.insert(this.$tailwindGradientCode);
                this.$page.hide();
                break;
        }
    }
    
    async destroy() {
        editorManager.editor.commands.removeCommand("Gradient Generator")
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