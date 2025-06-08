# Connecting GoDaddy Domain to Vercel: Key Steps

This document summarizes the key steps involved in connecting a domain purchased from GoDaddy to a Vercel-hosted application. This process typically involves configuring DNS records in your GoDaddy account to point to your Vercel project.

## 1. Deploy Your Application on Vercel

Before connecting a custom domain, ensure your application is successfully deployed on Vercel. Vercel automatically provides a `vercel.app` URL for your deployments. If you haven't already:

*   **Sign up for a Vercel account** (if you don't have one).
*   **Connect your Git repository** (e.g., GitHub, GitLab, Bitbucket) to Vercel.
*   **Deploy your project**. Vercel will automatically build and deploy your application, providing you with a `vercel.app` domain.

## 2. Add Your Custom Domain to Your Vercel Project

Once your application is deployed on Vercel, you need to add your custom domain to the project settings:

*   **Navigate to your Vercel Dashboard** and select the project you wish to connect to your domain.
*   Go to the **Settings** tab, then select **Domains**.
*   Click the **Add Domain** button and enter your GoDaddy domain (e.g., `zr3i.com`).
*   If you add an apex domain (e.g., `example.com`), Vercel will typically prompt you to add the `www` subdomain prefix (e.g., `www.example.com`). It's recommended to include this.

## 3. Configure DNS Records in GoDaddy

After adding the domain in Vercel, you will be provided with instructions on how to configure your DNS records. Vercel usually recommends one of two methods:

### Method A: Using A Record (Recommended for Apex Domains)

This method involves adding an `A` record in your GoDaddy DNS settings that points to Vercel's IP address. Vercel will provide the specific IP address you need to use.

*   **Log in to your GoDaddy account**.
*   Navigate to your **Domain Portfolio**.
*   Find your domain (`zr3i.com`) and click on the **DNS** or **Manage DNS** option.
*   In the DNS Management page, you will typically find a table of DNS records.
*   **Edit or Add an `A` record**:
    *   **Type**: `A`
    *   **Name**: `@` (for the apex domain, `zr3i.com`)
    *   **Value**: The IP address provided by Vercel.
    *   **TTL**: (Time To Live) - You can usually leave this as default or set it to a lower value (e.g., 600 seconds) for faster propagation.
*   **Remove any conflicting `A` records** that might be pointing to other services.

### Method B: Using Nameservers (Alternative, often for Wildcard Domains)

This method involves changing your domain's nameservers in GoDaddy to Vercel's nameservers. This delegates DNS management entirely to Vercel.

*   **Log in to your GoDaddy account**.
*   Navigate to your **Domain Portfolio**.
*   Find your domain (`zr3i.com`) and click on the **DNS** or **Manage DNS** option.
*   Look for **Nameservers** settings.
*   **Change your nameservers** to the ones provided by Vercel (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
*   GoDaddy might send you an email to verify this action. Confirm the change.

**Important Note**: If you choose the Nameservers method, you will need to add any other DNS records (like `MX` records for email) directly within your Vercel project's DNS settings, as Vercel will now be managing your DNS.

## 4. Verify Domain Configuration in Vercel

After you've updated the DNS records in GoDaddy, return to your Vercel project's Domains settings. Vercel will automatically detect the changes. It may take some time for DNS changes to propagate (up to 48 hours, though often much faster).

*   Once Vercel verifies the configuration, the status of your domain in the Vercel UI will change from 

