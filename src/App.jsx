import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import { appWindow, CloseRequestedEvent } from "@tauri-apps/api/window";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [waterInterval, setWaterInterval] = useState(null);
  const [waterGoalValue, setWaterGoalValue] = useState(0);
  const [reminderStarted, setReminderStarted] = useState(false);
  const [minutesSet, setMinutesSet] = useState(5);
  const [reminderOn, setReminderOn] = useState(false);

  // useEffect(() => {
  //   sendStartNotification();
  // }, []);

  useEffect(() => {
    console.log(Number(minutesSet) * 60);
    if (reminderStarted)
      setWaterInterval(
        setInterval(() => {
          appWindow.show();
          setReminderOn(true);
        }, Number(minutesSet) * 60 * 1000)
      );
  }, [reminderStarted]);

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
    <>
      {reminderOn && (
        <div className="reminder">
          <h2>It's time to drink water!</h2>
          <button
            onClick={() => {
              setReminderOn(false);
              appWindow.hide();
            }}
          >
            OK
          </button>
        </div>
      )}

      <div className="container">
        {!reminderStarted && (
          <>
            <h1>Drinking reminder</h1>
            <h3>(Water) drinking goal</h3>
            <div class="slidecontainer">
              <input
                type="range"
                min="0"
                max="4000"
                value={waterGoalValue}
                onChange={(e) => setWaterGoalValue(e.target.value)}
                class="slider"
                id="myRange"
              />
              <p>{(waterGoalValue / 1000).toFixed(2)} L</p>
              <h3>Reminder interval</h3>
              <select onChange={(e) => setMinutesSet(e.target.value)}>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </>
        )}

        <button
          onClick={async () => {
            if (reminderStarted) {
              setReminderStarted(false);
              setWaterInterval((e) => clearInterval(e));
              setReminderOn(false);
              return;
            }
            setReminderStarted(true);
            await appWindow.hide();
          }}
        >
          {reminderStarted ? "Stop reminders" : "Start"}
        </button>
      </div>
    </>
  );
}

export default App;
