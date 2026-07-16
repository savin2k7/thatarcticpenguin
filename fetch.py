import urllib.request

try:
    with urllib.request.urlopen('http://127.0.0.1:1024/garden/') as f:
        html = f.read().decode('utf-8')
    with open('test_garden.html', 'w', encoding='utf-8') as out:
        out.write(html)
    print("Saved garden HTML")
except Exception as e:
    print("Error:", e)
