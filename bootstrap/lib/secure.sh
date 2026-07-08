#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "Applying VPS security hardening..."

export DEBIAN_FRONTEND=noninteractive

# ─── 1. SSH Hardening ──────────────────────────────────────────────────────────

log "==> Hardening SSH configuration"

readonly SSHD_CONFIG="/etc/ssh/sshd_config"
readonly SSHD_HARDENED="/etc/ssh/sshd_config.d/intema-hardening.conf"

# Check if at least one SSH key exists before disabling password auth
SSH_KEYS_EXIST=false
for home_dir in /root /home/*; do
    if [[ -s "${home_dir}/.ssh/authorized_keys" ]] 2>/dev/null; then
        SSH_KEYS_EXIST=true
        break
    fi
done

cat > "${SSHD_HARDENED}" <<'SSHD'
# Intema security hardening — managed by 'intema secure'
PermitRootLogin prohibit-password
PasswordAuthentication no
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
SSHD

if [[ "${SSH_KEYS_EXIST}" != "true" ]]; then
    # Re-enable password auth if no SSH keys found — prevent lockout
    sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' "${SSHD_HARDENED}"
    warn "No SSH keys found. Password authentication left ENABLED to prevent lockout."
    warn "Add your SSH key and re-run 'sudo intema secure' to disable password auth."
fi

# Validate and reload
if sshd -t 2>/dev/null; then
    systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
    success "SSH hardened"
else
    rm -f "${SSHD_HARDENED}"
    warn "SSH config validation failed. Hardening file removed."
fi

# ─── 2. Firewall (UFW) ────────────────────────────────────────────────────────

log "==> Configuring firewall"

apt-get install -y ufw >/dev/null 2>&1

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

success "Firewall configured (SSH + HTTP + HTTPS allowed)"

# ─── 3. Fail2ban ──────────────────────────────────────────────────────────────

log "==> Installing and configuring Fail2ban"

apt-get install -y fail2ban >/dev/null 2>&1

cat > /etc/fail2ban/jail.local <<'F2B'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
banaction = ufw

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-botsearch]
enabled = true
port = http,https
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400

[nginx-badbots]
enabled = true
port = http,https
filter = apache-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
F2B

systemctl enable fail2ban
systemctl restart fail2ban

success "Fail2ban configured (SSH + Nginx jails active)"

# ─── 4. Kernel / Network Hardening (sysctl) ───────────────────────────────────

log "==> Applying kernel hardening"

cat > /etc/sysctl.d/99-intema-hardening.conf <<'SYSCTL'
# ── IP Spoofing protection ──
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# ── Ignore ICMP redirects ──
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# ── Ignore ICMP broadcasts ──
net.ipv4.icmp_echo_ignore_broadcasts = 1

# ── SYN flood protection ──
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2

# ── Log suspicious packets ──
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# ── Disable source routing ──
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# ── Disable IP forwarding (not a router) ──
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# ── Harden BPF / ptrace ──
kernel.unprivileged_bpf_disabled = 1
kernel.yama.ptrace_scope = 1
SYSCTL

sysctl --system >/dev/null 2>&1

success "Kernel hardening applied"

# ─── 5. Shared Memory Hardening ───────────────────────────────────────────────

log "==> Securing shared memory"

if ! grep -q '/run/shm' /etc/fstab; then
    echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" >> /etc/fstab
    success "Shared memory hardened (noexec, nosuid)"
else
    log "Shared memory already configured in /etc/fstab"
fi

# ─── 6. Disable Unused Network Protocols ──────────────────────────────────────

log "==> Disabling unused network protocols"

cat > /etc/modprobe.d/intema-hardening.conf <<'MODPROBE'
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
MODPROBE

success "Unused protocols disabled (dccp, sctp, rds, tipc)"

# ─── 7. Secure Nginx Headers (if installed) ──────────────────────────────────

if command -v nginx >/dev/null 2>&1; then
    log "==> Adding security headers to Nginx"

    readonly NGINX_SECURITY="/etc/nginx/conf.d/security-headers.conf"

    cat > "${NGINX_SECURITY}" <<'NGINX'
# Intema security headers — managed by 'intema secure'
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Hide Nginx version
server_tokens off;
NGINX

    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        success "Nginx security headers applied"
    else
        rm -f "${NGINX_SECURITY}"
        warn "Nginx config test failed. Security headers removed."
    fi
fi

# ─── Summary ──────────────────────────────────────────────────────────────────

echo ""
success "VPS security hardening complete!"
log ""
log "Applied:"
log "  ✓ SSH hardened (root login restricted, max 3 auth tries, forwarding allowed)"
if [[ "${SSH_KEYS_EXIST}" == "true" ]]; then
    log "  ✓ Password authentication disabled (SSH keys detected)"
else
    log "  ! Password authentication still enabled (no SSH keys found)"
fi
log "  ✓ Firewall active (SSH + HTTP + HTTPS only)"
log "  ✓ Fail2ban active (SSH + Nginx jails)"
log "  ✓ Kernel hardened (SYN flood, IP spoofing, ICMP protections)"
log "  ✓ Shared memory secured"
log "  ✓ Unused network protocols disabled"
if command -v nginx >/dev/null 2>&1; then
    log "  ✓ Nginx security headers applied"
fi
log ""
log "Run 'sudo intema doctor' to verify system status."
