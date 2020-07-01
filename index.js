let __defineProperty = Object.defineProperty;
let __hasOwnProperty = Object.prototype.hasOwnProperty;
let __commonJS = (callback, module) => () => {
  if (!module) {
    module = {exports: {}};
    callback(module.exports, module);
  }
  return module.exports;
};
let __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
let __export = (target, all) => {
  __markAsModule(target);
  for (let name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};
let __exportStar = (target, module) => {
  __markAsModule(target);
  if (typeof module === "object" || typeof module === "function") {
    for (let key in module)
      if (__hasOwnProperty.call(module, key) && !__hasOwnProperty.call(target, key) && key !== "default")
        __defineProperty(target, key, {get: () => module[key], enumerable: true});
  }
  return target;
};
let __toModule = (module) => {
  if (module && module.__esModule)
    return module;
  return __exportStar(__defineProperty({}, "default", {value: module, enumerable: true}), module);
};

// node_modules/prism-es6/prism.js
var require_prism = __commonJS((exports, module) => {
  __export(exports, {
    default: () => prism_default
  });
  let _self = {};
  let Prism2 = function() {
    let lang = /\blang(?:uage)?-([\w-]+)\b/i;
    let uniqueId = 0;
    var _ = _self.Prism = {
      manual: _self.Prism && _self.Prism.manual,
      disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
      util: {
        encode(tokens) {
          if (tokens instanceof Token) {
            return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
          } else if (_.util.type(tokens) === "Array") {
            return tokens.map(_.util.encode);
          } else {
            return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          }
        },
        type(o) {
          return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
        },
        objId(obj) {
          if (!obj["__id"]) {
            Object.defineProperty(obj, "__id", {value: ++uniqueId});
          }
          return obj["__id"];
        },
        clone(o, visited) {
          var type = _.util.type(o);
          visited = visited || {};
          switch (type) {
            case "Object":
              if (visited[_.util.objId(o)]) {
                return visited[_.util.objId(o)];
              }
              var clone = {};
              visited[_.util.objId(o)] = clone;
              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = _.util.clone(o[key], visited);
                }
              }
              return clone;
            case "Array":
              if (visited[_.util.objId(o)]) {
                return visited[_.util.objId(o)];
              }
              var clone = [];
              visited[_.util.objId(o)] = clone;
              o.forEach(function(v, i) {
                clone[i] = _.util.clone(v, visited);
              });
              return clone;
          }
          return o;
        }
      },
      languages: {
        extend(id, redef) {
          var lang2 = _.util.clone(_.languages[id]);
          for (var key in redef) {
            lang2[key] = redef[key];
          }
          return lang2;
        },
        insertBefore(inside, before, insert, root) {
          root = root || _.languages;
          var grammar = root[inside];
          if (arguments.length == 2) {
            insert = arguments[1];
            for (var newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                grammar[newToken] = insert[newToken];
              }
            }
            return grammar;
          }
          var ret = {};
          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              }
              ret[token] = grammar[token];
            }
          }
          _.languages.DFS(_.languages, function(key, value) {
            if (value === root[inside] && key != inside) {
              this[key] = ret;
            }
          });
          return root[inside] = ret;
        },
        DFS(o, callback, type, visited) {
          visited = visited || {};
          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);
              if (_.util.type(o[i]) === "Object" && !visited[_.util.objId(o[i])]) {
                visited[_.util.objId(o[i])] = true;
                _.languages.DFS(o[i], callback, null, visited);
              } else if (_.util.type(o[i]) === "Array" && !visited[_.util.objId(o[i])]) {
                visited[_.util.objId(o[i])] = true;
                _.languages.DFS(o[i], callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},
      highlightAll(async, callback) {
        _.highlightAllUnder(document, async, callback);
      },
      highlightAllUnder(container, async, callback) {
        var env = {
          callback,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        _.hooks.run("before-highlightall", env);
        var elements = env.elements || container.querySelectorAll(env.selector);
        for (var i = 0, element; element = elements[i++]; ) {
          _.highlightElement(element, async === true, env.callback);
        }
      },
      highlightElement(element, async, callback) {
        var language, grammar, parent = element;
        while (parent && !lang.test(parent.className)) {
          parent = parent.parentNode;
        }
        if (parent) {
          language = (parent.className.match(lang) || [, ""])[1].toLowerCase();
          grammar = _.languages[language];
        }
        element.className = element.className.replace(lang, "").replace(/\s+/g, " ") + " language-" + language;
        if (element.parentNode) {
          parent = element.parentNode;
          if (/pre/i.test(parent.nodeName)) {
            parent.className = parent.className.replace(lang, "").replace(/\s+/g, " ") + " language-" + language;
          }
        }
        var code = element.textContent;
        var env = {
          element,
          language,
          grammar,
          code
        };
        _.hooks.run("before-sanity-check", env);
        if (!env.code || !env.grammar) {
          if (env.code) {
            _.hooks.run("before-highlight", env);
            env.element.textContent = env.code;
            _.hooks.run("after-highlight", env);
          }
          _.hooks.run("complete", env);
          return;
        }
        _.hooks.run("before-highlight", env);
        if (async && _self.Worker) {
          var worker = new Worker(_.filename);
          worker.onmessage = function(evt) {
            env.highlightedCode = evt.data;
            _.hooks.run("before-insert", env);
            env.element.innerHTML = env.highlightedCode;
            callback && callback.call(env.element);
            _.hooks.run("after-highlight", env);
            _.hooks.run("complete", env);
          };
          worker.postMessage(JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          }));
        } else {
          env.highlightedCode = _.highlight(env.code, env.grammar, env.language);
          _.hooks.run("before-insert", env);
          env.element.innerHTML = env.highlightedCode;
          callback && callback.call(element);
          _.hooks.run("after-highlight", env);
          _.hooks.run("complete", env);
        }
      },
      highlight(text, grammar, language) {
        var env = {
          code: text,
          grammar,
          language
        };
        _.hooks.run("before-tokenize", env);
        env.tokens = _.tokenize(env.code, env.grammar);
        _.hooks.run("after-tokenize", env);
        return Token.stringify(_.util.encode(env.tokens), env.language);
      },
      matchGrammar(text, strarr, grammar, index, startPos, oneshot, target) {
        var Token2 = _.Token;
        for (var token in grammar) {
          if (!grammar.hasOwnProperty(token) || !grammar[token]) {
            continue;
          }
          if (token == target) {
            return;
          }
          var patterns = grammar[token];
          patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];
          for (var j = 0; j < patterns.length; ++j) {
            var pattern = patterns[j], inside = pattern.inside, lookbehind = !!pattern.lookbehind, greedy = !!pattern.greedy, lookbehindLength = 0, alias = pattern.alias;
            if (greedy && !pattern.pattern.global) {
              var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
              pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
            }
            pattern = pattern.pattern || pattern;
            for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
              var str = strarr[i];
              if (strarr.length > text.length) {
                return;
              }
              if (str instanceof Token2) {
                continue;
              }
              if (greedy && i != strarr.length - 1) {
                pattern.lastIndex = pos;
                var match = pattern.exec(text);
                if (!match) {
                  break;
                }
                var from = match.index + (lookbehind ? match[1].length : 0), to = match.index + match[0].length, k = i, p = pos;
                for (var len = strarr.length; k < len && (p < to || !strarr[k].type && !strarr[k - 1].greedy); ++k) {
                  p += strarr[k].length;
                  if (from >= p) {
                    ++i;
                    pos = p;
                  }
                }
                if (strarr[i] instanceof Token2) {
                  continue;
                }
                delNum = k - i;
                str = text.slice(pos, p);
                match.index -= pos;
              } else {
                pattern.lastIndex = 0;
                var match = pattern.exec(str), delNum = 1;
              }
              if (!match) {
                if (oneshot) {
                  break;
                }
                continue;
              }
              if (lookbehind) {
                lookbehindLength = match[1] ? match[1].length : 0;
              }
              var from = match.index + lookbehindLength, match = match[0].slice(lookbehindLength), to = from + match.length, before = str.slice(0, from), after = str.slice(to);
              var args = [i, delNum];
              if (before) {
                ++i;
                pos += before.length;
                args.push(before);
              }
              var wrapped = new Token2(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);
              args.push(wrapped);
              if (after) {
                args.push(after);
              }
              Array.prototype.splice.apply(strarr, args);
              if (delNum != 1)
                _.matchGrammar(text, strarr, grammar, i, pos, true, token);
              if (oneshot)
                break;
            }
          }
        }
      },
      tokenize(text, grammar, language) {
        var strarr = [text];
        var rest = grammar.rest;
        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }
          delete grammar.rest;
        }
        _.matchGrammar(text, strarr, grammar, 0, 0, false);
        return strarr;
      },
      hooks: {
        all: {},
        add(name, callback) {
          var hooks = _.hooks.all;
          hooks[name] = hooks[name] || [];
          hooks[name].push(callback);
        },
        run(name, env) {
          var callbacks = _.hooks.all[name];
          if (!callbacks || !callbacks.length) {
            return;
          }
          for (var i = 0, callback; callback = callbacks[i++]; ) {
            callback(env);
          }
        }
      }
    };
    var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
      this.type = type;
      this.content = content;
      this.alias = alias;
      this.length = (matchedStr || "").length | 0;
      this.greedy = !!greedy;
    };
    Token.stringify = function(o, language, parent) {
      if (typeof o === "string") {
        return o;
      }
      if (_.util.type(o) === "Array") {
        return o.map((element) => {
          return Token.stringify(element, language, o);
        }).join("");
      }
      let env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: "span",
        classes: ["token", o.type],
        attributes: {},
        language,
        parent
      };
      if (o.alias) {
        let aliases = _.util.type(o.alias) === "Array" ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
      }
      _.hooks.run("wrap", env);
      let attributes = Object.keys(env.attributes).map((name) => {
        return name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
      }).join(" ");
      return `<${env.tag} class="${env.classes.join(" ")}"${attributes ? " " + attributes : ""}>${env.content}</${env.tag}>`;
    };
    if (!_self.document) {
      if (!_self.addEventListener) {
        return _self.Prism;
      }
      if (!_.disableWorkerMessageHandler) {
        _self.addEventListener("message", (evt) => {
          var message = JSON.parse(evt.data), lang2 = message.language, code = message.code, immediateClose = message.immediateClose;
          _self.postMessage(_.highlight(code, _.languages[lang2], lang2));
          if (immediateClose) {
            _self.close();
          }
        }, false);
      }
      return _self.Prism;
    }
    return _self.Prism;
  }();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Prism2;
  }
  if (typeof global !== "undefined") {
    global.Prism = Prism2;
  }
  Prism2.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
      greedy: true,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "attr-value": {
          pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
          inside: {
            punctuation: [
              /^=/,
              {
                pattern: /(^|[^\\])["']/,
                lookbehind: true
              }
            ]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: /&#?[\da-z]{1,8};/i
  };
  Prism2.languages.markup.tag.inside["attr-value"].inside.entity = Prism2.languages.markup.entity;
  Prism2.hooks.add("wrap", (env) => {
    if (env.type === "entity") {
      env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
  });
  Prism2.languages.xml = Prism2.languages.markup;
  Prism2.languages.html = Prism2.languages.markup;
  Prism2.languages.mathml = Prism2.languages.markup;
  Prism2.languages.svg = Prism2.languages.markup;
  Prism2.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
      inside: {
        rule: /@[\w-]+/
      }
    },
    url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^{}\s][^{};]*?(?=\s*\{)/,
    string: {
      pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /\B!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:]/
  };
  Prism2.languages.css.atrule.inside.rest = Prism2.languages.css;
  if (Prism2.languages.markup) {
    Prism2.languages.insertBefore("markup", "tag", {
      style: {
        pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
        lookbehind: true,
        inside: Prism2.languages.css,
        alias: "language-css",
        greedy: true
      }
    });
    Prism2.languages.insertBefore("inside", "attr-value", {
      "style-attr": {
        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
        inside: {
          "attr-name": {
            pattern: /^\s*style/i,
            inside: Prism2.languages.markup.tag.inside
          },
          punctuation: /^\s*=\s*['"]|['"]\s*$/,
          "attr-value": {
            pattern: /.+/i,
            inside: Prism2.languages.css
          }
        },
        alias: "language-css"
      }
    }, Prism2.languages.markup.tag);
  }
  Prism2.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    "class-name": {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /[a-z0-9_]+(?=\()/i,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
  };
  Prism2.languages.javascript = Prism2.languages.extend("clike", {
    keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  });
  Prism2.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: true,
      greedy: true
    },
    "function-variable": {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
      alias: "function"
    },
    constant: /\b[A-Z][A-Z\d_]*\b/
  });
  Prism2.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\${[^}]+}/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation"
            },
            rest: null
          }
        },
        string: /[\s\S]+/
      }
    }
  });
  Prism2.languages.javascript["template-string"].inside.interpolation.inside.rest = Prism2.languages.javascript;
  if (Prism2.languages.markup) {
    Prism2.languages.insertBefore("markup", "tag", {
      script: {
        pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: true,
        inside: Prism2.languages.javascript,
        alias: "language-javascript",
        greedy: true
      }
    });
  }
  Prism2.languages.js = Prism2.languages.javascript;
  const prism_default = Prism2;
});

// node_modules/marked/lib/marked.js
var require_marked = __commonJS((exports, module) => {
  (function(root) {
    "use strict";
    var block = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
      html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: noop,
      table: noop,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
      text: /^[^\n]+/
    };
    block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
    block.bullet = /(?:[*+-]|\d{1,9}\.)/;
    block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
    block.item = edit(block.item, "gm").replace(/bull/g, block.bullet).getRegex();
    block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
    block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
    block._comment = /<!--(?!-?>)[\s\S]*?-->/;
    block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
    block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} +").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
    block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
    block.normal = merge({}, block);
    block.gfm = merge({}, block.normal, {
      nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
      table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
    });
    block.pedantic = merge({}, block.normal, {
      html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
      fences: noop,
      paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
    });
    function Lexer(options) {
      this.tokens = [];
      this.tokens.links = Object.create(null);
      this.options = options || marked3.defaults;
      this.rules = block.normal;
      if (this.options.pedantic) {
        this.rules = block.pedantic;
      } else if (this.options.gfm) {
        this.rules = block.gfm;
      }
    }
    Lexer.rules = block;
    Lexer.lex = function(src, options) {
      var lexer = new Lexer(options);
      return lexer.lex(src);
    };
    Lexer.prototype.lex = function(src) {
      src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n");
      return this.token(src, true);
    };
    Lexer.prototype.token = function(src, top) {
      src = src.replace(/^ +$/gm, "");
      var next, loose, cap, bull, b, item, listStart, listItems, t, space, i, tag, l, isordered, istask, ischecked;
      while (src) {
        if (cap = this.rules.newline.exec(src)) {
          src = src.substring(cap[0].length);
          if (cap[0].length > 1) {
            this.tokens.push({
              type: "space"
            });
          }
        }
        if (cap = this.rules.code.exec(src)) {
          var lastToken = this.tokens[this.tokens.length - 1];
          src = src.substring(cap[0].length);
          if (lastToken && lastToken.type === "paragraph") {
            lastToken.text += "\n" + cap[0].trimRight();
          } else {
            cap = cap[0].replace(/^ {4}/gm, "");
            this.tokens.push({
              type: "code",
              codeBlockStyle: "indented",
              text: !this.options.pedantic ? rtrim(cap, "\n") : cap
            });
          }
          continue;
        }
        if (cap = this.rules.fences.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "code",
            lang: cap[2] ? cap[2].trim() : cap[2],
            text: cap[3] || ""
          });
          continue;
        }
        if (cap = this.rules.heading.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "heading",
            depth: cap[1].length,
            text: cap[2]
          });
          continue;
        }
        if (cap = this.rules.nptable.exec(src)) {
          item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
          };
          if (item.header.length === item.align.length) {
            src = src.substring(cap[0].length);
            for (i = 0; i < item.align.length; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            for (i = 0; i < item.cells.length; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }
            this.tokens.push(item);
            continue;
          }
        }
        if (cap = this.rules.hr.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "hr"
          });
          continue;
        }
        if (cap = this.rules.blockquote.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "blockquote_start"
          });
          cap = cap[0].replace(/^ *> ?/gm, "");
          this.token(cap, top);
          this.tokens.push({
            type: "blockquote_end"
          });
          continue;
        }
        if (cap = this.rules.list.exec(src)) {
          src = src.substring(cap[0].length);
          bull = cap[2];
          isordered = bull.length > 1;
          listStart = {
            type: "list_start",
            ordered: isordered,
            start: isordered ? +bull : "",
            loose: false
          };
          this.tokens.push(listStart);
          cap = cap[0].match(this.rules.item);
          listItems = [];
          next = false;
          l = cap.length;
          i = 0;
          for (; i < l; i++) {
            item = cap[i];
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+\.) */, "");
            if (~item.indexOf("\n ")) {
              space -= item.length;
              item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
            }
            if (i !== l - 1) {
              b = block.bullet.exec(cap[i + 1])[0];
              if (bull.length > 1 ? b.length === 1 : b.length > 1 || this.options.smartLists && b !== bull) {
                src = cap.slice(i + 1).join("\n") + src;
                i = l - 1;
              }
            }
            loose = next || /\n\n(?!\s*$)/.test(item);
            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === "\n";
              if (!loose)
                loose = next;
            }
            if (loose) {
              listStart.loose = true;
            }
            istask = /^\[[ xX]\] /.test(item);
            ischecked = void 0;
            if (istask) {
              ischecked = item[1] !== " ";
              item = item.replace(/^\[[ xX]\] +/, "");
            }
            t = {
              type: "list_item_start",
              task: istask,
              checked: ischecked,
              loose
            };
            listItems.push(t);
            this.tokens.push(t);
            this.token(item, false);
            this.tokens.push({
              type: "list_item_end"
            });
          }
          if (listStart.loose) {
            l = listItems.length;
            i = 0;
            for (; i < l; i++) {
              listItems[i].loose = true;
            }
          }
          this.tokens.push({
            type: "list_end"
          });
          continue;
        }
        if (cap = this.rules.html.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: this.options.sanitize ? "paragraph" : "html",
            pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
          });
          continue;
        }
        if (top && (cap = this.rules.def.exec(src))) {
          src = src.substring(cap[0].length);
          if (cap[3])
            cap[3] = cap[3].substring(1, cap[3].length - 1);
          tag = cap[1].toLowerCase().replace(/\s+/g, " ");
          if (!this.tokens.links[tag]) {
            this.tokens.links[tag] = {
              href: cap[2],
              title: cap[3]
            };
          }
          continue;
        }
        if (cap = this.rules.table.exec(src)) {
          item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
          };
          if (item.header.length === item.align.length) {
            src = src.substring(cap[0].length);
            for (i = 0; i < item.align.length; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            for (i = 0; i < item.cells.length; i++) {
              item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ""), item.header.length);
            }
            this.tokens.push(item);
            continue;
          }
        }
        if (cap = this.rules.lheading.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "heading",
            depth: cap[2].charAt(0) === "=" ? 1 : 2,
            text: cap[1]
          });
          continue;
        }
        if (top && (cap = this.rules.paragraph.exec(src))) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "paragraph",
            text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
          });
          continue;
        }
        if (cap = this.rules.text.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: "text",
            text: cap[0]
          });
          continue;
        }
        if (src) {
          throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
        }
      }
      return this.tokens;
    };
    var inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noop,
      tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
      em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noop,
      text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
    };
    inline._punctuation = `!"#$%&'()*+,\\-./:;<=>?@\\[^_{|}~`;
    inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();
    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
    inline.tag = edit(inline.tag).replace("comment", block._comment).replace("attribute", inline._attribute).getRegex();
    inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
    inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
    inline.reflink = edit(inline.reflink).replace("label", inline._label).getRegex();
    inline.normal = merge({}, inline);
    inline.pedantic = merge({}, inline.normal, {
      strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
      link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
    });
    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace("])", "~|])").getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^~+(?=\S)([\s\S]*?\S)~+/,
      text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
    });
    inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace("{2,}", "*").getRegex(),
      text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    });
    function InlineLexer(links, options) {
      this.options = options || marked3.defaults;
      this.links = links;
      this.rules = inline.normal;
      this.renderer = this.options.renderer || new Renderer();
      this.renderer.options = this.options;
      if (!this.links) {
        throw new Error("Tokens array requires a `links` property.");
      }
      if (this.options.pedantic) {
        this.rules = inline.pedantic;
      } else if (this.options.gfm) {
        if (this.options.breaks) {
          this.rules = inline.breaks;
        } else {
          this.rules = inline.gfm;
        }
      }
    }
    InlineLexer.rules = inline;
    InlineLexer.output = function(src, links, options) {
      var inline2 = new InlineLexer(links, options);
      return inline2.output(src);
    };
    InlineLexer.prototype.output = function(src) {
      var out = "", link, text, href, title, cap, prevCapZero;
      while (src) {
        if (cap = this.rules.escape.exec(src)) {
          src = src.substring(cap[0].length);
          out += escape(cap[1]);
          continue;
        }
        if (cap = this.rules.tag.exec(src)) {
          if (!this.inLink && /^<a /i.test(cap[0])) {
            this.inLink = true;
          } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
            this.inLink = false;
          }
          if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.inRawBlock = true;
          } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.inRawBlock = false;
          }
          src = src.substring(cap[0].length);
          out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
          continue;
        }
        if (cap = this.rules.link.exec(src)) {
          var lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex > -1) {
            var linkLen = 4 + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
          src = src.substring(cap[0].length);
          this.inLink = true;
          href = cap[2];
          if (this.options.pedantic) {
            link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
            if (link) {
              href = link[1];
              title = link[3];
            } else {
              title = "";
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : "";
          }
          href = href.trim().replace(/^<([\s\S]*)>$/, "$1");
          out += this.outputLink(cap, {
            href: InlineLexer.escapes(href),
            title: InlineLexer.escapes(title)
          });
          this.inLink = false;
          continue;
        }
        if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
          src = src.substring(cap[0].length);
          link = (cap[2] || cap[1]).replace(/\s+/g, " ");
          link = this.links[link.toLowerCase()];
          if (!link || !link.href) {
            out += cap[0].charAt(0);
            src = cap[0].substring(1) + src;
            continue;
          }
          this.inLink = true;
          out += this.outputLink(cap, link);
          this.inLink = false;
          continue;
        }
        if (cap = this.rules.strong.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
          continue;
        }
        if (cap = this.rules.em.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
          continue;
        }
        if (cap = this.rules.code.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.codespan(escape(cap[2].trim(), true));
          continue;
        }
        if (cap = this.rules.br.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.br();
          continue;
        }
        if (cap = this.rules.del.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.del(this.output(cap[1]));
          continue;
        }
        if (cap = this.rules.autolink.exec(src)) {
          src = src.substring(cap[0].length);
          if (cap[2] === "@") {
            text = escape(this.mangle(cap[1]));
            href = "mailto:" + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }
          out += this.renderer.link(href, null, text);
          continue;
        }
        if (!this.inLink && (cap = this.rules.url.exec(src))) {
          if (cap[2] === "@") {
            text = escape(cap[0]);
            href = "mailto:" + text;
          } else {
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === "www.") {
              href = "http://" + text;
            } else {
              href = text;
            }
          }
          src = src.substring(cap[0].length);
          out += this.renderer.link(href, null, text);
          continue;
        }
        if (cap = this.rules.text.exec(src)) {
          src = src.substring(cap[0].length);
          if (this.inRawBlock) {
            out += this.renderer.text(this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]);
          } else {
            out += this.renderer.text(escape(this.smartypants(cap[0])));
          }
          continue;
        }
        if (src) {
          throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
        }
      }
      return out;
    };
    InlineLexer.escapes = function(text) {
      return text ? text.replace(InlineLexer.rules._escapes, "$1") : text;
    };
    InlineLexer.prototype.outputLink = function(cap, link) {
      var href = link.href, title = link.title ? escape(link.title) : null;
      return cap[0].charAt(0) !== "!" ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
    };
    InlineLexer.prototype.smartypants = function(text) {
      if (!this.options.smartypants)
        return text;
      return text.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
    };
    InlineLexer.prototype.mangle = function(text) {
      if (!this.options.mangle)
        return text;
      var out = "", l = text.length, i = 0, ch;
      for (; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = "x" + ch.toString(16);
        }
        out += "&#" + ch + ";";
      }
      return out;
    };
    function Renderer(options) {
      this.options = options || marked3.defaults;
    }
    Renderer.prototype.code = function(code, infostring, escaped) {
      var lang = (infostring || "").match(/\S*/)[0];
      if (this.options.highlight) {
        var out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
          escaped = true;
          code = out;
        }
      }
      if (!lang) {
        return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>";
      }
      return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
    };
    Renderer.prototype.blockquote = function(quote) {
      return "<blockquote>\n" + quote + "</blockquote>\n";
    };
    Renderer.prototype.html = function(html) {
      return html;
    };
    Renderer.prototype.heading = function(text, level, raw, slugger) {
      if (this.options.headerIds) {
        return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + "</h" + level + ">\n";
      }
      return "<h" + level + ">" + text + "</h" + level + ">\n";
    };
    Renderer.prototype.hr = function() {
      return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
    };
    Renderer.prototype.list = function(body, ordered, start) {
      var type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
    };
    Renderer.prototype.listitem = function(text) {
      return "<li>" + text + "</li>\n";
    };
    Renderer.prototype.checkbox = function(checked) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
    };
    Renderer.prototype.paragraph = function(text) {
      return "<p>" + text + "</p>\n";
    };
    Renderer.prototype.table = function(header, body) {
      if (body)
        body = "<tbody>" + body + "</tbody>";
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    };
    Renderer.prototype.tablerow = function(content) {
      return "<tr>\n" + content + "</tr>\n";
    };
    Renderer.prototype.tablecell = function(content, flags) {
      var type = flags.header ? "th" : "td";
      var tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
      return tag + content + "</" + type + ">\n";
    };
    Renderer.prototype.strong = function(text) {
      return "<strong>" + text + "</strong>";
    };
    Renderer.prototype.em = function(text) {
      return "<em>" + text + "</em>";
    };
    Renderer.prototype.codespan = function(text) {
      return "<code>" + text + "</code>";
    };
    Renderer.prototype.br = function() {
      return this.options.xhtml ? "<br/>" : "<br>";
    };
    Renderer.prototype.del = function(text) {
      return "<del>" + text + "</del>";
    };
    Renderer.prototype.link = function(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      var out = '<a href="' + escape(href) + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text + "</a>";
      return out;
    };
    Renderer.prototype.image = function(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      var out = '<img src="' + href + '" alt="' + text + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += this.options.xhtml ? "/>" : ">";
      return out;
    };
    Renderer.prototype.text = function(text) {
      return text;
    };
    function TextRenderer() {
    }
    TextRenderer.prototype.strong = TextRenderer.prototype.em = TextRenderer.prototype.codespan = TextRenderer.prototype.del = TextRenderer.prototype.text = function(text) {
      return text;
    };
    TextRenderer.prototype.link = TextRenderer.prototype.image = function(href, title, text) {
      return "" + text;
    };
    TextRenderer.prototype.br = function() {
      return "";
    };
    function Parser(options) {
      this.tokens = [];
      this.token = null;
      this.options = options || marked3.defaults;
      this.options.renderer = this.options.renderer || new Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.slugger = new Slugger();
    }
    Parser.parse = function(src, options) {
      var parser = new Parser(options);
      return parser.parse(src);
    };
    Parser.prototype.parse = function(src) {
      this.inline = new InlineLexer(src.links, this.options);
      this.inlineText = new InlineLexer(src.links, merge({}, this.options, {renderer: new TextRenderer()}));
      this.tokens = src.reverse();
      var out = "";
      while (this.next()) {
        out += this.tok();
      }
      return out;
    };
    Parser.prototype.next = function() {
      this.token = this.tokens.pop();
      return this.token;
    };
    Parser.prototype.peek = function() {
      return this.tokens[this.tokens.length - 1] || 0;
    };
    Parser.prototype.parseText = function() {
      var body = this.token.text;
      while (this.peek().type === "text") {
        body += "\n" + this.next().text;
      }
      return this.inline.output(body);
    };
    Parser.prototype.tok = function() {
      switch (this.token.type) {
        case "space": {
          return "";
        }
        case "hr": {
          return this.renderer.hr();
        }
        case "heading": {
          return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, unescape(this.inlineText.output(this.token.text)), this.slugger);
        }
        case "code": {
          return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
        }
        case "table": {
          var header = "", body = "", i, row, cell, j;
          cell = "";
          for (i = 0; i < this.token.header.length; i++) {
            cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {header: true, align: this.token.align[i]});
          }
          header += this.renderer.tablerow(cell);
          for (i = 0; i < this.token.cells.length; i++) {
            row = this.token.cells[i];
            cell = "";
            for (j = 0; j < row.length; j++) {
              cell += this.renderer.tablecell(this.inline.output(row[j]), {header: false, align: this.token.align[j]});
            }
            body += this.renderer.tablerow(cell);
          }
          return this.renderer.table(header, body);
        }
        case "blockquote_start": {
          body = "";
          while (this.next().type !== "blockquote_end") {
            body += this.tok();
          }
          return this.renderer.blockquote(body);
        }
        case "list_start": {
          body = "";
          var ordered = this.token.ordered, start = this.token.start;
          while (this.next().type !== "list_end") {
            body += this.tok();
          }
          return this.renderer.list(body, ordered, start);
        }
        case "list_item_start": {
          body = "";
          var loose = this.token.loose;
          var checked = this.token.checked;
          var task = this.token.task;
          if (this.token.task) {
            body += this.renderer.checkbox(checked);
          }
          while (this.next().type !== "list_item_end") {
            body += !loose && this.token.type === "text" ? this.parseText() : this.tok();
          }
          return this.renderer.listitem(body, task, checked);
        }
        case "html": {
          return this.renderer.html(this.token.text);
        }
        case "paragraph": {
          return this.renderer.paragraph(this.inline.output(this.token.text));
        }
        case "text": {
          return this.renderer.paragraph(this.parseText());
        }
        default: {
          var errMsg = 'Token with "' + this.token.type + '" type was not found.';
          if (this.options.silent) {
            console.log(errMsg);
          } else {
            throw new Error(errMsg);
          }
        }
      }
    };
    function Slugger() {
      this.seen = {};
    }
    Slugger.prototype.slug = function(value) {
      var slug = value.toLowerCase().trim().replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      if (this.seen.hasOwnProperty(slug)) {
        var originalSlug = slug;
        do {
          this.seen[originalSlug]++;
          slug = originalSlug + "-" + this.seen[originalSlug];
        } while (this.seen.hasOwnProperty(slug));
      }
      this.seen[slug] = 0;
      return slug;
    };
    function escape(html, encode) {
      if (encode) {
        if (escape.escapeTest.test(html)) {
          return html.replace(escape.escapeReplace, function(ch) {
            return escape.replacements[ch];
          });
        }
      } else {
        if (escape.escapeTestNoEncode.test(html)) {
          return html.replace(escape.escapeReplaceNoEncode, function(ch) {
            return escape.replacements[ch];
          });
        }
      }
      return html;
    }
    escape.escapeTest = /[&<>"']/;
    escape.escapeReplace = /[&<>"']/g;
    escape.replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    function unescape(html) {
      return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
        n = n.toLowerCase();
        if (n === "colon")
          return ":";
        if (n.charAt(0) === "#") {
          return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
        }
        return "";
      });
    }
    function edit(regex, opt) {
      regex = regex.source || regex;
      opt = opt || "";
      return {
        replace: function(name, val) {
          val = val.source || val;
          val = val.replace(/(^|[^\[])\^/g, "$1");
          regex = regex.replace(name, val);
          return this;
        },
        getRegex: function() {
          return new RegExp(regex, opt);
        }
      };
    }
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        try {
          var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, "%");
      } catch (e) {
        return null;
      }
      return href;
    }
    function resolveUrl(base, href) {
      if (!baseUrls[" " + base]) {
        if (/^[^:]+:\/*[^/]*$/.test(base)) {
          baseUrls[" " + base] = base + "/";
        } else {
          baseUrls[" " + base] = rtrim(base, "/", true);
        }
      }
      base = baseUrls[" " + base];
      if (href.slice(0, 2) === "//") {
        return base.replace(/:[\s\S]*/, ":") + href;
      } else if (href.charAt(0) === "/") {
        return base.replace(/(:\/*[^/]*)[\s\S]*/, "$1") + href;
      } else {
        return base + href;
      }
    }
    var baseUrls = {};
    var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function noop() {
    }
    noop.exec = noop;
    function merge(obj) {
      var i = 1, target, key;
      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }
      return obj;
    }
    function splitCells(tableRow, count) {
      var row = tableRow.replace(/\|/g, function(match, offset, str) {
        var escaped = false, curr = offset;
        while (--curr >= 0 && str[curr] === "\\")
          escaped = !escaped;
        if (escaped) {
          return "|";
        } else {
          return " |";
        }
      }), cells = row.split(/ \|/), i = 0;
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count)
          cells.push("");
      }
      for (; i < cells.length; i++) {
        cells[i] = cells[i].trim().replace(/\\\|/g, "|");
      }
      return cells;
    }
    function rtrim(str, c, invert) {
      if (str.length === 0) {
        return "";
      }
      var suffLen = 0;
      while (suffLen < str.length) {
        var currChar = str.charAt(str.length - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }
      return str.substr(0, str.length - suffLen);
    }
    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      var level = 0;
      for (var i = 0; i < str.length; i++) {
        if (str[i] === "\\") {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }
    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
      }
    }
    function marked3(src, opt, callback) {
      if (typeof src === "undefined" || src === null) {
        throw new Error("marked(): input parameter is undefined or null");
      }
      if (typeof src !== "string") {
        throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
      }
      if (callback || typeof opt === "function") {
        if (!callback) {
          callback = opt;
          opt = null;
        }
        opt = merge({}, marked3.defaults, opt || {});
        checkSanitizeDeprecation(opt);
        var highlight = opt.highlight, tokens, pending, i = 0;
        try {
          tokens = Lexer.lex(src, opt);
        } catch (e) {
          return callback(e);
        }
        pending = tokens.length;
        var done = function(err) {
          if (err) {
            opt.highlight = highlight;
            return callback(err);
          }
          var out;
          try {
            out = Parser.parse(tokens, opt);
          } catch (e) {
            err = e;
          }
          opt.highlight = highlight;
          return err ? callback(err) : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
          return done();
        }
        delete opt.highlight;
        if (!pending)
          return done();
        for (; i < tokens.length; i++) {
          (function(token) {
            if (token.type !== "code") {
              return --pending || done();
            }
            return highlight(token.text, token.lang, function(err, code) {
              if (err)
                return done(err);
              if (code == null || code === token.text) {
                return --pending || done();
              }
              token.text = code;
              token.escaped = true;
              --pending || done();
            });
          })(tokens[i]);
        }
        return;
      }
      try {
        if (opt)
          opt = merge({}, marked3.defaults, opt);
        checkSanitizeDeprecation(opt);
        return Parser.parse(Lexer.lex(src, opt), opt);
      } catch (e) {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if ((opt || marked3.defaults).silent) {
          return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        }
        throw e;
      }
    }
    marked3.options = marked3.setOptions = function(opt) {
      merge(marked3.defaults, opt);
      return marked3;
    };
    marked3.getDefaults = function() {
      return {
        baseUrl: null,
        breaks: false,
        gfm: true,
        headerIds: true,
        headerPrefix: "",
        highlight: null,
        langPrefix: "language-",
        mangle: true,
        pedantic: false,
        renderer: new Renderer(),
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        xhtml: false
      };
    };
    marked3.defaults = marked3.getDefaults();
    marked3.Parser = Parser;
    marked3.parser = Parser.parse;
    marked3.Renderer = Renderer;
    marked3.TextRenderer = TextRenderer;
    marked3.Lexer = Lexer;
    marked3.lexer = Lexer.lex;
    marked3.InlineLexer = InlineLexer;
    marked3.inlineLexer = InlineLexer.output;
    marked3.Slugger = Slugger;
    marked3.parse = marked3;
    if (typeof module !== "undefined" && typeof exports === "object") {
      module.exports = marked3;
    } else if (typeof define === "function" && define.amd) {
      define(function() {
        return marked3;
      });
    } else {
      root.marked = marked3;
    }
  })(exports || (typeof window !== "undefined" ? window : global));
});

// src/wc-markdown.js
const prism = __toModule(require_prism());
const marked2 = __toModule(require_marked());
self.Prism = prism.default;
class WCMarkdown extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(value) {
    this.setAttribute("src", value);
    this.setSrc(value);
  }
  get value() {
    return this.__value;
  }
  set value(value) {
    this.__value = value;
    this.setValue();
  }
  constructor() {
    super();
    this.__value = "";
  }
  async connectedCallback() {
    this.style.display = "block";
    if (this.textContent) {
      this.__value = this.textContent;
      this.setValue();
    }
  }
  async setSrc(src) {
    this.__value = await this.fetchSrc(src);
    this.setValue();
  }
  async fetchSrc(src) {
    const response = await fetch(src);
    return response.text();
  }
  setValue() {
    let contents = this.__value;
    contents = WCMarkdown.prepare(contents);
    contents = WCMarkdown.toHtml(contents);
    this.innerHTML = contents;
    if (this.hasAttribute("highlight")) {
      WCMarkdown.highlight(this);
    }
  }
  static prepare(markdown) {
    return markdown.split("\n").map((line) => {
      line = line.replace("&lt;", "<");
      return line.replace("&gt;", ">");
    }).join("\n");
  }
  static toHtml(markdown) {
    return marked(markdown);
  }
  static highlight(element) {
    prism.default.highlightAllUnder(element);
  }
}
customElements.define("wc-markdown", WCMarkdown);
export {
  WCMarkdown
};
