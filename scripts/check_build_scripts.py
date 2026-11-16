with open("scripts/build_full_labor_law_245.py", "r") as f:
    labor_code = f.read()

print("build_full_labor_law_245.py has add_art:", "def add_art" in labor_code)
