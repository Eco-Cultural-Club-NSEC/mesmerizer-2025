### ENVs

```bash
# Server Configuration

- **PORT**: `8000`
- **NODE_ENV**: `development`
- **BACKEND_URL**: `http://localhost:8000`

# JWT Configuration

- **JWT_SECRET**: `your_jwt_secret_key_here`
- **JWT_LIFETIME**: `1d`

# Database Configuration

- **DATABASE_URL**: `your_database_url_here`

# Google OAuth Configuration

- **GOOGLE_OAUTH_URL**: `https://accounts.google.com/o/oauth2/v2/auth`
- **GOOGLE_CLIENT_ID**: `your_google_client_id_here`
- **GOOGLE_CLIENT_SECRET**: `your_google_client_secret_here`
- **GOOGLE_ACCESS_TOKEN_URL**: `https://oauth2.googleapis.com/token`
- **GOOGLE_USER_INFO_URL**: `https://www.googleapis.com/oauth2/v3/userinfo`

# Frontend URLs

- **REGISTRATION_FRONTEND_URL**: `your_registration_frontend_url_here`
- **ADMIN_DASHBOARD_URL**: `http://localhost:5173`

# CORS Configuration

- **ALLOWED_ORIGINS**: `http://localhost:5174,http://localhost:5173`

# Email Configuration

- **SMTP_HOST**: `smtp.gmail.com`
- **SMTP_PORT**: `587`
- **SMTP_USER**: `youremail@gmail.com`
- **SMTP_PASS**: `your_smtp_password_here`
- **EMAIL_FROM**: `Mesmerizer NSEC <youremail@gmail.com>`
- **SKIP_EMAIL_VERIFICATION**: `true`

# For Production (uncomment when deploying)


# BACKEND_URL=https://api.yourdomain.com
# REGISTRATION_FRONTEND_URL=https://register.yourdomain.com
# ADMIN_DASHBOARD_URL=https://admin.yourdomain.com
# ALLOWED_ORIGINS=https://register.yourdomain.com,https://admin.yourdomain.com
