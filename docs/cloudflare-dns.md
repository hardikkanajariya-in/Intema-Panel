# Cloudflare DNS Integration

Intema Panel integrates natively with the Cloudflare API, allowing you to manage DNS Zone records (A, AAAA, CNAME, TXT, MX, NS, SRV, CAA) directly from the panel.

## Prerequisites

Before configuring the integration in your panel, you must generate a Cloudflare API Token:

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **My Profile** > **API Tokens**.
3. Click **Create Token**.
4. Choose the **Edit zone DNS** template.
5. Under **Permissions**, ensure the following permission is configured:
   - `Zone` — `DNS` — `Edit`
6. Under **Zone Resources**, select:
   - `Include` — `All zones` (or select specific domains you want to manage).
7. Click **Continue to summary** and then **Create Token**.
8. Copy the generated API Token.

---

## Configuration

To add the token to your Intema Panel:

1. Open your panel and log in as an administrator.
2. Navigate to **Settings** in the sidebar.
3. Paste your token into the **Cloudflare API Token** input field.
4. Click **Save Settings**.

Once saved, the DNS integration will be active for all domains hosted on your server that are registered on that Cloudflare account.

---

## How It Works

### Asynchronous Fetching
The panel fetches DNS records asynchronously when you open a domain's details page. This ensures fast page loading times and isolates API errors if Cloudflare's servers are temporarily unreachable.

### Apex Domain Zone Resolution
If you have a subdomain attached to a resource (e.g. `api.example.com` or `beta.dev.example.com`), the panel automatically resolves the parent zone on Cloudflare by stripping subdomain prefixes recursively. It queries Cloudflare for `beta.dev.example.com` -> `dev.example.com` -> `example.com` until it finds the active Zone ID on your account.

---

## Usage

### Viewing Records
1. Go to **Domains** in the sidebar.
2. Click on a domain to view its details.
3. Scroll down to the **Cloudflare DNS Records** section. The panel will automatically query and display all active DNS records for the zone.

### Adding Records
1. In the **Cloudflare DNS Records** section, click **Add Record**.
2. Select the record **Type** (A, AAAA, CNAME, TXT, MX, NS, SRV, CAA).
3. Enter the record **Name** (use `@` for root domain, or subdomains like `www`).
4. Enter the record **Content / Value** (e.g., your server IP for A records, or alias target for CNAME).
5. Choose the **TTL** (Auto is recommended).
6. Toggle **Proxied** if you want to route traffic through Cloudflare's CDN/DDoS protection (available for A, AAAA, and CNAME records).
7. Click **Save Record**.

### Deleting Records
1. Find the target record in the DNS table.
2. Click **Delete** in the Actions column.
3. Confirm the action. The record will be permanently deleted from Cloudflare.
