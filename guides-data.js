/* =====================================================================
   SHIVTRIX GUIDES  -  edit this file to add / change guides.
   To add a guide, copy one block below, paste it at the end of the list
   (put a comma after the previous block) and change the text.

   Fields:
     id        short unique name, letters/numbers/dashes only
     title     guide title
     category  e.g. CCTV, Networking, PC, Security, Data
     level     Basic / Intermediate / Advanced
     updated   date as YYYY-MM-DD
     summary   one or two lines shown on the card
     sections  list of blocks. Each block can have:
                 h:    small heading (optional)
                 p:    a paragraph (optional)
                 list: a list of points (optional)
     tip       one closing tip (optional)
   ===================================================================== */
window.SHIVTRIX_GUIDES = [
  {
    id: "cctv-placement",
    title: "CCTV Camera Placement Basics",
    category: "CCTV",
    level: "Basic",
    updated: "2026-11-20",
    summary: "Where to mount cameras, at what height and angle, so you actually capture useful footage.",
    sections: [
      { h: "Start with entry points", p: "Cover the main gate, front door, back door and any cash or storage area first. Add extra cameras only after these are covered." },
      { h: "Height and angle", list: [
        "Mount at about 2.5 to 3 metres: high enough to be out of reach, low enough to see faces.",
        "Tilt slightly downward so the camera sees faces, not just the tops of heads.",
        "Keep the camera view clear of tree branches, signboards and pillars."
      ]},
      { h: "Light and glass", list: [
        "Do not point a camera straight at the sun, a bright lamp or a glass door. Backlight turns people into silhouettes.",
        "Cameras with WDR (wide dynamic range) handle bright doorways much better.",
        "Behind glass, infrared night vision reflects back. Mount outside the glass where possible."
      ]},
      { h: "Outdoor installation", list: [
        "Use weatherproof cameras and seal every outdoor connector.",
        "Leave a small downward loop in the cable so rainwater drips off before the connector.",
        "Run cables in conduit so they cannot be cut or chewed."
      ]}
    ],
    tip: "After installation, walk through the area yourself and check the live view on the recorder, both in daylight and at night."
  },
  {
    id: "cctv-storage",
    title: "How Many Days Will Your CCTV Hard Disk Record?",
    category: "CCTV",
    level: "Basic",
    updated: "2026-11-20",
    summary: "A simple formula to estimate recording days for your DVR/NVR hard disk.",
    sections: [
      { h: "The rule of thumb", p: "One camera recording continuously at 1 Mbps uses about 10.8 GB per day. So: storage per day (GB) = number of cameras x bitrate (Mbps) x 10.8." },
      { h: "Worked example", list: [
        "4 cameras at 2 Mbps each: 4 x 2 x 10.8 = about 86 GB per day.",
        "A 2 TB disk has roughly 1,800 GB usable, so it holds about 20 days of continuous recording."
      ]},
      { h: "Ways to record longer", list: [
        "Use motion-based recording where it suits the location.",
        "Use H.265 compression if your recorder and cameras support it.",
        "Lower the bitrate or resolution on less important cameras.",
        "Fit a bigger hard disk made for surveillance use."
      ]}
    ],
    tip: "Check the recorder's bitrate setting for each camera. The real number on your system gives a better answer than any estimate."
  },
  {
    id: "slow-pc-checks",
    title: "Slow PC? 7 Quick Checks Before You Call Us",
    category: "PC",
    level: "Basic",
    updated: "2026-11-20",
    summary: "Simple checks that fix many slow Windows computers without any repair.",
    sections: [
      { list: [
        "Restart the computer. A machine left on for weeks slows down.",
        "Open Task Manager (Ctrl + Shift + Esc) and see what is using the most CPU, memory or disk.",
        "Turn off unneeded programs in the Startup tab of Task Manager.",
        "Keep at least 15% of the system drive free. Delete or move big files you do not use.",
        "Install pending Windows and driver updates.",
        "Run a full scan with your antivirus and remove anything unknown.",
        "If the PC still has a mechanical hard disk, an SSD upgrade is usually the biggest speed-up. More RAM helps if memory is always full."
      ]}
    ],
    tip: "If the disk is always at 100% or you hear clicking, back up your data first and get the drive checked."
  },
  {
    id: "wifi-coverage",
    title: "Better Wi-Fi at Home or Office",
    category: "Networking",
    level: "Basic",
    updated: "2026-11-20",
    summary: "Easy changes that improve Wi-Fi coverage and speed before buying new equipment.",
    sections: [
      { h: "Router position", list: [
        "Place the router in a central, raised spot in the open, not inside a cupboard or behind a TV.",
        "Keep it away from metal, thick walls, microwave ovens and cordless phones."
      ]},
      { h: "Settings", list: [
        "Use 5 GHz for speed when you are close, and 2.4 GHz for range through walls.",
        "On 2.4 GHz, channels 1, 6 and 11 do not overlap. Pick the least crowded one.",
        "Change the default admin password and keep the router firmware updated."
      ]},
      { h: "When one router is not enough", p: "Add a second access point connected by a network cable. A cabled access point is far better than a wireless extender, which halves the speed." }
    ],
    tip: "Test speed at the spot where you actually work, not next to the router."
  },
  {
    id: "backup-321",
    title: "The 3-2-1 Backup Rule",
    category: "Data",
    level: "Basic",
    updated: "2026-11-20",
    summary: "A simple plan to make sure you never lose important files.",
    sections: [
      { h: "What it means", list: [
        "Keep 3 copies of your data: the original plus two backups.",
        "Store them on 2 different types of media, for example the computer and an external drive or NAS.",
        "Keep 1 copy off-site, such as cloud storage or a drive kept at another location."
      ]},
      { h: "Good habits", list: [
        "Automate the backup so it does not depend on memory.",
        "Test a restore now and then. A backup you have never restored is only a guess.",
        "RAID or a mirrored disk is not a backup. It does not protect against deletion, virus or fire."
      ]}
    ],
    tip: "Start with your most important folders: accounts, customer data and photos."
  },
  {
    id: "password-safety",
    title: "Account & Password Safety Basics",
    category: "Security",
    level: "Basic",
    updated: "2026-11-20",
    summary: "Practical habits that protect your email, bank and business accounts.",
    sections: [
      { list: [
        "Use long passphrases of 12 or more characters. Length matters more than symbols.",
        "Use a different password for every important account. A password manager makes this easy.",
        "Turn on 2-step verification for email, banking and social accounts.",
        "Never share an OTP with anyone, even someone claiming to be from a bank or courier.",
        "Check the address of a link before you sign in. Type the website yourself when unsure.",
        "Keep Windows, your browser and your phone updated."
      ]}
    ],
    tip: "Secure your main email account first. Password resets for every other account go through it."
  }
];
