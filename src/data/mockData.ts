// ─────────────────────────────────────────────
//  Mock sample data – realistic demo content
// ─────────────────────────────────────────────
import type { AIAnalysisResult } from '../types';

export const SAMPLE_NOTES = `Q3 Product Roadmap Sync – July 19, 2026
Attendees: Sarah Chen (PM), Marcus Webb (Engineering Lead), Priya Nair (Design), Alex Torres (Marketing)

Meeting started 10:05 AM, ran 65 minutes.

Sarah opened by reviewing Q2 OKR results. We hit 78% of our target MAU goal (target was 50k, landed at 39k). Conversion from free to paid is at 3.2%, below the 5% target. Churn is concerning – up from 4.1% to 5.8% MoM.

Marcus flagged that the mobile app performance issues are the #1 driver of churn based on exit surveys. The app crashes on Android 13 devices during file upload. He needs 2 engineers pulled from the analytics dashboard project to fix this immediately. Deadline: end of sprint (July 26).

Priya shared redesign concepts for the onboarding flow. The current 7-step wizard has a 62% drop-off at step 4 (payment). New design reduces to 3 steps and defers payment. A/B test should run for 2 weeks starting Monday.

Alex reported that the content marketing pipeline is blocked because legal hasn't reviewed the updated Terms of Service. This is holding up 3 blog posts and a product announcement. Need legal sign-off by July 21.

Key decisions made:
- Pause analytics dashboard feature until mobile crash is resolved
- Approve Priya's 3-step onboarding redesign for A/B testing
- Alex to escalate ToS review to VP Legal today

Open items:
- Marcus to file Jira tickets for mobile fix team by EOD
- Sarah to reschedule Q3 planning with stakeholders after legal clears
- Priya to send design files to engineering by Thursday
- Alex to draft product announcement once ToS is approved

Next meeting: Monday July 22, 9 AM – Mobile crash status update`;

export const MOCK_AI_RESULT: AIAnalysisResult = {
  summary: "Q3 Product Roadmap Sync uncovered critical retention risk: Android crash driving 5.8% churn. Team aligned on three priorities — fix mobile stability, redesign onboarding to cut 62% drop-off, and unblock marketing from legal review. Analytics dashboard deprioritized until mobile is stable.",

  key_decisions: [
    "Pause analytics dashboard — reallocate 2 engineers to Android crash fix",
    "Approve 3-step onboarding redesign for immediate A/B testing",
    "Escalate ToS legal review to VP Legal to unblock marketing pipeline",
  ],

  action_items: [
    {
      id: "t1",
      task: "Fix Android 13 file upload crash",
      owner: "Marcus Webb",
      deadline: "July 26, 2026",
      priority: "critical",
      status: "pending",
    },
    {
      id: "t2",
      task: "File Jira tickets for mobile fix team",
      owner: "Marcus Webb",
      deadline: "July 19, 2026 EOD",
      priority: "critical",
      status: "in-progress",
    },
    {
      id: "t3",
      task: "Escalate ToS review to VP Legal",
      owner: "Alex Torres",
      deadline: "July 19, 2026",
      priority: "high",
      status: "pending",
    },
    {
      id: "t4",
      task: "Launch onboarding A/B test (3-step flow)",
      owner: "Priya Nair",
      deadline: "July 21, 2026",
      priority: "high",
      status: "pending",
    },
    {
      id: "t5",
      task: "Send redesign files to engineering",
      owner: "Priya Nair",
      deadline: "July 24, 2026",
      priority: "medium",
      status: "pending",
    },
    {
      id: "t6",
      task: "Draft product announcement post",
      owner: "Alex Torres",
      deadline: "July 22, 2026",
      priority: "medium",
      status: "pending",
    },
    {
      id: "t7",
      task: "Reschedule Q3 stakeholder planning meeting",
      owner: "Sarah Chen",
      deadline: "July 22, 2026",
      priority: "low",
      status: "pending",
    },
  ],

  follow_up_email: {
    subject: "Action Items & Decisions – Q3 Roadmap Sync (July 19)",
    to: "sarah.chen@company.com, marcus.webb@company.com, priya.nair@company.com, alex.torres@company.com",
    body: `Hi team,

Thanks for a productive sync today. Here's a recap of decisions and your action items:

**Key Decisions:**
• Android crash fix is now top priority — analytics dashboard paused until resolved
• Priya's 3-step onboarding redesign approved for A/B testing (starting Monday)
• Alex escalating ToS review to VP Legal immediately

**Your Action Items:**

Marcus:
→ File Jira tickets for mobile crash fix team → TODAY EOD
→ Deliver Android fix → July 26 (Sprint deadline)

Alex:
→ Escalate ToS to VP Legal → TODAY
→ Draft product announcement (once ToS clears) → July 22

Priya:
→ Kick off A/B test for 3-step onboarding → July 21
→ Send design files to engineering → July 24

Sarah:
→ Reschedule Q3 stakeholder planning → July 22

Next touchpoint: Monday July 22 at 9 AM for mobile crash status update.

Let me know if I missed anything.

Best,
[Your Name]`,
  },

  suggested_schedule: [
    { time: "9:00 AM", duration: "30 min", title: "File Jira tickets – mobile crash", type: "focus" },
    { time: "9:30 AM", duration: "15 min", title: "Escalate ToS to VP Legal (call)", type: "meeting" },
    { time: "9:45 AM", duration: "15 min", title: "Send A/B test brief to Priya", type: "review" },
    { time: "10:00 AM", duration: "20 min", title: "Send follow-up email to team", type: "review" },
    { time: "10:20 AM", duration: "10 min", title: "Break", type: "break" },
    { time: "10:30 AM", duration: "90 min", title: "Deep focus – product announcement draft", type: "focus" },
    { time: "12:00 PM", duration: "30 min", title: "Lunch", type: "break" },
    { time: "12:30 PM", duration: "60 min", title: "Android crash triage with Marcus", type: "meeting" },
  ],

  insights: [
    "Churn increased 41% MoM — mobile stability is your most urgent retention lever",
    "62% onboarding drop-off at payment step suggests friction, not intent — design fix could recover 15-20% of losses",
    "Legal bottleneck is silently blocking 3 revenue-generating content assets",
    "Team is well-aligned on priorities — clear owner for every action item",
    "Consider weekly async standups to catch blockers like the ToS issue earlier",
  ],

  sentiment: "mixed",
  meeting_efficiency_score: 74,
};
