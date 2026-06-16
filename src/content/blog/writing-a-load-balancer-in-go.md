---
tag: TECH
date: 2026-03-14
blurb: Round-robin is the easy part. Health checks, draining, and the parts nobody blogs about.
---

# Writing a load balancer in Go

I wanted to understand what actually sits between a browser and the three replicas
pretending to be one server. So I built a small layer-7 load balancer in Go -- and
learned that the diagram version of this project is about five percent of the work.

## Round-robin is the easy part

The textbook version is a counter and a modulo. The real version has to answer an
uncomfortable question: what happens when the backend you picked is dead? You don't get
to return an error to the user just because your bookkeeping was tidy.

```go
// pick the next healthy backend, skip the dead ones
func (p *Pool) Next() *Backend {
    n := len(p.backends)
    for i := 0; i < n; i++ {
        idx := atomic.AddUint64(&p.cursor, 1)
        if b := p.backends[idx%uint64(n)]; b.Alive() {
            return b
        }
    }
    return nil // everything is down -- fail loudly
}
```

An atomic counter, a loop, and one hard rule: never hand back a backend you already
suspect. Everything interesting lives in how `Alive()` gets decided -- and how often
you're willing to re-decide it.

> The happy path took an afternoon. The other paths took the month.

## Draining, or saying goodbye politely

Killing a backend with in-flight requests is rude. Draining means you stop sending it
new work, let it finish what it holds, and only then take it out back. The counting is
trivial -- the hard part is deciding how long "politely" lasts before it becomes
"naively".

Would I run this in production? Absolutely not. Did it permanently change how I read
nginx configs? Completely. That trade is the whole point of building toy infrastructure.
