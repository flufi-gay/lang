import type { Lang } from "./main";

export const langs: Record<string, Lang> = {
    fcl: {
        name: "FCL",
        style: "FCL",
        scripts: {
            HelloWorld: `
                print("Hello World")
            `,
            GreaterThan: [`
                x = 5;
                if (x > 2) {
                    print("x is greater than 2");
                }
            `,`
                x = 5;
                if (x > 2)
                    print("x is greater than 2");
            `],
            Fibonacci: `
                num a = 0;
                num b = 1;
                num c = 0;
                for (10) {
                    c = a + b;
                    a = b;
                    b = c;
                }
                print(c);
            `
        }
    },
    js: {
        name: "Javascript",
        style: "JS",
        scripts: {
            HelloWorld: `
                console.log("Hello World");
            `,
            GreaterThan: [`
                const x = 5;
                if (x > 2) {
                    console.log("x is greater than 2");
                }
            `,`
                const x = 5;
                if (x > 2)
                    console.log("x is greater than 2");
            `],
            Fibonacci: `
                let a = 0;
                let b = 1;
                let c = 0;
                for (let i = 0; i < 10; i++) {
                    c = a + b;
                    a = b;
                    b = c;
                }
                console.log(c);
            `
        }
    },
    osl: {
        name: "OSL",
        style: "OSL",
        scripts: {
            HelloWorld: `
                log "Hello World"
            `,
            GreaterThan: `
                local x = 5
                if x > 2 (
                    log "x is greater than 2"
                )
            `,
            Fibonacci: `
                local a = 0;
                local b = 1;
                local c = 0;
                loop 10 (
                    c = a + b;
                    a = b;
                    b = c;
                )
                console.log(c);
            `
        }
    },
    gs: {
        name: "Ghostscript",
        style: "GS",
        scripts: {
            HelloWorld: `
                out("Hello World")
            `,
            GreaterThan: `
                var x = 5
                if (x > 2)
                    out("x is greater than 2");
            `,
            Fibonacci: `
                var a = 0
                var b = 1
                var c = 0

                for (10)
                    c = a + b
                    a = b
                    b = c;
                out(c)
            `
        }
    }
}
