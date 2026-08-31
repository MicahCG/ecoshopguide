# Vercel Deployment Guide - Bambana

## 🚀 Quick Deploy to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. Your repository pushed to GitHub

---

## Step 1: Push to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel will auto-detect the settings

---

## Step 3: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

### **Required Environment Variables:**

```
# Database (Required)
DATABASE_URL=postgresql://postgres:isTA68QTsJbazkFB3PuY@db.oqaijevrypgendmuembu.supabase.co:5432/postgres

# Server Configuration
PORT=3000
NODE_ENV=production

# Stripe Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Shopify Integration
SHOPIFY_SHOP_NAME=your_shopify_shop_name
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token_here
```

**How to add them in Vercel:**
1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select all environments (Production, Preview, Development)
5. Click **Save**

---

## Step 4: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** Other (or None)
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist/client`
- **Install Command:** `npm install`

---

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your site will be live at: `https://your-project-name.vercel.app`

---

## Step 6: Configure Custom Domain (Optional)

### Add shopbambana.com to Vercel:

1. Go to your project **Settings** → **Domains**
2. Add domain: `shopbambana.com`
3. Add domain: `www.shopbambana.com` (will redirect to non-www)
4. Vercel will provide DNS instructions

### Update DNS Records:

Add these records in your domain registrar (e.g., GoDaddy, Namecheap):

**For shopbambana.com:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.shopbambana.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

DNS propagation takes 24-48 hours, but often works within a few hours.

---

## Step 7: Update Stripe Webhook URL

Once deployed, update your Stripe webhook:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click on your existing webhook endpoint
3. Update the endpoint URL to: `https://shopbambana.com/api/webhook`
4. Or add a new endpoint if needed
5. Ensure it's listening to: `checkout.session.completed`

---

## Step 8: Test Your Deployment

### Test these key features:

1. ✅ **Homepage loads** - Visit your Vercel URL
2. ✅ **Products display** - Check collection pages
3. ✅ **Reviews show** - Verify review carousel works
4. ✅ **Product details** - Click on a product
5. ✅ **Add to cart** - Add items to cart
6. ✅ **Checkout** - Click "Buy Now" (use Stripe test mode if desired)
7. ✅ **Stripe redirect** - Ensure Stripe Checkout loads
8. ✅ **Purchase completion** - Complete a test transaction

---

## Troubleshooting

### Build Fails

**Issue:** Build fails during deployment

**Solution:**
1. Check Vercel build logs for errors
2. Ensure all dependencies are in `package.json`
3. Run `npm run vercel-build` locally to test
4. Check that TypeScript compiles: `npm run check`

### API Routes Not Working

**Issue:** `/api/*` endpoints return 404

**Solution:**
1. Verify `api/index.ts` exists
2. Check Vercel dashboard → Functions tab
3. Ensure environment variables are set
4. Check function logs in Vercel dashboard

### Database Connection Fails

**Issue:** "Database connection error" in logs

**Solution:**
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Check Supabase database is accessible
3. Ensure database allows connections from Vercel IPs
4. Test connection string locally first

### Stripe Webhooks Not Working

**Issue:** Orders not created after successful payment

**Solution:**
1. Check Stripe webhook URL is correct: `https://yourdomain.com/api/webhook`
2. Verify `STRIPE_WEBHOOK_SECRET` matches in both Stripe and Vercel
3. Check Vercel function logs for webhook errors
4. Test webhook in Stripe Dashboard → Webhooks → Send test webhook

### Environment Variables Not Loading

**Issue:** App behaves as if env vars are missing

**Solution:**
1. Re-deploy after adding environment variables
2. Ensure variables are added to all environments (Production, Preview, Development)
3. Check for typos in variable names
4. Variables should not have quotes around values

---

## Post-Deployment Checklist

- [ ] Site is live and accessible
- [ ] All pages load correctly
- [ ] Product catalog displays
- [ ] Reviews show on homepage
- [ ] Cart functionality works
- [ ] Checkout redirects to Stripe
- [ ] Stripe webhook is configured
- [ ] Test purchase completes successfully
- [ ] Google Analytics tracking works (check with `?ga_debug=1`)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (https://)
- [ ] Shopify integration working (orders sync)

---

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel will automatically deploy!
```

---

## Performance Monitoring

Monitor your deployed site:

1. **Vercel Analytics**
   - Go to your project → Analytics tab
   - View page views, unique visitors, top pages

2. **Function Logs**
   - Go to your project → Functions tab
   - View API request logs and errors

3. **Google Analytics**
   - Check [analytics.google.com](https://analytics.google.com)
   - View real-time traffic and conversions

---

## Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)

---

## What Happens During Deployment

1. **Build Phase:**
   - Vercel runs `npm install`
   - Runs `npm run vercel-build` (builds React frontend with Vite)
   - Outputs static files to `dist/client`

2. **Function Phase:**
   - Vercel creates serverless function from `api/index.ts`
   - All `/api/*` requests route to this function
   - Express app runs on-demand (cold starts ~100-300ms)

3. **Deployment:**
   - Static files served from Vercel CDN (fast global delivery)
   - API routes run as serverless functions
   - Automatic HTTPS/SSL
   - Global CDN for fast loading

---

## Cost Estimate

**Vercel Free Tier includes:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Serverless Functions: 100 GB-hours/month

Your traffic should easily fit within the free tier. If you exceed limits, Vercel Pro is $20/month.

---

Good luck with your deployment! 🚀
