// app.js

// ✅ 데모 데이터 (학번 + 이름 -> 구글 계정 ID)
// 실제 운영에서는 이 데이터를 프론트에 두지 말고 서버에서 조회하세요.
const ACCOUNTS = [
  { studentNo: "2301", name: "홍길동", googleId: "honggildong@school.edu" },
  { studentNo: "2302", name: "김하늘", googleId: "kimhaneul@school.edu" },
  { studentNo: "2303", name: "이서준", googleId: "leeseojun@school.edu" },
];

// --- DOM ---
const form = document.getElementById("searchForm");
const studentNoInput = document.getElementById("studentNo");
const studentNameInput = document.getElementById("studentName");

const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const googleIdEl = document.getElementById("googleId");

const requestResetBtn = document.getElementById("requestResetBtn");

// --- Helpers ---
function normalizeNo(v) {
  return String(v ?? "").trim();
}

function normalizeName(v) {
  return String(v ?? "")
    .trim()
    .replace(/\s+/g, ""); // 이름 중간 공백 제거 (예: "홍 길동" -> "홍길동")
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

function findAccount(studentNo, name) {
  return ACCOUNTS.find((a) => a.studentNo === studentNo && a.name === name) || null;
}

// --- Events ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const studentNo = normalizeNo(studentNoInput.value);
  const name = normalizeName(studentNameInput.value);

  // 입력 검증
  if (!studentNo || !name) {
    hideResult();
    setStatus("학번과 이름을 모두 입력해 주세요.", "error");
    return;
  }

  // 상태 초기화
  setStatus("");
  hideResult();

  // 검색
  const account = findAccount(studentNo, name);

  if (!account) {
    setStatus("일치하는 계정을 찾지 못했어요. 학번/이름을 다시 확인해 주세요.", "error");
    return;
  }

  // 성공
  showResult(account.googleId);
  setStatus("계정을 찾았어요! (비밀번호는 보안을 위해 표시하지 않아요.)", "info");
});

// reset 버튼(폼 리셋) 눌렀을 때 UI도 같이 초기화
form.addEventListener("reset", () => {
  setStatus("");
  hideResult();
  // UX: 리셋 후 학번 입력에 포커스
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
