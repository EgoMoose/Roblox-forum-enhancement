var elemt = document.getElementById("ctl00_cphRoblox_PostView1_ctl00_PostList");
elemt.innerHTML = elemt.innerHTML.split("<br>").join("\n");

renderCodeInElement(elemt);
renderMathInElement(elemt, {
	delimiters: [
		{left: "$$", right: "$$", display: false},
		{left: "\\(", right: "\\)", display: false},
		{left: "\\[", right: "\\]", display: true}
	]
});