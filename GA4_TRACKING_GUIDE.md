# Google Analytics 4 Tracking Guide
**Bambana - Complete Implementation**

## 📊 Your GA4 Measurement ID
`G-JWZKR16JFE`

---

## 🎯 Complete Event Tracking List

### **Navigation & Page Views**
| Event | Description | Auto-tracked? |
|-------|-------------|---------------|
| `page_view` | All page navigation | ✅ Yes |
| `collection_view` | Collection page views | ✅ Yes |

### **Product Discovery Journey**
| Event | GA4 Standard | Custom Event | When It Fires | Key Parameters |
|-------|--------------|--------------|---------------|----------------|
| Product appears on screen | - | `product_impression` | When product card enters viewport | `product_id`, `product_name`, `collection_name`, `price` |
| Product clicked | `select_item` | `product_click` | Click on product card | `product_id`, `product_name`, `collection_name`, `price` |
| Product detail viewed | `view_item` | `product_view` | Product detail page loads | `product_id`, `product_name`, `category`, `price`, `variant_id` |

### **Purchase Journey - Single Product**
| Event | GA4 Standard | Custom Event | When It Fires | Key Parameters |
|-------|--------------|--------------|---------------|----------------|
| Buy Now clicked | `begin_checkout` | `buy_click` | "Buy Now" button clicked | `product_id`, `product_name`, `price`, `variant_id` |
| Redirect to Stripe | - | `checkout_redirect` | Before navigating to Stripe | `session_id`, `product_id`, `price` |
| Purchase completed | `purchase` | `checkout_success` | Checkout success page | `transaction_id`, `value`, `currency`, `items[]` |
| Checkout canceled | - | `checkout_cancel` | User returns from Stripe without paying | `session_id` |

### **Purchase Journey - Cart**
| Event | GA4 Standard | Custom Event | When It Fires | Key Parameters |
|-------|--------------|--------------|---------------|----------------|
| Add to cart | `add_to_cart` | `add_to_cart` | Product added to cart | `product_id`, `product_name`, `price`, `items[]` |
| Remove from cart | `remove_from_cart` | `remove_from_cart` | Product removed from cart | `product_id`, `product_name`, `price` |
| Cart opened | - | `cart_view` | Cart slide-over opened | `cart_value`, `items_count` |
| Checkout started | `begin_checkout` | `cart_checkout_start` | Checkout button clicked in cart | `cart_value`, `items_count`, `has_bundle` |

### **Bundle Tracking**
| Event | Custom Event | When It Fires | Key Parameters |
|-------|--------------|---------------|----------------|
| Bundle section viewed | `bundle_section_view` | Bundle section enters viewport | `collection_slug` |
| Bundle card visible | `bundle_impression` | Bundle card enters viewport | `bundle_id`, `collection_slug` |
| Bundle added to cart | `bundle_add_to_cart` | Bundle "Add to Cart" clicked | `bundle_id`, `bundle_value` |
| Bundle buy now | `bundle_buy_now_click` | Bundle "Buy Bundle" clicked | `bundle_id`, `bundle_value` |

### **Attribution Tracking** (Auto-attached to all events)
| Parameter | Description | Source |
|-----------|-------------|--------|
| `click_id` | Unique user session ID | Generated per session |
| `utm_source` | Marketing source | URL parameter |
| `utm_medium` | Marketing medium | URL parameter |
| `utm_campaign` | Campaign name | URL parameter |
| `utm_content` | Ad content | URL parameter |
| `utm_term` | Search terms | URL parameter |
| `page_path` | Current page path | Auto-tracked |
| `referrer` | Referring website | Auto-tracked |

---

## 🔍 How to View Events in GA4

### 1. **Real-Time Reports**
1. Go to GA4: [https://analytics.google.com](https://analytics.google.com)
2. Select your property (G-JWZKR16JFE)
3. Click **Reports** → **Realtime**
4. You'll see:
   - Event count by name
   - Event details
   - Users by country/city
   - Pages viewed

### 2. **Events Report**
1. Go to **Reports** → **Engagement** → **Events**
2. You'll see all events with counts
3. Click any event to see parameters
4. Events you'll see:
   - Standard: `page_view`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
   - Custom: `product_impression`, `product_click`, `product_view`, `buy_click`, `checkout_redirect`, `bundle_*`, `cart_*`

### 3. **Ecommerce Purchase Report**
1. Go to **Reports** → **Monetization** → **Ecommerce purchases**
2. See revenue, transactions, average order value
3. View product performance

### 4. **User Journey (Path Exploration)**
1. Go to **Explore** → Create new exploration
2. Select **Path exploration** template
3. Set starting point (e.g., `product_view`)
4. See the paths users take through your site

### 5. **Funnel Exploration**
1. Go to **Explore** → Create new exploration
2. Select **Funnel exploration** template
3. Build your funnel:
   - Step 1: `product_view`
   - Step 2: `buy_click` OR `add_to_cart`
   - Step 3: `begin_checkout`
   - Step 4: `checkout_redirect`
   - Step 5: `purchase`
4. See drop-off rates at each step

---

## 🧪 Testing Your Tracking

### **Debug Mode** (Recommended)
1. Add `?ga_debug=1` to any URL
   - Example: `https://your-site.com?ga_debug=1`
2. You'll see:
   - A debug widget in bottom-right corner showing last 10 events
   - Console logs for every event: `[GA4] event_name { params }`
3. Open browser console and type: `window.ecoDumpEvents()`
   - This shows a table of the last 20 events

### **Manual Testing Flow**
1. **Homepage → Product Click**
   - Expected events: `page_view`, `product_impression`, `product_click`, `select_item`

2. **Product Detail View**
   - Expected events: `page_view`, `product_view`, `view_item`

3. **Add to Cart**
   - Expected events: `add_to_cart` (both custom and GA4 standard)

4. **Cart → Checkout**
   - Expected events: `cart_view`, `cart_checkout_start`, `begin_checkout`

5. **Complete Purchase**
   - Expected events: `checkout_redirect`, (Stripe checkout), `checkout_success`, `purchase`

### **GA4 DebugView** (Alternative)
1. Install [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Enable the extension
3. Go to GA4 → **Admin** → **DebugView**
4. Browse your site - events appear in real-time

---

## 📈 Key Metrics to Monitor in GA4

### **Purchase Funnel**
Create a funnel report to track:
1. Product Views (`view_item`) → 100%
2. Add to Cart (`add_to_cart`) → ?%
3. Checkout Started (`begin_checkout`) → ?%
4. Purchase (`purchase`) → ?%

**Goal**: Identify where users drop off and optimize those steps.

### **Product Performance**
1. Go to **Monetization** → **Ecommerce purchases**
2. View by `item_name` dimension
3. See:
   - Which products drive most revenue
   - Which products have highest conversion rate
   - Average order value per product

### **Attribution Analysis**
1. Go to **Reports** → **Acquisition** → **Traffic acquisition**
2. See revenue by source/medium
3. Track UTM campaign performance
4. Identify which channels drive best ROI

### **Bundle Performance**
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for events starting with `bundle_`
3. Compare: `bundle_impression` → `bundle_buy_now_click` conversion rate
4. Track revenue from bundle purchases

---

## 🎨 Custom Event Labels in GA4

All custom events follow this naming pattern for clarity:

### **Product Events**
- `product_impression` - Product card appeared
- `product_click` - Product card clicked
- `product_view` - Product detail viewed
- `buy_click` - Buy Now button clicked

### **Cart Events**
- `cart_view` - Cart opened
- `cart_checkout_start` - Checkout from cart started
- `add_to_cart` - Item added
- `remove_from_cart` - Item removed

### **Bundle Events**
- `bundle_section_view` - Bundle section viewed
- `bundle_impression` - Bundle card viewed
- `bundle_add_to_cart` - Bundle added to cart
- `bundle_buy_now_click` - Bundle direct purchase

### **Checkout Events**
- `checkout_redirect` - Redirecting to Stripe
- `checkout_success` - Purchase confirmed
- `checkout_cancel` - User canceled
- `checkout_success_unpaid` - Success page but payment pending

---

## 🚀 Advanced: Custom Reports

### **1. Product Impression → Purchase Report**
Track the complete journey from seeing a product to buying it.

**Custom Exploration Setup:**
1. Exploration → User Lifetime
2. Dimensions: `product_id`, `product_name`
3. Metrics:
   - Count of `product_impression`
   - Count of `product_click`
   - Count of `buy_click`
   - Count of `purchase`
4. Calculate conversion rates

### **2. UTM Campaign Performance**
See which campaigns drive purchases.

**Setup:**
1. Exploration → Free Form
2. Dimensions: `utm_campaign`, `utm_source`, `utm_medium`
3. Metrics: Sessions, `purchase` event count, Revenue
4. Filter by date range

### **3. Bundle vs Single Purchase**
Compare bundle purchases to single items.

**Setup:**
1. Reports → Events
2. Create comparison:
   - Events containing "bundle"
   - vs events containing "buy_click"
3. View transaction value and count

---

## 🔔 Recommended Alerts

Set up alerts in GA4 for:
1. **Zero purchases in last 24 hours** - Indicates checkout issues
2. **High checkout_cancel rate** - Payment or UX issues
3. **Drop in product_impression events** - Site loading issues
4. **Spike in page_view but no product clicks** - Discovery issues

---

## 💡 Tips for Success

1. **Check Real-Time daily** - Ensure events are firing correctly
2. **Review weekly** - Look at top products, conversion rates, drop-offs
3. **Test with ?ga_debug=1** - Before launching campaigns
4. **Use UTM parameters** - For all marketing campaigns
5. **Monitor mobile vs desktop** - Different user behaviors
6. **Track seasonal trends** - Identify peak times

---

## 🛠 Troubleshooting

### **Events not appearing in GA4?**
1. Check if gtag is loaded: Open console, type `window.gtag`
2. Verify Measurement ID in HTML: `G-JWZKR16JFE`
3. Use `?ga_debug=1` to see if events fire locally
4. Check GA4 DebugView for real-time validation

### **Purchase events missing?**
1. Verify Stripe webhook is configured
2. Check server logs for webhook events
3. Ensure session_id is passed correctly
4. Test full purchase flow in staging

### **Attribution data missing?**
1. UTM parameters must be in URL when user first arrives
2. Check sessionStorage in browser dev tools
3. Verify UTM keys are preserved across navigation

---

## 📚 Additional Resources

- [GA4 Ecommerce Events Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GA4 Reports Overview](https://support.google.com/analytics/answer/9212670)

---

**Questions?** Open browser console and run `window.ecoDumpEvents()` to see recent tracking events.
