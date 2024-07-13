## Generate content of `docker-compose.yaml`

Please choose from 
<select id="selectbox" name="" onchange="javascript:location.href = this.value;">
    <option value="{{ site.baseurl }}/compose/server" {%if page.data == "server" %}selected{% endif %}>server-only</option>
    <option value="{{ site.baseurl }}/compose/rpi" {%if page.data == "rpi" %}selected{% endif %}>raspberry pi</option>
    <option value="{{ site.baseurl }}/compose/client" {%if page.data == "client" %}selected{% endif %}>client-only</option>
</select>:

```yaml
{% include_relative compose/{{ page.data }}.yaml %}
```
