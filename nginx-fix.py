import re
with open('/etc/nginx/sites-enabled/default') as f:
    c = f.read()
old = 'try_files $uri $uri/ =404;'
new = old + '\n\n    location /publish {\n        proxy_pass http://127.0.0.1:8088;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }'
c = c.replace(old, new)
with open('/etc/nginx/sites-enabled/default', 'w') as f:
    f.write(c)
print('nginx config updated')
