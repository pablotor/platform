export default `

## The backend is moving closer to the user

For most of the web's history, “the server” was a fairly concrete idea.

Your application ran in a region. Requests crossed the internet, reached a load balancer, hit an application server, and eventually made their way to a database. You optimized that architecture with caching, connection pools, replicas, queues, and increasingly large machines.

Edge runtimes change the shape of that assumption.

Instead of treating compute as something that lives in a handful of centralized regions, they make it practical to execute application logic at dozens or hundreds of locations around the world.

The important shift isn't simply **where the code runs**.

It is that frameworks increasingly make geographic distribution feel like the default.

> **The edge is not just a faster server. It is a different set of constraints.**

## Why now?

Three trends are converging:

1. **Edge networks are becoming programmable.**
2. **JavaScript runtimes are getting smaller and faster to start.**
3. **Frameworks are hiding more infrastructure decisions from developers.**

A traditional server might take seconds or minutes to provision and maintain. An edge function can be deployed as part of a globally distributed platform and invoked only when needed.

That changes the economics and the operational model.

Consider a simple request:

\`\`\`text
Browser
   │
   ▼
Nearest edge location
   │
   ├── authenticate
   ├── personalize
   ├── rewrite
   └── fetch data
          │
          ▼
      Origin / DB
\`\`\`

The first four operations can happen close to the user.

The database often cannot.

That distinction turns out to be the source of many of the most interesting problems.

---

## What edge runtimes fix

### 1. Latency between users and compute

The most obvious benefit is distance.

If a user in Tokyo sends a request to an application running exclusively in Virginia, physics is part of your application's latency budget.

Move the request handling closer to Tokyo and some of that latency disappears.

This matters most for workloads that are:

- request-heavy,
- latency-sensitive,
- relatively stateless,
- and capable of making decisions without repeatedly touching a centralized database.

Authentication checks, redirects, personalization, experimentation, content negotiation, and lightweight API endpoints are natural candidates.

### 2. Traffic spikes become less dramatic

Centralized infrastructure tends to make capacity planning visible.

You have a fleet. The fleet has limits. Traffic spikes push you toward autoscaling, overprovisioning, or queueing.

Edge platforms can distribute incoming work across a much larger geographic footprint.

That does not make capacity infinite, but it can make bursts less concentrated.

\`\`\`js
export default async function handler(request) {
  const country = request.headers.get('cf-ipcountry');

  if (country === 'DE') {
    return Response.redirect(new URL('/de', request.url));
  }

  return Response.redirect(new URL('/en', request.url));
}
\`\`\`

A tiny function like this does not need a dedicated application server sitting near a database.

It needs to run quickly and reliably.

The edge is very good at that.

### 3. Personalization can happen before the origin

The edge can inspect a request before it reaches your main application.

That enables patterns such as:

- geographic routing,
- A/B testing,
- bot filtering,
- authentication,
- feature flags,
- redirects,
- header manipulation,
- content negotiation.

Instead of:

\`\`\`text
User → Origin → Decide → Response
\`\`\`

you can have:

\`\`\`text
User → Edge → Decide → Origin (only if necessary)
\`\`\`

That “only if necessary” is the important part.

Every request that can be resolved at the edge is a request that does not need to travel farther.

---

## What the edge breaks

The uncomfortable part is that distributed compute makes some old assumptions dangerous.

### 1. Local state stops being local

On a traditional server, you might write something like:

\`\`\`js
let requestCount = 0;

export function handler() {
  requestCount += 1;

  return new Response(\`Requests: \${requestCount}\`);
}
\`\`\`

This is already a poor production design on ordinary serverless infrastructure.

At the edge, the mental model becomes even more obviously wrong.

There may be many runtime instances:

\`\`\`text
             ┌── Edge A ── requestCount = 12
             │
Users ───────┼── Edge B ── requestCount = 87
             │
             └── Edge C ── requestCount = 31
\`\`\`

There is no single authoritative \`requestCount\`.

If you need shared state, you need a system designed to provide it.

That might be a database, distributed cache, durable object, coordination service, or another explicitly shared primitive.

The runtime itself is no longer the place to put your source of truth.

---

## 2. Your database is suddenly very far away

This is the biggest catch.

Suppose your users are distributed globally, but your primary database lives in Frankfurt.

Your application might execute here:

\`\`\`text
                    ┌── New York edge
                    │
User ───────────────┼── Singapore edge
                    │
                    └── São Paulo edge
                              │
                              ▼
                         Frankfurt DB
\`\`\`

The edge function is fast.

The application is fast.

The database round trip is not.

You can therefore end up with an architecture where the **compute is globally distributed but the data is still centralized**.

That is not necessarily bad.

It simply means the edge does not magically make the entire request local.

### The new optimization question

Traditional optimization often asks:

> How do we make the server faster?

Edge architecture asks:

> How many times does this request need to cross a region boundary?

That is a different question.

---

## 3. Connection-heavy workloads become awkward

Many traditional backends assume relatively long-lived processes.

They maintain:

- database connection pools,
- in-memory caches,
- background workers,
- filesystem state,
- TCP connections,
- local queues.

Edge runtimes generally favor short-lived, lightweight execution.

That is excellent for:

\`\`\`text
request → compute → response
\`\`\`

It is less natural for:

\`\`\`text
process → maintain connections → coordinate state → process jobs
\`\`\`

This is one reason edge runtimes do not simply replace conventional servers.

They expand the set of workloads that can run close to users.

They do not eliminate the workloads that benefit from centralized, long-lived infrastructure.

---

## The runtime constraints matter

Edge environments often come with a different runtime surface than a conventional Node.js server.

You may have APIs such as:

\`\`\`js
fetch()
Request
Response
Headers
Web Crypto
Streams
URL
\`\`\`

while assuming that some Node-specific capabilities are unavailable or restricted.

That changes how dependencies behave.

A package that works perfectly in a conventional server process may fail because it expects:

\`\`\`js
import fs from 'node:fs';
import net from 'node:net';
import childProcess from 'node:child_process';
\`\`\`

The problem is not necessarily that the package is badly designed.

It was designed for a different runtime.

### Runtime compatibility becomes architecture

This is an underappreciated consequence of the edge.

Developers used to think about:

> What framework are we using?

Increasingly, they also need to ask:

> What runtime assumptions does this dependency make?

A dependency tree is no longer just a bundle-size concern.

It can determine where your application is capable of running.

---

## The data problem is bigger than the compute problem

Moving computation is relatively easy.

Moving authoritative data is much harder.

Imagine an application with:

- users in 40 countries,
- a globally distributed frontend,
- edge-rendered pages,
- and a single transactional database.

The architecture might look modern:

\`\`\`text
                  Global users
                       │
            ┌──────────┴──────────┐
            ▼          ▼          ▼
          Edge       Edge       Edge
            │          │          │
            └──────────┬──────────┘
                       │
                       ▼
                 Primary database
\`\`\`

But every write still has to agree on one source of truth.

That creates a fundamental trade-off between:

- consistency,
- latency,
- availability,
- and operational complexity.

Edge compute does not remove distributed-systems problems.

It makes them impossible to ignore.

---

## A useful way to classify edge workloads

Not every endpoint deserves to move to the edge.

A practical classification is:

| Workload                 | Edge fit  | Why                                            |
| ------------------------ | --------- | ---------------------------------------------- |
| Redirects                | Excellent | Tiny, stateless, latency-sensitive             |
| Authentication checks    | Excellent | Often request-local                            |
| A/B testing              | Excellent | Decision can happen before origin              |
| Personalization          | Good      | Especially with cached data                    |
| API reads                | Good      | Depends on database topology                   |
| API writes               | Mixed     | Consistency and database latency matter        |
| Image transformation     | Good      | Compute can be distributed                     |
| Long-running jobs        | Poor      | Better suited to workers                       |
| WebSocket-heavy apps     | Mixed     | Depends on platform and connection model       |
| Transaction processing   | Mixed     | Centralized state may be important             |
| Large in-memory services | Poor      | Edge instances are not general-purpose servers |

The mistake is treating “edge” as a destination.

It is better understood as a **placement strategy**.

---

## The new architecture is hybrid

The future is probably not:

> Everything runs at the edge.

It looks more like:

\`\`\`text
                     ┌───────────────┐
                     │   User        │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │     Edge      │
                     │               │
                     │ auth          │
                     │ routing       │
                     │ cache         │
                     │ personalization│
                     └───────┬───────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │ Origin/API   │      │ Edge storage │
          └──────┬───────┘      └──────────────┘
                 │
                 ▼
          ┌──────────────┐
          │   Database   │
          └──────────────┘
\`\`\`

The edge becomes the first layer of your application rather than the entire application.

That distinction makes the migration much more practical.

---

## What this means for frameworks

Framework authors increasingly have to answer questions that used to belong to infrastructure teams.

For example:

- Where does this code execute?
- Can this component access Node APIs?
- Is this data request cacheable?
- Does this function run once per request or once per deployment?
- Where is the state stored?
- What happens when the user and database are on different continents?
- Can this dependency execute in an edge runtime?

Framework abstractions are becoming more powerful, but that power comes with a cost.

The framework can hide the infrastructure.

It cannot repeal the infrastructure.

> **An abstraction can hide a network hop. It cannot remove the network hop.**

---

## A checklist for moving code to the edge

Before moving an endpoint, ask:

- [ ] Is the request latency-sensitive?
- [ ] Can the code run without local filesystem access?
- [ ] Does it depend on Node-specific APIs?
- [ ] Does it require shared mutable memory?
- [ ] How many database round trips does it make?
- [ ] Where is the authoritative data located?
- [ ] What happens when the edge location is far from the database?
- [ ] Is the operation safe to retry?
- [ ] Can the response be cached?
- [ ] Does the dependency tree support the target runtime?
- [ ] What observability is available across regions?
- [ ] How will failures differ between edge and origin execution?

If the answers look good, the edge may be a substantial improvement.

If they do not, forcing the workload onto the edge can make the system more complicated without making it faster.

---

## The backend is becoming a geography problem

The most important change is conceptual.

A backend used to be mostly about **processes**:

> Which machine runs this code?

A distributed backend is increasingly about **locations**:

> Where should this code run relative to the user and the data?

That introduces a new dimension to application architecture.

You are no longer choosing only between:

- serverless and servers,
- containers and virtual machines,
- SQL and NoSQL.

You are choosing where computation, caching, state, and data should live.

And those choices interact.

### The real promise of the edge

The edge is compelling because it can make the first milliseconds of a request dramatically cheaper and faster.

But its deeper impact is architectural.

It encourages developers to separate:

1. **request-local computation,**
2. **shared application state,**
3. **authoritative data,**
4. **long-running work.**

Once those concerns are separated, each can live in the environment that suits it best.

That is the real shift.

Edge runtimes are not eating the backend by making traditional servers obsolete.

They are eating the assumption that the backend has to be one place.

---

## Closing thought

The next generation of web applications will probably have fewer obvious “servers.”

There will still be databases, workers, queues, APIs, and compute.

But the boundary between frontend and backend will continue to blur, and more of the backend will execute wherever the request happens to be.

The winning architecture will not be the one that puts everything at the edge.

It will be the one that knows **what belongs there — and what absolutely does not.**

---

### Code example

Here is a deliberately small edge-compatible example:

\`\`\`js
export default async function handler(request) {
  const url = new URL(request.url);

  if (url.pathname === '/health') {
    return new Response(
      JSON.stringify({
        ok: true,
        runtime: 'edge',
        region: request.headers.get('x-region') ?? 'unknown',
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  }

  return new Response('Not found', {
    status: 404,
  });
}
\`\`\`

### Inline formatting

This paragraph contains **bold text**, _italic text_, **_bold italic text_**, \`inline code\`, ~~strikethrough~~, and a [link to an example](https://example.com).

You can also combine \`**bold code**\`, _italic text_, and **a [bold link](https://example.com)**.

### Blockquote

> The edge does not eliminate distance.
>
> It changes which distances matter.

### Unordered list

- Compute
  - Request handling
  - Authentication
  - Personalization
- Storage
  - Cache
  - Database
  - Object storage
- Operations
  - Logging
  - Metrics
  - Tracing

### Ordered list

1. Receive the request.
2. Execute edge logic.
3. Check the cache.
4. Fetch from the origin if necessary.
5. Return the response.

### Task list

- [x] Move request routing to the edge
- [x] Add regional caching
- [ ] Replicate the primary database
- [ ] Audit runtime compatibility
- [ ] Measure cross-region latency

### Table

| Layer    | Location        | Primary concern           |
| -------- | --------------- | ------------------------- |
| Browser  | User            | Rendering                 |
| Edge     | Near user       | Low-latency logic         |
| Origin   | Regional        | Application orchestration |
| Database | Regional/global | Durable state             |
| Worker   | Flexible        | Background processing     |

### Horizontal rule

---

### Footnote-style references

Edge architecture is fundamentally about reducing unnecessary distance between computation and the user.[^1]

[^1]: The database may still be geographically distant, which is why edge compute does not automatically make every request faster.

### Definition-style content

**Latency**  
The time between a request being made and a useful response being received.

**Origin**  
The backend service responsible for authoritative application behavior or data.

**Edge runtime**  
A runtime designed to execute application code at geographically distributed locations close to users.

### Escaped characters

Markdown can also display escaped characters such as \*literal asterisks\*, \_literal underscores\_, and \# a literal hash.

### Heading hierarchy

#### H4 heading

##### H5 heading

###### H6 heading

This final section exists specifically to exercise the lower levels of the Markdown heading hierarchy.
`;
