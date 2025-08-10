(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(l){if(l.ep)return;l.ep=!0;const n=t(l);fetch(l.href,n)}})();var E=(e=>(e[e.Word=0]="Word",e[e.Keyword=1]="Keyword",e[e.Type=2]="Type",e[e.Function=3]="Function",e[e.Constant=4]="Constant",e[e.String=5]="String",e[e.Operator=6]="Operator",e[e.Entity=7]="Entity",e[e.Comment=8]="Comment",e[e.Property=9]="Property",e[e.Variable=10]="Variable",e[e.Debug=11]="Debug",e[e.Bracket1=12]="Bracket1",e[e.Bracket2=13]="Bracket2",e[e.Bracket3=14]="Bracket3",e))(E||{});const s={string:(e,o,t)=>{const r=a=>t.bools[a]=!t.bools[a],l=a=>t.bools[a];let n,i;if(e=="\\n")return 4;if(i="singleQuote",(n=e=="'")&&r(i),l(i)||n||(i="doubleQuote",(n=e=='"')&&r(i),l(i)||n)||(i="backQuote",(n=e=="`")&&r(i),l(i)||n))return 5},number:e=>/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(e)?4:null,brackets:(e,o,t)=>{const r=["(","[","{"],l=[")","]","}"],n=[...r,...l],i=[12,13,14];t.numbers.bracketDepth+=r.includes(e)?1:l.includes(e)?-1:0;const a=t.numbers.bracketDepth+(l.includes(e)?0:-1);if(n.includes(e))return i[a%i.length]},execution:(e,{next:o})=>o=="("?3:null,property:(e,{previous:o})=>{if(/^\w+$/.test(e)&&o==".")return 9},comment:(e,o,t)=>{if(e=="//"&&(t.bools.lineComment=!0),e==`
`&&(t.bools.lineComment=!1),t.bools.lineComment||(e=="/*"&&(t.bools.multiLineComment=!0),e=="*/"&&(t.bools.multiLineComment=!1),t.bools.multiLineComment||e=="*/"))return 8},variable:{func:e=>/^\s*\w+\s*$/.test(e)?10:null,behaviour:1}},c=(e,o,t)=>Object.fromEntries(e.map(r=>["t-"+r,t!=null?{type:o,behaviour:t}:o])),B={FCL:{context:{bools:{singleQuote:!1,doubleQuote:!1,backQuote:!1,lineComment:!1,multiLineComment:!1},numbers:{bracketDepth:0}},match:/((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,tokens:{...c(["str","num","bool","Obj","Arr","void","any","Type"],2),...c(["return"],1),...c(["struct","import","if","else","while","until","for"],1),...c(["true","false","null"],4),...c(["self"],7),...c(["=","+","++","-","*","/","^","%","~+","~++","?","||","|||","&&","&&&",":","new"],6),...c(["print"],11,1)},matchers:[s.comment,s.string,s.number,s.brackets,s.execution,s.property,(e,{next:o,tokens:t,i:r})=>{if(/^(\w+)|(\w+<\w+>)|(\w+<\w+:\s*\d+>)$/.test(e)&&o==" "&&/^\w+$/.test(t[r+2]??""))return 2},(e,{previous:o,tokens:t,i:r})=>{if(/^\w+$/.test(e)&&o==" "&&(t[r-2]??"")=="struct")return 7},s.variable]},JS:{context:{bools:{singleQuote:!1,doubleQuote:!1,backQuote:!1,lineComment:!1,multiLineComment:!1},numbers:{bracketDepth:0}},match:/((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,tokens:{...c(["return"],1),...c(["import","if","else","while","for","const","let","var","void"],1),...c(["true","false","null","undefined"],4),...c(["this"],7),...c(["=","+","-","*","/","**","%","?","||","&&","new","typeof"],6),...c(["console"],11,1)},matchers:[s.comment,s.string,s.number,s.brackets,s.execution,s.property,s.variable]},OSL:{context:{bools:{singleQuote:!1,doubleQuote:!1,backQuote:!1},numbers:{bracketDepth:0}},match:/((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,tokens:{...c(["return"],1),...c(["import","if","else","while","until","for","loop","local","void"],1),...c(["true","false","null","undefined"],4),...c(["this","self"],7),...c(["=","+","-","*","/","^","%","?","||","&&","new","typeof"],6),...c(["log"],11,1)},matchers:[s.comment,s.string,s.number,s.brackets,s.execution,s.property,s.variable]},GS:{context:{bools:{singleQuote:!1,doubleQuote:!1,backQuote:!1},numbers:{bracketDepth:0}},match:/((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,tokens:{...c(["return"],1),...c(["import","if","else","while","for","const","let","var","void"],1),...c(["true","false","null","undefined"],4),...c(["this"],7),...c(["=","+","-","*","/","**","%","?","||","&&","new","typeof"],6),...c(["out"],11,1)},matchers:[s.comment,s.string,s.number,s.brackets,s.execution,s.property,s.variable]}};function G(e,o,t){const r=o.split(`
`);e.classList.contains("code")||e.classList.add("code"),e.innerHTML="";const l=t.context??{};for(let n=0;n<r.length;n++){const i=r[n]+`
`,a=document.createElement("div");a.className="code-line";const m=i.match(t.match)??[],x=(f,b)=>{const u=document.createElement("span");u.className=`code-token code-token-${E[f]}`,u.textContent=b,a.appendChild(u)};let v=t.matchers??[],d=null,g="";for(let f=0;f<m.length;f++){const b=m[f];let u=t.tokens["t-"+b]??0,C=0;if(u instanceof Object&&(C=u.behaviour,u=u.type),C==0)for(let w=0;w<v.length;w++){const h=v[w],S=h instanceof Function?h:h.func;if(!(h instanceof Function)&&u!=0&&h.behaviour==1)continue;const L=S(b,{tokens:m,i:f,next:m[f+1]??"",previous:m[f-1]??""},l);if(u=L??u,L)break}d??=u,d!=u&&(x(d,g),d=u,g=""),g+=b}x(d??0,g),e.appendChild(a)}}const H={fcl:{name:"FCL",style:"FCL",scripts:{HelloWorld:`
                print("Hello World")
            `,GreaterThan:[`
                x = 5;
                if (x > 2) {
                    print("x is greater than 2");
                }
            `,`
                x = 5;
                if (x > 2)
                    print("x is greater than 2");
            `],Fibonacci:`
                num a = 0;
                num b = 1;
                num c = 0;
                for (10) {
                    c = a + b;
                    a = b;
                    b = c;
                }
                print(c);
            `}},js:{name:"Javascript",style:"JS",scripts:{HelloWorld:`
                console.log("Hello World");
            `,GreaterThan:[`
                const x = 5;
                if (x > 2) {
                    console.log("x is greater than 2");
                }
            `,`
                const x = 5;
                if (x > 2)
                    console.log("x is greater than 2");
            `],Fibonacci:`
                let a = 0;
                let b = 1;
                let c = 0;
                for (let i = 0; i < 10; i++) {
                    c = a + b;
                    a = b;
                    b = c;
                }
                console.log(c);
            `}},osl:{name:"OSL",style:"OSL",scripts:{HelloWorld:`
                log "Hello World"
            `,GreaterThan:`
                local x = 5
                if x > 2 (
                    log "x is greater than 2"
                )
            `,Fibonacci:`
                local a = 0;
                local b = 1;
                local c = 0;
                loop 10 (
                    c = a + b;
                    a = b;
                    b = c;
                )
                console.log(c);
            `}},gs:{name:"Ghostscript",style:"GS",scripts:{HelloWorld:`
                out("Hello World");
            `,GreaterThan:`
                var x = 5
                if (x > 2)
                    out("x is greater than 2");
            `}}};var p=(e=>(e.HelloWorld="Hello World",e.GreaterThan="X is greater than 2",e.Fibonacci="Fibonacci Sequence",e))(p||{});function W(e){const o=document.getElementById("lang-select");if(!o)throw"no lang select";const t=document.createElement("option");t.textContent=e,t.value=Object.keys(p)[Object.values(p).findIndex(r=>r===e)],o.appendChild(t)}function y(e){e=e.split(`
`).filter(t=>!!t.trim()).join(`
`);const o=e.split(`
`).reduce((t,r)=>Math.min(t,(/^\s+/.exec(r)??[""])[0].length),999);return e=e.split(`
`).map(t=>t.slice(o)).join(`
`),e}function D(e,o){const t=document.getElementById("langs");if(!t)throw"no lang parent";const r=document.createElement("div");r.className="uiblock",t.appendChild(r);const l=document.createElement("h2");l.textContent=e.name,l.className="lang-header",r.appendChild(l);let n=e.scripts[o];if(!n){const i=document.createElement("p");i.className="lang-noExamples",i.textContent="no examples for this lang :(",r.appendChild(i);return}Array.isArray(n)||(n=[n]);for(let i=0;i<n.length;i++){const a=document.createElement("div");a.className="uiblock code";let m="white-space: pre; padding: 10px; margin: 10px;";e.style?(G(a,y(n[i]),B[e.style]),m+="padding-bottom: 14px"):a.textContent=y(n[i]),a.style=m,r.appendChild(a)}}function Q(){const e=document.getElementById("lang-select");if(!e)throw"no lang select";const o=e.value,t=document.getElementById("langs");if(!t)throw"no lang parent";t.innerHTML="";const r=Object.values(H);for(let l=0;l<r.length;l++){const n=r[l];D(n,o)}}const F=document.getElementById("lang-select");if(!F)throw"no lang select";F.addEventListener("change",function(){Q()});const O=Object.values(p);for(let e=0;e<O.length;e++){const o=O[e];W(o)}Q();
