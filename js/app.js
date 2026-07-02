/* ============================================================
   FINAL ROUND · Selection Committee — application logic
   ============================================================ */
(function () {
  "use strict";

  /* ---------- data ---------- */
  var REF = "FR-2026-0807";

  var YES = [
    ["Yes", ""],
    ["Definitely yes", ""],
    ["Certainly yes", ""],
    ["100% yes", ""],
    ["Absolutely yes — where do I sign", "you sign in Section 05"]
  ];

  var NO = [
    ["I don't like foreigners, they're too dumb", "an appeal has been auto-filed on the candidate's behalf"],
    ["I have a boyfriend, please leave me alone", "the committee will request references and a formal org chart"],
    ["I'm a sophomore, I cannot be seen with a freshman", "a cross-cohort waiver is available at the front desk"],
    ["I only date 2200+ rated chess players", "the interviewer is reportedly training as we speak"],
    ["This position is too competitive for me", "incorrect — you were the only candidate considered"]
  ];

  var VENUES_MAIN = [
    ["Manner Coffee (Design Building)", "walking distance · strong espresso, stronger conversation"],
    ["Luckin Coffee (SJTU Minhang Campus · 3rd Dining Hall Building)", "on-campus classic · coconut latte pre-approved"],
    ["Timo Coffee (near ZY)", "quiet corner tables available"]
  ];

  var VENUES_ALT = [
    ["Hangzhou South Railway Station", "≈ 1 hr by high-speed rail · the committee is prepared to travel"],
    ["Shanghai South Railway Station", "romantic in a logistical way"],
    ["DZY3-405", "a classroom · fluorescent lighting · bring your own atmosphere"],
    ["DZY1-109", "acoustics rated 'echoey' · desks bolted to the floor"]
  ];

  var DATES = [
    { key: "Fri, Aug 7", d: "FRI", big: "Aug 7" },
    { key: "Sat, Aug 8", d: "SAT", big: "Aug 8" },
    { key: "Sun, Aug 9", d: "SUN", big: "Aug 9" }
  ];

  var TIMES = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  var state = { decision: null, decisionKind: null, venue: null, date: null, time: null };

  /* ---------- helpers ---------- */
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $all(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- red chop SVG ---------- */
  function chopSVG() {
    return '' +
      '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Official seal of the Selection Committee">' +
      '<defs>' +
      '<path id="ringTop" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/>' +
      '<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/></filter>' +
      '</defs>' +
      '<g filter="url(#rough)" fill="none" stroke="#C43A2B">' +
      '<circle cx="60" cy="60" r="55" stroke-width="3.4"/>' +
      '<circle cx="60" cy="60" r="48.5" stroke-width="1.1"/>' +
      '</g>' +
      '<g filter="url(#rough)">' +
      '<text fill="#C43A2B" font-family="IBM Plex Mono, monospace" font-size="9.2" font-weight="600" letter-spacing="2.6">' +
      '<textPath href="#ringTop" startOffset="0">SELECTION COMMITTEE \u00B7 FINAL ROUND \u00B7 EST. 2026 \u00B7</textPath>' +
      '</text>' +
      '<text x="60" y="62" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-size="46" fill="#C43A2B">\u265E</text>' +
      '<text x="60" y="93" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7.4" letter-spacing="1.8" fill="#C43A2B">' + REF + '</text>' +
      '</g>' +
      '</svg>';
  }

  /* ---------- render option groups ---------- */
  function optRow(group, text, note, extraClass) {
    return '<label class="opt ' + (extraClass || "") + '">' +
      '<input type="radio" name="' + group + '" value="' + esc(text) + '">' +
      '<span class="tick"></span>' +
      '<span class="txt">' + esc(text) +
      (note ? '<span class="note">' + esc(note) + '</span>' : "") +
      '</span></label>';
  }

  function build() {
    $("#headChop").innerHTML = chopSVG();

    $("#decisionYes").innerHTML = YES.map(function (o) { return optRow("decision", o[0], o[1], "yes"); }).join("");
    $("#decisionNo").innerHTML = NO.map(function (o) { return optRow("decision", o[0], o[1], "no"); }).join("");

    $("#venueMain").innerHTML = VENUES_MAIN.map(function (o) { return optRow("venue", o[0], o[1]); }).join("");
    $("#venueAlt").innerHTML = VENUES_ALT.map(function (o) { return optRow("venue", o[0], o[1]); }).join("");

    $("#dates").innerHTML = DATES.map(function (d) {
      return '<label class="pill"><input type="radio" name="date" value="' + d.key + '">' +
        '<span class="d">' + d.d + '</span><span class="big">' + d.big + '</span></label>';
    }).join("");

    $("#times").innerHTML = TIMES.map(function (t) {
      return '<label class="tslot"><input type="radio" name="time" value="' + t + '">' + t + '</label>';
    }).join("");
  }

  /* ---------- selection behaviour ---------- */
  function wireSelections() {
    $all(".opt input, .pill input, .tslot input").forEach(function (inp) {
      inp.addEventListener("change", function () {
        $all('input[name="' + inp.name + '"]').forEach(function (o) {
          var box = o.closest(".opt, .pill, .tslot");
          if (box) box.classList.remove("on");
        });
        var box = inp.closest(".opt, .pill, .tslot");
        if (box) box.classList.add("on");
        state[inp.name] = inp.value;

        if (inp.name === "decision") {
          var isNo = box && box.classList.contains("no");
          state.decisionKind = isNo ? "no" : "yes";
          var note = $("#decisionNote");
          if (isNo) {
            note.hidden = false;
            note.textContent = "NOTED. Response forwarded to the Department of Appeals (staff: 1). You may still complete Sections 02\u201306 in case the appeal succeeds.";
          } else {
            note.hidden = false;
            note.textContent = "EXCELLENT DECISION. The committee concurs unanimously.";
          }
        }
        $("#err").textContent = "";
      });
    });
  }

  /* ---------- signature preview ---------- */
  function wireSignature() {
    var input = $("#name");
    var sig = $("#sigPreview");
    input.addEventListener("input", function () {
      sig.textContent = input.value.trim() || "\u00A0";
    });
  }

  /* ---------- scroll reveal + score bars ---------- */
  function wireReveal() {
    if (!("IntersectionObserver" in window)) {
      $all(".reveal").forEach(function (el) { el.classList.add("in"); });
      animateScores();
      return;
    }
    var seenScores = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (!seenScores && e.target.querySelector(".scores")) {
          seenScores = true;
          animateScores();
        }
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    $all(".reveal").forEach(function (el) { io.observe(el); });
  }

  function animateScores() {
    $all(".bar i").forEach(function (b, i) {
      setTimeout(function () { b.style.width = b.getAttribute("data-w") + "%"; }, 120 * i);
    });
    $all(".score-val").forEach(function (el, i) {
      var target = parseFloat(el.getAttribute("data-val"));
      countUp(el, target, 900 + 120 * i, target % 1 !== 0 ? 1 : 0);
    });
    countUp($("#compat"), 99.4, 1600, 1);
  }

  function countUp(el, target, dur, decimals) {
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- submit ---------- */
  function wireSubmit() {
    $("#frf").addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("#err");
      var name = $("#name").value.trim();
      var addr = $("#addr").value.trim();

      var missing =
        !state.decision ? ["decision", "Section 01 requires a response. The committee is refreshing the page as we speak."] :
        !state.venue ? ["venue", "Please select a venue in Section 02. All chairs have been inspected."] :
        !state.date ? ["date", "Please choose a date in Section 03. All three have been cleared for you."] :
        !state.time ? ["time", "Please pick a time in Section 04. Half-hour precision is company policy."] :
        !name ? ["name", "Section 05: the committee cannot process an unsigned response."] : null;

      if (missing) {
        err.textContent = missing[1];
        var sec = $('[data-sec="' + missing[0] + '"]');
        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      err.textContent = "";
      showDone({
        name: name, addr: addr,
        decision: state.decision, kind: state.decisionKind,
        venue: state.venue, date: state.date, time: state.time
      });
    });
  }

  /* ---------- confirmation ---------- */
  function summaryText(r) {
    return "\u265E FINAL ROUND \u2014 CANDIDATE RESPONSE\n" +
      "Ref: " + REF + "\n" +
      "Candidate: " + r.name + "\n" +
      "Decision: " + r.decision + "\n" +
      "Venue: " + r.venue + "\n" +
      "Date: " + r.date + "\n" +
      "Time: " + r.time + " (GMT+8)\n" +
      "Pick-up: " + (r.addr || "Not requested \u2014 candidate will arrive under her own power") + "\n" +
      "\u2014 submitted via the official portal";
  }

  function showDone(r) {
    var yes = r.kind === "yes";
    $("#portal").hidden = true;
    var view = $("#doneView");
    view.hidden = false;

    $("#doneChop").innerHTML = chopSVG();
    $("#doneChop").classList.remove("chop-slam");
    void $("#doneChop").offsetWidth; /* restart animation */
    $("#doneChop").classList.add("chop-slam");

    $("#doneTitle").textContent = yes ? "Offer accepted." : "Response recorded. Appeal pending.";
    $("#doneSub").textContent = yes
      ? "The final round is confirmed. One last step: deliver your response to the hiring manager."
      : "Your response has been logged and an appeal was filed automatically. Please forward the paperwork to the hiring manager regardless.";

    var rows = [
      ["Candidate", r.name],
      ["Decision", r.decision],
      ["Venue", r.venue],
      ["Date", r.date],
      ["Time", r.time + " GMT+8"],
      ["Pick-up", r.addr ? r.addr + " \uD83D\uDEF5" : "Not requested"]
    ];
    $("#receipt").innerHTML = rows.map(function (row) {
      return '<div class="rr"><span class="k">' + esc(row[0]) + '</span><span class="v">' + esc(row[1]) + "</span></div>";
    }).join("");

    var text = summaryText(r);
    $("#summary").textContent = text;

    var copyBtn = $("#copyBtn");
    copyBtn.textContent = "Copy my response";
    copyBtn.classList.remove("copied");
    copyBtn.onclick = function () { copyText(text, copyBtn); };

    $("#resetBtn").onclick = function () {
      view.hidden = true;
      $("#portal").hidden = false;
      window.scrollTo({ top: 0 });
    };

    window.scrollTo({ top: 0 });
  }

  function copyText(text, btn) {
    function ok() {
      btn.textContent = "Copied \u2014 now paste it to Narek \u2713";
      btn.classList.add("copied");
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); }
      catch (e) { btn.textContent = "Select the text above and copy manually"; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else { fallback(); }
  }

  /* ---------- init ---------- */
  build();
  wireSelections();
  wireSignature();
  wireReveal();
  wireSubmit();
})();
