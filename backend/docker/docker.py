import subprocess

def start():
    subprocess.run(["docker", "compose", "up", "-d", "--build"])

def stop():
    subprocess.run(["docker", "compose", "down"])