(function () {
    "use strict";

    var STORAGE_VERSION = 2;
    var STORAGE_PREFIX = "livelabs:lab7-run-of-show:v" + STORAGE_VERSION + ":";
    var FORM_MARKER_SELECTOR = "[data-lab7-form], #facilitator-run-of-show-form, .lab7-form, .facilitator-run-of-show-form";
    var PRINT_SELECTOR = "[data-lab7-print], #lab7-print, #print-completed-run-of-show";
    var CLEAR_SELECTOR = "[data-lab7-clear], #lab7-clear, #clear-facilitator-run-of-show";
    var STATUS_SELECTOR = "[data-lab7-status], #lab7-saved-status, #facilitator-run-of-show-status";
    var TIME_ZONE_SELECTOR = "select[data-lab7-time-zone]";
    var REQUIRED_GROUP_SELECTOR = "[data-lab7-required-group]";
    var PLACEHOLDER_SELECTOR = "input[placeholder], textarea[placeholder]";
    var FIELD_NOTE_SELECTOR = ".lab7-required-marker, .lab7-field-note, .lab7-conditional-note";
    var VALIDATION_MESSAGE_CLASS = "lab7-validation-message";
    var COMMON_TIME_ZONE_FALLBACK = [
        "UTC",
        "Africa/Cairo",
        "Africa/Johannesburg",
        "America/Anchorage",
        "America/Argentina/Buenos_Aires",
        "America/Bogota",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Mexico_City",
        "America/New_York",
        "America/Phoenix",
        "America/Sao_Paulo",
        "America/Toronto",
        "Asia/Dubai",
        "Asia/Hong_Kong",
        "Asia/Jakarta",
        "Asia/Kolkata",
        "Asia/Seoul",
        "Asia/Shanghai",
        "Asia/Singapore",
        "Asia/Tokyo",
        "Australia/Melbourne",
        "Australia/Sydney",
        "Europe/Amsterdam",
        "Europe/Berlin",
        "Europe/Bucharest",
        "Europe/London",
        "Europe/Madrid",
        "Europe/Paris",
        "Pacific/Auckland"
    ];
    var initializedRoots = new WeakSet();
    var printTextareaStyles = [];
    var syncQueued = false;
    var cachedTimeZones = null;
    var cachedTimeZoneOptionsHtml = null;

    function storageKey() {
        return STORAGE_PREFIX + window.location.pathname;
    }

    function findRoot() {
        var content = document.getElementById("module-content");
        return content && content.querySelector(FORM_MARKER_SELECTOR) ? content : null;
    }

    function isSavedControl(target) {
        return target &&
            target.matches &&
            target.matches("input[name], textarea[name], select[name]");
    }

    function getControls(root) {
        return Array.prototype.slice.call(
            root.querySelectorAll("input[name], textarea[name], select[name]")
        ).filter(function (control) {
            var type = (control.type || "").toLowerCase();
            return !control.disabled &&
                !control.matches("[data-lab7-no-save]") &&
                ["button", "submit", "reset", "file", "password"].indexOf(type) === -1;
        });
    }

    function uniqueSorted(values) {
        var seen = Object.create(null);
        var normalized = [];

        values.forEach(function (value) {
            if (typeof value === "string" && value && !seen[value]) {
                seen[value] = true;
                normalized.push(value);
            }
        });
        if (!seen.UTC) {
            normalized.push("UTC");
        }
        normalized.sort(function (left, right) {
            return left.localeCompare(right);
        });
        return normalized;
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function supportedTimeZones() {
        var zones = [];

        if (cachedTimeZones) {
            return cachedTimeZones;
        }

        try {
            if (window.Intl && typeof Intl.supportedValuesOf === "function") {
                zones = Intl.supportedValuesOf("timeZone");
            }
        } catch (error) {
            zones = [];
        }

        cachedTimeZones = uniqueSorted(zones.length ? zones : COMMON_TIME_ZONE_FALLBACK);
        return cachedTimeZones;
    }

    function timeZoneOptionsHtml() {
        if (!cachedTimeZoneOptionsHtml) {
            cachedTimeZoneOptionsHtml = supportedTimeZones().map(function (zone) {
                return "<option value=\"" + escapeHtml(zone) + "\">" + escapeHtml(zone.replace(/_/g, " ")) + "</option>";
            }).join("");
        }
        return cachedTimeZoneOptionsHtml;
    }

    function populateTimeZones(root) {
        var optionsHtml = timeZoneOptionsHtml();

        Array.prototype.forEach.call(root.querySelectorAll(TIME_ZONE_SELECTOR), function (select) {
            var currentValue = select.value;

            if (select.getAttribute("data-lab7-time-zone-populated") === "true") {
                return;
            }

            select.insertAdjacentHTML("beforeend", optionsHtml);
            select.setAttribute("data-lab7-time-zone-populated", "true");
            if (currentValue) {
                select.value = currentValue;
            }
        });
    }

    function preparePlaceholders(root) {
        Array.prototype.forEach.call(root.querySelectorAll(PLACEHOLDER_SELECTOR), function (control) {
            if (!control.getAttribute("data-lab7-placeholder")) {
                control.setAttribute("data-lab7-placeholder", control.getAttribute("placeholder") || "");
            }
            if (!control.value && !control.getAttribute("placeholder")) {
                control.setAttribute("placeholder", control.getAttribute("data-lab7-placeholder") || "");
            }
        });
    }

    // Labels are annotated from the real validation state so visible required
    // markers cannot drift away from the controls that block printing.

    function hidePlaceholder(control) {
        if (!control || !control.matches || !control.matches(PLACEHOLDER_SELECTOR) || control.value) {
            return;
        }
        if (!control.getAttribute("data-lab7-placeholder")) {
            control.setAttribute("data-lab7-placeholder", control.getAttribute("placeholder") || "");
        }
        control.setAttribute("placeholder", "");
    }

    function restorePlaceholder(control) {
        if (!control || !control.matches || !control.matches(PLACEHOLDER_SELECTOR) || control.value) {
            return;
        }
        control.setAttribute("placeholder", control.getAttribute("data-lab7-placeholder") || "");
    }

    function restorePlaceholders(root) {
        Array.prototype.forEach.call(root.querySelectorAll(PLACEHOLDER_SELECTOR), restorePlaceholder);
    }

    function labelForControl(root, control) {
        if (!control.id) {
            return null;
        }
        return root.querySelector("label[for='" + control.id + "']") ||
            document.querySelector("label[for='" + control.id + "']");
    }

    function addFieldNote(target, type, text) {
        var note;

        if (!target || target.querySelector(FIELD_NOTE_SELECTOR)) {
            return;
        }

        note = document.createElement("span");
        if (type === "required") {
            note.className = "lab7-required-marker";
            note.textContent = " *";
            note.title = "Required";
        } else if (type === "conditional") {
            note.className = "lab7-conditional-note";
            note.textContent = " (" + text + ")";
        } else {
            note.className = "lab7-field-note";
            note.textContent = " (optional)";
        }
        target.appendChild(note);
    }

    function annotateRequiredGroups(root) {
        Array.prototype.forEach.call(root.querySelectorAll(REQUIRED_GROUP_SELECTOR), function (group) {
            addFieldNote(group.querySelector(".lab7-choice-group__label, legend, label"), "required");
        });
    }

    function annotateRadioGroups(root) {
        var handled = Object.create(null);

        getControls(root).forEach(function (control) {
            var fieldset;

            if ((control.type || "").toLowerCase() !== "radio" || !control.required || handled[control.name]) {
                return;
            }

            handled[control.name] = true;
            fieldset = control.closest("fieldset");
            addFieldNote(fieldset ? fieldset.querySelector("legend") : labelForControl(root, control), "required");
        });
    }

    function annotateFieldLabels(root) {
        annotateRequiredGroups(root);
        annotateRadioGroups(root);

        getControls(root).forEach(function (control) {
            var type = (control.type || "").toLowerCase();
            var label;
            var conditionNote;

            if (type === "radio" || control.closest(REQUIRED_GROUP_SELECTOR)) {
                return;
            }

            label = labelForControl(root, control);
            if (!label) {
                return;
            }

            conditionNote = control.getAttribute("data-lab7-condition-note");
            if (control.required) {
                addFieldNote(label, "required");
            } else if (conditionNote) {
                addFieldNote(label, "conditional", conditionNote);
            } else {
                addFieldNote(label, "optional");
            }
        });
    }

    function captureState(root) {
        var ordinals = Object.create(null);
        var controls = getControls(root).map(function (control) {
            var type = (control.type || control.tagName || "").toLowerCase();
            var ordinalKey = control.name + "\u0000" + type;
            var ordinal = ordinals[ordinalKey] || 0;
            var item = {
                name: control.name,
                type: type,
                ordinal: ordinal
            };

            ordinals[ordinalKey] = ordinal + 1;
            if (type === "checkbox" || type === "radio") {
                item.checked = control.checked;
                item.value = control.value;
            } else if (type === "select-multiple") {
                item.values = Array.prototype.filter.call(control.options, function (option) {
                    return option.selected;
                }).map(function (option) {
                    return option.value;
                });
            } else {
                item.value = control.value;
            }
            return item;
        });

        return {
            version: STORAGE_VERSION,
            pathname: window.location.pathname,
            controls: controls
        };
    }

    function findSavedControl(root, item) {
        var ordinal = 0;
        var controls = getControls(root);

        for (var index = 0; index < controls.length; index += 1) {
            var control = controls[index];
            var type = (control.type || control.tagName || "").toLowerCase();
            if (control.name === item.name && type === item.type) {
                if (ordinal === item.ordinal) {
                    return control;
                }
                ordinal += 1;
            }
        }
        return null;
    }

    function applyState(root, state) {
        if (!state ||
            state.version !== STORAGE_VERSION ||
            state.pathname !== window.location.pathname ||
            !Array.isArray(state.controls)) {
            return false;
        }

        state.controls.forEach(function (item) {
            var control = findSavedControl(root, item);
            if (!control) {
                return;
            }
            if (item.type === "checkbox" || item.type === "radio") {
                control.checked = Boolean(item.checked);
            } else if (item.type === "select-multiple" && Array.isArray(item.values)) {
                Array.prototype.forEach.call(control.options, function (option) {
                    option.selected = item.values.indexOf(option.value) !== -1;
                });
            } else if (typeof item.value === "string") {
                control.value = item.value;
            }
        });
        return true;
    }

    function statusElement(root) {
        return root.querySelector(STATUS_SELECTOR);
    }

    function setStatus(root, message, state) {
        var status = statusElement(root);
        if (!status) {
            return;
        }
        status.textContent = message;
        if (state) {
            status.setAttribute("data-state", state);
        } else {
            status.removeAttribute("data-state");
        }
    }

    function labelText(control) {
        var label = control.id ? document.querySelector("label[for='" + control.id + "']") : null;
        var labelClone;
        var text;

        if (label) {
            labelClone = label.cloneNode(true);
            Array.prototype.forEach.call(labelClone.querySelectorAll(FIELD_NOTE_SELECTOR), function (note) {
                note.parentNode.removeChild(note);
            });
            text = labelClone.textContent;
        } else {
            text = control.getAttribute("aria-label");
        }

        if (!text) {
            text = (control.name || "this field").replace(/-/g, " ");
        }
        return text.replace(/\s+/g, " ").trim();
    }

    function lowerFirst(value) {
        return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
    }

    function validationText(control) {
        var label = labelText(control);
        var type = (control.type || "").toLowerCase();
        var validity = control.validity || {};

        if (control.getAttribute("data-lab7-required-message")) {
            return control.getAttribute("data-lab7-required-message");
        }
        if (validity.customError && control.validationMessage) {
            return control.validationMessage;
        }
        if (type === "checkbox") {
            return "Confirm " + lowerFirst(label) + ".";
        }
        if (type === "radio") {
            return "Select " + lowerFirst(label) + ".";
        }
        if (validity.typeMismatch && type === "email") {
            return "Enter a valid Oracle email address.";
        }
        if (validity.typeMismatch && type === "url") {
            return "Enter a valid URL, including https://.";
        }
        if (validity.rangeUnderflow || validity.badInput || validity.stepMismatch) {
            return "Enter a whole number of at least " + (control.getAttribute("min") || "1") + ".";
        }
        if (control.tagName === "SELECT") {
            return "Choose " + lowerFirst(label) + ".";
        }
        return "Enter " + lowerFirst(label) + ".";
    }

    function messageIdForControl(control) {
        return (control.id || control.name || "field") + "-validation";
    }

    function describedByList(control) {
        return (control.getAttribute("aria-describedby") || "")
            .split(/\s+/)
            .filter(Boolean);
    }

    function addDescribedBy(control, id) {
        var ids = describedByList(control);

        if (ids.indexOf(id) === -1) {
            ids.push(id);
            control.setAttribute("aria-describedby", ids.join(" "));
        }
    }

    function controlContainer(control) {
        return control.closest(".facilitator-form-field, .lab7-field, .facilitator-checklist, .facilitator-choice, .lab7-choice") ||
            control.parentNode;
    }

    function messageElementForControl(control) {
        var id = messageIdForControl(control);
        var existing = document.getElementById(id);
        var container = controlContainer(control);
        var message;

        if (existing) {
            return existing;
        }
        message = document.createElement("p");
        message.id = id;
        message.className = VALIDATION_MESSAGE_CLASS;
        message.hidden = true;
        if (container) {
            container.appendChild(message);
        }
        addDescribedBy(control, id);
        return message;
    }

    function setControlMessage(control, message) {
        var container = controlContainer(control);
        var element = messageElementForControl(control);

        if (message) {
            control.setAttribute("aria-invalid", "true");
            if (container) {
                container.setAttribute("data-lab7-invalid", "true");
            }
            element.textContent = message;
            element.hidden = false;
        } else {
            control.removeAttribute("aria-invalid");
            if (container) {
                container.removeAttribute("data-lab7-invalid");
            }
            element.textContent = "";
            element.hidden = true;
        }
    }

    function messageElementForGroup(group, suffix) {
        var id = group.getAttribute("data-lab7-validation-id");
        var message;

        if (!id) {
            id = (group.getAttribute("data-lab7-required-group") || suffix || "group") + "-validation";
            group.setAttribute("data-lab7-validation-id", id);
        }
        message = document.getElementById(id);
        if (!message) {
            message = document.createElement("p");
            message.id = id;
            message.className = VALIDATION_MESSAGE_CLASS;
            message.hidden = true;
            group.appendChild(message);
        }
        return message;
    }

    function setGroupMessage(group, controls, message) {
        var element = messageElementForGroup(group, "group");

        Array.prototype.forEach.call(controls, function (control) {
            if (message) {
                control.setAttribute("aria-invalid", "true");
                addDescribedBy(control, element.id);
            } else {
                control.removeAttribute("aria-invalid");
            }
        });

        if (message) {
            group.setAttribute("data-lab7-invalid", "true");
            element.textContent = message;
            element.hidden = false;
        } else {
            group.removeAttribute("data-lab7-invalid");
            element.textContent = "";
            element.hidden = true;
        }
    }

    function save(root) {
        try {
            window.sessionStorage.setItem(storageKey(), JSON.stringify(captureState(root)));
            setStatus(
                root,
                "Saved at " +
                    new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date()) +
                    ".",
                "saved"
            );
            return true;
        } catch (error) {
            setStatus(root, "Saving is unavailable. Print or save the completed record now.", "error");
            return false;
        }
    }

    function restore(root) {
        var serialized;
        var restored = false;

        try {
            serialized = window.sessionStorage.getItem(storageKey());
            if (serialized) {
                restored = applyState(root, JSON.parse(serialized));
            }
        } catch (error) {
            setStatus(root, "Saving is unavailable. Print or save the completed record now.", "error");
            return;
        }

        if (restored) {
            setStatus(root, "Restored saved entries.", "restored");
        } else {
            setStatus(root, "", "ready");
        }
    }

    function resetRoot(root) {
        if (typeof root.reset === "function") {
            root.reset();
            return;
        }

        getControls(root).forEach(function (control) {
            var type = (control.type || "").toLowerCase();
            if (type === "checkbox" || type === "radio") {
                control.checked = control.defaultChecked;
            } else if (control.tagName === "SELECT") {
                Array.prototype.forEach.call(control.options, function (option) {
                    option.selected = option.defaultSelected;
                });
            } else {
                control.value = control.defaultValue || "";
            }
        });
    }

    function clearValidation(root) {
        getControls(root).forEach(function (control) {
            control.setCustomValidity("");
            setControlMessage(control, "");
        });
        Array.prototype.forEach.call(root.querySelectorAll(REQUIRED_GROUP_SELECTOR), function (group) {
            var controls = group.querySelectorAll("input, select, textarea");
            setGroupMessage(group, controls, "");
        });
    }

    function clear(root) {
        if (!window.confirm("Clear every Lab 7 entry saved in this browser tab? This cannot be undone.")) {
            return;
        }

        try {
            window.sessionStorage.removeItem(storageKey());
        } catch (error) {
            // Reset the visible form even if browser storage is unavailable.
        }
        resetRoot(root);
        restorePlaceholders(root);
        clearValidation(root);
        setStatus(root, "Entries cleared.", "cleared");

        var firstControl = getControls(root)[0];
        if (firstControl) {
            firstControl.focus();
        }
    }

    function setConditionalValidity(control, invalid, message) {
        if (!control) {
            return;
        }
        control.setCustomValidity(invalid ? message : "");
    }

    function applyConditionalRequirements(root) {
        var openRisk = root.querySelector("#open-risk");
        var openRiskOwner = root.querySelector("#open-risk-owner");
        var openRiskDeadline = root.querySelector("#open-risk-deadline");
        var finalDecision = root.querySelector("input[name='final-decision']:checked");
        var decisionNotes = root.querySelector("#decision-notes");
        var hasOpenRisk = openRisk && openRisk.value.trim() !== "";
        var needsDecisionNotes = finalDecision &&
            (finalDecision.value === "ready-with-risk" || finalDecision.value === "not-ready") &&
            decisionNotes &&
            decisionNotes.value.trim() === "";

        setConditionalValidity(openRiskOwner, hasOpenRisk && openRiskOwner.value.trim() === "", "Enter the owner for the open risk.");
        setConditionalValidity(openRiskDeadline, hasOpenRisk && openRiskDeadline.value.trim() === "", "Enter the deadline for the open risk.");
        setConditionalValidity(decisionNotes, needsDecisionNotes, "Record the risk, condition, or next action for this decision.");
    }

    // The Print button is the quality gate: it validates required fields,
    // conditional fields, checkbox groups, and the final readiness radio group.
    function validateControl(control, show) {
        var type = (control.type || "").toLowerCase();
        var valid;

        if (type === "radio") {
            return true;
        }

        if (type === "checkbox") {
            valid = !control.required || control.checked;
        } else {
            valid = control.checkValidity();
        }

        if (!valid && show) {
            setControlMessage(control, validationText(control));
        } else if (valid) {
            setControlMessage(control, "");
        }

        return valid;
    }

    function validateRequiredChoiceGroups(root, show) {
        var firstInvalid = null;
        var valid = true;

        Array.prototype.forEach.call(root.querySelectorAll(REQUIRED_GROUP_SELECTOR), function (group) {
            var name = group.getAttribute("data-lab7-required-group");
            var controls = Array.prototype.filter.call(group.querySelectorAll("input[type='checkbox'][name]"), function (control) {
                return control.name === name;
            });
            var checked = controls.some(function (control) {
                return control.checked;
            });

            if (!checked) {
                valid = false;
                firstInvalid = firstInvalid || controls[0] || group;
                if (show) {
                    setGroupMessage(
                        group,
                        controls,
                        group.getAttribute("data-lab7-required-message") || "Select at least one option."
                    );
                }
            } else {
                setGroupMessage(group, controls, "");
            }
        });

        return {
            valid: valid,
            firstInvalid: firstInvalid
        };
    }

    function validateRadioGroups(root, show) {
        var controls = getControls(root);
        var handled = Object.create(null);
        var firstInvalid = null;
        var valid = true;

        controls.forEach(function (control) {
            var group;
            var radios;
            var checked;
            var fieldset;

            if ((control.type || "").toLowerCase() !== "radio" || !control.required || handled[control.name]) {
                return;
            }

            handled[control.name] = true;
            radios = controls.filter(function (candidate) {
                return (candidate.type || "").toLowerCase() === "radio" && candidate.name === control.name;
            });
            checked = radios.some(function (radio) {
                return radio.checked;
            });
            fieldset = control.closest("fieldset");
            group = fieldset || controlContainer(control);

            if (!checked) {
                valid = false;
                firstInvalid = firstInvalid || control;
                if (show) {
                    setGroupMessage(group, radios, "Select a final readiness decision.");
                }
            } else {
                setGroupMessage(group, radios, "");
            }
        });

        return {
            valid: valid,
            firstInvalid: firstInvalid
        };
    }

    function rememberFirstInvalid(current, candidate) {
        if (!candidate) {
            return current;
        }
        if (!current) {
            return candidate;
        }
        if (current.compareDocumentPosition &&
            (current.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_PRECEDING)) {
            return candidate;
        }
        return current;
    }

    function focusInvalid(element) {
        if (!element) {
            return;
        }
        if (typeof element.focus === "function") {
            element.focus({ preventScroll: true });
        }
        if (typeof element.scrollIntoView === "function") {
            element.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    }

    function validateRoot(root, show) {
        var firstInvalid = null;
        var groups;
        var radios;
        var valid = true;

        applyConditionalRequirements(root);
        getControls(root).forEach(function (control) {
            var controlIsValid = validateControl(control, show);

            if (!controlIsValid) {
                valid = false;
                firstInvalid = rememberFirstInvalid(firstInvalid, control);
            }
        });

        groups = validateRequiredChoiceGroups(root, show);
        if (!groups.valid) {
            valid = false;
            firstInvalid = rememberFirstInvalid(firstInvalid, groups.firstInvalid);
        }

        radios = validateRadioGroups(root, show);
        if (!radios.valid) {
            valid = false;
            firstInvalid = rememberFirstInvalid(firstInvalid, radios.firstInvalid);
        }

        if (!valid && show) {
            setStatus(root, "Complete the highlighted required fields before printing the run of show.", "error");
            focusInvalid(firstInvalid);
        }

        return valid;
    }

    function validateTouchedControl(root, control, show) {
        var group;

        applyConditionalRequirements(root);
        validateControl(control, show);

        group = control.closest(REQUIRED_GROUP_SELECTOR);
        if (group) {
            validateRequiredChoiceGroups(root, show || group.getAttribute("data-lab7-invalid") === "true");
        }
        if ((control.type || "").toLowerCase() === "radio") {
            validateRadioGroups(root, show);
        }
    }

    function syncRoot() {
        var root = findRoot();
        document.body.classList.toggle("lab7-form-active", Boolean(root));

        if (root) {
            populateTimeZones(root);
            preparePlaceholders(root);
            annotateFieldLabels(root);
            Array.prototype.forEach.call(root.querySelectorAll("button:not([type])"), function (button) {
                button.type = "button";
            });
        }

        if (root && !initializedRoots.has(root)) {
            initializedRoots.add(root);
            restore(root);
            applyConditionalRequirements(root);
        }
    }

    function queueSync() {
        if (syncQueued) {
            return;
        }
        syncQueued = true;
        window.requestAnimationFrame(function () {
            syncQueued = false;
            syncRoot();
        });
    }

    function beforePrint() {
        var root = findRoot();
        if (!root) {
            return;
        }

        validateRoot(root, true);
        save(root);
        printTextareaStyles = [];
        Array.prototype.forEach.call(root.querySelectorAll("textarea"), function (textarea) {
            printTextareaStyles.push({
                element: textarea,
                height: textarea.style.height,
                overflow: textarea.style.overflow
            });
            textarea.style.height = "auto";
            textarea.style.height = Math.max(textarea.scrollHeight, textarea.offsetHeight) + "px";
            textarea.style.overflow = "visible";
        });
    }

    function afterPrint() {
        printTextareaStyles.forEach(function (saved) {
            saved.element.style.height = saved.height;
            saved.element.style.overflow = saved.overflow;
        });
        printTextareaStyles = [];
    }

    function init() {
        document.addEventListener("focusin", function (event) {
            var root = findRoot();
            if (root && root.contains(event.target) && isSavedControl(event.target)) {
                event.target.setAttribute("data-lab7-touched", "true");
                hidePlaceholder(event.target);
            }
        });

        document.addEventListener("focusout", function (event) {
            var root = findRoot();
            if (root && root.contains(event.target) && isSavedControl(event.target)) {
                restorePlaceholder(event.target);
                validateTouchedControl(root, event.target, true);
            }
        });

        document.addEventListener("input", function (event) {
            var root = findRoot();
            if (root && root.contains(event.target) && isSavedControl(event.target)) {
                validateTouchedControl(root, event.target, event.target.getAttribute("aria-invalid") === "true");
                save(root);
            }
        });

        document.addEventListener("change", function (event) {
            var root = findRoot();
            if (root && root.contains(event.target) && isSavedControl(event.target)) {
                validateTouchedControl(root, event.target, true);
                save(root);
            }
        });

        document.addEventListener("click", function (event) {
            var printButton = event.target.closest && event.target.closest(PRINT_SELECTOR);
            var clearButton = event.target.closest && event.target.closest(CLEAR_SELECTOR);
            var root;

            if (printButton) {
                root = findRoot();
                if (root) {
                    event.preventDefault();
                    if (validateRoot(root, true)) {
                        save(root);
                        window.print();
                    }
                }
                return;
            }

            if (clearButton) {
                root = findRoot();
                if (root) {
                    event.preventDefault();
                    clear(root);
                }
            }
        });

        window.addEventListener("beforeprint", beforePrint);
        window.addEventListener("afterprint", afterPrint);

        if (window.MutationObserver) {
            new MutationObserver(queueSync).observe(document.getElementById("module-content") || document.body, {
                childList: true,
                subtree: true
            });
        }
        syncRoot();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}());
