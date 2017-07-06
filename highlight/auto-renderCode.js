const findEndOf = function(delimiter, text, startIndex) {
    let index = startIndex;
    let braceLevel = 0;

    const delimLength = delimiter.length;

    while (index < text.length) {
        const character = text[index];

        if (braceLevel <= 0 &&
            text.slice(index, index + delimLength) === delimiter) {
            return index;
        } else if (character === "\\") {
            index++;
        } else if (character === "{") {
            braceLevel++;
        } else if (character === "}") {
            braceLevel--;
        }

        index++;
    }

    return -1;
};

const splitAtDelimiters = function(startData, leftDelim, rightDelim, display) {
    const finalData = [];
	var lang = "";

    for (let i = 0; i < startData.length; i++) {
        if (startData[i].type === "text") {
            const text = startData[i].data;

            let lookingForLeft = true;
            let currIndex = 0;
            let nextIndex;

            nextIndex = text.indexOf(leftDelim);
            if (nextIndex !== -1) {
                currIndex = nextIndex;
				
				var words = text.slice(currIndex).split(/[ \n]+/);
				lang = words[0].slice(leftDelim.length);
				console.log(currIndex, lang, 1);
				
                finalData.push({
                    type: "text",
                    data: text.slice(0, currIndex),
                });
				
                lookingForLeft = false;
            }

            while (true) {
                if (lookingForLeft) {
                    nextIndex = text.indexOf(leftDelim, currIndex);
                    if (nextIndex === -1) {
                        break;
                    }
					
					var words = text.slice(nextIndex).split(/[ \n]+/);
					lang = words[0].slice(leftDelim.length);
					console.log(lang, 2);

                    finalData.push({
                        type: "text",
                        data: text.slice(currIndex, nextIndex),
                    });

                    currIndex = nextIndex;
                } else {
                    nextIndex = findEndOf(
                        rightDelim,
                        text,
                        currIndex + leftDelim.length + lang.length);
                    if (nextIndex === -1) {
                        break;
                    }
					
                    finalData.push({
                        type: "code",
                        data: text.slice(
                            currIndex + leftDelim.length + lang.length,
                            nextIndex).trim(),
                        rawData: text.slice(
                            currIndex,
                            nextIndex + rightDelim.length),
                        display: display,
						lang: lang,
                    });

                    currIndex = nextIndex + rightDelim.length;
                }

                lookingForLeft = !lookingForLeft;
            }

            finalData.push({
                type: "text",
                data: text.slice(currIndex),
            });
        } else {
            finalData.push(startData[i]);
        }
    }

    return finalData;
};

const splitWithDelimiters = function(text, delimiters) {
    let data = [{type: "text", data: text}];
    for (let i = 0; i < delimiters.length; i++) {
        const delimiter = delimiters[i];
        data = splitAtDelimiters(data, delimiter.left, delimiter.right, false);
    }
    return data;
};

const renderCodeInText = function(text, optionsCopy) {
    const data = splitWithDelimiters(text, optionsCopy.delimiters);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "text") {
            fragment.appendChild(document.createTextNode(data[i].data));
        } else {
            const span = document.createElement("span");
            const code = data[i].data;

            try {
				var html = hljs.highlight(data[i].lang , code, true).value;
				span.innerHTML = html;
            } catch (e) {
                console.error(
                    "Code auto-render: Failed to parse `" + data[i].data +
                    "` with ",
                    e
                );
                fragment.appendChild(document.createTextNode(data[i].rawData));
                continue;
            }
            fragment.appendChild(span);
        }
    }

    return fragment;
};

const renderElem = function(elem, optionsCopy) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        const childNode = elem.childNodes[i];
        if (childNode.nodeType === 3) {
            // Text node
            const frag = renderCodeInText(childNode.textContent, optionsCopy);
            i += frag.childNodes.length - 1;
            elem.replaceChild(frag, childNode);
        } else if (childNode.nodeType === 1) {
            // Element node
            const shouldRender = optionsCopy.ignoredTags.indexOf(
                childNode.nodeName.toLowerCase()) === -1;
            if (shouldRender) {
                renderElem(childNode, optionsCopy);
            }
        }
    }
};

const defaultAutoRenderOptions = {
    delimiters: [
        {left: "'''", right: "'''"},
		{left: "```", right: "```"},
    ],

    ignoredTags: [
        "script", "noscript", "style", "textarea", "code",
    ],
};

const renderCodeInElement = function(elem, options) {
    if (!elem) {
        throw new Error("No element provided to render");
    }

    const optionsCopy = Object.assign({}, defaultAutoRenderOptions, options);

    renderElem(elem, optionsCopy);
};