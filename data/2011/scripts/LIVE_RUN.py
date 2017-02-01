import subprocess

subprocess.call("all-constituencies-create-info-json.py", shell=True)
subprocess.call("all-counts-create-json.py", shell=True)
subprocess.call("all-counts-find-elected.py", shell=True)
subprocess.call("d3-find-elected.py", shell=True)
subprocess.call("all-counts-party-transfers.py", shell=True)
