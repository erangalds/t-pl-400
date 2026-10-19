# Dynamics 365 Sales Implementation in a University

## Q47
![Q47](/dump-questions/question-images/q1-100/q47.png)

An evaluation of the security design and requirements indicates:

1. **Position Hierarchy Security Capabilities:**
* **Hierarchy security** (Manager or Position hierarchy) is designed to extend Dataverse record access vertically up an organizational or positional ladder.


* A parent position gains access to records owned by or shared with a child position in its direct downward branch.
* Position hierarchies are meant for individual job functions/roles (e.g., "Senior Researcher", "Lead Assessor"), not organizational structural units like departments.




2. **Cross-Departmental Collaboration:**
* Departments in Dataverse are modeled as **Business Units**.


* Defining departments as positions does not provide lateral, peer-to-peer collaboration on specific records across separate business units.


* The appropriate Dataverse architectural mechanisms for cross-departmental, record-specific collaboration are:
* **Access Teams** (or record sharing), which dynamically grant users from other departments read/write access to a specific opportunity without altering the departmental security boundary.
* **Owner Teams** across business units (or Matrix Data Access Structure).





Therefore, using position hierarchy security with departments as positions does not solve the requirement.

**B. No**


## Q48

![Q48](/dump-questions/question-images/q1-100/q48.png)

An evaluation of the requirements and the proposed solution indicates:

1. **Security Isolation vs. Broad Access:**
* The scenario establishes a baseline requirement: *"You configure the system to ensure that each department can only work on their own records."*

* Cross-department collaboration is only needed conditionally: *"ensure that employees from more than one department can work on the same opportunities when necessary."*



2. **The Flaw in Organization-Level Access:**
* An **Organization-level (Global)** privilege allows a user to read and edit **every single opportunity across the entire organization**, regardless of which department owns it.


* Assigning an Organization-level security role to all members of the collaborating departments completely breaks the isolation requirement, granting them blanket access to all existing and future departmental bids rather than just the specific shared opportunities.


* The appropriate mechanism for granular, per-record sharing across departmental boundaries is an **Access Team** (or manual record sharing).





Therefore, the proposed solution violates the primary security isolation constraint and does not meet the goal.

**B. No**


## Q49

![Q49](/dump-questions/question-images/q1-100/q49.png)


An evaluation of the security requirements and the proposed mechanism indicates:

1. **The Core Architectural Challenge:**
* Baseline rule: Each department (modeled as a Business Unit) must only work on its own opportunity records.


* Exception rule: Employees from multiple departments must be able to collaborate on specific individual opportunities *when necessary*, without granting blanket visibility to the entire department.




2. **Access Teams and Access Team Templates:**
* **Access Teams** are Dataverse's native mechanism for dynamic, record-level sharing across organizational boundaries.


* Unlike Owner Teams, Access Teams do not own records and do not require security roles.
* By defining an **Access Team Template** for the Opportunity entity (granting permissions such as Read and Write), a subgrid of users can be added directly onto the Opportunity form.
* When an employee from another department is added to that opportunity's Access Team subgrid, Dataverse dynamically grants them access to *only that specific record* while preserving strict departmental isolation for all other opportunities.





Therefore, using access team templates precisely fulfills both the conditional collaboration need and the security isolation requirement.

**A. Yes**



## Q373
![Q373](/dump-questions/question-images/q301-400/q373.png)


**Correct Answer:** **A. Yes** (with notable caveats in practice)

---

### Step-by-Step Breakdown

#### 1. The Core Business Problem & Requirements

* **Baseline Security:** Each university department operates in its own silo (typically modeled as separate Business Units with User- or Business Unit-level security privileges) to ensure departments only work on their own funding bid opportunities.


* **Collaboration Requirement:** Occasionally, employees from multiple departments must collaborate on a specific opportunity ("when necessary").


* **Question Type:** This is a *"Does the solution meet the goal?"* question. It does not ask if this is the *most optimal, scalable, or automated* architecture; it asks strictly whether the solution accomplishes the stated requirement.



---

#### 2. Why the Solution Meets the Goal (**Yes**)

* **Mechanism:** Record-level sharing (via the Access Object / `PrincipalObjectAccess` table under the hood) allows owners or privileged users to grant specific permissions (Read, Write, Append, Append To) to users outside their standard Business Unit or security boundary.
* **Fulfillment:** By sharing the specific opportunity with members of the collaborating department, those users can see, edit, and contribute to that specific bid without granting them global visibility across all opportunities from the other department.


* Because this enables cross-departmental collaboration on individual records on demand, **it technically meets the stated goal**.



---

### Why Some Exam Keys Debate **B (No)**

You will occasionally encounter answer keys or discussions arguing for **B (No)** due to strict enterprise design interpretations:

1. **Over-Granting Access:**
The solution states to share with *"all members of the second department"* rather than only the specific individuals collaborating on the project.


2. **Administration Overhead:**
Manual sharing does not scale well in enterprise scenarios and pollutes the POA (`PrincipalObjectAccess`) table, which can impact platform performance over time.
3. **The Microsoft Best-Practice Alternative:**
In this scenario series, the Microsoft textbook "best practice" answer is to use **Access Teams** (via an **Access Team Template** on Opportunity). Access teams dynamically grant and revoke record-level privileges to ad-hoc, cross-functional project teams directly from a subgrid on the form without manual share dialog administration.

However, from a purely functional standpoint of enabling cross-departmental collaboration when needed without changing the global security roles, **A. Yes** achieves the goal.

### 1. The POA Table (`PrincipalObjectAccess`)

#### The Everyday Analogy

Imagine an office building where your badge only opens doors in your department.

If someone from Finance needs into an IT storage room just for today, the security guard doesn't change their entire job profile. Instead, the guard writes a temporary sticky note on a clipboard:

> *"User Alice is allowed into Room #402 with Read/Write access."*

In Dataverse, that clipboard is a hidden system table called **`PrincipalObjectAccess` (POA)**.

#### How It Works Under the Hood

Whenever you click **Share** on a record or use manual sharing:

1. Dataverse inserts a new row into the **POA** table.
2. That row links three items:
* **Principal:** Who gets access (a User ID or Team ID).
* **Object:** The specific record (the Opportunity GUID).
* **Access Rights:** What they can do (Read, Write, Delete, Append, etc.).


3. Every single time a user runs a search, opens a view, or opens a form, Dataverse checks their regular security roles **plus** joins the massive POA table to see if any records have been shared with them.

#### Why Excessive Manual Sharing Causes Problems

* **The "POA Bloat":** If thousands of records are shared with dozens of individual users, the POA table explodes to millions of rows.
* **Performance Hits:** Database queries slow down because every view query has to perform heavy join operations against this massive table.
* **Orphaned Access:** People leave projects or departments, but nobody remembers to manually "unshare" individual records.

---

### 2. Access Teams (The Cleaner, Modern Solution)

To fix the chaos of manual sharing, Microsoft created **Access Teams**.

#### The Everyday Analogy

Instead of putting 20 separate sticky notes on the security guard’s clipboard for 20 different people, you put a **guest list whiteboard** right on the door of the project room.

* The team lead writes Alice, Bob, and Charlie on the whiteboard.
* They immediately get access to work in that room.
* When Bob finishes his part, the lead simply erases his name from the whiteboard. His access vanishes instantly.

#### How Access Teams Work in Dataverse

Access Teams are designed for dynamic, ad-hoc collaboration on individual records without the administrative overhead of traditional security roles:

1. **Access Team Template:**
An administrator creates a blueprint defining permissions once—for example, a template called **"Opportunity Collaborators"** that grants `Read` and `Write` privileges.
2. **Subgrid on the Form:**
You add an "Access Team" subgrid to the Opportunity form and attach that template.
3. **Self-Service Collaboration:**
The Opportunity owner doesn't need to navigate into deep sharing menus. They simply click **"Add User"** in the subgrid and select their colleagues from other departments.
4. **Behind the Scenes:**
Dataverse automatically creates a lightweight, system-managed team tied directly to that specific record and assigns the rights defined in the template. When you remove a person from the subgrid, their rights are immediately revoked.

---

### Comparing the Two Approaches

| Feature | Manual Sharing (Direct POA) | Access Teams (Template-Driven) |
| --- | --- | --- |
| **How It's Done** | Click *Share* button $\rightarrow$ search user $\rightarrow$ check individual permission boxes. | Add user directly into a subgrid on the record form. |
| **Visibility** | Hidden inside the record's "Share" dialog; hard to audit at a glance. | Visible right on the form so everyone knows who is on the team. |
| **Permission Management** | Set manually each time (prone to human error). | Standardized by the administrator using an Access Team Template. |
| **Revoking Access** | Must open the sharing dialog, find the user, and remove them manually. | Remove the user's name from the subgrid. |
| **Performance Impact** | Creates separate individual share entries; quickly bloats the POA table. | Optimized by the platform engine specifically for record-level collaboration. |

Would you like to look at the differences between **Owner Teams** and **Access Teams**, as that is another frequent exam topic?


