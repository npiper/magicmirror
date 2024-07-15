## Generate content of `docker-compose.yaml`

Please choose from 
<select id="selectbox" name="" onchange="javascript:location.href = this.value;">
    <option value="{{ site.baseurl }}/compose/server" {%if page.data == "server" %}selected{% endif %}>server-only</option>
    <option value="{{ site.baseurl }}/compose/rpi" {%if page.data == "rpi" %}selected{% endif %}>raspberry pi</option>
    <option value="{{ site.baseurl }}/compose/client" {%if page.data == "client" %}selected{% endif %}>client-only</option>
</select>:

<input type="radio" id="server" name="cbxType" value="server"><label for="server">server-only</label>
<input type="radio" id="rpi" name="cbxType" value="rpi"><label for="rpi">raspberry pi</label>
<input type="radio" id="client" name="cbxType" value="client"><label for="client">client-only</label>


```yaml
{% include_relative compose/{{ page.data }}.yaml %}
```

<!-- 
<script type="text/javascript" src="/assets/js/post_oeffnungszeiten.js"></script>


to choose:
- rpi
- server
- client
options:
- imageTag
- initContainer
- privileged
- network_mode or port
- ip and port for client
- mmpm
 -->