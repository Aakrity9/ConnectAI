# **Product Requirements Document (PRD)** 

# **Product Name (Working Title)**

**ConnectAI** *(working name)*

**Tagline:**  
 *"Meet the people you'll wish you met before leaving the event."*

---

# **1\. Product Vision**

Networking events bring together hundreds or thousands of talented individuals with similar ambitions. However, most attendees never interact with each other.

People usually:

* Stay within their friend groups.  
* Talk only to speakers or judges.  
* Feel awkward approaching strangers.  
* Don't know who shares their interests.  
* Leave the event without making meaningful professional connections.

As a result, attendees miss opportunities to find:

* Future hackathon teammates  
* Startup co-founders  
* Business partners  
* Collaborators  
* Mentors  
* Friends with similar interests

**ConnectAI** uses AI-powered attendee matching to help people discover the most relevant attendees before and during the event, making networking intentional instead of accidental.

---

# **2\. Problem Statement**

Networking events are designed to create connections, but attendee-to-attendee networking remains extremely limited.

Current problems include:

* Most attendees come in groups.  
* Solo attendees feel isolated.  
* Introverts hesitate to initiate conversations.  
* People don't know who they should talk to.  
* Time at events is limited.  
* Valuable connections happen mostly by chance.

Current event apps mainly focus on:

* Event schedules  
* Speaker information  
* Tickets  
* Messaging

They rarely help users discover the *right people* to meet.

---

# **3\. Product Goals**

### **Primary Goal**

Increase meaningful attendee-to-attendee networking.

### **Secondary Goals**

* Help introverts start conversations.  
* Reduce social anxiety during networking.  
* Increase collaboration after events.  
* Help founders discover co-founders.  
* Help students find hackathon teams.  
* Increase attendee satisfaction.  
* Increase event retention.

---

# **4\. Target Users**

## **Primary Users**

### **Solo Attendees**

People attending alone who often feel left out.

Needs:

* Easy introductions  
* Someone to talk to  
* Relevant networking opportunities

---

### **Introverts**

People interested in networking but uncomfortable initiating conversations.

Needs:

* AI conversation starters  
* Confidence  
* Low-pressure networking

---

### **Hackathon Participants**

People looking for:

* Teammates  
* Developers  
* Designers  
* AI Engineers  
* Product Managers

Needs:

* Skill-based matching  
* Team formation

---

### **Startup Founders**

People searching for:

* Co-founders  
* Business partners  
* Technical talent  
* Early employees

Needs:

* Complementary skill matching  
* Founder community

---

### **Students & Early Professionals**

People wanting to expand professional networks.

Needs:

* Career connections  
* Learning opportunities  
* Future collaborators

---

# **5\. User Personas**

## **Persona 1**

**Aarav**

* Engineering student  
* Attends hackathons alone  
* Introvert  
* Wants teammates

Pain Point:

"I don't know who to approach."

---

## **Persona 2**

**Priya**

* Building a startup  
* Looking for technical co-founder

Pain Point:

"There are 300 attendees. I don't know who is interested in startups."

---

## **Persona 3**

**Rahul**

* Product Designer

Needs:

* Meet developers  
* Join AI projects

---

# **6\. User Journey**

## **Before Event**

* Register  
* Create profile  
* AI analyzes profile  
* Receive recommended matches  
* Join micro-groups  
* Schedule meetings

---

## **During Event**

* Check live matches  
* AI suggests nearby attendees  
* Use QR exchange  
* Chat  
* AI suggests conversation starters  
* Join discussion groups

---

## **After Event**

* Save contacts  
* Continue conversations  
* Join community  
* Build long-term network

---

# **7\. Functional Requirements**

## **Feature 1: Smart Attendee Profile**

Profile includes:

* Name  
* Photo  
* College  
* Company  
* Degree  
* Experience  
* Skills  
* Interests  
* Career goals  
* Startup interest  
* Hackathon interest  
* Looking for:  
  * Mentor  
  * Co-founder  
  * Team  
  * Friends  
  * Investors  
* Hobbies  
* Social links  
* Portfolio  
* Availability  
* Attending solo/group

---

## **Feature 2: AI Matchmaking**

The AI recommends attendees using factors such as:

* Shared interests  
* Complementary skills  
* Startup goals  
* Hackathon interests  
* Career aspirations  
* Session attendance  
* Experience level  
* Preferred networking goals

Example:

**87% Match**

Reason:

* Both building AI startups  
* Both attending solo  
* Both interested in Generative AI  
* Both looking for hackathon teammates

---

## **Feature 3: Match Explanation**

Instead of showing only a score,

AI explains:

"You both are interested in AI startups, Product Management, and plan to participate in upcoming hackathons."

This builds trust.

---

## **Feature 4: AI Icebreaker Generator**

Examples:

"I noticed you're also interested in Agentic AI. Which framework are you currently exploring?"

"You've participated in 5 hackathons. Which one taught you the most?"

"I saw you're building a startup. What's the idea?"

---

## **Feature 5: Connection Request**

Simple actions:

* Connect  
* Message  
* Accept  
* Decline

---

## **Feature 6: 1-to-1 Chat**

Supports:

* Text  
* Links  
* Images  
* Calendar invite  
* Meeting reminder

---

## **Feature 7: Group Matching**

AI automatically creates small networking circles.

Example:

Group Alpha

* AI Engineer  
* Backend Developer  
* UI Designer  
* Startup Founder  
* Product Manager

Instead of finding one person,

Users discover an entire team.

---

## **Feature 8: Session-Based Matching**

Example:

Everyone attending

"Future of AI Agents"

gets suggested to each other.

Discussion continues after the session.

---

## **Feature 9: Networking Feed**

Users can post:

* Looking for teammates  
* Looking for co-founder  
* Seeking internship  
* Startup ideas  
* Event photos  
* AI discussions

---

## **Feature 10: Digital Business Card**

Users receive:

* QR Code  
* Digital card  
* One-click contact save

---

## **Feature 11: Organizer Dashboard**

Dashboard shows:

* Total attendees  
* Match acceptance rate  
* Most active users  
* Least connected attendees  
* Popular interests  
* Networking heatmap  
* Sessions generating most networking  
* Group formation statistics

---

# **8\. AI Components**

## **Profile Understanding**

Uses NLP to understand:

* Interests  
* Skills  
* Goals

---

## **Recommendation Engine**

Ranks attendees based on compatibility.

---

## **Icebreaker Generator**

LLM generates personalized conversation starters.

---

## **Group Formation Agent**

Creates balanced networking groups.

---

## **Networking Health Score**

Detects users with few or no connections and recommends additional matches.

---

# **9\. Non-Functional Requirements**

* Fast matching (\<2 seconds)  
* Secure authentication  
* GDPR/privacy compliant  
* Scalable to 50,000+ attendees  
* Mobile-first experience  
* High availability during live events

---

# **10\. User Stories**

### **As a solo attendee,**

I want AI to recommend relevant people before the event so that I don't feel alone.

---

### **As an introvert,**

I want conversation starters so I can comfortably begin networking.

---

### **As a founder,**

I want to find people with complementary skills so I can build my startup team.

---

### **As a hackathon participant,**

I want teammates with different expertise so that we can compete effectively.

---

### **As an organizer,**

I want analytics about attendee engagement so I can improve future events.

---

# **11\. MVP Scope**

Include:

* Registration  
* AI profiles  
* Match recommendations  
* Match explanation  
* Chat  
* Connection requests  
* QR sharing  
* AI icebreakers

Future versions:

* Live location matching  
* Voice introductions  
* AI networking coach  
* Event memory timeline  
* AI networking score  
* Gamification and badges

---

# **12\. Success Metrics (KPIs)**

User Engagement:

* Profile completion rate  
* Daily active users  
* Match acceptance rate  
* Messages exchanged  
* Connections made per attendee  
* Time spent networking

Networking Success:

* Average connections per attendee  
* Solo attendee engagement  
* Introvert participation rate  
* Group formation count  
* Repeat event attendance

Organizer Metrics:

* Networking satisfaction score  
* Event retention  
* App adoption rate  
* Session engagement  
* Organizer renewal rate

---

# **13\. Future Roadmap**

### **Phase 1**

* AI matching  
* Chat  
* QR sharing

### **Phase 2**

* AI micro-groups  
* Session matching  
* Networking feed

### **Phase 3**

* AI networking coach  
* Cross-event networking  
* Founder discovery  
* Investor matching  
* Resume and portfolio analysis  
* Calendar integration  
* LinkedIn/GitHub import

---

# **14\. Competitive Differentiation**

Unlike traditional event apps that focus on schedules, tickets, and messaging, **ConnectAI** focuses on **relationship intelligence**.

Its key differentiators are:

* AI-powered attendee matching  
* Transparent "Why you matched" explanations  
* AI-generated icebreakers  
* Intelligent micro-group formation  
* Networking support for introverts and solo attendees  
* Organizer insights to identify underserved attendees and improve networking outcomes

---

# **15\. Vision Statement**

**ConnectAI transforms networking from a game of chance into a personalized, AI-assisted experience—helping every attendee, especially solo participants and introverts, discover meaningful professional relationships that can lead to hackathon teams, startup co-founders, career opportunities, and long-term collaborations.**

