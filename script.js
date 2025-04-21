let currentWeatherData = null;

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "a5f252bf2f094225947170708252004";

  if (city === "") {
    alert("Please enter a city or country name.");
    return;
  }

  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById("weatherInfo").style.display = "block";
        document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">⚠️ ${data.error.message}</p>`;
        return;
      }

      currentWeatherData = data;
      document.getElementById("weatherInfo").style.display = "block";

      updateTemperature();

      const condition = data.current.condition.text;
      document.getElementById("condition").innerText = `Condition: ${condition}`;
      document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;

      const aqiIndex = data.current.air_quality["us-epa-index"];
      document.getElementById("air-quality").innerText = `Air Quality: ${getAQILevel(aqiIndex)}`;

      document.getElementById("local-time").innerText = `Local Time: ${data.location.localtime}`;

      updateBackground(condition);
      updateIcon(condition);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">❌ Unable to fetch data.</p>`;
    });
}

function updateTemperature() {
  if (!currentWeatherData) return;

  const isCelsius = document.getElementById("unitToggle").value === "C";
  const temp = isCelsius
    ? `${currentWeatherData.current.temp_c}°C`
    : `${currentWeatherData.current.temp_f}°F`;

  document.getElementById("temp").innerText = temp;
}

function getAQILevel(index) {
  const levels = {
    1: "Good 😊",
    2: "Moderate 😐",
    3: "Unhealthy for Sensitive Groups 😷",
    4: "Unhealthy 😷",
    5: "Very Unhealthy 😫",
    6: "Hazardous ☠️",
  };
  return levels[index] || "Unknown";
}

// Change background based on condition
function updateBackground(condition) {
  condition = condition.toLowerCase();
  let bg = "";

  if (condition.includes("sun")) bg = "linear-gradient(to bottom, #fceabb, #f8b500)";
  else if (condition.includes("cloud")) bg = "linear-gradient(to bottom, #d7d2cc, #304352)";
  else if (condition.includes("rain")) bg = "linear-gradient(to bottom, #4e54c8, #8f94fb)";
  else if (condition.includes("snow")) bg = "linear-gradient(to bottom, #e6dada, #274046)";
  else bg = "linear-gradient(to bottom, #a2d4f3, #d0f0fd)";

  document.body.style.background = bg;
}

// Show animated icon
function updateIcon(condition) {
  const iconDiv = document.getElementById("weatherIcon");
  condition = condition.toLowerCase();

  let svg = "";

  if (condition.includes("sun"))
    svg = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFD93B"/><g stroke="#FFD93B" stroke-width="4"><line x1="32" y1="4" x2="32" y2="16"/><line x1="32" y1="48" x2="32" y2="60"/><line x1="4" y1="32" x2="16" y2="32"/><line x1="48" y1="32" x2="60" y2="32"/><line x1="11" y1="11" x2="20" y2="20"/><line x1="44" y1="44" x2="53" y2="53"/><line x1="11" y1="53" x2="20" y2="44"/><line x1="44" y1="20" x2="53" y2="11"/></g></svg>`;
  else if (condition.includes("cloud"))
    svg = `<svg viewBox="0 0 64 64"><path d="M20 50h24a14 14 0 0 0 0-28 18 18 0 0 0-34 4" fill="#ccc" stroke="#666" stroke-width="2"/></svg>`;
  else if (condition.includes("rain"))
    svg = `<svg viewBox="0 0 64 64"><path d="M20 50h24a14 14 0 0 0 0-28 18 18 0 0 0-34 4" fill="#ccc" stroke="#666" stroke-width="2"/><line x1="22" y1="54" x2="22" y2="62" stroke="#00f" stroke-width="2"/><line x1="32" y1="54" x2="32" y2="62" stroke="#00f" stroke-width="2"/><line x1="42" y1="54" x2="42" y2="62" stroke="#00f" stroke-width="2"/></svg>`;
  else
    svg = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#bbb"/></svg>`;

  iconDiv.innerHTML = svg;
}
