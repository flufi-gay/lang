
export enum TokenType {
    Word,
    Keyword,
    Type,
    Function,
    Constant,
    String,
    Operator,
    Entity,
    Comment,
    Property,
    Variable,

    Debug,

    Bracket1,
    Bracket2,
    Bracket3
}
export enum TokenBehaviour {
    Default,
    Permanent
}
export enum TokenMatcherBehaviour {
    Default,
    Fallback
}

export type LangContext = {
    bools?: {
        [key: string]: boolean
    },
    numbers?: {
        [key: string]: number
    }
}
export type TokenMatcherFunc = (token: string, data: { tokens: Array<string>, i: number, next: string, previous: string }, context: LangContext) => TokenType | undefined | null | void;
export type TokenMatcher = TokenMatcherFunc | { func: TokenMatcherFunc, behaviour: TokenMatcherBehaviour }
export type StyleLanguage = {
    context?: LangContext,
    match: RegExp,
    tokens: {
        [key: string]: TokenType | {
            type: TokenType,
            behaviour: TokenBehaviour
        }
    },
    matchers?: Array<TokenMatcher>
}
export const MatcherPresets: Record<string, TokenMatcher> = {
    // literals
    string: (token, _data, context) => {
        const flip = (name: string) => context.bools![name] = !context.bools![name];
        const inside = (name: string) => context.bools![name];

        let is: boolean;
        let name: string;

        if (token == "\\n")
            return TokenType.Constant;
        
        name = "singleQuote";
        if (is = token == "'") flip(name);
        if (inside(name) || is) return TokenType.String;
        name = "doubleQuote";
        if (is = token == '"') flip(name);
        if (inside(name) || is) return TokenType.String;
        name = "backQuote";
        if (is = token == "`") flip(name);
        if (inside(name) || is) return TokenType.String;
    },
    number: (token) =>
        /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(token) ? TokenType.Constant : null,
    
    // syntax
    brackets: (token, _data, context) => {
        const add = [ "(", "[", "{" ];
        const sub = [ ")", "]", "}" ];
        const tokens = [ ...add, ...sub ];
        const types = [
            TokenType.Bracket1,
            TokenType.Bracket2,
            TokenType.Bracket3
        ];
        
        context.numbers!.bracketDepth += 
            add.includes(token) ? 1 :
            sub.includes(token) ? -1 :
            0;
        const depth = context.numbers!.bracketDepth + (sub.includes(token) ? 0 : -1);
        if (tokens.includes(token))
            return types[depth % types.length];
    },

    execution: (_token, { next }) => 
        next == "(" ?
            TokenType.Function :
            null,
    
    property: (token, { previous }) => {
        if (/^\w+$/.test(token) && previous == ".")
            return TokenType.Property;
    },

    comment: (token, _data, context) => {
        if (token == "//")
            context.bools!.lineComment = true;
        if (token == "\n")
            context.bools!.lineComment = false;

        if (context.bools!.lineComment)
            return TokenType.Comment;

        if (token == "/*")
            context.bools!.multiLineComment = true;
        if (token == "*/")
            context.bools!.multiLineComment = false;
        
        if (context.bools!.multiLineComment || token == "*/")
            return TokenType.Comment;
    },

    variable: { func: (token) => {
        return /^\s*\w+\s*$/.test(token) ? TokenType.Variable : null
    }, behaviour: TokenMatcherBehaviour.Fallback}
}

export const TokenBatch = (tokens: Array<string>, type: TokenType, behaviour?: TokenBehaviour) => 
    Object.fromEntries(tokens.map(v => ["t-"+v, behaviour != null ? {type, behaviour} : type]));

export const StyleLanguages: { [key: string]: StyleLanguage } = {
    FCL: {
        context: {
            bools: {
                singleQuote: false,
                doubleQuote: false,
                backQuote: false,

                lineComment: false,
                multiLineComment: false,
            },
            numbers: {
                bracketDepth: 0
            }
        },
        
        match: /((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,

        tokens: {
            ...TokenBatch([ // types
                "str",
                "num",
                "bool",
                
                "Obj",
                "Arr",

                "void",
                "any",
                "Type"
            ], TokenType.Type),

            ...TokenBatch([ // statements
                "return"
            ], TokenType.Keyword),

            ...TokenBatch([ // keywords
                "struct",
                "import",

                "if","else","while","until","for"
            ], TokenType.Keyword),

            ...TokenBatch([ // constants
                "true","false",
                "null"
            ], TokenType.Constant),

            ...TokenBatch([ // entities
                "self"
            ], TokenType.Entity),

            ...TokenBatch([ // operators
                "=",

                "+","++","-","*","/","^","%",
                "~+","~++","?",

                "||","|||", "&&","&&&",

                ":",

                "new"
            ], TokenType.Operator),

            ...TokenBatch([
                "print"
            ], TokenType.Debug, TokenBehaviour.Permanent)
        },

        matchers: [
            MatcherPresets.comment,

            MatcherPresets.string,
            MatcherPresets.number,

            MatcherPresets.brackets,
            MatcherPresets.execution,
            MatcherPresets.property,

            /* type def, -> Type <- Name */ (token, { next, tokens, i }) => {
                if (/^(\w+)|(\w+<\w+>)|(\w+<\w+:\s*\d+>)$/.test(token) && next == " " && /^\w+$/.test(tokens[i+2] ?? ""))
                    return TokenType.Type;
            },

            /* struct def, struct -> Name <- */ (token, { previous, tokens, i }) => {
                if (/^\w+$/.test(token) && previous == " " && (tokens[i-2] ?? "") == "struct")
                    return TokenType.Entity;
            },

            MatcherPresets.variable
        ]
    },
    JS: {
        context: {
            bools: {
                singleQuote: false,
                doubleQuote: false,
                backQuote: false,

                lineComment: false,
                multiLineComment: false,
            },
            numbers: {
                bracketDepth: 0
            }
        },
        
        match: /((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,

        tokens: {
            ...TokenBatch([ // statements
                "return"
            ], TokenType.Keyword),

            ...TokenBatch([ // keywords
                "import",

                "if","else","while","for",

                "const", "let", "var",

                "void"
            ], TokenType.Keyword),

            ...TokenBatch([ // constants
                "true","false",
                "null","undefined"
            ], TokenType.Constant),

            ...TokenBatch([ // entities
                "this"
            ], TokenType.Entity),

            ...TokenBatch([ // operators
                "=",

                "+","-","*","/","**","%",
                "?",

                "||","&&",

                "new","typeof"
            ], TokenType.Operator),

            ...TokenBatch([
                "console"
            ], TokenType.Debug, TokenBehaviour.Permanent)
        },

        matchers: [
            MatcherPresets.comment,

            MatcherPresets.string,
            MatcherPresets.number,

            MatcherPresets.brackets,
            MatcherPresets.execution,
            MatcherPresets.property,

            MatcherPresets.variable
        ]
    },
    OSL: {
        context: {
            bools: {
                singleQuote: false,
                doubleQuote: false,
                backQuote: false,

                //lineComment: false,
                //multiLineComment: false,
            },
            numbers: {
                bracketDepth: 0
            }
        },
        
        match: /((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,

        tokens: {
            ...TokenBatch([ // statements
                "return"
            ], TokenType.Keyword),

            ...TokenBatch([ // keywords
                "import",

                "if","else","while","until","for","loop",

                "local",

                "void"
            ], TokenType.Keyword),

            ...TokenBatch([ // constants
                "true","false",
                "null","undefined"
            ], TokenType.Constant),

            ...TokenBatch([ // entities
                "this", "self"
            ], TokenType.Entity),

            ...TokenBatch([ // operators
                "=",

                "+","-","*","/","^","%",
                "?",

                "||","&&",

                "new","typeof"
            ], TokenType.Operator),

            ...TokenBatch([
                "log"
            ], TokenType.Debug, TokenBehaviour.Permanent)
        },

        matchers: [
            MatcherPresets.comment,

            MatcherPresets.string,
            MatcherPresets.number,

            MatcherPresets.brackets,
            MatcherPresets.execution,
            MatcherPresets.property,

            MatcherPresets.variable
        ]
    },
    GS: {
        context: {
            bools: {
                singleQuote: false,
                doubleQuote: false,
                backQuote: false,

                //lineComment: false,
                //multiLineComment: false,
            },
            numbers: {
                bracketDepth: 0
            }
        },
        
        match: /((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,

        tokens: {
            ...TokenBatch([ // statements
                "return"
            ], TokenType.Keyword),

            ...TokenBatch([ // keywords
                "import",

                "if","else","while","for",

                "const", "let", "var",

                "void"
            ], TokenType.Keyword),

            ...TokenBatch([ // constants
                "true","false",
                "null","undefined"
            ], TokenType.Constant),

            ...TokenBatch([ // entities
                "this"
            ], TokenType.Entity),

            ...TokenBatch([ // operators
                "=",

                "+","-","*","/","**","%",
                "?",

                "||","&&",

                "new","typeof"
            ], TokenType.Operator),

            ...TokenBatch([
                "out"
            ], TokenType.Debug, TokenBehaviour.Permanent)
        },

        matchers: [
            MatcherPresets.comment,

            MatcherPresets.string,
            MatcherPresets.number,

            MatcherPresets.brackets,
            MatcherPresets.execution,
            MatcherPresets.property,

            MatcherPresets.variable
        ]
    },
    KNP: {
        context: {
            bools: {
                singleQuote: false,
                doubleQuote: false,
                backQuote: false,

                //lineComment: false,
                //multiLineComment: false,
            },
            numbers: {
                bracketDepth: 0
            }
        },
        
        match: /((\w+<\w+:\s*\d+>)|(\w+<\w+>)|(\w+))|\\[n]|\w+|[\t\f ]+|[~?:+\-*\/=.|&]+|[,;(){}\[\]<>\n'`"\\]|./g,

        tokens: {
            ...TokenBatch([ // statements
                "return"
            ], TokenType.Keyword),

            ...TokenBatch([ // keywords
                "import",

                "if","else","while","for",
            ], TokenType.Keyword),

            ...TokenBatch([ // types
                "str",
                "num",
                "bool",
            ], TokenType.Type),

            ...TokenBatch([ // categiories
                "looks"
            ], TokenType.Keyword),

            ...TokenBatch([ // constants
                "true","false",
            ], TokenType.Constant),

            ...TokenBatch([ // entities
                "this"
            ], TokenType.Entity),

            ...TokenBatch([ // operators
                "=",

                "+","-","*","/","^","%",
            ], TokenType.Operator),

            ...TokenBatch([
                "console"
            ], TokenType.Debug, TokenBehaviour.Permanent)
        },

        matchers: [
            // comments
            (token, _data, context) => {
                if (token == "//")
                    context.bools!.lineComment = true;
                if (token == "\n")
                    context.bools!.lineComment = false;

                if (context.bools!.lineComment)
                    return TokenType.Comment;

                if (token == "/*")
                    context.bools!.multiLineComment = true;
                if (token == "*/")
                    context.bools!.multiLineComment = false;
                
                if (context.bools!.multiLineComment || token == "*/")
                    return TokenType.Comment;
            },

            MatcherPresets.string,
            MatcherPresets.number,

            MatcherPresets.brackets,
            MatcherPresets.execution,
            MatcherPresets.property,

            MatcherPresets.variable
        ]
    }
}

export function Generate(parent: HTMLElement, text: string, lang: StyleLanguage) {
    const lines = text.split("\n");

    if (!parent.classList.contains("code"))
        parent.classList.add("code");

    parent.innerHTML = "";

    const context: LangContext = lang.context ?? {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] + "\n";
        const lineDiv = document.createElement("div");
        lineDiv.className = "code-line";

        const tokens = line.match(lang.match) ?? [];

        const addSpan = (type: TokenType, text: string) => {
            const span = document.createElement("span");
            span.className = `code-token code-token-${TokenType[type]}`;
            span.textContent = text;
            lineDiv.appendChild(span);
        }

        let matchers: Array<TokenMatcher> = lang.matchers ?? [];

        let currentType: TokenType | null = null;
        let currentText = "";
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let type = lang.tokens["t-"+token] ?? TokenType.Word;
            let behaviour = TokenBehaviour.Default

            if (type instanceof Object) {
                behaviour = type.behaviour;
                type = type.type;
            }

            if (behaviour == TokenBehaviour.Default) {
                for (let matchi = 0; matchi < matchers.length; matchi++) {
                    const matcher = matchers[matchi];
                    const func: Function = matcher instanceof Function ? matcher : matcher.func;
                    if (!(matcher instanceof Function)) {
                        if (type != TokenType.Word && matcher.behaviour == TokenMatcherBehaviour.Fallback) {
                            continue;
                        }
                    }
                    const out: TokenType | null | undefined = func(token, {
                        tokens, i, next: tokens[i+1] ?? "", previous: tokens[i-1] ?? ""
                    }, context);
                    type = out ?? type;
                    if (out)
                        break;
                }
            }

            currentType ??= type;

            if (currentType != type) {
                addSpan(currentType, currentText);
                currentType = type;
                currentText = "";
            }

            currentText += token;
        }
        addSpan(currentType ?? TokenType.Word, currentText);

        parent.appendChild(lineDiv);
    }
}