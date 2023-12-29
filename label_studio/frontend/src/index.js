import './app/App';
import './utils/service-worker';

/**
 * JS HOOK
 * 1. 全局支持 解析 Latex 公示并显示
 * 2. 支持 RichText 内的 代码块显示/高亮，
 * 3. 全局支持 解析 Latex inline公式并显示
 * 4. 支持Paragraph/Textarea的自动换行，缩进，空格...
 * 5. 支持Paragraph/Textarea 内的 代码块显示/高亮
 *
 *
 *
 * 需要关闭Content-Security-Policy [非本地dev环境就可以]
 *
 * External resources:
 *  1: https://cdn.jsdelivr.net/npm/marked/marked.min.js markdown解析器
 *  2: https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js Latex转SVG编译器
 *  3: https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js 高亮代码块
 */

//可以无视这些错误，只是不符合ts的eslint规范
(function () {
    let markdown = false
    let mathjax = false
    let highlight = false
    let linenumber = false


    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }


    /**
     * 用于处理Ricktext中的代码块
     * 将多行的<span>包含的代码块提取并渲染
     * 不会立刻移除垃圾，等待最后一起处理
     * * @param found
     */
    function flushCodeBlock(found) {
        let codeBlock = ""
        for (let j = 0; j < found.length; ++j) {
            codeBlock = codeBlock + found[j].textContent + "\n"
        }
        //将除了第一行以外的全部行标记为垃圾（包括换行符）
        for (let j = 1; j < found.length; ++j) {
            var nextElement = found[j].nextElementSibling;
            if (nextElement && nextElement.tagName === 'BR') {
                nextElement.classList.add("__trash_rich_text_line")
            }
            found[j].classList.add("__trash_rich_text_line")
        }

        //使用第一行作为container
        found[0].innerText = ""
        found[0].innerHTML = ""
        //从codeBlock建立HTML格式codeBlock
        let html = marked.parse(codeBlock)
        //将Html转为element
        let code = createElementFromHTML(html);
        //增加高亮
        hljs.highlightElement(code)
        //增加行号, 不是很好看
        //hljs.lineNumbersBlock(code)
        //插入0
        //去掉背景
        code.style.background = 'none';
        found[0].appendChild(code)
    }

    /**
     * 处理Richtext中的代码块/Markdown
     * @param ele
     */
    function processRichtext(ele) {
        //不重复处理
        if (ele.className.includes("__processed_rich_text")) {
            return
        }
        ele.classList.add("__processed_rich_text")

        //滑动窗口找code blocks
        let lines = ele.getElementsByClassName("lsf-richtext__line")
        if (lines.length === 0) {
            return
        }
        let found = []

        for (let i = 0; i < lines.length; ++i) {
            let line = lines[i]

            //contains a math symbol
            if (line.getElementsByTagName("mjx-container").length > 0) {
                //should break
                found = []
                continue;
            }

            //start or finish
            if (line.innerText.includes("```")) {
                if (found.length === 0) {
                    found.push(line);
                } else {
                    //flush code
                    found.push(line);
                    flushCodeBlock(found)
                    found = [];
                }
                continue;
            }

            if (found.length > 0) {
                found.push(line)
            } else {
                //没有匹配到Code的情况下，匹配是不是可能是Markdown content
                if (
                    line.textContent.includes("#") ||
                    line.textContent.includes("*")
                ) {
                    line.innerHTML = makred.parse(line.textContent)
                }
            }
        }

        //如果需要结尾默认带一个···的话，在这里flush一次(check-non-empty)


        //删除垃圾
        let trashs = ele.getElementsByClassName("__trash_rich_text_line")
        for (let i = trashs.length - 1; i >= 0; --i) {
            trashs[i].remove()
        }
    }

    /**
     * 处理某个Container下的无序spans
     * Markdown格式 /
     */
    function processSpansUnder(ele) {
        let spans = ele.getElementsByTagName("span")
        let markdownSpans = [];

        for (let i = 0; i < spans.length; ++i) {
            let span = spans[i]
            if (span.className.includes("__markdown_span")) {
                continue;
            }
            if (span.getAttribute("role") === "img") {
                continue;
            }
            if (span.getAttribute("data-skip-node") == "true") {
                continue;
            }
            //console.log(span)
            //console.log(marked.parse(span.textContent))
            //暴力parse
            span.innerHTML = marked.parse(span.textContent)

            //标记为已处理
            span.classList.add("__markdown_span")
            //等待二次处理
            markdownSpans.push(span)
        }

        for (let i = 0; i < markdownSpans.length; ++i) {
            let span = markdownSpans[i]

            //处理markdown中的全部代码块
            span.querySelectorAll('pre code').forEach((el) => {
                //高亮
                hljs.highlightElement(el);
                //去掉背景
                el.style.background = 'none';
            });

            //p转为pre, <pre>可以显示全部的空格/换行
            var pElements = span.getElementsByTagName('p');
            //锁一下瀑布流list
            var pElementsArray = Array.prototype.slice.call(pElements);
            pElementsArray.forEach(function (p) {
                var pre = document.createElement('pre');
                pre.innerHTML = p.innerHTML;
                p.parentNode.replaceChild(pre, p);
            });

            //同时将处理后的span内的所有span标记为已处理
            let inner = span.getElementsByTagName("span");
            for (let j = 0; j < inner.length; ++j) {
                let inner_span = inner[j];
                inner_span.classList.add("__markdown_span")
            }
        }
    }

    //核心TICK
    let interval = setInterval(function () {
        //等待js异步加载
        if (!mathjax || !markdown || !highlight || !linenumber) {
            return
        }
        clearInterval(interval)
        //每333ms扫一次
        setInterval(function () {
            MathJax.typeset()//内部逻辑自动跳过已处理的
            let all_richtext = document.getElementsByClassName("lsf-htx-richtext")
            for (let i = 0; i < all_richtext.length; ++i) {
                let richtext = all_richtext[i];
                processRichtext(richtext)
            }
            let all_paragrpahs = document.getElementsByClassName("lsf-paragraphs")
            for (let i = 0; i < all_paragrpahs.length; ++i) {
                let paragraphs = all_paragrpahs[i];
                processSpansUnder(paragraphs)
            }
            let all_text_areas = document.getElementsByClassName("lsf-text-area")
            for (let i = 0; i < all_text_areas.length; ++i) {
                let text_area = all_text_areas[i];
                processSpansUnder(text_area)
            }
        }, 333)
    }, 100)

    function loadMarked() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
        script.onload = function () {
            markdown = true
            console.log("Loaded Markdown compiler/parse jsdelivr")
        }
    }

    function loadMathJax() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        document.head.appendChild(script);

        //inline math displayer
        MathJax = {
            tex: {
                inlineMath: [['$', '$']]//匹配并且更新inline的'$xxx$'
            },
            svg: {
                fontCache: 'global'
            }
        };

        script.onload = function () {
            mathjax = true
            console.log("Loaded Latex formatter from jsdelivr")
        }
    }

    function loadHighlightJs() {
        // Load the CSS stylesheet
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css';
        document.head.appendChild(link);

        // Load the JavaScript library
        let script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        document.body.appendChild(script);

        // Optional: Callback when the script is loaded
        script.onload = function () {
            // Initialize Highlight.js
            highlight = true;
            linenumber = true;
            console.log("Loaded code highlighter from cloudflare")
            /*

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js';

            // Optional: Add a callback for when the script loads
            script.onload = function () {
                linenumber = true;
            };
            document.head.appendChild(script);
            */

        };
    }


    // 异步加载包
    loadHighlightJs();
    loadMathJax();
    loadMarked()
})();
