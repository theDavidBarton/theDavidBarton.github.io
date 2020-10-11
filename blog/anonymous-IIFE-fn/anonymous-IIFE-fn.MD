# Anonymous IIFE-s and semicolons

IIFE (immediately invoked function expression) is an elegant way to execute what should be executed anyway in our JavaScript code. If it is also an anonymous function then it is almost sure that the returned value is not used later on. When it comes to semicolon-less JavaScript styles it gets tricky (and ugly). Let's see how we can handle it if we want to gain from the advantages of both approaches.

[Semicolons in JavaScript are optional](https://web.archive.org/web/20200731235507/https://mislav.net/2010/05/semicolons/), after all these years it can be still a subject of arguments, but many of us embraced this style, and come on: even prettier or ESlint can fix it for a giga-codebase for you if you don't like it 😜.

I always liked the syntax and the elegance of IIFE, but I have never used it in my code as I omit semicolons, which causes [**Automatic Semicolon Insertion (ASI)**](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-automatic-semicolon-insertion) problems on the fly. I just learned how to make the two work together nicely.

## The problem with IIFE and semicolon-less JS

The following script is invalid like this:

(_Note:_ just realized that it is hard to write invalid code examples in the age of linters and prettiers 😅. I've solved it in the end. 👍)

<!-- prettier-ignore-start -->
```javascript
const text = 'hello, world!'
(() => {
    console.log(text)
  })()
```
<!-- prettier-ignore-end -->

**And throws the error:**

```markdown
Uncaught TypeError: "hello, world!" is not a function at <anonymous>:2:1
```

It is due to the fact that ASI has some rules which we need to take care all the time when it comes to semicolon-less style, in the current case: **we cannot start a new line with an opened parenthesis if we have any javascript statements before.**

The [only cases](https://github.com/hax/semicolon-less.js/) when we indeed need the semicolons:

- `;-` : line starts with unary - operator
- `;+` : line starts with unary + opeartor
- `;/regex/` : line starts with regexp literal
- `;[array]` : line starts with array initializer
- `;(group)` : line starts with grouping operator

Linters usually would fix it like this, by adding a semicolon just before the parenthesis:

```javascript
const text = 'hello, world!'
;(() => {
  console.log(text)
})()
```

**Console output:**

```markdown
hello, world!
undefined
```

(We will talk about the `undefined` value later.)

It is something turns me totally against semicolon-less coding. `;(` The sad, winking smiley is not the nicest thing ever. Especially as it logically belongs to `const text = 'hello, world!';` and not to the IIFE.

So I mostly used named functions and invoked them immediately after the declaration (pretty pre-ES6 style) until this day. Of course it means I needed to use **named functions** all the time as function statements require a function name.
With the same example:

```javascript
const text = 'hello, world!'
function foo() {
  console.log(text)
}
foo()
```

or:

```javascript
const text = 'hello, world!'
const foo = () => {
  console.log(text)
}
foo()
```

**Console output:**

```markdown
hello, world!
undefined
```

The function is now a [function expression](https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function#Named_function_expression).

A small sacrifice to keep semicolon-less stlye.

### `undefined`

**For statements without return value we will see `undefined` on the console (e.g. running the script in DevTools), as in JavaScript every function returns something, at least an undefined value, even if it won't be used enywhere else: _anonymous IIFE-s_ are good examples for such functions.**

## The `!` comes to the rescue

I've seen lately a type of IIFE when it almost looks the same as the regular one, but starting with an exclamation mark. I gave a try. And it worked as it should:

```javascript
!(() => {
  console.log(text)
})()
```

**Console output:**

```markdown
hello, world!
true
```

**But wait! What happens with our `undefined` fellow, why does it turns `true`? And why does this work as an IIFE?**

### Function statements vs. function expressions

When we declare an anonymous function it is a **function statement** by default, which cannot be invoked immediately, without having an error:

```javascript
function () {
  console.log(text)
}()
```

```markdown
Function statements require a function name
```

With the `!` we can turn the falsy `undefined` (the IIFE would return as seen above) to true, the function statement becomes a **function expression** as well

```javascript
!(function () {
  console.log(text)
})()
```

```markdown
hello, world!
true
```

And this can be refactored to ES6 arrow as seen two snippets above. It has the limitation of that the returned value is negated, but it is very rare that I would want to return anything form an anonymous IIFE.

I know by now it is removed from the airbnb style guide since a long while (I suppose since ES6), but they recommended its usage for modules for some years: https://github.com/airbnb/javascript/issues/44#issuecomment-13063933. From now on I plan to use it in some of my JS projects. The reason not to use this approach all the time: even if it is valid usage of JS, it can (and will) confuse others who look into code that contains such rarities. Anyway, it was a cool thing to learn.
