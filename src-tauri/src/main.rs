// Prevents additional console window on Windows in release, DO NOT REMOVE!!
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit); // insert the menu items here
    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .system_tray(system_tray)
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .on_system_tray_event(|_, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // tauri::Builder::default()
    //     .system_tray(system_tray)
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
}
