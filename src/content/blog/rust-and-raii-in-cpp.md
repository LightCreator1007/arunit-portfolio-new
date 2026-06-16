---
tag: TECH
date: 2026-06-16
blurb: C++ made cleanup a constructor's job. Rust made it the compiler's job -- and deleted whole bug classes on the way.
---

# RAII, and how Rust industrialized it

Resource Acquisition Is Initialization (RAII) is one of C++'s paradigms. It's the
backbone of modern C++, and eventually became the entire identity of Rust's memory model.

Let's walk through *why* RAII was introduced, the chaos that existed before it, *how*
memory in C++ works to create that chaos, and how both C++ and Rust solved the problem
in their own ways.

## Before RAII: manual memory management

Back in the day, developers had to be very careful about when they allocated, referenced,
and freed memory -- and especially how many times they freed it.

The classic disaster:

```cpp
void bad() {
    int* arr = (int*)malloc(5 * sizeof(int));

    // ... use arr ...

    if (somethingHappened) return; // uh-oh

    free(arr); // never reached
}
```

This leads to:

* memory leaks
* double frees
* freed-but-still-used (use after free)
* resource leaks (files, sockets, mutexes)

These look like basic problems you could just fix, but they've caused even seasoned
developers a lot of pain over the years.

## How memory works in C++ (and why it causes problems)

In C++:

* **Automatic (stack) memory** is allocated when variables are declared and freed
  automatically when they go out of scope.
* **Dynamic (heap) memory** is allocated manually using `new`, `new[]`, or `malloc`.
* The compiler has no idea when the programmer intends to free heap memory.

So:

* Forget to `delete` -- leak.
* Delete twice -- crash.
* Delete too early -- a ride through debugging hell.

C++ needed a way to tie **lifetime to scope**, not to programmer memory.

## RAII: the sane way to manage resources

RAII says:

> A resource should be acquired in a constructor and automatically released in the destructor.

Meaning: *when an object dies, its resources die with it.*

Without RAII:

```cpp
FILE* f = fopen("data.txt", "r");
if (!f) return;

// lots of logic

fclose(f); // we may never reach here
```

With RAII:

```cpp
class File {
public:
    File(const char* name) { file = fopen(name, "r"); }
    ~File() { if (file) fclose(file); }

    FILE* get() const { return file; }

private:
    FILE* file;
};

void read() {
    File f("data.txt");
    // do work
} // file auto-closes here
```

Even if exceptions or returns happen, the destructor **always** runs.

RAII solved memory safety, exception safety, safe cleanup paths, and simpler APIs. It's
what led to `std::vector`, `std::unique_ptr`, `std::lock_guard`, and `std::fstream` --
all RAII-powered.

## C++ smart pointers

```cpp
void foo() {
    std::unique_ptr<int> p = std::make_unique<int>(5);
    // no need to delete
} // p auto-frees here
```

`unique_ptr`, `shared_ptr`, and `weak_ptr` all ensure memory is freed at the right time.
RAII is the secret sauce behind almost all modern C++ libraries.

## Rust: expanding RAII into a language-level law

Rust did not merely adopt RAII as a best practice. It rebuilt the entire language around
the assumption that resource lifetimes must be tied to scope, and that the compiler --
not the programmer -- should enforce those rules. What is an idiom in C++ became the core
design philosophy in Rust.

### Ownership: the foundation

Every value in Rust has a single owner. When that owner goes out of scope, the resource
is released. This is similar to RAII destructors in C++, except Rust does it without
destructors in the traditional sense -- the compiler inserts the equivalent cleanup
automatically.

```rust
fn main() {
    let data = String::from("hello world");
    println!("{}", data);
} // data is automatically dropped here
```

This avoids the classic C++ pitfalls: forgetting to delete memory, losing track of who
owns what, or freeing memory too early.

### Move semantics as the default

Rust uses move semantics everywhere unless told otherwise. C++ has move semantics, but
they're opt-in and dependent on constructors and overloads. Rust normalized them.

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved into s2
    // println!("{}", s1); // error: s1 no longer valid
}
```

This forces you to think clearly about who owns the data at any given moment. In C++,
unclear ownership is one of the main causes of crashes and leaks.

### Borrowing and references

Rust's greatest innovation beyond RAII is its borrow checker. It enforces strict rules
about aliasing and mutation. There are two kinds of borrows:

* immutable borrows: multiple allowed
* mutable borrow: only one allowed

```rust
let mut val = String::from("data");
let r1 = &val;
let r2 = &val; // fine
// let r3 = &mut val; // error: cannot borrow mutably while immutably borrowed
println!("{} {}", r1, r2);
```

This eliminates data races at compile time. In C++, race conditions and dangling
references often appear at runtime and can be extremely difficult to debug.

### Lifetimes

Rust uses lifetimes to track how long references remain valid. Intimidating to newcomers,
but they're effectively static guarantees that a borrowed value will never outlive the
data it references.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

In C++ you can easily return references to destroyed objects if you're careless. Rust
makes those bugs impossible by design.

### Deterministic destruction without destructors

Rust drops values deterministically at the end of scope, but without C++-style
destructors running arbitrary code. Instead, it provides the `Drop` trait, called only
when an owned value is destroyed.

```rust
struct Resource;

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Resource released");
    }
}

fn main() {
    let r = Resource;
} // drop() called automatically
```

Philosophically this is the same as RAII, but Rust enforces the conditions under which
`Drop` is called through the ownership and borrowing system.

### No null, no double free, no use-after-free

Rust removes entire categories of memory bugs at the language level. By tying ownership
strictly to scope and forbidding aliasing that violates safety rules, it stops the bugs
before they exist.

> C++ offers RAII as a paradigm. Rust makes it necessary.

## Final thoughts

RAII began as a technique to make C++ resource management reliable. It tied lifetimes to
scope so cleanup became automatic rather than manual.

Rust adopted the same core idea and went far beyond it: scope-based cleanup became the
foundation of the entire memory model, enforced by the compiler instead of by convention.
As a result, Rust prevents entire classes of bugs before the program even compiles.

C++ invented RAII. Rust turned it into a complete system of guarantees that reshaped how
modern low-level programming is done.

If C++ invented RAII, Rust industrialized it. And both languages are better for it.
