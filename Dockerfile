FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

RUN npm install\
    && npm install typescript

COPY . .

RUN chmod +x ./docker-node.sh

RUN mkdir -p ./credentials
ARG GOOGLE_BASE64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAic21hcnQtY3JtLTQyNjkxNiIsCiAgInByaXZhdGVfa2V5X2lkIjogIjgxZThjMWYwZjJiMWVjN2YzY2UyY2NlZmE0ZTI2YWEyZjM1MzMwZWQiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQzdXYkZvcnVPQTY5QXpcbnJRUG41TDRybUZ0amlYZytJbUxoK2pHSzN3Qm9tdHg2N0NJYUZ3T3Fpd0RXOXVQQVBkR3NXVkM2eWJmaklPWkJcbk15b0tLZXRWYVJSdzQ5b1Z5T1hVL24xK0Jsam1QWnhMNmtrckFjUlMwQXhJWlF3WnNUb0FsMWNWTkxJLzhyZ2hcbmY0ZHZqbmV2RlIrcHpIU0FJeGpmUUovb0t1azdKMHZOSzUxbHJLZG85KzloaWxXaERkM1lnckg4eFFGNWVyT1NcbnF1aWkrbHlEbU85WUthT09xbTZEUUQ1aTRXTlVLdlpCOExZbkxLdUNqMlpNQitOUkZ6MHVJZ2hWSm0zUDVpVzBcblBwa3F1Z0JtdFVTQmNhVjJGY01UUjhpenB1MzlBaWkwaEl4L1lIZlB5bHJEY0ptM0ZtSEQ4VGN6WTZzc0ZWZ1hcblUwdmdTTUM5QWdNQkFBRUNnZ0VBRGlKRlNZMzViaXVjSUpjNnRsOE1pbWZBbHBaSTR0QjA5WjBLbEJ6MXdCa3FcbndxcVhlZ1lSZEpJWnIvTkpSRTFhODVoN1hYN0QvTmUvRElmVkhKWXVyRm9KNTVNR1RBMXZhcTJycWFYRjhDZG1cbnZWZ1ducTdQOFByRUZSN0JGbkVjaDBNNDdSOGdIQnREWm96alJVMjhzV2N6dW50enNJcGY5bnUreWVUdTJuNUtcbmpDN2F4V1N0b2I3S1RpQzR5dkZ5VVpPdzV1NjBNZW1nMGQ5Tjc2NkNzL3VRMXFMWkt6NEZCWmFtMzJuTERBL25cbndQSFY0d2JZeEJMMTNQVVpyMzVobk1BbVVmdkRkaHZGZi8wcmFEV29xQnFScHAxVXM4TlQ1OUgva1gzYlFOVXlcbkVHLzB2SlQ1aStvZXhlb2wvRnFQdXEzVE9PWWQwTGtDdFlZM3FwSDlDd0tCZ1FEaFZVZ1VUeXE4NHlCVXlwNHdcbnh1ZElqQko2NlJxajE4WHBGUWtwY21vY2NyNy9zajlzOC9mUmVNUWlBckJxcEd5dnpxTERCSUpxWWM0SmtSK1NcbnR1QVlRdnRlQmhQZDc1NFZqR2hTVEppemsvVE92QXUySCtESFJrdkNzSGhJTyt6ZmRDdmplcnFHdjRCbHN4VFlcbko1TmN2UlBDMDdVTjg4WFpIeXowT0lmWkx3S0JnUURVMlJLcUp4aXM5bWRFdW5EZE8vL0ZRS3E3OVlyWDd6RmJcbmRnWEt6bFdacEhjMFVraVFNWEN0Y0w4U0dDcjUwTnVkK05HTmdJQTlEdyswdEp3VTBkSmNjWjlvaVBrendyMFZcbnQ0ZXNuanQ5VVRNZ2ZkVkNSWnhLSkYrdlhMWHArSWdYcEJaYm5jNUhZak8xZGhKMTZaeXVHSlp2OFpuendoNWFcbmRzS0hzdjF4MHdLQmdRRE51bW9ydUxnQmFyRHJHVzdpZzhkSU1qTHhLd0JhbExjcC9qMjJMTEw2dER6MEFRN3RcbmI3VlQ5NW5DbjRmb1phU2h3dHhSaHoxMjJVTWU4dlBMcE5IbTlNakJhSFVkRFJmYy9xdUVjRkIrckZnM28vSmhcblhxdC81UXRvZm12akwyc3QvTWZSVWcwWTE2RG51V0FQbGRweU1tTG5YeGtQMndCSklyQ05iVXVDbXdLQmdHQkhcbmxPN000cGVTbWlIM3FBZ2JGTlpZS3lMOHJnS0JXelZCRE51eE8vMVU3T3NJOFhQd09VVHJSRExlSmNwOUZHcS9cbjI2S0RadjYzcW1ZV2NLZm1SWjYxY3VNcFduaDBkVzIyYURQSUc2YlRMU3BjWVRRcUlzbFM3TWw1U1h4OWhLb1Vcbitsd1U1UE5iVTRLWTF6N3BIb3VONmJiWGRjbFNuTUpWQ0NlejZuc3JBb0dCQUlPQWFpZFI3cUpYbkh2c3ZtanlcbjJ2bkNRU2laV1FWcGhZekt4ZTF5MzZuNTdXRDMwbE45M3hXcmtjR0lrcENLOHJTTHhaL0djMGV1alJ3YjYxZXdcbldibVlCcnhoL01kdTBCRVBuRXdKSTcxK0N2alBwZHE0WEdBTFc2YmY0b2tpNnk0Qi9SNm9RV1h0ZGpWbkM0RE1cbkxCa2FZVGRtYWo1YVdwWEo5dzFMQUtqeVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogInNtYXJ0LWNybUBzbWFydC1jcm0tNDI2OTE2LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjExNjg0NjY3MTkwOTI1Mzg1NjE4OSIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvc21hcnQtY3JtJTQwc21hcnQtY3JtLTQyNjkxNi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQo=
RUN echo $GOOGLE_BASE64 | base64 -d > ./credentials/smart-crm-426916-81e8c1f0f2b1.json

RUN npm run build

CMD ["npm","start"]