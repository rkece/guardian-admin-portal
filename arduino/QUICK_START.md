# Quick Start Guide - Arduino SOS Keychain

## ⚡ Quick Setup (5 Minutes)

### What You Need:
- ✅ Arduino UNO R3
- ✅ 1x Push Button
- ✅ 1x Red LED
- ✅ 1x Green LED  
- ✅ 1x Buzzer
- ✅ 2x 220Ω Resistors
- ✅ Breadboard & Jumper Wires
- ✅ USB Cable

---

## 🔌 Quick Connections

```
Button    → Pin 2 → GND
Buzzer    → Pin 11 → GND
Green LED → Pin 12 → 220Ω → GND
Red LED   → Pin 13 → 220Ω → GND
```

---

## 💻 Upload Code

1. Open Arduino IDE
2. File → Open → `guardian_keychain.ino`
3. Tools → Board → Arduino UNO
4. Tools → Port → [Select your port]
5. Click Upload (→)

---

## ✅ Test

1. Green LED should light up
2. Press button → Red LED blinks + Beeps
3. Hold button 2 sec → Cancel SOS

---

## 🎯 Behavior

| State | Green LED | Red LED | Buzzer |
|-------|-----------|---------|--------|
| Ready | ON | OFF | Silent |
| SOS Active | OFF | Blinking | Beeping |
| Cancelled | ON | OFF | Beep once |

---

## 📝 Serial Monitor Output

```
Guardian SOS Keychain Initialized
Press button to trigger SOS alert
🚨 SOS TRIGGERED!
SOS_ALERT
```

---

## 🔧 Troubleshooting

**LEDs not working?**
- Check polarity (long leg = +)
- Check resistors

**Button not working?**
- Check connections
- Try different button

**No upload?**
- Check USB cable
- Select correct COM port

---

## 📚 Full Documentation

See `HARDWARE_GUIDE.md` for:
- Detailed circuit diagrams
- WiFi/GSM integration
- 3D enclosure design
- Battery power options

---

## 🚀 Repository

https://github.com/rkece/guardian-admin-portal

**Happy Building! 🛠️**
