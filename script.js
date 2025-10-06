document.addEventListener("DOMContentLoaded", () => {
  const hInput = document.getElementById("h");
  const thetaInput = document.getElementById("theta");
  const RInput = document.getElementById("R");
  const calcBtn = document.getElementById("calcBtn");
  const resetBtn = document.getElementById("resetBtn");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const outR = document.getElementById("outR");
  const outh = document.getElementById("outh");
  const outTheta = document.getElementById("outTheta");
  const outX = document.getElementById("outX");
  const outArc = document.getElementById("outArc");
  const outChord = document.getElementById("outChord");

  function deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  function rad2deg(rad) {
    return (rad * 180) / Math.PI;
  }

  function round(v, n = 2) {
    return Math.round(v * Math.pow(10, n)) / Math.pow(10, n);
  }

  function drawRamp(R, h, thetaDeg) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const theta = deg2rad(thetaDeg);
    const scale = canvas.height / (h * 1.4);
    const cx = canvas.width / 4;
    const cy = canvas.height * 0.9;

    const r = R * scale;
    const startAngle = Math.PI;
    const endAngle = Math.PI + theta;

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1fb6ff";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx - r + R * Math.sin(theta) * scale, cy - R * (1 - Math.cos(theta)) * scale);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff4";
    ctx.stroke();
  }

  function calculate() {
    const hVal = parseFloat(hInput.value);
    const thetaVal = parseFloat(thetaInput.value);
    const RVal = parseFloat(RInput.value);

    let h = isNaN(hVal) ? null : hVal;
    let theta = isNaN(thetaVal) ? null : thetaVal;
    let R = isNaN(RVal) ? null : RVal;

    // Mindestens zwei Werte müssen angegeben sein
    const given = [h, theta, R].filter(v => v !== null).length;
    if (given < 2) {
      alert("Bitte mindestens zwei Werte eingeben!");
      return;
    }

    // Berechnungen
    if (h !== null && theta !== null && R === null) {
      R = h / (1 - Math.cos(deg2rad(theta)));
    } else if (h !== null && R !== null && theta === null) {
      const ratio = 1 - h / R;
      if (ratio > 1 || ratio < -1) {
        alert("Ungültige Werte: h darf nicht größer als 2·R sein!");
        return;
      }
      theta = rad2deg(Math.acos(ratio));
    } else if (R !== null && theta !== null && h === null) {
      h = R * (1 - Math.cos(deg2rad(theta)));
    }

    // Ergebnisse berechnen
    const x = R * Math.sin(deg2rad(theta)); // horizontale Länge
    const arc = R * deg2rad(theta); // Bogenlänge
    const chord = 2 * R * Math.sin(deg2rad(theta / 2)); // Sehne

    // Ausgaben
    outR.textContent = `R = ${round(R)} m`;
    outh.textContent = `h = ${round(h)} m`;
    outTheta.textContent = `θ = ${round(theta)} °`;
    outX.textContent = `Horiz. Projektion = ${round(x)} m`;
    outArc.textContent = `Bogenlänge = ${round(arc)} m`;
    outChord.textContent = `Sehnenlänge = ${round(chord)} m`;

    drawRamp(R, h, theta);
  }

  calcBtn.addEventListener("click", calculate);

  resetBtn.addEventListener("click", () => {
    hInput.value = "";
    thetaInput.value = "";
    RInput.value = "";
    outR.textContent = "R = — m";
    outh.textContent = "h = — m";
    outTheta.textContent = "θ = — °";
    outX.textContent = "Horiz. Projektion = — m";
    outArc.textContent = "Bogenlänge = — m";
    outChord.textContent = "Sehnenlänge = — m";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});
