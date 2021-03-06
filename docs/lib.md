
Standard Library
================

The standard library is available to all sink scripts, and is native to sink itself for basic
execution.  These commands are available in all host environments, and always produce the same
results.

| Function          | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `say a, ...`      | Output arguments to stdout (returns nil)                                    |
| `warn a, ...`     | Output arguments to stderr (returns nil)                                    |
| `ask a, ...`      | Prompt the user for input from stdin; returns the inputted string           |
| `exit a, ...`     | Output arguments to stdout and terminate execution in success               |
| `abort a, ...`    | Output arguments to stderr and terminate execution in failure               |
| `isnum a`         | Returns true if `a` is a number; otherwise false                            |
| `isstr a`         | Returns true if `a` is a string; otherwise false                            |
| `islist a`        | Returns true if `a` is a list; otherwise false                              |
| `range [start,] stop[, step]` | Returns a list of numbers in the interval [`start`, `stop`)     |
| `order a, b`      | Compare `a` with `b` according to the sorting precedence (-1, 0, 1)         |
| `pick cond, a, b` | If `cond` is true, return `a`, otherwise return `b` (short-circuited)       |
| `embed 'file'`    | At compile-time, load the contents of `'file'` as a string                  |
| `stacktrace`      | Return a list of strings with stacktrace information (if available)         |

### Range Examples

```
range 5     # {0, 1, 2, 3, 4}
range -1    # {}
range 3.4   # {0, 1, 2, 3}

range 2, 5    # {2, 3, 4}
range -1, 5   # {-1, 0, 1, 2, 3, 4}
range 1.5, 3  # {1.5, 2.5}

range 0, 10, 3       # {0, 3, 6, 9}
range -1, -2, -0.25  # {-1, -1.25, -1.5, -1.75}
range 0, 0.5, 0.1    # {0, 0.1, 0.2, 0.3, 0.4}
```

Note that special optimizations are performed when using `range` in a for loop, as long as 1-3
arguments are specified:

```
# temporary list not actually created because `range` is called with 1-3
# arguments:
var start = 10, stop = 10000, step = 0.001
for var v, i: range stop * 3  # does *not* create a list of 30000 items!
  say v, i
end

for var v, i: range start + 5, stop / 2
  say v, i
end

for var v, i: range start, stop, step * 3
  say v, i
end

# temporary list is created because the expression is too complicated:
for var v, i: 5 * range 5
  say v, i
end

for var v, i: (range 5) + (range 6)
  say v, i
end
```

### Order

The `order` command performs a deep comparison of two values.  This is used for sorting, but can
also be used for equality.

Sorting precedence:

1. Nil
2. Numbers (NaN, negative infinity to positive infinity)
3. Strings (byte-by-byte comparison; if equal, shorter strings first)
4. Lists (item by item comparison; if equal, shorter lists first)

```
order nil, 1            # => -1
order 55, 5             # =>  1
order 'a', 'ab'         # => -1
order {}, ''            # =>  1
order {1}, {1}          # =>  0
order num.nan, num.nan  # =>  0

list.sort {3, 2, nil, 4}   # => {nil, 2, 3, 4}
list.rsort {3, 2, nil, 4}  # => {4, 3, 2, nil}
```

### Stacktrace

Note that `stacktrace` always returns a list of strings, but the list could be empty, or the format
of each string could change.  The `stacktrace` command should only be used for logging, and its
contents should not be relied upon or parsed.

If a sink script is compiled without debug information, `stacktrace` will simply return an empty
list `{}`.

Number
------

Number commands will operate on lists by performing the operation on each element, just like the
built-in unary and binary operators.

| Function            | Description                                                               |
|---------------------|---------------------------------------------------------------------------|
| `num.abs a`         | Absolute value of `a`                                                     |
| `num.sign a`        | Sign of `a` (-1, 0, or 1)                                                 |
| `num.max a, b, ...` | Returns the maximum number from all arguments                             |
| `num.min a, b, ...` | Returns the minimum number from all arguments                             |
| `num.clamp a, b, c` | Clamp `a` to be between `b` and `c`                                       |
| `num.floor a`       | Round `a` down to the nearest integer                                     |
| `num.ceil a`        | Round `a` up to the nearest integer                                       |
| `num.round a`       | Round `a` to the nearest integer, 0.5 and above rounds up                 |
| `num.trunc a`       | Round `a` towards 0                                                       |
| `num.nan`           | Not-a-number value                                                        |
| `num.inf`           | Infinity value                                                            |
| `num.isnan a`       | Tests whether `a` is a NaN value                                          |
| `num.isfinite a`    | Tests whether `a` is a finite value (i.e., not NaN and not infinite)      |
| `num.e`             | *e*  (2.718282...)                                                        |
| `num.pi`            | *pi* (3.141592...)                                                        |
| `num.tau`           | *tau* (2 * *pi* = 6.283185...)                                            |
| `num.sin a`         | Sine of `a` (radians)                                                     |
| `num.cos a`         | Cosine of `a` (radians)                                                   |
| `num.tan a`         | Tangent of `a` (radians)                                                  |
| `num.asin a`        | Arc-sine of `a`, returns radians                                          |
| `num.acos a`        | Arc-cosine of `a`, returns radians                                        |
| `num.atan a`        | Arc-tangent of `a`, returns radians                                       |
| `num.atan2 a, b`    | Arc-tangent of `a / b`, returns radians                                   |
| `num.log a`         | Natural log of `a`                                                        |
| `num.log2 a`        | Log base 2 of `a`                                                         |
| `num.log10 a`       | Log base 10 of `a`                                                        |
| `num.exp a`         | *e*<sup>`a`</sup>                                                         |
| `num.lerp a, b, t`  | Linear interpolation from `a` to `b`, by amount `t`                       |
| `num.hex a, b`      | Convert `a` to a sink hexadecimal string, 0-padded to `b` digits          |
| `num.oct a, b`      | Convert `a` to a sink octal string, 0-padded to `b` digits                |
| `num.bin a, b`      | Convert `a` to a sink binary string, 0-padded to `b` digits               |

Integer
-------

Sink only operates on 64-bit floating point numbers, but it's possible to simulate operations on
signed 32-bit integers using the `int` namespace, with appropriate two's-complement wrapping.

Integer commands will operate on lists by performing the operation on each element, just like the
built-in unary and binary operators.

| Function            | Description                                                               |
|---------------------|---------------------------------------------------------------------------|
| `int.new a`         | Round `a` to an integer                                                   |
| `int.not a`         | Bitwise NOT of `a`                                                        |
| `int.and a, b, ...` | Bitwise AND between all arguments                                         |
| `int.or a, b, ...`  | Bitwise OR between all arguments                                          |
| `int.xor a, b, ...` | Bitwise XOR between all arguments                                         |
| `int.shl a, b`      | Bit-shift left `a` by `b` bits                                            |
| `int.shr a, b`      | Bit-shift right `a` by `b` bits (zero-fill shift)                         |
| `int.sar a, b`      | Bit-shift right `a` by `b` bits (sign-extended shift)                     |
| `int.add a, b`      | `a + b`                                                                   |
| `int.sub a, b`      | `a - b`                                                                   |
| `int.mul a, b`      | `a * b`                                                                   |
| `int.div a, b`      | `a / b`                                                                   |
| `int.mod a, b`      | `a % b`                                                                   |
| `int.clz a`         | Count leading zeros                                                       |
| `int.pop a`         | Count number of bits set (population count, Hamming weight)               |
| `int.bswap a`       | Byte swap (`0x12345678` becomes `0x78563412`)                             |

Random
------

| Function          | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `rand.seed a`     | Set the seed of the RNG to `a` (interpreted as a 32-bit unsigned integer)   |
| `rand.seedauto`   | Set the seed of the RNG automatically (likely based on current time)        |
| `rand.int`        | Random 32-bit unsigned integer ranging [0, 2<sup>32</sup> - 1]              |
| `rand.num`        | Random number ranging [0, 1) (contains 52 bits of randomness)               |
| `rand.getstate`   | Returns a two item list, each a 32-bit unsigned integer                     |
| `rand.setstate a` | Restores a previous state (`a` should be a two item list of integers)       |
| `rand.pick ls`    | Pick a random item out of the list `ls`                                     |
| `rand.shuffle ls` | Shuffle the contents of list `ls` in place                                  |

The random number generator is the same on all host environments, defined below.  It is fast,
simple, and
[passes many statistical tests](https://gist.github.com/voidqk/d112165a26b45244a65298933c0349a4).
On startup, it is automatically seeded via `rand.seedauto`.

```c
// RNG has 64-bit state
static uint32_t seed, i;

void rand_seed(uint32_t s){
  seed = s;
  i = 0;
}

uint32_t rand_int(){
  uint32_t m = 0x5bd1e995;
  uint32_t k = i++ * m;
  seed = (k ^ (k >> 24) ^ (seed * m)) * m;
  return seed ^ (seed >> 13);
}

double rand_num(){
  uint64_t M1 = rand_int();
  uint64_t M2 = rand_int();
  uint64_t M = (M1 << 20) | (M2 >> 12); // 52 bit random number
  union { uint64_t i; double d; } u = {
    .i = UINT64_C(0x3FF) << 52 | M
  };
  return u.d - 1.0;
}

void rand_getstate(uint32_t *state){
  state[0] = seed;
  state[1] = i;
}

void rand_setstate(const uint32_t *state){
  seed = state[0];
  i = state[1];
}
```

String
------

Strings are 8-bit clean, and interpreted as binary data.

| Function                | Description                                                           |
|-------------------------|-----------------------------------------------------------------------|
| `str.new a, ...`        | Convert arguments to a string (using space as a separator)            |
| `str.split a, b`        | Split `a` into an array of strings based on separator `b`             |
| `str.replace a, b, c`   | Replace all occurrences of `b` in string `a` with `c`                 |
| `str.begins a, b`       | True if string `a` begins with string `b`; false otherwise            |
| `str.ends a, b`         | True if string `a` ends with string `b`; false otherwise              |
| `str.pad a, b`          | Pads string `a` with space until it is length `b` (`-b` to pad left)  |
| `str.find a, b, c`      | Find `b` in string `a` starting at `c`; returns nil if not found      |
| `str.rfind a, b, c`     | Find `b` in string `a` starting at `c` and searching in reverse       |
| `str.lower a`           | Convert `a` to lowercase                                              |
| `str.upper a`           | Convert `a` to uppercase                                              |
| `str.trim a`            | Trim surrounding whitespace from `a`                                  |
| `str.rev a`             | Reverse `a`                                                           |
| `str.rep a, b`          | Repeat string `a` `b` times                                           |
| `str.list a`            | Convert a string to a list of bytes                                   |
| `str.byte a, b`         | Unsigned byte from string `a` at index `b` (nil if out of range)      |
| `str.hash a, b`         | Hash string `a` with seed `b` (interpretted as 32-bit unsigned int)   |

### Uppercase, Lowercase, Trim

Due to the fact strings are interpreted as binary data, and not unicode strings, the `str.lower`,
`str.upper`, and `str.trim` commands are explicitly specified:

* `str.lower` will only convert bytes A-Z to a-z (values 65-90 to 97-122).
* `str.upper` will only convert bytes a-z to A-Z (values 97-122 to 65-90).
* `str.trim` will only remove surrounding whitespace defined as bytes 9 (tab), 10 (newline),
  11 (vertical tab), 12 (form feed), 13 (carriage return), and 32 (space).

### Hash Function

The `str.hash` command is defined as [Murmur3_x64_128](https://github.com/aappleby/smhasher), and
returns the same results on all platforms, given the same input.  Murmur3 is known as a fast and
high quality non-cryptographic hash function.

The `str.hash` command will return a list of four numbers, each 32-bit unsigned integers.

The seed parameter is optional, and defaults to 0.  Changing the seed is useful for generating
different hashes for the same input.

```c
// MurmurHash3 was written by Austin Appleby, and is placed in the public
// domain. The author hereby disclaims copyright to this source code.
// https://github.com/aappleby/smhasher

static inline uint64_t rotl64(uint64_t x, int8_t r){
  return (x << r) | (x >> (64 - r));
}

static inline uint64_t fmix64(uint64_t k){
  k ^= k >> 33;
  k *= UINT64_C(0xFF51AFD7ED558CCD);
  k ^= k >> 33;
  k *= UINT64_C(0xC4CEB9FE1A85EC53);
  k ^= k >> 33;
  return k;
}

void str_hash(const uint8_t *str, uint64_t len, uint32_t seed, uint32_t *out){
  uint64_t nblocks = len >> 4;

  uint64_t h1 = seed;
  uint64_t h2 = seed;

  uint64_t c1 = UINT64_C(0x87C37B91114253D5);
  uint64_t c2 = UINT64_C(0x4CF5AD432745937F);

  for (uint64_t i = 0; i < nblocks; i++){
    uint64_t ki = i * 16;
    uint64_t k1 =
      ((uint64_t)str[ki +  0]      ) |
      ((uint64_t)str[ki +  1] <<  8) |
      ((uint64_t)str[ki +  2] << 16) |
      ((uint64_t)str[ki +  3] << 24) |
      ((uint64_t)str[ki +  4] << 32) |
      ((uint64_t)str[ki +  5] << 40) |
      ((uint64_t)str[ki +  6] << 48) |
      ((uint64_t)str[ki +  7] << 56);
    uint64_t k2 =
      ((uint64_t)str[ki +  8]      ) |
      ((uint64_t)str[ki +  9] <<  8) |
      ((uint64_t)str[ki + 10] << 16) |
      ((uint64_t)str[ki + 11] << 24) |
      ((uint64_t)str[ki + 12] << 32) |
      ((uint64_t)str[ki + 13] << 40) |
      ((uint64_t)str[ki + 14] << 48) |
      ((uint64_t)str[ki + 15] << 56);

    k1 *= c1;
    k1 = rotl64(k1, 31);
    k1 *= c2;
    h1 ^= k1;

    h1 = rotl64(h1, 27);
    h1 += h2;
    h1 = h1 * 5 + 0x52DCE729;

    k2 *= c2;
    k2 = rotl64(k2, 33);
    k2 *= c1;
    h2 ^= k2;

    h2 = rotl64(h2, 31);
    h2 += h1;
    h2 = h2 * 5 + 0x38495AB5;
  }

  const uint8_t *tail = &str[nblocks << 4];

  uint64_t k1 = 0;
  uint64_t k2 = 0;

  switch(len & 15) {
    case 15: k2 ^= (uint64_t)(tail[14]) << 48;
    case 14: k2 ^= (uint64_t)(tail[13]) << 40;
    case 13: k2 ^= (uint64_t)(tail[12]) << 32;
    case 12: k2 ^= (uint64_t)(tail[11]) << 24;
    case 11: k2 ^= (uint64_t)(tail[10]) << 16;
    case 10: k2 ^= (uint64_t)(tail[ 9]) << 8;
    case  9: k2 ^= (uint64_t)(tail[ 8]) << 0;

    k2 *= c2;
    k2 = rotl64(k2, 33);
    k2 *= c1;
    h2 ^= k2;

    case  8: k1 ^= (uint64_t)(tail[ 7]) << 56;
    case  7: k1 ^= (uint64_t)(tail[ 6]) << 48;
    case  6: k1 ^= (uint64_t)(tail[ 5]) << 40;
    case  5: k1 ^= (uint64_t)(tail[ 4]) << 32;
    case  4: k1 ^= (uint64_t)(tail[ 3]) << 24;
    case  3: k1 ^= (uint64_t)(tail[ 2]) << 16;
    case  2: k1 ^= (uint64_t)(tail[ 1]) << 8;
    case  1: k1 ^= (uint64_t)(tail[ 0]) << 0;

    k1 *= c1;
    k1 = rotl64(k1, 31);
    k1 *= c2;
    h1 ^= k1;
  }

  h1 ^= len;
  h2 ^= len;

  h1 += h2;
  h2 += h1;

  h1 = fmix64(h1);
  h2 = fmix64(h2);

  h1 += h2;
  h2 += h1;

  out[0] = h1 & 0xFFFFFFFF;
  out[1] = h1 >> 32;
  out[2] = h2 & 0xFFFFFFFF;
  out[3] = h2 >> 32;
}
```

```
str.hash 'hello, world', 123   # => {3439238593,  804096095, 2029097957, 3684287146}
str.hash 'demon produce aisle' # => {2133076460, 2322631415, 1728380306, 2686374473}
```

UTF-8
-----

The `utf8` namespace operates on strings (bytes), and only provides some basic commands for
encoding and decoding.

| Function       | Description                                                                    |
|----------------|--------------------------------------------------------------------------------|
| `utf8.valid a` | Checks whether `a` is valid UTF-8 (`a` is string or list of codepoints)        |
| `utf8.list a`  | Converts string `a` (UTF-8 bytes) to a list of codepoints (integers)           |
| `utf8.str a`   | Converts a list of codepoints (integers) `a` to a string (UTF-8 bytes)         |

Codepoints U+0000 to U+10FFFF are considered valid, with the sole exception of the surrogate
characters (U+D800 to U+DFFF).
[Overlong encodings](https://en.wikipedia.org/wiki/UTF-8#Overlong_encodings) are rejected as
invalid.

Structured Data
---------------

| Function             | Description                                                              |
|----------------------|--------------------------------------------------------------------------|
| `struct.size tpl`    | Calculate the length of string the template specifies (nil for invalid)  |
| `struct.str ls, tpl` | Convert data in list `ls` to a string using `tpl` as the template        |
| `struct.list a, tpl` | Convert string `a` to a list of data using `tpl` as the template         |
| `struct.isLE`        | Returns true if system is little endian; false otherwise                 |

### Structure Templates

Structure templates are lists of strings, where each case-sensitive string represents one data type:

| Code     | Size | Signed?  | Endian | C Type     |
|----------|------|----------|--------|------------|
| `'U8'`   |    1 | Unsigned | N/A    | `uint8_t`  |
| `'U16'`  |    2 | Unsigned | Native | `uint16_t` |
| `'UL16'` |    2 | Unsigned | Little | `uint16_t` |
| `'UB16'` |    2 | Unsigned | Big    | `uint16_t` |
| `'U32'`  |    4 | Unsigned | Native | `uint32_t` |
| `'UL32'` |    4 | Unsigned | Little | `uint32_t` |
| `'UB32'` |    4 | Unsigned | Big    | `uint32_t` |
| `'S8'`   |    1 | Signed   | N/A    | `int8_t`   |
| `'S16'`  |    2 | Signed   | Native | `int16_t`  |
| `'SL16'` |    2 | Signed   | Little | `int16_t`  |
| `'SB16'` |    2 | Signed   | Big    | `int16_t`  |
| `'S32'`  |    4 | Signed   | Native | `int32_t`  |
| `'SL32'` |    4 | Signed   | Little | `int32_t`  |
| `'SB32'` |    4 | Signed   | Big    | `int32_t`  |
| `'F32'`  |    4 | N/A      | Native | `float`    |
| `'FL32'` |    4 | N/A      | Little | `float`    |
| `'FB32'` |    4 | N/A      | Big    | `float`    |
| `'F64'`  |    8 | N/A      | Native | `double`   |
| `'FL64'` |    8 | N/A      | Little | `double`   |
| `'FB64'` |    8 | N/A      | Big    | `double`   |

```
struct.str {0x41, 0x42}, {'U8', 'U8'}  # => 'AB'
struct.list 'AAAB', {'UL32'}           # => { 0x42414141 }
struct.list 'AAAB', {'UB32'}           # => { 0x41414142 }
struct.size {'F32', 'U8', 'S16'}       # => 7 (bytes)
struct.size {'hello'}                  # => nil because template is invalid
```

The data can be an array of structures, as long as the data length is a multiple of the template
size:

```
struct.str {0x41, 0x42, 0x43}, {'U8'}    # => 'ABC'
struct.str {1, 2, 3, 4}, {'U8', 'UL16'}  # => "\x01\x02\x00\x03\x04\x00"
struct.list 'ABC', {'U8'}                # => { 0x41, 0x42, 0x43 }
struct.list 'ABCD', {'UL16'}             # => { 0x4241, 0x4443 }
struct.list 'ABCDEF', {'U8', 'UL16'}     # => { 0x41, 0x4342, 0x44, 0x4645 }
```

List
----

| Function                  | Description                                                         |
|---------------------------|---------------------------------------------------------------------|
| `list.new a, b`           | Create a new list of size `a`, with each element set to `b`         |
| `list.shift ls`           | Remove and return the value at the start of `ls`                    |
| `list.pop ls`             | Remove and return the value at the end of `ls`                      |
| `list.push ls, b`         | Push `b` at end of list `ls` (returns `ls`)                         |
| `list.unshift ls, b`      | Unshift `b` at the start of list `ls` (returns `ls`)                |
| `list.append ls, ls2`     | Append `ls2` at the end of list `ls` (returns `ls`)                 |
| `list.prepend ls, ls2`    | Prepend `ls2` at the start of list `ls` (returns `ls`)              |
| `list.find ls, a, b`      | Find `a` in list `ls` starting at `b`; returns nil if not found     |
| `list.rfind ls, a, b`     | Find `a` in list `ls` starting at `b` and searching in reverse      |
| `list.join ls, a`         | Convert list `ls` to a string by joining elements with string `a`   |
| `list.rev ls`             | Reverse list `ls` (returns `ls`)                                    |
| `list.str ls`             | Convert a list of bytes to a string                                 |
| `list.sort ls`            | Sorts the list `ls` in place using `order` (returns `ls`)           |
| `list.rsort ls`           | Reverse sorts the list `ls` in place using `order` (returns `ls`)   |

Pickle
------

The `pickle` namespace implements serialization and deserialization commands for sink values.

There are two serialization formats: JSON and binary.

The JSON format is possible by mapping lists to arrays and `nil` to `null`, but cannot handle
referencing lists and is slightly inefficient.

The binary format is compact, fast, and restores list references -- therefore it can
safely serialize *any* sink value, and is the recommended format for serialization.
See: [Pickle Binary Format](https://github.com/voidqk/sink/blob/master/docs/pickle.md).

Note: Pickling completely ignores host user data attached to lists and cannot be used to copy or
marshal user objects in the host environment.

Note: `pickle.valid` does not validate all possible JSON, just the subset that can be correctly
deserialized to a sink value.

| Function            | Description                                                               |
|---------------------|---------------------------------------------------------------------------|
| `pickle.json a`     | Converts a *non-circular* sink value `a` to a serialized string in JSON   |
| `pickle.bin a`      | Converts *any* sink value `a` to a binary serialized string               |
| `pickle.val a`      | Converts a serialized value `a` (JSON or binary) back to a sink value     |
| `pickle.valid a`    | Returns `nil` if `a` is invalid, `1` if JSON format, and `2` if binary    |
| `pickle.sibling a`  | True if `a` has sibling references                                        |
| `pickle.circular a` | True if `a` has circular references                                       |
| `pickle.copy a`     | Performs a deep copy of `a` (i.e., binary pickles then unpickles)         |

```
pickle.json {1, nil}     # => '[1,null]'
pickle.val '[[-1],5]'    # => {{-1}, 5}
pickle.valid '{}'        # => nil, not all of JSON can be converted to sink
pickle.valid '"\u1000"'  # => nil, only bytes in strings are supported ("\u0000" to "\u00FF")
pickle.valid 'null'      # => 1, JSON formatted serialized sink value (`null` maps to `nil`)
```

### List References

Pickling lists is complicated because they can contain the same list multiple times, or even have
recursive lists:

```
var a = {'hello'}
var b = {a, a}
say b  # {{'hello'}, {'hello'}}

var c = {'world'}
list.push c, c
say c  # {{'world'}, {circular}}
```

List `a` is flat and doesn't contain duplicate references.

List `b` contains a sibling reference.  Sibling references are when there exists multiple
non-circular references to the same object.

Sibling references can be serialized using JSON, but upon deserializing, the fact that
`b[0] == b[1]` will be lost:

```
var b2 = b | pickle.json | pickle.val
say b[0] == b[1]    # 1 (true)
say b2[0] == b2[1]  # nil (false)
```

List `c` contains a circular reference -- this is when a list contains itself somewhere inside of
it.  Circular references cannot be serialized using JSON and will cause the sink script to abort in
failure.

The `pickle.sibling` and `pickle.circular` commands can test whether an object has sibling or
circular references.  To avoid this problem completely, it's recommended to use the binary format
(via `pickle.bin`) in lieu of the JSON format, since it correctly handles restoring references
(both sibling and circular).

GC
--

Note: garbage collection manipulation is only available in certain environments, but the commands
always exist and execute without error.

| Function        | Description                                                                   |
|-----------------|-------------------------------------------------------------------------------|
| `gc.getlevel`   | Get the garbage collection level (see below)                                  |
| `gc.setlevel a` | Set the garbage collection level (see below)                                  |
| `gc.run`        | Run a full cycle of garbage collection right now                              |

### GC Level

The garbage collection (GC) level is one of the strings:

* `'none'` - Do not perform automatic GC
* `'default'` - Perform automatic GC at a reasonable frequency for most applications
* `'lowmem'` - Perform automatic GC at a high frequency for lower memory applications

No matter what the level is set to, running `gc.run` will always perform a full collection.
