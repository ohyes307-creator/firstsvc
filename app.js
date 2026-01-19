// app.js

// ✅ 데모 데이터 (4가지 정보가 모두 일치해야 조회됨)
// 실제 운영에서는 이 데이터를 프론트에 두지 말고 서버에서 조회하세요.
const ACCOUNTS = [
  {
    studentNo: "2301",
    name: "홍길동",
    birth: "080315",     // YYMMDD
    phoneLast4: "1234",
    googleId: "honggildong@school.edu",
  },
  {
    studentNo: "2302",
    name: "김하늘",
    birth: "070921",
    phoneLast4: "5678",
    googleId: "kimhaneul@school.edu",
  },
  {
    studentNo: "2303",
    name: "이서준",
    birth: "081102",
    phoneLast4: "9012",
    googleId: "leeseojun@school.edu",
  },
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
const requestResetBtn = document.getElementById("requestResetBtn");

// --- Helpers ---
function onlyDigits(v) {
  return String(v ?? "").replace(/\D/g, "");
}

function normalizeStudentNo(v) {
  return String(v ?? "").trim();
}

function normalizeName(v) {
  return String(v ?? "").trim().replace(/\s+/g, "");
}

function normalizeBirthYYMMDD(v) {
  // 숫자만 + 6자리 제한
  return onlyDigits(v).slice(0, 6);
}

function normalizePhoneLast4(v) {
  // 숫자만 + 4자리 제한
  return onlyDigits(v).slice(0, 4);
}

function setStatus(message, type = "info") {
  statusEl.textContent = message || "";
  statusEl.classList.toggle("error", type === "error");
}

function showResult(googleId) {
  googleIdEl.textContent = googleId;
  resultEl.hidden = false;
}

function hideResult() {
  resultEl.hidden = true;
  googleIdEl.textContent = "-";
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

// --- Input UX: 숫자 필드 자동 정리 (붙여넣기/한글 입력 등 방지) ---
birthInput.addEventListener("input", () => {
  const v = normalizeBirthYYMMDD(birthInput.value);
  if (birthInput.value !== v) birthInput.value = v;
});

phoneLast4Input.addEventListener("input", () => {
  const v = normalizePhoneLast4(phoneLast4Input.value);
  if (phoneLast4Input.value !== v) phoneLast4Input.value = v;
});

// --- Events ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const studentNo = normalizeStudentNo(studentNoInput.value);
  const name = normalizeName(studentNameInput.value);
  const birth = normalizeBirthYYMMDD(birthInput.value);
  const phoneLast4 = normalizePhoneLast4(phoneLast4Input.value);

  // 입력 검증
  if (!studentNo || !name || !birth || !phoneLast4) {
    hideResult();
    setStatus("학번, 이름, 생년월일(6자리), 휴대폰 뒤 4자리를 모두 입력해 주세요.", "error");
    return;
  }

  if (birth.length !== 6) {
    hideResult();
    setStatus("생년월일은 숫자 6자리(YYMMDD)로 입력해 주세요.", "error");
    birthInput.focus();
    return;
  }

  if (phoneLast4.length !== 4) {
    hideResult();
    setStatus("휴대폰 번호 뒤 4자리는 숫자 4자리로 입력해 주세요.", "error");
    phoneLast4Input.focus();
    return;
  }

  // 상태 초기화
  setStatus("");
  hideResult();

  // 검색
  const account = findAccount({ studentNo, name, birth, phoneLast4 });

  if (!account) {
    setStatus("일치하는 계정을 찾지 못했어요. 입력 정보를 다시 확인해 주세요.", "error");
    return;
  }

  // 성공
  showResult(account.googleId);
  setStatus("계정을 찾았어요! (비밀번호는 보안을 위해 표시하지 않아요.)", "info");
});

form.addEventListener("reset", () => {
  setStatus("");
  hideResult();
  setTimeout(() => studentNoInput.focus(), 0);
});

// 비밀번호 재설정 요청 버튼 (데모)
requestResetBtn.addEventListener("click", () => {
  alert(
    "비밀번호는 보안을 위해 표시하지 않습니다.\n" +
      "관리자(또는 담임)에게 비밀번호 재설정을 요청해 주세요."
  );
});

// 첫 진입 UX
studentNoInput.focus();
