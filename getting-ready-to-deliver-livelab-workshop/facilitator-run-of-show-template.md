# Lab 7: Complete and Accept the Facilitator Run of Show

## Introduction

Complete this record after Labs 1 through 6. It brings the event plan, delivery owners, readiness evidence, support routes, acceptance, and final decision into one place.

[Download the blank fallback PDF](./facilitator-run-of-show-template.pdf) if you cannot use this page.

<!-- Estimated Time: intentionally not shown in this guide. -->

### Objectives

In this lab, you will:

- Record the final event facts, owners, run of show, support route, and fallback.
- Confirm that the outputs from Labs 1 through 6 are complete.
- Capture account-team acceptance and the final readiness decision.

<form id="facilitator-run-of-show-form" class="facilitator-run-of-show-form" data-lab7-form autocomplete="off" novalidate hidden></form>

## Task 1: Record Event and Delivery Details

1. Complete the event, access, owner, run-of-show, and handoff fields with the approved values from Labs 1 through 6.

2. Leave backup fields blank only when the delivery team has no backup for that role or decision.

<div class="facilitator-run-of-show-form" data-lab7-section="event-delivery">
  <fieldset>
    <legend>Event and access</legend>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="event-name">Event name</label>
        <input id="event-name" name="event-name" type="text" placeholder="Example: ACME LiveLab readiness session" required>
      </div>
      <div class="facilitator-form-field">
        <label for="workshop-title">Workshop title</label>
        <input id="workshop-title" name="workshop-title" type="text" placeholder="Example: Getting Ready to Deliver a LiveLab" required>
      </div>
      <div class="facilitator-form-field">
        <label for="event-date">Event date</label>
        <input id="event-date" name="event-date" type="date" placeholder="Example: 2026-08-15" required>
      </div>
      <div class="facilitator-form-field">
        <label for="event-start-time">Start time</label>
        <input id="event-start-time" name="event-start-time" type="time" placeholder="Example: 09:00" required>
      </div>
      <div class="facilitator-form-field">
        <label for="event-time-zone">Time zone</label>
        <select id="event-time-zone" name="event-time-zone" data-lab7-time-zone required>
          <option value="">Select a time zone</option>
        </select>
      </div>
      <div class="facilitator-form-field">
        <label for="attendee-url">Verified attendee URL</label>
        <input id="attendee-url" name="attendee-url" type="url" placeholder="Example: https://livelabs.oracle.com/pls/apex/..." required>
      </div>
      <div class="facilitator-form-field">
        <label for="event-code">Event code</label>
        <input id="event-code" name="event-code" type="text" placeholder="Example: ADB26AI" required>
      </div>
      <div class="facilitator-form-field lab7-choice-group" data-lab7-required-group="access-path" data-lab7-required-message="Select Sandbox or Own tenancy.">
        <p class="lab7-choice-group__label">Selected access path</p>
        <div class="lab7-choice-list">
          <div class="facilitator-choice">
            <input id="access-path-sandbox" name="access-path" type="checkbox" value="sandbox">
            <label for="access-path-sandbox">Sandbox</label>
          </div>
          <div class="facilitator-choice">
            <input id="access-path-own-tenancy" name="access-path" type="checkbox" value="own-tenancy">
            <label for="access-path-own-tenancy">Own tenancy</label>
          </div>
        </div>
        <small class="lab7-field__hint">Select every access path the delivery team must support.</small>
      </div>
      <div class="facilitator-form-field">
        <label for="expected-first-screen">Expected first screen</label>
        <input id="expected-first-screen" name="expected-first-screen" type="text" placeholder="Example: LiveLabs reservation page" required>
      </div>
      <div class="facilitator-form-field">
        <label for="attendee-count">Expected attendee count</label>
        <input id="attendee-count" name="attendee-count" type="number" min="1" step="1" placeholder="Example: 25" required>
      </div>
      <div class="facilitator-form-field">
        <label for="capacity-decision">Capacity and provisioning decision</label>
        <select id="capacity-decision" name="capacity-decision" required>
          <option value="">Select a decision</option>
          <option value="standard-capacity-confirmed">Standard capacity confirmed</option>
          <option value="pre-provisioning-confirmed">Pre-provisioning confirmed</option>
          <option value="pending-livelabs-team">Pending Oracle LiveLabs Team confirmation</option>
          <option value="other">Other approved decision</option>
        </select>
      </div>
      <div class="facilitator-form-field">
        <label for="expected-provisioning-time">Expected provisioning time</label>
        <input id="expected-provisioning-time" name="expected-provisioning-time" type="text" placeholder="Example: 10 to 15 minutes">
      </div>
      <div class="facilitator-form-field">
        <label for="actual-provisioning-time">Actual dry-run provisioning time</label>
        <input id="actual-provisioning-time" name="actual-provisioning-time" type="text" placeholder="Example: 12 minutes" required>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Delivery owners and backups</legend>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="lead-facilitator-owner">Lead facilitator</label>
        <input id="lead-facilitator-owner" name="lead-facilitator-owner" type="text" placeholder="Example: Jane Doe" required>
      </div>
      <div class="facilitator-form-field">
        <label for="lead-facilitator-backup">Lead facilitator backup</label>
        <input id="lead-facilitator-backup" name="lead-facilitator-backup" type="text" placeholder="Example: Backup facilitator">
      </div>
      <div class="facilitator-form-field">
        <label for="screen-driver-owner">Screen driver</label>
        <input id="screen-driver-owner" name="screen-driver-owner" type="text" placeholder="Example: Alex Driver" required>
      </div>
      <div class="facilitator-form-field">
        <label for="screen-driver-backup">Screen driver backup</label>
        <input id="screen-driver-backup" name="screen-driver-backup" type="text" placeholder="Example: Backup screen driver">
      </div>
      <div class="facilitator-form-field">
        <label for="chat-support-owner">Chat and support owner</label>
        <input id="chat-support-owner" name="chat-support-owner" type="text" placeholder="Example: Priya Support" required>
      </div>
      <div class="facilitator-form-field">
        <label for="chat-support-backup">Chat and support backup</label>
        <input id="chat-support-backup" name="chat-support-backup" type="text" placeholder="Example: Backup support owner">
      </div>
      <div class="facilitator-form-field">
        <label for="technical-sme-owner">Technical SME</label>
        <input id="technical-sme-owner" name="technical-sme-owner" type="text" placeholder="Example: Chris SME" required>
      </div>
      <div class="facilitator-form-field">
        <label for="technical-sme-backup">Technical SME backup</label>
        <input id="technical-sme-backup" name="technical-sme-backup" type="text" placeholder="Example: Backup SME">
      </div>
      <div class="facilitator-form-field">
        <label for="event-coordinator-owner">Event coordinator</label>
        <input id="event-coordinator-owner" name="event-coordinator-owner" type="text" placeholder="Example: Morgan Coordinator" required>
      </div>
      <div class="facilitator-form-field">
        <label for="event-coordinator-backup">Event coordinator backup</label>
        <input id="event-coordinator-backup" name="event-coordinator-backup" type="text" placeholder="Example: Backup coordinator">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Run of show and handoffs</legend>
    <div class="facilitator-form-field">
      <label for="run-of-show-milestones">Milestones, times, owners, backups, and status</label>
      <textarea id="run-of-show-milestones" name="run-of-show-milestones" rows="8" aria-describedby="run-of-show-milestones-help" placeholder="Example: 9:00 welcome, 9:05 access check, 9:15 launch, 9:30 hands-on, 10:45 wrap-up." required></textarea>
      <small id="run-of-show-milestones-help">Cover the pre-event check, welcome and first screen, access launch, product context, hands-on work, questions, and wrap-up.</small>
    </div>
    <div class="facilitator-form-field">
      <label for="delivery-handoffs">Planned handoffs and operational decisions</label>
      <textarea id="delivery-handoffs" name="delivery-handoffs" rows="7" aria-describedby="delivery-handoffs-help" placeholder="Example: Move account issues to chat; pause only if more than five attendees share the same blocker." required></textarea>
      <small id="delivery-handoffs-help">For setup-to-hands-on, shared-blocker pause, individual support, watch-only fallback, and workshop-content escalation, record the cue or timing, owner, backup, and status.</small>
    </div>
  </fieldset>
</div>

## Task 2: Confirm Readiness, Support, and Fallback

1. Check each Lab 1 through Lab 6 output only after the team has completed the required action for that lab.

2. Record the support route, escalation route, shared-blocker pause owner, fallback, and any open risk before the final decision.

<div class="facilitator-run-of-show-form" data-lab7-section="readiness-fallback">
  <fieldset>
    <legend>Outputs completed in Labs 1 through 6</legend>
    <div class="facilitator-checklist">
      <input id="lab-1-output-confirmed" name="lab-1-output-confirmed" type="checkbox" required>
      <label for="lab-1-output-confirmed">Lab 1: Delivery roles, backups, run-of-show milestones, and handoffs are assigned.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="lab-2-output-confirmed" name="lab-2-output-confirmed" type="checkbox" required>
      <label for="lab-2-output-confirmed">Lab 2: Event code, attendee URL, access path, capacity, and provisioning plan are confirmed.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="lab-3-output-confirmed" name="lab-3-output-confirmed" type="checkbox" required>
      <label for="lab-3-output-confirmed">Lab 3: The exact attendee path was tested end to end, and timing and issues were recorded.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="lab-4-output-confirmed" name="lab-4-output-confirmed" type="checkbox" required>
      <label for="lab-4-output-confirmed">Lab 4: Attendee prerequisites and verified event instructions were sent.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="lab-5-output-confirmed" name="lab-5-output-confirmed" type="checkbox" required>
      <label for="lab-5-output-confirmed">Lab 5: The live opening check was completed and the current readiness state was recorded.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="lab-6-output-confirmed" name="lab-6-output-confirmed" type="checkbox" required>
      <label for="lab-6-output-confirmed">Lab 6: Support and escalation routes were confirmed for delivery, access, workshop, and platform issues.</label>
    </div>
  </fieldset>

  <fieldset>
    <legend>Support, escalation, pause, fallback, and open risks</legend>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="support-route">Primary support route and contact</label>
        <input id="support-route" name="support-route" type="text" placeholder="Example: Zoom chat monitored by Priya Support" required>
      </div>
      <div class="facilitator-form-field">
        <label for="escalation-route">Escalation route and contact</label>
        <input id="escalation-route" name="escalation-route" type="text" placeholder="Example: #livelabs-authors-help, workshop owner tagged" required>
      </div>
      <div class="facilitator-form-field">
        <label for="pause-decision-owner">Shared-blocker pause decision owner</label>
        <input id="pause-decision-owner" name="pause-decision-owner" type="text" placeholder="Example: Lead facilitator" required>
      </div>
      <div class="facilitator-form-field">
        <label for="pause-decision-trigger">Shared-blocker pause trigger</label>
        <input id="pause-decision-trigger" name="pause-decision-trigger" type="text" placeholder="Example: More than five attendees blocked by same error">
      </div>
    </div>
    <div class="facilitator-form-field">
      <label for="fallback-plan">Fallback or alternate delivery path</label>
      <textarea id="fallback-plan" name="fallback-plan" rows="4" placeholder="Example: Switch blocked attendees to watch-only mode and schedule follow-up access help." required></textarea>
    </div>
    <div class="facilitator-form-field">
      <label for="open-risk">Open risk or unresolved item</label>
      <textarea id="open-risk" name="open-risk" rows="4" placeholder="Example: Capacity confirmation pending for 60 attendees."></textarea>
    </div>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="open-risk-owner">Open-risk owner</label>
        <input id="open-risk-owner" name="open-risk-owner" type="text" placeholder="Example: Event coordinator" data-lab7-condition-note="required if open risk is entered">
      </div>
      <div class="facilitator-form-field">
        <label for="open-risk-deadline">Open-risk deadline</label>
        <input id="open-risk-deadline" name="open-risk-deadline" type="datetime-local" placeholder="Example: 2026-08-14 17:00" data-lab7-condition-note="required if open risk is entered">
      </div>
    </div>
  </fieldset>
</div>

## Task 3: Record Account-Team Acceptance and Final Decision

1. Record the account-team representative who read and accepted the delivery actions.

2. Select the final readiness decision and record the owner, time, time zone, and notes for any accepted risk.

3. Print or save the completed record, then store it in the approved event record system.

<div class="facilitator-run-of-show-form" data-lab7-section="acceptance-decision">
  <fieldset>
    <legend>Account-team read-and-understand record</legend>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="account-team-name">Account team</label>
        <input id="account-team-name" name="account-team-name" type="text" placeholder="Example: North America Strategic Accounts" required>
      </div>
      <div class="facilitator-form-field">
        <label for="account-representative-name">Account-team representative</label>
        <input id="account-representative-name" name="account-representative-name" type="text" placeholder="Example: Taylor Account" required>
      </div>
      <div class="facilitator-form-field">
        <label for="account-representative-email">Representative Oracle email</label>
        <input id="account-representative-email" name="account-representative-email" type="email" placeholder="Example: taylor.account@oracle.com" required>
      </div>
      <div class="facilitator-form-field">
        <label for="account-representative-role">Representative role</label>
        <input id="account-representative-role" name="account-representative-role" type="text" placeholder="Example: Account owner">
      </div>
    </div>
    <div class="facilitator-checklist">
      <input id="acceptance-read-understood" name="acceptance-read-understood" type="checkbox" required>
      <label for="acceptance-read-understood">I have read this guide and understand the account-team preparation and delivery actions.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="acceptance-plan-confirmed" name="acceptance-plan-confirmed" type="checkbox" required>
      <label for="acceptance-plan-confirmed">I confirmed the event path, attendee prerequisites, capacity plan, delivery roles, support route, and fallback with the delivery team.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="acceptance-complete-escalate" name="acceptance-complete-escalate" type="checkbox" required>
      <label for="acceptance-complete-escalate">I commit to completing assigned actions by their deadlines and escalating any blocker through the documented route.</label>
    </div>
    <div class="facilitator-checklist">
      <input id="acceptance-open-items-recorded" name="acceptance-open-items-recorded" type="checkbox" required>
      <label for="acceptance-open-items-recorded">I recorded every unresolved item with an owner, deadline, and escalation route.</label>
    </div>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="acceptance-typed-name">Typed name or electronic approval name</label>
        <input id="acceptance-typed-name" name="acceptance-typed-name" type="text" placeholder="Example: Taylor Account" required>
      </div>
      <div class="facilitator-form-field">
        <label for="acceptance-approval-method">Approval method</label>
        <select id="acceptance-approval-method" name="acceptance-approval-method" required>
          <option value="">Select an approval method</option>
          <option value="typed-name">Typed name</option>
          <option value="approved-electronic-signature">Approved electronic signature</option>
          <option value="other-approved-method">Other approved method</option>
        </select>
      </div>
      <div class="facilitator-form-field">
        <label for="acceptance-date">Acceptance date</label>
        <input id="acceptance-date" name="acceptance-date" type="date" placeholder="Example: 2026-08-14" required>
      </div>
      <div class="facilitator-form-field">
        <label for="acceptance-time">Acceptance time</label>
        <input id="acceptance-time" name="acceptance-time" type="time" placeholder="Example: 16:30">
      </div>
      <div class="facilitator-form-field">
        <label for="acceptance-time-zone">Acceptance time zone</label>
        <select id="acceptance-time-zone" name="acceptance-time-zone" data-lab7-time-zone required>
          <option value="">Select a time zone</option>
        </select>
      </div>
      <div class="facilitator-form-field">
        <label for="acceptance-evidence-id">Stored evidence URL or record ID</label>
        <input id="acceptance-evidence-id" name="acceptance-evidence-id" type="text" placeholder="Example: Jira, WMS, or document record link">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Final readiness decision</legend>
    <div class="facilitator-choice">
      <input id="final-decision-ready" name="final-decision" type="radio" value="ready" required>
      <label for="final-decision-ready">Ready</label>
    </div>
    <div class="facilitator-choice">
      <input id="final-decision-ready-with-risk" name="final-decision" type="radio" value="ready-with-risk">
      <label for="final-decision-ready-with-risk">Ready with risk</label>
    </div>
    <div class="facilitator-choice">
      <input id="final-decision-not-ready" name="final-decision" type="radio" value="not-ready">
      <label for="final-decision-not-ready">Not ready</label>
    </div>
    <div class="facilitator-form-grid">
      <div class="facilitator-form-field">
        <label for="decision-owner">Decision owner</label>
        <input id="decision-owner" name="decision-owner" type="text" placeholder="Example: Lead facilitator" required>
      </div>
      <div class="facilitator-form-field">
        <label for="decision-backup">Decision-owner backup</label>
        <input id="decision-backup" name="decision-backup" type="text" placeholder="Example: Event coordinator">
      </div>
      <div class="facilitator-form-field">
        <label for="decision-time">Decision date and time</label>
        <input id="decision-time" name="decision-time" type="datetime-local" placeholder="Example: 2026-08-14 17:00" required>
      </div>
      <div class="facilitator-form-field">
        <label for="decision-time-zone">Decision time zone</label>
        <select id="decision-time-zone" name="decision-time-zone" data-lab7-time-zone required>
          <option value="">Select a time zone</option>
        </select>
      </div>
    </div>
    <div class="facilitator-form-field">
      <label for="decision-notes">Decision notes, accepted risks, conditions, and next actions</label>
      <textarea id="decision-notes" name="decision-notes" rows="5" placeholder="Example: Ready with risk because capacity confirmation is due by 5 PM. Event coordinator owns follow-up." data-lab7-condition-note="required for Ready with risk or Not ready"></textarea>
    </div>
  </fieldset>

  <div class="facilitator-form-actions">
    <button id="print-completed-run-of-show" data-lab7-print type="button">Print or save the completed run of show</button>
    <button id="clear-facilitator-run-of-show" data-lab7-clear type="button">Clear saved values for this tab</button>
    <p id="lab7-saved-status" class="lab7-saved-status" data-lab7-status aria-live="polite"></p>
  </div>
</div>

## Acknowledgements

- **Author:** Oracle LiveLabs Team, July 2026
