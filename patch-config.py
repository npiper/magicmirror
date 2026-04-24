#!/usr/bin/env python3
path = "/Users/neilpiper/SANDBOX/neilpiper.projects/magicmirror/mounts/config/config.js"
with open(path, "r") as f:
    content = f.read()

# Fix 1: Easter date — 25 Mar 2026 -> 1 Apr 2027
old_easter = 'targetTime: "25 Mar 2026",'
new_easter = 'targetTime: "1 Apr 2027",'
if old_easter in content:
    content = content.replace(old_easter, new_easter, 1)
    print("Easter date fixed")
else:
    print("Easter: already updated or not found")

with open(path, "w") as f:
    f.write(content)

print("Done. Lines:", content.count("\n"))
