import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [waterGoalValue, setWaterGoalValue] = useState(0);

  useEffect(() => {
    sendStartNotification();
  }, []);

  async function sendStartNotification() {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    if (permissionGranted) {
      sendNotification("Tauri is awesome!");
      sendNotification({ title: "TAURI", body: "Tauri is awesome!" });
    }
  }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <h1>Drinking reminder</h1>
      <h3>(Water) drinking goal</h3>
      <div class="slidecontainer">
        <input
          type="range"
          min="0"
          max="3000"
          value={waterGoalValue}
          onChange={(e) => setWaterGoalValue(e.target.value)}
          class="slider"
          id="myRange"
        />
        <p>{(waterGoalValue / 1000).toFixed(2)} L</p>
        <h3>Reminder interval</h3>
        <select>
          <option>5 minutes</option>
          <option>15 minutes</option>
          <option>30 minutes</option>
          <option>1 hour</option>
          <option>3 hours</option>
        </select>
        <button>Start</button>
      </div>
    </div>
  );
}

export default App;
