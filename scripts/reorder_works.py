"""Reorder works section: PC/UE5 flagship projects before mobile casual."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "index.html"
content = path.read_text(encoding="utf-8")

mobile_start = content.index("            <!-- Mobile UI Category -->")
pc_start = content.index("            <!-- PC / Game UI Category -->")
smart_start = content.index("            <!-- NEW SECTION: UX/UI Applications -->")

mobile_block = content[mobile_start:pc_start]
pc_block = content[pc_start:smart_start]

# Updated works header
old_header = """                <h2 class="text-[10px] tracking-[0.4em] uppercase opacity-50 mb-6 font-bold font-doto">// LATEST PROJECTS</h2>
                <h3 class="text-5xl md:text-7xl font-doto font-bold tracking-tighter uppercase"><span class="text-accent">Interfaces That</span> <br><span class="font-doto italic font-normal normal-case">Drive Gameplay</span></h3>"""

new_header = """                <h2 class="text-[10px] tracking-[0.4em] uppercase opacity-50 mb-6 font-bold font-doto">// FLAGSHIP WORK</h2>
                <h3 class="text-5xl md:text-7xl font-doto font-bold tracking-tighter uppercase"><span class="text-accent">UE5 UI Systems</span> <br><span class="font-doto italic font-normal normal-case">Built for Shipped Gameplay</span></h3>
                <p class="mt-6 text-sm md:text-base font-medium opacity-70 max-w-2xl">Technical UI design and in-engine implementation for PC titles — modular UMG frameworks, diegetic interfaces, and production-ready HUDs.</p>"""

content = content.replace(old_header, new_header)

# Reassemble: everything before mobile + pc + mobile (relabeled) + rest
before = content[:mobile_start]
after = content[smart_start:]

mobile_block = mobile_block.replace(
    "[ Mobile UI — Live-Service & Casual Systems ]",
    "[ Additional Work — Mobile & Casual UI ]",
)

content = before + pc_block + mobile_block + after
path.write_text(content, encoding="utf-8")
print("Reordered works: PC first, mobile demoted")
