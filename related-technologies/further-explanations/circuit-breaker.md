# Circuit Breaker Design Pattern

In this architecture, a **Circuit Breaker** is a software resilience pattern placed inside the API Management gateway or integration layer that monitors the health of the downstream on-premises inventory API and **automatically cuts off incoming traffic** when that API starts failing or hanging.

The name comes directly from physical electrical circuit breakers: when current surges dangerously high, the mechanical breaker trips open to protect the building’s wiring from catching fire.

In your scenario, the **on-premises inventory server** is the fragile system at risk of "burning out," and the **API Gateway** acts as the automated breaker.

---

### The Problem Without a Circuit Breaker (Cascading Failure)

When 3,000 retail store employees simultaneously open their Power Apps inventory counters:

```
[ 3,000 Mobile App Users ]
           │ 
           │ Bombards with 1,000s of requests/sec
           ▼
┌────────────────────────┐
│ API Gateway / Cloud    │
└──────────┬─────────────┘
           │ 
           │ Forwards all calls over VPN / ExpressRoute
           ▼
┌────────────────────────────────────────────────────────┐
│ Fragile On-Premises Inventory Server                  │
│ • Database connection pool exhausts                    │
│ • CPU hits 100%                                        │
│ • Calls begin timing out (taking 30–60s each)          │
│ • New incoming requests pile up in server queue        │
│ • CRASH: Process runs out of memory and dies           │
│ • Reboot attempts fail instantly because incoming      │
│   traffic crushes it the second it comes back up       │
└────────────────────────────────────────────────────────┘

```

Without a circuit breaker, every mobile app user sits looking at a spinning wheel until their request times out after 30 to 60 seconds, and the on-prem server never gets the breathing room it needs to recover.

---

### How the Circuit Breaker Solves It

The circuit breaker operates like a state machine with three distinct states: **Closed**, **Open**, and **Half-Open**.

```
              ┌─────────────────────────────────────────┐
              │                                         │
              │   Failures exceed threshold (e.g., 50%) │
              ▼                                         │
       ┌──────────────┐                          ┌──────────────┐
       │     OPEN     │                          │    CLOSED    │
       │ (Fast Fail)  │                          │   (Normal)   │
       └──────┬───────┘                          └──────▲───────┘
              │                                         │
              │ Sleep window expires (e.g., 60s)        │ All test calls
              ▼                                         │ succeed
       ┌──────────────┐                                 │
       │  HALF-OPEN   │─────────────────────────────────┘
       │ (Canary Test)│
       └──────────────┘
              │
              │ Any test call fails
              └─────────────────────────────────────────┘

```

#### 1. Closed State (Normal Operation)

* **What happens:** Traffic flows normally. Every request from the Power Apps clients is forwarded by the gateway directly to the on-premises inventory API.
* **Monitoring:** The gateway tracks error rates and response times (e.g., measuring HTTP 500/503 errors and socket timeouts).

#### 2. Open State (Tripped / Safe Mode)

* **When it trips:** If the failure rate crosses a configured threshold (for instance, **more than 50% of calls fail or time out within a 10-second window**), the breaker immediately **trips open**.
* **What happens:** The gateway **completely stops forwarding requests** to the on-prem server:
* Incoming calls from the 3,000 mobile devices are intercepted at the cloud edge.
* The gateway immediately returns an instant, graceful response (such as `HTTP 503 Service Unavailable` or a cached fallback reading `Inventory data temporarily unavailable, please retry in a moment`) in **under 5 milliseconds**, rather than making users wait 45 seconds for a timeout.
* **The crucial benefit:** The fragile on-premises server gets zero new incoming traffic, giving its threads, memory, and database connections time to drain and recover.



#### 3. Half-Open State (The Canary Test)

* **When it activates:** After a predefined cool-down period (e.g., **60 seconds** after tripping open), the breaker enters the **Half-Open** state.
* **What happens:** The gateway allows a small, controlled sample of requests (a "canary" test—say, 5% of traffic or 10 requests) through to the on-premises server:
* **If those test requests succeed:** The gateway concludes the server has stabilized, resets the circuit to **Closed**, and resumes normal operations.
* **If those test requests fail:** The gateway assumes the server is still under distress, immediately trips back to **Open**, and resets the 60-second recovery timer.



---

### Difference Between Throttling and Circuit Breaking

In this scenario, both techniques work together, but they address different aspects of the problem:

| Concept | What It Does | Analogy |
| --- | --- | --- |
| **Throttling (Rate Limiting)** | **Proactive:** Caps the total volume of requests allowed per second/minute (e.g., allowing no more than 200 calls/second from the Power Apps). Drops or delays excess calls before trouble starts. | A bouncer at the club door only letting 10 people in per minute. |
| **Circuit Breaking** | **Reactive:** Detects that the destination server is already struggling or failing, and severs the link to allow it to heal without crashing completely. | An emergency kill-switch or fuse that blows to stop the machinery from melting down. |