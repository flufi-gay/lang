import { Generate, StyleLanguages } from "./highlighter";
import { langs } from "./langs";

export type Lang = {
    name: string,
    style?: string,
    scripts: Partial<Record<keyof typeof Examples, string | Array<string>>>
}

enum Examples {
    HelloWorld = "Hello World",
    GreaterThan = "X is greater than 2",
    Fibonacci = "Fibonacci Sequence"
}

function GenerateOption(example: Examples) {
    const elem: HTMLElement | null = document.getElementById("lang-select");
    if (!elem) throw "no lang select";
    const option: HTMLOptionElement = document.createElement("option");
    option.textContent = example;
    option.value = Object.keys(Examples)[Object.values(Examples).findIndex(v => v === example)];
    elem.appendChild(option);
}

function Fix(code: string) {
    code = code.split("\n").filter(l => !!l.trim()).join("\n");
    const indent = code.split("\n").reduce((acc, line) => Math.min(acc, (/^\s+/.exec(line) ?? [""])[0].length), 999);
    code = code.split("\n").map(l => l.slice(indent)).join("\n");
    return code;
}

function GenerateLang(lang: Lang, example: keyof typeof Examples) {
    const elem: HTMLElement | null = document.getElementById("langs");
    if (!elem) throw "no lang parent";

    const langDiv: HTMLDivElement = document.createElement("div");
    langDiv.className = "uiblock";
    elem.appendChild(langDiv);

    const titleDiv: HTMLHeadingElement = document.createElement("h2");
    titleDiv.textContent = lang.name;
    titleDiv.className = "lang-header";
    langDiv.appendChild(titleDiv);

    let scripts = lang.scripts[example];
    if (!scripts) {
        const elem2 = document.createElement("p");
        elem2.className = "lang-noExamples";
        elem2.textContent = "no examples for this lang :(";
        langDiv.appendChild(elem2);
        return
    }
    if (!Array.isArray(scripts))
        scripts = [scripts];
    
    for (let i = 0; i < scripts.length; i++) {
        const scriptElem = document.createElement("div");
        scriptElem.className = "uiblock code";
        let style = "white-space: pre; padding: 10px; margin: 10px;";
        if (lang.style) {
            Generate(scriptElem, Fix(scripts[i]), StyleLanguages[lang.style]);
            style += "padding-bottom: 14px";
        } else {
            scriptElem.textContent = Fix(scripts[i]);
        }
        scriptElem.style = style;
        langDiv.appendChild(scriptElem);
    }
}

function GenerateLangs() {
    const langSelect = document.getElementById("lang-select");
    if (!langSelect) throw "no lang select";

    const example = (langSelect as HTMLSelectElement).value as keyof typeof Examples;

    const elem: HTMLElement | null = document.getElementById("langs");
    if (!elem) throw "no lang parent";
    elem.innerHTML = "";

    const entries = Object.values(langs);
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        GenerateLang(entry, example);
    }
}

const select: HTMLElement | null = document.getElementById("lang-select");
if (!select) throw "no lang select";
select.addEventListener("change", function() {
    GenerateLangs();
});

const examples = Object.values(Examples);
for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    GenerateOption(example);
}

GenerateLangs();
