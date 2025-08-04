# Frontend-App Keycloak Theme

A custom Keycloak theme that matches the design system of your frontend-app, providing a seamless user experience across login and registration flows.

## Features

- **Design System Integration**: Matches your frontend-app's OKLCH color system, typography, and component styling
- **Responsive Design**: Mobile-first approach with proper responsive breakpoints
- **Dark Mode Support**: Automatic dark mode detection and custom dark theme variables
- **Modern UI Components**: Clean, rounded corners, proper spacing, and shadow effects
- **Accessibility**: Proper ARIA labels, focus states, and keyboard navigation
- **Custom Messaging**: Branded text and messaging that aligns with your app

## Theme Structure

```
keycloak_config/themes/frontend-app/
├── login/
│   ├── theme.properties          # Theme configuration
│   ├── template.ftl             # Base template layout
│   ├── login.ftl                # Login page template
│   ├── register.ftl             # Registration page template
│   ├── login-reset-password.ftl # Forgot password template
│   ├── messages/
│   │   └── messages_en.properties # Custom text messages
│   └── resources/
│       └── css/
│           └── styles.css       # Main theme stylesheet
```

## Installation

### Method 1: Docker Volume Mount (Recommended)

Mount the themes directory as a volume in your Docker Compose:

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    volumes:
      - ./keycloak_config/themes:/opt/keycloak/themes
    # ... other configuration
```

### Method 2: Copy to Keycloak Installation

Copy the theme folder to your Keycloak themes directory:
```bash
cp -r keycloak_config/themes/frontend-app /opt/keycloak/themes/
```

## Configuration

### 1. Enable the Theme in Keycloak Admin Console

1. Log into Keycloak Admin Console
2. Navigate to your realm settings
3. Go to the **Themes** tab
4. Set **Login Theme** to `frontend-app`
5. Save the configuration

### 2. Update Realm Settings (Optional)

For the best experience, consider updating these realm settings:

- **Login Settings**:
  - Enable "User registration"
  - Enable "Forgot password"
  - Enable "Remember me"
  - Set appropriate password policies

- **Email Settings**:
  - Configure SMTP settings for password reset emails

## Customization

### Colors and Branding

The theme uses CSS custom properties that match your frontend-app. To customize colors, edit `frontend-app/login/resources/css/styles.css`:

```css
:root {
  --primary: oklch(0.205 0 0);           /* Your brand primary color */
  --primary-foreground: oklch(0.985 0 0); /* Text on primary */
  --background: oklch(1 0 0);             /* Page background */
  --card: oklch(1 0 0);                   /* Card background */
  /* ... other variables */
}
```

### Custom Messages

Edit `frontend-app/login/messages/messages_en.properties` to customize text:

```properties
loginTitle=Welcome Back
loginSubtitle=Please sign in to your account to continue
registerTitle=Create Account
# ... other messages
```

### Adding Your Logo

1. Add your logo image to `frontend-app/login/resources/img/logo.png`
2. Update the template files to include the logo:

```html
<div id="kc-header">
    <img src="${url.resourcesPath}/img/logo.png" alt="Your App" />
    <h1>${msg("loginTitle")}</h1>
</div>
```

## Development

### Testing the Theme

1. Start your Keycloak instance with the theme mounted
2. Navigate to your application's login URL
3. You should see the new themed login page
4. Test registration, forgot password, and other flows

### Making Changes

1. Edit the CSS, templates, or messages as needed
2. Refresh your browser (no Keycloak restart needed for CSS changes)
3. For template changes, you may need to clear browser cache

## Troubleshooting

### Theme Not Loading

- Verify the theme folder structure matches the expected layout
- Check Keycloak logs for theme loading errors
- Ensure the theme is properly selected in realm settings

### Styling Issues

- Check browser developer tools for CSS loading errors
- Verify CSS custom properties are supported in your target browsers
- Test in both light and dark modes

### Template Errors

- Check Keycloak logs for FreeMarker template errors
- Ensure all required template variables are properly referenced
- Validate HTML structure and closing tags

## Browser Support

This theme supports modern browsers with CSS custom properties and OKLCH color space:

- Chrome 111+
- Firefox 113+
- Safari 15.4+
- Edge 111+

For older browsers, consider adding CSS fallbacks or using a color space polyfill.

## Contributing

When making changes to the theme:

1. Test across different browsers and devices
2. Verify both light and dark mode appearance
3. Ensure accessibility standards are maintained
4. Test all authentication flows (login, register, forgot password, etc.)

## License

This theme is part of your frontend-app project and follows the same licensing terms.
