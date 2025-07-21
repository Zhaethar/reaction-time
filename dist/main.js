import $ from "jquery"; // jQuery CDN을 사용하시는 경우 이 줄 제거하세요

let extraNumbers = [],
  current = 1,
  startTime;
const baseAverage = 7.0;

function shuffle(from, to) {
  const arr = [];
  for (let i = from; i <= to; i++) arr.push(i);
  return arr.sort(() => Math.random() - 0.5);
}

function renderGame(firstSet) {
  $("#game").empty();
  for (let num of firstSet) {
    $("#game").append(`<div class='box'>${num}</div>`);
  }
}

function updateStats(time) {
  $("#recent").text(time);
  const best = localStorage.getItem("clickhero_best");
  if (!best || parseFloat(time) < parseFloat(best)) {
    localStorage.setItem("clickhero_best", time);
    $("#best").text(time);
  } else {
    $("#best").text(best);
  }
  const percent = Math.max(
    1,
    Math.min(99, Math.round((time / baseAverage) * 100))
  );
  $("#percent").text(percent);
}

export function copyResult() {
  const time = $("#recent").text();
  const text = `📈 내 반응속도 기록: ${time}초! 너도 도전해봐 👉 https://clickhero.online`;
  navigator.clipboard.writeText(text).then(() => {
    alert("기록이 복사되었습니다! 친구에게 붙여넣어보세요.");
  });
}

export function resetStats() {
  localStorage.removeItem("clickhero_best");
  $("#best").text("--");
  $("#recent").text("--");
  $("#percent").text("--");
  $("#time").text("0.00");
  startTime = null;
  alert("기록이 초기화되었습니다!");
}

export function startGameWithModal() {
  document.getElementById("introModal").style.display = "none";
  $("#start").click();
}

function startGame() {
  const firstSet = shuffle(1, 25);
  extraNumbers = shuffle(26, 50);
  current = 1;
  renderGame(firstSet);
  startTime = Date.now();
  $("#time").text("0.00");
}

$(function () {
  const best = localStorage.getItem("clickhero_best");
  if (best) $("#best").text(best);

  $("#start").click(function () {
    $("#start").hide();
    $("#time").text("준비 중...");

    let count = 3;
    $("#countdown").text(count).css("display", "flex");

    const timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        $("#countdown").hide();
        startGame();
      } else {
        $("#countdown").text(count);
      }
    }, 1000);
  });

  $("#game").on("click", ".box", function () {
    const val = Number($(this).text());
    if (val === current) {
      current++;
      if (val <= 25 && extraNumbers.length > 0) {
        $(this).text(extraNumbers.pop());
      } else {
        $(this)
          .text("")
          .addClass(val <= 25 ? "disabled" : "disappear")
          .off("click");
      }

      if (current > 50) {
        const time = ((Date.now() - startTime) / 1000).toFixed(2);
        $("#time").text(time);
        updateStats(time);
        alert(`끝! 기록: ${time}초`);
        $("#start").text("재도전").show();
      }
    }
  });

  setInterval(() => {
    if (startTime && current <= 50) {
      const now = ((Date.now() - startTime) / 1000).toFixed(2);
      $("#time").text(now);
    }
  }, 100);
});
