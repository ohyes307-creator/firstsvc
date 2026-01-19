// app.js

// ✅ 테스트용 샘플 데이터 (실운영에서는 프론트에 개인정보/계정목록을 두면 안 됩니다)
const ACCOUNTS = [
  { studentNo: "23001", name: "홍길동", birth: "080315", phoneLast4: "1234", googleId: "honggildong@school.edu" },
  { studentNo: "23002", name: "김하늘", birth: "070921", phoneLast4: "5678", googleId: "kimhaneul@school.edu" },
  { studentNo: "23003", name: "이서준", birth: "081102", phoneLast4: "9012", googleId: "leeseojun@school.edu" },
];

// --- DOM ---
const form = document.getElementById("searchForm");
const studentNoInput = document.getElementById("studentNo");
const studentNameInput = document.getElementById("studentName");
const birthInput = document.getElementById("birth");
const phoneLast4Input = document.getElementById("phoneLast4");

const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const googleIdEl = document.getElementById("googleId");
const passwordTextEl = document.getElementById("passwordText");
const requestResetBtn = document.getElementById("requestResetBtn");

// --- Helpers ---
function onlyDigits(v) {
  return String(v ?? "").replace(/\D/g, "");
}

function normalizeStudentNo(v) {
  return onlyDigits(v).slice(0, 5); // 5자리
}

function normalizeBirth(v) {
  return onlyDigits(v).slice(0, 6); // YYMMDD 6자리
}

function normalizePhoneLast4(v) {
  return onlyDigits(v).slice(0, 4); // 4자리
}

function normalizeName(v) {
  return String(v ?? "").trim().replace(/\s+/g, ""); // 공백 제거
}

function setStatus(message, type = "info") {
  statusEl.textContent = message || "";
  statusEl.classList.toggle("error", type === "error");
}

function hideResult() {
  resultEl.hidden = true;
  googleIdEl.textContent = "-";
  passwordTextEl.textContent = "-";
}

function showResult({ googleId, demoPw }) {
  googleIdEl.textContent = googleId;
  passwordTextEl.textContent = demoPw;
  resultEl.hidden = false;
}

function findAccount({ studentNo, name, birth, phoneLast4 }) {
  return (
    ACCOUNTS.find(
      (a) =>
        a.studentNo === studentNo &&
        a.name === name &&
        a.birth === birth &&
        a.phoneLast4 === phoneLast4
    ) || null
  );
}

// ✅ 테스트용 데모 비밀번호 생성 (입력값 기반으로 "항상 같은" 데모 PW)
// - 실제 비밀번호를 저장/조회하지 않음
async function makeDemoPassword({ studentNo, name, birth, phoneLast4 }) {
  const seed = `DEMO|${studentNo}|${name}|${birth}|${phoneLast4}`;

  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(seed);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    const hex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    // 보기 좋은 길이로 축약
    return `TEST-${hex.slice(0, 10)}`; // 예: TEST-3A1F9C0D2B
  }

  // fallback
  return `TEST-${birth}${phoneLast4}`;
}

// --- Input sanitize (타이핑/붙여넣기 대비) ---
studentNoInput.addEventListener("input", () => {
  const v = normalizeStudentNo(studentNoInput.value);
  if (studentNoInput.value !== v) studentNoInput.value = v;
});

birthInput.addEventListener("input", () => {
  const v = normalizeBirth(birthInput.value);
  if (birthInput.value !== v) birthInput.value = v;
});

phoneLast4Input.addEventListener("input", () => {
  const v = normalizePhoneLast4(phoneLast4Input.value);
  if (phoneLast4Input.value !== v) phoneLast4Input.value = v;
});

// --- Events ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentNo = normalizeStudentNo(studentNoInput.value);
  const name = normalizeName(studentNameInput.value);
  const birth = normalizeBirth(birthInput.value);
  const phoneLast4 = normalizePhoneLast4(phoneLast4Input.value);

  hideResult();
  setStatus("");

  // 검증
  if (!studentNo || !name || !birth || !phoneLast4) {
    setStatus("학번(5자리), 이름, 생년월일(6자리), 휴대폰 뒤 4자리를 모두 입력해 주세요.", "error");
    return;
  }
  if (studentNo.length !== 5) {
    setStatus("학번은 숫자 5자리로 입력해 주세요.", "error");
    studentNoInput.focus();
    return;
  }
  if (birth.length !== 6) {
    setStatus("생년월일은 숫자 6자리(YYMMDD)로 입력해 주세요.", "error");
    birthInput.focus();
    return;
  }
  if (phoneLast4.length !== 4) {
    setStatus("휴대폰 번호 뒤 4자리는 숫자 4자리로 입력해 주세요.", "error");
    phoneLast4Input.focus();
    return;
  }

  const account = findAccount({ studentNo, name, birth, phoneLast4 });

  if (!account) {
    setStatus("일치하는 정보를 찾지 못했어요. 다시 확인해 주세요.", "error");
    return;
  }

  const demoPw = await makeDemoPassword({ studentNo, name, birth, phoneLast4 });

  showResult({ googleId: account.googleId, demoPw });
  setStatus("조회 완료!", "info");
});

form.addEventListener("reset", () => {
  setStatus("");
  hideResult();
  setTimeout(() => studentNoInput.focus(), 0);
});

requestResetBtn.addEventListener("click", () => {
  alert("비밀번호 재설정은 3층 교무실 공학정보부 선생님께 문의하세요");
});

// 초기 상태
hideResult();
studentNoInput.focus();
