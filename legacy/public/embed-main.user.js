// ==UserScript==
// @name       Torus
// @namespace  http://tor.us
// @version    0.2
// @description  dough or donut there is no rye
// @include *
// @copyright  None
// @run-at document-start
// ==/UserScript==
// if ((new URL(window.location.href).searchParams.get('torus')) == 1) {

var whitelist = [
  "etheremon.com",
  "opensea.io",
  "cryptostrikers.com",
  "axieinfinity.com",
  "mlbcryptobaseball.com",
  "mycryptoheroes.net",
  "blockchaincuties.com",
  "cryptokitties.co",
]

var inWhiteList = false
whitelist.map(function(url) {
  if (window.location.hostname.indexOf(url) !== -1) {
    inWhiteList = true
  }
})
if (inWhiteList) {
  var sc = document.createElement("script");
  sc.setAttribute("src", "https://tor.us/embed-main.min.js");
  sc.setAttribute("type", "text/javascript");
  console.log(document.getElementsByTagName("html")[0])
  document.getElementsByTagName("html")[0].appendChild(sc);
}
// console.log(document)
// document.insertBefore(document, sc);