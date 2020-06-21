---
title: Important security concepts every developer should know
date: "2020-06-22T22:12:03.284Z"
description: "Discuss all common aspects of website security to help you avoid common security flaws of the web"
keywords: "browser, javascript, security"
featured: "./network-package.png"
---
***

The result of increasing popularity of Javascript and frontend frameworks like Reactjs, Angular, or Vue.. is more and more application logic is shifted into user browsers. As a consequence, personal data is exposed to greater risks of being exploited by attackers nowadays. For web developers, it's important to understand all the security fundamentals to protect web application. In this article, I will analyze common security risks and the approaches to prevent them. 

### 1.Overview

![Network package](./network-package.png)
*<center>Figure 1: Network packages</center>*

As we see in *Figure 1* networks packages are transferred from servers to clients in order to display content on browsers. Security involves all parts of that process, from clients to servers. Let's look the security risks of each part and how to mitigate them. 

### 2. Secured network

On the internet, before one package could reach its destination, it may go through several hubs and switches. The package could be intercepted, and viewed by attackers (man in middle attack). One popular approach to prevent it is encrypting packages that are sent on network.

**HTTPS (hypertext transfer protocol secure)**

HTTPS is a secure version of HTTP. It uses TLS (transport layer security) to encrypt messages inside HTTP requests before sending it on network. Prior to encryption process, servers have to obtain SSL (secure socket layer) certificate first. The SSL certificate consists of public key, private key and all related information of websites. To initialize HTTPS communication, client needs to complete a TLS handshake to obtain session keys as following diagram:

![TLS](./TLS-handshake.png)
*<center>Figure 2: TLS handshake</center>*

TLS handshake occurs after a TCP (transmission control protocol) connection has been open. The end result of the handshake is session keys.

**HSTS (Strict Transport Security)**

HTTPS helps secure connections from client and servers, and to enforce HTTPS for every users that want to access your site, you can use HSTS. Essentially, HSTS
is a server header that force browsers to use HTTPS if they are trying to connect via HTTP. For example, assume we want to go to `amazon.com` with normal HTTP by input url `www.amazon.com`, you can see request, and response as follow:

```json
// request
Request URL: https://www.amazon.com/
Request Method: GET
Status Code: 200 
...

// response
...
strict-transport-security: max-age=47474747; includeSubDomains; preload
```
We can see that even though the url requested is normal HTTP, browser can recognize the domain has `strict-transport-security` header from HSTS, thus it converts request to HTTPS.

HTTPS and HSTS secure connections between clients and servers. Let's look into clientside to see what are potential security risks there.

### 3. Common attacks

Browser is a very flexible application, it can display many types of contents, e.g, html, xml, images, pdf... or execute Javascript (JS) code. And JS code can create and insert dynamic content for browsers. This great flexibility also impose a great risk of attackers injecting malicious scripts to steal users information. In addition, when web application has input forms for user to post data, attackers could use the forms to post script to servers and try to take control on server side as well (e.g. SQL injection). 

The defense mechanism for servers is to encode all the posted data, to ensure that no special characters that can potentially create running scripts on server side. Also other methods such as  firewalls, proxies, strict authentication... can help enhance security on server sides, and prevent them being compromised by attackers. On clientside, the first defense which was quite popular in the past is to disable JS script all together for browsers. However, the advance of clientside frameworks, and Ajax programming make website depends heavily on JS code nowadays. Thus disabling JS code is not a viable option. Before exploring more common protection mechanism on clientside, let's examine at some common attacks:

**XSS (Cross site scripting) attack:** This is the most common types of attacks on browsers. In XSS, attackers try to steal users identity data like cookies, session token..., by injecting some scripts on browsers. Depends on each website, they may have different ways to inject code. Assume that we have a website in which user can access with url like

```js
//user go to http://www.mysite.com?productName=computer

//then later in html
<html>
<script>
    const url = new URL(window.location.href);
    let node = document.createElement('h1');
    node.innerHTML = `showing ${url.searchParams.get('productName')} product`
    document.body.appendChild(node);
</script>
</html>
```
The flaw in this case is that the page display whatever value from the url params on browsers, thus attackers can inject code like `productName=<script>sendCookiesToEvilSite()</script>` for the url. Then attackers will try to trick users to open the link by some email phishing methods. Anyone opens that link in their browsers will inadvertently send their cookies to the evil site.

The same flaw can exist on website that displays dynamic contents from users (e.g. comments, profile pictures,...etc), if websites do not escape the special characters from url or before rendering contents, they have greater risks of being exploited.

**CSRF (Cross site request forgery)**: is an attack that often involves deceiving users to land to some malicious sites. On those sites, it triggers some kinds of hidden HTTP requests or form post or hidden iframe (ClickJacking), to take advantage of users cookies and execute harmful actions. A concrete example like, someone sends you an emails saying there's a 80% discount on their site `www.evilsite.com`, after you land to the site, the page could contain
```html
<html>
 <img src="wwww.yourbank.com/transfer?to='evilsite'">
</html>
```
Because normally when interacting with `www.yourbank.com`, the website can store some cookies for you on your browser, so when sending HTTP request to get the image, browsers always include all of the cookies from `yourbank` site. Another form of attack in this type can be a hidden form post

```html
<html>
 <div style="display: none">
    <form action="www.yourbank.com/password/update" method="post">
      <input name="newpassword" value="123">
      <input type="submit">
    <form>
 <div>
</html>
```
Of course these are just hypothetical examples, but the idea can be applied with more complicated forms. In case the sites like `www.yourbank.com` does not employ security protection methods for these types of attacks, they are vulnerable to CSRF.

These attacks replies mainly on your browsers cookies, let's examine how cookies is used in browsers.


### 4. Cookies and resource loading
- **Cookies**

LocalStorage, IndexDB or cookies can be used to stored users data in web applications. For localStorage and IndexDB, browsers can access data for a site  only when in same origin. Unfortunately for cookies, it works a little bit differently, every time browsers make HTTP requests, it will include all the cookies of that site, it doesn't consider the same origin or not. For example, when you land to `www.evilsite.com`, the Javascript in this site cannot access to localStorage or IndexDB in your browser for `www.yourbank.com`. However, in html of `evilsite` if it has tags like `img`, `link` or `script` with the url to `www.yourbank.com`, for example:

```js
// browser loads www.evilsite.com

<html>
  <img src="www.yourbank.com/image.png"/>
</html>

//requests to www.yourbank.com will contains all cookies of www.yourbank.com
```
 
when browser sends HTTP requests, it will include all cookies of `www.yourbank.com`. There are some security practices in place to mitigate cookie sharing and usage, we will explore them in last part of this article


- **Resource loading**

When rendering content of website, browsers can load resources (images, scripts, iframe...etc) from multiple domains. In case one of those resources get compromised by attackers, they can inject script to steal your users private data. Fortunately, all browsers implement the same origin policy for resource loading and sharing to help prevent the security flaw. Origins are considered `same` if they have same protocol (e.g HTTP or HTTPS), port and host. For example
```js
//same origin
http://www.mysite.com/about
http://www.mysite.com/home

//different origin
http://www.mysite.com
https://www.mysite.com

//different origin
https://www.mysite.com:80
https://www.mysite.com:8080
```
In general, browsers block all cross origin HTTP requests unless servers have CORS (cross origin resource sharing) configured. When servers have CORS support, resource loading permission on browsers can be specified as following table.

| Type      | Permission
| :---        |    :----:   
| iframes     | sites can load cross origin iframes, but different origin iframes cannot read other resources (e.g Javascript cannot access to document in cross origin iframes)      
| CSS   | sites can load CSS from cross origin with `Content-Type` header
| form  | sites can embedded forms that have `action` url to other origins.
| images| sites can load images from cross origin, except reading cross-origin images to canvas using Javascript is blocked.
| multimedia | sites can load `Video` and `audio` from cross origin.
| script | sites can load cross origin scripts.    

When browsers make CORS requests, by default the requests are anonymous which means they will not include any cookies of the site. In case you want to send cookies for CORS, you can use `credentials` requests. For example:

```js
// browser loads www.domain1.com

<html>
  <img src="www.domain2.com/image.png"/>
</html>

//requests to domain2 will contains all cookies of domain2
//but not include cookies of domain1 by default.
```

To increase security of websites, there are some methods to limit the types of resources can be loaded or give some special permissions for specified resources. Let's look into those in the next section.

### 5. Common methods to increase security
We have examined the way browser rendering content, loading resources and sharing cookies. There are many security risks in each of those aspects, some common methods to mitigate them as following: 

- **Cookie attribute: secure, HTTP only, domain, samesite**

Default permission of cookie is open for read and write, by server side (through HTTP headers) or client side (through Javascript code). That makes cookie is not secure to store authentication data like sessionId, or login token. `secure` and `HttpOnly` can help restrict access to specific cookie value. `secure` flag indicate that cookie is sent only with HTTPS, and `HttpOnly` flag only allows servers to read and modify the value for the cookie value. Javascript code cannot read cookie with `HttpOnly` flag.

In case your website has multiple sub domains, e.g. `www.mysite.com` and `www.store.mysite.com`, you can configure `domain` for cookie to `mysite.com` so that cookie can be shared for these sites. `Samesite` is an attribute that restrict cookie in CORS requests, cookie with `strict` value for `Samesite` attribute will not be sent with CORS, which also help to reduce the risk of CSRF attack

- **CSRF prevention**

A common approach to prevent CSRF attack is when generating form submit, servers create a hidden token, and include it inside form. The token should be unique and unpredictable per user per session. For example:

```html
<form action="/transfer" method="post">
<input type="hidden" name="CSRFToken" value="OWY4NmQwODE4ODRjN2Q2NTlhMmZlYWEwYzU1YWQwMTVhM2JmNGYxYjJiMGI4MjJjZDE1ZDZMGYwMGEwOA==">
...
</form>
```
Websites should also have `Samesite` restriction to make sure cookies are not shared cross origin, to ensure CSRF prevention can work properly.

- **CSP (Content security policy)**

Loading resources is the major part of rendering websites, there're a lot of vulnerabilities in case one of those resources is compromised and attacker can inject some malicious content (JS files) or scripts into the page. CSP is a modern way to whitelist resources that can be loaded on website. CSP whitelists for all kinds of resources: scripts, images, plugins, iframe, fonts, styles... An example of CPS header as following:

```js
// Disable unsafe inline/eval, only allow loading 
// of resources (images, fonts, scripts, etc.) over https
Content-Security-Policy: default-src https:
```
Major XSS incidents happens because attackers can inject scripts on HTML page, CSP offers way to disable inline code all together. For example:

```js
<script>
  function stealYourCookie() {
    ...
  }
</script>
<img onload='stealYourCookie();' src='...'/>
```
The code above will not execute with CSP configured. Similarly for `eval`, in Javascript `eval` is a function to turn normal string into JS functions. Disabling them helps reduce the risks of scripts being injected into website.

- **CORS (Cross-origin Resource Sharing)**

While CPS is the HTTP header that servers use to let browsers know which and where resources should be loaded when rendering website, CORS is a header that servers use to allow which `origin` can load resources from them. For example, if your servers only serve public resources and no security concern for any site using those resources you can have the configuration

```js
// Allow any site to read the contents of this JavaScript library, 
// so that sub resource integrity works
Access-Control-Allow-Origin: *
```
When browsers initializes CORS request and see `Access-Control-Allow-Origin: *` header in responses, they will allow loading those resources. In case your servers only have private content that should not be loaded by different origin. You can have the header configured like: 

```js
// Allow https://www.mysite.com to read the returned results of this API
Access-Control-Allow-Origin: https://www.mysite.com 
```

In addition to `Access-Control-Allow-Origin` header, `referrer-policy` header can also be used to restrict sharing referrer URL when browser sending HTTP request for different domain. Suppose that you are in `https://www.mysite.com?bookingToken=abc` and it contains `<img src="https://anothersite.com/image.png" />`, the HTTP requests will be like following:
```js
GET /image.png HTTP/1.1
Host: anothersite.com
Referer: https://www.mysite.com?bookingToken=abc
```
For some url params that are intended only for internal application usage, it is unnecessary to disclose them in CORS requests.

- **Using iframe for secured contents**

Default permission of iframe as we discussed above is that it cannot read other resources from cross origin (including JS access to DOM). In case your site load multiple scripts from many ads providers, you can ensure the content security for form post (e.g payment information, credit card information ) by placing them under iframe. This makes sure scripts from other domains cannot access information of the secured forms. 

- **HTML escape**

As we see most of XSS attacks rely on injecting scripts on browsers or injecting malicious content into HTML page. Best practice to render HTML page is escaping any special characters e.g `<`, `>`... before rendering content. Modern clientside frameworks like React or Angular has the build in support for that. They escape all special characters for html content automatically.

### 6. Summary

Web security requires many layers of configurations in order to protect against XSS or CSRF attack. You may have different configurations that needed for different applications, even with same application, different page can also have varied configuration, depends on which kind of data you want to keep private only for your site. The most basic security form is using HTTPS for all content, to ensure data is encrypted over the network. CSP and CORS are essential to websites and this article can only give a general picture on common approaches to increase security of your sites, make sure you follows the further readings in the references to learn about them in details to configure your site correctly.

### 7. References
[Figure 2: TLS handshake](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)

[HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

[ClickJacking](https://owasp.org/www-community/attacks/Clickjacking#:~:text=Clickjacking%2C%20also%20known%20as%20a,on%20the%20top%20level%20page.)

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[Same origin policy](https://web.dev/same-origin-policy)

[Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

[Cross site request forgery prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

[Content security policy](https://www.html5rocks.com/en/tutorials/security/content-security-policy)

[Web security guidelines](https://infosec.mozilla.org/guidelines/web_security)