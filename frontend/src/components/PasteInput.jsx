import React, { useState } from 'react';

/**
 * PasteInput Component
 * 
 * Provides a text area for users to paste raw customer reviews
 * and a button to trigger the analysis.
 */
const PasteInput = ({ onAnalyze, isLoading }) => {
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const trimmedText = reviewText.trim();
    
    if (!trimmedText) {
      setError('Please paste some reviews to analyze');
      return;
    }

    if (trimmedText.length < 10) {
      setError('Review text is too short. Please paste at least 10 characters.');
      return;
    }

    if (trimmedText.length > 50000) {
      setError('Review text is too long. Maximum 50,000 characters allowed.');
      return;
    }

    // Call the parent's analyze function
    onAnalyze(trimmedText);
  };

  const handleClear = () => {
    setReviewText('');
    setError('');
  };

  const exampleReviews = `⭐⭐⭐⭐⭐ Sarah M. - January 15, 2024
These sandals are absolutely perfect! Super comfortable right out of the box. I wore them all day at a wedding and my feet didn't hurt at all. The arch support is excellent and they look great with both casual and dressy outfits. Worth every penny!

⭐⭐ Mike R. - January 12, 2024
Disappointed with the quality. The strap broke after just two weeks of normal wear. For the price, I expected much better durability. The leather feels cheap and started peeling almost immediately. Would not recommend.

⭐⭐⭐⭐⭐ Jennifer L. - January 10, 2024
Love these! Ordered my usual size and they fit perfectly. The color is exactly as shown in the pictures. Very comfortable for walking and the cushioning is great. Already planning to buy another pair in a different color.

⭐⭐⭐ David K. - January 8, 2024
They're okay. Comfortable enough but nothing special. The sizing runs a bit large - I probably should have ordered a half size down. The style is nice but the material feels a bit stiff. Might get better with time.

⭐ Amanda T. - January 5, 2024
Terrible experience. The sandals arrived with a manufacturing defect - one strap was sewn crooked. Customer service was unhelpful and refused to send a replacement. Very frustrating for such an expensive purchase.

⭐⭐⭐⭐⭐ Robert P. - January 3, 2024
Best sandals I've ever owned! I have wide feet and these fit perfectly. No break-in period needed. The quality is outstanding and they look even better in person. Highly recommend for anyone with foot problems.

⭐⭐⭐⭐ Lisa H. - December 28, 2023
Really nice sandals overall. Comfortable and stylish. Only complaint is that they squeak a bit when walking on certain surfaces. Also wish they came in more color options. But for the price, I'm happy with my purchase.

⭐⭐ James W. - December 25, 2023
Size runs way too small! I ordered my normal size and couldn't even get my foot in. Had to return and reorder a size up. The return process took forever. When I finally got the right size, they were comfortable but the hassle wasn't worth it.

⭐⭐⭐⭐⭐ Maria G. - December 20, 2023
Absolutely love them! I was hesitant because of mixed reviews but I'm so glad I took the chance. They're incredibly comfortable, true to size, and the quality is excellent. The footbed molds to your feet perfectly. Best purchase this year!

⭐⭐⭐ Kevin S. - December 18, 2023
Decent sandals but overpriced in my opinion. They're comfortable and look nice, but I've had similar quality for half the price elsewhere. The shipping was fast though, and they arrived well-packaged.

⭐⭐⭐⭐ Rachel B. - December 15, 2023
Very comfortable and cute! I wear them almost every day. The only issue is that the color faded a bit after a few weeks in the sun. Still look good though. Would buy again but maybe in a darker color.

⭐ Thomas C. - December 12, 2023
Complete waste of money. The sole separated from the upper after just one week. I've never had shoes fall apart so quickly. Quality control is clearly lacking. Save your money and buy from a different brand.

⭐⭐⭐⭐⭐ Emily D. - December 10, 2023
These are amazing! I have plantar fasciitis and these sandals provide the perfect support. I can walk for hours without any pain. The arch support is incredible. Every person with foot issues should try these!

⭐⭐⭐⭐ Daniel M. - December 8, 2023
Good quality sandals. Comfortable and well-made. The leather is soft and the stitching looks solid. My only complaint is that they took a while to break in - about a week of wearing them around the house first.

⭐⭐ Nicole F. - December 5, 2023
Not impressed. The straps are too tight and caused blisters on my first wear. Even after trying to stretch them out, they're still uncomfortable. The design is nice but functionality is poor. Returning them.

⭐⭐⭐⭐⭐ Christopher L. - December 1, 2023
Excellent sandals! I bought these for a beach vacation and they were perfect. Comfortable for long walks, dried quickly after getting wet, and looked great with everything. The grip on the sole is fantastic too.

⭐⭐⭐ Melissa A. - November 28, 2023
They're fine. Nothing to write home about. Comfortable enough for everyday wear but not as supportive as I hoped. The style is nice and they seem durable so far. For the price, I expected a bit more.

⭐⭐⭐⭐ Brandon T. - November 25, 2023
Really happy with these! Great value for money. They're comfortable, stylish, and seem well-made. I've been wearing them for a month now and they still look brand new. Would definitely recommend to friends.

⭐ Jessica R. - November 22, 2023
Horrible quality. The footbed started crumbling after just two days of wear. I've never seen such poor craftsmanship. Customer service was rude when I tried to get a refund. Avoid this product at all costs.

⭐⭐⭐⭐⭐ Andrew H. - November 20, 2023
Perfect fit and super comfortable! I have high arches and these provide excellent support. The cushioning is soft but supportive. I've walked miles in these with zero discomfort. Best sandals I've ever owned!

⭐⭐⭐⭐ Samantha K. - November 18, 2023
Very nice sandals. Comfortable and attractive. The leather quality is good and they seem durable. Only downside is they're a bit heavy compared to other sandals I own. But overall, very satisfied with the purchase.

⭐⭐⭐ William P. - November 15, 2023
Average sandals. They do the job but nothing exceptional. Comfortable for short periods but my feet get tired after wearing them all day. The price point is reasonable though. Might look for something better next time.

⭐⭐⭐⭐⭐ Laura S. - November 12, 2023
Obsessed with these sandals! They're so comfortable and versatile. I can wear them to work, running errands, or out to dinner. The quality is outstanding and they've held up perfectly after months of daily wear. 10/10!

⭐⭐ Eric M. - November 10, 2023
Disappointed. The description said genuine leather but these feel like synthetic material. They're also not as comfortable as advertised. The arch support is minimal. For this price, I expected much better quality.

⭐⭐⭐⭐ Michelle W. - November 8, 2023
Great sandals for the price! Very comfortable and true to size. I've been wearing them for a few weeks and they're holding up well. The style is classic and goes with everything. Happy with my purchase!

⭐⭐⭐⭐⭐ Ryan J. - November 5, 2023
These are fantastic! I was skeptical because of some negative reviews but I'm so glad I bought them. Perfect fit, excellent quality, and incredibly comfortable. The customer service was also great when I had a question. Highly recommend!

⭐⭐⭐ Patricia N. - November 1, 2023
They're okay for the price. Comfortable enough but not the best quality. The straps feel a bit flimsy and I'm worried about durability. Time will tell. They look nice though and are comfortable for now.

⭐⭐⭐⭐ Steven B. - October 28, 2023
Really good sandals! Comfortable, well-made, and stylish. I've gotten lots of compliments. The only reason I'm not giving 5 stars is because they took about a week to fully break in. But now they're perfect!

⭐⭐⭐⭐⭐ Karen D. - October 25, 2023
Best sandals ever! I have bunions and these are the only sandals that don't hurt my feet. The wide toe box is perfect and the support is amazing. I've already recommended them to all my friends. Worth every cent!

⭐⭐ Mark L. - October 22, 2023
Not worth the money. They're uncomfortable and the sizing is off. I ordered my usual size and they were way too tight. The return shipping cost almost as much as the sandals. Very disappointed with this purchase.`;

  const handleLoadExample = () => {
    setReviewText(exampleReviews);
    setError('');
  };

  const charCount = reviewText.length;
  const charLimit = 50000;
  const charPercentage = (charCount / charLimit) * 100;

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            🔍 Paste Your Reviews
          </h2>
          <button
            type="button"
            onClick={handleLoadExample}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            disabled={isLoading}
          >
            Load Example
          </button>
        </div>
        <p className="text-gray-600">
          Copy and paste customer reviews from anywhere — WhatsApp, Amazon, social media, 
          or any other source. No formatting required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Paste your customer reviews here...

Example:
'Great product! Fast shipping.'
'The item arrived damaged.'
'Love it! Will buy again.'"
            className="textarea min-h-[300px] font-mono text-sm"
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-sm ${charCount > charLimit ? 'text-danger-600' : 'text-gray-500'}`}>
              {charCount.toLocaleString()} / {charLimit.toLocaleString()} characters
            </span>
            {charCount > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                Clear
              </button>
            )}
          </div>

          {/* Character count bar */}
          {charCount > 0 && (
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  charPercentage > 90 ? 'bg-danger-500' : 
                  charPercentage > 70 ? 'bg-warning-500' : 
                  'bg-primary-500'
                }`}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-800">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
          disabled={isLoading || charCount === 0}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing Reviews...
            </span>
          ) : (
            '🚀 Analyze Reviews'
          )}
        </button>

        {/* Info box */}
        <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-primary-600 flex-shrink-0">💡</span>
            <p className="text-sm text-primary-800">
              <strong>Tip:</strong> The more reviews you provide, the more accurate the analysis. 
              Aim for at least 10-20 reviews for best results.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasteInput;

// Made with Bob
