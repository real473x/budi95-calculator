# How to Add Ads to Your Website

Azure hosts your website, but it does not provide the advertisements. To show ads and earn money, you typically use an **Ad Network** like **Google AdSense**.

## Step 1: Sign up for Google AdSense
1.  Go to [Google AdSense](https://www.google.com/adsense/start/).
2.  Sign up with your Google account.
3.  Enter your website URL (once you have your Azure URL, e.g., `https://budi95-calculator.azurestaticapps.net`).

## Step 2: Get the Ad Placement Code
Once your account is approved (this can take a few days):
1.  Go to the **Ads** tab in AdSense.
2.  Click **"Get Code"**.
3.  Copy the script provided. It looks like this:
    ```html
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
     crossorigin="anonymous"></script>
    ```

## Step 3: Add the Code to Your Website
You need to paste that code into your `index.html` file inside the `<head>` section.

### Example:
Open `index.html` and add the script:
```html
<head>
  ...
  <!-- GOOGLE ADSENSE CODE -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
  ...
</head>
```

## Step 4: Ad Units (Optional but Recommended)
You can also create specific "Ad Units" to place ads in specific spots (like below the calculator).
1.  In AdSense, create a "Display Ad Unit".
2.  Copy the code.
3.  Paste it where you want the ad to appear in `index.html` (e.g., inside a `<div class="ad-container">`).

## Step 5: Ads.txt
Google might ask you to add an `ads.txt` file to your root directory.
1.  Create a file named `public/ads.txt`.
2.  Paste the line provided by Google (e.g., `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`).
3.  When you deploy, this will be accessible at `your-site.com/ads.txt`.
