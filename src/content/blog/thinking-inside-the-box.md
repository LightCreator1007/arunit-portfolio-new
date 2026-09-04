---
tag: TECH
date: 2026-09-05
blurb: The tools your AI runs have every permission you do. I tried to lock them in a box that starts with nothing and gets handed abilities one at a time. Here is what worked, what did not, and the simpler idea I probably should have had first.
---

# Thinking Inside The Box

Looking back on the past few years, we use AI in almost every aspect of our lives, right from writing mails and summarising texts to making full blown projects and maintaining knowledge bases. A lot of these functionalities come from tools that AI can use. Small programs which read your files, fetch a page, and so on.

When it does that, it does it as you. Here is the dealbreaker: it can read all the sensitive information you can, like SSH keys.

So what do we do?

We think inside the box. Give nothing to the box, and give it what it needs only if it actually needs it. And the whole thing should be plug and play, along with being backwards compatible without rewriting anything.

## Why bother at all?

These tools come from public registries, the same way npm packages do. You download one and it now runs with the same permissions as you. It is as dangerous as any npm package that has not been audited or trusted.

During 2026: a remote code execution flaw in the official tool-building kits themselves, around 150 million downloads of exposure. A trojanised tool for the Oura smart ring, published by five fake accounts, quietly taking SSH keys and crypto wallets. And 492 tool servers found on the open internet with no password.

Microsoft already has a project in this direction, but their own docs say the existing tools would need to be rewritten for it, and that they are exploring ways to port the existing MCP servers. Probably the biggest player in this space agrees that this is a major gap and that there are blockers in their own adoption. I just wanted to look if it could be automated.

## Glossary: before you move further

The tools I mentioned before are **MCP servers**. An MCP server is essentially an ordinary program that reads lines of JSON from its input and writes lines of JSON back out. Those two pipes are **stdin** and **stdout**, and using them this way is called the **stdio transport**.

The box we talked about is **WebAssembly**. We can compile code into a `.wasm` file, and anything with a WebAssembly runtime can run it. The best part about it is that it starts with no abilities at all. It cannot open files. The very instructions that would allow it do not exist inside it. Whatever runs it passes abilities back in one at a time, which is the opposite of a normal program where the default is everything you own.

One more name worth knowing, because it causes most of the pain later. The JavaScript inside the box does not run on Node, or on the engine your browser uses. It runs on **StarlingMonkey**, a build of Firefox's engine cut down to fit inside a WebAssembly component. It is real JavaScript, just with pieces missing, and the missing pieces are missing from the language itself rather than from Node.

## Why is it kinda hard

**1. Wrapping it is impossible.** You would think we could just use one box and the tool would start inside it as a normal program. This is impossible, as WASM's system interface has no way to start a program at all. This is not an oversight, since it is kind of the whole point of the box.

**2. Pointing a compiler at a package is not possible.** Compilers want an entry file exporting specific functions, not a package name. And every MCP server's entry file ends by connecting to stdin and stdout, the exact thing that cannot exist in there.

> The file you must compile is the file you must delete.

**3. The dependencies have to survive too.** Anything that starts other programs, ships compiled machine code, or opens raw sockets is never getting in.

Broadly, an MCP server is just three things: the transport, some generic plumbing, and the tool logic. Only the third is unique per MCP. So to port the program, we take out the transport and work with the rest.

## What others do

A lot of other very useful tools like mcp.run, hyper-mcp, WASImancer, Sandbox MCP, Wassette and wasmcp already exist. But every one of them needs new code written for their system, or a machine-readable API description. Existing packages cannot work out of the box.

I targeted wasmcp, as its closest rival works out a tool's arguments from the component's type signature, which would mean translating JSON Schema lossily into a poorer type system. wasmcp passes that description through as an opaque string, so nothing translates it and nothing can mistranslate it.

## The initial failure and the workaround

As I mentioned before, we need to import the package, grab the server object it will export, and run it directly. But what if the package does not export one? This happened to me with the very first MCP server I tested, which arguably is the best behaved one:

```json
{ "main": null, "exports": null,
  "bin": { "mcp-server-sequential-thinking": "dist/index.js" } }
```

It exports nothing. It is a command line program and nothing else. If that were the only route, the easiest possible case already needs hand patching and the whole thing is hopeless.

But what if we look at something a little below the package's public interface? We would find the **bundler**, which follows every import and stitches everything into one file. And thankfully bundlers can alias: whenever anyone imports X, hand them Y instead.

So rather than asking the package for its server, I replaced the module it imports. Anything asking for the stdio transport now gets six lines:

```js
export class StdioServerTransport {
  async start() { globalThis.__serverTransport = this; }
  async send(msg) {
    const waiter = globalThis.__pending?.get(msg.id);
    if (waiter) { globalThis.__pending.delete(msg.id); waiter(msg); }
  }
  async close() {}
}
```

Same name, same shape, not a transport. It is a mailbox that hands messages to me.

The server's own startup code runs untouched. It builds itself, registers its tools, connects to what it is certain is a terminal, and cheerfully prints "running on stdio".

That import path is the standard one from the official SDK, which nearly every JavaScript MCP server on earth uses.

> One substitution, applied blindly, works across the ecosystem.

## Building it

The first server would be ported manually by hand. The goal here was to gather knowledge before committing to the automated engine. This surfaced a lot of things very early on, like the fake transport and a five line stub standing in for Node's `process`, to name a couple.

So now the pipeline was: install the real server, bundle it into one file while swapping out the transport, patch one regular expression StarlingMonkey refuses to parse, compile that into a component, and wrap it so a runtime can serve it. Then the recipe became a Rust tool where no step ever reads or rewrites the tool's own logic, and which also writes out a runnable script carrying the exact permissions that tool turned out to need, derived from its own code.

## The sad part

* StarlingMonkey is built without the Unicode library, so it has no `Intl` and anything doing timezones dies. It also has no `String.prototype.normalize`, which broke every file write.
* It also rejects certain Unicode regex patterns while parsing, so one unreachable line in one library kills the build. Fixing that with find-and-replace would have silently corrupted six lookalike strings that are not regexes.
* The compiler runs your program during the build and snapshots it. Great for startup speed, fatal if your program reads a file at startup, since nothing has been granted yet.
* My scanner matched only half the ways you can write an import, so a server using three built-in modules scanned as perfectly clean.
* It also had no timeout, so one server waiting for an API key hung an unattended run forever.
* Best one: I removed a permission to prove it mattered, re-ran, and the server still worked. It had never restarted. I was measuring the previous run.

Most of the bugs were from the tools I used rather than from this idea itself, which goes to show how young this ecosystem currently is.

## The numbers talk

I scanned a total of 98 packages. Initially the answer was that 39% were portable. But it was wrong.

I caught it by porting a package the scanner had called clean, which promptly failed to build with eighteen errors, two of them naming things my scanner had never looked for. It knew about eight problem modules and believed all eight were easy. The list went to 46. Final answer: 22%. A scanner would only be trustworthy where its findings have been checked against a real build, and mine never had been.

That got me wondering what blocked even means. My scanner calls a server blocked when its dependencies mention something I cannot provide, never that the server actually reaches it. So I removed the excuse: every unsupported module got swapped for a stub that throws loudly when called, and I fed in thirteen blocked servers.

Zero worked. But not one was stopped by an impossible module. Nothing hit sockets, threads or process spawning, the exact things the verdict is built out of. They died on ordinary Node compatibility, on things nobody has gotten around to writing yet.

> So the headline number is not measuring what WebAssembly can express. It is measuring how complete my Node emulation is.

## The quite literal hole

Files are genuinely locked down. The only folders that exist are the ones handed over, everything else fails loudly, and `/data/../etc/passwd` is refused by the sandbox itself rather than by any check I wrote.

The network is not really as locked down. My runtime needs network support for its own incoming requests, and the same switch grants outgoing access. You cannot have one without the other. I confirmed it by running a page-fetching tool with no network permission at all. And to my surprise (at least on retrospection) it fetched the page.

Microsoft's runtime does this properly, deny by default, one named host at a time. It also refuses to load my components. So files are sandboxed on the runtime that cannot restrict the network, and the network is sandboxed on the runtime that will not load my files. Neither delivers the actual claim.

## An invasive thought

Well, sometimes we really gotta think inside the box. Sometimes what you need is hidden in the most obvious spot, the one which, for the love of god, you would think you were too smart to have put it in. Anyway, what if the box was not WASM at all?

Run each tool as a normal process inside its own Linux namespace, the way bubblewrap or rootless Podman do.

For the goal as stated, that is probably just the better answer. A namespaced process is a process, so it has stdin and stdout and the server runs unmodified, which retires my transport trick and every shim in one go. Tools that launch other programs work fine, because they launch inside the box. A fresh network namespace has no interfaces at all, which is the deny-by-default my runtime cannot express.

But honestly, in a container the process can still attempt any system call, while in WebAssembly the call is not there to make. I just could not really use that to my advantage.

> Containers are the better product. The WebAssembly work is the better report.

## Did it work?

It did and it did not. The thing works, four servers run end to end inside the box completely unmodified. But it is not something anyone would install, for two reasons, and neither of them is something more effort from me was going to fix.

**1. Sandboxing is most valuable where it is currently impossible.** The permanently blocked set is browser automation, scraping, anything that shells out to a command line tool, which is exactly what people point AI at. The portable set is pure calculation and thin API wrappers.

**2. Half of what I was promising is not true today.** Files are sandboxed on the runtime that cannot restrict the network, and the network is sandboxed on the runtime that will not load my files. A box that holds files but not traffic, for the minority of tools that barely touch either, is not a box anyone needs.

A few things were still worth having though. The number itself, since I went looking for it and could not find it anywhere. The finding that blocked mostly means the shim has not been written yet. And the pipeline of reading a tool's code, working out the smallest set of permissions it needs, generating exactly that, then proving it is minimal by removing one permission and watching the tool break.

## What now?

Welp, this was honestly a fun project, and every finding that I mentioned came from real runs and not just from reading code.

When I realised this is not going to work out the way I intended it to, I for a moment felt like Howard Stark's dialogue in Iron Man 2, where he tells Tony that he is limited by the technology of his time (it is just something I felt LOL, probably not true). Although it was probably worth finding workarounds for, and possible to make it work, I ran out of ideas and so did Claude (LMAO).

I learnt a great deal about WASM and MCP as a beginner, and had many key takeaways for future projects. So the answer to what now would be to learn and move on, and come back if things change, like all things in life.
